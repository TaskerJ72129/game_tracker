import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireUserId(): Promise<string> {
    const supabase = await createSupabaseServerClient();

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user?.id) {
        throw new Error("UNAUTHORIZED");
    }

    return user.id;
}
