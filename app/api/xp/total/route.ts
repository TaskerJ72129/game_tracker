// app/api/xp/total/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { getUserXP } from "@/lib/db/userXP";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId)
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const totalXP = await getUserXP(userId);
  return NextResponse.json({ totalXP });
}