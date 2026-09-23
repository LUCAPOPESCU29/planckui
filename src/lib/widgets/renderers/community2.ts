import { avatarHtml, baseCss, badgeHtml, emptyHtml, esc, ok, starsHtml } from "../base";
import type { RenderResult, TestimonialData, WidgetConfig } from "../types";
import { SOFT, lines, qrUrl } from "./kit";

type R = (c: WidgetConfig, items: TestimonialData[]) => RenderResult;

const wrap = (c: WidgetConfig, inner: string) =>
  '<div class="plk-wrap">' + inner + badgeHtml(c.showBadge) + "</div>";

/* ---- Instagram story highlight reel ---- */
export const instagramStoryReel: R = (c) => {
  const rows = lines(c.items);
  const html =
    wrap(c, c.text ? '<p class="plk-srl">' + esc(c.text) + "</p>" : "") +
    '<div class="plk-srrow">' +
    rows
      .map(
        (r) =>
          '<a class="plk-sr" href="' + esc(r.left) + '" target="_blank" rel="noopener">' +
          '<span class="plk-srring"><img src="' + esc(r.left) + '" alt="" loading="lazy"></span>' +
          "<span>" + esc(r.right || "") + "</span></a>"
      )
      .join("") +
    "</div>";
  const css = baseCss(c, `
.plk-srl { text-align: center; font-size: 12.5px; letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--w-muted); margin: 0 0 12px; }
.plk-srrow { display: flex; gap: 18px; justify-content: center; padding: var(--w-pad); flex-wrap: wrap; }
.plk-sr { display: flex; flex-direction: column; align-items: center; gap: 6px; text-decoration: none;
  color: var(--w-ink); font-size: 12px; }
.plk-srring { width: 62px; height: 62px; border-radius: 999px; padding: 2.5px;
  background: linear-gradient(135deg, color-mix(in oklab, var(--w-accent) 80%, #fff), color-mix(in oklab, var(--w-accent) 40%, #fff));
  display: flex; }
.plk-srring img { width: 100%; height: 100%; border-radius: 999px; object-fit: cover; border: 2.5px solid var(--w-bg); }
`);
  return ok({ html, css });
};

/* ---- User video reel row ---- */
export const userVideoReelRow: R = (c) => {
  const rows = lines(c.items);
  const html =
    '<div class="plk-reel">' +
    rows
      .map(
        (r) =>
          '<figure class="plk-reelitem"><video controls preload="metadata" src="' + esc(r.left) + '" playsinline></video>' +
          (r.right ? "<figcaption>" + esc(r.right) + "</figcaption>" : "") +
          "</figure>"
      )
      .join("") +
    "</div>" + badgeHtml(c.showBadge);
  const css = baseCss(c, `
.plk-reel { display: flex; gap: var(--w-gap); overflow-x: auto; scroll-snap-type: x mandatory; padding: var(--w-pad); }
.plk-reelitem { margin: 0; flex: 0 0 190px; scroll-snap-align: start;
  display: flex; flex-direction: column; gap: 6px; }
.plk-reelitem video { width: 100%; aspect-ratio: 9 / 14; object-fit: cover; border-radius: var(--w-radius);
  border: 1px solid var(--w-line); background: var(--w-card); }
.plk-reelitem figcaption { font-size: 12px; color: var(--w-muted); text-align: center; }
`);
  return ok({ html, css });
};

/* ---- Review request link card (with QR) ---- */
export const reviewRequestLinkCard: R = (c) => {
  const url = String(c.link || "");
  const html =
    '<div class="plk-wrap"><div class="plk-rr">' +
    '<img src="' + qrUrl(url, 130) + '" alt="QR code to leave a review" width="110" height="110">' +
    "<div><strong>" + esc(c.text || "Leave a review") + "</strong><span>Scanning takes you straight there.</span>" +
    '<button class="plk-cplink" id="plk-cpl" type="button">Copy link</button></div></div></div>';
  const css = baseCss(c, `
.plk-rr { width: fit-content; margin-inline: auto; background: var(--w-card); border: 1px solid var(--w-line);
  border-radius: var(--w-radius); padding: 18px 20px; display: flex; align-items: center; gap: 16px; ${SOFT} }
.plk-rr img { border-radius: 10px; }
.plk-rr div { display: flex; flex-direction: column; gap: 3px; max-width: 220px; }
.plk-rr strong { font-size: 14.5px; font-weight: 600; }
.plk-rr span { font-size: 12.5px; color: var(--w-muted); }
.plk-cplink { border: 0; background: none; color: var(--w-accent); font: inherit; font-size: 12.5px;
  font-weight: 600; text-align: left; padding: 4px 0 0; cursor: pointer;
  transition: color 150ms ease; }
.plk-cplink:hover { text-decoration: underline; }
`);
  const js =
    "shadow.getElementById('plk-cpl').addEventListener('click',function(){" +
    "var b=this;var u=" + JSON.stringify(String(c.link || "")) + ";" +
    "(navigator.clipboard?navigator.clipboard.writeText(u):Promise.reject())" +
    ".then(function(){b.textContent='Copied';setTimeout(function(){b.textContent='Copy link'},1400)})" +
    ".catch(function(){b.textContent='Long-press the QR instead'})});";
  return ok({ html, css, js });
};

