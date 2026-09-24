import type { WidgetConfig } from "../types";
import { baseCss } from "../base";
import { fieldRow, TOOL_CSS, toolShell } from "./kit";

/* 25 fun tools, timers and generators. Everything runs locally in the shadow
   DOM: no network, no storage, no keys. Audio (metronome) only starts after
   an explicit click, per browser autoplay policy. */

type R = (c: WidgetConfig) => { html: string; css: string; js?: string };

const out = (c: WidgetConfig, html: string, js = "", extra = ""): { html: string; css: string; js?: string } =>
  ({ html: toolShell(c, html), css: baseCss(c, TOOL_CSS + extra), js });

const BTN = '<button type="button" class="plk-btn" id="plk-go">Roll</button>';
const OUT = '<dl class="plk-out"><dt>Result</dt><dd id="plk-o1" style="font-size:30px">—</dd></dl>';
const LIST = (ph = "One name per line") => fieldRow("Names", `<textarea rows="5" name="list" placeholder="${ph}"></textarea>`);

const EXTRA = `
.plk-big { font-size: 34px; font-weight: 700; text-align: center; font-variant-numeric: tabular-nums;
  padding: 14px 0 6px; letter-spacing: -0.02em; }
.plk-center { text-align: center; }
.plk-swatch { height: 74px; border-radius: calc(var(--w-radius) - 2px); border: 1px solid var(--w-line); margin: 10px 0; }
.plk-dice { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; padding: 8px 0; }
.plk-die { width: 38px; height: 38px; border-radius: 9px; border: 1px solid var(--w-line);
  background: var(--w-card); display: grid; place-items: center; font-weight: 700; font-size: 16px; }
.plk-toggle-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }
.plk-chip { border: 1px solid var(--w-line); background: var(--w-card); border-radius: 999px;
  padding: 6px 12px; font: inherit; font-size: 13px; cursor: pointer; color: var(--w-ink); }
.plk-chip[aria-pressed="true"] { border-color: var(--w-accent); color: var(--w-accent); }
.plk-teams { display: flex; flex-direction: column; gap: 10px; margin-top: 6px; }
.plk-teams b { font-size: 13px; color: var(--w-muted); }
`;

/* 1 — dice roller */
export function diceRoller(c: WidgetConfig) {
  const html = fieldRow("Dice", '<select name="sides"><option>6</option><option>4</option><option>8</option><option>10</option><option>12</option><option>20</option></select>') +
    fieldRow("How many", '<input type="number" name="count" value="2" min="1" max="10" step="1">') + BTN + OUT;
  const js = "var f=shadow.getElementById('plk-f'),go=shadow.getElementById('plk-go');" +
    "go.addEventListener('click',function(){var s=+f.sides.value,n=Math.min(10,+f.count.value||1);" +
    "go.textContent='Rolling…';setTimeout(function(){var o='',sum=0;" +
    "for(var i=0;i<n;i++){var r=1+Math.floor(Math.random()*s);sum+=r;o+='<span class=\"plk-die\">'+r+'</span>'}" +
    "shadow.getElementById('plk-o1').innerHTML=o+'<div class=\"plk-lab\" style=\"margin-top:6px\">Total '+sum+'</div>';" +
    "go.textContent='Roll'},300)})";
  const extra = ".plk-out dd{font-size:inherit}";
  return out(c, html, js, EXTRA + extra);
}

/* 2 — coin flip */
export function coinFlip(c: WidgetConfig) {
  const html = BTN + '<dl class="plk-out"><dt>Result</dt><dd id="plk-o1" class="plk-big">—</dd></dl>';
  const js = "var go=shadow.getElementById('plk-go');" +
    "go.addEventListener('click',function(){go.textContent='Flipping…';" +
    "setTimeout(function(){var r=Math.random()<0.5?'Heads':'Tails';" +
    "shadow.getElementById('plk-o1').textContent=r;go.textContent='Flip again'},350)})";
  return out(c, html, js);
}

