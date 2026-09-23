import { NextResponse } from "next/server";
import { addTestimonial, getCollectionBySlug, testimonialsFor } from "@/lib/db";

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "content-type",
  "access-control-allow-methods": "POST, OPTIONS",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

/* Public poll tally: counts votes by tag for the options provided. Votes are
   counted in all states so a live poll works without hand-approving each one. */
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const col = getCollectionBySlug(slug);
  if (!col) return NextResponse.json({ error: "Not found" }, { status: 404, headers: CORS });
  const options = (new URL(req.url).searchParams.get("options") || "")
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
  const all = testimonialsFor(col.id);
  const counts = options.map((o) => {
    const tag = "poll:" + o.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30);
    return all.filter((t) => t.tags.includes(tag)).length;
  });
  return NextResponse.json({ counts }, { headers: CORS });
}

function cleanTag(t: string): string {
  return t.toLowerCase().replace(/[^a-z0-9:_-]/g, "").slice(0, 30);
}

/* Public submission endpoint for every collection form variant. Everything
   arrives as pending; nothing is displayed until the owner approves it. */
export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const col = getCollectionBySlug(slug);
  if (!col) return NextResponse.json({ error: "This link has expired." }, { status: 404, headers: CORS });

  const body = await req.json().catch(() => ({}));
  const role = String(body.role || "").trim().slice(0, 80) || undefined;
  const rating = Math.max(1, Math.min(5, Math.round(Number(body.rating) || 0)));
  const videoUrl =
    typeof body.videoUrl === "string" && body.videoUrl.startsWith("/api/media/")
      ? body.videoUrl
      : undefined;

  // structured answers (surveys, polls, bookings) are composed into text
  let author = String(body.author || "").trim().slice(0, 80);
  let text = String(body.text || "").trim().slice(0, 2000);
  const tags = Array.isArray(body.tags) ? body.tags.map(cleanTag).filter(Boolean).slice(0, 8) : [];
  if (Array.isArray(body.answers) && body.answers.length) {
    const lines = (body.answers as { q: string; a: string }[])
      .slice(0, 20)
      .map((a) => `${String(a.q).slice(0, 120)}: ${String(a.a).slice(0, 500)}`);
    if (!text) text = lines.join("\n").slice(0, 2000);
  }
  if (!author && typeof body.answers?.name === "string") author = body.answers.name.slice(0, 80);

  if (!text && !videoUrl) {
    return NextResponse.json(
      { error: "Write a sentence or record a video." },
      { status: 400, headers: CORS }
    );
  }
  if (!author) {
    author = "Anonymous";
  }

  addTestimonial({
    collectionId: col.id,
    author,
    role,
    rating: body.rating ? rating : 0,
    text,
    videoUrl,
    status: "pending",
    tags,
  });
  return NextResponse.json({ ok: true }, { headers: CORS });
}
