import type { RenderResult, WidgetConfig } from "../types";
import { PLATFORM_RENDERERS } from "./platforms";

/* Bridges registry pf-* IDs to the bespoke renderers in platforms.ts,
   which are keyed by descriptive names (auth-google, x-post, ...).
   Every pf-* ID must resolve here or previews fall back to a branded card. */

type PR = (c: WidgetConfig) => RenderResult;

const PF_ALIASES: Record<string, string> = {
  // auth (12)
  "pf-google": "auth-google",
  "pf-apple": "auth-apple",
  "pf-github": "auth-github",
  "pf-x": "auth-x",
  "pf-ms": "auth-microsoft",
  "pf-slack": "auth-slack",
  "pf-discord": "auth-discord",
  "pf-spotify": "auth-spotify",
  "pf-notion": "auth-notion",
  "pf-linear": "auth-linear",
  "pf-stripe-auth": "auth-stripe",
  "pf-twitch": "auth-twitch",
  // social posts (8)
  "pf-x-post": "x-post",
  "pf-linkedin": "linkedin-post",
  "pf-reddit": "reddit-post",
  "pf-threads": "threads-post",
  "pf-facebook": "facebook-post",
  "pf-instagram": "instagram-post",
  "pf-tiktok": "tiktok-post",
  "pf-pinterest": "pinterest-pin",
  // chat & comms (6)
  "pf-whatsapp": "whatsapp-chat",
  "pf-telegram": "telegram-channel",
  "pf-messenger": "messenger-card",
  "pf-slackmsg": "slack-message",
  "pf-discord-embed": "discord-embed",
  "pf-zoom": "zoom-meeting",
  // players (5)
  "pf-steam": "steam-game",
  "pf-gplay": "play-store-app",
  "pf-yt-card": "yt-card",
  // work tools (8)
  "pf-notionpg": "notion-page",
  "pf-figma": "figma-file",
  "pf-gmail": "gmail-email",
  "pf-gdocs": "google-docs",
  "pf-gdrive": "drive-meter",
  "pf-dropbox": "dropbox-file",
  "pf-trello": "trello-board",
  "pf-github-pr": "github-pr",
  // commerce & finance (8)
  "pf-stripe-pay": "stripe-payment",
  "pf-paypal": "paypal-checkout",
  "pf-venmo": "venmo-send",
  "pf-meta": "metamask-connect",
  "pf-shopify": "shopify-order",
  "pf-airbnb": "airbnb-listing",
  "pf-uber": "uber-ride",
  "pf-tracker": "order-tracker",
  // misc & extras
  "pf-ph": "ph-launch",
  "pf-wa-cta": "wa-cta",
  "pf-ig-grid": "ig-grid",
  "pf-tg-chat": "tg-chat",
  "pf-li-banner": "li-banner",
};

export const PLATFORM_CARD_RENDERERS: Record<string, PR> = {};

for (const [pf, key] of Object.entries(PF_ALIASES)) {
  const r = PLATFORM_RENDERERS[key];
  if (r) PLATFORM_CARD_RENDERERS[pf] = r;
}
