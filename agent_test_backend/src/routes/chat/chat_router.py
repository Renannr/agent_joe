import json
from fastapi import HTTPException, APIRouter
from fastapi.responses import StreamingResponse
from agno.agent import RunEvent

from src.agents.agent_joe import get_joe
from src.routes.chat.models import ChatRequest, ContinueRequest

chat_router = APIRouter()

agent = get_joe()

paused_state: dict = {
    "run_id": None,
    "session_id": None,
    "requirements": None,
}


async def stream_run_events(run_generator):
    in_think = False

    async for event in run_generator:
        if event.event == RunEvent.run_content:
            chunk = event.content or ""

            if "<think>" in chunk:
                in_think = True
                chunk = chunk.replace("<think>", "")

            if "</think>" in chunk:
                in_think = False
                parts = chunk.split("</think>")
                chunk = parts[-1].lstrip("\n")

            if not chunk.strip():
                continue

            event_type = "thinking" if in_think else "response"
            yield "data: " + json.dumps({"type": event_type, "content": chunk}) + "\n\n"

        elif event.event == RunEvent.tool_call_started:
            tool = event.tool
            if tool.tool_name != "get_user_input":
                yield "data: " + json.dumps({
                    "type": "tool_call",
                    "tool_name": tool.tool_name,
                    "arguments": tool.tool_args,
                }) + "\n\n"

        elif event.event == RunEvent.reasoning_step:
            content_str = str(event.content) if event.content else ""
            yield "data: " + json.dumps({"type": "thinking", "content": content_str}) + "\n\n"

        elif event.event == RunEvent.run_paused:
            paused_state["run_id"] = event.run_id
            paused_state["session_id"] = event.session_id
            paused_state["requirements"] = event.requirements

            fields = []
            for req in (event.requirements or []):
                if req.user_input_schema:
                    for field in req.user_input_schema:
                        fields.append({
                            "field_name": field.name,
                            "field_description": field.description or field.name,
                            "field_type": str(field.field_type.__name__) if field.field_type else "str",
                        })
                    break

            yield "data: " + json.dumps({"type": "user_input", "fields": fields}) + "\n\n"
            return


@chat_router.post("/chat")
async def chat(req: ChatRequest) -> StreamingResponse:
    async def event_generator():
        async for chunk in stream_run_events(
            agent.arun(
                req.message,
                session_id=req.session_id,
                stream=True,
                stream_events=True,
                debug_mode=True,
            )
        ):
            yield chunk

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@chat_router.post("/chat/continue")
async def chat_continue(req: ContinueRequest) -> StreamingResponse:
    if not paused_state["requirements"]:
        raise HTTPException(status_code=400, detail="No paused run to continue")

    requirements = paused_state["requirements"]
    for req_item in requirements:
        if req_item.user_input_schema:
            for field in req_item.user_input_schema:
                if field.name in req.field_values:
                    field.value = req.field_values[field.name]

    run_id = paused_state["run_id"]
    session_id = paused_state["session_id"]

    paused_state["run_id"] = None
    paused_state["session_id"] = None
    paused_state["requirements"] = None

    async def event_generator():
        async for chunk in stream_run_events(
            agent.acontinue_run(
                run_id=run_id,
                requirements=requirements,
                session_id=session_id,
                stream=True,
                stream_events=True,
                debug_mode=True,
            )
        ):
            yield chunk

    return StreamingResponse(event_generator(), media_type="text/event-stream")