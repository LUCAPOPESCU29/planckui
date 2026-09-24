"use client";

import { useRef, useState } from "react";
import { AppleLogo, Chev, ease, I, I_BAG, I_DOC, I_HEART, I_HOME, I_PLUS, I_PROFILE, I_SEARCH, spring, useDismiss } from "./shared";

/* Fifteen navigation menus with an Apple accent — the real Apple mark, SF-style
   glyphs, macOS/iOS palettes, and five Liquid Glass pieces over a colorful
   scene. Interactions stay under Emil's law: springs, ease-out, < 300 ms. */

const A = {
  ink: "#1d1d1f",
  sub: "#6e6e73",
  blue: "#0071e3",
  blueDark: "#2997ff",
  bg: "#f5f5f7",
  barLight: "rgba(251,251,253,0.82)",
  barDark: "rgba(29,29,31,0.72)",
};

/* 11 — apple.com global nav */
export function AppleGlobalNav() {
  const items = ["Store", "Mac", "iPad", "iPhone", "Watch", "Vision", "AirPods", "TV & Home", "Entertainment", "Accessories", "Support"];
  return (
    <div className="rounded-[12px]" style={{ background: A.barLight, backdropFilter: "blur(20px)" }}>
      <nav className="flex items-center justify-between px-4 py-2.5" aria-label="Apple global">
        <span style={{ color: A.ink }}>
          <AppleLogo size={15} />
        </span>
        <div className="hidden items-center gap-5 md:flex">
          {items.map((i) => (
            <a key={i} href="#navigations" className="text-[12px] opacity-80 transition-opacity duration-150 hover:opacity-100" style={{ color: A.ink }}>
              {i}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4" style={{ color: A.ink }}>
          <I d={I_SEARCH} size={14} />
          <I d={I_BAG} size={14} />
        </div>
      </nav>
    </div>
  );
}

/* 12 — macOS menu bar with live dropdown menus */
const MAC_MENUS: Record<string, Array<[string, string] | "sep">> = {
  File: [["New Window", "⌘N"], ["New Tab", "⇧⌘T"], ["Open…", "⌘O"], "sep", ["Close Window", "⌘W"], ["Save", "⌘S"]],
  View: [["Show Toolbar", "⌥⌘T"], ["Show Sidebar", "⌃⌘S"], "sep", ["Enter Full Screen", "⌃⌘F"]],
};
export function AppleMenuBar() {
  const [open, setOpen] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  useDismiss(open !== null, () => setOpen(null), ref);
  const menus = ["File", "Edit", "View", "Go", "Window", "Help"];
  return (
    <div ref={ref} className="rounded-[10px]" style={{ background: A.barDark, backdropFilter: "blur(20px)" }}>
      <div className="flex items-center justify-between px-3 text-[13px]" style={{ color: "#f5f5f7" }}>
        <div className="flex items-center">
          <button type="button" aria-label="Apple menu" className="px-2.5 py-1.5" onClick={() => setOpen(open === "apple" ? null : "apple")}>
            <AppleLogo size={14} />
          </button>
          <button type="button" className="px-2.5 py-1.5 font-semibold">Finder</button>
          {menus.slice(0, 5).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setOpen(open === m ? null : m)}
              className="rounded-md px-2.5 py-1.5 transition-colors duration-150"
              style={open === m ? { background: "#0a60ff" } : undefined}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 px-1 opacity-90">
          <I d="M3 8h3l3-3v10l-3-3H3zM12 7a4 4 0 010 6M14 5a7 7 0 010 10" size={14} />
          <I d={I_BAG} size={13} />
          <I d={I_SEARCH} size={13} />
          <span className="text-[12.5px] tabular-nums">Mon Sep 24 12:31 PM</span>
        </div>
      </div>
      {open && MAC_MENUS[open] && (
        <div className="menu-in absolute left-3 top-full z-40 mt-1 w-64 rounded-[12px] p-1.5 shadow-2xl" style={{ background: "rgba(45,45,45,0.88)", backdropFilter: "blur(24px)", transformOrigin: "top left" }}>
          {MAC_MENUS[open].map((row, i) =>
            row === "sep" ? (
              <div key={i} className="mx-2.5 my-1 h-px bg-white/15" />
            ) : (
              <button key={i} type="button" className="flex w-full items-center justify-between rounded-[7px] px-2.5 py-[7px] text-[13px] text-white transition-colors duration-150 hover:bg-[#0a60ff]">
                <span>{row[0]}</span>
                <span className="ml-8 opacity-50">{row[1]}</span>
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

/* 13 — macOS dock with pointer magnification */
const DOCK_APPS = [
  { name: "Finder", bg: "linear-gradient(180deg,#3aa0ff,#1668d8)", face: true },
  { name: "Launchpad", bg: "linear-gradient(180deg,#f5f6f8,#d9dce3)", dots: true },
  { name: "Safari", bg: "linear-gradient(180deg,#e8f4ff,#c2e0ff)", compass: true },
  { name: "Messages", bg: "linear-gradient(180deg,#6ce77a,#28c840)", bubble: true },
  { name: "Mail", bg: "linear-gradient(180deg,#5fb2ff,#1a7cf0)", mail: true },
  { name: "Music", bg: "linear-gradient(180deg,#fc5c7d,#e8244f)", note: true },
];
export function AppleDock() {
  const [mx, setMx] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="flex justify-center pb-6 pt-2" style={{ background: A.barDark, borderRadius: 20, margin: "0 12px" }}>
      <div
        ref={ref}
        className="flex items-end gap-2 rounded-[24px] px-3 pb-2 pt-3"
        style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(20px) saturate(1.6)", border: "1px solid rgba(255,255,255,0.2)" }}
        onMouseMove={(e) => setMx(e.clientX)}
        onMouseLeave={() => setMx(null)}
      >
        {DOCK_APPS.map((app) => {
          const r = ref.current?.getBoundingClientRect();
          const idx = DOCK_APPS.indexOf(app);
          const centers = DOCK_APPS.map((_, i) => (r ? r.left + 28 + i * 54 : 0));
          const d = mx === null ? 999 : Math.abs(mx - centers[idx]);
          const scale = mx === null ? 1 : 1 + 0.5 * Math.max(0, 1 - d / 130);
          return (
            <div key={app.name} className="relative flex flex-col items-center" style={{ transform: `translateY(${-(scale - 1) * 30}px) scale(${scale})`, transition: "transform 90ms linear", transformOrigin: "bottom center" }}>
              <div
                className="grid h-11 w-11 place-items-center rounded-[12px] text-white shadow-lg"
                style={{ background: app.bg }}
                aria-label={app.name}
              >
                {app.face && (
                  <div className="h-6 w-8 rounded-[5px] overflow-hidden flex flex-col">
                    <div className="h-1/2 w-full flex justify-center gap-2 bg-[#cfe8ff] pt-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#1c3a5e]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-[#1c3a5e]" />
                    </div>
                    <div className="flex-1 bg-[#1c6bd8]/90 rounded-b-[5px] relative">
                      <span className="absolute left-1/2 top-0 h-[7px] w-[14px] -translate-x-1/2 rounded-b-full border-b-2 border-white" />
                    </div>
                  </div>
                )}
                {app.dots && (
                  <div className="grid grid-cols-3 gap-1">
                    {["#ff5f57", "#febc2e", "#28c840", "#5fb2ff", "#af52de", "#ff9500", "#ff2d55", "#34c759", "#64d2ff"].map((c) => (
                      <span key={c} className="h-1.5 w-1.5 rounded-full" style={{ background: c }} />
                    ))}
                  </div>
                )}
                {app.compass && (
                  <div className="h-7 w-7 rounded-full bg-white grid place-items-center">
                    <span className="h-0 w-0" style={{ borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderBottom: "12px solid #1a7cf0", transform: "rotate(45deg)" }} />
                  </div>
                )}
                {app.bubble && <div className="h-6 w-6 rounded-[8px] bg-white relative"><span className="absolute inset-1 rounded-[5px] bg-white" style={{ clipPath: "polygon(0 0,100% 0,100% 70%,40% 70%,20% 100%,25% 70%,0 70%)" }} /></div>}
                {app.mail && (
                  <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="1.4"><rect x="3" y="5" width="14" height="10" rx="2" /><path d="M3.5 6l6.5 5 6.5-5" /></svg>
                )}
                {app.note && <span className="text-[20px] leading-none">♪</span>}
              </div>
              <span className="mt-1 text-[10px] text-white/0 transition-colors duration-150" style={{ color: mx !== null ? "rgba(255,255,255,0.85)" : undefined }}>
                {mx !== null ? app.name : ""}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* LIQUID GLASS shared scene content wrapper */
function GlassStage({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`relative ${className}`}>{children}</div>;
}

/* 14 — LIQUID GLASS floating pill nav */
export function GlassPillNav() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useDismiss(open, () => setOpen(false), ref);
  return (
    <GlassStage className="flex justify-center py-8">
      <nav className="lg-panel flex items-center gap-1 rounded-full px-2.5 py-2" aria-label="Liquid pill">
        <span className="mr-2 grid h-8 w-8 place-items-center rounded-[10px] bg-white/90 font-display text-[13px] font-bold text-[#0d2f35]">pUi</span>
        {["Widgets", "Blocks", "Pricing"].map((l, i) => (
          <span key={l} className={`lg-item rounded-full px-3.5 py-1.5 text-[13.5px] font-medium text-white ${i === 0 ? "bg-white/20" : ""}`}>
            {l}
          </span>
        ))}
        <div className="relative" ref={ref}>
          <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="lg-item flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13.5px] font-medium text-white">
            More <Chev open={open} />
          </button>
          {open && (
            <div className="lg-panel menu-in absolute right-0 top-full z-40 mt-3 w-56 rounded-[16px] p-2" style={{ transformOrigin: "top right" }}>
              {["Wall of Love", "Countdown timer", "Rating summary", "Newsletter signup"].map((x) => (
                <button key={x} type="button" className="lg-item flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2 text-left text-[13.5px] font-medium text-white">
                  {x}
                </button>
              ))}
            </div>
          )}
        </div>
        <button type="button" className="ml-1 rounded-full bg-white px-4 py-1.5 text-[13.5px] font-semibold text-[#0d2f35] transition-transform duration-150 active:scale-95">
          Open app
        </button>
      </nav>
    </GlassStage>
  );
}

/* 15 — LIQUID GLASS iOS tab bar */
export function GlassTabBar() {
  const [active, setActive] = useState(0);
  const tabs = [
    { label: "Home", icon: I_HOME },
    { label: "Search", icon: I_SEARCH },
    { label: "New", icon: I_PLUS, big: true },
    { label: "Saved", icon: I_HEART, badge: 3 },
    { label: "You", icon: I_PROFILE },
  ];
  return (
    <GlassStage className="flex justify-center py-10">
      <nav className="lg-panel flex items-end gap-1 rounded-[26px] px-3 py-2.5" aria-label="Liquid tabs">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            onClick={() => setActive(i)}
            className="relative flex min-w-[62px] flex-col items-center gap-0.5 rounded-[16px] px-2 py-1.5"
            style={{ color: active === i ? "#fff" : "rgba(255,255,255,0.55)" }}
          >
            {t.big ? (
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#0d2f35] shadow-lg" style={{ transform: active === i ? "none" : "scale(0.92)", transition: `transform 200ms ${spring}` }}>
                <I d={t.icon} size={17} />
              </span>
            ) : (
              <span className="relative">
                <I d={t.icon} size={19} />
                {t.badge && (
                  <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#ff375f] px-1 text-[9px] font-bold text-white">{t.badge}</span>
                )}
              </span>
            )}
            {!t.big && <span className="text-[10px] font-medium">{t.label}</span>}
          </button>
        ))}
      </nav>
    </GlassStage>
  );
}

/* 16 — LIQUID GLASS visionOS sidebar */
export function GlassSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const rows = [
    { icon: I_INBOX_LBL, label: "Inbox", badge: 3 },
    { icon: I_DOC, label: "Today" },
    { icon: I_CLOCK_LBL, label: "Upcoming" },
    { icon: I_FILTER, label: "Filters" },
    { icon: I_CHECK, label: "Completed" },
  ];
  const [active, setActive] = useState(1);
  return (
    <GlassStage className="flex justify-center py-8">
      <aside
        className="lg-panel flex flex-col gap-1 rounded-[22px] p-2.5 transition-all duration-300"
        style={{ width: collapsed ? 72 : 250, transitionTimingFunction: ease }}
        aria-label="Liquid sidebar"
      >
        <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} px-2 py-2`}>
          {!collapsed && <span className="text-[13px] font-semibold text-white">PlanckUi Studio</span>}
          <button
            type="button"
            aria-label="Collapse sidebar"
            onClick={() => setCollapsed(!collapsed)}
            className="lg-item grid h-7 w-7 place-items-center rounded-full text-white/80"
            style={{ transform: collapsed ? "rotate(180deg)" : "none" }}
          >
            <Chev size={12} />
          </button>
        </div>
        {rows.map((r, i) => (
          <button
            key={r.label}
            onClick={() => setActive(i)}
            title={r.label}
            className={`lg-item flex items-center gap-3 rounded-[12px] px-3 text-[13.5px] font-medium text-white ${collapsed ? "justify-center" : ""}`}
            style={{ height: 42, background: active === i ? "rgba(255,255,255,0.22)" : undefined }}
          >
            <span className="shrink-0">{r.icon}</span>
            {!collapsed && <span className="flex-1 text-left">{r.label}</span>}
            {!collapsed && r.badge && (
              <span className="grid h-4.5 min-w-[18px] place-items-center rounded-full bg-white/90 px-1 text-[10px] font-bold text-[#0d2f35]">{r.badge}</span>
            )}
          </button>
        ))}
        {!collapsed && (
          <button type="button" className="mt-2 flex items-center justify-center gap-2 rounded-[12px] bg-white px-3 py-2 text-[13px] font-semibold text-[#0d2f35] transition-transform duration-150 active:scale-95">
            <I d={I_PLUS} size={14} /> New collection
          </button>
        )}
      </aside>
    </GlassStage>
  );
}
const I_INBOX_LBL = <I d="M3 11l2-6h10l2 6v5H3v-5zM3 11h4l1 2h4l1-2h4" size={16} />;
const I_CLOCK_LBL = <I d="M10 3.5A6.5 6.5 0 1110 16.5 6.5 6.5 0 0110 3.5zM10 6.5V10l2.5 1.5" size={16} />;
const I_FILTER = <I d="M3.5 5.5h13M6 10h8M8.5 14.5h3" size={16} />;
const I_CHECK = <I d="M4 10.5l4 4L16 6" size={16} />;

/* 17 — LIQUID GLASS mega menu */
const GLASS_PRODUCTS = [
  { name: "Mac", grad: "linear-gradient(135deg,#a8b2c4,#5f6b80)" },
  { name: "iPad", grad: "linear-gradient(135deg,#8ec5ff,#2f6fd8)" },
  { name: "iPhone", grad: "linear-gradient(135deg,#ffd89b,#e8734a)" },
  { name: "Watch", grad: "linear-gradient(135deg,#c3f0ca,#28a745)" },
];
export function GlassMegaMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useDismiss(open, () => setOpen(false), ref);
  return (
    <GlassStage className="flex justify-center py-10">
      <div ref={ref} className="relative">
        <nav className="lg-panel flex items-center gap-1 rounded-full px-2.5 py-2">
          <span className="px-2 text-white"><AppleLogo size={14} /></span>
          {["Store", "Support"].map((l) => (
            <span key={l} className="lg-item rounded-full px-3.5 py-1.5 text-[13.5px] font-medium text-white/85">{l}</span>
          ))}
          <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="lg-item flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13.5px] font-medium text-white">
            Explore <Chev open={open} />
          </button>
        </nav>
        {open && (
          <div className="lg-panel menu-in absolute left-1/2 top-full z-40 mt-3 w-[460px] -translate-x-1/2 rounded-[22px] p-3" style={{ transformOrigin: "top center" }}>
            <div className="grid grid-cols-4 gap-2">
              {GLASS_PRODUCTS.map((p) => (
                <button key={p.name} type="button" className="lg-item flex flex-col items-center gap-2 rounded-[16px] px-2 py-3 text-white">
                  <span className="h-10 w-10 rounded-[12px]" style={{ background: p.grad }} />
                  <span className="text-[12.5px] font-semibold">{p.name}</span>
                </button>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-3 rounded-[16px] bg-white/12 p-3">
              <span className="h-14 w-14 shrink-0 rounded-[14px]" style={{ background: "linear-gradient(135deg,#e8f0ff,#8fb8ff)" }} />
              <span>
                <span className="block text-[13.5px] font-semibold text-white">New — iPhone Air</span>
                <span className="block text-[12px] text-white/70">The thinnest iPhone ever. From $999.</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </GlassStage>
  );
}

/* 18 — LIQUID GLASS capsule action bar */
export function GlassCapsuleBar() {
  const [liked, setLiked] = useState(false);
  const [plusOpen, setPlusOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  useDismiss(plusOpen, () => setPlusOpen(false), ref);
  return (
    <GlassStage className="flex min-h-[300px] items-start justify-center pt-6">
      <div ref={ref} className="relative flex flex-col items-center">
        {plusOpen && (
          <div className="mb-4 flex gap-3" style={{ animation: "menu-in 200ms " + ease }}>
            {["Video", "Photo", "Poll"].map((x, i) => (
              <button
                key={x}
                type="button"
                className="lg-panel lg-item grid h-12 w-12 place-items-center rounded-full text-white"
                style={{ transform: `translateY(${(plusOpen ? 0 : 10) - i * 2}px)`, transitionDelay: `${i * 40}ms` }}
                aria-label={x}
              >
                {x[0]}
              </button>
            ))}
          </div>
        )}
        <div className="lg-panel flex items-center gap-1.5 rounded-full px-2.5 py-2">
          <button type="button" aria-label="Search" onClick={() => setSearchOpen(!searchOpen)} className="lg-item grid h-9 w-9 place-items-center rounded-full text-white">
            <I d={I_SEARCH} size={16} />
          </button>
          <button
            type="button"
            aria-label="Create"
            aria-expanded={plusOpen}
            onClick={() => setPlusOpen(!plusOpen)}
            className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#0d2f35] transition-transform duration-200"
            style={{ transform: plusOpen ? "rotate(45deg)" : "none", transitionTimingFunction: spring }}
          >
            <I d={I_PLUS} size={16} />
          </button>
          <button type="button" aria-label="Save" onClick={() => setLiked(!liked)} className="lg-item grid h-9 w-9 place-items-center rounded-full">
            <svg width="17" height="17" viewBox="0 0 20 20" fill={liked ? "#ff375f" : "none"} stroke={liked ? "#ff375f" : "white"} strokeWidth="1.7" aria-hidden="true">
              <path d={I_HEART} />
            </svg>
          </button>
          <button type="button" aria-label="Profile" className="lg-item grid h-9 w-9 place-items-center rounded-full text-white">
            <I d={I_PROFILE} size={16} />
          </button>
        </div>
        {searchOpen && (
          <div className="lg-panel menu-in absolute top-full z-40 mt-3 w-72 rounded-[16px] p-2">
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search widgets…"
              className="w-full rounded-[10px] bg-white/15 px-3 py-2 text-[13.5px] text-white outline-none placeholder:text-white/50"
            />
            {["Wall of Love", "Countdown timer"].filter((x) => x.toLowerCase().includes(q.toLowerCase())).map((x) => (
              <button key={x} type="button" className="lg-item mt-1 flex w-full items-center rounded-[10px] px-3 py-2 text-left text-[13px] font-medium text-white">
                {x}
              </button>
            ))}
          </div>
        )}
      </div>
    </GlassStage>
  );
}

/* 19 — Apple Store tabs with product mega menu */
const STORE_TILES = [
  ["MacBook Air 13”", "From $999", "linear-gradient(135deg,#c8cdd6,#8a93a3)"],
  ["MacBook Pro 14”", "From $1,599", "linear-gradient(135deg,#3a3f47,#16181c)"],
  ["iMac 24”", "From $1,299", "linear-gradient(135deg,#9bd7f7,#3f8ed6)"],
  ["Mac mini", "From $599", "linear-gradient(135deg,#d7dce4,#9aa3b2)"],
  ["Mac Studio", "From $1,999", "linear-gradient(135deg,#b6bec9,#767f8d)"],
  ["Mac Pro", "From $6,999", "linear-gradient(135deg,#2e3238,#101215)"],
] as const;
export function AppleStoreNav() {
  const tabs = ["Store", "Mac", "iPad", "Watch", "AirPods"];
  const [open, setOpen] = useState("Mac");
  return (
    <div className="rounded-[14px]" style={{ background: A.barLight, backdropFilter: "blur(20px)" }}>
      <nav className="flex flex-wrap items-center justify-center gap-1 px-4 py-3" aria-label="Store">
        <span className="mr-3" style={{ color: A.ink }}><AppleLogo size={14} /></span>
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setOpen(t)}
            className="rounded-[8px] px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-150"
            style={open === t ? { background: "rgba(0,0,0,0.06)", color: A.ink } : { color: A.sub }}
          >
            {t}
          </button>
        ))}
      </nav>
      {open === "Mac" && (
        <div className="menu-in border-t border-black/5 px-6 pb-6 pt-4">
          <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
            {STORE_TILES.map(([name, price, grad]) => (
              <button key={name} type="button" className="flex flex-col items-center gap-2 rounded-[14px] p-3 transition-colors duration-150 hover:bg-black/5">
                <span className="h-12 w-16 rounded-[10px]" style={{ background: grad }} />
                <span className="text-center text-[12px] font-semibold" style={{ color: A.ink }}>{name}</span>
                <span className="text-[11px]" style={{ color: A.sub }}>{price}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* 20 — iOS segmented control navigation */
export function AppleSegmented() {
  const segs = ["Home", "Widgets", "Blocks", "Account"];
  const [idx, setIdx] = useState(1);
  const copy = [
    "Everything you pinned lives here.",
    "295 widgets, every one free.",
    "Whole sections, copy-paste ready.",
    "Guest workspace — no email needed.",
  ];
  return (
    <div className="mx-auto max-w-sm rounded-[22px] p-6" style={{ background: A.bg }}>
      <div className="flex rounded-[12px] p-[3px]" style={{ background: "#e9e9eb" }} role="tablist" aria-label="Sections">
        {segs.map((s, i) => (
          <button
            key={s}
            role="tab"
            aria-selected={i === idx}
            onClick={() => setIdx(i)}
            className="relative flex-1 rounded-[10px] py-[7px] text-[13px] font-medium"
            style={{ color: i === idx ? A.ink : A.sub, zIndex: 1 }}
          >
            {i === idx && (
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-[10px] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.12)]"
                style={{ animation: "menu-in 180ms " + spring }}
              />
            )}
            <span className="relative">{s}</span>
          </button>
        ))}
      </div>
      <div key={idx} className="price-in mt-5 rounded-[14px] bg-white p-4 text-[14px] leading-relaxed" style={{ color: A.ink }}>
        {copy[idx]}
      </div>
    </div>
  );
}

/* 21 — iOS Settings grouped list */
export function AppleSettingsList() {
  const [on, setOn] = useState(false);
  const rows = [
    { icon: "✈", bg: "#ff9500", label: "Airplane Mode", control: "toggle" as const },
    { icon: "◉", bg: "#007aff", label: "Wi-Fi", value: "Home 5G" },
    { icon: "⌾", bg: "#007aff", label: "Bluetooth", value: "On" },
    { icon: "◐", bg: "#5e5ce6", label: "Focus" },
  ];
  const rows2 = [
    { icon: "⚙", bg: "#8e8e93", label: "General" },
    { icon: "☑", bg: "#007aff", label: "Accessibility" },
  ];
  const Row = ({ r }: { r: { icon: string; bg: string; label: string; value?: string; control?: "toggle" } }) => (
    <div className="flex items-center gap-3 bg-white px-4 py-2.5" style={{ color: A.ink }}>
      <span className="grid h-[29px] w-[29px] place-items-center rounded-[7px] text-[15px] text-white" style={{ background: r.bg }}>
        {r.icon}
      </span>
      <span className="flex-1 text-[15px]">{r.label}</span>
      {r.control === "toggle" ? (
        <button
          type="button"
          role="switch"
          aria-checked={on}
          onClick={() => setOn(!on)}
          className="relative h-[31px] w-[51px] rounded-full transition-colors duration-200"
          style={{ background: on ? "#34c759" : "#e9e9ea" }}
        >
          <span
            className="absolute top-[2px] h-[27px] w-[27px] rounded-full bg-white shadow-md"
            style={{ left: on ? 22 : 2, transition: "left 200ms " + spring }}
          />
        </button>
      ) : (
        <>
          {r.value && <span className="text-[15px]" style={{ color: A.sub }}>{r.value}</span>}
          <span style={{ color: "#c7c7cc" }}>›</span>
        </>
      )}
    </div>
  );
  return (
    <div className="mx-auto max-w-sm rounded-[18px] p-3" style={{ background: A.bg }}>
      <div className="overflow-hidden rounded-[12px]">
        <div className="flex flex-col gap-px [&>*+*]:mt-px">
          {rows.map((r) => <Row key={r.label} r={r} />)}
        </div>
        <div className="mt-5 flex flex-col gap-px [&>*+*]:mt-px overflow-hidden rounded-[12px]">
          {rows2.map((r) => <Row key={r.label} r={r} />)}
        </div>
      </div>
      <p className="mt-3 text-xs" style={{ color: A.sub }}>Toggle Airplane Mode — the switch springs like iOS.</p>
    </div>
  );
}

/* 22 — Apple Developer dark nav */
export function AppleDevDark() {
  const links = ["News", "Discover", "Design", "Develop", "Distribute", "Support"];
  return (
    <div className="rounded-[12px]" style={{ background: A.barDark, backdropFilter: "blur(20px)" }}>
      <nav className="flex items-center justify-between px-5 py-3">
        <div className="flex items-center gap-6">
          <span style={{ color: "#f5f5f7" }}><AppleLogo size={14} /></span>
          {links.map((l) => (
            <a key={l} href="#navigations" className="text-[12.5px] transition-colors duration-150" style={{ color: "#a1a1a6" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#f5f5f7")} onMouseLeave={(e) => (e.currentTarget.style.color = "#a1a1a6")}>
              {l}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <span style={{ color: "#a1a1a6" }}><I d={I_SEARCH} size={13} /></span>
          <button type="button" className="rounded-full px-3.5 py-1.5 text-[12.5px] font-medium" style={{ background: A.blueDark, color: "#fff" }}>
            Account
          </button>
        </div>
      </nav>
    </div>
  );
}

/* 23 — Apple Pay product nav with mini-cart */
export function ApplePayNav() {
  const [qty, setQty] = useState(1);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useDismiss(open, () => setOpen(false), ref);
  return (
    <div className="rounded-[14px] px-5 py-4" style={{ background: A.barLight, backdropFilter: "blur(20px)" }}>
      <div className="flex items-center gap-4">
        <span className="h-10 w-10 rounded-[10px] bg-white shadow-sm" />
        <div className="flex-1">
          <div className="text-[14px] font-semibold" style={{ color: A.ink }}>AirTag</div>
          <div className="text-[12px]" style={{ color: A.sub }}>Lose your knack for losing things.</div>
        </div>
        <span className="text-[15px] font-semibold" style={{ color: A.ink }}>$29</span>
        <button type="button" className="flex items-center gap-1 rounded-full px-4 py-2 text-[13px] font-semibold text-white transition-transform duration-150 active:scale-95" style={{ background: A.ink }}>
          <AppleLogo size={12} /> Pay
        </button>
        <div ref={ref} className="relative">
          <button type="button" aria-label="Bag" aria-expanded={open} onClick={() => setOpen(!open)} className="relative grid h-9 w-9 place-items-center rounded-full transition-colors duration-150 hover:bg-black/5" style={{ color: A.ink }}>
            <I d={I_BAG} size={16} />
            <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full text-[9px] font-bold text-white" style={{ background: A.blue }}>{qty}</span>
          </button>
          {open && (
            <div className="menu-in absolute right-0 top-full z-40 mt-2 w-64 rounded-[16px] border border-black/5 bg-white p-3 shadow-xl" style={{ transformOrigin: "top right" }}>
              <div className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-[8px]" style={{ background: "#e8e8ed" }} />
                <div className="flex-1 text-[13px]" style={{ color: A.ink }}>
                  AirTag
                  <div style={{ color: A.sub }}>$29 × {qty}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="h-6 w-6 rounded-full border border-black/10 text-[13px]" style={{ color: A.ink }}>−</button>
                  <button type="button" onClick={() => setQty(qty + 1)} className="h-6 w-6 rounded-full border border-black/10 text-[13px]" style={{ color: A.ink }}>+</button>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-black/5 pt-3 text-[13px] font-semibold" style={{ color: A.ink }}>
                <span>Subtotal</span>
                <span>${29 * qty}</span>
              </div>
              <button type="button" className="mt-3 w-full rounded-full py-2 text-[13px] font-semibold text-white" style={{ background: A.blue }}>
                Check Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* 24 — Apple Music-style colored tabs */
const MUSIC_TABS = [
  ["Listen Now", "linear-gradient(135deg,#fa233b,#fb5c74)"],
  ["Browse", "linear-gradient(135deg,#fa233b,#fb5c74)"],
  ["Radio", "linear-gradient(135deg,#872ec4,#c94bb4)"],
  ["Library", "linear-gradient(135deg,#0a84ff,#5ac8fa)"],
] as const;
export function AppleMusicNav() {
  const [active, setActive] = useState(0);
  return (
    <div className="rounded-[14px] p-1" style={{ background: "rgba(29,29,31,0.85)", backdropFilter: "blur(20px)" }}>
      <div className="flex flex-wrap items-center gap-1 px-2 py-1">
        <span className="mr-3 flex items-center gap-1.5 text-[13px] font-bold" style={{ color: "#fa233b" }}>
          <AppleLogo size={13} /> Music
        </span>
        {MUSIC_TABS.map(([label], i) => (
          <button
            key={label}
            type="button"
            onClick={() => setActive(i)}
            className="relative rounded-[8px] px-3.5 py-2 text-[13px] font-semibold transition-colors duration-150"
            style={{ color: active === i ? "#fff" : "#a1a1a6" }}
          >
            {label}
            {active === i && (
              <span
                aria-hidden="true"
                className="absolute inset-x-3 bottom-1 h-[2.5px] rounded-full"
                style={{ background: MUSIC_TABS[i][1] }}
              />
            )}
          </button>
        ))}
      </div>
      <div className="mx-2 mb-2 flex items-center gap-4 rounded-[12px] p-4" style={{ background: MUSIC_TABS[active][1] }}>
        <div className="h-16 w-16 rounded-[10px] bg-white/25" />
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wide text-white/70">{MUSIC_TABS[active][0]}</div>
          <div className="text-[17px] font-bold text-white">Made for you, refreshed daily.</div>
        </div>
      </div>
    </div>
  );
}

/* 25 — watchOS app grid */
const WATCH_APPS: Array<[string, string, React.ReactNode]> = [
  ["Activity", "#000", (
    <svg width="30" height="30" viewBox="0 0 30 30" style={{ transform: "rotate(-90deg)" }} aria-hidden="true">
      <circle cx="15" cy="15" r="11" fill="none" stroke="#3d0a2e" strokeWidth="4" />
      <circle cx="15" cy="15" r="11" fill="none" stroke="#fa114f" strokeWidth="4" strokeLinecap="round" strokeDasharray="52 69" />
      <circle cx="15" cy="15" r="7" fill="none" stroke="#123300" strokeWidth="3.6" />
      <circle cx="15" cy="15" r="7" fill="none" stroke="#92e82a" strokeWidth="3.6" strokeLinecap="round" strokeDasharray="30 44" />
    </svg>
  )],
  ["Workout", "#fd4e0e", <span className="text-[18px]" aria-hidden="true">🏃</span>],
  ["Heart", "#ec2c4d", <span className="text-[18px]" aria-hidden="true">❤</span>],
  ["Music", "#fa2f70", <span className="text-[18px]" aria-hidden="true">♪</span>],
  ["Mail", "#1d77ef", <span className="text-[15px]" aria-hidden="true">✉</span>],
  ["Maps", "#3aa757", <span className="text-[15px]" aria-hidden="true">🧭</span>],
  ["Settings", "#5e6169", <span className="text-[15px]" aria-hidden="true">⚙</span>],
  ["Weather", "#2e7cf6", <span className="text-[15px]" aria-hidden="true">☀</span>],
];
export function AppleWatchGrid() {
  return (
    <div className="grid place-items-center rounded-[16px] bg-black p-8">
      <div className="grid grid-cols-4 gap-x-7 gap-y-5">
        {WATCH_APPS.map(([name, bg, node]) => (
          <div key={name} className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              aria-label={name}
              className="grid h-[54px] w-[54px] place-items-center rounded-full text-white transition-transform duration-150 active:scale-90"
              style={{ background: bg }}
            >
              {node}
            </button>
            <span className="text-[10px] font-medium text-white/85">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
