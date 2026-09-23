# Design System: PlanckUi Blocks

**Source of truth:** this document describes the blocks shipped at `/blocks` in
`src/app/blocks/page.tsx` and the tokens they share with the platform in
`src/app/globals.css`. Values are exact; roles are binding.

## 1. Visual Theme & Atmosphere

Quiet, precise, dependable — a machined instrument, not a growth dashboard. The
blocks add a little Apple on top: glass stays on the floating functional layer
(nav, sign-in card), titles set large and tight like an iOS Large Title, and
controls borrow the segmented control with a spring thumb. Cinematic-but-calm:
each section carries at most one orchestrated motion moment.

## 2. Color Palette & Roles

All values in OKLCH, every neutral tinted toward one deep petrol hue (~205).
Light first, flawless dark. No pure black, no pure white, no gradient on text.

| Name | Light | Dark | Role |
| --- | --- | --- | --- |
| Mist Page | `oklch(0.985 0.004 205)` | `oklch(0.175 0.012 222)` | page background |
| Porcelain Surface | `oklch(0.997 0.003 205)` | `oklch(0.215 0.014 220)` | cards, canvases |
| Fog Recess | `oklch(0.96 0.006 205)` | `oklch(0.25 0.016 218)` | seg track, chips, wells |
| Ink | `oklch(0.25 0.02 225)` | `oklch(0.93 0.008 200)` | headings, primary buttons |
| Slate Ink | `oklch(0.42 0.02 218)` | `oklch(0.75 0.012 205)` | body copy |
| Stone Ink | `oklch(0.55 0.018 212)` | `oklch(0.62 0.015 208)` | captions, meta |
| Petrol Accent | `oklch(0.47 0.1 203)` | `oklch(0.78 0.085 197)` | the one accent — links, focus, highlights |
| Accent Wash | `oklch(0.955 0.02 203)` | `oklch(0.28 0.03 205)` | icon plates, focus glow |
| Hairline | `oklch(0.9 0.008 205)` | `oklch(0.3 0.016 218)` | borders, dividers |

Glass recipe (functional layer only): `color-mix(in oklab, var(--surface) 62%, transparent)`
with `backdrop-filter: blur(18px) saturate(1.7)`.

## 3. Typography Rules

- **Display — Archivo** (500/600/700): headings, prices, stat numerals.
  Letter-spacing −0.015em globally, −0.025em on large titles; line-height 1.05–1.1;
  `text-wrap: balance`.
- **Body — Golos Text** (400/500/600): 17 px marketing body, 15 px card body,
  13 px captions. Dark surfaces gain leading (1.62) because light type reads lighter.
- **Utility — Geist Mono**: block index tags, code chips, eyebrow labels.

## 4. Component Stylings

- **Buttons:** fully rounded (999 px) in blocks; padding 11×18 px; press is
  `scale(0.97)` over 160 ms ease-out. Primary = Ink fill, accent = Petrol fill,
  ghost = hairline border. Hover darkens, never lifts.
- **Cards/Containers:** 20 px outer canvases, 14 px cards, hairline border +
  layered whisper shadows (`0 16px 40px` at 12% ink). Bento cells carry a
  pointer spotlight — a translated radial light, opacity only.
- **Segmented control:** 999 px track in Fog Recess, thumb = Porcelain Surface
  with hairline ring, travels on a mild spring `cubic-bezier(0.34, 1.4, 0.64, 1)`
  over 280 ms.
- **Inputs:** hairline stroke on Porcelain, 10 px radius, focus = Petrol border
  plus a 3 px Accent Wash ring.

## 5. Layout Principles

One full-width canvas per block, max 1152 px, generous 56/80 px section rhythm.
Hierarchy from three dimensions at once (size, weight, space). The hero owns the
page's single focal point; every other block stays quiet. Squint-test clean in
both appearances.

## 6. Motion Law

- Reveals: rise 16 px + fade over 500 ms ease-out `cubic-bezier(0.23, 1, 0.32, 1)`,
  stagger 45 ms, fire once via IntersectionObserver.
- Interactions: under 300 ms, ease-out; active press `scale(0.97)`.
- Springs only where overshoot reads physical (segmented thumb).
- Ambient loops (marquee, hero float) pause on hover and vanish under
  `prefers-reduced-motion`, which settles every animation instantly.
- Transform and opacity only. Never animate layout.
