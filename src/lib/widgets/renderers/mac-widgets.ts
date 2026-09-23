import { esc } from "../base";
import type { RenderResult, WidgetConfig, TestimonialData } from "../types";
import { chipMark } from "./platforms";

/* Mac widgets — a CoolDock-inspired collection in the macOS design language.
   Vibrancy glass panels (backdrop blur + saturation), SF system stack,
   continuous corner radii, traffic-light chrome, running indicators, and
   "connected" tiles that read like live data from GitHub, Linear, Stripe.
   Full light/dark via :host(.dark); reduced motion respected. */

type MW = (c: WidgetConfig, items?: TestimonialData[]) => RenderResult;

const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", "Segoe UI", sans-serif';

/* macOS system palette (Apple semantic colors) */
const C = {
  blue: "#007AFF", green: "#34C759", red: "#FF3B30", orange: "#FF9500",
  purple: "#AF52DE", pink: "#FF2D55", teal: "#5AC8FA", yellow: "#FFCC00",
  indigo: "#5856D6",
};

function appTile(gradient: string, glyph: string, size = 46, radius = 11): string {
  return `<span class="mw-app" style="width:${size}px;height:${size}px;border-radius:${radius}px;background:${gradient}">${glyph}</span>`;
}

/* simple white glyphs for fake app icons */
const G = {
  compass: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="55%" height="55%"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.2 5-5 2.2 2.2-5z" fill="#fff" stroke="none"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="55%" height="55%"><rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="m4 7 8 6 8-6"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="#fff" width="55%" height="55%"><path d="M12 3.5c-5 0-8.5 3.2-8.5 7.3 0 2.3 1.1 4.3 3 5.6l-.7 3.1 3.4-1.7c.9.2 1.8.4 2.8.4 5 0 8.5-3.3 8.5-7.4S17 3.5 12 3.5z"/></svg>',
  note: '<svg viewBox="0 0 24 24" width="55%" height="55%"><rect x="4" y="3" width="16" height="18" rx="2.5" fill="#fff"/><path d="M4 8h16" stroke="#FFCC00" stroke-width="2.4"/></svg>',
  music: '<svg viewBox="0 0 24 24" fill="#fff" width="55%" height="55%"><path d="M9 17.5V7.2l9-1.7v10.2"/><circle cx="6.8" cy="17.8" r="2.4"/><circle cx="15.8" cy="15.9" r="2.4"/></svg>',
  terminal: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" width="55%" height="55%"><path d="m5 7 5 4.5L5 16M12.5 17H19"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" width="55%" height="55%"><path d="m8.5 8-4 4 4 4M15.5 8l4 4-4 4"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" width="55%" height="55%"><rect x="3.5" y="4" width="17" height="17" rx="3" fill="#fff"/><text x="12" y="15.5" text-anchor="middle" font-family="-apple-system,sans-serif" font-size="9" font-weight="600" fill="#FF3B30">MON</text><text x="12" y="20" text-anchor="middle" font-family="-apple-system,sans-serif" font-size="4.6" font-weight="500" fill="#1d1d1f">16</text></svg>',
  folder: '<svg viewBox="0 0 24 24" fill="#fff" width="55%" height="55%"><path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h4l2 2.5h7A2.5 2.5 0 0 1 21 9v8.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z"/></svg>',
};

