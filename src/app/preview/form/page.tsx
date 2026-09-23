import { CollectionForm, type FormConfig } from "@/components/CollectionForm";
import { FormRouter } from "@/components/FormWidgets";
import { IFRAME_WIDGETS } from "@/lib/widgets/renderers";
import { getWidget } from "@/lib/widgets/registry";

export const metadata = { title: "Form preview" };

/* Editor/gallery preview target for the form widgets. Reads type + config
   from the query string and runs the form in demo mode (nothing stored).
   `theme` comes from the previewing page and is authoritative — the shared
   layout script (localStorage / prefers-color-scheme) must not win, or the
   iframe disagrees with the theme of the site the user is looking at. */
export default async function PreviewFormPage({
  searchParams,
}: {
  searchParams: Promise<{ cfg?: string; type?: string; theme?: string }>;
}) {
  const { cfg, type, theme } = await searchParams;
  const dark = theme !== "light"; // forms default to their designed dark look
  const formDef = getWidget("testimonial-form")!;
  let config: FormConfig = {
    headline: String(formDef.defaults?.text ?? "How was your experience?"),
    askRating: true,
    askVideo: true,
    askRole: true,
  };
  try {
    if (cfg) {
      const parsed = JSON.parse(decodeURIComponent(cfg)) as Record<string, unknown>;
      config = {
        headline: String(parsed.text || config.headline),
        askRating: parsed.askRating !== false,
        askVideo: parsed.askVideo !== false,
        askRole: parsed.askRole !== false,
      };
    }
  } catch {
    // bad blob falls back to defaults
  }

  // runs before the body paints: overrides whatever the layout init script
  // decided from shared localStorage or the OS preference
  const pinScript = (
    <script
      dangerouslySetInnerHTML={{
        __html: `document.documentElement.classList.toggle('dark',${dark});try{localStorage.setItem('plk-theme','${dark ? "dark" : "light"}')}catch(e){}`,
      }}
    />
  );

  if (type && IFRAME_WIDGETS.has(type) && type !== "testimonial-form" && type !== "star-comment-form") {
    const def = getWidget(type)!;
    let items = String(def.defaults?.items || "");
    let headline = String(def.defaults?.text || def.name);
    try {
      if (cfg) {
        const parsed = JSON.parse(decodeURIComponent(cfg)) as Record<string, unknown>;
        headline = String(parsed.text || headline);
        items = String(parsed.items || items);
      }
    } catch {}
    return (
      <div className={dark ? "dark" : ""}>
        {pinScript}
        <div className="min-h-screen p-4" style={{ background: "var(--bg)", color: "var(--ink)" }}>
          <FormRouter type={type} slug="preview" cfg={{ headline, items }} demo embed />
        </div>
      </div>
    );
  }

  return (
    <div className={dark ? "dark" : ""}>
      {pinScript}
      <div className="min-h-screen px-4 py-8" style={{ background: "var(--bg)", color: "var(--ink)" }}>
        <CollectionForm slug="preview" config={config} demo embed />
      </div>
    </div>
  );
}
