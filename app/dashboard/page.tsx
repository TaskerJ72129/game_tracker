"use client";

import { useState } from "react";
import { calculateLevel } from "@/lib/xp/xpUtils";
import { GENRE_XP } from "@/lib/xp/xpConfig";
import { useUserXP } from "@/app/context/userXpContext";
import type { XPState, XPEvent, GenreXPMap } from "@/types/xp";

function EmptyGenreState() {
  return (
    <div className="border border-dashed border-zinc-700 rounded-lg p-6 text-center space-y-3">
      <h2 className="text-lg font-semibold text-white">
        No genre levels yet.
      </h2>

      <p className="text-sm text-zinc-400">
        Your genre levels grow as you play and rate games.
        Over time, we’ll discover what kinds of games you’re best at.
      </p>

      <p className="text-xs text-zinc-500">
        Start by adding or completing a game 🎮
      </p>
    </div>
  );
}

function XPHistory({ history }: { history: XPEvent[] }) {
  if (history.length === 0) return null;

  return (
    <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
      <h2 className="text-xl font-semibold text-white">
        Recent XP
      </h2>

      <ul className="space-y-2">
        {history.slice(0, 5).map((event) => {
          const label = event.gameTitle
            ? `${event.source}: ${event.gameTitle}`
            : event.source;

          return (
            <li
              key={event.id}
              className="flex justify-between text-sm text-zinc-300"
            >
              <span>{label}</span>
              <span className="text-emerald-400">
                +{event.amount} XP
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}


export default function DashboardPage() {
  const { genreXP, xpHistory } = useUserXP();
  const [expanded, setExpanded] = useState(false);

  const sortedGenres = Object.entries(genreXP)
    .map(([genre, xp]) => {
      const data = calculateLevel(xp, GENRE_XP);
      return { genre, xp, data };
    })
    .sort((a, b) => {
      if (a.data.level !== b.data.level) {
        return b.data.level - a.data.level;
      }
      return b.data.progress - a.data.progress;
    });

  const hasAnyGenreXP = sortedGenres.some(g => g.xp > 0);

  // slice for collapsed view
  const displayedGenres = expanded ? sortedGenres : sortedGenres.slice(0, 5);

  return (
    <main className="p-8 max-w-3xl mx-auto space-y-8">
      <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <section className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Genre Levels</h1>
          <p className="text-zinc-400 text-sm">
            Your strengths across different types of games
          </p>
        </section>

        {!hasAnyGenreXP ? (
          <EmptyGenreState />
        ) : (
          <section className="border border-dashed border-zinc-700 rounded-lg p-6 space-y-4">
            {displayedGenres.map(({ genre, data }) => (
              <div key={genre}>
                <div className="flex justify-between text-sm mb-1 text-zinc-300">
                  <span>{genre}</span>
                  <span>Lv {data.level}</span>
                </div>

                <div className="h-3 bg-zinc-800 rounded">
                  <div
                    className="h-3 bg-emerald-600 rounded transition-all"
                    style={{ width: `${data.progress * 100}%` }}
                  />
                </div>

                <p className="text-xs text-zinc-500 mt-1">
                  {data.currentXP} / {data.nextLevelXP} XP
                </p>
              </div>
            ))}
            {sortedGenres.length > 5 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="w-full text-center text-sm text-emerald-400 hover:underline mt-2"
              >
                {expanded ? "Show Less" : "Show All"}
              </button>
            )}
          </section>
        )}
      </section>
      {/* XP History */}
      <XPHistory history={xpHistory} />
      
    </main>
  );
}