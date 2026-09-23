import { esc } from "../base";
import type { RenderResult, WidgetConfig } from "../types";
import {
  A_CSS,
  SPARK_JS,
  auroraBase,
  auroraShell,
  headerHtml,
  randomWalk,
  sparkPath,
  statsRow,
} from "./aurora";

type AR = (c: WidgetConfig) => RenderResult;

const fmtK = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

/* ---- 1. Aurora Balance — the anchor card from the reference ---- */
export const auroraBalance: AR = (c) => {
  const vals = randomWalk(12, 4200, 0.3);
  const p = sparkPath(vals, 300, 100);
  const last = vals[vals.length - 1];
  const body =
    headerHtml(
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3 12m0 1a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M9 8m0 1a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z"/><path d="M15 4m0 1a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z"/><path d="M4 20h14"/></svg>',
      c.text || "Monthly Balance",
      "Updated just now"
    ) +
    statsRow([
      ["Revenue", fmtK(last * 12), "+8.5%", "up"],
      ["Costs", fmtK(last * 3), "+2.1%", "down"],
    ]) +
    `<div class="plk-auchart"><svg viewBox="0 0 300 100" preserveAspectRatio="none">` +
    `<defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--a)" stop-opacity="0.2"/><stop offset="100%" stop-color="var(--a)" stop-opacity="0"/></linearGradient></defs>` +
    `<path class="plk-auroute" d="${p.d}" fill="none" stroke="var(--a)" stroke-width="2"/>` +
    `<path d="${p.d} L300,100 L0,100 Z" fill="url(#ag)"/>` +
    `<circle class="plk-audot" cx="${p.last[0]}" cy="${p.last[1]}" r="5" fill="var(--a)" style="filter:drop-shadow(0 0 6px var(--a))"/>` +
    `</svg></div>` +
    `<button class="plk-aubtn" type="button" data-sim>Simulate next month</button>`;
  const js =
    SPARK_JS +
    "var route=shadow.querySelector('.plk-auroute'),dot=shadow.querySelector('.plk-audot');" +
    "var stats=shadow.querySelectorAll('.plk-auval');" +
    "shadow.querySelector('[data-sim]').addEventListener('click',function(){" +
    "var vals=[];var v=3800+Math.random()*2500;for(var i=0;i<12;i++){vals.push(v);v*=1+(Math.random()-0.42)*0.35}" +
    "var r=spark(vals,300,100);route.style.d='path(\"'+r.d+'\")';route.setAttribute('d',r.d);" +
    "dot.setAttribute('cx',r.last[0]);dot.setAttribute('cy',r.last[1]);" +
    "var rev=vals[vals.length-1]*12,cost=vals[vals.length-1]*3.1;" +
    "stats[0].textContent='$'+Math.round(rev).toLocaleString('en-US');" +
    "stats[1].textContent='$'+Math.round(cost).toLocaleString('en-US');" +
    "var d1=stats[0].nextElementSibling,d2=stats[1].nextElementSibling;" +
    "d1.textContent=(Math.random()>0.25?'+':'-')+(4+Math.random()*7).toFixed(1)+'%';" +
    "d2.textContent='+'+(Math.random()*4).toFixed(1)+'%'});";
  return { html: auroraShell(c, body), css: auroraBase(c, A_CSS), js };
};

