import { Packet } from "./Packet";

export type FlowPhase =
  | "idle"
  | "client_send"
  | "server_recv"
  | "runtime_read"
  | "db_write"
  | "db_count"
  | "server_send"
  | "client_recv"
  | "done";

interface DataFlowDiagramProps {
  phase: FlowPhase;
  clientMessage: string | null;
  runId: string | null;
  roundTripMs: number | null;
  serverMs: number | null;
}

const W = 560;
const H = 220;

const BROWSER = { x: 80, y: 60 };
const SERVER = { x: 380, y: 60 };
const RUNTIME = { x: 480, y: 170 };
const DB = { x: 280, y: 170 };

function lineKey(from: string, to: string) {
  return `${from}->${to}`;
}

function packetForPhase(
  phase: FlowPhase,
  set: (line: string, color: string, duration?: number) => void,
) {
  switch (phase) {
    case "client_send":
      set(lineKey("browser", "server"), "#3b82f6", 220);
      return;
    case "runtime_read":
      set(lineKey("server", "runtime"), "#8b5cf6", 200);
      return;
    case "db_write":
      set(lineKey("server", "db"), "#10b981", 200);
      return;
    case "db_count":
      set(lineKey("db", "server"), "#10b981", 200);
      return;
    case "server_send":
      set(lineKey("server", "browser"), "#3b82f6", 220);
      return;
    default:
      return;
  }
}

function isNodeActive(phase: FlowPhase, node: "browser" | "server" | "runtime" | "db") {
  switch (node) {
    case "browser":
      return phase === "client_send" || phase === "client_recv" || phase === "done";
    case "server":
      return phase === "server_recv" || phase === "server_send" || phase === "runtime_read" || phase === "db_write" || phase === "db_count";
    case "runtime":
      return phase === "runtime_read";
    case "db":
      return phase === "db_write" || phase === "db_count";
  }
}

export function DataFlowDiagram({
  phase,
  clientMessage,
  runId,
  roundTripMs,
  serverMs,
}: DataFlowDiagramProps) {
  const activeLines: Record<string, { color: string; duration: number }> = {};
  packetForPhase(phase, (line, color, duration = 220) => {
    activeLines[line] = { color, duration };
  });

  return (
    <div className="w-full max-w-3xl">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#cbd5e1" />
          </marker>
        </defs>

        {/* Lines */}
        <line
          x1={BROWSER.x + 36} y1={BROWSER.y}
          x2={SERVER.x - 36} y2={SERVER.y}
          stroke="#cbd5e1" strokeWidth="1.5"
          markerEnd="url(#arrow)"
        />
        <line
          x1={SERVER.x} y1={SERVER.y + 24}
          x2={RUNTIME.x - 28} y2={RUNTIME.y - 8}
          stroke="#cbd5e1" strokeWidth="1.5"
          markerEnd="url(#arrow)"
        />
        <line
          x1={SERVER.x - 20} y1={SERVER.y + 24}
          x2={DB.x + 28} y2={DB.y - 8}
          stroke="#cbd5e1" strokeWidth="1.5"
          markerEnd="url(#arrow)"
        />

        {/* Packets */}
        {Object.entries(activeLines).map(([line, { color, duration }]) => {
          let x1 = 0, y1 = 0, x2 = 0, y2 = 0;
          if (line === lineKey("browser", "server")) {
            x1 = BROWSER.x + 36; y1 = BROWSER.y;
            x2 = SERVER.x - 36; y2 = SERVER.y;
          } else if (line === lineKey("server", "runtime")) {
            x1 = SERVER.x; y1 = SERVER.y + 24;
            x2 = RUNTIME.x - 28; y2 = RUNTIME.y - 8;
          } else if (line === lineKey("server", "db")) {
            x1 = SERVER.x - 20; y1 = SERVER.y + 24;
            x2 = DB.x + 28; y2 = DB.y - 8;
          } else if (line === lineKey("db", "server")) {
            x1 = DB.x + 28; y1 = DB.y - 8;
            x2 = SERVER.x - 20; y2 = SERVER.y + 24;
          } else if (line === lineKey("server", "browser")) {
            x1 = SERVER.x - 36; y1 = SERVER.y;
            x2 = BROWSER.x + 36; y2 = BROWSER.y;
          }
          return (
            <Packet
              key={line}
              x1={x1} y1={y1} x2={x2} y2={y2}
              active
              durationMs={duration}
              color={color}
            />
          );
        })}

        {/* Nodes */}
        <Node
          cx={BROWSER.x} cy={BROWSER.y}
          label="Browser" sublabel="React"
          active={isNodeActive(phase, "browser")}
          content={clientMessage ?? (runId ? `run ${runId}` : "—")}
          color="#3b82f6"
        />
        <Node
          cx={SERVER.x} cy={SERVER.y}
          label="Server" sublabel="FastAPI"
          active={isNodeActive(phase, "server")}
          content={serverMs !== null ? `${serverMs} ms` : "—"}
          color="#3b82f6"
        />
        <Node
          cx={RUNTIME.x} cy={RUNTIME.y}
          label="Runtime" sublabel="inspector"
          active={isNodeActive(phase, "runtime")}
          content={phase === "runtime_read" ? "reading" : "—"}
          color="#8b5cf6"
        />
        <Node
          cx={DB.x} cy={DB.y}
          label="SQLite" sublabel="hello_events"
          active={isNodeActive(phase, "db")}
          content={phase === "db_write" ? "insert" : phase === "db_count" ? "count" : "—"}
          color="#10b981"
        />

        {/* Stats */}
        {roundTripMs !== null && (
          <text x={W / 2} y={H - 6} textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="monospace">
            round trip {roundTripMs} ms
          </text>
        )}
      </svg>
    </div>
  );
}

interface NodeProps {
  cx: number;
  cy: number;
  label: string;
  sublabel: string;
  active: boolean;
  content: string;
  color: string;
}

function Node({ cx, cy, label, sublabel, active, content, color }: NodeProps) {
  const w = 72;
  const h = 48;
  const x = cx - w / 2;
  const y = cy - h / 2;
  return (
    <g>
      <rect
        x={x} y={y} width={w} height={h} rx={8}
        fill="white"
        stroke={active ? color : "#cbd5e1"}
        strokeWidth={active ? 2 : 1}
        style={{
          transition: "stroke 200ms, stroke-width 200ms",
          filter: active ? `drop-shadow(0 0 6px ${color}55)` : undefined,
        }}
      />
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="11" fontWeight="600" fill={active ? color : "#475569"}>
        {label}
      </text>
      <text x={cx} y={cy + 8} textAnchor="middle" fontSize="9" fill="#94a3b8">
        {sublabel}
      </text>
      <text x={cx} y={cy + 18} textAnchor="middle" fontSize="8" fill="#94a3b8" fontFamily="monospace">
        {content}
      </text>
    </g>
  );
}
