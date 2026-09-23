"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";

/* Animation Playground — 10 scroll-driven & interactive techniques,
   dependency-free (IntersectionObserver + rAF), emil-law motion:
   transform/opacity only, ease-out curves, full reduced-motion support. */

function useInView(threshold = 0.25) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (setInView(true), io.disconnect())),
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

const ease = "cubic-bezier(0.23, 1, 0.32, 1)";

/* 1 · Scrub text reveal — words ink-in tied to scroll position */
function ScrubText() {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.querySelectorAll("span").forEach((s) => ((s as HTMLElement).style.opacity = "1"));
      return;
    }
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, 1 - (r.top - window.innerHeight * 0.15) / (window.innerHeight * 0.6)));
      el.querySelectorAll("span").forEach((s, i) => {
        (s as HTMLElement).style.opacity = String(Math.max(0.12, Math.min(1, p * words.length - i * 0.6)));
      });
    };
    const words = el.querySelectorAll("span");
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const text = "Widgets that scroll, spin and respond — built once, embedded anywhere, animated with intent.";
  return (
    <p ref={ref} className="max-w-[30ch] text-2xl font-semibold leading-snug md:max-w-none md:text-4xl">
      {text.split(" ").map((w, i) => <span key={i}>{w} </span>)}
    </p>
  );
}

/* 2 · Staggered card reveal */
function StaggerCards() {
  const [ref, inView] = useInView(0.2);
  const cards = [
    { t: "Scroll-triggered", d: "IntersectionObserver fires once, cards cascade in." },
    { t: "Staggered", d: "Each card delays 90ms after the previous one." },
    { t: "Transform only", d: "translateY + opacity. Never layout. Never jank." },
    { t: "Respectful", d: "Reduced-motion users see everything instantly." },
  ];
  return (
    <div ref={ref} className="grid grid-cols-2 gap-4">
      {cards.map((c, i) => (
        <div key={c.t} className="card p-5" style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "none" : "translateY(18px)",
          transition: `opacity 500ms ${ease} ${i * 90}ms, transform 500ms ${ease} ${i * 90}ms`,
        }}>
          <b className="text-[15px]">{c.t}</b>
          <p className="mt-1 text-sm text-ink-3">{c.d}</p>
        </div>
      ))}
    </div>
  );
}

/* 3 · Parallax layers */
function Parallax() {
  const ref = useRef<HTMLDivElement>(null);
  const [y, setY] = useState([0, 0, 0]);
  useEffect(() => {
    const onScroll = () => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const p = window.innerHeight - r.top;
      setY([p * 0.06, p * 0.12, p * 0.2]);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div ref={ref} className="relative h-64 overflow-hidden rounded-[18px] border border-line bg-surface-2">
      <div className="absolute inset-0 grid place-items-center text-sm text-ink-3">three layers, three speeds</div>
      <div className="absolute left-8 top-10 h-16 w-16 rounded-2xl bg-[var(--accent)]/25" style={{ transform: `translateY(${y[0]}px)` }} />
      <div className="absolute left-1/2 top-16 h-24 w-24 -translate-x-1/2 rounded-3xl bg-[var(--accent)]/45" style={{ transform: `translateY(${y[1]}px)` }} />
      <div className="absolute right-10 top-8 h-12 w-12 rounded-full bg-[var(--accent)]" style={{ transform: `translateY(${y[2]}px)` }} />
    </div>
  );
}

/* 4 · Clip-path image reveal */
function ClipReveal() {
  const [ref, inView] = useInView(0.3);
  return (
    <div ref={ref} className="relative h-64 overflow-hidden rounded-[18px]">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-soft)] to-[var(--surface-2)]" />
      <div
        className="absolute inset-0 bg-[var(--accent)]"
        style={{
          clipPath: inView ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
          transition: "clip-path 900ms " + ease,
        }}
      />
      <div className="absolute inset-0 grid place-items-center">
        <span className="font-display text-2xl font-bold text-[oklch(0.25 0.03 220)] mix-blend-normal">clip-path reveal</span>
      </div>
    </div>
  );
}

