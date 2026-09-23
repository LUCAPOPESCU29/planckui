import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth";
import { deleteWidgetRecord, getWidgetRecord, updateWidgetRecord } from "@/lib/db";
import type { WidgetConfig } from "@/lib/widgets/types";

async function owned(id: string) {
  const userId = await currentUserId();
  const w = getWidgetRecord(id);
  if (!userId || !w || w.userId !== userId) return null;
  return w;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const w = await owned(id);
  if (!w) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const body = await req.json().catch(() => ({}));
  updateWidgetRecord(id, {
    name: typeof body.name === "string" ? body.name.slice(0, 60) : undefined,
    config: body.config && typeof body.config === "object" ? (body.config as WidgetConfig) : undefined,
    collectionId: typeof body.collectionId === "string" ? body.collectionId : undefined,
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await owned(id))) return NextResponse.json({ error: "Not found." }, { status: 404 });
  deleteWidgetRecord(id);
  return NextResponse.json({ ok: true });
}
