"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";

/* Blocks — shadcn-inspired sections rebuilt in PlanckUi's design law with
   Apple-flavored surfaces: frosted floating nav (glass only on the
   functional layer), large-title hero, segmented control, spring presses.
   Dependency-free motion: IntersectionObserver reveals, 45 ms stagger,
   interactions under 300 ms ease-out, transform/opacity only, full
   reduced-motion support. */

const ease = "cubic-bezier(0.23, 1, 0.32, 1)";
const spring = "cubic-bezier(0.34, 1.4, 0.64, 1)";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (setInView(true), io.disconnect())),
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

/* Scroll reveal wrapper — children rise once, staggered by `delay`. */
function Reveal({
  delay = 0,
  className,
  children,
}: {
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const [ref, inView] = useInView(0.15);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(16px)",
        transition: `opacity 500ms ${ease} ${delay}ms, transform 500ms ${ease} ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------- icons
   One visual language: 20 px, stroke 1.5, round caps. */

function Icon({ d, children }: { d?: string; children?: React.ReactNode }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {d ? <path d={d} /> : children}
    </svg>
  );
}
const CheckIcon = () => <Icon d="M4 10.5l4 4L16 6" />;

/* ---------------------------------------------------------------- chrome
   Section scaffolding for the showcase page itself. */

/* Self-contained export: fonts, the Tailwind browser build (compiles the
   utility classes at runtime — no install), the token @theme mapping, and
   every custom class the blocks use, scoped under .plk-scope so nothing
   leaks into the host page. Light tokens by default; hosts that add the
   `dark` class on the wrapper get the dark set. */
const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700&family=Golos+Text:wght@400;500;600&family=Geist+Mono&display=swap";

const TAILWIND_THEME = `@theme inline {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-surface-2: var(--surface-2);
  --color-ink: var(--ink);
  --color-ink-2: var(--ink-2);
  --color-ink-3: var(--ink-3);
  --color-line: var(--line);
  --color-line-2: var(--line-2);
  --color-accent: var(--accent);
  --color-accent-strong: var(--accent-strong);
  --color-accent-soft: var(--accent-soft);
  --color-accent-ink: var(--accent-ink);
  --color-ok: var(--ok);
  --shadow-sm: var(--shadow-sm);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --radius-sm: var(--radius-sm);
  --radius-md: var(--radius-md);
  --radius-lg: var(--radius-lg);
  --font-sans: var(--font-body);
  --font-display: var(--font-display);
  --font-mono: var(--font-code);
}`;

const EXPORT_CSS = `
.plk-scope {
  --bg: oklch(0.985 0.004 205);
  --surface: oklch(0.997 0.003 205);
  --surface-2: oklch(0.96 0.006 205);
  --ink: oklch(0.25 0.02 225);
  --ink-2: oklch(0.42 0.02 218);
  --ink-3: oklch(0.55 0.018 212);
  --line: oklch(0.9 0.008 205);
  --line-2: oklch(0.85 0.012 205);
  --accent: oklch(0.47 0.1 203);
  --accent-strong: oklch(0.4 0.1 203);
  --accent-soft: oklch(0.955 0.02 203);
  --accent-ink: oklch(0.98 0.01 200);
  --ok: oklch(0.5 0.1 155);
  --shadow-sm: 0 1px 2px oklch(0.25 0.02 225 / 0.06);
  --shadow-md: 0 1px 2px oklch(0.25 0.02 225 / 0.05), 0 4px 12px oklch(0.25 0.02 225 / 0.06);
  --shadow-lg: 0 2px 4px oklch(0.25 0.02 225 / 0.05), 0 16px 40px oklch(0.25 0.02 225 / 0.12);
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --font-display: "Archivo";
  --font-body: "Golos Text";
  --font-code: "Geist Mono";
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-body), ui-sans-serif, system-ui, sans-serif;
  font-size: 1rem;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}
.plk-scope.dark {
  --bg: oklch(0.175 0.012 222);
  --surface: oklch(0.215 0.014 220);
  --surface-2: oklch(0.25 0.016 218);
  --ink: oklch(0.93 0.008 200);
  --ink-2: oklch(0.75 0.012 205);
  --ink-3: oklch(0.62 0.015 208);
  --line: oklch(0.3 0.016 218);
  --line-2: oklch(0.37 0.018 216);
  --accent: oklch(0.78 0.085 197);
  --accent-strong: oklch(0.84 0.08 197);
  --accent-soft: oklch(0.28 0.03 205);
  --accent-ink: oklch(0.2 0.03 220);
  --ok: oklch(0.75 0.1 158);
  --shadow-sm: 0 1px 2px oklch(0 0 0 / 0.3);
  --shadow-md: 0 1px 2px oklch(0 0 0 / 0.25), 0 4px 12px oklch(0 0 0 / 0.3);
  --shadow-lg: 0 2px 4px oklch(0 0 0 / 0.3), 0 16px 40px oklch(0 0 0 / 0.45);
  line-height: 1.62;
}
.plk-scope h1, .plk-scope h2, .plk-scope h3, .plk-scope h4 {
  font-family: var(--font-display), ui-sans-serif, system-ui, sans-serif;
  letter-spacing: -0.015em;
  line-height: 1.1;
}
.plk-scope ::selection { background: var(--accent); color: var(--accent-ink); }
.plk-scope :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 2px; }
.plk-scope .blocks-canvas {
  position: relative; overflow: hidden;
  border: 1px solid var(--line); border-radius: 20px; background: var(--surface);
}
.plk-scope .blocks-canvas--tinted { background: linear-gradient(180deg, var(--surface-2), var(--surface) 65%); }
.plk-scope .btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
  font-weight: 500; font-size: 0.9375rem; line-height: 1;
  padding: 0.6875rem 1.125rem; border-radius: var(--radius-md);
  border: 1px solid transparent; cursor: pointer; user-select: none; white-space: nowrap;
  transition: transform 160ms var(--ease-out), background-color 160ms ease, border-color 160ms ease, color 160ms ease, box-shadow 160ms ease;
}
.plk-scope .btn:active { transform: scale(0.97); }
.plk-scope .btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
.plk-scope .btn-primary { background: var(--ink); color: var(--bg); }
.plk-scope .btn-primary:hover { background: var(--accent-strong); }
.plk-scope .btn-accent { background: var(--accent); color: var(--accent-ink); }
.plk-scope .btn-accent:hover { background: var(--accent-strong); }
.plk-scope .btn-ghost { background: transparent; color: var(--ink); border-color: var(--line-2); }
.plk-scope .btn-ghost:hover { border-color: var(--ink-3); background: var(--surface-2); }
.plk-scope .card { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-lg); }
.plk-scope .input {
  width: 100%; background: var(--surface); color: var(--ink);
  border: 1px solid var(--line-2); border-radius: var(--radius-md);
  padding: 0.625rem 0.75rem; font: inherit; font-size: 0.9375rem;
  transition: border-color 160ms ease, box-shadow 160ms ease;
}
.plk-scope .input:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
.plk-scope .input::placeholder { color: var(--ink-3); }
.plk-scope .label { display: block; font-size: 0.8125rem; font-weight: 500; color: var(--ink-2); margin-bottom: 0.375rem; }
.plk-scope .glass-pill {
  display: inline-flex; align-items: center; gap: 0.375rem;
  padding: 0.375rem 0.375rem 0.375rem 1rem; border-radius: 999px;
  border: 1px solid color-mix(in oklab, var(--line-2) 80%, transparent);
  background: color-mix(in oklab, var(--surface) 62%, transparent);
  -webkit-backdrop-filter: blur(18px) saturate(1.7);
  backdrop-filter: blur(18px) saturate(1.7);
  box-shadow: var(--shadow-md);
}
.plk-scope .glow {
  position: absolute; width: 520px; height: 520px; border-radius: 50%;
  background: var(--accent); opacity: 0.13; filter: blur(80px); pointer-events: none;
}
.plk-scope .dotgrid {
  background-image: radial-gradient(color-mix(in oklab, var(--ink) 16%, transparent) 1px, transparent 1px);
  background-size: 22px 22px;
  -webkit-mask-image: radial-gradient(ellipse 85% 75% at 50% 20%, #000 25%, transparent 72%);
  mask-image: radial-gradient(ellipse 85% 75% at 50% 20%, #000 25%, transparent 72%);
  pointer-events: none;
}
.plk-scope .spot { position: relative; overflow: hidden; }
.plk-scope .spot-light {
  position: absolute; top: 0; left: 0; width: 460px; height: 460px; border-radius: 50%;
  pointer-events: none; opacity: 0;
  transform: translate(calc(var(--x, 50%) - 50%), calc(var(--y, 50%) - 50%));
  background: radial-gradient(circle, color-mix(in oklab, var(--accent) 9%, transparent), transparent 65%);
  transition: opacity 240ms var(--ease-out);
}
.plk-scope .spot:hover .spot-light { opacity: 1; }
.plk-scope .spot:hover { border-color: var(--line-2); }
@keyframes plk-float {
  0%, 100% { transform: translateY(0) rotate(-1.2deg); }
  50% { transform: translateY(-8px) rotate(-0.6deg); }
}
.plk-scope .float-slow { animation: plk-float 7s ease-in-out infinite; }
.plk-scope .seg {
  position: relative; display: inline-flex; padding: 3px;
  border-radius: 999px; background: var(--surface-2); border: 1px solid var(--line);
}
.plk-scope .seg-thumb {
  position: absolute; top: 3px; bottom: 3px; border-radius: 999px;
  background: var(--surface); box-shadow: var(--shadow-sm), 0 0 0 1px var(--line);
}
.plk-scope .seg > button {
  position: relative; z-index: 1; border-radius: 999px; padding: 0.4375rem 1rem;
  font-size: 0.8125rem; font-weight: 500; color: var(--ink-3); background: none; border: none; cursor: pointer;
}
.plk-scope .seg > button[aria-pressed="true"] { color: var(--ink); }
@keyframes plk-price-in { from { opacity: 0; transform: translateY(6px); } }
.plk-scope .price-in { animation: plk-price-in 220ms var(--ease-out); }
.plk-scope .cta-dark {
  background:
    radial-gradient(120% 90% at 50% -20%, color-mix(in oklab, var(--accent) 26%, transparent), transparent 60%),
    var(--ink);
  color: var(--bg);
}
.plk-scope .mq { overflow: hidden; -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); }
.plk-scope .mq-track { display: flex; gap: 3rem; width: max-content; animation: plk-mq 60s linear infinite; }
.plk-scope .mq:hover .mq-track { animation-play-state: paused; }
.plk-scope .mq-group { display: flex; gap: 3rem; padding-right: 3rem; align-items: baseline; }
@keyframes plk-mq { to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) {
  .plk-scope *, .plk-scope *::before, .plk-scope *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}`;

function buildBlockExport(canvas: HTMLElement, label: string): string {
  const clone = canvas.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("[data-demo-only]").forEach((el) => el.remove());
  const origin = typeof location !== "undefined" ? location.origin : "";
  clone.querySelectorAll('a[href^="/"]').forEach((a) => {
    const href = a.getAttribute("href");
    if (href) a.setAttribute("href", origin + href);
  });
  return `<!-- PlanckUi block: ${label} — free to use on any site, no account, no attribution. -->
<link rel="stylesheet" href="${FONT_LINK}">
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
<style type="text/tailwindcss">
${TAILWIND_THEME}
</style>
<style>${EXPORT_CSS}
</style>
<div class="plk-scope">
${clone.outerHTML}
</div>`;
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    ta.remove();
    return ok;
  }
}

function SectionBlock({
  id,
  tag,
  title,
  desc,
  children,
  tinted,
}: {
  id: string;
  tag: string;
  title: string;
  desc: string;
  children: React.ReactNode;
  tinted?: boolean;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  async function copyHtml() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ok = await copyText(buildBlockExport(canvas, `${tag} · ${title}`));
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2400);
  }

  return (
    <section id={id} className="mx-auto w-full max-w-6xl scroll-mt-20 px-6 py-14 md:py-20">
      <Reveal>
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="block-tag">{tag}</span>
          <div>
            <h2 className="font-display text-xl font-semibold">{title}</h2>
            <p className="mt-0.5 text-sm text-ink-3">{desc}</p>
          </div>
          <span className="flex-1" />
          <span aria-live="polite">
            <button
              type="button"
              onClick={copyHtml}
              className="btn btn-ghost btn-sm rounded-full"
            >
              {copied ? "Copied — paste it into your site" : "Copy HTML"}
            </button>
          </span>
        </div>
      </Reveal>
      <div ref={canvasRef} className={`blocks-canvas ${tinted ? "blocks-canvas--tinted" : ""}`}>
        {children}
      </div>
    </section>
  );
}

/* ================================================================ 01 nav
   Frosted pill nav — glass stays on the floating functional layer. */

function NavDemo() {
  return (
    <div className="relative flex min-h-[300px] items-start justify-center overflow-hidden px-6 py-12">
      <div className="glow" style={{ left: "50%", top: "-60%", translate: "-50% 0" }} />
      <div className="dotgrid absolute inset-0" />
      <Reveal className="relative">
        <nav className="glass-pill" aria-label="Frosted nav demo">
          <span className="mr-3 font-display text-[15px] font-semibold tracking-tight">
            PlanckUi
          </span>
          <span className="hidden gap-1 text-sm text-ink-2 sm:flex">
            {["Widgets", "Blocks", "Pricing"].map((l) => (
              <span key={l} className="rounded-full px-3 py-1.5 transition-colors duration-150 hover:bg-[var(--surface-2)] hover:text-ink">
                {l}
              </span>
            ))}
          </span>
          <button type="button" className="btn btn-primary btn-sm ml-2 rounded-full">
            Open app
          </button>
        </nav>
      </Reveal>
      <p data-demo-only className="absolute inset-x-0 bottom-5 text-center text-xs text-ink-3">
        Blur and saturation on the functional layer only — content beneath stays crisp.
      </p>
    </div>
  );
}

/* ================================================================ 02 hero
   Large-title hero with a floating product card. */

function MiniQuote({ name, role, text, rotate }: { name: string; role: string; text: string; rotate: string }) {
  return (
    <figure
      className="rounded-[14px] border border-line bg-surface p-3.5 shadow-md"
      style={{ transform: `rotate(${rotate})` }}
    >
      <blockquote className="text-[13px] leading-snug text-ink">“{text}”</blockquote>
      <figcaption className="mt-2 text-xs text-ink-3">
        <b className="font-medium text-ink-2">{name}</b> · {role}
      </figcaption>
    </figure>
  );
}

function HeroDemo() {
  return (
    <div className="relative overflow-hidden px-6 pb-20 pt-16 text-center md:pt-24">
      <div className="glow" style={{ left: "50%", top: "-45%", translate: "-50% 0" }} />
      <div className="dotgrid absolute inset-0" />
      <div className="relative mx-auto max-w-3xl">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs text-ink-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--ok)]" />
            New · twelve blocks, free as always
          </span>
        </Reveal>
        <Reveal delay={45}>
          <h1 className="mt-5 text-[clamp(2.4rem,5.5vw,4.1rem)] font-semibold leading-[1.05] tracking-[-0.025em]">
            Proof that feels
            <br />
            native everywhere.
          </h1>
        </Reveal>
        <Reveal delay={90}>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-ink-2">
            Blocks tuned like hardware — frosted glass, quiet motion, zero dependencies.
            Copy any section on this page straight into your site.
          </p>
        </Reveal>
        <Reveal delay={135}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/gallery" className="btn btn-primary rounded-full px-6">
              Browse widgets
            </Link>
            <a href="#pricing-block" className="btn btn-ghost rounded-full px-6">
              See pricing
            </a>
          </div>
        </Reveal>
      </div>
      <Reveal delay={180}>
        <div className="float-slow relative mx-auto mt-14 max-w-md">
          <div className="rounded-[18px] border border-line bg-surface p-4 shadow-lg">
            <div className="mb-3 flex items-center justify-between px-1">
              <span className="text-xs font-medium text-ink-2">Wall of love</span>
              <span className="flex items-center gap-1 text-xs text-ink-3">
                <span aria-hidden="true" className="text-[var(--accent)]">★</span> 4.9 · 218 reviews
              </span>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2">
              <MiniQuote name="Marta Keller" role="ceramist" text="Pasted the snippet Tuesday morning, reviews were live before lunch." rotate="-0.8deg" />
              <MiniQuote name="Jonas Beck" role="Harbor Supply Co." text="Customers finally trust the checkout. Returns dropped." rotate="0.9deg" />
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/* ================================================================ 03 logos */

const WORDMARKS = [
  "Harbor Supply",
  "Café Lune",
  "Atlas Labs",
  "Bloom & Co",
  "Fieldnotes",
  "Verde Studio",
  "Northwind",
  "Maison Kit",
];

function LogoCloud() {
  return (
    <div className="px-6 py-12">
      <p className="mb-8 text-center text-xs uppercase tracking-[0.14em] text-ink-3">
        Running quietly on 40,000+ sites
      </p>
      <div className="mq" style={{ ["--gap" as string]: "3rem" }}>
        <div className="mq-track">
          {[0, 1].map((g) => (
            <div key={g} className="mq-group" aria-hidden={g === 1}>
              {WORDMARKS.map((w) => (
                <span key={w} className="whitespace-nowrap font-display text-lg font-semibold text-ink-3">
                  {w}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================ 04 bento
   Feature cells with a pointer spotlight; the signature cell rotates quotes. */

const SIGNATURE_QUOTES = [
  { text: "Motion with manners — nothing grabs the pointer, everything settles.", who: "Design law, rule 1" },
  { text: "Transform and opacity only. The compositor does the work.", who: "Design law, rule 2" },
  { text: "Reduced-motion users get the same page, already settled.", who: "Design law, rule 3" },
];

function RotatingQuote() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const t = setInterval(() => setI((v) => (v + 1) % SIGNATURE_QUOTES.length), 3200);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="relative mt-4 h-[104px]" aria-live="polite">
      {SIGNATURE_QUOTES.map((q, idx) => (
        <figure
          key={q.who}
          className="absolute inset-0 flex flex-col justify-center"
          style={{
            opacity: idx === i ? 1 : 0,
            transform: idx === i ? "none" : "translateY(10px)",
            transition: `opacity 300ms ${ease}, transform 300ms ${ease}`,
          }}
        >
          <blockquote className="text-[15px] font-medium leading-snug">“{q.text}”</blockquote>
          <figcaption className="mt-2 font-mono text-xs text-ink-3">{q.who}</figcaption>
        </figure>
      ))}
    </div>
  );
}

function SpotlightCell({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--x", `${e.clientX - r.left}px`);
        el.style.setProperty("--y", `${e.clientY - r.top}px`);
      }}
      className={`spot card flex flex-col p-5 transition-colors duration-200 ${className}`}
    >
      <div className="spot-light" />
      <div className="relative flex h-full flex-col">{children}</div>
    </div>
  );
}

function CopyChipDemo() {
  const [copied, setCopied] = useState(false);
  return (
    <div className="mt-auto">
      <div className="flex items-center gap-2 rounded-[var(--radius-md)] border border-line bg-[var(--surface-2)] px-3 py-2">
        <code className="min-w-0 flex-1 truncate font-mono text-[13px]">npx planckui add hero</code>
        <button
          type="button"
          className="text-xs font-medium text-[var(--accent)] transition-transform duration-150 active:scale-95"
          onClick={() => {
            navigator.clipboard?.writeText("npx planckui add hero").catch(() => {});
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
          }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="mt-2 text-xs text-ink-3" aria-live="polite">
        {copied ? "On your clipboard — paste it anywhere." : "CLI-style copy, quiet confirmation."}
      </p>
    </div>
  );
}

function FeatureBento() {
  return (
    <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-3 md:p-8">
      <Reveal className="md:col-span-2 md:row-span-2" delay={0}>
        <SpotlightCell className="h-full">
          <span className="font-mono text-xs text-ink-3">SIGNATURE</span>
          <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight">
            Blocks that move on purpose
          </h3>
          <p className="mt-1 max-w-sm text-sm text-ink-3">
            Every section ships with one orchestrated moment — never decoration.
          </p>
          <div className="mt-auto pt-6">
            <RotatingQuote />
          </div>
        </SpotlightCell>
      </Reveal>
      <Reveal delay={45}>
        <SpotlightCell className="h-full">
          <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[var(--accent-soft)] text-[var(--accent)]">
            <Icon d="M10 3v3m0 8v3m-7-7h3m8 0h3M5 5l2 2m6 6l2 2m0-10l-2 2m-6 6l-2 2" />
          </span>
          <h3 className="mt-3 text-[15px] font-semibold">Dark mode native</h3>
          <p className="mt-1 text-sm text-ink-3">
            Not inverted — re-tuned. Petrol-tinted neutrals in both appearances.
          </p>
          <div className="mt-auto flex gap-1.5 pt-4">
            {["var(--bg)", "var(--surface-2)", "var(--accent)", "var(--ink)"].map((c) => (
              <span key={c} className="h-6 w-6 rounded-full border border-line" style={{ background: c }} />
            ))}
          </div>
        </SpotlightCell>
      </Reveal>
      <Reveal delay={90}>
        <SpotlightCell className="h-full">
          <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[var(--accent-soft)] text-[var(--accent)]">
            <Icon d="M6 3h8l3 3v11a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1zM8 9h6M8 12.5h6M8 16h3" />
          </span>
          <h3 className="mt-3 text-[15px] font-semibold">Under 15 KB</h3>
          <p className="mt-1 text-sm text-ink-3">
            No animation library, no runtime. Observer, rAF, and CSS tokens.
          </p>
          <div className="mt-auto pt-4">
            <CopyChipDemo />
          </div>
        </SpotlightCell>
      </Reveal>
      <Reveal delay={135}>
        <SpotlightCell className="h-full">
          <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[var(--accent-soft)] text-[var(--accent)]">
            <Icon d="M10 3l6 2.5v4c0 3.6-2.4 6.4-6 7.5-3.6-1.1-6-3.9-6-7.5v-4L10 3zM7.5 10l1.8 1.8L13 8.2" />
          </span>
          <h3 className="mt-3 text-[15px] font-semibold">Accessible by default</h3>
          <p className="mt-1 text-sm text-ink-3">
            Focus rings visible, contrast AA, controls 44 pt where hands meet glass.
          </p>
          <div className="mt-auto flex items-center gap-2 pt-4 text-xs text-ink-3">
            <kbd className="rounded-md border border-line bg-[var(--surface-2)] px-1.5 py-0.5 font-mono text-[11px]">Tab</kbd>
            then
            <kbd className="rounded-md border border-line bg-[var(--surface-2)] px-1.5 py-0.5 font-mono text-[11px]">⏎</kbd>
            — keyboard first.
          </div>
        </SpotlightCell>
      </Reveal>
      <Reveal delay={180}>
        <SpotlightCell className="h-full">
          <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[var(--accent-soft)] text-[var(--accent)]">
            <Icon d="M3.5 8L10 3.5 16.5 8v8.5h-13V8zM8 16.5V11h4v5.5" />
          </span>
          <h3 className="mt-3 text-[15px] font-semibold">Any framework</h3>
          <p className="mt-1 text-sm text-ink-3">
            Plain markup and CSS variables. React, Vue, or a static page from 2011.
          </p>
          <div className="mt-auto flex flex-wrap gap-1.5 pt-4 font-mono text-[11px] text-ink-3">
            {["react", "vue", "html"].map((f) => (
              <span key={f} className="rounded-md border border-line bg-[var(--surface-2)] px-2 py-0.5">
                {f}
              </span>
            ))}
          </div>
        </SpotlightCell>
      </Reveal>
    </div>
  );
}

/* ================================================================ 05 stats */

function StatsBand() {
  const [ref, inView] = useInView(0.4);
  const stats: Array<[number, string, (v: number) => string]> = [
    [280, "widgets in the catalog", (v) => String(v)],
    [15, "kilobytes, embed script", (v) => `${v} KB`],
    [0, "dollars, forever", (v) => `$${v}`],
  ];
  const [vals, setVals] = useState(stats.map(() => 0));
  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      setVals(stats.map((s) => s[0]));
      return;
    }
    let t0: number;
    let raf: number;
    const step = (ts: number) => {
      t0 = t0 || ts;
      const p = Math.min(1, (ts - t0) / 900);
      setVals(stats.map((s) => Math.round(s[0] * (1 - Math.pow(1 - p, 3)))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);
  return (
    <div ref={ref} className="grid grid-cols-3 divide-line px-6 py-12 md:px-8 [&>*+*]:border-l">
      {stats.map((s, i) => (
        <div key={s[1]} className="px-2 text-center md:px-4">
          <b className="block font-display text-3xl font-semibold tracking-tight tabular-nums md:text-5xl">
            {s[2](vals[i])}
          </b>
          <p className="mt-1.5 text-xs text-ink-3 md:text-sm">{s[1]}</p>
        </div>
      ))}
    </div>
  );
}

/* ================================================================ 06 pricing */

const TIERS = [
  {
    name: "Free",
    monthly: 0,
    yearly: 0,
    blurb: "Everything on this page, and the whole catalog.",
    features: ["All 280 widgets", "Unlimited collections", "PlanckUi badge", "Community support"],
    cta: "Start free",
    featured: true,
  },
  {
    name: "Pro",
    monthly: 9,
    yearly: 7,
    blurb: "For sites that need the badge gone.",
    features: ["Badge removal", "Custom domain embeds", "CSV import", "Priority support"],
    cta: "Go Pro",
    featured: false,
  },
  {
    name: "Studio",
    monthly: 29,
    yearly: 23,
    blurb: "For agencies shipping client sites.",
    features: ["White-label embeds", "Team seats", "Client workspaces", "Slack support"],
    cta: "Talk to us",
    featured: false,
  },
];

function PricingDemo() {
  const [yearly, setYearly] = useState(false);
  return (
    <div className="px-6 py-12 md:px-8">
      <div className="flex justify-center">
        <div className="seg" role="group" aria-label="Billing period">
          <span
            className="seg-thumb"
            style={{ left: 3, width: "calc(50% - 3px)", transform: yearly ? "translateX(100%)" : "none" }}
            aria-hidden="true"
          />
          <button type="button" className="w-32" aria-pressed={!yearly} onClick={() => setYearly(false)}>
            Monthly
          </button>
          <button type="button" className="w-32" aria-pressed={yearly} onClick={() => setYearly(true)}>
            Yearly · −20%
          </button>
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {TIERS.map((t, i) => (
          <Reveal key={t.name} delay={i * 45}>
            <div
              className={`card relative flex h-full flex-col p-6 ${
                t.featured ? "border-[var(--accent)] shadow-lg md:scale-[1.02]" : ""
              }`}
            >
              {t.featured && (
                <span className="absolute -top-2.5 left-6 rounded-full bg-[var(--accent)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--accent-ink)]">
                  Most loved
                </span>
              )}
              <h3 className="font-display text-lg font-semibold">{t.name}</h3>
              <p className="mt-1 min-h-[40px] text-sm text-ink-3">{t.blurb}</p>
              <div key={String(yearly) + t.name} className="price-in mt-4 flex items-baseline gap-1.5">
                <b className="font-display text-4xl font-semibold tracking-tight tabular-nums">
                  ${yearly ? t.yearly : t.monthly}
                </b>
                <span className="text-sm text-ink-3">{t.monthly === 0 ? "forever" : "/ mo"}</span>
              </div>
              <ul className="mt-5 flex flex-col gap-2.5 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-ink-2">
                    <span className="text-[var(--accent)]">
                      <CheckIcon />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6">
                <Link
                  href="/dashboard"
                  className={`btn w-full rounded-full ${t.featured ? "btn-accent" : "btn-ghost"}`}
                >
                  {t.cta}
                </Link>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-ink-3">
        Demo pricing for the block. PlanckUi itself is free, forever.
      </p>
    </div>
  );
}

/* ================================================================ 07 testimonials */

const QUOTES = [
  { text: "It's the first embed that didn't fight my stylesheet. Dropped in, looked native, done.", name: "Marta Keller", role: "ceramist, Rotterdam" },
  { text: "Our reviews wall loads faster than the page it sits on. I checked twice.", name: "Jonas Beck", role: "Harbor Supply Co." },
  { text: "The moderation inbox is the whole product for me. Approve, done, live.", name: "Priya Nair", role: "Bloom & Co" },
  { text: "I put a countdown and a testimonial wall on a landing page in twenty minutes.", name: "Tom Okafor", role: "Fieldnotes" },
  { text: "Dark mode inside the widget matched my site without a single tweak.", name: "Lena Fischer", role: "Atlas Labs" },
  { text: "Free kept making me suspicious. Eight months in, it's just… free.", name: "Marco Silva", role: "Verde Studio" },
];

function TestimonialsDemo() {
  const [ref, inView] = useInView(0.1);
  return (
    <div ref={ref} className="columns-1 gap-4 p-6 sm:columns-2 md:p-8 lg:columns-3">
      {QUOTES.map((q, i) => (
        <figure
          key={q.name}
          className="card mb-4 break-inside-avoid p-5"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(16px)",
            transition: `opacity 500ms ${ease} ${i * 45}ms, transform 500ms ${ease} ${i * 45}ms`,
          }}
        >
          <blockquote className="text-[15px] leading-relaxed text-ink">“{q.text}”</blockquote>
          <figcaption className="mt-3 text-sm text-ink-3">
            <b className="font-medium text-ink-2">{q.name}</b> · {q.role}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/* ================================================================ 08 faq */

const FAQS = [
  {
    q: "Can I copy a block into my own site?",
    a: "Yes — every section here is plain markup and CSS variables. Copy the JSX or the rendered HTML, bring the token block from globals.css, and the palette follows your theme automatically.",
  },
  {
    q: "Do the animations need a library?",
    a: "No. Reveals use IntersectionObserver, counters use requestAnimationFrame, and everything else is a CSS transition on transform or opacity. Nothing to install, nothing to bundle.",
  },
  {
    q: "How does dark mode work?",
    a: "One set of semantic tokens, two values. Blocks never hard-code a color, so switching the root class re-tunes every surface, line, and shadow at once.",
  },
  {
    q: "What about reduced motion?",
    a: "Every animation checks prefers-reduced-motion and settles instantly into its final state. Ambient loops — marquees, floats — switch off entirely.",
  },
  {
    q: "Will they slow my page down?",
    a: "The embed script is under 15 KB and renders lazily. These blocks add zero JavaScript beyond a few hundred bytes of observers.",
  },
];

function FaqDemo() {
  const [open, setOpen] = useState(0);
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-2.5 px-6 py-12 md:px-8">
      {FAQS.map((f, i) => (
        <div key={f.q} className="overflow-hidden rounded-[12px] border border-line bg-surface">
          <button
            type="button"
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-medium transition-colors duration-150 hover:bg-[var(--surface-2)]"
            onClick={() => setOpen(open === i ? -1 : i)}
            aria-expanded={open === i}
          >
            {f.q}
            <span
              className="shrink-0 text-ink-3"
              style={{ transform: open === i ? "rotate(45deg)" : "none", transition: `transform 200ms ${ease}` }}
            >
              +
            </span>
          </button>
          <div
            style={{
              display: "grid",
              gridTemplateRows: open === i ? "1fr" : "0fr",
              transition: `grid-template-rows 260ms ${ease}`,
            }}
          >
            <p className="overflow-hidden px-5 text-sm leading-relaxed text-ink-3">
              <span className="block pb-4">{f.a}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ================================================================ 09 cta */

function CtaDemo() {
  return (
    <div className="p-6 md:p-10">
      <Reveal>
        <div className="cta-dark relative overflow-hidden rounded-[20px] px-6 py-16 text-center md:py-20">
          <div className="mx-auto max-w-xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Beautiful is now pasteable.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed opacity-80">
              Pick a widget, point it at your data, paste one line. Your site does the rest.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/gallery" className="btn rounded-full bg-[var(--bg)] px-6 text-[var(--ink)] hover:opacity-90">
                Browse the catalog
              </Link>
              <Link href="/" className="btn rounded-full border-white/25 bg-transparent px-6 text-current hover:bg-white/10">
                Read the design brief
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/* ================================================================ 10 login */

function LoginDemo() {
  const [sent, setSent] = useState(false);
  return (
    <div className="flex items-center justify-center px-6 py-14 md:py-20">
      <Reveal className="w-full max-w-sm">
        <div
          className="rounded-[18px] border border-line p-7 shadow-lg"
          style={{
            background: "color-mix(in oklab, var(--surface) 78%, transparent)",
            backdropFilter: "blur(18px) saturate(1.5)",
            WebkitBackdropFilter: "blur(18px) saturate(1.5)",
          }}
        >
          <h3 className="font-display text-xl font-semibold tracking-tight">Sign in to PlanckUi</h3>
          <p className="mt-1 text-sm text-ink-3">No password to remember. We send a link.</p>
          <form
            className="mt-6 flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <label className="label" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              required
              placeholder="you@studio.com"
              className="input"
              autoComplete="email"
            />
            <button type="submit" className="btn btn-primary mt-2 w-full rounded-full">
              Continue
            </button>
          </form>
          <div className="my-5 flex items-center gap-3 text-xs text-ink-3">
            <span className="h-px flex-1 bg-[var(--line)]" />
            or
            <span className="h-px flex-1 bg-[var(--line)]" />
          </div>
          <button type="button" className="btn btn-ghost w-full rounded-full">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <circle cx="7" cy="10" r="3.25" />
              <path d="M10.25 10h7m-2.5 0v2.5m-2.5-2.5v1.75" />
            </svg>
            Continue with a passkey
          </button>
          <p className="mt-5 text-center text-xs text-ink-3" aria-live="polite">
            {sent ? "This is a design preview — no email was sent." : "Free workspace the moment you're in."}
          </p>
        </div>
      </Reveal>
    </div>
  );
}

/* ================================================================ page */

const BLOCKS = [
  ["nav-block", "Nav 01", "Frosted pill nav"],
  ["hero-block", "Hero 01", "Large title + product card"],
  ["logos-block", "Logos 01", "Quiet wordmark marquee"],
  ["bento-block", "Features 01", "Bento with spotlight"],
  ["stats-block", "Stats 01", "Count-up band"],
  ["pricing-block", "Pricing 01", "Segmented billing toggle"],
  ["testimonials-block", "Testimonials 01", "Masonry wall"],
  ["faq-block", "FAQ 01", "Row accordion"],
  ["cta-block", "CTA 01", "Dark glow panel"],
  ["login-block", "Login 01", "Frosted sign-in card"],
];

export default function BlocksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />

      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-6 pb-4 pt-20">
          <Reveal>
            <h1 className="max-w-3xl text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-tight tracking-[-0.02em]">
              Blocks, quietly confident.
            </h1>
          </Reveal>
          <Reveal delay={45}>
            <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-2">
              Ten sections inspired by the shadcn block library, re-tuned through
              PlanckUi&apos;s design law with a little Apple in the glass. Hit
              <b className="font-medium text-ink"> Copy HTML </b> on any block and paste it
              straight into your site — no account, no email, nothing to install. The
              widgets are the same: open the app and a guest workspace is waiting.
            </p>
          </Reveal>
          <Reveal delay={90}>
            <nav aria-label="Jump to a block" className="mt-7 flex flex-wrap gap-2">
              {BLOCKS.map(([id, tag, name]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-ink-2 transition-all duration-150 hover:border-[var(--line-2)] hover:text-ink active:scale-[0.97]"
                >
                  <span className="font-mono text-[10px] text-ink-3">{tag}</span> {name}
                </a>
              ))}
            </nav>
          </Reveal>
        </section>

        <SectionBlock
          id="nav-block"
          tag="Nav 01"
          title="Frosted pill nav"
          desc="Floating glass on the functional layer — the one place blur earns its keep."
          tinted
        >
          <NavDemo />
        </SectionBlock>

        <SectionBlock
          id="hero-block"
          tag="Hero 01"
          title="Large-title hero"
          desc="Big type, tight tracking, one floating product card as the single focal point."
          tinted
        >
          <HeroDemo />
        </SectionBlock>

        <SectionBlock
          id="logos-block"
          tag="Logos 01"
          title="Wordmark marquee"
          desc="Social proof without invented logos — pauses on hover, wraps when motion is reduced."
        >
          <LogoCloud />
        </SectionBlock>

        <SectionBlock
          id="bento-block"
          tag="Features 01"
          title="Bento with a spotlight"
          desc="A pointer-following light, a signature cell, and 45 ms staggered entrances."
        >
          <FeatureBento />
        </SectionBlock>

        <SectionBlock
          id="stats-block"
          tag="Stats 01"
          title="Count-up stats"
          desc="Numbers ease out to their targets once, then hold still."
        >
          <StatsBand />
        </SectionBlock>

        <SectionBlock
          id="pricing-block"
          tag="Pricing 01"
          title="Pricing with a segmented toggle"
          desc="An iOS-style control with a spring thumb; prices crossfade in 220 ms."
        >
          <PricingDemo />
        </SectionBlock>

        <SectionBlock
          id="testimonials-block"
          tag="Testimonials 01"
          title="Testimonial wall"
          desc="Masonry of real-sounding quotes — the flagship widget, as a section."
        >
          <TestimonialsDemo />
        </SectionBlock>

        <SectionBlock
          id="faq-block"
          tag="FAQ 01"
          title="Row accordion"
          desc="grid-template-rows animation — smooth, layout-safe, keyboard friendly."
        >
          <FaqDemo />
        </SectionBlock>

        <SectionBlock
          id="cta-block"
          tag="CTA 01"
          title="Closing panel"
          desc="One dark moment near the end — the boldest surface on the page, used once."
        >
          <CtaDemo />
        </SectionBlock>

        <SectionBlock
          id="login-block"
          tag="Login 01"
          title="Frosted sign-in"
          desc="A calm card with passkey first-class, honest demo feedback, no alerts."
        >
          <LoginDemo />
        </SectionBlock>

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <Reveal>
            <div className="card p-8 text-center">
              <h2 className="font-display text-2xl font-semibold">Take one with you.</h2>
              <p className="mx-auto mt-3 max-w-lg text-ink-2">
                Copy any block above as HTML, or start from a widget — 280 of them, all
                free, no email required.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Link href="/gallery" className="btn btn-primary">
                  Browse the catalog
                </Link>
                <Link href="/animations" className="btn btn-ghost">
                  See the animations
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
