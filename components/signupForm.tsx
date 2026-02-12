"use client";

import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";

function normalizeUsername(value: string) {
    return value.trim();
}

function validateUsername(value: string) {
    // 3-20, letters/numbers/underscore
    return /^[a-zA-Z0-9_]{2,20}$/.test(value);
}

export default function SignupForm() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const usernameNormalized = useMemo(() => normalizeUsername(username), [username]);

    const usernameOk = usernameNormalized.length > 0 && validateUsername(usernameNormalized);
    const passwordsMatch = password.length > 0 && password === confirmPassword;

    async function signUp() {
        setLoading(true);
        setError(null);
        setMessage(null);

        const emailTrimmed = email.trim();
        const u = usernameNormalized;

        if (!emailTrimmed) {
            setLoading(false);
            setError("Email is required.");
            return;
        }

        if (!usernameOk) {
            setLoading(false);
            setError("Username must be 2–20 characters and use only letters, numbers, or underscore.");
            return;
        }

        if (!password || !passwordsMatch) {
            setLoading(false);
            setError("Passwords must match.");
            return;
        }

        // Save desired username locally until after email confirmation + first login.
        // This avoids needing an authenticated session during sign-up.
        try {
            localStorage.setItem("pending_username", u);
        } catch {
            // ignore
        }

        const { error } = await supabase.auth.signUp({
            email: emailTrimmed,
            password,
        });

        setLoading(false);

        if (error) {
            setError(error.message);
            return;
        }

        setMessage("Account created. Check your email to confirm, then sign in.");
    }

    return (
        <div className="w-full max-w-sm space-y-4 bg-zinc-900 p-6 rounded-xl">
            <div className="space-y-1">
                <h1 className="text-xl font-semibold text-white">Create account</h1>
                <p className="text-sm text-zinc-400">Sign up to start tracking games and earning XP.</p>
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
                placeholder="Username (2–20, letters/numbers/_)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
            />
            {!usernameOk && username.length > 0 && (
                <p className="text-xs text-red-400">Use 2–20 characters: letters, numbers, underscore.</p>
            )}

            <input
                className="w-full p-2 rounded bg-zinc-800 text-white"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
            />

            <input
                className="w-full p-2 rounded bg-zinc-800 text-white"
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
            />
            {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-xs text-red-400">Passwords do not match.</p>
            )}

            {error && <p className="text-sm text-red-400">{error}</p>}
            {message && <p className="text-sm text-emerald-400">{message}</p>}

            <button
                onClick={signUp}
                disabled={loading || !email || !usernameOk || !passwordsMatch}
                className="w-full bg-emerald-600 text-black py-2 rounded disabled:opacity-60"
            >
                {loading ? "Creating account..." : "Sign Up"}
            </button>

            <p className="text-sm text-zinc-400">
                Already have an account?{" "}
                <a className="text-emerald-400 hover:underline" href="/login">
                    Sign in
                </a>
            </p>
        </div>
    );
}
