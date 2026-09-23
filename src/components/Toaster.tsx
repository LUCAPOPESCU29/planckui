"use client";

import { useEffect, useState } from "react";

export interface ToastPayload {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function toast(message: string, action?: { label: string; run: () => void }) {
  window.dispatchEvent(
    new CustomEvent("plk-toast", {
      detail: action ? { message, actionLabel: action.label, onAction: action.run } : { message },
    })
  );
}

export function Toaster() {
  const [items, setItems] = useState<(ToastPayload & { id: number })[]>([]);

  useEffect(() => {
    let id = 0;
    function onToast(e: Event) {
      const detail = (e as CustomEvent<ToastPayload>).detail;
      const itemId = ++id;
      setItems((prev) => [...prev.slice(-2), { ...detail, id: itemId }]);
      setTimeout(() => {
        setItems((prev) => prev.filter((t) => t.id !== itemId));
      }, 3200);
    }
    window.addEventListener("plk-toast", onToast);
    return () => window.removeEventListener("plk-toast", onToast);
  }, []);

  if (!items.length) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-[90] flex -translate-x-1/2 flex-col items-center gap-2"
    >
      {items.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-3 rounded-[10px] px-4 py-2.5 text-sm shadow-lg"
          style={{ background: "var(--ink)", color: "var(--bg)" }}
        >
          <span>{t.message}</span>
          {t.actionLabel && (
            <button
              type="button"
              onClick={() => {
                t.onAction?.();
                setItems((prev) => prev.filter((x) => x.id !== t.id));
              }}
              className="font-medium underline underline-offset-2"
            >
              {t.actionLabel}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
