import { XP_REWARDS } from "./xpConfig";
import {
  splitGenreXP,
  applyGenreXP,
} from "./xpUtils";

export type GameCompletionInput = {
  currentOverallXP: number;
  currentGenreXP: Record<string, number>;
  gameGenres: string[];
};

export type GameCompletionResult = {
  newOverallXP: number;
  newGenreXP: Record<string, number>;
  xpAwarded: number;
};

function calculateFirstGenreBonus(
  existingGenreXP: Record<string, number>,
  genres: string[]
): number {
  let bonus = 0;

  for (const genre of genres) {
    if (existingGenreXP[genre] === undefined) {
      bonus += XP_REWARDS.FIRST_GENRE_BONUS;
    }
  }

  return bonus;
}

export function handleGameCompletion(
  input: GameCompletionInput
): GameCompletionResult {
  const { currentOverallXP, currentGenreXP, gameGenres } = input;

  const baseXP = XP_REWARDS.COMPLETE_GAME;
  const bonusXP = calculateFirstGenreBonus(currentGenreXP, gameGenres);
  const totalXP = baseXP + bonusXP;

  const genreXP = splitGenreXP(totalXP, gameGenres);
  const updatedGenreXP = applyGenreXP(currentGenreXP, genreXP);

  return {
    newOverallXP: currentOverallXP + totalXP,
    newGenreXP: updatedGenreXP,
    xpAwarded: totalXP,
  };
}
