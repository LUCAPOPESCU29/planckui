import { esc, parseLines } from "../base";
import type { WidgetConfig } from "../types";

/* Shared building blocks for the 2026 catalog expansion. Soft, diffused
   elevation and concentric radii per the high-end-visual-design law; motion
   stays under emil's 300ms/ease-out rules. All CSS is shadow-scoped. */

export const SOFT =
  "box-shadow: 0 1px 2px oklch(0.25 0.02 225 / 0.04), 0 8px 28px oklch(0.25 0.02 225 / 0.07);";

export const TOOL_CSS = `
.plk-tool {
  max-width: 420px; margin-inline: auto; padding: 28px 26px 26px;
  background: var(--w-card);
  border: 1px solid color-mix(in oklab, var(--w-ink) 7%, var(--w-line));
  border-radius: calc(var(--w-radius) + 8px);
  box-shadow:
    0 1px 2px color-mix(in oklab, var(--w-ink) 4%, transparent),
    0 16px 40px -12px color-mix(in oklab, var(--w-ink) 10%, transparent);
}
.plk-tool h3 { font-size: 17px; font-weight: 650; letter-spacing: -0.015em; margin: 0 0 20px; }
.plk-row { display: flex; flex-direction: column; gap: 7px; margin-bottom: 16px; }
.plk-lab { font-size: 13px; font-weight: 500; color: color-mix(in oklab, var(--w-ink) 78%, var(--w-muted)); }
.plk-row input, .plk-row select, .plk-row textarea {
  font: inherit; font-size: 15px; padding: 12px 14px;
  background: var(--w-bg);
  border: 1px solid color-mix(in oklab, var(--w-ink) 8%, var(--w-line));
  border-radius: calc(var(--w-radius) + 0px);
  color: var(--w-ink); width: 100%;
  transition: border-color 200ms cubic-bezier(0.16,1,0.3,1), box-shadow 200ms cubic-bezier(0.16,1,0.3,1), background-color 200ms cubic-bezier(0.16,1,0.3,1);
  caret-color: var(--w-accent);
}
.plk-row input:hover, .plk-row select:hover, .plk-row textarea:hover {
  border-color: color-mix(in oklab, var(--w-ink) 18%, var(--w-line));
}
.plk-row input:focus, .plk-row textarea:focus, .plk-row select:focus {
  outline: none; background: var(--w-card); border-color: var(--w-accent);
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--w-accent) 16%, transparent);
}
.plk-row input::placeholder, .plk-row textarea::placeholder { color: var(--w-muted); opacity: 0.55; }
.plk-out {
  margin-top: 24px; padding: 16px 18px;
  background: var(--w-bg);
  border-radius: calc(var(--w-radius) + 2px);
}
.plk-out dt { font-size: 12px; font-weight: 500; color: var(--w-muted); margin-bottom: 3px; }
.plk-out dd {
  margin: 0 0 14px; font-size: 23px; font-weight: 650; letter-spacing: -0.025em;
  font-variant-numeric: tabular-nums; color: var(--w-ink);
}
.plk-out dd:last-child { margin-bottom: 0; }
.plk-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  border: 0; cursor: pointer; width: 100%;
  background: var(--w-ink); color: var(--w-bg);
  font: inherit; font-weight: 600; font-size: 15px; letter-spacing: -0.01em;
  padding: 13px 18px; border-radius: calc(var(--w-radius) + 0px);
  transition: background-color 200ms cubic-bezier(0.16,1,0.3,1), transform 160ms cubic-bezier(0.16,1,0.3,1);
}
.plk-btn:hover { background: color-mix(in oklab, var(--w-ink) 88%, var(--w-accent)); }
.plk-btn:active { transform: scale(0.98); }
input[type=range].plk-range { accent-color: var(--w-accent); padding: 0; width: 100%; height: 28px; }
.plk-lab.plk-center { font-size: 13px; font-weight: 500; }
`;

export function fieldRow(label: string, input: string): string {
  return '<label class="plk-row"><span class="plk-lab">' + esc(label) + "</span>" + input + "</label>";
}

export function toolShell(c: WidgetConfig, inner: string): string {
  return (
    '<div class="plk-wrap"><form class="plk-tool" id="plk-f" onsubmit="return false">' + inner + "</form>" +
    badgeWrap(c) + "</div>"
  );
}

export function badgeWrap(c: WidgetConfig): string {
  if (!c.showBadge) return "";
  return (
    '<div class="plk-badge"><a href="https://planckui.dev" target="_blank" rel="noopener">Made with PlanckUi — free</a></div>'
  );
}

