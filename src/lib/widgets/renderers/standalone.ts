import { baseCss, badgeHtml, esc, ok, parseLines } from "../base";
import type { RenderResult, TestimonialData, WidgetConfig } from "../types";

type R = (c: WidgetConfig, items: TestimonialData[]) => RenderResult;

/* Escape a value for safe inclusion inside a single-quoted JS string
   (HTML escaping would corrupt it, since this never passes through HTML). */
function jsEsc(s: unknown): string {
  return String(s ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/<\/script/g, "<\\/script");
}

function formRow(label: string, input: string): string {
  return (
    '<label class="plk-row"><span class="plk-lab">' + esc(label) + "</span>" + input + "</label>"
  );
}

const FORM_CSS = `
.plk-tool { max-width: 380px; margin-inline: auto; padding: var(--w-pad); }
.plk-tool h3 { font-size: 15px; font-weight: 600; margin: 0 0 12px; }
.plk-row { display: flex; flex-direction: column; gap: 4px; margin-bottom: 10px; }
.plk-lab { font-size: 12.5px; color: var(--w-muted); }
.plk-row input, .plk-row select {
  font: inherit; font-size: 15px; padding: 9px 11px;
  border: 1px solid var(--w-line); border-radius: calc(var(--w-radius) - 4px);
  background: var(--w-card); color: var(--w-ink); width: 100%;
}
.plk-row input:focus { outline: 2px solid var(--w-accent); outline-offset: 1px; }
.plk-out {
  margin-top: 12px; background: color-mix(in oklab, var(--w-accent) 8%, var(--w-card));
  border: 1px solid color-mix(in oklab, var(--w-accent) 25%, var(--w-line));
  border-radius: calc(var(--w-radius) - 2px); padding: 12px 14px;
}
.plk-out dt { font-size: 12px; color: var(--w-muted); }
.plk-out dd { margin: 0 0 8px; font-size: 19px; font-weight: 650;
  font-variant-numeric: tabular-nums; letter-spacing: -0.01em; }
.plk-out dd:last-child { margin-bottom: 0; }
`;

/* ------------------------------------------------------------- promo */

export const countdownTimer: R = (c) => {
  const target = String(c.target || "");
  const variant = c.variant === "inline" ? "inline" : "boxes";
  if (!target) {
    return ok({
      html:
        '<div class="plk-wrap"><div class="plk-cd"><span class="plk-cdlabel">Pick a target date in the editor</span></div></div>' +
        badgeHtml(c.showBadge),
      css: baseCss(c, `
.plk-cd { display: flex; flex-direction: column; gap: 12px; align-items: center; padding: var(--w-pad); }
.plk-cdlabel { font-size: 13px; color: var(--w-muted); letter-spacing: 0.04em; text-transform: uppercase; }
`),
    });
  }
  const html =
    '<div class="plk-wrap"><div class="plk-cd" id="plk-cd">' +
    (c.text ? '<span class="plk-cdlabel">' + esc(c.text) + "</span>" : "") +
    (variant === "boxes"
      ? ["d", "h", "m", "s"]
          .map(
            (u) =>
              '<span class="plk-cdbox"><span class="plk-cdnum" data-u="' + u + '">0</span>' +
              '<span class="plk-cdunit">' + ({ d: "days", h: "hrs", m: "min", s: "sec" } as Record<string, string>)[u] + "</span></span>"
          )
          .join("")
      : '<span class="plk-cdinline" data-u="inline">—</span>') +
    "</div>" +
    badgeHtml(c.showBadge) +
    "</div>";
  const css = baseCss(
    c,
    `
.plk-cd { display: flex; flex-direction: column; gap: 12px; align-items: center; padding: var(--w-pad); }
.plk-cdlabel { font-size: 13px; color: var(--w-muted); letter-spacing: 0.04em; text-transform: uppercase; }
.plk-cdbox { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.plk-cdbox:not(:first-of-type) { margin-left: 12px; }
.plk-cdnum {
  font-size: 2.2rem; font-weight: 650; font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em; min-width: 2.2ch; text-align: center;
  background: var(--w-card); border: 1px solid var(--w-line);
  border-radius: var(--w-radius); padding: 10px 12px;
}
.plk-cdunit { font-size: 11px; color: var(--w-muted); letter-spacing: 0.06em; text-transform: uppercase; }
.plk-cdinline { font-size: 1.15rem; font-weight: 600; font-variant-numeric: tabular-nums; }
`.trim()
  );
  const js =
    "var root=shadow.getElementById('plk-cd');var t=Date.parse('" + jsEsc(target) + "');" +
    "if(root&&!isNaN(t)){function pad(n){return String(n).padStart(2,'0')}" +
    "function tick(){var ms=Math.max(0,t-Date.now());var s=Math.floor(ms/1000);" +
    "var d=Math.floor(s/86400);var h=Math.floor(s%86400/3600);var m=Math.floor(s%3600/60);var sec=s%60;" +
    "var q=function(u){return root.querySelector('[data-u=\"'+u+'\"]')};" +
    "if(q('inline')){q('inline').textContent=d+'d '+pad(h)+':'+pad(m)+':'+pad(sec)}" +
    "else{if(q('d'))q('d').textContent=String(d);if(q('h'))q('h').textContent=pad(h);" +
    "if(q('m'))q('m').textContent=pad(m);if(q('s'))q('s').textContent=pad(sec)}}" +
    "tick();setInterval(tick,1000)}";
  return ok({ html, css, js });
};

