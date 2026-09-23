import { baseCss, badgeHtml, esc, ok } from "../base";
import type { RenderResult, TestimonialData, WidgetConfig } from "../types";
import { PLATFORM_CSS, SOFT, brandSvg, jsEsc, lines } from "./kit";

type R = (c: WidgetConfig, items: TestimonialData[]) => RenderResult;

/* ---- Evergreen countdown: per-visitor deadline, remembered in localStorage ---- */
export const evergreenCountdown: R = (c) => {
  const hours = Number(c.speed) || 48;
  const boxes = c.variant !== "inline";
  const html =
    '<div class="plk-wrap"><div class="plk-cd" id="plk-eg">' +
    (c.text ? '<span class="plk-cdlabel">' + esc(c.text) + "</span>" : "") +
    (boxes
      ? ["h", "m", "s"].map((u) => '<span class="plk-egbox"><span class="plk-egnum" data-u="' + u + '">0</span><span class="plk-egunit">' + ({ h: "hrs", m: "min", s: "sec" } as Record<string, string>)[u] + "</span></span>").join("")
      : '<span class="plk-eginline" data-u="inline">—</span>') +
    "</div>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, `
.plk-cd { display: flex; flex-direction: column; gap: 12px; align-items: center; padding: var(--w-pad); }
.plk-cdlabel { font-size: 13px; color: var(--w-muted); letter-spacing: 0.04em; text-transform: uppercase; }
.plk-egbox { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.plk-egbox:not(:first-of-type) { margin-left: 12px; }
.plk-egnum { font-size: 2.1rem; font-weight: 650; font-variant-numeric: tabular-nums; letter-spacing: -0.02em;
  min-width: 2.2ch; text-align: center; background: var(--w-card); border: 1px solid var(--w-line);
  border-radius: var(--w-radius); padding: 10px 12px; }
.plk-egunit { font-size: 11px; color: var(--w-muted); text-transform: uppercase; letter-spacing: 0.06em; }
.plk-eginline { font-size: 1.15rem; font-weight: 600; font-variant-numeric: tabular-nums; }
`);
  const js =
    "var root=shadow.getElementById('plk-eg');if(!root)return;" +
    "var K='plk-eg-" + jsEsc(String(c.text || "x")).slice(0, 24) + "';" +
    "var end=parseInt(localStorage.getItem(K)||'0',10);" +
    "if(!end||end<Date.now()){end=Date.now()+(" + hours + "*3600000);localStorage.setItem(K,String(end))}" +
    "function pad(n){return String(n).padStart(2,'0')}" +
    "function tick(){var s=Math.max(0,Math.floor((end-Date.now())/1000));" +
    "var h=Math.floor(s/3600),m=Math.floor(s%3600/60),sec=s%60;" +
    "var q=function(u){return root.querySelector('[data-u=\"'+u+'\"]')};" +
    "if(q('inline')){q('inline').textContent=h+'h '+pad(m)+':'+pad(sec)}" +
    "else{if(q('h'))q('h').textContent=pad(h);if(q('m'))q('m').textContent=pad(m);if(q('s'))q('s').textContent=pad(sec)}}" +
    "tick();setInterval(tick,1000);";
  return ok({ html, css, js });
};

/* ---- Email capture popup / exit-intent popup ---- */
type R3 = (c: WidgetConfig, items: TestimonialData[], extra?: Record<string, unknown>) => RenderResult;

function capturePopup(exitIntent: boolean): R3 {
  return (c, _items, extra) => {
    const delay = exitIntent ? 0 : (Number(c.speed) || 5) * 1000;
    const slug = String(extra?.slug || "");
    const html =
      '<div class="plk-pop" id="plk-pop" role="dialog" aria-label="' + esc(c.text || "Sign up") + '" hidden>' +
      '<div class="plk-popcard"><button class="plk-popx" id="plk-popx" aria-label="Close">×</button>' +
      '<h3>' + esc(c.text || "") + "</h3>" +
      '<p>No spam. Unsubscribe any time.</p>' +
      '<form id="plk-popf"><input type="email" required placeholder="you@example.com" aria-label="Email">' +
      '<button class="plk-btn" type="submit">Join</button></form>' +
      '<span class="plk-popdone" hidden>You are in. Thank you.</span>' +
      "</div></div>";
    const css = baseCss(c, `
.plk-pop { position: fixed; inset: 0; z-index: 80; display: flex; align-items: center; justify-content: center;
  background: oklch(0 0 0 / 0.35); padding: 20px; }
.plk-pop[hidden] { display: none; }
.plk-popcard { position: relative; background: var(--w-bg); border: 1px solid var(--w-line);
  border-radius: calc(var(--w-radius) + 8px); padding: 30px 28px 26px; max-width: 380px; width: 100%;
  text-align: center; ${SOFT} }
.plk-popcard h3 { margin: 0 0 6px; font-size: 19px; font-weight: 650; letter-spacing: -0.01em; }
.plk-popcard p { margin: 0 0 16px; font-size: 13px; color: var(--w-muted); }
.plk-popcard form { display: flex; flex-direction: column; gap: 10px; }
.plk-popcard input { font: inherit; font-size: 15px; padding: 11px 13px; border: 1px solid var(--w-line);
  border-radius: 999px; background: var(--w-card); color: var(--w-ink); text-align: center; }
.plk-popcard input:focus { outline: 2px solid var(--w-accent); outline-offset: 1px; }
.plk-popcard .plk-btn { justify-content: center; }
.plk-popx { position: absolute; top: 10px; right: 12px; border: 0; background: none; font-size: 20px;
  color: var(--w-muted); cursor: pointer; padding: 4px 8px; border-radius: 999px; }
.plk-popdone { display: block; font-size: 14px; font-weight: 600; padding: 8px 0; }
`);
    const js =
      "var K='plk-pop-seen-" + (exitIntent ? "exit" : "time") + "';" +
      "var pop=shadow.getElementById('plk-pop');var SLUG='" + jsEsc(slug) + "';" +
      "function show(){if(sessionStorage.getItem(K))return;pop.hidden=false;sessionStorage.setItem(K,'1')}" +
      (exitIntent
        ? "document.addEventListener('mouseout',function(e){if(!e.relatedTarget&&e.clientY<12)show()},{once:true});"
        : "setTimeout(show," + delay + ");") +
      "shadow.getElementById('plk-popx').addEventListener('click',function(){pop.hidden=true});" +
      "pop.addEventListener('click',function(e){if(e.target===pop)pop.hidden=true});" +
      "shadow.getElementById('plk-popf').addEventListener('submit',function(e){e.preventDefault();" +
      "var em=e.target.querySelector('input').value;" +
      "var done=function(){e.target.hidden=true;shadow.querySelector('.plk-popdone').hidden=false};" +
      "if(!SLUG){done();return}" +
      "fetch('/api/c/'+SLUG+'/submit',{method:'POST',headers:{'content-type':'application/json'}," +
      "body:JSON.stringify({author:em,text:'Newsletter signup: '+em,tags:['newsletter']})}).then(done).catch(function(){})});";
    return ok({ html, css, js });
  };
}

export const emailCapturePopup: R3 = capturePopup(false);
export const exitIntentPopup: R3 = capturePopup(true);

/* ---- Floating WhatsApp button ---- */
export const floatingWhatsAppButton: R = (c) => {
  const pos = "right";
  const html =
    '<a class="plk-wa" href="' + esc(c.link || "#") + '" target="_blank" rel="noopener" aria-label="' + esc(c.text || "Chat") + '">' +
    brandSvg("whatsapp", 24) +
    "</a>";
  const css = baseCss(c, `
:host { position: fixed; bottom: 20px; ` + pos + `: 20px; z-index: 60; }
.plk-wa { display: flex; align-items: center; justify-content: center; width: 54px; height: 54px;
  border-radius: 999px; background: oklch(0.62 0.15 155); color: #fff;
  box-shadow: 0 6px 20px oklch(0 0 0 / 0.2); transition: transform 160ms cubic-bezier(0.23,1,0.32,1); }
.plk-wa:hover { transform: translateY(-2px); }
.plk-wa:active { transform: scale(0.95); }
`);
  return ok({ html, css });
};

/* ---- Live visitor counter (configured baseline + gentle drift) ---- */
export const liveVisitorCounter: R = (c) => {
  const n = Number(lines(c.items)[0]?.left || "0") || 1;
  const html =
    '<div class="plk-wrap"><div class="plk-live"><strong id="plk-live">' + n + "</strong><span>" + esc(c.text || "viewing now") + "</span></div></div>" +
    badgeHtml(c.showBadge);
  const css = baseCss(c, `
.plk-live { display: flex; align-items: baseline; justify-content: center; gap: 8px; padding: var(--w-pad); }
.plk-live strong { font-size: 1.5rem; font-weight: 650; font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }
.plk-live span { font-size: 13.5px; color: var(--w-muted); }
`);
  const js =
    "var el=shadow.getElementById('plk-live');var base=" + n + ";" +
    "setInterval(function(){var drift=Math.round((Math.random()-0.45)*3);" +
    "base=Math.max(1,base+drift);el.textContent=base},5000);";
  return ok({ html, css, js });
};

/* ---- Recent sales toasts ---- */
export const recentSalesToasts: R = (c) => {
  const rows = lines(c.items);
  const every = Number(c.speed) || 8;
  const data = rows.map((r) => {
    const [city, what] = (r.right || "").split("|").map((s) => s.trim());
    return { name: r.left, city: city || "", what: what || "" };
  });
  const html =
    '<div class="plk-sales" id="plk-sales" hidden><span class="plk-savatar" aria-hidden="true"></span>' +
    '<span class="plk-stext"><strong id="plk-sname"></strong><span id="plk-swhat"></span></span>' +
    '<button id="plk-sx" aria-label="Dismiss">×</button></div>';
  const css = baseCss(c, `
:host { display: block; }
.plk-sales { position: fixed; bottom: 18px; left: 18px; z-index: 60; display: flex; align-items: center; gap: 10px;
  background: var(--w-bg); border: 1px solid var(--w-line); border-radius: 999px; padding: 9px 14px;
  font-size: 13px; ${SOFT} }
.plk-sales[hidden] { display: none; }
.plk-savatar { width: 26px; height: 26px; border-radius: 999px; flex-shrink: 0;
  background: color-mix(in oklab, var(--w-accent) 20%, var(--w-card)); }
.plk-stext { display: flex; flex-direction: column; line-height: 1.25; }
.plk-stext strong { font-weight: 600; }
.plk-stext span { color: var(--w-muted); font-size: 12px; }
.plk-sales button { border: 0; background: none; color: var(--w-muted); cursor: pointer; font-size: 15px; padding: 2px 4px; }
`);
  const js =
    "var D=" + JSON.stringify(data.map((d) => ({ n: d.name, c: d.city, w: d.what }))) + ";" +
    "var el=shadow.getElementById('plk-sales'),i=0;" +
    "function show(){var d=D[i%D.length];i++;" +
    "shadow.getElementById('plk-sname').textContent=d.n+' in '+d.c;" +
    "shadow.getElementById('plk-swhat').textContent='just got '+d.w;" +
    "el.hidden=false;setTimeout(function(){el.hidden=true},4500)}" +
    "setTimeout(show,3000);setInterval(show," + every + "000);" +
    "shadow.getElementById('plk-sx').addEventListener('click',function(){el.hidden=true})";
  return ok({ html, css, js });
};

/* ---- Goal progress bar ---- */
export const goalProgressBar: R = (c) => {
  const segs = (lines(c.items)[0]?.left || "0|100").split("|");
  const cur = Number(segs[0]) || 0;
  const goal = Number(segs[1]) || 100;
  const pct = Math.min(100, Math.round((cur / goal) * 100));
  const html =
    '<div class="plk-wrap"><div class="plk-goal">' +
    '<div class="plk-goalhead"><strong>' + cur.toLocaleString() + " / " + goal.toLocaleString() +
    "</strong><span>" + esc(c.text || "") + "</span></div>" +
    '<div class="plk-goalttrack"><span class="plk-goalfill" data-pct="' + pct + '"></span></div>' +
    "</div>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, `
.plk-goal { padding: var(--w-pad); display: flex; flex-direction: column; gap: 10px; }
.plk-goalhead { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
.plk-goalhead strong { font-size: 1.1rem; font-weight: 650; font-variant-numeric: tabular-nums; }
.plk-goalhead span { font-size: 13px; color: var(--w-muted); }
.plk-goalttrack { height: 10px; background: var(--w-line); border-radius: 999px; overflow: hidden; }
.plk-goalfill { display: block; height: 100%; width: 0; background: var(--w-accent); border-radius: 999px;
  transition: width 900ms cubic-bezier(0.23,1,0.32,1); }
@media (prefers-reduced-motion: reduce) { .plk-goalfill { transition: none; } }
`);
  const js =
    "var f=shadow.querySelector('.plk-goalfill');" +
    "requestAnimationFrame(function(){setTimeout(function(){f.style.width=f.dataset.pct+'%'},80)});";
  return ok({ html, css, js });
};

/* ---- Coupon reveal ---- */
export const couponReveal: R = (c) => {
  const code = String(c.text || "CODE10");
  const html =
    '<div class="plk-wrap"><button class="plk-coupon" id="plk-cpn" type="button">' +
    '<span class="plk-cpnhint">Click to reveal your code</span>' +
    '<span class="plk-cpncode" hidden>' + esc(code) + "</span></button>" +
    (c.density ? "" : "") +
    badgeHtml(c.showBadge) +
    "</div>";
  const css = baseCss(c, `
.plk-coupon { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%;
  border: 1.5px dashed color-mix(in oklab, var(--w-accent) 60%, var(--w-line)); background: var(--w-card);
  border-radius: var(--w-radius); padding: 16px; cursor: copy; font: inherit; color: var(--w-ink);
  transition: border-color 160ms ease, transform 160ms cubic-bezier(0.23,1,0.32,1); }
.plk-coupon:active { transform: scale(0.98); }
.plk-cpnhint { font-size: 13.5px; color: var(--w-muted); }
.plk-cpncode { font-weight: 700; letter-spacing: 0.12em; font-size: 16px; color: var(--w-accent); }
`);
  const js =
    "var b=shadow.getElementById('plk-cpn');" +
    "b.addEventListener('click',function(){var t=b.querySelector('.plk-cpncode'),h=b.querySelector('.plk-cpnhint');" +
    "if(t.hidden){t.hidden=false;h.hidden=true}else{" +
    "(navigator.clipboard?navigator.clipboard.writeText('" + jsEsc(code) + "'):Promise.resolve()).finally(function(){" +
    "h.textContent='Copied';h.hidden=false;t.hidden=true;setTimeout(function(){h.textContent='Click to reveal your code'},1500)})}});";
  return ok({ html, css, js });
};

/* ---- Spin to win ---- */
export const spinToWin: R = (c) => {
  const prizes = lines(c.items).map((r) => r.left);
  const n = Math.max(2, prizes.length);
  const seg = 360 / n;
  const html =
    '<div class="plk-wrap"><div class="plk-wheelbox">' +
    '<div class="plk-wheel" id="plk-wheel" style="background:conic-gradient(' +
    prizes.map((_, i) => "var(--w-card) " + i * seg + "deg " + (i + 1) * seg + "deg").join(",") +
    ')">' +
    prizes.map((p, i) => '<span class="plk-wlabel" style="transform:rotate(' + (i * seg + seg / 2) + 'deg)">' + esc(p) + "</span>").join("") +
    "</div>" +
    '<button class="plk-btn" id="plk-spin" type="button">Spin</button>' +
    '<p class="plk-wresult" id="plk-wres" role="status"></p>' +
    "</div>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, `
.plk-wheelbox { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: var(--w-pad); }
.plk-wheel { position: relative; width: 210px; height: 210px; border-radius: 999px;
  border: 6px solid var(--w-card); ${SOFT} transition: transform 3.2s cubic-bezier(0.15,0.9,0.2,1); }
.plk-wlabel { position: absolute; left: 50%; top: 50%; transform-origin: 0 0; font-size: 11.5px; font-weight: 600;
  color: var(--w-ink); padding-left: 34px; white-space: nowrap; }
.plk-wresult { margin: 0; min-height: 20px; font-weight: 600; font-size: 15px; color: var(--w-accent); }
.plk-wheelbox .plk-btn { min-width: 110px; justify-content: center; }
`);
  const js =
    "var w=shadow.getElementById('plk-wheel'),res=shadow.getElementById('plk-wres'),btn=shadow.getElementById('plk-spin');" +
    "var prizes=" + JSON.stringify(prizes) + ";var seg=" + seg + ";var rot=0,spinning=false;" +
    "btn.addEventListener('click',function(){if(spinning)return;spinning=true;res.textContent='';" +
    "var idx=Math.floor(Math.random()*prizes.length);" +
    "rot+=5*360+(360-(idx*seg+seg/2))-(rot%360);w.style.transform='rotate('+rot+'deg)';" +
    "setTimeout(function(){res.textContent='You got: '+prizes[idx];spinning=false},3300)});";
  return ok({ html, css, js });
};

/* ---- Banner rotator ---- */
export const bannerRotator: R = (c) => {
  const msgs = lines(c.items).map((r) => r.left);
  const every = (Number(c.speed) || 6) * 1000;
  const html =
    '<div class="plk-rot"><span id="plk-rotm">' + esc(msgs[0] || "") + "</span></div>";
  const css = baseCss(c, `
.plk-rot { background: var(--w-ink); color: var(--w-bg); text-align: center; padding: 11px 20px; font-size: 14px; }
.plk-rot span { display: inline-block; transition: opacity 240ms ease; }
`);
  const js =
    "var m=" + JSON.stringify(msgs) + ";var el=shadow.getElementById('plk-rotm');var i=0;" +
    "setInterval(function(){i=(i+1)%m.length;el.style.opacity='0';" +
    "setTimeout(function(){el.textContent=m[i];el.style.opacity='1'},250)},(" + every + "));";
  return ok({ html, css, js });
};

/* ---- Waitlist counter ---- */
export const waitlistCounter: R = (c) => {
  const target = Number(lines(c.items)[0]?.left || "100");
  const html =
    '<div class="plk-wrap"><div class="plk-wait"><strong id="plk-wait">0</strong><span>' + esc(c.text || "people waiting") + "</span></div></div>" +
    badgeHtml(c.showBadge);
  const css = baseCss(c, `
.plk-wait { display: flex; align-items: baseline; justify-content: center; gap: 8px; padding: var(--w-pad); }
.plk-wait strong { font-size: 2.4rem; font-weight: 650; font-variant-numeric: tabular-nums; letter-spacing: -0.03em; }
.plk-wait span { font-size: 13.5px; color: var(--w-muted); }
`);
  const js =
    "var el=shadow.getElementById('plk-wait');var T=" + target + ";var t0=null;" +
    "function step(ts){if(!t0)t0=ts;var p=Math.min(1,(ts-t0)/1400);" +
    "el.textContent=Math.round(T*(1-Math.pow(1-p,3))).toLocaleString();" +
    "if(p<1)requestAnimationFrame(step)}" +
    "if(matchMedia('(prefers-reduced-motion: reduce)').matches){el.textContent=T.toLocaleString()}else{requestAnimationFrame(step)}";
  return ok({ html, css, js });
};

void PLATFORM_CSS;