/* 3 — random number generator */
export function randomNumberGenerator(c: WidgetConfig) {
  const html = fieldRow("From", '<input type="number" name="min" value="1" step="1">') +
    fieldRow("To", '<input type="number" name="max" value="100" step="1">') + BTN + OUT;
  const js = "var f=shadow.getElementById('plk-f');" +
    "shadow.getElementById('plk-go').addEventListener('click',function(){" +
    "var a=+f.min.value,b=+f.max.value;if(b<a){var t=a;a=b;b=t}" +
    "shadow.getElementById('plk-o1').textContent=Math.floor(Math.random()*(b-a+1))+a})";
  return out(c, html, js);
}

/* 4 — lottery numbers */
export function lotteryNumberGenerator(c: WidgetConfig) {
  const html = BTN + '<dl class="plk-out"><dt>Your numbers (1–49)</dt><dd id="plk-o1" style="font-size:20px;letter-spacing:0.04em">—</dd></dl>';
  const js = "var go=shadow.getElementById('plk-go');" +
    "go.addEventListener('click',function(){var pool=[];for(var i=1;i<=49;i++)pool.push(i);" +
    "var picks=[];for(var j=0;j<6;j++)picks.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]);" +
    "picks.sort(function(a,b){return a-b});" +
    "shadow.getElementById('plk-o1').textContent=picks.join('  ·  ')})";
  return out(c, html, js);
}

/* 5 — random picker from a list */
export function randomPicker(c: WidgetConfig) {
  const html = LIST() + BTN + OUT;
  const js = "var f=shadow.getElementById('plk-f');" +
    "shadow.getElementById('plk-go').addEventListener('click',function(){" +
    "var xs=(f.list.value||'').split('\\n').map(function(s){return s.trim()}).filter(Boolean);" +
    "if(!xs.length){shadow.getElementById('plk-o1').textContent='Add names first';return}" +
    "shadow.getElementById('plk-o1').textContent=xs[Math.floor(Math.random()*xs.length)]})";
  return out(c, html, js);
}

/* 6 — team randomizer */
export function teamRandomizer(c: WidgetConfig) {
  const html = LIST() + fieldRow("Number of teams", '<input type="number" name="n" value="2" min="2" max="8" step="1">') +
    BTN + '<div class="plk-teams" id="plk-o1" aria-live="polite"></div>';
  const js = "var f=shadow.getElementById('plk-f');" +
    "shadow.getElementById('plk-go').addEventListener('click',function(){" +
    "var xs=(f.list.value||'').split('\\n').map(function(s){return s.trim()}).filter(Boolean).sort(function(){return Math.random()-0.5});" +
    "var n=Math.max(2,+f.n.value||2),teams=Array.from({length:n},function(){return[]});" +
    "xs.forEach(function(x,i){teams[i%n].push(x)});" +
    "shadow.getElementById('plk-o1').innerHTML=teams.map(function(t,i){return '<b>Team '+(i+1)+'</b><div>'+t.join(', ')+'</div>'}).join('')})";
  return out(c, html, js, EXTRA);
}

/* 7 — password generator */
export function passwordGenerator(c: WidgetConfig) {
  const html =
    '<div class="plk-toggle-row">' +
    '<button type="button" class="plk-chip" data-k="upper" aria-pressed="true">A–Z</button>' +
    '<button type="button" class="plk-chip" data-k="lower" aria-pressed="true">a–z</button>' +
    '<button type="button" class="plk-chip" data-k="digits" aria-pressed="true">0–9</button>' +
    '<button type="button" class="plk-chip" data-k="symbols" aria-pressed="true">!@#</button></div>' +
    fieldRow("Length", '<input type="range" name="len" min="8" max="40" value="16" class="plk-range">') +
    BTN + '<dl class="plk-out"><dt>Password</dt><dd id="plk-o1" style="font-size:14px;word-break:break-all">—</dd></dl>';
  const js = "var f=shadow.getElementById('plk-f');" +
    "f.querySelectorAll('.plk-chip').forEach(function(ch){ch.addEventListener('click',function(){ch.setAttribute('aria-pressed',ch.getAttribute('aria-pressed')!=='true')})});" +
    "shadow.getElementById('plk-go').addEventListener('click',function(){" +
    "var on={};f.querySelectorAll('.plk-chip').forEach(function(ch){on[ch.dataset.k]=ch.getAttribute('aria-pressed')==='true'});" +
    "var pool='';if(on.upper)pool+='ABCDEFGHJKLMNPQRSTUVWXYZ';if(on.lower)pool+='abcdefghijkmnopqrstuvwxyz';" +
    "if(on.digits)pool+='23456789';if(on.symbols)pool+='!@#$%^&*-_=+';if(!pool)pool='abcdefghijkmnopqrstuvwxyz';" +
    "var len=+f.len.value||16,o='';for(var i=0;i<len;i++)o+=pool[Math.floor(Math.random()*pool.length)];" +
    "shadow.getElementById('plk-o1').textContent=o})";
  return out(c, html, js, EXTRA);
}

