import { useState } from "react";
import { CopyChip } from "./CopyChip";
import { toast } from "./Toaster";

/* Export suite: standalone HTML download, AI prompts for Claude / Codex /
   Z.ai, and a Figma hand-off spec. Company marks drawn as inline SVG. */

function FigmaLogo() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 24a4 4 0 0 0 4-4v-4H8a4 4 0 0 0 0 8Z" fill="#0ACF83" />
      <path d="M4 12a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4Z" fill="#A259FF" />
      <path d="M4 4a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4Z" fill="#F24E1E" />
      <path d="M12 0h4a4 4 0 0 1 0 8h-4V0Z" fill="#FF7262" />
      <path d="M20 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" fill="#1ABCFE" />
    </svg>
  );
}
function ClaudeLogo() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <g stroke="#D97757" strokeWidth="2.6" strokeLinecap="round">
        <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9M4.2 16.5l15.6-9M19.8 16.5l-15.6-9" />
      </g>
    </svg>
  );
}
function CodexLogo() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10a37f" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 2.6l8.1 4.7v9.4L12 21.4l-8.1-4.7V7.3L12 2.6Z" />
      <path d="M12 7.2l4.2 2.4v4.8L12 16.8l-4.2-2.4V9.6L12 7.2Z" />
    </svg>
  );
}
function ZaiLogo() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="6" fill="#0a0a0a" />
      <path d="M7 7.5h10L9 16.5h8" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ExportPanel({
  type,
  name,
  snippet,
  fullHtml,
  css,
  html,
  js,
  configSummary,
}: {
  type: string;
  name: string;
  snippet: string;
  fullHtml: string;
  css: string;
  html: string;
  js?: string;
  configSummary: string;
}) {
  const [target, setTarget] = useState<"Claude" | "Codex" | "Z.ai">("Claude");

  const aiPrompt =
`You are an expert frontend engineer. Recreate the "${name}" widget (${type}) below as a ${
    target === "Claude" ? "clean, accessible React + Tailwind component" :
    target === "Codex" ? "production-ready, self-contained HTML/CSS/JS component" :
    "modern, responsive web component"
  }, preserving the exact design, content and behavior.

Requirements:
- Keep the visual design identical: same colors, spacing, radii, typography and animations.
- Keep all interactivity (tickers, buttons, progress animations) working.
- Make it responsive down to 360px and respect prefers-reduced-motion.
- Return only the final code.

Current implementation (source of truth):
--- HTML ---
${html}
--- CSS ---
${css}
${js ? "--- JS ---\n" + js + "\n" : ""}--- Settings ---
${configSummary}`;

  const figmaSpec =
`FIGMA HAND-OFF SPEC — "${name}" (${type})

Frame: 340 × auto, fill #0A0A0A (or card bg from settings), corner radius var(--w-radius), clip content.
Layers (top to bottom):
1. Header — icon chip 36×36 (accent/10 bg, radius 10), title text 15px semibold, caption 12px #737373.
2. Body — widget-specific content (see HTML below).
3. Footer — outline button, radius 10, 1px accent/50 border, label styled with accent.

Design tokens:
${configSummary}

Source HTML (structure reference for layers):
${html}`;

  function downloadHtml() {
    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".html";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast("HTML file downloaded");
  }

  async function copy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast(label + " copied — paste it into " + target);
    } catch {
      toast("Copy failed — select the code manually");
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <section aria-labelledby="ex-embed">
        <h3 id="ex-embed" className="mb-2 font-display text-base font-semibold">1 · Embed on any site</h3>
        <CopyChip text={snippet} label="Embed snippet" />
      </section>

      <section aria-labelledby="ex-html">
        <h3 id="ex-html" className="mb-2 font-display text-base font-semibold">2 · Standalone HTML file</h3>
        <p className="mb-2 text-sm text-ink-2">
          A complete, dependency-free page with your widget centered — open it anywhere.
        </p>
        <button type="button" className="btn btn-ghost btn-sm" onClick={downloadHtml}>
          Download .html
        </button>
      </section>

      <section aria-labelledby="ex-ai">
        <h3 id="ex-ai" className="mb-2 font-display text-base font-semibold">3 · Rebuild it with AI</h3>
        <p className="mb-3 text-sm text-ink-2">
          Copies a complete prompt: your widget&rsquo;s real code plus instructions — pick your assistant.
        </p>
        <div className="mb-3 flex flex-wrap gap-2">
          {([["Claude", <ClaudeLogo />], ["Codex", <CodexLogo />], ["Z.ai", <ZaiLogo />]] as const).map(([t, logo]) => (
            <button
              key={t}
              type="button"
              onClick={() => setTarget(t)}
              aria-pressed={target === t}
              className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-150"
              style={
                target === t
                  ? { borderColor: "var(--accent)", color: "var(--accent)", background: "var(--accent-soft)" }
                  : { borderColor: "var(--line-2)", color: "var(--ink-2)" }
              }
            >
              {logo} {t}
            </button>
          ))}
        </div>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => copy(aiPrompt, `${target} prompt`)}>
          Copy prompt for {target}
        </button>
      </section>

      <section aria-labelledby="ex-figma">
        <h3 id="ex-figma" className="mb-2 font-display text-base font-semibold">4 · Bring it into Figma</h3>
        <p className="mb-3 text-sm text-ink-2">
          Copies a structured design spec (frame, layers, tokens, content). Paste it into a Figma doc or feed it to the
          html.to.design plugin along with the downloaded HTML file for a pixel layer import.
        </p>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => copy(figmaSpec, "Figma spec")}>
          <FigmaLogo /> Copy Figma spec
        </button>
      </section>
    </div>
  );
}
