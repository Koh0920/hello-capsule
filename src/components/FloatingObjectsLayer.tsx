import { AnimatePresence } from "framer-motion";
import type { FloatingObjectId } from "../guide/scenes";
import type { RuntimeResponse, Note, AiMode } from "../api/types";
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
  aiModes?: AiMode[];
  selectedAiMode?: string;
  onSelectAiMode?: (id: string) => void;
  dbKind?: string;
  dbUrlLabel?: string;
}

type RenderCtx = FloatingObjectsLayerProps;

function renderObject(id: FloatingObjectId, ctx: RenderCtx) {
  switch (id) {
    case "command":
      return <CommandSnippet />;
    case "runtime":
      return <RuntimeCard data={ctx.runtimeData} />;
    case "frontend":
      return <FrontendCard />;
    case "database":
      return (
        <DatabaseFlow
          notes={ctx.notes ?? []}
          onSave={ctx.onSaveNote ?? (() => {})}
          saving={ctx.saving ?? false}
          savedNote={ctx.savedNote ?? null}
          dbKind={ctx.dbKind ?? "sqlite"}
          dbUrlLabel={ctx.dbUrlLabel ?? ""}
        />
      );
    case "aiModes":
      return (
        <AiModesPanel
          modes={ctx.aiModes ?? []}
          selected={ctx.selectedAiMode ?? "demo"}
          onSelect={ctx.onSelectAiMode ?? (() => {})}
        />
      );
    case "capsulePackage":
      return <CapsulePackageCard />;
    default:
      return null;
  }
}

export function FloatingObjectsLayer(props: FloatingObjectsLayerProps) {
  return (
    <div className="relative flex w-full max-w-4xl flex-wrap justify-center gap-6">
      <AnimatePresence mode="popLayout">
        {props.visibleObjects.map((id) => (
          <div key={id}>{renderObject(id, props)}</div>
        ))}
      </AnimatePresence>
    </div>
  );
}
