import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { DEMO_TESTIMONIALS } from "./widgets/demo-data";
import { defaultsFor, getWidget } from "./widgets/registry";
import type { WidgetConfig } from "./widgets/types";

/* Data layer: durable across serverless instances. The store lives in a
   private GitHub repo (Contents API) when GITHUB_DATA_REPO/GITHUB_DATA_TOKEN
   are set — /tmp dies on every cold start and deploy — and falls back to a
   local JSON file for development. All functions are async; mutations are
   serialized per instance and written through with last-write-wins on
   concurrent instances. */

export interface User {
  id: string;
  /* null = guest workspace: everything works, no email asked for */
  email: string | null;
  createdAt: string;
}
export interface Collection {
  id: string;
  userId: string;
  name: string;
  slug: string;
  createdAt: string;
}
export type TestimonialStatus = "pending" | "approved" | "rejected";
export interface Testimonial {
  id: string;
  collectionId: string;
  author: string;
  role?: string;
  rating: number;
  text: string;
  videoUrl?: string;
  status: TestimonialStatus;
  tags: string[];
  createdAt: string;
}
export interface WidgetRecord {
  id: string;
  userId: string;
  type: string;
  name: string;
  collectionId?: string;
  config: WidgetConfig;
  createdAt: string;
}
interface DBShape {
  users: User[];
  collections: Collection[];
  testimonials: Testimonial[];
  widgets: WidgetRecord[];
}

const EMPTY: DBShape = { users: [], collections: [], testimonials: [], widgets: [] };

const DATA_DIR = process.env.PLANCKUI_DATA_DIR
  || (process.env.VERCEL === "1" ? "/tmp/planckui-data" : path.join(process.cwd(), ".data"));
const DB_PATH = path.join(DATA_DIR, "db.json");

const GH_REPO = process.env.GITHUB_DATA_REPO || "";
const GH_TOKEN = process.env.GITHUB_DATA_TOKEN || "";
const GH_API = GH_REPO ? `https://api.github.com/repos/${GH_REPO}/contents/data/db.json` : "";

interface Memo { sha: string | null; data: DBShape | null; at: number }
const g = globalThis as unknown as { __plkDb?: Memo; __plkLock?: Promise<unknown> };
const memo: Memo = g.__plkDb ?? (g.__plkDb = { sha: null, data: null, at: 0 });

function localRead(): DBShape | null {
  try {
    const parsed = JSON.parse(fs.readFileSync(DB_PATH, "utf8")) as DBShape;
    if (!parsed || !Array.isArray(parsed.users)) return null;
    return parsed;
  } catch {
    return null;
  }
}
function localWrite(db: DBShape): void {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const tmp = DB_PATH + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
    fs.renameSync(tmp, DB_PATH);
  } catch {
    /* read-only fs — memory copy keeps this instance serving */
  }
}

const ghHeaders = () => ({
  authorization: `Bearer ${GH_TOKEN}`,
  accept: "application/vnd.github+json",
  "user-agent": "planckui",
  "content-type": "application/json",
});

async function ghFetch(): Promise<DBShape> {
  const res = await fetch(GH_API, { headers: ghHeaders(), cache: "no-store" });
  if (res.status === 404) {
    memo.sha = null;
    return EMPTY;
  }
  if (!res.ok) throw new Error(`db read failed: ${res.status}`);
  const j = (await res.json()) as { sha: string; content: string };
  memo.sha = j.sha;
  const parsed = JSON.parse(Buffer.from(j.content, "base64").toString("utf8")) as DBShape;
  if (!parsed || !Array.isArray(parsed.users)) return EMPTY;
  return parsed;
}

