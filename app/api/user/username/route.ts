import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function isValidUsername(username: string): boolean {
    return /^[a-zA-Z0-9_]{2,20}$/.test(username);
}

export async function POST(req: Request) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = data.user.id;

    const body = await req.json().catch(() => ({}));
    const username = typeof body.username === "string" ? body.username.trim() : "";

    if (!isValidUsername(username)) {
        return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { username }, select: { id: true } });
    if (existing && existing.id !== userId) {
        return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }

    await prisma.user.update({
        where: { id: userId },
        data: { username },
    });

    return NextResponse.json({ ok: true });
}