/* 8 — PIN generator */
export function pinGenerator(c: WidgetConfig) {
  const html = fieldRow("Length", '<input type="number" name="len" value="6" min="4" max="12" step="1">') + BTN + OUT;
  const js = "var f=shadow.getElementById('plk-f');" +
    "shadow.getElementById('plk-go').addEventListener('click',function(){" +
    "var n=Math.min(12,Math.max(4,+f.len.value||6)),o='';" +
    "for(var i=0;i<n;i++)o+=Math.floor(Math.random()*10);shadow.getElementById('plk-o1').textContent=o})";
  return out(c, html, js);
}

/* 9 — random color generator */
export function randomColorGenerator(c: WidgetConfig) {
  const html = BTN + '<div class="plk-swatch" id="plk-sw" style="background:#22707e"></div>' +
    '<dl class="plk-out"><dt>Hex</dt><dd id="plk-o1" style="font-size:15px">#22707E</dd></dl>';
  const js = "var go=shadow.getElementById('plk-go'),sw=shadow.getElementById('plk-sw');" +
    "go.addEventListener('click',function(){var h='#'+Math.floor(Math.random()*16777216).toString(16).padStart(6,'0').toUpperCase();" +
    "sw.style.background=h;shadow.getElementById('plk-o1').textContent=h})";
  return out(c, html, js);
}

/* 10 — username generator */
export function usernameGenerator(c: WidgetConfig) {
  const html = BTN + '<dl class="plk-out"><dt>Handle</dt><dd id="plk-o1" style="font-size:17px">—</dd></dl>';
  const js = "var a=['swift','cosmic','quiet','neon','solar','clever','fuzzy','brave','mellow','hyper']," +
    "b=['falcon','otter','pixel','comet','cactus','raven','pixel','otter','falcon','lantern']," +
    "n=['84','7','12','42','99','21','3000','5','64','128'];" +
    "shadow.getElementById('plk-go').addEventListener('click',function(){" +
    "shadow.getElementById('plk-o1').textContent=a[Math.floor(Math.random()*a.length)]+b[Math.floor(Math.random()*b.length)]+n[Math.floor(Math.random()*n.length)]})";
  return out(c, html, js);
}

/* 11 — raffle winner */
export function raffleWinner(c: WidgetConfig) {
  const html = LIST("One entry per line") + BTN + OUT;
  const js = "var f=shadow.getElementById('plk-f'),go=shadow.getElementById('plk-go');" +
    "go.addEventListener('click',function(){var xs=(f.list.value||'').split('\\n').map(function(s){return s.trim()}).filter(Boolean);" +
    "if(!xs.length){shadow.getElementById('plk-o1').textContent='Add entries first';return}" +
    "var i=0;go.textContent='Picking…';var t=setInterval(function(){" +
    "shadow.getElementById('plk-o1').textContent=xs[Math.floor(Math.random()*xs.length)];" +
    "if(++i>14){clearInterval(t);shadow.getElementById('plk-o1').textContent=xs[Math.floor(Math.random()*xs.length)];go.textContent='Pick a winner'}},90)})";
  return out(c, html, js);
}

