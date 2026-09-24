import { baseCss, esc } from "../base";
import type { WidgetConfig } from "../types";
import { fieldRow, TOOL_CSS, toolShell } from "./kit";

/* 25 finance and business mini-tools. Every one is self-contained: fields in
   the widget form, live math in the shadow DOM, no external data. */

type R = (c: WidgetConfig) => RenderResult2;
type RenderResult2 = import("../types").RenderResult;

const out = (c: WidgetConfig, html: string, js = ""): RenderResult2 =>
  ({ html: toolShell(c, html), css: baseCss(c, TOOL_CSS), js });

const sel = (name: string, label: string, opts: string[], def = ""): string =>
  fieldRow(label, `<select name="${name}">${opts.map((o) => `<option${o === def ? " selected" : ""}>${esc(o)}</option>`).join("")}</select>`);

const num = (name: string, label: string, ph = "", extra = ""): string =>
  fieldRow(label, `<input type="number" name="${name}" step="any" placeholder="${esc(ph)}" ${extra} required>`);

function fx(c: WidgetConfig, body: string): string {
  return "var f=shadow.getElementById('plk-f');" + "function calc(){" + body + "}" + "f.addEventListener('input',calc);f.addEventListener('change',calc);calc()";
}
const money = (v: string) => `el.textContent=(isFinite(${v}))?(+${v}).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}):'—'`;

/* 1 */
export const vatCalculator: R = (c) => {
  const html =
    num("amt", "Amount", "100") +
    num("rate", "VAT / GST rate (%)", "21") +
    sel("mode", "Mode", ["Add tax to net amount", "Remove tax from gross amount"]) +
    '<dl class="plk-out"><dt>Net</dt><dd id="plk-o1">—</dd><dt>Tax</dt><dd id="plk-o2">—</dd><dt>Gross</dt><dd id="plk-o3">—</dd></dl>';
  const js = fx(c, "var a=+f.amt.value,r=+f.rate.value/100;if(!a)return;var net=f.mode.selectedIndex?a/(1+r):a;var netEl=shadow.getElementById('plk-o1');" +
    "netEl.textContent=(net).toLocaleString(undefined,{minimumFractionDigits:2});" +
    money("net*r").replace("el.textContent", "shadow.getElementById('plk-o2').textContent") + ";" +
    money("f.mode.selectedIndex?a:net*(1+r)").replace("el.textContent", "shadow.getElementById('plk-o3').textContent") + ";");
  return out(c, html, js);
};

/* 2 */
export const salesTaxCalculator: R = (c) => {
  const html = num("amt", "Price before tax", "50") + num("rate", "Sales tax (%)", "8.5") +
    '<dl class="plk-out"><dt>Tax</dt><dd id="plk-o1">—</dd><dt>Total</dt><dd id="plk-o2">—</dd></dl>';
  const js = fx(c, "var a=+f.amt.value,r=+f.rate.value/100;if(!a)return;" +
    money("a*r").replace("el.textContent", "shadow.getElementById('plk-o1').textContent") + ";" +
    money("a*(1+r)").replace("el.textContent", "shadow.getElementById('plk-o2').textContent") + ";");
  return out(c, html, js);
};

/* 3 */
export const discountCalculator: R = (c) => {
  const html = num("price", "Original price", "80") + num("pct", "Discount (%)", "25") +
    '<dl class="plk-out"><dt>You save</dt><dd id="plk-o1">—</dd><dt>Final price</dt><dd id="plk-o2">—</dd></dl>';
  const js = fx(c, "var p=+f.price.value,d=+f.pct.value/100;if(!p)return;" +
    money("p*d").replace("el.textContent", "shadow.getElementById('plk-o1').textContent") + ";" +
    money("p*(1-d)").replace("el.textContent", "shadow.getElementById('plk-o2').textContent") + ";");
  return out(c, html, js);
};

