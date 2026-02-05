import { prisma } from "@/lib/prisma/client";
import type { RawgGame } from "@/types/game";

export async function markGameCompleted(userId: string, gameId: string) {
  return prisma.userGameProgress.upsert({
    where: { userId_gameId: { userId, gameId } },
    update: { completed: true, completedAt: new Date() },
    create: { userId, gameId, completed: true, completedAt: new Date() },
  });
}

export async function getOrCreateGame(rawgGame: RawgGame) {
  let game = await prisma.game.findUnique({ where: { rawgId: rawgGame.id } });
  if (!game) {
    game = await prisma.game.create({
      data: {
        id: rawgGame.id.toString(),
        rawgId: rawgGame.id,
        title: rawgGame.title,
        genres: rawgGame.genres.map((g: any) => g.name),
      },
    });
  }
  return game;
}
