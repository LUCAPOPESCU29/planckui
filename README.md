# PlanckUi — 395+ free widgets for any website

A free-first widget platform: the Elfsight catalog model with a Testimonial.to-grade
testimonial suite as the flagship. Every widget is free, forever. The only things that will
ever cost money: removing the badge, custom domains, white-label embeds, team seats.

**Status: 395 of 395 catalog entries are live.** — including the 35-widget "Pretty Progress" premium dark collection. The catalog does not fake completeness —
if it says live, it runs real code in the gallery, the editor, and the embed.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
```

Data lives in `.data/db.json` (typed JSON store shaped like the future Prisma repositories);
video uploads in `.data/uploads/`. Sign-in is demo-grade — any email creates a seeded
workspace; swap for Auth.js before exposing publicly.

## The loop

1. Sign in → a demo collection ("Customer love") with realistic testimonials is seeded.
2. Share the collection link (`/c/<slug>`) or embed a form widget — submissions land pending.
3. Approve/reject from the inbox (optimistic, with undo). CSV import lands approved.
4. Create any widget, point it at the collection, paste the snippet:
   `<script async data-widget="ID" src="https://your-host/api/embed/loader.js"></script>`

## Architecture

- **Next.js 16 (App Router) + TypeScript + Tailwind v4**, Postgres-ready data layer.
- **Embeds**: one `< 15 KB` loader script; fetches server-rendered HTML/CSS/JS from
  `/api/widget/<id>/render` and injects into a **Shadow DOM** root (zero style leaks, lazy,
  no layout shift). Form widgets (15 collecting types) embed as same-origin iframes.
- **Renderers are pure functions** `(config, items, extra) => {html, css, js}` shared by the
  embed API and the client — the editor preview can never drift from the real embed.
- Real keyless integrations: YouTube, Spotify, Twitch, Google Maps, GitHub API, iTunes
  lookup, Open-Meteo weather, Frankfurter FX rates, Chess.com (via `/api/fetch` proxy with
  SSRF guards). Platform feeds without keyless embeds render honest link-cards.

## Design law

`DESIGN_BRIEF.md` (via the shape skill) and `.impeccable.md` are binding: Archivo + Golos
Text, OKLCH palette tinted to one petrol hue, 4pt spacing, motion under 300 ms with
ease-out curves, full reduced-motion support, WCAG AA.

## Adding a widget

1. Add its entry to `src/lib/widgets/registry.ts` (id, category, blurb, defaults, controls).
2. Write a pure renderer in `src/lib/widgets/renderers/` and register it in `renderers/index.ts`.
3. It instantly appears in the picker, gallery, SEO page, and editor. Nothing else to wire.
