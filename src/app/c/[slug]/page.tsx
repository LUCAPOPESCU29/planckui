import { notFound } from "next/navigation";
import { CollectionForm } from "@/components/CollectionForm";
import { FormRouter } from "@/components/FormWidgets";
import { getCollectionBySlug, getWidgetRecord } from "@/lib/db";
import { IFRAME_WIDGETS } from "@/lib/widgets/renderers";
import { defaultsFor, getWidget } from "@/lib/widgets/registry";
import type { FormConfig } from "@/components/CollectionForm";

export const metadata = { title: "Share your experience" };

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ embed?: string; w?: string }>;
}) {
  const { slug } = await params;
  const { embed, w } = await searchParams;
  const col = getCollectionBySlug(slug);
  if (!col) notFound();

  const formDef = getWidget("testimonial-form")!;
  let config: FormConfig = {
    headline: String(formDef.defaults?.text ?? "How was your experience?"),
    askRating: formDef.defaults?.askRating !== false,
    askVideo: formDef.defaults?.askVideo !== false,
    askRole: formDef.defaults?.askRole !== false,
  };
  let variant = "testimonial-form";
  if (w) {
    const rec = getWidgetRecord(w);
    if (rec && rec.collectionId === col.id) {
      variant = rec.type;
      if (variant === "testimonial-form" || variant === "star-comment-form") {
        config = {
          headline: String(rec.config.text || config.headline),
          askRating: rec.config.askRating !== false,
          askVideo: rec.config.askVideo !== false,
          askRole: rec.config.askRole !== false,
        };
      }
    }
  }

  // every iframe-collecting widget except the flagship forms renders through
  // the FormRouter; the flagship keeps its bespoke multi-step flow
  if (IFRAME_WIDGETS.has(variant) && variant !== "testimonial-form" && variant !== "star-comment-form") {
    const rec = w ? getWidgetRecord(w) : undefined;
    const def = getWidget(variant)!;
    const cfg = {
      headline: String(rec?.config.text || def.defaults?.text || def.name),
      items: String(rec?.config.items || def.defaults?.items || ""),
    };
    return (
      <div className={embed === "1" ? "p-4" : "px-6 py-14 sm:py-20"}>
        <FormRouter type={variant} slug={slug} cfg={cfg} embed={embed === "1"} />
      </div>
    );
  }

  return (
    <div className={embed ? "p-4" : "px-6 py-14 sm:py-20"}>
      <CollectionForm slug={slug} config={config} embed={embed === "1"} />
    </div>
  );
}
