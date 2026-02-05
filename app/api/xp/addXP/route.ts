// app/api/xp/addXP/route.ts
import { NextRequest, NextResponse } from "next/server";
import { addXPToUser } from "@/lib/prisma/service";
import { getUserIdFromSession } from "@/lib/supabase/server"; // helper to get logged-in user ID

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { amount, genres = [], source, gameTitle } = body;

  // get user ID from session/cookie
  const userId = await getUserIdFromSession();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await addXPToUser({ userId, amount, genres });

  return NextResponse.json({ user });
}
