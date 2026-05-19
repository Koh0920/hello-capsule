import { motion } from "framer-motion";
import type { AiMode } from "../api/types";

interface AiModesPanelProps {
  modes: AiMode[];
  selected: string;
  onSelect: (id: string) => void;
}

const modeColors: Record<string, { active: string; label: string }> = {
  demo: { active: "bg-blue-50 text-blue-700 border-blue-200", label: "Active" },
  local: { active: "bg-green-50 text-green-700 border-green-200", label: "Active" },
  api: { active: "bg-purple-50 text-purple-700 border-purple-200", label: "Active" },
};

export function AiModesPanel({ modes, selected, onSelect }: AiModesPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.36, ease: "easeOut" }}
      className="w-72 rounded-xl border border-slate-200 bg-white p-5 shadow-md"
    >
      <h3 className="mb-3 text-sm font-semibold text-slate-500 uppercase tracking-wide">
        AI Modes
      </h3>
      <div className="space-y-2">
        {modes.map((m) => (
          <ModeChip
            key={m.id}
            label={m.label}
            description={m.description}
            active={m.id === selected}
            available={m.available}
            onClick={() => m.available && onSelect(m.id)}
          />
        ))}
      </div>
    </motion.div>
  );
}

function ModeChip({
  label,
  description,
  active,
  available,
  onClick,
}: {
  label: string;
  description: string;
  active: boolean;
  available: boolean;
  onClick: () => void;
}) {
  const base = "flex flex-col rounded-lg border px-3 py-2 text-sm transition-colors";
  const cursor = available ? "cursor-pointer" : "cursor-default opacity-50";
  const color = modeColors[label.split(" ")[0].toLowerCase()] ?? modeColors.demo;

  return (
    <button type="button" onClick={onClick} disabled={!available}>
      <div
        className={`${base} ${cursor} ${
          active ? color.active : "border-slate-100 bg-slate-50 text-slate-400"
        }`}
      >
        <span className="flex items-center justify-between">
          <span className="font-medium">{label}</span>
          {active && <span className="text-xs font-medium">Active</span>}
          {!available && <span className="text-xs">N/A</span>}
        </span>
        <span className="mt-0.5 text-xs opacity-60">{description}</span>
      </div>
    </button>
  );
}
