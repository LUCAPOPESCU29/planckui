import type { WidgetConfig } from "../types";
import { fieldRow, TOOL_CSS, toolShell } from "./kit";

/* 25 unit and text converters. Two live fields per widget — edit either side
   and the other updates. No external data, no network. */

type R = (c: WidgetConfig) => { html: string; css: string; js?: string };

const out = (c: WidgetConfig, html: string, js = ""): { html: string; css: string; js?: string } =>
  ({ html: toolShell(c, html), css: TOOL_CSS, js });

const two = (la: string, lb: string, unitA = "", unitB = ""): string =>
  fieldRow(la, `<input type="number" step="any" data-side="a" class="plk-a" placeholder="0"><span class="plk-lab">${unitA}</span>`) +
  fieldRow(lb, `<input type="number" step="any" data-side="b" class="plk-b" placeholder="0"><span class="plk-lab">${unitB}</span>`);

const twoText = (la: string, lb: string, ph = ""): string =>
  fieldRow(la, `<textarea rows="2" data-side="a" class="plk-a" placeholder="${ph}"></textarea>`) +
  fieldRow(lb, `<textarea rows="2" data-side="b" class="plk-b" placeholder="${ph}"></textarea>`);

/* both directions live: a→b and b→a */
function bindBoth(c: WidgetConfig, toB: string, toA: string, jsPre = ""): { html: string; css: string; js?: string } {
  const html =
    fieldRow("", `<input type="number" step="any" data-side="a" placeholder="0">`) +
    fieldRow("", `<input type="number" step="any" data-side="b" placeholder="0">`);
  const js =
    "var A=shadow.querySelector('[data-side=a]'),B=shadow.querySelector('[data-side=b]');" +
    "function ab(){var v=parseFloat(A.value);B.value=isNaN(v)?'':(" + toB + ")}" +
    "function ba(){var v=parseFloat(B.value);A.value=isNaN(v)?'':(" + toA + ")}" +
    "A.addEventListener('input',ab);B.addEventListener('input',ba);" + jsPre;
  return out(c, html, js);
}

/* 1 */ export const kgLbConverter: R = (c) => bindBoth(c, "v*2.20462", "v/2.20462");
/* 2 */ export const cmInchConverter: R = (c) => bindBoth(c, "v/2.54", "v*2.54");
/* 3 */ export const kmMilesConverter: R = (c) => bindBoth(c, "v*0.621371", "v/0.621371");
/* 4 */ export const literGallonConverter: R = (c) => bindBoth(c, "v*0.264172", "v/0.264172");
/* 5 */ export const mlOzConverter: R = (c) => bindBoth(c, "v/29.5735", "v*29.5735");
/* 6 */ export const sqmSqftConverter: R = (c) => bindBoth(c, "v*10.7639", "v/10.7639");
/* 7 */ export const barPsiConverter: R = (c) => bindBoth(c, "v*14.5038", "v/14.5038");
/* 8 */ export const knotsKmhConverter: R = (c) => bindBoth(c, "v*1.852", "v/1.852");
/* 9 */ export const radiansDegreesConverter: R = (c) => bindBoth(c, "v*180/Math.PI", "v*Math.PI/180");
/* 10 */ export const celsiusFahrenheitConverter: R = (c) => bindBoth(c, "v*9/5+32", "(v-32)*5/9");

/* 11 — bytes: MB ↔ GB (decimal) */
export function bytesConverter(c: WidgetConfig) {
  const html = fieldRow("Megabytes", '<input type="number" step="any" data-side="a" placeholder="0">') +
    fieldRow("Gigabytes", '<input type="number" step="any" data-side="b" placeholder="0">');
  const js = "var A=shadow.querySelector('[data-side=a]'),B=shadow.querySelector('[data-side=b]');" +
    "A.addEventListener('input',function(){var v=parseFloat(A.value);B.value=isNaN(v)?'':v/1000});" +
    "B.addEventListener('input',function(){var v=parseFloat(B.value);A.value=isNaN(v)?'':v*1000});";
  return out(c, html, js);
}

