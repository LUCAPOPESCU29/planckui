import type { RenderResult, WidgetConfig } from "../types";
import { dotsHtml, esc, fallbackDate, fillClip, pCountJs, pOk, pTickerJs, ringHtml } from "./pretty-core";

type PR = (c: WidgetConfig) => RenderResult;

const sp = (k: string, v: string | number) => `<span data-${k}>${v}</span>`;
const pad2 = (n: number) => String(n).padStart(2, "0");

function targetOf(c: WidgetConfig, fbDays: number): { iso: string; date: Date; win: number } {
  const win = fbDays * 864e5 || 1;
  if (c.target) {
    const d = new Date(String(c.target));
    if (!isNaN(d.getTime())) return { iso: d.toISOString(), date: d, win };
  }
  const iso = fallbackDate(fbDays);
  return { iso, date: new Date(iso), win };
}

const FILL_CSS = `
.plk-pfill { clip-path: polygon(0 100%, 26% 100%, 100% 100%, 0 100%);
  transition: clip-path 900ms cubic-bezier(0.23,1,0.32,1); }
@media (prefers-reduced-motion: reduce) { .plk-pfill { transition: none; } }
`;

/* ---- Countdown factory (ring / dots / fill variants) ---- */
interface CdOpts { fb: number; sub: string; ring?: boolean; dots?: { total: number; cols: number }; fill?: boolean; hoursOnly?: boolean }
function countdownW(o: CdOpts): PR {
  return (c) => {
    const { iso, date, win } = targetOf(c, o.fb);
    const ms = Math.max(0, date.getTime() - Date.now());
    const pct = Math.max(0, Math.min(1, 1 - ms / win));
    const days = Math.floor(ms / 864e5);
    const h = Math.floor((ms % 864e5) / 36e5);
    const m = Math.floor((ms % 36e5) / 6e4);
    let sub = o.hoursOnly
      ? `In ${sp("uh", Math.floor(ms / 36e5))} h ${sp("um", pad2(m))} m`
      : o.sub.replace("%D%", sp("ud", days)).replace("%H%", sp("uh", pad2(h))).replace("%M%", sp("um", pad2(m)));
    let body =
      (o.ring ? `<div class="plk-ringwrap">${ringHtml(pct)}</div>` : "") +
      (o.fill ? `<div class="plk-pfill" data-fill="${Math.round(pct * 100)}"></div>` : "") +
      `<h3 class="plk-ptitle">${esc(c.text || "")}</h3><p class="plk-psub">${sub}</p>`;
    if (o.dots) body += dotsHtml(Math.round(pct * o.dots.total), o.dots.total, o.dots.cols);
    if (o.fill) body += `<p class="plk-pbig" data-pbig>${Math.round(pct * 100)}%</p>`;
    let js = pTickerJs();
    if (o.fill) {
      js +=
        "var f=shadow.querySelector('.plk-pfill');if(f){f.style.clipPath=" +
        JSON.stringify(fillClip(Math.round(pct * 100))) +
        ";f.dataset.armed='1'}" +
        "requestAnimationFrame(function(){setTimeout(function(){if(f)f.style.clipPath=" +
        JSON.stringify(fillClip(Math.round(pct * 100))) +
        "},80)});" +
        pCountJs("[data-pbig]", Math.round(pct * 100));
    }
    return pOk(c, body, o.fill ? FILL_CSS : "", js, `data-tg="${iso}" data-win="${win}"`);
  };
}

