"use client";

import { useState } from "react";
import { AppleLogo, spring } from "@/components/navs/shared";

/* Eleven near-black showpieces. Deep petrol and mint on charcoal — the
   "After dark" collection. Monochrome ink elsewhere keeps these the loudest
   thing on the page. */

const K = {
  bg: "#0b0f12",
  card: "#12181d",
  card2: "#161d23",
  line: "rgba(255,255,255,0.09)",
  ink: "#f2f5f6",
  sub: "rgba(242,245,246,0.55)",
  petrol: "oklch(0.72 0.09 203)",
  mint: "oklch(0.82 0.14 152)",
};

const frame = "rounded-[18px] border p-6";

/* Night 01 */
export function NightHero() {
  return (
    <div className="relative overflow-hidden rounded-[18px] px-8 py-20 text-center" style={{ background: K.bg }}>
      <div aria-hidden="true" style={{ position: "absolute", left: "50%", top: -180, width: 640, height: 380, transform: "translateX(-50%)", borderRadius: "50%", background: K.petrol, opacity: 0.25, filter: "blur(100px)" }} />
      <div aria-hidden="true" style={{ position: "absolute", right: "8%", bottom: -140, width: 320, height: 320, borderRadius: "50%", background: K.mint, opacity: 0.09, filter: "blur(90px)" }} />
      <div className="relative">
        <p style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, letterSpacing: "0.22em", color: K.sub, margin: 0 }}>NIGHT BUILD 04 — SHIPPED</p>
        <h3 style={{ fontSize: "clamp(30px, 4.5vw, 46px)", fontWeight: 650, letterSpacing: "-0.025em", lineHeight: 1.05, color: K.ink, margin: "16px 0 0" }}>
          The dark catalog.
        </h3>
        <p style={{ maxWidth: 440, margin: "16px auto 0", fontSize: 15, lineHeight: 1.6, color: K.sub }}>
          Eleven sections that only make sense after sunset — petrol glows, mint
          signals and ink everywhere else.
        </p>
        <div style={{ marginTop: 26, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button type="button" style={{ background: K.mint, color: "#08221a", border: 0, borderRadius: 10, padding: "12px 24px", font: "inherit", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
            Browse dark widgets
          </button>
          <button type="button" style={{ background: "transparent", color: K.ink, border: `1px solid ${K.line}`, borderRadius: 10, padding: "12px 24px", font: "inherit", fontSize: 14, cursor: "pointer" }}>
            View source
          </button>
        </div>
      </div>
    </div>
  );
}

/* Night 02 */
export function NightTiles() {
  const tiles = [
    { t: "Zero config", d: "Sensible defaults that survive contact with real content." },
    { t: "Shadow DOM", d: "Your site's CSS never touches the widget. Neither way." },
    { t: "Lazy by default", d: "Renders when it enters the viewport. Never before." },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {tiles.map((t) => (
        <div key={t.t} className={frame} style={{ background: K.card, borderColor: K.line }}>
          <span style={{ display: "block", width: 34, height: 3, borderRadius: 2, background: K.mint }} aria-hidden="true" />
          <h4 style={{ marginTop: 14, fontSize: 15, fontWeight: 600, color: K.ink }}>{t.t}</h4>
          <p style={{ marginTop: 6, fontSize: 13.5, lineHeight: 1.6, color: K.sub }}>{t.d}</p>
        </div>
      ))}
    </div>
  );
}

/* Night 03 */
export function NightMetrics() {
  const stats = [
    ["590", "live widgets"],
    ["9 KB", "embed script"],
    ["312 ms", "median render"],
    ["0", "tracking calls"],
  ];
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[18px] md:grid-cols-4" style={{ background: K.line }}>
      {stats.map(([v, l]) => (
        <div key={l} style={{ background: K.card, padding: "28px 20px", textAlign: "center" }}>
          <div style={{ fontSize: "clamp(26px,3vw,36px)", fontWeight: 700, letterSpacing: "-0.03em", color: K.ink, fontVariantNumeric: "tabular-nums" }}>{v}</div>
          <div style={{ marginTop: 4, fontSize: 12, color: K.sub }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

/* Night 04 */
export function NightQuotes() {
  const quotes = [
    { q: "The dark widgets made our docs feel like a product launch. Support tickets about ‘is this safe?’ went to zero.", n: "Ada Lindgren", r: "Head of Docs, Volt & Co" },
    { q: "I pasted one line into a client's Webflow site and it just worked. Then I billed them for a week of ‘integration work’. Sorry, Jack.", n: "Jack Mercer", r: "Freelance developer" },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {quotes.map((q) => (
        <div key={q.n} className={frame} style={{ background: K.card, borderColor: K.line }}>
          <svg width="20" height="16" viewBox="0 0 24 18" fill={K.mint} aria-hidden="true"><path d="M0 18V10.8C0 4.8 3.6 1.2 9.6 0l1.2 2.4C7.2 3.6 5.4 5.4 5.4 8.4h4.2V18H0zm13.2 0V10.8c0-6 3.6-9.6 9.6-10.8l1.2 2.4c-3.6 1.2-5.4 3-5.4 6h4.2V18h-9.6z" /></svg>
          <p style={{ marginTop: 12, fontSize: 14.5, lineHeight: 1.65, color: K.ink }}>{q.q}</p>
          <p style={{ marginTop: 14, fontSize: 12.5, color: K.sub }}>— {q.n}, {q.r}</p>
        </div>
      ))}
    </div>
  );
}

/* Night 05 — code card */
const CODE_LINES: Array<[string, string, string]> = [
  ["const", " embed", " = {"],
  ["  type:", " 'wall-of-love'", ","],
  ["  theme:", " 'dark'", ","],
  ["  items:", " collection.approved", ","],
  ["};", "", ""],
];
export function NightCode() {
  const [copied, setCopied] = useState(false);
  return (
    <div className={frame} style={{ background: K.card, borderColor: K.line, padding: 0, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: `1px solid ${K.line}` }}>
        <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 11.5, color: K.sub }}>embed.ts</span>
        <button
          type="button"
          onClick={() => { setCopied(true); window.setTimeout(() => setCopied(false), 1600); }}
          style={{ background: "none", border: `1px solid ${K.line}`, borderRadius: 7, color: K.sub, font: "inherit", fontSize: 11, padding: "3px 10px", cursor: "pointer", transition: `color 150ms ease, border-color 150ms ease` }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre style={{ margin: 0, padding: "18px 20px", fontFamily: "ui-monospace, monospace", fontSize: 12.5, lineHeight: 1.75, overflowX: "auto" }}>
        {CODE_LINES.map(([a, b, c], i) => (
          <div key={i}>
            <span style={{ color: "rgba(255,255,255,0.25)", userSelect: "none", display: "inline-block", width: 22 }}>{i + 1}</span>
            <span style={{ color: "#c8d3f5" }}>{a}</span>
            <span style={{ color: K.mint }}>{b}</span>
            <span style={{ color: "#f2f5f6" }}>{c}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}

/* Night 06 — terminal */
export function NightTerminal() {
  const rows: Array<[string, string, string]> = [
    ["$", "npx planckui add hero", "# dismissed — you already have it"],
    ["✓", "hero copied to clipboard", ""],
    ["$", "git commit -m 'night build'", ""],
    ["✓", "deployed in 38s", ""],
  ];
  return (
    <div className={frame} style={{ background: "#05070a", borderColor: K.line, padding: 0, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 16px", borderBottom: `1px solid ${K.line}` }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <span key={c} style={{ width: 10, height: 10, borderRadius: 999, background: c, opacity: 0.8 }} />
        ))}
        <span style={{ marginLeft: 8, fontFamily: "ui-monospace, monospace", fontSize: 11, color: K.sub }}>zsh — planckui</span>
      </div>
      <div style={{ padding: "16px 18px", fontFamily: "ui-monospace, monospace", fontSize: 12.5, lineHeight: 2 }}>
        {rows.map(([sym, cmd, note], i) => (
          <div key={i}>
            <span style={{ color: K.mint }}>{sym} </span>
            <span style={{ color: K.ink }}>{cmd}</span>
            {note && <span style={{ color: "rgba(242,245,246,0.4)" }}>  {note}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* Night 07 — single pricing card */
export function NightPricing() {
  const feats = ["All 590 widgets", "Badge removal", "Custom domain embeds", "White-label exports"];
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
      <div style={{ width: "100%", maxWidth: 360, background: K.card, border: `1px solid ${K.line}`, borderRadius: 20, padding: 26 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: K.ink }}>Pro — yearly</span>
          <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.03em", color: K.ink }}>$29</span>
        </div>
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 9 }}>
          {feats.map((f) => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, color: K.sub }}>
              <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke={K.mint} strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M4 10.5l4 4L16 6" /></svg>
              {f}
            </div>
          ))}
        </div>
        <button type="button" style={{ marginTop: 20, width: "100%", borderRadius: 10, border: 0, cursor: "pointer", background: K.ink, color: K.bg, font: "inherit", fontWeight: 600, fontSize: 14.5, padding: "12px 0" }}>
          Upgrade the workspace
        </button>
      </div>
    </div>
  );
}

/* Night 08 — profile card */
export function NightProfile() {
  const stats = [["Widgets", "12"], ["Reviews", "184"], ["Following", "312"]];
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
      <div style={{ width: "100%", maxWidth: 320, background: K.card, border: `1px solid ${K.line}`, borderRadius: 20, padding: 26, textAlign: "center" }}>
        <span
          className="mx-auto grid h-16 w-16 place-items-center rounded-full text-[18px] font-bold text-white"
          style={{ background: `linear-gradient(135deg, ${K.petrol}, ${K.mint})` }}
          aria-hidden="true"
        >
          ML
        </span>
        <h4 style={{ marginTop: 14, fontSize: 16.5, fontWeight: 650, color: K.ink }}>Mira Lindholm</h4>
        <p style={{ marginTop: 2, fontSize: 12.5, color: K.sub }}>Design engineer · Copenhagen</p>
        <div style={{ marginTop: 18, display: "flex", justifyContent: "center", gap: 0 }}>
          {stats.map(([l, v], i) => (
            <div key={l} style={{ flex: 1, borderLeft: i ? `1px solid ${K.line}` : undefined }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: K.ink, fontVariantNumeric: "tabular-nums" }}>{v}</div>
              <div style={{ fontSize: 10.5, color: K.sub }}>{l}</div>
            </div>
          ))}
        </div>
        <button type="button" style={{ marginTop: 18, width: "100%", borderRadius: 10, border: `1px solid ${K.line}`, background: "transparent", color: K.ink, font: "inherit", fontWeight: 600, fontSize: 13.5, padding: "10px 0", cursor: "pointer" }}>
          Follow
        </button>
      </div>
    </div>
  );
}

/* Night 09 — podcast episode card */
export function NightPodcast() {
  const [playing, setPlaying] = useState(false);
  const chapters = ["Cold open", "The 9 KB bet", "Why shadow DOM", "Outro"];
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
      <div style={{ width: "100%", maxWidth: 420, background: K.card, border: `1px solid ${K.line}`, borderRadius: 20, padding: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: K.mint }}>EPISODE 14</span>
          <span style={{ fontSize: 11, color: K.sub }}>· 38 min</span>
        </div>
        <h4 style={{ marginTop: 8, fontSize: 17, fontWeight: 650, letterSpacing: "-0.015em", color: K.ink }}>
          The nine-kilobyte bet, two years later
        </h4>
        <p style={{ marginTop: 6, fontSize: 13, lineHeight: 1.6, color: K.sub }}>
          Why we still ship a single script tag, what broke at 40 million renders,
          and the honest cost of shadow DOM.
        </p>
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <button
            type="button"
            aria-label={playing ? "Pause episode" : "Play episode"}
            onClick={() => setPlaying(!playing)}
            style={{ width: 42, height: 42, borderRadius: 999, border: 0, cursor: "pointer", background: K.mint, color: "#08221a", display: "grid", placeItems: "center", flexShrink: 0, transition: `transform 160ms ${spring}` }}
          >
            {playing ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4h4v16H7zM13 4h4v16h-4z" /></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4l14 8-14 8z" /></svg>
            )}
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {chapters.map((c, i) => (
                <span key={c} style={{ fontSize: 10.5, padding: "3px 8px", borderRadius: 999, border: `1px solid ${K.line}`, color: i === 1 ? K.mint : K.sub }}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Night 10 — gradient border CTA */
export function NightCTA() {
  return (
    <div style={{ padding: "8px", borderRadius: 24, background: `linear-gradient(120deg, ${K.petrol}, ${K.mint})` }}>
      <div style={{ borderRadius: 17, background: K.bg, padding: "44px 32px", textAlign: "center" }}>
        <h3 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 650, letterSpacing: "-0.02em", color: K.ink, margin: 0 }}>
          Ship your night build.
        </h3>
        <p style={{ margin: "12px auto 0", maxWidth: 380, fontSize: 14.5, lineHeight: 1.6, color: K.sub }}>
          Everything on this page — dark blocks, light blocks, 590 widgets — is
          free to paste before sunrise.
        </p>
        <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button type="button" style={{ background: K.ink, color: K.bg, border: 0, borderRadius: 10, padding: "12px 26px", font: "inherit", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
            Open the workspace
          </button>
          <button type="button" style={{ background: "transparent", color: K.ink, border: `1px solid ${K.line}`, borderRadius: 10, padding: "12px 26px", font: "inherit", fontSize: 14, cursor: "pointer" }}>
            Read the changelog
          </button>
        </div>
      </div>
    </div>
  );
}

/* Night 11 — light FAQ two-column (breather between the dark runs) */
export function FaqTwoCol() {
  const qa = [
    ["Can I use these on client sites?", "Yes — every block and widget is free for commercial use. Attribution is optional and never required."],
    ["Do the dark blocks support light mode?", "The dark collection is designed dark-first. The light blocks mirror it the other way around."],
    ["What framework do I need?", "None. Blocks are standalone HTML and CSS. Widgets need one script tag."],
    ["How do updates work?", "Embeds update themselves. Blocks are yours to keep — copy a new version when you like one."],
  ];
  return (
    <div className="grid gap-x-12 gap-y-8 md:grid-cols-2">
      {qa.map(([q, a]) => (
        <div key={q}>
          <h4 className="text-[14.5px] font-semibold text-ink">{q}</h4>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-3">{a}</p>
        </div>
      ))}
    </div>
  );
}