/* ---- 2. Aurora Revenue Pulse (violet, morphing sparkline) ---- */
export const auroraPulse: AR = (c) => {
  const vals = randomWalk(30, 60, 0.25);
  const p = sparkPath(vals, 300, 100);
  const body =
    headerHtml(
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l2-7 4 14 2-7h6"/></svg>',
      c.text || "Revenue pulse",
      "Drag to simulate activity",
      '<svg width="34" height="14" viewBox="0 0 34 14" fill="none" stroke="var(--a)" stroke-width="1.5" stroke-linecap="round"><path d="M0 7h6l2-5 3 10 3-7 2 2h6" stroke-dasharray="20 40" style="animation:plk-ecg 1.6s linear infinite"/></svg>'
    ) +
    statsRow([["Sessions", "8,412", "+12.4%", "up"], ["Conversion", "3.9%", "+0.4pt", "up"]]) +
    `<div class="plk-auchart"><svg viewBox="0 0 300 100" preserveAspectRatio="none">` +
    `<defs><linearGradient id="ap" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--a)" stop-opacity="0.22"/><stop offset="100%" stop-color="var(--a)" stop-opacity="0"/></linearGradient></defs>` +
    `<path class="plk-auroute" id="plk-pulsepath" d="${p.d}" fill="none" stroke="var(--a)" stroke-width="2"/>` +
    `<path id="plk-pulsearea" d="${p.d} L300,100 L0,100 Z" fill="url(#ap)"/></svg>` +
    `<input class="plk-auslider" id="plk-pulserange" type="range" min="10" max="100" value="55" aria-label="Activity level"></div>`;
  const css = `
@keyframes plk-ecg { to { stroke-dashoffset: -60; } }
@media (prefers-reduced-motion: reduce) { .plk-ecg { animation: none; } }
.plk-auchart svg + .plk-auslider { margin-top: 6px; }
`;
  const js =
    SPARK_JS +
    "var sl=shadow.getElementById('plk-pulserange'),path=shadow.getElementById('plk-pulsepath'),area=shadow.getElementById('plk-pulsearea');" +
    "function regen(){var base=sl.value/10;var vals=[];var v=base;" +
    "for(var i=0;i<30;i++){v=Math.max(4,v+(Math.random()-0.48)*base*0.35);vals.push(v)}" +
    "var r=spark(vals,300,100);path.style.d='path(\"'+r.d+'\")';path.setAttribute('d',r.d);" +
    "area.setAttribute('d',r.d+' L300,100 L0,100 Z')}sl.addEventListener('input',regen);regen();";
  return { html: auroraShell(c, body), css: auroraBase(c, A_CSS + css), js };
};

/* ---- 3. Aurora Uptime Grid (sky, 91-day status wall) ---- */
export const auroraUptime: AR = (c) => {
  const n = 91;
  let cells = "";
  const statuses: string[] = [];
  for (let i = 0; i < n; i++) {
    const r = (i * 7919) % 100;
    const s = r < 4 ? "down" : r < 10 ? "degraded" : "ok";
    statuses.push(s);
    cells += `<button type="button" class="plk-upcell ${s}" data-i="${i}" aria-label="Day ${i + 1}: ${s}"></button>`;
  }
  const okCount = statuses.filter((s) => s === "ok").length;
  const body =
    headerHtml(
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 12h8M8 8h8M8 16h5"/></svg>',
      c.text || "Uptime — last 91 days",
      "Tap any day for detail",
      '<span class="plk-breath" aria-hidden="true"></span>'
    ) +
    `<div class="plk-upgrid">${cells}</div>` +
    `<p class="plk-updetail" id="plk-updetail">Overall: ${Math.round((okCount / n) * 100)}% fully operational</p>`;
  const css = `
.plk-breath { width: 9px; height: 9px; border-radius: 999px; background: var(--a);
  animation: plk-breath 2.6s ease-in-out infinite; }
@keyframes plk-breath { 50% { opacity: 0.35; } }
@media (prefers-reduced-motion: reduce) { .plk-breath { animation: none; } }
.plk-upgrid { display: grid; grid-template-columns: repeat(13, 1fr); gap: 4px; margin-top: 4px; }
.plk-upcell { aspect-ratio: 1; border: 0; padding: 0; border-radius: 3px; cursor: pointer;
  background: color-mix(in oklab, var(--a) 55%, var(--s-card));
  transition: transform 140ms cubic-bezier(0.23,1,0.32,1); }
.plk-upcell.degraded { background: oklch(0.75 0.13 82); }
.plk-upcell.down { background: #f87171; }
.plk-upcell:hover { transform: scale(1.35); }
.plk-updetail { margin-top: 12px; font-size: 12.5px; color: var(--s-mut); min-height: 18px;
  font-variant-numeric: tabular-nums; }
`;
  const js =
    "var det=shadow.getElementById('plk-updetail');" +
    "shadow.querySelectorAll('.plk-upcell').forEach(function(cell){" +
    "cell.addEventListener('click',function(){var i=Number(cell.dataset.i);" +
    "var s=cell.classList.contains('down')?'full outage':cell.classList.contains('degraded')?'degraded response times':'fully operational';" +
    "var d=new Date(Date.now()-(" + (n - 1) + "-i)*864e5);" +
    "det.textContent=d.toLocaleDateString('en',{month:'short',day:'numeric'})+' — '+s})});";
  return { html: auroraShell(c, body), css: auroraBase(c, A_CSS + css), js };
};

