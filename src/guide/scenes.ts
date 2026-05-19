export type SceneId =
  | "intro"
  | "command"
  | "backend"
  | "frontend"
  | "database"
  | "ai"
  | "capsule"
  | "finish";

export type RobotMood =
  | "idle"
  | "hello"
  | "talking"
  | "thinking"
  | "pointing_left"
  | "pointing_right"
  | "happy"
  | "error";

export type FloatingObjectId =
  | "command"
  | "runtime"
  | "apiPulse"
  | "frontend"
  | "database"
  | "noteForm"
  | "aiModes"
  | "chat"
  | "capsulePackage";

export interface PrimaryAction {
  label: string;
  action: string;
}

export interface Scene {
  id: SceneId;
  robotMood: RobotMood;
  speech: string;
  visibleObjects: FloatingObjectId[];
  primaryAction: PrimaryAction | null;
}

export const scenes: Scene[] = [
  {
    id: "intro",
    robotMood: "hello",
    speech: "Hi, I'm Cap. I'll show you what this capsule can do.",
    visibleObjects: [],
    primaryAction: { label: "Get Started", action: "next" },
  },
  {
    id: "command",
    robotMood: "pointing_left",
    speech:
      "This app starts from a GitHub repository — no manual setup steps.",
    visibleObjects: ["command"],
    primaryAction: { label: "Next", action: "next" },
  },
  {
    id: "backend",
    robotMood: "pointing_right",
    speech: "A Python backend is running. Watch it answer its own health check.",
    visibleObjects: ["runtime", "apiPulse"],
    primaryAction: { label: "Try API", action: "try-api" },
  },
    {
    id: "frontend",
    robotMood: "talking",
    speech: "The frontend is talking to the backend through local APIs.",
    visibleObjects: ["frontend"],
    primaryAction: { label: "Next", action: "next" },
  },
  {
    id: "database",
    robotMood: "thinking",
    speech: "Let's save something to the database. Try writing a note.",
    visibleObjects: ["database", "noteForm"],
    primaryAction: { label: "Save Note", action: "save-note" },
  },
  {
    id: "ai",
    robotMood: "talking",
    speech: "I can answer in three ways: a built-in demo, your local Ollama, or an OpenAI-compatible API. Demo works offline.",
    visibleObjects: ["aiModes", "chat"],
    primaryAction: { label: "Ask AI", action: "ask-ai" },
  },
  {
    id: "capsule",
    robotMood: "happy",
    speech:
      "That's a capsule: a runnable project you can inspect, run, and share.",
    visibleObjects: ["capsulePackage"],
    primaryAction: { label: "Next", action: "next" },
  },
  {
    id: "finish",
    robotMood: "happy",
    speech:
      "Copy the command below to share this capsule with someone else.",
    visibleObjects: [],
    primaryAction: { label: "Copy Command", action: "copy-command" },
  },
];
