"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { WidgetPreview } from "./WidgetPreview";
import { DEMO_TESTIMONIALS } from "@/lib/widgets/demo-data";
import {
  LIVE_WIDGETS,
  WIDGETS,
  defaultsFor,
} from "@/lib/widgets/registry";
import { IFRAME_WIDGETS, previewIframeSrc } from "@/lib/widgets/renderers";
import { CATEGORIES, type WidgetDef } from "@/lib/widgets/types";

const ALL: WidgetDef[] = [...LIVE_WIDGETS, ...WIDGETS.filter((w) => w.status === "planned")];

export function GalleryClient() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>(() => {
    // deep link: /gallery?category=mac (or any category id)
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("category");
      if (p && (p === "all" || CATEGORIES.some((c) => c.id === p))) return p;
    }
    return "all";
  });

  // keep the URL shareable when the filter changes
  const setCatUrl = (id: string) => {
    setCat(id);
    if (typeof window !== "undefined") {
      const url = id === "all" ? window.location.pathname : window.location.pathname + "?category=" + id;
      window.history.replaceState(null, "", url);
    }
  };

  const qn = q.trim().toLowerCase();
  const matches = (w: WidgetDef) =>
    (cat === "all" || w.category === cat) &&
    (!qn || w.name.toLowerCase().includes(qn) || w.blurb.toLowerCase().includes(qn));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <input
          className="input max-w-md"
          placeholder="Search the catalog — try “countdown” or “reviews”"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search widgets"
        />
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          <Chip active={cat === "all"} onClick={() => setCatUrl("all")}>
            All
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c.id} active={cat === c.id} onClick={() => setCatUrl(c.id)}>
              {c.name}
            </Chip>
          ))}
        </div>
      </div>

      <div className="grid grid-flow-dense grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ALL.filter(matches).map((w) =>
          w.status === "live" ? (
            <CatalogCard key={w.id} def={w} />
          ) : (
            <PlannedCard key={w.id} def={w} />
          )
        )}
      </div>

      {ALL.filter(matches).length === 0 && (
        <p className="rounded-[var(--radius-lg)] border border-dashed border-line-2 px-5 py-10 text-center text-sm text-ink-3">
          Nothing matches that. The catalog is honest about what exists — try another word.
        </p>
      )}
    </div>
  );
}

function CatalogCard({ def }: { def: WidgetDef }) {
  const cfg = { ...defaultsFor(def), maxWidth: 640 };
  const isForm = IFRAME_WIDGETS.has(def.id);
  const floating = ["sticky-cta", "floating-whatsapp-button", "sticky-footer-bar", "floating-action-menu", "announcement-bar"].includes(def.id);

  return (
    <article className="card flex flex-col overflow-hidden transition-colors duration-150 hover:border-ink-3">
      <div className="relative h-44 overflow-hidden border-b border-line">
        <Link
          href={`/gallery/${def.id}?paint=1`}
          aria-label="Customize this widget"
          title="Paint it — colors, fonts, shape"
          className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-[var(--surface)] text-ink-2 shadow-sm transition-colors duration-150 hover:border-accent hover:text-accent"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 21v-4a4 4 0 1 1 4 4H3Z"/><path d="M21 3.2a1.2 1.2 0 0 0-1.7 0L11.5 11l1.5 1.5 7.8-7.8a1.2 1.2 0 0 0 0-1.7Z"/><path d="M11.5 11l1.5 1.5"/></svg>
        </Link>
        {floating ? (
          <div className="grid h-full place-items-center bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.02)_10px,rgba(0,0,0,0.02)_20px)]">
            <span className="rounded-full border border-line px-3 py-1 text-xs text-ink-3">floats over your page</span>
          </div>
        ) : (
          <WidgetPreview
            type={def.id}
            config={cfg}
            className="h-44 overflow-hidden"
            items={def.needsCollection ? DEMO_TESTIMONIALS.slice(0, 4) : undefined}
            iframeSrc={isForm ? previewIframeSrc(def.id, cfg) : undefined}
            style={{ pointerEvents: "none" }}
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="font-display text-[15px] font-semibold">{def.name}</h2>
        <p className="flex-1 text-sm text-ink-3">{def.blurb}</p>
        <Link
          href={`/gallery/${def.id}`}
          className="self-start text-sm font-medium text-accent transition-colors hover:text-accent-strong"
        >
          View and embed →
        </Link>
      </div>
    </article>
  );
}

function PlannedCard({ def }: { def: WidgetDef }) {
  return (
    <article className="card flex flex-col gap-2 border-dashed p-4 opacity-80">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-[15px] font-semibold">{def.name}</h2>
        <span className="rounded-full border border-line px-2.5 py-0.5 text-xs text-ink-3">In build</span>
      </div>
      <p className="flex-1 text-sm text-ink-3">{def.blurb}</p>
      <Link
        href={`/gallery/${def.id}`}
        className="self-start text-sm text-ink-3 transition-colors hover:text-ink"
      >
        Status →
      </Link>
    </article>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="rounded-full border px-3.5 py-1.5 text-sm transition-colors duration-150"
      style={
        active
          ? { background: "var(--ink)", color: "var(--bg)", borderColor: "var(--ink)" }
          : { borderColor: "var(--line-2)", color: "var(--ink-2)" }
      }
    >
      {children}
    </button>
  );
}