/* ---- Percentage display factory (ring / dots / fill / bar / gauge) ---- */
interface PctOpts { display: "ring" | "dots" | "fill" | "bar" | "gauge"; cols?: number; total?: number }
function pctW(o: PctOpts): PR {
  return (c) => {
    const pct = Math.max(0, Math.min(100, Number(c.pct ?? 62)));
    let body = `<h3 class="plk-ptitle">${esc(c.text || "")}</h3>`;
    let js = "";
    if (o.display === "ring") {
      body = `<div class="plk-ringwrap">${ringHtml(pct / 100)}</div>` + body;
    } else if (o.display === "dots") {
      const total = o.total || 40;
      body += `<p class="plk-psub">${Math.round(pct)}% complete</p>` + dotsHtml(Math.round((pct / 100) * total), total, o.cols || 10);
    } else if (o.display === "fill") {
      body =
        `<div class="plk-pfill"></div>` + body +
        `<p class="plk-pbig" data-pbig>${Math.round(pct)}%</p>`;
      js =
        "var f=shadow.querySelector('.plk-pfill');requestAnimationFrame(function(){setTimeout(function(){" +
        "if(f)f.style.clipPath=" + JSON.stringify(fillClip(pct)) + "},80)});" +
        pCountJs("[data-pbig]", Math.round(pct));
    } else if (o.display === "bar") {
      const segs = o.total || 20;
      const on = Math.round((pct / 100) * segs);
      body += `<div class="plk-segs">` +
        Array.from({ length: segs }, (_, i) => `<span class="plk-seg${i < on ? " on" : ""}"></span>`).join("") +
        `</div><p class="plk-psub">${Math.round(pct)}%</p>`;
    } else {
      // gauge: semicircle arc
      const size = 150, stroke = 12, r = (size - stroke) / 2;
      const half = Math.PI * r;
      body += `<div class="plk-gauge"><svg width="${size}" height="${size / 2 + 12}" viewBox="0 0 ${size} ${size / 2 + 12}">` +
        `<path d="M ${stroke / 2} ${size / 2} A ${r} ${r} 0 0 1 ${size - stroke / 2} ${size / 2}" fill="none" stroke="oklch(0.37 0.03 240)" stroke-width="${stroke}" stroke-linecap="round"/>` +
        `<path d="M ${stroke / 2} ${size / 2} A ${r} ${r} 0 0 1 ${size - stroke / 2} ${size / 2}" fill="none" stroke="var(--w-accent)" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${half}" stroke-dashoffset="${half * (1 - pct / 100)}" class="plk-ring" data-c="${half}"/>` +
        `</svg><p class="plk-pbig" style="margin-top:-34px">${Math.round(pct)}%</p></div>`;
    }
    return pOk(c, body, o.display === "bar" ? SEG_CSS : o.display === "gauge" ? GAUGE_CSS : FILL_CSS, js);
  };
}

const SEG_CSS = `
.plk-segs { display: flex; gap: 5px; margin-top: 20px; position: relative; z-index: 2; }
.plk-seg { flex: 1; height: 12px; border-radius: 999px; background: oklch(0.37 0.03 240); }
.plk-seg.on { background: var(--w-accent); }
`;

const GAUGE_CSS = `
.plk-gauge { display: flex; flex-direction: column; align-items: center; margin-top: 8px; }
.plk-gauge .plk-ring { transition: stroke-dashoffset 900ms cubic-bezier(0.23,1,0.32,1); }
`;

