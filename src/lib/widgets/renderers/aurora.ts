import { esc } from "../base";
import type { RenderResult, WidgetConfig } from "../types";

/* Aurora — the modern analytics collection.
   Design system from the reference card: neutral-950 canvas, one accent per
   widget, ambient glow orb, icon-chip header, divided stats with deltas,
   gradient area sparkline with pulsing endpoint, outline CTA that fills.
   Each widget adds its own signature motif and real interactivity. */

export type AR = (c: WidgetConfig) => RenderResult;

export const AURORA_PALETTE = `
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
`;

export const A_CSS = `
.plk-au { position: relative; overflow: hidden; border-radius: 16px; max-width: 340px;
  background: var(--s-card); padding: 24px; color: var(--s-ink);
  box-shadow: 0 25px 50px -12px oklch(0 0 0 / 0.5);
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; }
.plk-auorb { position: absolute; top: -50%; left: 50%; width: 256px; height: 256px;
  translate: -50% 0; border-radius: 999px;
  background: color-mix(in oklab, var(--w-accent, var(--a)) 10%, transparent); filter: blur(40px);
  transition: background 700ms ease; }
.plk-au:hover .plk-auorb { background: color-mix(in oklab, var(--a) 16%, transparent); }
.plk-auinner { position: relative; display: flex; flex-direction: column; gap: 20px; }
.plk-auhead { display: flex; align-items: center; gap: 12px; padding-bottom: 20px;
  border-bottom: 1px solid var(--s-line); }
.plk-auchip { width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
  background: color-mix(in oklab, var(--w-accent, var(--a)) 10%, transparent);
  display: flex; align-items: center; justify-content: center; color: var(--a); }
.plk-autitle { font-size: 15px; font-weight: 600; color: var(--s-ink); margin: 0; }
.plk-ausub { font-size: 12px; color: var(--s-mut); }
.plk-austats { display: flex; }
.plk-austat { flex: 1; }
.plk-austat + .plk-austat { padding-left: 24px; border-left: 1px solid var(--s-line); }
.plk-aulab { font-size: 12px; color: var(--s-mut); font-weight: 500; }
.plk-auval { font-size: 20px; font-weight: 600; color: var(--s-ink); margin: 2px 0;
  font-variant-numeric: tabular-nums; letter-spacing: -0.01em; }
.plk-audelta { font-size: 12px; font-weight: 500; }
.plk-audelta.up { color: var(--a); }
.plk-audelta.down { color: #f87171; }
.plk-aubtn { width: 100%; padding: 10px 16px; font: inherit; font-size: 14px; font-weight: 500;
  border-radius: 10px; border: 1px solid color-mix(in oklab, var(--a) 50%, transparent);
  background: transparent; color: var(--a); cursor: pointer;
  transition: background-color 300ms ease, color 300ms ease, transform 160ms cubic-bezier(0.23,1,0.32,1); }
.plk-aubtn:hover { background: var(--a); color: #0a0a0a; }
.plk-aubtn:active { transform: scale(0.98); }
.plk-auchart { position: relative; height: 96px; }
.plk-auchart svg { width: 100%; height: 100%; display: block; }
.plk-auroute { transition: d 500ms cubic-bezier(0.23,1,0.32,1); }
.plk-aupill { border: 1px solid var(--s-line); background: transparent; color: var(--s-mut);
  font: inherit; font-size: 12px; font-weight: 600; border-radius: 999px; padding: 5px 12px; cursor: pointer;
  transition: all 200ms cubic-bezier(0.23,1,0.32,1); }
.plk-aupill.on { border-color: var(--a); color: var(--a); }
.plk-aupills { display: flex; gap: 6px; }
.plk-auslider { width: 100%; accent-color: var(--a); }
`;

export function auroraBase(c: WidgetConfig, css: string): string {
  return `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:host {
  display: block;
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  --s-card: oklch(0.99 0.003 240); --s-ink: oklch(0.25 0.02 235);
  --s-mut: oklch(0.5 0.02 242); --s-line: oklch(0.9 0.008 240);
}
:host(.dark) {
  --s-card: oklch(0.22 0.014 245); --s-ink: oklch(0.93 0.008 230);
  --s-mut: oklch(0.66 0.012 235); --s-line: oklch(0.32 0.014 242);
}
${css}
`.trim();
}

export function auroraShell(c: WidgetConfig, inner: string): string {
  return (
    '<div class="plk-au" style="--a:' +
    (/^[\w#.%(),\s-]+$/.test(String(c.accent)) && String(c.accent).length < 40
      ? String(c.accent)
      : "#a3e635") +
    '">' +
    '<div class="plk-auorb"></div><div class="plk-auinner">' + inner + "</div></div>"
  );
}

/* Shared smoothing: catmull-rom-ish cubic through the points. */
export const SPARK_JS =
  "function spark(vals,w,h){var pad=6;" +
  "var mn=Math.min.apply(null,vals),mx=Math.max.apply(null,vals),rg=(mx-mn)||1;" +
  "var pts=vals.map(function(v,i){return [pad+i*(w-2*pad)/(vals.length-1), h-pad-((v-mn)/rg)*(h-2*pad)]});" +
  "var d='M'+pts[0][0]+','+pts[0][1];" +
  "for(var i=1;i<pts.length;i++){var x0=pts[i-1][0],y0=pts[i-1][1],x1=pts[i][0],y1=pts[i][1],mx2=(x0+x1)/2;" +
  "d+=' C'+mx2+','+y0+' '+mx2+','+y1+' '+x1+','+y1}" +
  "return {d:d,last:pts[pts.length-1],pts:pts}}";

export function sparkPath(vals: number[], w = 300, h = 100): { d: string; last: [number, number] } {
  const pad = 6;
  const mn = Math.min(...vals), mx = Math.max(...vals), rg = (mx - mn) || 1;
  const pts: [number, number][] = vals.map((v, i) => [
    pad + (i * (w - 2 * pad)) / (vals.length - 1),
    h - pad - ((v - mn) / rg) * (h - 2 * pad),
  ]);
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], mx = (x0 + x1) / 2;
    d += ` C${mx},${y0} ${mx},${y1} ${x1},${y1}`;
  }
  return { d, last: pts[pts.length - 1] };
}

export function statsRow(parts: [string, string, string, "up" | "down"][]): string {
  return (
    '<div class="plk-austats">' +
    parts
      .map(
        ([label, value, delta, dir]) =>
          '<div class="plk-austat"><p class="plk-aulab">' + esc(label) + '</p><p class="plk-auval">' +
          esc(value) + '</p><span class="plk-audelta ' + dir + '">' + esc(delta) + "</span></div>"
      )
      .join("") +
    "</div>"
  );
}

export function headerHtml(icon: string, title: string, sub: string, sign = ""): string {
  return (
    '<div class="plk-auhead"><div class="plk-auchip">' + icon + "</div><div>" +
    '<p class="plk-autitle">' + esc(title) + '</p><p class="plk-ausub">' + esc(sub) + "</p>" +
    (sign ? '<span style="position:absolute;right:0;top:0">' + sign + "</span>" : "") +
    "</div></div>"
  );
}

export function randomWalk(n: number, start: number, vol: number): number[] {
  const out = [start];
  for (let i = 1; i < n; i++) out.push(out[i - 1] * (1 + (Math.random() - 0.45) * vol));
  return out;
}

export { esc };
