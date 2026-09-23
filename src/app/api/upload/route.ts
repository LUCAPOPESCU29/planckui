import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import crypto from "node:crypto";

const MAX = 30 * 1024 * 1024; // 30 MB — enough for a few minutes of webm
const UPLOAD_DIR = process.env.PLANCKUI_DATA_DIR
  ? path.join(process.env.PLANCKUI_DATA_DIR, "uploads")
  : process.env.VERCEL === "1"
    ? "/tmp/planckui-uploads"
    : path.join(process.cwd(), ".data", "uploads");

const CORS = { "access-control-allow-origin": "*", "access-control-allow-headers": "content-type" };

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function POST(req: Request) {
  let file: File;
  try {
    const form = await req.formData();
    const f = form.get("file");
    if (!(f instanceof File)) throw new Error();
    file = f;
  } catch {
    return NextResponse.json({ error: "Upload failed." }, { status: 400, headers: CORS });
  }
  if (file.size > MAX) {
    return NextResponse.json({ error: "That video is too large (30 MB max)." }, { status: 413, headers: CORS });
  }
  const ext = file.type.includes("mp4") ? "mp4" : file.type.includes("webm") ? "webm" : null;
  if (!ext) {
    return NextResponse.json({ error: "Only video files are accepted." }, { status: 415, headers: CORS });
  }
  const name = crypto.randomUUID().slice(0, 12) + "." + ext;
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  fs.writeFileSync(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url: "/api/media/" + name }, { headers: CORS });
}
