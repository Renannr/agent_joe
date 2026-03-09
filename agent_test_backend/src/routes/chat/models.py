from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None


class ContinueRequest(BaseModel):
    session_id: str
    field_values: dict[str, str]