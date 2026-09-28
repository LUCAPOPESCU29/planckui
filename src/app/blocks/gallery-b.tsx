"use client";

import { useEffect, useRef, useState } from "react";

/* Twelve app-surface blocks: dashboard chrome, feeds, palettes and empty
   states — the pieces a product site needs once the marketing pages are
   done. Monochrome with petrol accents, hairlines over shadows. */

const M = "rgba(29,29,31,0.12)";
const MUTED = "var(--ink-3)";

/* App 01 — dashboard header */
export function AppDash() {
  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h4 className="font-display text-lg font-semibold tracking-[-0.01em] text-ink">Good morning, Maya</h4>
          <p className="mt-0.5 text-sm text-ink-3">Two reviews are waiting and the wall is trending up.</p>
        </div>
        <button type="button" className="btn btn-primary rounded-full">New widget</button>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-[12px] border border-line bg-line">
        {[["Widgets", "4"], ["Collections", "2"], ["Pending", "2"]].map(([l, v]) => (
          <div key={l} className="bg-surface p-4">
            <div className="font-display text-xl font-bold tracking-[-0.02em] text-ink">{v}</div>
            <div className="mt-0.5 text-xs text-ink-3">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* App 02 — notification center */
export function AppNotifications() {
  const items = [
    { dot: true, name: "Marcus Webb", text: "left a 5-star review on the embed", time: "2m" },
    { dot: true, name: "Priya Raman", text: "approved “Fern & Co. — homepage”", time: "18m" },
    { dot: false, name: "Auto-import", text: "pulled 12 reviews from your CSV", time: "1h" },
    { dot: false, name: "Lena Kovač", text: "recorded a video testimonial", time: "3h" },
    { dot: false, name: "Tomás Rivera", text: "shared a collection link", time: "yesterday" },
  ];
  return (
    <div className="card p-2">
      <div className="px-4 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-[0.07em] text-ink-3">Notifications</span>
      </div>
      {items.map((n, i) => (
        <div key={i} className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 transition-colors duration-150 hover:bg-[var(--surface-2)]">
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: n.dot ? "var(--accent)" : "var(--line)" }} aria-hidden="true" />
          <p className="min-w-0 flex-1 truncate text-[13.5px] text-ink-2">
            <b className="font-semibold text-ink">{n.name}</b> {n.text}
          </p>
          <span className="shrink-0 text-xs text-ink-3">{n.time}</span>
        </div>
      ))}
    </div>
  );
}

/* App 03 — command palette */
const CMDS = [
  { g: "Actions", label: "Create a new widget", k: "⌘N" },
  { g: "Actions", label: "Import reviews from CSV", k: "⌘I" },
  { g: "Navigate", label: "Open the Wall of Love editor", k: "⌘E" },
  { g: "Navigate", label: "Browse the catalog", k: "⌘G" },
];
export function AppCommandPalette() {
  const [q, setQ] = useState("");
  const hits = CMDS.filter((x) => x.label.toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{ background: "#0b0f12", borderRadius: 16, padding: "26px 22px 20px" }}>
      <div style={{ maxWidth: 460, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#161c22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "11px 14px" }}>
          <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M9 3a6 6 0 104.4 10.1L17 16.8M9 3a6 6 0 010 12 6 6 0 000-12z" /></svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Type a command or search…"
            aria-label="Command palette"
            style={{ flex: 1, border: 0, outline: "none", background: "transparent", font: "inherit", fontSize: 14, color: "#f2f5f6", caretColor: "oklch(0.82 0.14 152)" }}
          />
          <kbd style={{ border: "1px solid rgba(255,255,255,0.15)", borderRadius: 5, padding: "1px 6px", fontSize: 10, fontFamily: "ui-monospace, monospace", color: "rgba(255,255,255,0.5)" }}>ESC</kbd>
        </div>
        <div style={{ marginTop: 10, background: "#161c22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 6 }}>
          {hits.map((x, i) => (
            <div key={x.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "9px 12px", borderRadius: 8, background: i === 0 ? "rgba(255,255,255,0.06)" : undefined }}>
              <span style={{ fontSize: 13.5, color: "#f2f5f6" }}>{x.label}</span>
              <span style={{ fontSize: 10.5, fontFamily: "ui-monospace, monospace", color: "rgba(255,255,255,0.4)" }}>{x.k}</span>
            </div>
          ))}
          {hits.length === 0 && <div style={{ padding: "9px 12px", fontSize: 13, color: "rgba(255,255,255,0.45)" }}>Nothing matches “{q}”.</div>}
        </div>
        <p style={{ marginTop: 10, fontSize: 11, color: "rgba(255,255,255,0.4)", textAlign: "center" }}>
          Type to filter — the palette is fully interactive.
        </p>
      </div>
    </div>
  );
}

/* App 04 — kanban column */
export function AppKanban() {
  const cards = [
    { t: "Wall of Love — homepage", tags: ["Proof", "Live"], people: ["MO", "JB"] },
    { t: "Countdown — autumn drop", tags: ["Promo"], people: ["PR"] },
    { t: "Rating summary — pricing page", tags: ["Proof", "Design"], people: ["SM", "LK"] },
  ];
  return (
    <div className="card w-full max-w-sm p-3">
      <div className="flex items-center justify-between px-2 py-1.5">
        <span className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-3">In progress</span>
        <span className="rounded-full bg-[var(--surface-2)] px-2 py-0.5 text-[11px] font-semibold tabular-nums text-ink-2">{cards.length}</span>
      </div>
      <div className="flex flex-col gap-2 p-1 pt-1">
        {cards.map((cd) => (
          <div key={cd.t} className="rounded-[10px] border border-line bg-surface p-3 transition-colors duration-150 hover:border-[var(--accent)]">
            <p className="text-[13.5px] font-medium leading-snug text-ink">{cd.t}</p>
            <div className="mt-2.5 flex items-center justify-between">
              <div className="flex gap-1.5">
                {cd.tags.map((t) => (
                  <span key={t} className="rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-[10.5px] font-medium text-[var(--accent)]">{t}</span>
                ))}
              </div>
              <div className="flex -space-x-1.5">
                {cd.people.map((p) => (
                  <span key={p} className="grid h-[22px] w-[22px] place-items-center rounded-full border-2 border-surface bg-[var(--surface-2)] text-[8px] font-bold text-ink-2">{p}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* App 05 — activity feed */
export function AppActivity() {
  const feed = [
    { i: "MO", b: "#22707e", text: "approved 3 reviews in Customer love", time: "12 min" },
    { i: "PR", b: "#1f9d55", text: "embedded a Wall of Love on /pricing", time: "1 hr" },
    { i: "JB", b: "#b45309", text: "imported 46 reviews from CSV", time: "3 hr" },
    { i: "LK", b: "#6d5ae0", text: "connected a custom domain", time: "Tue" },
  ];
  return (
    <div className="card max-w-sm p-5">
      <h4 className="text-xs font-semibold uppercase tracking-[0.07em] text-ink-3">Recent activity</h4>
      <div className="mt-4 flex flex-col">
        {feed.map((f, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[10.5px] font-bold text-white" style={{ background: f.b }}>{f.i}</span>
              {i < feed.length - 1 && <span className="w-px flex-1" style={{ background: "var(--line)" }} aria-hidden="true" />}
            </div>
            <div className="pb-5 pt-1">
              <p className="text-[13px] leading-snug text-ink">{f.text}</p>
              <p className="mt-0.5 text-[11.5px] text-ink-3">{f.time} ago</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* App 06 — invoice line items */
export function AppInvoice() {
  const items = [
    ["Wall of Love embed", "1", "$0.00"],
    ["Badge removal — yearly", "1", "$29.00"],
    ["Custom domain setup", "1", "$0.00"],
  ];
  return (
    <div className="card max-w-md p-6">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-ink">Invoice #0042</span>
        <span className="text-xs text-ink-3">Sep 24, 2026</span>
      </div>
      <table className="mt-5 w-full text-[13px]">
        <tbody>
          {items.map(([d, q, a]) => (
            <tr key={d} className="border-b border-line last:border-0">
              <td className="py-2.5 pr-3 text-ink-2">{d}</td>
              <td className="py-2.5 text-right tabular-nums text-ink-3">×{q}</td>
              <td className="py-2.5 pl-3 text-right font-medium tabular-nums text-ink">{a}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
        <span className="text-sm font-semibold text-ink">Total due</span>
        <span className="font-display text-xl font-bold tracking-[-0.02em] text-ink">$29.00</span>
      </div>
    </div>
  );
}

/* App 07 — empty state */
export function AppEmpty() {
  return (
    <div className="card flex flex-col items-center px-8 py-14 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l2-6h14l2 6v9H3v-9zM3 11h5l1.5 2h5L16 11h5" /></svg>
      </span>
      <h4 className="mt-5 font-display text-lg font-semibold text-ink">Your inbox is empty</h4>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-ink-3">
        Share your collection link and every new review lands here, ready to approve.
      </p>
      <button type="button" className="btn btn-primary mt-6 rounded-full">Share the collection link</button>
    </div>
  );
}

/* App 08 — onboarding steps */
export function AppOnboarding() {
  const steps = [
    { t: "Create your workspace", d: "Done — welcome aboard", state: "done" },
    { t: "Embed your first widget", d: "In progress — pick from 398", state: "active" },
    { t: "Invite your team", d: "Unlocks after your first embed", state: "todo" },
  ];
  return (
    <div className="card max-w-sm p-6">
      <h4 className="text-sm font-semibold text-ink">Set up in three steps</h4>
      <div className="mt-5 flex flex-col gap-4">
        {steps.map((s, i) => (
          <div key={s.t} className="flex gap-3.5">
            <span
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-bold"
              style={{
                background: s.state === "done" ? "var(--ink)" : s.state === "active" ? "var(--accent-soft)" : "var(--surface-2)",
                color: s.state === "done" ? "var(--bg)" : s.state === "active" ? "var(--accent)" : "var(--ink-3)",
                border: s.state === "todo" ? "1px solid var(--line)" : undefined,
              }}
            >
              {s.state === "done" ? "✓" : i + 1}
            </span>
            <div>
              <div className={`text-[13.5px] font-medium ${s.state === "todo" ? "text-ink-3" : "text-ink"}`}>{s.t}</div>
              <div className="text-xs text-ink-3">{s.d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* App 09 — upload dropzone */
export function AppUpload() {
  const file = { name: "reviews-september.csv", size: "48 KB", pct: 64 };
  return (
    <div className="card max-w-md p-6">
      <div className="rounded-[14px] border-2 border-dashed border-line p-8 text-center transition-colors duration-200 hover:border-[var(--accent)]">
        <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]" aria-hidden="true">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4M7 9l5-5 5 5M4 20h16" /></svg>
        </span>
        <p className="mt-4 text-sm font-medium text-ink">Drop your CSV here</p>
        <p className="mt-1 text-xs text-ink-3">or <span className="font-medium text-[var(--accent)]">browse files</span> — up to 10 MB</p>
      </div>
      <div className="mt-4 rounded-[12px] border border-line p-3.5">
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-medium text-ink">{file.name}</span>
          <span className="text-ink-3">{file.size}</span>
        </div>
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[var(--surface-2)]">
          <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${file.pct}%` }} />
        </div>
        <div className="mt-1.5 text-right text-[11px] text-ink-3">{file.pct}%</div>
      </div>
    </div>
  );
}

/* App 10 — mini calendar */
export function AppCalendar() {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const [sel, setSel] = useState(24);
  return (
    <div className="card max-w-xs p-5">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-ink">September</span>
        <span className="text-xs text-ink-3">2026</span>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center">
        {days.map((d, i) => (
          <span key={i} className="pb-1 text-[10.5px] font-medium uppercase text-ink-3">{d}</span>
        ))}
        {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setSel(d)}
            className="grid aspect-square place-items-center rounded-[8px] text-[12.5px] tabular-nums transition-colors duration-150"
            style={
              d === sel
                ? { background: "var(--ink)", color: "var(--bg)", fontWeight: 600 }
                : d === 18
                ? { background: "var(--accent-soft)", color: "var(--accent)", fontWeight: 600 }
                : { color: "var(--ink-2)" }
            }
          >
            {d}
          </button>
        ))}
      </div>
      <div className="mt-3 border-t border-line pt-3 text-xs text-ink-3">
        {sel === 18 ? "Design review — 14:00" : `Sep ${sel} — nothing scheduled`}
      </div>
    </div>
  );
}

/* App 11 — search filters */
export function AppFilters() {
  const cats = ["All", "Proof", "Media", "Collect", "Promo"];
  const [active, setActive] = useState(0);
  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-center gap-2">
        {cats.map((cat, i) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(i)}
            className="rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-150"
            style={
              i === active
                ? { background: "var(--ink)", color: "var(--bg)" }
                : { border: "1px solid var(--line)", color: "var(--ink-2)" }
            }
          >
            {cat}
          </button>
        ))}
        <span className="flex-1" />
        <span className="text-[13px] text-ink-3">
          <b className="font-semibold text-ink tabular-nums">{[398, 12, 34, 18, 24][active]}</b> widgets
        </span>
      </div>
    </div>
  );
}

/* App 12 — upgrade card */
export function AppUpgrade() {
  return (
    <div className="card relative overflow-hidden p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full"
        style={{ background: "var(--accent)", opacity: 0.07, filter: "blur(30px)" }}
      />
      <div className="relative">
        <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.08em] text-[var(--accent)]">Free plan</span>
        <h4 className="mt-3 font-display text-lg font-semibold tracking-[-0.01em] text-ink">Go Pro when the badge starts to itch</h4>
        <ul className="mt-4 flex flex-col gap-2 text-[13.5px] text-ink-2">
          {["Remove the PlanckUi badge", "Custom domain embeds", "White-label exports"].map((f) => (
            <li key={f} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-[var(--accent)]" aria-hidden="true" /> {f}
            </li>
          ))}
        </ul>
        <button type="button" className="btn btn-primary mt-5 w-full rounded-[10px]">Upgrade — $29/yr</button>
        <p className="mt-3 text-center text-xs text-ink-3">The free plan never shrinks. Promise.</p>
      </div>
    </div>
  );
}