export const announcementBar: R = (c) => {
  const dismiss = c.dismiss !== false;
  const html =
    '<div class="plk-ann"><span class="plk-anntext">' + esc(c.text || "") + "</span>" +
    (dismiss ? '<button class="plk-annx" id="plk-x" aria-label="Dismiss">×</button>' : "") +
    "</div>";
  const css = baseCss(
    c,
    `
.plk-ann {
  display: flex; align-items: center; justify-content: center; gap: 12px;
  background: var(--w-ink); color: var(--w-bg);
  padding: 10px 44px; font-size: 14px; position: relative; text-align: center;
}
.plk-anntext { text-wrap: balance; }
.plk-annx {
  position: absolute; right: 8px; top: 50%; translate: 0 -50%;
  background: none; border: 0; color: inherit; font-size: 18px; line-height: 1;
  padding: 6px 10px; cursor: pointer; border-radius: 999px; opacity: 0.7;
  transition: opacity 160ms ease;
}
.plk-annx:hover { opacity: 1; }
`.trim()
  );
  const js = dismiss
    ? "var x=shadow.getElementById('plk-x');if(x){x.addEventListener('click',function(){shadow.host.style.display='none'})}"
    : undefined;
  return ok({ html, css, js });
};

export const stickyCta: R = (c) => {
  const pos = c.variant === "bottom-left" ? "left" : "right";
  const link = String(c.link || "#");
  const html =
    '<a class="plk-stick" href="' + esc(link) + '">' + esc(c.text || "Get started") + "</a>";
  const css = baseCss(
    c,
    `
:host { position: fixed; bottom: 20px; ` + (pos === "left" ? "left" : "right") + `: 20px; z-index: 60; }
.plk-stick {
  display: inline-block; background: var(--w-accent); color: #fff;
  font-weight: 600; font-size: 14.5px; text-decoration: none;
  padding: 13px 20px; border-radius: 999px;
  box-shadow: 0 4px 16px oklch(0 0 0 / 0.18);
  transition: transform 160ms cubic-bezier(0.23,1,0.32,1), box-shadow 160ms ease;
}
.plk-stick:hover { transform: translateY(-1px); box-shadow: 0 6px 20px oklch(0 0 0 / 0.22); }
.plk-stick:active { transform: scale(0.97); }
`.trim()
  );
  return ok({ html, css });
};

/* ------------------------------------------------------------- media & content */