export function platformMonogram(letter: string): string {
  return (
    '<span class="plk-pm" aria-hidden="true">' + esc(letter.charAt(0).toUpperCase()) + "</span>"
  );
}

export const PLATFORM_CSS = `
.plk-pcard {
  display: flex; align-items: center; gap: 14px;
  background: var(--w-card); border: 1px solid var(--w-line);
  border-radius: var(--w-radius); padding: 16px 18px;
  text-decoration: none; color: var(--w-ink); width: 100%;
  transition: border-color 180ms cubic-bezier(0.23,1,0.32,1), transform 180ms cubic-bezier(0.23,1,0.32,1);
  ${SOFT}
}
.plk-pcard:hover { border-color: color-mix(in oklab, var(--w-accent) 55%, var(--w-line)); transform: translateY(-1px); }
.plk-pcard:active { transform: scale(0.99); }
.plk-pm {
  width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: color-mix(in oklab, var(--w-accent) 14%, var(--w-card));
  color: color-mix(in oklab, var(--w-accent) 75%, var(--w-ink));
  font-weight: 650; font-size: 16px;
}
.plk-pmain { min-width: 0; flex: 1; display: flex; flex-direction: column; gap: 2px; }
.plk-ptitle { font-weight: 600; font-size: 14.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.plk-psub { font-size: 13px; color: var(--w-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.plk-parr {
  width: 30px; height: 30px; border-radius: 999px; flex-shrink: 0;
  background: color-mix(in oklab, var(--w-accent) 10%, transparent);
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; color: var(--w-accent);
  transition: transform 180ms cubic-bezier(0.23,1,0.32,1);
}
.plk-pcard:hover .plk-parr { transform: translate(1px, -1px); }
`;

export function platformCard(
  brand: string,
  url: string,
  title: string,
  sub: string
): string {
  return (
    '<a class="plk-pcard" href="' + esc(url) + '" target="_blank" rel="noopener">' +
    '<span class="plk-pm" aria-hidden="true">' + brandSvg(brand, 20) + "</span>" +
    '<span class="plk-pmain"><span class="plk-ptitle">' + esc(title) + "</span>" +
    '<span class="plk-psub">' + esc(sub) + "</span></span>" +
    '<span class="plk-parr" aria-hidden="true">↗</span></a>'
  );
}

export function qrUrl(data: string, size = 220): string {
  return (
    "https://api.qrserver.com/v1/create-qr-code/?size=" + size + "x" + size +
    "&margin=8&data=" + encodeURIComponent(data)
  );
}

export function dotStatus(status: string): { color: string; label: string } {
  const s = (status || "operational").toLowerCase();
  if (s.startsWith("deg")) return { color: "oklch(0.75 0.13 82)", label: "Degraded" };
  if (s.startsWith("down")) return { color: "oklch(0.58 0.2 25)", label: "Down" };
  return { color: "oklch(0.68 0.15 155)", label: "Operational" };
}

export const SHEET_CSS = `
.plk-sheet { max-width: 760px; margin-inline: auto; padding: var(--w-pad); }
.plk-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
.plk-head h3 { font-size: 16px; font-weight: 600; margin: 0; }
.plk-head span { font-size: 12.5px; color: var(--w-muted); }
.plk-list { display: flex; flex-direction: column; gap: var(--w-gap); }
`;

/* Simple monotonic palettes for wheel/segments */
export function segColors(n: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    const l = 0.93 - (i % 2) * 0.06;
    out.push("oklch(" + l.toFixed(2) + " 0.03 " + (200 + (i * 24) % 120) + ")");
  }
  return out;
}

export function lines(items?: string): { left: string; right?: string }[] {
  return parseLines(items);
}

export function jsEsc(s: unknown): string {
  return String(s ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/<\/script/g, "<\\/script");
}

export function hashHue(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
  return h;
}

/* ------------------------------------------------------------ interaction kit
   Shared behaviors injected as per-widget `js`. Every snippet respects
   prefers-reduced-motion and only animates transform/opacity (emil law). */

export const CARO_NAV_CSS = `
.plk-cnav { display: flex; gap: 8px; justify-content: center; padding: 2px var(--w-pad) 14px; }
.plk-cnav button { width: 34px; height: 34px; border-radius: 999px; border: 1px solid var(--w-line);
  background: var(--w-card); color: var(--w-ink); font-size: 16px; line-height: 1; cursor: pointer;
  transition: border-color 150ms ease, color 150ms ease, transform 150ms cubic-bezier(0.23,1,0.32,1); }
.plk-cnav button:hover { border-color: var(--w-accent); color: var(--w-accent); }
.plk-cnav button:active { transform: scale(0.92); }
`;