/* 12 — pomodoro timer */
export function pomodoroTimer(c: WidgetConfig) {
  const html =
    '<div class="plk-big" id="plk-o1">25:00</div>' +
    '<div class="plk-lab plk-center" id="plk-o2">Focus session</div>' +
    '<div class="plk-center" style="margin-top:10px;display:flex;gap:8px;justify-content:center">' +
    '<button type="button" class="plk-btn" id="plk-go">Start focus</button>' +
    '<button type="button" class="plk-btn" id="plk-rs" style="background:var(--w-card);color:var(--w-ink);border:1px solid var(--w-line)">Reset</button></div>';
  const js = "var d=shadow.getElementById('plk-o1'),lab=shadow.getElementById('plk-o2')," +
    "go=shadow.getElementById('plk-go'),rs=shadow.getElementById('plk-rs');" +
    "var focus=true,left=25*60,t=null;" +
    "function paint(){var m=Math.floor(left/60),s=left%60;d.textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')}" +
    "function stop(){clearInterval(t);t=null}" +
    "go.addEventListener('click',function(){if(t){stop();lab.textContent='Paused';go.textContent='Resume';return}" +
    "go.textContent='Pause';lab.textContent=focus?'Focus session':'Break — relax';" +
    "t=setInterval(function(){left--;paint();if(left<=0){stop();" +
    "focus=!focus;left=(focus?25:5)*60;lab.textContent=focus?'Break done — focus again':'Focus done — take 5';" +
    "go.textContent='Start '+(focus?'focus':'break')}paint()},1000)})" +
    "rs.addEventListener('click',function(){stop();focus=true;left=25*60;paint();lab.textContent='Focus session';go.textContent='Start focus'})" +
    "paint()";
  const extra = ".plk-big{color:var(--w-accent)}";
  return out(c, html, js, EXTRA + extra);
}

/* 13 — kitchen timer */
export function kitchenTimer(c: WidgetConfig) {
  const html = fieldRow("Minutes", '<input type="number" name="m" value="5" min="0" max="180" step="1">') +
    fieldRow("Seconds", '<input type="number" name="s" value="0" min="0" max="59" step="1">') +
    '<div class="plk-big" id="plk-o1">05:00</div>' +
    '<div class="plk-center" style="margin-top:8px"><button type="button" class="plk-btn" id="plk-go">Start</button> ' +
    '<button type="button" class="plk-btn" id="plk-rs" style="background:var(--w-card);color:var(--w-ink);border:1px solid var(--w-line)">Reset</button></div>';
  const js = "var f=shadow.getElementById('plk-f'),d=shadow.getElementById('plk-o1')," +
    "go=shadow.getElementById('plk-go'),rs=shadow.getElementById('plk-rs'),left=300,t=null;" +
    "function paint(){d.textContent=String(Math.floor(left/60)).padStart(2,'0')+':'+String(left%60).padStart(2,'0')}" +
    "function read(){left=(+f.m.value||0)*60+(+f.s.value||0);paint()}" +
    "f.m.addEventListener('input',read);f.s.addEventListener('input',read);" +
    "go.addEventListener('click',function(){if(t){clearInterval(t);t=null;go.textContent='Start';return}" +
    "if(left<=0)read();go.textContent='Pause';t=setInterval(function(){left--;paint();" +
    "if(left<=0){clearInterval(t);t=null;go.textContent='Start';d.textContent='Done!'}},1000)})" +
    "rs.addEventListener('click',function(){clearInterval(t);t=null;read();go.textContent='Start'})" +
    "paint()";
  return out(c, html, js);
}

