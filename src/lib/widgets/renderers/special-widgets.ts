import { esc } from "../base";
import type { RenderResult, WidgetConfig } from "../types";
import { brandSvg } from "./kit";
import { WIDGETS } from "../registry";
import type { WidgetDef } from "../types";

/* Special — 30 widgets inspired by the categories popular on 21st.dev
   (heroes, pricing, testimonials, inputs, dialogs, stats...), rebuilt as
   original dark cards in PlanckUi's design language. All interactive. */

type SR = (c: WidgetConfig) => RenderResult;



const S_CSS = `
:host {
  --s-card: oklch(0.99 0.003 240);
  --s-card2: oklch(0.955 0.006 240);
  --s-ink: oklch(0.25 0.02 235);
  --s-mut: oklch(0.5 0.02 242);
  --s-line: oklch(0.9 0.008 240);
}
:host(.dark) {
  --s-card: oklch(0.22 0.014 245);
  --s-card2: oklch(0.28 0.016 243);
  --s-ink: oklch(0.93 0.008 230);
  --s-mut: oklch(0.66 0.012 235);
  --s-line: oklch(0.32 0.014 242);
}
:host {
  --s-card: oklch(0.99 0.003 240);
  --s-card2: oklch(0.955 0.006 240);
  --s-ink: oklch(0.25 0.02 235);
  --s-mut: oklch(0.5 0.02 242);
  --s-line: oklch(0.9 0.008 240);
}
:host(.dark) {
  --s-card: oklch(0.22 0.014 245);
  --s-card2: oklch(0.28 0.016 243);
  --s-ink: oklch(0.93 0.008 230);
  --s-mut: oklch(0.66 0.012 235);
  --s-line: oklch(0.32 0.014 242);
}

.plk-scard { position: relative; overflow: hidden; max-width: 400px; margin-inline: auto;
  background: var(--s-card); border: 1px solid var(--s-line);
  border-radius: 18px; padding: 22px; color: var(--s-ink);
  box-shadow: 0 20px 40px oklch(0 0 0 / 0.35);
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; }
.plk-scard h3 { margin: 0; font-size: 19px; font-weight: 700; letter-spacing: -0.015em; color: #fafafa; }
.plk-ssub { margin: 6px 0 0; font-size: 14px; color: var(--s-mut); line-height: 1.5; }
.plk-sbtn { display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  border: 0; cursor: pointer; font: inherit; font-size: 13.5px; font-weight: 600;
  padding: 10px 16px; border-radius: 10px; background: var(--a); color: oklch(0.15 0.01 250);
  transition: transform 160ms cubic-bezier(0.23,1,0.32,1), filter 160ms ease; text-decoration: none; }
.plk-sbtn:hover { filter: brightness(1.1); }
.plk-sbtn:active { transform: scale(0.96); }
.plk-sbtn.ghost { background: transparent; border: 1px solid oklch(0.3 0.01 250); color: inherit; }
.plk-sbtn.ghost:hover { border-color: var(--a); color: var(--a); }
.plk-sinput { width: 100%; font: inherit; font-size: 14px; padding: 10px 13px;
  border: 1px solid oklch(0.3 0.01 250); border-radius: 10px;
  background: var(--s-card2); color: inherit; }
.plk-sinput:focus { outline: 2px solid var(--a); outline-offset: 1px; }
`;

function sh(c: WidgetConfig, inner: string, css = "", js?: string): RenderResult {
  const accent = /^[\w#.%(),\s-]+$/.test(String(c.accent)) && String(c.accent).length < 40 ? String(c.accent) : "#7dd3fc";
  return {
    html:
      '<div class="plk-scard" style="--a:' + accent + ';border-radius:var(--w-radius)">' + inner + "</div>",
    css: `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:host { display: block; --a: ${accent}; font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; }
${S_CSS}${css}
`.trim(),
    js,
  };
}

const T = (c: WidgetConfig, fallback: string) => esc(c.text || fallback);
const itemLines = (c: WidgetConfig, fallback: string[]) => {
  const fromConfig = (c.items || "").split("\n").map((s) => s.trim()).filter(Boolean);
  if (fromConfig.length) return fromConfig;
  return fallback.flatMap((f) => f.split("\n").map((x) => x.trim()).filter(Boolean));
};
const lsGet = (k: string, d: string) => { try { return localStorage.getItem(k) ?? d; } catch { return d; } };
const lsSet = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch {} };

/* ------------------------------------------------- 1-6: marketing blocks */

const hero: SR = (c) => sh(c,
  `<h3>${T(c, "Ship widgets, not weekends")}</h3>` +
  `<p class="plk-ssub">${esc(String(c.items || "The fastest way to make any site feel finished.").split("|")[0])}</p>` +
  `<div style="display:flex;gap:8px;margin-top:16px"><a class="plk-sbtn" href="#">Get started</a><a class="plk-sbtn ghost" href="#">Demo</a></div>`);

const features: SR = (c) => {
  const rows = itemLines(c, ["Fast|Under 15 KB, always", "Honest|Live means live", "Free|The plan is the product", "Yours|Copy the code, keep it"])
    .map((l) => { const [t, d] = l.split("|"); return `<div class="plk-feat"><b>${esc(t || "")}</b><span>${esc(d || "")}</span></div>`; }).join("");
  return sh(c, `<h3>${T(c, "Why PlanckUi")}</h3><div class="plk-feats">${rows}</div>`,
    `.plk-feats { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 14px; }
.plk-feat { background: var(--s-card2); border-radius: 12px; padding: 12px; display: flex; flex-direction: column; gap: 3px; }
.plk-feat b { font-size: 13.5px; } .plk-feat span { font-size: 12px; color: oklch(0.62 0.01 250); }`);
};

const integrations: SR = (c) => {
  const brands = itemLines(c, ["github|GitHub", "slack|Slack", "figma|Figma", "notion|Notion"]).map((l) => l.split("|"));
  const body = brands.map((b) =>
    `<div class="plk-int" data-b="${esc(b[0])}"><span class="plk-intic">${brandSvg(b[0], 18)}</span><span>${esc(b[1] || b[0])}</span><button type="button" class="plk-sbtn ghost plk-intbtn">Connect</button></div>`).join("");
  const js =
    "shadow.querySelectorAll('.plk-int').forEach(function(row){row.querySelector('.plk-intbtn').addEventListener('click',function(){var b=this;b.textContent='Connected';b.style.borderColor='var(--a)';b.style.color='var(--a)'})});";
  return sh(c, `<h3>${T(c, "Integrations")}</h3><div class="plk-intgrid">${body}</div>`,
    `.plk-intgrid { display: flex; flex-direction: column; gap: 8px; margin-top: 14px; }
.plk-int { display: flex; align-items: center; gap: 10px; background: var(--s-card2); border-radius: 10px; padding: 10px 12px; }
.plk-intic { color: var(--a); display: flex; }
.plk-int > span:not(.plk-intic) { flex: 1; font-size: 13.5px; font-weight: 500; }
.plk-intbtn { padding: 6px 12px; font-size: 12px; }`, js);
};

