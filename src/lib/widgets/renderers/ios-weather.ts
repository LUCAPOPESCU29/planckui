import { esc } from "../base";
import type { RenderResult, WidgetConfig, TestimonialData } from "../types";

/* Apple Weather–style widgets. Glanceable, HIG-grounded: SF Pro system stack,
   ultra-thin display temperature as the signature element, sky-gradient hero
   with frosted stat tiles, semantic light + dark palettes (:host/.dark),
   labels ≥11px, meaning never carried by color alone, motion subtle and
   reduced-motion aware. Icons are a small SF-Symbols-like line set. */

type AW = (c: WidgetConfig, items?: TestimonialData[]) => RenderResult;

const AW_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", "Segoe UI", Roboto, sans-serif';

/* SF-Symbols-flavoured line glyphs, 1.6 stroke, currentColor */
function wxIcon(kind: string, size = 18): string {
  const s = (inner: string) =>
    `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
  switch (kind) {
    case "partly":
      return s('<circle cx="8.5" cy="8.5" r="3.2"/><path d="M8.5 3v1.4M3 8.5h1.4M4.6 4.6l1 1M12.4 4.6l-1 1M3.9 12.4l1-1"/><path d="M10 20h7a3.4 3.4 0 0 0 .6-6.75A4.6 4.6 0 0 0 8.4 14"/>');
    case "cloud":
      return s('<path d="M7 19h10a4 4 0 0 0 .7-7.94A5.6 5.6 0 0 0 6.9 12.6 3.6 3.6 0 0 0 7 19Z"/>');
    case "rain":
      return s('<path d="M7 15h10a4 4 0 0 0 .7-7.94A5.6 5.6 0 0 0 6.9 8.6 3.6 3.6 0 0 0 7 15Z"/><path d="M9 18l-.8 2M13 18l-.8 2M17 18l-.8 2"/>');
    case "storm":
      return s('<path d="M7 14h10a4 4 0 0 0 .7-7.94A5.6 5.6 0 0 0 6.9 7.6 3.6 3.6 0 0 0 7 14Z"/><path d="M13 13l-2.6 4h3l-2.2 4.4"/>');
    case "snow":
      return s('<path d="M7 14h10a4 4 0 0 0 .7-7.94A5.6 5.6 0 0 0 6.9 7.6 3.6 3.6 0 0 0 7 14Z"/><path d="M9 18.4h.01M12.5 20h.01M16 18.4h.01" stroke-width="2.2"/>');
    default: // sun
      return s('<circle cx="12" cy="12" r="4"/><path d="M12 2.5V4.6M12 19.4v2.1M2.5 12h2.1M19.4 12h2.1M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/>');
  }
}

const AW_CSS = `
:host {
  --aw-ink: #ffffff; --aw-mut: oklch(0.95 0.01 230 / 0.82);
  --aw-tile: oklch(1 0 0 / 0.16); --aw-tile-line: oklch(1 0 0 / 0.22);
  --aw-sky: linear-gradient(180deg, #3f7fc9 0%, #5d9ade 55%, #7fb4e8 100%);
  --aw-bar: linear-gradient(90deg, #7fc5ea, #a4d65c 45%, #f6c445 75%, #ee814c);
  --aw-uv: linear-gradient(90deg, #7fc5ea, #a4d65c, #f6c445, #ee814c);
  display: block;
}
:host(.dark) {
  --aw-ink: #f5f8fc; --aw-mut: oklch(0.93 0.01 230 / 0.66);
  --aw-tile: oklch(1 0 0 / 0.08); --aw-tile-line: oklch(1 0 0 / 0.14);
  --aw-sky: linear-gradient(180deg, #0d1e37 0%, #16304f 55%, #234a72 100%);
}
.aw-card {
  max-width: 380px; margin-inline: auto; border-radius: 22px; overflow: hidden;
  background: var(--aw-sky); color: var(--aw-ink); font-family: ${AW_FONT};
  box-shadow: 0 18px 44px oklch(0.2 0.04 250 / 0.35);
  text-shadow: 0 1px 2px oklch(0.2 0.04 250 / 0.18);
}
.aw-hero { padding: 26px 24px 22px; text-align: center; }
.aw-city { font-size: 21px; font-weight: 500; letter-spacing: 0.01em; }
.aw-temp { font-size: 88px; font-weight: 200; line-height: 1.04; letter-spacing: -0.02em;
  margin: 2px 0 0; font-variant-numeric: tabular-nums; }
.aw-cond { font-size: 16px; font-weight: 500; margin-top: -2px; }
.aw-hl { font-size: 15px; font-weight: 500; color: var(--aw-mut); margin-top: 3px; }
.aw-tiles { display: grid; gap: 10px; padding: 0 14px 14px; }
.aw-tiles.two { grid-template-columns: 1fr 1fr; }
.aw-tile {
  border-radius: 16px; background: var(--aw-tile);
  box-shadow: inset 0 0 0 1px var(--aw-tile-line);
  padding: 12px 14px 13px; text-shadow: none;
}
.aw-label { display: flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600;
  letter-spacing: 0.06em; text-transform: uppercase; color: var(--aw-mut); }
.aw-label svg { flex-shrink: 0; }
.aw-big { font-size: 22px; font-weight: 500; margin-top: 6px; font-variant-numeric: tabular-nums; }
.aw-sub { font-size: 12.5px; line-height: 1.42; color: var(--aw-mut); margin-top: 3px; }
.aw-meter { height: 4px; border-radius: 999px; margin-top: 9px; background: var(--aw-tile-line);
  position: relative; overflow: hidden; }
.aw-meter > i { position: absolute; inset: 0; border-radius: 999px; }
.aw-strip { display: flex; gap: 4px; overflow-x: auto; padding: 12px 8px; scrollbar-width: none; }
.aw-strip::-webkit-scrollbar { display: none; }
.aw-hour { flex: 0 0 56px; text-align: center; padding: 10px 0 11px; border-radius: 14px; }
.aw-hour.now { background: var(--aw-tile); box-shadow: inset 0 0 0 1px var(--aw-tile-line); }
.aw-hlab { font-size: 12px; font-weight: 600; color: var(--aw-mut); }
.aw-hlab b { color: var(--aw-ink); font-weight: 600; }
.aw-hicon { margin: 9px 0 8px; display: flex; justify-content: center; }
.aw-hicon .sun { color: #ffd60a; } .aw-hicon .partly { color: #ffd60a; }
.aw-hicon .cloud { color: var(--aw-ink); } .aw-hicon .rain { color: #8ecdf6; }
.aw-hicon .storm { color: #c8b7f8; } .aw-hicon .snow { color: #bfe3fb; }
.aw-htemp { font-size: 16px; font-weight: 500; font-variant-numeric: tabular-nums; }
.aw-days { padding: 6px 14px 10px; }
.aw-day { display: grid; grid-template-columns: 44px 24px 30px 1fr 30px; align-items: center;
  gap: 8px; padding: 10.5px 0; border-top: 1px solid var(--aw-tile-line); }
.aw-day:first-child { border-top: 0; }
.aw-dname { font-size: 15px; font-weight: 500; }
.aw-dicon { display: flex; } .aw-dicon .sun { color: #ffd60a; } .aw-dicon .partly { color: #ffd60a; }
.aw-dicon .cloud { color: var(--aw-ink); } .aw-dicon .rain { color: #8ecdf6; }
.aw-dicon .storm { color: #c8b7f8; } .aw-dicon .snow { color: #bfe3fb; }
.aw-dlo { font-size: 15px; font-weight: 500; text-align: right; color: var(--aw-mut);
  font-variant-numeric: tabular-nums; }
.aw-dhi { font-size: 15px; font-weight: 500; text-align: left; font-variant-numeric: tabular-nums; }
.aw-range { height: 4px; border-radius: 999px; background: oklch(1 0 0 / 0.22); position: relative; }
.aw-range > i { position: absolute; top: 0; bottom: 0; border-radius: 999px; background: var(--aw-bar); }
.aw-section { padding: 12px 16px 14px; }
.aw-seclab { font-size: 12px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;
  color: var(--aw-mut); padding-bottom: 8px; box-shadow: inset 0 -1px 0 var(--aw-tile-line); }
.aw-sunwrap { display: grid; place-items: center; padding: 6px 0 2px; }
.aw-sunpath { position: relative; width: 100%; max-width: 300px; }
.aw-sunpath svg { width: 100%; height: auto; display: block; }
.aw-sundot { position: absolute; width: 14px; height: 14px; margin: -7px; border-radius: 999px;
  background: #ffd60a; box-shadow: 0 0 10px oklch(0.85 0.12 95 / 0.9); }
.aw-both { display: flex; justify-content: space-between; gap: 12px; margin-top: 6px; }
.aw-both div { font-size: 13px; color: var(--aw-mut); } .aw-both b { display: block; font-size: 16px;
  color: var(--aw-ink); font-weight: 500; font-variant-numeric: tabular-nums; }
@keyframes aw-breath { 50% { opacity: 0.55; } }
.aw-live { animation: aw-breath 2.4s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .aw-live { animation: none; } }
`;

function shell(c: WidgetConfig, inner: string): string {
  return `<div class="aw-card">${inner}</div>`;
}

function num(x: unknown, dflt: number): number {
  const n = Number(x);
  return Number.isFinite(n) ? n : dflt;
}

/* ---------- 1. Current conditions (the hero card) ---------- */
const current: AW = (c) => {
  const city = String(c.text || "Cupertino");
  const cond = String(c.cond || "Mostly Sunny");
  const t = num(c.temp, 21);
  const hi = num(c.hi, 24);
  const lo = num(c.lo, 14);
  const body =
    `<div class="aw-hero">` +
    `<div class="aw-city">${esc(city)}</div>` +
    `<div class="aw-temp">${t}°</div>` +
    `<div class="aw-cond">${wxIcon("partly", 17)} ${esc(cond)}</div>` +
    `<div class="aw-hl">H:${hi}°  L:${lo}°</div></div>` +
    `<div class="aw-tiles two">` +
    `<div class="aw-tile"><div class="aw-label">${wxIcon("sun", 13).replace('stroke="currentColor"', 'stroke="#ffd60a"')} UV Index</div>` +
    `<div class="aw-big">4 <span style="font-size:13px;font-weight:400;color:var(--aw-mut)">Moderate</span></div>` +
    `<div class="aw-meter"><i style="width:36%;background:var(--aw-uv)"></i></div></div>` +
    `<div class="aw-tile"><div class="aw-label">${wxIcon("sun", 13).replace('stroke="currentColor"', 'stroke="#ff9f0a"')} Sunset</div>` +
    `<div class="aw-big">19:48</div><div class="aw-sub">Sunrise was 06:14</div></div></div>`;
  return { html: shell(c, body), css: AW_CSS };
};

/* ---------- 2. Hourly strip ---------- */
const hourly: AW = (c, items) => {
  const city = String(c.text || "Cupertino");
  const rows = String(c.items || "Now|21|sun\n11AM|21|sun\n12PM|22|partly\n1PM|23|partly\n2PM|23|cloud\n3PM|22|rain\n4PM|21|rain\n5PM|20|rain")
    .split("\n").map((l) => l.split("|").map((p) => p.trim())).filter((p) => p[0]);
  const cells = rows.map((p, i) => {
    const label = esc(p[0]);
    const kind = p[2] || "sun";
    const temp = esc(p[1] || "");
    const isNow = /^now$/i.test(p[0]);
    return `<div class="aw-hour${isNow ? " now" : ""}">` +
      `<div class="aw-hlab">${isNow ? "<b>Now</b>" : label}</div>` +
      `<div class="aw-hicon ${esc(kind)}">${wxIcon(kind)}</div>` +
      `<div class="aw-htemp">${temp}°</div></div>`;
  }).join("");
  const body =
    `<div class="aw-hero" style="padding-bottom:14px"><div class="aw-city" style="font-size:17px">${wxIcon("sun", 15).replace('stroke="currentColor"', 'stroke="#ffd60a"')} ${esc(city)}</div>` +
    `<div class="aw-cond" style="font-size:15px;color:var(--aw-mut)">Mostly sunny through the afternoon</div></div>` +
    `<div class="aw-strip">${cells}</div>`;
  return { html: shell(c, body), css: AW_CSS };
};

/* ---------- 3. Daily forecast with the gradient range bars ---------- */
const daily: AW = (c, items) => {
  const rows = String(c.items || "Today|24|14|sun\nTue|23|14|partly\nWed|21|13|cloud\nThu|19|12|rain\nFri|18|11|rain\nSat|22|13|partly\nSun|25|15|sun\nMon|26|16|sun")
    .split("\n").map((l) => l.split("|").map((p) => p.trim())).filter((p) => p[0]);
  const parsed = rows.map((p) => ({ day: p[0], hi: num(p[1], 20), lo: num(p[2], 12), kind: p[3] || "sun" }));
  const min = Math.min(...parsed.map((r) => r.lo));
  const max = Math.max(...parsed.map((r) => r.hi));
  const span = Math.max(max - min, 1);
  const rowsHtml = parsed.map((r) => {
    const left = ((r.lo - min) / span) * 100;
    const width = Math.max(((r.hi - r.lo) / span) * 100, 6);
    const name = /^today/i.test(r.day) ? `<b>${esc(r.day)}</b>` : esc(r.day);
    return `<div class="aw-day">` +
      `<span class="aw-dname">${name}</span>` +
      `<span class="aw-dicon ${esc(r.kind)}">${wxIcon(r.kind, 17)}</span>` +
      `<span class="aw-dlo">${r.lo}°</span>` +
      `<span class="aw-range"><i style="left:${left.toFixed(1)}%;width:${width.toFixed(1)}%"></i></span>` +
      `<span class="aw-dhi">${r.hi}°</span></div>`;
  }).join("");
  const body = `<div class="aw-section"><div class="aw-seclab">${esc(String(c.text || "10-Day Forecast"))}</div><div class="aw-days">${rowsHtml}</div></div>`;
  return { html: shell(c, body), css: AW_CSS };
};

/* ---------- 4. Conditions grid (UV, feels like, humidity, wind) ---------- */
const stats: AW = (c) => {
  const uv = num(c.uv, 4);
  const feels = num(c.feels, 23);
  const hum = num(c.hum, 62);
  const wind = num(c.wind, 12);
  const uvWord = uv <= 2 ? "Low" : uv <= 5 ? "Moderate" : uv <= 7 ? "High" : "Very high";
  const tile = (label: string, icon: string, color: string, big: string, sub: string, meter?: string) =>
    `<div class="aw-tile"><div class="aw-label">${wxIcon(icon, 13).replace('stroke="currentColor"', `stroke="${color}"`)} ${label}</div>` +
    `<div class="aw-big">${big}</div><div class="aw-sub">${sub}</div>` +
    (meter ? `<div class="aw-meter"><i style="${meter}"></i></div>` : "") + `</div>`;
  const body =
    `<div class="aw-hero" style="padding-bottom:16px"><div class="aw-city" style="font-size:17px">${esc(String(c.text || "Cupertino"))}</div>` +
    `<div class="aw-cond" style="font-size:15px;color:var(--aw-mut)">Conditions right now</div></div>` +
    `<div class="aw-tiles two">` +
    tile("UV Index", "sun", "#ffd60a", `${uv}`, uvWord, `width:${(uv / 11) * 100}%;background:var(--aw-uv)`) +
    tile("Feels Like", "storm", "#ff9f0a", `${feels}°`, "Wind is making it feel cooler") +
    tile("Humidity", "rain", "#64b5f6", `${hum}%`, "Dew point is 12° right now") +
    tile("Wind", "cloud", "#9be27d", `${wind} km/h`, "Gusts up to 21 km/h today") +
    `</div>`;
  return { html: shell(c, body), css: AW_CSS };
};

/* ---------- 5. Sun path arc ---------- */
const sun: AW = (c) => {
  const rise = String(c.rise || "06:14");
  const set = String(c.set || "19:48");
  const t = Math.min(Math.max(num(c.progress, 62), 0), 100) / 100;
  // elliptical sunrise->sunset arc across a 300x104 box: left (20,96), right (280,96)
  const theta = Math.PI * (1 - t);
  const arcX = 150 + 140 * Math.cos(theta);
  const arcY = 96 - 90 * Math.sin(theta);
  const body =
    `<div class="aw-section">` +
    `<div class="aw-seclab">${esc(String(c.text || "Sun Path"))}</div>` +
    `<div class="aw-sunwrap"><div class="aw-sunpath">` +
    `<svg viewBox="0 0 300 104" aria-hidden="true">` +
    `<line x1="8" y1="96" x2="292" y2="96" stroke="oklch(1 0 0 / 0.35)" stroke-width="1"/>` +
    `<path d="M20,96 A140,90 0 0 1 280,96" fill="none" stroke="oklch(1 0 0 / 0.3)" stroke-width="1.5" stroke-dasharray="3 4"/>` +
    `</svg>` +
    `<span class="aw-sundot" style="left:${((arcX / 300) * 100).toFixed(1)}%;top:${((arcY / 104) * 100).toFixed(1)}%"></span>` +
    `</div></div>` +
    `<div class="aw-both"><div>Sunrise<b>${esc(rise)}</b></div>` +
    `<div style="text-align:center">Daylight<b style="margin:0 auto">13 h 34 min</b></div>` +
    `<div style="text-align:right">Sunset<b>${esc(set)}</b></div></div></div>`;
  return { html: shell(c, body), css: AW_CSS };
};

export const IOSW_RENDERERS: Record<string, AW> = {
  "iosw-current": current,
  "iosw-hourly": hourly,
  "iosw-daily": daily,
  "iosw-stats": stats,
  "iosw-sun": sun,
};
