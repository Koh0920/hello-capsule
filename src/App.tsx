import { useCallback, useEffect, useState } from "react";
import { useSceneMachine } from "./guide/scene-machine";
import { getRuntime, getNotes, createNote } from "./api/client";
import type { RuntimeResponse, Note } from "./api/types";
import { AppShell } from "./components/AppShell";
import { BackgroundStage } from "./components/BackgroundStage";
import { HeaderStatus } from "./components/HeaderStatus";
import { RobotStage } from "./components/RobotStage";
import { FloatingObjectsLayer } from "./components/FloatingObjectsLayer";
import { BottomInteractionBar } from "./components/BottomInteractionBar";

export default function App() {
  const {
    currentScene,
    currentIndex,
    totalScenes,
    next,
    back,
    isFirst,
    isLast,
  } = useSceneMachine();

  const [runtimeData, setRuntimeData] = useState<RuntimeResponse | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [saving, setSaving] = useState(false);
  const [savedNote, setSavedNote] = useState<Note | null>(null);

  useEffect(() => {
    if (currentScene.id === "backend") {
      getRuntime()
        .then(setRuntimeData)
        .catch(() => setRuntimeData(null));
    }
    if (currentScene.id === "database") {
      getNotes()
        .then(setNotes)
        .catch(() => setNotes([]));
    }
  }, [currentScene.id]);

  const handleSaveNote = useCallback(async (body: string) => {
    setSaving(true);
    try {
      const note = await createNote(body);
      setSavedNote(note);
      setNotes((prev) => [note, ...prev]);
      setTimeout(() => setSavedNote(null), 2000);
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
  }, []);

  const handlePrimaryAction = useCallback(() => {
    const action = currentScene.primaryAction?.action;
    if (action === "next") {
      next();
    }
  }, [currentScene.primaryAction, next]);

  return (
    <>
      <BackgroundStage />
      <AppShell
        header={
          <HeaderStatus
            currentIndex={currentIndex}
            totalScenes={totalScenes}
            sceneId={currentScene.id}
          />
        }
        center={
          <RobotStage
            mood={currentScene.robotMood}
            talking={currentScene.id === "ai"}
            speech={currentScene.speech}
          />
        }
        objects={
          <FloatingObjectsLayer
            visibleObjects={currentScene.visibleObjects}
            runtimeData={runtimeData}
            notes={notes}
            onSaveNote={handleSaveNote}
            saving={saving}
            savedNote={savedNote}
          />
        }
        bar={
          <BottomInteractionBar
            primaryActionLabel={currentScene.primaryAction?.label}
            onPrimaryAction={handlePrimaryAction}
            onNext={next}
            onBack={back}
            isFirst={isFirst}
            isLast={isLast}
          />
        }
      />
    </>
  );
}
