import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUser, type User } from "./db";

/* v0 auth: a signed, http-only session cookie. Deliberately simple for local
   development; swap for Auth.js before exposing this publicly. */

const COOKIE = "plk_session";
const SECRET = process.env.AUTH_SECRET || "planckui-local-dev-secret";

function sign(userId: string): string {
  const mac = crypto.createHmac("sha256", SECRET).update(userId).digest("base64url");
  return userId + "." + mac;
}

function verify(token: string | undefined): string | null {
  if (!token) return null;
  const i = token.lastIndexOf(".");
  if (i < 1) return null;
  const userId = token.slice(0, i);
  const expected = sign(userId);
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b) ? userId : null;
}

export async function currentUserId(): Promise<string | null> {
  const store = await cookies();
  return verify(store.get(COOKIE)?.value);
}

export async function currentUser(): Promise<User | null> {
  const id = await currentUserId();
  return id ? (getUser(id) ?? null) : null;
}

export async function requireUser(): Promise<User> {
  const user = await currentUser();
  if (!user) redirect("/login");
  return user;
}

export function sessionCookie(userId: string) {
  return {
    name: COOKIE,
    value: sign(userId),
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  };
}

export function clearedCookie() {
  return { name: COOKIE, value: "", path: "/", maxAge: 0 };
}