const stats: SR = (c) => {
  const rows = itemLines(c, ["Users|48,200|+12%\nUptime|99.98%|stable\nWidgets|196|+35"])
    .join("\n").split("\n").map((l) => l.split("|").map((s) => s.trim()));
  const cols = rows.map((r, i) =>
    `<div class="plk-statc"><b data-n="${i}">0</b><span>${esc(r[0])}</span><em>${esc(r[2] || "")}</em></div>`).join("");
  const nums = rows.map((r) => parseFloat((r[1] || "0").replace(/[^\d.]/g, "")) || 0);
  const suffixes = rows.map((r) => (r[1] || "").replace(/^[\d.,]+/, ""));
  const js =
    "var nums=" + JSON.stringify(nums) + ",sfx=" + JSON.stringify(suffixes) + ";" +
    "if(matchMedia('(prefers-reduced-motion: reduce)').matches){nums.forEach(function(n,i){shadow.querySelector('[data-n=\"'+i+'\"]').textContent=n.toLocaleString()+ (sfx[i]||'')});return}" +
    "var t0;requestAnimationFrame(function step(ts){t0=t0||ts;var p=Math.min(1,(ts-t0)/1000);" +
    "nums.forEach(function(n,i){shadow.querySelector('[data-n=\"'+i+'\"]').textContent=Math.round(n*(1-Math.pow(1-p,3))).toLocaleString()+(sfx[i]||'')});" +
    "if(p<1)requestAnimationFrame(step)});";
  return sh(c, `<h3>${T(c, "By the numbers")}</h3><div class="plk-statrow">${cols}</div>`,
    `.plk-statrow { display: flex; gap: 12px; margin-top: 14px; }
.plk-statc { flex: 1; background: var(--s-card2); border-radius: 12px; padding: 14px 12px; }
.plk-statc b { display: block; font-size: 20px; font-weight: 700; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
.plk-statc span { font-size: 11.5px; color: oklch(0.62 0.01 250); display: block; margin-top: 2px; }
.plk-statc em { font-style: normal; font-size: 11px; color: var(--a); }`, js);
};

const cta: SR = (c) => sh(c,
  `<h3>${T(c, "Ready in five minutes")}</h3>` +
  `<p class="plk-ssub">Paste one script tag. That is the whole tutorial.</p>` +
  `<div style="display:flex;gap:8px;margin-top:16px"><a class="plk-sbtn" href="#">Start free</a><a class="plk-sbtn ghost" href="#">See pricing</a></div>`,
  `.plk-scard { border-color: color-mix(in oklab, var(--a) 35%, oklch(0.24 0.008 250)); }`);

const testimonial: SR = (c) => {
  const segs = String(c.items || "This replaced a $25/mo tool in one afternoon.|Maya Okafor|Founder, Fern & Co.").split("|");
  return sh(c,
    `<div style="color:var(--a);letter-spacing:3px;font-size:13px">★★★★★</div>` +
    `<p style="margin:12px 0 14px;font-size:15.5px;line-height:1.55">“${esc(segs[0] || "")}”</p>` +
    `<div style="display:flex;align-items:center;gap:10px"><span style="width:34px;height:34px;border-radius:999px;background:color-mix(in oklab,var(--a) 18%,transparent);display:inline-flex;align-items:center;justify-content:center;font-weight:650;font-size:13px">${esc((segs[1] || "?").charAt(0))}</span><span><b style="font-size:13px">${esc(segs[1] || "")}</b><br><span style="font-size:12px;color:oklch(0.6 0.01 250)">${esc(segs[2] || "")}</span></span></div>`);
};

/* ------------------------------------------------- 7-14: app primitives */

const newsletter: SR = (c) => {
  const key = "plk-sp-nl";
  const body =
    `<h3>${T(c, "One good email a month")}</h3>` +
    `<form id="plk-nlf" style="display:flex;gap:8px;margin-top:14px">` +
    `<input class="plk-sinput" type="email" required placeholder="you@example.com" aria-label="Email">` +
    `<button class="plk-sbtn" type="submit">Join</button></form><p class="plk-ssub" data-out style="margin-top:8px"></p>`;
  const js =
    "var K='" + key + "';var f=shadow.getElementById('plk-nlf'),out=shadow.querySelector('[data-out]');" +
    "if(localStorage.getItem(K)){f.style.display='none';out.textContent='You are already subscribed.'}" +
    "f.addEventListener('submit',function(e){e.preventDefault();" +
    "try{localStorage.setItem(K,'1')}catch(x){};f.style.display='none';out.textContent='Subscribed. Welcome aboard.'});";
  return sh(c, body, "", js);
};

const cookie: SR = (c) => {
  const key = "plk-sp-cookie";
  const body =
    `<p style="font-size:13.5px;line-height:1.5">${esc(c.text || "We use one cookie: to remember you dismissed this banner.")}</p>` +
    `<div style="display:flex;gap:8px;margin-top:12px"><button class="plk-sbtn" type="button" data-a="ok">Accept</button><button class="plk-sbtn ghost" type="button" data-a="no">Essential only</button></div>`;
  const js =
    "var K='" + key + "';var card=shadow.closest ? shadow.querySelector('.plk-scard') : null;" +
    "try{if(localStorage.getItem(K))card.style.display='none'}catch(e){}" +
    "shadow.querySelectorAll('[data-a]').forEach(function(b){b.addEventListener('click',function(){" +
    "try{localStorage.setItem(K,b.dataset.a)}catch(e){};card.style.display='none'})});";
  return sh(c, body, "", js);
};

const notifications: SR = (c) => {
  const rows = itemLines(c, ["Maya left a 5★ review|2m\nNew signup from Graz|9m\nBackup finished|1h"])
    .join("\n").split("\n").map((l) => l.split("|"));
  const body =
    `<div class="plk-notestack">` +
    rows.map((r, i) => `<div class="plk-note" data-i="${i}"><b>${esc(r[0] || "")}</b><span>${esc(r[1] || "")}</span><button type="button" class="plk-notex" aria-label="Dismiss">×</button></div>`).join("") +
    `</div>`;
  const css = `
.plk-notestack { display: flex; flex-direction: column; gap: 8px; margin-top: 6px; }
.plk-note { background: var(--s-card2); border: 1px solid var(--s-line); border-radius: 12px;
  padding: 11px 13px; display: flex; align-items: center; gap: 10px;
  transition: opacity 250ms cubic-bezier(0.23,1,0.32,1), transform 250ms cubic-bezier(0.23,1,0.32,1); }
.plk-note b { flex: 1; font-size: 13px; font-weight: 500; }
.plk-note span { font-size: 11.5px; color: oklch(0.6 0.01 250); }
.plk-note:hover { transform: translateX(-3px); }
.plk-notex { border: 0; background: none; color: oklch(0.55 0.01 250); font-size: 15px; cursor: pointer; padding: 2px 6px; }
.plk-note.gone { opacity: 0; transform: translateX(-12px); }
`;
  const js =
    "shadow.querySelectorAll('.plk-notex').forEach(function(x){x.addEventListener('click',function(){" +
    "var n=x.closest('.plk-note');n.classList.add('gone');setTimeout(function(){n.remove()},260)})});";
  return sh(c, body, css, js);
};

