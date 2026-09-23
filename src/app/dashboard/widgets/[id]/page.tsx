import { notFound } from "next/navigation";
import { EditorClient } from "@/components/EditorClient";
import { requireUser } from "@/lib/auth";
import { collectionsFor, getWidgetRecord } from "@/lib/db";
import { getOrigin } from "@/lib/origin";
import { getWidget } from "@/lib/widgets/registry";

export const metadata = { title: "Editor" };

export default async function WidgetEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const rec = await getWidgetRecord(id);
  if (!rec || rec.userId !== user.id) notFound();
  if (!getWidget(rec.type)) notFound();

  const cols = await collectionsFor(user.id);
  const origin = await getOrigin();

  return (
    <EditorClient
      id={rec.id}
      type={rec.type}
      initialName={rec.name}
      initialConfig={rec.config}
      initialCollectionId={rec.collectionId}
      collections={cols.map((c) => ({ id: c.id, name: c.name }))}
      origin={origin}
    />
  );
}
