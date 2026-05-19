import shutil
import subprocess
from datetime import datetime, timezone
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
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
        "kind": db.get_kind(),
        "url_label": db.get_url_label(),
        "notes_count": db.count_notes(),
        "postgres_enabled": db.get_kind() == "postgres",
    }


@app.get("/api/notes")
async def list_notes():
    return db.list_notes()


@app.post("/api/notes", status_code=201)
async def create_note(body: NoteCreate):
    return db.create_note(body.body)


@app.get("/api/ai/modes")
async def ai_modes():
    return {
        "modes": ai.get_available_modes(),
        "default": ai.detect_default_mode(),
    }


@app.post("/api/chat")
async def chat(body: ChatRequest):
    if not body.message.strip():
        raise HTTPException(status_code=422, detail="message must not be empty")
    mode = body.mode or "demo"
    try:
        reply = ai.reply(body.message, mode)
        return {
            "mode": mode,
            "reply": reply,
            "provider": mode,
        }
    except Exception as e:
        return {
            "mode": mode,
            "reply": f"AI provider error: {str(e)[:200]}. Falling back to demo.",
            "provider": "demo",
        }


@app.post("/api/reset", status_code=204)
async def reset():
    db.reset()


DIST_DIR = Path(__file__).resolve().parent.parent / "dist"
PROJECT_ROOT = Path(__file__).resolve().parent.parent

FALLBACK_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Capsule Guide — Frontend Not Built</title>
<style>
  body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f8f9fa;color:#333}
  .card{background:#fff;border-radius:12px;padding:2rem;max-width:520px;box-shadow:0 2px 8px rgba(0,0,0,.1)}
  h1{margin-top:0;font-size:1.3rem}
  code{background:#e9ecef;padding:2px 6px;border-radius:4px;font-size:.9em}
  pre{background:#1e1e1e;color:#d4d4d4;padding:1rem;border-radius:8px;overflow-x:auto}
</style>
</head>
<body>
<div class="card">
  <h1>Frontend not built yet</h1>
  <p>The Capsule Guide frontend could not be built automatically.
     This usually means <code>node</code> and <code>npm</code> are not available in the runtime environment.</p>
  <p>To build manually, run:</p>
  <pre>npm install && npm run build</pre>
  <p>Then restart the capsule or reload this page.</p>
</div>
</body>
</html>
"""


class _FallbackApp:
    def __init__(self, html: str):
        self.body = html.encode("utf-8")

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            await send({"type": "http.response.start", "status": 200, "headers": [[b"content-type", b"text/html; charset=utf-8"]]})
            await send({"type": "http.response.body", "body": self.body})


def _try_self_heal_build():
    if DIST_DIR.is_dir():
        return True
    print("[capsule-guide] dist/ not found — attempting self-heal build…")
    npm = shutil.which("npm")
    if not npm:
        print("[capsule-guide] npm not found in PATH — skipping self-heal.")
        return False
    root = str(PROJECT_ROOT)
    try:
        subprocess.run([npm, "install"], cwd=root, check=True, capture_output=True, text=True, timeout=120)
        subprocess.run([npm, "run", "build"], cwd=root, check=True, capture_output=True, text=True, timeout=120)
        print("[capsule-guide] Self-heal build succeeded.")
        return DIST_DIR.is_dir()
    except (subprocess.CalledProcessError, FileNotFoundError, subprocess.TimeoutExpired) as exc:
        print(f"[capsule-guide] Self-heal build failed: {exc}")
        return False


@app.on_event("startup")
async def startup():
    db.init_db()
    built = _try_self_heal_build()
    if built:
        app.mount("/", StaticFiles(directory=str(DIST_DIR), html=True), name="static")
    else:
        print("[capsule-guide] Serving fallback page at / — frontend not available.")
        app.mount("/", _FallbackApp(FALLBACK_HTML), name="fallback")