/* ---- Top reviewers leaderboard ---- */
export const topReviewersLeaderboard: R = (c) => {
  const rows = lines(c.items)
    .map((r) => ({ name: r.left, count: Number(r.right) || 0 }))
    .sort((a, b) => b.count - a.count);
  const html =
    wrap(c, '<div class="plk-lb">' +
      rows
        .map((r, i) => {
          const rank = i + 1;
          return (
            '<div class="plk-lbrow"><span class="plk-lbrank' + (rank <= 3 ? " top" : "") + '">' + rank + "</span>" +
            '<span class="plk-lbavatar" aria-hidden="true">' + esc(r.name.charAt(0).toUpperCase()) + "</span>" +
            '<span class="plk-lbname">' + esc(r.name) + '</span><span class="plk-lbcount" data-v="' + r.count + '">0</span></div>'
          );
        })
        .join("") +
      "</div>");
  const css = baseCss(c, `
.plk-lb { max-width: 400px; margin-inline: auto; padding: var(--w-pad); display: flex; flex-direction: column; gap: 8px; }
.plk-lbrow { display: flex; align-items: center; gap: 12px; background: var(--w-card);
  border: 1px solid var(--w-line); border-radius: calc(var(--w-radius) - 2px); padding: 11px 14px; }
.plk-lbrank { width: 24px; font-size: 13px; font-weight: 650; color: var(--w-muted);
  font-variant-numeric: tabular-nums; text-align: center; }
.plk-lbrank.top { color: var(--w-accent); }
.plk-lbavatar { width: 30px; height: 30px; border-radius: 999px; flex-shrink: 0;
  background: color-mix(in oklab, var(--w-accent) 14%, var(--w-card));
  color: color-mix(in oklab, var(--w-accent) 75%, var(--w-ink));
  display: inline-flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 650; }
.plk-lbname { flex: 1; font-size: 14px; font-weight: 500; min-width: 0; overflow: hidden;
  text-overflow: ellipsis; white-space: nowrap; }
.plk-lbcount { font-size: 12.5px; color: var(--w-muted); font-variant-numeric: tabular-nums; }
`);
  const js =
    "var nums=shadow.querySelectorAll('.plk-lbcount');" +
    "if(matchMedia('(prefers-reduced-motion: reduce)').matches){nums.forEach(function(n){n.textContent=n.dataset.v;return});return}" +
    "new IntersectionObserver(function(es,o){if(!es[0].isIntersecting)return;o.disconnect();" +
    "nums.forEach(function(n){var T=Number(n.dataset.v)||0,t0;" +
    "requestAnimationFrame(function step(ts){t0=t0||ts;var p=Math.min(1,(ts-t0)/800);" +
    "n.textContent=Math.round(T*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(step)})})},{threshold:0.4}).observe(shadow.querySelector('.plk-lb'));";
  return ok({ html, css, js });
};

/* ---- Community avatar stack ---- */
export const communityAvatarStack: R = (c) => {
  const rows = lines(c.items);
  const html =
    wrap(c, '<div class="plk-avstack">' +
      '<div class="plk-avimgs">' +
      rows.map((r) => '<img src="' + esc(r.left) + '" alt="" loading="lazy">').join("") +
      "</div><span>" + esc(c.text || "") + "</span></div>");
  const css = baseCss(c, `
.plk-avstack { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: var(--w-pad); }
.plk-avimgs { display: flex; }
.plk-avimgs img { width: 38px; height: 38px; border-radius: 999px; object-fit: cover;
  border: 2.5px solid var(--w-bg); margin-left: -10px; }
.plk-avimgs img:first-child { margin-left: 0; }
.plk-avstack span { font-size: 13px; color: var(--w-muted); }
`);
  return ok({ html, css });
};

