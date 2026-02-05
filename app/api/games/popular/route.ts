import { NextResponse } from "next/server";

const RAWG_BASE_URL = "https://api.rawg.io/api/games";

export async function GET() {
  const apiKey = process.env.RAWG_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "RAWG API key not configured" },
      { status: 500 }
    );
  }

  const url = `${RAWG_BASE_URL}?key=${apiKey}&ordering=-rating&page_size=20`;

  const res = await fetch(url, {
    next: { revalidate: 3600 }, // cache for 1 hour
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch games from RAWG" },
      { status: res.status }
    );
  }

  const data = await res.json();

  // Normalize RAWG data
  const games = data.results.map((game: any) => ({
    // id: String(game.id),
    rawgId: game.id,
    title: game.name,
    genres: game.genres.map((g: any) => g.name),
    completed: false,
  }));

  return NextResponse.json(games);
}
