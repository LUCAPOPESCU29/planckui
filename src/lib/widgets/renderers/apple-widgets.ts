import { esc } from "../base";
import type { RenderResult, WidgetConfig, TestimonialData } from "../types";

/* The Cupertino collection — iOS/macOS design patterns as website widgets.
   HIG tokens: SF system stack, iOS semantic colors, continuous corners,
   inset grouped lists, hairline separators, large titles.
   Full light/dark via :host/.dark (iOS light/dark semantic pairs). */

type AP = (c: WidgetConfig, items?: TestimonialData[]) => RenderResult;

const APPLE_LOGO = "M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701";
const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", "Segoe UI", sans-serif';

const C = {
  blue: "#007AFF", green: "#34C759", red: "#FF3B30", orange: "#FF9500",
  purple: "#AF52DE", teal: "#5AC8FA", pink: "#FF2D55", yellow: "#FFCC00",
};

const AP_CSS = `
:host {
  --ap-bg: #f2f2f7; --ap-card: #ffffff; --ap-ink: #1d1d1f;
  --ap-mut: oklch(0.4 0.01 260 / 0.6); --ap-sep: oklch(0.4 0.01 260 / 0.14);
  --ap-field: #f2f2f7;
  display: block;
}
:host(.dark) {
  --ap-bg: #050505; --ap-card: #1c1c1e; --ap-ink: #f5f5f7;
  --ap-mut: oklch(0.92 0.005 260 / 0.6); --ap-sep: oklch(1 0 0 / 0.12);
  --ap-field: #2c2c2e;
}
.ap-wrap { font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", "Segoe UI", sans-serif; color: var(--ap-ink); max-width: 400px; margin-inline: auto;
  -webkit-font-smoothing: antialiased; }
.ap-screen { border-radius: 42px; overflow: hidden; background: var(--ap-bg);
  box-shadow: inset 0 0 0 1px var(--ap-sep), 0 22px 60px oklch(0 0 0/0.25); }
.ap-pad { padding: 20px 16px; }
.ap-hair { height: 1px; background: var(--ap-sep); }
.ap-large { font-size: 32px; font-weight: 700; letter-spacing: -0.02em; }
.ap-title2 { font-size: 20px; font-weight: 700; letter-spacing: -0.01em; }
.ap-body { font-size: 15px; }
.ap-foot { font-size: 12.5px; color: var(--ap-mut); }
.ap-mut { color: var(--ap-mut); }
.ap-card { border-radius: 16px; background: var(--ap-card);
  box-shadow: inset 0 0 0 1px var(--ap-sep); }
.ap-row { display: flex; align-items: center; gap: 12px; padding: 11px 14px; }
.ap-row + .ap-row { border-top: 1px solid var(--ap-sep); }
.ap-sw { width: 46px; height: 28px; border-radius: 999px; background: var(--ap-sep);
  position: relative; flex-shrink: 0; }
.ap-sw::after { content: ""; position: absolute; top: 2px; left: 2px; width: 24px; height: 24px;
  border-radius: 999px; background: #fff; box-shadow: 0 2px 6px oklch(0 0 0/0.3); }
.ap-sw.on { background: ${C.green}; }
.ap-sw.on::after { left: auto; right: 2px; }
.ap-ico { width: 29px; height: 29px; border-radius: 7.5px; display: grid; place-items: center;
  color: #fff; flex-shrink: 0; }
.ap-btn { display: block; width: 100%; text-align: center; font-size: 16px; font-weight: 600;
  padding: 13px; border-radius: 13px; background: var(--ap-card); color: var(--ap-ink);
  box-shadow: inset 0 0 0 1px var(--ap-sep); }
.ap-btn.primary { background: ${C.blue}; color: #fff; }
.ap-btn.black { background: #000; color: #fff; }
:host(.dark) .ap-btn.black { background: #f5f5f7; color: #000; }
.ap-field { background: var(--ap-field); border-radius: 11px; padding: 11px 12px; font-size: 15.5px;
  color: var(--ap-mut); }
.ap-seg { display: flex; background: var(--ap-field); border-radius: 9px; padding: 2px; }
.ap-seg span { flex: 1; text-align: center; font-size: 13px; font-weight: 500; padding: 5px 0;
  border-radius: 7px; color: var(--ap-mut); }
.ap-seg span.on { background: var(--ap-card); color: var(--ap-ink);
  box-shadow: 0 2px 6px oklch(0 0 0/0.18); font-weight: 600; }
.ap-otp { display: flex; gap: 8px; justify-content: center; }
.ap-otp i { width: 44px; height: 52px; border-radius: 10px; background: var(--ap-field);
  box-shadow: inset 0 0 0 1px var(--ap-sep); display: grid; place-items: center;
  font-size: 22px; font-weight: 600; font-style: normal; }
.ap-otp i.cur { box-shadow: inset 0 0 0 2px ${C.blue}; }
.ap-get { font-size: 13px; font-weight: 700; color: ${C.blue}; background: var(--ap-field);
  padding: 4px 14px; border-radius: 999px; }
.ap-tabbar { display: flex; background: var(--ap-card); padding: 6px 0 8px;
  box-shadow: inset 0 1px 0 var(--ap-sep); }
.ap-tab { flex: 1; text-align: center; font-size: 10px; font-weight: 500; color: var(--ap-mut); }
.ap-tab.on { color: ${C.blue}; }
.ap-nav { display: flex; gap: 12px; color: ${C.blue}; font-size: 15px; font-weight: 400; }
@keyframes ap-glow { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
.ap-intelli { background: linear-gradient(120deg, #0a84ff, #bf5af2, #ff2d55, #0a84ff);
  background-size: 300% 300%; animation: ap-glow 6s ease infinite; }
@keyframes ap-blink { 50% { opacity: 0.2; } }
.ap-caret { animation: ap-blink 1s steps(1) infinite; }
`;

