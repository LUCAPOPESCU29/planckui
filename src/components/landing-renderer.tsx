import type { LandingTemplate } from "@/lib/landing-templates";

/* Renders a complete landing page from a template — palette, type family,
   hero layout and sections all come from the config. Pure server-rendered
   HTML/CSS: no client JS, reduced-motion handled by the OS. */

const fontFor = (t: LandingTemplate) =>
  t.serifHead
    ? "'Iowan Old Style', Georgia, 'Times New Roman', serif"
    : "var(--font-display), var(--font-body), system-ui, sans-serif";
const bodyFont = `var(--font-body), system-ui, sans-serif`;

export const ACCENT: Record<string, string> = {
  apple: "#0066cc",
  editorial: "#8a6d3b",
  swiss: "#111111",
  dark: "#8fd6a8",
  warm: "#9a5b2c",
  mono: "#8fd6a8",
  brutal: "#1d1d1f",
  gradient: "#22707e",
};

function h(t: LandingTemplate, size: number | string, weight = 650): React.CSSProperties {
  return {
    fontFamily: fontFor(t),
    fontSize: size,
    fontWeight: t.serifHead ? 600 : weight,
    letterSpacing: t.serifHead ? "-0.015em" : "-0.025em",
    lineHeight: 1.08,
    color: t.pal.ink,
  };
}

function Nav({ t }: { t: LandingTemplate }) {
  const links = ["Overview", "Products", "Pricing", "Journal"];
  const apple = t.category === "apple";
  return (
    <nav
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: apple ? "10px 22px" : "18px 32px",
        background: apple ? `color-mix(in oklab, ${t.pal.bg} 82%, transparent)` : "transparent",
        backdropFilter: apple ? "blur(20px)" : undefined,
        borderBottom: apple ? `1px solid ${t.pal.line}` : undefined,
      }}
    >
      <span style={{ fontWeight: 650, fontSize: 15.5, letterSpacing: "-0.01em" }}>{t.brand}</span>
      <div style={{ display: "flex", gap: apple ? 18 : 24 }}>
        {links.map((l) => (
          <span key={l} style={{ fontSize: apple ? 12 : 13.5, opacity: 0.72 }}>{l}</span>
        ))}
      </div>
      <span style={{ fontSize: apple ? 12 : 13.5, opacity: 0.72, fontFamily: "ui-monospace, monospace" }}>menu</span>
    </nav>
  );
}

function CTA({ t, label, filled }: { t: LandingTemplate; label: string; filled: boolean }) {
  return (
    <span
      style={{
        display: "inline-block",
        background: filled ? t.pal.ink : "transparent",
        color: filled ? t.pal.bg : ACCENT[t.category] ?? "#22707e",
        border: filled ? "1px solid transparent" : `1px solid color-mix(in oklab, ${ACCENT[t.category] ?? "#22707e"} 55%, transparent)`,
        borderRadius: t.category === "apple" ? 999 : t.radius ? Math.min(t.radius, 12) : 8,
        padding: "11px 24px",
        font: "inherit",
        fontSize: 14.5,
        fontWeight: 600,
        letterSpacing: "-0.01em",
      }}
    >
      {label} {filled ? "" : "›"}
    </span>
  );
}

function Hero({ t }: { t: LandingTemplate }) {
  const glow =
    t.category === "apple" || t.category === "dark" || t.category === "gradient"
      ? `radial-gradient(60% 90% at 50% -10%, color-mix(in oklab, ${ACCENT[t.category] ?? "#22707e"} 22%, transparent), transparent 70%)`
      : t.category === "brutal"
      ? "none"
      : `radial-gradient(50% 80% at 70% 0%, color-mix(in oklab, ${ACCENT[t.category] ?? "#22707e"} 12%, transparent), transparent 70%)`;
  const centered = t.heroLayout === "center";
  return (
    <div style={{ position: "relative", overflow: "hidden", padding: centered ? "88px 32px 72px" : "88px 32px 64px", textAlign: centered ? "center" : "left" }}>
      {glow !== "none" && <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: glow, pointerEvents: "none" }} />}
      <div style={{ position: "relative", maxWidth: centered ? 720 : 900, margin: "0 auto" }}>
        <p style={{ margin: 0, fontFamily: "ui-monospace, monospace", fontSize: 11.5, letterSpacing: "0.18em", color: ACCENT[t.category] ?? "#22707e" }}>
          {t.kicker}
        </p>
        <h1
          style={{
            ...h(t, "clamp(34px, 6vw, 62px)"),
            margin: centered ? "20px auto 0" : "20px 0 0",
            maxWidth: 760,
          }}
        >
          {t.headline}
        </h1>
        <p style={{
          margin: centered ? "20px auto 0" : "20px 0 0",
          maxWidth: 560,
          fontSize: 16.5, lineHeight: 1.6,
          color: t.pal.muted,
          marginLeft: centered ? "auto" : 0,
        }}>
          {t.sub}
        </p>
        <div style={{ marginTop: 30, display: "flex", gap: 12, justifyContent: centered ? "center" : "flex-start", flexWrap: "wrap" }}>
          <CTA t={t} label={t.cta} filled />
          {t.cta2 && <CTA t={t} label={t.cta2} filled={false} />}
        </div>
      </div>
    </div>
  );
}

