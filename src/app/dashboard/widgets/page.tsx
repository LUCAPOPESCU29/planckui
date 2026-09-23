import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { widgetsFor } from "@/lib/db";
import { getWidget } from "@/lib/widgets/registry";

export const metadata = { title: "My widgets" };

export default async function WidgetsPage() {
  const user = await requireUser();
  const widgets = await widgetsFor(user.id);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">My widgets</h1>
          <p className="mt-1 text-sm text-ink-2">
            Each one has its own embed snippet. Delete here is permanent; everything else is
            reversible.
          </p>
        </div>
        <Link href="/dashboard/widgets/new" className="btn btn-primary btn-sm">
          New widget
        </Link>
      </div>

      {widgets.length === 0 ? (
        <div className="card p-6">
          <p className="font-medium">Nothing built yet.</p>
          <p className="mt-1 mb-4 text-sm text-ink-2">
            Start with the Wall of Love — it is the reason most people find this place.
          </p>
          <Link href="/dashboard/widgets/new?type=wall-of-love" className="btn btn-primary btn-sm">
            Create a Wall of Love
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col divide-y divide-line rounded-[var(--radius-lg)] border border-line bg-surface">
          {widgets.map((w) => {
            const def = getWidget(w.type);
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
                  <span className="text-sm text-ink-3" aria-hidden="true">
                    Edit →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
