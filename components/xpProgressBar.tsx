"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  level: number;
  currentXP: number;
  nextLevelXP: number;
};

export default function XPProgressBar({
  level,
  currentXP,
  nextLevelXP,
}: Props) {
  const progress = Math.min(
    100,
    Math.round((currentXP / nextLevelXP) * 100)
  );

  const prevLevel = useRef(level);
  const [leveledUp, setLeveledUp] = useState(false);

  useEffect(() => {
    if (level > prevLevel.current) {
      setLeveledUp(true);
      setTimeout(() => setLeveledUp(false), 900);
    }
    prevLevel.current = level;
  }, [level]);

  return (
    <div className="space-y-1">
      {/* Level text */}
      <div className="flex justify-between text-xs text-zinc-400">
        <span
          className={`font-medium ${
            leveledUp ? "text-emerald-400 scale-110" : ""
          } transition-transform duration-300`}
        >
          Lv {level}
        </span>
        <span>
          {currentXP} / {nextLevelXP} XP
        </span>
      </div>

      {/* Progress bar */}
      <div
        className={`
          h-2 w-full rounded-full bg-zinc-800 overflow-hidden
          ${leveledUp ? "ring-2 ring-emerald-500/60" : ""}
          transition-all duration-300
        `}
      >
        <div
          className="
            h-full
            bg-emerald-500
            transition-[width]
            duration-500
            ease-out
            will-change-[width]
          "
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
