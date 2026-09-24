"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Chev, I, I_DOC, I_MENU, I_SEARCH, useDismiss } from "./shared";

/* Ten navigation menus in PlanckUi's own CSS — tokens, Archivo/Golos type,
   petrol accent, Emil motion law throughout. Each is a live, working menu. */

const ITEM_ICON: Record<string, string> = {
  home: "M4 10l6-5.5L16 10v6h-4.4v-3.4H8.4V16H4v-6z",
  grid: "M4 4h5v5H4zM11 4h5v5h-5zM4 11h5v5H4zM11 11h5v5h-5z",
  layers: "M10 3l7 4-7 4-7-4 7-4zM3 12l7 4 7-4",
  inbox: "M3 11l2-6h10l2 6v5H3v-5zM3 11h4l1 2h4l1-2h4",
  gear: "M10 7.2A2.8 2.8 0 1110 12.8 2.8 2.8 0 0110 7.2zM10 3v1.6M10 15.4V17M3 10h1.6M15.4 10H17M5 5l1.1 1.1M13.9 13.9L15 15M15 5l-1.1 1.1M6.1 13.9L5 15",
  star: "M10 3l2.2 4.7 5 .6-3.7 3.4.9 5-4.4-2.4-4.4 2.4.9-5L2.8 8.3l5-.6L10 3z",
  clock: "M10 3.5A6.5 6.5 0 1110 16.5 6.5 6.5 0 0110 3.5zM10 6.5V10l2.5 1.5",
  trend: "M4 14l4-5 3 3 5-6M12 6h4v4",
};

export function Icon({ name, size = 15 }: { name: keyof typeof ITEM_ICON | string; size?: number }) {
  return <I d={ITEM_ICON[name] ?? I_DOC} size={size} />;
}

/* dropdown shell used by several variants */
function Drop({
  label,
  children,
  panelClass = "w-60",
}: {
  label: string;
  children: React.ReactNode;
  panelClass?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useDismiss(open, () => setOpen(false), ref);
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-ink-2 transition-colors duration-150 hover:bg-[var(--surface-2)] hover:text-ink"
      >
        {label} <Chev open={open} />
      </button>
      {open && (
        <div className="menu-in absolute left-0 top-full z-40 mt-2" style={{ transformOrigin: "top left" }}>
          <div className={`rounded-[14px] border border-line bg-surface p-2 shadow-lg ${panelClass}`}>{children}</div>
        </div>
      )}
    </div>
  );
}

function Item({
  icon,
  label,
  desc,
}: {
  icon?: string;
  label: string;
  desc?: string;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-start gap-3 rounded-[10px] px-3 py-2.5 text-left transition-colors duration-150 hover:bg-[var(--surface-2)]"
    >
      {icon && (
        <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-[8px] bg-[var(--accent-soft)] text-[var(--accent)]">
          <Icon name={icon} size={14} />
        </span>
      )}
      <span className="min-w-0">
        <span className="block text-[13.5px] font-medium leading-tight text-ink">{label}</span>
        {desc && <span className="mt-0.5 block text-xs leading-snug text-ink-3">{desc}</span>}
      </span>
    </button>
  );
}

/* 01 — classic horizontal bar with a two-column mega panel */
export function PlankMega() {
  return (
    <div>
      <nav className="flex flex-wrap items-center gap-1 rounded-full border border-line bg-[var(--surface-2)] px-3 py-1.5" aria-label="Mega">
        <span className="mr-2 font-display text-[15px] font-semibold tracking-tight">PlanckUi</span>
        <Drop label="Widgets" panelClass="w-[430px]">
          <div className="grid grid-cols-2 gap-1">
            <Item icon="star" label="Wall of Love" desc="Masonry of approved quotes" />
            <Item icon="clock" label="Countdown timer" desc="Tick toward any launch" />
            <Item icon="trend" label="Rating summary" desc="Real math, real stars" />
            <Item icon="inbox" label="Newsletter signup" desc="Collect emails instantly" />
          </div>
          <div className="mt-1 border-t border-line p-1">
            <button type="button" className="flex w-full items-center justify-between rounded-[10px] bg-[var(--accent-soft)] px-3 py-2.5 text-left transition-colors duration-150 hover:bg-[var(--accent)] hover:text-[var(--accent-ink)]">
              <span>
                <span className="block text-[13px] font-semibold">New — 295 widgets live</span>
                <span className="block text-xs opacity-80">All free, no email asked</span>
              </span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </Drop>
        <Drop label="Blocks" panelClass="w-60">
          <Item icon="grid" label="Hero" desc="Large-title opener" />
          <Item icon="layers" label="Pricing" desc="Segmented billing toggle" />
          <Item icon="star" label="Testimonials" desc="Masonry wall section" />
        </Drop>
        <Link href="/#pricing" className="rounded-full px-3 py-1.5 text-sm text-ink-2 transition-colors duration-150 hover:bg-[var(--surface-2)] hover:text-ink">
          Pricing
        </Link>
        <span className="flex-1" />
        <button type="button" aria-label="Search" className="grid h-8 w-8 place-items-center rounded-full text-ink-2 transition-colors duration-150 hover:bg-[var(--surface-2)] hover:text-ink">
          <I d={I_SEARCH} size={15} />
        </button>
        <Link href="/dashboard" className="btn btn-primary btn-sm rounded-full">
          Open app
        </Link>
      </nav>
      <p className="mt-3 text-xs text-ink-3">Click “Widgets” or “Blocks” — real dropdowns, 180 ms ease-out.</p>
    </div>
  );
}

