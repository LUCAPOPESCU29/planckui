import { esc } from "../base";
import type { RenderResult, WidgetConfig, TestimonialData } from "../types";
import { appIcon, brandIcon } from "./mac-icons";

/* macOS dock resources — glass dock bars and desktop widgets that install on
   the user's physical Mac via Übersicht. Design system:
   · spacing on a 4px scale (4/8/12/16/24), consistent radii (10/14/18/22)
   · spring physics: cubic-bezier(0.34,1.56,0.64,1) at ≤220ms, stagger 24ms
   · neighbor magnification (:has + sibling), running dots, reduced-motion off
   · real app icons from mac-icons.ts (official simple-icons geometry) */

type MD = (c: WidgetConfig, items?: TestimonialData[]) => RenderResult;

const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", "Segoe UI", sans-serif';

const DOCK_CSS = `
:host { display: block;
  --md-ink: #f5f5f7; --md-mut: oklch(0.93 0.005 260 / 0.6);
  --md-sep: oklch(1 0 0 / 0.12); --md-chip: oklch(1 0 0 / 0.08);
  --md-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
.md-fixture { font-family: ${SF}; color: var(--md-ink); max-width: 560px; margin-inline: auto; }
.md-stage {
  position: relative; overflow: hidden; border-radius: 24px; padding: 52px 16px;
  background:
    radial-gradient(130% 100% at 15% 0%, #3d5a94 0%, transparent 52%),
    radial-gradient(120% 110% at 88% 12%, #6d4a94 0%, transparent 55%),
    radial-gradient(130% 120% at 55% 115%, #23453c 0%, transparent 58%),
    linear-gradient(155deg, #171a23 0%, #0e1016 100%);
}
.md-stage::before { content: ""; position: absolute; inset: 0;
  background: radial-gradient(60% 40% at 50% 108%, oklch(0.7 0.05 260 / 0.18), transparent); }
.md-bar {
  position: relative; z-index: 1; display: flex; align-items: center; gap: 12px;
  padding: 10px 14px; border-radius: 22px;
  background: oklch(0.2 0.012 265 / 0.52);
  -webkit-backdrop-filter: blur(30px) saturate(1.8); backdrop-filter: blur(30px) saturate(1.8);
  box-shadow: inset 0 0 0 1px oklch(1 0 0 / 0.13), inset 0 1px 0 oklch(1 0 0 / 0.12), 0 18px 50px oklch(0 0 0 / 0.5);
  width: max-content; max-width: 100%; margin-inline: auto; overflow-x: auto; scrollbar-width: none;
}
.md-bar::-webkit-scrollbar { display: none; }
.md-w { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.md-sep { width: 1px; height: 34px; background: var(--md-sep); flex-shrink: 0; }
.md-time { font-size: 24px; font-weight: 300; letter-spacing: 0.01em; font-variant-numeric: tabular-nums; line-height: 1.04; }
.md-cap { font-size: 11px; color: var(--md-mut); line-height: 1.3; }
.md-t1 { font-size: 12.5px; font-weight: 600; line-height: 1.25; white-space: nowrap; }
.md-t2 { font-size: 11px; color: var(--md-mut); line-height: 1.3; max-width: 118px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.md-art { width: 38px; height: 38px; border-radius: 8px; flex-shrink: 0;
  background: linear-gradient(135deg,#f6d365,#8e9bf5 55%,#5a4fcf);
  box-shadow: inset 0 1px 0 oklch(1 0 0/0.3), 0 4px 12px oklch(0 0 0/0.4); }
.md-glass { border-radius: 12px; background: var(--md-chip);
  box-shadow: inset 0 0 0 1px oklch(1 0 0 / 0.1); padding: 8px 11px; }
.md-ctl { display: flex; gap: 10px; align-items: center; }
.md-btn { width: 24px; height: 24px; border-radius: 999px; background: oklch(1 0 0 / 0.13);
  display: grid; place-items: center; transition: transform 160ms var(--md-spring), background 160ms ease; }
.md-btn:hover { background: oklch(1 0 0 / 0.22); }
.md-btn:active { transform: scale(0.94); }
.md-play { width: 26px; height: 26px; border-radius: 999px; background: #0a84ff;
  display: grid; place-items: center; box-shadow: 0 3px 10px oklch(0.55 0.19 250 / 0.5);
  transition: transform 160ms var(--md-spring); }
.md-play:active { transform: scale(0.92); }
.md-timer { font-size: 17px; font-weight: 500; font-variant-numeric: tabular-nums; }
.md-note { width: 32px; height: 32px; border-radius: 7.5px; background: linear-gradient(180deg,#fef7c0,#f5d93f);
  display: grid; place-items: center; flex-shrink: 0;
  box-shadow: inset 0 0 0 1px oklch(0.6 0.08 100 / 0.25), 0 3px 8px oklch(0 0 0/0.3); }
.md-emoji { display: flex; gap: 4px; font-size: 18px; }
.md-ring { width: 32px; height: 32px; border-radius: 999px; display: grid; place-items: center;
  font-size: 11.5px; font-weight: 600; font-variant-numeric: tabular-nums; position: relative;
  background: conic-gradient(var(--rc, #0a84ff) calc(var(--p, 40) * 1%), oklch(1 0 0 / 0.13) 0);
  flex-shrink: 0; }
.md-ring::before { content: ""; position: absolute; inset: 2.5px; border-radius: 999px;
  background: oklch(0.22 0.012 265 / 0.95); }
.md-ring b { position: relative; font-weight: 600; }
.md-speed { font-size: 11px; color: var(--md-mut); line-height: 1.4; font-variant-numeric: tabular-nums; }
.md-speed b { color: var(--md-ink); font-weight: 500; }
.md-check { width: 20px; height: 20px; border-radius: 999px; background: #0a84ff;
  display: grid; place-items: center; flex-shrink: 0; }
.md-conn { width: 32px; height: 32px; border-radius: 9px; background: oklch(1 0 0 / 0.94);
  display: grid; place-items: center; flex-shrink: 0;
  box-shadow: inset 0 0 0 1px oklch(0 0 0/0.06), 0 3px 8px oklch(0 0 0/0.28); }
/* --- the app section: real macOS dock magnification --- */
.md-apps { display: flex; align-items: flex-end; gap: 8px; }
.md-apps > * { transition: transform 220ms var(--md-spring); transform-origin: bottom center; }
.md-apps:hover > * { transform: scale(1.14) translateY(-4px); }
.md-apps > *:hover { transform: scale(1.42) translateY(-9px); }
.md-apps > *:hover + * { transform: scale(1.24) translateY(-6px); }
.md-apps > *:has(+ *:hover) { transform: scale(1.24) translateY(-6px); }
.md-apps > *:hover + * + * { transform: scale(1.08) translateY(-2px); }
.md-apps > *:has(+ * + *:hover) { transform: scale(1.08) translateY(-2px); }
@keyframes md-pop { from { opacity: 0; transform: translateY(14px) scale(0.6); } }
.md-apps > * { animation: md-pop 0.5s cubic-bezier(0.23, 1, 0.32, 1) backwards;
  animation-delay: calc(var(--i, 0) * 24ms); }
@keyframes md-breathe { 50% { opacity: 0.45; } }
.md-live { animation: md-breathe 2.6s ease-in-out infinite; }
.md-dot { width: 4px; height: 4px; border-radius: 999px; background: var(--md-ink); opacity: 0.75;
  margin: 5px auto 0; }
.md-dl { width: 32px; height: 32px; border-radius: 999px; border: 1.5px solid oklch(1 0 0 / 0.32);
  display: grid; place-items: center; flex-shrink: 0; transition: transform 160ms var(--md-spring), border-color 160ms ease; }
.md-dl:hover { border-color: oklch(1 0 0 / 0.6); transform: translateY(-2px); }
.md-fixture .md-apps .mw-app { border-radius: 12.5px;
  box-shadow: inset 0 1px 0 oklch(1 0 0/0.35), inset 0 0 0 1px oklch(0 0 0/0.08), 0 5px 14px oklch(0 0 0/0.32); }
@media (prefers-reduced-motion: reduce) {
  .md-apps > * { animation: none; }
  .md-apps > *:hover, .md-apps:hover > *, .md-apps > *:hover + *, .md-apps > *:has(+ *:hover),
  .md-apps > *:hover + * + *, .md-apps > *:has(+ * + *:hover) { transform: none; }
  .md-live { animation: none; }
}
`;

