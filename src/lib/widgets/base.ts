import type { RenderResult, TestimonialData, WidgetConfig } from "./types";

export function esc(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* Shared CSS for every widget. Runs inside a Shadow DOM root, so it can never
   leak into (or inherit from) the host page. Emits vanilla CSS on purpose:
   embeds must not ship a framework. */
export function baseCss(c: WidgetConfig, css: string): string {
  return `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:host {
  display: block;
  --w-accent: ${cssColor(c.accent, "oklch(0.47 0.1 203)")};
  --w-radius: ${Number(c.radius) || 12}px;
  --w-pad: ${c.density === "compact" ? 14 : 20}px;
  --w-gap: ${c.density === "compact" ? 10 : 16}px;
  --w-max: ${Number(c.maxWidth) || 1100}px;
  --w-bg: oklch(0.995 0.003 205);
  --w-card: oklch(0.985 0.004 205);
  --w-ink: oklch(0.25 0.02 225);
  --w-muted: oklch(0.5 0.018 212);
  --w-line: oklch(0.9 0.008 205);
  --w-gold: oklch(0.78 0.13 82);
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  font-size: 15px;
  line-height: 1.55;
  color: var(--w-ink);
  container-type: inline-size;
}
:host(.dark) {
  --w-bg: oklch(0.2 0.013 220);
  --w-card: oklch(0.245 0.015 218);
  --w-ink: oklch(0.93 0.008 200);
  --w-muted: oklch(0.68 0.015 208);
  --w-line: oklch(0.32 0.016 218);
  line-height: 1.62;
}
:host { background: var(--w-bg); }
.plk-wrap { padding: var(--w-pad); max-width: var(--w-max); margin-inline: auto; }
.plk-stars { display: inline-flex; gap: 2px; color: var(--w-gold); flex-shrink: 0; }
.plk-stars svg { width: 15px; height: 15px; display: block; }
.plk-stars svg.dim { opacity: 0.22; }
.plk-avatar {
  width: 36px; height: 36px; border-radius: 999px; flex-shrink: 0;
  background: color-mix(in oklab, var(--w-accent) 16%, var(--w-card));
  color: color-mix(in oklab, var(--w-accent) 70%, var(--w-ink));
  display: inline-flex; align-items: center; justify-content: center;
  font-weight: 600; font-size: 13px; letter-spacing: 0.02em;
}
.plk-badge {
  display: flex; justify-content: center; padding: 10px 0 2px;
}
.plk-badge a {
  font-size: 11px; color: var(--w-muted); text-decoration: none;
  border: 1px solid var(--w-line); border-radius: 999px; padding: 3px 10px;
  transition: border-color 160ms ease, color 160ms ease;
}
.plk-badge a:hover { border-color: var(--w-accent); color: var(--w-accent); }
.plk-empty {
  text-align: center; padding: 40px 20px; color: var(--w-muted);
}
.plk-empty strong { display: block; color: var(--w-ink); font-weight: 600; margin-bottom: 4px; }
${css}
@media (prefers-reduced-motion: reduce) {
  .plk-track { animation: none !important; flex-wrap: wrap !important; }
}
`.trim();
}

function cssColor(v: unknown, fallback: string): string {
  const s = String(v ?? "").trim();
  return /^[\w#.%(),\s-]+$/.test(s) && s.length < 60 ? s : fallback;
}

export function starsHtml(rating: number): string {
  const full = Math.max(0, Math.min(5, Math.round(rating)));
  let out = '<span class="plk-stars" role="img" aria-label="Rated ' + rating + ' out of 5">';
  for (let i = 0; i < 5; i++) {
    out +=
      '<svg class="' + (i < full ? "" : "dim") + '" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 1.7l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.32l-4.94 2.6.94-5.51-4-3.9 5.53-.8z"/></svg>';
  }
  return out + "</span>";
}

export function avatarHtml(t: TestimonialData): string {
  const initial = esc((t.author || "?").trim().charAt(0).toUpperCase());
  if (t.avatar) {
    return (
      '<img class="plk-avatar" src="' + esc(t.avatar) + '" alt="" loading="lazy" style="object-fit:cover">'
    );
  }
  return '<span class="plk-avatar" aria-hidden="true">' + initial + "</span>";
}

export function authorLine(t: TestimonialData): string {
  return (
    '<div class="plk-author"><span class="plk-avatar" aria-hidden="true">' +
    esc((t.author || "?").trim().charAt(0).toUpperCase()) +
    '</span><div class="plk-who"><strong>' + esc(t.author) + "</strong>" +
    (t.role ? '<span class="plk-role">' + esc(t.role) + "</span>" : "") +
    "</div></div>"
  );
}

export function badgeHtml(show: boolean): string {
  if (!show) return "";
  return (
    '<div class="plk-badge"><a href="https://planckui.dev" target="_blank" rel="noopener">Made with PlanckUi — free</a></div>'
  );
}

export function emptyHtml(message: string, hint: string): string {
  return (
    '<div class="plk-empty"><strong>' + esc(message) + "</strong>" + esc(hint) + "</div>"
  );
}

export function ok(r: Omit<RenderResult, never>): RenderResult {
  return r;
}

/* Parse "left | right" textarea lines used by list-style widgets. */
export function parseLines(items?: string): { left: string; right?: string }[] {
  if (!items) return [];
  return items
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [left, ...rest] = line.split("|");
      return { left: left.trim(), right: rest.join("|").trim() || undefined };
    });
}
