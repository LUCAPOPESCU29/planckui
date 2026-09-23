"use client";

import { WidgetPreview } from "./WidgetPreview";
import { DEMO_TESTIMONIALS } from "@/lib/widgets/demo-data";
import { defaultsFor, getWidget } from "@/lib/widgets/registry";
import { isIframeWidget, previewIframeSrc } from "@/lib/widgets/renderers";

/* Full-size live demo for a widget's catalog page. */
export function GalleryDemo({ defId }: { defId: string }) {
  const def = getWidget(defId);
  if (!def) return null;
  const cfg = { ...defaultsFor(def), maxWidth: 900 };
  const isForm = isIframeWidget(defId);
  return (
    <WidgetPreview
      type={defId}
      config={cfg}
      items={def.needsCollection ? DEMO_TESTIMONIALS : undefined}
      iframeSrc={isForm ? "/preview/form?type=" + defId + "&cfg=" + encodeURIComponent(JSON.stringify(cfg)) : undefined}
    />
  );
}
