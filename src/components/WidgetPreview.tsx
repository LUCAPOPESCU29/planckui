"use client";

import { useEffect, useRef, useState } from "react";
import { renderWidget } from "@/lib/widgets/renderers";
import type { TestimonialData, WidgetConfig } from "@/lib/widgets/types";

/* Renders a widget for real, into a Shadow DOM root, using the exact same
   pure renderer the embed API serves. The wrapper carries a transform,
   which turns it into the containing block for position:fixed widgets,
   so previews stay inside their frame. In preview mode, a CSS override
   constrains fixed/overlay widgets to the container bounds.
   Unless the user explicitly picked a theme (_themeSet), the preview
   follows the site theme — the `dark` class lands on the shadow host,
   which is what every renderer's `:host(.dark)` palette keys off. */
export function WidgetPreview({
  type,
  config,
  items,
  iframeSrc,
  className,
  style,
}: {
  type: string;
  config: WidgetConfig;
  items?: TestimonialData[];
  iframeSrc?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [siteDark, setSiteDark] = useState(false);

  // follow the site theme until the user explicitly picks one
  useEffect(() => {
    const read = () => setSiteDark(document.documentElement.classList.contains("dark"));
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    // bfcache restores don't mutate the class — re-read on back/forward
    window.addEventListener("pageshow", read);
    return () => {
      obs.disconnect();
      window.removeEventListener("pageshow", read);
    };
  }, []);

  const effectiveDark = config._themeSet === true ? config.theme === "dark" : siteDark;

  useEffect(() => {
    const host = hostRef.current;
    if (!host || iframeSrc) return;
    let shadow = host.shadowRoot;
    if (!shadow) shadow = host.attachShadow({ mode: "open" });
    host.classList.toggle("dark", effectiveDark);
    let result;
    try {
      result = renderWidget(type, config, items ?? []);
    } catch {
      shadow.innerHTML =
        '<style>p{font:13px system-ui;color:#888;padding:16px}</style><p>This widget could not be rendered.</p>';
      return;
    }
    shadow.innerHTML = "<style>" + result.css + "</style>" + result.html;
    // preview-mode: constrain fixed/overlay widgets into the frame
    var pmStyle = document.createElement("style");
    pmStyle.textContent = ":host { position: relative !important; overflow: hidden !important; display: block; min-height: 80px; } .plk-fixed-el { position: absolute !important; }";
    shadow.appendChild(pmStyle);
    // constrain fixed-position widgets into the preview frame
    const constrain = document.createElement("style");
    constrain.textContent = [
      "*, *::before, *::after { box-sizing: border-box; }",
      ":host { position: relative !important; overflow: hidden !important; display: block; }",
      "[style*='position:fixed'], [style*='position: fixed'], .plk-fixed { position: absolute !important; }",
    ].join("\\n");
    shadow.appendChild(constrain);
    if (result.js) {
      try {
        new Function("shadow", result.js)(shadow);
      } catch {
        // a broken widget script must never break the host page
      }
    }
  }, [type, config, items, iframeSrc, effectiveDark]);

  // form widgets render in an iframe; the theme travels as a query param
  const themedSrc = iframeSrc
    ? iframeSrc.includes("theme=")
      ? iframeSrc.replace(/([?&])theme=[^&]*/, "$1theme=" + (effectiveDark ? "dark" : "light"))
      : iframeSrc + "&theme=" + (effectiveDark ? "dark" : "light")
    : undefined;

  if (themedSrc) {
    return (
      <div className={className} style={{ transform: "translateZ(0)", ...style }}>
        <iframe
          src={themedSrc}
          title="Widget preview"
          className="w-full rounded-[var(--radius-md)] border border-line"
          style={{ height: 560, background: "var(--surface)", ...style }}
        />
      </div>
    );
  }

  return (
    <div className={className} style={{ transform: "translateZ(0)", ...style }}>
      <div ref={hostRef} />
    </div>
  );
}
