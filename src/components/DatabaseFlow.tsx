import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Note } from "../api/types";

interface DatabaseFlowProps {
  notes: Note[];
  onSave: (body: string) => void;
  saving: boolean;
  savedNote: Note | null;
}

export function DatabaseFlow({ notes, onSave, saving, savedNote }: DatabaseFlowProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || saving) return;
    onSave(input.trim());
    setInput("");
  };

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
      <div className="mb-4 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
        <span className="h-2 w-2 rounded-full bg-amber-500" />
        SQLite — {notes.length} notes
      </div>

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
