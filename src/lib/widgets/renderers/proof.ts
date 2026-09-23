import { avatarHtml, baseCss as base, badgeHtml, emptyHtml, esc, ok, starsHtml } from "../base";
import type { RenderResult, TestimonialData, WidgetConfig } from "../types";
import { CARO_NAV_CSS, LIGHTBOX_CSS, carouselNavHtml, jsCarousel, jsCountUp } from "./kit";

type R = (c: WidgetConfig, items: TestimonialData[]) => RenderResult;

const CARD = `
.plk-card {
  display: flex; flex-direction: column; gap: 10px;
  background: var(--w-card); border: 1px solid var(--w-line);
  border-radius: var(--w-radius); padding: var(--w-pad);
}
.plk-card p { margin: 0; overflow-wrap: anywhere; }
.plk-author { display: flex; align-items: center; gap: 10px; margin-top: auto; padding-top: 4px; }
.plk-who { display: flex; flex-direction: column; line-height: 1.3; min-width: 0; }
.plk-who strong { font-size: 13.5px; font-weight: 600; }
.plk-role { font-size: 12.5px; color: var(--w-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
`;

function cardHtml(t: TestimonialData, withStars = true): string {
  return (
    '<article class="plk-card">' +
    (withStars && t.rating ? starsHtml(t.rating) : "") +
    "<p>" + esc(t.text) + "</p>" +
    '<div class="plk-author">' + avatarHtml(t) +
    '<div class="plk-who"><strong>' + esc(t.author) + "</strong>" +
    (t.role ? '<span class="plk-role">' + esc(t.role) + "</span>" : "") +
    "</div></div></article>"
  );
}

function guard(c: WidgetConfig, items: TestimonialData[], html: string, css: string): RenderResult {
  if (!items.length) {
    return ok({
      html:
        '<div class="plk-wrap">' +
        emptyHtml("No testimonials yet", "Share your collection link and they will appear here the moment you approve them.") +
        badgeHtml(c.showBadge) +
        "</div>",
      css: baseEmptyCss(c),
    });
  }
  return ok({ html, css });
}

function baseEmptyCss(c: WidgetConfig): string {
  return base(c, "");
}

export const wallOfLove: R = (c, items) => {
  const cols = Number(c.maxColumns) || 3;
  const variant = c.variant === "grid" ? "grid" : "masonry";
  const html =
    '<div class="plk-wrap"><div class="plk-wall ' +
    variant + '" style="--w-cols:' + cols + '">' +
    items.map((t) => cardHtml(t)).join("") +
    "</div>" +
    '<dialog class="plk-modal" id="plk-wlmodal"><div class="plk-modalcard"><button class="plk-modalx" type="button" aria-label="Close">×</button><div class="plk-wlbody"></div></div></dialog>' +
    badgeHtml(c.showBadge) +
    "</div>";
  const css = base(
    c,
    CARD +
      `
.plk-wall.masonry { columns: var(--w-cols); column-gap: var(--w-gap); }
.plk-wall.masonry .plk-card { margin-bottom: var(--w-gap); }
.plk-wall.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: var(--w-gap); }
.plk-wall .plk-card { cursor: zoom-in; }
.plk-wlbody .plk-card { cursor: default; background: transparent; border: 0; padding: 0; }
@container (max-width: 800px) { .plk-wall.masonry { columns: 2; } }
@container (max-width: 520px) { .plk-wall.masonry { columns: 1; } }
`.trim() + LIGHTBOX_CSS
  );
  const js = items.length
    ? "var modal=shadow.getElementById('plk-wlmodal'),body=modal.querySelector('.plk-wlbody');" +
      "shadow.querySelectorAll('.plk-wall .plk-card').forEach(function(card){card.addEventListener('click',function(){" +
      "body.innerHTML=card.innerHTML;modal.showModal()})});" +
      "modal.querySelector('.plk-modalx').addEventListener('click',function(){modal.close()});" +
      "modal.addEventListener('click',function(e){if(e.target===modal)modal.close()});"
    : undefined;
  return items.length ? ok({ html, css, js }) : guard(c, items, html, css);
};

