import { esc } from "../base";
import type { RenderResult, WidgetConfig } from "../types";
import { dotsHtml, fillClip, pOk, ringHtml } from "./pretty-core";

type PR = (c: WidgetConfig) => RenderResult;

const BTN = `
.plk-pbtn { position: relative; z-index: 2; margin-top: 16px; border: 0; cursor: pointer;
  background: var(--w-accent); color: oklch(0.25 0.03 220); font: inherit; font-size: 13.5px; font-weight: 650;
  padding: 10px 16px; border-radius: 999px;
  transition: transform 160ms cubic-bezier(0.23,1,0.32,1), filter 160ms ease; }
.plk-pbtn:hover { filter: brightness(1.07); }
.plk-pbtn:active { transform: scale(0.95); }
.plk-taps { position: relative; z-index: 2; }
.plk-tap { cursor: pointer; transition: background-color 160ms ease, transform 160ms cubic-bezier(0.23,1,0.32,1); }
.plk-tap:hover { transform: scale(1.15); }
.plk-tap:active { transform: scale(0.9); }
`;

const storeKey = (c: WidgetConfig, id: string) =>
  "plk-" + id + "-" + String(c.text || "").replace(/[^a-z0-9]/gi, "").toLowerCase().slice(0, 14);

/* ---- 21. Habit tracker: tap the last 35 days ---- */
export const prettyHabit: PR = (c) => {
  const total = 35;
  const key = storeKey(c, "habit");
  const body =
    `<h3 class="plk-ptitle">${esc(c.text || "Daily habit")}</h3>` +
    `<p class="plk-psub"><span data-done>0</span> of ${total} days done — tap the dots</p>` +
    `<div class="plk-dots plk-taps" id="plk-grid" style="--cols:7">${dotsHtml(0, total, 7).match(/<span[^>]*><\/span>/g)?.join("") ?? ""}</div>`;
  const css = BTN;
  const js =
    "var K='" + key + "';var grid=shadow.getElementById('plk-grid'),out=shadow.querySelector('[data-done]');" +
    "var state=[];try{state=JSON.parse(localStorage.getItem(K)||'[]')}catch(e){}" +
    "function render(){var n=state.filter(Boolean).length;out.textContent=n;" +
    "grid.querySelectorAll('.plk-dot').forEach(function(d,i){d.classList.toggle('on',!!state[i])})}" +
    "grid.querySelectorAll('.plk-dot').forEach(function(d,i){d.classList.add('plk-tap');" +
    "d.addEventListener('click',function(){state[i]=!state[i];" +
    "try{localStorage.setItem(K,JSON.stringify(state))}catch(e){};render()})});render();";
  return pOk(c, body, css, js);
};

/* ---- 22. Water tracker: tap the glasses ---- */
export const prettyWater: PR = (c) => {
  const glasses = 8;
  const key = storeKey(c, "water");
  const body =
    `<h3 class="plk-ptitle">${esc(c.text || "Water today")}</h3>` +
    `<p class="plk-psub"><span data-done>0</span> / ${glasses} glasses</p>` +
    `<div class="plk-taps plk-water" id="plk-water">${Array.from({ length: glasses }, () => '<button type="button" class="plk-glass" aria-label="Glass"></button>').join("")}</div>`;
  const css = BTN + `
.plk-water { display: flex; gap: 10px; margin-top: 18px; flex-wrap: wrap; }
.plk-glass { width: 40px; height: 52px; border: 2px solid oklch(0.4 0.03 240); border-radius: 8px 8px 14px 14px;
  background: transparent; cursor: pointer; position: relative; overflow: hidden;
  transition: border-color 160ms ease, transform 160ms cubic-bezier(0.23,1,0.32,1); }
.plk-glass:active { transform: scale(0.92); }
.plk-glass.on { border-color: var(--w-accent); }
.plk-glass.on::after { content: ""; position: absolute; inset: auto 3px 3px 3px; top: 22%;
  background: color-mix(in oklab, var(--w-accent) 55%, oklch(0.4 0.06 220)); border-radius: 4px 4px 10px 10px; }
`;
  const js =
    "var K='" + key + "';var wrap=shadow.getElementById('plk-water'),out=shadow.querySelector('[data-done]');" +
    "var n=Number(localStorage.getItem(K)||0);" +
    "function render(){out.textContent=n;wrap.querySelectorAll('.plk-glass').forEach(function(g,i){g.classList.toggle('on',i<n)})}" +
    "wrap.querySelectorAll('.plk-glass').forEach(function(g,i){g.addEventListener('click',function(){" +
    "n=(i+1===n)?i:i+1;try{localStorage.setItem(K,n)}catch(e){};render()})});render();";
  return pOk(c, body, css, js);
};