export const faqAccordion: R = (c) => {
  const rows = parseLines(c.items);
  const bordered = c.variant !== "minimal";
  const html =
    '<div class="plk-wrap"><div class="plk-faq' + (bordered ? " bordered" : "") + '">' +
    rows
      .map(
        (r) =>
          "<details><summary>" + esc(r.left) + "</summary><p>" + esc(r.right || "") + "</p></details>"
      )
      .join("") +
    "</div>" +
    badgeHtml(c.showBadge) +
    "</div>";
  const css = baseCss(
    c,
    `
.plk-faq { max-width: 720px; margin-inline: auto; padding: var(--w-pad); }
.plk-faq.details-reset { }
.plk-faq details { padding: 14px 0; }
.plk-faq.bordered details { border-bottom: 1px solid var(--w-line); }
.plk-faq details:first-child { padding-top: 0; }
.plk-faq summary {
  list-style: none; cursor: pointer; font-weight: 600; font-size: 15.5px;
  display: flex; justify-content: space-between; align-items: center; gap: 16px;
}
.plk-faq summary::-webkit-details-marker { display: none; }
.plk-faq summary::after {
  content: ""; width: 9px; height: 9px; flex-shrink: 0;
  border-right: 1.5px solid var(--w-muted); border-bottom: 1.5px solid var(--w-muted);
  transform: rotate(45deg); transition: transform 200ms cubic-bezier(0.23,1,0.32,1);
  margin-right: 3px;
}
.plk-faq details[open] summary::after { transform: rotate(225deg); }
.plk-faq details p { margin: 8px 0 0; color: var(--w-muted); font-size: 14.5px; max-width: 62ch; }
`.trim()
  );
  return ok({ html, css });
};

export const logoCarousel: R = (c) => {
  const rows = parseLines(c.items);
  const speed = Number(c.speed) || 40;
  const gray = c.labels !== false;
  const logo =
    '<div class="plk-lmarq"><div class="plk-track" style="--w-speed:' + speed + 's">' +
    '<div class="plk-group">' +
    rows.map((r) => '<img src="' + esc(r.left) + '" alt="' + esc(r.right || "logo") + '" loading="lazy">').join("") +
    '</div><div class="plk-group" aria-hidden="true">' +
    rows.map((r) => '<img src="' + esc(r.left) + '" alt="" loading="lazy">').join("") +
    "</div></div></div>" +
    badgeHtml(c.showBadge);
  const css = baseCss(
    c,
    `
.plk-lmarq { overflow: hidden; padding: var(--w-pad) 0 0; }
.plk-track { display: flex; width: max-content; animation: plk-lscroll var(--w-speed) linear infinite; }
.plk-lmarq:hover .plk-track { animation-play-state: paused; }
.plk-group { display: flex; align-items: center; gap: 48px; padding-right: 48px; }
.plk-group img {
  height: 34px; width: auto; ${gray ? "filter: grayscale(1); opacity: 0.65;" : ""}
  transition: filter 200ms ease, opacity 200ms ease;
}
.plk-group img:hover { filter: none; opacity: 1; }
@keyframes plk-lscroll { to { transform: translateX(-50%); } }
`.trim()
  );
  if (!rows.length) {
    return ok({ html: '<div class="plk-wrap">' + badgeHtml(c.showBadge) + "</div>", css });
  }
  return ok({ html: logo, css });
};

export const imageGallery: R = (c) => {
  const rows = parseLines(c.items);
  const cols = Number(c.maxColumns) || 3;
  const html =
    '<div class="plk-wrap"><div class="plk-gal" style="--w-cols:' + cols + '">' +
    rows
      .map(
        (r, i) =>
          '<figure class="plk-gitem"><button type="button" data-i="' + i + '" aria-label="Open image: ' +
          esc(r.right || "image") + '"><img src="' + esc(r.left) + '" alt="' +
          esc(r.right || "") + '" loading="lazy"></button>' +
          (r.right ? "<figcaption>" + esc(r.right) + "</figcaption>" : "") +
          "</figure>"
      )
      .join("") +
    '</div><dialog class="plk-lightbox" id="plk-lb"><img src="" alt=""><button type="button" id="plk-lbx" aria-label="Close">×</button></dialog>' +
    badgeHtml(c.showBadge) +
    "</div>";
  const css = baseCss(
    c,
    `
.plk-gal { display: grid; grid-template-columns: repeat(var(--w-cols), 1fr); gap: var(--w-gap); padding: var(--w-pad); }
@container (max-width: 760px) { .plk-gal { grid-template-columns: repeat(2, 1fr); } }
@container (max-width: 480px) { .plk-gal { grid-template-columns: 1fr; } }
.plk-gitem { margin: 0; }
.plk-gitem button { display: block; width: 100%; border: 0; padding: 0; background: none; cursor: zoom-in;
  border-radius: var(--w-radius); overflow: hidden; }
.plk-gitem img { display: block; width: 100%; aspect-ratio: 4 / 3; object-fit: cover;
  transition: transform 400ms cubic-bezier(0.23,1,0.32,1); }
.plk-gitem button:hover img { transform: scale(1.03); }
.plk-gitem figcaption { font-size: 12.5px; color: var(--w-muted); padding-top: 6px; }
.plk-lightbox { border: 0; padding: 0; background: transparent; max-width: 90vw; max-height: 90vh; }
.plk-lightbox img { max-width: 90vw; max-height: 85vh; border-radius: var(--w-radius); display: block; }
.plk-lightbox::backdrop { background: oklch(0 0 0 / 0.6); }
.plk-lbx { position: absolute; top: 8px; right: 8px; border: 0; background: oklch(1 0 0 / 0.9);
  width: 34px; height: 34px; border-radius: 999px; font-size: 18px; cursor: pointer; }
`.trim()
  );
  const js =
    "var lb=shadow.getElementById('plk-lb');var big=lb.querySelector('img');" +
    "shadow.querySelectorAll('.plk-gitem button').forEach(function(b){" +
    "b.addEventListener('click',function(){var img=b.querySelector('img');" +
    "big.src=img.src;big.alt=img.alt;lb.showModal()})});" +
    "shadow.getElementById('plk-lbx').addEventListener('click',function(){lb.close()});" +
    "lb.addEventListener('click',function(e){if(e.target===lb)lb.close()})";
  if (!rows.length) {
    return ok({ html: '<div class="plk-wrap">' + badgeHtml(c.showBadge) + "</div>", css });
  }
  return ok({ html, css, js });
};

