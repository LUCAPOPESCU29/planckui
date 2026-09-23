import { baseCss, badgeHtml, esc, ok } from "../base";
import type { RenderResult, TestimonialData, WidgetConfig } from "../types";
import { TOOL_CSS, SOFT, fieldRow, jsEsc, lines, toolShell } from "./kit";

type R = (c: WidgetConfig, items: TestimonialData[]) => RenderResult;

const out = (html: string) => html;

/* ---- Percentage calculator ---- */
export const percentageCalculator: R = (c) => {
  const html =
    fieldRow("What is X% of Y?", '<input type="number" name="a" placeholder="X" step="any" required> <input type="number" name="b" placeholder="Y" step="any" required>') +
    fieldRow("X is what percent of Y?", '<input type="number" name="c" placeholder="X" step="any" required> <input type="number" name="d" placeholder="Y" step="any" required>') +
    '<dl class="plk-out"><dt>X% of Y</dt><dd id="plk-o1">—</dd><dt style="margin-top:8px">X as % of Y</dt><dd id="plk-o2">—</dd></dl>';
  const css = baseCss(c, TOOL_CSS + `
.plk-row > input:not(:first-child) { margin-top: 6px; }
`);
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function calc(){var a=+f.a.value,b=+f.b.value,cp=+f.c.value,d=+f.d.value;" +
    "shadow.getElementById('plk-o1').textContent=(a&&b)?(a*b/100).toLocaleString():'—';" +
    "shadow.getElementById('plk-o2').textContent=(cp&&d)?((cp/d*100).toFixed(1)+'%'):'—'}" +
    "f.addEventListener('input',calc)";
  return ok({ html: toolShell(c, out(html)).replace("</form>", "</form>"), css, js });
};

/* ---- Date difference ---- */
export const dateDifference: R = (c) => {
  const html =
    fieldRow("From", '<input type="date" name="a" required>') +
    fieldRow("To", '<input type="date" name="b" required>') +
    '<dl class="plk-out"><dt>Difference</dt><dd id="plk-o1">—</dd><dt style="margin-top:8px">In weeks</dt><dd id="plk-o2">—</dd></dl>';
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function calc(){if(!f.a.value||!f.b.value)return;" +
    "var d1=new Date(f.a.value+'T00:00:00'),d2=new Date(f.b.value+'T00:00:00');" +
    "var days=Math.round((d2-d1)/86400000);" +
    "shadow.getElementById('plk-o1').textContent=Math.abs(days).toLocaleString()+' days';" +
    "shadow.getElementById('plk-o2').textContent=(Math.abs(days)/7).toFixed(1)+' weeks'}" +
    "f.addEventListener('input',calc)";
  return ok({ html: toolShell(c, html), css: baseCss(c, TOOL_CSS), js });
};

/* ---- Loan / mortgage ---- */
export const loanCalculator: R = (c) => {
  const html =
    fieldRow("Loan amount", '<input type="number" name="a" min="0" step="any" placeholder="100000" required>') +
    fieldRow("Interest rate (% per year)", '<input type="number" name="r" min="0" max="100" step="0.1" value="4" required>') +
    fieldRow("Term (years)", '<input type="number" name="y" min="1" max="50" value="25" required>') +
    '<dl class="plk-out"><dt>Monthly payment</dt><dd id="plk-o1">—</dd><dt style="margin-top:8px">Total interest</dt><dd id="plk-o2">—</dd></dl>';
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function calc(){var P=+f.a.value,r=+f.r.value/100/12,n=+f.y.value*12;if(!P||!n)return;" +
    "var m=r?P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1):P/n;" +
    "shadow.getElementById('plk-o1').textContent=m.toFixed(2);" +
    "shadow.getElementById('plk-o2').textContent=(m*n-P).toFixed(0)}" +
    "f.addEventListener('input',calc)";
  return ok({ html: toolShell(c, html), css: baseCss(c, TOOL_CSS), js });
};

/* ---- BMI ---- */
export const bmiCalculator: R = (c) => {
  const html =
    fieldRow("Height (cm)", '<input type="number" name="h" min="60" max="260" value="175" required>') +
    fieldRow("Weight (kg)", '<input type="number" name="w" min="20" max="400" value="70" step="0.5" required>') +
    '<dl class="plk-out"><dt>Your BMI</dt><dd id="plk-o1">—</dd><dt style="margin-top:8px">Category</dt><dd id="plk-o2" style="font-size:15px">—</dd></dl>';
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function calc(){var h=(+f.h.value)/100,w=+f.w.value;if(!h||!w)return;" +
    "var bmi=w/(h*h);shadow.getElementById('plk-o1').textContent=bmi.toFixed(1);" +
    "var cat=bmi<18.5?'Underweight':bmi<25?'Healthy range':bmi<30?'Overweight':'Obesity';" +
    "shadow.getElementById('plk-o2').textContent=cat}" +
    "f.addEventListener('input',calc)";
  return ok({ html: toolShell(c, html), css: baseCss(c, TOOL_CSS), js });
};

/* ---- Unit converter (length / mass / temperature) ---- */
export const unitConverter: R = (c) => {
  const html =
    fieldRow("Value", '<input type="number" name="v" step="any" value="1">') +
    fieldRow("From", '<select name="fu"><option value="km">km</option><option value="mi">mi</option><option value="m">m</option><option value="ft">ft</option><option value="kg">kg</option><option value="lb">lb</option><option value="c">°C</option><option value="f">°F</option></select>') +
    fieldRow("To", '<select name="tu"><option value="mi">mi</option><option value="km">km</option><option value="ft">ft</option><option value="m">m</option><option value="lb">lb</option><option value="kg">kg</option><option value="f">°F</option><option value="c">°C</option></select>') +
    '<dl class="plk-out"><dt>Result</dt><dd id="plk-o1">—</dd></dl>';
  const factors = { km: 1000, mi: 1609.344, m: 1, ft: 0.3048, kg: 1, lb: 0.45359237 };
  const js =
    "var F=" + JSON.stringify(factors) + ";" +
    "var f=shadow.getElementById('plk-f');" +
    "function calc(){var v=+f.v.value,from=f.fu.value,to=f.tu.value;var r;" +
    "var temp=(from==='c'||from==='f')!==(to==='c'||to==='f');" +
    "if(temp){r='Pick both temperatures or both distances'}" +
    "else if(from==='c')r=(v*9/5+32).toFixed(1)+' °F';" +
    "else if(from==='f')r=((v-32)*5/9).toFixed(1)+' °C';" +
    "else{r=((v*F[from])/F[to]).toLocaleString(undefined,{maximumFractionDigits:4})+' '+to}" +
    "shadow.getElementById('plk-o1').textContent=r}" +
    "f.addEventListener('input',calc)";
  return ok({ html: toolShell(c, html), css: baseCss(c, TOOL_CSS), js });
};

/* ---- Currency converter (Frankfurter, ECB rates, keyless) ---- */
export const currencyConverter: R = (c) => {
  const from = String(c.text || "USD").toUpperCase().slice(0, 3);
  const html =
    fieldRow("Amount", '<input type="number" name="v" step="any" value="100">') +
    fieldRow("From", '<input name="fu" value="' + esc(from) + '" maxlength="3" style="text-transform:uppercase">') +
    fieldRow("To", '<input name="tu" value="EUR" maxlength="3" style="text-transform:uppercase">') +
    '<dl class="plk-out"><dt>Result</dt><dd id="plk-o1">—</dd><dt style="margin-top:8px">Rate</dt><dd id="plk-o2" style="font-size:14px">—</dd></dl>';
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function calc(){var v=+f.v.value,from=(f.fu.value||'USD').toUpperCase(),to=(f.tu.value||'EUR').toUpperCase();" +
    "if(!v)return;fetch('https://api.frankfurter.app/latest?from='+from+'&to='+to)" +
    ".then(function(r){return r.json()}).then(function(d){var rate=d.rates[to];" +
    "if(!rate){shadow.getElementById('plk-o1').textContent='Unknown pair';return}" +
    "shadow.getElementById('plk-o1').textContent=(v*rate).toLocaleString(undefined,{maximumFractionDigits:2})+' '+to;" +
    "shadow.getElementById('plk-o2').textContent='1 '+from+' = '+rate+' '+to})" +
    ".catch(function(){shadow.getElementById('plk-o1').textContent='Rates unavailable'})}" +
    "f.addEventListener('input',calc)";
  return ok({ html: toolShell(c, html), css: baseCss(c, TOOL_CSS), js });
};

/* ---- Password generator ---- */
export const passwordGenerator: R = (c) => {
  const html =
    fieldRow("Length", '<input class="plk-range" type="range" name="len" min="8" max="64" value="20"><output name="out" style="font-size:12.5px;color:var(--w-muted)">20 characters</output>') +
    '<dl class="plk-out"><dt>Your password</dt><dd id="plk-o1" style="font-family:ui-monospace,monospace;font-size:14px;word-break:break-all">—</dd></dl>' +
    '<button class="plk-btn" type="button" id="plk-gen">Generate</button>';
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "var SETS='abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%^&*-_=+';" +
    "f.len.addEventListener('input',function(){f.out.textContent=f.len.value+' characters'});" +
    "function gen(){var n=+f.len.value,arr=new Uint32Array(n);crypto.getRandomValues(arr);" +
    "var s='';for(var i=0;i<n;i++)s+=SETS[arr[i]%SETS.length];" +
    "shadow.getElementById('plk-o1').textContent=s}" +
    "shadow.getElementById('plk-gen').addEventListener('click',gen);gen();";
  return ok({ html: toolShell(c, html), css: baseCss(c, TOOL_CSS), js });
};

/* ---- QR generator ---- */
export const qrGenerator: R = (c) => {
  const html =
    fieldRow("Link or text", '<input name="t" value="https://planckui.dev" required>') +
    '<dl class="plk-out"><dt>Your QR code</dt><dd id="plk-o1" style="display:flex;justify-content:center"><img id="plk-qr" alt="QR code" width="160" height="160" style="border-radius:10px"></dd></dl>' +
    '<a class="plk-btn" id="plk-dl" target="_blank" rel="noopener">Open full size ↗</a>';
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function upd(){var d=f.t.value||'https://planckui.dev';" +
    "var u='https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=10&data='+encodeURIComponent(d);" +
    "shadow.getElementById('plk-qr').src=u;shadow.getElementById('plk-dl').href=u}" +
    "f.addEventListener('input',upd);upd();";
  return ok({ html: toolShell(c, html), css: baseCss(c, TOOL_CSS + `
.plk-tool .plk-btn { text-decoration: none; justify-content: center; }
`), js });
};

/* ---- Color palette generator ---- */
export const colorPaletteGenerator: R = (c) => {
  const html =
    fieldRow("Base color (hex)", '<input name="t" value="#0f766e" required>') +
    '<dl class="plk-out" style="padding:8px"><dd id="plk-pal" style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin:0"></dd></dl>';
  const js =
    "var f=shadow.getElementById('plk-f');var pal=shadow.getElementById('plk-pal');" +
    "function hexToHsl(hex){var r=parseInt(hex.slice(1,3),16)/255,g=parseInt(hex.slice(3,5),16)/255,b=parseInt(hex.slice(5,7),16)/255;" +
    "var mx=Math.max(r,g,b),mn=Math.min(r,g,b),h=0,s=0,l=(mx+mn)/2;" +
    "if(mx!==mn){var d=mx-mn;s=l>0.5?d/(2-mx-mn):d/(mx+mn);" +
    "h=mx===r?((g-b)/d+(g<b?6:0)):mx===g?((b-r)/d+2):((r-g)/d+4);h*=60}" +
    "return [h,s*100,l*100]}" +
    "function hslCss(h,s,l){return 'hsl('+Math.round(((h%360)+360)%360)+' '+Math.round(s)+'% '+Math.round(Math.min(96,Math.max(4,l)))+'%)'}" +
    "function render(){var hex=f.t.value;if(!/^#[0-9a-f]{6}$/i.test(hex)){pal.innerHTML='<span style=\\'font-size:12px;color:var(--w-muted)\\'>Use a 6-digit hex</span>';return}" +
    "var p=hexToHsl(hex);var ls=[p[2]*0.25,p[2]*0.5,p[2],Math.min(92,p[2]*1.35+14),Math.min(96,p[2]*1.7+24)];" +
    "pal.innerHTML='';ls.forEach(function(l){var c=hslCss(p[0],p[1],l);var d=document.createElement('div');" +
    "d.style.cssText='aspect-ratio:1;border-radius:8px;background:'+c+';display:flex;align-items:flex-end;justify-content:center;overflow:hidden';" +
    "var s=document.createElement('span');s.textContent=c;s.style.cssText='font-size:8.5px;background:oklch(0 0 0/0.35);color:#fff;width:100%;text-align:center;padding:2px 0';" +
    "d.appendChild(s);pal.appendChild(d)})}" +
    "f.addEventListener('input',render);render();";
  return ok({ html: toolShell(c, html), css: baseCss(c, TOOL_CSS + `
.plk-out dd { margin: 0; }
`), js });
};

/* ---- JSON formatter ---- */
export const jsonFormatter: R = (c) => {
  const html =
    fieldRow("Paste JSON", '<textarea name="t" rows="5" style="font-family:ui-monospace,monospace;font-size:12.5px">{\"a\":1,\"b\":[2,3]}</textarea>') +
    '<dl class="plk-out"><dt>Formatted</dt><dd id="plk-o1" style="font-family:ui-monospace,monospace;font-size:12.5px;white-space:pre-wrap;word-break:break-all;margin:0">—</dd></dl>';
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function calc(){try{var v=JSON.parse(f.t.value);" +
    "shadow.getElementById('plk-o1').textContent=JSON.stringify(v,null,2)}" +
    "catch(e){shadow.getElementById('plk-o1').textContent='Not valid JSON yet'}}" +
    "f.addEventListener('input',calc);calc();";
  return ok({ html: toolShell(c, html), css: baseCss(c, TOOL_CSS + `
.plk-out dd { margin: 0; }
`), js });
};

/* ---- Markdown preview (minimal, safe: escape first) ---- */
export const markdownPreview: R = (c) => {
  const html =
    fieldRow("Markdown", '<textarea name="t" rows="5"># Hello\n\nSome **bold** and a [link](https://planckui.dev).</textarea>') +
    '<dl class="plk-out"><dt>Preview</dt><dd id="plk-o1" style="font-size:14px;line-height:1.55;margin:0">—</dd></dl>';
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}" +
    "function md(s){s=esc(s);" +
    "s=s.replace(/^### (.*)$/gm,'<h3 style=\\'margin:8px 0 4px;font-size:15px\\'>$1</h3>');" +
    "s=s.replace(/^## (.*)$/gm,'<h2 style=\\'margin:10px 0 4px;font-size:16px\\'>$1</h2>');" +
    "s=s.replace(/^# (.*)$/gm,'<h1 style=\\'margin:12px 0 6px;font-size:18px\\'>$1</h1>');" +
    "s=s.replace(/\\*\\*([^*]+)\\*\\*/g,'<strong>$1</strong>');s=s.replace(/\\*([^*]+)\\*/g,'<em>$1</em>');" +
    "s=s.replace(/`([^`]+)`/g,'<code style=\\'font-family:ui-monospace;font-size:12.5px\\'>$1</code>');" +
    "s=s.replace(/\\[([^\\]]+)\\]\\((https?:[^)\\s]+)\\)/g,'<a href=\\'$2\\' target=\\'_blank\\' rel=\\'noopener\\'>$1</a>');" +
    "s=s.replace(/^- (.*)$/gm,'• $1');return s.replace(/\\n/g,'<br>')}" +
    "function calc(){shadow.getElementById('plk-o1').innerHTML=md(f.t.value)}" +
    "f.addEventListener('input',calc);calc();";
  return ok({ html: toolShell(c, html), css: baseCss(c, TOOL_CSS + `
.plk-out dd { margin: 0; }
.plk-out a { color: var(--w-accent); }
`), js });
};

/* ---- Invoice generator ---- */
export const invoiceGenerator: R = (c) => {
  const rows = lines(c.items).map((r) => {
    const [qty, price] = (r.right || "").split("|").map((s) => s.trim());
    return { desc: r.left, qty: Number(qty) || 1, price: Number(price) || 0 };
  });
  const total = rows.reduce((s, r) => s + r.qty * r.price, 0);
  const html =
    '<div class="plk-wrap"><div class="plk-inv">' +
    '<div class="plk-invhead"><strong>' + esc(c.text || "Invoice") + "</strong><span>Thank you for your business.</span></div>" +
    "<table>" +
    "<thead><tr><th>Description</th><th>Qty</th><th>Price</th><th>Sum</th></tr></thead><tbody>" +
    rows
      .map(
        (r) =>
          "<tr><td>" + esc(r.desc) + "</td><td>" + r.qty + "</td><td>" + r.price.toFixed(2) +
          "</td><td>" + (r.qty * r.price).toFixed(2) + "</td></tr>"
      )
      .join("") +
    "</tbody></table>" +
    '<div class="plk-invt"><span>Total</span><strong>' + total.toFixed(2) + "</strong></div>" +
    '<button class="plk-btn" id="plk-invcopy" type="button" style="margin-top:14px;align-self:flex-start">Copy summary</button>' +
    "</div>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, `
.plk-inv { max-width: 480px; margin-inline: auto; background: var(--w-card); border: 1px solid var(--w-line);
  border-radius: var(--w-radius); padding: 24px; ${SOFT} }
.plk-invhead { display: flex; flex-direction: column; gap: 2px; margin-bottom: 16px; }
.plk-invhead strong { font-size: 16px; font-weight: 650; letter-spacing: -0.01em; }
.plk-invhead span { font-size: 12.5px; color: var(--w-muted); }
.plk-inv table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
.plk-inv th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em;
  color: var(--w-muted); padding: 6px 4px; border-bottom: 1px solid var(--w-line); }
.plk-inv td { padding: 8px 4px; border-bottom: 1px solid var(--w-line); font-variant-numeric: tabular-nums; }
.plk-invt { display: flex; justify-content: space-between; align-items: baseline; padding-top: 12px; }
.plk-invt span { font-size: 13px; color: var(--w-muted); }
.plk-invt strong { font-size: 22px; font-weight: 650; letter-spacing: -0.02em; font-variant-numeric: tabular-nums;
  color: var(--w-accent); }
`);
  const summary =
    (c.text || "Invoice") + "\n" +
    rows.map((r) => r.desc + " x" + r.qty + " = " + (r.qty * r.price).toFixed(2)).join("\n") +
    "\nTotal: " + total.toFixed(2);
  const js =
    "shadow.getElementById('plk-invcopy').addEventListener('click',function(){" +
    "var b=this;(navigator.clipboard?navigator.clipboard.writeText(" + JSON.stringify(summary) + "):Promise.reject())" +
    ".then(function(){b.textContent='Copied';setTimeout(function(){b.textContent='Copy summary'},1400)})" +
    ".catch(function(){b.textContent='Clipboard unavailable'})});";
  return ok({ html, css, js });
};

void jsEsc;
