"use client";

import { useState } from "react";
import GameCard from "@/components/gameCard";
import { Game } from "@/types/game";
import { XP_REWARDS } from "@/lib/xp/xpConfig";
import {
  splitGenreXP,
  applyGenreXP,
} from "@/lib/xp/xpUtils";

/**
 * Mock games shown on the home page
 */
const initialGames: Game[] = [
  {
    id: "1",
    title: "Baldur’s Gate 3",
    genres: ["RPG", "Strategy"],
    completed: false,
  },
  {
    id: "2",
    title: "DOOM Eternal",
    genres: ["FPS"],
    completed: false,
  },
  {
    id: "3",
    title: "Stardew Valley",
    genres: ["RPG", "Simulation"],
    completed: true,
  },
];

export default function HomePage() {
  const [games, setGames] = useState(initialGames);

  /**
   * Temporary local XP state
   * (later this will move to context / server)
   */
  const [totalXP, setTotalXP] = useState(0);
  const [genreXP, setGenreXP] = useState<Record<string, number>>({});

  function handleComplete(game: Game) {
    if (game.completed) return;

    // mark game completed
    setGames((prev) =>
      prev.map((g) =>
        g.id === game.id ? { ...g, completed: true } : g
      )
    );

    // apply overall XP
    const earnedXP = XP_REWARDS.COMPLETE_GAME;
    setTotalXP((prev) => prev + earnedXP);

    // apply genre XP
    const earnedGenreXP = splitGenreXP(
      earnedXP,
      game.genres
    );

    setGenreXP((prev) =>
      applyGenreXP(prev, earnedGenreXP)
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Page title */}
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-white">
          Your Games
        </h1>
        <p className="text-zinc-400">
          Complete games to earn XP and level up
        </p>
      </header>

      {/* Game list */}
      <section className="grid gap-4 sm:grid-cols-2">
        {games.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            onComplete={() => handleComplete(game)}
          />
        ))}
      </section>
    </main>
  );
}