/* ---- 23. Mini checklist ---- */
export const prettyTodo: PR = (c) => {
  const items = (c.items || "").split("\n").map((s) => s.trim()).filter(Boolean).slice(0, 6);
  const key = storeKey(c, "todo");
  const body =
    `<h3 class="plk-ptitle">${esc(c.text || "Today")}</h3>` +
    `<p class="plk-psub"><span data-done>0</span> / ${items.length} done</p>` +
    `<ul class="plk-todo" id="plk-todo">` +
    items.map((t, i) => `<li><button type="button" data-i="${i}" class="plk-check" aria-label="Toggle ${esc(t)}"></button><span>${esc(t)}</span></li>`).join("") +
    `</ul>`;
  const css = BTN + `
.plk-todo { list-style: none; margin-top: 14px; display: flex; flex-direction: column; gap: 9px; position: relative; z-index: 2; }
.plk-todo li { display: flex; align-items: center; gap: 10px; font-size: 14.5px; }
.plk-check { width: 22px; height: 22px; border-radius: 7px; border: 2px solid oklch(0.45 0.03 240);
  background: transparent; cursor: pointer; flex-shrink: 0;
  transition: background-color 160ms ease, border-color 160ms ease, transform 160ms cubic-bezier(0.23,1,0.32,1); }
.plk-check:active { transform: scale(0.88); }
.plk-check.on { background: var(--w-accent); border-color: var(--w-accent); }
.plk-check.on + span { text-decoration: line-through; opacity: 0.55; }
`;
  const js =
    "var K='" + key + "';var list=shadow.getElementById('plk-todo'),out=shadow.querySelector('[data-done]');" +
    "var state=[];try{state=JSON.parse(localStorage.getItem(K)||'[]')}catch(e){}" +
    "function render(){var n=0;list.querySelectorAll('li').forEach(function(li,i){" +
    "var on=!!state[i];li.querySelector('.plk-check').classList.toggle('on',on);" +
    "li.querySelector('span').style.opacity=on?'0.55':'1';li.querySelector('span').style.textDecoration=on?'line-through':'none';" +
    "if(on)n++});out.textContent=n}" +
    "list.querySelectorAll('.plk-check').forEach(function(b){b.addEventListener('click',function(){" +
    "var i=Number(b.dataset.i);state[i]=!state[i];try{localStorage.setItem(K,JSON.stringify(state))}catch(e){};render()})});render();";
  return pOk(c, body, css, js);
};

/* ---- 24. Focus timer (ring) ---- */
export const prettyTimer: PR = (c) => {
  const minutes = Math.max(1, Number(c.speed) || 25);
  const body =
    `<h3 class="plk-ptitle">${esc(c.text || "Focus session")}</h3>` +
    `<p class="plk-psub"><span id="plk-tm">` + pad(minutes) + `:00</span> remaining</p>` +
    `<div class="plk-trow"><button type="button" class="plk-pbtn" id="plk-go">Start</button>` +
    `<button type="button" class="plk-pbtn ghost" id="plk-rst">Reset</button></div>`;
  const css = BTN + `
.plk-trow { display: flex; gap: 8px; margin-top: 16px; position: relative; z-index: 2; }
.plk-pbtn.ghost { background: oklch(0.37 0.03 240); color: oklch(0.85 0.02 230); }
`;
  const js =
    "function pad(n){return String(n).padStart(2,'0')}" +
    "var total=" + minutes * 60 + ",left=total,run=null;" +
    "var disp=shadow.getElementById('plk-tm'),go=shadow.getElementById('plk-go');" +
    "function fmt(){disp.textContent=pad(Math.floor(left/60))+':'+pad(left%60)}" +
    "function stop(){clearInterval(run);run=null;go.textContent='Start'}" +
    "go.addEventListener('click',function(){if(run){stop();return}" +
    "go.textContent='Pause';run=setInterval(function(){left=Math.max(0,left-1);fmt();if(!left)stop()},1000)});" +
    "shadow.getElementById('plk-rst').addEventListener('click',function(){stop();left=total;fmt()});fmt();";
  return pOk(c, body, css, js);
};

