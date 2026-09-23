import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth";
import { deleteCollection, getCollection, updateCollection } from "@/lib/db";

async function guard(id: string) {
  const userId = await currentUserId();
  const col = await getCollection(id);
  if (!userId || !col || col.userId !== userId) return null;
  return col;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await guard(id))) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const body = await req.json().catch(() => ({}));
  await updateCollection(id, { name: String(body.name || "").trim() || undefined });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await guard(id))) return NextResponse.json({ error: "Not found." }, { status: 404 });
  await deleteCollection(id);
  return NextResponse.json({ ok: true });
}