/* 4 */
export const compoundInterestCalculator: R = (c) => {
  const html = num("p", "Principal", "1000") + num("r", "Annual rate (%)", "7") + num("y", "Years", "10") +
    sel("n", "Compounding", ["Monthly", "Quarterly", "Yearly"]) +
    '<dl class="plk-out"><dt>Future value</dt><dd id="plk-o1">—</dd><dt>Interest earned</dt><dd id="plk-o2">—</dd></dl>';
  const js = fx(c, "var p=+f.p.value,r=+f.r.value/100,y=+f.y.value,n=[12,4,1][f.n.selectedIndex];if(!p||!n)return;" +
    "var fv=p*Math.pow(1+r/n,n*y);" +
    money("fv").replace("el.textContent", "shadow.getElementById('plk-o1').textContent") + ";" +
    money("fv-p").replace("el.textContent", "shadow.getElementById('plk-o2').textContent") + ";");
  return out(c, html, js);
};

/* 5 */
export const simpleInterestCalculator: R = (c) => {
  const html = num("p", "Principal", "1000") + num("r", "Annual rate (%)", "5") + num("y", "Years", "3") +
    '<dl class="plk-out"><dt>Interest</dt><dd id="plk-o1">—</dd><dt>Total</dt><dd id="plk-o2">—</dd></dl>';
  const js = fx(c, "var p=+f.p.value,r=+f.r.value/100,y=+f.y.value;if(!p)return;" +
    money("p*r*y").replace("el.textContent", "shadow.getElementById('plk-o1').textContent") + ";" +
    money("p*(1+r*y)").replace("el.textContent", "shadow.getElementById('plk-o2').textContent") + ";");
  return out(c, html, js);
};

/* 6 */
export const cagrCalculator: R = (c) => {
  const html = num("a", "Starting value", "1000") + num("b", "Ending value", "2500") + num("y", "Years", "5") +
    '<dl class="plk-out"><dt>CAGR</dt><dd id="plk-o1">—</dd></dl>';
  const js = fx(c, "var a=+f.a.value,b=+f.b.value,y=+f.y.value;if(!a||!b||y<=0)return;" +
    "shadow.getElementById('plk-o1').textContent=((Math.pow(b/a,1/y)-1)*100).toFixed(2)+'%';");
  return out(c, html, js);
};

/* 7 */
export const roiCalculator: R = (c) => {
  const html = num("i", "Invested", "5000") + num("r", "Returned", "6500") +
    '<dl class="plk-out"><dt>Profit</dt><dd id="plk-o1">—</dd><dt>ROI</dt><dd id="plk-o2">—</dd></dl>';
  const js = fx(c, "var i=+f.i.value,r=+f.r.value;if(!i)return;" +
    money("r-i").replace("el.textContent", "shadow.getElementById('plk-o1').textContent") + ";" +
    "shadow.getElementById('plk-o2').textContent=(((r-i)/i)*100).toFixed(1)+'%';");
  return out(c, html, js);
};

/* 8 */
export const profitMarginCalculator: R = (c) => {
  const html = num("rev", "Revenue", "12000") + num("cost", "Cost", "8000") +
    '<dl class="plk-out"><dt>Profit</dt><dd id="plk-o1">—</dd><dt>Margin</dt><dd id="plk-o2">—</dd></dl>';
  const js = fx(c, "var r=+f.rev.value,co=+f.cost.value;if(!r)return;" +
    money("r-co").replace("el.textContent", "shadow.getElementById('plk-o1').textContent") + ";" +
    "shadow.getElementById('plk-o2').textContent=(((r-co)/r)*100).toFixed(1)+'%';");
  return out(c, html, js);
};

/* 9 */
export const markupCalculator: R = (c) => {
  const html = num("cost", "Cost", "40") + num("m", "Margin (%)", "30") +
    '<dl class="plk-out"><dt>Selling price</dt><dd id="plk-o1">—</dd><dt>Profit</dt><dd id="plk-o2">—</dd></dl>';
  const js = fx(c, "var co=+f.cost.value,m=+f.m.value/100;if(!co)return;var p=co/(1-m);" +
    money("p").replace("el.textContent", "shadow.getElementById('plk-o1').textContent") + ";" +
    money("p-co").replace("el.textContent", "shadow.getElementById('plk-o2').textContent") + ";");
  return out(c, html, js);
};