/* ---- 25. Stopwatch ---- */
export const prettyStopwatch: PR = (c) => {
  const body =
    `<h3 class="plk-ptitle">${esc(c.text || "Stopwatch")}</h3>` +
    `<p class="plk-pbig" id="plk-sw">00:00.0</p>` +
    `<div class="plk-trow"><button type="button" class="plk-pbtn" id="plk-go">Start</button>` +
    `<button type="button" class="plk-pbtn ghost" id="plk-rst">Reset</button></div>`;
  const css = BTN + `
.plk-trow { display: flex; gap: 8px; margin-top: 16px; position: relative; z-index: 2; }
.plk-pbtn.ghost { background: oklch(0.37 0.03 240); color: oklch(0.85 0.02 230); }
.plk-pbig { font-size: 2.2rem; margin-top: 14px; }
`;
  const js =
    "var disp=shadow.getElementById('plk-sw'),go=shadow.getElementById('plk-go');" +
    "var t0=null,acc=0,run=null;" +
    "function fmt(){var ms=acc+(t0?Date.now()-t0:0);" +
    "disp.textContent=pad(Math.floor(ms/60000))+':'+pad(Math.floor(ms%60000/1000))+'.'+Math.floor(ms%1000/100)}" +
    "function stop(){clearInterval(run);if(t0)acc+=Date.now()-t0;t0=null;run=null;go.textContent='Start'}" +
    "go.addEventListener('click',function(){if(run){stop();return}t0=Date.now();go.textContent='Stop';" +
    "run=setInterval(fmt,100)});" +
    "shadow.getElementById('plk-rst').addEventListener('click',function(){stop();acc=0;fmt()});fmt();";
  return pOk(c, body, css, js);
};

/* ---- 26. Savings goal ---- */
export const prettySavings: PR = (c) => {
  const parts = (c.items || "250 | 1000").split("|").map((s) => Number(s.replace(/[^\d.]/g, "")) || 0);
  const cur = parts[0] || 0, goal = parts[1] || 1000;
  const key = storeKey(c, "save");
  const body =
    `<h3 class="plk-ptitle">${esc(c.text || "Savings goal")}</h3>` +
    `<p class="plk-psub"><span data-cur>${cur.toLocaleString()}</span> of ${goal.toLocaleString()} saved</p>` +
    `<div class="plk-ringwrap">${ringHtml(Math.min(1, cur / goal))}</div>` +
    `<button class="plk-pbtn" type="button" data-add>Add to savings</button>`;
  const css = BTN;
  const js =
    "var K='" + key + "';var goal=" + goal + ",add=" + Math.max(1, Math.round(goal / 20)) + ";" +
    "var ring=shadow.querySelector('.plk-ring');" +
    "var cur=Number(localStorage.getItem(K)||" + cur + ");" +
    "function render(){var p=Math.min(1,cur/goal);shadow.querySelector('[data-cur]').textContent=cur.toLocaleString();" +
    "if(ring){var c2=Number(ring.dataset.c);ring.style.strokeDashoffset=c2*(1-p)}}" +
    "shadow.querySelector('[data-add]').addEventListener('click',function(){cur=Math.min(goal,cur+add);" +
    "try{localStorage.setItem(K,cur)}catch(e){};render()});render();";
  return pOk(c, body, BTN, js);
};

/* ---- 27. Reading progress ---- */
export const prettyReading: PR = (c) => {
  const parts = (c.items || "128 | 320").split("|").map((s) => Number(s.replace(/[^\d]/g, "")) || 0);
  const page = parts[0] || 0, total = parts[1] || 300;
  const key = storeKey(c, "read");
  const pct = Math.min(100, Math.round((page / (total || 1)) * 100));
  const body =
    `<h3 class="plk-ptitle">${esc(c.text || "Now reading")}</h3>` +
    `<p class="plk-psub">Page <span data-cur>${page}</span> of ${total}</p>` +
    dotsHtml(Math.round((pct / 100) * 30), 30, 10) +
    `<button class="plk-pbtn" type="button" data-add>+10 pages</button>`;
  const css = BTN;
  const js =
    "var K='" + key + "';var total=" + total + ",add=10;" +
    "var cur=Number(localStorage.getItem(K||'x')||" + page + ");" +
    "function render(){var p=Math.min(100,Math.round(cur/(total||1)*100));" +
    "shadow.querySelector('[data-cur]').textContent=cur;" +
    "var dots=shadow.querySelectorAll('.plk-dot');var on=Math.round(p/100*dots.length);" +
    "dots.forEach(function(d,i){d.classList.toggle('on',i<on)})}" +
    "shadow.querySelector('[data-add]').addEventListener('click',function(){cur=Math.min(total,cur+add);" +
    "try{localStorage.setItem(K,cur)}catch(e){};render()});render();";
  return pOk(c, body, css, js);
};

