"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { WidgetPreview } from "./WidgetPreview";
import { defaultsFor, getWidget } from "@/lib/widgets/registry";
import { isIframeWidget, previewIframeSrc } from "@/lib/widgets/renderers";
import type { TestimonialData } from "@/lib/widgets/types";

/* The landing page doubles as a demo website: a fictional Copenhagen coffee
   roastery whose every section is a real PlanckUi widget or block, running
   live. Small mono chips name each component and link to its catalog page,
   so "see how it looks" and "take it with you" are the same gesture.
   Apple-clean: big quiet type, hairline dividers, generous rhythm, motion
   under the house law (transform/opacity, ease-out, reduced-motion safe). */

const ease = "cubic-bezier(0.23, 1, 0.32, 1)";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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

function Reveal({
  delay = 0,
  className,
  children,
}: {
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const [ref, inView] = useInView(0.12);
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

function cfg(id: string, over: Record<string, unknown> = {}) {
  const w = getWidget(id);
  return { ...defaultsFor(w!), ...over };
}

/* Nordhavn's reviews — fictional, but they read like a real wall. */
const NORDHAVN_REVIEWS: TestimonialData[] = [
  { id: "n1", author: "Freja Holm", role: "Regular since 2019", rating: 5, text: "The winter reserve is the only coffee my whole flat agrees on. I set a calendar reminder for the drop, which honestly says more about me than the coffee — but still.", createdAt: "2026-09-12" },
  { id: "n2", author: "Mikkel Sørensen", role: "Barista, Rust", rating: 5, text: "We pulled Nordhavn for a month during our renovation. Customers noticed by day three. Two asked if we had changed roasters.", createdAt: "2026-08-28" },
  { id: "n3", author: "Amira Haddad", role: "Designer", rating: 5, text: "The subscription survives my travels. Pause from an email link, resume when I'm home, zero accounts, zero guilt.", createdAt: "2026-09-01" },
  { id: "n4", author: "Lærke Munk", role: "Runs a yoga studio", rating: 4, text: "We serve it after class. People linger longer now — I consider that a design feature of the coffee.", createdAt: "2026-07-19" },
  { id: "n5", author: "Victor Ahlgren", role: "Photographer", rating: 5, text: "Ordered beans before a shoot in Skagen, they arrived the next morning, ground for my battered moka pot. Small company, serious logistics.", createdAt: "2026-08-09" },
  { id: "n6", author: "Chiara Rossi", role: "Visiting from Milan", rating: 5, text: "I came for the interior photos and stayed for a cardamom bun I still think about. The filter coffee tasted like cherries, which I did not expect north of the Alps.", createdAt: "2026-09-15" },
  { id: "n7", author: "Sofie Berg", role: "Teacher", rating: 5, text: "The decaf converted my husband, a man who once called decaf 'herbal water'. He now has opinions about oxidation. Thank you, I guess.", createdAt: "2026-08-30" },
  { id: "n8", author: "Emil Thorsen", role: "Student", rating: 4, text: "A bag lasts me two weeks of late essays. The Sunday letter is the only newsletter I actually read.", createdAt: "2026-09-20" },
];

/* ---------------------------------------------------------------- chips
   Quiet annotation naming the component behind each section. */

function Chip({ kind, name, href }: { kind: "widget" | "block"; name: string; href: string }) {
  return (
    <div className="flex items-center justify-center gap-2.5">
      <span className="rounded-full border border-line bg-surface px-2.5 py-0.5 font-mono text-[11px] tracking-wide text-ink-3">
        {kind === "widget" ? "WIDGET" : "BLOCK"} · {name}
      </span>
      <Link
        href={href}
        className="text-[11px] font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)]"
      >
        Open it →
      </Link>
    </div>
  );
}

/* ---------------------------------------------------------------- stats
   Count-up band (block) — rAF, ease-out cubic, decimals and suffixes. */

function CountUp({
  target,
  format,
  started,
}: {
  target: number;
  format: (v: number) => string;
  started: boolean;
}) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!started) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setV(target);
      return;
    }
    let t0: number;
    let raf: number;
    const step = (ts: number) => {
      t0 = t0 || ts;
      const p = Math.min(1, (ts - t0) / 1100);
      setV(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [started, target]);
  return <span className="tabular-nums">{format(v)}</span>;
}

