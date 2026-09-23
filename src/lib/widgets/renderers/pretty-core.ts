import { esc } from "../base";
import type { RenderResult, WidgetConfig } from "../types";

/* Pretty Progress — the premium dark-widget collection.
   Design system extracted from the reference:
   dark slate cards, 26px squircle radii, bold white titles, slate subtitles,
   mint accent expressed as ring / dot grid / rising fill, caption below. */

export type PR = (c: WidgetConfig) => RenderResult;

export const P_CSS = `
.plk-pstage { padding: 4px; max-width: 430px; margin-inline: auto; }
.plk-pcard {
  position: relative; overflow: hidden;
  background: var(--s-card);
  border-radius: 26px;
  padding: 22px 24px;
  color: var(--s-ink);
  box-shadow: 0 22px 44px oklch(0 0 0 / 0.28);
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
}
.plk-ptitle {
  position: relative; z-index: 2; margin: 0;
  font-size: 21px; font-weight: 700; letter-spacing: -0.01em;
  color: var(--s-ink); text-wrap: balance;
}
.plk-psub {
  position: relative; z-index: 2; margin: 7px 0 0;
  font-size: 16.5px; font-weight: 500; color: var(--s-mut);
  font-variant-numeric: tabular-nums; letter-spacing: -0.005em;
}
.plk-pcap { text-align: center; font-size: 12px; font-weight: 500; color: var(--s-mut); padding: 10px 0 2px; }
.plk-ringwrap { position: absolute; right: 20px; top: 50%; translate: 0 -50%; z-index: 2; }
.plk-ring { transition: stroke-dashoffset 900ms cubic-bezier(0.23,1,0.32,1); }
@media (prefers-reduced-motion: reduce) { .plk-ring { transition: none; } }
.plk-dots { display: grid; grid-template-columns: repeat(var(--cols, 10), 1fr); gap: 7px; margin-top: 18px; position: relative; z-index: 2; }
.plk-dot { aspect-ratio: 1; border-radius: 999px; background: var(--s-line); }
.plk-dot.on { background: var(--w-accent); }
.plk-pfill { position: absolute; inset: 0; z-index: 1; background: var(--s-card2);
  clip-path: polygon(0 calc(100% - var(--fill)), 26% calc(100% - var(--fill) - 9%), 100% calc(100% - var(--fill) - 4%), 100% 100%, 0 100%);
  transition: clip-path 900ms cubic-bezier(0.23,1,0.32,1); }
.plk-pbig { position: relative; z-index: 2; margin: 10px 0 0; font-size: 2.6rem; font-weight: 750;
  letter-spacing: -0.03em; line-height: 1; font-variant-numeric: tabular-nums; }
@media (prefers-reduced-motion: reduce) { .plk-pfill { transition: none; } }
`;

export function prettyBase(c: WidgetConfig, css: string): string {
  return `

:host {
  --s-card: oklch(0.99 0.003 240);
  --s-card2: oklch(0.955 0.006 240);
  --s-ink: oklch(0.25 0.02 235);
  --s-mut: oklch(0.5 0.02 242);
  --s-line: oklch(0.9 0.008 240);
}
:host(.dark) {
  --s-card: oklch(0.22 0.014 245);
  --s-card2: oklch(0.28 0.016 243);
  --s-ink: oklch(0.93 0.008 230);
  --s-mut: oklch(0.66 0.012 235);
  --s-line: oklch(0.32 0.014 242);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:host {
  display: block;
  --w-accent: ${cssColor(c.accent, "oklch(0.85 0.1 172)")};
  --w-radius: ${Number(c.radius) || 26}px;
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
}
${css}
`.trim();
}