/* 10 */
export const breakEvenCalculator: R = (c) => {
  const html = num("fix", "Fixed costs", "2000") + num("price", "Price per unit", "25") + num("varc", "Variable cost per unit", "10") +
    '<dl class="plk-out"><dt>Break-even units</dt><dd id="plk-o1">—</dd><dt>Break-even revenue</dt><dd id="plk-o2">—</dd></dl>';
  const js = fx(c, "var fx2=+f.fix.value,p=+f.price.value,v=+f.varc.value;if(p-v<=0)return;" +
    "shadow.getElementById('plk-o1').textContent=Math.ceil(fx2/(p-v)).toLocaleString();" +
    money("fx2/(p-v)*p").replace("el.textContent", "shadow.getElementById('plk-o2').textContent") + ";");
  return out(c, html, js);
};

/* 11 */
export const hourlyToSalary: R = (c) => {
  const html = num("rate", "Hourly rate", "25") + num("h", "Hours per week", "40") + num("w", "Weeks per year", "52") +
    '<dl class="plk-out"><dt>Monthly</dt><dd id="plk-o1">—</dd><dt>Annual</dt><dd id="plk-o2">—</dd></dl>';
  const js = fx(c, "var r=+f.rate.value,h=+f.h.value,w=+f.w.value;if(!r)return;var y=r*h*w;" +
    money("y/12").replace("el.textContent", "shadow.getElementById('plk-o1').textContent") + ";" +
    money("y").replace("el.textContent", "shadow.getElementById('plk-o2').textContent") + ";");
  return out(c, html, js);
};

/* 12 */
export const salaryToHourly: R = (c) => {
  const html = num("sal", "Annual salary", "60000") + num("h", "Hours per week", "40") + num("w", "Weeks per year", "52") +
    '<dl class="plk-out"><dt>Hourly</dt><dd id="plk-o1">—</dd><dt>Weekly</dt><dd id="plk-o2">—</dd></dl>';
  const js = fx(c, "var s=+f.sal.value,h=+f.h.value,w=+f.w.value;if(!h||!w)return;" +
    money("s/(h*w)").replace("el.textContent", "shadow.getElementById('plk-o1').textContent") + ";" +
    money("s/w").replace("el.textContent", "shadow.getElementById('plk-o2').textContent") + ";");
  return out(c, html, js);
};

/* 13 */
export const savingsGoalCalculator: R = (c) => {
  const html = num("goal", "Savings goal", "20000") + num("y", "Years", "3") + num("r", "Annual return (%)", "4") +
    '<dl class="plk-out"><dt>Save per month</dt><dd id="plk-o1">—</dd></dl>';
  const js = fx(c, "var g=+f.goal.value,y=+f.y.value,r=+f.r.value/100/12,n=y*12;if(!n)return;" +
    "var m=r?g*r/(Math.pow(1+r,n)-1):g/n;" +
    money("m").replace("el.textContent", "shadow.getElementById('plk-o1').textContent") + ";");
  return out(c, html, js);
};

/* 14 */
export const debtPayoffCalculator: R = (c) => {
  const html = num("bal", "Balance", "5000") + num("apr", "APR (%)", "18") + num("pay", "Monthly payment", "200") +
    '<dl class="plk-out"><dt>Months to payoff</dt><dd id="plk-o1">—</dd><dt>Total interest</dt><dd id="plk-o2">—</dd></dl>';
  const js = "var f=shadow.getElementById('plk-f');" +
    "f.addEventListener('input',calc);f.addEventListener('change',calc);" +
    "function calc(){var b=+f.bal.value,r=+f.apr.value/100/12,p=+f.pay.value;if(!b||!p)return;" +
    "if(p<=b*r){shadow.getElementById('plk-o1').textContent='Payment too low';shadow.getElementById('plk-o2').textContent='—';return}" +
    "var m=0,int=0;while(b>0&&m<1200){b=b*(1+r)-p;int+=r*Math.max(b,0);m++}" +
    "shadow.getElementById('plk-o1').textContent=m.toLocaleString();shadow.getElementById('plk-o2').textContent=int.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}" +
    "calc()";
  return out(c, html, js);
};

/* 15 */
export const inflationCalculator: R = (c) => {
  const html = num("amt", "Amount today", "100") + num("r", "Inflation rate (%)", "3") + num("y", "Years", "10") +
    '<dl class="plk-out"><dt>Will cost</dt><dd id="plk-o1">—</dd><dt>Today\u2019s money buys</dt><dd id="plk-o2">—</dd></dl>';
  const js = fx(c, "var a=+f.amt.value,r=+f.r.value/100,y=+f.y.value;if(!a)return;" +
    money("a*Math.pow(1+r,y)").replace("el.textContent", "shadow.getElementById('plk-o1').textContent") + ";" +
    money("a/Math.pow(1+r,y)").replace("el.textContent", "shadow.getElementById('plk-o2').textContent") + ";");
  return out(c, html, js);
};

