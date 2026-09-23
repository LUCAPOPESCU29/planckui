import { GalleryClient } from "@/components/GalleryClient";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { WIDGETS } from "@/lib/widgets/registry";

export const metadata = {
  title: "Widget catalog — all free",
  description:
    "160+ free embeddable widgets for any website: testimonials, reviews, countdowns, forms, calculators and more. Live previews, honest status.",
};

export default function GalleryPage() {
  const live = WIDGETS.filter((w) => w.status === "live").length;
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12 md:py-16">
        <div className="mb-10 max-w-2xl">
          <h1 className="text-[clamp(1.9rem,3.2vw,2.7rem)] font-semibold">The catalog</h1>
          <p className="mt-3 text-ink-2">
            {live} live now, {WIDGETS.length - live} in build — and we say which is which,
            because a catalog that fakes completeness is just a nicer paywall. Every live
            widget below is running its real code.
          </p>
        </div>
        <GalleryClient />
      </main>
      <SiteFooter />
    </div>
  );
}
