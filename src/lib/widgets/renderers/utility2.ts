import { baseCss, badgeHtml, esc, ok } from "../base";
import type { RenderResult, TestimonialData, WidgetConfig } from "../types";
import { SOFT, TOOL_CSS, fieldRow, lines, toolShell } from "./kit";

type R = (c: WidgetConfig, items: TestimonialData[]) => RenderResult;

const wrap = (c: WidgetConfig, inner: string) =>
  '<div class="plk-wrap">' + inner + badgeHtml(c.showBadge) + "</div>";

/* ---- Calorie / BMR calculator ---- */
export const calorieBmrCalculator: R = (c) => {
  const html =
    fieldRow("Sex", '<select name="s"><option value="m">Male</option><option value="f">Female</option></select>') +
    fieldRow("Age", '<input type="number" name="age" value="30" min="10" max="100">') +
    fieldRow("Height (cm)", '<input type="number" name="h" value="175">') +
    fieldRow("Weight (kg)", '<input type="number" name="w" value="70" step="0.5">') +
    fieldRow("Activity", '<select name="a"><option value="1.2">Mostly sitting</option><option value="1.375">Light movement</option><option value="1.55" selected>Moderate</option><option value="1.725">Very active</option></select>') +
    '<dl class="plk-out"><dt>BMR</dt><dd id="plk-o1">—</dd><dt style="margin-top:8px">Daily needs</dt><dd id="plk-o2">—</dd></dl>';
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function calc(){var s=f.s.value==='m'?5:-161,bmr=10*+f.w.value+6.25*+f.h.value-5*+f.age.value+s;" +
    "shadow.getElementById('plk-o1').textContent=Math.round(bmr)+' kcal';" +
    "shadow.getElementById('plk-o2').textContent=Math.round(bmr*+f.a.value).toLocaleString()+' kcal'}" +
    "f.addEventListener('input',calc);calc();";
  return ok({ html: toolShell(c, html), css: baseCss(c, TOOL_CSS), js });
};

/* ---- Hours worked calculator ---- */
export const hoursWorkedCalculator: R = (c) => {
  const html =
    fieldRow("Shift start", '<input type="time" name="a" value="09:00">') +
    fieldRow("Shift end", '<input type="time" name="b" value="17:30">') +
    fieldRow("Unpaid break (minutes)", '<input type="number" name="br" value="30" min="0">') +
    fieldRow("Hourly rate (optional)", '<input type="number" name="r" min="0" step="0.01" placeholder="0.00">') +
    '<dl class="plk-out"><dt>Hours worked</dt><dd id="plk-o1">—</dd><dt style="margin-top:8px">Pay</dt><dd id="plk-o2">—</dd></dl>';
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function calc(){if(!f.a.value||!f.b.value)return;" +
    "var m=f.b.value.split(':'),s=f.a.value.split(':');" +
    "var mins=(+m[0]*60+ +m[1])-(+s[0]*60+ +s[1])-+f.br.value;if(mins<0)mins+=1440;" +
    "var hrs=mins/60;shadow.getElementById('plk-o1').textContent=hrs.toFixed(2)+' h';" +
    "var rate=+f.r.value;" +
    "shadow.getElementById('plk-o2').textContent=rate?(hrs*rate).toFixed(2):'set a rate'}" +
    "f.addEventListener('input',calc);calc();";
  return ok({ html: toolShell(c, html), css: baseCss(c, TOOL_CSS), js });
};

/* ---- Timezone meeting planner ---- */
export const timezoneMeetingPlanner: R = (c) => {
  const rows = lines(c.items).map((r) => ({ city: r.left, tz: r.right || "UTC" }));
  const html =
    fieldRow("Meeting time in your timezone", '<input type="time" name="t" value="15:00">') +
    '<div class="plk-tz" id="plk-tz">' +
    rows.map((d) => '<div class="plk-tzrow"><span>' + esc(d.city) + '</span><strong data-tz="' + esc(d.tz) + '">—</strong></div>').join("") +
    "</div>";
  const css = baseCss(c, TOOL_CSS + `
.plk-tz { display: flex; flex-direction: column; gap: 6px; margin-top: 4px; }
.plk-tzrow { display: flex; justify-content: space-between; align-items: center; gap: 12px;
  background: var(--w-card); border: 1px solid var(--w-line); border-radius: calc(var(--w-radius) - 4px);
  padding: 10px 13px; font-size: 14px; }
.plk-tzrow strong { font-variant-numeric: tabular-nums; font-weight: 650; }
`);
  const js =
    "var zones=" + JSON.stringify(rows.map((r) => r.tz)) + ";" +
    "var f=shadow.getElementById('plk-f');" +
    "function calc(){var hm=(f.t.value||'15:00').split(':');" +
    "var d=new Date();d.setHours(+hm[0],+hm[1],0,0);" +
    "shadow.querySelectorAll('[data-tz]').forEach(function(el,i){" +
    "try{el.textContent=new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:zones[i]}).format(d)}catch(e){el.textContent='—'}})}" +
    "f.addEventListener('input',calc);calc();";
  return ok({ html: toolShell(c, html), css: baseCss(c, TOOL_CSS), js });
};

/* ---- Random picker wheel ---- */
export const randomPickerWheel: R = (c) => {
  const names = lines(c.items).map((r) => r.left).filter(Boolean);
  const n = Math.max(2, names.length);
  const seg = 360 / n;
  const html =
    '<div class="plk-wrap"><div class="plk-wheelbox">' +
    '<div class="plk-wheel" id="plk-wheel" style="background:conic-gradient(' +
    names.map((_, i) => (i % 2 ? "var(--w-card)" : "color-mix(in oklab, var(--w-accent) 12%, var(--w-card))") + " " + i * seg + "deg " + (i + 1) * seg + "deg").join(",") +
    ')"><span class="plk-wheelcenter" aria-hidden="true"></span></div>' +
    '<button class="plk-btn" id="plk-spin" type="button">Spin</button>' +
    '<p class="plk-wresult" id="plk-wres" role="status"></p></div>' + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, `
.plk-wheelbox { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: var(--w-pad); }
.plk-wheel { position: relative; width: 200px; height: 200px; border-radius: 999px;
  border: 6px solid var(--w-card); ${SOFT} transition: transform 3s cubic-bezier(0.15,0.9,0.2,1); }
.plk-wheelcenter { position: absolute; inset: 0; margin: auto; width: 46px; height: 46px;
  border-radius: 999px; background: var(--w-bg); border: 1px solid var(--w-line); }
.plk-wresult { margin: 0; min-height: 20px; font-weight: 600; font-size: 15px; color: var(--w-accent); }
.plk-wheelbox .plk-btn { min-width: 110px; justify-content: center; }
`);
  const js =
    "var names=" + JSON.stringify(names) + ";var w=shadow.getElementById('plk-wheel');" +
    "var res=shadow.getElementById('plk-wres'),btn=shadow.getElementById('plk-spin');" +
    "var rot=0,spinning=false,seg=" + seg + ";" +
    "btn.addEventListener('click',function(){if(spinning)return;spinning=true;res.textContent='';" +
    "var idx=Math.floor(Math.random()*names.length);" +
    "rot+=4*360+(360-(idx*seg+seg/2))-(rot%360);w.style.transform='rotate('+rot+'deg)';" +
    "setTimeout(function(){res.textContent=names[idx];spinning=false},3100)});";
  return ok({ html, css, js });
};

/* ---- Reading time badge ---- */
export const readingTimeBadge: R = (c) => {
  const words = Number(lines(c.items)[0]?.left) || 0;
  const mins = Math.max(1, Math.round(words / 220));
  const html =
    wrap(c, '<div class="plk-rt"><span class="plk-rtbadge">≈ ' + mins + ' min read</span><span class="plk-rtwords">' + words.toLocaleString() + ' words · ' + esc(c.text || "") + '</span></div>');
  const css = baseCss(c, `
.plk-rt { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: var(--w-pad); }
.plk-rtbadge { font-size: 12.5px; font-weight: 600; color: var(--w-accent);
  background: color-mix(in oklab, var(--w-accent) 10%, transparent);
  border-radius: 999px; padding: 5px 14px; }
.plk-rtwords { font-size: 12px; color: var(--w-muted); }
`);
  return ok({ html, css });
};

/* ---- Link preview card (OG via proxy) ---- */
export const linkPreviewCard: R = (c) => {
  const url = String(c.link || "");
  const html =
    '<div class="plk-wrap"><a class="plk-lpc" id="plk-lpc" href="' + esc(url) + '" target="_blank" rel="noopener">' +
    '<div class="plk-lpcimg" id="plk-lpcimg"></div>' +
    '<div class="plk-lpcbody"><strong id="plk-lpct">' + esc(url.replace(/^https?:\/\//, "")) + '</strong><span id="plk-lpcd">Loading preview…</span>' +
    '<em>' + esc(url.replace(/^https?:\/\//, "").split("/")[0]) + ' — opens in a new tab ↗</em></div></a>' +
    badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, `
.plk-lpc { display: block; max-width: 480px; margin-inline: auto; background: var(--w-card);
  border: 1px solid var(--w-line); border-radius: var(--w-radius); overflow: hidden;
  text-decoration: none; color: var(--w-ink); transition: border-color 180ms ease, transform 180ms cubic-bezier(0.23,1,0.32,1); }
.plk-lpc:hover { border-color: color-mix(in oklab, var(--w-accent) 50%, var(--w-line)); transform: translateY(-1px); }
.plk-lpcimg { width: 100%; aspect-ratio: 1.91 / 1; background: color-mix(in oklab, var(--w-accent) 8%, var(--w-card)); }
.plk-lpcimg img { width: 100%; height: 100%; object-fit: cover; display: block; }
.plk-lpcbody { padding: 14px 16px; display: flex; flex-direction: column; gap: 3px; }
.plk-lpcbody strong { font-size: 14.5px; font-weight: 600; }
.plk-lpcbody span { font-size: 13px; color: var(--w-muted); }
.plk-lpcbody em { font-style: normal; font-size: 11.5px; color: var(--w-muted); margin-top: 3px; }
`);
  const js =
    "fetch('/api/fetch?url=' + encodeURIComponent('" + url.replace(/'/g, "\\'") + "'))" +
    ".then(function(r){return r.text()}).then(function(html){" +
    "function og(p){var m=html.match(new RegExp('<meta[^>]+property=[\"\\\\']'+p+'[\"\\\\'][^>]+content=[\"\\\\']([^\"\\\\']+)', 'i'))||html.match(new RegExp('<meta[^>]+name=[\"\\\\']'+p+'[\"\\\\'][^>]+content=[\"\\\\']([^\"\\\\']+)', 'i'));return m?m[1]:''}" +
    "var t=og('og:title'),d=og('og:description'),i=og('og:image');" +
    "if(t)shadow.getElementById('plk-lpct').textContent=t;" +
    "if(d)shadow.getElementById('plk-lpcd').textContent=d;" +
    "if(i){var img=document.createElement('img');img.src=i;img.loading='lazy';" +
    "shadow.getElementById('plk-lpcimg').appendChild(img)}})" +
    ".catch(function(){shadow.getElementById('plk-lpcd').textContent='Preview unavailable'})";
  return ok({ html, css, js });
};

/* ---- Screenshot placeholder generator ---- */
export const screenshotPlaceholderGenerator: R = (c) => {
  const html =
    fieldRow("Width", '<input type="number" name="w" value="800" min="16">') +
    fieldRow("Height", '<input type="number" name="h" value="450" min="16">') +
    fieldRow("Text (optional)", '<input name="t" placeholder="Hello">') +
    '<dl class="plk-out"><dt>Preview</dt><dd style="margin:0"><img id="plk-img" alt="Placeholder" style="max-width:100%;border-radius:8px"></dd></dl>' +
    '<a class="plk-btn" id="plk-url" target="_blank" rel="noopener">Open image ↗</a>';
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function upd(){var w=+f.w.value||800,h=+f.h.value||450,t=f.t.value;" +
    "var u='https://placehold.co/'+w+'x'+(h)+(t?'/text='+encodeURIComponent(t):'')+'?font=source-sans-pro';" +
    "shadow.getElementById('plk-img').src=u;shadow.getElementById('plk-url').href=u}" +
    "f.addEventListener('input',upd);upd();";
  return ok({ html: toolShell(c, html), css: baseCss(c, TOOL_CSS + `
.plk-tool .plk-btn { text-decoration: none; justify-content: center; }
`), js });
};

/* ---- Favicon preview card ---- */
export const faviconPreviewCard: R = (c) => {
  const domain = String(c.link || "").replace(/^https?:\/\//, "").replace(/\/$/, "");
  const html =
    '<div class="plk-wrap"><div class="plk-fav">' +
    (c.text ? "<h3>" + esc(c.text) + "</h3>" : "") +
    '<div class="plk-favrow"><div class="plk-favdark"><img src="https://www.google.com/s2/favicons?domain=' +
    esc(domain) + '&sz=64" alt="Favicon"></div>' +
    '<div class="plk-favlight"><img src="https://www.google.com/s2/favicons?domain=' +
    esc(domain) + '&sz=64" alt="Favicon"></div></div>' +
    "<span>" + esc(domain) + " — dark and light contexts, 64px</span></div>" +
    badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, `
.plk-fav { width: fit-content; margin-inline: auto; padding: var(--w-pad); text-align: center;
  display: flex; flex-direction: column; gap: 12px; align-items: center; }
.plk-fav h3 { margin: 0; font-size: 15px; font-weight: 600; }
.plk-favrow { display: flex; gap: 10px; }
.plk-favdark, .plk-favlight { width: 76px; height: 76px; border-radius: var(--w-radius);
  display: flex; align-items: center; justify-content: center; border: 1px solid var(--w-line); }
.plk-favdark { background: oklch(0.22 0.01 240); }
.plk-favlight { background: oklch(0.97 0 240); }
.plk-fav span { font-size: 12.5px; color: var(--w-muted); }
`);
  return ok({ html, css });
};

/* ---- Uptime badge ---- */
export const uptimeBadge: R = (c) => {
  const s = String(c.variant || "operational");
  const color = s === "down" ? "oklch(0.58 0.2 25)" : s === "degraded" ? "oklch(0.75 0.13 82)" : "oklch(0.68 0.15 155)";
  const html =
    '<div class="plk-wrap"><a class="plk-up" href="' + esc(c.link || "#") + '" target="_blank" rel="noopener">' +
    '<span class="plk-updot" style="background:' + color + '"></span>' + esc(c.text || "All systems operational") + "</a></div>" +
    badgeHtml(c.showBadge);
  const css = baseCss(c, `
.plk-up { width: fit-content; margin-inline: auto; display: inline-flex; align-items: center; gap: 9px;
  background: var(--w-card); border: 1px solid var(--w-line); border-radius: 999px;
  padding: 9px 16px; font-size: 13px; font-weight: 500; color: var(--w-ink); text-decoration: none;
  transition: border-color 150ms ease; }
.plk-up:hover { border-color: var(--w-accent); }
.plk-updot { width: 9px; height: 9px; border-radius: 999px; }
`);
  return ok({ html, css });
};

/* ---- Status page embed ---- */
export const statusPageEmbed: R = (c) => {
  const rows = lines(c.items).map((r) => ({ service: r.left, status: r.right || "operational" }));
  const colorFor = (s: string) =>
    s.startsWith("deg") ? "oklch(0.75 0.13 82)" : s.startsWith("down") ? "oklch(0.58 0.2 25)" : "oklch(0.68 0.15 155)";
  const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const html =
    '<div class="plk-wrap"><div class="plk-status">' +
    (c.text ? '<div class="plk-statushead"><strong>' + esc(c.text) + '</strong><span style="background:' + colorFor("operational") + '"></span></div>' : "") +
    rows
      .map(
        (r) =>
          '<div class="plk-statusrow"><span>' + esc(r.service) + "</span>" +
          '<span class="plk-statuspill"><span class="plk-statusdot" style="background:' + colorFor(r.status) + '"></span>' +
          esc(label(r.status)) + "</span></div>"
      )
      .join("") +
    "</div>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, `
.plk-status { max-width: 420px; margin-inline: auto; padding: var(--w-pad); display: flex; flex-direction: column; gap: 8px; }
.plk-statushead { display: flex; align-items: center; justify-content: space-between; gap: 10px;
  font-size: 14.5px; padding: 2px 2px 6px; }
.plk-statushead strong { font-weight: 600; }
.plk-statushead span:last-child { width: 10px; height: 10px; border-radius: 999px; }
.plk-statusrow { display: flex; align-items: center; justify-content: space-between; gap: 12px;
  background: var(--w-card); border: 1px solid var(--w-line); border-radius: calc(var(--w-radius) - 2px);
  padding: 12px 15px; font-size: 14px; }
.plk-statuspill { display: inline-flex; align-items: center; gap: 7px; font-size: 12.5px; color: var(--w-muted); }
.plk-statusdot { width: 8px; height: 8px; border-radius: 999px; }
`);
  return ok({ html, css });
};
