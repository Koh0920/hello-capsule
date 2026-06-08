import { SvgRobot } from "../robot/SvgRobot";
import type { RobotMood } from "../robot/SvgRobot";
import { SpeechBubble } from "./SpeechBubble";

interface RobotStageProps {
  mood: RobotMood;
  message?: string | null;
  speech?: string;
}

const FIXED_SPEECH = "Press the button.";

export function RobotStage({ mood, message, speech }: RobotStageProps) {
  const text = message ?? speech ?? FIXED_SPEECH;
  return (
    <div className="flex flex-col items-center gap-3">
      <SvgRobot mood={mood} size={96} />
      <SpeechBubble text={text} />
    </div>
  );
}
