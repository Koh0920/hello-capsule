import { motion, AnimatePresence } from "framer-motion";
import type { HelloStep } from "../api/types";

export interface TraceRow {
  id: string;
  at: string;
  deltaMs: number;
  label: string;
  origin: "client" | "server";
}

interface TraceTimelineProps {
  rows: TraceRow[];
  totalRoundTripMs: number | null;
  totalServerMs: number | null;
}

function formatAt(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return (
    String(d.getUTCHours()).padStart(2, "0") +
    ":" +
    String(d.getUTCMinutes()).padStart(2, "0") +
    ":" +
    String(d.getUTCSeconds()).padStart(2, "0") +
    "." +
    String(d.getUTCMilliseconds()).padStart(3, "0")
  );
}

function formatDelta(ms: number): string {
  if (ms < 1000) return `+${ms}ms`;
  return `+${(ms / 1000).toFixed(2)}s`;
}

export function TraceTimeline({ rows, totalRoundTripMs, totalServerMs }: TraceTimelineProps) {
  return (
    <div className="w-full max-w-3xl">
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Trace</h2>
        {totalRoundTripMs !== null && totalServerMs !== null && (
          <div className="text-xs text-slate-500 font-mono">
            round trip {totalRoundTripMs}ms · server {totalServerMs}ms
          </div>
        )}
      </div>
      <div className="rounded-lg border border-slate-200 bg-white">
        <AnimatePresence initial={false}>
          {rows.map((row) => (
            <motion.div
              key={row.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18 }}
              className="flex items-baseline gap-3 border-b border-slate-100 px-3 py-1.5 font-mono text-xs last:border-b-0"
            >
              <span className="w-24 shrink-0 text-slate-400">{formatAt(row.at)}</span>
              <span className="w-12 shrink-0 text-slate-400">{formatDelta(row.deltaMs)}</span>
              <span className="flex-1 text-slate-700">{row.label}</span>
              <span
                className={
                  "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium " +
                  (row.origin === "client"
                    ? "bg-blue-50 text-blue-600"
                    : "bg-slate-100 text-slate-500")
                }
              >
                {row.origin}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        {rows.length === 0 && (
          <div className="px-3 py-4 text-center text-xs text-slate-400">
            No trace yet. Press the button to start.
          </div>
        )}
      </div>
    </div>
  );
}

export function rowsFromResponse(
  clientSendMs: number,
  clientRecvMs: number,
  steps: HelloStep[],
): { rows: TraceRow[]; roundTripMs: number; serverMs: number } {
  const roundTripMs = Math.max(0, Math.round(clientRecvMs - clientSendMs));
  const startedAt = steps[0]?.at;
  const finishedAt = steps[steps.length - 1]?.at;
  let serverMs = 0;
  if (startedAt && finishedAt) {
    serverMs = Math.max(0, new Date(finishedAt).getTime() - new Date(startedAt).getTime());
  }
  const clientSendIso = new Date(clientSendMs).toISOString();
  const clientRecvIso = new Date(clientRecvMs).toISOString();
  const rows: TraceRow[] = [
    {
      id: "client-send",
      at: clientSendIso,
      deltaMs: 0,
      label: "Client sent POST /api/hello",
      origin: "client",
    },
    ...steps.map<TraceRow>((s) => ({
      id: `server-${s.id}`,
      at: s.at,
      deltaMs: s.delta_ms,
      label: s.label,
      origin: "server",
    })),
    {
      id: "client-recv",
      at: clientRecvIso,
      deltaMs: roundTripMs,
      label: "Client received hello",
      origin: "client",
    },
  ];
  return { rows, roundTripMs, serverMs };
}
