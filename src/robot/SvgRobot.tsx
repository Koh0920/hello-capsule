export type RobotMood = "idle" | "running" | "delivered";

interface SvgRobotProps {
  mood: RobotMood;
  size?: number;
}

export function SvgRobot({ mood, size = 96 }: SvgRobotProps) {
  const bodyColor =
    mood === "delivered" ? "#22c55e" : mood === "running" ? "#f59e0b" : "#3b82f6";
  const glow = mood === "delivered";

  return (
    <svg
      width={size}
      height={size}
      viewBox="-50 -60 100 120"
      className={mood === "running" ? "animate-pulse" : "transition-colors duration-500"}
    >
      {glow && (
        <filter id="robot-glow">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      )}

      <line x1="0" y1="-40" x2="0" y2="-50" stroke="#94a3b8" strokeWidth="1.5" />
      <circle
        cx="0"
        cy="-52"
        r="3"
        fill={bodyColor}
        filter={glow ? "url(#robot-glow)" : undefined}
        className="transition-colors duration-300"
      />

      <rect
        x="-20" y="-38" width="40" height="34" rx="9"
        fill={bodyColor}
        className="transition-colors duration-300"
        filter={glow ? "url(#robot-glow)" : undefined}
      />
      <circle cx="-8" cy="-22" r="2.5" fill="white" />
      <circle cx="8" cy="-22" r="2.5" fill="white" />

      {mood === "delivered" ? (
        <path d="M -6 -12 Q 0 -6 6 -12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
      ) : mood === "running" ? (
        <ellipse cx="0" cy="-10" rx="3" ry="2" fill="white" />
      ) : (
        <line x1="-5" y1="-10" x2="5" y2="-10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      )}

      <rect x="-18" y="-2" width="36" height="30" rx="6" fill={bodyColor} opacity={0.85} className="transition-colors duration-300" />
      <circle cx="0" cy="10" r="2.5" fill="white" opacity={mood === "running" ? 1 : 0.4} className="transition-opacity duration-300" />

      <g transform={`rotate(${mood === "delivered" ? 30 : 0}, -22, 4)`} className="transition-transform duration-500">
        <rect x="-26" y="-2" width="8" height="26" rx="4" fill={bodyColor} opacity={0.75} />
      </g>
      <g transform={`rotate(${mood === "delivered" ? -30 : 0}, 22, 4)`} className="transition-transform duration-500">
        <rect x="18" y="-2" width="8" height="26" rx="4" fill={bodyColor} opacity={0.75} />
      </g>
    </svg>
  );
}
