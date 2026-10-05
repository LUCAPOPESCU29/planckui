/* Formula-tool factory: pure data in, widget out. A tool is a list of labeled
   numeric fields (vars a, b, c… in field order) and a JS calc body that reads
   those vars and calls o(i, text) to set each result line. The emitted JS
   runs inside the widget's shadow root; no framework, no network. */

import { baseCss } from "../base";
import { fieldRow, TOOL_CSS, toolShell } from "./kit";
import type { WidgetConfig } from "../types";

export type FormulaTool = {
  id: string;
  name: string;
  cat: string;
  blurb: string;
  fields: Array<[string, string]>; // [label, example value]
  outs: string[]; // result labels, in order (plk-o1..n)
  calc: string; // JS body; vars a..g hold field numbers, o(i, text) sets results
};

export function formulaTool(c: WidgetConfig, t: Pick<FormulaTool, "fields" | "outs" | "calc">): { html: string; css: string; js: string } {
  const names = "abcdefg".slice(0, t.fields.length).split("");
  const fields = t.fields
    .map(([label, v], i) =>
      fieldRow(label, `<input type="number" step="any" name="${names[i]}" ${v ? `value="${v}"` : `placeholder="0"`} required>`)
    )
    .join("");
  const outs = t.outs
    .map((l, i) => `<dt>${l}</dt><dd id="plk-o${i + 1}">—</dd>`)
    .join("");
  const decl = names.map((n) => `var ${n}=parseFloat(f.${n}.value)||0`).join(",");
  const js =
    "var f=shadow.getElementById('plk-f');" +
    "function o(i,t){shadow.getElementById('plk-o'+i).textContent=t}" +
    "function calc(){" + decl + ";" + t.calc + "}" +
    "f.addEventListener('input',calc);f.addEventListener('change',calc);calc()";
  const html = toolShell(c, fields + `<dl class="plk-out">${outs}</dl>`);
  return { html, css: baseCss(c, TOOL_CSS), js };
}
