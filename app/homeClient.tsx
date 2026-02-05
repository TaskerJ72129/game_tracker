"use client";

import { useState, useEffect } from "react";
import { useUserXP } from "@/app/context/userXpContext";
import GameCard from "@/components/gameCard";
import { Game } from "@/types/game";
import { XP_REWARDS } from "@/lib/xp/xpConfig";

type Props = {
  initialGames: Game[];
};

export default function HomeClient({ initialGames }: Props) {
  const [games, setGames] = useState(initialGames);
  const { addXP, completedGameIds, markGameCompleted } = useUserXP();

  // update local game list when completedGameIds changes
  useEffect(() => {
    setGames((prev) =>
      prev.map((g) =>
        completedGameIds.has(g.rawgId) ? { ...g, completed: true } : g
      )
    );
  }, [completedGameIds]);

  // handle marking a game complete
  async function handleComplete(game: Game) {
  if (completedGameIds.has(game.rawgId)) return;

  // optimistic UI
  markGameCompleted(game);

    // add XP
    addXP({
      amount: XP_REWARDS.COMPLETE_GAME,
      genres: game.genres,
      source: "Completed Game",
      gameTitle: game.title,
    });

    // optionally update UI immediately
    setGames((prev) =>
      prev.map((g) => (g.rawgId === game.rawgId ? { ...g, completed: true } : g))
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <section className="grid gap-4 sm:grid-cols-2">
        {games.map((game) => (
          <GameCard
            key={game.rawgId}
            game={game}
            onComplete={() => handleComplete(game)}
          />
        ))}
      </section>
    </main>
  );
}
