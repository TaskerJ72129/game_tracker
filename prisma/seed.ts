import { prisma } from "lib/prisma";

async function main() {
  const genres = ["RPG", "FPS", "Strategy", "Puzzle"];

  for (const name of genres) {
    await prisma.genre.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  await prisma.user.create({
    data: { username: "testuser" },
  });

  console.log("Seed complete");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
