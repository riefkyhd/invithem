"use client";

import { useState } from "react";
import { verifyProjectPassword } from "@/app/invitation/actions";
import type { PasswordGatePreview } from "@/lib/invitation/load-wedding-page";

interface PasswordGateProps {
  preview: PasswordGatePreview;
}

export function PasswordGate({ preview }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await verifyProjectPassword(preview.projectId, password);
    setLoading(false);
    if (result.error) {
      setError("Incorrect password. Please try again.");
      return;
    }
    window.location.reload();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-2xl border border-white/10 bg-black/80 p-8 text-center text-white"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-white/60">
          Private invitation
        </p>
        <h1 className="font-display text-3xl">
          {preview.groomName} & {preview.brideName}
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
          autoComplete="current-password"
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
  );
}
