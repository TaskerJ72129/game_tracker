import { Game } from "@/types/game";

const RAWG_BASE_URL = "https://api.rawg.io/api";

export async function fetchPopularGames(): Promise<Game[]> {
  const res = await fetch(
    `${RAWG_BASE_URL}/games?key=${process.env.RAWG_API_KEY}&ordering=-rating&page_size=20`,
    {
      // Important: tell Next this can be cached
      next: { revalidate: 3600 }, // revalidate every hour
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch games from RAWG");
  }

  const data = await res.json();

  return data.results.map((game: any) => ({
    id: String(game.id),
    rawgId: game.id,
    title: game.name,
    genres: game.genres.map((g: any) => g.name),
    completed: false,
  }));
}