/* 12 — seconds ↔ HH:MM:SS */
export function secondsHmsConverter(c: WidgetConfig) {
  const html = fieldRow("Seconds", '<input type="number" step="1" data-side="a" placeholder="3600">') +
    fieldRow("HH:MM:SS", '<input data-side="b" placeholder="01:00:00">');
  const js = "var A=shadow.querySelector('[data-side=a]'),B=shadow.querySelector('[data-side=b]');" +
    "A.addEventListener('input',function(){var v=parseInt(A.value,10);if(isNaN(v)){B.value='';return}" +
    "var h=Math.floor(v/3600),m=Math.floor(v%3600/60),s=v%60;" +
    "B.value=(h?h+':':'')+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')});" +
    "B.addEventListener('input',function(){var p=B.value.split(':').map(Number);if(p.some(isNaN))return;" +
    "var s=p.length===3?p[0]*3600+p[1]*60+p[2]:p[0]*60+p[1];A.value=s||''})";
  return out(c, html, js);
}

/* 13 — decimal ↔ binary */
export function decimalBinaryConverter(c: WidgetConfig) {
  const html = fieldRow("Decimal", '<input type="number" step="1" data-side="a" placeholder="42">') +
    fieldRow("Binary", '<input data-side="b" placeholder="101010">');
  const js = "var A=shadow.querySelector('[data-side=a]'),B=shadow.querySelector('[data-side=b]');" +
    "A.addEventListener('input',function(){var v=parseInt(A.value,10);B.value=isNaN(v)?'':(v>>>0).toString(2)});" +
    "B.addEventListener('input',function(){var v=parseInt(B.value.replace(/[^01]/g,''),2);A.value=isNaN(v)?'':v})";
  return out(c, html, js);
}

/* 14 — decimal ↔ hex */
export function decimalHexConverter(c: WidgetConfig) {
  const html = fieldRow("Decimal", '<input type="number" step="1" data-side="a" placeholder="255">') +
    fieldRow("Hexadecimal", '<input data-side="b" placeholder="FF">');
  const js = "var A=shadow.querySelector('[data-side=a]'),B=shadow.querySelector('[data-side=b]');" +
    "A.addEventListener('input',function(){var v=parseInt(A.value,10);B.value=isNaN(v)?'':(v>>>0).toString(16).toUpperCase()});" +
    "B.addEventListener('input',function(){var v=parseInt(B.value,16);A.value=isNaN(v)?'':v})";
  return out(c, html, js);
}

/* 15 — US mpg ↔ L/100km */
export function mpgConverter(c: WidgetConfig) {
  const html = fieldRow("Miles per gallon (US)", '<input type="number" step="any" data-side="a" placeholder="30">') +
    fieldRow("Liters per 100 km", '<input type="number" step="any" data-side="b" placeholder="7.8">');
  const js = "var A=shadow.querySelector('[data-side=a]'),B=shadow.querySelector('[data-side=b]');" +
    "A.addEventListener('input',function(){var v=parseFloat(A.value);B.value=v>0?(235.215/v).toFixed(2):''});" +
    "B.addEventListener('input',function(){var v=parseFloat(B.value);A.value=v>0?(235.215/v).toFixed(1):''})";
  return out(c, html, js);
}

/* 16 — unix timestamp ↔ date */
export function unixTimestampConverter(c: WidgetConfig) {
  const html = fieldRow("Unix timestamp (seconds)", '<input type="number" step="1" data-side="a" placeholder="1760000000">') +
    fieldRow("Date and time", '<input data-side="b" placeholder="2025-10-09 13:20">');
  const js = "var A=shadow.querySelector('[data-side=a]'),B=shadow.querySelector('[data-side=b]');" +
    "A.addEventListener('input',function(){var v=parseInt(A.value,10);if(isNaN(v)){B.value='';return}" +
    "B.value=new Date(v*1000).toLocaleString()});" +
    "B.addEventListener('input',function(){var d=new Date(B.value);A.value=isNaN(d.getTime())?'':Math.floor(d.getTime()/1000)})";
  return out(c, html, js);
}

