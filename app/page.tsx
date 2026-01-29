import { fetchPopularGames } from "@/lib/rawg/rawg";
import HomeClient from "./homeClient";

export default async function HomePage() {
  const games = await fetchPopularGames();

  return <HomeClient initialGames={games} />;
}
