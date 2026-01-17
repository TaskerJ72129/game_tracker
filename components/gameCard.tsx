"use client";

import { Game } from "@/types/game";
import { XP_REWARDS } from "@/lib/xp/xpConfig";

type Props = {
  game: Game;
  onComplete?: (gameId: string) => void;
};

export default function GameCard({ game, onComplete }: Props) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 space-y-3">
      {/* Title */}
      <h3 className="text-lg font-semibold text-white">
        {game.title}
      </h3>

      {/* Genres */}
      <div className="flex flex-wrap gap-2">
        {game.genres.map((genre) => (
          <span
            key={genre}
            className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300"
          >
            {genre}
          </span>
        ))}
      </div>

      {/* XP Preview */}
      <div className="text-sm text-zinc-400">
        XP on completion:{" "}
        <span className="text-emerald-400 font-medium">
          +{XP_REWARDS.COMPLETE_GAME} XP
        </span>
      </div>

      {/* Action */}
      <div>
        {game.completed ? (
          <span className="inline-block rounded-md bg-emerald-900/40 px-3 py-1 text-sm text-emerald-400">
            Completed
          </span>
        ) : (
          <button
            onClick={() => onComplete?.(game.id)}
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-black hover:bg-emerald-500 transition"
          >
            Complete game
          </button>
        )}
      </div>
    </div>
  );
}
