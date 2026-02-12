"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { calculateLevel, splitGenreXP, applyGenreXP } from "@/lib/xp/xpUtils";
import { OVERALL_XP, GENRE_XP } from "@/lib/xp/xpConfig";
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
  completedGameIds: Set<string>;
  markGameCompleted: (game: Game) => Promise<void>;
}

const UserXPContext = createContext<UserXPContextType | undefined>(undefined);

export const UserXPProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();

  const [totalXP, setTotalXP] = useState(0);
  const [genreXP, setGenreXP] = useState<GenreXP>({});
  const [completedGameIds, setCompletedGameIds] = useState<Set<string>>(new Set());
  const [xpHistory, setXpHistory] = useState<XPEvent[]>([]);

  // initial fetch
  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      try {
        const [xpRes, genreRes, completedRes] = await Promise.all([
          fetch("/api/xp/total").then(r => r.json()),
          fetch("/api/xp/genre").then(r => r.json()),
          fetch("/api/game/complete").then(r => r.json()),
        ]);

        setTotalXP(xpRes.totalXP ?? 0);
        setGenreXP(genreRes.genreXP ?? {});
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

// OPTIMISTIC XP UPDATE + SERVER RECONCILIATION
async function addXP({ amount, genres = [], source, gameTitle }: AddXPParams) {
    if (!user || amount <= 0) return;

    // 1) optimistic update (instant UI)
    setTotalXP((prev) => prev + amount);

    if (genres.length > 0) {
        const earnedGenreXP = splitGenreXP(amount, genres);
        setGenreXP((prev) => applyGenreXP(prev, earnedGenreXP));
    }

    setXpHistory((prev) => [
        { id: crypto.randomUUID(), amount, source, gameTitle, timestamp: Date.now() },
        ...prev,
    ]);

    // 2) server request (auth-derived userId on server)
    try {
        const res = await fetch("/api/xp/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amount,
                genres,
                source,
                gameTitle,
            }),
        });

        if (!res.ok) {
            throw new Error(`XP_ADD_FAILED_${res.status}`);
        }

        // 3) reconcile with server truth
        // expects: { totalXP: number, genreXP: Record<string, number> }
        const data: { totalXP: number; genreXP: Record<string, number> } = await res.json();

        if (typeof data.totalXP === "number") {
            setTotalXP(data.totalXP);
        }

        if (data.genreXP && typeof data.genreXP === "object") {
            setGenreXP(data.genreXP);
        }
    } catch (err) {
        console.error("Error adding XP:", err);

        // 4) revert optimistic update on failure
        setTotalXP((prev) => prev - amount);

        if (genres.length > 0) {
            const earnedGenreXP = splitGenreXP(amount, genres);
            setGenreXP((prev) => {
                const next = { ...prev };
                for (const g in earnedGenreXP) {
                    next[g] = (next[g] ?? 0) - earnedGenreXP[g];
                    if (next[g] <= 0) delete next[g];
                }
                return next;
            });
        }
    }
}


  async function markGameCompleted(game: Game) {
    if (!user || completedGameIds.has(game.id)) return;

    // optimistic completion
    setCompletedGameIds(prev => new Set(prev).add(game.id));

    try {
      await fetch("/api/game/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawgGame: game }),
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
