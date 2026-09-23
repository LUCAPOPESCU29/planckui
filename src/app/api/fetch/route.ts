const BLOCKED = /^(localhost|127\.|0\.0\.0\.0|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|\[?::1\]?$)/i;

/* Minimal same-origin proxy for keyless public APIs and RSS/OG fetching.
   HTTPS only, private addresses blocked, small text responses only. */
export async function GET(req: Request) {
  const raw = new URL(req.url).searchParams.get("url") || "";
  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    return new Response("Bad url", { status: 400 });
  }
  if (target.protocol !== "https:" || BLOCKED.test(target.hostname)) {
    return new Response("Blocked", { status: 403 });
  }
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(target, {
      signal: ctrl.signal,
      headers: { "user-agent": "PlanckUiBot/1.0 (+widget fetch)" },
      redirect: "follow",
    });
    clearTimeout(timer);
    const type = res.headers.get("content-type") || "text/plain";
    const text = (await res.text()).slice(0, 1_500_000);
    return new Response(text, {
      status: res.status,
      headers: {
        "content-type": type.startsWith("application/json") ? "application/json" : "text/plain; charset=utf-8",
        "cache-control": "public, max-age=300",
      },
    });
  } catch {
    clearTimeout(timer);
    return new Response("Fetch failed", { status: 502 });
  }
}
