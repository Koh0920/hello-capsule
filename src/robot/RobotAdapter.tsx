import { useEffect, useState } from "react";
import type { RobotMood } from "../guide/scenes";
import { RiveRobot } from "./RiveRobot";
import { SvgRobot } from "./SvgRobot";

export interface RobotAdapterProps {
  mood: RobotMood;
  talking: boolean;
  focusTarget?: string;
}

export function RobotAdapter(props: RobotAdapterProps) {
  const [useRive, setUseRive] = useState(false);

  useEffect(() => {
    fetch("/robot.riv", { method: "HEAD" })
      .then((r) => setUseRive(r.ok))
      .catch(() => setUseRive(false));
  }, []);

  if (useRive) return <RiveRobot {...props} />;
  return <SvgRobot {...props} />;
}
