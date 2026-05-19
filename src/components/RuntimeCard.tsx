import { motion } from "framer-motion";
import type { RuntimeResponse } from "../api/types";

interface RuntimeCardProps {
  data?: RuntimeResponse | null;
}

export function RuntimeCard({ data }: RuntimeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.36, ease: "easeOut" }}
      className="w-64 rounded-xl border border-slate-200 bg-white p-5 shadow-md"
    >
      <h3 className="mb-3 text-sm font-semibold text-slate-500 uppercase tracking-wide">
        Runtime
      </h3>
      <dl className="space-y-2">
        <Row label="Python" value={data?.python ?? "..."} />
        <Row label="Platform" value={data ? `${data.platform} ${data.arch}` : "..."} />
        <Row label="Server" value={data?.server ?? "..."} />
        <Row label="Port" value={data ? String(data.port) : "..."} />
        <Row label="Uptime" value={data ? `${data.uptime_seconds}s` : "..."} />
      </dl>
    </motion.div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <dt className="text-slate-400">{label}</dt>
      <dd className="font-mono text-slate-700">{value}</dd>
    </div>
  );
}
