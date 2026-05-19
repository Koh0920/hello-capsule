import json
import urllib.request
import urllib.error

from app import settings


KEYWORD_RESPONSES = [
    (["ato", "run"], "Ato can run this project directly from source using the capsule.toml run plan."),
    (["backend", "fastapi", "python"], "This capsule starts a Python FastAPI backend and serves the frontend from the same process."),
    (["database", "sqlite", "note"], "Notes are stored in SQLite by default, so state survives page reloads."),
    (["ai", "local", "api"], "This demo currently uses built-in responses. Later it can connect to local AI or an OpenAI-compatible API."),
    (["capsule", "share"], "A capsule describes how to build and run a project so others can launch it with one command."),
    (["frontend", "react", "vite"], "The frontend is built with Vite, React, and Tailwind CSS. Ato builds it automatically from the capsule.toml build plan."),
    (["robot", "guide", "cap"], "I'm Cap, your Capsule Guide! I show you how Ato works, step by step."),
]


def demo_reply(message: str) -> str:
    msg_lower = message.lower()
    for keywords, response in KEYWORD_RESPONSES:
        if any(kw in msg_lower for kw in keywords):
            return response
    return "This capsule runs a Python backend, serves a React frontend, and stores state in SQLite. Try asking about Ato, the backend, database, or AI!"


def _ollama_chat(message: str) -> str:
    url = f"{settings.OLLAMA_BASE_URL}/api/chat"
    data = json.dumps({
        "model": settings.OLLAMA_MODEL,
        "messages": [{"role": "user", "content": message}],
        "stream": False,
    }).encode()
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as res:
        body = json.loads(res.read())
        return body["message"]["content"]


def _openai_chat(message: str) -> str:
    base = settings.OPENAI_BASE_URL or "https://api.openai.com"
    base = base.rstrip("/")
    url = f"{base}/v1/chat/completions"
    data = json.dumps({
        "model": settings.OPENAI_MODEL,
        "messages": [{"role": "user", "content": message}],
    }).encode()
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
    }
    req = urllib.request.Request(url, data=data, headers=headers)
    with urllib.request.urlopen(req, timeout=30) as res:
        body = json.loads(res.read())
        return body["choices"][0]["message"]["content"]


def reply(message: str, mode: str) -> str:
    if mode == "local":
        return _ollama_chat(message)
    if mode == "api":
        return _openai_chat(message)
    return demo_reply(message)


def check_ollama_reachable() -> bool:
    try:
        url = f"{settings.OLLAMA_BASE_URL}/api/tags"
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=3):
            return True
    except Exception:
        return False


def get_available_modes() -> list[dict]:
    modes = [
        {"id": "demo", "label": "Demo", "available": True, "description": "Built-in responses, no network needed"},
        {"id": "local", "label": "Local (Ollama)", "available": check_ollama_reachable(),
         "description": f"Ollama @ {settings.OLLAMA_BASE_URL}, model: {settings.OLLAMA_MODEL}"},
        {"id": "api", "label": "API (OpenAI)", "available": bool(settings.OPENAI_API_KEY),
         "description": f"OpenAI-compatible, model: {settings.OPENAI_MODEL}"},
    ]
    return modes


def detect_default_mode() -> str:
    if settings.OPENAI_API_KEY:
        return "api"
    if check_ollama_reachable():
        return "local"
    return "demo"
