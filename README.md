# Hello Capsule — Capsule Guide

A tiny guided app that shows what a capsule can do.

An interactive robot walks you through: running from source, Python backend, React frontend, SQLite database, and AI chat.

## Quick Start (Ato)

```bash
# ato 0.5.x requires explicit permission flags
CAPSULE_ALLOW_UNSAFE=1 ato run -U .
```

The capsule provisions Python + Node, builds the frontend, and starts a FastAPI server on port 8000.

## Quick Start (GitHub source)

```bash
CAPSULE_ALLOW_UNSAFE=1 ato run -y -U github.com/Koh0920/hello-capsule
```

## Local Development

```bash
# Terminal 1 — backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

# Terminal 2 — frontend dev server
npm install
npm run dev
```

The Vite dev server proxies `/api/*` to the backend.

## Project Structure

```
hello-capsule/
├── capsule.toml          # Ato manifest
├── requirements.txt      # Python dependencies
├── package.json          # Node/React dependencies
├── vite.config.ts        # Vite config with API proxy
├── app/                  # FastAPI backend
│   ├── main.py           # App entry, static serve, self-heal build
│   ├── ai.py             # Demo / Ollama / OpenAI providers
│   ├── db.py             # SQLite (default) / Postgres adapter
│   ├── models.py         # Pydantic request models
│   ├── runtime.py        # Runtime info helper
│   └── settings.py       # Environment config
├── src/                  # React frontend
│   ├── App.tsx           # Scene machine + state
│   ├── guide/            # Scenes + state machine
│   ├── robot/            # SVG robot + Rive adapter
│   ├── components/       # UI components
│   └── api/              # API client + types
├── data/                 # SQLite database (runtime)
└── docs/
    └── SPEC.md           # Full specification
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/runtime` | Python version, platform, uptime |
| GET | `/api/database` | DB kind, URL label, notes count |
| GET | `/api/notes` | List saved notes |
| POST | `/api/notes` | Create a note |
| GET | `/api/ai/modes` | Available AI modes + default |
| POST | `/api/chat` | Chat with AI |
| POST | `/api/reset` | Reset all state |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | (SQLite) | `postgres://` or `postgresql://` for Postgres |
| `OPENAI_API_KEY` | — | Enables OpenAI-compatible AI mode |
| `OPENAI_BASE_URL` | `https://api.openai.com` | Custom OpenAI-compatible endpoint |
| `OPENAI_MODEL` | `gpt-4o-mini` | Model name for API mode |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama endpoint |
| `OLLAMA_MODEL` | `llama3.2` | Model name for local mode |

## Tech Stack

- **Frontend**: Vite + React 18 + TypeScript + Tailwind CSS v4 + Framer Motion
- **Backend**: Python 3.11 + FastAPI + Uvicorn
- **Database**: SQLite (default) / Postgres (optional via `DATABASE_URL`)
- **AI**: Built-in demo responses / Ollama / OpenAI-compatible API
- **Robot**: SVG (default) / Rive (optional `.riv` file)