/* 16 */
export const netToGrossCalculator: R = (c) => {
  const html = num("net", "Net salary", "3000") + num("r", "Tax rate (%)", "25") +
    '<dl class="plk-out"><dt>Gross</dt><dd id="plk-o1">—</dd><dt>Tax</dt><dd id="plk-o2">—</dd></dl>';
  const js = fx(c, "var n=+f.net.value,r=+f.r.value/100;if(!n)return;" +
    money("n/(1-r)").replace("el.textContent", "shadow.getElementById('plk-o1').textContent") + ";" +
    money("n/(1-r)*r").replace("el.textContent", "shadow.getElementById('plk-o2').textContent") + ";");
  return out(c, html, js);
};

/* 17 */
export const subscriptionCostCalculator: R = (c) => {
  const html = num("m", "Price per month", "12") + num("months", "Months", "24") +
    '<dl class="plk-out"><dt>Total cost</dt><dd id="plk-o1">—</dd><dt>Per day</dt><dd id="plk-o2">—</dd></dl>';
  const js = fx(c, "var m=+f.m.value,mo=+f.months.value;if(!mo)return;var t=m*mo;" +
    money("t").replace("el.textContent", "shadow.getElementById('plk-o1').textContent") + ";" +
    money("t/(mo*30.44)").replace("el.textContent", "shadow.getElementById('plk-o2').textContent") + ";");
  return out(c, html, js);
};

/* 18 */
export const fuelCostCalculator: R = (c) => {
  const html = num("dist", "Distance (km)", "500") + num("cons", "Consumption (L/100km)", "7") + num("price", "Fuel price per liter", "1.75") +
    '<dl class="plk-out"><dt>Fuel needed</dt><dd id="plk-o1">—</dd><dt>Cost</dt><dd id="plk-o2">—</dd></dl>';
  const js = fx(c, "var d=+f.dist.value,co=+f.cons.value,p=+f.price.value;if(!co)return;var l=d*co/100;" +
    "shadow.getElementById('plk-o1').textContent=l.toFixed(1)+' L';" +
    money("l*p").replace("el.textContent", "shadow.getElementById('plk-o2').textContent") + ";");
  return out(c, html, js);
};

/* 19 */
export const electricityCostCalculator: R = (c) => {
  const html = num("w", "Power (watts)", "60") + num("h", "Hours per day", "5") + num("d", "Days", "30") + num("rate", "Price per kWh", "0.30") +
    '<dl class="plk-out"><dt>Energy</dt><dd id="plk-o1">—</dd><dt>Cost</dt><dd id="plk-o2">—</dd></dl>';
  const js = fx(c, "var w=+f.w.value,h=+f.h.value,d=+f.d.value,r=+f.rate.value;if(!w)return;var kwh=w/1000*h*d;" +
    "shadow.getElementById('plk-o1').textContent=kwh.toFixed(2)+' kWh';" +
    money("kwh*r").replace("el.textContent", "shadow.getElementById('plk-o2').textContent") + ";");
  return out(c, html, js);
};

/* 20 */
export const unitPriceCalculator: R = (c) => {
  const html = num("price", "Total price", "4.50") + num("qty", "Units in pack (g, ml, pcs…)", "500") +
    '<dl class="plk-out"><dt>Price per unit</dt><dd id="plk-o1">—</dd><dt>Price per 100 units</dt><dd id="plk-o2">—</dd></dl>';
  const js = fx(c, "var p=+f.price.value,q=+f.qty.value;if(!q)return;" +
    "shadow.getElementById('plk-o1').textContent=(p/q).toFixed(4);" +
    "shadow.getElementById('plk-o2').textContent=(p/q*100).toFixed(2);");
  return out(c, html, js);
};

