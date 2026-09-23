import { avatarHtml, baseCss as base, badgeHtml, emptyHtml, esc, ok, starsHtml } from "../base";
import type { RenderResult, TestimonialData, WidgetConfig } from "../types";
import { SHEET_CSS, SOFT, CARO_NAV_CSS, LIGHTBOX_CSS, MORE_BTN_CSS, REVEAL_CSS, brandSvg, carouselNavHtml, jsCarousel, jsCountUp, jsReveal, jsShowMore, lines } from "./kit";

type R = (c: WidgetConfig, items: TestimonialData[]) => RenderResult;

const wrapOpen = '<div class="plk-wrap"><div class="plk-sheet">';
const wrapClose = (c: WidgetConfig) => "</div>" + badgeHtml(c.showBadge) + "</div>";

const CARDQ = `
.plk-quote {
  background: var(--w-card); border: 1px solid var(--w-line);
  border-radius: var(--w-radius); padding: var(--w-pad); ${SOFT}
  display: flex; flex-direction: column; gap: 10px; break-inside: avoid;
}
.plk-quote p { margin: 0; font-size: 14.5px; overflow-wrap: anywhere; }
.plk-meta { display: flex; align-items: center; gap: 10px; margin-top: auto; }
.plk-meta strong { font-size: 13.5px; font-weight: 600; }
.plk-meta span { font-size: 12.5px; color: var(--w-muted); }
`;