export const testimonialCarousel: R = (c, items) => {
  if (!items.length) return guard(c, items, "", base(c, ""));
  const html =
    '<div class="plk-caro" tabindex="0" aria-label="Testimonials, scroll horizontally">' +
    items.map((t) => cardHtml(t)).join("") +
    "</div>" +
    (items.length > 2 ? carouselNavHtml() : "") +
    badgeHtml(c.showBadge);
  const css = base(
    c,
    CARD +
      `
.plk-caro {
  display: flex; gap: var(--w-gap); overflow-x: auto;
  scroll-snap-type: x mandatory; padding: var(--w-pad);
  scrollbar-width: thin; scrollbar-color: var(--w-line) transparent;
}
.plk-caro { scroll-behavior: smooth; }
.plk-caro { scroll-behavior: auto; }
@media (prefers-reduced-motion: no-preference) { .plk-caro { scroll-behavior: smooth; } }
.plk-caro .plk-card { flex: 0 0 min(320px, 82cqi); scroll-snap-align: start; }
.plk-caro:focus-visible { outline: 2px solid var(--w-accent); outline-offset: -2px; }
`.trim() + CARO_NAV_CSS
  );
  const js = items.length > 2 ? jsCarousel(".plk-caro") : undefined;
  return items.length ? ok({ html, css, js }) : guard(c, items, html, css);
};

export const testimonialMarquee: R = (c, items) => {
  if (!items.length) return guard(c, items, "", base(c, ""));
  const group = items.map((t) => cardHtml(t)).join("");
  const speed = Number(c.speed) || 45;
  const html =
    '<div class="plk-marq"><div class="plk-track" id="plk-mqtrack" style="--w-speed:' +
    speed + "s" + (c.variant === "right" ? ";animation-direction:reverse" : "") +
    '"><div class="plk-group">' + group + '</div><div class="plk-group" aria-hidden="true">' +
    group + "</div></div></div>" +
    '<div class="plk-mqctl"><button type="button" id="plk-mqbtn" aria-pressed="false">Pause</button></div>' +
    badgeHtml(c.showBadge);
  const css = base(
    c,
    CARD +
      `
.plk-marq { overflow: hidden; padding: var(--w-pad) 0 0; }
.plk-track { display: flex; width: max-content; animation: plk-scroll var(--w-speed) linear infinite; }
.plk-marq:hover .plk-track { animation-play-state: var(--mq, paused); }
.plk-marq.paused .plk-track { animation-play-state: paused !important; }
.plk-marq:not(:hover) .plk-track { animation-play-state: var(--run, running); }
.plk-group { display: flex; gap: var(--w-gap); padding-right: var(--w-gap); }
.plk-group .plk-card { flex: 0 0 auto; width: 300px; }
.plk-mqctl { display: flex; justify-content: center; padding: 10px var(--w-pad) 0; }
.plk-mqctl button { border: 1px solid var(--w-line); background: var(--w-card); color: var(--w-muted);
  font: inherit; font-size: 12px; font-weight: 600; border-radius: 999px; padding: 5px 14px; cursor: pointer;
  transition: color 150ms ease, border-color 150ms ease, transform 150ms cubic-bezier(0.23,1,0.32,1); }
.plk-mqctl button:hover { color: var(--w-accent); border-color: var(--w-accent); }
.plk-mqctl button:active { transform: scale(0.96); }
@keyframes plk-scroll { to { transform: translateX(-50%); } }
`.trim()
  );
  const js =
    "var btn=shadow.getElementById('plk-mqbtn'),mq=shadow.querySelector('.plk-marq');if(!btn||!mq)return;" +
    "btn.addEventListener('click',function(){var paused=mq.classList.toggle('paused');" +
    "btn.setAttribute('aria-pressed',String(paused));btn.textContent=paused?'Play':'Pause'});";
  return ok({ html, css, js });
};