const MAC_CSS = `
:host {
  --mw-panel: oklch(1 0 0 / 0.62); --mw-panel2: oklch(1 0 0 / 0.38);
  --mw-ink: #1d1d1f; --mw-mut: oklch(0.4 0.01 260 / 0.62);
  --mw-line: oklch(0.4 0.01 260 / 0.14); --mw-field: oklch(1 0 0 / 0.55);
  display: block;
}
:host(.dark) {
  --mw-panel: oklch(0.27 0.006 265 / 0.55); --mw-panel2: oklch(0.32 0.008 265 / 0.45);
  --mw-ink: #f5f5f7; --mw-mut: oklch(0.92 0.005 260 / 0.6);
  --mw-line: oklch(1 0 0 / 0.12); --mw-field: oklch(1 0 0 / 0.08);
}
.mw-wrap {
  max-width: 460px; margin-inline: auto; font-family: ${SF};
  color: var(--mw-ink); -webkit-font-smoothing: antialiased;
}
.mw-panel {
  border-radius: 20px; background: var(--mw-panel);
  -webkit-backdrop-filter: blur(30px) saturate(1.8); backdrop-filter: blur(30px) saturate(1.8);
  box-shadow: inset 0 0 0 1px var(--mw-line), 0 16px 44px oklch(0 0 0 / 0.22);
}
/* the dock itself: edge-to-edge glass slab */
.mw-dock {
  display: flex; align-items: flex-end; gap: 10px; padding: 9px 12px 8px;
  border-radius: 24px; background: var(--mw-panel2);
  -webkit-backdrop-filter: blur(30px) saturate(1.8); backdrop-filter: blur(30px) saturate(1.8);
  box-shadow: inset 0 0 0 1px var(--mw-line), 0 18px 50px oklch(0 0 0 / 0.3);
  width: max-content; max-width: 100%; margin-inline: auto;
}
.mw-app {
  display: grid; place-items: center; position: relative;
  box-shadow: inset 0 0 0 1px oklch(1 0 0 / 0.25), 0 3px 8px oklch(0 0 0 / 0.22);
  transition: transform 180ms cubic-bezier(0.23, 1, 0.32, 1);
  flex-shrink: 0;
}
.mw-dock .mw-app:hover { transform: scale(1.38) translateY(-9px); z-index: 2; }
.mw-dot { width: 3.5px; height: 3.5px; border-radius: 999px; background: var(--mw-mut);
  margin: 5px auto 0; }
.mw-sep { width: 1px; align-self: stretch; background: var(--mw-line); margin: 2px 2px; }
.mw-head { display: flex; align-items: center; gap: 8px; padding: 11px 14px 0; }
.mw-title { font-size: 13px; font-weight: 600; letter-spacing: -0.01em; }
.mw-sub { font-size: 12px; color: var(--mw-mut); }
.mw-body { padding: 10px 14px 14px; }
.mw-row { display: flex; align-items: center; gap: 10px; padding: 7px 0; }
.mw-line1 { font-size: 13px; font-weight: 500; line-height: 1.3; }
.mw-line2 { font-size: 11.5px; color: var(--mw-mut); line-height: 1.35; }
.mw-badge { margin-left: auto; font-size: 12px; font-weight: 600; font-variant-numeric: tabular-nums;
  padding: 3px 9px; border-radius: 999px; background: var(--mw-field); }
.mw-conn { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 8.5px;
  background: var(--mw-field); color: var(--mw-ink); flex-shrink: 0; }
.mw-tl { display: flex; gap: 5px; }
.mw-tl i { width: 9px; height: 9px; border-radius: 999px; }
.mw-field {
  display: flex; align-items: center; gap: 8px; border-radius: 10px;
  background: var(--mw-field); box-shadow: inset 0 0 0 1px var(--mw-line);
  padding: 8px 12px; font-size: 13.5px;
}
.mw-slider { height: 22px; border-radius: 8px; background: var(--mw-field); position: relative; overflow: hidden;
  box-shadow: inset 0 0 0 1px var(--mw-line); }
.mw-slider > i { position: absolute; inset: 0; border-radius: 8px; }
.mw-slider svg { position: absolute; left: 6px; top: 3.5px; }
.mw-slider b { position: absolute; right: 8px; top: 2px; font-size: 11px; font-weight: 600; color: var(--mw-mut); }
.mw-tile { border-radius: 14px; background: var(--mw-panel2); box-shadow: inset 0 0 0 1px var(--mw-line);
  padding: 11px 12px; }
.mw-big { font-size: 24px; font-weight: 700; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
.mw-cap { font-size: 11px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: var(--mw-mut); }
.mw-up { color: ${C.green}; font-weight: 600; } .mw-down { color: ${C.red}; font-weight: 600; }
.mw-prog { height: 4.5px; border-radius: 999px; background: var(--mw-line); overflow: hidden; }
.mw-prog > i { display: block; height: 100%; border-radius: 999px; }
.mw-pages { display: flex; gap: 5px; justify-content: center; padding: 10px 0 2px; }
.mw-pages i { width: 5.5px; height: 5.5px; border-radius: 999px; background: var(--mw-line); }
.mw-pages i.on { background: var(--mw-ink); }
@keyframes mw-breathe { 50% { opacity: 0.45; } }
.mw-live { animation: mw-breathe 2.6s ease-in-out infinite; }
.mw-run { width: 4px; height: 4px; border-radius: 999px; background: var(--mw-ink); opacity: 0.75; margin: 4px auto 0; }
@media (prefers-reduced-motion: reduce) { .mw-live { animation: none; } }
`;

