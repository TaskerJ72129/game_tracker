"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { calculateLevel, splitGenreXP, applyGenreXP } from "@/lib/xp/xpUtils";
import { OVERALL_XP, GENRE_XP } from "@/lib/xp/xpConfig";

type GenreXP = Record<string, number>;

interface UserXPContextType {
  totalXP: number;
  genreXP: GenreXP;
  addXP: (amount: number, genres?: string[]) => void;
  overallLevel: ReturnType<typeof calculateLevel>;
  genreLevels: Record<string, ReturnType<typeof calculateLevel>>;
}

const UserXPContext = createContext<UserXPContextType | undefined>(undefined);

export const UserXPProvider = ({ children }: { children: ReactNode }) => {
  const [totalXP, setTotalXP] = useState(0);
  const [genreXP, setGenreXP] = useState<GenreXP>({});

  // Function to add XP globally
  function addXP(amount: number, genres: string[] = []) {
    if (amount <= 0) return;

    setTotalXP((prev) => prev + amount);

    const earnedGenreXP = splitGenreXP(amount, genres);
    setGenreXP((prev) => applyGenreXP(prev, earnedGenreXP));
  }

  const overallLevel = calculateLevel(totalXP, OVERALL_XP);

  const genreLevels: Record<string, ReturnType<typeof calculateLevel>> = {};
  for (const genre in genreXP) {
    genreLevels[genre] = calculateLevel(genreXP[genre], GENRE_XP);
  }

  return (
    <UserXPContext.Provider
      value={{ totalXP, genreXP, addXP, overallLevel, genreLevels }}
    >
      {children}
    </UserXPContext.Provider>
  );
};

// Hook for easy access
export const useUserXP = () => {
  const context = useContext(UserXPContext);
  if (!context) {
    throw new Error("useUserXP must be used within a UserXPProvider");
  }
  return context;
};
