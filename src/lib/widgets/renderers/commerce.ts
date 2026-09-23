import { baseCss, badgeHtml, esc, ok } from "../base";
import type { RenderResult, TestimonialData, WidgetConfig } from "../types";
import { SOFT, lines } from "./kit";

type R = (c: WidgetConfig, items: TestimonialData[]) => RenderResult;

const BTN = `
.plk-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: var(--w-accent);
  color: #fff; text-decoration: none; font-weight: 600; font-size: 14px; padding: 11px 18px;
  border-radius: 999px; transition: transform 160ms cubic-bezier(0.23,1,0.32,1), filter 160ms ease; }
.plk-btn:hover { filter: brightness(1.06); }
.plk-btn:active { transform: scale(0.97); }
`;

/* ---- Product showcase card (double-bezel framing) ---- */
export const productShowcaseCard: R = (c) => {
  const r = lines(c.items)[0];
  const [name, price, img, buy] = r ? [r.left, ...(r.right || "").split("|").map((s) => s.trim())] : [];
  const html =
    '<div class="plk-wrap"><div class="plk-shell"><div class="plk-core">' +
    (img ? '<img class="plk-shopimg" src="' + esc(img) + '" alt="' + esc(name || "") + '" loading="lazy">' : "") +
    '<div class="plk-shoprow"><strong>' + esc(name || "") + "</strong><span>" + esc(price || "") + "</span></div>" +
    (buy ? '<a class="plk-btn" href="' + esc(buy) + '" target="_blank" rel="noopener">Buy now <span class="plk-arr">↗</span></a>' : "") +
    "</div></div></div>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, `
.plk-wrap { padding: var(--w-pad); }
.plk-shell { max-width: 340px; margin-inline: auto; background: color-mix(in oklab, var(--w-accent) 6%, var(--w-card));
  border: 1px solid var(--w-line); border-radius: calc(var(--w-radius) + 10px); padding: 8px; }
.plk-core { background: var(--w-bg); border-radius: calc(var(--w-radius) + 3px); overflow: hidden;
  display: flex; flex-direction: column; gap: 14px; padding: 10px 10px 16px; ${SOFT} }
.plk-shopimg { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: var(--w-radius); display: block; }
.plk-shoprow { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; padding: 0 8px; }
.plk-shoprow strong { font-size: 16px; font-weight: 600; letter-spacing: -0.01em; }
.plk-shoprow span { font-size: 16px; font-weight: 650; color: var(--w-accent); font-variant-numeric: tabular-nums; }
.plk-shoprow + .plk-btn, .plk-core > .plk-btn { margin: 0 8px; }
.plk-btn .plk-arr { width: 22px; height: 22px; border-radius: 999px; background: oklch(1 0 0 / 0.18);
  display: inline-flex; align-items: center; justify-content: center; font-size: 11px;
  transition: transform 180ms cubic-bezier(0.23,1,0.32,1); }
.plk-btn:hover .plk-arr { transform: translate(1px, -1px); }
`);
  return ok({ html, css });
};

/* ---- Payment / donation link buttons ---- */
function linkButton(defaultLabel: string): R {
  return (c) => {
    const html =
      '<div class="plk-wrap"><div class="plk-linkbtn">' +
      '<a class="plk-btn" href="' + esc(c.link || "#") + '" target="_blank" rel="noopener">' +
      esc(c.text || defaultLabel) + ' <span class="plk-arr">↗</span></a></div>' +
      badgeHtml(c.showBadge) + "</div>";
    const css = baseCss(c, `
.plk-wrap { padding: var(--w-pad); }
.plk-linkbtn { display: flex; justify-content: center; }
.plk-btn { font-size: 15px; padding: 13px 22px; ${SOFT} }
.plk-btn .plk-arr { width: 24px; height: 24px; border-radius: 999px; background: oklch(1 0 0 / 0.2);
  display: inline-flex; align-items: center; justify-content: center; font-size: 12px;
  transition: transform 180ms cubic-bezier(0.23,1,0.32,1); }
.plk-btn:hover .plk-arr { transform: translate(2px, -1px); }
`);
    return ok({ html, css });
  };
}
export const paymentLinkButton = linkButton("Pay now");
export const donationButton = linkButton("Support this project");

/* ---- Digital product card ---- */
export const digitalProductCard: R = (c) => {
  const r = lines(c.items)[0];
  const [name, price, incl, link] = r ? [r.left, ...(r.right || "").split("|").map((s) => s.trim())] : [];
  const html =
    '<div class="plk-wrap"><div class="plk-dig">' +
    "<h3>" + esc(name || "") + "</h3>" +
    '<div class="plk-digrow"><span class="plk-digprice">' + esc(price || "") + "</span><span>" + esc(incl || "") + "</span></div>" +
    (link ? '<a class="plk-btn" href="' + esc(link) + '" target="_blank" rel="noopener">Get it ↗</a>' : "") +
    "</div>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, BTN + `
.plk-dig { max-width: 420px; margin-inline: auto; background: var(--w-card); border: 1px solid var(--w-line);
  border-radius: var(--w-radius); padding: 22px; display: flex; flex-direction: column; gap: 12px; ${SOFT} }
.plk-dig h3 { margin: 0; font-size: 17px; font-weight: 650; letter-spacing: -0.01em; }
.plk-digrow { display: flex; align-items: center; gap: 10px; font-size: 13.5px; color: var(--w-muted); }
.plk-digprice { font-size: 20px; font-weight: 650; color: var(--w-accent); font-variant-numeric: tabular-nums; }
.plk-dig .plk-btn { align-self: flex-start; margin-top: 4px; }
`);
  return ok({ html, css });
};

/* ---- Product carousel (Shopify/Etsy feeds + generic) ---- */
const productCarousel: R = (c) => {
  const rows = lines(c.items).map((r) => {
    const [price, img, link] = (r.right || "").split("|").map((s) => s.trim());
    return { name: r.left, price: price || "", img: img || "", link: link || "" };
  });
  const html =
    '<div class="plk-prods">' +
    rows
      .map((r) => {
        const inner =
          (r.img ? '<img src="' + esc(r.img) + '" alt="' + esc(r.name) + '" loading="lazy">' : "") +
          '<span class="plk-prodname">' + esc(r.name) + "</span>" +
          (r.price ? '<span class="plk-prodprice">' + esc(r.price) + "</span>" : "");
        return r.link
          ? '<a class="plk-prodcard" href="' + esc(r.link) + '" target="_blank" rel="noopener">' + inner + "</a>"
          : '<div class="plk-prodcard">' + inner + "</div>";
      })
      .join("") +
    "</div>" + badgeHtml(c.showBadge);
  const css = baseCss(c, `
.plk-prods { display: flex; gap: var(--w-gap); overflow-x: auto; scroll-snap-type: x mandatory;
  padding: var(--w-pad); scrollbar-width: thin; }
.plk-prodcard { flex: 0 0 190px; scroll-snap-align: start; background: var(--w-card);
  border: 1px solid var(--w-line); border-radius: var(--w-radius); overflow: hidden;
  display: flex; flex-direction: column; text-decoration: none; color: var(--w-ink);
  transition: transform 180ms cubic-bezier(0.23,1,0.32,1), border-color 180ms ease; ${SOFT} }
.plk-prodcard:hover { transform: translateY(-2px); border-color: color-mix(in oklab, var(--w-accent) 50%, var(--w-line)); }
.plk-prodcard img { width: 100%; aspect-ratio: 1; object-fit: cover; display: block; }
.plk-prodname { font-size: 13.5px; font-weight: 600; padding: 10px 12px 0; }
.plk-prodprice { font-size: 13px; color: var(--w-accent); font-weight: 650; padding: 2px 12px 12px;
  font-variant-numeric: tabular-nums; }
`);
  return ok({ html, css });
};
export const shopifyProductCarousel: R = productCarousel;
export const etsyFeed: R = (c) => productCarousel(c, []);

/* ---- Gumroad card ---- */
export const gumroadEmbed: R = (c) => {
  const r = lines(c.items)[0];
  const [price, link] = r ? [r.right?.split("|")[0]?.trim() || "", r.right?.split("|")[1]?.trim() || r.left] : ["", ""];
  const name = r ? r.left : "";
  const html =
    '<div class="plk-wrap"><div class="plk-grm">' +
    "<div><strong>" + esc(name) + "</strong><span>" + esc(price) + "</span></div>" +
    (link ? '<a class="plk-btn" href="' + esc(link) + '" target="_blank" rel="noopener">Get it on Gumroad ↗</a>' : "") +
    "</div>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, BTN + `
.plk-grm { max-width: 440px; margin-inline: auto; background: var(--w-card); border: 1px solid var(--w-line);
  border-radius: var(--w-radius); padding: 18px 20px; display: flex; align-items: center;
  justify-content: space-between; gap: 14px; flex-wrap: wrap; ${SOFT} }
.plk-grm div { display: flex; flex-direction: column; gap: 2px; }
.plk-grm strong { font-size: 15px; font-weight: 600; }
.plk-grm span { font-size: 13.5px; color: var(--w-accent); font-weight: 650; }
`);
  return ok({ html, css });
};

/* ---- Gift card widget ---- */
export const giftCardWidget: R = (c) => {
  const amounts = lines(c.items).map((r) => r.left);
  const html =
    '<div class="plk-wrap"><div class="plk-gift">' +
    (c.text ? "<h3>" + esc(c.text) + "</h3>" : "") +
    '<div class="plk-giftamts">' +
    amounts.map((a, i) => '<button type="button" class="plk-giftamt' + (i === 0 ? " on" : "") + '">' + esc(a) + "</button>").join("") +
    "</div>" +
    (c.link ? '<a class="plk-btn" id="plk-giftbuy" href="' + esc(c.link) + '" target="_blank" rel="noopener">Buy gift card ↗</a>' : "") +
    "</div>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, BTN + `
.plk-gift { max-width: 400px; margin-inline: auto; background: var(--w-card); border: 1px solid var(--w-line);
  border-radius: var(--w-radius); padding: 22px; display: flex; flex-direction: column; gap: 14px; text-align: center; ${SOFT} }
.plk-gift h3 { margin: 0; font-size: 16.5px; font-weight: 650; }
.plk-giftamts { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }
.plk-giftamt { border: 1.5px solid var(--w-line); background: var(--w-bg); color: var(--w-ink);
  font: inherit; font-weight: 600; font-size: 14px; border-radius: 999px; padding: 9px 16px; cursor: pointer;
  transition: border-color 150ms ease, background-color 150ms ease, transform 150ms cubic-bezier(0.23,1,0.32,1); }
.plk-giftamt:active { transform: scale(0.96); }
.plk-giftamt.on { border-color: var(--w-accent); color: var(--w-accent);
  background: color-mix(in oklab, var(--w-accent) 8%, var(--w-bg)); }
.plk-gift .plk-btn { justify-content: center; }
`);
  const js =
    "shadow.querySelectorAll('.plk-giftamt').forEach(function(b){b.addEventListener('click',function(){" +
    "shadow.querySelectorAll('.plk-giftamt').forEach(function(x){x.classList.remove('on')});" +
    "b.classList.add('on')})});";
  return ok({ html, css, js });
};

/* ---- Stock badge ---- */
export const stockBadge: R = (c) => {
  const low = /left|low|few|restocking/i.test(String(c.text || ""));
  const color = low ? "oklch(0.75 0.13 82)" : "oklch(0.68 0.15 155)";
  const html =
    '<div class="plk-wrap"><div class="plk-stock"><span class="plk-stockdot" style="background:' + color + '"></span>' +
    esc(c.text || "In stock") + "</div>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, `
.plk-stock { display: flex; align-items: center; justify-content: center; gap: 9px;
  font-size: 14px; font-weight: 500; padding: var(--w-pad); }
.plk-stockdot { width: 9px; height: 9px; border-radius: 999px; }
`);
  return ok({ html, css });
};

/* ---- Course card ---- */
export const courseCard: R = (c) => {
  const r = lines(c.items)[0];
  const [meta, price, link] = r ? [r.right?.split("|")[0]?.trim() || "", r.right?.split("|")[1]?.trim() || "", r.right?.split("|")[2]?.trim() || ""] : ["", "", ""];
  const html =
    '<div class="plk-wrap"><div class="plk-course">' +
    "<h3>" + esc(r?.left || "") + "</h3>" +
    "<p>" + esc(meta) + "</p>" +
    '<div class="plk-coursefoot"><span class="plk-cprice">' + esc(price) + "</span>" +
    (link ? '<a class="plk-btn" href="' + esc(link) + '" target="_blank" rel="noopener">Enroll ↗</a>' : "") +
    "</div></div>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, BTN + `
.plk-course { max-width: 460px; margin-inline: auto; background: var(--w-card); border: 1px solid var(--w-line);
  border-radius: var(--w-radius); padding: 24px; display: flex; flex-direction: column; gap: 10px; ${SOFT} }
.plk-course h3 { margin: 0; font-size: 18px; font-weight: 650; letter-spacing: -0.01em; }
.plk-course p { margin: 0; font-size: 13.5px; color: var(--w-muted); }
.plk-coursefoot { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 6px; }
.plk-cprice { font-size: 20px; font-weight: 650; color: var(--w-accent); font-variant-numeric: tabular-nums; }
`);
  return ok({ html, css });
};
