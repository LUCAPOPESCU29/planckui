import { baseCss, badgeHtml, esc, ok } from "../base";
import type { RenderResult, TestimonialData, WidgetConfig } from "../types";
import { SOFT, REVEAL_CSS, jsReveal, lines, jsEsc } from "./kit";

type R = (c: WidgetConfig, items: TestimonialData[]) => RenderResult;

/* ---- Lightbox gallery: masonry + full-screen viewer with counter ---- */
export const lightboxGallery: R = (c) => {
  const rows = lines(c.items);
  const cols = Number(c.maxColumns) || 3;
  const html =
    '<div class="plk-wrap"><div class="plk-lbgrid" style="--w-cols:' + cols + '">' +
    rows
      .map(
        (r, i) =>
          '<button type="button" class="plk-lbitem" data-i="' + i + '"><img src="' + esc(r.left) +
          '" alt="' + esc(r.right || "") + '" loading="lazy"></button>'
      )
      .join("") +
    '</div><dialog class="plk-big" id="plk-big"><img src="" alt=""><p id="plk-bigcap"></p><span id="plk-bigcount"></span>' +
    '<button type="button" id="plk-bigx" aria-label="Close">×</button>' +
    '<div class="plk-bignav"><button type="button" id="plk-prev" aria-label="Previous">←</button>' +
    '<button type="button" id="plk-next" aria-label="Next">→</button></div></dialog>' +
    badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, `
.plk-lbgrid { columns: var(--w-cols); column-gap: var(--w-gap); padding: var(--w-pad); }
@container (max-width: 640px) { .plk-lbgrid { columns: 2; } }
.plk-lbitem { display: block; width: 100%; border: 0; padding: 0; margin: 0 0 var(--w-gap); cursor: zoom-in;
  border-radius: var(--w-radius); overflow: hidden; background: var(--w-card); break-inside: avoid; ${SOFT} }
.plk-lbitem img { width: 100%; display: block; transition: transform 400ms cubic-bezier(0.23,1,0.32,1); }
.plk-lbitem:hover img { transform: scale(1.025); }
.plk-big { border: 0; padding: 0; background: transparent; max-width: 92vw; }
.plk-big img { max-width: 88vw; max-height: 78vh; border-radius: var(--w-radius); display: block; }
.plk-big p { margin: 8px 0 0; color: #fff; font-size: 13.5px; text-align: center; }
.plk-big span { display: block; text-align: center; color: oklch(1 0 0 / 0.6); font-size: 12px; margin-top: 2px; }
.plk-big::backdrop { background: oklch(0 0 0 / 0.72); }
.plk-bigx { position: fixed; top: 14px; right: 16px; border: 0; background: oklch(1 0 0 / 0.14); color: #fff;
  width: 36px; height: 36px; border-radius: 999px; font-size: 18px; cursor: pointer; }
.plk-bignav { position: fixed; inset: 0; pointer-events: none; display: flex; align-items: center; justify-content: space-between; padding: 0 12px; }
.plk-bignav button { pointer-events: auto; border: 0; background: oklch(1 0 0 / 0.14); color: #fff; width: 40px; height: 40px;
  border-radius: 999px; font-size: 16px; cursor: pointer; }
`);
  const js =
    "var rows=" + JSON.stringify(rows.map((r) => ({ u: r.left, c: r.right || "" }))) + ";" +
    "var dlg=shadow.getElementById('plk-big'),img=dlg.querySelector('img'),cap=shadow.getElementById('plk-bigcap'),cnt=shadow.getElementById('plk-bigcount');" +
    "var i=0;function set(){img.src=rows[i].u;img.alt=rows[i].c;cap.textContent=rows[i].c;cnt.textContent=(i+1)+' / '+rows.length}" +
    "shadow.querySelectorAll('.plk-lbitem').forEach(function(b){b.addEventListener('click',function(){i=Number(b.dataset.i);set();dlg.showModal()})});" +
    "shadow.getElementById('plk-bigx').addEventListener('click',function(){dlg.close()});" +
    "shadow.getElementById('plk-prev').addEventListener('click',function(){i=(i-1+rows.length)%rows.length;set()});" +
    "shadow.getElementById('plk-next').addEventListener('click',function(){i=(i+1)%rows.length;set()});" +
    "dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close()});";
  return ok({ html, css, js });
};

