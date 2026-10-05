import { baseCss } from "../base";
import type { WidgetConfig } from "../types";
import { fieldRow, TOOL_CSS, toolShell } from "./kit";
import { formulaTool, type FormulaTool } from "./tools-formula-kit";

/* 24 money & work tools, table-driven. */

type Entry = { id: string; name: string; cat: string; blurb: string; tool: Omit<FormulaTool, "id" | "name" | "cat" | "blurb"> };
const mk = (
  id: string, name: string, cat: string, blurb: string,
  fields: FormulaTool["fields"], outs: FormulaTool["outs"], calc: FormulaTool["calc"]
): Entry => ({ id, name, cat, blurb, tool: { fields, outs, calc } });

export const TOOLS: Entry[] = [
  mk("freelance-rate-calculator", "Freelance rate", "tools", "Hourly rate from a target salary.",
    [["Target salary", "60000"], ["Billable weeks", "46"], ["Billable hours/week", "30"]],
    ["Hourly rate", "Day rate"], "o(1,(a/(b*c)||0).toFixed(0));o(2,(a/(b*c)*8).toFixed(0))"),
  mk("retainer-value-calculator", "Retainer value", "tools", "Discounted monthly price and effective rate.",
    [["Monthly hours", "20"], ["Discount %", "15"], ["Hourly rate", "75"]],
    ["Monthly price", "Effective rate"], "var p=b*c*(1-a/100);o(1,p.toFixed(0));o(2,(p/c||0).toFixed(0))"),
  mk("project-margin-calculator", "Project margin", "tools", "Margin and profit from bid and cost.",
    [["Bid", "8000"], ["Cost", "5200"]],
    ["Profit", "Margin"], "o(1,(a-b).toFixed(2));o(2,a?(((a-b)/a)*100).toFixed(1)+'%':'—')"),
  mk("runway-calculator", "Runway calculator", "tools", "Months of operation left in the bank.",
    [["Cash", "50000"], ["Monthly burn", "4200"]],
    ["Runway"], "o(1,b?Math.floor(a/b)+' months':'—')"),
  mk("savings-rate-calculator", "Savings rate", "utility", "The percent of income you keep.",
    [["Monthly income", "4200"], ["Monthly saved", "840"]],
    ["Savings rate"], "o(1,a?((b/a)*100).toFixed(1)+'%':'—')"),
  mk("burn-rate-calculator", "Burn rate", "tools", "Monthly spend from start and end balances.",
    [["Start balance", "50000"], ["End balance", "41600"], ["Months", "2"]],
    ["Monthly burn"], "o(1,c?((a-b)/c).toFixed(0):'—')"),
  mk("income-per-hour", "Income per hour", "tools", "What a session actually paid per hour.",
    [["Paid", "600"], ["Hours", "6.5"]],
    ["Effective hourly"], "o(1,b?(a/b).toFixed(2):'—')"),
  mk("gear-cost-per-use", "Gear cost per use", "utility", "Price divided by honest lifetime uses.",
    [["Price", "240"], ["Expected uses", "120"]],
    ["Cost per use"], "o(1,b?(a/b).toFixed(2):'—')"),
  mk("gift-budget-split", "Gift budget split", "utility", "Divide a gift budget across recipients.",
    [["Budget", "300"], ["Recipients", "5"]],
    ["Per recipient"], "o(1,b?(a/b).toFixed(2):'—')"),
  mk("raise-compound", "Raise compound", "tools", "Salary after three consecutive raises.",
    [["Salary", "60000"], ["Raise 1 %", "4"], ["Raise 2 %", "3"], ["Raise 3 %", "3"]],
    ["Salary after three raises"], "o(1,(a*(1+b/100)*(1+c/100)*(1+d/100)).toFixed(0))"),
  mk("contract-value", "Contract value", "tools", "Total value of a monthly contract.",
    [["Monthly", "890"], ["Months", "24"]],
    ["Total value"], "o(1,(a*b).toLocaleString())"),
  mk("hourly-to-daily", "Hours to days", "tools", "Convert a rate between hour, day and week.",
    [["Hourly rate", "75"], ["Hours per day", "8"]],
    ["Day rate", "Week (5 days)"], "o(1,(a*b).toFixed(0));o(2,(a*b*5).toFixed(0))"),
  mk("deposit-interest", "Deposit interest", "tools", "A year of simple interest on a balance.",
    [["Balance", "10000"], ["Rate %", "3.5"]],
    ["Interest per year"], "o(1,(a*b/100).toFixed(2))"),
  mk("split-by-shares", "Split by shares", "utility", "Unequal splits by share counts.",
    [["Total", "480"], ["Your shares", "3"], ["Total shares", "8"]],
    ["Your share"], "o(1,c?(a*b/c).toFixed(2):'—')"),
  mk("budget-remainder", "Budget remainder", "utility", "What's left after committed spending.",
    [["Budget", "2400"], ["Committed", "1750"]],
    ["Remaining"], "o(1,(a-b).toFixed(2))"),
  mk("cash-flow-month", "Cash flow month", "tools", "In, out and what sticks.",
    [["In", "4200"], ["Out", "3600"]],
    ["Kept this month"], "o(1,(a-b).toFixed(2))"),
  mk("profit-per-unit", "Profit per unit", "tools", "Unit economics from price and unit cost.",
    [["Price", "49"], ["Unit cost", "18"]],
    ["Profit per unit"], "o(1,(a-b).toFixed(2))"),
  mk("markup-from-price", "Markup from price", "tools", "Margin and markup implied by a price.",
    [["Price", "49"], ["Unit cost", "18"]],
    ["Margin", "Markup"], "o(1,a?(((a-b)/a)*100).toFixed(1)+'%':'—');o(2,b?(((a-b)/b)*100).toFixed(1)+'%':'—')"),
  mk("monthly-savings-interest", "Savings interest", "tools", "A month of interest on a balance.",
    [["Balance", "10000"], ["Rate %", "3.5"]],
    ["Interest for the month"], "o(1,(a*b/1200).toFixed(2))"),
  mk("weekly-burn", "Weekly burn", "tools", "Weekly spend from a monthly figure.",
    [["Monthly spend", "2400"]],
    ["Weekly"], "o(1,(a*12/52).toFixed(0))"),
  mk("daily-spend", "Daily spend", "tools", "The daily cost of a monthly habit.",
    [["Monthly", "60"]],
    ["Per day"], "o(1,(a*12/365).toFixed(2))"),
  mk("year-cost", "Yearly cost", "tools", "The yearly cost of a weekly expense.",
    [["Weekly", "18"]],
    ["Per year"], "o(1,(a*52).toFixed(0))"),
  mk("hour-value-2", "Effective hourly", "tools", "Project pay divided by honest hours.",
    [["Project pay", "1800"], ["Honest hours", "22"]],
    ["Effective hourly"], "o(1,b?(a/b).toFixed(2):'—')"),
  mk("overtime-flat", "Flat overtime", "tools", "Extra pay at a flat overtime rate.",
    [["Overtime hours", "6"], ["Overtime rate", "38"]],
    ["Overtime pay"], "o(1,(a*b).toFixed(2))"),
];