export const beforeAfterSlider: R = (c) => {
  const first = parseLines(c.items)[0];
  const before = first?.left || "";
  const after = first?.right || "";
  const labels = String(c.text || "Before | After").split("|");
  const html =
    '<div class="plk-wrap"><figure class="plk-ba">' +
    '<div class="plk-baframe"><img class="plk-baafter" src="' + esc(after) + '" alt="' + esc(labels[1] || "After") + '">' +
    '<div class="plk-babefore" id="plk-bb"><img src="' + esc(before) + '" alt="' + esc(labels[0] || "Before") + '"></div>' +
    '<span class="plk-balabel l">' + esc(labels[0] || "Before") + '</span>' +
    '<span class="plk-balabel r">' + esc(labels[1] || "After") + "</span></div>" +
    '<input class="plk-barange" id="plk-br" type="range" min="0" max="100" value="50" aria-label="Compare before and after">' +
    "</figure>" +
    badgeHtml(c.showBadge) +
    "</div>";
  const css = baseCss(
    c,
    `
.plk-ba { margin: 0; padding: var(--w-pad); max-width: 720px; margin-inline: auto; }
.plk-baframe { position: relative; aspect-ratio: 3 / 2; border-radius: var(--w-radius); overflow: hidden;
  border: 1px solid var(--w-line); }
.plk-baframe img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
.plk-babefore { position: absolute; inset: 0; clip-path: inset(0 50% 0 0); }
.plk-balabel { position: absolute; bottom: 10px; font-size: 11.5px; font-weight: 600; letter-spacing: 0.05em;
  text-transform: uppercase; background: oklch(0 0 0 / 0.55); color: #fff; padding: 4px 9px; border-radius: 999px; }
.plk-balabel.l { left: 10px; } .plk-balabel.r { right: 10px; }
.plk-barange { width: 100%; margin-top: 12px; accent-color: var(--w-accent); }
`.trim()
  );
  const js =
    "var r=shadow.getElementById('plk-br');var b=shadow.getElementById('plk-bb');" +
    "function set(){b.style.clipPath='inset(0 '+(100-r.value)+'% 0 0)'}" +
    "r.addEventListener('input',set);set()";
  if (!before || !after) {
    return ok({ html: '<div class="plk-wrap">' + badgeHtml(c.showBadge) + "</div>", css });
  }
  return ok({ html, css, js });
};

/* ------------------------------------------------------------- commerce & info */

