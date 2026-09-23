import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PublicCustomizer } from "@/components/PublicCustomizer";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { getWidget, LIVE_WIDGETS } from "@/lib/widgets/registry";
import { CATEGORIES } from "@/lib/widgets/types";
import { widgetCopy } from "@/lib/widget-copy";

/* Widget detail pages — the programmatic SEO core. One page = one
   "free <widget> for website" query, with a live demo (proprietary content),
   full on-page copy, FAQ + SoftwareApplication schema, and copy-HTML export.
   All 290+ pages prerender at build time. */

export function generateStaticParams() {
  return LIVE_WIDGETS.map((w) => ({ id: w.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const def = getWidget(id);
  if (!def) return {};
  const copy = widgetCopy(def);
  return {
    title: `${copy.title} · PlanckUi`,
    description: copy.description,
    alternates: { canonical: `/gallery/${def.id}` },
    openGraph: {
      title: `${copy.title} · PlanckUi`,
      description: copy.description,
      url: `/gallery/${def.id}`,
      siteName: "PlanckUi",
      type: "website",
    },
    twitter: { card: "summary_large_image", title: copy.title, description: copy.description },
  };
}

export default async function WidgetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const def = getWidget(id);
  if (!def) notFound();
  const copy = widgetCopy(def);
  const cat = CATEGORIES.find((c) => c.id === def.category);
  const related = LIVE_WIDGETS.filter((w) => w.category === def.category && w.id !== def.id && w.status === "live").slice(0, 3);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: copy.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: def.name,
    applicationCategory: "WebApplication",
    operatingSystem: "Any",
    description: copy.description,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12 md:py-16">
        <nav aria-label="Breadcrumb" className="text-sm text-ink-3">
          <Link href="/gallery" className="transition-colors hover:text-ink">
            ← Catalog
          </Link>
          <span className="mx-2">/</span>
          <span>{cat?.name}</span>
        </nav>

        <div className="mt-4 max-w-2xl">
          <h1 className="text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold leading-[1.08]">{copy.h1}</h1>
          <p className="mt-3 text-lg text-ink-2">{def.blurb}</p>
          <p className="mt-2 text-sm text-ink-3">{cat?.name}</p>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <a href="#customize" className="btn btn-primary">
            Use it now — free
          </a>
          <Link href="/vs/elfsight" className="text-sm text-ink-3 underline underline-offset-2 hover:text-ink">
            Why free? See how this compares to Elfsight →
          </Link>
        </div>

        <div className="card mt-8 overflow-hidden p-4" id="customize">
          <PublicCustomizer defId={def.id} />
        </div>

        {/* ---- what it is ---- */}
        <section aria-labelledby="what-h" className="mt-14 max-w-3xl">
          <h2 id="what-h" className="font-display text-xl font-semibold">
            What is {def.name}?
          </h2>
          <div className="mt-4 flex flex-col gap-3 text-[15px] leading-relaxed text-ink-2">
            {copy.whatIs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        {/* ---- features ---- */}
        <section aria-labelledby="feat-h" className="mt-12 max-w-3xl">
          <h2 id="feat-h" className="font-display text-xl font-semibold">
            Everything included
          </h2>
          <ul className="mt-4 grid gap-2.5 text-[15px] text-ink-2">
            {copy.features.map((f) => (
              <li key={f} className="flex gap-2.5">
                <span aria-hidden="true" className="mt-0.5 text-accent">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </section>

        {/* ---- 3 steps ---- */}
        <section aria-labelledby="how-h" className="mt-12 max-w-3xl">
          <h2 id="how-h" className="font-display text-xl font-semibold">
            Add {def.name} to your website in 3 steps
          </h2>
          <ol className="mt-4 flex flex-col gap-4 text-[15px] text-ink-2">
            {copy.steps.map((s, i) => (
              <li key={s.title} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                  style={{ background: "var(--accent-soft)", color: "var(--accent-strong)" }}
                >
                  {i + 1}
                </span>
                <span>
                  <strong className="font-medium text-ink">{s.title}.</strong> {s.body}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-4 rounded-[var(--radius-md)] border border-line bg-surface p-4 text-sm text-ink-2">
            {copy.compareLine} No watermark, no usage limits, no credit card.
          </p>
        </section>

        {/* ---- FAQ + schema ---- */}
        <section aria-labelledby="faq-h" className="mt-12 max-w-3xl">
          <h2 id="faq-h" className="font-display text-xl font-semibold">
            Frequently asked questions
          </h2>
          <dl className="mt-4 flex flex-col divide-y divide-line">
            {copy.faqs.map((f) => (
              <div key={f.q} className="py-4">
                <dt className="font-medium">{f.q}</dt>
                <dd className="mt-1.5 text-[15px] leading-relaxed text-ink-2">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ---- related (internal links) ---- */}
        {related.length > 0 && (
          <section aria-labelledby="rel-h" className="mt-12 max-w-3xl">
            <h2 id="rel-h" className="font-display text-xl font-semibold">
              More free widgets like this
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {related.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/gallery/${r.id}`}
                    className="inline-block rounded-full border border-line px-4 py-2 text-sm text-ink-2 transition-colors hover:border-accent hover:text-accent"
                  >
                    {r.name} — free
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-ink-3">
              Browse the <Link href="/gallery" className="text-accent hover:text-accent-strong">full catalog of 290+ free widgets</Link>.
            </p>
          </section>
        )}
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
    </div>
  );
}
