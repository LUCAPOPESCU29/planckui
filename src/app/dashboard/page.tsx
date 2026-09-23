import Link from "next/link";
import { NewCollectionForm } from "@/components/NewCollectionForm";
import { requireUser } from "@/lib/auth";
import { collectionsFor, testimonialsFor, widgetsFor } from "@/lib/db";
import { getWidget } from "@/lib/widgets/registry";

export const metadata = { title: "Workspace" };

export default async function DashboardPage() {
  const user = await requireUser();
  const cols = await collectionsFor(user.id);
  const widgets = await widgetsFor(user.id);
  const pendingTotal = (
    await Promise.all(cols.map((c) => testimonialsFor(c.id)))
  ).reduce((n, ts) => n + ts.filter((t) => t.status === "pending").length, 0);

  return (
    <div className="flex flex-col gap-12">
      <div>
        <h1 className="font-display text-2xl font-semibold">Your workspace</h1>
        <p className="mt-1 text-sm text-ink-2">
          {cols.length} collection{cols.length === 1 ? "" : "s"} · {widgets.length} widget
          {widgets.length === 1 ? "" : "s"}
          {pendingTotal > 0 && (
            <>
              {" "}
              ·{" "}
              <Link href="#collections" className="underline underline-offset-2 hover:text-ink">
                {pendingTotal} awaiting your approval
              </Link>
            </>
          )}
        </p>
      </div>

      <section id="collections" aria-labelledby="collections-h" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="collections-h" className="font-display text-lg font-semibold">
            Collections
          </h2>
          <p className="max-w-md text-sm text-ink-3">
            A collection holds testimonials. Share its link, collect, approve, then point any
            testimonial widget at it.
          </p>
        </div>

        {cols.length === 0 ? (
          <div className="card p-6">
            <p className="font-medium">No collections yet.</p>
            <p className="mt-1 mb-4 text-sm text-ink-2">
              Create one — it takes a name and nothing else.
            </p>
            <NewCollectionForm />
          </div>
        ) : (
          <ul className="flex flex-col divide-y divide-line rounded-[var(--radius-lg)] border border-line bg-surface">
            {cols.map(async (c) => {
              const ts = await testimonialsFor(c.id);
              const pending = ts.filter((t) => t.status === "pending").length;
              const approved = ts.filter((t) => t.status === "approved").length;
              const usedBy = widgets.filter((w) => w.collectionId === c.id).length;
              return (
                <li key={c.id}>
                  <Link
                    href={`/dashboard/collections/${c.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-surface-2"
                  >
                    <div className="min-w-0">
                      <span className="font-medium">{c.name}</span>
                      <span className="ml-3 font-mono text-xs text-ink-3">/c/{c.slug}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-ink-3">
                      <span>
                        {approved} approved{pending > 0 ? ` · ${pending} pending` : ""}
                      </span>
                      <span className="hidden sm:inline">
                        {usedBy} widget{usedBy === 1 ? "" : "s"}
                      </span>
                      <span aria-hidden="true">→</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {cols.length > 0 && <NewCollectionForm compact />}
      </section>

      <section aria-labelledby="widgets-h" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="widgets-h" className="font-display text-lg font-semibold">
            Your widgets
          </h2>
          <Link href="/dashboard/widgets/new" className="btn btn-ghost btn-sm">
            New widget
          </Link>
        </div>

        {widgets.length === 0 ? (
          <div className="card p-6">
            <p className="font-medium">No widgets yet.</p>
            <p className="mt-1 mb-4 text-sm text-ink-2">
              Pick one from the catalog — the Wall of Love is the classic first choice.
            </p>
            <Link href="/dashboard/widgets/new" className="btn btn-primary btn-sm">
              Browse live widgets
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col divide-y divide-line rounded-[var(--radius-lg)] border border-line bg-surface">
            {widgets.map((w) => {
              const def = getWidget(w.type);
              const col = cols.find((c) => c.id === w.collectionId);
              return (
                <li key={w.id}>
                  <Link
                    href={`/dashboard/widgets/${w.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-surface-2"
                  >
                    <div className="min-w-0">
                      <span className="font-medium">{w.name}</span>
                      <span className="ml-3 text-sm text-ink-3">{def?.name ?? w.type}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-ink-3">
                      {col && <span className="hidden sm:inline">{col.name}</span>}
                      <span aria-hidden="true">→</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
