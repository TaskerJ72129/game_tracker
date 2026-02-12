import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST() {
    try {
        const supabase = await createSupabaseServerClient();
        const { data, error } = await supabase.auth.getUser();

        if (error || !data?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = data.user.id;

        await prisma.user.upsert({
            where: { id: userId },
            create: { id: userId, xp: 0 }, // username is optional
            update: {},
            select: { id: true },
        });

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("ensure user failed:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
