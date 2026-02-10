import { fetchPopularGames } from "@/lib/rawg/rawg";
import HomeClient from "./homeClient";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const games = await fetchPopularGames();

  { /* redirect to login if user not logged in */ }
  const supabase = await createSupabaseServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return <HomeClient initialGames={games} />;
}
