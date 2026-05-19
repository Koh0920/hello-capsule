import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Note } from "../api/types";

interface DatabaseFlowProps {
  notes: Note[];
  onSave: (body: string) => void;
  saving: boolean;
  savedNote: Note | null;
  dbKind: string;
  dbUrlLabel: string;
}

const kindStyles: Record<string, string> = {
  sqlite: "bg-amber-50 text-amber-700 border-amber-200",
  postgres: "bg-blue-50 text-blue-700 border-blue-200",
};

const kindLabels: Record<string, string> = {
  sqlite: "SQLite",
  postgres: "PostgreSQL",
};

export function DatabaseFlow({ notes, onSave, saving, savedNote, dbKind, dbUrlLabel }: DatabaseFlowProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || saving) return;
    onSave(input.trim());
    setInput("");
  };

  const kindStyle = kindStyles[dbKind] ?? kindStyles.sqlite;
  const kindLabel = kindLabels[dbKind] ?? dbKind;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.36, ease: "easeOut" }}
      className="w-72 rounded-xl border border-slate-200 bg-white p-5 shadow-md"
    >
      <h3 className="mb-3 text-sm font-semibold text-slate-500 uppercase tracking-wide">
        Database
      </h3>
      <div className={`mb-1 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${kindStyle}`}>
        <span className="h-2 w-2 rounded-full bg-current opacity-60" />
        {kindLabel} — {notes.length} notes
      </div>
      <div className="mb-4 px-3 text-xs text-slate-400 truncate">{dbUrlLabel}</div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write a note..."
          className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-400"
        />
        <button
          type="submit"
          disabled={!input.trim() || saving}
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400"
        >
          {saving ? "..." : "Save"}
        </button>
      </form>

      <AnimatePresence>
        {savedNote && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, y: -20 }}
            className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700"
          >
            Saved: {savedNote.body}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
