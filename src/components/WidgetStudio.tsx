"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Control } from "./ControlField";
import { WidgetPreview } from "./WidgetPreview";
import { CopyChip } from "./CopyChip";
import { renderWidget } from "@/lib/widgets/renderers";
import { DESIGN_CONTROLS } from "@/lib/widgets/theme";
import { DEMO_TESTIMONIALS } from "@/lib/widgets/demo-data";
import { defaultsFor, getWidget } from "@/lib/widgets/registry";
import { isIframeWidget, previewIframeSrc } from "@/lib/widgets/renderers";
import type { WidgetConfig } from "@/lib/widgets/types";

/* Canva-style studio: full-screen editor with a tool panel on the left and
   the live canvas centered. Opens from the paint button; nothing custom
   appears on the public page until this is opened. */

const GROUPS: { label: string; keys: string[] }[] = [
  { label: "Color", keys: ["daccent", "dbgc", "dbg", "dink", "dmut", "dline", "dbc"] },
  { label: "Typography", keys: ["dfnt", "dtsize", "dtweight", "dbsize", "dupper"] },
  { label: "Layout & shape", keys: ["drad", "dpad", "dmaxw", "dalign"] },
  { label: "Effects", keys: ["dshd", "dglow", "dopc", "dbw", "dbadge", "dnote"] },
];

export function WidgetStudio({ defId, onClose }: { defId: string; onClose: () => void }) {
  const def = getWidget(defId)!;
  const [config, setConfig] = useState<WidgetConfig>(() => ({ ...defaultsFor(def), maxWidth: 720 }));
  const [saved, setSaved] = useState(false);
  const items = def.needsCollection ? DEMO_TESTIMONIALS : undefined;
  const isForm = isIframeWidget(defId);

  useEffect(() => {
    if (config.dfnt) {
      const href = "https://fonts.googleapis.com/css2?family=" + encodeURIComponent(String(config.dfnt).replace(/ /g, "+")) + ":wght@400;500;600;700&display=swap";
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
      }
    }
  }, [config.dfnt]);

  function onCloseBtn() { onClose(); }

  async function save() {
    const res = await fetch("/api/widgets", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: defId, config }),
    });
    if (res.status === 401) { window.location.href = "/login"; return; }
    if (res.ok) {
      setSaved(true);
      const data = await res.json();
      setTimeout(() => { window.location.href = "/dashboard/widgets/" + data.widget.id; }, 600);
    }
  }

  const iframeSrc = isForm ? previewIframeSrc(defId, config) : undefined;
  const rendered = useMemo(() => {
    if (isIframeWidget(defId)) return null;
    try { return renderWidget(defId, config, []); } catch { return null; }
  }, [defId, config]);
  const fullHtml = useMemo(() => {
    if (rendered) {
      return '<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8">\n<style>body{display:grid;place-items:center;min-height:100vh;margin:0}\n' + rendered.css + '\n</style>\n</head>\n<body>\n' + rendered.html + '\n<script>' + (rendered.js || '') + '\n<' + '/script>\n</body>\n</html>';
    }
    return '<!DOCTYPE html>\n<html><body style="margin:0;display:grid;place-items:center;min-height:100vh">\n<iframe src="/preview/form?type=' + defId + '&cfg=' + encodeURIComponent(JSON.stringify(config)) + '" style="width:90%;height:640px;border:0"></iframe>\n</body></html>';
  }, [rendered, defId, config]);
  function downloadHtml() {
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = defId + '.html';
    document.body.appendChild(a); a.click(); a.remove();
  }
  const groups = [
    { label: 'Theme & accent', keys: ['theme', 'daccent', 'radius'] },
    { label: 'Colors', keys: ['dbgc', 'dink', 'dmut', 'dline'] },
    { label: 'Text & font', keys: ['dfnt', 'dtsize', 'dtweight', 'dbsize', 'dupper'] },
    { label: 'Shape & layout', keys: ['dpad', 'dmaxw', 'dalign', 'dbw', 'dbc'] },
    { label: 'Effects', keys: ['dshd', 'dglow', 'dopc'] },
  ];
  const set = (key: string, value: unknown) => setConfig((cfg) => ({ ...cfg, [key]: value }));

  return (
    <div className="fixed inset-0 z-[90] flex flex-col bg-[#eceff1] text-ink">
      {/* top bar */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-black/10 bg-white px-4">
        <div className="flex items-center gap-3">
          <button onClick={onCloseBtn} aria-label="Close editor" className="grid h-9 w-9 place-items-center rounded-lg hover:bg-black/5">
            <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"><path d="M5 5l14 14M19 5L5 19" /></svg>
          </button>
          <span className="font-display text-[15px] font-semibold">{def.name} — Studio</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-neutral-500 sm:block">Everything autosaves when you hit Save</span>
          <button onClick={save} className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition-transform duration-150 active:scale-95">
            {saved ? "Saved ✓" : "Save widget"}
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
      <style>{`.ws-ctl { display: flex; flex-direction: column; gap: 4px; margin-bottom: 10px; } .ws-ctl .plk-ctl-lab { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #9ca3af; }`}</style>
        {/* tool panel */}
        <aside className="w-[320px] shrink-0 overflow-y-auto border-r border-black/10 bg-white p-4">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-400">Customize</p>
          <div className="mb-4">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400">Theme</p>
            <div className="grid grid-cols-2 gap-1 rounded-[10px] border border-neutral-200 p-1">
              {(['light', 'dark'] as const).map((t) => (
                <button key={t} type="button" onClick={() => set('theme', t)}
                  className="rounded-lg px-3 py-1.5 text-sm capitalize transition-colors duration-150"
                  style={config.theme === t ? { background: '#111827', color: '#fff' } : { color: '#6b7280' }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          {GROUPS.map((g) => (
            <div key={g.label} className="mb-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-400">{g.label}</p>
              <div className="flex flex-col gap-3">
                {DESIGN_CONTROLS.filter((ct) => g.keys.includes(ct.key)).map((ct) => (
                  <Control key={ct.key} def={ct} config={config} set={set} />
                ))}
              </div>
            </div>
          ))}
          <div className="border-t border-neutral-200 pt-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-400">Export</p>
            <button type="button" onClick={downloadHtml}
              className="w-full rounded-[10px] border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-500">
              Download .html
            </button>
          </div>
          {def.needsCollection && (
            <div className="rounded-xl bg-[#f0fdfa] p-3 text-xs text-neutral-600">
              This widget pulls live testimonials from your collection once saved.
            </div>
          )}
        </aside>

        {/* canvas */}
        <div className="relative flex min-w-0 flex-1 flex-col items-center overflow-y-auto p-6"
          style={{ backgroundImage: "radial-gradient(oklch(0.85 0.01 250 / 0.5) 1px, transparent 1px)", backgroundSize: "22px 22px" }}>
          <div className="w-full max-w-[760px] overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
            <div className="flex items-center gap-2 border-b border-black/10 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
              <span className="ml-3 font-mono text-xs text-neutral-400">your-site.com</span>
            </div>
            <WidgetPreview
              type={defId}
              config={config}
              items={def.needsCollection ? DEMO_TESTIMONIALS.slice(0, 5) : undefined}
              iframeSrc={iframeSrc}
            />
          </div>
          <div className="mt-4 w-full max-w-[760px] rounded-xl bg-white/80 p-3 text-xs text-neutral-500">
            This is the exact render your visitors will get. Save, then paste the embed snippet from the editor.
          </div>
        </div>
      </div>
    </div>
  );
}
