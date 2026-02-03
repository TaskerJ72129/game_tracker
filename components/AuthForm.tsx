"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signIn() {
    setLoading(true);
    await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
  }

  async function signUp() {
    setLoading(true);
    await supabase.auth.signUp({ email, password });
    setLoading(false);
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

      <button
        onClick={signIn}
        disabled={loading}
        className="w-full bg-emerald-600 text-black py-2 rounded"
      >
        Sign In
      </button>

      <button
        onClick={signUp}
        disabled={loading}
        className="w-full border border-zinc-700 text-white py-2 rounded"
      >
        Sign Up
      </button>
    </div>
  );
}
