import { AnimatePresence } from "framer-motion";
import type { RobotMood } from "../guide/scenes";
import { SvgRobot } from "../robot/SvgRobot";
import { SpeechBubble } from "./SpeechBubble";

interface RobotStageProps {
  mood: RobotMood;
  talking: boolean;
  speech: string;
}

export function RobotStage({ mood, talking, speech }: RobotStageProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <SvgRobot mood={mood} talking={talking} />
      <div className="relative">
        <AnimatePresence mode="wait">
          <SpeechBubble key={speech} text={speech} />
        </AnimatePresence>
      </div>
    </div>
  );
}
