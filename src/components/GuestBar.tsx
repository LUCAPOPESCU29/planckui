"use client";

import { useState } from "react";

/* Shown to guest workspaces: quiet, dismissible, and the one place email is
   ever asked for — purely optional, purely to save the workspace. */
export function GuestBar() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  if (dismissed) return null;

  async function claim(e: React.FormEvent) {
    e.preventDefault();
    setState("busy");
    setError(null);
    const res = await fetch("/api/auth/claim", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setState("error");
      setError(data.error || "Something went wrong. Try again.");
      return;
    }
    setState("done");
  }

  return (
    <div
      className="border-b border-line bg-[var(--surface-2)]"
      role="status"
      aria-label="Guest workspace notice"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-6 py-2.5 text-sm text-ink-2">
        {state === "done" ? (
          <span>
            Saved — <b className="font-medium text-ink">{email}</b> now keeps this workspace.
          </span>
        ) : (
          <>
            <span>
              <b className="font-medium text-ink">Guest workspace.</b> Everything works, no
              email needed. Add one only if you want this workspace saved to it.
            </span>
            <span className="flex-1" />
            {open ? (
              <form onSubmit={claim} className="flex items-center gap-2">
                {state === "error" && (
                  <span className="text-xs" style={{ color: "var(--danger)" }} role="alert">
                    {error}
                  </span>
                )}
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  aria-label="Email to save this workspace"
                  className="input w-56! py-1.5! text-sm"
                />
                <button type="submit" className="btn btn-primary btn-sm" disabled={state === "busy"}>
                  {state === "busy" ? "Saving…" : "Save workspace"}
                </button>
              </form>
            ) : (
              <button
                type="button"
                className="text-[var(--accent)] transition-transform duration-150 active:scale-[0.97]"
                onClick={() => setOpen(true)}
              >
                Add an email
              </button>
            )}
          </>
        )}
        <button
          type="button"
          aria-label="Dismiss"
          className="text-ink-3 transition-colors hover:text-ink"
          onClick={() => setDismissed(true)}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
