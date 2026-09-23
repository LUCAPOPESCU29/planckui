import { renderWidget, isIframeWidget } from "./widgets/renderers";
import type { WidgetConfig, TestimonialData } from "./widgets/types";

/* Standalone embed generator. Produces a self-contained HTML snippet the user
   can paste into any website — no account, no script tag to our origin.
   Mirrors the embed loader exactly: shadow DOM for isolation, widget JS run
   as new Function("shadow", js)(shadowRoot), and theme following the host
   site's prefers-color-scheme unless the user fixed a theme. */

export type EmbedResult = { ok: true; snippet: string } | { ok: false; error: string };

export function embedSnippet(
  type: string,
  config: WidgetConfig,
  items?: TestimonialData[],
  origin = typeof window !== "undefined" ? window.location.origin : ""
): EmbedResult {
  if (isIframeWidget(type)) {
    if (!origin) return { ok: false, error: "Form widgets need a hosted site — use the dashboard embed instead." };
    const cfg = encodeURIComponent(JSON.stringify(config));
    const src = `${origin}/preview/form?type=${type}&cfg=${cfg}&theme=auto`;
    return {
      ok: true,
      snippet:
        `<!-- PlanckUi form · ${type} — serves from ${origin} -->\n` +
        `<iframe src="${src}" style="width:100%;max-width:520px;height:640px;border:0;border-radius:16px" loading="lazy" title="PlanckUi form"></iframe>\n`,
    };
  }

  let out;
  try {
    out = renderWidget(type, config, items ?? []);
  } catch (e) {
    return { ok: false, error: "This widget could not be exported." };
  }

  const themeSet = config._themeSet === true;
  const fixedDark = config.theme === "dark";

  const js = `
(function () {
  var s = document.currentScript;
  if (!s) return;
  var host = s.previousElementSibling;
  if (!host || host.getAttribute("data-planckui") === null) return;
  var CSS = ${JSON.stringify(out.css)};
  var HTML = ${JSON.stringify(out.html)};
  var JS = ${JSON.stringify(out.js || "")};
  var sh = null;
  function paint() {
    if (!sh) sh = host.attachShadow ? host.attachShadow({ mode: "open" }) : host.shadowRoot;
    sh.innerHTML = "<style>" + CSS + "</style>" + HTML;
    if (JS) { try { new Function("shadow", JS)(sh); } catch (e) {} }
  }
  function applyTheme() {
    var dark = ${themeSet ? fixedDark : "window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches"};
    host.classList.toggle("dark", dark);
    paint();
  }
  applyTheme();
  ${themeSet ? "" : "if (window.matchMedia) { try { window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme); } catch (e) {} }"}
})();`;

  const snippet =
    `<!-- PlanckUi · ${type} — paste this pair where the widget should appear -->\n` +
    `<div data-planckui="${type}" style="display:block"></div>\n` +
    `<script>\n${js}\n</` + `script>\n`;

  return { ok: true, snippet };
}
