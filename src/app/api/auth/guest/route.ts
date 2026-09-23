import { NextResponse } from "next/server";
import { createUser } from "@/lib/db";
import { sessionCookie } from "@/lib/auth";

/* Guest workspaces: everything the app does, no email asked. Created either
   explicitly from the login form (POST) or automatically by the middleware
   when someone lands on the dashboard with no session (GET). */

function safeNext(raw: string | null): string {
  const next = raw || "/dashboard";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
}

async function guestResponse(req: Request): Promise<NextResponse> {
  const user = await createUser(null);
  const url = new URL(req.url);
  let res: NextResponse;
  if (req.method === "GET") {
    res = NextResponse.redirect(new URL(safeNext(url.searchParams.get("next")), url.origin));
  } else {
    res = NextResponse.json({ ok: true });
  }
  res.cookies.set(sessionCookie(user.id));
  return res;
}

export async function POST(req: Request) {
  return await guestResponse(req);
}

export async function GET(req: Request) {
  return await guestResponse(req);
}
