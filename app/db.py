import os
import sqlite3
from datetime import datetime, timezone

from app import settings


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


SQLITE_PATH = os.environ.get(
    "DATABASE_PATH",
    os.path.join(os.path.dirname(__file__), "..", "data", "hello-capsule.db"),
)


def _detect_kind() -> str:
    url = settings.DATABASE_URL
    if url.startswith("postgres://") or url.startswith("postgresql://"):
        return "postgres"
    return "sqlite"


def _detect_url_label() -> str:
    url = settings.DATABASE_URL
    if url:
        parsed = url.split("@")[-1] if "@" in url else url
        return parsed
    return "data/hello-capsule.db"


class DatabaseAdapter:
    def init_db(self): raise NotImplementedError
    def list_notes(self) -> list[dict]: raise NotImplementedError
    def create_note(self, body: str) -> dict: raise NotImplementedError
    def count_notes(self) -> int: raise NotImplementedError
    def reset(self): raise NotImplementedError
    def get_kind(self) -> str: raise NotImplementedError
    def get_url_label(self) -> str: raise NotImplementedError


class SQLiteAdapter(DatabaseAdapter):
    def _conn(self):
        os.makedirs(os.path.dirname(SQLITE_PATH), exist_ok=True)
        c = sqlite3.connect(SQLITE_PATH)
        c.row_factory = sqlite3.Row
        return c

    def init_db(self):
        c = self._conn()
        c.executescript("""
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
        c.commit()
        c.close()

    def list_notes(self) -> list[dict]:
        c = self._conn()
        rows = c.execute("SELECT * FROM notes ORDER BY id DESC").fetchall()
        c.close()
        return [dict(r) for r in rows]

    def create_note(self, body: str) -> dict:
        c = self._conn()
        ts = _now_iso()
        cur = c.execute(
            "INSERT INTO notes (body, created_at) VALUES (?, ?)",
            (body, ts),
        )
        c.commit()
        row = c.execute("SELECT * FROM notes WHERE id = ?", (cur.lastrowid,)).fetchone()
        c.close()
        return dict(row)

    def count_notes(self) -> int:
        c = self._conn()
        (count,) = c.execute("SELECT COUNT(*) FROM notes").fetchone()
        c.close()
        return count

    def reset(self):
        self.init_db()
        c = self._conn()
        c.execute("DELETE FROM notes")
        c.execute("DELETE FROM guide_events")
        c.commit()
        c.close()

    def get_kind(self) -> str:
        return "sqlite"

    def get_url_label(self) -> str:
        return _detect_url_label()


class PostgresAdapter(DatabaseAdapter):
    def _conn(self):
        import psycopg2
        return psycopg2.connect(settings.DATABASE_URL)

    def init_db(self):
        c = self._conn()
        c.execute("""
            CREATE TABLE IF NOT EXISTS notes (
                id SERIAL PRIMARY KEY,
                body TEXT NOT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        """)
        c.execute("""
            CREATE TABLE IF NOT EXISTS guide_events (
                id SERIAL PRIMARY KEY,
                event_type TEXT NOT NULL,
                payload_json TEXT,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        """)
        c.commit()
        c.close()

    def list_notes(self) -> list[dict]:
        c = self._conn()
        cur = c.execute("SELECT id, body, created_at::text FROM notes ORDER BY id DESC")
        rows = [{"id": r[0], "body": r[1], "created_at": r[2]} for r in cur.fetchall()]
        c.close()
        return rows

    def create_note(self, body: str) -> dict:
        c = self._conn()
        cur = c.execute(
            "INSERT INTO notes (body, created_at) VALUES (%s, NOW()) RETURNING id, body, created_at::text",
            (body,),
        )
        c.commit()
        r = cur.fetchone()
        c.close()
        return {"id": r[0], "body": r[1], "created_at": r[2]}

    def count_notes(self) -> int:
        c = self._conn()
        cur = c.execute("SELECT COUNT(*) FROM notes")
        (count,) = cur.fetchone()
        c.close()
        return count

    def reset(self):
        self.init_db()
        c = self._conn()
        c.execute("DELETE FROM notes")
        c.execute("DELETE FROM guide_events")
        c.commit()
        c.close()

    def get_kind(self) -> str:
        return "postgres"

    def get_url_label(self) -> str:
        return _detect_url_label()


_adapter: DatabaseAdapter | None = None


def _get_adapter() -> DatabaseAdapter:
    global _adapter
    if _adapter is None:
        kind = _detect_kind()
        if kind == "postgres":
            _adapter = PostgresAdapter()
        else:
            _adapter = SQLiteAdapter()
    return _adapter


def init_db():
    _get_adapter().init_db()


def list_notes() -> list[dict]:
    return _get_adapter().list_notes()


def create_note(body: str) -> dict:
    return _get_adapter().create_note(body)


def count_notes() -> int:
    return _get_adapter().count_notes()


def reset():
    _get_adapter().reset()


def get_kind() -> str:
    return _get_adapter().get_kind()


def get_url_label() -> str:
    return _get_adapter().get_url_label()
