"use client";

import XPProgressBar from "./xpProgressBar";
import { calculateLevel } from "@/lib/xp/xpUtils";
import { OVERALL_XP } from "@/lib/xp/xpConfig";
import Link from "next/link";

type Props = {
  username: string;
  totalXP: number;
};

export default function UserHeader({ username, totalXP }: Props) {
  const overall = calculateLevel(totalXP, OVERALL_XP);

  return (
    <header className="sticky top-0 z-50 bg-zinc-950 border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        {/* App name */}
        <Link href="/" className="text-lg font-bold text-white">
          GameTracker
        </Link>

        {/* XP */}
        <div className="w-64">
          <XPProgressBar
            level={overall.level}
            currentXP={overall.currentXP}
            nextLevelXP={overall.nextLevelXP}
          />
        </div>

        {/* Profile button */}
        <Link
          href="/dashboard"
          className="flex items-center gap-3"
        >
          <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-sm font-bold text-black">
            {username[0].toUpperCase()}
          </div>
        </Link>
      </div>
    </header>
  );
}
