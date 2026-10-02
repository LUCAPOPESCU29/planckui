"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LANDING_TEMPLATES, type LandingTemplate } from "@/lib/landing-templates";
import { ACCENT } from "@/components/landing-renderer";

/* The gallery follows the site theme: in dark mode every preview re-renders
   in a dark-adapted version of its own palette (accent identity kept). */
function useSiteDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const read = () => setDark(document.documentElement.classList.contains("dark"));
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("pageshow", read);
    return () => obs.disconnect();
  }, []);
  return dark;
}

function darkPal(p: LandingTemplate["pal"]) {
  return {
    bg: `color-mix(in oklab, ${p.bg} 16%, #0b0d10)`,
    surface: `color-mix(in oklab, ${p.surface} 18%, #12151a)`,
    ink: `color-mix(in oklab, ${p.ink} 10%, #eef1f4)`,
    muted: `color-mix(in oklab, ${p.muted} 30%, #aab2ba)`,
    line: "rgba(255,255,255,0.12)",
  };
}

/* Landing Pages — fifty+ full landing-page templates rendered live at
   /lp/<slug>. The gallery shows a faithful miniature of each one's hero. */

const CATS = ["All", "apple", "editorial", "swiss", "dark", "warm", "mono", "brutal", "gradient"] as const;
const CAT_LABEL: Record<string, string> = {
  apple: "Apple design", editorial: "Editorial serif", swiss: "Swiss",
  dark: "Dark cinematic", warm: "Warm D2C", mono: "Plain-text dev",
  brutal: "Brutalist", gradient: "Modern SaaS",
};

function MiniPreview({ t, dark }: { t: LandingTemplate; dark: boolean }) {
  const accent = t.accent ?? ACCENT[t.category] ?? "#22707e";
  const p = dark
    ? {
        bg: `color-mix(in oklab, ${t.pal.bg} 16%, #0b0d10)`,
        surface: `color-mix(in oklab, ${t.pal.surface} 18%, #12151a)`,
        ink: `color-mix(in oklab, ${t.pal.ink} 10%, #eef1f4)`,
        muted: `color-mix(in oklab, ${t.pal.muted} 30%, #aab2ba)`,
        line: "rgba(255,255,255,0.12)",
      }
    : t.pal;
  return (
    <div
      style={{
        background: p.bg, color: p.ink, borderRadius: 12, overflow: "hidden",
        border: `1px solid ${p.line}`, fontFamily: "system-ui, sans-serif", textAlign: t.heroLayout === "center" ? "center" : "left",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", borderBottom: `1px solid ${p.line}` }}>
        <span style={{ fontSize: 8, fontWeight: 700 }}>{t.brand}</span>
        <span style={{ fontSize: 7, color: p.muted, display: "flex", gap: 5 }}>
          <span>Products</span><span>Pricing</span><span>Journal</span>
        </span>
      </div>
      <div style={{ padding: "16px 12px 12px" }}>
        <div style={{ fontSize: 6, fontWeight: 600, letterSpacing: "0.14em", color: accent, textTransform: "uppercase" }}>{t.kicker}</div>
        <div style={{ fontSize: 15.5, fontWeight: 650, letterSpacing: "-0.02em", lineHeight: 1.1, margin: "4px 0 5px", fontFamily: t.serifHead ? "Georgia, serif" : undefined }}>{t.headline}</div>
        <div style={{ fontSize: 7.5, color: p.muted, lineHeight: 1.5, maxWidth: "88%", marginLeft: t.heroLayout === "center" ? "auto" : 0, marginRight: t.heroLayout === "center" ? "auto" : 0 }}>{t.sub}</div>
        <div style={{ display: "flex", gap: 5, marginTop: 8, justifyContent: t.heroLayout === "center" ? "center" : "flex-start" }}>
          <span style={{ fontSize: 7.5, fontWeight: 600, padding: "3px 9px", borderRadius: t.category === "apple" ? 999 : 6, background: p.ink, color: p.bg }}>{t.cta}</span>
          <span style={{ fontSize: 7.5, fontWeight: 600, padding: "3px 9px", borderRadius: 6, color: accent, border: `1px solid ${accent}55` }}>{t.cta2} ›</span>
        </div>
        <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5, textAlign: "left" }}>
          {t.features.map(([ft, fd]) => (
            <div key={ft} style={{ borderTop: `1px solid ${p.line}`, paddingTop: 4 }}>
              <div style={{ fontSize: 6.5, fontWeight: 600 }}>{ft}</div>
              <div style={{ fontSize: 6, color: p.muted, marginTop: 1 }}>{fd}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LandingPagesPage() {
  const [cat, setCat] = useState<string>("All");
  const dark = useSiteDark();
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
            Twenty-eight Apple originals and seventy-two more across editorial, Swiss, dark-
            cinematic, warm, plain-text, brutalist and petrol-mint families — every one a full live page with its own
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
                <MiniPreview t={t} dark={dark} />
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
