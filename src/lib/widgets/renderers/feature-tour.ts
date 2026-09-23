import { esc } from "../base";
import type { RenderResult, WidgetConfig } from "../types";

/* Feature tour — Apple-style scrollytelling element from the reference:
   pill hotspots on the left (one expanded, up/down arrows), synced visual
   panel on the right. PlanckUi dark stage, transform-only motion. */

type FR = (c: WidgetConfig) => RenderResult;

const PALETTE = `
:host {
  --t-card: #f5f5f7; --t-ink: #1d1d1f; --t-mut: #6e6e73; --t-line: oklch(0.88 0.005 240);
}
:host(.dark) {
  --t-card: #1d1d1f; --t-ink: #f5f5f7; --t-mut: #86868b; --t-line: oklch(0.32 0.005 240);
}
`;

const TOUR_CSS = `
.plk-tour { display: grid; grid-template-columns: minmax(230px, 320px) minmax(0, 1fr);
  gap: 26px; align-items: center; padding: 30px; border-radius: 24px;
  background: var(--t-card); color: var(--t-ink); overflow: hidden;
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  border: 1px solid var(--t-line); }
@container (max-width: 760px) { .plk-tour { grid-template-columns: 1fr; } }
.plk-tcol { position: relative; display: flex; flex-direction: column; gap: 10px; }
.plk-pill { display: flex; align-items: center; gap: 10px; text-align: left;
  border: 1px solid var(--t-line); background: var(--t-card); color: var(--t-ink);
  font: inherit; font-size: 15px; font-weight: 600; padding: 12px 18px;
  border-radius: 999px; cursor: pointer; width: fit-content;
  transition: background-color 180ms cubic-bezier(0.23,1,0.32,1), transform 180ms cubic-bezier(0.23,1,0.32,1), border-color 180ms ease; }
.plk-pill:hover { transform: translateX(2px); border-color: var(--t-mut); }
.plk-pill:active { transform: scale(0.97); }
.plk-pill.on { background: var(--t-ink); color: var(--t-card); border-color: var(--t-ink); }
.plk-pill .plk-plus { width: 20px; height: 20px; border-radius: 999px; border: 1.5px solid currentColor;
  display: inline-flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0; }
.plk-topen { width: 100%; border-radius: 20px; padding: 18px 20px; cursor: default; }
.plk-topen .plk-plus { display: none; }
.plk-topen .plk-ftext b { font-weight: 700; }
.plk-topen .plk-tsw { display: flex; gap: 8px; margin-top: 10px; }
.plk-topen .plk-tsw i { width: 18px; height: 18px; border-radius: 999px; }
.plk-tvis { position: relative; border-radius: 20px; overflow: hidden; min-height: 340px;
  background:
    radial-gradient(120% 90% at 72% 18%, color-mix(in oklab, var(--tv) 45%, transparent), transparent 62%),
    radial-gradient(90% 70% at 28% 92%, color-mix(in oklab, var(--tv2) 55%, transparent), transparent 65%),
    var(--t-card);
  border: 1px solid var(--t-line); display: grid; place-items: center; }
.plk-tobj { width: 42%; aspect-ratio: 3 / 4.3; border-radius: 24px; position: relative;
  background: linear-gradient(165deg, var(--tv), var(--tv2) 82%);
  box-shadow: inset 0 0 0 2px oklch(1 0 0 / 0.14), 0 16px 44px oklch(0 0 0 / 0.3);
  transition: transform 420ms cubic-bezier(0.23,1,0.32,1); }
.plk-tobj::after { content: ""; position: absolute; inset: 11% 10%;
  border-radius: 16px; border: 1.5px solid oklch(1 0 0 / 0.15); }
.plk-tcross { position: absolute; width: 30px; height: 30px; pointer-events: none; }
.plk-tcross::before, .plk-tcross::after { content: ""; position: absolute; background: var(--t-ink); }
.plk-tcross::before { left: 50%; top: 0; bottom: 0; width: 1.5px; translate: -50% 0; }
.plk-tcross::after { top: 50%; left: 0; right: 0; height: 1.5px; translate: 0 -50%; }
.plk-tarrows { display: flex; flex-direction: column; gap: 12px; }
.plk-tarrow { width: 34px; height: 34px; border-radius: 999px; border: 1px solid var(--t-line);
  background: var(--t-card); color: var(--t-ink); cursor: pointer; font-size: 13px;
  transition: background-color 150ms ease, transform 150ms cubic-bezier(0.23,1,0.32,1); }
.plk-tarrow:hover { background: var(--t-mut); color: var(--t-card); }
.plk-tarrow:active { transform: scale(0.92); }
@media (prefers-reduced-motion: reduce) { .plk-tobj, .plk-pill, .plk-tarrow { transition: none; } }
`;

