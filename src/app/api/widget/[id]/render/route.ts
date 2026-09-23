import { getCollection, getCollectionBySlug, getWidgetRecord, testimonialsFor } from "@/lib/db";
import { IFRAME_WIDGETS, renderWidget } from "@/lib/widgets/renderers";

/* Public render endpoint. The embed loader fetches this and injects the
   result into a Shadow DOM root on the host page. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const w = await getWidgetRecord(id);
  if (!w) return Response.json({ error: "Not found" }, { status: 404 });

  if (IFRAME_WIDGETS.has(w.type)) {
    const col = w.collectionId ? await getCollection(w.collectionId) : undefined;
    const slug = col?.slug ?? (await getCollectionBySlug("demo"))?.slug;
    if (!slug) return Response.json({ error: "No collection" }, { status: 400 });
    return Response.json(
      { iframeSrc: "/c/" + slug + "?embed=1&w=" + w.id },
      { headers: { "cache-control": "no-store" } }
    );
  }

  const { getWidget } = await import("@/lib/widgets/registry");
  const def = getWidget(w.type);
  const items: import("@/lib/widgets/types").TestimonialData[] = [];
  if (def?.needsCollection && w.collectionId) {
    items.push(...(await testimonialsFor(w.collectionId)).filter((t) => t.status === "approved"));
  }
  // extra context renderers may need (e.g. the popup forms post back to the
  // collection; the render origin equals the host origin, so a relative slug)
  const extra: Record<string, unknown> = { slug: w.collectionId ? (await (await import("@/lib/db")).getCollection(w.collectionId))?.slug : undefined };
  let out;
  try {
    out = renderWidget(w.type, w.config, items, extra);
  } catch {
    return Response.json({ error: "Render failed" }, { status: 500 });
  }
  return Response.json(
    { ...out, theme: w.config.theme },
    { headers: { "cache-control": "no-store" } }
  );
}
