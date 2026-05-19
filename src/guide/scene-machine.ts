import { useState, useCallback } from "react";
import { scenes } from "./scenes";
import type { SceneId } from "./scenes";

export function useSceneMachine() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentScene = scenes[currentIndex];

  const next = useCallback(() => {
    setCurrentIndex((i) => Math.min(i + 1, scenes.length - 1));
  }, []);

  const back = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }, []);

  const goTo = useCallback(
    (id: SceneId) => {
      const idx = scenes.findIndex((s) => s.id === id);
      if (idx >= 0) setCurrentIndex(idx);
    },
    [],
  );

  return {
    currentScene,
    currentIndex,
    totalScenes: scenes.length,
    next,
    back,
    goTo,
    isFirst: currentIndex === 0,
    isLast: currentIndex === scenes.length - 1,
  };
}
