import { baseCss } from "../base";
import type { WidgetConfig } from "../types";
import { PLAY_CSS, TOOL_CSS, fieldRow, jsAudio, toolShell } from "./kit";

/* 20 more interactive tools — sound rooms, timers, outdoor and kitchen math. */

type R = (c: WidgetConfig) => { html: string; css: string; js?: string };

const css = (c: WidgetConfig) => baseCss(c, TOOL_CSS + PLAY_CSS);
const mk = (id: string, name: string, cat: string, blurb: string, render: R) =>
  ({ id, name, cat, blurb, render });

/* ---- White noise ---- */
const whiteNoise = mk("white-noise", "White noise", "fun", "A soft curtain of sound for focus or sleep.", (c) => {
  const html =
    fieldRow("Volume", '<input type="range" class="plk-range" name="v" min="0" max="100" value="30">') +
    '<div class="plk-btnrow"><button type="button" class="plk-btn2 pri" id="plk-on">Play</button><button type="button" class="plk-btn2" id="plk-off">Stop</button></div>' +
    '<div class="plk-status">Works offline once loaded. Nothing is recorded.</div>';
  const js = jsAudio() +
    "var src=null,g=null;" +
    "function start(){if(src)return;var a=ACc(),len=2*a.sampleRate,b=a.createBuffer(1,len,a.sampleRate),ch=b.getChannelData(0);" +
    "for(var i=0;i<len;i++)ch[i]=Math.random()*2-1;src=a.createBufferSource();src.buffer=b;src.loop=true;" +
    "g=a.createGain();g.gain.value=(+shadow.getElementById('plk-f').v.value)/100*0.5;" +
    "src.connect(g);g.connect(a.destination);src.start()}" +
    "shadow.getElementById('plk-f').v.addEventListener('input',function(){if(g)g.gain.value=(+shadow.getElementById('plk-f').v.value)/100*0.5});" +
    "shadow.getElementById('plk-on').addEventListener('click',start);" +
    "shadow.getElementById('plk-off').addEventListener('click',function(){if(src){src.stop();src=null}})";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Brown noise ---- */
const brownNoise = mk("brown-noise", "Brown noise", "fun", "Deeper and warmer than white — rain on a roof.", (c) => {
  const html =
    fieldRow("Volume", '<input type="range" class="plk-range" name="v" min="0" max="100" value="40">') +
    '<div class="plk-btnrow"><button type="button" class="plk-btn2 pri" id="plk-on">Play</button><button type="button" class="plk-btn2" id="plk-off">Stop</button></div>' +
    '<div class="plk-status">Brown noise falls in energy as frequency rises — easier on the ears.</div>';
  const js = jsAudio() +
    "var src=null,g=null;" +
    "function start(){if(src)return;var a=ACc(),len=4*a.sampleRate,b=a.createBuffer(1,len,a.sampleRate),ch=b.getChannelData(0),l=0;" +
    "for(var i=0;i<len;i++){var w=Math.random()*2-1;l=(l+0.02*w)/1.02;ch[i]=l*3.5}src=a.createBufferSource();src.buffer=b;src.loop=true;" +
    "g=a.createGain();g.gain.value=(+shadow.getElementById('plk-f').v.value)/100*0.6;" +
    "src.connect(g);g.connect(a.destination);src.start()}" +
    "shadow.getElementById('plk-f').v.addEventListener('input',function(){if(g)g.gain.value=(+shadow.getElementById('plk-f').v.value)/100*0.6});" +
    "shadow.getElementById('plk-on').addEventListener('click',start);" +
    "shadow.getElementById('plk-off').addEventListener('click',function(){if(src){src.stop();src=null}})";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Chord player ---- */
const chordPlayer = mk("chord-player", "Chord player", "fun", "Hear major and minor triads in any key.", (c) => {
  const keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const html =
    fieldRow("Key", '<select name="k">' + keys.map((k, i) => `<option value="${i}">${k}</option>`).join("") + "</select>") +
    '<div class="plk-btnrow"><button type="button" class="plk-btn2 pri" id="plk-maj">Major</button><button type="button" class="plk-btn2" id="plk-min">Minor</button></div>' +
    '<div class="plk-status">A triad is three notes — root, third and fifth.</div>';
  const js = jsAudio() +
    "var base=261.63;shadow.getElementById('plk-f').k.addEventListener('change',function(){base=261.63*Math.pow(2,(+shadow.getElementById('plk-f').k.value)/12)});" +
    "function triad(m){[0,m?3:4,7].forEach(function(s,i){setTimeout(function(){tone(base*Math.pow(2,s/12),0.9,'triangle',0.15)},i*60)})}" +
    "shadow.getElementById('plk-maj').addEventListener('click',function(){triad(false)});" +
    "shadow.getElementById('plk-min').addEventListener('click',function(){triad(true)})";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Interval quiz ---- */
const intervalQuiz = mk("interval-quiz", "Ear training", "fun", "Two notes — name the distance between them.", (c) => {
  const names = ["Unison", "Minor 3rd", "Major 3rd", "Perfect 4th", "Perfect 5th", "Octave"];
  const semis = [0, 3, 4, 5, 7, 12];
  const html =
    '<div class="plk-btnrow"><button type="button" class="plk-btn2 pri" id="plk-play">Play interval</button></div>' +
    '<div class="plk-padgrid" style="grid-template-columns:repeat(3,1fr)">' +
    names.map((n, i) => `<button type="button" class="plk-pad" data-i="${i}">${n}</button>`).join("") +
    '</div><div class="plk-status" id="plk-st">Score <b id="plk-ok">0</b> of <b id="plk-all">0</b></div>';
  const js = jsAudio() +
    "var names_L=" + JSON.stringify(names) + ",semis_L=" + JSON.stringify(semis) + ";" +
    "var ans=0,ok2=0,n=0,st=shadow.getElementById('plk-st');" +
    "function up(){st.innerHTML='Score <b>'+ok2+'</b> of <b>'+n+'</b>'}" +
    "function playRound(){ans=Math.floor(Math.random()*names_L.length);" +
    "var base=220*Math.pow(2,Math.floor(Math.random()*12)/12);tone(base,0.5,'triangle',0.2);" +
    "setTimeout(function(){tone(base*Math.pow(2,semis_L[ans]/12),0.6,'triangle',0.2)},550)}" +
    "shadow.getElementById('plk-play').addEventListener('click',playRound);" +
    "shadow.querySelectorAll('.plk-pad').forEach(function(b){b.addEventListener('click',function(){n++;" +
    "if(+b.dataset.i===ans)ok2++;up();setTimeout(playRound,800)})});up();";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- BPM tap ---- */
const bpmTap = mk("bpm-tap", "Tap tempo", "utility", "Tap along with the music to find its BPM.", (c) => {
  const html =
    '<div class="plk-big" id="plk-bpm">—</div>' +
    '<div class="plk-btnrow"><button type="button" class="plk-btn2 pri" id="plk-tap">Tap</button><button type="button" class="plk-btn2" id="plk-reset">Reset</button></div>' +
    '<div class="plk-status" id="plk-st">Tap 4+ times for a steady reading.</div>';
  const js =
    "var taps=[],el=shadow.getElementById('plk-bpm'),st=shadow.getElementById('plk-st'),lastClick=0;" +
    "shadow.getElementById('plk-tap').addEventListener('click',function(){var now=Date.now();" +
    "if(now-lastClick>2200)taps=[];lastClick=now;taps.push(now);if(taps.length>12)taps.shift();" +
    "if(taps.length>=4){var iv=[];for(var i=1;i<taps.length;i++)iv.push(taps[i]-taps[i-1]);" +
    "iv.sort(function(a,b){return a-b});iv=iv.slice(Math.floor(iv.length/4),Math.ceil(iv.length*3/4));" +
    "var avg=iv.reduce(function(a,b){return a+b},0)/iv.length;" +
    "el.innerHTML=Math.round(60000/avg)+' <span style=\"font-size:20px;color:var(--w-muted)\">BPM</span>';" +
    "st.textContent=taps.length+' taps recorded'}else st.textContent=(4-taps.length)+' more taps'})" +
    ";shadow.getElementById('plk-reset').addEventListener('click',function(){taps=[];el.textContent='—';st.textContent='Ready.'})";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Drum pad ---- */
const drumPad = mk("drum-pad", "Drum pad", "fun", "Six synthesized drums — tap or use your keyboard.", (c) => {
  const pads = ["Kick", "Snare", "Hat", "Tom", "Clap", "Cowbell"];
  const keys = ["A", "S", "D", "F", "G", "H"];
  const html = '<div class="plk-padgrid" style="grid-template-columns:repeat(3,1fr)">' +
    pads.map((p, i) => `<button type="button" class="plk-pad" data-i="${i}">${p}<br><small style="color:var(--w-muted)">${keys[i]}</small></button>`).join("") +
    "</div>";
  const js = jsAudio() +
    "function noise(d){var a=ACc(),len=a.sampleRate*d,b=a.createBuffer(1,len,a.sampleRate),ch=b.getChannelData(0);" +
    "for(var i=0;i<len;i++)ch[i]=(Math.random()*2-1)*(1-i/len);var s=a.createBufferSource();s.buffer=b;return s}" +
    "function hit(i){var a=ACc();" +
    "if(i===0){var o=a.createOscillator(),g=a.createGain();o.frequency.setValueAtTime(160,a.currentTime);o.frequency.exponentialRampToValueAtTime(42,a.currentTime+0.14);g.gain.setValueAtTime(0.55,a.currentTime);g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+0.28);o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+0.3)}" +
    "else if(i===5){[540,800].forEach(function(f){var o=a.createOscillator(),g=a.createGain();o.type='square';o.frequency.value=f;g.gain.setValueAtTime(0.12,a.currentTime);g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+0.25);o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+0.26)})}" +
    "else{var s=noise(i===1?0.16:i===3?0.3:0.07),g2=a.createGain(),f2=a.createBiquadFilter();" +
    "f2.type=i===2?'highpass':'bandpass';f2.frequency.value=i===2?8000:i===1?1800:i===3?400:1200;" +
    "g2.gain.value=i===2?0.25:0.4;s.connect(f2);f2.connect(g2);g2.connect(a.destination);s.start()}}" +
    "shadow.querySelectorAll('.plk-pad').forEach(function(p){p.addEventListener('click',function(){hit(+p.dataset.i)})});" +
    "document.addEventListener('keydown',function(e){var i=" + JSON.stringify(keys) + ".indexOf(e.key.toUpperCase());if(i>=0)hit(i)})";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Anniversary ---- */
const anniversaryCalc = mk("anniversary-calculator", "Anniversary countdown", "tools", "Days until the next yearly date.", (c) => {
  const html =
    fieldRow("Your date", '<input type="date" name="d" required>') +
    '<dl class="plk-out"><dt>Next anniversary</dt><dd id="plk-o1" style="font-size:19px">—</dd><dt>That makes it</dt><dd id="plk-o2" style="font-size:19px">—</dd></dl>';
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function calc(){if(!f.d.value)return;var d=new Date(f.d.value+'T00:00:00'),now=new Date();" +
    "var next=new Date(now.getFullYear(),d.getMonth(),d.getDate());" +
    "if(next<now)next=new Date(now.getFullYear()+1,d.getMonth(),d.getDate());" +
    "var days=Math.ceil((next-now)/86400000);" +
    "shadow.getElementById('plk-o1').textContent=next.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'});" +
    "shadow.getElementById('plk-o2').textContent=days===0?'Today':days+' days'}" +
    "f.d.addEventListener('input',calc)";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Work weeks left ---- */
const workWeeksLeft = mk("work-weeks-left", "Weeks until a date", "tools", "The honest number of weeks remaining.", (c) => {
  const html =
    fieldRow("Until", '<input type="date" name="d" required>') +
    '<dl class="plk-out"><dt>Weeks left</dt><dd id="plk-o1">—</dd><dt>Weekdays left</dt><dd id="plk-o2">—</dd></dl>';
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function calc(){if(!f.d.value)return;var t=new Date(f.d.value+'T00:00:00'),now=new Date();now.setHours(0,0,0,0);" +
    "var days=Math.round((t-now)/86400000);if(days<0){shadow.getElementById('plk-o1').textContent='—';return}" +
    "var wd=0,cur=new Date(now);for(var i=0;i<days;i++){cur.setDate(cur.getDate()+1);var w=cur.getDay();if(w!==0&&w!==6)wd++}" +
    "shadow.getElementById('plk-o1').textContent=Math.floor(days/7);shadow.getElementById('plk-o2').textContent=wd}" +
    "f.d.addEventListener('input',calc)";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Hike time ---- */
const hikeTime = mk("hike-time-calculator", "Hike time", "tools", "Naismith's rule with terrain and rests.", (c) => {
  const html =
    fieldRow("Distance (km)", '<input type="number" name="d" value="12" step="0.5" required>') +
    fieldRow("Elevation gain (m)", '<input type="number" name="e" value="600" step="10" required>') +
    fieldRow("Rest minutes", '<input type="number" name="r" value="20" min="0" step="5">') +
    '<dl class="plk-out"><dt>Total time</dt><dd id="plk-o1">—</dd><dt>Average speed</dt><dd id="plk-o2">—</dd></dl>';
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function calc(){var t=f.d.value/5+f.e.value/600+f.r.value/60;if(!t)return;" +
    "var h=Math.floor(t),m=Math.round((t-h)*60);if(m===60){h++;m=0}" +
    "shadow.getElementById('plk-o1').textContent=h+' h '+(m?m+' min':'');" +
    "shadow.getElementById('plk-o2').textContent=(f.d.value/t).toFixed(1)+' km/h'}" +
    "f.addEventListener('input',calc)";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Backpack weight ---- */
const backpackWeight = mk("backpack-weight-calculator", "Backpack weight", "tools", "Pack weight as a percent of body weight.", (c) => {
  const html =
    fieldRow("Body weight (kg)", '<input type="number" name="b" value="70" required>') +
    fieldRow("Base pack (kg)", '<input type="number" name="p" value="8" step="0.5" required>') +
    fieldRow("Food + water (kg)", '<input type="number" name="c" value="3" step="0.5" required>') +
    '<dl class="plk-out"><dt>Total</dt><dd id="plk-o1">—</dd><dt>% of body weight</dt><dd id="plk-o2">—</dd></dl>';
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function calc(){var t=(+f.p.value||0)+(+f.c.value||0),b=+f.b.value;if(!t||!b)return;" +
    "var pc=t/b*100;shadow.getElementById('plk-o1').textContent=t.toFixed(1)+' kg';" +
    "shadow.getElementById('plk-o2').textContent=pc.toFixed(0)+'% — '+(pc<15?'comfortable':pc<25?'a solid load':'heavy — training territory')}" +
    "f.addEventListener('input',calc)";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Water for a hike ---- */
const waterForHike = mk("water-for-hike-calculator", "Water for a hike", "tools", "Liters to carry for heat and effort.", (c) => {
  const html =
    fieldRow("Hours out", '<input type="number" name="h" value="4" step="0.5" required>') +
    fieldRow("Temperature °C", '<input type="number" name="t" value="20" required>') +
    '<dl class="plk-out"><dt>Water to carry</dt><dd id="plk-o1">—</dd><dt>Bottle refills (0.75 L)</dt><dd id="plk-o2">—</dd></dl>';
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function calc(){var r=0.5+Math.max(0,+f.t.value-20)*0.025,need=r*(+f.h.value||0);if(!need)return;" +
    "shadow.getElementById('plk-o1').textContent=need.toFixed(1)+' L';" +
    "shadow.getElementById('plk-o2').textContent=Math.ceil(need/0.75)}" +
    "f.addEventListener('input',calc)";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Pasta portion ---- */
const pastaPortion = mk("pasta-portion-calculator", "Pasta portions", "tools", "Dry grams for the mouths at the table.", (c) => {
  const html =
    fieldRow("People", '<input type="number" name="p" value="4" min="1" required>') +
    fieldRow("Appetite", '<select name="a"><option value="80">Light (80 g)</option><option value="100" selected>Regular (100 g)</option><option value="125">Hungry (125 g)</option></select>') +
    '<dl class="plk-out"><dt>Dry pasta</dt><dd id="plk-o1">—</dd><dt>Sauce (rule of thumb)</dt><dd id="plk-o2">—</dd></dl>';
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function calc(){var g=(+f.p.value||0)*(+f.a.value||0);if(!g)return;" +
    "shadow.getElementById('plk-o1').textContent=g+' g';" +
    "shadow.getElementById('plk-o2').textContent=Math.round(g*0.7)+' g'}" +
    "f.addEventListener('input',calc)";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Tea timer ---- */
const teaTimer = mk("tea-timer", "Tea timer", "tools", "Steep times by tea, with a countdown.", (c) => {
  const teas: [string, number][] = [["Green", 120], ["Black", 240], ["Oolong", 180], ["Herbal", 300], ["White", 150]];
  const html =
    fieldRow("Tea", '<select name="t">' + teas.map((t, i) => `<option value="${i}">${t[0]} — ${t[1] / 60} min</option>`).join("") + "</select>") +
    '<div class="plk-big" id="plk-cd">0:00</div>' +
    '<div class="plk-btnrow"><button type="button" class="plk-btn2 pri" id="plk-go">Start</button><button type="button" class="plk-btn2" id="plk-stop">Stop</button></div>';
  const js = jsAudio() +
    "var teas=" + JSON.stringify(teas) + ",end=null,tick=null,cd=shadow.getElementById('plk-cd');" +
    "function fmt(s){s=Math.max(0,Math.ceil(s));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}" +
    "function set(){var t=teas[+shadow.getElementById('plk-f').t.value];if(!end)cd.textContent=fmt(t[1])}" +
    "shadow.getElementById('plk-f').t.addEventListener('change',set);" +
    "shadow.getElementById('plk-go').addEventListener('click',function(){var t=teas[+shadow.getElementById('plk-f').t.value];" +
    "end=Date.now()+t[1]*1000;clearInterval(tick);tick=setInterval(function(){var s=(end-Date.now())/1000;" +
    "cd.textContent=fmt(s);if(s<=0){clearInterval(tick);cd.textContent='Done';tone(880,0.4);setTimeout(function(){tone(660,0.5)},450);end=null}},250)});" +
    "shadow.getElementById('plk-stop').addEventListener('click',function(){clearInterval(tick);end=null;set()});set()";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Pizza dough ---- */
const pizzaDough = mk("pizza-dough-calculator", "Pizza dough", "tools", "Baker's percentages for N balls.", (c) => {
  const html =
    fieldRow("Balls", '<input type="number" name="n" value="4" min="1" required>') +
    fieldRow("Ball weight (g)", '<input type="number" name="w" value="250" min="100" required>') +
    fieldRow("Hydration %", '<input type="number" name="h" value="65" min="50" max="90" required>') +
    '<dl class="plk-out"><dt>Flour</dt><dd id="plk-o1">—</dd><dt>Water / salt / yeast</dt><dd id="plk-o2" style="font-size:16px">—</dd></dl>';
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function calc(){var fl=(+f.n.value||0)*(+f.w.value||0)/(1+(+f.h.value||0)/100+0.02+0.001);if(!fl)return;" +
    "var w=fl*(+f.h.value||0)/100;" +
    "shadow.getElementById('plk-o1').textContent=Math.round(fl)+' g';" +
    "shadow.getElementById('plk-o2').textContent=Math.round(w)+' g · '+Math.round(fl*0.02)+' g · '+Math.round(fl*0.001*100)/100+' g (dry)'}" +
    "f.addEventListener('input',calc)";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Roast timer ---- */
const roastTimer = mk("roast-timer-calculator", "Roast calculator", "tools", "Oven minutes per cut and weight.", (c) => {
  const html =
    fieldRow("Cut", '<select name="cut"><option value="25">Chicken (25 min/500 g)</option><option value="35">Pork (35 min/500 g)</option><option value="45">Beef, well done (45 min/500 g)</option><option value="30">Lamb (30 min/500 g)</option></select>') +
    fieldRow("Weight (kg)", '<input type="number" name="w" value="1.5" step="0.1" required>') +
    '<dl class="plk-out"><dt>Oven time (180 °C)</dt><dd id="plk-o1">—</dd><dt>Plus resting</dt><dd id="plk-o2">—</dd></dl>';
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function calc(){var m=(+f.cut.value||0)*(+f.w.value||0)*2;if(!m)return;" +
    "var h=Math.floor(m/60);shadow.getElementById('plk-o1').textContent=(h?h+' h ':'')+Math.round(m%60)+' min';" +
    "shadow.getElementById('plk-o2').textContent=Math.max(10,Math.round(+f.w.value*10))+' min'}" +
    "f.addEventListener('input',calc)";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Plank timer ---- */
const plankTimer = mk("plank-timer", "Plank timer", "tools", "A 60-second hold with countdown ticks.", (c) => {
  const html =
    fieldRow("Hold (seconds)", '<input type="number" name="s" value="60" min="10" max="300" step="5">') +
    '<div class="plk-big" id="plk-cd">—</div>' +
    '<div class="plk-btnrow"><button type="button" class="plk-btn2 pri" id="plk-go">Start</button><button type="button" class="plk-btn2" id="plk-stop">Stop</button></div>';
  const js = jsAudio() +
    "var end=null,tick=null,cd=shadow.getElementById('plk-cd'),f=shadow.getElementById('plk-f'),lastShown=null;" +
    "function stop(){clearInterval(tick);end=null;lastShown=null}" +
    "shadow.getElementById('plk-go').addEventListener('click',function(){var s=+f.s.value||60;stop();" +
    "cd.textContent=s;lastShown=s;end=Date.now()+s*1000;tick=setInterval(function(){var left=Math.ceil((end-Date.now())/1000);" +
    "if(left!==lastShown){lastShown=left;cd.textContent=Math.max(0,left);if(left<=3&&left>0)tone(700,0.1)}" +
    "if(left<=0){stop();cd.textContent='Done';tone(880,0.5)}},100)});" +
    "shadow.getElementById('plk-stop').addEventListener('click',function(){stop();cd.textContent='—'})";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Random letter ---- */
const randomLetter = mk("random-letter", "Random letter", "fun", "One letter, A to Z, no repeats until reset.", (c) => {
  const html =
    '<div class="plk-big" id="plk-l">?</div>' +
    '<div class="plk-btnrow"><button type="button" class="plk-btn2 pri" id="plk-go">Draw</button><button type="button" class="plk-btn2" id="plk-reset">Reset</button></div>' +
    '<div class="plk-status" id="plk-st">26 letters in the hat.</div>';
  const js =
    "var pool='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),el=shadow.getElementById('plk-l'),st=shadow.getElementById('plk-st');" +
    "shadow.getElementById('plk-go').addEventListener('click',function(){if(!pool.length){st.textContent='The hat is empty — reset to refill.';return}" +
    "var i=Math.floor(Math.random()*pool.length);el.textContent=pool.splice(i,1)[0];" +
    "st.textContent=pool.length+' letters left in the hat'});" +
    "shadow.getElementById('plk-reset').addEventListener('click',function(){pool='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');el.textContent='?';st.textContent='26 letters in the hat.'})";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Number facts ---- */
const numberFacts = mk("number-facts", "Number facts", "fun", "Square, root, binary, hex and primality.", (c) => {
  const html =
    fieldRow("Any whole number", '<input type="number" name="n" value="42" min="0" step="1" required>') +
    '<dl class="plk-out"><dt>Square · square root</dt><dd id="plk-o1" style="font-size:17px">—</dd><dt>Binary · hex</dt><dd id="plk-o2" style="font-size:17px">—</dd><dt>Prime?</dt><dd id="plk-o3" style="font-size:17px">—</dd></dl>';
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function prime(n){if(n<2)return false;for(var i=2;i*i<=n;i++)if(n%i===0)return false;return true}" +
    "function calc(){var n=Math.floor(+f.n.value);if(n<0||isNaN(n))return;" +
    "shadow.getElementById('plk-o1').textContent=n*n+' · '+(Math.sqrt(n)%1?Math.sqrt(n).toFixed(3):Math.sqrt(n));" +
    "shadow.getElementById('plk-o2').textContent=n.toString(2)+' · 0x'+n.toString(16).toUpperCase();" +
    "shadow.getElementById('plk-o3').textContent=n<2?'No':prime(n)?'Yes — prime':'No'}" +
    "f.addEventListener('input',calc)";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Morse practice ---- */
const morsePractice = mk("morse-practice", "Morse practice", "fun", "See the code, name the letter.", (c) => {
  const M = { A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--.." };
  const html =
    '<div class="plk-big" id="plk-code" style="letter-spacing:0.15em">·····</div>' +
    fieldRow("Which letter is this?", '<input type="text" name="a" maxlength="1" placeholder="A–Z" autocomplete="off">') +
    '<div class="plk-btnrow"><button type="button" class="plk-btn2 pri" id="plk-check">Check</button><button type="button" class="plk-btn2" id="plk-skip">Skip</button></div>' +
    '<div class="plk-status" id="plk-st">Score <b id="plk-ok">0</b> of <b id="plk-all">0</b></div>';
  const ks = Object.keys(M);
  const js =
    "var M=" + JSON.stringify(M) + ",ks=" + JSON.stringify(ks) + ",cur='',ok2=0,all=0,st=shadow.getElementById('plk-st');" +
    "function up(){st.innerHTML='Score <b>'+ok2+'</b> of <b>'+all+'</b>'}" +
    "function next(){cur=ks[Math.floor(Math.random()*ks.length)];shadow.getElementById('plk-code').textContent=M[cur];shadow.getElementById('plk-f').a.value=''}" +
    "shadow.getElementById('plk-check').addEventListener('click',function(){var v=shadow.getElementById('plk-f').a.value.trim().toUpperCase();if(!v)return;" +
    "all++;if(v===cur)ok2++;up();next()});" +
    "shadow.getElementById('plk-skip').addEventListener('click',function(){all++;up();next()});next()";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Dice probability ---- */
const diceProbability = mk("dice-probability-calculator", "Two-dice odds", "tools", "Chance of any sum with two dice.", (c) => {
  const html =
    fieldRow("Target sum (2–12)", '<input type="number" name="s" value="7" min="2" max="12" required>') +
    '<dl class="plk-out"><dt>Probability</dt><dd id="plk-o1">—</dd><dt>Odds</dt><dd id="plk-o2">—</dd></dl>';
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function calc(){var s=+f.s.value;if(s<2||s>12)return;" +
    "var ways=0;for(var a=1;a<=6;a++)for(var b=1;b<=6;b++)if(a+b===s)ways++;" +
    "shadow.getElementById('plk-o1').textContent=(ways/36*100).toFixed(1)+'%';" +
    "shadow.getElementById('plk-o2').textContent=ways+' in 36'}" +
    "f.addEventListener('input',calc)";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ------------------------------------------------------------ exports */
const list: { id: string; name: string; cat: string; blurb: string; render: R }[] = [
  whiteNoise, brownNoise, chordPlayer, intervalQuiz, bpmTap,
  drumPad, anniversaryCalc, workWeeksLeft, hikeTime, backpackWeight,
  waterForHike, pastaPortion, teaTimer, pizzaDough, roastTimer,
  plankTimer, randomLetter, numberFacts, morsePractice, diceProbability,
];

export const renderersPlayB: Record<string, R> = Object.fromEntries(list.map((w) => [w.id, w.render]));
export const metaPlayB = list.map((w) => ({ id: w.id, name: w.name, cat: w.cat, blurb: w.blurb }));
