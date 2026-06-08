import time
import uuid
from datetime import datetime, timezone

from app import db, runtime
from app.models import (
    DatabaseInfo,
    HelloResponse,
    HelloStep,
    RuntimeInfo,
)


MESSAGE = "Hello from an over-engineered app."


def _now_iso(t: float) -> str:
    return (
        datetime.fromtimestamp(t, tz=timezone.utc)
        .isoformat(timespec="milliseconds")
        .replace("+00:00", "Z")
    )


def generate_hello() -> HelloResponse:
    t_start = time.time()
    started_at = _now_iso(t_start)

    steps: list[HelloStep] = []

    def step(step_id: str, label: str) -> HelloStep:
        t = time.time()
        delta_ms = int(round((t - t_start) * 1000))
        s = HelloStep(
            id=step_id,
            at=_now_iso(t),
            delta_ms=delta_ms,
            label=label,
        )
        steps.append(s)
        return s

    step("request_received", "Server received request")

    rt = runtime.get_runtime_info()
    step("runtime_read", "Read runtime info")

    run_id = uuid.uuid4().hex[:12]
    t_before_db = time.time()
    hello_count = db.record_hello(run_id)
    t_after_db = time.time()

    write_step = HelloStep(
        id="db_write",
        at=_now_iso(t_before_db),
        delta_ms=int(round((t_before_db - t_start) * 1000)),
        label="Wrote event to SQLite",
    )
    count_step = HelloStep(
        id="db_count_read",
        at=_now_iso(t_after_db),
        delta_ms=int(round((t_after_db - t_start) * 1000)),
        label="Read event count",
    )
    steps.extend([write_step, count_step])

    step("response_ready", "Response assembled")

    t_end = time.time()
    finished_at = _now_iso(t_end)
    duration_ms = int(round((t_end - t_start) * 1000))

    return HelloResponse(
        message=MESSAGE,
        run_id=run_id,
        started_at=started_at,
        finished_at=finished_at,
        duration_ms=duration_ms,
        steps=steps,
        runtime=RuntimeInfo(**rt),
        database=DatabaseInfo(
            kind="sqlite",
            url_label=db.get_url_label(),
            hello_count=hello_count,
        ),
    )


def get_database_info() -> DatabaseInfo:
    return DatabaseInfo(
        kind="sqlite",
        url_label=db.get_url_label(),
        hello_count=db.count_hellos(),
    )


def list_history(limit: int = 20) -> list[dict]:
    return db.list_hellos(limit=limit)
