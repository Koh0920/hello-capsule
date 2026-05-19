import { motion } from "framer-motion";

export function CapsulePackageCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.36, ease: "easeOut" }}
      className="w-72 rounded-xl border border-slate-200 bg-white p-5 shadow-md"
    >
      <h3 className="mb-3 text-sm font-semibold text-slate-500 uppercase tracking-wide">
        Capsule Package
      </h3>
      <ul className="space-y-2">
        <CheckItem checked label="Code + Frontend" />
        <CheckItem checked label="Python Backend" />
        <CheckItem checked label="Database Setup" />
        <CheckItem checked label="AI Configuration" />
        <CheckItem checked label="One Command to Run" />
      </ul>
    </motion.div>
  );
}

function CheckItem({ checked, label }: { checked: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2 text-sm text-slate-600">
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
          checked
            ? "bg-green-100 text-green-600"
            : "bg-slate-100 text-slate-300"
        }`}
      >
        {checked ? "✓" : ""}
      </span>
      {label}
    </li>
  );
}
