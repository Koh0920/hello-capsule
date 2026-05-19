import { motion } from "framer-motion";

export function CommandSnippet() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.36, ease: "easeOut" }}
      className="rounded-xl bg-slate-900 px-6 py-4 shadow-lg"
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-red-400" />
        <span className="h-2 w-2 rounded-full bg-yellow-400" />
        <span className="h-2 w-2 rounded-full bg-green-400" />
      </div>
      <code className="block font-mono text-sm text-green-300">
        <span className="text-blue-300">ato run</span>{" "}
        github.com/Koh0920/hello-capsule
      </code>
    </motion.div>
  );
}
