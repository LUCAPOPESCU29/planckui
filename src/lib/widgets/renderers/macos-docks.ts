import { esc } from "../base";
import type { RenderResult, WidgetConfig, TestimonialData } from "../types";
import { appIcon, brandIcon } from "./mac-icons";

/* macOS dock resources — CoolDock/NotchNook-style dock bars and desktop
   widgets. These are NOT website embeds: each one is downloadable as an
   Übersicht widget that renders on the user's physical Mac desktop.
   Apple design language: dark vibrancy glass, SF stack, traffic separators,
   real app icons from mac-icons.ts. */

type MD = (c: WidgetConfig, items?: TestimonialData[]) => RenderResult;

const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", "Segoe UI", sans-serif';

const DOCK_CSS = `
:host { display: block; --md-ink: #f5f5f7; --md-mut: oklch(0.93 0.005 260 / 0.62);
  --md-sep: oklch(1 0 0 / 0.14); --md-chip: oklch(1 0 0 / 0.09); }
:host(.dark) { --md-mut: oklch(0.93 0.005 260 / 0.55); }
.md-stage {
  position: relative; overflow: hidden; border-radius: 20px; padding: 44px 12px;
  background:
    radial-gradient(120% 90% at 20% 10%, #4a5f8f 0%, transparent 55%),
    radial-gradient(110% 100% at 85% 20%, #7a4f8f 0%, transparent 55%),
    radial-gradient(120% 120% at 60% 110%, #2e4a3f 0%, transparent 60%),
    linear-gradient(160deg, #1a1d26, #101218);
}
.md-stage::after { content: ""; position: absolute; inset: 0;
  background: radial-gradient(80% 60% at 50% 100%, oklch(0 0 0/0.35), transparent); pointer-events: none; }
.md-bar {
  position: relative; display: flex; align-items: center; gap: 14px;
  padding: 10px 14px; border-radius: 18px;
  background: oklch(0.18 0.01 260 / 0.55);
  -webkit-backdrop-filter: blur(28px) saturate(1.7); backdrop-filter: blur(28px) saturate(1.7);
  box-shadow: inset 0 0 0 1px oklch(1 0 0 / 0.12), 0 14px 40px oklch(0 0 0 / 0.45);
  color: var(--md-ink); font-family: ${SF}; white-space: nowrap;
  width: max-content; max-width: 100%; margin-inline: auto; overflow-x: auto; scrollbar-width: none;
}
.md-bar::-webkit-scrollbar { display: none; }
.md-w { display: flex; align-items: center; gap: 9px; }
.md-sep { width: 1px; height: 30px; background: var(--md-sep); flex-shrink: 0; }
.md-time { font-size: 22px; font-weight: 300; letter-spacing: 0.01em; font-variant-numeric: tabular-nums; line-height: 1.05; }
.md-cap { font-size: 10.5px; color: var(--md-mut); line-height: 1.25; }
.md-art { width: 34px; height: 34px; border-radius: 7px; background: linear-gradient(135deg,#f6d365,#8e9bf5 60%,#5a4fcf);
  box-shadow: 0 3px 10px oklch(0 0 0/0.4); }
.md-t1 { font-size: 12px; font-weight: 600; line-height: 1.2; }
.md-t2 { font-size: 10.5px; color: var(--md-mut); line-height: 1.25;
  max-width: 108px; overflow: hidden; text-overflow: ellipsis; }
.md-ctl { display: flex; gap: 9px; align-items: center; color: var(--md-ink); }
.md-play { width: 26px; height: 26px; border-radius: 999px; background: oklch(1 0 0 / 0.14);
  display: grid; place-items: center; }
.md-timer { font-size: 17px; font-weight: 500; font-variant-numeric: tabular-nums; }
.md-ring { width: 30px; height: 30px; border-radius: 999px; display: grid; place-items: center;
  font-size: 11.5px; font-weight: 600; font-variant-numeric: tabular-nums; position: relative;
  background: conic-gradient(var(--rc, #007AFF) calc(var(--p, 40) * 1%), oklch(1 0 0 / 0.12) 0); }
.md-ring::before { content: ""; position: absolute; inset: 2.5px; border-radius: 999px;
  background: oklch(0.2 0.01 260 / 0.9); }
.md-ring b { position: relative; font-weight: 600; }
.md-note { width: 30px; height: 30px; border-radius: 7px; background: linear-gradient(180deg,#fef7c0,#f5d93f);
  display: grid; place-items: center; }
.md-emoji { display: flex; gap: 3px; font-size: 17px; }
.md-speed { font-size: 11px; color: var(--md-mut); line-height: 1.35; font-variant-numeric: tabular-nums; }
.md-speed b { color: var(--md-ink); font-weight: 500; }
.md-check { width: 20px; height: 20px; border-radius: 999px; background: #0a84ff; display: grid; place-items: center; }
.md-apps { display: flex; gap: 8px; align-items: center; }
.md-apps .mw-app { transition: transform 180ms cubic-bezier(0.23, 1, 0.32, 1); }
.md-apps .mw-app:hover { transform: scale(1.22) translateY(-5px); }
.md-dl { width: 30px; height: 30px; border-radius: 999px; border: 1.5px solid oklch(1 0 0 / 0.35);
  display: grid; place-items: center; color: var(--md-ink); }
.md-conn-tile { width: 30px; height: 30px; border-radius: 8px; background: oklch(1 0 0 / 0.1);
  box-shadow: inset 0 0 0 1px oklch(1 0 0 / 0.12); display: grid; place-items: center; flex-shrink: 0; }
.md-glasscard { border-radius: 12px; background: oklch(1 0 0 / 0.07); box-shadow: inset 0 0 0 1px oklch(1 0 0 / 0.09);
  padding: 7px 10px; }
.md-fixture { font-family: ${SF}; color: #f5f5f7; max-width: 520px; margin-inline: auto; }
`;

