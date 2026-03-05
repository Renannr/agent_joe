import os
import json
from src.agents.agent_joe import get_joe
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


from agno.agent import RunEvent
from agno.models.openai import OpenAIChat
from agno.models.lmstudio import LMStudio

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Seleção de modelo ----------
openai_api_key = os.getenv("OPENAI_API_KEY")
openai_model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

lmstudio_base_url = os.getenv("LMSTUDIO_BASE_URL")
lmstudio_model = os.getenv("LMSTUDIO_MODEL")

if openai_api_key:
    model = OpenAIChat(
        id=openai_model,
        api_key=openai_api_key,
    )
else:
    model = LMStudio(
        id=lmstudio_model,
        base_url=lmstudio_base_url,
    )

agent = get_joe(model)

class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None


@app.post("/chat")
async def chat(req: ChatRequest):
    async def event_generator():
        in_think = False

        async for event in agent.arun(req.message, session_id=req.session_id, stream=True, stream_events=True):
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
                yield (
                    "data: "
                    + json.dumps({"type": event_type, "content": chunk})
                    + "\n\n"
                )

            elif event.event == RunEvent.tool_call_started:
                yield (
                    "data: "
                    + json.dumps({
                        "type": "tool_call",
                        "tool_name": event.tool.tool_name,
                        "arguments": event.tool.tool_args,
                    })
                    + "\n\n"
                )
            elif event.event == RunEvent.reasoning_step:
                yield (
                    "data: "
                    + json.dumps({
                        "type": "thinking",
                        "content": event.content,
                    })
                    + "\n\n"
                )

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
    )