function cssColor(v: unknown, fallback: string): string {
  const s = String(v ?? "").trim();
  return /^[\w#.%(),\s-]+$/.test(s) && s.length < 60 ? s : fallback;
}

/* The dark card + caption shell every Pretty widget shares. */
export function prettyShell(c: WidgetConfig, inner: string, attrs = ""): string {
  const note = String(c.note ?? "Pretty Progress");
  return (
    '<div class="plk-pstage"><div class="plk-pcard" style="border-radius:var(--w-radius)"' +
    (attrs ? " " + attrs : "") +
    ">" +
    inner +
    "</div></div>" +
    '<div class="plk-pcap">' + esc(note) + "</div>"
  );
}

export function pOk(c: WidgetConfig, inner: string, css: string, js?: string, attrs = ""): RenderResult {
  return { html: prettyShell(c, inner, attrs), css: prettyBase(c, P_CSS + css), js };
}

/* Thick rounded-cap progress ring, faithful to the reference. Renders at 0;
   the ticker animates stroke-dashoffset to data-p. */
export function ringHtml(pct: number, size = 86, stroke = 9): string {
  const p = Math.max(0, Math.min(1, pct));
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + " " + size +
    '" style="transform:rotate(-90deg)" aria-hidden="true">' +
    '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="var(--s-line)" stroke-width="' + stroke + '"/>' +
    '<circle class="plk-ring" data-c="' + circ + '" data-p="' + p + '" cx="' + size / 2 + '" cy="' + size / 2 +
    '" r="' + r + '" fill="none" stroke="var(--w-accent)" stroke-width="' + stroke +
    '" stroke-linecap="round" stroke-dasharray="' + circ + '" stroke-dashoffset="' + circ + '"/></svg>'
  );
}

/* Dot-grid progress, faithful to the "Project X" card. */
export function dotsHtml(done: number, total: number, cols = 10): string {
  let s = '<div class="plk-dots" style="--cols:' + cols + '" aria-hidden="true">';
  for (let i = 0; i < total; i++) s += '<span class="plk-dot' + (i < done ? " on" : "") + '"></span>';
  return s + "</div>";
}

/* Universal Pretty ticker: updates [data-ud/h/m/s] and .plk-ring from
   data-tg (target ISO) + data-win (window ms) on each .plk-pcard. */
export function pTickerJs(): string {
  return (
    "var cards=shadow.querySelectorAll('.plk-pcard[data-tg]');" +
    "function pad(n){return String(n).padStart(2,'0')}" +
    "function tick(){cards.forEach(function(card){" +
    "var t=Date.parse(card.dataset.tg);if(isNaN(t))return;" +
    "var ms=Math.max(0,t-Date.now());var s=Math.floor(ms/1000);" +
    "var q=function(k){return card.querySelector('[data-'+k+']')};" +
    "if(q('ud'))q('ud').textContent=String(Math.floor(s/86400));" +
    "if(q('uh'))q('uh').textContent=pad(Math.floor(s%86400/3600));" +
    "if(q('um'))q('um').textContent=pad(Math.floor(s%3600/60));" +
    "if(q('us'))q('us').textContent=pad(s%60);" +
    "var ring=card.querySelector('.plk-ring');" +
    "if(ring){var w=Number(card.dataset.win)||1;var p=Math.max(0,Math.min(1,ms/w));" +
    "var c=Number(ring.dataset.c);ring.style.strokeDashoffset=c*(1-p);}" +
    "})}tick();setInterval(tick,1000);"
  );
}

/* Count-up for big percentages. */
export function pCountJs(sel: string, to: number): string {
  return (
    "var el=shadow.querySelector('" + sel + "');if(!el)return;" +
    "var T=" + to + ";" +
    "if(matchMedia('(prefers-reduced-motion: reduce)').matches){el.textContent=T+'%';return}" +
    "var t0;requestAnimationFrame(function step(ts){t0=t0||ts;var p=Math.min(1,(ts-t0)/900);" +
    "el.textContent=Math.round(T*(1-Math.pow(1-p,3)))+'%';if(p<1)requestAnimationFrame(step)});"
  );
}

export function fallbackDate(days: number, hour = 12): string {
  const d = new Date(Date.now() + days * 864e5);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

/* Rising-fill clip path at a given percentage (Pretty "Workout plan" card). */
export function fillClip(pct: number): string {
  return `polygon(0 calc(100% - ${pct}%), 26% calc(100% - ${pct}% - 9%), 100% calc(100% - ${pct}% - 4%), 100% 100%, 0 100%)`;
}

export { esc };
