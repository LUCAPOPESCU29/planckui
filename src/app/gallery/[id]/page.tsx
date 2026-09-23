import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyChip } from "@/components/CopyChip";
import { PublicCustomizer } from "@/components/PublicCustomizer";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { getWidget } from "@/lib/widgets/registry";
import { CATEGORIES } from "@/lib/widgets/types";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const def = getWidget(id);
  if (!def) return {};
  const suffix = def.status === "live" ? "free widget for your website" : "free widget, in build";
  return {
    title: `${def.name} — ${suffix}`,
    description: `${def.blurb} Free forever on PlanckUi — live preview, copy-paste embed, no credit card.`,
  };
}

export default async function WidgetPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ paint?: string }> }) {
  const { id } = await params;
  const { paint } = await searchParams;
  const def = getWidget(id);
  if (!def) notFound();
  const cat = CATEGORIES.find((c) => c.id === def.category);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12 md:py-16">
        <Link href="/gallery" className="text-sm text-ink-3 transition-colors hover:text-ink">
          ← Catalog
        </Link>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h1 className="text-[clamp(1.8rem,3vw,2.6rem)] font-semibold">{def.name}</h1>
            <p className="mt-3 text-lg text-ink-2">{def.blurb}</p>
            <p className="mt-2 text-sm text-ink-3">{cat?.name}</p>
          </div>
          <a
            href={`/gallery/${def.id}?paint=1`}
            className="btn btn-ghost"
            title="Jump to the customizer"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 21v-4a4 4 0 1 1 4 4H3Z"/><path d="M21 3.2a1.2 1.2 0 0 0-1.7 0L11.5 11l1.5 1.5 7.8-7.8a1.2 1.2 0 0 0 0-1.7Z"/><path d="M11.5 11l1.5 1.5"/></svg>
            Paint it
          </a>
          {def.status === "live" ? (
            <Link href={`/dashboard/widgets/new?type=${def.id}`} className="btn btn-primary">
              Use this widget
            </Link>
          ) : (
            <span className="rounded-full border border-line px-4 py-2 text-sm text-ink-3">
              In build — not yet embeddable
            </span>
          )}
        </div>

        {def.status === "live" ? (
          <>
            <div className="card mt-8 overflow-hidden p-4">
              <PublicCustomizer defId={def.id} autoFocus={paint === "1"} />
            </div>

            <div className="mt-12 grid gap-10 md:grid-cols-2">
              <section aria-labelledby="how-h">
                <h2 id="how-h" className="font-display text-lg font-semibold">
                  Three steps, five minutes
                </h2>
                <ol className="mt-4 flex flex-col gap-4 text-[15px] text-ink-2">
                  <li className="flex gap-3">
                    <Step n={1} />
                    <span>
                      <strong className="font-medium text-ink">Add it.</strong> Click “Use this
                      widget” — it lands in your dashboard with sensible defaults.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <Step n={2} />
                    <span>
                      <strong className="font-medium text-ink">Tune it.</strong> Theme, accent
                      color, radius, density — every change updates the live preview
                      instantly.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <Step n={3} />
                    <span>
                      <strong className="font-medium text-ink">Paste it.</strong> One script tag,
                      anywhere on any site. It renders in a shadow root and loads lazily, so
                      your page speed never notices.
                    </span>
                  </li>
                </ol>
                <div className="mt-6">
                  <CopyChip
                    text={`<script async data-widget="YOUR_WIDGET_ID" src="https://your-planckui-url/api/embed/loader.js"></script>`}
                    label="Snippet shape"
                  />
                  <p className="mt-2 text-xs text-ink-3">
                    The real snippet with your widget&rsquo;s ID appears in the editor.
                  </p>
                </div>
              </section>

              <section aria-labelledby="opts-h">
                <h2 id="opts-h" className="font-display text-lg font-semibold">
                  What you can customize
                </h2>
                {def.controls && def.controls.length > 0 ? (
                  <dl className="mt-4 flex flex-col divide-y divide-line rounded-[var(--radius-lg)] border border-line bg-surface">
                    {def.controls.map((c) => (
                      <div key={c.key} className="flex items-baseline justify-between gap-4 px-5 py-3">
                        <dt className="text-sm font-medium">{c.label}</dt>
                        <dd className="text-right text-xs text-ink-3">
                          {labelForControl(c.type)}
                          {c.help ? ` — ${c.help}` : ""}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="mt-4 text-sm text-ink-3">
                    Just the shared settings: theme, accent color, corner radius, density and
                    the badge.
                  </p>
                )}
              </section>
            </div>
          </>
        ) : (
          <div className="card mt-8 p-8">
            <h2 className="font-display text-lg font-semibold">In build, honestly</h2>
            <p className="mt-3 max-w-[65ch] text-ink-2">
              This one is in the catalog because it is designed and scheduled, not because it
              works today. Everything marked live really works — everything marked “in build”
              really does not, yet. That is the whole deal.
            </p>
            <Link href="/gallery" className="btn btn-ghost btn-sm mt-6">
              See what&rsquo;s live now
            </Link>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function Step({ n }: { n: number }) {
  return (
    <span
      aria-hidden="true"
      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
      style={{ background: "var(--accent-soft)", color: "var(--accent-strong)" }}
    >
      {n}
    </span>
  );
}

function labelForControl(t: string): string {
  switch (t) {
    case "theme":
      return "light / dark";
    case "color":
      return "color picker + presets";
    case "range":
      return "slider";
    case "toggle":
      return "on / off";
    case "select":
      return "choice list";
    case "textarea":
      return "multi-line text";
    case "date":
      return "date and time";
    default:
      return "text";
  }
}
