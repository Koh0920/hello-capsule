import { useEffect } from "react";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import type { RobotMood } from "../guide/scenes";

const MOOD_MAP: Record<RobotMood, number> = {
  idle: 0,
  hello: 1,
  talking: 2,
  thinking: 3,
  pointing_left: 4,
  pointing_right: 5,
  happy: 6,
  error: 7,
};

const FOCUS_MAP: Record<string, number> = {
  command: 1,
  database: 2,
  ai: 3,
  capsule: 4,
};

interface RiveRobotProps {
  mood: RobotMood;
  talking: boolean;
  focusTarget?: string;
}

export function RiveRobot({ mood, talking, focusTarget }: RiveRobotProps) {
  const { rive, RiveComponent } = useRive({
    src: "/robot.riv",
    stateMachines: "GuideRobot",
    autoplay: true,
  });

  const moodInput = useStateMachineInput(rive, "GuideRobot", "mood", 0);
  const talkingInput = useStateMachineInput(rive, "GuideRobot", "talking", false);
  const focusInput = useStateMachineInput(rive, "GuideRobot", "focus", 0);

  useEffect(() => {
    if (moodInput) moodInput.value = MOOD_MAP[mood] ?? 0;
    if (talkingInput) talkingInput.value = talking;
    if (focusInput) focusInput.value = FOCUS_MAP[focusTarget ?? ""] ?? 0;
  }, [moodInput, talkingInput, focusInput, mood, talking, focusTarget]);

  return <RiveComponent style={{ width: 160, height: 200 }} />;
}
