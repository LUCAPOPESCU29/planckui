"use client";

import Link from "next/link";
import {
  AppleDock,
  AppleGlobalNav,
  AppleMenuBar,
  AppleMusicNav,
  ApplePayNav,
  AppleSegmented,
  AppleSettingsList,
  AppleStoreNav,
  AppleDevDark,
  AppleWatchGrid,
  GlassCapsuleBar,
  GlassMegaMenu,
  GlassPillNav,
  GlassSidebar,
  GlassTabBar,
} from "@/components/navs/apple";
import { NavSection, Reveal } from "@/components/navs/shared";
import {
  PlankBreadcrumb,
  PlankCategoryGrid,
  PlankDock,
  PlankInline,
  PlankMega,
  PlankMobile,
  PlankSearch,
  PlankSidebar,
  PlankTabs,
  PlankUnderline,
} from "@/components/navs/planck";

/* /navigations — 25 navigation menus inspired by the shadcn NavigationMenu:
   ten built in PlanckUi's own CSS, fifteen with an Apple accent, five of
   those in Liquid Glass over a colorful scene with the real Apple mark. */

type NavEntry = {
  num: string;
  tag: string;
  title: string;
  desc: string;
  node: React.ReactNode;
  liquid?: boolean;
};

const PLANCK_NAVS: NavEntry[] = [
  { num: "01", tag: "PlankUi CSS", title: "Mega menu", desc: "Classic bar, two-column panel with a featured card.", node: <PlankMega /> },
  { num: "02", tag: "PlankUi CSS", title: "Inline popovers", desc: "The shadcn pattern — quiet text links, small popovers.", node: <PlankInline /> },
  { num: "03", tag: "PlankUi CSS", title: "Category mega grid", desc: "Full-width catalog panel with icons and counts.", node: <PlankCategoryGrid /> },
  { num: "04", tag: "PlankUi CSS", title: "Sliding underline", desc: "A petrol indicator that glides between items.", node: <PlankUnderline /> },
  { num: "05", tag: "PlankUi CSS", title: "Vertical sidebar", desc: "Sidebar with a sliding active pill and badges.", node: <PlankSidebar /> },
  { num: "06", tag: "PlankUi CSS", title: "Breadcrumb trail", desc: "Where am I, and how do I step back.", node: <PlankBreadcrumb /> },
  { num: "07", tag: "PlankUi CSS", title: "Mobile slide-down", desc: "Hamburger panel with a grid-rows animation.", node: <PlankMobile /> },
  { num: "08", tag: "PlankUi CSS", title: "Search-first nav", desc: "Type to filter — results update as you go.", node: <PlankSearch /> },
  { num: "09", tag: "PlankUi CSS", title: "Tabs with counts", desc: "Filter chips that show what each tab holds.", node: <PlankTabs /> },
  { num: "10", tag: "PlankUi CSS", title: "Floating dock", desc: "Bottom dock with tooltips and an active dot.", node: <PlankDock /> },
];

const APPLE_NAVS: NavEntry[] = [
  { num: "11", tag: "Apple · UI", title: "Global nav", desc: "The apple.com bar — translucent, 12px, tiny glyphs.", node: <AppleGlobalNav /> },
  { num: "12", tag: "Apple · macOS", title: "Menu bar", desc: "Working File and View menus with shortcut hints.", node: <AppleMenuBar /> },
  { num: "13", tag: "Apple · macOS", title: "The Dock", desc: "Pointer magnification on a glass shelf.", node: <AppleDock /> },
  { num: "14", tag: "Apple · Liquid Glass", title: "Floating pill", desc: "Refractive pill nav over a color field.", node: <GlassPillNav />, liquid: true },
  { num: "15", tag: "Apple · Liquid Glass", title: "Tab bar", desc: "iOS bottom tabs with a center create button.", node: <GlassTabBar />, liquid: true },
  { num: "16", tag: "Apple · Liquid Glass", title: "Sidebar", desc: "visionOS-style panel with a collapse spring.", node: <GlassSidebar />, liquid: true },
  { num: "17", tag: "Apple · Liquid Glass", title: "Mega menu", desc: "Glass panel with product tiles and a feature card.", node: <GlassMegaMenu />, liquid: true },
  { num: "18", tag: "Apple · Liquid Glass", title: "Capsule actions", desc: "Expanding search, fanning create menu, like toggle.", node: <GlassCapsuleBar />, liquid: true },
  { num: "19", tag: "Apple · Store", title: "Store tabs", desc: "Product mega menu with tiles and pricing.", node: <AppleStoreNav /> },
  { num: "20", tag: "Apple · iOS", title: "Segmented control", desc: "Sliding thumb navigation with spring physics.", node: <AppleSegmented /> },
  { num: "21", tag: "Apple · iOS", title: "Settings list", desc: "Grouped inset rows with a real toggle switch.", node: <AppleSettingsList /> },
  { num: "22", tag: "Apple · Developer", title: "Dark developer nav", desc: "Quiet links that light up on hover.", node: <AppleDevDark /> },
  { num: "23", tag: "Apple · Pay", title: "Product nav", desc: "Buy button, bag badge and a working mini-cart.", node: <ApplePayNav /> },
  { num: "24", tag: "Apple · Music", title: "Colored tabs", desc: "Tabs whose active state paints the content card.", node: <AppleMusicNav /> },
  { num: "25", tag: "Apple · watchOS", title: "App grid", desc: "Round app icons on black — Activity ring included.", node: <AppleWatchGrid /> },
];