/* 21 */
export const paymentSplitCalculator: R = (c) => {
  const html = num("total", "Total bill", "120") + num("a", "Person A share (%)", "60") +
    '<dl class="plk-out"><dt>Person A pays</dt><dd id="plk-o1">—</dd><dt>Person B pays</dt><dd id="plk-o2">—</dd></dl>';
  const js = fx(c, "var t=+f.total.value,a=+f.a.value/100;if(!t)return;" +
    money("t*a").replace("el.textContent", "shadow.getElementById('plk-o1').textContent") + ";" +
    money("t*(1-a)").replace("el.textContent", "shadow.getElementById('plk-o2').textContent") + ";");
  return out(c, html, js);
};

/* 22 */
export const aprCalculator: R = (c) => {
  const html = num("loan", "Loan amount", "10000") + num("int", "Total interest + fees", "800") + num("m", "Term (months)", "24") +
    '<dl class="plk-out"><dt>Approx. APR</dt><dd id="plk-o1">—</dd></dl>';
  const js = fx(c, "var p=+f.loan.value,i=+f.int.value,n=+f.m.value;if(!p||!n)return;" +
    "var apr=(2*n*i)/(p*(n+1))*100;" +
    "shadow.getElementById('plk-o1').textContent=apr.toFixed(2)+'%';");
  return out(c, html, js);
};

/* 23 */
export const overtimePayCalculator: R = (c) => {
  const html = num("rate", "Hourly rate", "20") + num("hours", "Hours worked", "46") + num("thresh", "Overtime after (hours)", "40") + num("mult", "Overtime multiplier (×)", "1.5") +
    '<dl class="plk-out"><dt>Regular pay</dt><dd id="plk-o1">—</dd><dt>Overtime pay</dt><dd id="plk-o2">—</dd><dt>Total</dt><dd id="plk-o3">—</dd></dl>';
  const js = "var f=shadow.getElementById('plk-f');" +
    "function calc(){var r=+f.rate.value,h=+f.hours.value,t=+f.thresh.value,m=+f.mult.value;if(!r||!h)return;" +
    "var reg=Math.min(h,t),ot=Math.max(0,h-t);" +
    "shadow.getElementById('plk-o1').textContent=(reg*r).toFixed(2);" +
    "shadow.getElementById('plk-o2').textContent=(ot*r*m).toFixed(2);" +
    "shadow.getElementById('plk-o3').textContent=(reg*r+ot*r*m).toFixed(2)}calc()";
  return out(c, html, js);
};

/* 24 */
export const invoiceTotalCalculator: R = (c) => {
  const html = num("qty", "Quantity", "3") + num("price", "Price per unit", "150") + num("tax", "Tax (%)", "19") +
    '<dl class="plk-out"><dt>Subtotal</dt><dd id="plk-o1">—</dd><dt>Tax</dt><dd id="plk-o2">—</dd><dt>Invoice total</dt><dd id="plk-o3">—</dd></dl>';
  const js = "var f=shadow.getElementById('plk-f');" +
    "function calc(){var q=+f.qty.value,p=+f.price.value,t=+f.tax.value/100;var sub=q*p;" +
    "shadow.getElementById('plk-o1').textContent=sub.toFixed(2);" +
    "shadow.getElementById('plk-o2').textContent=(sub*t).toFixed(2);" +
    "shadow.getElementById('plk-o3').textContent=(sub*(1+t)).toFixed(2)}calc()";
  return out(c, html, js);
};

/* 25 */
export const futureValueCalculator: R = (c) => {
  const html = num("start", "Starting balance", "1000") + num("monthly", "Monthly contribution", "200") + num("r", "Annual return (%)", "6") + num("y", "Years", "10") +
    '<dl class="plk-out"><dt>Future value</dt><dd id="plk-o1">—</dd><dt>Contributions</dt><dd id="plk-o2">—</dd></dl>';
  const js = fx(c, "var s=+f.start.value,m=+f.monthly.value,r=+f.r.value/100/12,y=+f.y.value*12;if(!y)return;" +
    "var fv=s*Math.pow(1+r,y)+(m?(m*(Math.pow(1+r,y)-1))/r:0);" +
    money("fv").replace("el.textContent", "shadow.getElementById('plk-o1').textContent") + ";" +
    money("s+m*y").replace("el.textContent", "shadow.getElementById('plk-o2').textContent") + ";");
  return out(c, html, js);
};
