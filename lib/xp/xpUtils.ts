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
} {
  let level = 1;
  let remainingXP = totalXP;

  while (remainingXP >= xpToNextLevel(level, config)) {
    remainingXP -= xpToNextLevel(level, config);
    level++;
  }

  return {
    level,
    currentXP: remainingXP,
    nextLevelXP: xpToNextLevel(level, config),
  };
}

export function splitGenreXP(
  totalXP: number,
  genres: string[]
): Record<string, number> {
  if (genres.length === 0) return {};

  const xpPerGenre = Math.floor(totalXP / genres.length);
  const result: Record<string, number> = {};

  for (const genre of genres) {
    result[genre] = xpPerGenre;
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