export default function NavigationsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="sticky top-4 z-50 flex justify-center px-4 pt-2">
        <Link
          href="/"
          className="glass-pill-nav !py-2 text-sm text-ink-2 transition-colors duration-150 hover:text-ink"
        >
          ← Back to PlanckUi
        </Link>
      </div>

      <main className="flex-1 pb-10">
        <section className="mx-auto w-full max-w-6xl px-6 pb-6 pt-20">
          <Reveal>
            <h1 className="max-w-3xl text-[clamp(2.2rem,4.5vw,3.4rem)] font-semibold leading-[1.05] tracking-[-0.02em]">
              Navigation menus.
              <br />
              Twenty-five of them.
            </h1>
          </Reveal>
          <Reveal delay={45}>
            <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-2">
              Inspired by the shadcn NavigationMenu — ten built in PlanckUi&apos;s own CSS,
              fifteen with an Apple accent. Five of those are Liquid Glass over a color
              field, with the real Apple mark. Every dropdown works. Every animation obeys
              the house law: transform and opacity only, under 300 ms, reduced-motion safe.
            </p>
          </Reveal>
          <Reveal delay={90}>
            <div className="mt-7 flex flex-wrap gap-2">
              <span className="rounded-full bg-[var(--ink)] px-3 py-1.5 text-xs font-medium text-[var(--bg)]">
                10 · PlanckUi CSS
              </span>
              <span className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink-2">
                10 · Apple UI
              </span>
              <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-ink-2">
                5 · Liquid Glass
              </span>
            </div>
          </Reveal>
        </section>

        <section className="mx-auto max-w-6xl px-6">
          <div className="rounded-[18px] border-line bg-[var(--surface-2)] px-6 py-5" style={{ border: "1px solid var(--line)" }}>
            <p className="text-[13px] text-ink-2">
              <b className="font-medium text-ink">Part I — PlanckUi CSS.</b> The house tokens:
              petrol accent, Archivo display type, Golos body, Emil&apos;s motion rules.
            </p>
          </div>
        </section>

        {PLANCK_NAVS.map((n) => (
          <NavSection key={n.num} num={n.num} tag={n.tag} title={n.title} desc={n.desc}>
            {n.node}
          </NavSection>
        ))}

        <section className="mx-auto max-w-6xl px-6">
          <div
            className="rounded-[18px] px-6 py-5"
            style={{ background: "linear-gradient(120deg,#1d1d1f,#3a2f52 55%,#6a3a52)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <p className="text-[13px] text-white/85">
              <b className="font-medium text-white">Part II — Apple UI.</b> Real Apple mark,
              SF-style glyphs, macOS and iOS palettes — and five Liquid Glass pieces that
              refract the color beneath them.
            </p>
          </div>
        </section>

        {APPLE_NAVS.map((n) => (
          <NavSection
            key={n.num}
            num={n.num}
            tag={n.tag}
            title={n.title}
            desc={n.desc}
            scene={n.liquid}
          >
            {n.node}
          </NavSection>
        ))}

        <section className="mx-auto max-w-6xl px-6 pb-24 pt-4">
          <div className="card p-8 text-center">
            <h2 className="font-display text-2xl font-semibold">Want these as blocks?</h2>
            <p className="mx-auto mt-3 max-w-lg text-ink-2">
              Every menu above can become a copy-paste section like the ones on the blocks
              page — say which ones and they&apos;ll get the same Copy HTML treatment.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/blocks" className="btn btn-primary rounded-full">
                Browse the blocks
              </Link>
              <Link href="/gallery" className="btn btn-ghost rounded-full">
                See the widgets
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