function stage(inner: string): string {
  return `<div class="md-fixture"><div class="md-stage"><div class="md-bar">${inner}</div></div></div>`;
}

const svg = (d: string, s = 12, extra = "") =>
  `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="currentColor" ${extra}><path d="${d}"/></svg>`;
const P = {
  play: "M8 5.5v13l11-6.5z",
  prev: "M19 5.5v13L9 12z M5 6h2.4v12H5z",
  next: "M5 5.5v13L15 12z M16.6 6H19v12h-2.4z",
  copy: "M9 9h9v11H9z M15 5H6v11",
  check: "M9.5 16.2 5.8 12.5l1.4-1.4 2.3 2.3 5.3-5.3 1.4 1.4z",
  down: "M12 4v10m0 0 4-4m-4 4-4-4M5 19h14",
};

/* ---------- 1. Dynamic Dock · Pro (the screenshot recreation) ---------- */
const dockpro: MD = (c) => {
  const city = String(c.text || "Chicago");
  const time = String((c as WidgetConfig & { time?: string }).time || "__TIME__");
  const inner =
    /* time */
    `<div class="md-w"><div><div class="md-time">${time}</div><div class="md-cap">${esc(city)} ·−8h</div></div></div>` +
    `<span class="md-sep"></span>` +
    /* now playing */
    `<div class="md-w"><span class="md-art"></span>` +
    `<div class="md-glasscard" style="display:flex;align-items:center;gap:8px">` +
    `<div><div class="md-t1">Heaven</div><div class="md-t2">Navid</div></div>` +
    `<div class="md-ctl"><span>${svg(P.prev, 11)}</span><span class="md-play">${svg(P.play, 10)}</span><span>${svg(P.next, 11)}</span></div></div></div>` +
    `<span class="md-sep"></span>` +
    /* timer */
    `<div class="md-w"><span class="md-timer">10:00</span><span class="md-play" style="background:#0a84ff">${svg(P.play, 10)}</span></div>` +
    `<span class="md-sep"></span>` +
    /* note */
    `<div class="md-w"><span class="md-note"><svg width="16" height="16" viewBox="0 0 24 24" width="58%" height="58%"><rect x="4" y="3.5" width="16" height="17" rx="2" fill="#fffbe6"/><path d="M4 8h16" stroke="#f5d93f" stroke-width="2"/><path d="M7 12h10M7 15h7" stroke="#d9c778" stroke-width="1.2" stroke-linecap="round"/></svg></span>` +
    `<div><div class="md-t1">Google Maps –</div><div class="md-t2">Google Maps · AtaZbAyAmYGmDA…</div></div>` +
    `<span class="md-ctl" style="color:var(--md-mut)">${svg(P.copy, 12)}</span></div>` +
    `<span class="md-sep"></span>` +
    /* calendar event */
    `<div class="md-w"><span class="md-note" style="background:#fff"><svg viewBox="0 0 24 24" width="30" height="30"><rect x="1" y="1" width="22" height="22" rx="5" fill="#fff"/><rect x="1" y="1" width="22" height="6" rx="3" fill="#FF3B30"/><text x="12" y="6.3" text-anchor="middle" font-family="-apple-system,sans-serif" font-size="3.6" font-weight="600" fill="#fff">TODAY</text><text x="12" y="19.5" text-anchor="middle" font-family="-apple-system,sans-serif" font-size="11" font-weight="300" fill="#1d1d1f">4</text></svg></span>` +
    `<div><div class="md-t1">Today · All day</div><div class="md-t2">Independence Day (substitute)</div></div></div>` +
    `<span class="md-sep"></span>` +
    /* emojis */
    `<div class="md-w md-emoji"><span>😂</span><span>🥰</span><span>🔥</span><span>😍</span><span>👍</span></div>` +
    `<span class="md-sep"></span>` +
    /* gauges */
    `<div class="md-w"><span class="md-ring" style="--p:27;--rc:#0a84ff"><b>27</b></span>` +
    `<span class="md-ring" style="--p:80;--rc:#ff453a"><b>80</b></span></div>` +
    `<span class="md-sep"></span>` +
    /* network */
    `<div class="md-w"><div class="md-speed">↓ <b>80 KB/s</b><br/>↑ <b>5 KB/s</b></div></div>` +
    `<span class="md-sep"></span>` +
    /* drink water */
    `<div class="md-w"><div><div class="md-t1" style="font-size:11.5px">Drink<br/>Water</div></div>` +
    `<span class="md-ring" style="--p:60;--rc:#0a84ff"><b style="font-size:9px">3/5</b></span>` +
    `<span class="md-check">${svg(P.check, 12, 'stroke="#fff" fill="#fff"')}</span></div>` +
    `<span class="md-sep"></span>` +
    /* apps + trash */
    `<div class="md-apps" style="opacity:0.55">${appIcon("safari", 34)}${appIcon("messages", 34)}${appIcon("music", 34)}</div>` +
    `<span class="md-sep"></span>` +
    `<div class="md-w"><span class="md-dl">${svg(P.down, 13)}</span>${appIcon("launchpad", 34)}${appIcon("trash", 34)}</div>`;
  return { html: stage(inner), css: DOCK_CSS };
};