function StatsBand() {
  const [ref, inView] = useInView(0.4);
  const stats = [
    { target: 38, fmt: (v: number) => `${Math.round(v)} tons`, label: "roasted a year" },
    { target: 62, fmt: (v: number) => `${Math.round(v)}`, label: "cafés supplied" },
    { target: 4.9, fmt: (v: number) => v.toFixed(1), label: "average rating" },
  ];
  return (
    <div ref={ref} className="grid grid-cols-3 divide-line [&>*+*]:border-l">
      {stats.map((s) => (
        <div key={s.label} className="px-2 py-4 text-center">
          <b className="block font-display text-3xl font-semibold tracking-tight md:text-5xl">
            <CountUp target={s.target} format={s.fmt} started={inView} />
          </b>
          <p className="mt-1.5 text-xs text-ink-3 md:text-sm">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- page */

export function ShowcaseSite() {
  const letterCfg = cfg("newsletter-signup", { text: "The Sunday letter — one useful email a week" });
  return (
    <div>
      {/* planckui intro strip — one quiet line before the demo site starts */}
      <section className="border-b border-line bg-[var(--surface-2)]">
        <div className="mx-auto max-w-6xl px-6 py-3.5 text-center text-[13px] text-ink-2">
          This is <b className="font-medium text-ink">Nordhavn</b>, a demo coffee roastery.
          Every section below is a real, free PlanckUi widget or block — running live, with
          its name attached. Your site could look exactly like this.
        </div>
      </section>

      {/* -------------------------------------------- brand hero (block) */}
      <section className="relative overflow-hidden border-b border-line">
        <div
          className="pointer-events-none absolute left-1/2 top-[-260px] h-[420px] w-[720px] -translate-x-1/2 rounded-full opacity-[0.13] blur-[90px]"
          style={{ background: "var(--accent)" }}
        />
        <div className="relative mx-auto max-w-4xl px-6 pb-20 pt-24 text-center md:pb-28 md:pt-36">
          <Reveal>
            <p className="font-mono text-xs tracking-[0.22em] text-ink-3">
              KØBENHAVN · ROASTED SINCE 2014
            </p>
          </Reveal>
          <Reveal delay={45}>
            <h1 className="mt-5 text-[clamp(2.6rem,6vw,4.6rem)] font-semibold leading-[1.04] tracking-[-0.025em]">
              Coffee, roasted
              <br />
              the slow way.
            </h1>
          </Reveal>
          <Reveal delay={90}>
            <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-ink-2">
              Eight-kilo batches, roasted Thursdays, shipped the same afternoon. No app, no
              loyalty points — just a bag that tastes like the place it came from.
            </p>
          </Reveal>
          <Reveal delay={135}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a href="#letter" className="btn btn-primary rounded-full px-6">
                Get the Sunday letter
              </a>
              <a href="#reviews" className="btn btn-ghost rounded-full px-6">
                Read the reviews
              </a>
            </div>
          </Reveal>
          <Reveal delay={180} className="mx-auto mt-10 max-w-md">
            <WidgetPreview type="rating-badge" config={cfg("rating-badge")} items={NORDHAVN_REVIEWS} />
          </Reveal>
          <Reveal delay={220} className="mt-10">
            <Chip kind="block" name="HERO-01" href="/blocks#hero-block" />
          </Reveal>
          <Reveal delay={240} className="mt-2">
            <Chip kind="widget" name="RATING-BADGE" href="/gallery/rating-badge" />
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------- countdown (widget) */}
      <section className="border-b border-line bg-[var(--surface-2)]">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center md:py-20">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
              The Winter Reserve drops soon.
            </h2>
            <p className="mx-auto mt-2 max-w-md text-[15px] text-ink-2">
              Forty kilos of naturals from the same Huila farm as last year. When it is gone,
              it is gone until next winter.
            </p>
          </Reveal>
          <Reveal delay={80} className="mx-auto mt-8 max-w-xl">
            <WidgetPreview
              type="countdown-timer"
              config={cfg("countdown-timer", {
                text: "The Winter Reserve drops in",
                variant: "inline",
                target: new Date(Date.now() + 5 * 86400000 + 3 * 3600000).toISOString(),
              })}
            />
          </Reveal>
          <Reveal delay={140} className="mt-8">
            <Chip kind="widget" name="COUNTDOWN-TIMER" href="/gallery/countdown-timer" />
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------- reviews (widget) */}
      <section id="reviews" className="scroll-mt-16 border-b border-line">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
          <Reveal className="text-center">
            <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.8rem)] font-semibold tracking-[-0.02em]">
              What the neighbourhood says.
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[15px] text-ink-2">
              Collected from the counter, the letter replies, and a small card by the till.
            </p>
          </Reveal>
          <Reveal delay={80} className="mt-12">
            <WidgetPreview
              type="wall-of-love"
              config={cfg("wall-of-love", { maxWidth: 980 })}
              items={NORDHAVN_REVIEWS}
            />
          </Reveal>
          <Reveal delay={140} className="mt-10">
            <Chip kind="widget" name="WALL-OF-LOVE" href="/gallery/wall-of-love" />
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------- stats (block) */}
      <section className="border-b border-line bg-[var(--surface-2)]">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <Reveal className="mb-8 text-center">
            <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
              A small roastery, in numbers.
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <StatsBand />
          </Reveal>
          <Reveal delay={140} className="mt-8">
            <Chip kind="block" name="STATS-01" href="/blocks#stats-block" />
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------- letter (widget) */}
      <section id="letter" className="scroll-mt-16 border-b border-line">
        <div className="mx-auto max-w-2xl px-6 py-20 text-center md:py-28">
          <Reveal>
            <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-semibold tracking-[-0.02em]">
              The Sunday letter.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] text-ink-2">
              One email a week: what is in the roaster, what is in the cup, and one thing
              worth reading. Written by a human, sent Sunday evenings.
            </p>
          </Reveal>
          <Reveal delay={80} className="mx-auto mt-10 max-w-md">
            <WidgetPreview
              type="newsletter-signup"
              config={letterCfg}
              iframeSrc={
                isIframeWidget("newsletter-signup")
                  ? previewIframeSrc("newsletter-signup", letterCfg) + "&compact=1"
                  : undefined
              }
              style={{ height: 420 }}
            />
          </Reveal>
          <Reveal delay={140} className="mt-10">
            <Chip kind="widget" name="NEWSLETTER-SIGNUP" href="/gallery/newsletter-signup" />
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------- faq (widget) */}
      <section className="border-b border-line bg-[var(--surface-2)]">
        <div className="mx-auto max-w-2xl px-6 py-20 md:py-28">
          <Reveal className="text-center">
            <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-semibold tracking-[-0.02em]">
              Questions, answered.
            </h2>
          </Reveal>
          <Reveal delay={80} className="mt-10">
            <WidgetPreview
              type="faq-accordion"
              config={cfg("faq-accordion", {
                items: [
                  "Whole beans or ground? | Whole beans by default — we grind to your brew method at no extra cost. Choose at checkout.",
                  "How fast is shipping? | Orders before noon ship the same day in Denmark. Rest of the EU: two to four days.",
                  "Can I pause my subscription? | Anytime, from the link in any email. No account, no phone call, no dark pattern.",
                  "Do you supply cafés? | Yes — wholesale starts at five kilos a week. Write to hello@nordhavn.coffee.",
                ].join("\n"),
              })}
            />
          </Reveal>
          <Reveal delay={140} className="mt-10">
            <Chip kind="widget" name="FAQ-ACCORDION" href="/gallery/faq-accordion" />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
