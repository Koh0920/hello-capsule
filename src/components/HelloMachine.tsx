import { useCallback, useEffect, useRef, useState } from "react";
import {
  getDatabase,
  getHelloHistory,
  getRuntime,
  resetState,
  sayHello,
} from "../api/client";
import type {
  DatabaseResponse,
  HelloHistoryItem,
  HelloResponse,
  RuntimeResponse,
} from "../api/types";
import { AppShell } from "./AppShell";
import { BackgroundStage } from "./BackgroundStage";
import { DatabaseCard } from "./DatabaseCard";
import { DataFlowDiagram, type FlowPhase } from "./DataFlowDiagram";
import { HeaderStatus } from "./HeaderStatus";
import { HelloHistory } from "./HelloHistory";
import { ResetButton } from "./ResetButton";
import { RobotStage } from "./RobotStage";
import { RuntimeCard } from "./RuntimeCard";
import { TraceTimeline, rowsFromResponse } from "./TraceTimeline";

const PHASE_DURATIONS: Record<FlowPhase, number> = {
  idle: 0,
  client_send: 220,
  server_recv: 60,
  runtime_read: 200,
  db_write: 200,
  db_count: 200,
  server_send: 220,
  client_recv: 80,
  done: 0,
};

const PHASE_ORDER: FlowPhase[] = [
  "client_send",
  "server_recv",
  "runtime_read",
  "db_write",
  "db_count",
  "server_send",
  "client_recv",
  "done",
];

const HISTORY_LIMIT = 8;

export function HelloMachine() {
  const [runtime, setRuntime] = useState<RuntimeResponse | null>(null);
  const [database, setDatabase] = useState<DatabaseResponse | null>(null);
  const [history, setHistory] = useState<HelloHistoryItem[]>([]);
  const [phase, setPhase] = useState<FlowPhase>("idle");
  const [traceRows, setTraceRows] = useState<
    ReturnType<typeof rowsFromResponse>["rows"]
  >([]);
  const [clientMessage, setClientMessage] = useState<string | null>(null);
  const [roundTripMs, setRoundTripMs] = useState<number | null>(null);
  const [serverMs, setServerMs] = useState<number | null>(null);
  const [runId, setRunId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const runCounter = useRef(0);

  const refreshMeta = useCallback(async () => {
    const [rt, db, hist] = await Promise.all([
      getRuntime(),
      getDatabase(),
      getHelloHistory(HISTORY_LIMIT),
    ]);
    setRuntime(rt);
    setDatabase(db);
    setHistory(hist);
  }, []);

  useEffect(() => {
    refreshMeta().catch(() => {
      /* meta will refresh on next click */
    });
  }, [refreshMeta]);

  const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

  const onSayHello = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setClientMessage(null);
    setTraceRows([]);
    setRoundTripMs(null);
    setServerMs(null);

    const myRun = ++runCounter.current;
    const t0 = performance.now();

    const fetchPromise = sayHello();

    setPhase("client_send");
    await sleep(PHASE_DURATIONS.client_send);

    let res: HelloResponse;
    try {
      res = await fetchPromise;
    } catch {
      if (myRun === runCounter.current) {
        setPhase("idle");
        setIsRunning(false);
      }
      return;
    }

    const t1 = performance.now();
    if (myRun !== runCounter.current) return;

    const { rows, roundTripMs, serverMs } = rowsFromResponse(t0, t1, res.steps);
    setTraceRows(rows);
    setRoundTripMs(roundTripMs);
    setServerMs(serverMs);
    setRunId(res.run_id);
    setDatabase(res.database);

    for (const nextPhase of PHASE_ORDER.slice(1)) {
      setPhase(nextPhase);
      if (nextPhase === "client_recv") {
        setClientMessage(res.message);
      }
      await sleep(PHASE_DURATIONS[nextPhase]);
      if (myRun !== runCounter.current) return;
    }

    try {
      const hist = await getHelloHistory(HISTORY_LIMIT);
      if (myRun === runCounter.current) setHistory(hist);
    } catch {
      /* ignore */
    }

    if (myRun === runCounter.current) {
      setIsRunning(false);
    }
  }, [isRunning]);

  const onReset = useCallback(async () => {
    await resetState();
    setClientMessage(null);
    setTraceRows([]);
    setRoundTripMs(null);
    setServerMs(null);
    setRunId(null);
    setPhase("idle");
    await refreshMeta();
  }, [refreshMeta]);

  const robotMood =
    phase === "idle" ? "idle" : phase === "done" ? "delivered" : "running";

  return (
    <>
      <BackgroundStage />
      <AppShell
        header={
          <HeaderStatus
            dbKind={database?.kind ?? "—"}
            helloCount={database?.hello_count ?? 0}
            uptimeSeconds={runtime?.uptime_seconds ?? 0}
          />
        }
        center={<RobotStage mood={robotMood} message={clientMessage ?? undefined} />}
        diagram={
          <div className="flex w-full flex-col items-center gap-4">
            <DataFlowDiagram
              phase={phase}
              clientMessage={clientMessage}
              runId={runId}
              roundTripMs={roundTripMs}
              serverMs={serverMs}
            />
            <button
              type="button"
              onClick={onSayHello}
              disabled={isRunning}
              className="rounded-full bg-blue-600 px-8 py-3 text-base font-medium text-white shadow-md transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isRunning ? "Sending…" : "Say hello"}
            </button>
          </div>
        }
        trace={
          <TraceTimeline
            rows={traceRows}
            totalRoundTripMs={roundTripMs}
            totalServerMs={serverMs}
          />
        }
        cards={
          <div className="grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
            <RuntimeCard data={runtime} />
            <DatabaseCard data={database} />
          </div>
        }
        history={
          <div className="flex w-full max-w-3xl flex-col gap-3">
            <HelloHistory items={history} />
            <div className="flex justify-end">
              <ResetButton onClick={onReset} disabled={isRunning} />
            </div>
          </div>
        }
      />
    </>
  );
}