export const META = TOOLS.map((t) => ({ id: t.id, name: t.name, cat: t.cat, blurb: t.blurb }));

export const renderers: Record<string, (c: WidgetConfig) => { html: string; css: string; js?: string }> =
  Object.fromEntries(
    TOOLS.map((t) => [
      t.id,
      (c: WidgetConfig) => {
        const vars = "a,b,c,d,e".split(",").slice(0, t.tool.fields.length);
        const decl = vars.map((v, i) => `var ${v}=parseFloat(f.${"abcdefg"[i]}.value)||0`).join(",");
        const js =
          "var f=shadow.getElementById('plk-f');" +
          "function o(i,t){shadow.getElementById('plk-o'+i).textContent=t}" +
          "function calc(){" + decl + ";" + t.tool.calc + "}" +
          "f.addEventListener('input',calc);f.addEventListener('change',calc);calc()";
        const fields = t.tool.fields
          .map((f, i) => fieldRow(f[0], `<input type="number" step="any" name="${"abcdefg"[i]}" ${f[1] ? `value="${f[1]}"` : `placeholder="0"`} required>`))
          .join("");
        const outs = t.tool.outs
          .map((l, i) => `<dt>${l}</dt><dd id="plk-o${i + 1}">—</dd>`)
          .join("");
        return {
          html: toolShell(c, fields + `<dl class="plk-out">${outs}</dl>`),
          css: baseCss(c, TOOL_CSS),
          js,
        };
      },
    ]),
  );
