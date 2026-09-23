import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyChip } from "@/components/CopyChip";
import { CsvImport } from "@/components/CsvImport";
import { InboxClient } from "@/components/InboxClient";
import { getOrigin } from "@/lib/origin";
import { requireUser } from "@/lib/auth";
import { getCollection, testimonialsFor, widgetsFor } from "@/lib/db";
import { getWidget } from "@/lib/widgets/registry";

export const metadata = { title: "Collection" };

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const col = getCollection(id);
  if (!col || col.userId !== user.id) notFound();

  const all = testimonialsFor(col.id);
  const toInbox = (t: (typeof all)[number]) => ({
    id: t.id,
    author: t.author,
    role: t.role,
    rating: t.rating,
    text: t.text,
    videoUrl: t.videoUrl,
    createdAt: t.createdAt,
  });
  const pending = all.filter((t) => t.status === "pending").map(toInbox);
  const approved = all.filter((t) => t.status === "approved").map(toInbox);
  const widgets = widgetsFor(user.id).filter((w) => w.collectionId === col.id);
  const origin = await getOrigin();

  return (
    <div className="flex flex-col gap-10">
      <div>
        <Link href="/dashboard" className="text-sm text-ink-3 transition-colors hover:text-ink">
          ← Workspace
        </Link>
        <h1 className="mt-2 font-display text-2xl font-semibold">{col.name}</h1>
      </div>

      <section aria-labelledby="share-h" className="flex flex-col gap-3">
        <h2 id="share-h" className="font-display text-lg font-semibold">
          Collect
        </h2>
        <p className="max-w-[70ch] text-sm text-ink-2">
          Send this link to customers — after a purchase, a repair, a delivery. Answers land in
          the pending inbox below. You can also point the{" "}
          <Link href="/dashboard/widgets/new" className="underline underline-offset-2 hover:text-ink">
            testimonial form widget
          </Link>{" "}
          at this collection to embed the form on your own site.
        </p>
        <div className="max-w-xl">
          <CopyChip text={`${origin}/c/${col.slug}`} label="Collection link" />
        </div>
        <CsvImport collectionId={col.id} />
      </section>

      {widgets.length > 0 && (
        <section aria-labelledby="usedby-h">
          <h2 id="usedby-h" className="font-display text-lg font-semibold">
            Used by
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {widgets.map((w) => (
              <li key={w.id}>
                <Link
                  href={`/dashboard/widgets/${w.id}`}
                  className="inline-block rounded-[999px] border border-line px-3.5 py-1.5 text-sm text-ink-2 transition-colors hover:border-ink-3 hover:text-ink"
                >
                  {w.name}
                  <span className="ml-2 text-xs text-ink-3">{getWidget(w.type)?.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <InboxClient collectionId={col.id} pending={pending} approved={approved} />
    </div>
  );
}