const glass = (c: WidgetConfig, inner: string, max = 460): string =>
  `<div class="mw-wrap" style="max-width:${max}px"><div class="mw-panel">${inner}</div></div>`;

function lines(c: WidgetConfig, dflt: string): string[][] {
  return String(c.items || dflt).split("\n").map((l) => l.split("|").map((p) => p.trim())).filter((p) => p[0]);
}

/* ---------- 1. The Dock ---------- */
const dock: MW = (c) => {
  const rows = lines(c, "Finder|finder|run\nSafari|safari|run\nMail|mail\nMessages|chat|run\nMusic|music\nPhotos|photos\nNotes|note\nCalendar|cal\nTerminal|terminal\nTrash|trash");
  const grad: Record<string, string> = {
    finder: "linear-gradient(180deg,#5ac8fa,#007aff)", safari: "linear-gradient(180deg,#5ac8fa,#0a5bd3)",
    mail: "linear-gradient(180deg,#5ac8fa,#1d6ff2)", chat: "linear-gradient(180deg,#6ff06f,#34c759)",
    music: "linear-gradient(180deg,#fc5c7d,#e5245c)", photos: "linear-gradient(180deg,#ffd60a,#ff9f0a)",
    notes: "linear-gradient(180deg,#fff,#f2f2f7)", cal: "linear-gradient(180deg,#ffffff,#f2f2f7)",
    terminal: "linear-gradient(180deg,#2c2c2e,#1c1c1e)", trash: "linear-gradient(180deg,#c7c7cc,#aeaeb2)",
  };
  const glyphs: Record<string, string> = {
    finder: G.compass, safari: G.compass, mail: G.mail, chat: G.chat, music: G.music,
    photos: G.music, notes: G.note, cal: G.calendar, terminal: G.terminal, trash: G.folder,
  };
  const tiles = rows.map((p) => {
    const kind = (p[1] || "finder").toLowerCase();
    const running = (p[2] || "").toLowerCase() === "run";
    return `<div><div title="${esc(p[0])}">${appTile(grad[kind] || grad.finder, glyphs[kind] || G.compass)}</div>` +
      (running ? '<div class="mw-run"></div>' : '<div style="height:8px"></div>') + `</div>`;
  }).join("");
  const html = `<div style="padding:26px 10px 30px;background:linear-gradient(160deg,#8fb7e8,#c9a3e8 60%,#f0b6c5);border-radius:22px;padding:34px 16px">` +
    `<div style="text-align:center;margin-bottom:16px"><span class="mw-sub" style="color:oklch(1 0 0/0.85);font-size:12px;font-weight:600">hover to magnify</span></div>` +
    `<div class="mw-dock">${tiles}<span class="mw-sep"></span><div>${appTile("linear-gradient(180deg,#c7c7cc,#aeaeb2)", G.folder, 46, 11)}</div></div></div>`;
  return { html, css: MAC_CSS };
};

