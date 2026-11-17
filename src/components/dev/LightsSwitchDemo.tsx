"use client";
// Phase 3 test only: toggles three strips on/off to show the controlled flicker and switch-off.
import { useState } from "react";
import LightStrip from "../LightStrip";
import Button from "../Button";

export default function LightsSwitchDemo() {
  const [on, setOn] = useState(true);
  return (
    <div className="flex flex-col items-center gap-10">
      <div className="flex w-full flex-col gap-10">
        {[0, 1, 2].map((i) => (
          <LightStrip key={i} state={on ? "on" : "off"} delay={i * 0.25} length="70%" reflection={i === 2} />
        ))}
      </div>
      <Button variant="outline" size="sm" onClick={() => setOn((v) => !v)}>
        {on ? "Switch lights off" : "Switch lights on"}
      </Button>
    </div>
  );
}
