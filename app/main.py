import os
from datetime import datetime, timezone
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import app.ai as ai
import app.db as db
import app.runtime as runtime
from app.models import ChatRequest, NoteCreate

app = FastAPI(title="hello-capsule", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health():
    return {
        "status": "ok",
        "service": "hello-capsule",
        "time": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
    }


@app.get("/api/runtime")
async def get_runtime():
    return runtime.get_runtime_info()


@app.get("/api/database")
async def get_database():
    return {
        "kind": "sqlite",
        "url_label": "data/hello-capsule.db",
        "notes_count": db.count_notes(),
        "postgres_enabled": False,
    }


@app.get("/api/notes")
async def list_notes():
    return db.list_notes()


@app.post("/api/notes", status_code=201)
async def create_note(body: NoteCreate):
    return db.create_note(body.body)


@app.post("/api/chat")
async def chat(body: ChatRequest):
    reply = ai.demo_reply(body.message)
    return {
        "mode": "demo",
        "reply": reply,
        "provider": "demo",
    }


@app.post("/api/reset", status_code=204)
async def reset():
    db.init_db()
    conn = db.get_db()
    conn.execute("DELETE FROM notes")
    conn.execute("DELETE FROM guide_events")
    conn.commit()
    conn.close()



DIST_DIR = Path(__file__).resolve().parent.parent / "dist"


@app.on_event("startup")
async def startup():
    db.init_db()
    if not DIST_DIR.is_dir():
        print(f"[capsule-guide] WARNING: dist/ not found at {DIST_DIR}")
        print("[capsule-guide] The frontend UI will not be available.")
    else:
        app.mount(
            "/", StaticFiles(directory=str(DIST_DIR), html=True), name="static"
        )
