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
  genres: string[];
  timestamp: number;
};

interface UserXPContextType {
  totalXP: number;
  genreXP: GenreXP;

  overallLevel: ReturnType<typeof calculateLevel>;
  genreLevels: Record<string, ReturnType<typeof calculateLevel>>;

  addXP: (amount: number, genres?: string[]) => void;

  xpHistory: XPEvent[];
  clearXPHistory: () => void;
}

const UserXPContext = createContext<UserXPContextType | undefined>(undefined);

export const UserXPProvider = ({ children }: { children: ReactNode }) => {
  const [totalXP, setTotalXP] = useState(0);
  const [genreXP, setGenreXP] = useState<GenreXP>({});

  const [xpHistory, setXpHistory] = useState<XPEvent[]>([]);

  function addXP(amount: number, genres: string[] = []) {
    if (amount <= 0) return;

    // update totals
    setTotalXP((prev) => prev + amount);

    const earnedGenreXP = splitGenreXP(amount, genres);
    setGenreXP((prev) => applyGenreXP(prev, earnedGenreXP));

    // record history event
    setXpHistory((prev) => [
      {
        id: crypto.randomUUID(),
        amount,
        genres,
        timestamp: Date.now(),
      },
      ...prev, // newest first
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
