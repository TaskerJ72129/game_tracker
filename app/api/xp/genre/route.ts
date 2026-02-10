// app/api/xp/genre/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { getUserGenreXP } from "@/lib/db/userXP";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const genreXP = await getUserGenreXP(userId);
  return NextResponse.json({ genreXP });
}