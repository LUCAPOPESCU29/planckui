"use client";

import { useState } from "react";
import { toast } from "./Toaster";

export function CopyChip({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // clipboard API needs HTTPS or localhost; fall back for plain http hosts
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    toast("Copied to clipboard");
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="copychip"
      data-copied={copied}
      title={label ?? "Click to copy"}
      aria-label={label ? `${label}: ${text}` : `Copy: ${text}`}
    >
      {copied ? "Copied" : text}
    </button>
  );
}