export const testimonialSpotlight: R = (c, items) => {
  if (!items.length) return guard(c, items, "", base(c, ""));
  // pre-render every quote as a slide; JS toggles slides so nothing is
  // rebuilt at runtime. Deterministic start day, server and client agree.
  const idx = items.length ? Math.floor(Date.now() / 86400000) % items.length : 0;
  const nav =
    items.length > 1
      ? '<div class="plk-spnav"><button type="button" data-d="-1" aria-label="Previous quote">‹</button><span id="plk-spcount">' +
        (idx + 1) + " / " + items.length + '</span><button type="button" data-d="1" aria-label="Next quote">›</button></div>'
      : "";
  const html =
    '<div class="plk-wrap"><figure class="plk-spot">' +
    '<div class="plk-slides">' +
    items
      .map(
        (t, i) =>
          '<div class="plk-slide' + (i === idx ? " on" : "") + '"' + (i === idx ? "" : " hidden") + ">" +
          starsHtml(t.rating) +
          "<blockquote>" + esc(t.text) + "</blockquote>" +
          '<figcaption class="plk-author">' + avatarHtml(t) +
          '<div class="plk-who"><strong>' + esc(t.author) + "</strong>" +
          (t.role ? '<span class="plk-role">' + esc(t.role) + "</span>" : "") +
          "</div></figcaption></div>"
      )
      .join("") +
    "</div>" + nav + "</figure>" +
    badgeHtml(c.showBadge) +
    "</div>";
  const css = base(
    c,
    `
.plk-spot {
  max-width: 720px; margin-inline: auto; text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 16px;
  padding: var(--w-pad);
}
.plk-slide blockquote {
  font-family: ui-sans-serif, system-ui, sans-serif; font-size: 1.3rem;
  line-height: 1.45; letter-spacing: -0.01em; text-wrap: balance; margin: 0 0 14px;
}
.plk-slide .plk-author { justify-content: center; margin: 0; }
.plk-slide[hidden] { display: none; }
.plk-slide.on { animation: plk-slidein 280ms cubic-bezier(0.23,1,0.32,1); }
@keyframes plk-slidein { from { opacity: 0; transform: translateY(6px); } }
@media (prefers-reduced-motion: reduce) { .plk-slide.on { animation: none; } }
.plk-spnav { display: flex; align-items: center; gap: 12px; }
.plk-spnav button { width: 32px; height: 32px; border-radius: 999px; border: 1px solid var(--w-line);
  background: var(--w-card); color: var(--w-ink); font-size: 15px; cursor: pointer;
  transition: border-color 150ms ease, color 150ms ease, transform 150ms cubic-bezier(0.23,1,0.32,1); }
.plk-spnav button:hover { border-color: var(--w-accent); color: var(--w-accent); }
.plk-spnav button:active { transform: scale(0.92); }
.plk-spnav span { font-size: 12.5px; color: var(--w-muted); font-variant-numeric: tabular-nums; }
`.trim()
  );
  const js =
    items.length > 1
      ? "var slides=shadow.querySelectorAll('.plk-slide'),cnt=shadow.getElementById('plk-spcount');var i=" + idx + ";" +
        "function show(n){slides[i].hidden=true;slides[i].classList.remove('on');" +
        "i=(n+slides.length)%slides.length;slides[i].hidden=false;void slides[i].offsetWidth;slides[i].classList.add('on');" +
        "cnt.textContent=(i+1)+' / '+slides.length}" +
        "shadow.querySelectorAll('.plk-spnav button').forEach(function(b){b.addEventListener('click',function(){show(i+Number(b.dataset.d))})});"
      : undefined;
  return ok({ html, css, js });
};

export const ratingSummary: R = (c, items) => {
  const count = items.length;
  const avg = items.reduce((s, t) => s + (t.rating || 0), 0) / count;
  const bars = [5, 4, 3, 2, 1]
    .map((star) => {
      const n = items.filter((t) => Math.round(t.rating) === star).length;
      const pct = count ? Math.round((n / count) * 100) : 0;
      return (
        '<div class="plk-bar"><span class="plk-barlabel">' + star + " star" +
        '</span><span class="plk-bartrack"><span class="plk-barfill" data-w="' + pct + '" style="width:0%"></span></span><span class="plk-barnum">' + n + "</span></div>"
      );
    })
    .join("");
  const html =
    '<div class="plk-wrap"><div class="plk-sum">' +
    '<div class="plk-sumleft"><span class="plk-avg">' + avg.toFixed(1) + "</span>" +
    starsHtml(avg) +
    '<span class="plk-count">' + count + " review" + (count === 1 ? "" : "s") + "</span></div>" +
    '<div class="plk-bars">' + bars + "</div></div>" +
    badgeHtml(c.showBadge) +
    "</div>";
  const css = base(
    c,
    `
.plk-sum { display: flex; gap: 32px; align-items: center; padding: var(--w-pad); flex-wrap: wrap; }
.plk-sumleft { display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }
.plk-avg { font-size: 3rem; font-weight: 650; line-height: 1; letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums; color: var(--w-ink); }
.plk-count { font-size: 13px; color: var(--w-muted); }
.plk-bars { display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 220px; max-width: 380px; }
.plk-bar { display: grid; grid-template-columns: 52px 1fr 28px; align-items: center; gap: 10px; font-size: 12.5px; }
.plk-barlabel { color: var(--w-muted); }
.plk-barnum { font-variant-numeric: tabular-nums; color: var(--w-muted); text-align: right; }
.plk-bartrack { height: 6px; background: var(--w-line); border-radius: 999px; overflow: hidden; }
.plk-barfill { display: block; height: 100%; width: 0; background: var(--w-accent); border-radius: 999px;
  transition: width 900ms cubic-bezier(0.23,1,0.32,1); }
@media (prefers-reduced-motion: reduce) { .plk-barfill { transition: none; } }
`.trim()
  );
  const js =
    jsCountUp(".plk-avg", Number(avg.toFixed(1)), 1) +
    "new IntersectionObserver(function(es,o){if(!es[0].isIntersecting)return;o.disconnect();" +
    "shadow.querySelectorAll('.plk-barfill').forEach(function(b){b.style.width=b.dataset.w+'%'})},{threshold:0.4}).observe(shadow.querySelector('.plk-sum'));";
  return ok({ html, css, js });
};