export function carouselNavHtml(): string {
  return (
    '<div class="plk-cnav">' +
    '<button type="button" data-dir="-1" aria-label="Previous">‹</button>' +
    '<button type="button" data-dir="1" aria-label="Next">›</button></div>'
  );
}

export function jsCarousel(trackSel: string): string {
  return (
    "var track=shadow.querySelector('" + trackSel + "');if(!track)return;" +
    "shadow.querySelectorAll('.plk-cnav button').forEach(function(b){b.addEventListener('click',function(){" +
    "var smooth=!matchMedia('(prefers-reduced-motion: reduce)').matches;" +
    "track.scrollBy({left:Number(b.dataset.dir)*track.clientWidth*0.8,behavior:smooth?'smooth':'auto'})})});"
  );
}

export const REVEAL_CSS = `
.plk-rv { opacity: 0; transform: translateY(10px); transition: opacity 500ms cubic-bezier(0.23,1,0.32,1), transform 500ms cubic-bezier(0.23,1,0.32,1); }
.plk-rv.in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .plk-rv { opacity: 1; transform: none; transition: none; } }
`;

export function jsReveal(itemSel: string): string {
  return (
    "var items=shadow.querySelectorAll('" + itemSel + "');" +
    "if(matchMedia('(prefers-reduced-motion: reduce)').matches){items.forEach(function(i){i.classList.add('in')});return}" +
    "var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:0.2});" +
    "items.forEach(function(i,idx){i.style.transitionDelay=Math.min(idx*60,360)+'ms';io.observe(i)});"
  );
}

export function jsCountUp(sel: string, to: number, decimals = 0, suffix = ""): string {
  const fmt = "T.toLocaleString(undefined,{minimumFractionDigits:" + decimals + ",maximumFractionDigits:" + decimals + "})+'" + suffix + "'";
  return (
    "(function(){var el=shadow.querySelector('" + sel + "');if(!el)return;var T=" + to + ";" +
    "if(matchMedia('(prefers-reduced-motion: reduce)').matches){el.textContent=" + fmt + ";return}" +
    "new IntersectionObserver(function(es,o){if(!es[0].isIntersecting)return;o.disconnect();" +
    "var t0;requestAnimationFrame(function step(ts){t0=t0||ts;var p=Math.min(1,(ts-t0)/900);" +
    "el.textContent=(T*(1-Math.pow(1-p,3))).toLocaleString(undefined,{minimumFractionDigits:" + decimals + ",maximumFractionDigits:" + decimals + "})+'" + suffix + "';" +
    "if(p<1)requestAnimationFrame(step)})},{threshold:0.4}).observe(el)})();"
  );
}

export const LIGHTBOX_CSS = `
.plk-modal { border: 0; padding: 0; background: transparent; max-width: 92vw; }
.plk-modalcard { position: relative; background: var(--w-bg); border: 1px solid var(--w-line);
  border-radius: var(--w-radius); padding: 24px 26px; max-width: 480px; ${SOFT} }
.plk-modal::backdrop { background: oklch(0 0 0 / 0.55); }
.plk-modalx { position: absolute; top: 8px; right: 10px; border: 0; background: none; color: var(--w-muted);
  font-size: 20px; cursor: pointer; padding: 4px 8px; }
`;

export const MORE_BTN_CSS = `
.plk-more { display: block; margin: 14px auto 0; border: 1px solid var(--w-line); background: var(--w-card);
  color: var(--w-accent); font: inherit; font-size: 13px; font-weight: 600; border-radius: 999px;
  padding: 8px 18px; cursor: pointer; transition: border-color 150ms ease, transform 150ms cubic-bezier(0.23,1,0.32,1); }
.plk-more:hover { border-color: var(--w-accent); }
.plk-more:active { transform: scale(0.97); }
`;

export function jsShowMore(listSel: string, max: number): string {
  return (
    "var list=shadow.querySelector('" + listSel + "');if(!list)return;" +
    "var kids=Array.prototype.slice.call(list.children);if(kids.length<=" + max + ")return;" +
    "kids.slice(" + max + ").forEach(function(k){k.style.display='none'});" +
    "var b=document.createElement('button');b.className='plk-more';b.type='button';" +
    "b.textContent='Show '+(kids.length-" + max + ")+' more';list.after(b);" +
    "var open=false;b.addEventListener('click',function(){open=!open;" +
    "kids.slice(" + max + ").forEach(function(k){k.style.display=open?'':'none'});" +
    "b.textContent=open?'Show less':'Show '+(kids.length-" + max + ")+' more'});"
  );
}

/* ------------------------------------------------------------ brand marks
   Standard 24×24 brand paths (simple-icons set), fill currentColor unless a
   brand ships its own colors (Google). */

