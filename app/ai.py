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
