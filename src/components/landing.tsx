"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WidgetPreview } from "./WidgetPreview";
import { DEMO_TESTIMONIALS } from "@/lib/widgets/demo-data";
import { defaultsFor, getWidget } from "@/lib/widgets/registry";
import type { WidgetConfig } from "@/lib/widgets/types";

function cfgFor(id: string, over: Partial<WidgetConfig> = {}): WidgetConfig {
  const def = getWidget(id);
  return { ...defaultsFor(def!), ...over };
}

/* The hero demo is the real Wall of Love renderer, live on the landing page. */
export function HeroDemo() {
  return (
    <WidgetPreview
      type="wall-of-love"
      config={cfgFor("wall-of-love", { maxWidth: 920, showBadge: true })}
      items={DEMO_TESTIMONIALS.slice(0, 5)}
    />
  );
}

/* Gapless bento of live widgets. Spans: 7+5, then 4+4+4 — no empty cells. */
export function LiveBento() {
  const inThreeDays = new Date(Date.now() + 3 * 86400000).toISOString();
  return (
    <div className="grid grid-flow-dense grid-cols-1 gap-5 md:grid-cols-12">
      <BentoCell
        span="md:col-span-7"
        name="Wall of Love"
        note="Masonry of approved testimonials"
        type="wall-of-love"
        config={cfgFor("wall-of-love", { maxWidth: 900 })}
        items={DEMO_TESTIMONIALS.slice(0, 4)}
      />
      <BentoCell
        span="md:col-span-5"
        name="Countdown timer"
        note="Ticks in the real DOM"
        type="countdown-timer"
        config={cfgFor("countdown-timer", { target: inThreeDays })}
      />
      <BentoCell
        span="md:col-span-4"
        name="Rating summary"
        note="Computed from your data"
        type="rating-summary"
        config={cfgFor("rating-summary")}
        items={DEMO_TESTIMONIALS}
      />
      <BentoCell
        span="md:col-span-4"
        name="FAQ accordion"
        note="Accessible by default"
        type="faq-accordion"
        config={cfgFor("faq-accordion", {
          items:
            "Is it really free? | Yes. Every widget, every feature you see.\nCan I remove the badge? | Someday, on a paid plan. The free plan is the product.\nWill it slow my site? | The script is under 15 KB and renders lazily.",
        })}
      />
      <BentoCell
        span="md:col-span-4"
        name="Link in bio"
        note="A whole page from five lines"
        type="link-in-bio"
        config={cfgFor("link-in-bio")}
      />
    </div>
  );
}

function BentoCell({
  span,
  name,
  note,
  type,
  config,
  items,
}: {
  span: string;
  name: string;
  note: string;
  type: string;
  config: WidgetConfig;
  items?: typeof DEMO_TESTIMONIALS;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useScaleIn(ref);
  return (
    <div ref={ref} className={`card overflow-hidden ${span}`}>
      <div className="flex items-baseline justify-between gap-4 border-b border-line px-5 py-3">
        <span className="font-display text-sm font-semibold">{name}</span>
        <span className="text-xs text-ink-3">{note}</span>
      </div>
      <WidgetPreview type={type} config={config} items={items} />
    </div>
  );
}

function useScaleIn(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.registerPlugin(ScrollTrigger);
      const tween = gsap.fromTo(
        el,
        { scale: 0.92, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        }
      );
      return () => tween.kill();
    });
    return () => mm.revert();
  }, [ref]);
}

/* gpt-taste scrub reveal: words start faint and ink in as the reader scrolls. */
export function ScrubParagraph({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.registerPlugin(ScrollTrigger);
      const words = el.querySelectorAll("span");
      const tween = gsap.to(words, {
        opacity: 1,
        ease: "none",
        stagger: 0.06,
        scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 45%", scrub: true },
      });
      return () => tween.kill();
    });
    return () => mm.revert();
  }, []);
  return (
    <p ref={ref} className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} style={{ opacity: 0.12 }}>
          {w}
          {i < text.split(" ").length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}

/* Desire section: the left column pins (sticky — robust and reduced-motion
   safe); the right column's widgets scale-fade in on scroll via ScrollTrigger. */
export function DesireRight({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.registerPlugin(ScrollTrigger);
      const tweens = Array.from(el.querySelectorAll<HTMLElement>("[data-desire]")).map((node) =>
        gsap.fromTo(
          node,
          { scale: 0.9, opacity: 0.15 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: node, start: "top 85%", once: true },
          }
        )
      );
      return () => tweens.forEach((t) => t.kill());
    });
    return () => mm.revert();
  }, []);
  return (
    <div ref={ref} className="flex flex-col gap-10">
      {children}
    </div>
  );
}

export function DesireItem({
  name,
  note,
  type,
  config,
  items,
}: {
  name: string;
  note: string;
  type: string;
  config: WidgetConfig;
  items?: typeof DEMO_TESTIMONIALS;
}) {
  return (
    <div data-desire className="card overflow-hidden">
      <div className="flex items-baseline justify-between gap-4 border-b border-line px-5 py-3">
        <span className="font-display text-sm font-semibold">{name}</span>
        <span className="text-xs text-ink-3">{note}</span>
      </div>
      <WidgetPreview type={type} config={config} items={items} />
    </div>
  );
}
