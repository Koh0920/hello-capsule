import type { SceneId } from "../guide/scenes";

interface HeaderStatusProps {
  currentIndex: number;
  totalScenes: number;
  sceneId: SceneId;
}

const sceneLabels: Record<SceneId, string> = {
  intro: "Welcome",
  command: "Command",
  backend: "Backend",
  frontend: "Frontend",
  database: "Database",
  ai: "AI",
  capsule: "Capsule",
  finish: "Done",
};

export function HeaderStatus({ currentIndex, totalScenes, sceneId }: HeaderStatusProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
        {sceneLabels[sceneId]}
      </span>
      <span className="text-xs text-gray-400">
        {currentIndex + 1} / {totalScenes}
      </span>
    </div>
  );
}