const download: SR = (c) => {
  const qr = "https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&data=" + encodeURIComponent(String(c.link || "https://planckui.dev"));
  return sh(c,
    `<h3>${T(c, "Get the app")}</h3>` +
    `<div style="display:flex;gap:16px;align-items:center;margin-top:14px">` +
    `<img src="${qr}" alt="QR code" width="92" height="92" style="border-radius:10px">` +
    `<div style="display:flex;flex-direction:column;gap:8px"><a class="plk-sbtn" href="#" style="padding:8px 14px;font-size:12.5px">App Store</a><a class="plk-sbtn ghost" href="#" style="padding:8px 14px;font-size:12.5px">Google Play</a></div></div>` +
    `<p class="plk-ssub" style="margin-top:12px">Scan or tap — free, obviously.</p>`);
};

const roadmap: SR = (c) => {
  const cols = ["Now", "Next", "Later"];
  const rows = itemLines(c, ["Poll widget|shipped\nPrivate blob storage|building\nMobile app|someday"]);
  const body = `<h3>${T(c, "Roadmap")}</h3><div class="plk-rm">` +
    cols.map((col, i) => `<div class="plk-rmcol"><b>${col}</b>` +
      rows.slice(i, i + 1).map((r) => { const [t, d] = r.split("|"); return `<div class="plk-rmcard"><span>${esc(t || "")}</span><em>${esc(d || "")}</em></div>`; }).join("") +
      `</div>`).join("") + `</div>`;
  const css = `
.plk-rm { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 14px; }
.plk-rmcol b { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: oklch(0.6 0.01 250); margin-bottom: 6px; }
.plk-rmcard { background: var(--s-card2); border-radius: 10px; padding: 10px; display: flex; flex-direction: column; gap: 2px; }
.plk-rmcard span { font-size: 12px; font-weight: 550; }
.plk-rmcard em { font-style: normal; font-size: 10.5px; color: var(--a); }
@container (max-width: 380px) { .plk-rm { grid-template-columns: 1fr; } }
`;
  return sh(c, body, css);
};

const kanban: SR = (c) => {
  const cards = itemLines(c, ["Design review\nBuild embeds\nWrite docs"]);
  const body =
    `<h3>${T(c, "Mini board")}</h3>` +
    `<p class="plk-ssub" style="margin-top:4px">Tap a card to move it along.</p>` +
    `<div class="plk-kb">${["To do", "Doing", "Done"].map((col, ci) =>
      `<div class="plk-kbcol" data-col="${ci}"><b>${col}</b></div>`).join("")}</div>`;
  const css = `
.plk-kb { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 12px; }
.plk-kbcol { background: var(--s-card2); border-radius: 10px; padding: 8px; min-height: 110px;
  display: flex; flex-direction: column; gap: 6px; }
.plk-kbcol b { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.07em; color: oklch(0.58 0.01 250); }
.plk-kbcard { background: var(--s-card2); border-radius: 8px; padding: 8px 9px; font-size: 11.5px;
  font-weight: 500; cursor: pointer; transition: transform 150ms cubic-bezier(0.23,1,0.32,1); }
.plk-kbcard:hover { transform: translateY(-2px); }
`;
  const js =
    "var cols=shadow.querySelectorAll('.plk-kbcol');" +
    "var names=" + JSON.stringify(cards) + ";" +
    "names.forEach(function(name,idx){var card=document.createElement('div');card.className='plk-kbcard';card.textContent=name;" +
    "card.addEventListener('click',function(){var next=(idxOf(card)+1)%3;cols[next].appendChild(card)});" +
    "cols[0].appendChild(card)});" +
    "function idxOf(card){var col=card.closest('.plk-kbcol');return Array.prototype.indexOf.call(cols,col)}";
  return sh(c, body, css, js);
};

const calendar: SR = (c) => {
  const now = new Date();
  const monthName = now.toLocaleString("en", { month: "long" });
  const first = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  let cells = "";
  for (let i = 0; i < (first + 6) % 7; i++) cells += "<span></span>";
  for (let d = 1; d <= days; d++) cells += `<button type="button" class="plk-cal${d === now.getDate() ? " today" : ""}" data-d="${d}">${d}</button>`;
  const body = `<h3>${T(c, monthName + " " + now.getFullYear())}</h3>` +
    `<div class="plk-calgrid"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>${cells}</div>`;
  const css = `
.plk-calgrid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-top: 12px; }
.plk-calgrid > span { text-align: center; font-size: 11.5px; color: oklch(0.58 0.01 250); padding: 4px 0; }
.plk-cal { border: 0; background: transparent; color: inherit; font: inherit; font-size: 12px;
  padding: 6px 0; border-radius: 8px; cursor: pointer; transition: background-color 140ms ease; }
.plk-cal:hover { background: oklch(0.22 0.01 250); }
.plk-cal.today { background: var(--a); color: oklch(0.15 0.01 250); font-weight: 700; }
.plk-cal.sel { outline: 2px solid var(--a); outline-offset: -2px; }
`;
  const js =
    "var sel=null;shadow.querySelectorAll('.plk-cal').forEach(function(b){b.addEventListener('click',function(){" +
    "if(sel)sel.classList.remove('sel');sel=b;b.classList.add('sel')})});";
  return sh(c, body, css, js);
};

