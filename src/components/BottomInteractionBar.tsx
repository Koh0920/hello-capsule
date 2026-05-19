import { SvgRobot } from "../robot/SvgRobot";

interface BottomInteractionBarProps {
  primaryActionLabel?: string;
  onPrimaryAction: () => void;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function BottomInteractionBar({
  primaryActionLabel,
  onPrimaryAction,
  onNext,
  onBack,
  isFirst,
  isLast,
}: BottomInteractionBarProps) {
  const showNext = primaryActionLabel === "Next" || primaryActionLabel == null;

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center gap-3 px-6 py-3">
        <div className="flex-shrink-0">
          <SvgRobot mood="idle" talking={false} />
        </div>

        <div className="flex flex-1 items-center gap-2">
          <input
            type="text"
            placeholder="Ask me anything about this capsule..."
            className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none transition-colors focus:border-blue-400 focus:bg-white"
          />
          <button
            type="button"
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-200"
          >
            Ask me
          </button>
        </div>

        <div className="flex items-center gap-2">
          {!isFirst && (
            <button
              type="button"
              onClick={onBack}
              className="rounded-lg px-3 py-2 text-sm text-slate-500 transition-colors hover:bg-slate-100"
            >
              Back
            </button>
          )}

          {showNext ? (
            <button
              type="button"
              onClick={onNext}
              className="rounded-lg bg-blue-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
            >
              {isLast ? "Done" : "Next"}
            </button>
          ) : (
            <button
              type="button"
              onClick={onPrimaryAction}
              className="rounded-lg bg-blue-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
            >
              {primaryActionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
