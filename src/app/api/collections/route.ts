import { NextResponse } from "next/server";
import { createCollection, collectionsFor } from "@/lib/db";
import { currentUserId } from "@/lib/auth";

export async function GET() {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const collections = await collectionsFor(userId);
  return NextResponse.json({ collections });
}

export async function POST(req: Request) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const name = String(body.name || "").trim();
  if (!name || name.length > 60) {
    return NextResponse.json({ error: "Give the collection a short name." }, { status: 400 });
  }
  // awaited: the response must carry the record, and the durable write must
  // land before the client navigates to the new collection's page
  const collection = await createCollection(userId, name);
  return NextResponse.json({ collection });
}
