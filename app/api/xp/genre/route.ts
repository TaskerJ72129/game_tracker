// app/api/xp/genre/route.ts
import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/requireUser";
import { getUserGenreXP } from "@/lib/db/userXP";

export async function GET() {
    try {
        const userId = await requireUserId();
        const genreXP = await getUserGenreXP(userId);
        return NextResponse.json({ genreXP });
    } catch (e) {
        const msg = e instanceof Error ? e.message : "UNKNOWN";
        if (msg === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