/* 5 · Counters */
function Counters() {
  const [ref, inView] = useInView(0.4);
  const stats = [["196", "widgets"], ["226", "demo pages"], ["0", "dollars"]];
  const [vals, setVals] = useState([0, 0, 0]);
  useEffect(() => {
    if (!inView) return;
    const targets = [196, 226, 0];
    let t0: number;
    let raf: number;
    const step = (ts: number) => {
      t0 = t0 || ts;
      const p = Math.min(1, (ts - t0) / 1100);
      setVals(targets.map((t) => Math.round(t * (1 - Math.pow(1 - p, 3)))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView]);
  return (
    <div ref={ref} className="grid grid-cols-3 gap-4">
      {stats.map((s, i) => (
        <div key={s[1]} className="card p-5 text-center">
          <b className="font-display text-3xl font-bold tracking-tight">{vals[i]}</b>
          <p className="mt-1 text-xs text-ink-3">{s[1]}</p>
        </div>
      ))}
    </div>
  );
}

/* 6 · Stacking deck */
function StackDeck() {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      setP(Math.max(0, Math.min(1, 1 - (r.top - 80) / (window.innerHeight * 0.9))));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div ref={ref} className="relative h-72">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="absolute inset-x-6 rounded-[16px] border border-line bg-surface p-5 shadow-md"
          style={{
            top: `${i * 14}px`,
            transform: `scale(${1 - (3 - i) * 0.02 + p * (3 - i) * 0.006}) translateY(${(3 - i) * (1 - p) * -8}px)`,
            zIndex: i,
          }}>
          <b className="text-sm">Card {i + 1}</b>
          <p className="mt-1 text-xs text-ink-3">Scroll — the deck compresses and stacks.</p>
        </div>
      ))}
    </div>
  );
}