/* 02 — shadcn-style inline text menus with small popovers */
export function PlankInline() {
  return (
    <nav className="flex flex-wrap items-center gap-2 text-sm" aria-label="Inline">
      <a href="#navigations" className="rounded-md px-2.5 py-1.5 font-medium text-ink transition-colors duration-150 hover:bg-[var(--surface-2)]">
        Getting started
      </a>
      <Drop label="Components" panelClass="w-56">
        <Item label="Style" desc="Tokens and theming" />
        <Item label="Animations" desc="Springs and easings" />
        <Item label="Motion" desc="Scroll choreography" />
      </Drop>
      <Drop label="Docs" panelClass="w-56">
        <Item icon="doc" label="Installation" desc="Copy, paste, done" />
        <Item icon="doc" label="Theming" desc="One token file" />
      </Drop>
      <a href="#navigations" className="rounded-md px-2.5 py-1.5 text-ink-2 transition-colors duration-150 hover:bg-[var(--surface-2)] hover:text-ink">
        Blog
      </a>
      <p className="ml-2 text-xs text-ink-3">← the shadcn pattern: quiet text, small popovers.</p>
    </nav>
  );
}

/* 03 — full-width category mega grid */
export function PlankCategoryGrid() {
  return (
    <div>
      <nav className="flex items-center gap-2 rounded-full border border-line bg-[var(--surface-2)] px-3 py-1.5" aria-label="Categories">
        <span className="mr-2 font-display text-[15px] font-semibold tracking-tight">PlanckUi</span>
        <Drop label="Catalog" panelClass="w-[460px]">
          <div className="grid grid-cols-3 gap-1">
            {[
              ["star", "Proof", "12"],
              ["doc", "Media", "31"],
              ["inbox", "Collect", "18"],
              ["clock", "Promo", "24"],
              ["grid", "Layout", "29"],
              ["gear", "Utility", "26"],
            ].map(([icon, name, count]) => (
              <button key={name} type="button" className="flex flex-col items-start gap-2 rounded-[10px] p-3 text-left transition-colors duration-150 hover:bg-[var(--surface-2)]">
                <span className="grid h-8 w-8 place-items-center rounded-[8px] bg-[var(--accent-soft)] text-[var(--accent)]">
                  <Icon name={icon} size={15} />
                </span>
                <span className="text-[13px] font-medium text-ink">{name}</span>
                <span className="text-[11px] text-ink-3">{count} widgets</span>
              </button>
            ))}
          </div>
          <div className="mt-1 flex items-center justify-between border-t border-line px-3 py-2 text-xs text-ink-3">
            <span>295 widgets · all free</span>
            <Link href="/gallery" className="font-medium text-[var(--accent)]">
              View all →
            </Link>
          </div>
        </Drop>
        <span className="px-2 text-sm text-ink-2">Pricing</span>
        <span className="px-2 text-sm text-ink-2">Docs</span>
      </nav>
      <p className="mt-3 text-xs text-ink-3">Hover-safe mega grid: every category gets an icon, a name, a count.</p>
    </div>
  );
}

