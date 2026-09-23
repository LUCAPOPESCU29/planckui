import { baseCss, badgeHtml, esc, ok } from "../base";
import type { RenderResult, TestimonialData, WidgetConfig } from "../types";
import { PLATFORM_CSS, brandSvg, lines, platformCard } from "./kit";

type R = (c: WidgetConfig, items: TestimonialData[]) => RenderResult;

const SHEET = `
.plk-soc { display: flex; flex-direction: column; gap: var(--w-gap); padding: var(--w-pad); max-width: 640px; margin-inline: auto; }
.plk-socgrid { display: grid; grid-template-columns: repeat(var(--w-cols, 3), 1fr); gap: var(--w-gap); padding: var(--w-pad); }
@container (max-width: 640px) { .plk-socgrid { grid-template-columns: repeat(2, 1fr); } }
`;

function ytId(raw: string): string {
  const m = /[\w-]{11}/.exec(raw);
  return m ? m[0] : raw.trim().slice(0, 11);
}

/* ---- YouTube grid (real embeds) ---- */
export const youtubeGrid: R = (c) => {
  const rows = lines(c.items);
  const cols = Number(c.maxColumns) || 3;
  const html =
    '<div class="plk-ytgrid" style="--w-cols:' + cols + '">' +
    rows
      .map((r) => {
        const id = ytId(r.left);
        return (
          '<figure class="plk-ytitem"><div class="plk-ytframe"><iframe src="https://www.youtube-nocookie.com/embed/' +
          esc(id) + '" title="' + esc(r.right || "YouTube video") +
          '" loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>' +
          (r.right ? "<figcaption>" + esc(r.right) + "</figcaption>" : "") +
          "</figure>"
        );
      })
      .join("") +
    "</div>" + badgeHtml(c.showBadge);
  const css = baseCss(c, `
.plk-ytgrid { display: grid; grid-template-columns: repeat(var(--w-cols), 1fr); gap: var(--w-gap); padding: var(--w-pad); }
@container (max-width: 720px) { .plk-ytgrid { grid-template-columns: 1fr; } }
.plk-ytitem { margin: 0; display: flex; flex-direction: column; gap: 8px; }
.plk-ytframe { aspect-ratio: 16 / 9; border-radius: var(--w-radius); overflow: hidden;
  border: 1px solid var(--w-line); background: var(--w-card); }
.plk-ytframe iframe { width: 100%; height: 100%; border: 0; display: block; }
.plk-ytitem figcaption { font-size: 12.5px; color: var(--w-muted); }
`);
  return ok({ html, css });
};

/* ---- YouTube Shorts row ---- */
export const youtubeShortsRow: R = (c) => {
  const rows = lines(c.items);
  const html =
    '<div class="plk-shorts">' +
    rows
      .map(
        (r) =>
          '<div class="plk-short"><iframe src="https://www.youtube-nocookie.com/embed/' + esc(ytId(r.left)) +
          '" title="Short" loading="lazy" allow="encrypted-media; picture-in-picture" allowfullscreen></iframe></div>'
      )
      .join("") +
    "</div>" + badgeHtml(c.showBadge);
  const css = baseCss(c, `
.plk-shorts { display: flex; gap: var(--w-gap); overflow-x: auto; scroll-snap-type: x mandatory; padding: var(--w-pad); }
.plk-short { flex: 0 0 200px; aspect-ratio: 9 / 16; border-radius: var(--w-radius); overflow: hidden;
  border: 1px solid var(--w-line); scroll-snap-align: start; background: var(--w-card); }
.plk-short iframe { width: 100%; height: 100%; border: 0; display: block; }
`);
  return ok({ html, css });
};

function spotifyParts(url: string): { type: string; id: string } | null {
  const m = /open\.spotify\.com\/(intl-[a-z]+\/)?(track|album|playlist|artist|episode|show)\/([A-Za-z0-9]+)/.exec(url);
  return m ? { type: m[2], id: m[3] } : null;
}

/* ---- Spotify playlist / now playing (real embeds) ---- */
function spotifyEmbed(c: WidgetConfig): RenderResult {
  const parts = spotifyParts(String(c.link || ""));
  const html = parts
    ? '<div class="plk-spwrap"><iframe src="https://open.spotify.com/embed/' + parts.type + "/" + parts.id +
      '" title="Spotify player" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>' +
      badgeHtml(c.showBadge)
    : '<div class="plk-wrap"><div class="plk-soc"><p style="margin:0;color:var(--w-muted);font-size:14px">Paste a Spotify track, album or playlist URL in the editor.</p></div></div>';
  const css = baseCss(c, `
.plk-spwrap { padding: var(--w-pad); max-width: 560px; margin-inline: auto; }
.plk-spwrap iframe { width: 100%; height: 152px; border: 0; border-radius: var(--w-radius); display: block;
  box-shadow: 0 1px 2px oklch(0.25 0.02 225 / 0.04), 0 8px 28px oklch(0.25 0.02 225 / 0.07); }
`);
  return ok({ html, css });
}

