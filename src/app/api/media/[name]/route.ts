import fs from "node:fs";
import path from "node:path";

const UPLOAD_DIR = process.env.PLANCKUI_DATA_DIR
  ? path.join(process.env.PLANCKUI_DATA_DIR, "uploads")
  : process.env.VERCEL === "1"
    ? "/tmp/planckui-uploads"
    : path.join(process.cwd(), ".data", "uploads");
const TYPES: Record<string, string> = {
  webm: "video/webm",
  mp4: "video/mp4",
};

/* Serves recorded testimonial videos. Range requests are honored because
   Safari refuses to seek in videos served without them. */
export async function GET(req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!/^[\w-]+\.(webm|mp4)$/.test(name)) {
    return new Response("Not found", { status: 404 });
  }
  const full = path.join(UPLOAD_DIR, name);
  if (!fs.existsSync(full)) return new Response("Not found", { status: 404 });
  const buf = fs.readFileSync(full);
  const type = TYPES[name.split(".").pop()!] ?? "application/octet-stream";
  const range = req.headers.get("range");

  if (range) {
    const m = /bytes=(\d*)-(\d*)/.exec(range);
    if (m) {
      const start = m[1] ? parseInt(m[1], 10) : 0;
      const end = m[2] ? parseInt(m[2], 10) : buf.length - 1;
      const slice = buf.subarray(start, end + 1);
      return new Response(new Uint8Array(slice), {
        status: 206,
        headers: {
          "content-type": type,
          "content-length": String(slice.length),
          "content-range": `bytes ${start}-${end}/${buf.length}`,
          "accept-ranges": "bytes",
          "cache-control": "public, max-age=3600",
        },
      });
    }
  }

  return new Response(new Uint8Array(buf), {
    headers: {
      "content-type": type,
      "content-length": String(buf.length),
      "accept-ranges": "bytes",
      "cache-control": "public, max-age=3600",
    },
  });
}
