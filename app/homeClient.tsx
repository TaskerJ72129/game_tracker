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
    
	useEffect(() => {
		setGames((prev) =>
			prev.map((g) =>
				completedGameIds.has(g.id) ? { ...g, completed: true } : g
			)
		);
	}, [completedGameIds]);


  function handleComplete(game: Game) {
    if (completedGameIds.has(game.id)) return;

    setGames((prev) =>
      prev.map((g) =>
        g.id === game.id ? { ...g, completed: true } : g
      )
    );
      
    markGameCompleted(game.id);
    addXP(XP_REWARDS.COMPLETE_GAME, game.genres);
  }

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
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
