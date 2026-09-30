import type { MetadataRoute } from "next";
import { LIVE_WIDGETS } from "@/lib/widgets/registry";
import { LANDING_TEMPLATES } from "@/lib/landing-templates";
import { POSTS } from "@/lib/blog";

/* Full sitemap: static pages + every live widget detail page. Widget pages
   are the SEO priority — one page targets one "free X for website" query. */

const BASE = "https://plank-ui.design";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const statics: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/gallery`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/macbook-resources`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/animations`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/blocks`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/navigations`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/landing-pages`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];
  const lps: MetadataRoute.Sitemap = LANDING_TEMPLATES.map((t) => ({
    url: `${BASE}/lp/${t.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));
  const posts: MetadataRoute.Sitemap = POSTS.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));
  const widgets: MetadataRoute.Sitemap = LIVE_WIDGETS.map((w) => ({
    url: `${BASE}/gallery/${w.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: w.category === "proof" || w.category === "platforms" ? 0.8 : 0.7,
  }));
  return [...statics, ...widgets, ...lps, ...posts];
}
