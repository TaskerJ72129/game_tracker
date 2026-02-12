// app/api/xp/total/route.ts
import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/requireUser";
import { getUserXP } from "@/lib/db/userXP";

export async function GET() {
    try {
        const userId = await requireUserId();
        const totalXP = await getUserXP(userId);
        return NextResponse.json({ totalXP });
    } catch (e) {
        const msg = e instanceof Error ? e.message : "UNKNOWN";
        if (msg === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