/* 04 — sliding underline indicator */
export function PlankUnderline() {
  const items = ["Home", "Widgets", "Blocks", "Pricing", "About"];
  const [active, setActive] = useState(1);
  const [hover, setHover] = useState<number | null>(null);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const [box, setBox] = useState({ left: 0, width: 0 });
  useEffect(() => {
    const el = refs.current[hover ?? active];
    if (el) setBox({ left: el.offsetLeft, width: el.offsetWidth });
  }, [hover, active]);
  return (
    <div>
      <nav className="relative inline-flex items-center gap-1" aria-label="Underline">
        {items.map((label, i) => (
          <button
            key={label}
            ref={(el) => {
              refs.current[i] = el;
            }}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            onClick={() => setActive(i)}
            className={`relative rounded-md px-3.5 py-2 text-sm transition-colors duration-150 ${
              i === active ? "font-medium text-ink" : "text-ink-2"
            }`}
          >
            {label}
          </button>
        ))}
        <span
          aria-hidden="true"
          className="absolute -bottom-0.5 h-[2.5px] rounded-full bg-[var(--accent)]"
          style={{ left: box.left + 8, width: Math.max(0, box.width - 16), transition: "left 220ms cubic-bezier(0.23,1,0.32,1), width 220ms cubic-bezier(0.23,1,0.32,1)" }}
        />
      </nav>
      <p className="mt-3 text-xs text-ink-3">Hover the items — the petrol underline glides between them.</p>
    </div>
  );
}

/* 05 — vertical sidebar with sliding active pill */
export function PlankSidebar() {
  const rows = [
    { icon: "home", label: "Overview" },
    { icon: "grid", label: "Widgets" },
    { icon: "inbox", label: "Inbox", badge: 3 },
    { icon: "clock", label: "Scheduled" },
    { icon: "gear", label: "Settings" },
  ];
  const [active, setActive] = useState(0);
  const ROW = 44;
  return (
    <div className="flex">
      <aside className="w-60 rounded-[16px] border border-line bg-[var(--surface-2)] p-2" aria-label="Sidebar">
        <div className="px-3 pb-2 pt-1 font-display text-sm font-semibold">Workspace</div>
        <div className="relative">
          <span
            aria-hidden="true"
            className="absolute left-0 right-0 rounded-[10px] bg-surface shadow-md"
            style={{ height: ROW, transform: `translateY(${active * ROW}px)`, transition: "transform 220ms cubic-bezier(0.23,1,0.32,1)" }}
          />
          {rows.map((r, i) => (
            <button
              key={r.label}
              onClick={() => setActive(i)}
              className={`relative flex w-full items-center gap-3 px-3 text-[13.5px] transition-colors duration-150 ${
                i === active ? "font-medium text-ink" : "text-ink-2 hover:text-ink"
              }`}
              style={{ height: ROW }}
            >
              <span className={i === active ? "text-[var(--accent)]" : ""}>
                <Icon name={r.icon} size={15} />
              </span>
              <span className="flex-1 text-left">{r.label}</span>
              {r.badge && (
                <span className="rounded-full bg-[var(--accent)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--accent-ink)]">
                  {r.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </aside>
      <p className="ml-4 max-w-[180px] self-center text-xs text-ink-3">Sliding pill selection — 220 ms, transform only.</p>
    </div>
  );
}

/* 06 — breadcrumb trail */
export function PlankBreadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm">
      <a href="#navigations" className="rounded-md px-2 py-1 font-medium text-ink transition-colors duration-150 hover:bg-[var(--surface-2)]">
        Home
      </a>
      <span className="text-ink-3" aria-hidden="true">/</span>
      <a href="#navigations" className="rounded-md px-2 py-1 text-ink-2 transition-colors duration-150 hover:bg-[var(--surface-2)] hover:text-ink">
        Gallery
      </a>
      <span className="text-ink-3" aria-hidden="true">/</span>
      <span className="rounded-md bg-[var(--surface-2)] px-2 py-1 font-medium text-ink">Wall of Love</span>
      <span className="flex-1" />
      <button type="button" className="btn btn-ghost btn-sm rounded-full">
        ← Back
      </button>
    </nav>
  );
}

/* 07 — mobile hamburger with slide-down panel */
export function PlankMobile() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mx-auto w-full max-w-xs rounded-[22px] border border-line bg-surface p-3 shadow-md">
      <div className="flex items-center justify-between rounded-[14px] bg-[var(--surface-2)] px-3 py-2.5">
        <span className="font-display text-sm font-semibold">PlanckUi</span>
        <button
          type="button"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
          className="grid h-8 w-8 place-items-center rounded-full text-ink transition-transform duration-150 active:scale-95"
        >
          <I d={I_MENU} size={17} />
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 240ms cubic-bezier(0.23,1,0.32,1)",
        }}
      >
        <nav className="overflow-hidden" aria-label="Mobile">
          <div className="flex flex-col gap-1 px-1 pt-3 pb-1">
            {["Widgets", "Blocks", "Pricing", "Dashboard"].map((l) => (
              <a key={l} href="#navigations" className="rounded-[10px] px-3 py-2.5 text-[14px] text-ink-2 transition-colors duration-150 hover:bg-[var(--surface-2)] hover:text-ink">
                {l}
              </a>
            ))}
            <button type="button" className="btn btn-primary mt-2 w-full rounded-full">
              Open app
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}

/* 08 — search-first nav with live results */
const SEARCHABLE = ["Wall of Love", "Countdown timer", "Rating summary", "FAQ accordion", "Newsletter signup", "Live activity feed"];
export function PlankSearch() {
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useDismiss(focus, () => setFocus(false), ref);
  const hits = SEARCHABLE.filter((s) => s.toLowerCase().includes(q.toLowerCase()));
  return (
    <div ref={ref} className="relative mx-auto w-full max-w-md">
      <div className="flex items-center gap-2 rounded-full border border-line bg-[var(--surface-2)] px-4 py-2">
        <span className="text-ink-3">
          <I d={I_SEARCH} size={15} />
        </span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocus(true)}
          placeholder="Search 295 widgets…"
          aria-label="Search widgets"
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-3"
        />
        <kbd className="rounded-md border border-line bg-surface px-1.5 py-0.5 font-mono text-[10px] text-ink-3">⌘K</kbd>
      </div>
      {focus && (
        <div className="menu-in absolute left-0 right-0 top-full z-40 mt-2 rounded-[14px] border border-line bg-surface p-2 shadow-lg">
          {hits.length === 0 && <p className="px-3 py-2 text-sm text-ink-3">No widget matches “{q}”.</p>}
          {hits.map((h) => (
            <button key={h} type="button" className="flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2 text-left text-[13.5px] text-ink transition-colors duration-150 hover:bg-[var(--surface-2)]">
              <span className="text-ink-3">
                <I d={I_SEARCH} size={13} />
              </span>
              {h}
            </button>
          ))}
        </div>
      )}
      <p className="mt-3 text-center text-xs text-ink-3">Focus the field and type — results filter live.</p>
    </div>
  );
}

