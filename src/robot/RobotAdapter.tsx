import type { RobotMood } from "../guide/scenes";

export interface RobotAdapterProps {
  mood: RobotMood;
  talking: boolean;
  focusTarget?: string;
}