/* 14 — metronome */
export function metronome(c: WidgetConfig) {
  const html = fieldRow("Tempo (BPM)", '<input type="range" name="bpm" min="40" max="208" value="100" class="plk-range">') +
    '<div class="plk-big" id="plk-o1">100 BPM</div>' +
    '<div class="plk-center"><button type="button" class="plk-btn" id="plk-go">Start</button></div>';
  const js = "var f=shadow.getElementById('plk-f'),d=shadow.getElementById('plk-o1'),go=shadow.getElementById('plk-go');" +
    "var t=null,beat=0;" +
    "function tick(){var ctx=new (window.AudioContext||window.webkitAudioContext)();var o=ctx.createOscillator(),g=ctx.createGain();" +
    "o.connect(g);g.connect(ctx.destination);o.frequency.value=(beat%4===0)?1000:640;g.gain.value=0.12;" +
    "o.start();setTimeout(function(){ctx.close()},60);beat++;" +
    "d.textContent=f.bpm.value+' BPM'}" +
    "go.addEventListener('click',function(){var ctx=new (window.AudioContext||window.webkitAudioContext)();ctx.resume().then(function(){ctx.close()});" +
    "if(t){clearInterval(t);t=null;go.textContent='Start';return}" +
    "tick();t=setInterval(tick,60000/(+f.bpm.value||100))});" +
    "f.bpm.addEventListener('input',function(){d.textContent=f.bpm.value+' BPM';" +
    "if(t){clearInterval(t);t=setInterval(tick,60000/(+f.bpm.value||100))}})";
  return out(c, html, js);
}

/* 15 — breathing exercise (4-7-8) */
export function breathingTimer(c: WidgetConfig) {
  const html =
    '<div class="plk-big" id="plk-o1">Ready?</div>' +
    '<div class="plk-lab plk-center" id="plk-o2">Inhale 4 · hold 7 · exhale 8</div>' +
    '<div class="plk-center" style="margin-top:10px"><button type="button" class="plk-btn" id="plk-go">Start breathing</button></div>';
  const js = "var d=shadow.getElementById('plk-o1'),lab=shadow.getElementById('plk-o2'),go=shadow.getElementById('plk-go');" +
    "var phases=[['Inhale…',4],['Hold…',7],['Exhale…',8]],t=null,run=false;" +
    "function phase(i){if(!run)return;var p=phases[i%3];d.textContent=p[0];var left=p[1];" +
    "d.textContent=p[0]+' — '+left;" +
    "t=setInterval(function(){left--;if(left<=0){clearInterval(t);phase(i+1);return}d.textContent=p[0]+' — '+left},1000)}" +
    "go.addEventListener('click',function(){run=!run;go.textContent=run?'Stop':'Start breathing';" +
    "if(run){clearInterval(t);phase(0)}else{clearInterval(t);d.textContent='Ready?'}})";
  const extra = ".plk-big{color:var(--w-accent)}";
  return out(c, html, js, EXTRA + extra);
}

/* 16 — reaction time test */
export function reactionTest(c: WidgetConfig) {
  const html =
    '<div class="plk-big" id="plk-o1" style="min-height:52px">Tap Start, then tap when the box turns green.</div>' +
    '<div class="plk-center" style="margin-top:8px"><button type="button" class="plk-btn" id="plk-go">Start</button></div>';
  const js = "var d=shadow.getElementById('plk-o1'),go=shadow.getElementById('plk-go'),t0=0,tm=null,armed=false;" +
    "function paint(bg,fg,txt){d.textContent=txt;" +
    "var form=shadow.querySelector('form');form.style.transition='background 120ms ease';form.style.background=bg;" +
    "d.style.color=fg}" +
    "go.addEventListener('click',function(){" +
    "if(armed){var dt=Date.now()-t0;armed=false;paint('var(--w-card)','var(--w-ink)',dt+' ms — tap Start to retry');clearTimeout(tm);return}" +
    "armed=true;paint('#0d2f35','#fff','Wait for green…');" +
    "tm=setTimeout(function(){if(!armed)return;t0=Date.now();paint('#0f8a4d','#fff','TAP NOW!')},900+Math.random()*2200)})";
  const extra = ".plk-big{min-height:52px}";
  return out(c, html, js, EXTRA + extra);
}

