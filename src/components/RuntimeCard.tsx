import { motion } from "framer-motion";
import type { RuntimeResponse } from "../api/types";

interface RuntimeCardProps {
  data: RuntimeResponse | null;
}

export function RuntimeCard({ data }: RuntimeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <h3 className="mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">Runtime</h3>
      <dl className="space-y-1.5 text-sm">
        <Row label="Python" value={data?.python ?? "—"} />
        <Row label="Platform" value={data ? `${data.platform}/${data.arch}` : "—"} />
        <Row label="Server" value={data?.server ?? "—"} />
        <Row label="Port" value={data ? String(data.port) : "—"} />
        <Row label="Uptime" value={data ? `${data.uptime_seconds}s` : "—"} />
      </dl>
    </motion.div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-slate-400">{label}</dt>
      <dd className="font-mono text-xs text-slate-700">{value}</dd>
    </div>
  );
}
