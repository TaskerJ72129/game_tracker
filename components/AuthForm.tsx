"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  async function signIn() {
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  async function signUp() {
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Check your email to confirm your account.");
  }

  return (
    <div className="max-w-sm mx-auto space-y-4 bg-zinc-900 p-6 rounded-xl">
      <h2 className="text-xl font-semibold text-white">Sign in</h2>

      <input
        className="w-full p-2 rounded bg-zinc-800 text-white"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full p-2 rounded bg-zinc-800 text-white"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {message && (
        <p className="text-sm text-emerald-400">{message}</p>
      )}

      <button
        onClick={signIn}
        disabled={loading}
        className="w-full bg-emerald-600 text-black py-2 rounded"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <button
        onClick={signUp}
        disabled={loading}
        className="w-full border border-zinc-700 text-white py-2 rounded"
      >
        {loading ? "Signing up..." : "Sign Up"}
      </button>
    </div>
  );
}
