import { prisma } from "@/lib/prisma/client";

export async function addXPToUser({
  userId,
  amount,
  genres = [],
}: {
  userId: string; // now string to match Supabase
  amount: number;
  genres?: string[];
}) {
  // Add to overall XP
  const user = await prisma.user.update({
    where: { id: userId },
    data: { xp: { increment: amount } },
  });

  // Add XP to each genre
  for (const genreName of genres) {
    const genre = await prisma.genre.findUnique({
      where: { name: genreName },
    });

    if (!genre) continue;

    await prisma.genreXP.upsert({
      where: { userId_genreId: { userId, genreId: genre.id } },
      update: { xp: { increment: Math.floor(amount / genres.length) } },
      create: {
        userId,
        genreId: genre.id,
        xp: Math.floor(amount / genres.length),
      },
    });
  }

  return user;
}