/* ---------- 2. Connected dock (CoolDock-style) ---------- */
const dockConnected: MW = (c) => {
  const rows = lines(c, "GitHub|github|128|new stars this week\nLinear|linear|7|issues assigned to you\nStripe|stripe|$1,284|MRR this month\nSafari|safari||\nMail|mail|3|unread");
  const marks: Record<string, string> = { github: "github", linear: "linear", stripe: "stripe", mail: "mail" };
  const cells = rows.map((p) => {
    const name = esc(p[0]); const icon = (p[1] || "").toLowerCase();
    const value = p[2] || ""; const label = p[3] || "";
    if (value || label) {
      return `<div class="mw-tile" style="min-width:118px">` +
        `<div style="display:flex;align-items:center;gap:6px;margin-bottom:7px"><span class="mw-conn">${chipMark(marks[icon] || icon, 16)}</span><span class="mw-cap">${name}</span></div>` +
        `<div class="mw-big">${esc(value)}</div><div class="mw-line2">${esc(label)}</div></div>`;
    }
    return `<div style="text-align:center"><div title="${name}">${appTile("linear-gradient(180deg,#5ac8fa,#0a5bd3)", G.compass, 42, 10)}</div><span class="mw-line2" style="font-size:10.5px">${name}</span></div>`;
  }).join("");
  const body =
    `<div class="mw-head"><span class="mw-title">${esc(String(c.text || "Connected Dock"))}</span>` +
    `<span class="mw-badge" style="display:inline-flex;align-items:center;gap:5px"><i class="mw-live" style="width:6px;height:6px;border-radius:999px;background:${C.green};display:inline-block"></i>live</span></div>` +
    `<div class="mw-body" style="display:flex;gap:9px;align-items:flex-end;flex-wrap:wrap">${cells}</div>`;
  return { html: glass(c, body), css: MAC_CSS };
};

/* ---------- 3. Menu bar with open "connected" menu ---------- */
const menubar: MW = (c) => {
  const body =
    `<div style="display:flex;align-items:center;gap:14px;padding:4px 12px;font-size:12.5px;font-weight:500">` +
    `<span style="font-size:13px"></span><b>PlanckUi</b><span class="mw-sub">File</span><span class="mw-sub">Edit</span><span class="mw-sub">View</span>` +
    `<span style="margin-left:auto;display:flex;gap:11px;align-items:center">` +
    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12.5a10 10 0 0 1 14 0M8 15.5a6 6 0 0 1 8 0M11 18.5h2"/></svg>` +
    `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a7 7 0 0 0-7 7v4l-1.7 2.6a.8.8 0 0 0 .7 1.4h16a.8.8 0 0 0 .7-1.4L19 13V9a7 7 0 0 0-7-7z"/></svg>` +
    `<b style="font-variant-numeric:tabular-nums">Mon 16 Sep&nbsp;&nbsp;9:41 AM</b></span></div>` +
    `<div style="height:1px;background:var(--mw-line)"></div>` +
    `<div class="mw-body" style="padding-top:12px">` +
    `<div class="mw-cap" style="margin-bottom:8px">Connected — ${esc(String(c.text || "workspace"))}</div>` +
    [["github", "GitHub", "3 dependabot PRs", C.blue], ["linear", "Linear", "Cycle ends in 2 days", C.indigo], ["stripe", "Stripe", "2 new payments · $184", C.green]]
      .map((r) => `<div class="mw-row"><span class="mw-conn">${chipMark(r[0] as string, 16)}</span>` +
        `<div><div class="mw-line1">${r[1]}</div><div class="mw-line2">${r[2]}</div></div>` +
        `<span class="mw-badge"><i style="display:inline-block;width:6px;height:6px;border-radius:999px;background:${r[3]};margin-right:5px"></i>ok</span></div>`).join("") +
    `</div>`;
  return { html: glass(c, body), css: MAC_CSS };
};