/* ---------- 2. Classic Dock · real icons + magnification ---------- */
const dockclassic: MD = (c) => {
  const apps = String(c.items || "finder,safari,mail,messages,maps,calendar,photos,music,notes,terminal,settings")
    .split(",").map((a) => a.trim()).filter(Boolean);
  const tiles = apps.map((a) => `<div title="${esc(a)}">${appIcon(a, 46)}<div style="height:9px"></div></div>`).join("");
  const inner =
    `<div style="display:flex;align-items:flex-end;gap:10px;padding:8px 12px 7px">${tiles}` +
    `<span class="md-sep"></span>` +
    `<div><div title="Launchpad">${appIcon("launchpad", 46)}</div><div style="height:9px"></div></div>` +
    `<div><div title="Trash">${appIcon("trash", 46)}</div><div style="height:9px"></div></div></div>`;
  return { html: stage(`<div class="md-bar" style="border-radius:24px">${inner}</div>`), css: DOCK_CSS };
};

/* ---------- 3. Developer dock with connected tiles ---------- */
const dockdev: MD = (c) => {
  const inner =
    `<div class="md-w"><div><div class="md-time">main</div><div class="md-cap">planckui · clean</div></div></div>` +
    `<span class="md-sep"></span>` +
    `<div class="md-w"><span class="md-ring" style="--p:96;--rc:#34C759"><b>✓</b></span><div><div class="md-t1">deploy</div><div class="md-cap">ready · 42s</div></div></div>` +
    `<span class="md-sep"></span>` +
    `<div class="md-w"><span class="md-conn-tile">${brandIcon("github", 18)}</span><div><div class="md-t1">128 stars</div><div class="md-cap">this week</div></div></div>` +
    `<span class="md-sep"></span>` +
    `<div class="md-w"><span class="md-conn-tile">${brandIcon("linear", 18)}</span><div><div class="md-t1">7 issues</div><div class="md-cap">cycle ends 2d</div></div></div>` +
    `<span class="md-sep"></span>` +
    `<div class="md-w"><span class="md-conn-tile">${brandIcon("figma", 18)}</span><div><div class="md-t1">3 edits</div><div class="md-cap">widget-system</div></div></div>` +
    `<span class="md-sep"></span>` +
    `<div class="md-w"><div class="md-speed">▲ <b>1.2 MB/s</b><br/>▼ <b>340 KB/s</b></div></div>` +
    `<span class="md-sep"></span>` +
    `<div class="md-apps">${appIcon("terminal", 36)}${appIcon("arc", 36)}${appIcon("notion", 36)}${appIcon("obsidian", 36)}${appIcon("raycast", 36)}</div>`;
  return { html: stage(inner), css: DOCK_CSS };
};

/* ---------- 4. Desktop clock & weather (Übersicht classic) ---------- */
const deskclock: MD = (c) => {
  const city = String(c.text || "Chicago");
  const temp = String(c.temp || "21°");
  const cond = String(c.cond || "Mostly Sunny");
  const body =
    `<div class="md-fixture"><div class="md-desk">` +
    `<div class="md-desktime">__TIME__</div>` +
    `<div class="md-deskcity">${esc(city)} · ${esc(temp)} · ${esc(cond)}</div>` +
    `</div></div>`;
  const css = DOCK_CSS + `
.md-desk { text-align: center; font-family: ${SF}; color: #f5f5f7;
  text-shadow: 0 2px 18px oklch(0 0 0/0.45); }
.md-desktime { font-size: 92px; font-weight: 200; letter-spacing: 0.01em;
  font-variant-numeric: tabular-nums; line-height: 1; }
.md-deskcity { font-size: 15px; font-weight: 500; opacity: 0.85; margin-top: 6px; }`;
  return { html: body, css };
};

export const MACOS_DOCK_RENDERERS: Record<string, MD> = {
  "dockpro": dockpro,
  "dockclassic": dockclassic,
  "dockdev": dockdev,
  "deskclock": deskclock,
};