function Features({ t }: { t: LandingTemplate }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
      {t.features.map(([title, body]) => (
        <div key={title} style={{ borderTop: `1px solid ${t.pal.line}`, paddingTop: 16 }}>
          <h4 style={{ ...h(t, 15.5, 600), margin: 0 }}>{title}</h4>
          <p style={{ margin: "7px 0 0", fontSize: 13.5, lineHeight: 1.6, color: t.pal.muted }}>{body}</p>
        </div>
      ))}
    </div>
  );
}

function Proof({ t }: { t: LandingTemplate }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 18 }}>
      {t.proof.map(([v, l]) => (
        <div key={l}>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.03em", color: t.pal.ink, fontVariantNumeric: "tabular-nums" }}>{v}</div>
          <div style={{ fontSize: 12.5, color: t.pal.muted, marginTop: 3 }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

function Quote({ t }: { t: LandingTemplate }) {
  return (
    <figure style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
      <blockquote style={{
        margin: 0,
        fontFamily: fontFor(t),
        fontSize: t.serifHead ? 24 : 21,
        fontWeight: t.serifHead ? 600 : 500,
        lineHeight: 1.4,
        letterSpacing: "-0.01em",
        color: t.pal.ink,
      }}>
        “{t.quote}”
      </blockquote>
      <figcaption style={{ marginTop: 14, fontSize: 13, color: t.pal.muted }}>— {t.quoteBy}</figcaption>
    </figure>
  );
}

function CtaBand({ t }: { t: LandingTemplate }) {
  return (
    <div style={{ maxWidth: 620, margin: "0 auto", textAlign: "center" }}>
      <h2 style={{ ...h(t, "clamp(24px,3vw,34px)"), margin: 0 }}>{t.cta} — {t.brand}.</h2>
      <div style={{ marginTop: 22, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <CTA t={t} label={t.cta} filled />
        {t.cta2 && <CTA t={t} label={t.cta2} filled={false} />}
      </div>
    </div>
  );
}

export function LandingRenderer({ t }: { t: LandingTemplate }) {
  return (
    <div style={{ background: t.pal.bg, color: t.pal.ink, minHeight: "100dvh", fontFamily: bodyFont }}>
      <Nav t={t} />
      <Hero t={t} />

      <div style={{ borderTop: `1px solid ${t.pal.line}` }} />
      <div style={{ padding: "56px 32px", maxWidth: 960, margin: "0 auto" }}>
        <Features t={t} />
      </div>

      <div style={{ borderTop: `1px solid ${t.pal.line}`, background: t.category === "apple" ? t.pal.surface : "transparent" }} />
      <div style={{ padding: "56px 32px", maxWidth: 960, margin: "0 auto" }}>
        <Proof t={t} />
      </div>

      <div style={{ borderTop: `1px solid ${t.pal.line}` }} />
      <div style={{ padding: "64px 32px" }}>
        <Quote t={t} />
      </div>

      <div style={{ borderTop: `1px solid ${t.pal.line}` }} />
      <div style={{ padding: "72px 32px", background: t.category === "apple" ? t.pal.surface : "transparent" }}>
        <CtaBand t={t} />
      </div>

      <footer style={{ borderTop: `1px solid ${t.pal.line}`, padding: "22px 32px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <span style={{ fontSize: 12.5, color: t.pal.muted }}>{t.footerLine}</span>
        <span style={{ fontSize: 12.5, color: t.pal.muted, fontFamily: "ui-monospace, monospace" }}>
          Built with PlanckUi blocks
        </span>
      </footer>
    </div>
  );
}
