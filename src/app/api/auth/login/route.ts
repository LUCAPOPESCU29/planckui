import { NextResponse } from "next/server";
import { collectionsFor, createCollection, createUser, findUserByEmail } from "@/lib/db";
import { sessionCookie } from "@/lib/auth";

/* Demo-grade sign-in: any email creates an account and a seeded first-run
   workspace. Swap for Auth.js before public launch. */
export async function POST(req: Request) {
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

  const user = findUserByEmail(email) ?? createUser(email);

  // returning users who removed everything still get a working start point
  if (collectionsFor(user.id).length === 0) {
    try {
      createCollection(user.id, "Customer love");
    } catch {
      /* read-only FS: the workspace still opens */
    }
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(sessionCookie(user.id, user.email));
  return res;
}
