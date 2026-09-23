import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth";
import { getCollection, testimonialsFor } from "@/lib/db";

/* Approved testimonials for a collection — used by the editor so previews
   show the owner's real data instead of sample content. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await currentUserId();
  const col = await getCollection(id);
  if (!userId || !col || col.userId !== userId) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  const items = (await testimonialsFor(id))
    .filter((t) => t.status === "approved")
    .map((t) => ({
      id: t.id,
      author: t.author,
      role: t.role,
      rating: t.rating,
      text: t.text,
      videoUrl: t.videoUrl,
      createdAt: t.createdAt,
    }));
  return NextResponse.json({ items });
}