/* 17 — typing speed test */
const TYPE_SENTENCE = "Quick brown wolves roam beside the quiet studio while widgets settle into place.";
export function typingSpeedTest(c: WidgetConfig) {
  const html =
    fieldRow("Type this sentence", '<blockquote class="plk-lab" style="border-left:3px solid var(--w-accent);padding-left:10px;margin:0 0 10px">' + TYPE_SENTENCE + '</blockquote>') +
    fieldRow("Your attempt", '<textarea rows="3" name="typed" placeholder="Start typing — the timer stops when you match it."></textarea>') +
    '<dl class="plk-out"><dt>Speed</dt><dd id="plk-o1">—</dd><dt>Accuracy</dt><dd id="plk-o2">—</dd></dl>';
  const js = "var f=shadow.getElementById('plk-f'),TARGET=" + JSON.stringify(TYPE_SENTENCE) + ",t0=0;" +
    "f.typed.addEventListener('input',function(){" +
    "if(!t0)t0=Date.now();" +
    "var v=f.typed.value;" +
    "if(v.toLowerCase()===TARGET.toLowerCase()){" +
    "var mins=(Date.now()-t0)/60000;var wpm=Math.round(TARGET.split(/\\s+/).length/Math.max(mins,0.01));" +
    "var okc=0;for(var i=0;i<v.length;i++)if(v[i]===(TARGET[i]||''))okc++;" +
    "shadow.getElementById('plk-o1').textContent=wpm+' WPM';" +
    "shadow.getElementById('plk-o2').textContent=Math.round(okc/TARGET.length*100)+'%';t0=0}})";
  return out(c, html, js);
}

/* 18 — world clock */
export function worldClock(c: WidgetConfig) {
  const zones = ["UTC", "America/New_York", "America/Los_Angeles", "Europe/London", "Europe/Berlin", "Asia/Dubai", "Asia/Tokyo", "Australia/Sydney"];
  const html2 = fieldRow("Pick a city", '<select name="tz">' + zones.map((z) => `<option value="${z}">${(z.split('/').pop() ?? '').replace(/_/g, ' ')}</option>`).join("") + '<option value="local" selected>My device time</option></select>') +
    '<dl class="plk-out"><dt>Current time</dt><dd id="plk-o1" style="font-size:22px">—</dd><dt>Zone</dt><dd id="plk-o2" class="plk-lab">—</dd></dl>';
  const js = "var f=shadow.getElementById('plk-f');" +
    "function tick(){var tz=f.tz.value==='local'?undefined:f.tz.value;" +
    "try{shadow.getElementById('plk-o1').textContent=new Date().toLocaleTimeString(undefined,{timeZone:tz,hour:'2-digit',minute:'2-digit',second:'2-digit'});" +
    "shadow.getElementById('plk-o2').textContent=f.tz.value==='local'?'device time':f.tz.value}catch(e){}};" +
    "f.tz.addEventListener('change',function(){tick()});tick();setInterval(tick,1000)";
  return out(c, html2, js);
}

/* 19 — work hours calculator */
export function workHoursCalculator(c: WidgetConfig) {
  const html = fieldRow("Started at", '<input type="time" name="start" value="09:00" required>') +
    fieldRow("Finished at", '<input type="time" name="end" value="17:30" required>') +
    fieldRow("Break (minutes)", '<input type="number" name="br" value="30" min="0" step="5">') +
    '<dl class="plk-out"><dt>Hours worked</dt><dd id="plk-o1">—</dd><dt>Overtime past 8 h</dt><dd id="plk-o2">—</dd></dl>';
  const js = "var f=shadow.getElementById('plk-f');" +
    "function calc(){var p=f.start.value.split(':'),q=f.end.value.split(':');" +
    "var mins=(+q[0]*60+ +q[1])-(+p[0]*60+ +p[1])-(+f.br.value||0);if(isNaN(mins))return;" +
    "if(mins<0)mins+=1440;var h=mins/60;" +
    "shadow.getElementById('plk-o1').textContent=h.toFixed(2)+' h';" +
    "shadow.getElementById('plk-o2').textContent=(h>8?(h-8).toFixed(2):'0')+' h'}" +
    "f.addEventListener('input',calc);calc()";
  return out(c, html, js);
}