/* ---- Testimonial QR poster (print-ready) ---- */
export const testimonialQrPoster: R = (c) => {
  const url = String(c.link || "");
  const html =
    wrap(c, '<div class="plk-poster">' +
      '<span class="plk-posterkick">We read everything</span>' +
      "<h3>" + esc(c.text || "Say something nice") + "</h3>" +
      '<img src="' + qrUrl(url, 260) + '" alt="QR code" width="180" height="180">' +
      "<span class=\"plk-posterfoot\">Point your camera — it takes 30 seconds.</span>" +
      "</div>");
  const css = baseCss(c, `
.plk-poster { width: fit-content; min-width: 300px; margin-inline: auto; text-align: center;
  background: var(--w-card); border: 1px solid var(--w-line); border-radius: calc(var(--w-radius) + 8px);
  padding: 34px 40px; display: flex; flex-direction: column; gap: 14px; align-items: center; ${SOFT} }
.plk-posterkick { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--w-accent);
  font-weight: 600; }
.plk-poster h3 { margin: 0; font-size: 1.5rem; font-weight: 650; letter-spacing: -0.02em; }
.plk-poster img { border-radius: 12px; border: 1px solid var(--w-line); }
.plk-posterfoot { font-size: 12.5px; color: var(--w-muted); }
`);
  return ok({ html, css });
};

/* ---- Celebration kudoboard ---- */
export const celebrationKudoboard: R = (c) => {
  const rows = lines(c.items);
  const html =
    wrap(c, (c.text ? '<h3 class="plk-kudoh">' + esc(c.text) + "</h3>" : "") +
      '<div class="plk-kudo">' +
      rows
        .map((r, i) => {
          const tilt = i % 3 === 0 ? "-1.2deg" : i % 3 === 1 ? "0.8deg" : "0deg";
          return (
            '<div class="plk-kudonote" style="--tilt:' + tilt + '"><p>' + esc(r.right || "") + "</p>" +
            "<span>— " + esc(r.left) + "</span></div>"
          );
        })
        .join("") +
      "</div>");
  const css = baseCss(c, `
.plk-kudoh { text-align: center; margin: 0 0 4px; font-size: 17px; font-weight: 650; letter-spacing: -0.01em; }
.plk-kudo { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: var(--w-gap);
  padding: var(--w-pad); max-width: 760px; margin-inline: auto; }
.plk-kudonote { background: var(--w-card); border: 1px solid var(--w-line); border-radius: var(--w-radius);
  padding: 16px; transform: rotate(var(--tilt)); display: flex; flex-direction: column; gap: 8px; ${SOFT} }
.plk-kudonote p { margin: 0; font-size: 13.5px; overflow-wrap: anywhere; }
.plk-kudonote span { font-size: 12px; color: var(--w-muted); margin-top: auto; }
@container (max-width: 480px) { .plk-kudonote { transform: none; } }
`);
  return ok({ html, css });
};

/* ---- Guestbook wall (fed by approved testimonials) ---- */
export const guestbookWall: R = (c, items) => {
  const html =
    wrap(c, (c.text ? '<h3 class="plk-kudoh">' + esc(c.text) + "</h3>" : "") +
      (items.length
        ? '<div class="plk-gb">' +
          items
            .map(
              (t) =>
                '<div class="plk-gbrow">' +
                (t.rating ? starsHtml(t.rating) : "") +
                "<p>" + esc(t.text) + "</p>" +
                '<span class="plk-gbwho">' + esc(t.author) + "</span></div>"
            )
            .join("") +
          "</div>"
        : emptyHtml("The book is blank.", "Be the first to sign it.")) +
      '<p class="plk-gbhint">New entries are moderated before they appear.</p>');
  const css = baseCss(c, `
.plk-gb { columns: 3; column-gap: var(--w-gap); padding: var(--w-pad); max-width: 860px; margin-inline: auto; }
@container (max-width: 700px) { .plk-gb { columns: 2; } }
@container (max-width: 460px) { .plk-gb { columns: 1; } }
.plk-gbrow { break-inside: avoid; background: var(--w-card); border: 1px solid var(--w-line);
  border-radius: var(--w-radius); padding: 16px; margin-bottom: var(--w-gap);
  display: flex; flex-direction: column; gap: 8px; ${SOFT} }
.plk-gbrow p { margin: 0; font-size: 13.5px; overflow-wrap: anywhere; }
.plk-gbwho { font-size: 12.5px; color: var(--w-muted); }
.plk-gbhint { text-align: center; font-size: 12px; color: var(--w-muted); margin: 8px 0 0; }
.plk-kudoh { text-align: center; margin: 0 0 4px; font-size: 17px; font-weight: 650; letter-spacing: -0.01em; }
`);
  return ok({ html, css });
};

void avatarHtml;
