import { NextResponse } from "next/server";
import { findUserByEmail, setUserEmail } from "@/lib/db";
import { currentUserId } from "@/lib/auth";

/* Guests can add an email whenever they want — the workspace, its widgets
   and collections stay exactly as they are. */
export async function POST(req: Request) {
  const userId = await currentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Open a workspace first." }, { status: 401 });
  }
  let email = "";
  try {
    const body = await req.json();
    email = String(body.email || "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 });
  }
  if (findUserByEmail(email)) {
    return NextResponse.json(
      { error: "That email already has a workspace. Sign in instead — this guest workspace stays in this browser." },
      { status: 409 }
    );
  }
  setUserEmail(userId, email);
  return NextResponse.json({ ok: true });
}
