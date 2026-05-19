import { motion } from "framer-motion";

interface SpeechBubbleProps {
  text: string;
}

export function SpeechBubble({ text }: SpeechBubbleProps) {
  return (
    <motion.div
      key={text}
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative max-w-md rounded-2xl bg-white px-6 py-4 shadow-lg"
    >
      <p className="text-lg leading-relaxed text-gray-700">{text}</p>
      <div className="absolute -bottom-2 left-8 h-4 w-4 rotate-45 bg-white" />
    </motion.div>
  );
}