/* 17 — number → English words */
export function numberToWords(c: WidgetConfig) {
  const html = fieldRow("Number (0 – 999,999,999)", '<input type="number" step="1" data-side="a" placeholder="123456">') +
    fieldRow("In words", '<input data-side="b" placeholder="…">');
  const js =
    "var ones=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];" +
    "var tens=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];" +
    "function w(n){if(n<20)return ones[n];if(n<100)return tens[Math.floor(n/10)]+(n%10?'-'+ones[n%10]:'');" +
    "if(n<1000)return ones[Math.floor(n/100)]+' hundred'+(n%100?' '+w(n%100):'');" +
    "if(n<1e6)return w(Math.floor(n/1000))+' thousand'+(n%1000?' '+w(n%1000):'');" +
    "return w(Math.floor(n/1e6))+' million'+(n%1e6?' '+w(n%1e6):'')}" +
    "var A=shadow.querySelector('[data-side=a]'),B=shadow.querySelector('[data-side=b]');" +
    "A.addEventListener('input',function(){var v=parseInt(A.value,10);B.value=isNaN(v)?'':w(v)})";
  return out(c, html, js);
}

/* 18 — number ↔ roman numerals */
export function romanNumeralConverter(c: WidgetConfig) {
  const html = fieldRow("Number (1 – 3999)", '<input type="number" step="1" min="1" data-side="a" placeholder="2026">') +
    fieldRow("Roman numeral", '<input data-side="b" placeholder="MMXXVI">');
  const js =
    "var R=[[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];" +
    "var A=shadow.querySelector('[data-side=a]'),B=shadow.querySelector('[data-side=b]');" +
    "A.addEventListener('input',function(){var n=parseInt(A.value,10);if(isNaN(n)||n<1||n>3999){B.value='';return}" +
    "var o='';R.forEach(function(p){while(n>=p[0]){o+=p[1];n-=p[0]}});B.value=o});" +
    "B.addEventListener('input',function(){var s=B.value.toUpperCase();if(!/^[MDCLXVI]+$/.test(s)){A.value='';return}" +
    "var M={I:1,V:5,X:10,L:50,C:100,D:500,M:1000},n=0;" +
    "for(var i=0;i<s.length;i++){var v=M[s[i]],nx=M[s[i+1]]||0;n+=nx>v?-v:v}A.value=n||''})";
  return out(c, html, js);
}

/* 19 — text ↔ base64 */
export function base64Converter(c: WidgetConfig) {
  const html = twoText("Text", "Base64");
  const js = "var A=shadow.querySelector('[data-side=a]'),B=shadow.querySelector('[data-side=b]');" +
    "A.addEventListener('input',function(){try{B.value=btoa(unescape(encodeURIComponent(A.value)))}catch(e){}});" +
    "B.addEventListener('input',function(){try{A.value=decodeURIComponent(escape(atob(B.value.trim())))}catch(e){}})";
  return out(c, html, js);
}

/* 20 — text ↔ URL-encoded */
export function urlEncoder(c: WidgetConfig) {
  const html = twoText("Text", "URL-encoded");
  const js = "var A=shadow.querySelector('[data-side=a]'),B=shadow.querySelector('[data-side=b]');" +
    "A.addEventListener('input',function(){B.value=encodeURIComponent(A.value)});" +
    "B.addEventListener('input',function(){try{A.value=decodeURIComponent(B.value.replace(/\\+/g,' '))}catch(e){}})";
  return out(c, html, js);
}

/* 21 — case converter */
export function caseConverter(c: WidgetConfig) {
  const html = fieldRow("Text", '<textarea rows="2" data-side="a" placeholder="hello world"></textarea>') +
    '<dl class="plk-out"><dt>UPPERCASE</dt><dd id="plk-o1">—</dd><dt>lowercase</dt><dd id="plk-o2">—</dd><dt>Title Case</dt><dd id="plk-o3" style="font-size:14px">—</dd></dl>';
  const js = "var A=shadow.querySelector('[data-side=a]');" +
    "A.addEventListener('input',function(){var v=A.value;" +
    "shadow.getElementById('plk-o1').textContent=v.toUpperCase();" +
    "shadow.getElementById('plk-o2').textContent=v.toLowerCase();" +
    "shadow.getElementById('plk-o3').textContent=v.replace(/\\w\\S*/g,function(w){return w[0].toUpperCase()+w.slice(1).toLowerCase()})})";
  return out(c, html, js);
}

