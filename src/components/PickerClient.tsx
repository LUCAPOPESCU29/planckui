"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "./Toaster";
import { LIVE_WIDGETS } from "@/lib/widgets/registry";
import { CATEGORIES } from "@/lib/widgets/types";
import type { WidgetConfig } from "@/lib/widgets/types";

export function PickerClient({
  collections,
  preselect,
}: {
  collections: { id: string; name: string }[];
  preselect?: string;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(preselect ?? null);
  const [name, setName] = useState("");
  const [collectionId, setCollectionId] = useState(collections[0]?.id ?? "");
  const [busy, setBusy] = useState(false);

  const def = LIVE_WIDGETS.find((w) => w.id === selected);

  async function create() {
    if (!def) return;
    setBusy(true);
    const res = await fetch("/api/widgets", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type: def.id,
        name: name.trim() || undefined,
        collectionId: def.needsCollection ? collectionId || undefined : undefined,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast(data.error || "Could not create the widget.");
      return;
    }
    const data = await res.json();
    toast("Widget created");
    router.push(`/dashboard/widgets/${data.widget.id}`);
  }

  return (
    <div className="flex flex-col gap-10">
      {def && (
        <div className="card p-5">
          <h2 className="font-display text-base font-semibold">Set up: {def.name}</h2>
          <p className="mt-1 text-sm text-ink-2">{def.blurb}</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <label className="label" htmlFor="wname">
                Widget name
              </label>
              <input
                id="wname"
                className="input"
                placeholder={def.name}
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
              />
            </div>
            {def.needsCollection && (
              <div className="flex-1">
                <label className="label" htmlFor="wcol">
                  Data source
                </label>
                <select
                  id="wcol"
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
              </div>
            )}
            <div className="flex items-end gap-2">
              <button type="button" className="btn btn-primary" onClick={create} disabled={busy}>
                {busy ? "Creating…" : "Create widget"}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setSelected(null)}>
                Cancel
              </button>
            </div>
          </div>
          {def.needsCollection && collections.length === 0 && (
            <p className="mt-3 text-sm text-ink-3">
              This widget shows testimonials, so it needs a collection. Create one from the
              Overview page — or create the widget now and attach one in the editor.
            </p>
          )}
        </div>
      )}

      {CATEGORIES.map((cat) => {
        const widgets = LIVE_WIDGETS.filter((w) => w.category === cat.id);
        if (!widgets.length) return null;
        return (
          <section key={cat.id} aria-labelledby={`cat-${cat.id}`}>
            <h2 id={`cat-${cat.id}`} className="font-display text-base font-semibold">
              {cat.name}
            </h2>
            <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {widgets.map((w) => (
                <li key={w.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(w.id)}
                    aria-pressed={selected === w.id}
                    className="card h-full p-4 text-left transition-colors duration-150 hover:border-ink-3"
                    style={selected === w.id ? { borderColor: "var(--accent)", borderWidth: 2 } : undefined}
                  >
                    <span className="font-medium">{w.name}</span>
                    <span className="mt-1 block text-sm text-ink-3">{w.blurb}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

export type { WidgetConfig };
