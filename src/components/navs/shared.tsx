"use client";

import { useEffect, useRef, useState } from "react";

/* Shared primitives for the /navigations gallery: reveal-on-scroll, dropdown
   mechanics, section scaffolding, and the real Apple mark. Emil motion law:
   transform/opacity only, under 300ms, ease-out, reduced-motion safe. */

export const ease = "cubic-bezier(0.23, 1, 0.32, 1)";
export const spring = "cubic-bezier(0.34, 1.4, 0.64, 1)";

export function useInView(threshold = 0.12) {
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

export function Reveal({
  delay = 0,
  className,
  children,
}: {
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const [ref, inView] = useInView(0.1);
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

/* Close a dropdown on outside pointer + Escape. */
export function useDismiss(open: boolean, onClose: () => void, ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => {
      if (e.target instanceof Node && ref.current && !ref.current.contains(e.target)) onClose();
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("keydown", key);
    };
  }, [open, onClose, ref]);
}

export const APPLE_PATH =
  "M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701";

export function AppleLogo({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={APPLE_PATH} />
    </svg>
  );
}

export function Chev({ open = false, size = 11 }: { open?: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ transform: open ? "rotate(180deg)" : "none", transition: `transform 180ms ${ease}` }}
    >
      <path d="M2.5 4.5L6 8l3.5-3.5" />
    </svg>
  );
}

export function I({ d, size = 16 }: { d: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
export const I_SEARCH = "M9 3a6 6 0 104.4 10.1L17 16.8M9 3a6 6 0 010 12 6 6 0 000-12z";
export const I_BAG = "M6 6.5h8l1 9.5H5l1-9.5zM7.5 6.5V6a2.5 2.5 0 015 0v.5";
export const I_MENU = "M3.5 6h13M3.5 10h13M3.5 14h13";
export const I_HOME = "M4 10l6-5.5L16 10v6h-4.4v-3.4H8.4V16H4v-6z";
export const I_PLUS = "M10 4.5v11M4.5 10h11";
export const I_HEART =
  "M10 16s-5.8-3.4-5.8-7.4C4.2 6.4 5.8 5 7.5 5c1.1 0 2 .5 2.5 1.4C10.5 5.5 11.4 5 12.5 5c1.7 0 3.3 1.4 3.3 3.6 0 4-5.8 7.4-5.8 7.4z";
export const I_PROFILE = "M10 3.5A2.6 2.6 0 1110 8.7 2.6 2.6 0 0110 3.5zM4.5 16c.6-2.6 2.9-4 5.5-4s4.9 1.4 5.5 4";
export const I_GEAR =
  "M10 7.2A2.8 2.8 0 1110 12.8 2.8 2.8 0 0110 7.2zM10 3v1.6M10 15.4V17M3 10h1.6M15.4 10H17M5 5l1.1 1.1M13.9 13.9L15 15M15 5l-1.1 1.1M6.1 13.9L5 15";
export const I_BELL = "M10 3.5c2.4 0 4 1.8 4 4.2v2.6l1.3 2.2H4.7L6 10.3V7.7c0-2.4 1.6-4.2 4-4.2zM8.5 14.8a1.5 1.5 0 003 0";
export const I_MOON = "M15.5 12.5A6 6 0 017.3 4.3a6.2 6.2 0 102.4 8.2 6.2 6.2 0 015.8 0z";
export const I_DOC = "M6 3h6l3 3v11H6V3zM8.5 9h5M8.5 12h5M8.5 15h3.5";

/* Gallery section scaffolding */
export function NavSection({
  num,
  tag,
  title,
  desc,
  children,
  scene,
  pad = "p-6 md:p-10",
  height = "min-h-[300px]",
  center = false,
}: {
  num: string;
  tag: string;
  title: string;
  desc: string;
  children: React.ReactNode;
  scene?: boolean;
  pad?: string;
  height?: string;
  center?: boolean;
}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-12 md:py-16">
      <Reveal>
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <span className="block-tag">{num}</span>
            <span
              className="font-mono text-[10px] uppercase tracking-[0.14em]"
              style={{ color: scene ? "#dbeafe" : "var(--ink-3)" }}
            >
              {tag}
            </span>
          </div>
          <h2 className="mt-2 font-display text-xl font-semibold">{title}</h2>
          <p className="mt-0.5 max-w-2xl text-sm text-ink-3">{desc}</p>
        </div>
      </Reveal>
      <Reveal delay={60}>
        <div
          className={`relative overflow-hidden rounded-[20px] border ${
            scene ? "border-white/15" : "border-line"
          } ${height}`}
          style={
            scene
              ? undefined
              : { background: "var(--surface)" }
          }
        >
          {scene && <div className="glass-scene absolute inset-0" aria-hidden="true" />}
          <div className={`relative ${center ? "flex min-h-[300px] items-center justify-center" : ""} ${pad}`}>
            {children}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
