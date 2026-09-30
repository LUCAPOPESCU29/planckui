import { LANDING_TEMPLATES } from "./landing-templates";
import { LIVE_WIDGETS } from "./widgets/registry";
import { POSTS } from "./blog";

/* Site-wide search index: every thing a visitor can open, as one flat list.
   Pure data — no framework imports — so both server and client components
   can build from it. */

export type SearchEntry = {
  kind: "Widget" | "Block" | "Landing page" | "Navigation menu" | "Blog";
  title: string;
  sub: string;
  href: string;
};

/* The 55 blocks, shared with the blocks page quick-nav. */
export const BLOCKS_INDEX: Array<{ id: string; tag: string; label: string }> = [
  { id: "nav-block", tag: "Nav 01", label: "Frosted pill nav" },
  { id: "hero-block", tag: "Hero 01", label: "Large title + product card" },
  { id: "logos-block", tag: "Logos 01", label: "Quiet wordmark marquee" },
  { id: "bento-block", tag: "Features 01", label: "Bento with spotlight" },
  { id: "stats-block", tag: "Stats 01", label: "Count-up band" },
  { id: "pricing-block", tag: "Pricing 01", label: "Segmented billing toggle" },
  { id: "testimonials-block", tag: "Testimonials 01", label: "Masonry wall" },
  { id: "faq-block", tag: "FAQ 01", label: "Row accordion" },
  { id: "cta-block", tag: "CTA 01", label: "Dark glow panel" },
  { id: "login-block", tag: "Login 01", label: "Frosted sign-in card" },
  { id: "dark-launch-block", tag: "Dark 01", label: "Launch hero" },
  { id: "dark-settings-block", tag: "Dark 02", label: "System settings window" },
  { id: "dark-playing-block", tag: "Dark 03", label: "Now playing card" },
  { id: "dark-island-block", tag: "Dark 04", label: "Dynamic island" },
  { id: "dark-pay-block", tag: "Dark 05", label: "One-tap checkout" },
  { id: "light-rings-block", tag: "Light 01", label: "Activity rings card" },
  { id: "light-widgets-block", tag: "Light 02", label: "Home screen widgets" },
  { id: "light-spotlight-block", tag: "Light 03", label: "Spotlight search" },
  { id: "light-settings-block", tag: "Light 04", label: "iOS settings list" },
  { id: "light-cc-block", tag: "Light 05", label: "Control center" },
  { id: "app-dash-block", tag: "App 01", label: "Dashboard header" },
  { id: "app-notifications-block", tag: "App 02", label: "Notification center" },
  { id: "app-palette-block", tag: "App 03", label: "Command palette" },
  { id: "app-kanban-block", tag: "App 04", label: "Kanban column" },
  { id: "app-activity-block", tag: "App 05", label: "Activity feed" },
  { id: "app-invoice-block", tag: "App 06", label: "Invoice table" },
  { id: "app-empty-block", tag: "App 07", label: "Empty state" },
  { id: "app-onboarding-block", tag: "App 08", label: "Onboarding steps" },
  { id: "app-upload-block", tag: "App 09", label: "Upload card" },
  { id: "app-calendar-block", tag: "App 10", label: "Mini calendar" },
  { id: "app-filters-block", tag: "App 11", label: "Filter chips" },
  { id: "app-upgrade-block", tag: "App 12", label: "Upgrade card" },
  { id: "mktg-features-block", tag: "Mktg 01", label: "Feature grid" },
  { id: "mktg-logos-block", tag: "Mktg 02", label: "Logo wall" },
  { id: "mktg-spotlight-block", tag: "Mktg 03", label: "Testimonial spotlight" },
  { id: "mktg-stats-block", tag: "Mktg 04", label: "Stats band" },
  { id: "mktg-split-block", tag: "Mktg 05", label: "Split CTA" },
  { id: "mktg-newsletter-block", tag: "Mktg 06", label: "Newsletter capture" },
  { id: "mktg-team-block", tag: "Mktg 07", label: "Team grid" },
  { id: "mktg-blog-block", tag: "Mktg 08", label: "Blog cards" },
  { id: "mktg-compare-block", tag: "Mktg 09", label: "Pricing compare" },
  { id: "mktg-changelog-block", tag: "Mktg 10", label: "Changelog list" },
  { id: "mktg-avatars-block", tag: "Mktg 11", label: "Avatar stack" },
  { id: "mktg-how-block", tag: "Mktg 12", label: "How it works" },
  { id: "night-hero-block", tag: "Night 01", label: "Launch hero" },
  { id: "night-tiles-block", tag: "Night 02", label: "Feature tiles" },
  { id: "night-metrics-block", tag: "Night 03", label: "Metrics band" },
  { id: "night-quotes-block", tag: "Night 04", label: "Paired quotes" },
  { id: "night-code-block", tag: "Night 05", label: "Code card" },
  { id: "night-terminal-block", tag: "Night 06", label: "Terminal" },
  { id: "night-pricing-block", tag: "Night 07", label: "Pricing card" },
  { id: "night-profile-block", tag: "Night 08", label: "Profile card" },
  { id: "night-podcast-block", tag: "Night 09", label: "Podcast episode" },
  { id: "night-cta-block", tag: "Night 10", label: "Gradient CTA" },
  { id: "night-faq-block", tag: "Night 11", label: "FAQ two columns" },
];

/* The 25 navigation menus on /navigations. */
export const NAV_MENUS: Array<{ id: string; label: string }> = [
  ...["Mega menu", "Inline popovers", "Category mega grid", "Sliding underline", "Vertical sidebar",
      "Breadcrumb trail", "Mobile slide-down", "Search-first nav", "Tabs with counts", "Floating dock"]
    .map((label, i) => ({ id: `plank-${i + 1}`, label: `PlanckUi CSS · ${label}` })),
  ...["Global nav", "Menu bar", "The Dock", "Liquid pill nav", "Liquid tab bar", "Liquid sidebar",
      "Liquid mega menu", "Capsule actions", "Store tabs", "Segmented control", "Settings list",
      "Dark developer nav", "Pay nav", "Colored tabs", "App grid"]
    .map((label, i) => ({ id: `apple-${i + 1}`, label: `Apple UI · ${label}` })),
];

export const SEARCH_INDEX: SearchEntry[] = [
  ...LIVE_WIDGETS.map((w) => ({
    kind: "Widget" as const, title: w.name, sub: w.blurb, href: `/gallery/${w.id}`,
  })),
  ...BLOCKS_INDEX.map((b) => ({
    kind: "Block" as const, title: `${b.tag} — ${b.label}`, sub: "Copy-paste section", href: `/blocks#${b.id}`,
  })),
  ...LANDING_TEMPLATES.map((t) => ({
    kind: "Landing page" as const, title: t.brand, sub: `${t.category} · ${t.headline}`, href: `/lp/${t.slug}`,
  })),
  ...NAV_MENUS.map((n) => ({
    kind: "Navigation menu" as const, title: n.label, sub: "Live menu on /navigations", href: "/navigations",
  })),
  ...POSTS.map((p) => ({
    kind: "Blog" as const, title: p.title, sub: `${p.tag} · ${p.readTime}`, href: `/blog/${p.slug}`,
  })),
];

export function searchSite(query: string, limit = 12): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return SEARCH_INDEX.filter((e) => {
    const hay = `${e.title} ${e.sub} ${e.kind}`.toLowerCase();
    return terms.every((t) => hay.includes(t));
  }).slice(0, limit);
}
