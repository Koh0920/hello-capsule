# Hello Capsule

A tiny showcase capsule that says hello in a very complicated way.

It runs a React frontend, a Python FastAPI backend, and a SQLite database
just to produce one very over-engineered hello.

## Quick Start (Ato)

```bash
CAPSULE_ALLOW_UNSAFE=1 ato run -U .
```

The capsule provisions Python + Node, builds the frontend, and starts a
FastAPI server on port 8000.

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
│   ├── hello.py          # Hello Engine (generates trace + steps)
│   ├── db.py             # SQLite hello_events store
│   ├── models.py         # Pydantic response schemas
│   ├── runtime.py        # Runtime info helper
│   └── settings.py       # Environment config
├── src/                  # React frontend
│   ├── App.tsx           # Single-screen HelloMachine
│   ├── robot/            # SVG robot avatar
│   ├── components/       # UI components (DataFlowDiagram, TraceTimeline, …)
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
| GET | `/api/database` | DB kind, URL label, hello count |
| POST | `/api/hello` | Generate one over-engineered hello |
| GET | `/api/hello/history` | Recent hello events |
| POST | `/api/reset` | Clear hello history |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | (SQLite) | SQLite or Postgres connection string |

## Tech Stack

- **Frontend**: Vite + React 18 + TypeScript + Tailwind CSS v4 + Framer Motion
- **Backend**: Python 3.11 + FastAPI + Uvicorn
- **Database**: SQLite (default; Postgres supported via `DATABASE_URL`)
- **Robot**: SVG