/* ---- Video player card ---- */
export const videoPlayerCard: R = (c) => {
  const url = String(c.link || "");
  const yt = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/.exec(url);
  const inner = yt
    ? '<iframe src="https://www.youtube-nocookie.com/embed/' + esc(yt[1]) + '" title="' + esc(c.text || "Video") +
      '" loading="lazy" allow="encrypted-media; picture-in-picture" allowfullscreen></iframe>'
    : '<video controls preload="metadata" src="' + esc(url) + '"></video>';
  const html =
    '<div class="plk-wrap"><figure class="plk-videocard">' +
    '<div class="plk-vframe">' + inner + "</div>" +
    (c.text ? "<figcaption>" + esc(c.text) + "</figcaption>" : "") +
    "</figure>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, `
.plk-videocard { margin: 0; padding: var(--w-pad); max-width: 720px; margin-inline: auto;
  display: flex; flex-direction: column; gap: 10px; }
.plk-vframe { aspect-ratio: 16 / 9; border-radius: var(--w-radius); overflow: hidden;
  border: 1px solid var(--w-line); background: var(--w-card); ${SOFT} }
.plk-vframe iframe, .plk-vframe video { width: 100%; height: 100%; border: 0; display: block; }
.plk-videocard figcaption { font-size: 13px; color: var(--w-muted); text-align: center; }
`);
  return ok({ html, css });
};

/* ---- Podcast player ---- */
export const podcastPlayer: R = (c) => {
  const rows = lines(c.items).map((r) => {
    const [dur] = (r.right || "").split("|").map((s) => s.trim());
    return { url: r.left, title: r.right ? r.right.split("|")[0].trim() : "Episode", dur: dur || "" };
  });
  const html =
    '<div class="plk-wrap"><div class="plk-pod">' +
    (c.text ? "<h3>" + esc(c.text) + "</h3>" : "") +
    rows
      .map(
        (r, i) =>
          '<div class="plk-podrow"><div class="plk-podmeta"><button type="button" data-i="' + i +
          '" class="plk-podplay" aria-label="Play ' + esc(r.title) + '">▶</button>' +
          "<span>" + esc(r.title) + "</span></div><em>" + esc(r.dur) + "</em></div>"
      )
      .join("") +
    '<audio id="plk-podaudio" controls preload="none" style="display:none"></audio></div>' +
    badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, `
.plk-pod { max-width: 620px; margin-inline: auto; padding: var(--w-pad); display: flex; flex-direction: column; gap: 10px; }
.plk-pod h3 { margin: 0 0 4px; font-size: 16px; font-weight: 600; }
.plk-podrow { display: flex; align-items: center; justify-content: space-between; gap: 12px;
  background: var(--w-card); border: 1px solid var(--w-line); border-radius: calc(var(--w-radius) - 2px);
  padding: 12px 14px; }
.plk-podmeta { display: flex; align-items: center; gap: 12px; min-width: 0; }
.plk-podmeta > span { font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.plk-podrow em { font-style: normal; font-size: 12px; color: var(--w-muted); flex-shrink: 0; }
.plk-podplay { width: 34px; height: 34px; border-radius: 999px; border: 0; flex-shrink: 0; cursor: pointer;
  background: color-mix(in oklab, var(--w-accent) 14%, var(--w-card)); color: var(--w-accent);
  font-size: 12px; display: flex; align-items: center; justify-content: center;
  transition: transform 160ms cubic-bezier(0.23,1,0.32,1); }
.plk-podplay:active { transform: scale(0.92); }
.plk-podrow.playing { border-color: var(--w-accent); }
`);
  const js =
    "var rows=" + JSON.stringify(rows.map((r) => r.url)) + ";" +
    "var a=shadow.getElementById('plk-podaudio');" +
    "shadow.querySelectorAll('.plk-podplay').forEach(function(b){b.addEventListener('click',function(){" +
    "var row=b.closest('.plk-podrow');" +
    "if(row.classList.contains('playing')){a.pause();row.classList.remove('playing');row.querySelector('.plk-podplay').textContent='▶';return}" +
    "shadow.querySelectorAll('.plk-podrow').forEach(function(x){x.classList.remove('playing');x.querySelector('.plk-podplay').textContent='▶'});" +
    "row.classList.add('playing');b.textContent='❚❚';a.src=rows[Number(b.dataset.i)];a.style.display='block';a.play()})});";
  return ok({ html, css, js });
};

/* ---- Single audio player ---- */
export const audioPlayer: R = (c) => {
  const html =
    '<div class="plk-wrap"><div class="plk-oneaudio"><strong>' + esc(c.text || "Now playing") + "</strong>" +
    '<audio controls preload="none" src="' + esc(c.link || "") + '"></audio></div>' +
    badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, `
.plk-oneaudio { max-width: 460px; margin-inline: auto; padding: var(--w-pad);
  background: var(--w-card); border: 1px solid var(--w-line); border-radius: var(--w-radius);
  padding: 18px 20px; display: flex; flex-direction: column; gap: 10px; ${SOFT} }
.plk-oneaudio strong { font-size: 14.5px; font-weight: 600; }
.plk-oneaudio audio { width: 100%; height: 38px; }
`);
  return ok({ html, css });
};

/* ---- PDF viewer ---- */
export const pdfViewer: R = (c) => {
  const html =
    '<div class="plk-wrap"><div class="plk-pdf">' +
    (c.text ? "<h3>" + esc(c.text) + "</h3>" : "") +
    '<iframe src="' + esc(c.link || "") + '" title="' + esc(c.text || "PDF") + '" loading="lazy"></iframe>' +
    '<a class="plk-pdflink" href="' + esc(c.link || "#") + '" target="_blank" rel="noopener">Open in a new tab ↗</a>' +
    "</div>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, `
.plk-pdf { max-width: 720px; margin-inline: auto; padding: var(--w-pad); display: flex; flex-direction: column; gap: 10px; }
.plk-pdf h3 { margin: 0; font-size: 15.5px; font-weight: 600; }
.plk-pdf iframe { width: 100%; height: 480px; border: 1px solid var(--w-line); border-radius: var(--w-radius); background: var(--w-card); }
.plk-pdflink { font-size: 13px; color: var(--w-accent); text-decoration: none; align-self: end; }
.plk-pdflink:hover { text-decoration: underline; }
`);
  return ok({ html, css });
};

/* ---- Timeline ---- */
export const timeline: R = (c) => {
  const rows = lines(c.items).map((r) => {
    const [title, text] = (r.right || "").split("|").map((s) => s.trim());
    return { when: r.left, title: title || "", text: text || "" };
  });
  const html =
    '<div class="plk-wrap"><div class="plk-tl">' +
    rows
      .map(
        (r) =>
          '<div class="plk-tlrow plk-rv"><span class="plk-tlwhen">' + esc(r.when) + "</span>" +
          '<span class="plk-tldot" aria-hidden="true"></span>' +
          '<span class="plk-tlbody"><strong>' + esc(r.title) + "</strong>" +
          (r.text ? "<p>" + esc(r.text) + "</p>" : "") + "</span></div>"
      )
      .join("") +
    "</div>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, `
.plk-tl { max-width: 620px; margin-inline: auto; padding: var(--w-pad); }
.plk-tlrow { display: grid; grid-template-columns: 64px 18px 1fr; gap: 8px; position: relative; padding-bottom: 22px; }
.plk-tlrow:last-child { padding-bottom: 0; }
.plk-tlwhen { font-size: 13px; font-weight: 600; color: var(--w-accent); font-variant-numeric: tabular-nums; text-align: right; padding-top: 1px; }
.plk-tldot { width: 11px; height: 11px; border-radius: 999px; background: var(--w-card);
  border: 2.5px solid var(--w-accent); margin-top: 4px; justify-self: center; z-index: 1; }
.plk-tlrow:not(:last-child) .plk-tldot::after { content: ""; position: absolute; top: 16px; bottom: -8px; left: 50%;
  width: 1.5px; translate: -50% 0; background: var(--w-line); }
.plk-tlbody strong { font-size: 14.5px; font-weight: 600; }
.plk-tlbody p { margin: 4px 0 0; font-size: 13.5px; color: var(--w-muted); max-width: 52ch; }
` + REVEAL_CSS);
  return ok({ html, css, js: jsReveal(".plk-tlrow") });
};

/* ---- Changelog feed ---- */
export const changelogFeed: R = (c) => {
  const rows = lines(c.items).map((r) => {
    const [date, text] = (r.right || "").split("|").map((s) => s.trim());
    return { version: r.left, date: date || "", text: text || "" };
  });
  const html =
    '<div class="plk-wrap"><div class="plk-cl">' +
    rows
      .map(
        (r) =>
          '<div class="plk-clrow plk-rv"><span class="plk-clv">' + esc(r.version) + "</span>" +
          '<div><div class="plk-clmeta"><strong>' + esc(r.text) + "</strong><span>" + esc(r.date) + "</span></div></div></div>"
      )
      .join("") +
    "</div>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, `
.plk-cl { max-width: 620px; margin-inline: auto; padding: var(--w-pad); display: flex; flex-direction: column; gap: 12px; }
.plk-clrow { display: flex; gap: 14px; align-items: baseline; }
.plk-clv { font-family: ui-monospace, monospace; font-size: 12.5px; font-weight: 600; color: var(--w-accent);
  background: color-mix(in oklab, var(--w-accent) 10%, transparent); border-radius: 999px; padding: 3px 10px; flex-shrink: 0; }
.plk-clmeta { display: flex; flex-direction: column; gap: 2px; }
.plk-clmeta strong { font-size: 14.5px; font-weight: 500; }
.plk-clmeta span { font-size: 12px; color: var(--w-muted); }
` + REVEAL_CSS);
  return ok({ html, css, js: jsReveal(".plk-clrow") });
};

/* ---- Blog posts embed (RSS via same-origin proxy) ---- */
export const blogPostsEmbed: R = (c) => {
  const feed = String(c.link || "");
  const count = Math.max(1, Math.min(20, Number(lines(c.items)[0]?.left) || 5));
  const html =
    '<div class="plk-wrap"><div class="plk-rss">' +
    '<div class="plk-rsslist" id="plk-rss"><div class="plk-rssstate">Loading posts…</div></div>' +
    "</div>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, `
.plk-rss { max-width: 640px; margin-inline: auto; padding: var(--w-pad); }
.plk-rsslist { display: flex; flex-direction: column; gap: 10px; }
.plk-rssstate { font-size: 14px; color: var(--w-muted); padding: 12px 0; }
.plk-rssrow { display: flex; flex-direction: column; gap: 2px; background: var(--w-card);
  border: 1px solid var(--w-line); border-radius: calc(var(--w-radius) - 2px); padding: 13px 16px;
  text-decoration: none; color: var(--w-ink); transition: border-color 160ms ease; }
.plk-rssrow:hover { border-color: var(--w-accent); }
.plk-rssrow strong { font-size: 14px; font-weight: 600; }
.plk-rssrow span { font-size: 12px; color: var(--w-muted); }
`);
  const js =
    "var list=shadow.getElementById('plk-rss');" +
    "fetch('/api/fetch?url=' + encodeURIComponent('" + jsEsc(feed) + "'))" +
    ".then(function(r){if(!r.ok)throw 0;return r.text()})" +
    ".then(function(xml){" +
    "var doc=new DOMParser().parseFromString(xml,'text/xml');" +
    "var items=Array.from(doc.querySelectorAll('item, entry')).slice(0," + count + ");" +
    "if(!items.length)throw 0;" +
    "list.innerHTML='';items.forEach(function(it){" +
    "var title=(it.querySelector('title')||{}).textContent||'Untitled';" +
    "var linkEl=it.querySelector('link');var href=linkEl?(linkEl.textContent||linkEl.getAttribute('href')||''):'#';" +
    "var date=(it.querySelector('pubDate, updated, published')||{}).textContent||'';" +
    "var a=document.createElement('a');a.className='plk-rssrow';a.href=href;a.target='_blank';a.rel='noopener';" +
    "a.innerHTML='<strong></strong><span></span>';a.querySelector('strong').textContent=title.trim();" +
    "a.querySelector('span').textContent=(date||'').slice(0,22);" +
    "list.appendChild(a)})}).catch(function(){list.innerHTML='<div class=\\'plk-rssstate\\'>Could not load that feed. Check the URL is a public RSS feed.</div>'});";
  return ok({ html, css, js });
};