/* ---------- 4. Control Center ---------- */
const controlcenter: MW = (c) => {
  const toggle = (icon: string, name: string, sub: string, on: boolean) =>
    `<div class="mw-tile" style="display:flex;gap:9px;align-items:center;padding:9px 10px">` +
    `<span style="width:28px;height:28px;border-radius:999px;display:grid;place-items:center;background:${on ? C.blue : "var(--mw-field)"};color:${on ? "#fff" : "var(--mw-ink)"}">${icon}</span>` +
    `<div><div class="mw-line1" style="font-size:12.5px">${name}</div><div class="mw-line2" style="font-size:10.5px">${sub}</div></div></div>`;
  const wifi = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 10a12 12 0 0 1 16 0M7 13.5a7.5 7.5 0 0 1 10 0M10 17h4"/></svg>';
  const bt = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M7 7l10 10-5 4V3l5 4L7 17"/></svg>';
  const air = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3v18M6 7l12 10M18 7 6 17"/></svg>';
  const body =
    `<div class="mw-body" style="display:grid;grid-template-columns:1fr 1fr;gap:10px">` +
    `<div class="mw-tile" style="display:grid;gap:8px">` + toggle(wifi, "Wi-Fi", "Fern-5G", true) + toggle(bt, "Bluetooth", "On", true) + toggle(air, "AirDrop", "Contacts", false) + `</div>` +
    `<div style="display:grid;gap:10px">` +
    `<div class="mw-tile"><div class="mw-cap" style="margin-bottom:7px">Display</div>` +
    `<div class="mw-slider"><i style="width:72%;background:linear-gradient(90deg,#5ac8fa,#007aff)"></i><svg width="15" height="15" viewBox="0 0 24 24" fill="#fff"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg><b>72%</b></div></div>` +
    `<div class="mw-tile"><div class="mw-cap" style="margin-bottom:7px">Sound</div>` +
    `<div class="mw-slider"><i style="width:45%;background:linear-gradient(90deg,#5ac8fa,#007aff)"></i><svg width="15" height="15" viewBox="0 0 24 24" fill="#fff"><path d="M4 9h3l5-4v14l-5-4H4z"/></svg><b>45%</b></div></div></div>` +
    `<div class="mw-tile" style="grid-column:1/-1;display:flex;align-items:center;gap:10px">` +
    `<span style="width:34px;height:34px;border-radius:8px;background:linear-gradient(135deg,#fc5c7d,#6a82fb)"></span>` +
    `<div style="flex:1"><div class="mw-line1">God's Plan</div><div class="mw-line2">Drake — Scorpion</div>` +
    `<div class="mw-prog" style="margin-top:6px"><i style="width:38%;background:var(--mw-ink)"></i></div></div>` +
    `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5.5v13l11-6.5z"/></svg></div></div>`;
  return { html: glass(c, body, 400), css: MAC_CSS };
};

/* ---------- 5. Spotlight ---------- */
const spotlight: MW = (c) => {
  const q = String(c.text || "ship");
  const body =
    `<div class="mw-body" style="padding-top:14px">` +
    `<div class="mw-field" style="font-size:15px">` +
    `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>` +
    `<span style="color:var(--mw-mut)">${esc(q)}</span><span class="mw-live" style="display:inline-block;width:1.5px;height:16px;background:var(--mw-ink);margin-left:1px"></span></div>` +
    `<div class="mw-cap" style="margin:12px 2px 4px">Calculator</div>` +
    `<div class="mw-row" style="padding:4px 2px"><div class="mw-big" style="font-size:28px">1,440</div><span class="mw-sub" style="margin-left:8px">ships × 12 weeks</span></div>` +
    `<div class="mw-cap" style="margin:10px 2px 2px">Applications</div>` +
    [["Terminal", G.terminal, "linear-gradient(180deg,#2c2c2e,#1c1c1e)"], ["Script Editor", G.code, "linear-gradient(180deg,#8e8e93,#48484a)"]].map((a) =>
      `<div class="mw-row"><span class="mw-conn" style="width:26px;height:26px;background:${a[2]}">${a[1]}</span><span class="mw-line1">${a[0]}</span><span class="mw-badge">app</span></div>`).join("") +
    `<div class="mw-cap" style="margin:10px 2px 2px">Files</div>` +
    `<div class="mw-row"><span class="mw-conn">${G.folder}</span><div><div class="mw-line1">launch-notes.md</div><div class="mw-line2">~/Documents/planckui</div></div><span class="mw-badge">↩ Open</span></div>` +
    `</div>`;
  return { html: glass(c, body), css: MAC_CSS };
};