export const pricingTable: R = (c) => {
  const plans = parseLines(c.items).map((r) => {
    const [price, feats] = (r.right || "").split("|");
    return {
      name: r.left,
      price: (price || "").trim(),
      feats: (feats || "").split(";").map((f) => f.trim()).filter(Boolean),
    };
  });
  const html =
    '<div class="plk-wrap"><div class="plk-plans">' +
    plans
      .map(
        (p) =>
          '<div class="plk-plan"><span class="plk-planname">' + esc(p.name) + "</span>" +
          '<span class="plk-planprice">' + esc(p.price) + "</span><ul>" +
          p.feats.map((f) => "<li>" + esc(f) + "</li>").join("") +
          "</ul></div>"
      )
      .join("") +
    "</div>" +
    badgeHtml(c.showBadge) +
    "</div>";
  const css = baseCss(
    c,
    `
.plk-plans { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: var(--w-gap); padding: var(--w-pad); max-width: 960px; margin-inline: auto; }
.plk-plan { display: flex; flex-direction: column; gap: 12px; background: var(--w-card);
  border: 1px solid var(--w-line); border-radius: var(--w-radius); padding: 22px 20px; }
.plk-planname { font-size: 13px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;
  color: var(--w-muted); }
.plk-planprice { font-size: 2rem; font-weight: 650; letter-spacing: -0.02em; color: var(--w-accent);
  font-variant-numeric: tabular-nums; }
.plk-plan ul { list-style: none; margin: 4px 0 0; display: flex; flex-direction: column; gap: 8px; }
.plk-plan li { font-size: 14px; color: var(--w-ink); display: flex; gap: 8px; align-items: baseline; }
.plk-plan li::before { content: ""; width: 8px; height: 8px; flex-shrink: 0; border-radius: 999px;
  background: color-mix(in oklab, var(--w-accent) 45%, transparent);
  box-shadow: inset 0 0 0 1.5px var(--w-accent); translate: 0 1px; }
`.trim()
  );
  return ok({ html, css });
};

export const linkInBio: R = (c) => {
  const rows = parseLines(c.items);
  const html =
    '<div class="plk-wrap"><div class="plk-bio">' +
    '<span class="plk-bioavatar" aria-hidden="true">' + esc(String(c.text || "?").trim().charAt(0).toUpperCase()) + "</span>" +
    '<h3 class="plk-bioname">' + esc(c.text || "") + "</h3>" +
    rows
      .map(
        (r) =>
          '<a class="plk-biolink" href="' + esc(r.right || "#") + '" target="_blank" rel="noopener">' + esc(r.left) + "</a>"
      )
      .join("") +
    "</div>" +
    badgeHtml(c.showBadge) +
    "</div>";
  const css = baseCss(
    c,
    `
.plk-bio { max-width: 380px; margin-inline: auto; padding: 32px var(--w-pad);
  display: flex; flex-direction: column; gap: 10px; text-align: center; }
.plk-bioavatar { width: 64px; height: 64px; border-radius: 999px; margin: 0 auto 4px;
  background: color-mix(in oklab, var(--w-accent) 14%, var(--w-card));
  color: color-mix(in oklab, var(--w-accent) 75%, var(--w-ink));
  display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 650; }
.plk-bioname { margin: 0 0 8px; font-size: 17px; font-weight: 600; }
.plk-biolink {
  display: block; background: var(--w-card); border: 1px solid var(--w-line);
  border-radius: var(--w-radius); padding: 12px 16px; text-decoration: none;
  color: var(--w-ink); font-weight: 500; font-size: 14.5px;
  transition: border-color 160ms ease, transform 160ms cubic-bezier(0.23,1,0.32,1);
}
.plk-biolink:hover { border-color: var(--w-accent); }
.plk-biolink:active { transform: scale(0.98); }
`.trim()
  );
  return ok({ html, css });
};

/* ------------------------------------------------------------- micro-tools */

export const ageCalculator: R = (c) => {
  const html =
    '<div class="plk-wrap"><form class="plk-tool" id="plk-f">' +
    (c.text ? "<h3>" + esc(c.text) + "</h3>" : "") +
    formRow("Date of birth", '<input type="date" name="dob" required>') +
    '<dl class="plk-out"><dt>Exact age</dt><dd id="plk-out">—</dd></dl></form>' +
    badgeHtml(c.showBadge) +
    "</div>";
  const css = baseCss(c, FORM_CSS);
  const js =
    "var f=shadow.getElementById('plk-f'),out=shadow.getElementById('plk-out');" +
    "f.addEventListener('submit',function(e){e.preventDefault();" +
    "var v=f.dob.value;if(!v)return;var b=new Date(v+'T00:00:00'),n=new Date();" +
    "var y=n.getFullYear()-b.getFullYear(),m=n.getMonth()-b.getMonth(),d=n.getDate()-b.getDate();" +
    "if(d<0){m--;d+=new Date(n.getFullYear(),n.getMonth(),0).getDate()}" +
    "if(m<0){y--;m+=12}" +
    "out.textContent=y+' years, '+m+' months, '+d+' days'})";
  return ok({ html, css, js });
};

