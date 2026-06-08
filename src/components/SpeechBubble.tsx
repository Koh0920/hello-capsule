import { motion } from "framer-motion";

interface SpeechBubbleProps {
  text: string;
}

export function SpeechBubble({ text }: SpeechBubbleProps) {
  return (
    <motion.div
      key={text}
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="relative max-w-md rounded-2xl bg-white px-5 py-2.5 text-sm text-slate-700 shadow-md ring-1 ring-slate-200"
    >
      {text}
      <div className="absolute -top-1.5 left-8 h-3 w-3 rotate-45 bg-white ring-1 ring-slate-200" />
    </motion.div>
  );
}