/* ---- 4. Aurora Energy Mix (amber, animated donut) ---- */
export const auroraEnergy: AR = (c) => {
  const mixes = {
    day: [46, 32, 22],
    week: [38, 40, 22],
    month: [52, 27, 21],
  } as Record<string, number[]>;
  const labels = ["Solar", "Wind", "Grid"];
  const colors = ["#fbbf24", "oklch(0.75 0.1 200)", "oklch(0.6 0.02 260)"];
  const mix = mixes.day;
  const size = 132, stroke = 14, r = (size - stroke) / 2, C = 2 * Math.PI * r;
  let arcs = "";
  let offsetAcc = 0;
  mix.forEach((pct, i) => {
    const len = (pct / 100) * C;
    arcs += `<circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${colors[i]}" stroke-width="${stroke}" stroke-dasharray="${len - 4} ${C - len + 4}" stroke-dashoffset="${-offsetAcc}" data-mode-len="day${i}" style="transition:stroke-dasharray 700ms cubic-bezier(0.23,1,0.32,1)"/>`;
    offsetAcc += len;
  });
  const legend = mix.map((p, i) => `<span class="plk-enleg"><i style="background:${colors[i]}"></i>${labels[i]} <b data-v="${i}">${p}%</b></span>`).join("");
  const body =
    headerHtml(
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/></svg>',
      c.text || "Energy mix",
      "Renewables first, always"
    ) +
    `<div class="plk-enwrap"><div class="plk-endonut">${arcs}</div>` +
    `<div class="plk-aupills" id="plk-enpills">` +
    ["day", "week", "month"].map((m, i) => `<button type="button" class="plk-aupill${i === 0 ? " on" : ""}" data-m="${m}">${m}</button>`).join("") +
    `</div><div class="plk-enlegend">${legend}</div></div>`;
  const css = `
.plk-enwrap { display: flex; flex-direction: column; gap: 16px; align-items: center; }
.plk-endonut { position: relative; }
.plk-enlegend { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; font-size: 12.5px; color: var(--s-mut); }
.plk-enleg { display: inline-flex; align-items: center; gap: 6px; }
.plk-enleg i { width: 9px; height: 9px; border-radius: 3px; display: inline-block; }
.plk-enleg b { color: var(--s-ink); font-variant-numeric: tabular-nums; }
`;
  const js =
    "var MIX=" + JSON.stringify(mixes) + ";var arcs=shadow.querySelectorAll('.plk-endonut circle');" +
    "shadow.querySelectorAll('#plk-enpills button').forEach(function(b){b.addEventListener('click',function(){" +
    "shadow.querySelectorAll('#plk-enpills button').forEach(function(x){x.classList.remove('on')});b.classList.add('on');" +
    "var m=MIX[b.dataset.m];var C=2*Math.PI*" + r + ";var acc=0;" +
    "m.forEach(function(p,i){var len=p/100*C;var arc=arcs[i];" +
    "arc.setAttribute('stroke-dasharray',(len-4)+' '+(C-len+4));" +
    "arc.setAttribute('stroke-dashoffset',-acc);acc+=len;" +
    "shadow.querySelector('[data-v=\"'+i+'\"]').textContent=p+'%'})})});";
  return { html: auroraShell(c, body), css: auroraBase(c, A_CSS + css), js };
};

/* ---- 5. Aurora Ticker (fuchsia, simulated live price) ---- */
export const auroraTicker: AR = (c) => {
  const vals = randomWalk(36, 90, 0.06);
  const p = sparkPath(vals, 300, 100);
  const price = (42_731 + Math.random() * 0).toLocaleString("en-US", { minimumFractionDigits: 2 });
  const body =
    headerHtml(
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg>',
      c.text || "PROOF · proof coin",
      "Simulated market, real chart",
      '<span class="plk-tdot" aria-hidden="true"></span>'
    ) +
    `<p class="plk-auprice" data-price>${price}</p>` +
    `<div class="plk-auchart"><svg viewBox="0 0 300 100" preserveAspectRatio="none">` +
    `<defs><linearGradient id="at" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--a)" stop-opacity="0.22"/><stop offset="100%" stop-color="var(--a)" stop-opacity="0"/></linearGradient></defs>` +
    `<path class="plk-auroute" id="plk-tpath" d="${p.d}" fill="none" stroke="var(--a)" stroke-width="2"/>` +
    `<path id="plk-tarea" d="${p.d} L300,100 L0,100 Z" fill="url(#at)"/></svg>` +
    `<div class="plk-aupills" id="plk-tpills"><button class="plk-aupill on" data-n="36">1D</button><button class="plk-aupill" data-n="90">1W</button><button class="plk-aupill" data-n="220">1M</button></div>` +
    `<button class="plk-aubtn" type="button" data-refresh style="margin-top:12px">Refresh market</button>`;
  const css = `
.plk-auprice { position: relative; z-index: 2; font-size: 28px; font-weight: 700; letter-spacing: -0.02em;
  color: var(--s-ink); font-variant-numeric: tabular-nums; }
.plk-tdot { width: 8px; height: 8px; border-radius: 999px; background: var(--a);
  animation: plk-tdot 1.8s ease-in-out infinite; }
@keyframes plk-tdot { 50% { opacity: 0.3; } }
@media (prefers-reduced-motion: reduce) { .plk-tdot { animation: none; } }
.plk-aupills { margin-top: 12px; }
`;
  const js =
    SPARK_JS +
    "var path=shadow.getElementById('plk-tpath'),area=shadow.getElementById('plk-tarea'),price=shadow.querySelector('[data-price]');" +
    "var n=36,base=42731;" +
    "function regen(){var v=base*(0.96+Math.random()*0.08);var vals=[];" +
    "for(var i=0;i<n;i++){v=v*(1+(Math.random()-0.47)*0.012);vals.push(v)}" +
    "var r=spark(vals,300,100);path.style.d='path(\"'+r.d+'\")';path.setAttribute('d',r.d);" +
    "area.setAttribute('d',r.d+' L300,100 L0,100 Z');" +
    "var delta=(vals[vals.length-1]/vals[0]-1)*100;" +
    "price.textContent='$'+vals[vals.length-1].toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});" +
    "price.style.color=delta>=0?'var(--a)':'#f87171'}" +
    "shadow.querySelectorAll('#plk-tpills button').forEach(function(b){b.addEventListener('click',function(){" +
    "shadow.querySelectorAll('#plk-tpills button').forEach(function(x){x.classList.remove('on')});" +
    "b.classList.add('on');n=Number(b.dataset.n);regen()})});" +
    "shadow.querySelector('[data-refresh]').addEventListener('click',regen);regen();";
  return { html: auroraShell(c, body), css: auroraBase(c, A_CSS + css), js };
};

