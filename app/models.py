from pydantic import BaseModel


class NoteCreate(BaseModel):
    body: str


class ChatRequest(BaseModel):
    message: str
    mode: str = "demo"
