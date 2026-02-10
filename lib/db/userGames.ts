import { prisma } from "@/lib/prisma/client";
import { getOrCreateGame } from "./game";
import type { RawgGame } from "@/types/game";

export async function markGameCompleted(userId: string, rawgGame: RawgGame) {
  // ensure the game exists
  const dbGame = await getOrCreateGame(rawgGame);

  // upsert progress
  await prisma.userGameProgress.upsert({
    where: { userId_gameId: { userId, gameId: dbGame.id } },
    update: { completed: true, completedAt: new Date() },
    create: { userId, gameId: dbGame.id, completed: true, completedAt: new Date() },
  });

  return dbGame;
}