/* ---- 28. Workout sessions ---- */
export const prettyWorkout: PR = (c) => {
  const done = 3, total = 5;
  const key = storeKey(c, "wk");
  const body =
    `<h3 class="plk-ptitle">${esc(c.text || "Workout plan")}</h3>` +
    `<p class="plk-pbig"><span data-done>${done}</span>/${total}</p>` +
    dotsHtml(done, total, total) +
    `<button class="plk-pbtn" type="button" data-add>Log a session</button>`;
  const css = BTN;
  const js =
    "var K='" + key + "';var total=" + total + ";" +
    "var done=Number(localStorage.getItem(K||'x')||" + done + ");" +
    "function render(){shadow.querySelector('[data-done]').textContent=done;" +
    "shadow.querySelectorAll('.plk-dot').forEach(function(d,i){d.classList.toggle('on',i<done)})}" +
    "shadow.querySelector('[data-add]').addEventListener('click',function(){done=Math.min(total,done+1);" +
    "try{localStorage.setItem(K,done)}catch(e){};render()});render();";
  return pOk(c, body, css, js);
};

/* ---- 29. Streak ---- */
export const prettyStreak: PR = (c) => {
  const days = Math.max(1, Number(c.items?.split("|")[0]) || 12);
  const key = storeKey(c, "streak");
  const body =
    `<h3 class="plk-ptitle">${esc(c.text || "Current streak")}</h3>` +
    `<p class="plk-pbig"><span data-cur>${days}</span> days</p>` +
    `<button class="plk-pbtn" type="button" data-add>Keep it alive (+1)</button>`;
  const css = BTN;
  const js =
    "var K='" + key + "';var cur=Number(localStorage.getItem(K||'x')||" + days + ");" +
    "shadow.querySelector('[data-add]').addEventListener('click',function(){cur++;" +
    "try{localStorage.setItem(K,cur)}catch(e){};shadow.querySelector('[data-cur]').textContent=cur});" +
    "shadow.querySelector('[data-cur]').textContent=cur;";
  return pOk(c, body, BTN, js);
};

/* ---- 30. Mood of the day ---- */
export const prettyMood: PR = (c) => {
  const moods = ["Great", "Good", "Okay", "Low", "Rough"];
  const key = storeKey(c, "mood");
  const body =
    `<h3 class="plk-ptitle">${esc(c.text || "Today's mood")}</h3>` +
    `<div class="plk-moods">` +
    moods.map((m, i) => `<button type="button" data-i="${i}" class="plk-mood">${m}</button>`).join("") +
    `</div><p class="plk-psub" data-out>Pick one — just for today.</p>`;
  const css = BTN + `
.plk-moods { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 16px; position: relative; z-index: 2; }
.plk-mood { border: 1.5px solid oklch(0.42 0.03 240); background: transparent; color: oklch(0.82 0.025 230);
  font: inherit; font-size: 13px; font-weight: 600; border-radius: 999px; padding: 8px 14px; cursor: pointer;
  transition: border-color 150ms ease, color 150ms ease, transform 150ms cubic-bezier(0.23,1,0.32,1); }
.plk-mood:active { transform: scale(0.94); }
.plk-mood.on { border-color: var(--w-accent); color: var(--w-accent);
  background: color-mix(in oklab, var(--w-accent) 12%, transparent); }
`;
  const js =
    "var K='" + key + "';var out=shadow.querySelector('[data-out]');" +
    "var saved=Number(localStorage.getItem(K)||-1);" +
    "function render(v){shadow.querySelectorAll('.plk-mood').forEach(function(b,i){b.classList.toggle('on',i===v)});" +
    "if(v>=0)out.textContent='Feeling '+" + JSON.stringify(moods) + "[v].toLowerCase()+' today.'}" +
    "shadow.querySelectorAll('.plk-mood').forEach(function(b){b.addEventListener('click',function(){" +
    "var v=Number(b.dataset.i);try{localStorage.setItem(K,v)}catch(e){};render(v)})});if(saved>=0)render(saved);";
  return pOk(c, body, css, js);
};

