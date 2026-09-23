import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "./db";

/* v0 auth: a signed, http-only session cookie that carries the whole session
   (id + optional email). Deliberately stateless — the cookie is the source of
   truth, so sign-in works on serverless where two functions don't share a
   filesystem. The on-disk user record is best-effort local convenience; swap
   for Auth.js + a real database before exposing this publicly. */

const COOKIE = "plk_session";
const SECRET = process.env.AUTH_SECRET || "planckui-local-dev-secret";

function mac(payload: string): string {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
}

export function signSession(userId: string, email: string | null = null): string {
  const payload = email ? `${userId}|${Buffer.from(email).toString("base64url")}` : userId;
  return payload + "." + mac(payload);
}

function parseSession(token: string | undefined): { id: string; email: string | null } | null {
  if (!token) return null;
  const i = token.lastIndexOf(".");
  if (i < 1) return null;
  const payload = token.slice(0, i);
  const given = Buffer.from(token.slice(i + 1));
  const expected = Buffer.from(mac(payload));
  if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) return null;
  const bar = payload.indexOf("|");
  if (bar === -1) return { id: payload, email: null };
  const email = Buffer.from(payload.slice(bar + 1), "base64url").toString("utf8");
  return { id: payload.slice(0, bar), email: email || null };
}

export async function currentUserId(): Promise<string | null> {
  const store = await cookies();
  return parseSession(store.get(COOKIE)?.value)?.id ?? null;
}

export async function currentUser(): Promise<User | null> {
  const session = parseSession((await cookies()).get(COOKIE)?.value);
  if (!session) return null;
  return { id: session.id, email: session.email, createdAt: "" };
}

export async function requireUser(): Promise<User> {
  const user = await currentUser();
  if (!user) redirect("/login");
  return user;
}

export function sessionCookie(userId: string, email: string | null = null) {
  return {
    name: COOKIE,
    value: signSession(userId, email),
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  };
}

export function clearedCookie() {
  return { name: COOKIE, value: "", path: "/", maxAge: 0 };
}