const FTEXT = `
.plk-ftext { position: relative; z-index: 2; font-size: 15px; line-height: 1.5; }
.plk-ftext b { font-weight: 700; }
.plk-tsw { display: flex; gap: 8px; margin-top: 10px; }
.plk-tsw i { width: 18px; height: 18px; border-radius: 999px; display: block; }
`;

function tourJs(dataJson: string): string {
  return (
    "var DATA=" + dataJson + ";var N=DATA.length;" +
    "var pills=shadow.querySelectorAll('.plk-pill'),vis=shadow.querySelectorAll('.plk-tvis');" +
    "function swH(d){return d.c1?'<span class=\"plk-tsw\">'+d.c1.split(',').map(function(s){return '<i style=\"background:'+s.trim()+'\"></i>'}).join('')+'</span>':''}" +
    "function select(i){pills.forEach(function(p,j){var on=j===i;p.classList.toggle('on',on);" +
    "p.innerHTML=on?('<span class=\"plk-ftext\"><b>'+DATA[j].n+'.</b> <span>'+DATA[j].t+'</span>'+swH(DATA[j])+'</span>')" +
    ":('<span class=\"plk-plus\">+</span><span>'+DATA[j].n+'</span>')});" +
    "vis.forEach(function(v,j){v.hidden=j!==i})}" +
    "shadow.querySelectorAll('.plk-pill').forEach(function(p,j){p.addEventListener('click',function(){select(j)})});" +
    "shadow.querySelectorAll('.plk-tarrow').forEach(function(b){b.addEventListener('click',function(){select((sel()+Number(b.dataset.d)+N)%N)})});" +
    "function sel(){var i=0;pills.forEach(function(p,j){if(p.classList.contains('on'))i=j});return i}"
  );
}

export function featureTour(c: WidgetConfig): RenderResult {
  const data = [
    { n: "Colors", t: "Choose from three bold finishes. Shown in Cosmic Orange.", c1: "#ff6a00,#e3e4e6,#2c2f36" },
    { n: "Aluminum Unibody", t: "Aerospace-grade aluminum, machined from a single block.", c1: "" },
    { n: "Vapor Chamber", t: "Deionized water moves heat away from the chip.", c1: "" },
    { n: "Ceramic Shield", t: "4x more crack resistant, 3x more scratch resistant.", c1: "" },
    { n: "Immersive Display", t: "Brighter. Better anti-reflection. Up to 120Hz.", c1: "" },
    { n: "Camera Control", t: "Take a photo, record video, adjust settings.", c1: "" },
    { n: "Action Button", t: "A fast track to your favorite feature.", c1: "" },
  ];
  const names = itemLines(c, data.map((d) => d.n));
  const pills = names
    .map((n, i) => {
      const on = i === 0;
      const d = data[i] || data[0];
      return on
        ? `<button type="button" class="plk-pill on" data-i="${i}"><span class="plk-ftext"><b>${esc(d.n)}.</b> <span>${esc(d.t)}</span></span>${d.c1 ? '<span class="plk-tsw">' + d.c1.split(",").map((s) => `<i style="background:${esc(s.trim())}"></i>`).join("") + "</span>" : ""}</button>`
        : `<button type="button" class="plk-pill" data-i="${i}"><span class="plk-plus">+</span><span>${esc(n)}</span></button>`;
    })
    .join("");
  const vis = data
    .map((d, i) => {
      const [c1, c2] = d.c1.split(",").map((x) => x.trim());
      return `<div class="plk-tvis" data-i="${i}"${i ? " hidden" : ""} style="--tv:${esc(c1 || "#8e8e93")};--tv2:${esc(c2 || "#48484a")}"><span class="plk-tcross" aria-hidden="true"></span><div class="plk-tobj"></div></div>`;
    })
    .join("");
  const html =
    '<div class="plk-tour"><div class="plk-tcol">' + pills +
    '<div class="plk-tarrows"><button type="button" class="plk-tarrow" data-d="-1" aria-label="Previous">↑</button><button type="button" class="plk-tarrow" data-d="1" aria-label="Next">↓</button></div></div>' +
    '<div class="plk-tviswrap">' + vis + "</div></div>";
  const css = TOUR_CSS + FTEXT;
  const js = tourJs(JSON.stringify(data.map((d) => ({ n: d.n, t: d.t, c1: d.c1 }))));
  return { html, css, js };
}

function itemLines(c: WidgetConfig, fallback: string[]) {
  const from = (c.items || "").split("\n").map((x) => x.trim()).filter(Boolean);
  return from.length ? from : fallback;
}
void esc;
