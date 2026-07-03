"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn(email, password);
    if (result.error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }
    router.push("/admin/projects");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">
            Invithem
          </p>
          <h1 className="font-display mt-2 text-4xl">Admin</h1>
          <p className="mt-2 text-sm text-muted">Sign in to manage your wedding</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-card-border bg-card p-8 shadow-sm"
        >
          <Input
            label="Email"
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <p className="rounded-lg bg-red-400/10 px-4 py-3 text-sm text-red-400">
              {error}
            </p>
          )}
          <Button type="submit" disabled={loading} className="w-full" size="lg">
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
