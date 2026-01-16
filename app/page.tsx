"use client";

import GameCard from "@/components/gameCard";
import { Game } from "@/types/game";
import { useState } from "react";

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
    completed: true,
  },
];

export default function HomePage() {
  const [games, setGames] = useState(initialGames);

  function handleComplete(gameId: string) {
    setGames((prev) =>
      prev.map((game) =>
        game.id === gameId
          ? { ...game, completed: true }
          : game
      )
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      {games.map((game) => (
        <GameCard
          key={game.id}
          game={game}
          onComplete={handleComplete}
        />
      ))}
    </main>
  );
}