export const BRAND_PATHS: Record<string, string> = {
  x: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
  instagram:
    "M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.795.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z",
  tiktok:
    "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
  youtube:
    "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z",
  facebook:
    "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  pinterest:
    "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z",
  threads:
    "M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c2.486.014 4.209 1.557 4.598 4.04.053.343.087.699.102 1.068.703.313 1.317.729 1.826 1.243 1.157 1.168 1.489 2.773 1.522 4.018.045 1.9-.577 3.579-1.8 4.853-1.893 1.932-4.271 2.287-6.818 2.187zm3.207-9.407c-.43 0-.88.023-1.34.069-1.414.08-2.229.506-2.679.897-.499.431-.741.966-.713 1.593.05 1.033.936 1.748 2.263 1.748h.036c1.61-.084 2.497-1.021 2.655-3.408a10.9 10.9 0 0 0-.222-.09z",
  reddit:
    "M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z",
  bluesky:
    "M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 0-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z",
  discord:
    "M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.865-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.058a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z",
  twitch:
    "M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0 1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z",
  spotify:
    "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z",
  whatsapp:
    "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z",
  github:
    "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  apple:
    "M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.359 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701",
  producthunt:
    "M12 0C5.373 0 0 5.372 0 12c0 6.626 5.373 12 12 12s12-5.372 12-12c0-6.627-5.373-12-12-12zm1.679 12H10.5V8.25h3.179c1.038 0 1.821.846 1.821 1.875s-.783 1.875-1.821 1.875zM10.5 6.75h4.679c2.453 0 4.321 1.875 4.321 4.375S17.632 15.5 15.179 15.5H12v3.75H10.5z",
  chrome:
    "M12 0C8.21 0 4.831 1.757 2.632 4.501l3.953 6.848A5.454 5.454 0 0 1 12 6.545h10.691A12 12 0 0 0 12 0zM1.931 5.47A11.943 11.943 0 0 0 0 12c0 6.012 4.42 10.991 10.189 11.864l3.953-6.847a5.45 5.45 0 0 1-6.865-2.29zm13.342 2.166a5.446 5.446 0 0 1 1.45 7.09l.002.001h-.002l-5.344 9.257c.206.013.416.02.621.02 6.627 0 12-5.373 12-12 0-1.54-.29-3.011-.818-4.368zM12 16.364a4.364 4.364 0 1 1 0-8.728 4.364 4.364 0 0 1 0 8.728z",
  steam:
    "M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59l.065.003 2.869-4.154V8.92c-.004-.052-.004-.104-.004-.158 0-2.491 2.028-4.52 4.52-4.52 2.491 0 4.519 2.029 4.519 4.52 0 2.492-2.028 4.521-4.519 4.521h-.105l-4.076 2.911c.001.043.003.085.003.129 0 1.862-1.51 3.376-3.377 3.376-1.632 0-2.997-1.164-3.307-2.706L.111 15.653C1.539 20.547 6.03 24.007 11.979 24.007c6.627 0 12.001-5.373 12.001-12.001 0-6.629-5.374-12.006-12.001-12.006zM7.54 18.475l-1.469-.607a2.542 2.542 0 0 0 1.324 1.334c1.31.543 2.818-.083 3.36-1.395.263-.635.264-1.335.002-1.971a2.583 2.583 0 0 0-1.398-1.398l-.006-.002c-.634-.262-1.335-.261-1.969.002a2.545 2.545 0 0 0-1.4 1.328l1.519.629a1.473 1.473 0 0 0 .735 1.395c.682.4 1.558.174 1.958-.508.209-.36.259-.8.131-1.2a1.49 1.49 0 0 0-.797-.898l-.023-.01zm9.875-11.624c-1.657 0-3.004 1.346-3.004 3.003s1.347 3.003 3.004 3.003c1.658 0 3.003-1.346 3.003-3.003s-1.345-3.003-3.003-3.003zm.002 4.715a1.716 1.716 0 0 1-1.715-1.713 1.715 1.715 0 1 1 3.429.003 1.716 1.716 0 0 1-1.714 1.71z",
  strava:
    "M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169",
};

export function brandSvg(name: string, size = 20): string {
  if (name === "google") {
    return (
      '<svg viewBox="0 0 48 48" width="' + size + '" height="' + size + '" aria-hidden="true">' +
      '<path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>' +
      '<path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>' +
      '<path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>' +
      '<path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>' +
      "</svg>"
    );
  }
  const d = BRAND_PATHS[name];
  if (!d) return "";
  return (
    '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="currentColor" aria-hidden="true"><path d="' + d + '"/></svg>'
  );
}
