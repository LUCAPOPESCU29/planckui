import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth";
import { addTestimonial, getCollection } from "@/lib/db";

/* CSV import: the owner vouches for these, so they land approved.
   Expected per line: Name | Role | Rating | Text */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await currentUserId();
  const col = await getCollection(id);
  if (!userId || !col || col.userId !== userId) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  const body = await req.json().catch(() => ({}));
  const csv = String(body.csv || "");
  const lines = csv.split("\n").map((l) => l.trim()).filter(Boolean);
  let added = 0;
  for (const line of lines.slice(0, 200)) {
    const [author, role, rating, ...rest] = line.split("|").map((p) => p.trim());
    const text = rest.join("|");
    if (!author || !text) continue;
    await addTestimonial({
      collectionId: col.id,
      author: author.slice(0, 80),
      role: role && role !== "-" ? role.slice(0, 80) : undefined,
      rating: Math.max(0, Math.min(5, Math.round(Number(rating)) || 0)),
      text: text.slice(0, 2000),
      status: "approved",
    });
    added++;
  }
  return NextResponse.json({ added });
}
