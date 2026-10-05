import { baseCss } from "../base";
import type { WidgetConfig } from "../types";
import { PLAY_CSS, TOOL_CSS, fieldRow, jsAudio, toolShell } from "./kit";

/* 20 interactive tools — counters, timers, mini-games, text utilities.
   Hand-written per widget; all JS runs inside the widget shadow root. */

type R = (c: WidgetConfig) => { html: string; css: string; js?: string };

const css = (c: WidgetConfig) => baseCss(c, TOOL_CSS + PLAY_CSS);
const mk = (id: string, name: string, cat: string, blurb: string, render: R) =>
  ({ id, name, cat, blurb, render });

/* ---- Tally counter ---- */
const tallyCounter = mk("tally-counter", "Tally counter", "utility", "Tap to count anything — reps, guests, laps.", (c) => {
  const html =
    '<div class="plk-big" id="plk-n">0</div><div class="plk-btnrow">' +
    '<button type="button" class="plk-btn2" data-d="-1">−1</button>' +
    '<button type="button" class="plk-btn2 pri" data-d="1">+1</button>' +
    '<button type="button" class="plk-btn2" id="plk-r">Reset</button></div>';
  const js =
    "var n=0,el=shadow.getElementById('plk-n');" +
    "shadow.querySelectorAll('[data-d]').forEach(function(b){b.addEventListener('click',function(){n=Math.max(0,n+ +b.dataset.d);el.textContent=n})});" +
    "shadow.getElementById('plk-r').addEventListener('click',function(){n=0;el.textContent='0'})";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Tone generator ---- */
const toneGenerator = mk("tone-generator", "Tone generator", "fun", "A clean sine tone at any frequency.", (c) => {
  const html =
    fieldRow("Frequency", '<input type="range" class="plk-range" name="f" min="40" max="2000" value="440"><span class="plk-lab plk-center" id="plk-v">440 Hz</span>') +
    '<div class="plk-btnrow"><button type="button" class="plk-btn2 pri" id="plk-on">Play</button>' +
    '<button type="button" class="plk-btn2" id="plk-off">Stop</button></div>';
  const js = jsAudio() +
    "var f=shadow.getElementById('plk-f'),os=null;" +
    "f.f.addEventListener('input',function(){shadow.getElementById('plk-v').textContent=f.f.value+' Hz';if(os)os.frequency.value=+f.f.value});" +
    "shadow.getElementById('plk-on').addEventListener('click',function(){var a=ACc();if(!os){os=a.createOscillator();var g=a.createGain();g.gain.value=0.12;os.frequency.value=+f.f.value;os.connect(g);g.connect(a.destination);os.start()}});" +
    "shadow.getElementById('plk-off').addEventListener('click',function(){if(os){os.stop();os.disconnect();os=null}})";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Drum machine ---- */
const drumMachine = mk("drum-machine", "Drum machine", "fun", "Four synthesized pads — kick, snare, hat, clap.", (c) => {
  const html = '<div class="plk-padgrid" style="grid-template-columns:repeat(2,1fr)">' +
    ["Kick", "Snare", "Hat", "Clap"].map((s) => `<button type="button" class="plk-pad" data-s="${s}">${s}</button>`).join("") +
    "</div>";
  const js = jsAudio() +
    "function noise(d){var a=ACc(),len=a.sampleRate*d,b=a.createBuffer(1,len,a.sampleRate),ch=b.getChannelData(0);" +
    "for(var i=0;i<len;i++)ch[i]=(Math.random()*2-1)*(1-i/len);var s=a.createBufferSource();s.buffer=b;return s}" +
    "function play(n){var a=ACc();" +
    "if(n==='Kick'){var o=a.createOscillator(),g=a.createGain();o.frequency.setValueAtTime(150,a.currentTime);o.frequency.exponentialRampToValueAtTime(45,a.currentTime+0.12);g.gain.setValueAtTime(0.5,a.currentTime);g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+0.25);o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+0.3)}" +
    "else if(n==='Hat'){var s=noise(0.06),f=a.createBiquadFilter();f.type='highpass';f.frequency.value=7000;var g=a.createGain();g.gain.value=0.25;s.connect(f);f.connect(g);g.connect(a.destination);s.start()}" +
    "else{var s2=noise(n==='Clap'?0.18:0.14),g2=a.createGain(),f2=a.createBiquadFilter();f2.type='bandpass';f2.frequency.value=n==='Clap'?1200:1800;g2.gain.value=n==='Clap'?0.5:0.35;s2.connect(f2);f2.connect(g2);g2.connect(a.destination);s2.start()}}" +
    "shadow.querySelectorAll('.plk-pad').forEach(function(p){p.addEventListener('click',function(){play(p.dataset.s)})})";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Piano keys ---- */
const pianoKeys = mk("piano-keys", "Piano keys", "fun", "One playable octave in your browser.", (c) => {
  const notes = ["C", "D", "E", "F", "G", "A", "B", "C²"];
  const freq = [261.6, 293.7, 329.6, 349.2, 392, 440, 493.9, 523.3];
  const html = '<div class="plk-padgrid" style="grid-template-columns:repeat(4,1fr)">' +
    notes.map((n, i) => `<button type="button" class="plk-pad" data-i="${i}">${n}</button>`).join("") + "</div>";
  const js = jsAudio() +
    "var fr=[" + freq.join(",") + "];" +
    "shadow.querySelectorAll('.plk-pad').forEach(function(p){p.addEventListener('click',function(){tone(fr[+p.dataset.i],0.5,'triangle',0.22)})})";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Decision wheel ---- */
const decisionWheel = mk("decision-wheel", "Decision picker", "fun", "Paste options, spin, get an answer.", (c) => {
  const html =
    fieldRow("Options (one per line)", '<textarea name="o" rows="4">Pizza&#10;Sushi&#10;Tacos&#10;Burgers</textarea>') +
    '<div class="plk-btnrow"><button type="button" class="plk-btn2 pri" id="plk-go">Pick one</button></div>' +
    '<div class="plk-status" id="plk-st">Ready when you are.</div>';
  const js =
    "var st=shadow.getElementById('plk-st');" +
    "shadow.getElementById('plk-go').addEventListener('click',function(){" +
    "var os=shadow.getElementById('plk-f').o.value.split('\\n').map(function(s){return s.trim()}).filter(Boolean);" +
    "if(os.length<2){st.textContent='Add at least two options.';return}" +
    "var i=0,steps=18+Math.floor(Math.random()*10),smooth=!matchMedia('(prefers-reduced-motion: reduce)').matches;" +
    "if(!smooth){st.textContent='→ '+os[Math.floor(Math.random()*os.length)];return}" +
    "var t=setInterval(function(){st.textContent='… '+os[i%os.length];i++;" +
    "if(i>steps){clearInterval(t);st.innerHTML='<b>'+os[Math.floor(Math.random()*os.length)]+'</b>'}},70)})";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Punch clock ---- */
const punchClock = mk("punch-clock", "Punch clock", "utility", "Clock in, clock out, see the total.", (c) => {
  const html =
    '<div class="plk-big" id="plk-el">00:00</div><div class="plk-btnrow">' +
    '<button type="button" class="plk-btn2 pri" id="plk-in">Clock in</button>' +
    '<button type="button" class="plk-btn2" id="plk-out">Clock out</button></div>' +
    '<div class="plk-status" id="plk-st">Not on the clock.</div>';
  const js =
    "var t0=null,tick=null,st=shadow.getElementById('plk-st'),el=shadow.getElementById('plk-el');" +
    "function fmt(ms){var s=Math.floor(ms/1000);return String(Math.floor(s/3600)).padStart(2,'0')+':'+String(Math.floor(s/60)%60).padStart(2,'0')}" +
    "shadow.getElementById('plk-in').addEventListener('click',function(){if(t0)return;t0=Date.now();st.innerHTML='On the clock since <b>'+new Date(t0).toLocaleTimeString()</b>';" +
    "tick=setInterval(function(){el.textContent=fmt(Date.now()-t0)},1000)});" +
    "shadow.getElementById('plk-out').addEventListener('click',function(){if(!t0)return;clearInterval(tick);el.textContent=fmt(Date.now()-t0);st.innerHTML='<b>'+el.textContent+'</b> logged. See you next time.';t0=null})";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Mood picker ---- */
const moodPicker = mk("mood-picker", "Mood picker", "fun", "How do you feel right now? One tap.", (c) => {
  const moods = ["Great", "Good", "Okay", "Low", "Rough"];
  const html = '<div class="plk-padgrid" style="grid-template-columns:repeat(5,1fr)">' +
    moods.map((m) => `<button type="button" class="plk-pad" data-m="${m}">${m}</button>`).join("") +
    '</div><div class="plk-status" id="plk-st">Tap a mood to log it.</div>';
  const js =
    "var st=shadow.getElementById('plk-st'),log={};var msgs={Great:'Wonderful — keep it going.',Good:'Nice. Steady day ahead.',Okay:'Fine is fine. Noted.',Low:'Noted. Be kind to yourself today.',Rough:'Sorry to hear it. This too passes.'};" +
    "shadow.querySelectorAll('.plk-pad').forEach(function(p){p.addEventListener('click',function(){var m=p.dataset.m;log[m]=(log[m]||0)+1;" +
    "st.innerHTML='<b>'+msgs[m]+'</b> Logged '+Object.keys(log).reduce(function(n,k){return n+log[k]},0)+' moods this visit.'})})";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Set counter ---- */
const setCounter = mk("set-counter", "Set counter", "tools", "Track rounds and reps between sets.", (c) => {
  const html =
    fieldRow("Reps per set", '<input type="number" name="r" value="10" min="1">') +
    '<div class="plk-score"><div><div class="n" id="plk-s">0</div><div class="l">Sets</div></div>' +
    '<div><div class="n" id="plk-t">0</div><div class="l">Total reps</div></div></div>' +
    '<div class="plk-btnrow"><button type="button" class="plk-btn2 pri" id="plk-done">Set done</button>' +
    '<button type="button" class="plk-btn2" id="plk-reset">Reset</button></div>';
  const js =
    "var s=0,f=shadow.getElementById('plk-f');" +
    "shadow.getElementById('plk-done').addEventListener('click',function(){s++;var r=(+f.r.value||0);" +
    "shadow.getElementById('plk-s').textContent=s;shadow.getElementById('plk-t').textContent=s*r});" +
    "shadow.getElementById('plk-reset').addEventListener('click',function(){s=0;shadow.getElementById('plk-s').textContent='0';shadow.getElementById('plk-t').textContent='0'})";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Two-player score ---- */
const twoPlayerScore = mk("two-player-score", "Two-player score", "fun", "Score keep for any head-to-head game.", (c) => {
  const html =
    '<div class="plk-score"><div><div class="n" id="plk-a">0</div><div class="l">Player A</div>' +
    '<div class="plk-btnrow" style="margin-top:10px"><button type="button" class="plk-btn2" data-p="a" data-d="-1">−</button><button type="button" class="plk-btn2" data-p="a" data-d="1">+</button></div></div>' +
    '<div><div class="n" id="plk-b">0</div><div class="l">Player B</div>' +
    '<div class="plk-btnrow" style="margin-top:10px"><button type="button" class="plk-btn2" data-p="b" data-d="-1">−</button><button type="button" class="plk-btn2" data-p="b" data-d="1">+</button></div></div></div>' +
    '<div class="plk-btnrow"><button type="button" class="plk-btn2" id="plk-reset">Reset match</button></div>';
  const js =
    "var sc={a:0,b:0};function up(){shadow.getElementById('plk-a').textContent=sc.a;shadow.getElementById('plk-b').textContent=sc.b}" +
    "shadow.querySelectorAll('[data-p]').forEach(function(b){b.addEventListener('click',function(){var p=b.dataset.p;sc[p]=Math.max(0,sc[p]+ +b.dataset.d);up()})});" +
    "shadow.getElementById('plk-reset').addEventListener('click',function(){sc={a:0,b:0};up()})";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Coin streak ---- */
const coinStreak = mk("coin-streak", "Coin streak", "fun", "Flip for heads — how long can you keep it up?", (c) => {
  const html =
    '<div class="plk-big" id="plk-side">—</div>' +
    '<div class="plk-btnrow"><button type="button" class="plk-btn2 pri" id="plk-flip">Flip</button><button type="button" class="plk-btn2" id="plk-reset">Reset</button></div>' +
    '<div class="plk-status" id="plk-st">Streak <b id="plk-c">0</b> · Best <b id="plk-b">0</b> · Flips <b id="plk-f">0</b></div>';
  const js =
    "var s=0,best=0,n=0,el=shadow.getElementById('plk-side');" +
    "shadow.getElementById('plk-flip').addEventListener('click',function(){n++;var h=Math.random()<0.5;" +
    "el.textContent=h?'Heads':'Tails';if(h){s++;best=Math.max(best,s)}else s=0;" +
    "shadow.getElementById('plk-c').textContent=s;shadow.getElementById('plk-b').textContent=best;shadow.getElementById('plk-f').textContent=n});" +
    "shadow.getElementById('plk-reset').addEventListener('click',function(){s=best=n=0;el.textContent='—';shadow.getElementById('plk-c').textContent='0';shadow.getElementById('plk-b').textContent='0';shadow.getElementById('plk-f').textContent='0'})";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Dice duel ---- */
const diceDuel = mk("dice-duel", "Dice duel", "fun", "Roll two dice — first to five round wins.", (c) => {
  const html =
    '<div class="plk-score"><div><div class="n" id="plk-da">·</div><div class="l">Player A</div></div>' +
    '<div><div class="n" id="plk-db">·</div><div class="l">Player B</div></div></div>' +
    '<div class="plk-btnrow"><button type="button" class="plk-btn2 pri" id="plk-roll">Roll</button><button type="button" class="plk-btn2" id="plk-new">New match</button></div>' +
    '<div class="plk-status" id="plk-st">First to 5 round wins takes the duel.</div>';
  const js =
    "var wa=0,wb=0,st=shadow.getElementById('plk-st');" +
    "function up(){shadow.getElementById('plk-da').textContent=wa;shadow.getElementById('plk-db').textContent=wb}" +
    "shadow.getElementById('plk-roll').addEventListener('click',function(){var a=1+Math.floor(Math.random()*6),b=1+Math.floor(Math.random()*6);" +
    "shadow.getElementById('plk-da').textContent=a;shadow.getElementById('plk-db').textContent=b;" +
    "if(a>b)wa++;else if(b>a)wb++;else{st.textContent='Tie round — roll again.';return}up();" +
    "if(wa>=5){st.textContent='<b>Player A wins the duel '+wa+'–'+wb+'</b>'}else if(wb>=5){st.textContent='<b>Player B wins the duel '+wb+'–'+wa+'</b>'}else{st.textContent='Score '+wa+'–'+wb}});" +
    "shadow.getElementById('plk-new').addEventListener('click',function(){wa=wb=0;up();st.textContent='Fresh match. First to 5.'})";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Number guess ---- */
const numberGuess = mk("number-guess", "Number guess", "fun", "I'm thinking of a number from 1 to 100.", (c) => {
  const html =
    fieldRow("Your guess", '<input type="number" name="g" min="1" max="100" placeholder="50">') +
    '<div class="plk-btnrow"><button type="button" class="plk-btn2 pri" id="plk-try">Guess</button><button type="button" class="plk-btn2" id="plk-new">New game</button></div>' +
    '<div class="plk-status" id="plk-st">Guess a number from 1 to 100.</div>';
  const js =
    "var secret=1+Math.floor(Math.random()*100),tries=0,st=shadow.getElementById('plk-st');" +
    "shadow.getElementById('plk-try').addEventListener('click',function(){var g=+shadow.getElementById('plk-f').g.value;if(!g)return;" +
    "tries++;if(g===secret){st.innerHTML='<b>'+g+' is right!</b> Solved in '+tries+' guesses.'}" +
    "else if(g<secret){st.textContent=g+' is too low. Try '+tries+'.'}else{st.textContent=g+' is too high. Try '+tries+'.'}});" +
    "shadow.getElementById('plk-new').addEventListener('click',function(){secret=1+Math.floor(Math.random()*100);tries=0;st.textContent='New number. Go.'})";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Memory letters ---- */
const memoryLetters = mk("memory-letters", "Memory letters", "fun", "Memorize the string, type it back.", (c) => {
  const html =
    '<div class="plk-big" id="plk-show">·····</div>' +
    fieldRow("Your answer", '<input type="text" name="a" placeholder="Type what you saw" autocomplete="off">') +
    '<div class="plk-btnrow"><button type="button" class="plk-btn2 pri" id="plk-new">Show me</button><button type="button" class="plk-btn2" id="plk-check">Check</button></div>' +
    '<div class="plk-status" id="plk-st">Level 1 — five letters.</div>';
  const js =
    "var cur='',lvl=1,show=shadow.getElementById('plk-show'),st=shadow.getElementById('plk-st');" +
    "function gen(n){var s='';for(var i=0;i<n;i++)s+='ABCDEFGHJKLMNPQRSTUVWXYZ'[Math.floor(Math.random()*24)];return s}" +
    "shadow.getElementById('plk-new').addEventListener('click',function(){cur=gen(4+lvl);show.textContent=cur;" +
    "st.textContent='Memorize it…';setTimeout(function(){show.textContent='·····'.slice(0,cur.length)},2600)});" +
    "shadow.getElementById('plk-check').addEventListener('click',function(){var v=shadow.getElementById('plk-f').a.value.trim().toUpperCase();" +
    "if(!cur)return;if(v===cur){lvl++;st.innerHTML='<b>Correct!</b> Level '+lvl+' — '+(3+lvl)+' letters.'}" +
    "else{st.innerHTML='<b>Not quite.</b> It was '+cur+'. Back to level 1.';lvl=1}})";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Speed tap ---- */
const speedTap = mk("speed-tap", "Speed tap", "fun", "How many taps in ten seconds?", (c) => {
  const html =
    '<div class="plk-big" id="plk-n">0</div>' +
    '<div class="plk-btnrow"><button type="button" class="plk-btn2 pri" id="plk-tap">Tap</button><button type="button" class="plk-btn2" id="plk-new">Restart</button></div>' +
    '<div class="plk-status" id="plk-st">Press Tap to start the ten seconds.</div>';
  const js =
    "var n=0,t0=null,timer=null,st=shadow.getElementById('plk-st'),el=shadow.getElementById('plk-n');" +
    "shadow.getElementById('plk-tap').addEventListener('click',function(){n++;el.textContent=n;" +
    "if(!t0){t0=Date.now();timer=setInterval(function(){var left=10-Math.floor((Date.now()-t0)/1000);" +
    "if(left<=0){clearInterval(timer);st.innerHTML='<b>'+n+' taps</b> — '+(n/10).toFixed(1)+' per second.';t0=null;n=0}else{st.textContent=left+' seconds left'}},250)}});" +
    "shadow.getElementById('plk-new').addEventListener('click',function(){clearInterval(timer);n=0;t0=null;el.textContent='0';st.textContent='Fresh round. Ten seconds.'})";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- RGB guesser ---- */
const rgbGuesser = mk("rgb-guesser", "Color match", "fun", "Which swatch matches the target color?", (c) => {
  const html =
    '<div class="plk-big" id="plk-tgt" style="width:120px;height:120px;border-radius:28px;margin:8px auto 20px;border:1px solid color-mix(in oklab, var(--w-ink) 10%, transparent);font-size:0"> </div>' +
    '<div class="plk-padgrid" id="plk-opts"></div><div class="plk-status" id="plk-st">Pick the closest match.</div>';
  const js =
    "var target='',opts=shadow.getElementById('plk-opts'),st=shadow.getElementById('plk-st');" +
    "function rgb(){return[Math.floor(Math.random()*256),Math.floor(Math.random()*256),Math.floor(Math.random()*256)]}" +
    "function hex(a){return'#'+a.map(function(v){return v.toString(16).padStart(2,'0')}).join('').toUpperCase()}" +
    "function dist(a,b){return Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2])}" +
    "function round(){target=rgb();var t=shadow.getElementById('plk-tgt');t.style.background=hex(target);" +
    "var cs=[target];while(cs.length<3){var c2=rgb();if(dist(c2,target)>90)cs.push(c2)}" +
    "cs.sort(function(){return Math.random()-0.5});opts.innerHTML='';" +
    "cs.forEach(function(c2){var b=document.createElement('button');b.type='button';b.className='plk-pad';b.style.background=hex(c2);" +
    "b.addEventListener('click',function(){var d=dist(c2,target);st.innerHTML=d===0?'<b>Perfect match!</b> Next one…':'<b>Close.</b> The answer was '+hex(target);setTimeout(round,1400)});" +
    "opts.appendChild(b)})" +
    "round();";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Word shuffle ---- */
const wordShuffle = mk("word-shuffle", "Word unscramble", "fun", "Unscramble the shuffled letters.", (c) => {
  const words = ["PLANCK", "WIDGET", "BUTTON", "GALLERY", "SPRING", "LANTERN", "MARBLES", "WHISKER"];
  const html =
    '<div class="plk-big" id="plk-sh" style="letter-spacing:0.12em">······</div>' +
    fieldRow("Your answer", '<input type="text" name="a" placeholder="Unscramble it" autocomplete="off">') +
    '<div class="plk-btnrow"><button type="button" class="plk-btn2 pri" id="plk-check">Check</button><button type="button" class="plk-btn2" id="plk-new">New word</button></div>' +
    '<div class="plk-status" id="plk-st">Solved 0 · Skipped 0</div>';
  const js =
    "var W=" + JSON.stringify(words) + ",cur='',ok2=0,skip=0,st=shadow.getElementById('plk-st');" +
    "function up(){st.textContent='Solved '+ok2+' · Skipped '+skip}" +
    "function shuffle(w){var a=w.split('');for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}" +
    "var s=a.join('');return s===w?shuffle(w):s}" +
    "shadow.getElementById('plk-new').addEventListener('click',function(){cur=W[Math.floor(Math.random()*W.length)];" +
    "shadow.getElementById('plk-sh').textContent=shuffle(cur);shadow.getElementById('plk-f').a.value='';up()});" +
    "shadow.getElementById('plk-check').addEventListener('click',function(){var v=shadow.getElementById('plk-f').a.value.trim().toUpperCase();" +
    "if(!cur)return;if(v===cur){ok2++;up();shadow.getElementById('plk-new').click()}else{st.textContent='Not that one. '+ok2+' solved · '+skip+' skipped.'}});" +
    "shadow.getElementById('plk-new').click();";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Password strength ---- */
const passwordStrength = mk("password-strength", "Password strength", "utility", "Entropy, crack time and honest advice.", (c) => {
  const html =
    fieldRow("Password (stays local)", '<input type="text" name="p" placeholder="Type to test" autocomplete="off">') +
    '<div class="plk-bar"><i id="plk-bar" style="width:0"></i></div>' +
    '<dl class="plk-out"><dt>Strength</dt><dd id="plk-o1" style="font-size:17px">—</dd><dt>Crack time (offline, 10¹¹ guesses/s)</dt><dd id="plk-o2" style="font-size:17px">—</dd></dl>';
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function fmt(s){if(s<1)return'instantly';var u=['seconds','minutes','hours','days','months','years','centuries'];var i=0;" +
    "while(s>=60&&i<5){s/=60;i++}if(i<5)return Math.round(s)+' '+u[i];s/=60;return Math.round(s).toLocaleString()+' centuries'}" +
    "function calc(){var v=f.p.value;if(!v){shadow.getElementById('plk-o1').textContent='—';shadow.getElementById('plk-o2').textContent='—';shadow.getElementById('plk-bar').style.width='0';return}" +
    "var pool=0;if(/[a-z]/.test(v))pool+=26;if(/[A-Z]/.test(v))pool+=26;if(/[0-9]/.test(v))pool+=10;if(/[^a-zA-Z0-9]/.test(v))pool+=33;" +
    "var bits=v.length*Math.log2(pool||1),guesses=Math.pow(2,bits)/2;" +
    "var lab=bits<36?'Weak':bits<60?'Fair':bits<90?'Strong':'Excellent';" +
    "shadow.getElementById('plk-o1').textContent=lab+' · '+Math.round(bits)+' bits';" +
    "shadow.getElementById('plk-o2').textContent=fmt(guesses/1e11);" +
    "shadow.getElementById('plk-bar').style.width=Math.min(100,bits/120*100)+'%'}" +
    "f.p.addEventListener('input',calc)";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Whitespace cleaner ---- */
const whitespaceCleaner = mk("whitespace-cleaner", "Whitespace cleaner", "utility", "Trim lines, collapse spaces, fix text pastes.", (c) => {
  const html =
    fieldRow("Paste messy text", '<textarea name="t" rows="5" placeholder="Paste here…"></textarea>') +
    '<div class="plk-btnrow"><button type="button" class="plk-btn2 pri" id="plk-go">Clean</button>' +
    '<button type="button" class="plk-btn2" id="plk-copy">Copy result</button></div>' +
    '<div class="plk-status" id="plk-st"></div>';
  const js =
    "var f=shadow.getElementById('plk-f'),last='';" +
    "shadow.getElementById('plk-go').addEventListener('click',function(){var v=f.t.value;" +
    "last=v.split('\\n').map(function(l){return l.replace(/[ \\t]+/g,' ').trim()}).filter(Boolean).join('\\n');" +
    "f.t.value=last;var n=last.split('\\n').length;shadow.getElementById('plk-st').innerHTML='<b>'+n+' clean lines.</b>'});" +
    "shadow.getElementById('plk-copy').addEventListener('click',function(){navigator.clipboard.writeText(last||f.t.value)})";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Duplicate line remover ---- */
const dupLineRemover = mk("duplicate-line-remover", "Duplicate line remover", "utility", "Keep the first of every repeated line.", (c) => {
  const html =
    fieldRow("Lines", '<textarea name="in" rows="6" placeholder="One item per line…"></textarea>') +
    '<div class="plk-btnrow"><button type="button" class="plk-btn2 pri" id="plk-go">Remove duplicates</button>' +
    '<button type="button" class="plk-btn2" id="plk-copy">Copy result</button></div>' +
    '<div class="plk-status" id="plk-st"></div>';
  const js =
    "var f=shadow.getElementById('plk-f'),last='';" +
    "shadow.getElementById('plk-go').addEventListener('click',function(){var seen={},out=[];" +
    "f.in2.value.split('\\n').forEach(function(l){l=l.trim();if(l&&!seen[l]){seen[l]=1;out.push(l)}});" +
    "last=out.join('\\n');f.in2.value=last;shadow.getElementById('plk-st').innerHTML='<b>'+out.length+' unique lines.</b>'});" +
    "shadow.getElementById('plk-copy').addEventListener('click',function(){navigator.clipboard.writeText(last||f.in2.value)})";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Find & replace ---- */
const findReplace = mk("find-replace", "Find and replace", "utility", "Swap every occurrence, copy the result.", (c) => {
  const html =
    fieldRow("Text", '<textarea name="in" rows="4" placeholder="Paste text…"></textarea>') +
    fieldRow("Find", '<input type="text" name="f2" placeholder="Search for">') +
    fieldRow("Replace with", '<input type="text" name="r2" placeholder="Replacement">') +
    '<div class="plk-btnrow"><button type="button" class="plk-btn2 pri" id="plk-go">Replace all</button>' +
    '<button type="button" class="plk-btn2" id="plk-copy">Copy result</button></div>' +
    '<div class="plk-status" id="plk-st"></div>';
  const js =
    "var f=shadow.getElementById('plk-f'),last='';" +
    "shadow.getElementById('plk-go').addEventListener('click',function(){var s=f.f2.value;if(!s)return;" +
    "var n=f.in2.value.split(s).length-1;last=f.in2.value.split(s).join(f.r2.value);f.in2.value=last;" +
    "shadow.getElementById('plk-st').innerHTML='<b>'+n+' replaced.</b>'});" +
    "shadow.getElementById('plk-copy').addEventListener('click',function(){navigator.clipboard.writeText(last||f.in2.value)})";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ------------------------------------------------------------ exports */
const list: { id: string; name: string; cat: string; blurb: string; render: R }[] = [
  tallyCounter, toneGenerator, drumMachine, pianoKeys, decisionWheel,
  punchClock, moodPicker, setCounter, twoPlayerScore, coinStreak,
  diceDuel, numberGuess, memoryLetters, speedTap, rgbGuesser,
  wordShuffle, passwordStrength, whitespaceCleaner, dupLineRemover, findReplace,
];

export const renderersPlayA: Record<string, R> = Object.fromEntries(list.map((w) => [w.id, w.render]));
export const metaPlayA = list.map((w) => ({ id: w.id, name: w.name, cat: w.cat, blurb: w.blurb }));
