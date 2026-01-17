export type XPConfig = {
  base: number;
  increment: number;
};

export const OVERALL_XP = {
  base: 100,
  increment: 50,
};

export const GENRE_XP = {
  base: 75,
  increment: 35,
};

export const XP_REWARDS = {
  COMPLETE_GAME: 100,
  RATE_GAME: 20,
  FIRST_GENRE_BONUS: 50,
} as const;