async function ghPush(db: DBShape): Promise<void> {
  const body: Record<string, unknown> = {
    message: "planckui data sync",
    content: Buffer.from(JSON.stringify(db, null, 2), "utf8").toString("base64"),
  };
  if (memo.sha) body.sha = memo.sha;
  const res = await fetch(GH_API, {
    method: "PUT",
    headers: ghHeaders(),
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (res.status === 409 || res.status === 422) {
    // someone else wrote between our read and write — overwrite with fresh sha
    await ghFetch();
    const retry: Record<string, unknown> = {
      message: "planckui data sync (retry)",
      content: Buffer.from(JSON.stringify(db, null, 2), "utf8").toString("base64"),
    };
    if (memo.sha) retry.sha = memo.sha;
    const res2 = await fetch(GH_API, {
      method: "PUT",
      headers: ghHeaders(),
      body: JSON.stringify(retry),
      cache: "no-store",
    });
    if (!res2.ok) throw new Error(`db write failed: ${res2.status}`);
    const j2 = (await res2.json()) as { content: { sha: string } };
    memo.sha = j2.content.sha;
    return;
  }
  if (!res.ok) throw new Error(`db write failed: ${res.status}`);
  const j = (await res.json()) as { content: { sha: string } };
  memo.sha = j.content.sha;
}

async function readDb(): Promise<DBShape> {
  // short-lived memo keeps a burst of requests on one instance to one API call
  if (memo.data && Date.now() - memo.at < 3000) return memo.data;
  if (GH_API) {
    try {
      const db = await ghFetch();
      memo.data = db;
      memo.at = Date.now();
      localWrite(db); // warm-instance mirror
      return db;
    } catch {
      // GitHub unreachable: serve the freshest thing we have rather than 500
      return memo.data ?? localRead() ?? EMPTY;
    }
  }
  return localRead() ?? memo.data ?? EMPTY;
}

/* Bypasses the 3s memo for one read. Used after a miss on record getters:
   the record may have been written through by another instance a moment
   ago (create → navigate), while this one still holds a memo that predates
   that write. Refreshes the memo so follow-up reads agree. */
async function readDbFresh(): Promise<DBShape> {
  memo.at = 0;
  if (GH_API) {
    try {
      const db = await ghFetch();
      memo.data = db;
      memo.at = Date.now();
      localWrite(db);
      return db;
    } catch {
      return memo.data ?? localRead() ?? EMPTY;
    }
  }
  return localRead() ?? memo.data ?? EMPTY;
}

async function writeDb(db: DBShape): Promise<void> {
  memo.data = db;
  memo.at = Date.now();
  localWrite(db);
  if (GH_API) {
    try {
      await ghPush(db);
    } catch {
      /* stay available on the in-memory + local copy; next write retries */
    }
  }
}

/* serialize read-modify-write within this instance */
function mutate<T>(fn: (db: DBShape) => T): Promise<T> {
  const prev = g.__plkLock ?? Promise.resolve();
  const next = prev.then(async () => {
    const db = await readDb();
    const fresh = JSON.parse(JSON.stringify(db)) as DBShape; // mutate a copy
    const result = fn(fresh);
    await writeDb(fresh);
    return result;
  });
  g.__plkLock = next.catch(() => undefined);
  return next;
}

export function uid(): string {
  return crypto.randomUUID().slice(0, 12);
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40) || "collection";
}

/* ---------------------------------------------------------------- users */

export async function findUserByEmail(email: string): Promise<User | undefined> {
  return (await readDb()).users.find((u) => u.email === email.toLowerCase().trim());
}

export async function getUser(id: string): Promise<User | undefined> {
  return (await readDb()).users.find((u) => u.id === id);
}

export async function createUser(email: string | null): Promise<User> {
  return mutate((db) => {
    const user: User = {
      id: uid(),
      email: email ? email.toLowerCase().trim() : null,
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
    seedForUser(db, user.id);
    return user;
  });
}

/* Claim a guest workspace: attach an email after the fact, turning it into a
   regular account without touching its widgets or collections. */
export async function setUserEmail(id: string, email: string): Promise<User | undefined> {
  return mutate((db) => {
    const user = db.users.find((u) => u.id === id);
    if (!user) return undefined;
    user.email = email.toLowerCase().trim();
    return user;
  });
}

/* First-run seed: one collection with realistic testimonials (a mix of
   approved and pending) plus a Wall of Love, so the whole loop is
   explorable immediately. Realistic data, never lorem ipsum. */
function seedForUser(db: DBShape, userId: string): void {
  const col: Collection = {
    id: uid(),
    userId,
    name: "Customer love",
    slug: slugify("Customer love " + userId),
    createdAt: new Date().toISOString(),
  };
  db.collections.push(col);
  const now = Date.now();
  DEMO_TESTIMONIALS.forEach((t, i) => {
    db.testimonials.push({
      id: uid(),
      collectionId: col.id,
      author: t.author,
      role: t.role,
      rating: t.rating,
      text: t.text,
      status: i < 4 ? "approved" : "pending",
      tags: [],
      createdAt: new Date(now - i * 86400000).toISOString(),
    });
  });
  const def = getWidget("wall-of-love");
  db.widgets.push({
    id: uid(),
    userId,
    type: "wall-of-love",
    name: "Homepage wall",
    collectionId: col.id,
    config: { ...(def ? defaultsFor(def) : ({} as WidgetConfig)), maxWidth: 880 },
    createdAt: new Date().toISOString(),
  });
}

/* ---------------------------------------------------------------- collections */

export async function collectionsFor(userId: string): Promise<Collection[]> {
  return (await readDb()).collections.filter((c) => c.userId === userId);
}

export async function getCollection(id: string): Promise<Collection | undefined> {
  const hit = (await readDb()).collections.find((c) => c.id === id);
  if (hit) return hit;
  // miss could be the memo lagging a write that just landed on GitHub
  return (await readDbFresh()).collections.find((c) => c.id === id);
}

export async function getCollectionBySlug(slug: string): Promise<Collection | undefined> {
  const hit = (await readDb()).collections.find((c) => c.slug === slug);
  if (hit) return hit;
  return (await readDbFresh()).collections.find((c) => c.slug === slug);
}

export async function createCollection(userId: string, name: string): Promise<Collection> {
  return mutate((db) => {
    const col: Collection = {
      id: uid(),
      userId,
      name,
      slug: slugify(name + "-" + uid().slice(0, 4)),
      createdAt: new Date().toISOString(),
    };
    db.collections.push(col);
    return col;
  });
}

export async function updateCollection(id: string, patch: Partial<Pick<Collection, "name">>): Promise<void> {
  await mutate((db) => {
    const col = db.collections.find((c) => c.id === id);
    if (col && patch.name) col.name = patch.name;
  });
}

export async function deleteCollection(id: string): Promise<void> {
  await mutate((db) => {
    db.collections = db.collections.filter((c) => c.id !== id);
    db.testimonials = db.testimonials.filter((t) => t.collectionId !== id);
    db.widgets = db.widgets.filter((w) => w.collectionId !== id);
  });
}

/* ---------------------------------------------------------------- testimonials */

export async function testimonialsFor(collectionId: string): Promise<Testimonial[]> {
  return (await readDb())
    .testimonials
    .filter((t) => t.collectionId === collectionId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getTestimonial(id: string): Promise<Testimonial | undefined> {
  return (await readDb()).testimonials.find((t) => t.id === id);
}

export async function addTestimonial(
  t: Omit<Testimonial, "id" | "createdAt" | "tags"> & { tags?: string[] }
): Promise<Testimonial> {
  return mutate((db) => {
    const full: Testimonial = {
      ...t,
      id: uid(),
      tags: t.tags ?? [],
      createdAt: new Date().toISOString(),
    };
    db.testimonials.push(full);
    return full;
  });
}

export async function updateTestimonial(
  id: string,
  patch: Partial<Pick<Testimonial, "status" | "tags">>
): Promise<void> {
  await mutate((db) => {
    const t = db.testimonials.find((x) => x.id === id);
    if (!t) return;
    if (patch.status) t.status = patch.status;
    if (patch.tags) t.tags = patch.tags;
  });
}

export async function deleteTestimonial(id: string): Promise<void> {
  await mutate((db) => {
    db.testimonials = db.testimonials.filter((t) => t.id !== id);
  });
}

/* ---------------------------------------------------------------- widgets */

export async function widgetsFor(userId: string): Promise<WidgetRecord[]> {
  return (await readDb()).widgets.filter((w) => w.userId === userId);
}

export async function getWidgetRecord(id: string): Promise<WidgetRecord | undefined> {
  const hit = (await readDb()).widgets.find((w) => w.id === id);
  if (hit) return hit;
  return (await readDbFresh()).widgets.find((w) => w.id === id);
}

export async function createWidgetRecord(
  userId: string,
  data: Pick<WidgetRecord, "type" | "name" | "collectionId"> & { config?: Partial<WidgetConfig> }
): Promise<WidgetRecord> {
  return mutate((db) => {
    const def = getWidget(data.type);
    const rec: WidgetRecord = {
      id: uid(),
      userId,
      type: data.type,
      name: data.name || (def ? def.name : data.type),
      collectionId: data.collectionId,
      config: { ...defaultsFor(def!), ...data.config },
      createdAt: new Date().toISOString(),
    };
    db.widgets.push(rec);
    return rec;
  });
}

export async function updateWidgetRecord(
  id: string,
  patch: Partial<Pick<WidgetRecord, "name" | "config" | "collectionId">>
): Promise<void> {
  await mutate((db) => {
    const w = db.widgets.find((x) => x.id === id);
    if (!w) return;
    if (patch.name !== undefined) w.name = patch.name;
    if (patch.config !== undefined) w.config = patch.config;
    if (patch.collectionId !== undefined) w.collectionId = patch.collectionId;
  });
}

export async function deleteWidgetRecord(id: string): Promise<void> {
  await mutate((db) => {
    db.widgets = db.widgets.filter((w) => w.id !== id);
  });
}
