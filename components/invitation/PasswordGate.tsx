"use client";

import { useState } from "react";
import { verifyProjectPassword } from "@/app/invitation/actions";
import type { WeddingData } from "@/lib/types/wedding-data";

interface PasswordGateProps {
  data: WeddingData;
  children: React.ReactNode;
}

export function PasswordGate({ data, children }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  if (unlocked) return <>{children}</>;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await verifyProjectPassword(data.projectId, password);
    setLoading(false);
    if (result.error) {
      setError("Incorrect password. Please try again.");
      return;
    }
    setUnlocked(true);
    window.location.reload();
  }

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none select-none opacity-30 blur-sm">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-5 rounded-2xl border border-white/10 bg-black/80 p-8 text-center text-white"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">
            Private invitation
          </p>
          <h1 className="font-display text-3xl">
            {data.couple.groomName} & {data.couple.brideName}
          </h1>
          <p className="text-sm text-white/70">
            This invitation is password protected.
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter passphrase"
            className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm outline-none focus:border-white/50"
            required
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Checking…" : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