export const tipCalculator: R = (c) => {
  const html =
    '<div class="plk-wrap"><form class="plk-tool" id="plk-f">' +
    formRow("Bill amount", '<input type="number" name="bill" min="0" step="0.01" placeholder="0.00" required>') +
    formRow("Tip", '<input type="range" name="tip" min="0" max="40" step="1" value="15">' ) +
    formRow("Split between", '<input type="number" name="ppl" min="1" step="1" value="1">') +
    '<dl class="plk-out"><dt>Each person pays</dt><dd id="plk-out">—</dd>' +
    '<dt style="margin-top:8px">Tip total</dt><dd id="plk-tip">—</dd></dl></form>' +
    badgeHtml(c.showBadge) +
    "</div>";
  const css = baseCss(c, FORM_CSS + "\ninput[type=range]{accent-color:var(--w-accent);padding:0}");
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function calc(){var b=parseFloat(f.bill.value),t=parseFloat(f.tip.value),p=Math.max(1,parseInt(f.ppl.value)||1);" +
    "if(isNaN(b)){shadow.getElementById('plk-out').textContent='—';shadow.getElementById('plk-tip').textContent='—';return}" +
    "var tip=b*t/100;shadow.getElementById('plk-tip').textContent=tip.toFixed(2);" +
    "shadow.getElementById('plk-out').textContent=((b+tip)/p).toFixed(2)}" +
    "f.addEventListener('input',calc);f.addEventListener('submit',function(e){e.preventDefault();calc()})";
  return ok({ html, css, js });
};

export const splitBillCalculator: R = (c) => {
  const html =
    '<div class="plk-wrap"><form class="plk-tool" id="plk-f">' +
    formRow("Total bill", '<input type="number" name="bill" min="0" step="0.01" placeholder="0.00" required>') +
    formRow("People", '<input type="number" name="ppl" min="1" step="1" value="2" required>') +
    formRow("Tip %", '<input type="number" name="tip" min="0" max="100" step="1" value="0">') +
    '<dl class="plk-out"><dt>Each person pays</dt><dd id="plk-out">—</dd></dl></form>' +
    badgeHtml(c.showBadge) +
    "</div>";
  const css = baseCss(c, FORM_CSS);
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function calc(){var b=parseFloat(f.bill.value),p=Math.max(1,parseInt(f.ppl.value)||1),t=parseFloat(f.tip.value)||0;" +
    "shadow.getElementById('plk-out').textContent=isNaN(b)?'—':((b*(1+t/100))/p).toFixed(2)}" +
    "f.addEventListener('input',calc);f.addEventListener('submit',function(e){e.preventDefault();calc()})";
  return ok({ html, css, js });
};

export const salePriceCalculator: R = (c) => {
  const html =
    '<div class="plk-wrap"><form class="plk-tool" id="plk-f">' +
    formRow("Original price", '<input type="number" name="price" min="0" step="0.01" placeholder="0.00" required>') +
    formRow("Percent off", '<input type="number" name="off" min="0" max="100" step="1" value="20" required>') +
    '<dl class="plk-out"><dt>Sale price</dt><dd id="plk-out">—</dd>' +
    '<dt style="margin-top:8px">You save</dt><dd id="plk-save">—</dd></dl></form>' +
    badgeHtml(c.showBadge) +
    "</div>";
  const css = baseCss(c, FORM_CSS);
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function calc(){var p=parseFloat(f.price.value),o=parseFloat(f.off.value);" +
    "if(isNaN(p)||isNaN(o)){shadow.getElementById('plk-out').textContent='—';return}" +
    "shadow.getElementById('plk-save').textContent=(p*o/100).toFixed(2);" +
    "shadow.getElementById('plk-out').textContent=(p*(1-o/100)).toFixed(2)}" +
    "f.addEventListener('input',calc);f.addEventListener('submit',function(e){e.preventDefault();calc()})";
  return ok({ html, css, js });
};
