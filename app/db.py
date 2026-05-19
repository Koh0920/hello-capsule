import os
import sqlite3

DB_PATH = os.environ.get(
    "DATABASE_PATH",
    os.path.join(os.path.dirname(__file__), "..", "data", "hello-capsule.db"),
)


def get_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            body TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS guide_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_type TEXT NOT NULL,
            payload_json TEXT,
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        );
    """)
    conn.commit()
    conn.close()


def list_notes() -> list[dict]:
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM notes ORDER BY id DESC"
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def create_note(body: str) -> dict:
    conn = get_db()
    cur = conn.execute(
        "INSERT INTO notes (body, created_at) VALUES (?, datetime('now'))",
        (body,),
    )
    conn.commit()
    row = conn.execute(
        "SELECT * FROM notes WHERE id = ?", (cur.lastrowid,)
    ).fetchone()
    conn.close()
    return dict(row)


def count_notes() -> int:
    conn = get_db()
    (count,) = conn.execute("SELECT COUNT(*) FROM notes").fetchone()
    conn.close()
    return count
