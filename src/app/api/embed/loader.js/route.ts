import { LOADER } from "@/lib/embed-loader";

export async function GET() {
  return new Response(LOADER, {
    headers: {
      "content-type": "application/javascript; charset=utf-8",
      "cache-control": "public, max-age=300",
      "access-control-allow-origin": "*",
    },
  });
}