/* 20 — bedtime calculator */
export function bedtimeCalculator(c: WidgetConfig) {
  const html = fieldRow("I need to wake up at", '<input type="time" name="wake" value="07:00" required>') +
    '<dl class="plk-out"><dt>Bedtimes (6 sleep cycles)</dt><dd id="plk-o1" style="font-size:15px;line-height:1.7">—</dd></dl>';
  const js = "var f=shadow.getElementById('plk-f');" +
    "f.addEventListener('input',calc);function calc(){if(!f.wake.value)return;" +
    "var p=f.wake.value.split(':'),wake=(+p[0]*60)+ +p[1];var out=[];" +
    "[6,5,4].forEach(function(c){var t=(wake-c*90-15)%1440;if(t<0)t+=1440;" +
    "out.push(String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0'))})" +
    "shadow.getElementById('plk-o1').textContent=out.join('  ·  ')}calc()";
  return out(c, html, js);
}

/* 21 — live countdown to a date */
export function countdownToDate(c: WidgetConfig) {
  const html = fieldRow("Target date", '<input type="date" name="d" required>') +
    '<dl class="plk-out"><dt>Time remaining</dt><dd id="plk-o1" style="font-size:20px">—</dd></dl>';
  const js = "var f=shadow.getElementById('plk-f'),t=null;" +
    "function tick(){var v=f.d.value;if(!v)return;" +
    "var ms=new Date(v+'T00:00:00').getTime()-Date.now();" +
    "if(ms<=0){shadow.getElementById('plk-o1').textContent='The day is here!';clearInterval(t);return}" +
    "var dd=Math.floor(ms/86400000),hh=Math.floor(ms%86400000/3600000),mm=Math.floor(ms%3600000/60000),ss=Math.floor(ms%60000/1000);" +
    "shadow.getElementById('plk-o1').textContent=dd+'d '+hh+'h '+mm+'m '+ss+'s'}" +
    "f.d.addEventListener('change',function(){clearInterval(t);tick();t=setInterval(tick,1000)});tick()";
  return out(c, html, js);
}

/* 22 — stopwatch */
export function stopwatch(c: WidgetConfig) {
  const html =
    '<div class="plk-big" id="plk-o1">00:00.0</div>' +
    '<div class="plk-center" style="margin-top:8px;display:flex;gap:8px;justify-content:center">' +
    '<button type="button" class="plk-btn" id="plk-go">Start</button>' +
    '<button type="button" class="plk-btn" id="plk-rs" style="background:var(--w-card);color:var(--w-ink);border:1px solid var(--w-line)">Reset</button></div>';
  const js = "var d=shadow.getElementById('plk-o1'),go=shadow.getElementById('plk-go'),rs=shadow.getElementById('plk-rs');" +
    "var t0=0,acc=0,t=null,run=false;" +
    "function paint(){var ms=acc+(run?Date.now()-t0:0);var s=ms/1000;" +
    "d.textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(Math.floor(s%60)).padStart(2,'0')+'.'+Math.floor((s%1)*10)}" +
    "go.addEventListener('click',function(){if(run){acc+=Date.now()-t0;clearInterval(t);run=false;go.textContent='Start';return}" +
    "run=true;t0=Date.now();go.textContent='Stop';t=setInterval(paint,100);paint()})" +
    "rs.addEventListener('click',function(){clearInterval(t);run=false;acc=0;go.textContent='Start';paint()})" +
    "paint()";
  return out(c, html, js);
}

