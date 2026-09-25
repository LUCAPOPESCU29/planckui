import type { WidgetDef } from "./widgets/types";

/* Programmatic copy engine for widget detail pages. Every page gets real,
   widget-specific copy composed from its registry data + category angle —
   no lorem ipsum, no thin doorway content. Each page targets one
   "free <widget> for website" query and answers it completely. */

const CATEGORY_ANGLE: Record<string, { angle: string; useCase: string }> = {
  proof: {
    angle: "Social proof is the highest-leverage upgrade a website can get: visitors who see real customer quotes convert measurably better than visitors who don't.",
    useCase: "Drop it on a landing page, pricing page or homepage — anywhere a visitor decides whether to trust you.",
  },
  collect: {
    angle: "Collecting testimonials, feedback and requests is how a business learns what to build — and gets the raw material for its own social proof.",
    useCase: "Share the link after a purchase, in an email signature, or embed the form right on your site.",
  },
  social: {
    angle: "A website that shows fresh social activity feels alive and current — one that doesn't feel abandoned.",
    useCase: "Perfect for a homepage sidebar, an about page, or a footer that always has something new.",
  },
  promo: {
    angle: "Announcements, offers and calls-to-action only work if people actually see them — placed and styled well, they pay for themselves in a day.",
    useCase: "Use for launches, discount windows, shipping notices and anything visitors must not miss.",
  },
  media: {
    angle: "Rich media — video, audio, feeds — is what separates a modern site from a brochure.",
    useCase: "Add it to content pages, product pages or a creator landing page.",
  },
  commerce: {
    angle: "Buyers look for trust signals and friction-free paths right up to the checkout — commerce widgets close that gap.",
    useCase: "Great on product pages, order-status pages and post-purchase emails.",
  },
  info: {
    angle: "Local businesses live or die on the basics: hours, directions, contact — visible in seconds.",
    useCase: "Ideal for a contact page, sidebar or a one-page business site.",
  },
  profiles: {
    angle: "People follow people. Showing the human behind the work builds more trust than any copy can.",
    useCase: "Use on personal sites, portfolios, link-in-bio pages and team pages.",
  },
  tools: {
    angle: "Small interactive utilities give visitors a reason to stay, return and bookmark you.",
    useCase: "Perfect for sidebars, tool pages and resource collections.",
  },
  layout: {
    angle: "Structure is invisible when done right — and glaring when done wrong.",
    useCase: "Use it to organize pages that grew past a simple list of sections.",
  },
  community: {
    angle: "Community content is proof of life: real people, real messages, real activity.",
    useCase: "Great for servers, communities and products with an active user base.",
  },
  utility: {
    angle: "Badges, notices and small utilities quietly answer questions so visitors don't have to ask.",
    useCase: "Use anywhere a small element can remove a doubt or add credibility.",
  },
  pretty: {
    angle: "Designed progress pieces that make a page feel crafted rather than assembled.",
    useCase: "Drop into any page that deserves a touch of polish — counters, trackers, countdowns.",
  },
  aurora: {
    angle: "Analytics-grade cards with modern gradients, built to look like a product screenshot that ships.",
    useCase: "Ideal for dashboards, landing pages and public metrics.",
  },
  special: {
    angle: "The patterns visitors instantly recognize from the best sites on the internet — rebuilt free.",
    useCase: "Use them as sections: heroes, pricing, stats, feature grids.",
  },
  platforms: {
    angle: "Real platforms, real brand marks — cards that look like the actual product UI people know and trust.",
    useCase: "Use to show integrations, social presence or familiar sign-in flows.",
  },
  weather: {
    angle: "Weather widgets in the cleanest design language there is — glanceable and beautiful.",
    useCase: "Perfect for sidebars, dashboards and personal homepages.",
  },
  apple: {
    angle: "The iOS design language — the most imitated interface on earth — rebuilt as embeddable website widgets with its exact tokens: SF type, system colors, continuous corners.",
    useCase: "Perfect for product pages, waitlists, portfolios and anything that wants Apple-grade polish.",
  },
  mac: {
    angle: "macOS design language, running on your website — docks, menus and desktop widgets.",
    useCase: "Great for portfolio pages, launch pages and anything that wants to feel like a Mac.",
  },
};

export interface WidgetCopy {
  h1: string;
  title: string;
  description: string;
  whatIs: string[];
  features: string[];
  steps: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
  compareLine: string;
  angle: string;
  useCase: string;
}

export function widgetCopy(def: WidgetDef): WidgetCopy {
  const name = def.name;
  const angle = CATEGORY_ANGLE[def.category]?.angle ?? CATEGORY_ANGLE.utility.angle;
  const useCase = CATEGORY_ANGLE[def.category]?.useCase ?? CATEGORY_ANGLE.utility.useCase;

  const whatIs = [
    `${name} is one of 290+ free widgets on PlanckUi. ${def.blurb} ${angle}`,
    useCase,
    `Everything is rendered in an isolated shadow DOM, so it can never conflict with your site's own styles — and at a few kilobytes, it won't move your page speed.`,
  ];

  const features = [
    def.blurb,
    "Free forever — no watermark, no usage limits, no \"upgrade to remove\"",
    "Customize everything: colors, fonts, corner radius, shadows, dark mode",
    "Copy-paste install: one snippet of HTML works on any website builder",
  ];

  const steps = [
    { title: "Customize it", body: `Use the Paint editor right on this page — set your colors, fonts, radius and content. ${name} updates live as you change things.` },
    { title: "Copy the HTML", body: "One click gives you a self-contained snippet. No account needed, nothing to install, no script from our servers." },
    { title: "Paste it on your site", body: "Paste it anywhere HTML goes: your site, a landing page, WordPress, Webflow, Wix, Squarespace, Shopify, Ghost — if it renders HTML, it works." },
  ];

  const faqs = [
    {
      q: `Is ${name} really free?`,
      a: `Yes — completely. PlanckUi widgets are free forever, with no watermark, no usage limits and no credit card. Paid widget platforms charge $15–40 per month for the same embeds.`,
    },
    {
      q: `Do I need an account to use ${name}?`,
      a: `No. Click "Copy HTML" and paste it on your site — that's the whole flow. An account is only needed if you want to collect live data (like customer testimonials) and manage it from a workspace.`,
    },
    {
      q: `Does it work on Wix, Squarespace, Webflow, WordPress or Shopify?`,
      a: `Yes. If a platform lets you paste an HTML embed block — and all of them do — ${name} works there. The snippet is plain HTML and CSS in an isolated shadow root, so it can't fight with your theme.`,
    },
    {
      q: `Will ${name} slow down my website?`,
      a: `No. The widget is a few kilobytes of HTML and CSS rendered locally in your browser — no external requests, no tracking scripts, no layout shift.`,
    },
  ];

  const compareLine = `${name} is free on PlanckUi — the same embed runs $15–40/month on Elfsight or Common Ninja.`;

  return {
    h1: `${name} — free for any website`,
    title: `${name} — Free for Websites (No Signup)`,
    description: `Add ${name.toLowerCase()} to your website for free. ${def.blurb} Copy-paste install, no signup, no watermark, works everywhere.`,
    whatIs,
    features,
    steps,
    faqs,
    compareLine,
    angle,
    useCase,
  };
}