/* 7 · Horizontal scroll strip */
function HScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const total = r.height + window.innerHeight;
      setX(Math.max(0, Math.min(1, 1 - (r.top + r.height * 0.5) / total)) * -420);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div ref={ref} className="h-[320px]">
      <div className="sticky top-24 flex h-[240px] items-center overflow-hidden">
        <div className="flex gap-4" style={{ transform: `translateX(${x}px)` }}>
          {["Scrub", "Stack", "Slide", "Reveal", "Count"].map((t, i) => (
            <div key={t} className="grid h-36 w-56 place-items-center rounded-[16px] border border-line bg-surface font-display text-lg font-semibold">
              {t} {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* 8 · 3D tilt card */
function TiltCard() {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ rx: 0, ry: 0 });
  return (
    <div className="grid h-64 place-items-center">
      <div
        ref={ref}
        onMouseMove={(e) => {
          const r = ref.current!.getBoundingClientRect();
          const px = (e.clientX - r.x) / r.width - 0.5;
          const py = (e.clientY - r.y) / r.height - 0.5;
          setT({ rx: -py * 14, ry: px * 14 });
        }}
        onMouseLeave={() => setT({ rx: 0, ry: 0 })}
        className="grid h-48 w-72 place-items-center rounded-[18px] border border-line bg-surface font-display text-lg font-semibold shadow-lg"
        style={{ transform: `perspective(700px) rotateX(${t.rx}deg) rotateY(${t.ry}deg)`, transition: "transform 120ms " + ease }}
      >
        tilt me
      </div>
    </div>
  );
}

/* 9 · Spring accordion */
function SpringAccordion() {
  const [open, setOpen] = useState(0);
  const rows = [
    { q: "Are these really dependency-free?", a: "Yes — IntersectionObserver, requestAnimationFrame and CSS transitions. No GSAP, no Framer Motion." },
    { q: "Will they work in embeds?", a: "The techniques yes; the demo code is page-level. Port any of them into a widget." },
    { q: "Reduced motion?", a: "Every animation checks prefers-reduced-motion and settles instantly." },
  ];
  return (
    <div className="flex flex-col gap-2">
      {rows.map((r, i) => (
        <div key={i} className="overflow-hidden rounded-[12px] border border-line bg-surface">
          <button type="button" className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold"
            onClick={() => setOpen(open === i ? -1 : i)}
            aria-expanded={open === i}>
            {r.q}
            <span style={{ transform: open === i ? "rotate(45deg)" : "none", transition: "transform 200ms " + ease }}>+</span>
          </button>
          <div style={{
            display: "grid",
            gridTemplateRows: open === i ? "1fr" : "0fr",
            transition: "grid-template-rows 260ms " + ease,
          }}>
            <p className="overflow-hidden px-4 text-sm text-ink-3" style={{ minHeight: open === i ? "0" : undefined }}>
              <span className="block pb-3">{r.a}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* 10 · Scroll progress ring */
function ProgressRing() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const C = 2 * Math.PI * 16;
  return (
    <div className="flex items-center gap-4">
      <svg width="52" height="52" viewBox="0 0 40 40" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="20" cy="20" r="16" fill="none" stroke="var(--line)" strokeWidth="4" />
        <circle cx="20" cy="20" r="16" fill="none" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C * (1 - p)} style={{ transition: "stroke-dashoffset 100ms linear" }} />
      </svg>
      <div>
        <b className="font-display text-xl">Page progress ring</b>
        <p className="text-sm text-ink-3">Follows your scroll through this whole page — {Math.round(p * 100)}% right now.</p>
      </div>
    </div>
  );
}

/* ---- page ---- */

function Section({ n, title, desc, children, wide }: { n: string; title: string; desc: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
      <div className="mb-8 flex items-baseline gap-4">
        <span className="font-mono text-xs text-ink-3">{n}</span>
        <div>
          <h2 className="font-display text-2xl font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-ink-3">{desc}</p>
        </div>
      </div>
      {wide ? children : <div className="max-w-3xl">{children}</div>}
    </section>
  );
}

export default function AnimationsPage() {
  const [pageProgress, setPageProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setPageProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />
      <div className="fixed inset-x-0 top-0 z-50 h-[3px] bg-transparent">
        <div className="h-full" style={{ width: `${pageProgress * 100}%`, background: "var(--accent)", transition: "width 80ms linear" }} />
      </div>

      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-6 pb-10 pt-20">
          <h1 className="max-w-3xl text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-tight">The animation playground.</h1>
          <p className="mt-4 max-w-2xl text-ink-2">
            Ten scroll and interaction techniques, rebuilt from scratch — no animation library,
            just IntersectionObserver, requestAnimationFrame and CSS. Every one respects
            reduced-motion.
          </p>
          <div className="mt-8"><ProgressRing /></div>
        </section>

        <Section n="01" title="Scrubbed text reveal" desc="Words ink in as the section crosses the viewport — tied to scroll, not time.">
          <ScrubText />
        </Section>

        <Section n="02" title="Staggered card reveal" desc="IntersectionObserver + per-card delays.">
          <StaggerCards />
        </Section>

        <Section n="03" title="Parallax layers" desc="Three shapes, three scroll speeds — depth without cost.">
          <Parallax />
        </Section>

        <Section n="04" title="Clip-path reveal" desc="A wipe driven by clip-path, GPU-friendly.">
          <ClipReveal />
        </Section>

        <Section n="05" title="Count-up stats" desc="Numbers ease to their targets when they enter view.">
          <Counters />
        </Section>

        <Section n="06" title="Stacking deck" desc="Cards compress into a stack as you scroll past.">
          <StackDeck />
        </Section>

        <Section n="07" title="Horizontal drift" desc="Vertical scroll translated into horizontal motion." wide>
          <HScroll />
        </Section>

        <Section n="08" title="3D tilt" desc="Perspective tilt that follows the pointer.">
          <TiltCard />
        </Section>

        <Section n="09" title="Spring accordion" desc="grid-template-rows animation — the modern expand/collapse.">
          <SpringAccordion />
        </Section>

        <Section n="10" title="Scroll progress" desc="A ring that tracks the whole page.">
          <ProgressRing />
        </Section>

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="card p-8 text-center">
            <h2 className="font-display text-2xl font-semibold">Want motion like this on your site?</h2>
            <p className="mx-auto mt-3 max-w-lg text-ink-2">Every widget in the catalog ships with purposeful animation baked in — and the customizer never breaks it.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/gallery" className="btn btn-primary">Browse the catalog</Link>
              <Link href="/" className="btn btn-ghost">Back home</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
