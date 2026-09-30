"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { searchSite, type SearchEntry } from "@/lib/site-index";

/* Site-wide ⌘K palette. Searches widgets, blocks, landing pages, navigation
   menus and the blog; arrow keys move, Enter opens, Escape closes. Mounted
   once in the site chrome — the shortcut works on every page that uses it. */

export function SiteSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => searchSite(q, 14), [q]);

  function open_() {
    setOpen(true);
    setQ("");
    setActive(0);
  }
  function close() {
    setOpen(false);
    setActive(0);
  }
  function go(e: SearchEntry) {
    close();
    router.push(e.href);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA";
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => {
      if (e.target instanceof Node && overlayRef.current && !overlayRef.current.contains(e.target)) close();
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
      if (e.key === "Enter" && results[active]) { close(); router.push(results[active].href); }
    };
    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("keydown", key);
    };
  }, [open, results, active, router]);

  const overlayRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <button
        type="button"
        aria-label="Search the site"
        onClick={open_}
        className="hidden h-8 w-8 place-items-center rounded-full text-ink-2 transition-colors duration-150 hover:bg-[var(--surface-2)] hover:text-ink sm:grid"
      >
        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M9 3a6 6 0 104.4 10.1L17 16.8M9 3a6 6 0 010 12 6 6 0 000-12z" /></svg>
      </button>

      {open && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[14vh]"
          style={{ background: "rgba(10,12,14,0.55)", backdropFilter: "blur(4px)" }}
          role="dialog"
          aria-modal="true"
          aria-label="Site search"
        >
          <div className="menu-in w-full max-w-lg overflow-hidden rounded-[16px] border border-line bg-surface shadow-2xl">
            <div className="flex items-center gap-2.5 border-b border-line px-4 py-3">
              <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="var(--ink-3)" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M9 3a6 6 0 104.4 10.1L17 16.8M9 3a6 6 0 010 12 6 6 0 000-12z" /></svg>
              <input
                ref={inputRef}
                autoFocus
                value={q}
                onChange={(e) => { setQ(e.target.value); setActive(0); }}
                placeholder="Search widgets, blocks, landing pages…"
                aria-label="Search everything"
                style={{ caretColor: "var(--accent)" }}
                className="w-full bg-transparent text-[14.5px] text-ink outline-none placeholder:text-ink-3"
              />
              <kbd className="rounded-md border border-line px-1.5 py-0.5 font-mono text-[10px] text-ink-3">ESC</kbd>
            </div>
            <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
              {results.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-ink-3">
                  Nothing matches “{q}”. Try “wall”, “dark” or “reviews”.
                </p>
              )}
              {results.map((r, i) => (
                <button
                  key={r.href + r.title}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => { close(); router.push(r.href); }}
                  className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left transition-colors duration-150"
                  style={i === active ? { background: "var(--surface-2)" } : undefined}
                >
                  <span className="w-[92px] shrink-0 font-mono text-[10px] uppercase tracking-[0.06em] text-ink-3">{r.kind}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-medium text-ink">{r.title}</span>
                    <span className="block truncate text-[11.5px] text-ink-3">{r.sub}</span>
                  </span>
                  <span className="shrink-0 text-ink-3" aria-hidden="true">↵</span>
                </button>
              ))}
              {results.length > 0 && (
                <div className="flex items-center justify-between px-3 pb-1 pt-2 text-[10.5px] text-ink-3">
                  <span>{results.length} results</span>
                  <span className="flex gap-2"><kbd className="font-mono">↑↓</kbd> move <kbd className="font-mono">↵</kbd> open</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
