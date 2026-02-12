import { prisma } from "@/lib/prisma/client";

async function main() {
  const genres = ["RPG", "FPS", "Strategy", "Puzzle"];

  for (const name of genres) {
    await prisma.genre.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("Seed complete");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