/* 09 — tabs with counts */
export function PlankTabs() {
  const tabs = [
    ["All", 295],
    ["Proof", 12],
    ["Media", 34],
    ["Collect", 18],
    ["Promo", 24],
  ] as const;
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Categories">
        {tabs.map(([label, count], i) => (
          <button
            key={label}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all duration-150 active:scale-[0.97] ${
              i === active
                ? "bg-[var(--ink)] font-medium text-[var(--bg)]"
                : "border border-line bg-surface text-ink-2 hover:border-[var(--line-2)] hover:text-ink"
            }`}
          >
            {label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
                i === active ? "bg-[var(--surface-2)] text-ink" : "bg-[var(--surface-2)] text-ink-3"
              }`}
            >
              {count}
            </span>
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm text-ink-3">
        Showing <b className="font-medium text-ink">{tabs[active][1]}</b> widgets in{" "}
        <b className="font-medium text-ink">{tabs[active][0]}</b>.
      </p>
    </div>
  );
}

/* 10 — floating bottom dock with tooltips */
export function PlankDock() {
  const apps = [
    { icon: "home", label: "Home" },
    { icon: "grid", label: "Widgets" },
    { icon: "layers", label: "Blocks" },
    { icon: "star", label: "Reviews" },
    { icon: "gear", label: "Settings" },
  ];
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div className="flex justify-center pb-4 pt-2">
      <div className="flex items-end gap-2 rounded-[20px] border border-line bg-[var(--surface-2)] px-3 py-2.5 shadow-lg">
        {apps.map((a, i) => (
          <div key={a.label} className="relative flex flex-col items-center">
            {hover === i && (
              <span
                className="menu-in absolute -top-9 whitespace-nowrap rounded-[8px] border border-line bg-surface px-2.5 py-1 text-[11px] font-medium text-ink shadow-md"
                style={{ transformOrigin: "bottom center" }}
              >
                {a.label}
              </span>
            )}
            <button
              type="button"
              aria-label={a.label}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className={`grid h-11 w-11 place-items-center rounded-[13px] transition-all duration-150 active:scale-90 ${
                i === 0 ? "bg-[var(--ink)] text-[var(--bg)]" : "text-ink-2 hover:bg-surface hover:text-ink"
              }`}
              style={{ boxShadow: hover === i ? "var(--shadow-md)" : undefined, transform: hover === i ? "translateY(-3px)" : "none" }}
            >
              <Icon name={a.icon} size={17} />
            </button>
            {i === 0 && <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-[var(--accent)]" aria-hidden="true" />}
          </div>
        ))}
      </div>
    </div>
  );
}
