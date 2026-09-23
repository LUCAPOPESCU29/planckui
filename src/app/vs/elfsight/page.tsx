import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "PlanckUi vs Elfsight — Free vs $15–40/month (2026)",
  description:
    "Elfsight charges $15–40/month for website widgets. PlanckUi gives you 290+ copy-paste widgets — testimonials, forms, docks — free forever, no signup, no watermark. Full comparison.",
  alternates: { canonical: "/vs/elfsight" },
  openGraph: {
    title: "PlanckUi vs Elfsight — Free vs $15–40/month",
    description: "290+ copy-paste widgets, free forever, no signup. Full 2026 comparison against Elfsight's pricing and limits.",
    url: "/vs/elfsight",
    siteName: "PlanckUi",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PlanckUi vs Elfsight — Free vs $15–40/month",
    description: "290+ copy-paste widgets, free forever, no signup.",
  },
};

/* The comparison wedge: catches "elfsight free alternative" searches from
   users frustrated with per-view pricing on basic embeds. */

const ROWS: [string, string, string][] = [
  ["Price", "$0 — every widget, forever", "$15–40+/month for most usable widgets"],
  ["Signup required", "No — copy the HTML and go", "Yes — account + widget builder"],
  ["Watermark", "Never", "Removed on paid plans"],
  ["Widget catalog", "290+ (testimonials, forms, docks, social, commerce)", "200+ (largest paid catalog)"],
  ["Customization", "Full editor: colors, fonts, radius, shadows, dark mode", "Per-widget editors, deeper on higher tiers"],
  ["Pageviews limit", "Unlimited", "Capped per plan, overage = upgrade"],
  ["How it embeds", "Self-contained HTML snippet or script tag", "Script tag, per-widget"],
  ["Native Mac app", "Yes — SwiftUI dock for your desktop", "No"],
];

export default function VsElfsightPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is PlanckUi really a free Elfsight alternative?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. PlanckUi's widgets are free forever — no watermark, no pageview caps, no account required to copy one. Elfsight's usable widgets start at roughly $15–40 per month depending on plan and traffic.",
        },
      },
      {
        "@type": "Question",
        name: "What can I use instead of Elfsight for testimonials?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PlanckUi offers free testimonial widgets — walls of love, carousels, marquees and rating summaries — that you customize in a live editor and paste on your site as plain HTML. No monthly fee.",
        },
      },
      {
        "@type": "Question",
        name: "Does PlanckUi work on the same platforms as Elfsight?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The embed snippet is plain HTML, so it works anywhere Elfsight does: WordPress, Wix, Squarespace, Webflow, Shopify, Ghost and custom sites.",
        },
      },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12 md:py-16">
        <p className="text-sm font-medium uppercase tracking-wide text-accent">Comparison · 2026</p>
        <h1 className="mt-3 text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.05]">
          PlanckUi vs Elfsight: free vs $15–40/month
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-2">
          Elfsight is a solid product — and a solid monthly bill. If you just need a testimonial wall,
          a form or a review widget on your website, here is the honest side-by-side.
        </p>

        <div className="card mt-8 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-surface-2 text-xs uppercase tracking-wide text-ink-3">
                  <th className="px-5 py-3 font-medium">What matters</th>
                  <th className="px-5 py-3 font-semibold text-ink">PlanckUi</th>
                  <th className="px-5 py-3 font-medium">Elfsight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {ROWS.map(([what, us, them]) => (
                  <tr key={what}>
                    <td className="px-5 py-3.5 font-medium">{what}</td>
                    <td className="px-5 py-3.5 text-ink">{us}</td>
                    <td className="px-5 py-3.5 text-ink-3">{them}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-10 max-w-3xl text-[15px] leading-relaxed text-ink-2">
          <h2 className="font-display text-xl font-semibold text-ink">Where Elfsight wins</h2>
          <p className="mt-3">
            Elfsight has more integrations, deeper per-widget settings, and a mature dashboard. If you need
            a specific niche integration and already pay for it, there is no reason to leave.
          </p>
          <h2 className="mt-8 font-display text-xl font-semibold text-ink">Where PlanckUi wins</h2>
          <p className="mt-3">
            Price is the obvious one — but the deeper difference is the flow. Elfsight&rsquo;s widgets live in
            their cloud behind an account and a per-view plan. PlanckUi widgets are self-contained HTML you
            copy and own: paste once, works forever, renders on your visitor&rsquo;s browser with no calls to
            our servers. No pageview meter, no surprise upgrade prompt when your traffic grows.
          </p>
          <p className="mt-3">
            You also get a full library beyond testimonials — forms, social cards, platform-branded embeds
            with real logos, macOS-style docks, and 290+ more — all under the same $0.
          </p>
          <h2 className="mt-8 font-display text-xl font-semibold text-ink">Try it in 60 seconds</h2>
          <p className="mt-3">
            Open the{" "}
            <Link href="/gallery?category=proof" className="text-accent underline underline-offset-2 hover:text-accent-strong">
              testimonial widgets
            </Link>
            , paint one to match your site, copy the HTML, paste it where Elfsight&rsquo;s widget would go.
            If you don&rsquo;t like it, you&rsquo;ve lost a minute — not a monthly subscription.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/gallery" className="btn btn-primary">
            Browse 290+ free widgets
          </Link>
          <Link href="/gallery/wall-of-love" className="btn btn-ghost">
            Start with a Wall of Love
          </Link>
        </div>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </div>
  );
}