/* ---------- 6. Launchpad ---------- */
const launchpad: MW = (c) => {
  const apps: [string, string, string][] = [
    ["Safari", G.compass, "linear-gradient(180deg,#5ac8fa,#0a5bd3)"], ["Mail", G.mail, "linear-gradient(180deg,#5ac8fa,#1d6ff2)"],
    ["Messages", G.chat, "linear-gradient(180deg,#6ff06f,#34c759)"], ["Music", G.music, "linear-gradient(180deg,#fc5c7d,#e5245c)"],
    ["Photos", G.music, "linear-gradient(180deg,#ffd60a,#ff9f0a)"], ["Notes", G.note, "linear-gradient(180deg,#fff,#f2f2f7)"],
    ["Calendar", G.calendar, "linear-gradient(180deg,#fff,#f2f2f7)"], ["Terminal", G.terminal, "linear-gradient(180deg,#2c2c2e,#1c1c1e)"],
    ["Xcode", G.code, "linear-gradient(180deg,#3178c6,#0a4da3)"], ["Files", G.folder, "linear-gradient(180deg,#5ac8fa,#0a84ff)"],
    ["Stocks", G.code, "linear-gradient(180deg,#1c1c1e,#000)"], ["Plans", G.note, "linear-gradient(180deg,#ffd60a,#ff9f0a)"],
  ];
  const body =
    `<div class="mw-body" style="background:linear-gradient(160deg,oklch(0.55 0.09 260 / 0.9),oklch(0.6 0.1 320 / 0.85));border-radius:20px">` +
    `<div class="mw-field" style="max-width:190px;margin:2px auto 14px;background:oklch(1 0 0/0.25);color:#fff">` +
    `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>Search</div>` +
    `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px 8px;text-align:center">` +
    apps.map((a) => `<div>${appTile(a[2], a[1], 42, 10)}<div style="font-size:10.5px;color:#fff;margin-top:4px;text-shadow:0 1px 3px oklch(0 0 0/0.4)">${a[0]}</div></div>`).join("") +
    `</div><div class="mw-pages"><i class="on"></i><i></i></div></div>`;
  return { html: glass(c, body, 380), css: MAC_CSS };
};

/* ---------- 7. Now Playing ---------- */
const nowplaying: MW = (c) => {
  const track = String(c.text || "God's Plan");
  const artist = String(c.artist || "Drake — Scorpion");
  const body =
    `<div class="mw-body" style="display:flex;gap:12px;align-items:center">` +
    `<span style="width:64px;height:64px;border-radius:10px;background:linear-gradient(135deg,#fc5c7d,#6a82fb);box-shadow:0 6px 18px oklch(0 0 0/0.3)"></span>` +
    `<div style="flex:1;min-width:0"><div class="mw-line1" style="font-size:14px">${esc(track)}</div>` +
    `<div class="mw-line2">${esc(artist)}</div>` +
    `<div class="mw-prog" style="margin:8px 0 4px"><i style="width:38%;background:var(--mw-ink)"></i></div>` +
    `<div style="display:flex;justify-content:space-between;font-size:10.5px;color:var(--mw-mut);font-variant-numeric:tabular-nums"><span>1:24</span><span>-2:07</span></div></div>` +
    `<div style="display:flex;gap:12px;align-items:center;color:var(--mw-ink)">` +
    `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 5.5v13L8 12z"/><path d="M5 6h2v12H5z"/></svg>` +
    `<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5.5v13l11-6.5z"/></svg>` +
    `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M5 5.5v13L16 12z"/><path d="M17 6h2v12h-2z"/></svg></div></div>`;
  return { html: glass(c, body, 400), css: MAC_CSS };
};

