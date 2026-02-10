// app/api/game/complete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromSession } from "@/lib/supabase/server";
import { markGameCompleted, getOrCreateGame } from "@/lib/db/game";
import { getUserCompletedGames } from "@/lib/db/userXP";

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromSession();
  if (!userId) return NextResponse.json({ completedGameIds: [] });

  const completedGameIds = await getUserCompletedGames(userId);
  console.log(completedGameIds)
  console.log(typeof(completedGameIds[1]))
  return NextResponse.json({ completedGameIds });
}

/* ---------------- POST complete game ---------------- */

export async function POST(req: NextRequest) {
  const { rawgGame } = await req.json();

  if (!rawgGame?.rawgId) {
    return NextResponse.json({ error: "Invalid game data" }, { status: 400 });
  }

  const userId = await getUserIdFromSession();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ensure game exists
  const game = await getOrCreateGame({
    id: rawgGame.rawgId,
    title: rawgGame.title,
    genres: rawgGame.genres.map((g: string) => ({ name: g })),
  });

  // persist completion
  await markGameCompleted(userId, game.id);

  return NextResponse.json({ success: true });
}