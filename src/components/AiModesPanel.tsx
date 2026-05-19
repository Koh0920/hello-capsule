import { motion } from "framer-motion";

export function AiModesPanel() {
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
        <ModeChip label="Demo" active color="blue" />
        <ModeChip label="Local (Ollama)" active={false} color="green" />
        <ModeChip label="API (OpenAI)" active={false} color="purple" />
      </div>
    </motion.div>
  );
}

function ModeChip({
  label,
  active,
  color,
}: {
  label: string;
  active: boolean;
  color: "blue" | "green" | "purple";
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
  };
  return (
    <div
      className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors ${
        active ? colors[color] : "border-slate-100 bg-slate-50 text-slate-400"
      }`}
    >
      <span>{label}</span>
      {active && <span className="text-xs font-medium">Active</span>}
    </div>
  );
}
