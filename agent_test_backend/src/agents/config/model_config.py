import os
from dotenv import load_dotenv
from agno.models.openai import OpenAIChat
from agno.models.lmstudio import LMStudio

load_dotenv()

openai_api_key = os.getenv("OPENAI_API_KEY")
openai_model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
lmstudio_base_url = os.getenv("LMSTUDIO_BASE_URL")
lmstudio_model = os.getenv("LMSTUDIO_MODEL")

if openai_api_key:
    model = OpenAIChat(id=openai_model, api_key=openai_api_key)
else:
    model = LMStudio(
        id=lmstudio_model,
        base_url=lmstudio_base_url,
        reasoning_effort="medium",
        retries=1,
    )


def get_model() -> OpenAIChat | LMStudio:
    return model