/* ---- 6. Aurora Sleep Arc (indigo, stars + slider) ---- */
export const auroraSleep: AR = (c) => {
  const stars = Array.from({ length: 9 }, (_, i) => {
    const x = 18 + ((i * 37) % 264), y = 8 + ((i * 23) % 46);
    return `<circle cx="${x}" cy="${y}" r="${1 + (i % 3) * 0.4}" fill="oklch(0.85 0.03 260)" style="animation:plk-tw ${1.6 + (i % 4) * 0.5}s ease-in-out ${i * 0.3}s infinite"/>`;
  }).join("");
  const body =
    headerHtml(
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.3 13.6A8.4 8.4 0 0 1 10.4 3.7a8.4 8.4 0 1 0 9.9 9.9Z"/></svg>',
      c.text || "Sleep arc",
      "Drag to set your night",
      stars
    ) +
    `<div class="plk-sleearc"><svg viewBox="0 0 300 110" preserveAspectRatio="none">` +
    `<path d="M10,100 C60,10 240,10 290,100" fill="none" stroke="var(--s-line)" stroke-width="2" stroke-dasharray="4 6"/>` +
    `<path d="M10,100 C60,10 240,10 290,100" fill="none" stroke="var(--a)" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="400" stroke-dashoffset="400" id="plk-sleeparc" style="transition:stroke-dashoffset 900ms cubic-bezier(0.23,1,0.32,1)"/>` +
    `</svg></div>` +
    `<input class="plk-auslider" id="plk-sleepsl" type="range" min="5" max="10" step="0.5" value="7.5" aria-label="Hours of sleep">` +
    `<p class="plk-psub" style="color:var(--s-mut);font-size:12.5px"><span data-h>7.5</span> hours — <span data-q>rested</span></p>`;
  const css = `
.plk-sleearc { margin-top: 4px; }
.plk-sleearc svg { width: 100%; height: 110px; display: block; }
@keyframes plk-tw { 50% { opacity: 0.15; } }
@media (prefers-reduced-motion: reduce) { circle[style*="plk-tw"], svg circle { animation: none !important; } }
`;
  const js =
    "var sl=shadow.getElementById('plk-sleepsl'),arc=shadow.getElementById('plk-sleeparc'),h=shadow.querySelector('[data-h]'),q=shadow.querySelector('[data-q]');" +
    "function render(){var v=Number(sl.value);h.textContent=v.toFixed(1);" +
    "arc.style.strokeDashoffset=400-(400*(v-5)/5);" +
    "q.textContent=v<6?'short night':v<7?'getting there':v<8.5?'rested':'hibernating'}" +
    "sl.addEventListener('input',render);" +
    "requestAnimationFrame(function(){arc.style.strokeDashoffset=400-(400*(Number(sl.value)-5)/5)});";
  return { html: auroraShell(c, body), css: auroraBase(c, A_CSS + css), js };
};
