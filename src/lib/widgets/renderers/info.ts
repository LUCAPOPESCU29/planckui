import { baseCss, badgeHtml, esc, ok } from "../base";
import type { RenderResult, TestimonialData, WidgetConfig } from "../types";
import { PLATFORM_CSS, SOFT, jsEsc, lines, platformCard, qrUrl } from "./kit";

type R = (c: WidgetConfig, items: TestimonialData[]) => RenderResult;

const BTN = `
.plk-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: var(--w-accent);
  color: #fff; text-decoration: none; font-weight: 600; font-size: 14px; padding: 11px 18px;
  border: 0; border-radius: 999px; cursor: pointer; font-family: inherit;
  transition: transform 160ms cubic-bezier(0.23,1,0.32,1), filter 160ms ease; }
.plk-btn:hover { filter: brightness(1.06); }
.plk-btn:active { transform: scale(0.97); }
`;

/* ---- Google Maps card (keyless embed) ---- */
export const googleMapsCard: R = (c) => {
  const q = String(c.text || "");
  const html =
    '<div class="plk-wrap"><div class="plk-mapwrap">' +
    '<iframe src="https://maps.google.com/maps?q=' + encodeURIComponent(q) +
    '&z=15&output=embed" title="Map" loading="lazy"></iframe>' +
    "</div></div>" + badgeHtml(c.showBadge);
  const css = baseCss(c, `
.plk-mapwrap { max-width: 640px; margin-inline: auto; padding: var(--w-pad); }
.plk-mapwrap iframe { width: 100%; height: 300px; border: 1px solid var(--w-line); border-radius: var(--w-radius);
  display: block; ${SOFT} }
`);
  return ok({ html, css });
};

