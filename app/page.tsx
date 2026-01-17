"use client";

import { useUserXP } from "@/app/context/userXpContext";
import GameCard from "@/components/gameCard";
import { Game } from "@/types/game";
import { XP_REWARDS } from "@/lib/xp/xpConfig";
import { useState } from "react";

const initialGames: Game[] = [
  { id: "1", title: "Baldur’s Gate 3", genres: ["RPG", "Strategy"], completed: false },
  { id: "2", title: "DOOM Eternal", genres: ["FPS"], completed: false },
  { id: "3", title: "Stardew Valley", genres: ["RPG", "Simulation"], completed: true },
];

export default function HomePage() {
  const [games, setGames] = useState(initialGames);
  const { addXP } = useUserXP();

  function handleComplete(game: Game) {
    if (game.completed) return;

    setGames((prev) =>
      prev.map((g) => (g.id === game.id ? { ...g, completed: true } : g))
    );

    addXP(XP_REWARDS.COMPLETE_GAME, game.genres);
  }

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <section className="grid gap-4 sm:grid-cols-2">
        {games.map((game) => (
          <GameCard key={game.id} game={game} onComplete={() => handleComplete(game)} />
        ))}
      </section>
    </main>
  );
}
