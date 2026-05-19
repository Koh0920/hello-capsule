from pydantic import BaseModel


class NoteCreate(BaseModel):
    body: str
