import os
import sqlite3
from datetime import datetime, timezone
from typing import List


SQLITE_PATH = os.environ.get(
    "DATABASE_PATH",
    os.path.join(os.path.dirname(__file__), "..", "data", "hello.db"),
)


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def _conn():
    os.makedirs(os.path.dirname(SQLITE_PATH), exist_ok=True)
    c = sqlite3.connect(SQLITE_PATH)
    c.row_factory = sqlite3.Row
    return c


def init_db() -> None:
    c = _conn()
    c.execute("DROP TABLE IF EXISTS notes")
    c.execute("DROP TABLE IF EXISTS guide_events")
    c.executescript("""
        CREATE TABLE IF NOT EXISTS hello_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            run_id TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        );
    """)
    c.commit()
    c.close()


def record_hello(run_id: str) -> int:
    c = _conn()
    ts = _now_iso()
    c.execute(
        "INSERT INTO hello_events (run_id, created_at) VALUES (?, ?)",
        (run_id, ts),
    )
    c.commit()
    (count,) = c.execute("SELECT COUNT(*) FROM hello_events").fetchone()
    c.close()
    return count


def count_hellos() -> int:
    c = _conn()
    (count,) = c.execute("SELECT COUNT(*) FROM hello_events").fetchone()
    c.close()
    return count


def list_hellos(limit: int = 20) -> List[dict]:
    c = _conn()
    rows = c.execute(
        "SELECT id, run_id, created_at FROM hello_events ORDER BY id DESC LIMIT ?",
        (limit,),
    ).fetchall()
    c.close()
    return [dict(r) for r in rows]


def reset_hellos() -> None:
    c = _conn()
    c.execute("DELETE FROM hello_events")
    c.commit()
    c.close()


def get_url_label() -> str:
    url = os.environ.get("DATABASE_URL", "")
    if url:
        return url.split("@")[-1] if "@" in url else url
    return "data/hello.db"
