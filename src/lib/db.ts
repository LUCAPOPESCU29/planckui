import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { DEMO_TESTIMONIALS } from "./widgets/demo-data";
import { defaultsFor, getWidget } from "./widgets/registry";
import type { WidgetConfig } from "./widgets/types";

/* v0 data layer: a typed JSON file store with an interface shaped exactly like
   the future Prisma/Postgres repositories, so the swap is mechanical. */

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

const DATA_DIR = process.env.PLANCKUI_DATA_DIR
  || (process.env.VERCEL === "1" ? "/tmp/planckui-data" : path.join(process.cwd(), ".data"));
const DB_PATH = path.join(DATA_DIR, "db.json");

function read(): DBShape {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf8")) as DBShape;
  } catch {
    return { users: [], collections: [], testimonials: [], widgets: [] };
  }
}

function write(db: DBShape): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = DB_PATH + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, DB_PATH);
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

export function findUserByEmail(email: string): User | undefined {
  return read().users.find((u) => u.email === email.toLowerCase().trim());
}

export function getUser(id: string): User | undefined {
  return read().users.find((u) => u.id === id);
}

export function createUser(email: string | null): User {
  const db = read();
  const user: User = {
    id: uid(),
    email: email ? email.toLowerCase().trim() : null,
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  write(db);
  seedForUser(user.id);
  return user;
}

/* Claim a guest workspace: attach an email after the fact, turning it into a
   regular account without touching its widgets or collections. */
export function setUserEmail(id: string, email: string): User | undefined {
  const db = read();
  const user = db.users.find((u) => u.id === id);
  if (!user) return undefined;
  user.email = email.toLowerCase().trim();
  write(db);
  return user;
}

/* First-run seed: one collection with realistic testimonials (a mix of
   approved and pending) plus a Wall of Love, so the whole loop is
   explorable immediately. Realistic data, never lorem ipsum. */
export function seedForUser(userId: string): void {
  const db = read();
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
  write(db);
}

/* ---------------------------------------------------------------- collections */

export function collectionsFor(userId: string): Collection[] {
  return read().collections.filter((c) => c.userId === userId);
}

export function getCollection(id: string): Collection | undefined {
  return read().collections.find((c) => c.id === id);
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return read().collections.find((c) => c.slug === slug);
}

export function createCollection(userId: string, name: string): Collection {
  const db = read();
  const col: Collection = {
    id: uid(),
    userId,
    name,
    slug: slugify(name + "-" + uid().slice(0, 4)),
    createdAt: new Date().toISOString(),
  };
  db.collections.push(col);
  write(db);
  return col;
}

export function updateCollection(id: string, patch: Partial<Pick<Collection, "name">>): void {
  const db = read();
  const col = db.collections.find((c) => c.id === id);
  if (!col) return;
  if (patch.name) col.name = patch.name;
  write(db);
}

export function deleteCollection(id: string): void {
  const db = read();
  db.collections = db.collections.filter((c) => c.id !== id);
  db.testimonials = db.testimonials.filter((t) => t.collectionId !== id);
  db.widgets = db.widgets.filter((w) => w.collectionId !== id);
  write(db);
}

/* ---------------------------------------------------------------- testimonials */

export function testimonialsFor(collectionId: string): Testimonial[] {
  return read().testimonials
    .filter((t) => t.collectionId === collectionId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getTestimonial(id: string): Testimonial | undefined {
  return read().testimonials.find((t) => t.id === id);
}

export function addTestimonial(
  t: Omit<Testimonial, "id" | "createdAt" | "tags"> & { tags?: string[] }
): Testimonial {
  const db = read();
  const full: Testimonial = {
    ...t,
    id: uid(),
    tags: t.tags ?? [],
    createdAt: new Date().toISOString(),
  };
  db.testimonials.push(full);
  write(db);
  return full;
}

export function updateTestimonial(
  id: string,
  patch: Partial<Pick<Testimonial, "status" | "tags">>
): void {
  const db = read();
  const t = db.testimonials.find((x) => x.id === id);
  if (!t) return;
  if (patch.status) t.status = patch.status;
  if (patch.tags) t.tags = patch.tags;
  write(db);
}

export function deleteTestimonial(id: string): void {
  const db = read();
  db.testimonials = db.testimonials.filter((t) => t.id !== id);
  write(db);
}

/* ---------------------------------------------------------------- widgets */

export function widgetsFor(userId: string): WidgetRecord[] {
  return read().widgets.filter((w) => w.userId === userId);
}

export function getWidgetRecord(id: string): WidgetRecord | undefined {
  return read().widgets.find((w) => w.id === id);
}

export function createWidgetRecord(
  userId: string,
  data: Pick<WidgetRecord, "type" | "name" | "collectionId"> & { config?: Partial<WidgetConfig> }
): WidgetRecord {
  const db = read();
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
  write(db);
  return rec;
}

export function updateWidgetRecord(
  id: string,
  patch: Partial<Pick<WidgetRecord, "name" | "config" | "collectionId">>
): void {
  const db = read();
  const w = db.widgets.find((x) => x.id === id);
  if (!w) return;
  if (patch.name !== undefined) w.name = patch.name;
  if (patch.config !== undefined) w.config = patch.config;
  if (patch.collectionId !== undefined) w.collectionId = patch.collectionId;
  write(db);
}

export function deleteWidgetRecord(id: string): void {
  const db = read();
  db.widgets = db.widgets.filter((w) => w.id !== id);
  write(db);
}