function stage(inner: string): string {
  return `<div class="md-fixture"><div class="md-stage"><div class="md-bar">${inner}</div></div></div>`;
}

const svg = (d: string, s = 12, extra = "") =>
  `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="currentColor" ${extra} aria-hidden="true"><path d="${d}"/></svg>`;
const P = {
  play: "M8 5.5v13l11-6.5z",
  prev: "M19 5.5v13L9 12z M5 6h2.4v12H5z",
  next: "M5 5.5v13L15 12z M16.6 6H19v12h-2.4z",
  down: "M12 4v10m0 0 4-4m-4 4-4-4M5 19h14",
};

/* ---------- 1. Dynamic Dock · Pro ---------- */
const dockpro: MD = (c) => {
  const city = String(c.text || "Chicago");
  const inner =
    `<div class="md-w"><div><div class="md-time">18:16</div><div class="md-cap">${esc(city)} ·−8h</div></div></div>` +
    `<span class="md-sep"></span>` +
    `<div class="md-w"><span class="md-art"></span>` +
    `<div class="md-glass" style="display:flex;align-items:center;gap:9px">` +
    `<div><div class="md-t1">Heaven</div><div class="md-t2">Navid</div></div>` +
    `<div class="md-ctl"><span class="md-btn">${svg(P.prev, 11)}</span><span class="md-play">${svg(P.play, 10)}</span><span class="md-btn">${svg(P.next, 11)}</span></div></div>` +
    `<span style="display:grid;place-items:center;color:var(--md-mut)">${brandIcon("applemusic", 16)}</span></div>` +
    `<span class="md-sep"></span>` +
    `<div class="md-w"><span class="md-timer">10:00</span><span class="md-play">${svg(P.play, 10)}</span></div>` +
    `<span class="md-sep"></span>` +
    `<div class="md-w"><span class="md-note"><svg width="17" height="17" viewBox="0 0 24 24" width="58%" height="58%"><rect x="4" y="3.5" width="16" height="17" rx="2" fill="#fffbe6"/><path d="M4 8h16" stroke="#f5d93f" stroke-width="2"/><path d="M7 12h10M7 15h7" stroke="#d9c778" stroke-width="1.2" stroke-linecap="round"/></svg></span>` +
    `<div><div class="md-t1">Google Maps —</div><div class="md-t2">AtaZbAyAmYGmDA…</div></div></div>` +
    `<span class="md-sep"></span>` +
    `<div class="md-w"><span class="md-note" style="background:#fff"><svg viewBox="0 0 24 24" width="32" height="32"><rect x="1" y="1" width="22" height="22" rx="5" fill="#fff"/><rect x="1" y="1" width="22" height="6" rx="3" fill="#FF3B30"/><text x="12" y="6.3" text-anchor="middle" font-family="-apple-system,sans-serif" font-size="3.6" font-weight="600" fill="#fff">TODAY</text><text x="12" y="19.5" text-anchor="middle" font-family="-apple-system,sans-serif" font-size="11" font-weight="300" fill="#1d1d1f">4</text></svg></span>` +
    `<div><div class="md-t1">Today · All day</div><div class="md-t2">Independence Day</div></div></div>` +
    `<span class="md-sep"></span>` +
    `<div class="md-w md-emoji"><span>😂</span><span>🥰</span><span>🔥</span><span>😍</span><span>👍</span></div>` +
    `<span class="md-sep"></span>` +
    `<div class="md-w"><span class="md-ring" style="--p:27;--rc:#0a84ff"><b>27</b></span>` +
    `<span class="md-ring" style="--p:80;--rc:#ff453a"><b>80</b></span>` +
    `<div class="md-speed">↓ <b>80 KB/s</b><br/>↑ <b>5 KB/s</b></div>` +
    `<div><div class="md-t1" style="font-size:11.5px">Drink Water</div>` +
    `<div style="display:flex;gap:6px;align-items:center;margin-top:3px"><span class="md-ring" style="--p:60;--rc:#0a84ff;width:26px;height:26px"><b style="font-size:8.5px">3/5</b></span><span class="md-check">${svg("M9.5 16.2 5.8 12.5l1.4-1.4 2.3 2.3 5.3-5.3 1.4 1.4z", 12, 'stroke="#fff" fill="#fff"')}</span></div></div></div>` +
    `<span class="md-sep"></span>` +
    `<div class="md-apps">` +
    ["spotify", "figma", "notion", "telegram"].map((a, i) => `<span style="--i:${i}">${appIcon(a, 38)}</span>`).join("") +
    `</div>` +
    `<span class="md-sep"></span>` +
    `<div class="md-apps"><span style="--i:0" title="Vercel">${appIcon("vercel", 38)}</span><span style="--i:1">${appIcon("launchpad", 38)}</span><span style="--i:2">${appIcon("trash", 38)}</span></div>`;
  return { html: stage(inner), css: DOCK_CSS };
};

