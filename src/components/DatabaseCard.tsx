import { motion } from "framer-motion";
import type { DatabaseResponse } from "../api/types";

interface DatabaseCardProps {
  data: DatabaseResponse | null;
}

export function DatabaseCard({ data }: DatabaseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <h3 className="mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">Database</h3>
      <dl className="space-y-1.5 text-sm">
        <Row label="Kind" value={data?.kind ?? "—"} />
        <Row label="Path" value={data?.url_label ?? "—"} mono />
        <Row label="Events" value={data ? String(data.hello_count) : "—"} />
      </dl>
    </motion.div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-slate-400">{label}</dt>
      <dd className={"text-slate-700 " + (mono ? "font-mono text-xs truncate max-w-[180px]" : "")}>
        {value}
      </dd>
    </div>
  );
}
