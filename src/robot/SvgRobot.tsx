import { type RobotAdapterProps } from "./RobotAdapter";

const glowFilter = (
  <filter id="glow">
    <feGaussianBlur stdDeviation="3" result="blur" />
    <feMerge>
      <feMergeNode in="blur" />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  </filter>
);

const eyeConfig: Record<
  string,
  { cx: number; cy: number; r: number }
> = {
  normal: { cx: 0, cy: 0, r: 4 },
  up: { cx: 0, cy: -3, r: 3.5 },
  left: { cx: -3, cy: 0, r: 3.5 },
  right: { cx: 3, cy: 0, r: 3.5 },
  happy: { cx: 0, cy: -1, r: 4 },
  x: { cx: 0, cy: 0, r: 3.5 },
};

function Eye({ config }: { config: { cx: number; cy: number; r: number } }) {
  return <circle cx={config.cx} cy={config.cy} r={config.r} fill="white" />;
}

type Look = "normal" | "up" | "left" | "right" | "happy" | "x";

function Eyes({ look }: { look: Look }) {
  const cfg = eyeConfig[look];
  if (look === "x") {
    return (
      <g>
        <line x1="-4" y1="-4" x2="4" y2="4" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="4" y1="-4" x2="-4" y2="4" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="12" y1="-4" x2="20" y2="4" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="20" y1="-4" x2="12" y2="4" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    );
  }
  return (
    <g>
      <g transform="translate(-12, 0)"><Eye config={cfg} /></g>
      <g transform="translate(12, 0)"><Eye config={cfg} /></g>
    </g>
  );
}

function Mouth({ mood }: { mood: string }) {
  switch (mood) {
    case "hello":
    case "happy":
      return (
        <path
          d="M -8 6 Q 0 14 8 6"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      );
    case "talking":
      return <ellipse cx="0" cy="7" rx="5" ry="4" fill="white" />;
    case "error":
      return <path d="M -6 10 L 6 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />;
    default:
      return <path d="M -6 8 L 6 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />;
  }
}

export function SvgRobot({ mood, talking }: RobotAdapterProps) {
  const look: Look = mood === "pointing_left" ? "left" : mood === "pointing_right" ? "right" : mood === "thinking" ? "up" : mood === "error" ? "x" : mood === "happy" ? "happy" : "normal";

  const armRotation = mood === "pointing_left" ? -35 : mood === "pointing_right" ? 35 : mood === "happy" || mood === "hello" ? 15 : 0;
  const bodyColor = mood === "error" ? "#ef4444" : mood === "happy" || mood === "hello" ? "#22c55e" : mood === "thinking" ? "#f59e0b" : "#3b82f6";
  const glowEnabled = mood === "hello" || mood === "happy";

  return (
    <svg
      width="160"
      height="200"
      viewBox="-80 -100 160 200"
      className={`transition-all duration-500 ${talking ? "animate-bounce" : ""}`}
    >
      {glowEnabled && glowFilter}

      {/* Antenna */}
      <line x1="0" y1="-60" x2="0" y2="-75" stroke="#94a3b8" strokeWidth="2" />
      <circle cx="0" cy="-78" r="4" fill={bodyColor} filter={glowEnabled ? "url(#glow)" : undefined} />

      {/* Head */}
      <rect
        x="-28" y="-58" width="56" height="50" rx="12"
        fill={bodyColor}
        className="transition-colors duration-500"
        filter={glowEnabled ? "url(#glow)" : undefined}
      />
      <Eyes look={look} />
      <Mouth mood={mood} />

      {/* Body */}
      <rect
        x="-24" y="-4" width="48" height="44" rx="8"
        fill={bodyColor}
        className="transition-colors duration-500"
        opacity={0.85}
      />

      {/* Chest light */}
      <circle
        cx="0" cy="14" r="4"
        fill="white"
        className={`transition-opacity duration-300 ${talking ? "opacity-100" : "opacity-40"}`}
      >
        {talking && (
          <animate attributeName="r" values="3;5;3" dur="0.6s" repeatCount="indefinite" />
        )}
      </circle>

      {/* Left arm */}
      <g transform={`rotate(${-armRotation}, -32, 0)`} className="transition-all duration-500">
        <rect x="-38" y="-10" width="10" height="40" rx="5" fill={bodyColor} opacity={0.8} />
      </g>

      {/* Right arm */}
      <g transform={`rotate(${armRotation}, 32, 0)`} className="transition-all duration-500">
        <rect x="28" y="-10" width="10" height="40" rx="5" fill={bodyColor} opacity={0.8} />
      </g>

      {/* Legs */}
      <rect x="-18" y="40" width="10" height="20" rx="4" fill={bodyColor} opacity={0.7} />
      <rect x="8" y="40" width="10" height="20" rx="4" fill={bodyColor} opacity={0.7} />

      {/* Feet */}
      <rect x="-22" y="56" width="16" height="6" rx="3" fill={bodyColor} opacity={0.6} />
      <rect x="6" y="56" width="16" height="6" rx="3" fill={bodyColor} opacity={0.6} />
    </svg>
  );
}