/* ---- Live period progress (year / month / week / day) ---- */
type Period = "year" | "month" | "week" | "day";
function periodW(period: Period): PR {
  return (c) => {
    const now = new Date();
    let start: Date, end: Date;
    if (period === "year") { start = new Date(now.getFullYear(), 0, 1); end = new Date(now.getFullYear() + 1, 0, 1); }
    else if (period === "month") { start = new Date(now.getFullYear(), now.getMonth(), 1); end = new Date(now.getFullYear(), now.getMonth() + 1, 1); }
    else if (period === "week") { const dow = (now.getDay() + 6) % 7; start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dow); end = new Date(start.getTime() + 7 * 864e5); }
    else { start = new Date(now.getFullYear(), now.getMonth(), now.getDate()); end = new Date(start.getTime() + 864e5); }
    const pct = Math.max(0, Math.min(100, Math.round(((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100)));
    const labels: Record<Period, string> = {
      year: "% of " + now.getFullYear() + " is already behind us",
      month: "% of " + now.toLocaleString("en", { month: "long" }) + " is gone",
      week: "% of this week is gone",
      day: "% of today is gone",
    };
    const body =
      `<h3 class="plk-ptitle">${esc(c.text || labels[period].split("%")[0])}</h3>` +
      `<div class="plk-ringwrap">${ringHtml(pct / 100)}</div>` +
      `<p class="plk-pbig" data-pbig>${pct}%</p><p class="plk-psub">${labels[period].slice(labels[period].indexOf("%") + 1).trim()}</p>`;
    return pOk(c, body, "", pCountJs("[data-pbig]", pct));
  };
}

/* ---- Interactive step counter ---- */
function counterW(o: { step: number; unit: string; max: number }): PR {
  return (c) => {
    const parts = (c.items || "").split("|").map((s) => Number(s.replace(/[^\d.]/g, "")) || 0);
    const cur = parts[0] || 0;
    const goal = parts[1] || o.max;
    const key = "plk-" + esc(String(c.text || "ctr")).replace(/[^a-z]/gi, "").slice(0, 12);
    const body =
      `<h3 class="plk-ptitle">${esc(c.text || "")}</h3>` +
      `<div class="plk-ringwrap">${ringHtml(Math.min(1, cur / goal))}</div>` +
      `<p class="plk-psub" data-cur>${cur.toLocaleString()} of ${goal.toLocaleString()} ${o.unit}</p>` +
      `<button class="plk-pbtn" type="button" data-add="${o.step}">+${o.step.toLocaleString()} ${o.unit}</button>`;
    const css = `
.plk-pbtn { position: relative; z-index: 2; margin-top: 16px; border: 0; cursor: pointer;
  background: var(--w-accent); color: oklch(0.25 0.03 220); font: inherit; font-size: 13.5px; font-weight: 650;
  padding: 10px 16px; border-radius: 999px;
  transition: transform 160ms cubic-bezier(0.23,1,0.32,1), filter 160ms ease; }
.plk-pbtn:hover { filter: brightness(1.07); }
.plk-pbtn:active { transform: scale(0.95); }
`;
    const js =
      "var K='" + key + "';var goal=" + goal + ";var ring=shadow.querySelector('.plk-ring');" +
      "var cur=Number(localStorage.getItem(K)||" + cur + ");" +
      "function render(){var p=Math.min(1,cur/goal);shadow.querySelector('[data-cur]').textContent=cur.toLocaleString()+' of '+goal.toLocaleString()+'" + o.unit + "';" +
      "if(ring){var c=Number(ring.dataset.c);ring.style.strokeDashoffset=c*(1-p)}}" +
      "shadow.querySelector('[data-add]').addEventListener('click',function(){cur=Math.min(goal,cur+" + o.step + ");" +
      "try{localStorage.setItem(K,cur)}catch(e){};render()});render();";
    return pOk(c, body, css, js);
  };
}

/* ---- The 20 countdown & progress widgets ---- */
export const prettyEvent = countdownW({ fb: 19, ring: true, sub: "In %D% days %H% hours" });
export const prettyBirthday = countdownW({ fb: 19, ring: true, sub: "In %D% days %H% hours" });
export const prettyLaunch = countdownW({ fb: 27, dots: { total: 40, cols: 10 }, sub: "In %D% days" });
export const prettyDeadline = countdownW({ fb: 14, fill: true, sub: "%D% days left" });
export const prettyExam = countdownW({ fb: 12, ring: true, sub: "In %D% days %H% hours" });
export const prettyWedding = countdownW({ fb: 90, dots: { total: 45, cols: 9 }, sub: "In %D% days" });
export const prettyVacation = countdownW({ fb: 30, ring: true, sub: "In %D% days %H% hours" });
export const prettyNewYear: PR = (c) => {
  const ny = new Date(Date.UTC(new Date().getUTCFullYear() + 1, 0, 1));
  const days = Math.ceil((ny.getTime() - Date.now()) / 864e5);
  return countdownW({ fb: Math.max(1, days), ring: true, sub: "In %D% days to " + ny.getUTCFullYear() })({ ...c, target: ny.toISOString() });
};
export const prettyPayday = countdownW({ fb: 20, fill: true, sub: "%D% days to payday" });
export const prettyHours = countdownW({ fb: 0.4, ring: true, sub: "", hoursOnly: true });

export const prettyRing = pctW({ display: "ring" });
export const prettyDots = pctW({ display: "dots", total: 40, cols: 10 });
export const prettyFill = pctW({ display: "fill" });
export const prettyGoalBar = pctW({ display: "bar", total: 20 });
export const prettyGauge = pctW({ display: "gauge" });
export const prettyYear = periodW("year");
export const prettyMonth = periodW("month");
export const prettyWeek = periodW("week");
export const prettyDay = periodW("day");
export const prettySteps = counterW({ step: 1000, unit: "steps", max: 10000 });