/* 22 — word & character counter */
export function wordCounter(c: WidgetConfig) {
  const html = fieldRow("Type or paste text", '<textarea rows="4" data-side="a" placeholder="Start typing…"></textarea>') +
    '<dl class="plk-out"><dt>Words</dt><dd id="plk-o1">0</dd><dt>Characters</dt><dd id="plk-o2">0</dd><dt>Sentences</dt><dd id="plk-o3">0</dd></dl>';
  const js = "var A=shadow.querySelector('[data-side=a]');" +
    "A.addEventListener('input',function(){var v=A.value;" +
    "shadow.getElementById('plk-o1').textContent=(v.match(/\\S+/g)||[]).length;" +
    "shadow.getElementById('plk-o2').textContent=v.length;" +
    "shadow.getElementById('plk-o3').textContent=(v.match(/[.!?]+(\\s|$)/g)||[]).length})";
  return out(c, html, js);
}

/* 23 — text reverser (characters / words / lines) */
export function textReverser(c: WidgetConfig) {
  const html = twoText("Original", "Reversed (characters · words · lines)");
  const js = "var A=shadow.querySelector('[data-side=a]'),B=shadow.querySelector('[data-side=b]');" +
    "A.addEventListener('input',function(){var v=A.value;if(!v){B.value='';return}" +
    "B.value=v.split('').reverse().join('')+'\\n'+v.split(/\\s+/).reverse().join(' ')+'\\n'+v.split('\\n').reverse().join('\\n')})";
  return out(c, html, js);
}

/* 24 — slug generator */
export function slugGenerator(c: WidgetConfig) {
  const html = fieldRow("Title", '<textarea rows="2" data-side="a" placeholder="10 Best Coffee Shops — 2026 Edition!"></textarea>') +
    fieldRow("Slug", '<input data-side="b" placeholder="10-best-coffee-shops-2026-edition">');
  const js = "var A=shadow.querySelector('[data-side=a]'),B=shadow.querySelector('[data-side=b]');" +
    "A.addEventListener('input',function(){B.value=A.value.toLowerCase().trim().replace(/[^a-z0-9\\s-]/g,'').replace(/[\\s-]+/g,'-')})";
  return out(c, html, js);
}

/* 25 — number scale formatter (K / M / B) */
export function numberScaleConverter(c: WidgetConfig) {
  const html = fieldRow("Number", '<input type="number" step="any" data-side="a" placeholder="1234567">') +
    fieldRow("Scaled", '<input data-side="b" placeholder="1.23M">');
  const js = "var A=shadow.querySelector('[data-side=a]'),B=shadow.querySelector('[data-side=b]');" +
    "A.addEventListener('input',function(){var v=parseFloat(A.value);if(isNaN(v)){B.value='';return}" +
    "var s=v<0?'-':'';v=Math.abs(v);" +
    "B.value=s+(v>=1e9?(v/1e9).toFixed(2)+'B':v>=1e6?(v/1e6).toFixed(2)+'M':v>=1e3?(v/1e3).toFixed(1)+'K':String(v))})";
  return out(c, html, js);
}

/* 26 — ratio solver a : b = c : d */
export function ratioCalculator(c: WidgetConfig) {
  const html = fieldRow("If A : B = C : X — A", '<input type="number" step="any" name="a" placeholder="2" required>') +
    fieldRow("B", '<input type="number" step="any" name="b" placeholder="3" required>') +
    fieldRow("C", '<input type="number" step="any" name="c" placeholder="6" required>') +
    '<dl class="plk-out"><dt>X</dt><dd id="plk-o1">—</dd></dl>';
  const js = "var f=shadow.getElementById('plk-f');" +
    "function calc(){var a=+f.a.value,b=+f.b.value,cc=+f.c.value;if(!a||!b)return;" +
    "shadow.getElementById('plk-o1').textContent=(cc*b/a).toFixed(2)}" +
    "f.addEventListener('input',calc);calc()";
  return out(c, html, js);
}
