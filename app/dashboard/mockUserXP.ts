// app/dashboard/mockUserXP.ts
import { XP_REWARDS } from "@/lib/xp/xpConfig";

export const mockUserXP: {
  username: string;
  overall: number;
  genres: Record<string, number>;
} = {
  username: "Player",
  overall: 3420,
  genres: {
    RPG: 1400,
    FPS: 900,
    Strategy: 720,
    Puzzle: 400,
  },
};

export const mockEarnedXP: {
  overall: number;
  genres: Record<string, number>;
} = {
  overall: XP_REWARDS.COMPLETE_GAME,
  genres: {
    RPG: XP_REWARDS.COMPLETE_GAME,
    Strategy: XP_REWARDS.COMPLETE_GAME,
  },
};
