import { motion } from "framer-motion";

interface PacketProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  active: boolean;
  durationMs?: number;
  color?: string;
}

export function Packet({
  x1,
  y1,
  x2,
  y2,
  active,
  durationMs = 220,
  color = "#3b82f6",
}: PacketProps) {
  if (!active) return null;

  return (
    <motion.circle
      r={5}
      fill={color}
      initial={{ cx: x1, cy: y1, opacity: 0 }}
      animate={{ cx: x2, cy: y2, opacity: [0, 1, 1, 0] }}
      transition={{
        duration: durationMs / 1000,
        times: [0, 0.1, 0.9, 1],
        ease: "easeInOut",
      }}
      style={{ filter: `drop-shadow(0 0 4px ${color})` }}
    />
  );
}
