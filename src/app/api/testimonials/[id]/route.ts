import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth";
import { deleteTestimonial, getCollection, getTestimonial, updateTestimonial } from "@/lib/db";

async function owned(id: string) {
  const userId = await currentUserId();
  const t = await getTestimonial(id);
  if (!userId || !t) return null;
  const col = await getCollection(t.collectionId);
  if (!col || col.userId !== userId) return null;
  return t;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await owned(id))) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const body = await req.json().catch(() => ({}));
  const patch: { status?: "pending" | "approved" | "rejected"; tags?: string[] } = {};
  if (["pending", "approved", "rejected"].includes(body.status)) {
    patch.status = body.status;
  }
  if (Array.isArray(body.tags)) {
    patch.tags = body.tags.map(String).slice(0, 8);
  }
  await updateTestimonial(id, patch);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await owned(id))) return NextResponse.json({ error: "Not found." }, { status: 404 });
  await deleteTestimonial(id);
  return NextResponse.json({ ok: true });
}
