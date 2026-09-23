import Link from "next/link";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { ShowcaseSite } from "@/components/showcase";
import { WIDGETS } from "@/lib/widgets/registry";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <SiteNav />

      <main className="flex-1">
        <ShowcaseSite />

        {/* ---------------- The point: everything above is the product ---------------- */}
        <section className="mx-auto max-w-6xl px-6 py-24 text-center md:py-36">
          <h2 className="mx-auto max-w-3xl text-[clamp(1.9rem,3.6vw,3rem)] font-semibold leading-[1.08] tracking-[-0.02em]">
            You just saw a whole website.
            <br />
            Every piece of it is free.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-2">
            The countdown, the reviews wall, the letter signup, the stats, the FAQ — all
            PlanckUi widgets, all running live on this page. Grab any of them from the
            catalog, or copy whole sections as HTML from the blocks page. No account, no
            email, no credit card.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href="/gallery" className="btn btn-primary rounded-full px-6">
              Browse all {WIDGETS.length} widgets
            </Link>
            <Link href="/blocks" className="btn btn-ghost rounded-full px-6">
              Copy the blocks
            </Link>
          </div>

          {/* single-plan pricing, kept honest and short */}
          <div id="pricing" className="card mx-auto mt-16 max-w-md scroll-mt-24 p-8 text-left">
            <div className="flex items-baseline justify-between">
              <span className="font-display text-lg font-semibold">Free</span>
              <span className="font-display text-4xl font-semibold tracking-tight">$0</span>
            </div>
            <ul className="mt-6 flex flex-col gap-3 text-[15px] text-ink-2">
              {[
                "Every widget in the catalog",
                "Unlimited embeds on unlimited sites",
                "Collections, moderation, CSV import",
                "9 KB script, shadow DOM, no layout shift",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <Check />
                  {f}
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-line pt-4 text-sm text-ink-3">
              No trial clock, no watermark where your content should be. The free plan is
              the product.
            </p>
          </div>

          <div className="mx-auto mt-20 max-w-2xl md:mt-24">
            <h3 className="text-[clamp(1.7rem,3vw,2.4rem)] font-semibold tracking-[-0.015em]">
              Your site could look like this by Friday.
            </h3>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link href="/dashboard" className="btn btn-primary rounded-full px-6">
                Open your workspace
              </Link>
              <Link href="/animations" className="btn btn-ghost rounded-full px-6">
                See the animations
              </Link>
            </div>
            <p className="mt-4 text-sm text-ink-3">
              No email needed — a guest workspace is waiting.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="shrink-0">
      <circle cx="10" cy="10" r="9" className="fill-accent-soft" />
      <path d="M6 10.2l2.6 2.6L14 7.4" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
