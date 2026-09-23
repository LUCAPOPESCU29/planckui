import type { ControlDef, WidgetConfig } from "@/lib/widgets/types";

export function Control({
  def,
  config,
  set,
}: {
  def: ControlDef;
  config: WidgetConfig;
  set: (key: string, value: unknown) => void;
}) {
  const value = config[def.key];

  if (def.type === "theme") {
    return (
      <div>
        <span className="label">Theme</span>
        <div className="grid grid-cols-2 gap-1 rounded-[var(--radius-md)] border border-line-2 p-1">
          {(["light", "dark"] as const).map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={config.theme === t}
              className="rounded-[8px] px-3 py-1.5 text-sm capitalize transition-colors duration-150"
              style={
                config.theme === t
                  ? { background: "var(--ink)", color: "var(--bg)" }
                  : { color: "var(--ink-2)" }
              }
              onClick={() => set("theme", t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (def.type === "color") {
    const presets = [
      "oklch(0.47 0.1 203)",
      "oklch(0.5 0.15 320)",
      "oklch(0.55 0.12 145)",
      "oklch(0.6 0.15 40)",
      "oklch(0.3 0.03 260)",
    ];
    return (
      <div>
        <label className="label" htmlFor={`ctl-${def.key}`}>
          {def.label}
        </label>
        <div className="mb-2 flex gap-1.5">
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              aria-label={`Use preset ${p}`}
              onClick={() => set(def.key, p)}
              className="h-6 w-6 rounded-full border transition-transform duration-150 hover:scale-110"
              style={{
                background: p,
                borderColor: value === p ? "var(--ink)" : "var(--line-2)",
                borderWidth: value === p ? 2 : 1,
              }}
            />
          ))}
        </div>
        <input
          id={`ctl-${def.key}`}
          className="input font-mono text-xs"
          value={String(value ?? "")}
          onChange={(e) => set(def.key, e.target.value)}
          spellCheck={false}
        />
      </div>
    );
  }

  if (def.type === "range") {
    return (
      <div>
        <label className="label" htmlFor={`ctl-${def.key}`}>
          {def.label} <span className="font-normal text-ink-3">— {String(value ?? "")}</span>
        </label>
        <input
          id={`ctl-${def.key}`}
          type="range"
          className="w-full accent-[var(--accent)]"
          min={def.min}
          max={def.max}
          step={def.step}
          value={Number(value ?? def.min ?? 0)}
          onChange={(e) => set(def.key, Number(e.target.value))}
        />
      </div>
    );
  }

  if (def.type === "toggle") {
    const on = value !== false && value !== "false";
    return (
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm">{def.label}</span>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-label={def.label}
          onClick={() => set(def.key, !on)}
          className="relative h-6 w-10 shrink-0 rounded-full transition-colors duration-150"
          style={{ background: on ? "var(--accent)" : "var(--line-2)" }}
        >
          <span
            className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-150"
            style={{ transform: on ? "translateX(16px)" : "translateX(0)" }}
          />
        </button>
      </div>
    );
  }

  if (def.type === "select") {
    return (
      <div>
        <label className="label" htmlFor={`ctl-${def.key}`}>
          {def.label}
        </label>
        <select
          id={`ctl-${def.key}`}
          className="select"
          value={String(value ?? "")}
          onChange={(e) => set(def.key, e.target.value)}
        >
          {def.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (def.type === "textarea") {
    return (
      <div>
        <label className="label" htmlFor={`ctl-${def.key}`}>
          {def.label}
        </label>
        <textarea
          id={`ctl-${def.key}`}
          className="textarea font-mono text-xs"
          rows={5}
          value={String(value ?? "")}
          onChange={(e) => set(def.key, e.target.value)}
        />
        {def.help && <p className="mt-1 text-xs text-ink-3">{def.help}</p>}
      </div>
    );
  }

  if (def.type === "date") {
    return (
      <div>
        <label className="label" htmlFor={`ctl-${def.key}`}>
          {def.label}
        </label>
        <input
          id={`ctl-${def.key}`}
          type="datetime-local"
          className="input"
          value={String(value ?? "").slice(0, 16)}
          onChange={(e) => set(def.key, e.target.value ? new Date(e.target.value).toISOString() : "")}
        />
      </div>
    );
  }

  return (
    <div>
      <label className="label" htmlFor={`ctl-${def.key}`}>
        {def.label}
      </label>
      <input
        id={`ctl-${def.key}`}
        className="input"
        value={String(value ?? "")}
        onChange={(e) => set(def.key, e.target.value)}
      />
      {def.help && <p className="mt-1 text-xs text-ink-3">{def.help}</p>}
    </div>
  );
}