const table: SR = (c) => {
  const rows = itemLines(c, ["Wall of Love | 1,204 | $0\nFocus timer | 812 | $0\nUptime grid | 640 | $0\nEnergy mix | 415 | $0"])
    .join("\n").split("\n").map((l) => l.split("|").map((s) => s.trim()));
  const head = ["Widget", "Installs", "Price"];
  const body =
    `<h3>${T(c, "Top widgets")}</h3>` +
    `<table class="plk-stable"><thead><tr>${head.map((h, i) => `<th data-s="${i}">${h} ⇅</th>`).join("")}</tr></thead>` +
    `<tbody>${rows.map((r) => `<tr>${r.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
  const css = `
.plk-stable { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
.plk-stable th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em;
  color: oklch(0.58 0.01 250); padding: 7px 6px; cursor: pointer; user-select: none; }
.plk-stable th:hover { color: var(--a); }
.plk-stable td { padding: 8px 6px; border-top: 1px solid oklch(0.24 0.008 250); }
`;
  const js =
    "var tbody=shadow.querySelector('tbody');" +
    "shadow.querySelectorAll('th').forEach(function(th,i){th.addEventListener('click',function(){" +
    "var rows=Array.prototype.slice.call(tbody.querySelectorAll('tr'));" +
    "rows.sort(function(a,b){var x=a.children[i].textContent,y=b.children[i].textContent;" +
    "var nx=parseFloat(x.replace(/[^\\d.]/g,'')),ny=parseFloat(y.replace(/[^\\d.]/g,''));" +
    "return (isNaN(nx)||isNaN(ny))?x.localeCompare(y):nx-ny});" +
    "rows.forEach(function(r){tbody.appendChild(r)})})});";
  return sh(c, body, css, js);
};

/* ------------------------------------------------- 15-30: interactive set */

const command: SR = (c) => {
  const rows = itemLines(c, ["Wall of Love\nFocus timer\nUptime grid\nEnergy mix\nContact form"]);
  const body =
    `<input class="plk-sinput" id="plk-cmd" placeholder="Type to search widgets…" aria-label="Search">` +
    `<ul class="plk-cmdlist" id="plk-cmdl">${rows.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>`;
  const css = `
.plk-cmdlist { list-style: none; margin-top: 10px; display: flex; flex-direction: column; gap: 4px; }
.plk-cmdlist li { font-size: 13.5px; padding: 8px 10px; border-radius: 8px; background: var(--s-card2); }
.plk-cmdlist li:hover { background: var(--s-card2); }
`;
  const js =
    "var inp=shadow.getElementById('plk-cmd'),list=shadow.getElementById('plk-cmdl');" +
    "inp.addEventListener('input',function(){var q=inp.value.toLowerCase();" +
    "list.querySelectorAll('li').forEach(function(li){li.style.display=li.textContent.toLowerCase().includes(q)?'':'none'})});";
  return sh(c, body, css, js);
};

const onboarding: SR = (c) => {
  const steps = itemLines(c, ["Create account\nPick a widget\nPaste the snippet\nDone"]).map((s) => s.trim()).filter(Boolean);
  const body =
    `<h3>${T(c, "Get set up")}</h3>` +
    `<div class="plk-obdots">${steps.map((_, i) => `<span data-d="${i}"></span>`).join("")}</div>` +
    `<p class="plk-obstep" data-step>1. ${esc(steps[0] || "")}</p>` +
    `<div style="display:flex;gap:8px;margin-top:12px"><button type="button" class="plk-sbtn ghost" data-prev>Back</button><button type="button" class="plk-sbtn" data-next>Next</button></div>`;
  const css = `
.plk-obdots { display: flex; gap: 6px; margin-top: 14px; }
.plk-obdots span { height: 6px; flex: 1; border-radius: 999px; background: oklch(0.28 0.01 250); transition: background 200ms ease; }
.plk-obdots span.on { background: var(--a); }
.plk-obstep { margin-top: 12px; font-size: 15px; font-weight: 550; min-height: 22px; }
`;
  const js =
    "var steps=" + JSON.stringify(steps) + ";var i=0;" +
    "function render(){shadow.querySelectorAll('.plk-obdots span').forEach(function(d,j){d.classList.toggle('on',j<=i)});" +
    "shadow.querySelector('[data-step]').textContent=(i+1)+'. '+steps[i];" +
    "shadow.querySelector('[data-next]').textContent=i===steps.length-1?'Finish':'Next'}" +
    "shadow.querySelector('[data-next]').addEventListener('click',function(){if(i<steps.length-1){i++;render()}else{i=0;render()}});" +
    "shadow.querySelector('[data-prev]').addEventListener('click',function(){if(i>0){i--;render()}});render();";
  return sh(c, body, css, js);
};

const fileupload: SR = (c) => {
  const body =
    `<h3>${T(c, "Upload files")}</h3>` +
    `<button type="button" class="plk-dropzone" id="plk-dz">+ Drop or click to add files</button>` +
    `<ul class="plk-files" id="plk-files"></ul>`;
  const css = `
.plk-dropzone { width: 100%; border: 2px dashed oklch(0.32 0.01 250); border-radius: 12px;
  background: transparent; color: var(--s-mut); font: inherit; font-size: 13px;
  padding: 22px 10px; cursor: pointer; transition: border-color 150ms ease, color 150ms ease; }
.plk-dropzone:hover { border-color: var(--a); color: var(--a); }
.plk-files { list-style: none; margin-top: 10px; display: flex; flex-direction: column; gap: 6px; }
.plk-files li { font-size: 12.5px; background: var(--s-card2); border-radius: 8px; padding: 7px 10px;
  display: flex; justify-content: space-between; }
.plk-files li em { font-style: normal; color: oklch(0.55 0.01 250); }
`;
  const names = ["design-v2.pdf", "logo-dark.svg", "notes.txt"];
  const js =
    "var n=0;var names=" + JSON.stringify(names) + ";" +
    "shadow.getElementById('plk-dz').addEventListener('click',function(){" +
    "var li=document.createElement('li');var nm=names[n%names.length];n++;" +
    "li.innerHTML='<span>'+nm+'</span><em>just now</em>';shadow.getElementById('plk-files').appendChild(li)});";
  return sh(c, body, css, js);
};

const pricingMini: SR = (c) => {
  const body =
    `<div style="display:flex;justify-content:space-between;align-items:center"><h3>${T(c, "Pro plan")}</h3>` +
    `<div class="plk-billtoggle"><button type="button" class="on" data-b="mo">Monthly</button><button type="button" data-b="yr">Yearly</button></div></div>` +
    `<p class="plk-sprice"><span data-price>$$</span><em data-per>/month</em></p>` +
    `<ul class="plk-slist"><li>Badge removal</li><li>Custom domain</li><li>White-label embeds</li></ul>` +
    `<button class="plk-sbtn" style="width:100%;justify-content:center">Start Pro</button>`;
  const css = `
.plk-sprice { font-size: 40px; font-weight: 750; letter-spacing: -0.03em; color: #fafafa; margin: 12px 0 10px;
  font-variant-numeric: tabular-nums; }
.plk-sprice em { font-style: normal; font-size: 14px; font-weight: 500; color: oklch(0.6 0.01 250); letter-spacing: 0; }
.plk-slist { list-style: none; margin: 0 0 16px; display: flex; flex-direction: column; gap: 7px; font-size: 13.5px; }
.plk-slist li::before { content: "✓"; color: var(--a); margin-right: 8px; font-weight: 700; }
.plk-billtoggle { display: flex; background: var(--s-card2); border-radius: 999px; padding: 3px; }
.plk-billtoggle button { border: 0; background: transparent; color: oklch(0.6 0.01 250); font: inherit;
  font-size: 11.5px; font-weight: 600; padding: 5px 12px; border-radius: 999px; cursor: pointer;
  transition: background-color 150ms ease, color 150ms ease; }
.plk-billtoggle button.on { background: var(--a); color: oklch(0.15 0.01 250); }
`;
  const js =
    "shadow.querySelectorAll('.plk-billtoggle button').forEach(function(b){b.addEventListener('click',function(){" +
    "shadow.querySelectorAll('.plk-billtoggle button').forEach(function(x){x.classList.remove('on')});b.classList.add('on');" +
    "var yearly=b.dataset.b==='yr';shadow.querySelector('[data-price]').textContent=yearly?'$90':'$9';" +
    "shadow.querySelector('[data-per]').textContent=yearly?'/year':'/month'})});";
  return sh(c, body, css, js);
};

const avatargroup: SR = (c) => {
  const rows = itemLines(c, ["1|Maya\n2|Otto\n3|Hana\n4|Lena\n5|Rob"]).map((l) => l.split("|"));
  const body =
    `<h3>${T(c, "The team")}</h3>` +
    `<div class="plk-avrow">` +
    rows.map((r) => `<img class="plk-av" src="https://i.pravatar.cc/96?img=${r[0]}" alt="${esc(r[1] || "")}" loading="lazy">`).join("") +
    `</div><p class="plk-ssub">${rows.map((r) => esc(r[1] || "")).join(" · ")}</p>`;
  const css = `
.plk-avrow { display: flex; margin-top: 14px; }
.plk-av { width: 44px; height: 44px; border-radius: 999px; object-fit: cover; border: 3px solid oklch(0.13 0.005 250);
  margin-left: -12px; transition: transform 200ms cubic-bezier(0.23,1,0.32,1); }
.plk-av:first-child { margin-left: 0; }
.plk-av:hover { transform: translateY(-4px) scale(1.08); z-index: 2; position: relative; }
`;
  return sh(c, body, css);
};

const socials: SR = (c) => {
  const brands = itemLines(c, ["x|Follow on X", "instagram|Instagram", "github|GitHub", "discord|Discord"]).map((l) => l.split("|"));
  const body =
    `<h3>${T(c, "Find us everywhere")}</h3>` +
    `<div class="plk-socrow">` +
    brands.map((b) => `<a class="plk-socbtn" href="#" aria-label="${esc(b[1] || b[0])}">${brandSvg(b[0], 18)}</a>`).join("") +
    `</div>`;
  const css = `
.plk-socrow { display: flex; gap: 10px; margin-top: 16px; }
.plk-socbtn { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center;
  border: 1px solid oklch(0.3 0.01 250); color: var(--s-mut); text-decoration: none;
  transition: border-color 160ms ease, color 160ms ease, transform 160ms cubic-bezier(0.23,1,0.32,1); }
.plk-socbtn:hover { border-color: var(--a); color: var(--a); transform: translateY(-2px); }
`;
  return sh(c, body, css);
};

const stepper: SR = (c) => {
  const steps = itemLines(c, ["Plan|Design|Build|Ship"]).join("").split(/[,|]/).map((s) => s.trim()).filter(Boolean);
  const body =
    `<h3>${T(c, "Process")}</h3>` +
    `<div class="plk-stepper">${steps.map((s, i) => `<button type="button" data-i="${i}" class="plk-step${i === 0 ? " on" : ""}">${esc(s)}</button>`).join("")}</div>` +
    `<p class="plk-ssub" data-out>Step 1: ${esc(steps[0] || "")}</p>`;
  const css = `
.plk-stepper { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 14px; }
.plk-step { border: 1.5px solid var(--s-line); background: transparent; color: var(--s-mut);
  font: inherit; font-size: 12.5px; font-weight: 600; border-radius: 999px; padding: 7px 14px; cursor: pointer;
  transition: all 180ms cubic-bezier(0.23,1,0.32,1); }
.plk-step.on { border-color: var(--a); color: var(--a); background: color-mix(in oklab, var(--a) 10%, transparent); }
`;
  const js =
    "shadow.querySelectorAll('.plk-step').forEach(function(b){b.addEventListener('click',function(){" +
    "shadow.querySelectorAll('.plk-step').forEach(function(x){x.classList.remove('on')});b.classList.add('on');" +
    "shadow.querySelector('[data-out]').textContent='Step: '+b.textContent})});";
  return sh(c, body, css, js);
};

const toastDemo: SR = (c) => {
  const body =
    `<h3>${T(c, "Toast styles")}</h3>` +
    `<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px">` +
    `<button type="button" class="plk-sbtn" data-k="Saved">Saved</button>` +
    `<button type="button" class="plk-sbtn ghost" data-k="Copied">Copied</button>` +
    `<button type="button" class="plk-sbtn ghost" data-k="Deleted">Deleted</button></div>` +
    `<div class="plk-toastout" data-out></div>`;
  const css = `
.plk-toastout { min-height: 40px; margin-top: 14px; display: flex; align-items: center; }
.plk-toastmsg { background: var(--s-card2); border: 1px solid var(--a); color: inherit;
  font-size: 13px; padding: 9px 14px; border-radius: 10px;
  animation: plk-tin 250ms cubic-bezier(0.23,1,0.32,1); }
@keyframes plk-tin { from { opacity: 0; transform: translateY(6px); } }
`;
  const js =
    "var out=shadow.querySelector('[data-out]');" +
    "shadow.querySelectorAll('[data-k]').forEach(function(b){b.addEventListener('click',function(){" +
    "out.innerHTML='<span class=\\'plk-toastmsg\\'>'+b.dataset.k+' ✓</span>'})});";
  return sh(c, body, css, js);
};

const badges: SR = (c) => {
  const rows = itemLines(c, ["SSL secured\nGDPR ready\n99.98% uptime\n30-day refunds\nNo tracking\nFree forever"]);
  const body =
    `<h3>${T(c, "Why trust us")}</h3>` +
    `<div class="plk-badges">` +
    rows.map((r) => `<span class="plk-badge" title="${esc(r)}">${esc(r)}</span>`).join("") +
    `</div>`;
  const css = `
.plk-badges { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
.plk-badge { font-size: 12.5px; font-weight: 550; color: oklch(0.8 0.01 250);
  background: var(--s-card2); border: 1px solid var(--s-line);
  border-radius: 999px; padding: 7px 14px; cursor: default;
  transition: border-color 150ms ease, color 150ms ease, transform 150ms cubic-bezier(0.23,1,0.32,1); }
.plk-badge:hover { border-color: var(--a); color: var(--a); transform: translateY(-2px); }
`;
  return sh(c, body, css);
};

const logos: SR = (c) => {
  const rows = itemLines(c, ["Acme\nFern & Co\nLattice\nHallow\nOtto"]);
  const group = rows.map((r) => `<span class="plk-lg">${esc(r)}</span>`).join("");
  const html =
    '<div class="plk-lgmq"><div class="plk-lgtrack">' +
    '<div class="plk-lggroup">' + group + '</div><div class="plk-lggroup" aria-hidden="true">' + group + "</div></div></div>";
  const css = `
.plk-lgmq { overflow: hidden; padding: 8px 0;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent); }
.plk-lgtrack { display: flex; width: max-content; animation: plk-lg 26s linear infinite; }
.plk-lgmq:hover .plk-lgtrack { animation-play-state: paused; }
.plk-lggroup { display: flex; gap: 34px; padding-right: 34px; align-items: baseline; }
.plk-lg { font-size: 16px; font-weight: 650; color: oklch(0.55 0.015 250); letter-spacing: -0.01em; white-space: pre; }
@keyframes plk-lg { to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) { .plk-lgtrack { animation: none; } }
`;
  return { html: '<div class="plk-scard">' + html + "</div>", css: sh(c, "").css + css, js: undefined };
};

const progressfeed: SR = (c) => {
  const tasks = itemLines(c, ["Set up the collection\nEmbed the wall\nCollect 10 reviews\nHit the gallery"]);
  const key = "plk-sp-pf";
  const body =
    `<h3>${T(c, "Getting started")}</h3>` +
    `<ul class="plk-pf" id="plk-list">` +
    tasks.map((t, i) => `<li><button type="button" data-i="${i}" class="plk-pfcheck" aria-label="Complete ${esc(t)}"></button><span>${esc(t)}</span></li>`).join("") +
    `</ul><p class="plk-ssub"><span data-done>0</span>/${tasks.length} complete</p>`;
  const css = `
.plk-pf { list-style: none; margin-top: 12px; display: flex; flex-direction: column; gap: 9px; }
.plk-pf li { display: flex; align-items: center; gap: 10px; font-size: 13.5px; }
.plk-pfcheck { width: 20px; height: 20px; border-radius: 999px; border: 2px solid oklch(0.4 0.01 250);
  background: transparent; cursor: pointer; flex-shrink: 0;
  transition: all 160ms cubic-bezier(0.23,1,0.32,1); }
.plk-pfcheck.on { background: var(--w-accent, var(--a)); border-color: var(--a); }
.plk-pf li.done span { text-decoration: line-through; opacity: 0.5; }
`;
  const js =
    "var K='" + key + "';" +
    "var list=shadow.getElementById('plk-list'),out=shadow.querySelector('[data-done]');" +
    "var state=[];try{state=JSON.parse(localStorage.getItem(K)||'[]')}catch(e){}" +
    "function render(){var n=0;" +
    "list.querySelectorAll('li').forEach(function(li,i){var on=!!state[i];" +
    "li.querySelector('.plk-pfcheck').classList.toggle('on',on);li.classList.toggle('done',on);if(on)n++});" +
    "out.textContent=n}" +
    "list.querySelectorAll('.plk-pfcheck').forEach(function(b){b.addEventListener('click',function(){" +
    "var i=Number(b.dataset.i);state[i]=!state[i];try{localStorage.setItem(K,JSON.stringify(state))}catch(e){};render()})});" +
    "render();";
  return sh(c, body, css, js);
};

const profilecard: SR = (c) => {
  const segs = String(c.items || "1|Maya Okafor|Founder, Fern & Co.|Maya builds widgets").split("|");
  const body =
    `<div style="display:flex;align-items:center;gap:12px">` +
    `<img class="plk-pfp" src="https://i.pravatar.cc/120?img=${segsSafe(segs[0])}" alt="">` +
    `<div><b style="font-size:15px">${esc(segs[1] || "Maya Okafor")}</b><br><span style="font-size:12.5px;color:oklch(0.6 0.01 250)">${esc(segs[2] || "")}</span></div></div>` +
    `<p class="plk-ssub" style="margin-top:12px">${esc(segs[3] || "")}</p>` +
    `<button type="button" class="plk-sbtn" style="width:100%;justify-content:center;margin-top:14px" id="plk-follow">Follow</button>`;
  const css = `
.plk-pfp { width: 52px; height: 52px; border-radius: 999px; object-fit: cover; }
`;
  const js =
    "var b=shadow.getElementById('plk-follow');var on=false;" +
    "b.addEventListener('click',function(){on=!on;b.textContent=on?'Following ✓':'Follow';" +
    "b.style.background=on?'transparent':'';b.style.color=on?'var(--a)':'';b.style.borderColor=on?'var(--a)':'';" +
    "b.classList.toggle('ghost',on)});";
  return sh(c, body, css, js);
};
function segsSafe(v: string | undefined) { const n = parseInt((v || "1").replace(/\D/g, "")) || 1; return ((n - 1) % 70) + 1; }

const search: SR = (c) => {
  const rows = itemLines(c, ["Wall of Love\nFocus timer\nUptime grid\nEnergy mix\nContact form"]);
  const body =
    `<input class="plk-sinput" placeholder="Search…" aria-label="Search" id="plk-sq">` +
    `<ul class="plk-sr">${rows.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>`;
  const css = `
.plk-sr { list-style: none; margin-top: 10px; display: flex; flex-direction: column; gap: 4px; }
.plk-sr li { font-size: 13.5px; padding: 8px 10px; border-radius: 8px; background: var(--s-card2); }
`;
  const js =
    "var q=shadow.getElementById('plk-sq'),list=shadow.querySelector('.plk-sr');" +
    "q.addEventListener('input',function(){var v=q.value.toLowerCase();" +
    "list.querySelectorAll('li').forEach(function(li){li.style.display=li.textContent.toLowerCase().includes(v)?'':'none'})});";
  return sh(c, body, css, js);
};

const chips: SR = (c) => {
  const rows = itemLines(c, ["Fast\nFree\nDark mode\nNo tracking\nOpen catalog"]);
  const body =
    `<h3>${T(c, "Filters")}</h3>` +
    `<p class="plk-ssub" style="margin-top:4px"><span data-n>0</span> selected</p>` +
    `<div class="plk-chips">${rows.map((r, i) => `<button type="button" data-i="${i}" class="plk-chip">${esc(r)}</button>`).join("")}</div>`;
  const css = `
.plk-chips { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 12px; }
.plk-chip { border: 1.5px solid var(--s-line); background: transparent; color: var(--s-mut);
  font: inherit; font-size: 12.5px; font-weight: 550; border-radius: 999px; padding: 7px 14px; cursor: pointer;
  transition: all 160ms cubic-bezier(0.23,1,0.32,1); }
.plk-chip.on { border-color: var(--a); color: var(--a); background: color-mix(in oklab, var(--a) 10%, transparent); }
.plk-chip:active { transform: scale(0.94); }
`;
  const js =
    "var n=0,out=shadow.querySelector('[data-n]');" +
    "shadow.querySelectorAll('.plk-chip').forEach(function(b){b.addEventListener('click',function(){" +
    "b.classList.toggle('on');n=shadow.querySelectorAll('.plk-chip.on').length;" +
    "out.textContent=n})});";
  return sh(c, body, css, js);
};

const countdownStrip: SR = (c) => {
  const target = c.target ? new Date(String(c.target)) : new Date(Date.now() + 3 * 864e5);
  const body =
    `<div class="plk-cstrip" data-tg="${target.toISOString()}"><span>${esc(c.text || "Early-bird ends in")}</span>` +
    `<b><span data-uh>00</span>:<span data-um>00</span>:<span data-us>00</span></b></div>`;
  const css = `
.plk-cstrip { display: flex; align-items: center; justify-content: space-between; gap: 12px;
  background: color-mix(in oklab, var(--a) 10%, oklch(0.16 0.008 250));
  border: 1px solid color-mix(in oklab, var(--a) 30%, oklch(0.28 0.01 250));
  border-radius: 12px; padding: 12px 16px; font-size: 13.5px; }
.plk-cstrip b { font-variant-numeric: tabular-nums; color: var(--a); font-size: 15px; }
`;
  const js =
    "var card=shadow.querySelector('.plk-cstrip');var t=Date.parse(card.dataset.tg);" +
    "function pad(n){return String(n).padStart(2,'0')}" +
    "function tick(){var s=Math.max(0,Math.floor((t-Date.now())/1000));" +
    "card.querySelector('[data-uh]').textContent=pad(Math.floor(s/3600));" +
    "card.querySelector('[data-um]').textContent=pad(Math.floor(s%3600/60));" +
    "card.querySelector('[data-us]').textContent=pad(s%60)}tick();setInterval(tick,1000);";
  return sh(c, body, css, js);
};

const quoteWall: SR = (c) => {
  const rows = itemLines(c, ["Replaced a paid tool instantly.|Maya\nFinally, honest widgets.|Otto\nMy bakery site looks pro.|Sofia"]);
  const body =
    `<div class="plk-qw">` +
    rows.map((r) => { const [q, a] = r.split("|"); return `<div class="plk-qwc"><p>“${esc(q || "")}”</p><span>— ${esc(a || "")}</span></div>`; }).join("") +
    `</div>`;
  const css = `
.plk-qw { columns: 2; column-gap: 10px; margin-top: 8px; }
.plk-qwc { break-inside: avoid; background: var(--s-card2); border-radius: 12px; padding: 14px;
  margin-bottom: 10px; display: flex; flex-direction: column; gap: 8px; }
.plk-qwc p { font-size: 13px; line-height: 1.5; }
.plk-qwc span { font-size: 11.5px; color: oklch(0.58 0.01 250); }
`;
  return sh(c, body, css);
};

const banner: SR = (c) => {
  const body =
    `<a class="plk-sban" href="#"><span>${esc(c.text || "New: 6 Aurora analytics widgets just shipped")}</span><b>→</b></a>`;
  const css = `
.plk-sban { display: flex; align-items: center; justify-content: space-between; gap: 12px;
  background: linear-gradient(90deg, color-mix(in oklab, var(--a) 22%, oklch(0.14 0.008 250)), oklch(0.14 0.008 250));
  border: 1px solid color-mix(in oklab, var(--a) 30%, oklch(0.28 0.01 250));
  border-radius: 12px; padding: 12px 16px; text-decoration: none; color: inherit; font-size: 13.5px; font-weight: 550;
  transition: border-color 200ms ease; }
.plk-sban:hover { border-color: var(--a); }
.plk-sban b { color: var(--a); transition: transform 200ms cubic-bezier(0.23,1,0.32,1); }
.plk-sban:hover b { transform: translateX(3px); }
`;
  return sh(c, body, css);
};

/* ------------------------------------------------------------ exports */

/* ---- 21st.dev-inspired additions, improved ---- */

/* Gradient menu: nav pill with a gradient indicator that glides between
   items (spring-ish ease), keyboard accessible, animated gradient text
   on the active item. */
const gradientMenu: SR = (c) => {
  const items = itemLines(c, ["Home", "Widgets", "Pricing", "Docs", "Blog"]);
  const body =
    '<nav class="plk-gm" id="plk-gm" aria-label="Menu">' +
    items.map((it, i) => `<button type="button" class="plk-gmi${i === 0 ? " on" : ""}" data-i="${i}">${esc(it)}</button>`).join("") +
    '<span class="plk-gmind" id="plk-gmind"></span></nav>';
  const css = `
.plk-gm { position: relative; display: flex; gap: 2px; background: var(--s-card2);
  border: 1px solid var(--s-line); border-radius: 999px; padding: 4px; width: fit-content;
  margin: 6px auto 0; }
.plk-gmi { position: relative; z-index: 1; border: 0; background: transparent; color: oklch(0.7 0.01 250);
  font: inherit; font-size: 13.5px; font-weight: 550; padding: 8px 16px; border-radius: 999px; cursor: pointer;
  transition: color 200ms cubic-bezier(0.23,1,0.32,1); }
.plk-gmi.on { color: #fff; }
.plk-gmind { position: absolute; top: 4px; bottom: 4px; left: 4px; border-radius: 999px;
  background: linear-gradient(120deg, var(--w-accent), oklch(0.7 0.12 200));
  background-size: 200% 100%; animation: plk-gmshift 4s linear infinite;
  transition: left 320ms cubic-bezier(0.23,1,0.32,1), width 320ms cubic-bezier(0.23,1,0.32,1); z-index: 0; }
@keyframes plk-gmshift { to { background-position: 200% 0; } }
`;
  const js =
    "var nav=shadow.getElementById('plk-gm'),ind=shadow.getElementById('plk-gmind');" +
    "var btns=nav.querySelectorAll('.plk-gmi');" +
    "function move(b){ind.style.left=b.offsetLeft+'px';ind.style.width=b.offsetWidth+'px'}" +
    "btns.forEach(function(b){b.addEventListener('click',function(){" +
    "btns.forEach(function(x){x.classList.remove('on')});b.classList.add('on');move(b)});" +
    "b.addEventListener('keydown',function(e){var i=Array.prototype.indexOf.call(btns,b);" +
    "if(e.key==='ArrowRight')btns[(i+1)%btns.length].focus();" +
    "if(e.key==='ArrowLeft')btns[(i-1+btns.length)%btns.length].focus()})});" +
    "move(btns[0]);window.addEventListener('resize',function(){var on=nav.querySelector('.on');if(on)move(on)});";
  return sh(c, body, css, js);
};

/* Sign-in card: validation, show/hide password, social buttons, success state. */
const signinCard: SR = (c) => {
  const body =
    `<h3>${T(c, "Welcome back")}</h3>` +
    `<p class="plk-ssub" style="margin-top:4px">Sign in to your account</p>` +
    `<form id="plk-sif" novalidate style="display:flex;flex-direction:column;gap:10px;margin-top:14px">` +
    `<label class="plk-slab">Email<input class="plk-sinput" name="email" type="email" required autocomplete="email" placeholder="you@example.com"></label>` +
    `<label class="plk-slab">Password<div style="position:relative"><input class="plk-sinput" name="pw" type="password" required minlength="6" placeholder="••••••••" autocomplete="current-password" style="padding-right:40px">` +
    `<button type="button" class="plk-sieye" aria-label="Show password">👁</button></div></label>` +
    `<div style="display:flex;justify-content:space-between;align-items:center;font-size:12px"><label style="display:flex;gap:6px;align-items:center"><input type="checkbox" name="rm"> Remember me</label><a href="#" style="color:var(--w-accent);text-decoration:none">Forgot?</a></div>` +
    `<button class="plk-sbtn" type="submit" style="justify-content:center">Sign in</button>` +
    `<div style="display:flex;gap:8px"><button type="button" class="plk-sbtn ghost" style="flex:1;justify-content:center">Google</button><button type="button" class="plk-sbtn ghost" style="flex:1;justify-content:center">GitHub</button></div>` +
    `</form><p class="plk-sok" hidden>Signed in. Welcome back.</p>`;
  const css = `
.plk-slab { display: flex; flex-direction: column; gap: 4px; font-size: 12.5px; color: var(--s-mut); }
.plk-sieye { position: absolute; right: 8px; top: 50%; translate: 0 -50%; border: 0; background: none;
  color: oklch(0.55 0.01 250); cursor: pointer; font-size: 14px; }
.plk-scard form.shake { animation: plk-shake 300ms cubic-bezier(0.23,1,0.32,1); }
@keyframes plk-shake { 25% { translate: -5px 0 } 75% { translate: 5px 0 } }
.plk-sok { text-align: center; font-weight: 600; color: var(--w-accent); }
`;
  const js =
    "var f=shadow.getElementById('plk-sif');" +
    "f.pw.parentNode.querySelector('.plk-sieye').addEventListener('click',function(){" +
    "f.pw.type=f.pw.type==='password'?'text':'password'});" +
    "f.addEventListener('submit',function(e){e.preventDefault();" +
    "if(!f.email.value||!f.pw.value){f.classList.add('shake');setTimeout(function(){f.classList.remove('shake')},320);return}" +
    "f.style.opacity='0.45';f.querySelector('button[type=submit]').textContent='Signing in…';" +
    "setTimeout(function(){f.style.display='none';var ok=f.nextElementSibling;ok.hidden=false},700)});";
  return sh(c, body, css, js);
};

/* Pricing section: 3 tiers, monthly/yearly toggle with animated prices,
   highlighted popular tier, savings badge. */
const pricingSection: SR = (c) => {
  const tiers = itemLines(c, [
    "Starter|$0|1 site;Community support;Basic widgets",
    "Pro|$9|Badge removal;Custom domain;Priority help;All 190+ widgets",
    "Studio|$29|5 client seats;White-label;SSO;Dedicated support",
  ]);
  const year = c.variant === "yr";
  const priceOf = (raw: string) => {
    const n = parseFloat(raw.replace(/[^\d.]/g, ""));
    if (isNaN(n) || n === 0) return raw;
    return year ? "$" + Math.round(n * 10) : raw;
  };
  const cardHtml = tiers.map((t, i) => {
    const [name, price, feats] = t.split("|").map((x) => x.trim());
    const pop = i === 1;
    return `<div class="plk-ptier${pop ? " pop" : ""}">${pop ? '<span class="plk-ptag">Most popular</span>' : ""}` +
      `<b>${esc(name)}</b><p class="plk-pprice"><span data-p="${i}">${esc(price)}</span><em>${year ? "/yr" : "/mo"}</em></p>` +
      `<ul>${(feats || "").split(";").filter(Boolean).map((f) => "<li>" + esc(f) + "</li>").join("")}</ul>` +
      `<button type="button" class="plk-sbtn${pop ? "" : " ghost"}" style="width:100%;justify-content:center">Choose ${esc(name)}</button></div>`;
  }).join("");
  const body =
    `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">` +
    `<h3>${T(c, "Simple pricing")}</h3>` +
    `<div class="plk-bt"><button type="button" class="${year ? "" : "on"}" data-b="mo">Monthly</button><button type="button" class="${year ? "on" : ""}" data-b="yr">Yearly −20%</button></div></div>` +
    `<div class="plk-pgrid">${cardHtml}</div>`;
  const css = `
.plk-pgrid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; }
.plk-ptier { position: relative; background: var(--s-card2); border: 1px solid var(--s-line);
  border-radius: 14px; padding: 14px; display: flex; flex-direction: column; gap: 8px;
  transition: transform 200ms cubic-bezier(0.23,1,0.32,1); }
.plk-ptier:hover { transform: translateY(-3px); }
.plk-ptier.pop { border: 1.5px solid var(--w-accent);
  background: color-mix(in oklab, var(--w-accent) 6%, oklch(0.18 0.008 250)); }
.plk-ptag { position: absolute; top: -9px; right: 10px; font-size: 10px; font-weight: 700;
  letter-spacing: 0.05em; text-transform: uppercase; background: var(--w-accent); color: #fff;
  border-radius: 999px; padding: 2px 8px; }
.plk-ptier b { font-size: 13.5px; }
.plk-pprice { font-size: 24px; font-weight: 750; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
.plk-pprice em { font-style: normal; font-size: 11.5px; color: oklch(0.6 0.01 250); }
.plk-ptier ul { list-style: none; display: flex; flex-direction: column; gap: 5px; font-size: 12px; }
.plk-ptier li::before { content: "✓"; color: var(--w-accent); margin-right: 6px; font-weight: 700; }
.plk-bt { display: flex; background: var(--s-card2); border-radius: 999px; padding: 3px; }
.plk-bt button { border: 0; background: transparent; color: oklch(0.62 0.01 250); font: inherit;
  font-size: 11.5px; font-weight: 600; padding: 5px 12px; border-radius: 999px; cursor: pointer;
  transition: all 180ms cubic-bezier(0.23,1,0.32,1); }
.plk-bt button.on { background: var(--w-accent); color: #fff; }
`;
  const js =
    "shadow.querySelectorAll('.plk-bt button').forEach(function(b){b.addEventListener('click',function(){" +
    "shadow.querySelectorAll('.plk-bt button').forEach(function(x){x.classList.remove('on')});b.classList.add('on');" +
    "var yr=b.dataset.b==='yr';shadow.querySelectorAll('.plk-ptier').forEach(function(card,row){" +
    "var el=card.querySelector('.plk-pprice span');var price=el.textContent;" +
    "var num=parseFloat(price.replace(/[^\\d.]/g,''));" +
    "if(isNaN(num)||num===0){el.textContent=price;return}" +
    "var out=yr?'$'+Math.round(num*10):'$'+Math.round(num/10*1.0);" +
    "el.textContent=out;card.querySelector('.plk-pprice em').textContent=yr?'/yr':'/mo'})})});";
  return sh(c, body, css, js);
};



export const SPECIAL_RENDERERS: Record<string, (c: WidgetConfig) => RenderResult> = {
  "special-hero": hero,
  "special-features": features,
  "special-integrations": integrations,
  "special-stats": stats,
  "special-cta": cta,
  "special-testimonial": testimonial,
  "special-newsletter": newsletter,
  "special-cookie": cookie,
  "special-notifications": notifications,
  "special-download": download,
  "special-roadmap": roadmap,
  "special-kanban": kanban,
  "special-calendar": calendar,
  "special-table": table,
  "special-command": command,
  "special-onboarding": onboarding,
  "special-fileupload": fileupload,
  "special-pricing": pricingMini,
  "special-avatars": avatargroup,
  "special-socials": socials,
  "special-countdown-strip": countdownStrip,
  "special-quote-wall": quoteWall,
  "special-chips": chips,
  "special-progress-feed": progressfeed,
  "special-profile": profilecard,
  "special-search": search,
  "special-stepper": stepper,
  "special-toasts": toastDemo,
  "special-badges": badges,
  "special-logos": logos,

};


export const LIVE_WIDGETS = WIDGETS.filter((w) => w.status === "live");

export function getWidget(id: string): WidgetDef | undefined {
  return WIDGETS.find((w) => w.id === id);
}

export function defaultsFor(def: WidgetDef): WidgetConfig {
  return {
    theme: "light",
    accent: "oklch(0.47 0.1 203)",
    radius: 12,
    density: "cozy",
    showBadge: true,
    ...def.defaults,
  };
}

Object.assign(SPECIAL_RENDERERS, {
  "special-gradient-menu": gradientMenu,
  "special-signin-card": signinCard,
  "special-pricing-section": pricingSection,
});