export const spotifyPlaylist: R = (c) => spotifyEmbed(c);
export const nowPlaying: R = (c) => spotifyEmbed(c);

/* ---- Twitch live player (parent param set at runtime) ---- */
export const twitchStatus: R = (c) => {
  const channel = String(c.link || "").replace(/^https?:\/\/(www\.)?twitch\.tv\//, "").trim();
  const html =
    '<div class="plk-wrap"><div class="plk-twitch">' +
    (c.text ? '<div class="plk-twhead"><span class="plk-pulse" aria-hidden="true"></span><strong>' + esc(c.text) + "</strong></div>" : "") +
    '<div class="plk-twframe" id="plk-tw"><span style="color:var(--w-muted);font-size:13px">Loading player…</span></div></div>' +
    badgeHtml(c.showBadge) +
    "</div>";
  const css = baseCss(c, `
.plk-twitch { max-width: 720px; margin-inline: auto; padding: var(--w-pad); display: flex; flex-direction: column; gap: 10px; }
.plk-twhead { display: flex; align-items: center; gap: 8px; font-size: 14px; }
.plk-twhead strong { font-weight: 600; }
.plk-pulse { width: 8px; height: 8px; border-radius: 999px; background: oklch(0.58 0.2 25); }
.plk-twframe { aspect-ratio: 16 / 9; border-radius: var(--w-radius); overflow: hidden; border: 1px solid var(--w-line);
  background: var(--w-card); display: flex; align-items: center; justify-content: center; }
.plk-twframe iframe { width: 100%; height: 100%; border: 0; display: block; }
`);
  const js =
    "var host=shadow.getElementById('plk-tw');" +
    "if(host&&'" + esc(channel) + "'.length){var p=new URLSearchParams({channel:'" + esc(channel) +
    "',parent:location.hostname,muted:'true'});" +
    "host.innerHTML='';var f=document.createElement('iframe');f.src='https://player.twitch.tv/?'+p;" +
    "f.setAttribute('allowfullscreen','true');f.style.cssText='width:100%;height:100%;border:0';host.appendChild(f)}";
  return ok({ html, css, js });
};

/* ---- Generic URL-card feeds ---- */
interface CardSpec { brand: string; cta: string; grid?: boolean }
function cardFeed(spec: CardSpec): R {
  return (c) => {
    const rows = lines(c.items);
    const grid = spec.grid ?? false;
    const inner = rows
      .map((r) => {
        const title = r.right ? r.left : r.left.replace(/^https?:\/\//, "").replace(/\/$/, "");
        const sub = r.right ? r.left.replace(/^https?:\/\//, "") : "Opens on " + spec.cta.replace("Opens on ", "");
        return platformCard(spec.brand, r.left, title, sub || spec.cta);
      })
      .join("");
    const html =
      '<div class="plk-wrap">' +
      (c.text ? '<p class="plk-soclabel">' + esc(c.text) + "</p>" : "") +
      ('<div class="' + (grid ? "plk-pgrid" : "plk-soc") + '">' + inner + "</div>") +
      badgeHtml(c.showBadge) +
      "</div>";
    const css = baseCss(c, SHEET + PLATFORM_CSS + `
.plk-soclabel { text-align: center; font-size: 12.5px; letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--w-muted); margin: 0 0 14px; }
.plk-pgrid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--w-gap); padding: var(--w-pad);
  max-width: 640px; margin-inline: auto; }
@container (max-width: 480px) { .plk-pgrid { grid-template-columns: 1fr; } }
`);
    return ok({ html, css });
  };
}

export const instagramGrid = cardFeed({ brand: "instagram", cta: "Opens on Instagram", grid: true });
export const instagramCarousel = cardFeed({ brand: "instagram", cta: "Opens on Instagram" });
export const tiktokFeed = cardFeed({ brand: "tiktok", cta: "Opens on TikTok" });
export const xProfileFeed = cardFeed({ brand: "x", cta: "Opens on X" });
export const linkedinWall = cardFeed({ brand: "linkedin", cta: "Opens on LinkedIn" });
export const facebookPageFeed = cardFeed({ brand: "facebook", cta: "Opens on Facebook" });
export const pinterestBoard = cardFeed({ brand: "pinterest", cta: "Opens on Pinterest" });
export const threadsFeed = cardFeed({ brand: "threads", cta: "Opens on Threads" });
export const redditPosts = cardFeed({ brand: "reddit", cta: "Opens on Reddit" });
export const blueskyFeed = cardFeed({ brand: "bluesky", cta: "Opens on Bluesky" });
export const discordServerCard = cardFeed({ brand: "discord", cta: "Join the server" });