/* ---- Opening hours (today highlighted) ---- */
export const openingHours: R = (c) => {
  const rows = lines(c.items);
  const html =
    '<div class="plk-wrap"><div class="plk-hours" id="plk-hours">' +
    rows.map((r) => '<div class="plk-hrow" data-day="' + esc(r.left.slice(0, 3).toLowerCase()) + '"><span>' + esc(r.left) + "</span><span>" + esc(r.right || "—") + "</span></div>").join("") +
    "</div>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, `
.plk-hours { max-width: 340px; margin-inline: auto; padding: var(--w-pad); display: flex; flex-direction: column; }
.plk-hrow { display: flex; justify-content: space-between; gap: 12px; padding: 9px 12px; font-size: 14px;
  border-radius: 8px; }
.plk-hrow span:last-child { color: var(--w-muted); font-variant-numeric: tabular-nums; }
.plk-hrow.today { background: color-mix(in oklab, var(--w-accent) 10%, transparent); font-weight: 600; }
.plk-hrow.today span:last-child { color: var(--w-accent); }
`);
  const js =
    "var d=['sun','mon','tue','wed','thu','fri','sat'][new Date().getDay()];" +
    "var row=shadow.querySelector('[data-day=\"'+d+'\"]');if(row)row.classList.add('today');";
  return ok({ html, css, js });
};

/* ---- Location + directions ---- */
export const locationDirections: R = (c) => {
  const html =
    '<div class="plk-wrap"><div class="plk-loc">' +
    "<strong>" + esc(c.text || "") + "</strong>" +
    (c.link ? '<a class="plk-btn" href="' + esc(c.link) + '" target="_blank" rel="noopener">Get directions ↗</a>' : "") +
    "</div>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, BTN + `
.plk-loc { max-width: 400px; margin-inline: auto; padding: var(--w-pad); background: var(--w-card);
  border: 1px solid var(--w-line); border-radius: var(--w-radius); padding: 20px;
  display: flex; flex-direction: column; gap: 12px; align-items: flex-start; ${SOFT} }
.plk-loc strong { font-size: 15px; font-weight: 600; }
`);
  return ok({ html, css });
};

/* ---- Event countdown card ---- */
export const eventCountdown: R = (c) => {
  const meta = String(c.text || "").split("|");
  const html =
    '<div class="plk-wrap"><div class="plk-ev">' +
    "<h3>" + esc(meta[0] || "") + "</h3>" +
    '<span class="plk-evmeta">' + esc(meta.slice(1).join(" · ")) + "</span>" +
    '<div class="plk-evcd" id="plk-evcd"><span data-u="d">0</span>d <span data-u="h">00</span>:' +
    '<span data-u="m">00</span>:<span data-u="s">00</span></div>' +
    "</div>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, `
.plk-ev { max-width: 400px; margin-inline: auto; background: var(--w-card); border: 1px solid var(--w-line);
  border-radius: var(--w-radius); padding: 24px; text-align: center; display: flex; flex-direction: column;
  gap: 8px; ${SOFT} }
.plk-ev h3 { margin: 0; font-size: 18px; font-weight: 650; letter-spacing: -0.01em; }
.plk-evmeta { font-size: 13px; color: var(--w-muted); }
.plk-evcd { margin-top: 8px; font-size: 1.7rem; font-weight: 650; font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em; color: var(--w-accent); }
`);
  const js =
    "var t=Date.parse('" + jsEsc(c.target || "") + "');" +
    "var root=shadow.getElementById('plk-evcd');" +
    "if(root&&!isNaN(t)){function pad(n){return String(n).padStart(2,'0')}" +
    "function tick(){var s=Math.max(0,Math.floor((t-Date.now())/1000));" +
    "root.querySelector('[data-u=d]').textContent=Math.floor(s/86400);" +
    "root.querySelector('[data-u=h]').textContent=pad(Math.floor(s%86400/3600));" +
    "root.querySelector('[data-u=m]').textContent=pad(Math.floor(s%3600/60));" +
    "root.querySelector('[data-u=s]').textContent=pad(s%60)}tick();setInterval(tick,1000)}";
  return ok({ html, css, js });
};

/* ---- Event agenda ---- */
export const eventAgenda: R = (c) => {
  const rows = lines(c.items).map((r) => {
    const [speaker] = (r.right || "").split("|").map((s) => s.trim());
    const title = (r.right || "").split("|")[0]?.trim() || "";
    return { time: r.left, title, speaker: speaker && speaker !== title ? speaker : "" };
  });
  const html =
    '<div class="plk-wrap"><div class="plk-agenda">' +
    rows.map((r) => '<div class="plk-agrow"><span class="plk-agtime">' + esc(r.time) + '</span><span class="plk-agmain"><strong>' + esc(r.title) + "</strong>" + (r.speaker ? "<em>" + esc(r.speaker) + "</em>" : "") + "</span></div>").join("") +
    "</div>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, `
.plk-agenda { max-width: 520px; margin-inline: auto; padding: var(--w-pad); display: flex; flex-direction: column; }
.plk-agrow { display: flex; gap: 16px; padding: 12px 4px; border-bottom: 1px solid var(--w-line); }
.plk-agrow:last-child { border-bottom: 0; }
.plk-agtime { font-size: 13px; font-weight: 600; color: var(--w-accent); font-variant-numeric: tabular-nums; width: 52px; flex-shrink: 0; padding-top: 1px; }
.plk-agmain { display: flex; flex-direction: column; gap: 2px; }
.plk-agmain strong { font-size: 14.5px; font-weight: 600; }
.plk-agmain em { font-style: normal; font-size: 12.5px; color: var(--w-muted); }
`);
  return ok({ html, css });
};

/* ---- Team grid ---- */
export const teamGrid: R = (c) => {
  const rows = lines(c.items).map((r) => {
    const [role, img] = (r.right || "").split("|").map((s) => s.trim());
    return { name: r.left, role: role || "", img: img || "" };
  });
  const cols = Number(c.maxColumns) || 3;
  const html =
    '<div class="plk-wrap"><div class="plk-team" style="--w-cols:' + cols + '">' +
    rows
      .map((r) => {
        const initial = esc((r.name || "?").charAt(0).toUpperCase());
        const face = r.img
          ? '<img src="' + esc(r.img) + '" alt="' + esc(r.name) + '" loading="lazy">'
          : '<span class="plk-teaminitial">' + initial + "</span>";
        return (
          '<div class="plk-teamcard">' +
          '<div class="plk-teamface">' + face + "</div>" +
          "<strong>" + esc(r.name) + "</strong><span>" + esc(r.role) + "</span></div>"
        );
      })
      .join("") +
    "</div>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, `
.plk-team { display: grid; grid-template-columns: repeat(var(--w-cols), 1fr); gap: var(--w-gap); padding: var(--w-pad); max-width: 820px; margin-inline: auto; }
@container (max-width: 640px) { .plk-team { grid-template-columns: repeat(2, 1fr); } }
.plk-teamcard { background: var(--w-card); border: 1px solid var(--w-line); border-radius: var(--w-radius);
  padding: 20px 14px; text-align: center; display: flex; flex-direction: column; gap: 3px; align-items: center; ${SOFT} }
.plk-teamface { width: 64px; height: 64px; border-radius: 999px; overflow: hidden; margin-bottom: 6px;
  background: color-mix(in oklab, var(--w-accent) 14%, var(--w-card)); display: flex; align-items: center;
  justify-content: center; font-weight: 650; font-size: 20px; color: color-mix(in oklab, var(--w-accent) 75%, var(--w-ink)); }
.plk-teamface img { width: 100%; height: 100%; object-fit: cover; }
.plk-teamcard strong { font-size: 14px; font-weight: 600; }
.plk-teamcard span { font-size: 12.5px; color: var(--w-muted); }
`);
  return ok({ html, css });
};

/* ---- vCard business card (real .vcf download) ---- */
export const vcardBusinessCard: R = (c) => {
  const segs = (lines(c.items)[0]?.right || "").split("|").map((s) => s.trim());
  const [role, phone, email, org] = [segs[0] || "", segs[1] || "", segs[2] || "", segs[3] || ""];
  const name = lines(c.items)[0]?.left || "";
  const html =
    '<div class="plk-wrap"><div class="plk-vcard">' +
    '<span class="plk-vcavatar" aria-hidden="true">' + esc(name.charAt(0).toUpperCase()) + "</span>" +
    "<div><strong>" + esc(name) + "</strong><span>" + esc(role) + "</span></div>" +
    '<div class="plk-vcmeta"><span>' + esc(phone) + "</span><span>" + esc(email) + "</span><span>" + esc(org) + "</span></div>" +
    '<button class="plk-btn" id="plk-vcbtn" type="button">Save contact</button>' +
    "</div>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, BTN + `
.plk-vcard { max-width: 340px; margin-inline: auto; background: var(--w-card); border: 1px solid var(--w-line);
  border-radius: var(--w-radius); padding: 24px; display: flex; flex-direction: column; gap: 12px; text-align: center; align-items: center; ${SOFT} }
.plk-vcavatar { width: 56px; height: 56px; border-radius: 999px; display: flex; align-items: center; justify-content: center;
  background: color-mix(in oklab, var(--w-accent) 14%, var(--w-card)); color: color-mix(in oklab, var(--w-accent) 75%, var(--w-ink));
  font-weight: 650; font-size: 20px; }
.plk-vcard > div:nth-child(2) { display: flex; flex-direction: column; gap: 2px; }
.plk-vcard strong { font-size: 15.5px; font-weight: 600; }
.plk-vcard span { font-size: 13px; color: var(--w-muted); }
.plk-vcmeta { display: flex; flex-direction: column; gap: 2px; font-size: 13px; color: var(--w-muted); }
.plk-vcard .plk-btn { align-self: stretch; justify-content: center; }
`);
  const js =
    "shadow.getElementById('plk-vcbtn').addEventListener('click',function(){" +
    "var v='BEGIN:VCARD\\nVERSION:3.0\\nFN:" + jsEsc(name) + "\\nTITLE:" + jsEsc(role) + "\\nORG:" + jsEsc(org) +
    "\\nTEL:" + jsEsc(phone) + "\\nEMAIL:" + jsEsc(email) + "\\nEND:VCARD';" +
    "var a=document.createElement('a');a.href='data:text/vcard;charset=utf-8,'+encodeURIComponent(v);" +
    "a.download='contact.vcf';document.body.appendChild(a);a.click();a.remove()});";
  return ok({ html, css, js });
};

/* ---- QR code card ---- */
export const qrCodeCard: R = (c) => {
  const url = String(c.link || "");
  const html =
    '<div class="plk-wrap"><div class="plk-qrcard">' +
    '<img src="' + qrUrl(url || "https://planckui.dev", 220) + '" alt="QR code" width="180" height="180" loading="lazy">' +
    "<span>" + esc(c.text || "") + "</span></div>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, `
.plk-qrcard { width: fit-content; margin-inline: auto; background: var(--w-card); border: 1px solid var(--w-line);
  border-radius: var(--w-radius); padding: 22px; display: flex; flex-direction: column; align-items: center;
  gap: 12px; text-align: center; ${SOFT} }
.plk-qrcard img { border-radius: 10px; }
.plk-qrcard span { font-size: 13.5px; font-weight: 500; color: var(--w-muted); }
`);
  return ok({ html, css });
};

/* ---- Wi-Fi share card ---- */
export const wifiShareCard: R = (c) => {
  const segs = (lines(c.items)[0]?.right || "").split("|").map((s) => s.trim());
  const ssid = lines(c.items)[0]?.left || "";
  const pass = segs[0] || "";
  const auth = (segs[1] || "WPA").toUpperCase().replace("OPEN", "nopass").replace("WPA", "WPA");
  const qr = qrUrl("WIFI:T:" + (auth === "NOPASS" ? "nopass" : "WPA") + ";S:" + ssid + ";" + (auth !== "NOPASS" ? "P:" + pass + ";" : "") + ";", 200);
  const html =
    '<div class="plk-wrap"><div class="plk-wifi">' +
    (c.text ? "<h3>" + esc(c.text) + "</h3>" : "") +
    '<img src="' + qr + '" alt="Wi-Fi QR code" width="170" height="170">' +
    '<div class="plk-wifimeta"><strong>' + esc(ssid) + "</strong><span>" + esc(pass ? "Password: " + pass : "Open network") + "</span></div>" +
    "</div>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, `
.plk-wifi { width: fit-content; margin-inline: auto; background: var(--w-card); border: 1px solid var(--w-line);
  border-radius: var(--w-radius); padding: 24px; display: flex; flex-direction: column; align-items: center;
  gap: 12px; text-align: center; ${SOFT} }
.plk-wifi h3 { margin: 0; font-size: 15.5px; font-weight: 600; }
.plk-wifi img { border-radius: 10px; }
.plk-wifimeta { display: flex; flex-direction: column; gap: 2px; }
.plk-wifimeta strong { font-size: 14.5px; font-weight: 600; }
.plk-wifimeta span { font-size: 12.5px; color: var(--w-muted); }
`);
  return ok({ html, css });
};

/* ---- Weather card (live, keyless Open-Meteo) ---- */
export const weatherCard: R = (c) => {
  const coords = String(c.link || "47.07,15.44");
  const html =
    '<div class="plk-wrap"><div class="plk-weather">' +
    '<span class="plk-wplace">' + esc(c.text || "") + "</span>" +
    '<span class="plk-wtemp" id="plk-wtemp">—</span>' +
    '<span class="plk-wdesc" id="plk-wdesc">Loading live weather…</span>' +
    "</div>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, `
.plk-weather { width: fit-content; margin-inline: auto; padding: 26px 34px; text-align: center;
  background: var(--w-card); border: 1px solid var(--w-line); border-radius: var(--w-radius);
  display: flex; flex-direction: column; gap: 4px; ${SOFT} }
.plk-wplace { font-size: 13px; color: var(--w-muted); }
.plk-wtemp { font-size: 2.6rem; font-weight: 650; letter-spacing: -0.03em; line-height: 1.1;
  font-variant-numeric: tabular-nums; }
.plk-wdesc { font-size: 13px; color: var(--w-muted); }
`);
  const parts = coords.split(",").map((s) => s.trim());
  const js =
    "var la=" + jsEsc(parts[0] || "") + ",lo=" + jsEsc(parts[1] || "") + ";" +
    "fetch('https://api.open-meteo.com/v1/forecast?latitude='+la+'&longitude='+lo+'&current=temperature_2m,weather_code')" +
    ".then(function(r){return r.json()}).then(function(d){var t=Math.round(d.current.temperature_2m);" +
    "shadow.getElementById('plk-wtemp').textContent=t+'°C';" +
    "var codes={0:'Clear sky',1:'Mostly clear',2:'Partly cloudy',3:'Overcast',45:'Fog',51:'Drizzle',61:'Rain',71:'Snow',80:'Showers',95:'Thunderstorm'};" +
    "shadow.getElementById('plk-wdesc').textContent=codes[d.current.weather_code]||'Live now'" +
    "}).catch(function(){shadow.getElementById('plk-wdesc').textContent='Weather unavailable'})";
  return ok({ html, css, js });
};

/* ---- World clock ---- */
export const worldClock: R = (c) => {
  const rows = lines(c.items);
  const data = rows.map((r) => ({ city: r.left, tz: r.right || "UTC" }));
  const html =
    '<div class="plk-wrap"><div class="plk-clocks" id="plk-clocks">' +
    data.map((d) => '<div class="plk-clock"><strong>' + esc(d.city) + '</strong><span data-tz="' + esc(d.tz) + '">—</span></div>').join("") +
    "</div>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, `
.plk-clocks { display: flex; gap: var(--w-gap); justify-content: center; flex-wrap: wrap; padding: var(--w-pad); }
.plk-clock { background: var(--w-card); border: 1px solid var(--w-line); border-radius: var(--w-radius);
  padding: 14px 22px; display: flex; flex-direction: column; gap: 2px; align-items: center; ${SOFT} }
.plk-clock strong { font-size: 12.5px; font-weight: 600; color: var(--w-muted); }
.plk-clock span { font-size: 1.4rem; font-weight: 650; font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }
`);
  const js =
    "var zones=" + JSON.stringify(data.map((d) => d.tz)) + ";" +
    "function tick(){shadow.querySelectorAll('.plk-clock span[data-tz]').forEach(function(el,i){" +
    "try{el.textContent=new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:zones[i]}).format(new Date())}catch(e){el.textContent='—'}})}" +
    "tick();setInterval(tick,10000);";
  return ok({ html, css, js });
};

void PLATFORM_CSS;
void platformCard;
