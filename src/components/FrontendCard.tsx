import { motion } from "framer-motion";

export function FrontendCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.36, ease: "easeOut" }}
      className="w-64 rounded-xl border border-slate-200 bg-white p-5 shadow-md"
    >
      <h3 className="mb-3 text-sm font-semibold text-slate-500 uppercase tracking-wide">
        Frontend
      </h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          React + Vite
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          Tailwind CSS
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-2 text-sm text-purple-700">
          <span className="h-2 w-2 rounded-full bg-purple-500" />
          Framer Motion
        </div>
      </div>
    </motion.div>
  );
}
