import type { XPConfig } from "./xpConfig";

export function xpToNextLevel(level: number, config: XPConfig): number {
  return config.base + (level - 1) * config.increment;
}

export function calculateLevel(
  totalXP: number,
  config: XPConfig
): {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  progress: number;
} {
  if (config.base <= 0) {
    throw new Error("XP base must be greater than 0");
  }

  let level = 1;
  let remainingXP = totalXP;

  while (remainingXP >= xpToNextLevel(level, config)) {
    remainingXP -= xpToNextLevel(level, config);
    level++;
  }

  const nextLevelXP = xpToNextLevel(level, config);

  return {
    level,
    currentXP: remainingXP,
    nextLevelXP,
    progress: remainingXP / nextLevelXP,
  };
}

export function splitGenreXP(
  totalXP: number,
  genres: string[]
): Record<string, number> {
  if (genres.length === 0) return {};

  const xpPerGenre = Math.floor(totalXP / genres.length);
  let remainder = totalXP % genres.length;

  const result: Record<string, number> = {};

  for (const genre of genres) {
    result[genre] = xpPerGenre + (remainder > 0 ? 1 : 0);
    remainder--;
  }

  return result;
}

export function applyGenreXP(
  existingGenreXP: Record<string, number>,
  earnedXP: Record<string, number>
): Record<string, number> {
  const updated: Record<string, number> = { ...existingGenreXP };

  for (const genre in earnedXP) {
    updated[genre] = (updated[genre] ?? 0) + earnedXP[genre];
  }

  return updated;
}
