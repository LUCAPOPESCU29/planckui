import { PickerClient } from "@/components/PickerClient";
import { requireUser } from "@/lib/auth";
import { collectionsFor } from "@/lib/db";

export const metadata = { title: "New widget" };

export default async function NewWidgetPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const user = await requireUser();
  const cols = await collectionsFor(user.id);
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">New widget</h1>
        <p className="mt-1 text-sm text-ink-2">
          Everything here is live and free. Pick one, give it a name, paste the snippet.
        </p>
      </div>
      <PickerClient
        collections={cols.map((c) => ({ id: c.id, name: c.name }))}
        preselect={type}
      />
    </div>
  );
}