/* ---- X / Twitter wall ---- */
export const tweetWall: R = (c) => {
  const rows = lines(c.items).map((r) => {
    const segs = (r.right || "").split("|").map((s) => s.trim());
    return { url: r.left, text: segs[0] || "", author: segs[1] || "" };
  });
  const html =
    wrapOpen +
    '<div class="plk-masonry">' +
    rows
      .map(
        (r) =>
          '<a class="plk-quote" href="' + esc(r.url) + '" target="_blank" rel="noopener" style="text-decoration:none;color:inherit">' +
          '<span class="plk-xmono" aria-hidden="true">' + brandSvg("x", 12) + "</span>" +
          (r.text ? "<p>" + esc(r.text) + "</p>" : "") +
          '<span class="plk-meta"><strong>' +
          esc(r.author || r.url.replace(/^https?:\/\/(www\.)?(x|twitter)\.com\//, "@").replace(/\/.*$/, "")) +
          "</strong><span>opens on X ↗</span></span></a>"
      )
      .join("") +
    "</div>" + wrapClose(c);
  const css = base(c, CARDQ + `
.plk-masonry { columns: 3; column-gap: var(--w-gap); }
@container (max-width: 780px) { .plk-masonry { columns: 2; } }
@container (max-width: 500px) { .plk-masonry { columns: 1; } }
.plk-xmono { width: 26px; height: 26px; border-radius: 8px; display: flex; align-items: center; justify-content: center;
  background: var(--w-ink); color: var(--w-bg); font-weight: 700; font-size: 12px; }
` + MORE_BTN_CSS);
  return ok({ html, css, js: jsShowMore(".plk-masonry", 6) });
};

/* ---- Google Reviews wall + badge ---- */
const G_CSS = `
.plk-ghead { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.plk-gmono { width: 30px; height: 30px; border-radius: 9px; background: var(--w-card); border: 1px solid var(--w-line);
  display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; color: var(--w-ink); }
`;

function reviewRows(c: WidgetConfig) {
  return lines(c.items).map((r) => {
    const [rating, ...rest] = (r.right || "").split("|");
    return { name: r.left, rating: Math.max(0, Math.min(5, Math.round(Number(rating) || 0))), text: rest.join("|").trim() };
  });
}

export const googleReviewsWall: R = (c) => {
  const rows = reviewRows(c);
  const html =
    wrapOpen +
    '<div class="plk-ghead"><span class="plk-gmono">' + brandSvg("google", 18) + "</span><h3 style=\"margin:0;font-size:15px;font-weight:600\">" +
    esc(c.text || "Google reviews") + "</h3></div>" +
    '<div class="plk-masonry">' +
    rows
      .map(
        (r) =>
          '<div class="plk-quote">' + (r.rating ? starsHtml(r.rating) : "") + "<p>" + esc(r.text) +
          '</p><span class="plk-meta"><strong>' + esc(r.name) + '</strong><span>via Google</span></span></div>'
      )
      .join("") +
    "</div>" + wrapClose(c);
  const css = base(c, CARDQ + G_CSS + `
.plk-masonry { columns: 3; column-gap: var(--w-gap); }
@container (max-width: 780px) { .plk-masonry { columns: 2; } }
@container (max-width: 500px) { .plk-masonry { columns: 1; } }
` + MORE_BTN_CSS);
  return ok({ html, css, js: jsShowMore(".plk-masonry", 6) });
};

export const googleRatingBadge: R = (c) => {
  const rows = reviewRows(c);
  const count = rows.length;
  const avg = count ? rows.reduce((s, r) => s + r.rating, 0) / count : 0;
  const html =
    wrapOpen +
    '<div class="plk-strip"><span class="plk-gmono">' + brandSvg("google", 16) + "</span>" + starsHtml(avg) +
    "<strong>" + avg.toFixed(1) + "</strong><span>from " + count + " Google review" + (count === 1 ? "" : "s") + "</span></div>" +
    wrapClose(c);
  const css = base(c, G_CSS + `
.plk-strip { display: inline-flex; align-items: center; gap: 10px; background: var(--w-card);
  border: 1px solid var(--w-line); border-radius: 999px; padding: 10px 18px; width: fit-content;
  font-size: 14.5px; ${SOFT} }
.plk-strip strong { font-size: 16px; font-variant-numeric: tabular-nums; }
.plk-strip span:last-child { color: var(--w-muted); }
`);
  return ok({ html, css, js: jsCountUp(".plk-strip strong", Number(avg.toFixed(1)), 1) });
};

/* ---- Product reviews carousel ---- */
export const productReviewsCarousel: R = (c) => {
  const rows = lines(c.items).map((r) => {
    const [rating, text, author] = (r.right || "").split("|").map((s) => s.trim());
    return { product: r.left, rating: Math.round(Number(rating) || 0), text: text || "", author: author || "" };
  });
  const html =
    '<div class="plk-caro" tabindex="0" aria-label="Product reviews">' +
    rows
      .map(
        (r) =>
          '<div class="plk-quote"><span class="plk-chip">' + esc(r.product) + "</span>" +
          (r.rating ? starsHtml(r.rating) : "") + "<p>" + esc(r.text) + "</p>" +
          (r.author ? '<span class="plk-meta"><strong>' + esc(r.author) + "</strong></span>" : "") +
          "</div>"
      )
      .join("") +
    "</div>" +
    (rows.length > 2 ? carouselNavHtml() : "") +
    badgeHtml(c.showBadge);
  const css = base(c, CARDQ + `
.plk-caro { display: flex; gap: var(--w-gap); overflow-x: auto; scroll-snap-type: x mandatory;
  padding: var(--w-pad); scrollbar-width: thin; }
.plk-caro { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) { .plk-caro { scroll-behavior: auto; } }
.plk-caro .plk-quote { flex: 0 0 min(280px, 80cqi); scroll-snap-align: start; }
.plk-chip { width: fit-content; font-size: 11.5px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase;
  color: var(--w-accent); background: color-mix(in oklab, var(--w-accent) 10%, transparent);
  border-radius: 999px; padding: 3px 10px; }
` + CARO_NAV_CSS);
  return ok({ html, css, js: rows.length > 2 ? jsCarousel(".plk-caro") : undefined });
};

/* ---- Case study card ---- */
export const caseStudyCard: R = (c) => {
  const segs = String(c.text || "").split("|").map((s) => s.trim());
  const [headline, result, quote, author] = segs;
  const html =
    wrapOpen +
    '<div class="plk-case">' +
    '<span class="plk-caseresult">' + esc(result || "") + "</span>" +
    '<h3 class="plk-caseh">' + esc(headline || "") + "</h3>" +
    (quote ? "<p>“" + esc(quote) + "”</p>" : "") +
    '<div class="plk-casefoot"><strong>' + esc(author || "") + "</strong>" +
    (c.link
      ? '<a class="plk-btn" href="' + esc(c.link) + '" target="_blank" rel="noopener">Read the story ↗</a>'
      : "") +
    "</div></div>" + wrapClose(c);
  const css = base(c, `
.plk-case { border: 1px solid var(--w-line); border-radius: var(--w-radius); background: var(--w-card);
  padding: calc(var(--w-pad) + 8px); display: flex; flex-direction: column; gap: 14px; ${SOFT} }
.plk-caseresult { width: fit-content; font-size: 13px; font-weight: 650; color: var(--w-accent);
  background: color-mix(in oklab, var(--w-accent) 10%, transparent); padding: 5px 12px; border-radius: 999px; }
.plk-caseh { margin: 0; font-size: 1.35rem; font-weight: 650; letter-spacing: -0.015em; }
.plk-case p { margin: 0; color: var(--w-muted); font-size: 15px; max-width: 60ch; }
.plk-casefoot { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.plk-casefoot strong { font-size: 13.5px; font-weight: 600; }
.plk-btn { display: inline-flex; background: var(--w-accent); color: #fff; text-decoration: none;
  font-weight: 600; font-size: 13.5px; padding: 9px 16px; border-radius: 999px;
  transition: transform 160ms cubic-bezier(0.23,1,0.32,1), filter 160ms ease; }
.plk-btn:hover { filter: brightness(1.06); }
.plk-btn:active { transform: scale(0.97); }
`);
  return ok({ html, css });
};

/* ---- Customer story spotlight ---- */
export const customerStorySpotlight: R = (c) => {
  const stories = lines(c.items).map((r) => {
    const [role, quote, fact] = (r.right || "").split("|").map((s) => s.trim());
    return { name: r.left, role: role || "", quote: quote || "", fact: fact || "" };
  });
  const nav =
    stories.length > 1
      ? '<div class="plk-spnav"><button type="button" data-d="-1" aria-label="Previous story">‹</button><span id="plk-stcount">1 / ' +
        stories.length + '</span><button type="button" data-d="1" aria-label="Next story">›</button></div>'
      : "";
  const html =
    wrapOpen +
    '<figure class="plk-story">' +
    '<div class="plk-slides">' +
    stories
      .map(
        (s, i) =>
          '<div class="plk-sslide' + (i === 0 ? " on" : "") + '"' + (i === 0 ? "" : " hidden") + ">" +
          '<span class="plk-storyfact">' + esc(s.fact) + "</span>" +
          "<blockquote>“" + esc(s.quote) + "”</blockquote>" +
          '<figcaption><strong>' + esc(s.name) + "</strong><span>" + esc(s.role) + "</span></figcaption></div>"
      )
      .join("") +
    "</div>" + nav + "</figure>" + wrapClose(c);
  const css = base(c, `
.plk-story { margin: 0; border: 1px solid var(--w-line); border-radius: var(--w-radius);
  background: var(--w-card); padding: calc(var(--w-pad) + 10px);
  display: flex; flex-direction: column; gap: 16px; ${SOFT} }
.plk-sslide[hidden] { display: none; }
.plk-sslide { display: flex; flex-direction: column; gap: 16px; }
.plk-sslide.on { animation: plk-ssin 280ms cubic-bezier(0.23,1,0.32,1); }
@keyframes plk-ssin { from { opacity: 0; transform: translateY(6px); } }
@media (prefers-reduced-motion: reduce) { .plk-sslide.on { animation: none; } }
.plk-storyfact { width: fit-content; font-size: 12.5px; font-weight: 600; letter-spacing: 0.02em;
  color: var(--w-accent); border: 1px solid color-mix(in oklab, var(--w-accent) 35%, var(--w-line));
  padding: 4px 12px; border-radius: 999px; }
.plk-story blockquote { margin: 0; font-size: 1.25rem; line-height: 1.45; letter-spacing: -0.01em; text-wrap: balance; }
.plk-story figcaption { display: flex; flex-direction: column; gap: 2px; }
.plk-story figcaption strong { font-size: 14px; font-weight: 600; }
.plk-story figcaption span { font-size: 13px; color: var(--w-muted); }
.plk-spnav { display: flex; align-items: center; gap: 12px; justify-content: flex-end; }
.plk-spnav button { width: 32px; height: 32px; border-radius: 999px; border: 1px solid var(--w-line);
  background: var(--w-bg); color: var(--w-ink); font-size: 15px; cursor: pointer;
  transition: border-color 150ms ease, color 150ms ease, transform 150ms cubic-bezier(0.23,1,0.32,1); }
.plk-spnav button:hover { border-color: var(--w-accent); color: var(--w-accent); }
.plk-spnav button:active { transform: scale(0.92); }
.plk-spnav span { font-size: 12.5px; color: var(--w-muted); font-variant-numeric: tabular-nums; }
`);
  const js =
    stories.length > 1
      ? "var slides=shadow.querySelectorAll('.plk-sslide'),cnt=shadow.getElementById('plk-stcount');var i=0;" +
        "function show(n){slides[i].hidden=true;slides[i].classList.remove('on');" +
        "i=(n+slides.length)%slides.length;slides[i].hidden=false;void slides[i].offsetWidth;slides[i].classList.add('on');" +
        "cnt.textContent=(i+1)+' / '+slides.length}" +
        "shadow.querySelectorAll('.plk-spnav button').forEach(function(b){b.addEventListener('click',function(){show(i+Number(b.dataset.d))})});"
      : undefined;
  return ok({ html, css, js });
};

/* ---- Comparison table ---- */
export const testimonialComparisonTable: R = (c) => {
  const rows = lines(c.items);
  const segs = String(c.text || "Before → After").split("|");
  const html =
    wrapOpen +
    '<div class="plk-cmp">' +
    '<div class="plk-cmprow plk-cmphead"><span>' + esc(segs[0] || "") + "</span><span>" +
    esc(segs[1] || "Before") + "</span><span>" + esc(segs[2] || "After") + "</span></div>" +
    rows
      .map((r) => {
        const [before, after] = (r.right || "").split("|").map((s) => s.trim());
        return (
          '<div class="plk-cmprow"><span>' + esc(r.left) + "</span><span class='plk-old'>" + esc(before || "") +
          "</span><span class='plk-new'>" + esc(after || "") + "</span></div>"
        );
      })
      .join("") +
    "</div>" + wrapClose(c);
  const css = base(c, `
.plk-cmp { border: 1px solid var(--w-line); border-radius: var(--w-radius); overflow: hidden; background: var(--w-card); }
.plk-cmprow { display: grid; grid-template-columns: 1.1fr 1fr 1fr; gap: 10px; padding: 13px 18px;
  font-size: 14px; border-bottom: 1px solid var(--w-line); }
.plk-cmprow:last-child { border-bottom: 0; }
.plk-cmphead { font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--w-muted);
  background: var(--w-card); font-weight: 600; }
.plk-old { color: var(--w-muted); }
.plk-new { font-weight: 600; color: var(--w-accent); }
@container (max-width: 480px) { .plk-cmprow { grid-template-columns: 1fr 1fr; }
  .plk-cmprow > span:first-child { grid-column: 1 / -1; font-weight: 600; } }
`);
  return ok({ html, css });
};

/* ---- Press logos ---- */
export const pressLogos: R = (c) => {
  const rows = lines(c.items);
  const html =
    wrapOpen +
    (c.text ? '<p class="plk-presslabel">' + esc(c.text) + "</p>" : "") +
    '<div class="plk-mq"><div class="plk-mqtrack" style="animation-duration:' + (Number(c.speed) || 40) + 's">' +
    '<div class="plk-mqgroup">' + rows.map((r) => '<img src="' + esc(r.left) + '" alt="">').join("") + "</div>" +
    '<div class="plk-mqgroup" aria-hidden="true">' + rows.map((r) => '<img src="' + esc(r.left) + '" alt="">').join("") + "</div>" +
    "</div></div>" + wrapClose(c);
  const css = base(c, `
.plk-presslabel { text-align: center; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--w-muted); margin: 0 0 12px; }
.plk-mq { overflow: hidden; -webkit-mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent); }
.plk-mqtrack { display: flex; width: max-content; animation: plk-press linear infinite; }
.plk-mqgroup { display: flex; align-items: center; gap: 56px; padding-right: 56px; }
.plk-mqgroup img { height: 30px; width: auto; filter: grayscale(1); opacity: 0.6; }
@keyframes plk-press { to { transform: translateX(-50%); } }
`);
  return ok({ html, css });
};

/* ---- NPS score card ---- */
export const npsScoreCard: R = (c) => {
  const segs = (lines(c.items)[0]?.left || "0|0|0").split("|").map((n) => Math.max(0, Number(n.trim()) || 0));
  const [p, pa, d] = [segs[0] || 0, segs[1] || 0, segs[2] || 0];
  const total = p + pa + d || 1;
  const nps = Math.round(((p - d) / total) * 100);
  const html =
    wrapOpen +
    '<div class="plk-nps">' +
    '<div class="plk-npsleft"><span class="plk-npsnum" style="color:' + (nps >= 0 ? "var(--w-accent)" : "oklch(0.58 0.2 25)") + '">' +
    (nps > 0 ? "+" : "") + nps + "</span><span>NPS · " + esc(c.text || "") + "</span></div>" +
    '<div class="plk-npsbar plk-rv">' +
    '<span style="flex:' + p + ';background:oklch(0.68 0.15 155)"></span>' +
    '<span style="flex:' + pa + ';background:oklch(0.75 0.13 82)"></span>' +
    '<span style="flex:' + d + ';background:oklch(0.58 0.2 25)"></span></div>' +
    '<div class="plk-npslegend"><span>' + p + " promoters</span><span>" + pa + " passives</span><span>" + d + " detractors</span></div>" +
    "</div>" + wrapClose(c);
  const css = base(c, `
.plk-nps { display: flex; flex-direction: column; gap: 12px; padding: var(--w-pad); }
.plk-npsleft { display: flex; align-items: baseline; gap: 12px; }
.plk-npsnum { font-size: 3rem; font-weight: 650; letter-spacing: -0.03em; line-height: 1;
  font-variant-numeric: tabular-nums; }
.plk-npsleft > span:last-child { font-size: 13px; color: var(--w-muted); }
.plk-npsbar { display: flex; height: 10px; border-radius: 999px; overflow: hidden; gap: 2px; }
.plk-npsbar span { display: block; min-width: 4px; }
.plk-npslegend { display: flex; justify-content: space-between; font-size: 12px; color: var(--w-muted); }
` + REVEAL_CSS);
  return ok({ html, css, js: jsCountUp(".plk-npsnum", nps, 0, "") + jsReveal(".plk-npsbar") });
};

/* ---- Audio testimonial player ---- */
export const audioTestimonialPlayer: R = (c) => {
  const rows = lines(c.items);
  const html =
    wrapOpen + '<div class="plk-list">' +
    rows
      .map(
        (r) =>
          '<div class="plk-audio"><strong>' + esc(r.right || "Voice note") + "</strong>" +
          '<audio controls preload="none" src="' + esc(r.left) + '"></audio></div>'
      )
      .join("") +
    "</div>" + wrapClose(c);
  const css = base(c, SHEET_CSS + `
.plk-audio { background: var(--w-card); border: 1px solid var(--w-line); border-radius: var(--w-radius);
  padding: 14px 16px; display: flex; flex-direction: column; gap: 8px; }
.plk-audio strong { font-size: 14px; font-weight: 600; }
.plk-audio audio { width: 100%; height: 36px; }
`);
  const js =
    "var audios=shadow.querySelectorAll('.plk-audio audio');" +
    "audios.forEach(function(a){a.addEventListener('play',function(){" +
    "audios.forEach(function(o){if(o!==a)o.pause()})})});";
  return ok({ html, css, js });
};

/* ---- UGC photo wall ---- */
export const ugcPhotoWall: R = (c) => {
  const rows = lines(c.items);
  const cols = Number(c.maxColumns) || 3;
  const html =
    wrapOpen + '<div class="plk-ugc" style="--w-cols:' + cols + '">' +
    rows
      .map((r) => {
        const [cap, credit] = (r.right || "").split("|").map((s) => s.trim());
        return (
          '<figure class="plk-ugcitem"><img src="' + esc(r.left) + '" alt="' + esc(cap || "") + '" loading="lazy">' +
          (cap || credit ? "<figcaption><span>" + esc(cap || "") + "</span><em>" + esc(credit || "") + "</em></figcaption>" : "") +
          "</figure>"
        );
      })
      .join("") +
    "</div>" +
    '<dialog class="plk-modal" id="plk-ugcmodal"><div class="plk-modalcard"><button class="plk-modalx" type="button" aria-label="Close">×</button><img id="plk-ugcimg" src="" alt="" style="width:100%;border-radius:10px"><p id="plk-ugccap" style="margin:10px 0 0;font-size:13.5px;color:var(--w-muted)"></p></div></dialog>' +
    wrapClose(c);
  const css = base(c, `
.plk-ugc { columns: var(--w-cols); column-gap: var(--w-gap); }
@container (max-width: 700px) { .plk-ugc { columns: 2; } }
@container (max-width: 460px) { .plk-ugc { columns: 1; } }
.plk-ugcitem { margin: 0 0 var(--w-gap); break-inside: avoid; border: 1px solid var(--w-line);
  border-radius: var(--w-radius); overflow: hidden; background: var(--w-card); cursor: zoom-in; ${SOFT} }
.plk-ugcitem img { width: 100%; display: block; }
.plk-ugcitem figcaption { display: flex; justify-content: space-between; gap: 8px; padding: 9px 12px; font-size: 12.5px; }
.plk-ugcitem figcaption span { color: var(--w-ink); }
.plk-ugcitem figcaption em { color: var(--w-muted); font-style: normal; }
` + LIGHTBOX_CSS);
  const js =
    "var modal=shadow.getElementById('plk-ugcmodal'),img=shadow.getElementById('plk-ugcimg'),cap=shadow.getElementById('plk-ugccap');" +
    "shadow.querySelectorAll('.plk-ugcitem').forEach(function(f){f.addEventListener('click',function(){" +
    "var im=f.querySelector('img');img.src=im.src;img.alt=im.alt;cap.textContent=f.querySelector('figcaption')?f.querySelector('figcaption').textContent:'';" +
    "modal.showModal()})});" +
    "modal.querySelector('.plk-modalx').addEventListener('click',function(){modal.close()});" +
    "modal.addEventListener('click',function(e){if(e.target===modal)modal.close()});";
  return ok({ html, css, js });
};

/* ---- Live activity feed ---- */
export const liveActivityFeed: R = (c) => {
  const rows = lines(c.items);
  const html =
    wrapOpen + '<div class="plk-feed">' +
    rows
      .map(
        (r) =>
          '<div class="plk-feedrow"><span class="plk-pulse" aria-hidden="true"></span><span class="plk-feedev">' +
          esc(r.left) + '</span><span class="plk-feedwhen">' + esc(r.right || "") + "</span></div>"
      )
      .join("") +
    "</div>" + wrapClose(c);
  const css = base(c, SHEET_CSS + `
.plk-feed { display: flex; flex-direction: column; gap: 10px; }
.plk-feedrow { display: flex; align-items: center; gap: 10px; font-size: 14px;
  background: var(--w-card); border: 1px solid var(--w-line); border-radius: calc(var(--w-radius) - 2px);
  padding: 11px 14px; }
.plk-feedev { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.plk-feedwhen { color: var(--w-muted); font-size: 12.5px; flex-shrink: 0; }
.plk-pulse { width: 8px; height: 8px; border-radius: 999px; background: oklch(0.68 0.15 155); flex-shrink: 0;
  animation: plk-pulse 2.4s ease-out infinite; }
@keyframes plk-pulse { 0% { box-shadow: 0 0 0 0 oklch(0.68 0.15 155 / 0.45); } 70% { box-shadow: 0 0 0 7px oklch(0.68 0.15 155 / 0); } 100% { box-shadow: 0 0 0 0 oklch(0.68 0.15 155 / 0); } }
@media (prefers-reduced-motion: reduce) { .plk-pulse { animation: none; } }
.plk-feedrow { transition: opacity 250ms ease; }
`);
  const js =
    "var list=shadow.querySelector('.plk-feed');if(!list)return;" +
    "if(matchMedia('(prefers-reduced-motion: reduce)').matches||list.children.length<2)return;" +
    "setInterval(function(){var f=list.firstElementChild;if(!f)return;f.style.opacity='0';" +
    "setTimeout(function(){list.appendChild(f);f.style.opacity='1'},260)},6000);";
  return ok({ html, css, js });
};

/* ---- Rating highlights card ---- */
export const ratingHighlightsCard: R = (c) => {
  const rows = lines(c.items)
    .map((r) => ({ phrase: r.left, count: Number(r.right) || 0 }))
    .sort((a, b) => b.count - a.count);
  const max = rows[0]?.count || 1;
  const html =
    wrapOpen + '<div class="plk-hl">' +
    rows
      .map(
        (r) =>
          '<div class="plk-hlrow"><span class="plk-hlphrase">' + esc(r.phrase) +
          '</span><span class="plk-hlbar"><span class="plk-hlfill" data-w="' + Math.max(8, (r.count / max) * 100) + '" style="width:0%"></span></span>' +
          '<span class="plk-hlnum">' + r.count + "</span></div>"
      )
      .join("") +
    "</div>" + wrapClose(c);
  const css = base(c, SHEET_CSS + `
.plk-hl { display: flex; flex-direction: column; gap: 10px; }
.plk-hlrow { display: grid; grid-template-columns: 1fr 120px 30px; align-items: center; gap: 12px; font-size: 14px; }
.plk-hlphrase { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.plk-hlbar { height: 8px; background: var(--w-line); border-radius: 999px; overflow: hidden; }
.plk-hlbar span { display: block; height: 100%; width: 0; background: color-mix(in oklab, var(--w-accent) 70%, transparent); border-radius: 999px;
  transition: width 900ms cubic-bezier(0.23,1,0.32,1); }
.plk-hlnum { text-align: right; color: var(--w-muted); font-variant-numeric: tabular-nums; font-size: 12.5px; }
@container (max-width: 420px) { .plk-hlrow { grid-template-columns: 1fr 70px 26px; } }
`);
  const js =
    "new IntersectionObserver(function(es,o){if(!es[0].isIntersecting)return;o.disconnect();" +
    "shadow.querySelectorAll('.plk-hlfill').forEach(function(b){b.style.width=b.dataset.w+'%'})},{threshold:0.4}).observe(shadow.querySelector('.plk-hl'));";
  return ok({ html, css, js });
};
