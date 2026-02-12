"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    async function signIn() {
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
        });

        if (error) {
            setLoading(false);
            setError(error.message);
            return;
        }

        // ensure Prisma user row exists now that we have an authenticated session
        const ensureRes = await fetch("/api/user/ensure", { method: "POST" });
        if (!ensureRes.ok) {
            setLoading(false);
            setError("Signed in, but failed to initialize your profile. Please try again.");
            return;
        }

        try {
            const pending = localStorage.getItem("pending_username");
            if (pending) {
                const r = await fetch("/api/user/username", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: pending }),
                });
                if (r.ok) localStorage.removeItem("pending_username");
            }
            } catch {
            // ignore
        }


        setLoading(false);
        router.push("/");
        router.refresh();
    }

    return (
        <div className="w-full max-w-sm space-y-4 bg-zinc-900 p-6 rounded-xl">
            <div className="space-y-1">
                <h1 className="text-xl font-semibold text-white">Sign in</h1>
                <p className="text-sm text-zinc-400">Welcome back. Continue tracking your games.</p>
            </div>

            <input
                className="w-full p-2 rounded bg-zinc-800 text-white"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
            />

            <input
                className="w-full p-2 rounded bg-zinc-800 text-white"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
            />

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
                onClick={signIn}
                disabled={loading || !email || !password}
                className="w-full bg-emerald-600 text-black py-2 rounded disabled:opacity-60"
            >
                {loading ? "Signing in..." : "Sign In"}
            </button>

            <p className="text-sm text-zinc-400">
                Don&apos;t have an account?{" "}
                <a className="text-emerald-400 hover:underline" href="/signup">
                    Create one
                </a>
            </p>
        </div>
    );
}
