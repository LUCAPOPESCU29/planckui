"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Something went wrong. Try again.");
      setBusy(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  async function guest() {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/auth/guest", { method: "POST" });
    if (!res.ok) {
      setError("Something went wrong. Try again.");
      setBusy(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="email" className="label">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          className="input rounded-full"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      {error && (
        <p className="text-sm" style={{ color: "var(--danger)" }} role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="btn btn-primary w-full rounded-full" disabled={busy}>
        {busy ? "Opening…" : "Continue with email"}
      </button>
      <div className="flex items-center gap-3 text-xs text-ink-3">
        <span className="h-px flex-1 bg-[var(--line)]" />
        or
        <span className="h-px flex-1 bg-[var(--line)]" />
      </div>
      <button type="button" className="btn btn-ghost w-full rounded-full" onClick={guest} disabled={busy}>
        Skip — open a guest workspace
      </button>
      <p className="text-sm leading-relaxed text-ink-3">
        Email is optional. Guests get every widget and every block — add an address
        only if you want this workspace saved to it.
      </p>
    </form>
  );
}
