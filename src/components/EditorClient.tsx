"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CopyChip } from "./CopyChip";
import { toast } from "./Toaster";
import { WidgetPreview } from "./WidgetPreview";
import { DEMO_TESTIMONIALS } from "@/lib/widgets/demo-data";
import { getWidget } from "@/lib/widgets/registry";
import { IFRAME_WIDGETS, renderWidget } from "@/lib/widgets/renderers";
import { DESIGN_CONTROLS, ensureFontLink } from "@/lib/widgets/theme";
import { Control as ControlField } from "./ControlField";
import { ExportPanel } from "./ExportPanel";
import type { ControlDef, TestimonialData, WidgetConfig } from "@/lib/widgets/types";

export function EditorClient({
  id,
  type,
  initialName,
  initialConfig,
  initialCollectionId,
  collections,
  origin,
}: {
  id: string;
  type: string;
  initialName: string;
  initialConfig: WidgetConfig;
  initialCollectionId?: string;
  collections: { id: string; name: string }[];
  origin: string;
}) {
  const def = getWidget(type)!;
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [config, setConfig] = useState<WidgetConfig>(initialConfig);
  const [collectionId, setCollectionId] = useState(initialCollectionId ?? "");
  const [items, setItems] = useState<TestimonialData[] | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const rendered = useMemo(() => {
    if (IFRAME_WIDGETS.has(type)) return null;
    try {
      return renderWidget(type, config, items ?? DEMO_TESTIMONIALS);
    } catch {
      return null;
    }
  }, [type, config, items]);

  const fullHtml = useMemo(() => {
    const siteDark = document.documentElement.classList.contains("dark");
    const dark = config._themeSet ? config.theme === "dark" : siteDark;
    if (IFRAME_WIDGETS.has(type)) {
      const cfg = encodeURIComponent(JSON.stringify(config));
      return '<!DOCTYPE html>\n<html><body style="margin:0;background:' + (dark ? "#161b26" : "#eef1f4") + '">\n<iframe src="/preview/form?type=' + type + '&cfg=' + cfg + '" style="width:100%;height:640px;border:0"></iframe>\n</body></html>';
    }
    const r = rendered;
    if (!r) return "";
    const css = r.css.replace(/:host\(([^)]*)\)/g, ".plk-host$1").replace(/:host/g, ".plk-host");
    return '<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8">\n<style>body{display:grid;place-items:center;min-height:100vh;margin:0;background:' + (dark ? "#161b26" : "#eef1f4") + '}\n.plk-host { display: block; }' + (dark ? "\n.plk-host { background: #1b2130; }" : "") + '\n' + css.replace(/:host \{[^}]*\}/g, "").replace(/:host\([^)]*\) \{[^}]*\}/g, "") + '\n</style>\n</head>\n<body>\n<div class="plk-host' + (dark ? " dark" : "") + '">' + (r.html || "") + '</div>\n<script>' + (r.js || "") + '\n<' + '/script>\n</body>\n</html>';
  }, [type, config, rendered]);

  const configSummary = useMemo(
    () => JSON.stringify({ widget: name, type, settings: config }, null, 2),
    [name, config]
  );

  const needsCollection = !!def.needsCollection;
  const isForm = IFRAME_WIDGETS.has(type);

  // selected Google font loads for the live preview
  useEffect(() => {
    if (config.dfnt) ensureFontLink(String(config.dfnt));
  }, [config.dfnt]);

  // real data in the preview when it exists; sample data otherwise
  useEffect(() => {
    if (!needsCollection || !collectionId) return;
    let alive = true;
    fetch(`/api/collections/${collectionId}/approved`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive && d?.items) setItems(d.items);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [needsCollection, collectionId]);

  const set = (key: string, value: unknown) =>
    setConfig((c) => {
      const n = { ...c, [key]: value };
      if (key === "theme") n._themeSet = true;
      return n;
    });

  const visibleControls = useMemo(
    () => (def.controls ?? []).filter((ct) => !ct.when || ct.when(config)),
    [def.controls, config]
  );

  const dirty =
    JSON.stringify(config) !== JSON.stringify(initialConfig) ||
    name !== initialName ||
    collectionId !== (initialCollectionId ?? "");

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/widgets/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, config, collectionId: collectionId || undefined }),
    });
    setSaving(false);
    if (!res.ok) {
      toast("Could not save. Try again.");
      return;
    }
    toast("Saved");
    router.refresh();
  }

  async function destroy() {
    const res = await fetch(`/api/widgets/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast("Could not delete. Try again.");
      return;
    }
    toast("Widget deleted");
    router.push("/dashboard/widgets");
  }

  const snippet = `<script async data-widget="${id}" src="${origin}/api/embed/loader.js"></script>`;
  const iframeSrc = isForm
    ? "/preview/form?type=" + type + "&cfg=" + encodeURIComponent(JSON.stringify(config))
    : undefined;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link href="/dashboard/widgets" className="text-sm text-ink-3 transition-colors hover:text-ink">
            ← My widgets
          </Link>
          <input
            className="mt-1 block w-full max-w-md border-0 bg-transparent p-0 font-display text-2xl font-semibold tracking-tight outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="Widget name"
            maxLength={60}
          />
          <p className="text-sm text-ink-3">{def.name}</p>
        </div>
        <div className="flex items-center gap-2">
          {confirmDelete ? (
            <>
              <button type="button" className="btn btn-danger btn-sm" onClick={destroy}>
                Really delete
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(false)}>
                Cancel
              </button>
            </>
          ) : (
            <button type="button" className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(true)}>
              Delete
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary"
            onClick={save}
            disabled={saving || !dirty}
          >
            {saving ? "Saving…" : dirty ? "Save changes" : "Saved"}
          </button>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* ---------------- controls ---------------- */}
        <div className="card flex flex-col gap-5 p-5">
          {needsCollection && (
            <div>
              <label className="label" htmlFor="ed-col">
                Data source
              </label>
              <select
                id="ed-col"
                className="select"
                value={collectionId}
                onChange={(e) => setCollectionId(e.target.value)}
              >
                {collections.length === 0 && <option value="">No collections yet</option>}
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {collections.length === 0 && (
                <p className="mt-2 text-xs text-ink-3">
                  Create a collection from the Overview page to feed this widget.
                </p>
              )}
            </div>
          )}

          {visibleControls.map((ct) => (
            <ControlField key={ct.key} def={ct} config={config} set={set} />
          ))}

          <div className="border-t border-line pt-4">
            <h3 className="font-display text-sm font-semibold">Universal design</h3>
            <p className="mb-3 mt-0.5 text-xs text-ink-3">
              {DESIGN_CONTROLS.length}+ controls that work on every widget — colors, type, shape, effects.
            </p>
            {DESIGN_CONTROLS.map((ct) => (
              <ControlField key={"d-" + ct.key} def={ct} config={config} set={set} />
            ))}
          </div>
        </div>

        {/* ---------------- preview + snippet ---------------- */}
        <div className="flex flex-col gap-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <div className="card overflow-hidden">
            <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--line-2)" }} />
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--line-2)" }} />
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--line-2)" }} />
              <span className="ml-3 font-mono text-xs text-ink-3">your-site.com — live preview</span>
            </div>
            <WidgetPreview type={type} config={config} items={items ?? DEMO_TESTIMONIALS} iframeSrc={iframeSrc} />
            {!isForm && items && items.length === 0 && def.needsCollection && (
              <p className="border-t border-line px-5 py-3 text-xs text-ink-3">
                Showing sample data — your widget will show this state until testimonials are
                approved.
              </p>
            )}
            {!isForm && !items && def.needsCollection && (
              <p className="border-t border-line px-5 py-3 text-xs text-ink-3">
                Previewing with sample data. Attach a collection with approved testimonials to
                see the real thing here.
              </p>
            )}
          </div>

          <ExportPanel
            type={type}
            name={name}
            snippet={snippet}
            fullHtml={fullHtml}
            css={rendered?.css ?? ""}
            html={rendered?.html ?? ""}
            js={rendered?.js}
            configSummary={configSummary}
          />
        </div>
      </div>
    </div>
  );
}