function wrap(c: WidgetConfig, inner: string, screen = true): RenderResult {
  const w = String(c.maxWidth || 380);
  const html = screen
    ? `<div class="ap-wrap" style="max-width:${w}px"><div class="ap-screen">${inner}</div></div>`
    : `<div class="ap-wrap" style="max-width:${w}px">${inner}</div>`;
  return { html, css: AP_CSS };
}

function appleLogo(size = 22, color = "#fff"): string {
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="${color}" aria-hidden="true"><path d="${APPLE_LOGO}"/></svg>`;
}

function sfi(d: string, color = "#fff", size = 17): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
}

function ring(pct: number, radius: number, color: string, width = 9): string {
  const circ = 2 * Math.PI * radius;
  return `<circle cx="46" cy="46" r="${radius}" fill="none" stroke="oklch(1 0 0/0.12)" stroke-width="${width}"/>` +
    `<circle cx="46" cy="46" r="${radius}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"` +
    ` stroke-dasharray="${circ}" stroke-dashoffset="${circ * (1 - pct / 100)}" transform="rotate(-90 46 46)"/>`;
}

/* ================= logins ================= */

// 1. Sign in with Apple ID
const signin: AP = (c) => wrap(c, `
  <div class="ap-pad" style="text-align:center">
    <div style="margin:8px 0 2px">${appleLogo(34, "var(--ap-ink)")}</div>
    <div class="ap-title2" style="margin-bottom:14px">Sign in with Apple&nbsp;ID</div>
    <div class="ap-field" style="text-align:left">✉️&nbsp; ${esc(String(c.text || "you@icloud.com"))}</div>
    <div class="ap-field" style="text-align:left;margin-top:9px">🔑&nbsp; ••••••••</div>
    <div class="ap-btn black" style="margin-top:16px">Continue</div>
    <div class="ap-foot" style="margin-top:14px">Forgot password? · Create Apple&nbsp;ID</div>
  </div>`);

// 2. Sign in — dark
const signinDark: AP = (c) => signin({ ...c, _themeSet: true, theme: "dark" } as WidgetConfig);

// 3. One-time code
const otp: AP = (c) => wrap(c, `
  <div class="ap-pad" style="text-align:center">
    <div class="ap-title2">Enter code</div>
    <div class="ap-foot" style="margin:6px 0 16px">Sent to your iPhone ending in 47</div>
    <div class="ap-otp"><i>4</i><i>8</i><i>2</i><i>9</i><i class="cur"><span class="ap-caret">|</span></i><i></i></div>
    <div class="ap-btn primary" style="margin-top:18px">Verify</div>
    <div class="ap-foot" style="margin-top:12px">Resend code in 0:23</div>
  </div>`);

// 4. Face ID confirm
const faceid: AP = (c) => wrap(c, `
  <div class="ap-pad" style="text-align:center">
    <div style="width:74px;height:74px;margin:10px auto 14px;border-radius:999px;background:var(--ap-field);
      display:grid;place-items:center">${sfi('<path d="M8.5 5.5h-2a1 1 0 0 0-1 1v2M15.5 5.5h2a1 1 0 0 1 1 1v2M8.5 18.5h-2a1 1 0 0 1-1-1v-2M15.5 18.5h2a1 1 0 0 0 1-1v-2"/><path d="M9 10v1.5M15 10v1.5M12 10v3h-1.2M9.5 15.5c1.5 1.2 3.5 1.2 5 0"/>', C.blue, 34)}</div>
    <div class="ap-title2">${esc(String(c.text || "Confirm Purchase"))}</div>
    <div class="ap-foot" style="margin:6px 0 16px">${esc(String(c.sub || "PlanckUi Pro · $4.99/month"))}</div>
    <div class="ap-foot" style="font-size:13px">Double-click to pay with Face&nbsp;ID</div>
  </div>`);

/* ================= AI ================= */

// 5. AI chat
const aichat: AP = (c) => {
  const q = esc(String(c.text || "Summarize my reviews"));
  const a = esc(String(c.sub || "Customers love the new checkout — 92% of this week's reviews mention it. Two ask for dark mode."));
  return wrap(c, `
  <div class="ap-pad">
    <div class="ap-row" style="padding:0 0 12px">
      <span class="ap-ico ap-intelli">✦</span>
      <b class="ap-title2" style="font-size:16px">PlanckUi Intelligence</b>
    </div>
    <div style="background:${C.blue};color:#fff;border-radius:18px 18px 5px 18px;padding:11px 14px;font-size:14.5px;margin-left:40px">${q}</div>
    <div style="background:var(--ap-card);box-shadow:inset 0 0 0 1px var(--ap-sep);border-radius:18px 18px 18px 5px;padding:11px 14px;font-size:14.5px;margin:10px 40px 0 0;line-height:1.5">${a}</div>
    <div style="display:flex;gap:8px;margin-top:14px">
      <div class="ap-field" style="flex:1">Ask anything<span class="ap-caret">|</span></div>
      <div style="width:38px;height:38px;border-radius:999px;background:var(--ap-field);display:grid;place-items:center;color:var(--ap-mut)">↑</div>
    </div>
  </div>`);
};

// 6. AI floating button
const aibutton: AP = (c) => wrap(c, `
  <div style="position:relative;padding:26px 22px;min-height:150px;background:var(--ap-bg);border-radius:22px;overflow:hidden">
    <div class="ap-foot" style="text-align:center;position:absolute;top:9px;left:0;right:0">your website</div>
    <div style="position:absolute;right:20px;bottom:20px;text-align:right">
      <div class="ap-card" style="padding:11px 14px;margin-bottom:10px;text-align:left;font-size:13.5px">
        <b class="ap-intelli" style="background-clip:text;-webkit-background-clip:text;color:transparent">✦ Ask PlanckUi</b>
        <div class="ap-foot">Summarize · rewrite · translate</div>
      </div>
      <span class="ap-intelli" style="display:inline-grid;place-items:center;width:54px;height:54px;border-radius:999px;color:#fff;font-size:22px;
        box-shadow:0 10px 30px oklch(0.55 0.15 300/0.5)">✦</span>
    </div>
  </div>`, false);

// 7. AI summary
const aisummary: AP = (c) => wrap(c, `
  <div class="ap-pad">
    <div class="ap-card" style="padding:13px 14px;display:flex;gap:11px">
      <span class="ap-ico ap-intelli" style="border-radius:9px">✦</span>
      <div style="flex:1">
        <div style="display:flex;justify-content:space-between;font-size:13px"><b>Summaries</b><span class="ap-foot">now</span></div>
        <div class="ap-body" style="margin-top:3px;line-height:1.45">${esc(String(c.text || "This morning: 4 new 5-star reviews, checkout uptime 100%, and 2 feature requests about dark mode."))}</div>
      </div>
    </div>
    <div class="ap-foot" style="margin-top:9px;text-align:center">Notifications may be summarized.</div>
  </div>`);

/* ================= system ui ================= */

// 8. Alert
const alert: AP = (c) => wrap(c, `
  <div class="ap-pad" style="display:grid;place-items:center;min-height:230px">
    <div class="ap-card" style="width:280px;overflow:hidden;text-align:center;border-radius:14px">
      <div style="padding:17px 16px 14px">
        <div style="font-size:16px;font-weight:600;line-height:1.3">“${esc(String(c.text || "planck-ui.design"))}” Would Like to Send You Notifications</div>
        <div class="ap-foot" style="margin-top:5px">Notifications may include alerts, sounds and icon badges.</div>
      </div>
      <div class="ap-hair"></div>
      <div style="display:flex"><div style="flex:1;padding:11px;color:${C.blue};font-weight:400;border-right:1px solid var(--ap-sep)">Don't Allow</div>
      <div style="flex:1;padding:11px;color:${C.blue};font-weight:600">Allow</div></div>
    </div>
  </div>`);

// 9. Action sheet
const actionsheet: AP = (c) => wrap(c, `
  <div class="ap-pad" style="display:grid;place-items:center;min-height:280px">
    <div style="width:100%;max-width:330px">
      <div class="ap-card" style="overflow:hidden;text-align:center">
        <div class="ap-foot" style="padding:11px">Share Widget</div>
        <div class="ap-hair"></div>
        ${["Copy HTML", "Copy link", "Share via Messages"].map((x) => `<div style="padding:12px;color:${C.blue};font-size:16px;border-top:1px solid var(--ap-sep)">${x}</div>`).join("")}
      </div>
      <div class="ap-card" style="margin-top:9px;text-align:center;padding:12px;color:${C.blue};font-weight:600">Cancel</div>
    </div>
  </div>`);

// 10. Settings toggles
const settings: AP = (c) => {
  const rows: [string, string, string, boolean][] = [
    ["Airplane Mode", "plane", C.orange, false],
    ["Wi-Fi", "wifi", C.blue, true],
    ["Bluetooth", "bt", C.blue, true],
    ["Mobile Data", "ant", C.green, true],
  ];
  const icons: Record<string, string> = {
    plane: '<path d="M12 3c.8 0 1.4 1 1.4 2.2v4l6.1 3.4v2l-6.1-1.9v3.9l2.3 1.7v1.5L12 19l-3.7 1.8v-1.5l2.3-1.7v-3.9L4.5 16.6v-2l6.1-3.4v-4C10.6 4 11.2 3 12 3z"/>',
    wifi: '<path d="M4 10a12 12 0 0 1 16 0M7 13.5a7.5 7.5 0 0 1 10 0M10 17h4"/>',
    bt: '<path d="M7 7l10 10-5 4V3l5 4L7 17"/>',
    ant: '<path d="M12 3v18M6 7l12 10M18 7 6 17"/>',
  };
  const body = rows.map(([name, ic, col, on]) =>
    `<div class="ap-row"><span class="ap-ico" style="background:${col}">${sfi(icons[ic], "#fff", 15)}</span>` +
    `<b class="ap-body" style="font-weight:500;flex:1">${name}</b><span class="ap-sw${on ? " on" : ""}"></span></div>`).join("");
  return wrap(c, `<div class="ap-pad"><div class="ap-card" style="overflow:hidden">${body}</div></div>`);
};

// 11. Segmented + chart
const segmented: AP = (c) => {
  const bars = [34, 52, 41, 66, 58, 84, 72];
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  return wrap(c, `
  <div class="ap-pad">
    <div class="ap-title2" style="margin-bottom:10px">${esc(String(c.text || "Widget installs"))}</div>
    <div class="ap-seg"><span>Day</span><span class="on">Week</span><span>Month</span></div>
    <div style="display:flex;gap:7px;align-items:flex-end;height:110px;margin-top:16px">
      ${bars.map((b, i) => `<div style="flex:1;text-align:center"><div style="height:${b}px;border-radius:5px;background:${i === 5 ? C.blue : "var(--ap-field)"};box-shadow:inset 0 0 0 1px var(--ap-sep)"></div><div class="ap-foot" style="margin-top:5px">${days[i]}</div></div>`).join("")}
    </div>
  </div>`);
};

// 12. Tab bar
const tabbar: AP = (c) => {
  const tabs: [string, string, boolean][] = [
    ["Today", '<rect x="4" y="4" width="16" height="16" rx="3"/>', true],
    ["Games", '<path d="M7 12h4M9 10v4M15.5 11h.01M17 13h.01M6.5 7h11a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3h-11a3 3 0 0 1-3-3v-4a3 3 0 0 1 3-3z"/>', false],
    ["Apps", '<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>', false],
    ["Search", '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', false],
  ];
  return wrap(c, `
  <div class="ap-pad" style="display:grid;place-items:center;min-height:190px">
    <div class="ap-foot" style="margin-bottom:14px">iOS tab bar · live icons</div>
    <div class="ap-tabbar" style="border-radius:18px;width:100%;max-width:330px">
      ${tabs.map(([t, d, on]) => `<div class="ap-tab${on ? " on" : ""}"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">${d}</svg><div style="margin-top:2px">${t}</div></div>`).join("")}
    </div>
  </div>`);
};

// 13. Large title + search
const largetitle: AP = (c) => {
  const rows: [string, string, string][] = [
    ["General", '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.5 4.5l2 2M17.5 17.5l2 2M19.5 4.5l-2 2M6.5 17.5l-2 2"/>', "#8e8e93"],
    ["Accessibility", '<path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="2.6"/>', C.blue],
    ["Wallpaper", '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="m5 16 4.5-5 4 4 3-3 2.5 2.5"/>', C.teal],
    ["Siri", '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>', C.purple],
  ];
  return wrap(c, `
  <div class="ap-pad">
    <div class="ap-nav" style="justify-content:space-between;margin-bottom:2px"><span>‹ Back</span><span>Edit</span></div>
    <div class="ap-large" style="margin-bottom:12px">${esc(String(c.text || "Settings"))}</div>
    <div class="ap-field" style="margin-bottom:14px">🔍&nbsp; Search</div>
    <div class="ap-card" style="overflow:hidden">
      ${rows.map(([r, d, col]) => `<div class="ap-row"><span class="ap-ico" style="background:${col}">${sfi(d, "#fff", 15)}</span><b class="ap-body" style="font-weight:400;flex:1">${r}</b><span class="ap-mut">›</span></div>`).join("")}
    </div>
  </div>`);
};

// 14. App Store Today card
const today: AP = (c) => wrap(c, `
  <div class="ap-pad">
    <div class="ap-card" style="overflow:hidden">
      <div style="padding:16px 16px 12px">
        <div class="ap-foot" style="font-weight:700;letter-spacing:0.06em">${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }).toUpperCase()}</div>
        <div class="ap-large" style="font-size:26px;margin-top:2px">Today's pick</div>
      </div>
      <div style="margin:0 12px;border-radius:14px;overflow:hidden;position:relative;height:150px;
        background:linear-gradient(135deg,#0a84ff,#bf5af2 60%,#ff2d55)">
        <div style="position:absolute;inset:0;display:grid;place-items:center;color:#fff;text-align:center">
          <div><div style="font-size:34px">✦</div><b style="font-size:17px">PLANCKUI INTELLIGENCE</b>
          <div style="font-size:12px;opacity:0.85;margin-top:3px">Widgets that think ahead</div></div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:10px;padding:12px 16px 16px">
        <span class="ap-ico" style="background:linear-gradient(135deg,#5eead4,#0ea5e9)">${appleLogo(15)}</span>
        <div style="flex:1"><b class="ap-body">PlanckUi</b><div class="ap-foot">290+ free widgets</div></div>
        <span class="ap-get">GET</span>
      </div>
    </div>
  </div>`);

// 15. App rows + GET
const appcard: AP = (c) => wrap(c, `
  <div class="ap-pad">
    <div class="ap-title2" style="margin-bottom:10px">${esc(String(c.text || "Essential widgets"))}</div>
    ${[["Wall of Love", "4.9 ★ · Social proof", "#5eead4,#0ea5e9", "GET"], ["NPS Survey", "4.8 ★ · Feedback", "#a78bfa,#7c3aed", "GET"], ["Contact Form", "4.9 ★ · Utility", "#fbbf24,#f59e0b", "OPEN"]].map(([n, m, g, b]) =>
    `<div class="ap-row" style="padding:9px 0"><span class="ap-ico" style="width:44px;height:44px;border-radius:11px;background:linear-gradient(135deg,${g})">${appleLogo(18)}</span>` +
      `<div style="flex:1"><b class="ap-body">${n}</b><div class="ap-foot">${m}</div></div><span class="ap-get">${b}</span></div>`).join("")}
  </div>`);

// 16. Apple Pay sheet
const pay: AP = (c) => wrap(c, `
  <div class="ap-pad">
    <div class="ap-card" style="overflow:hidden">
      <div style="padding:14px 16px;display:flex;align-items:center;gap:10px">
        ${appleLogo(17)}<b style="font-size:16px">Pay</b>
        <span class="ap-foot" style="margin-left:auto">with Face&nbsp;ID</span>
      </div>
      <div class="ap-hair"></div>
      <div class="ap-row"><span class="ap-mut">Card</span><b class="ap-body" style="margin-left:auto">Planck Card ····0421</b></div>
      <div class="ap-row"><span class="ap-mut">Ship to</span><b class="ap-body" style="margin-left:auto">Rathausplatz 4, Zürich</b></div>
      <div class="ap-row"><span class="ap-mut">Total</span><b class="ap-body" style="margin-left:auto">${esc(String(c.text || "$49.00"))}</b></div>
    </div>
    <div class="ap-btn black" style="margin-top:14px">Pay ${esc(String(c.text || "$49.00"))} with&nbsp; Pay</div>
  </div>`);

// 17. Now playing
const player: AP = (c) => {
  const pct = 42;
  return wrap(c, `
  <div class="ap-pad">
    <div class="ap-card" style="padding:14px">
      <div style="display:flex;gap:12px;align-items:center">
        <span style="width:54px;height:54px;border-radius:9px;background:linear-gradient(135deg,#f6d365,#8e9bf5 60%,#5a4fcf)"></span>
        <div style="flex:1"><b class="ap-body">${esc(String(c.text || "Heaven"))}</b><div class="ap-foot">${esc(String(c.sub || "Navid — Scorpion"))}</div></div>
      </div>
      <div style="height:5px;border-radius:999px;background:var(--ap-sep);margin:13px 2px 5px;position:relative">
        <span style="position:absolute;inset:0;width:${pct}%;background:var(--ap-mut);border-radius:999px"></span>
      </div>
      <div style="display:flex;justify-content:space-between" class="ap-foot"><span>1:24</span><span>-2:07</span></div>
      <div style="display:flex;justify-content:center;gap:34px;align-items:center;margin-top:6px">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M19 5.5v13L8 12z"/><path d="M5 6h2v12H5z"/></svg>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5.5v13l11-6.5z"/></svg>
        <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M5 5.5v13L16 12z"/><path d="M17 6h2v12h-2z"/></svg>
      </div>
    </div>
  </div>`);
};

// 18. Lock screen
const lockscreen: AP = (c) => wrap(c, `
  <div style="padding:34px 22px;background:linear-gradient(180deg,#2a3550,#141a2b 55%,#0c0f1a);color:#fff">
    <div style="text-align:center">
      <div class="ap-foot" style="color:rgba(255,255,255,0.75);font-size:14px">Tuesday, 16 September</div>
      <div style="font-size:76px;font-weight:300;letter-spacing:-0.02em;line-height:1.05">9:41</div>
    </div>
    <div style="display:flex;gap:9px;margin:16px 0">
      <div style="flex:1;background:rgba(255,255,255,0.13);border-radius:14px;padding:9px 11px;backdrop-filter:blur(12px)">
        <div style="font-size:10.5px;font-weight:600;opacity:0.75">WEATHER</div>
        <div style="font-size:17px;font-weight:600">21° <span style="opacity:0.7;font-size:12px">Mostly sunny</span></div>
      </div>
      <div style="flex:1;background:rgba(255,255,255,0.13);border-radius:14px;padding:9px 11px;backdrop-filter:blur(12px)">
        <div style="font-size:10.5px;font-weight:600;opacity:0.75">CALENDAR</div>
        <div style="font-size:12.5px;font-weight:600;margin-top:1px">Standup · 9:30</div>
      </div>
    </div>
    <div style="background:rgba(255,255,255,0.13);border-radius:14px;padding:10px 12px;backdrop-filter:blur(12px);display:flex;gap:9px">
      ${appleLogo(16)}<div style="font-size:12.5px;line-height:1.4"><b>PLANCKUI</b><div style="opacity:0.85">Your wall of love got 2 new reviews 🎉</div></div>
    </div>
  </div>`);

// 19. Dynamic Island
const island: AP = (c) => wrap(c, `
  <div class="ap-pad" style="display:grid;place-items:center;min-height:170px;background:var(--ap-bg);border-radius:22px">
    <div style="background:#000;border-radius:24px;padding:9px 12px;display:flex;align-items:center;gap:10px;width:100%;max-width:330px;color:#fff">
      <span style="width:26px;height:26px;border-radius:7px;background:linear-gradient(135deg,#fb7185,#f97316);display:grid;place-items:center;font-size:13px">🍕</span>
      <div style="flex:1;font-size:12px;line-height:1.35"><b>Pizza arriving</b><div style="opacity:0.65">Eddy · 12 min</div></div>
      <div style="display:flex;gap:3px;align-items:flex-end;height:20px">${[9, 15, 12, 19, 8].map((h) => `<span style="width:3px;height:${h}px;border-radius:2px;background:#30d158"></span>`).join("")}</div>
    </div>
    <div class="ap-foot" style="margin-top:10px">Live Activity · expands from the Dynamic Island</div>
  </div>`);

// 20. Notifications
const notifs: AP = (c) => wrap(c, `
  <div class="ap-pad" style="display:flex;flex-direction:column;gap:9px">
    ${[["MESSAGES", C.green, "Maya Okafor", "The new wall of love is unreal 🔥", "2m ago"], ["MAIL", C.blue, "Vercel", "Deployment ready: planck-ui.design", "14m ago"]].map(([t, col, who, msg, when]) =>
    `<div class="ap-card" style="padding:12px 14px;border-radius:16px"><div style="display:flex;justify-content:space-between;font-size:11px;font-weight:700;color:var(--ap-mut)"><span>${t}</span><span>${when}</span></div>` +
      `<b class="ap-body">${who}</b><div class="ap-body" style="opacity:0.85">${msg}</div></div>`).join("")}
  </div>`);

// 21. Siri suggestions
const siri: AP = (c) => wrap(c, `
  <div class="ap-pad">
    <div class="ap-foot" style="font-weight:700;letter-spacing:0.05em;margin-bottom:10px">✦ SIRI SUGGESTIONS</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:9px">
      ${[["Order more coffee", "Reorder from Fern & Co", "linear-gradient(135deg,#fbbf24,#f59e0b)"], ["Call Maya", "FaceTime Audio", "linear-gradient(135deg,#34d399,#059669)"], ["Head to the gym", "15:00 · Workout", "linear-gradient(135deg,#f472b6,#db2777)"], ["Read later", "3 saved stories", "linear-gradient(135deg,#60a5fa,#2563eb)"]].map(([t, s2, g]) =>
      `<div class="ap-card" style="padding:10px"><span style="width:26px;height:26px;border-radius:7px;background:${g};display:grid;place-items:center">${appleLogo(13)}</span><b class="ap-body" style="display:block;margin-top:7px;font-size:13px">${t}</b><div class="ap-foot">${s2}</div></div>`).join("")}
    </div>
  </div>`);

// 22. Activity rings
const rings: AP = (c) => {
  const ringsSvg = `<svg viewBox="0 0 92 92" width="92" height="92">${ring(78, 37, C.pink)}${ring(62, 27, C.yellow)}${ring(90, 17, C.teal)}</svg>`;
  const stat = (v: string, l: string, col: string) => `<div><div style="font-size:10px;font-weight:700;color:${col}">${l.toUpperCase()}</div><div class="ap-body">${v}</div></div>`;
  return wrap(c, `
  <div class="ap-pad"><div class="ap-title2" style="margin-bottom:12px">${esc(String(c.text || "Activity"))}</div>
  <div style="display:flex;align-items:center;gap:16px">
    <div class="ap-rings">${ringsSvg}</div>
    <div style="display:flex;flex-direction:column;gap:9px">
      ${stat("412/500", "MOVE", C.pink)}${stat("18/20", "EXERCISE", C.yellow)}${stat("10/12", "STAND", C.teal)}
    </div>
  </div></div>`);
};

// 23. Steps
const steps: AP = (c) => {
  const bars = [42, 68, 55, 90, 74, 98, 61];
  return wrap(c, `
  <div class="ap-pad">
    <div style="display:flex;justify-content:space-between;align-items:baseline"><span class="ap-title2">Steps</span><span class="ap-foot">Today</span></div>
    <div style="font-size:40px;font-weight:700;letter-spacing:-0.02em;margin:4px 0 10px">${esc(String(c.text || "8,412"))} <span style="font-size:15px;font-weight:500;color:var(--ap-mut)">steps · 6.1 km</span></div>
    <div style="display:flex;gap:6px;align-items:flex-end;height:74px">${bars.map((b) => `<span style="flex:1;height:${b}%;border-radius:4px;background:var(--ap-field);box-shadow:inset 0 0 0 1px var(--ap-sep)"></span>`).join("")}</div>
    <div class="ap-foot" style="display:flex;gap:6px;margin-top:5px">${["M", "T", "W", "T", "F", "S", "S"].map((d) => `<span style="flex:1;text-align:center">${d}</span>`).join("")}</div>
  </div>`);
};

// 24. Wallet pass
const wallet: AP = (c) => wrap(c, `
  <div class="ap-pad">
    <div style="border-radius:18px;overflow:hidden;background:#0f1116;color:#f5f5f7;box-shadow:0 14px 40px oklch(0 0 0/0.3)">
      <div style="padding:16px 18px;background:linear-gradient(135deg,#1e293b,#0f172a)">
        <div style="display:flex;justify-content:space-between;font-size:11px;font-weight:700;letter-spacing:0.08em;opacity:0.7"><span>PLANCK AIR</span><span>BOARDING PASS</span></div>
        <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:14px">
          <div><div style="font-size:26px;font-weight:700">ZRH</div><div class="ap-foot">Zürich</div></div>
          <div style="text-align:center;font-size:11px;opacity:0.7">✈ non-stop<br/><b style="font-size:14px;color:#fff">7h 40m</b></div>
          <div style="text-align:right"><div style="font-size:26px;font-weight:700">NRT</div><div class="ap-foot">Tokyo</div></div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:13px 18px;font-size:10.5px">
        ${[["FLIGHT", "PU 802"], ["GATE", "A12"], ["SEAT", "4A"], ["BOARDS", "17:55"]].map(([k, v]) => `<div><div style="opacity:0.55">${k}</div><b style="font-size:13px">${v}</b></div>`).join("")}
      </div>
      <div style="height:34px;margin:0 10px 12px;background:repeating-linear-gradient(90deg,#fff 0 2px,transparent 2px 5px,#fff 5px 8px,transparent 8px 11px);border-radius:5px;opacity:0.85"></div>
    </div>
  </div>`);

// 25. Maps place card
const place: AP = (c) => wrap(c, `
  <div class="ap-pad">
    <div class="ap-card" style="overflow:hidden">
      <div style="height:110px;background:linear-gradient(135deg,#a8e2a0,#5cb85c);position:relative">
        <span style="position:absolute;left:50%;top:50%;transform:translate(-50%,-100%)">${sfi('<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" fill="#FF3B30" stroke="none"/><circle cx="12" cy="10" r="2.6" fill="#fff" stroke="none"/>', "#fff", 34)}</span>
      </div>
      <div style="padding:13px 15px">
        <b class="ap-title2" style="font-size:17px">${esc(String(c.text || "Fern & Coffee"))}</b>
        <div class="ap-foot" style="margin:3px 0 10px">Café · Open until 18:00 · 400 m away</div>
        <div style="display:flex;gap:9px">
          <div class="ap-btn primary" style="padding:9px">Directions</div>
          <div class="ap-btn" style="padding:9px">Call</div>
        </div>
      </div>
    </div>
  </div>`);

// 26. Contact card
const contact: AP = (c) => wrap(c, `
  <div class="ap-pad" style="text-align:center">
    <span class="ap-ico" style="width:74px;height:74px;border-radius:999px;margin:6px auto 10px;background:linear-gradient(135deg,#a78bfa,#7c3aed);font-size:26px">MO</span>
    <div class="ap-large" style="font-size:24px">${esc(String(c.text || "Maya Okafor"))}</div>
    <div class="ap-foot" style="margin-bottom:14px">${esc(String(c.sub || "Design engineer · PlanckUi"))}</div>
    <div style="display:flex;justify-content:center;gap:26px;margin-bottom:14px">
      ${[["message", '<path d="M12 3.6c-5 0-8.6 3.2-8.6 7.2 0 2.3 1.2 4.3 3 5.6l-.7 3.2 3.5-1.8c.9.2 1.8.4 2.8.4 5 0 8.6-3.3 8.6-7.4S17 3.6 12 3.6z"/>'], ["call", '<path d="M6 4h3l1.5 4L8.5 10c1 2 3.5 4.5 5.5 5.5l2-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5C11 20 4 13 4.5 5.6A1.5 1.5 0 0 1 6 4z"/>'], ["video", '<rect x="3" y="6" width="13" height="11" rx="2"/><path d="m16 10 5-3v9l-5-3"/>']].map(([l, d]) => `<div><span class="ap-ico" style="background:var(--ap-field);color:${C.blue};margin:0 auto">${sfi(d, C.blue, 18)}</span><div class="ap-foot" style="color:${C.blue}">${l}</div></div>`).join("")}
    </div>
  </div>`);

// 27. Weather tile
const weathertile: AP = (c) => wrap(c, `
  <div class="ap-pad">
    <div style="border-radius:20px;padding:16px 18px;background:linear-gradient(180deg,#3d7cc9,#7fb2e0);color:#fff">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div><div style="font-size:15px;font-weight:600">${esc(String(c.text || "Cupertino"))}</div>
        <div style="font-size:44px;font-weight:300;line-height:1.1">21°</div></div>
        <div style="font-size:30px">☀️</div>
      </div>
      <div style="font-size:12px;opacity:0.85">Mostly Sunny · H:24° L:14°</div>
      <div style="display:flex;justify-content:space-between;margin-top:12px;font-size:12px">${["11AM 22°☀️", "12PM 23°🌤", "1PM 23°⛅", "2PM 22°☁️"].map((x) => `<span>${x}</span>`).join("")}</div>
    </div>
  </div>`);

// 28. Calendar widget
const calwidget: AP = (c) => wrap(c, `
  <div class="ap-pad">
    <div class="ap-card" style="padding:14px">
      <div style="font-size:11px;font-weight:700;color:${C.red}">TUESDAY 16 SEPTEMBER</div>
      <div class="ap-title2" style="margin:2px 0 10px">${esc(String(c.text || "Today"))}</div>
      ${[["09:30", "Design standup", C.blue], ["11:00", "Deep work: widgets", C.purple], ["18:00", "Ship v2.7 🚀", C.orange]].map(([t, n, col]) =>
      `<div style="display:flex;gap:9px;align-items:center;padding:5px 0"><span style="width:3px;height:24px;border-radius:2px;background:${col}"></span><span class="ap-foot" style="width:44px">${t}</span><span class="ap-body" style="font-size:13.5px">${n}</span></div>`).join("")}
    </div>
  </div>`);

// 29. Batteries widget
const battery: AP = (c) => {
  const bat = (label: string, pct: number, sub: string) =>
    `<div style="text-align:center"><div class="ap-title2" style="font-size:19px">${pct}%</div>
     <div style="width:44px;height:20px;border:1.5px solid var(--ap-mut);border-radius:6px;margin:4px auto;position:relative"><span style="position:absolute;inset:2px;right:${100 - pct}%;background:${pct > 20 ? C.green : C.red};border-radius:3px"></span></div>
     <div class="ap-foot">${label}</div><div class="ap-foot" style="opacity:0.7">${sub}</div></div>`;
  return wrap(c, `
  <div class="ap-pad">
    <div class="ap-title2" style="margin-bottom:12px">${esc(String(c.text || "Batteries"))}</div>
    <div style="display:flex;justify-content:space-around">${bat("iPhone", 82, "Today 9 PM")}${bat("Watch", 64, "This week")}${bat("AirPods", 91, "3h 12m")}</div>
  </div>`);
};

// 30. Screen time
const screentime: AP = (c) => {
  const data: [string, number, string][] = [["Social", 38, C.blue], ["Creativity", 22, C.purple], ["Dev", 27, C.green], ["Other", 13, "#8e8e93"]];
  return wrap(c, `
  <div class="ap-pad">
    <div class="ap-title2" style="margin-bottom:2px">${esc(String(c.text || "Screen Time"))}</div>
    <div class="ap-foot" style="margin-bottom:12px">Daily average: 4h 12m · down 8%</div>
    <div style="display:flex;height:14px;border-radius:999px;overflow:hidden;margin-bottom:14px">
      ${data.map(([n, p, col]) => `<span style="width:${p}%;background:${col}"></span>`).join("")}
    </div>
    ${data.map(([n, p, col]) => `<div class="ap-row" style="padding:7px 2px"><span style="width:9px;height:9px;border-radius:99px;background:${col}"></span><b class="ap-body" style="font-weight:500;flex:1">${n}</b><span class="ap-foot">${Math.round(p * 6.3)}m</span></div>`).join("")}
  </div>`);
};

export const APPLE_RENDERERS: Record<string, AP> = {
  "ap-signin": signin,
  "ap-signin-dark": signinDark,
  "ap-otp": otp,
  "ap-faceid": faceid,
  "ap-aichat": aichat,
  "ap-aibutton": aibutton,
  "ap-aisummary": aisummary,
  "ap-alert": alert,
  "ap-actionsheet": actionsheet,
  "ap-settings": settings,
  "ap-segmented": segmented,
  "ap-tabbar": tabbar,
  "ap-largetitle": largetitle,
  "ap-today": today,
  "ap-appcard": appcard,
  "ap-pay": pay,
  "ap-player": player,
  "ap-lockscreen": lockscreen,
  "ap-island": island,
  "ap-notifs": notifs,
  "ap-siri": siri,
  "ap-rings": rings,
  "ap-steps": steps,
  "ap-wallet": wallet,
  "ap-place": place,
  "ap-contact": contact,
  "ap-weathertile": weathertile,
  "ap-calwidget": calwidget,
  "ap-battery": battery,
  "ap-screentime": screentime,
};