export const ratingBadge: R = (c, items) => {
  const count = items.length;
  const avg = items.reduce((s, t) => s + (t.rating || 0), 0) / count;
  const html =
    '<div class="plk-wrap"><div class="plk-strip">' +
    starsHtml(avg) +
    '<strong>' + avg.toFixed(1) + "</strong>" +
    '<span>from ' + count + " review" + (count === 1 ? "" : "s") + "</span>" +
    "</div>" +
    badgeHtml(c.showBadge) +
    "</div>";
  const css = base(
    c,
    `
.plk-strip {
  display: inline-flex; align-items: center; gap: 10px;
  background: var(--w-card); border: 1px solid var(--w-line);
  border-radius: calc(var(--w-radius) + 20px);
  padding: 10px 18px; font-size: 14.5px; width: fit-content;
}
.plk-strip strong { font-size: 16px; font-variant-numeric: tabular-nums; }
.plk-strip span { color: var(--w-muted); }
`.trim()
  );
  return items.length
    ? ok({ html, css, js: jsCountUp(".plk-strip strong", Number(avg.toFixed(1)), 1) })
    : guard(c, items, html, css);
};

export const videoTestimonialWall: R = (c, items) => {
  const withVideo = items.filter((t) => t.videoUrl);
  const cols = Number(c.maxColumns) || 3;
  const html =
    '<div class="plk-wrap"><div class="plk-vwall" style="--w-cols:' + cols + '">' +
    withVideo
      .map(
        (t) =>
          '<figure class="plk-vcard">' +
          '<video controls preload="metadata" src="' + esc(t.videoUrl) + '"></video>' +
          '<figcaption class="plk-author">' + avatarHtml(t) +
          '<div class="plk-who"><strong>' + esc(t.author) + "</strong>" +
          (t.role ? '<span class="plk-role">' + esc(t.role) + "</span>" : "") +
          "</div></figcaption></figure>"
      )
      .join("") +
    "</div>" +
    badgeHtml(c.showBadge) +
    "</div>";
  const css = base(
    c,
    `
.plk-vwall { display: grid; grid-template-columns: repeat(var(--w-cols), 1fr); gap: var(--w-gap); padding: var(--w-pad); }
@container (max-width: 780px) { .plk-vwall { grid-template-columns: repeat(2, 1fr); } }
@container (max-width: 500px) { .plk-vwall { grid-template-columns: 1fr; } }
.plk-vcard { margin: 0; display: flex; flex-direction: column; gap: 10px; }
.plk-vcard video { width: 100%; aspect-ratio: 4 / 5; object-fit: cover;
  border-radius: var(--w-radius); background: var(--w-card); border: 1px solid var(--w-line); }
.plk-author { display: flex; align-items: center; gap: 10px; }
.plk-who { display: flex; flex-direction: column; line-height: 1.3; }
.plk-who strong { font-size: 13.5px; font-weight: 600; }
.plk-role { font-size: 12.5px; color: var(--w-muted); }
`.trim()
  );
  if (!withVideo.length) {
    return ok({
      html:
        '<div class="plk-wrap">' +
        emptyHtml("No video testimonials yet", "Video answers recorded in your collection form will appear here.") +
        badgeHtml(c.showBadge) +
        "</div>",
      css: baseEmptyCss(c),
    });
  }
  return ok({ html, css });
};
