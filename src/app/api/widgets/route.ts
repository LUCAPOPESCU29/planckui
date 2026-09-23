import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth";
import { createWidgetRecord } from "@/lib/db";
import { getWidget } from "@/lib/widgets/registry";

export async function POST(req: Request) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const def = getWidget(String(body.type || ""));
  if (!def || def.status !== "live") {
    return NextResponse.json({ error: "Unknown widget." }, { status: 400 });
  }
  const rec = await createWidgetRecord(userId, {
    type: def.id,
    name: String(body.name || "").trim() || def.name,
    collectionId: body.collectionId ? String(body.collectionId) : undefined,
    config: body.config && typeof body.config === "object" ? body.config : {},
  });
  return NextResponse.json({ widget: rec });
}
