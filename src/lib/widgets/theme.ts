import type { ControlDef, WidgetConfig } from "./types";

/* Universal design layer: 22 controls that work on EVERY widget, on top of
   each widget's own settings. Values ride flat on the config (d* keys) and
   themeVars() turns them into CSS custom properties the base systems consume. */

export const FONT_STACKS: Record<string, string> = {
  sans: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
  mono: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
  rounded: 'ui-rounded, "SF Pro Rounded", "Nunito", system-ui, sans-serif',
  elegant: '"Optima", "Palatino", "Georgia", serif',
};

export const FONTS: { value: string; label: string }[] = [
  { value: "Poppins", label: "Poppins" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Nunito", label: "Nunito" },
  { value: "Nunito Sans", label: "Nunito Sans" },
  { value: "Raleway", label: "Raleway" },
  { value: "Work Sans", label: "Work Sans" },
  { value: "Rubik", label: "Rubik" },
  { value: "Karla", label: "Karla" },
  { value: "Mulish", label: "Mulish" },
  { value: "Manrope", label: "Manrope" },
  { value: "Sora", label: "Sora" },
  { value: "Urbanist", label: "Urbanist" },
  { value: "Figtree", label: "Figtree" },
  { value: "Lexend", label: "Lexend" },
  { value: "Schibsted Grotesk", label: "Schibsted Grotesk" },
  { value: "Spline Sans", label: "Spline Sans" },
  { value: "Onest", label: "Onest" },
  { value: "Wix Madefor Text", label: "Wix Madefor Text" },
  { value: "Bricolage Grotesque", label: "Bricolage Grotesque" },
  { value: "Cabin", label: "Cabin" },
  { value: "Catamaran", label: "Catamaran" },
  { value: "Exo 2", label: "Exo 2" },
  { value: "Titillium Web", label: "Titillium Web" },
  { value: "Fira Sans", label: "Fira Sans" },
  { value: "Source Sans 3", label: "Source Sans 3" },
  { value: "Barlow", label: "Barlow" },
  { value: "Barlow Condensed", label: "Barlow Condensed" },
  { value: "Asap", label: "Asap" },
  { value: "Jost", label: "Jost" },
  { value: "Red Hat Display", label: "Red Hat Display" },
  { value: "Public Sans", label: "Public Sans" },
  { value: "Hanken Grotesk", label: "Hanken Grotesk" },
  { value: "Albert Sans", label: "Albert Sans" },
  { value: "Be Vietnam Pro", label: "Be Vietnam Pro" },
  { value: "Commissioner", label: "Commissioner" },
  { value: "Epilogue", label: "Epilogue" },
  { value: "Gantari", label: "Gantari" },
  { value: "Anek Latin", label: "Anek Latin" },
  { value: "Geologica", label: "Geologica" },
  { value: "Golos Text", label: "Golos Text" },
  { value: "Archivo", label: "Archivo" },
  { value: "Merriweather", label: "Merriweather" },
  { value: "PT Serif", label: "PT Serif" },
  { value: "JetBrains Mono", label: "JetBrains Mono" },
  { value: "Caveat", label: "Caveat" },
];

export function fontHref(dfnt: string): string | null {
  if (!dfnt) return null;
  if (FONT_STACKS[dfnt]) return null;
  const f = FONTS.find((f) => f.value === dfnt);
  if (!f) return null;
  return "https://fonts.googleapis.com/css2?family=" + f.value.replace(/ /g, "+") + ":wght@400;500;600;700&display=swap";
}

export function ensureFontLink(dfnt: string): void {
  if (typeof document === "undefined") return;
  const href = fontHref(dfnt);
  if (!href || document.querySelector('link[href="' + href + '"]')) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

export const DESIGN_CONTROLS: ControlDef[] = [
  { key: "daccent", label: "Accent color", type: "color" },
  { key: "dbgc", label: "Card background", type: "color" },
  { key: "dbg", label: "Page background", type: "color" },
  { key: "dink", label: "Text color", type: "color" },
  { key: "dmut", label: "Secondary text", type: "color" },
  { key: "dline", label: "Border color", type: "color" },
  { key: "dfnt", label: "Font — 45 to pick from", type: "select", options: [
    { value: "", label: "Default (Archivo / Golos Text)" },
    { value: "Poppins", label: "Poppins" },
    { value: "Montserrat", label: "Montserrat" },
    { value: "Nunito", label: "Nunito" },
    { value: "Nunito Sans", label: "Nunito Sans" },
    { value: "Raleway", label: "Raleway" },
    { value: "Work Sans", label: "Work Sans" },
    { value: "Rubik", label: "Rubik" },
    { value: "Karla", label: "Karla" },
    { value: "Mulish", label: "Mulish" },
    { value: "Manrope", label: "Manrope" },
    { value: "Sora", label: "Sora" },
    { value: "Urbanist", label: "Urbanist" },
    { value: "Figtree", label: "Figtree" },
    { value: "Lexend", label: "Lexend" },
    { value: "Schibsted Grotesk", label: "Schibsted Grotesk" },
    { value: "Spline Sans", label: "Spline Sans" },
    { value: "Onest", label: "Onest" },
    { value: "Wix Madefor Text", label: "Wix Madefor Text" },
    { value: "Bricolage Grotesque", label: "Bricolage Grotesque" },
    { value: "Cabin", label: "Cabin" },
    { value: "Catamaran", label: "Catamaran" },
    { value: "Exo 2", label: "Exo 2" },
    { value: "Titillium Web", label: "Titillium Web" },
    { value: "Fira Sans", label: "Fira Sans" },
    { value: "Source Sans 3", label: "Source Sans 3" },
    { value: "Barlow", label: "Barlow" },
    { value: "Barlow Condensed", label: "Barlow Condensed" },
    { value: "Asap", label: "Asap" },
    { value: "Jost", label: "Jost" },
    { value: "Red Hat Display", label: "Red Hat Display" },
    { value: "Public Sans", label: "Public Sans" },
    { value: "Hanken Grotesk", label: "Hanken Grotesk" },
    { value: "Albert Sans", label: "Albert Sans" },
    { value: "Be Vietnam Pro", label: "Be Vietnam Pro" },
    { value: "Commissioner", label: "Commissioner" },
    { value: "Epilogue", label: "Epilogue" },
    { value: "Gantari", label: "Gantari" },
    { value: "Anek Latin", label: "Anek Latin" },
    { value: "Geologica", label: "Geologica" },
    { value: "Golos Text", label: "Golos Text" },
    { value: "Archivo", label: "Archivo" },
    { value: "Merriweather", label: "Merriweather" },
    { value: "PT Serif", label: "PT Serif" },
    { value: "JetBrains Mono", label: "JetBrains Mono" },
    { value: "Caveat", label: "Caveat" },
  ] },
  { key: "dtsize", label: "Title size (px)", type: "range", min: 14, max: 44, step: 1 },
  { key: "dtweight", label: "Title weight", type: "select", options: [
    { value: "", label: "Default" },
    { value: "500", label: "Medium" }, { value: "600", label: "Semibold" },
    { value: "700", label: "Bold" }, { value: "800", label: "Extra bold" } ] },
  { key: "dbsize", label: "Body size (px)", type: "range", min: 11, max: 20, step: 1 },
  { key: "dupper", label: "Uppercase titles", type: "toggle" },
  { key: "dalign", label: "Alignment", type: "select", options: [
    { value: "", label: "Default" }, { value: "left", label: "Left" }, { value: "center", label: "Center" } ] },
  { key: "drad", label: "Corner radius (px)", type: "range", min: 0, max: 32, step: 2 },
  { key: "dpad", label: "Padding (px)", type: "range", min: 8, max: 40, step: 2 },
  { key: "dmaxw", label: "Max width (px)", type: "range", min: 240, max: 800, step: 20 },
  { key: "dbw", label: "Border width (px)", type: "range", min: 0, max: 4, step: 1 },
  { key: "dbc", label: "Border color", type: "color" },
  { key: "dshd", label: "Shadow", type: "select", options: [
    { value: "", label: "Default" },
    { value: "none", label: "None" }, { value: "soft", label: "Soft" }, { value: "deep", label: "Deep" } ] },
  { key: "dglow", label: "Accent glow", type: "range", min: 0, max: 100, step: 5 },
  { key: "dopc", label: "Card opacity", type: "range", min: 30, max: 100, step: 5 },
  { key: "dbadge", label: "Show badge", type: "toggle" },
  { key: "dnote", label: "Caption text", type: "text" },
];

const SHADOWS: Record<string, string> = {
  none: "none",
  soft: "0 1px 2px oklch(0 0 0 / 0.06), 0 8px 24px oklch(0 0 0 / 0.08)",
  deep: "0 24px 48px oklch(0 0 0 / 0.35)",
};

export function themeCss(c: WidgetConfig): string {
  const vars: string[] = [];
  const rules: string[] = [];
  const safe = (x: unknown) => typeof x === "string" && /^[-\w#.%(),\s]+$/.test(x) && x.length < 60;
  const num = (x: unknown) => x !== undefined && x !== null && x !== "" ? Number(x) : null;

  if (c.daccent && safe(c.daccent)) { vars.push(`--w-accent: ${c.daccent};`); }
  if (c.dbgc && safe(c.dbgc)) { vars.push(`--w-cardbg: ${c.dbgc};`, `--w-card: ${c.dbgc};`); }
  if (c.dbg && safe(c.dbg)) { vars.push(`--w-pagebg: ${c.dbg};`, `--w-bg: ${c.dbg};`); }
  if (c.dink && safe(c.dink)) { vars.push(`--w-inkc: ${c.dink};`, `--w-ink: ${c.dink};`); }
  if (c.dmut && safe(c.dmut)) { vars.push(`--w-mutc: ${c.dmut};`, `--w-muted: ${c.dmut};`); }
  if (c.dline && safe(c.dline)) { vars.push(`--w-linec: ${c.dline};`, `--w-line: ${c.dline};`); }
  if (c.dfnt) {
    if (FONT_STACKS[String(c.dfnt)]) vars.push(`--w-font: ${FONT_STACKS[String(c.dfnt)]};`);
    else if (FONTS.some((f) => f.value === c.dfnt)) vars.push(`--w-font: '${c.dfnt}', ui-sans-serif, system-ui, sans-serif;`);
  }
  const tsize = num(c.dtsize), bsize = num(c.dbsize), rad = num(c.drad), pad = num(c.dpad), maxw = num(c.dmaxw);
  const bw = num(c.dbw), glow = num(c.dglow), opc = num(c.dopc);
  if (c.dtsize) vars.push(`--w-tsize: ${tsize}px;`);
  if (c.dtweight) vars.push(`--w-tweight: ${c.dtweight};`);
  if (c.dbsize) vars.push(`--w-bsize: ${bsize}px;`);
  if (c.dupper) vars.push(`--w-tt: uppercase;`);
  if (c.dalign) vars.push(`--w-align: ${c.dalign};`);
  if (rad !== null) vars.push(`--w-radius: ${rad}px;`);
  if (pad !== null) vars.push(`--w-pad: ${pad}px;`);
  if (maxw !== null) vars.push(`--w-max: ${maxw}px;`);
  if (bw !== null) vars.push(`--w-bw: ${bw}px;`);
  if (c.dbc && safe(c.dbc)) vars.push(`--w-bc: ${c.dbc};`);

  if (c.dfnt) rules.push(`:host, .plk-pcard, .plk-au, .plk-scard { font-family: var(--w-font) !important; }`);
  if (c.dbg) rules.push(`:host { background: var(--w-pagebg); }`);
  if (c.dbgc) rules.push(`.plk-pcard, .plk-au, .plk-scard { background: var(--w-cardbg); }`);
  const shadows: string[] = [];
  if (c.dshd && SHADOWS[String(c.dshd)]) shadows.push(SHADOWS[String(c.dshd)]);
  if (glow) shadows.push(`0 0 ${Math.round(glow * 0.4 * 36)}px color-mix(in oklab, var(--w-accent) ${Math.round(glow * 0.6)}%, transparent)`);
  if (shadows.length) rules.push(`.plk-pcard, .plk-au, .plk-scard { box-shadow: ${shadows.join(", ")}; }`);
  if (tsize) rules.push(`.plk-ptitle, .plk-autitle, .plk-scard h3, .plk-pbig { font-size: ${tsize}px !important; }`);
  if (c.dtweight) rules.push(`.plk-ptitle, .plk-autitle, .plk-scard h3 { font-weight: ${c.dtweight} !important; }`);
  if (c.dtsize) rules.push(`h1, h2, h3 { font-size: ${tsize}px; }`);
  if (c.dupper) rules.push(`h1, h2, h3 { text-transform: uppercase; letter-spacing: 0.07em; }`);
  if (bsize) rules.push(`:host { font-size: ${bsize}px; }`);
  if (c.dalign) rules.push(`.plk-wrap, .plk-sheets { text-align: ${c.dalign}; }`);
  if (c.dupper) rules.push(`.plk-ptitle, .plk-autitle, .plk-scard h3 { text-transform: uppercase; letter-spacing: 0.07em; }`);
  if (c.dalign) rules.push(`.plk-pcard, .plk-au, .plk-scard { text-align: ${c.dalign}; } .plk-ptitle, .plk-autitle, .plk-scard h3 { text-align: ${c.dalign}; }`);
  if (c.dink && safe(c.dink)) rules.push(`.plk-ptitle, .plk-autitle, .plk-scard h3, .plk-auval { color: var(--w-inkc) !important; }`);
  if (c.dmut && safe(c.dmut)) rules.push(`.plk-psub, .plk-ssub, .plk-ausub, .plk-aulab { color: var(--w-mutc) !important; }`);
  if (bw !== null || c.dbc) {
    const w = bw !== null ? `${bw}px` : "1px";
    const col = c.dbc && safe(c.dbc) ? String(c.dbc) : "oklch(0.28 0.01 250)";
    rules.push(`.plk-au, .plk-scard { border: ${w} solid ${col}; }`);
  }
  if (opc !== null) rules.push(`.plk-pcard, .plk-au, .plk-scard, .plk-wrap > * { opacity: ${opc / 100}; }`);
  if (c.dbadge === false) rules.push(`.plk-badge, .plk-pcap, .plk-badge { display: none !important; }`);

  const varBlock = vars.length ? ":host {\n  " + vars.join("\n  ") + "\n}" : "";
  return [varBlock, rules.join("\n")].filter(Boolean).join("\n");
}
