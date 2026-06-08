import { motion, AnimatePresence } from "framer-motion";
import type { HelloHistoryItem } from "../api/types";

interface HelloHistoryProps {
  items: HelloHistoryItem[];
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return (
    String(d.getUTCHours()).padStart(2, "0") +
    ":" +
    String(d.getUTCMinutes()).padStart(2, "0") +
    ":" +
    String(d.getUTCSeconds()).padStart(2, "0")
  );
}

export function HelloHistory({ items }: HelloHistoryProps) {
  return (
    <div className="w-full max-w-3xl">
      <h2 className="mb-2 text-sm font-semibold text-slate-500 uppercase tracking-wide">Recent hellos</h2>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <AnimatePresence initial={false}>
          {items.length === 0 ? (
            <div className="px-3 py-3 text-center text-xs text-slate-400">No history.</div>
          ) : (
            items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-baseline gap-3 border-b border-slate-100 px-3 py-1.5 font-mono text-xs last:border-b-0"
              >
                <span className="w-20 shrink-0 text-slate-400">#{item.id}</span>
                <span className="w-16 shrink-0 text-slate-400">{formatTime(item.created_at)}</span>
                <span className="text-slate-700">{item.run_id}</span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
