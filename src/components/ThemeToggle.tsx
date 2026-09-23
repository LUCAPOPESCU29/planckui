"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("plk-theme", next ? "dark" : "light");
    } catch {}
    setDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="btn btn-ghost btn-sm"
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      title={dark ? "Light theme" : "Dark theme"}
    >
      {dark ? (
        <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 3.5a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1Zm0 9.5a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm7-3a1 1 0 0 1-1 1h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1ZM5 10a1 1 0 0 1-1 1H3a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1Zm10.66-5.66a1 1 0 0 1 0 1.41l-.7.71a1 1 0 1 1-1.42-1.42l.71-.7a1 1 0 0 1 1.41 0ZM6.46 13.54a1 1 0 0 1 0 1.41l-.71.71a1 1 0 0 1-1.41-1.42l.7-.7a1 1 0 0 1 1.42 0Zm9.2 2.12a1 1 0 0 1-1.41 0l-.71-.7a1 1 0 0 1 1.42-1.42l.7.71a1 1 0 0 1 0 1.41ZM6.46 6.46a1 1 0 0 1-1.42 0l-.7-.71a1 1 0 0 1 1.41-1.41l.71.7a1 1 0 0 1 0 1.42Z" />
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M17.3 13.2A7.5 7.5 0 0 1 6.8 2.7a7.5 7.5 0 1 0 10.5 10.5Z" />
        </svg>
      )}
    </button>
  );
}
