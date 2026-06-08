from typing import List

from pydantic import BaseModel


class HelloStep(BaseModel):
    id: str
    at: str
    delta_ms: int
    label: str


class RuntimeInfo(BaseModel):
    python: str
    platform: str
    arch: str
    server: str
    port: int
    uptime_seconds: int


class DatabaseInfo(BaseModel):
    kind: str
    url_label: str
    hello_count: int


class HelloResponse(BaseModel):
    message: str
    run_id: str
    started_at: str
    finished_at: str
    duration_ms: int
    steps: List[HelloStep]
    runtime: RuntimeInfo
    database: DatabaseInfo


class HelloHistoryItem(BaseModel):
    id: int
    run_id: str
    created_at: str
