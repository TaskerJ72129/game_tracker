"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { calculateLevel, splitGenreXP, applyGenreXP } from "@/lib/xp/xpUtils";
import { OVERALL_XP, GENRE_XP, XP_REWARDS } from "@/lib/xp/xpConfig";
import { useUser } from "@/app/context/authContext";
import type { Game } from "@/types/game";

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
  addXP: (params: AddXPParams) => Promise<void>;
  xpHistory: XPEvent[];
  clearXPHistory: () => void;
  completedGameIds: Set<number>;
  markGameCompleted: (game: Game) => Promise<void>;
}

const UserXPContext = createContext<UserXPContextType | undefined>(undefined);

export const UserXPProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const [totalXP, setTotalXP] = useState(0);
  const [genreXP, setGenreXP] = useState<GenreXP>({});
  const [completedGameIds, setCompletedGameIds] = useState<Set<number>>(() => new Set());
  const [xpHistory, setXpHistory] = useState<XPEvent[]>([]);

  // fetch XP and completed games when user logs in
  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      try {
        const [xpRes, completedRes] = await Promise.all([
          fetch(`/api/xp/total?userId=${user.id}`).then(r => r.json()),
          fetch(`/api/game/complete?userId=${user.id}`).then(r => r.json())
        ]);

        setTotalXP(xpRes.totalXP ?? 0);
        setGenreXP(xpRes.genreXP ?? {});
        setCompletedGameIds(new Set(completedRes.completedGameIds ?? []));
      } catch (err) {
        console.error("Error fetching XP or completed games", err);
      }
    }

    fetchData();
  }, [user]);

  const overallLevel = calculateLevel(totalXP, OVERALL_XP);

  const genreLevels: Record<string, ReturnType<typeof calculateLevel>> = {};
  for (const genre in genreXP) {
    genreLevels[genre] = calculateLevel(genreXP[genre], GENRE_XP);
  }

  function clearXPHistory() {
    setXpHistory([]);
  }

  async function addXP({ amount, genres = [], source, gameTitle }: AddXPParams) {
    if (!user || amount <= 0) return;

    try {
      // call API to persist XP
      await fetch("/api/xp/add", {
        method: "POST",
        body: JSON.stringify({ amount, genres, source, gameTitle }),
      });

      // update local totals
      setTotalXP(prev => prev + amount);
      if (genres.length > 0) {
        const earnedGenreXP = splitGenreXP(amount, genres);
        setGenreXP(prev => applyGenreXP(prev, earnedGenreXP));
      }

      setXpHistory(prev => [
        { id: crypto.randomUUID(), amount, source, gameTitle, timestamp: Date.now() },
        ...prev,
      ]);
    } catch (err) {
      console.error("Error adding XP:", err);
    }
  }

  async function markGameCompleted(game: Game) {
    if (!user || completedGameIds.has(game.rawgId)) return;
    console.log(game)

    try {
      await fetch("/api/game/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawgGame: {
            rawgId: game.rawgId,
            title: game.title,
            genres: game.genres,
          },
        }),
      });
      console.log(game)


      setCompletedGameIds(prev => {
        const next = new Set(prev);
        next.add(game.rawgId);
        return next;
      });
    } catch (err) {
      console.error("Error marking game completed:", err);
    }
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
        completedGameIds,
        markGameCompleted,
      }}
    >
      {children}
    </UserXPContext.Provider>
  );
};

export const useUserXP = () => {
  const context = useContext(UserXPContext);
  if (!context) throw new Error("useUserXP must be used within a UserXPProvider");
  return context;
};
