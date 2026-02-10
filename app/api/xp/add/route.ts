// app/api/xp/add/route.ts
import { NextResponse } from "next/server";
import { addXPToUser } from "@/lib/db/userXP";

export async function POST(req: Request) {
  const { userId, amount, genres } = await req.json();

  if (!userId || !amount) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  await addXPToUser(userId, amount, genres ?? []);

  return NextResponse.json({ success: true });
}
