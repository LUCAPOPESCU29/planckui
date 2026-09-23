import Link from "next/link";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import {
  DesireItem,
  DesireRight,
  HeroDemo,
  LiveBento,
  ScrubParagraph,
} from "@/components/landing";
import { DEMO_TESTIMONIALS } from "@/lib/widgets/demo-data";
import { LIVE_WIDGETS, WIDGETS, defaultsFor, getWidget } from "@/lib/widgets/registry";

const MARQUEE_NAMES = [...new Set(WIDGETS.filter((w) => w.status === "live").map((w) => w.name))];

export default function LandingPage() {
  const heroCount = WIDGETS.length;
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <SiteNav />

      <main className="flex-1">
        {/* ---------------- Attention ---------------- */}
        <section className="mx-auto max-w-6xl px-6 pt-20 pb-16 text-center md:pt-32 md:pb-24">
          <h1 className="rise mx-auto max-w-6xl text-[clamp(2.6rem,5.5vw,4.5rem)] leading-[1.05] font-semibold">
            Every widget your site needs.
            <br />
            Free, and staying free.
          </h1>
          <p className="rise rise-2 mx-auto mt-6 max-w-2xl text-lg text-ink-2">
            PlanckUi is a catalog of {heroCount}+ embeddable widgets — testimonials, reviews,
            feeds and small tools. Nothing useful is paywalled. No credit card, no limits,
            just paste it.
          </p>
          <div className="rise rise-3 mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/gallery" className="btn btn-primary">
              Browse the catalog
            </Link>
            <Link href="/dashboard" className="btn btn-ghost">
              Start collecting
            </Link>
          </div>

          <div className="rise rise-4 mx-auto mt-14 max-w-4xl">
            <div className="card overflow-hidden">
              <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--line-2)" }} />
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--line-2)" }} />
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--line-2)" }} />
                <span className="ml-3 font-mono text-xs text-ink-3">your-site.com</span>
              </div>
              <HeroDemo />
            </div>
            <p className="mt-4 text-sm text-ink-3">
              This Wall of Love is running live on this page — the real embed code, real data,
              zero tricks. It is free. So is everything else on this page.
            </p>
          </div>
        </section>

        {/* ---------------- Interest: gapless bento of live widgets ---------------- */}
        <section className="mx-auto max-w-6xl px-6 py-24 md:py-40">
          <div className="max-w-2xl">
            <h2 className="text-[clamp(1.8rem,3vw,2.6rem)] font-semibold">
              A catalog, not a teaser.
            </h2>
            <p className="mt-4 text-ink-2">
              Most widget sites show you a screenshot and a paywall. These are running right
              now, on this page, with the same code you will embed.
            </p>
          </div>
          <div className="mt-10">
            <LiveBento />
          </div>
        </section>

        {/* marquee of what is in the catalog */}
        <section aria-label="Widget names" className="mq py-6">
          <div className="mq-track">
            {[0, 1].map((copy) => (
              <div key={copy} className="mq-group" aria-hidden={copy === 1}>
                {MARQUEE_NAMES.map((n) => (
                  <span key={n + copy} className="font-display text-lg text-ink-3 whitespace-nowrap">
                    {n}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- Desire ---------------- */}
        <section className="mx-auto max-w-6xl px-6 py-24 md:py-40">
          <div className="grid gap-12 md:grid-cols-2">
            <div className="self-start md:sticky md:top-24">
              <h2 className="text-[clamp(1.8rem,3vw,2.6rem)] font-semibold">
                Built like a tool.
                <br />
                Not a trap.
              </h2>
              <ScrubParagraph
                className="mt-6 max-w-[62ch] text-lg text-ink-2"
                text="No crippled free plan. No watermark where your content should be. No dashboard that upsells you every time you click. One small badge on the free tier — and the day you ever want it gone, it costs less than the other guys charge for nothing."
              />
              <p className="mt-6 text-sm text-ink-3">
                {LIVE_WIDGETS.length} widgets are live today. The rest of the {WIDGETS.length} are
                in build, in the open.
              </p>
            </div>
            <DesireRight>
              <DesireItem
                name="Testimonial spotlight"
                note="Rotates daily"
                type="testimonial-spotlight"
                config={{ ...defaultsFor(getWidget("testimonial-spotlight")!) }}
                items={DEMO_TESTIMONIALS}
              />
              <DesireItem
                name="Tip calculator"
                note="Runs entirely in your page"
                type="tip-calculator"
                config={{ ...defaultsFor(getWidget("tip-calculator")!) }}
              />
              <DesireItem
                name="Rating summary"
                note="Real math, real stars"
                type="rating-summary"
                config={{ ...defaultsFor(getWidget("rating-summary")!) }}
                items={DEMO_TESTIMONIALS}
              />
            </DesireRight>
          </div>
        </section>

        {/* ---------------- Action: pricing + CTA ---------------- */}
        <section id="pricing" className="mx-auto max-w-6xl px-6 py-24 md:py-40">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-[clamp(1.8rem,3vw,2.6rem)] font-semibold">One plan. Zero.</h2>
            <div className="card mt-8 p-8 text-left">
              <div className="flex items-baseline justify-between">
                <span className="font-display text-lg font-semibold">Free</span>
                <span className="font-display text-4xl font-semibold tracking-tight">$0</span>
              </div>
              <ul className="mt-6 flex flex-col gap-3 text-[15px] text-ink-2">
                {[
                  "Every widget in the catalog",
                  "Unlimited embeds on unlimited sites",
                  "Collections, moderation, CSV import",
                  "Video testimonials with recording",
                  "9 KB script, shadow DOM, no layout shift",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <Check />
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-line pt-4 text-sm text-ink-3">
                Someday there may be a Pro tier — badge removal, custom domains, white-label
                embeds. The free plan is the product, not a trial.
              </p>
            </div>
          </div>

          <div className="mx-auto mt-20 max-w-2xl text-center md:mt-28">
            <h2 className="text-[clamp(1.9rem,3.2vw,2.8rem)] font-semibold">
              Make your site trustworthy in five minutes.
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/dashboard" className="btn btn-primary">
                Open your dashboard
              </Link>
              <Link href="/gallery" className="btn btn-ghost">
                Browse the catalog
              </Link>
            </div>
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
