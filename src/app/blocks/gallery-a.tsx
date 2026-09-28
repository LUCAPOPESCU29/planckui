"use client";

import { useState } from "react";

/* Twelve marketing blocks. Monochrome + petrol, real copy, hairline
   discipline. Hover states: border shift and a one-pixel lift, nothing
   louder. All links are demo anchors. */

function Avatar({ initials, bg, fg = "#fff" }: { initials: string; bg: string; fg?: string }) {
  return (
    <span
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[12px] font-bold"
      style={{ background: bg, color: fg }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

const Check = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 10.5l4 4L16 6" /></svg>
);
const Dash = () => <span className="text-sm" style={{ color: "var(--ink-3)" }}>—</span>;

/* Mktg 01 */
export function MktgFeatureGrid() {
  const feats = [
    { icon: "M13 2 4.5 13.5H11L9 22l8.5-11.5H11L13 2z", t: "Instant embeds", d: "One script tag, any stack. Nine kilobytes, lazy-rendered, zero layout shift." },
    { icon: "M12 3l7 3v5c0 4.4-2.9 7.6-7 9-4.1-1.4-7-4.6-7-9V6l7-3z", t: "Yours, not leased", d: "Self-serve forever. The free tier is the product, not a countdown." },
    { icon: "M4 12h12M12 5l7 7-7 7", t: "Copy-paste sections", d: "Whole page blocks — hero, pricing, FAQ — as standalone HTML." },
    { icon: "M12 4v16M4 12h16", t: "Theme-aware", d: "One accent token recolors every widget for light and dark at once." },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {feats.map((f) => (
        <div key={f.t} className="card group p-6 transition-all duration-200 hover:-translate-y-px hover:border-[var(--accent)]">
          <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[var(--accent-soft)] text-[var(--accent)]">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={f.icon} /></svg>
          </span>
          <h4 className="mt-4 text-[15px] font-semibold text-ink">{f.t}</h4>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-3">{f.d}</p>
        </div>
      ))}
    </div>
  );
}

/* Mktg 02 */
export function MktgLogoWall() {
  const names = ["Fern & Co.", "Lattice Labs", "Harbor Supply", "Atlas Labs", "Bloom & Co", "Fieldnotes"];
  return (
    <div className="text-center">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-3">Trusted by teams at</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {names.map((n) => (
          <span key={n} className="font-display text-lg font-semibold text-ink-3 transition-colors duration-200 hover:text-ink">
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}

/* Mktg 03 */
export function MktgSpotlight() {
  return (
    <div className="card p-8 md:p-10">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> Customer story
      </div>
      <blockquote className="mt-5 text-[clamp(19px,2.4vw,26px)] font-semibold leading-[1.35] tracking-[-0.015em] text-ink">
        “We replaced a $99/month stack with embeds a founder can paste. Our
        trust pages went from embarrassingly empty to the best-converting
        real estate on the site.”
      </blockquote>
      <div className="mt-7 flex flex-wrap items-center gap-4">
        <Avatar initials="LK" bg="linear-gradient(135deg,#22707e,#35a3b5)" />
        <div className="flex-1">
          <div className="text-sm font-semibold text-ink">Lena Kovač</div>
          <div className="text-xs text-ink-3">Founder, Studio Kovač</div>
        </div>
        <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">+212% signups</span>
      </div>
    </div>
  );
}

/* Mktg 04 */
export function MktgStats() {
  const stats = [
    ["398", "widgets in the catalog"],
    ["12,400+", "teams embedding"],
    ["99.98%", "embed uptime"],
    ["$0", "today, tomorrow, forever"],
  ];
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[16px] border border-line bg-line md:grid-cols-4">
      {stats.map(([v, l]) => (
        <div key={l} className="bg-surface p-6 text-center">
          <div className="font-display text-[clamp(24px,3vw,34px)] font-bold tracking-[-0.03em] text-ink">{v}</div>
          <div className="mt-1 text-xs text-ink-3">{l}</div>
        </div>
      ))}
    </div>
  );
}

/* Mktg 05 */
export function MktgSplitCTA() {
  return (
    <div className="card flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:justify-between">
      <div className="max-w-md">
        <h3 className="font-display text-xl font-semibold tracking-[-0.01em] text-ink">Your trust pages are one paste away.</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-3">
          Reviews, ratings and social proof — embedded in minutes, styled like they were
          hand-built.
        </p>
      </div>
      <div className="flex shrink-0 gap-3">
        <Link2 href="/gallery" className="btn btn-primary rounded-full">Browse widgets</Link2>
        <Link2 href="/blocks" className="btn btn-ghost rounded-full">Copy blocks</Link2>
      </div>
    </div>
  );
}
function Link2({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return <a href={href} className={className}>{children}</a>;
}

/* Mktg 06 */
export function MktgNewsletter() {
  return (
    <div className="mx-auto max-w-md text-center">
      <h3 className="font-display text-xl font-semibold tracking-[-0.01em] text-ink">The Sunday dispatch</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-3">
        New widgets, embed recipes and one thing worth reading. Written by a human.
      </p>
      <form className="mt-5 flex gap-2" onSubmit={(e) => e.preventDefault()}>
        <input
          type="email"
          required
          placeholder="you@studio.com"
          aria-label="Email address"
          className="min-w-0 flex-1 rounded-[10px] border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-colors duration-150 placeholder:text-ink-3 focus:border-[var(--accent)]"
        />
        <button type="submit" className="btn btn-primary shrink-0 rounded-[10px]">Subscribe</button>
      </form>
      <p className="mt-3 text-xs text-ink-3">One email a week. No spam, unsubscribe anytime.</p>
    </div>
  );
}

/* Mktg 07 */
export function MktgTeam() {
  const team = [
    { n: "Maya Okafor", r: "Founder & CEO", i: "MO", bg: "#22707e" },
    { n: "Jonas Lindqvist", r: "Design engineering", i: "JL", bg: "#1f9d55" },
    { n: "Priya Raman", r: "Embed platform", i: "PR", bg: "#b45309" },
    { n: "Sofia Marchetti", r: "Community", i: "SM", bg: "#6d5ae0" },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {team.map((m) => (
        <div key={m.n} className="card p-5 text-center transition-all duration-200 hover:-translate-y-px hover:border-[var(--accent)]">
          <Avatar initials={m.i} bg={m.bg} />
          <div className="mt-3 text-sm font-semibold text-ink">{m.n}</div>
          <div className="text-xs text-ink-3">{m.r}</div>
        </div>
      ))}
    </div>
  );
}

/* Mktg 08 */
export function MktgBlog() {
  const posts = [
    { seed: "plk-blog-desk", tag: "Engineering", title: "How our embed script stays under nine kilobytes", meta: "Sep 12 · 6 min read" },
    { seed: "plk-blog-design", tag: "Design", title: "What Apple's Settings app taught us about toggles", meta: "Sep 5 · 4 min read" },
    { seed: "plk-blog-ugc", tag: "Growth", title: "The trust widget that lifted signups 31%", meta: "Aug 28 · 5 min read" },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {posts.map((p) => (
        <a key={p.title} href="#navigations" className="card group overflow-hidden transition-all duration-200 hover:-translate-y-px hover:border-[var(--accent)]">
          <div className="aspect-[16/10] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://picsum.photos/seed/${p.seed}/640/400`} alt="" loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
          </div>
          <div className="p-5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">{p.tag}</span>
            <h4 className="mt-2 text-[14.5px] font-semibold leading-snug text-ink">{p.title}</h4>
            <p className="mt-2 text-xs text-ink-3">{p.meta}</p>
          </div>
        </a>
      ))}
    </div>
  );
}

/* Mktg 09 */
export function MktgPricingCompare() {
  const rows: Array<[string, boolean, boolean]> = [
    ["All 398 widgets", true, true],
    ["Unlimited embeds", true, true],
    ["Badge removal", false, true],
    ["Custom domains", false, true],
    ["Priority support", false, true],
  ];
  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line text-left">
            <th className="px-5 py-3.5 font-medium text-ink-3"> </th>
            <th className="px-5 py-3.5 font-semibold text-ink">Free</th>
            <th className="px-5 py-3.5 font-semibold text-ink">Pro</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([f, free, pro]) => (
            <tr key={f} className="border-b border-line last:border-0">
              <td className="px-5 py-3 text-ink-2">{f}</td>
              <td className="px-5 py-3">{free ? <Check /> : <Dash />}</td>
              <td className="px-5 py-3">{pro ? <Check /> : <Dash />}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* Mktg 10 */
export function MktgChangelog() {
  const log = [
    { v: "v2.6", d: "Sep 18", t: "Interval timer, rest timer and 23 more micro-tools", items: ["New Micro-tools category", "Prefilled examples in every preview"] },
    { v: "v2.5", d: "Sep 11", t: "Dark accents that actually glow", items: ["Theme-aware widget palette", "Faster shadow-DOM hydration"] },
  ];
  return (
    <div className="flex flex-col gap-6">
      {log.map((e) => (
        <div key={e.v} className="flex gap-5">
          <span className="w-12 shrink-0 rounded-full border border-line bg-surface py-1 text-center font-mono text-xs font-semibold text-ink">{e.v}</span>
          <div className="min-w-0 flex-1 border-b border-line pb-6">
            <div className="flex flex-wrap items-baseline gap-x-3">
              <h4 className="text-[15px] font-semibold text-ink">{e.t}</h4>
              <span className="text-xs text-ink-3">{e.d}</span>
            </div>
            <ul className="mt-2 flex flex-col gap-1.5">
              {e.items.map((it) => (
                <li key={it} className="flex items-center gap-2 text-[13.5px] text-ink-2">
                  <span className="h-1 w-1 rounded-full bg-[var(--accent)]" aria-hidden="true" /> {it}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

/* Mktg 11 */
export function MktgAvatarStack() {
  const people = [
    { i: "MO", b: "#22707e" }, { i: "JB", b: "#1f9d55" }, { i: "PR", b: "#b45309" },
    { i: "SM", b: "#6d5ae0" }, { i: "LK", b: "#b45309" },
  ];
  return (
    <div className="text-center">
      <div className="flex justify-center">
        {people.map((p, i) => (
          <span key={p.i + i} className="grid h-10 w-10 place-items-center rounded-full text-[12px] font-bold text-white ring-[3px] ring-[var(--surface)]"
            style={{ background: p.b, marginLeft: i ? -12 : 0 }}>
            {p.i}
          </span>
        ))}
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--surface-2)] text-[11px] font-semibold text-ink-2 ring-[3px] ring-[var(--surface)]" style={{ marginLeft: -12 }}>
          +9k
        </span>
      </div>
      <div className="mt-4 flex items-center justify-center gap-1" aria-label="Rated 4.9 out of 5">
        {[0, 1, 2, 3, 4].map((i) => (
          <svg key={i} width="15" height="15" viewBox="0 0 20 20" fill="#f5c04e" aria-hidden="true"><path d="M10 2l2.4 5 5.6.7-4.1 3.9 1 5.4-4.9-2.7-4.9 2.7 1-5.4L2 7.7l5.6-.7L10 2z" /></svg>
        ))}
      </div>
      <p className="mt-3 text-[15px] font-medium text-ink">Loved by 12,400+ teams</p>
      <p className="mt-1 text-sm text-ink-3">From solo founders to agencies shipping client sites.</p>
    </div>
  );
}

/* Mktg 12 */
export function MktgHowItWorks() {
  const steps = [
    { t: "Pick a widget", d: "Browse 398 live previews. Everything you see is the real embed." },
    { t: "Point it at your data", d: "Connect a collection, paste items or import a CSV. No schema, no setup." },
    { t: "Paste one line", d: "A single script tag, any stack. It renders in a shadow root and never fights your CSS." },
  ];
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {steps.map((s, i) => (
        <div key={s.t} className="relative">
          <span className="font-display text-[40px] font-bold leading-none tracking-[-0.04em] text-[var(--accent)] opacity-25">{i + 1}</span>
          <h4 className="mt-2 text-[15px] font-semibold text-ink">{s.t}</h4>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-3">{s.d}</p>
          {i < 2 && <span aria-hidden="true" className="absolute right-[-14px] top-6 hidden text-ink-3 md:block">→</span>}
        </div>
      ))}
    </div>
  );
}