/* 23 — word of the day */
export function wordOfTheDay(c: WidgetConfig) {
  const html = '<dl class="plk-out"><dt id="plk-d" style="font-size:20px;font-weight:650;color:var(--w-ink)">—</dd><dd id="plk-o1" style="font-size:13.5px;line-height:1.6;font-weight:400">—</dd></dl>';
  const words: Array<[string, string]> = [
    ["petrichor", "The pleasant, earthy smell after rain falls on dry ground."],
    ["apricity", "The warmth of the sun in winter."],
    ["sesquipedalian", "Given to using long words."],
    ["defenestrate", "To throw something out of a window."],
    ["ineluctable", "Impossible to avoid."],
    ["redamancy", "Loving someone who loves you back."],
    ["novaturient", "Wanting to change your life."],
    ["sillage", "The scent trail left behind."],
    ["clinquant", "Glittering with gold or tinsel."],
    ["susurrus", "A soft rustling or whispering sound."],
    ["ephemeral", "Lasting a very short time."],
    ["quiddity", "The essential nature of something."],
  ];
  const js =
    "var list=" + JSON.stringify(words) + ";" +
    "var day=Math.floor(Date.now()/86400000)%list.length;" +
    "shadow.getElementById('plk-d').textContent=list[day][0];" +
    "shadow.getElementById('plk-o1').textContent=list[day][1]";
  return out(c, html, js);
}

/* 24 — quote of the day */
export function quoteOfTheDay(c: WidgetConfig) {
  const html = '<blockquote class="plk-out" style="font-size:16px;line-height:1.6;margin:0"><span id="plk-o1">—</span><footer id="plk-o2" style="margin-top:10px;font-size:12.5px;color:var(--w-muted)">—</footer></blockquote>';
  const quotes: Array<[string, string]> = [
    ["Simplicity is the ultimate sophistication.", "Leonardo da Vinci"],
    ["Make it work, make it right, make it fast.", "Kent Beck"],
    ["Perfection is achieved when there is nothing left to take away.", "Antoine de Saint-Exupéry"],
    ["Design is not just what it looks like. Design is how it works.", "Steve Jobs"],
    ["Simplicity is about subtracting the obvious and adding the meaningful.", "John Maeda"],
    ["The details are not the details. They make the design.", "Charles Eames"],
    ["Weeks of coding can save you hours of planning.", "Unknown"],
    ["Any sufficiently advanced technology is indistinguishable from magic.", "Arthur C. Clarke"],
  ];
  const js =
    "var list=" + JSON.stringify(quotes) + ";" +
    "var day=Math.floor(Date.now()/86400000)%list.length;" +
    "shadow.getElementById('plk-o1').textContent='“'+list[day][0]+'”';" +
    "shadow.getElementById('plk-o2').textContent='— '+list[day][1]";
  return out(c, html, js);
}

/* 25 — yes / no decider */
export function yesNoDecider(c: WidgetConfig) {
  const html = '<dl class="plk-out"><dt>The answer</dt><dd id="plk-o1" class="plk-big" style="color:var(--w-accent)">Ask…</dd></dl>' +
    '<div class="plk-center"><button type="button" class="plk-btn" id="plk-go">Decide</button></div>';
  const js = "var go=shadow.getElementById('plk-go'),d=shadow.getElementById('plk-o1');" +
    "var answers=['Yes.','No.','Absolutely.','Not today.','100% yes.','Hard no.','Ask again tomorrow.','Without a doubt.'];" +
    "go.addEventListener('click',function(){var i=0;go.textContent='…';" +
    "var t=setInterval(function(){d.textContent=answers[Math.floor(Math.random()*answers.length)];" +
    "if(++i>8){clearInterval(t);go.textContent='Decide'}},110)})";
  return out(c, html, js);
}

/* 26 — ISO week number of a date */
export function weekNumberCalculator(c: WidgetConfig) {
  const html = fieldRow("Pick a date", '<input type="date" name="d" required>') +
    '<dl class="plk-out"><dt>ISO week number</dt><dd id="plk-o1">—</dd></dl>';
  const js = "var f=shadow.getElementById('plk-f');" +
    "function calc(){if(!f.d.value)return;" +
    "var d=new Date(f.d.value+'T00:00:00');var day=(d.getDay()+6)%7;d.setDate(d.getDate()-day+3);" +
    "var firstThursday=new Date(d.getFullYear(),0,4);var diff=d-firstThursday;" +
    "var wk=1+Math.round(diff/(7*86400000));" +
    "shadow.getElementById('plk-o1').textContent='Week '+wk+' of '+d.getFullYear()}calc()";
  return out(c, html, js);
}
