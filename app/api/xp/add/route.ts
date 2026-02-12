// app/api/xp/add/route.ts
import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/requireUser";
import { addXPToUser, getUserGenreXP, getUserXP } from "@/lib/db/userXP";

export async function POST(req: Request) {
    try {
        const userId = await requireUserId();
        const { amount, genres } = await req.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Missing/invalid amount" }, { status: 400 });
        }

        await addXPToUser(userId, amount, genres ?? []);

        // return canonical totals to eliminate lag + keep server truth
        const [totalXP, genreXP] = await Promise.all([
            getUserXP(userId),
            getUserGenreXP(userId),
        ]);

        return NextResponse.json({ totalXP, genreXP });
    } catch (e) {
        const msg = e instanceof Error ? e.message : "UNKNOWN";
        if (msg === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