/* ---------- 2. Classic Dock · real icons ---------- */
const dockclassic: MD = (c) => {
  const apps = String(c.items || "finder,safari,mail,messages,maps,calendar,photos,music,notes,terminal,settings")
    .split(",").map((a) => a.trim()).filter(Boolean);
  const tiles = apps.map((a, i) => `<span style="--i:${i}" title="${esc(a)}">${appIcon(a, 52)}<span class="md-dot"></span></span>`).join("");
  const inner =
    `<div class="md-apps" style="gap:11px">${tiles}` +
    `<span class="md-sep"></span>` +
    `<span style="--i:99" title="Launchpad">${appIcon("launchpad", 52)}</span>` +
    `<span style="--i:99" title="Trash">${appIcon("trash", 52)}</span></div>`;
  return { html: stage(`<div class="md-bar" style="border-radius:26px;padding:10px 14px 8px">${inner}</div>`), css: DOCK_CSS };
};

/* ---------- 3. Developer dock (vercel deploy + connected tiles) ---------- */
const dockdev: MD = (c) => {
  const inner =
    `<div class="md-w"><div><div class="md-time" style="font-size:19px">main</div><div class="md-cap">planckui · clean</div></div></div>` +
    `<span class="md-sep"></span>` +
    `<div class="md-w"><span class="md-ring" style="--p:96;--rc:#34C759"><b>✓</b></span><div><div class="md-t1">deploy</div><div class="md-cap">ready · 42s</div></div>` +
    `<span class="md-play" title="Deploy to Vercel">${brandIcon("vercel", 13)}</span></div>` +
    `<span class="md-sep"></span>` +
    `<div class="md-w"><span class="md-conn">${brandIcon("github", 18)}</span><div><div class="md-t1">128 stars</div><div class="md-cap">this week</div></div></div>` +
    `<span class="md-sep"></span>` +
    `<div class="md-w"><span class="md-conn">${brandIcon("linear", 18)}</span><div><div class="md-t1">7 issues</div><div class="md-cap">cycle ends 2d</div></div></div>` +
    `<span class="md-sep"></span>` +
    `<div class="md-w"><div class="md-speed">▲ <b>1.2 MB/s</b><br/>▼ <b>340 KB/s</b></div>` +
    `<span class="md-ring" style="--p:23;--rc:#ff9f0a"><b>23</b></span></div>` +
    `<span class="md-sep"></span>` +
    `<div class="md-apps">` +
    ["terminal", "vscode", "arc", "obsidian", "raycast", "notion"].map((a, i) => `<span style="--i:${i}">${appIcon(a, 40)}</span>`).join("") +
    `</div>`;
  return { html: stage(inner), css: DOCK_CSS };
};

/* ---------- 4. Desktop clock & weather ---------- */
const deskclock: MD = (c) => {
  const city = String(c.text || "Chicago");
  const temp = String(c.temp || "21°");
  const cond = String(c.cond || "Mostly Sunny");
  const body =
    `<div class="md-fixture"><div class="md-desk">` +
    `<div class="md-desktime">18:16</div>` +
    `<div class="md-deskcity">${esc(city)} · ${esc(temp)} · ${esc(cond)}</div>` +
    `</div></div>`;
  const css = DOCK_CSS + `
.md-desk { text-align: center; color: #f5f5f7; text-shadow: 0 2px 18px oklch(0 0 0/0.45); }
.md-desktime { font-size: 92px; font-weight: 200; letter-spacing: 0.01em; font-variant-numeric: tabular-nums; line-height: 1; }
.md-deskcity { font-size: 15px; font-weight: 500; opacity: 0.85; margin-top: 6px; }`;
  return { html: body, css };
};

export const MACOS_DOCK_RENDERERS: Record<string, MD> = {
  "dockpro": dockpro,
  "dockclassic": dockclassic,
  "dockdev": dockdev,
  "deskclock": deskclock,
};
