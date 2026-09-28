"use client";

import Link from "next/link";
import { useState } from "react";
import { LANDING_TEMPLATES, type LandingTemplate } from "@/lib/landing-templates";
import { ACCENT } from "@/components/landing-renderer";

/* Landing Pages — fifty+ full landing-page templates rendered live at
   /lp/<slug>. The gallery shows a faithful miniature of each one's hero. */

const CATS = ["All", "apple", "editorial", "swiss", "dark", "warm", "mono", "brutal", "gradient"] as const;
const CAT_LABEL: Record<string, string> = {
  apple: "Apple design", editorial: "Editorial serif", swiss: "Swiss",
  dark: "Dark cinematic", warm: "Warm D2C", mono: "Plain-text dev",
  brutal: "Brutalist", gradient: "Modern SaaS",
};

function MiniPreview({ t }: { t: LandingTemplate }) {
  const accent = ACCENT[t.category] ?? "#22707e";
  return (
    <div
      style={{
        background: t.pal.bg, color: t.pal.ink, borderRadius: 12, overflow: "hidden",
        border: `1px solid ${t.pal.line}`, fontFamily: "system-ui, sans-serif", textAlign: t.heroLayout === "center" ? "center" : "left",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", borderBottom: `1px solid ${t.pal.line}` }}>
        <span style={{ fontSize: 8, fontWeight: 700 }}>{t.brand}</span>
        <span style={{ fontSize: 7, color: t.pal.muted, display: "flex", gap: 5 }}>
          <span>Products</span><span>Pricing</span><span>Journal</span>
        </span>
      </div>
      <div style={{ padding: "16px 12px 12px" }}>
        <div style={{ fontSize: 6, fontWeight: 600, letterSpacing: "0.14em", color: accent, textTransform: "uppercase" }}>{t.kicker}</div>
        <div style={{ fontSize: 15.5, fontWeight: 650, letterSpacing: "-0.02em", lineHeight: 1.1, margin: "4px 0 5px", fontFamily: t.serifHead ? "Georgia, serif" : undefined }}>{t.headline}</div>
        <div style={{ fontSize: 7.5, color: t.pal.muted, lineHeight: 1.5, maxWidth: "88%", marginLeft: t.heroLayout === "center" ? "auto" : 0, marginRight: t.heroLayout === "center" ? "auto" : 0 }}>{t.sub}</div>
        <div style={{ display: "flex", gap: 5, marginTop: 8, justifyContent: t.heroLayout === "center" ? "center" : "flex-start" }}>
          <span style={{ fontSize: 7.5, fontWeight: 600, padding: "3px 9px", borderRadius: t.category === "apple" ? 999 : 6, background: t.pal.ink, color: t.pal.bg }}>{t.cta}</span>
          <span style={{ fontSize: 7.5, fontWeight: 600, padding: "3px 9px", borderRadius: 6, color: accent, border: `1px solid ${accent}55` }}>{t.cta2} ›</span>
        </div>
        <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5, textAlign: "left" }}>
          {t.features.map(([ft, fd]) => (
            <div key={ft} style={{ borderTop: `1px solid ${t.pal.line}`, paddingTop: 4 }}>
              <div style={{ fontSize: 6.5, fontWeight: 600 }}>{ft}</div>
              <div style={{ fontSize: 6, color: t.pal.muted, marginTop: 1 }}>{fd}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LandingPagesPage() {
  const [cat, setCat] = useState<string>("All");
  const shown = cat === "All" ? LANDING_TEMPLATES : LANDING_TEMPLATES.filter((t) => t.category === cat);
  return (
    <div className="flex min-h-screen flex-col">
      <div className="sticky top-4 z-50 flex justify-center px-4 pt-2">
        <Link href="/" className="glass-pill-nav !py-2 text-sm text-ink-2 transition-colors duration-150 hover:text-ink">
          ← Back to PlanckUi
        </Link>
      </div>

      <main className="flex-1 pb-20">
        <section className="mx-auto w-full max-w-6xl px-6 pt-20 pb-8">
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">New section</p>
          <h1 className="mt-3 max-w-3xl text-[clamp(2.2rem,4.5vw,3.4rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
            Landing pages. {LANDING_TEMPLATES.length} of them.
          </h1>
          <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-2">
            Twenty Apple originals and thirty-five more across editorial, Swiss, dark-cinematic,
            warm, plain-text and brutalist families — every one a full live page with its own
            palette, type and copy. Click through and read them like sites.
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {CATS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className="rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-150"
                style={
                  cat === c
                    ? { background: "var(--ink)", color: "var(--bg)" }
                    : { border: "1px solid var(--line)", color: "var(--ink-2)" }
                }
              >
                {c === "All" ? "All" : CAT_LABEL[c] ?? c}
              </button>
            ))}
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-6xl gap-8 px-6 pb-16 md:grid-cols-2">
          {shown.map((t) => (
            <div key={t.slug} className="flex flex-col">
              <Link href={`/lp/${t.slug}`} className="group block rounded-[16px] border border-line p-3 transition-all duration-200 hover:-translate-y-px hover:border-[var(--accent)]">
                <MiniPreview t={t} />
              </Link>
              <div className="mt-4 flex items-start justify-between gap-3 px-1">
                <div>
                  <h2 className="text-[15px] font-semibold text-ink">{t.brand}</h2>
                  <p className="mt-0.5 text-[12.5px] text-ink-3">
                    {CAT_LABEL[t.category] ?? t.category} · {t.headline}
                  </p>
                </div>
                <Link href={`/lp/${t.slug}`} className="shrink-0 pt-1 text-[13px] font-medium text-[var(--accent)]">
                  Open →
                </Link>
              </div>
            </div>
          ))}
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="card p-8 text-center">
            <h2 className="font-display text-2xl font-semibold">Every landing page above is a template.</h2>
            <p className="mx-auto mt-3 max-w-lg text-ink-2">
              Swap the copy and palette and it is yours — rendered as a real page at
              /lp/&lt;name&gt;, free, no email asked.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/blocks" className="btn btn-primary rounded-full">Browse the blocks</Link>
              <Link href="/gallery" className="btn btn-ghost rounded-full">See the widgets</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
