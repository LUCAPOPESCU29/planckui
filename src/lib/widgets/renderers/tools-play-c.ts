import { baseCss } from "../base";
import type { WidgetConfig } from "../types";
import { PLAY_CSS, TOOL_CSS, fieldRow, jsAudio, toolShell } from "./kit";

/* Final 16 interactive tools — kitchen, fitness, school and reference picks. */

type R = (c: WidgetConfig) => { html: string; css: string; js?: string };

const css = (c: WidgetConfig) => baseCss(c, TOOL_CSS + PLAY_CSS);
const mk = (id: string, name: string, cat: string, blurb: string, render: R) =>
  ({ id, name, cat, blurb, render });

/* ---- Ingredient scaler ---- */
const ingredientScaler = mk("ingredient-scaler", "Recipe scaler", "tools", "Scale every ingredient for more or fewer servings.", (c) => {
  const html =
    fieldRow("Recipe serves", '<input type="number" name="a" value="4" min="1" required>') +
    fieldRow("You need servings for", '<input type="number" name="b" value="6" min="1" required>') +
    fieldRow("One ingredient (g)", '<input type="number" name="c" value="200" min="0" required>') +
    '<dl class="plk-out"><dt>Scaled ingredient</dt><dd id="plk-o1">—</dd><dt>Scale factor</dt><dd id="plk-o2">—</dd></dl>';
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function calc(){var fa=+f.a.value,fb=+f.b.value;if(!fa)return;var k=fb/fa;" +
    "shadow.getElementById('plk-o1').textContent=Math.round((+f.c.value||0)*k)+' g';" +
    "shadow.getElementById('plk-o2').textContent='×'+k.toFixed(2)}" +
    "f.addEventListener('input',calc)";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Plate math ---- */
const plateMath = mk("plate-math-calculator", "Barbell plate math", "tools", "Plates per side for any target weight.", (c) => {
  const html =
    fieldRow("Target weight (kg)", '<input type="number" name="t" value="100" min="20" step="2.5" required>') +
    fieldRow("Bar weight", '<select name="b"><option value="20">Olympic bar (20 kg)</option><option value="15">Women\u2019s bar (15 kg)</option><option value="7">Technique bar (7 kg)</option></select>') +
    '<dl class="plk-out"><dt>Plates per side</dt><dd id="plk-o1" style="font-size:17px">—</dd><dt>Left over</dt><dd id="plk-o2">—</dd></dl>';
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "var P=[25,20,15,10,5,2.5,1.25];" +
    "function calc(){var side=(+f.t.value||0)-(+f.b.value||20);if(side<=0){shadow.getElementById('plk-o1').textContent='Below bar weight';return}" +
    "side/=2;var out=[],i=0,left=side;for(i=0;i<P.length;i++){while(left>=P[i]-0.001){out.push(P[i]);left-=P[i];if(out.length>40)break}}" +
    "shadow.getElementById('plk-o1').textContent=out.length?out.join(' + ')+' kg':'—';" +
    "shadow.getElementById('plk-o2').textContent=left>0.001?left.toFixed(2)+' kg short':'Exact'}" +
    "f.addEventListener('input',calc)";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Race splits ---- */
const raceSplits = mk("race-splits-calculator", "Race splits", "tools", "Even per-kilometer pace for your goal time.", (c) => {
  const html =
    fieldRow("Goal time (minutes)", '<input type="number" name="t" value="50" min="1" required>') +
    fieldRow("Distance (km)", '<input type="number" name="d" value="10" min="0.1" step="0.1" required>') +
    '<dl class="plk-out"><dt>Pace per km</dt><dd id="plk-o1">—</dd><dt>First km split</dt><dd id="plk-o2">—</dd></dl>';
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function fmt(s){var m=Math.floor(s/60),sec=Math.round(s%60);if(sec===60){m++;sec=0}return m+':'+String(sec).padStart(2,'0')}" +
    "function calc(){var t=+f.t.value,d=+f.d.value;if(!t||!d)return;var pace=t/d;" +
    "shadow.getElementById('plk-o1').textContent=fmt(pace)+' / km';" +
    "shadow.getElementById('plk-o2').textContent='0:00 → '+fmt(pace)}" +
    "f.addEventListener('input',calc)";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Decimal time ---- */
const decimalTime = mk("decimal-time-converter", "Decimal time", "utility", "10.5 hours is 10:30. And back again.", (c) => {
  const html =
    fieldRow("Decimal hours", '<input type="number" name="d" value="7.5" step="0.25" required>') +
    fieldRow("Or hours : minutes", '<input type="number" name="h" value="7" min="0" style="margin-bottom:6px"><input type="number" name="m" value="30" min="0" max="59">') +
    '<dl class="plk-out"><dt>As hh:mm</dt><dd id="plk-o1">—</dd><dt>As decimal</dt><dd id="plk-o2">—</dd></dl>';
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function calc(){var d=+f.d.value;if(!isNaN(d)&&f.d.value!=='')" +
    "shadow.getElementById('plk-o1').textContent=Math.floor(d)+':'+String(Math.round((d%1)*60)).padStart(2,'0');" +
    "var h=+f.h.value||0,m=+f.m.value||0;shadow.getElementById('plk-o2').textContent=(h+m/60).toFixed(2)}" +
    "f.addEventListener('input',calc)";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- GPA calculator ---- */
const gpaCalc = mk("gpa-calculator", "GPA calculator", "tools", "Weighted grade points across your courses.", (c) => {
  const html =
    fieldRow("Course grades (0–4.0, comma separated)", '<input type="text" name="g" placeholder="3.7, 4.0, 3.3, 3.0" required>') +
    fieldRow("Credits (same order)", '<input type="text" name="c" placeholder="4, 3, 3, 2" required>') +
    '<dl class="plk-out"><dt>GPA</dt><dd id="plk-o1">—</dd><dt>Total credits</dt><dd id="plk-o2">—</dd></dl>';
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function calc(){var g=f.g.value.split(',').map(parseFloat).filter(function(v){return !isNaN(v)});" +
    "var c=f.c.value.split(',').map(parseFloat).filter(function(v){return !isNaN(v)});" +
    "if(!g.length||g.length!==c.length)return;var pts=0,cr=0;" +
    "for(var i=0;i<g.length;i++){pts+=g[i]*c[i];cr+=c[i]}" +
    "shadow.getElementById('plk-o1').textContent=cr?(pts/cr).toFixed(2):'—';" +
    "shadow.getElementById('plk-o2').textContent=cr}" +
    "f.addEventListener('input',calc)";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Dog age ---- */
const dogAge = mk("dog-age-calculator", "Dog age", "fun", "Human-equivalent years, breed-size aware.", (c) => {
  const html =
    fieldRow("Dog age (years)", '<input type="number" name="a" value="4" min="0" step="0.5" required>') +
    fieldRow("Size", '<select name="s"><option value="0">Small (&lt;10 kg)</option><option value="1" selected>Medium</option><option value="2">Large (&gt;25 kg)</option></select>') +
    '<dl class="plk-out"><dt>Human equivalent</dt><dd id="plk-o1">—</dd><dt>Life stage</dt><dd id="plk-o2">—</dd></dl>';
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function calc(){var a=+f.a.value;if(isNaN(a))return;" +
    "var first=[9,9,9][+f.s.value||0],after=[5,5,6][+f.s.value||0];" +
    "var h=a<=1?a*first:first+Math.max(0,a-1)*after;" +
    "shadow.getElementById('plk-o1').textContent=Math.round(h)+' years';" +
    "shadow.getElementById('plk-o2').textContent=h<18?'Puppy':h<30?'Young adult':h<45?'Adult':h<65?'Mature':'Senior'}" +
    "f.addEventListener('input',calc)";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Planet weight ---- */
const planetWeight = mk("planet-weight-calculator", "Weight on planets", "fun", "Your weight elsewhere in the solar system.", (c) => {
  const P = [["Mercury", 0.38], ["Venus", 0.91], ["Earth", 1], ["Mars", 0.38], ["Jupiter", 2.53], ["Saturn", 1.07], ["Uranus", 0.89], ["Neptune", 1.14], ["Moon", 0.165]];
  const html =
    fieldRow("Your weight (kg)", '<input type="number" name="w" value="70" min="1" required>') +
    '<div class="plk-padgrid" style="grid-template-columns:repeat(3,1fr)">' +
    P.map((p, i) => `<button type="button" class="plk-pad" data-g="${p[1]}" data-n="${p[0]}">${p[0]}</button>`).join("") +
    '</div><div class="plk-status" id="plk-st">Pick a world.</div>';
  const js =
    "var st=shadow.getElementById('plk-st');" +
    "shadow.querySelectorAll('.plk-pad').forEach(function(b){b.addEventListener('click',function(){" +
    "var w=(+shadow.getElementById('plk-f').w.value||0)*parseFloat(b.dataset.g);" +
    "st.innerHTML='On <b>'+b.dataset.n+'</b> you would weigh <b>'+w.toFixed(1)+' kg</b>'})})";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Meeting cost ---- */
const meetingCost = mk("meeting-cost-calculator", "Meeting cost", "tools", "What the calendar invite really costs.", (c) => {
  const html =
    fieldRow("Attendees", '<input type="number" name="n" value="6" min="1" required>') +
    fieldRow("Average hourly cost", '<input type="number" name="h" value="60" min="1" required>') +
    fieldRow("Minutes", '<input type="number" name="m" value="60" min="5" required>') +
    '<dl class="plk-out"><dt>This meeting</dt><dd id="plk-o1">—</dd><dt>If weekly for a year</dt><dd id="plk-o2">—</dd></dl>';
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function calc(){var c=(+f.n.value||0)*(+f.h.value||0)*(+f.m.value||0)/60;if(!c)return;" +
    "shadow.getElementById('plk-o1').textContent=c.toLocaleString(undefined,{maximumFractionDigits:0});" +
    "shadow.getElementById('plk-o2').textContent=(c*46).toLocaleString(undefined,{maximumFractionDigits:0})}" +
    "f.addEventListener('input',calc)";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Commute cost ---- */
const commuteCost = mk("commute-cost-calculator", "Commute cost", "tools", "The yearly price of getting to work.", (c) => {
  const html =
    fieldRow("Distance each way (km)", '<input type="number" name="d" value="15" min="0" step="0.5" required>') +
    fieldRow("Workdays per week", '<input type="number" name="w" value="4" min="1" max="7" required>') +
    fieldRow("Cost per km (fuel, transit, wear)", '<input type="number" name="c" value="0.25" min="0" step="0.05" required>') +
    '<dl class="plk-out"><dt>Per month</dt><dd id="plk-o1">—</dd><dt>Per year</dt><dd id="plk-o2">—</dd></dl>';
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function calc(){var daily=2*(+f.d.value||0)*(+f.c.value||0);if(!daily)return;" +
    "var m=daily*(+f.w.value||0)*4.33;" +
    "shadow.getElementById('plk-o1').textContent=m.toFixed(0);" +
    "shadow.getElementById('plk-o2').textContent=(m*12).toFixed(0)}" +
    "f.addEventListener('input',calc)";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Bookshelf books ---- */
const bookshelfBooks = mk("bookshelf-books-calculator", "Shelf capacity", "tools", "How many books fit a shelf length.", (c) => {
  const html =
    fieldRow("Shelf length (cm)", '<input type="number" name="l" value="90" min="10" required>') +
    fieldRow("Average book thickness (cm)", '<input type="number" name="t" value="2.8" step="0.1" min="0.5" required>') +
    '<dl class="plk-out"><dt>Books per shelf</dt><dd id="plk-o1">—</dd><dt>Four shelves hold</dt><dd id="plk-o2">—</dd></dl>';
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function calc(){var n=Math.floor((+f.l.value||0)/(+f.t.value||1));if(n<0)return;" +
    "shadow.getElementById('plk-o1').textContent=n;shadow.getElementById('plk-o2').textContent=n*4}" +
    "f.addEventListener('input',calc)";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Compost ratio ---- */
const compostRatio = mk("compost-ratio-calculator", "Compost ratio", "tools", "Greens and browns for a hot pile.", (c) => {
  const html =
    fieldRow("Greens (scraps, grass) — bucket volume", '<input type="number" name="g" value="1" min="0" step="0.5" required>') +
    fieldRow("Browns (leaves, cardboard) — bucket volume", '<input type="number" name="b" value="2" min="0" step="0.5" required>') +
    '<dl class="plk-out"><dt>Your ratio</dt><dd id="plk-o1">—</dd><dt>Verdict</dt><dd id="plk-o2" style="font-size:16px">—</dd></dl>';
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function calc(){var g=+f.g.value,b=+f.b.value;if(!g&&!b)return;" +
    "var r=b/Math.max(g,0.001);shadow.getElementById('plk-o1').textContent='1 : '+r.toFixed(1);" +
    "shadow.getElementById('plk-o2').textContent=r<1.5?'Too wet — add browns':r<3.5?'In the sweet spot':'Too dry — add greens'}" +
    "f.addEventListener('input',calc)";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Reading speed ---- */
const readingSpeed = mk("reading-speed-calculator", "Reading speed", "tools", "Your WPM and time for any book.", (c) => {
  const html =
    fieldRow("Words you read", '<input type="number" name="w" value="1200" min="50" required>') +
    fieldRow("Minutes it took", '<input type="number" name="m" value="5" min="0.5" step="0.5" required>') +
    fieldRow("Book length (words)", '<input type="number" name="b" value="90000" min="1000" required>') +
    '<dl class="plk-out"><dt>Your speed</dt><dd id="plk-o1">—</dd><dt>That book takes</dt><dd id="plk-o2">—</dd></dl>';
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function calc(){var wpm=(+f.w.value||0)/(+f.m.value||1);if(!wpm)return;" +
    "var hrs=(+f.b.value||0)/wpm/60;shadow.getElementById('plk-o1').textContent=Math.round(wpm)+' wpm';" +
    "shadow.getElementById('plk-o2').textContent=hrs<1?Math.round(hrs*60)+' min':hrs.toFixed(1)+' hours'}" +
    "f.addEventListener('input',calc)";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Time zone overlap ---- */
const timeZoneOverlap = mk("time-zone-overlap-calculator", "Meeting window", "tools", "Shared working hours between two zones.", (c) => {
  const html =
    fieldRow("Your working hours (UTC offset)", '<input type="number" name="a" value="2" step="1" min="-12" max="14" required>') +
    fieldRow("Their working hours (UTC offset)", '<input type="number" name="b" value="-5" step="1" min="-12" max="14" required>') +
    '<dl class="plk-out"><dt>Overlap</dt><dd id="plk-o1">—</dd><dt>Best call time (your clock)</dt><dd id="plk-o2">—</dd></dl>';
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function fmt(h){h=((h%24)+24)%24;return String(Math.floor(h)).padStart(2,'0')+':00'}" +
    "function calc(){var oa=+f.a.value,ob=+f.b.value;if(isNaN(oa)||isNaN(ob))return;" +
    "var start=Math.max(9+oa,9+ob),end=Math.min(17+oa,17+ob);" +
    "if(end<=start){shadow.getElementById('plk-o1').textContent='No overlap';shadow.getElementById('plk-o2').textContent='Try asynchronous';return}" +
    "shadow.getElementById('plk-o1').textContent=(end-start)+' hours';" +
    "shadow.getElementById('plk-o2').textContent=fmt(start)+' – '+fmt(end)}" +
    "f.addEventListener('input',calc)";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Freelance tax set-aside ---- */
const taxSetAside = mk("freelance-tax-set-aside", "Tax set-aside", "tools", "Put aside the right slice of every invoice.", (c) => {
  const html =
    fieldRow("Monthly freelance income", '<input type="number" name="i" value="4500" min="0" required>') +
    fieldRow("Tax + social rate %", '<input type="number" name="r" value="30" min="0" max="60" required>') +
    '<dl class="plk-out"><dt>Set aside monthly</dt><dd id="plk-o1">—</dd><dt>Kept after tax</dt><dd id="plk-o2">—</dd></dl>';
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function calc(){var i=+f.i.value,r=+f.r.value/100;if(!i)return;" +
    "shadow.getElementById('plk-o1').textContent=(i*r).toFixed(0);shadow.getElementById('plk-o2').textContent=(i*(1-r)).toFixed(0)}" +
    "f.addEventListener('input',calc)";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Chinese zodiac ---- */
const chineseZodiac = mk("chinese-zodiac-calculator", "Chinese zodiac", "fun", "Birth year to your animal sign.", (c) => {
  const A = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];
  const html =
    fieldRow("Birth year", '<input type="number" name="y" value="1990" min="1900" max="2100" required>') +
    '<dl class="plk-out"><dt>Your sign</dt><dd id="plk-o1">—</dd><dt>Also rules years</dt><dd id="plk-o2" style="font-size:15px">—</dd></dl>';
  const js =
    "var A=" + JSON.stringify(A) + ",f=shadow.getElementById('plk-f');" +
    "function calc(){var y=Math.floor(+f.y.value);if(!y)return;var i=((y-1900)%12+12)%12;" +
    "shadow.getElementById('plk-o1').textContent=A[i];" +
    "shadow.getElementById('plk-o2').textContent=(y-12)+', '+(y-24)+', '+(y+12)+'…'}" +
    "f.addEventListener('input',calc)";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ---- Birthstone ---- */
const birthstone = mk("birthstone-calculator", "Birthstone", "fun", "The stone for any birth month.", (c) => {
  const S = ["Garnet", "Amethyst", "Aquamarine", "Diamond", "Emerald", "Pearl", "Ruby", "Peridot", "Sapphire", "Opal", "Topaz", "Turquoise"];
  const html =
    fieldRow("Birth month", '<select name="m">' + S.map((s, i) => `<option value="${i + 1}">${new Date(2000, i, 1).toLocaleString(undefined, { month: "long" })} — ${s}</option>`).join("") + "</select>") +
    '<dl class="plk-out"><dt>Birthstone</dt><dd id="plk-o1">—</dd><dt>Meaning, roughly</dt><dd id="plk-o2" style="font-size:16px">—</dd></dl>';
  const M = ["protection on journeys", "calm and clarity", "courage at sea", "pure love", "hope and rebirth", "purity", "passion and protection", "inner strength", "wisdom", "hope and luck", "warmth and good cheer", "good fortune"];
  const js =
    "var S=" + JSON.stringify(S) + ",M=" + JSON.stringify(M) + ",f=shadow.getElementById('plk-f');" +
    "function calc(){var i=+f.m.value-1;if(isNaN(i))return;" +
    "shadow.getElementById('plk-o1').textContent=S[i];shadow.getElementById('plk-o2').textContent=M[i]}" +
    "f.addEventListener('change',calc)";
  return { html: toolShell(c, html), css: css(c), js };
});

/* ------------------------------------------------------------ exports */
const list: { id: string; name: string; cat: string; blurb: string; render: R }[] = [
  ingredientScaler, plateMath, raceSplits, decimalTime, gpaCalc,
  dogAge, planetWeight, meetingCost, commuteCost, bookshelfBooks,
  compostRatio, readingSpeed, timeZoneOverlap, taxSetAside, chineseZodiac, birthstone,
];

export const renderersPlayC: Record<string, R> = Object.fromEntries(list.map((w) => [w.id, w.render]));
export const metaPlayC = list.map((w) => ({ id: w.id, name: w.name, cat: w.cat, blurb: w.blurb }));
