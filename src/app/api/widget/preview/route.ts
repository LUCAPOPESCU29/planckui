import { NextResponse } from "next/server";
import { IFRAME_WIDGETS, renderWidget } from "@/lib/widgets/renderers";
import { DEMO_TESTIMONIALS } from "@/lib/widgets/demo-data";
import type { TestimonialData, WidgetConfig } from "@/lib/widgets/types";

/* Preview endpoint used by the editor and the gallery. Pure function of its
   input — no auth, no storage. Form widgets return an iframe target so the
   camera-based collection flow stays intact. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.type !== "string") {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const config = (body.config && typeof body.config === "object" ? body.config : {}) as WidgetConfig;

  if (IFRAME_WIDGETS.has(body.type)) {
    const cfg = encodeURIComponent(JSON.stringify(config));
    return NextResponse.json({ iframeSrc: "/preview/form?cfg=" + cfg });
  }

  const items = Array.isArray(body.items)
    ? (body.items as TestimonialData[])
    : DEMO_TESTIMONIALS;
  try {
    return NextResponse.json(renderWidget(body.type, config, items));
  } catch (e) {
    return NextResponse.json({ error: "Render failed", detail: String(e) }, { status: 400 });
  }
}
