"use client";

import XPProgressBar from "./xpProgressBar";
import Link from "next/link";
import { useUserXP } from "@/app/context/userXpContext";

export default function UserHeader() {
  const { overallLevel } = useUserXP();
  const username = "JT"; // replace with context/auth username later

  return (
    <header className="sticky top-0 z-50 bg-zinc-950 border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        {/* App name */}
        <Link href="/" className="text-lg font-bold text-white">
          GameTracker
        </Link>

        {/* XP bar */}
        <div className="w-64">
          <XPProgressBar
            level={overallLevel.level}
            currentXP={overallLevel.currentXP}
            nextLevelXP={overallLevel.nextLevelXP}
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
