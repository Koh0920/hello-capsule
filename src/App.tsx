import { useCallback, useEffect, useState } from "react";
import { useSceneMachine } from "./guide/scene-machine";
import { getRuntime, getNotes, createNote, postChat } from "./api/client";
import type { RuntimeResponse, Note } from "./api/types";
import type { RobotMood } from "./guide/scenes";
import { AppShell } from "./components/AppShell";
import { BackgroundStage } from "./components/BackgroundStage";
import { HeaderStatus } from "./components/HeaderStatus";
import { RobotStage } from "./components/RobotStage";
import { FloatingObjectsLayer } from "./components/FloatingObjectsLayer";
import { BottomInteractionBar } from "./components/BottomInteractionBar";

type ChatMode = "idle" | "thinking" | "talking" | "error";

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

  const [chatMode, setChatMode] = useState<ChatMode>("idle");
  const [chatReply, setChatReply] = useState<string | null>(null);
  const [chatError, setChatError] = useState<string | null>(null);

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

  const handleAsk = useCallback(async (message: string) => {
    if (!message.trim() || chatMode === "thinking") return;
    setChatMode("thinking");
    setChatReply(null);
    setChatError(null);
    try {
      const res = await postChat(message);
      setChatReply(res.reply);
      setChatMode("talking");
      setTimeout(() => setChatMode("idle"), 3000);
    } catch {
      setChatError("Sorry, I couldn't reach the backend. Try again?");
      setChatMode("error");
      setTimeout(() => setChatMode("idle"), 3000);
    }
  }, [chatMode]);

  const handlePrimaryAction = useCallback(() => {
    setChatReply(null);
    setChatError(null);
    setChatMode("idle");
    const action = currentScene.primaryAction?.action;
    if (action === "next") {
      next();
    }
  }, [currentScene.primaryAction, next]);

  const robotMood: RobotMood = chatMode === "thinking"
    ? "thinking"
    : chatMode === "talking"
      ? "happy"
      : chatMode === "error"
        ? "error"
        : currentScene.robotMood;

  const speech = chatError ?? chatReply ?? currentScene.speech;

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
            mood={robotMood}
            talking={chatMode === "thinking"}
            speech={speech}
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
            onNext={() => { setChatMode("idle"); setChatReply(null); next(); }}
            onBack={() => { setChatMode("idle"); setChatReply(null); back(); }}
            isFirst={isFirst}
            isLast={isLast}
            onAsk={handleAsk}
            chatLoading={chatMode === "thinking"}
          />
        }
      />
    </>
  );
}
