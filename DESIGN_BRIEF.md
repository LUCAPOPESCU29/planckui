# PlanckUi — Design Brief

Produced via the `shape` skill. Discovery was pre-answered in the build brief (no interview);
this document is the confirmed blueprint. Every implementation decision must trace back here.

## 1. Feature Summary

PlanckUi is a free-first widget platform: a catalog of 160+ embeddable widgets for any
website, with a Testimonial.to-grade testimonial suite as the flagship. It serves solo
founders, small e-commerce brands, creators, and agencies who need their sites to look
trustworthy in minutes without paying $6–99/month. Success = a non-technical user goes from
"pick a widget" to "pasted snippet" in under five minutes, and the collect → moderate →
display loop works end-to-end.

## 2. Primary User Action

Paste an embed snippet (or share a collection link). Everything in the product exists to get
the user from "I need social proof" to "it's live on my site" with the fewest decisions and
zero dead ends. The editor's only job is to make that path short and reversible.

## 3. Design Direction

Brand personality: **quiet, precise, dependable** — a well-made tool, not a growth-hacking
dashboard. Light-first (SMB daytime context) with a flawless dark mode everywhere, including
inside embeds. The marketing surface (landing, gallery, per-widget SEO pages) is
cinematic-but-calm AIDA per gpt-taste, restrained by impeccable's bans and emil's motion
rules. The app surface is quiet: fixed rem type scale, generous whitespace, one accent used
rarely. Fonts follow impeccable's selection procedure: brand words "quiet and precise and
dependable" → physical object: machined instrument signage / a technical standards document.
Reflex fonts rejected (Inter, Geist, Space Grotesk, DM Sans, Outfit…). Selected:
**Archivo** (display — sturdy, engineered grotesque) + **Golos Text** (body — calm, even,
highly legible) + Geist Mono for code. Color: OKLCH, all neutrals tinted toward one deep
petrol hue (~200), 60-30-10, no pure black/white, no gradients on text.

## 4. Layout Strategy

- **Landing:** 2-line hero in an ultra-wide container; a live working widget directly below
  the hero (the product is its own proof); gapless dense bento of widget categories;
  single-plan pricing ("free"); huge section rhythm (py-32 / md:py-48).
- **App:** left-rail dashboard; content column max ~1100px; editor is a split view —
  controls (fixed 320px) left, live preview right inside a browser-chrome frame. Gallery is
  a filterable, searchable grid of live widget thumbnails.
- **Collection form / public pages:** single centered column, max 65ch, multi-step
  one-question-at-a-time, zero chrome.
- Hierarchy via 2–3 dimensions at once (size, weight, space), squint-test clean.

## 5. Key States

- Dashboard (first run): seeded demo collection + wall widget so nothing is empty, with a
  visible "this is demo data, replace it" affordance; truly-empty states still exist and
  teach (e.g., deleted demo → "Create your first collection").
- Inbox: pending / approved / rejected filters; empty approved state points to the share
  link, not a dead end.
- Collection form: idle → question steps → recording (timer + rerecord) → success (calm
  confirmation, invite to share the page).
- Widget preview: awaiting-first-testimonial state inside the rendered widget (config
  guidance, not a blank box); skeleton on editor load; error state with retry.
- 404 and auth-required states get the same care as primary screens.

## 6. Interaction Model

- Click-to-copy everywhere snippets appear, with quiet confirmation (never a browser alert).
- Inbox approve/reject is optimistic; undo via toast within a few seconds.
- Editor controls apply instantly: renderer is a pure `(config, data) => {html, css}` module
  shared by the embed API and the client preview, so preview updates synchronously.
- Motion per emil-design-eng: UI < 300ms, ease-out custom curves, scale(0.97) press states,
  no keyboard-action animation, stagger 30–80ms, transform/opacity only, full
  prefers-reduced-motion support (marquees become static wraps).

## 7. Content Requirements

- Tone: calm, plain, zero hype. "No credit card. No limits. Just paste it."
- Every empty state names the next action in plain words.
- Error messages say what happened and what to do ("That link expired. Ask for a new one.").
- Demo data must read like real customers (names, roles, specific complaints/praise), never
  lorem ipsum.

## 8. Recommended References

spatial-design.md and typography.md (mandatory, consulted). interaction-design.md and
ux-writing.md for the form-heavy collection flow; motion-design.md for the marketing page;
responsive-design.md for the editor's split view on narrow screens.

## 9. Open Questions (resolved as build-time decisions)

- Video storage: v0 stores recordings on local disk (30 MB cap), served via /api/media;
  swap to object storage later.
- Auth: v0 uses a demo-grade email session; swap to Auth.js before public launch.
- Google/TikTok/social feed widgets require platform API keys — cataloged as "planned"
  until keys exist; the registry ships with all 160 entries and live status.
