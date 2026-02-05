import { prisma } from "@/lib/prisma/client";

// get total XP for a user
export async function getUserXP(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user?.xp ?? 0;
}

// get genre XP map
export async function getUserGenreXP(userId: string) {
  const genres = await prisma.genreXP.findMany({ where: { userId: userId }, include: { genre: true } });
  const map: Record<string, number> = {};
  genres.forEach((g) => {
    map[g.genre.name] = g.xp;
  });
  return map;
}

// get completed game IDs for a user
export async function getUserCompletedGames(userId: string) {
  const progresses = await prisma.userGameProgress.findMany({
    where: { userId, completed: true },
    select: { gameId: true },
  });

  return progresses.map((p) => p.gameId);
}

// add XP to user
export async function addXPToUser(userId: string, amount: number, genres: string[] = []) {
  // increment total XP
  await prisma.user.update({
    where: { id: userId },
    data: { xp: { increment: amount } },
  });

  // increment genre XP
  for (const genreName of genres) {
    let genre = await prisma.genre.findUnique({ where: { name: genreName } });
    if (!genre) {
      // create genre if it doesn't exist
      genre = await prisma.genre.create({ data: { name: genreName } });
    }

    await prisma.genreXP.upsert({
      where: { userId_genreId: { userId, genreId: genre.id } },
      update: { xp: { increment: Math.floor(amount / genres.length) } },
      create: { userId, genreId: genre.id, xp: Math.floor(amount / genres.length) },
    });
  }
}