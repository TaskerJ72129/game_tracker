"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { calculateLevel, splitGenreXP, applyGenreXP } from "@/lib/xp/xpUtils";
import { OVERALL_XP, GENRE_XP } from "@/lib/xp/xpConfig";

type GenreXP = Record<string, number>;

type XPEvent = {
  id: string;
  amount: number;
  source: string;
  gameTitle?: string;
  timestamp: number;
};

type AddXPParams = {
  amount: number;
  genres?: string[];
  source: string;
  gameTitle?: string;
};

interface UserXPContextType {
  totalXP: number;
  genreXP: GenreXP;

  overallLevel: ReturnType<typeof calculateLevel>;
  genreLevels: Record<string, ReturnType<typeof calculateLevel>>;

  addXP: (params: AddXPParams) => void;

  xpHistory: XPEvent[];
  clearXPHistory: () => void;

  completedGameIds: Set<string>;
  markGameCompleted: (gameId: string) => void;
}


const UserXPContext = createContext<UserXPContextType | undefined>(undefined);

export const UserXPProvider = ({ children }: { children: ReactNode }) => {
  const [totalXP, setTotalXP] = useState(0);
  const [genreXP, setGenreXP] = useState<GenreXP>({});
  const [completedGameIds, setCompletedGameIds] = useState<Set<string>>(
    () => new Set()
  );
  const [xpHistory, setXpHistory] = useState<XPEvent[]>([]);

  function markGameCompleted(gameId: string) {
    setCompletedGameIds((prev) => new Set(prev).add(gameId));
  }

function addXP({ amount, genres = [], source, gameTitle }: AddXPParams) {
  console.log("addXP called with:", { amount, genres, source, gameTitle });
  if (amount <= 0) return;

  // totals
  setTotalXP((prev) => prev + amount);

  // genre XP
  if (genres.length > 0) {
    const earnedGenreXP = splitGenreXP(amount, genres);
    setGenreXP((prev) => applyGenreXP(prev, earnedGenreXP));
  }

  // history
  setXpHistory((prev) => [
    {
      id: crypto.randomUUID(),
      amount,
      source,
      gameTitle,
      timestamp: Date.now(),
    },
    ...prev,
  ]);
}

  const overallLevel = calculateLevel(totalXP, OVERALL_XP);

  const genreLevels: Record<string, ReturnType<typeof calculateLevel>> = {};
  for (const genre in genreXP) {
    genreLevels[genre] = calculateLevel(genreXP[genre], GENRE_XP);
  }

  function clearXPHistory() {
    setXpHistory([]);
  }

  return (
    <UserXPContext.Provider
      value={{
        totalXP,
        genreXP,
        overallLevel,
        genreLevels,
        addXP,
        completedGameIds,
        markGameCompleted,
        xpHistory,
        clearXPHistory,
      }}
    >
      {children}
    </UserXPContext.Provider>
  );
};

export const useUserXP = () => {
  const context = useContext(UserXPContext);
  if (!context) {
    throw new Error("useUserXP must be used within a UserXPProvider");
  }
  return context;
};
