"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CopyChip } from "./CopyChip";

import { WidgetPreview } from "./WidgetPreview";
import { WidgetStudio } from "./WidgetStudio";
import { DEMO_TESTIMONIALS } from "@/lib/widgets/demo-data";
import { defaultsFor, getWidget } from "@/lib/widgets/registry";
import { IFRAME_WIDGETS, isIframeWidget, previewIframeSrc } from "@/lib/widgets/renderers";
import { ensureFontLink } from "@/lib/widgets/theme";
import { embedSnippet } from "@/lib/export-html";
import type { WidgetConfig } from "@/lib/widgets/types";

/* The public customizer: anyone on a widget's catalog page can restyle it
   live — colors, font, shape, effects — before saving anything. The exact
   same theming layer powers the embed, so what you see is what ships. */
export function PublicCustomizer({ defId, autoFocus }: { defId: string; autoFocus?: boolean }) {
  const [studio, setStudio] = useState(() => autoFocus === true);
  const wrapRef = useRef<HTMLDivElement>(null);
  const def = getWidget(defId);
  const [config, setConfig] = useState<WidgetConfig>(() => ({
    ...defaultsFor(def!),
    maxWidth: 900,
  }));
  const [saved, setSaved] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function copyHtml() {
    const result = embedSnippet(defId, config, def?.needsCollection ? DEMO_TESTIMONIALS.slice(0, 5) : undefined);
    if (!result.ok) return;
    try {
      await navigator.clipboard.writeText(result.snippet);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = result.snippet;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  useEffect(() => {
    if (config.dfnt) ensureFontLink(String(config.dfnt));
  }, [config.dfnt]);

  const set = (key: string, value: unknown) => setConfig((cfg) => ({ ...cfg, [key]: value }));
  const items = def?.needsCollection ? DEMO_TESTIMONIALS : undefined;
  const isForm = isIframeWidget(defId);
  const iframeSrc = isForm ? previewIframeSrc(defId, config) : undefined;

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const snippet = `<script async data-widget="YOUR_WIDGET_ID" src="${origin}/api/embed/loader.js"></script>`;

  async function save() {
    const res = await fetch("/api/widgets", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: defId, config }),
    });
    if (res.status === 401) {
      window.location.href = "/login";
      return;
    }
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.widget) {
      setSaved(data.widget.id);
      window.location.href = "/dashboard/widgets/" + data.widget.id;
    }
  }

  if (studio) {
    return (
      <WidgetStudio
        defId={defId}
        onClose={() => { setStudio(false); }}
      />
    );
  }

  return (
    <div ref={wrapRef} id="customize" className={"relative grid items-start gap-6 scroll-mt-24" + (autoFocus ? " rounded-[20px] ring-2 ring-[var(--accent)] p-3" : "")}>
      <button type="button" onClick={() => setStudio(true)}
        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-[var(--surface)] text-ink-2 shadow-sm transition-all duration-150 hover:border-[var(--accent)] hover:text-[var(--accent)]"
        aria-label="Customize this widget" title="Customize — colors, fonts, shape">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21v-4a4 4 0 1 1 4 4H3Z"/><path d="M21 3.2a1.2 1.2 0 0 0-1.7 0L11.5 11l1.5 1.5 7.8-7.8a1.2 1.2 0 0 0 0-1.7Z"/><path d="M11.5 11l1.5 1.5"/></svg>
      </button>
      <div className="flex flex-col gap-4">
        <div className="card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--line-2)" }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--line-2)" }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--line-2)" }} />
            <span className="ml-3 font-mono text-xs text-ink-3">your-site.com — live preview</span>
          </div>
          <WidgetPreview
            type={defId}
            config={config}
            items={def?.needsCollection ? DEMO_TESTIMONIALS.slice(0, 5) : undefined}
            iframeSrc={iframeSrc}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="btn btn-primary" onClick={save}>
            Save this version
          </button>
          <button type="button" className="btn" onClick={copyHtml}>
            {copied ? "Copied ✓ — paste it on your site" : "Copy HTML"}
          </button>
          {saved && <CopyChip text={`${origin}/api/embed/loader.js`} label="Loader script" />}
          {saved && (
            <span className="text-xs text-ink-3">
              Your widget ID: <b className="font-mono">{saved}</b> — get the full snippet from the editor.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

void (null as unknown as WidgetConfig | undefined);
