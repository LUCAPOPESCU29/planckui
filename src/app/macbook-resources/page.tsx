import type { Metadata } from "next";
import { MacResources } from "@/components/MacResources";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "MacBook Resources — docks & desktop widgets · PlanckUi",
  description:
    "Download glass dock bars and desktop widgets for your physical Mac: now playing, calendar, network speeds, water tracker, developer stats and real app icons. Free forever.",
};

/* MacBook Resources — docks & desktop widgets that install on the user's
   actual Mac via Übersicht (free, open-source Mac runtime for HTML widgets).
   The page previews every design live; the download is a working .jsx widget. */
export default async function MacBookResourcesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12 md:py-16">
        <p className="text-sm font-medium uppercase tracking-wide text-accent">For your Mac, not your website</p>
        <h1 className="mt-3 text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.05]">
          MacBook Resources
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-2">
          Glass dock bars and desktop widgets — clock, now playing, calendar, network speeds,
          water tracker, developer stats — installed on your physical Mac with real app icons.
        </p>

        <ol className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            ["Install Übersicht", "One-time, free & open-source. It renders widgets on your desktop."],
            ["Download a resource", "Every design below is a ready-made widget file — no account needed."],
            ["Move it into widgets", "Drop the .jsx into Übersicht's widgets folder. It appears instantly."],
          ].map(([t, d], i) => (
            <li key={t} className="card p-4">
              <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold"
                style={{ background: "var(--accent-soft)", color: "var(--accent-strong)" }}>{i + 1}</span>
              <div className="mt-2 font-medium">{t}</div>
              <p className="mt-1 text-sm text-ink-3">{d}</p>
            </li>
          ))}
        </ol>

        <div className="my-10 rounded-[var(--radius-lg)] border border-line bg-surface p-4 text-sm text-ink-2">
          The widgets run on{" "}
          <a className="font-medium text-accent hover:text-accent-strong" href="http://felixhageloh.de/uebersicht" target="_blank" rel="noreferrer">
            Übersicht
          </a>{" "}
          — download it there, then use the buttons below. The clock widgets are live: they read your
          Mac&rsquo;s time every 10 seconds. Everything renders in true glass and follows your wallpaper.
        </div>

        <MacResources />
      </main>
      <SiteFooter />
    </div>
  );
}
