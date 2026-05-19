import { AnimatePresence } from "framer-motion";
import type { FloatingObjectId } from "../guide/scenes";
import type { RuntimeResponse, Note } from "../api/types";
import { CommandSnippet } from "./CommandSnippet";
import { RuntimeCard } from "./RuntimeCard";
import { FrontendCard } from "./FrontendCard";
import { DatabaseFlow } from "./DatabaseFlow";
import { AiModesPanel } from "./AiModesPanel";
import { CapsulePackageCard } from "./CapsulePackageCard";

interface FloatingObjectsLayerProps {
  visibleObjects: FloatingObjectId[];
  runtimeData?: RuntimeResponse | null;
  notes?: Note[];
  onSaveNote?: (body: string) => void;
  saving?: boolean;
  savedNote?: Note | null;
}

function renderObject(
  id: FloatingObjectId,
  runtimeData?: RuntimeResponse | null,
  notes?: Note[],
  onSaveNote?: (body: string) => void,
  saving?: boolean,
  savedNote?: Note | null,
) {
  switch (id) {
    case "command":
      return <CommandSnippet />;
    case "runtime":
      return <RuntimeCard data={runtimeData} />;
    case "frontend":
      return <FrontendCard />;
    case "database":
      return (
        <DatabaseFlow
          notes={notes ?? []}
          onSave={onSaveNote ?? (() => {})}
          saving={saving ?? false}
          savedNote={savedNote ?? null}
        />
      );
    case "aiModes":
      return <AiModesPanel />;
    case "capsulePackage":
      return <CapsulePackageCard />;
    default:
      return null;
  }
}

export function FloatingObjectsLayer({
  visibleObjects,
  runtimeData,
  notes,
  onSaveNote,
  saving,
  savedNote,
}: FloatingObjectsLayerProps) {
  return (
    <div className="relative flex w-full max-w-4xl flex-wrap justify-center gap-6">
      <AnimatePresence mode="popLayout">
        {visibleObjects.map((id) => (
          <div key={id}>{renderObject(id, runtimeData, notes, onSaveNote, saving, savedNote)}</div>
        ))}
      </AnimatePresence>
    </div>
  );
}
