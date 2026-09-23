import { baseCss, badgeHtml, esc, ok } from "../base";
import type { RenderResult, TestimonialData, WidgetConfig } from "../types";
import { SOFT, CARO_NAV_CSS, carouselNavHtml, jsCarousel, lines } from "./kit";

type R = (c: WidgetConfig, items: TestimonialData[]) => RenderResult;

const BTN = `
.plk-btn { display: inline-flex; align-items: center; gap: 8px; background: var(--w-accent); color: #fff;
  text-decoration: none; font-weight: 600; font-size: 14px; padding: 10px 16px; border: 0; cursor: pointer;
  border-radius: 999px; font-family: inherit; transition: transform 160ms cubic-bezier(0.23,1,0.32,1), filter 160ms ease; }
.plk-btn:hover { filter: brightness(1.06); }
.plk-btn:active { transform: scale(0.97); }
`;

/* ---- Accordion ---- */
export const accordion: R = (c) => {
  const rows = lines(c.items);
  const html =
    '<div class="plk-wrap"><div class="plk-acc">' +
    rows.map((r) => "<details><summary>" + esc(r.left) + "</summary><p>" + esc(r.right || "") + "</p></details>").join("") +
    "</div>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, `
.plk-acc { max-width: 640px; margin-inline: auto; padding: var(--w-pad); display: flex; flex-direction: column; gap: 8px; }
.plk-acc details { background: var(--w-card); border: 1px solid var(--w-line); border-radius: var(--w-radius);
  padding: 14px 18px; }
.plk-acc summary { list-style: none; cursor: pointer; font-weight: 600; font-size: 14.5px;
  display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.plk-acc summary::-webkit-details-marker { display: none; }
.plk-acc summary::after { content: "+"; font-size: 17px; color: var(--w-muted);
  transition: transform 200ms cubic-bezier(0.23,1,0.32,1); }
.plk-acc details[open] summary::after { transform: rotate(45deg); }
.plk-acc p { margin: 10px 0 0; font-size: 14px; color: var(--w-muted); }
`);
  return ok({ html, css });
};

/* ---- Tabs ---- */
export const tabs: R = (c) => {
  const rows = lines(c.items);
  const html =
    '<div class="plk-wrap"><div class="plk-tabs">' +
    '<div class="plk-tabbar" role="tablist">' +
    rows.map((r, i) => '<button role="tab" id="t' + i + '" aria-selected="' + (i === 0) + '" data-i="' + i + '">' + esc(r.left) + "</button>").join("") +
    "</div>" +
    rows.map((r, i) => '<div class="plk-tabpanel" data-p="' + i + '" role="tabpanel" ' + (i ? "hidden" : "") + ">" + esc(r.right || "") + "</div>").join("") +
    "</div>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, `
.plk-tabs { max-width: 560px; margin-inline: auto; padding: var(--w-pad); }
.plk-tabbar { display: flex; gap: 4px; background: var(--w-card); border: 1px solid var(--w-line);
  border-radius: 999px; padding: 4px; width: fit-content; margin-inline: auto; }
.plk-tabbar button { border: 0; background: transparent; color: var(--w-muted); font: inherit; font-size: 13.5px;
  font-weight: 500; padding: 7px 16px; border-radius: 999px; cursor: pointer;
  transition: background-color 150ms ease, color 150ms ease; }
.plk-tabbar button[aria-selected="true"] { background: var(--w-ink); color: var(--w-bg); }
.plk-tabpanel { padding: 18px 6px 0; font-size: 14.5px; color: var(--w-muted); text-align: center; line-height: 1.6; }
`);
  const js =
    "var btns=shadow.querySelectorAll('.plk-tabbar button');" +
    "btns.forEach(function(b){b.addEventListener('click',function(){" +
    "btns.forEach(function(x){x.setAttribute('aria-selected','false')});b.setAttribute('aria-selected','true');" +
    "var i=b.dataset.i;shadow.querySelectorAll('.plk-tabpanel').forEach(function(p){" +
    "p.hidden=p.dataset.p!==i})})});";
  return ok({ html, css, js });
};

/* ---- Card carousel ---- */
export const cardCarousel: R = (c) => {
  const rows = lines(c.items);
  const html =
    '<div class="plk-wrap"><div class="plk-ccaro">' +
    rows.map((r) => '<div class="plk-ccard"><strong>' + esc(r.left) + "</strong><p>" + esc(r.right || "") + "</p></div>").join("") +
    "</div>" +
    (rows.length > 2 ? carouselNavHtml() : "") +
    badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, `
.plk-ccaro { display: flex; gap: var(--w-gap); overflow-x: auto; scroll-snap-type: x mandatory; padding: var(--w-pad); }
.plk-ccaro { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) { .plk-ccaro { scroll-behavior: auto; } }
.plk-ccard { flex: 0 0 min(250px, 78cqi); scroll-snap-align: start; background: var(--w-card);
  border: 1px solid var(--w-line); border-radius: var(--w-radius); padding: 20px;
  display: flex; flex-direction: column; gap: 8px; ${SOFT} }
.plk-ccard strong { font-size: 15px; font-weight: 600; }
.plk-ccard p { margin: 0; font-size: 13.5px; color: var(--w-muted); }
` + CARO_NAV_CSS);
  const js = rows.length > 2 ? jsCarousel(".plk-ccaro") : undefined;
  return ok({ html, css, js });
};

/* ---- Text marquee ---- */
export const textMarquee: R = (c) => {
  const text = String(c.text || "");
  const speed = Number(c.speed) || 30;
  const html =
    '<div class="plk-tmq"><div class="plk-tmqtrack" style="animation-duration:' + speed + 's">' +
    '<span class="plk-tmqgroup">' + esc(text) + "</span>" +
    '<span class="plk-tmqgroup" aria-hidden="true">' + esc(text) + "</span></div></div>" +
    badgeHtml(c.showBadge);
  const css = baseCss(c, `
.plk-tmq { overflow: hidden; padding: 14px 0 0;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent); }
.plk-tmqtrack { display: flex; width: max-content; animation: plk-tmq linear infinite; }
.plk-tmq:hover .plk-tmqtrack { animation-play-state: paused; }
.plk-tmqgroup { display: flex; gap: 2.5rem; padding-right: 2.5rem; font-size: 1.25rem; font-weight: 600;
  letter-spacing: -0.01em; white-space: pre; color: var(--w-muted); }
@keyframes plk-tmq { to { transform: translateX(-50%); } }
`);
  return ok({ html, css });
};

/* ---- Sticky footer bar ---- */
export const stickyFooterBar: R = (c) => {
  const html =
    '<div class="plk-sfwrap" id="plk-sfwrap"><a class="plk-sfoot" href="' + esc(c.link || "#") + '" target="_blank" rel="noopener">' +
    "<span>" + esc(c.text || "") + '</span><span class="plk-sarr">↗</span></a>' +
    '<button class="plk-sfx" id="plk-sfx" type="button" aria-label="Dismiss">×</button></div>';
  const css = baseCss(c, `
:host { position: fixed; left: 0; right: 0; bottom: 0; z-index: 60; display: block; }
.plk-sfwrap { position: relative; }
.plk-sfwrap.dismissed { display: none; }
.plk-sfoot { display: flex; align-items: center; justify-content: center; gap: 10px;
  background: var(--w-ink); color: var(--w-bg); text-decoration: none; font-size: 14px; font-weight: 500;
  padding: 12px 44px; transition: filter 160ms ease; }
.plk-sfoot:hover { filter: brightness(1.08); }
.plk-sarr { width: 22px; height: 22px; border-radius: 999px; background: oklch(1 0 0 / 0.16);
  display: inline-flex; align-items: center; justify-content: center; font-size: 11px; }
.plk-sfx { position: absolute; right: 8px; top: 50%; translate: 0 -50%; border: 0; background: none;
  color: inherit; opacity: 0.65; font-size: 18px; padding: 6px 10px; cursor: pointer; border-radius: 999px;
  transition: opacity 150ms ease; }
.plk-sfx:hover { opacity: 1; }
`);
  const js =
    "var K='plk-sf-dismissed';var w=shadow.getElementById('plk-sfwrap');" +
    "try{if(localStorage.getItem(K))w.classList.add('dismissed')}catch(e){}" +
    "shadow.getElementById('plk-sfx').addEventListener('click',function(){" +
    "w.classList.add('dismissed');try{localStorage.setItem(K,'1')}catch(e){}});";
  return ok({ html, css, js });
};

/* ---- Floating action menu ---- */
export const floatingActionMenu: R = (c) => {
  const rows = lines(c.items);
  const html =
    '<div class="plk-fam"><div class="plk-famlist" id="plk-famlist" hidden>' +
    rows.map((r) => '<a href="' + esc(r.right || "#") + '" target="_blank" rel="noopener">' + esc(r.left) + "</a>").join("") +
    '</div><button class="plk-fambtn" id="plk-fambtn" aria-label="Menu" aria-expanded="false">+</button></div>';
  const css = baseCss(c, `
:host { position: fixed; right: 18px; bottom: 18px; z-index: 60; display: block; }
.plk-fam { display: flex; flex-direction: column; align-items: flex-end; gap: 10px; }
.plk-famlist { display: flex; flex-direction: column; gap: 6px; background: var(--w-bg);
  border: 1px solid var(--w-line); border-radius: var(--w-radius); padding: 8px; ${SOFT} }
.plk-famlist a { font-size: 13.5px; color: var(--w-ink); text-decoration: none; padding: 7px 12px;
  border-radius: 8px; white-space: nowrap; transition: background-color 150ms ease; }
.plk-famlist a:hover { background: color-mix(in oklab, var(--w-accent) 10%, transparent); }
.plk-fambtn { width: 48px; height: 48px; border-radius: 999px; border: 0; cursor: pointer;
  background: var(--w-accent); color: #fff; font-size: 22px; line-height: 1;
  box-shadow: 0 6px 18px oklch(0 0 0 / 0.2);
  transition: transform 200ms cubic-bezier(0.23,1,0.32,1); }
.plk-fambtn[aria-expanded="true"] { transform: rotate(45deg); }
`);
  const js =
    "var b=shadow.getElementById('plk-fambtn'),l=shadow.getElementById('plk-famlist');" +
    "b.addEventListener('click',function(){var open=l.hidden;l.hidden=!open;" +
    "b.setAttribute('aria-expanded',String(open))});";
  return ok({ html, css, js });
};

/* ---- Email signature card ---- */
export const emailSignatureCard: R = (c) => {
  const segs = (lines(c.items)[0]?.right || "").split("|").map((s) => s.trim());
  const [role, site, phone] = [segs[0] || "", segs[1] || "", segs[2] || ""];
  const name = lines(c.items)[0]?.left || "";
  const html =
    '<div class="plk-wrap"><div class="plk-sig">' +
    '<div class="plk-sigbar" aria-hidden="true"></div>' +
    "<div><strong>" + esc(name) + "</strong><span>" + esc(role) + "</span>" +
    '<span class="plk-sigmeta">' + esc(site) + " · " + esc(phone) + "</span></div></div>" +
    '<button class="plk-btn" id="plk-sigcopy" type="button">Copy as HTML</button>' +
    badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, BTN + `
.plk-sig { max-width: 420px; margin-inline: auto; background: var(--w-card); border: 1px solid var(--w-line);
  border-radius: var(--w-radius); padding: 16px 20px; display: flex; gap: 14px; margin-bottom: 12px; ${SOFT} }
.plk-sigbar { width: 3px; border-radius: 999px; background: var(--w-accent); flex-shrink: 0; }
.plk-sig div { display: flex; flex-direction: column; gap: 1px; }
.plk-sig strong { font-size: 14.5px; font-weight: 650; }
.plk-sig span { font-size: 12.5px; color: var(--w-muted); }
.plk-sigmeta { margin-top: 4px; }
.plk-sig ~ .plk-btn { display: flex; max-width: 420px; margin-inline: auto; justify-content: center; }
`);
  const sigHtml =
    '<strong>' + esc(name) + '</strong> — ' + esc(role) + '<br>' + esc(site) + ' · ' + esc(phone);
  const js =
    "shadow.getElementById('plk-sigcopy').addEventListener('click',function(){" +
    "(navigator.clipboard?navigator.clipboard.writeText(" + JSON.stringify(sigHtml) + "):Promise.reject())" +
    ".then(function(){var b=shadow.getElementById('plk-sigcopy');var t=b.textContent;b.textContent='Copied';" +
    "setTimeout(function(){b.textContent=t},1400)}).catch(function(){})});";
  return ok({ html, css, js });
};

/* ---- Newsletter archive embed ---- */
export const newsletterArchiveEmbed: R = (c) => {
  const rows = lines(c.items).map((r) => {
    const [url, date] = (r.right || "").split("|").map((s) => s.trim());
    return { title: r.left, url: url || "#", date: date || "" };
  });
  const html =
    '<div class="plk-wrap"><div class="plk-arch">' +
    (c.text ? "<h3>" + esc(c.text) + "</h3>" : "") +
    rows
      .map(
        (r) =>
          '<a class="plk-archrow" href="' + esc(r.url) + '" target="_blank" rel="noopener">' +
          "<span>" + esc(r.title) + "</span><em>" + esc(r.date) + " ↗</em></a>"
      )
      .join("") +
    "</div>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, `
.plk-arch { max-width: 520px; margin-inline: auto; padding: var(--w-pad); }
.plk-arch h3 { margin: 0 0 12px; font-size: 15.5px; font-weight: 600; }
.plk-archrow { display: flex; align-items: baseline; justify-content: space-between; gap: 14px;
  padding: 12px 4px; border-bottom: 1px solid var(--w-line); text-decoration: none; color: var(--w-ink);
  font-size: 14px; transition: border-color 150ms ease; }
.plk-archrow:hover { border-color: var(--w-accent); }
.plk-archrow span { font-weight: 500; }
.plk-archrow em { font-style: normal; font-size: 12px; color: var(--w-muted); flex-shrink: 0; }
`);
  return ok({ html, css });
};

/* ---- Awards & badges row ---- */
export const awardsBadgesRow: R = (c) => {
  const rows = lines(c.items);
  const html =
    '<div class="plk-wrap"><div class="plk-awards">' +
    rows.map((r) => '<img src="' + esc(r.left) + '" alt="' + esc(r.right || "award") + '" loading="lazy">').join("") +
    "</div>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, `
.plk-awards { display: flex; gap: 24px; justify-content: center; flex-wrap: wrap; align-items: center;
  padding: var(--w-pad); }
.plk-awards img { height: 44px; width: auto; }
`);
  return ok({ html, css });
};

/* ---- Trust badges ---- */
export const trustBadges: R = (c) => {
  const rows = lines(c.items);
  const html =
    '<div class="plk-wrap"><div class="plk-trust">' +
    rows
      .map(
        (r) =>
          '<span class="plk-trustitem"><svg width="13" height="13" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 1.8l6.5 2.4v4.6c0 4-2.7 7.3-6.5 9.4-3.8-2.1-6.5-5.4-6.5-9.4V4.2Z" stroke="var(--w-accent)" stroke-width="1.5"/><path d="M7.2 10l2 2 3.6-4" stroke="var(--w-accent)" stroke-width="1.5" stroke-linecap="round"/></svg>' +
          esc(r.left) + "</span>"
      )
      .join("") +
    "</div>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, `
.plk-trust { display: flex; gap: 18px; justify-content: center; flex-wrap: wrap; padding: var(--w-pad); }
.plk-trustitem { display: inline-flex; align-items: center; gap: 7px; font-size: 12.5px; font-weight: 500;
  color: var(--w-muted); background: var(--w-card); border: 1px solid var(--w-line);
  border-radius: 999px; padding: 7px 14px; }
`);
  return ok({ html, css });
};