/* ---------- 8. System stats ---------- */
const stats: MW = (c) => {
  const gauge = (label: string, val: number, unit: string, color: string) =>
    `<div class="mw-tile"><div class="mw-cap">${label}</div>` +
    `<div style="display:flex;align-items:baseline;gap:3px;margin:4px 0 7px"><span class="mw-big">${val}</span><span class="mw-sub">${unit}</span></div>` +
    `<div class="mw-prog"><i style="width:${val}%;background:${color}"></i></div></div>`;
  const body =
    `<div class="mw-head"><span class="mw-title">${esc(String(c.text || "This Mac"))}</span>` +
    `<span class="mw-badge" style="margin-left:auto"><i class="mw-live" style="display:inline-block;width:6px;height:6px;border-radius:999px;background:${C.green};margin-right:5px"></i>healthy</span></div>` +
    `<div class="mw-body" style="display:grid;grid-template-columns:1fr 1fr;gap:9px">` +
    gauge("CPU", 23, "%", C.blue) + gauge("Memory", 61, "%", C.purple) +
    gauge("Disk", 74, "%", C.orange) + gauge("Battery", 87, "%", C.green) +
    `</div>`;
  return { html: glass(c, body, 380), css: MAC_CSS };
};

/* ---------- 9. Calendar / today widget ---------- */
const calendar: MW = (c) => {
  const rows = lines(c, "09:30|Standup|meet|#007AFF\n11:00|Deep work: dock widgets|focus|#AF52DE\n14:30|1:1 with Maya||#34C759\n18:00|Ship v2.7|launch|#FF9500");
  const body =
    `<div class="mw-head"><span class="mw-title">Tuesday 16 September</span><span class="mw-badge" style="margin-left:auto">Today</span></div>` +
    `<div class="mw-body" style="padding-top:4px">` +
    rows.map((p) => {
      const color = (p[3] || C.blue).replace("|", "");
      return `<div class="mw-row" style="gap:9px"><span style="width:3px;height:26px;border-radius:2px;background:${esc(color)}"></span>` +
        `<span class="mw-line2" style="font-variant-numeric:tabular-nums;width:42px">${esc(p[0])}</span>` +
        `<span class="mw-line1">${esc(p[1])}</span></div>`;
    }).join("") +
    `</div>`;
  return { html: glass(c, body, 380), css: MAC_CSS };
};

/* ---------- 10. File shelf / stacks ---------- */
const shelf: MW = (c) => {
  const rows = lines(c, "launch-notes.md|edited 2m ago|12 KB\nlogo-v3.svg|edited 1h ago|88 KB\nbudget.numbers|yesterday|204 KB");
  const icon = (ext: string) => {
    const map: Record<string, string> = { md: C.blue, svg: C.purple, numbers: C.green };
    return `<span class="mw-conn" style="border-radius:7px;color:${map[ext] || C.blue}">${G.note}</span>`;
  };
  const body =
    `<div class="mw-head"><span class="mw-title">${esc(String(c.text || "Shelf"))}</span>` +
    `<span class="mw-badge" style="margin-left:auto">${rows.length} files</span></div>` +
    `<div class="mw-body" style="padding-top:4px">` +
    rows.map((p) => {
      const ext = (p[0].split(".").pop() || "").toLowerCase();
      return `<div class="mw-row">${icon(ext)}<div style="flex:1;min-width:0"><div class="mw-line1">${esc(p[0])}</div><div class="mw-line2">${esc(p[1])}</div></div>` +
        `<span class="mw-line2" style="font-variant-numeric:tabular-nums">${esc(p[2] || "")}</span></div>`;
    }).join("") +
    `<div class="mw-sub" style="text-align:center;margin-top:8px">Drop files here to stash them</div></div>`;
  return { html: glass(c, body, 380), css: MAC_CSS };
};

export const MAC_RENDERERS: Record<string, MW> = {
  "mac-dock": dock,
  "mac-dock-connected": dockConnected,
  "mac-menubar": menubar,
  "mac-controlcenter": controlcenter,
  "mac-spotlight": spotlight,
  "mac-launchpad": launchpad,
  "mac-nowplaying": nowplaying,
  "mac-stats": stats,
  "mac-calendar": calendar,
  "mac-shelf": shelf,
};