/* ---- 31. Budget ---- */
export const prettyBudget: PR = (c) => {
  const parts = (c.items || "420 | 600").split("|").map((s) => Number(s.replace(/[^\d.]/g, "")) || 0);
  const spent = parts[0] || 0, cap = parts[1] || 600;
  const key = storeKey(c, "budget");
  const pct = Math.min(100, Math.round((spent / (cap || 1)) * 100));
  const body =
    `<div class="plk-pfill"></div>` +
    `<h3 class="plk-ptitle">${esc(c.text || "Monthly budget")}</h3>` +
    `<p class="plk-pbig">${pct}%</p>` +
    `<p class="plk-psub"><span data-cur>${spent}</span> of ${cap} spent</p>` +
    `<div class="plk-trow"><button type="button" class="plk-pbtn" data-add="10">+10</button>` +
    `<button type="button" class="plk-pbtn" data-add="50">+50</button></div>`;
  const css = BTN + `
.plk-pfill { clip-path: none; }
`;
  const js =
    "var K='" + key + "';var cap=" + cap + ";" +
    "var spent=Number(localStorage.getItem(K)||" + spent + ");" +
    "function render(){var p=Math.min(100,Math.round(spent/(cap||1)*100));" +
    "shadow.querySelector('[data-cur]').textContent=spent;" +
    "var f=shadow.querySelector('.plk-pfill');if(f)f.style.clipPath=" + JSON.stringify(fillClip(pct)) + ";" +
    "shadow.querySelector('.plk-pbig').textContent=p+'%'}" +
    "shadow.querySelectorAll('[data-add]').forEach(function(b){b.addEventListener('click',function(){" +
    "spent+=Number(b.dataset.add);try{localStorage.setItem(K,spent)}catch(e){};render()})});render();";
  return pOk(c, body, css, js);
};

/* ---- 32. Weight goal ---- */
export const prettyWeight: PR = (c) => {
  const parts = (c.items || "80 | 76 | 70").split("|").map((s) => Number(s.replace(/[^\d.]/g, "")) || 0);
  const start = parts[0] || 80, target = parts[2] || 70;
  const key = storeKey(c, "weight");
  const cur0 = parts[1] || start;
  const body =
    `<h3 class="plk-ptitle">${esc(c.text || "Weight goal")}</h3>` +
    `<p class="plk-psub"><strong data-cur style="color:var(--w-accent)">${cur0}</strong> kg — from ${start}, target ${target}</p>` +
    `<div class="plk-trow"><button type="button" class="plk-pbtn" data-d="-0.5">−0.5</button>` +
    `<button type="button" class="plk-pbtn" data-d="0.5">+0.5</button></div>`;
  const css = BTN;
  const js =
    "var K='" + key + "';var S=" + start + ",T=" + target + ";" +
    "var cur=Number(localStorage.getItem(K)||" + cur0 + ");" +
    "shadow.querySelectorAll('[data-d]').forEach(function(b){b.addEventListener('click',function(){" +
    "cur=Math.round((cur+Number(b.dataset.d))*10)/10;try{localStorage.setItem(K,cur)}catch(e){};" +
    "shadow.querySelector('[data-cur]').textContent=cur})});";
  return pOk(c, body, css, js);
};

/* ---- 33. Fundraiser ---- */
export const prettyFundraiser: PR = (c) => {
  const parts = (c.items || "1240 | 5000 | 38").split("|").map((s) => Number(s.replace(/[^\d]/g, "")) || 0);
  const raised = parts[0] || 0, goal = parts[1] || 5000, backers = parts[2] || 0;
  const pct = Math.min(100, Math.round((raised / (goal || 1)) * 100));
  const body =
    `<div class="plk-pfill"></div>` +
    `<h3 class="plk-ptitle">${esc(c.text || "Community fundraiser")}</h3>` +
    `<p class="plk-pbig">${pct}%</p>` +
    `<p class="plk-psub"><span data-cur>${raised.toLocaleString()}</span> raised · <span data-b>${backers}</span> backers</p>` +
    `<button type="button" class="plk-pbtn" data-add>Back +25</button>`;
  const css = BTN + `
.plk-pfill { clip-path: polygon(0 100%, 26% 100%, 100% 100%, 0 100%);
  transition: clip-path 900ms cubic-bezier(0.23,1,0.32,1); }
@media (prefers-reduced-motion: reduce) { .plk-pfill { transition: none; } }
`;
  const js =
    "var raised=" + raised + ",backers=" + backers + ",goal=" + goal + ",add=25;" +
    "function render(){var p=Math.min(100,Math.round(raised/goal*100));" +
    "shadow.querySelector('[data-cur]').textContent=raised.toLocaleString();" +
    "shadow.querySelector('[data-b]').textContent=backers;" +
    "shadow.querySelector('.plk-pbig').textContent=p+'%';" +
    "var f=shadow.querySelector('.plk-pfill');if(f)f.style.clipPath=" + JSON.stringify(fillClip(pct)) + "}" +
    "shadow.querySelector('[data-add]').addEventListener('click',function(){raised+=add;backers++;render()});render();";
  return pOk(c, body, css, js);
};

/* ---- 34. Life in weeks ---- */
export const prettyLife: PR = (c) => {
  const years = Math.max(1, Number(c.items?.split("|")[0]) || 30);
  const total = 90 * 52;
  const lived = Math.min(total, years * 52);
  const body =
    `<h3 class="plk-ptitle">${esc(c.text || "Your life in weeks")}</h3>` +
    `<p class="plk-psub"><span data-l>${Math.round(lived / 52)}</span> years · each dot is one week</p>` +
    dotsHtml(Math.round(lived), total, 52);
  const css = `
.plk-dots { gap: 3px; }
.plk-dot { border-radius: 2px; }
`;
  return pOk(c, body, css, undefined);
};

/* ---- 35. Two-option vote (rings, one vote per visitor) ---- */
export const prettyVote: PR = (c) => {
  const opts = (c.items || "Coffee|Tea").split("\n").map((s) => s.trim()).filter(Boolean).slice(0, 2);
  const key = storeKey(c, "vote");
  const a = opts[0] || "Option A", b = opts[1] || "Option B";
  const body =
    `<h3 class="plk-ptitle">${esc(c.text || "Pick a side")}</h3>` +
    `<div class="plk-vote">` +
    `<button type="button" data-v="0" class="plk-vbtn"><span class="plk-ringwrap" style="position:static;translate:none;display:inline-block">${ringHtml(0, 64, 7)}</span><span>${esc(a)}</span></button>` +
    `<button type="button" data-v="1" class="plk-vbtn"><span class="plk-ringwrap" style="position:static;translate:none;display:inline-block">${ringHtml(0, 64, 7)}</span><span>${esc(b)}</span></button>` +
    `</div><p class="plk-psub" data-out>One tap. No account. Your vote stays on this device.</p>`;
  const css = BTN + `
.plk-vote { display: flex; gap: 18px; margin-top: 16px; position: relative; z-index: 2; }
.plk-vbtn { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px;
  background: oklch(0.34 0.03 240); border: 0; border-radius: 18px; padding: 16px 10px; cursor: pointer;
  color: oklch(0.9 0.01 220); font: inherit; font-size: 13.5px; font-weight: 600;
  transition: transform 160ms cubic-bezier(0.23,1,0.32,1), background-color 160ms ease; }
.plk-vbtn:hover { background: oklch(0.38 0.035 240); }
.plk-vbtn:active { transform: scale(0.96); }
.plk-vbtn.mine { outline: 2px solid var(--w-accent); }
`;
  const js =
    "var K='" + key + "';var opts=" + JSON.stringify([a, b]) + ";" +
    "var raw=localStorage.getItem(K);var mine=raw===null?-1:Number(raw);" +
    "var counts=[3,2];" +
    "function render(){var total=counts[0]+counts[1]||1;" +
    "shadow.querySelectorAll('.plk-vbtn').forEach(function(b,i){" +
    "var p=counts[i]/total;b.classList.toggle('mine',mine===i);" +
    "b.querySelector('.plk-ring').style.strokeDashoffset=Number(b.querySelector('.plk-ring').dataset.c)*(1-p);" +
    "b.querySelector('span:last-child').textContent=opts[i]+' · '+Math.round(p*100)+'%'})}" +
    "shadow.querySelectorAll('.plk-vbtn').forEach(function(b){b.addEventListener('click',function(){" +
    "if(mine>=0)return;mine=Number(b.dataset.v);counts[mine]++;" +
    "try{localStorage.setItem(K,mine)}catch(e){};render()})});" +
    "if(mine>=0){counts[mine]++;render()}else{render()}";
  return pOk(c, body, css, js);
};

function pad(n: number) { return String(n).padStart(2, "0"); }
void esc;
