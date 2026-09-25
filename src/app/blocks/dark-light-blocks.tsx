"use client";

import { useRef, useState } from "react";
import { AppleLogo, ease, spring } from "@/components/navs/shared";

/* The Dark & Light collection — ten special blocks in petrol and mint with
   Apple hardware energy. Dark pieces sit on near-black canvases; light ones
   stay white and editorial. All motion: transform/opacity, under 300ms,
   reduced-motion safe. Colors are hard-coded so exports stay self-contained. */

const D = {
  bg: "#0b0f12",
  card: "#12181d",
  line: "rgba(255,255,255,0.09)",
  ink: "#f2f5f6",
  muted: "rgba(242,245,246,0.55)",
  petrol: "oklch(0.72 0.09 203)",
  mint: "oklch(0.82 0.14 152)",
};
const L = {
  ink: "#1d1d1f",
  muted: "rgba(29,29,31,0.55)",
  line: "rgba(0,0,0,0.09)",
  petrol: "#22707e",
  mint: "#1f9d55",
};

/* D01 — launch hero */
export function DarkLaunch() {
  return (
    <div style={{ background: D.bg, borderRadius: 18, overflow: "hidden", position: "relative", padding: "72px 40px 64px", textAlign: "center" }}>
      <div style={{ position: "absolute", left: "50%", top: -160, width: 560, height: 340, transform: "translateX(-50%)", borderRadius: "50%", background: D.petrol, opacity: 0.22, filter: "blur(90px)" }} aria-hidden="true" />
      <div style={{ position: "absolute", right: "12%", top: -80, width: 260, height: 260, borderRadius: "50%", background: D.mint, opacity: 0.1, filter: "blur(80px)" }} aria-hidden="true" />
      <div style={{ position: "relative" }}>
        <p style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, letterSpacing: "0.22em", color: D.muted, margin: 0 }}>
          SEP 30 — AUTUMN KEYNOTE
        </p>
        <h3 style={{ fontSize: "clamp(30px, 4.5vw, 46px)", fontWeight: 650, letterSpacing: "-0.025em", lineHeight: 1.05, color: D.ink, margin: "18px 0 0" }}>
          One night.
          <br />
          <span style={{ color: D.mint }}>Everything</span> new.
        </h3>
        <p style={{ maxWidth: 460, margin: "18px auto 0", fontSize: 15.5, lineHeight: 1.6, color: D.muted }}>
          Twenty-nine new widgets, a rebuilt editor and the fastest embed we have
          ever shipped. Streaming live and on replay.
        </p>
        <div style={{ marginTop: 28, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button type="button" style={{ background: D.mint, color: "#08221a", border: 0, borderRadius: 999, padding: "12px 26px", font: "inherit", fontWeight: 600, fontSize: 14.5, cursor: "pointer", transition: `transform 160ms ${ease}` }}>
            Watch the film
          </button>
          <button type="button" style={{ background: "transparent", color: D.ink, border: `1px solid ${D.line}`, borderRadius: 999, padding: "12px 26px", font: "inherit", fontSize: 14.5, cursor: "pointer", transition: `border-color 160ms ease, transform 160ms ${ease}` }}>
            Add to calendar
          </button>
        </div>
      </div>
    </div>
  );
}

/* D02 — dark system settings window */
const SETTING_ROWS = [
  { label: "Dark appearance", sub: "Follows your site, not the sun", on: true },
  { label: "Reduced motion", sub: "Every animation settles instantly", on: false },
  { label: "Petrol accents", sub: "The one color that does the talking", on: true },
];
export function DarkSettings() {
  const [rows, setRows] = useState(SETTING_ROWS);
  return (
    <div style={{ padding: "28px 24px 32px", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 560, background: D.card, border: `1px solid ${D.line}`, borderRadius: 16, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", borderBottom: `1px solid ${D.line}` }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span key={c} style={{ width: 10, height: 10, borderRadius: 999, background: c, opacity: 0.85 }} />
          ))}
          <span style={{ marginLeft: 10, fontSize: 11.5, color: D.muted, fontFamily: "ui-monospace, monospace" }}>System Settings</span>
        </div>
        <div style={{ display: "flex" }}>
          <div style={{ width: 148, borderRight: `1px solid ${D.line}`, padding: 10 }}>
            {["Appearance", "Controls", "Wallpaper"].map((s, i) => (
              <div key={s} style={{ fontSize: 12.5, padding: "7px 10px", borderRadius: 8, color: i === 0 ? D.ink : D.muted, background: i === 0 ? "rgba(255,255,255,0.07)" : undefined }}>
                {s}
              </div>
            ))}
          </div>
          <div style={{ flex: 1, padding: "14px 16px 18px" }}>
            {rows.map((r, i) => (
              <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < rows.length - 1 ? `1px solid ${D.line}` : undefined }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: D.ink }}>{r.label}</div>
                  <div style={{ fontSize: 11.5, color: D.muted }}>{r.sub}</div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={r.on}
                  aria-label={r.label}
                  onClick={() => setRows(rows.map((x, j) => (j === i ? { ...x, on: !x.on } : x)))}
                  style={{ width: 42, height: 25, borderRadius: 999, border: 0, cursor: "pointer", position: "relative", background: r.on ? D.mint : "rgba(255,255,255,0.16)", transition: `background 200ms ${ease}` }}
                >
                  <span style={{ position: "absolute", top: 2.5, left: r.on ? 19 : 2.5, width: 20, height: 20, borderRadius: 999, background: "#fff", transition: `left 200ms ${spring}`, boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* D03 — now playing */
export function DarkNowPlaying() {
  const [playing, setPlaying] = useState(true);
  return (
    <div style={{ padding: "34px 24px", display: "flex", justifyContent: "center", background: D.bg, borderRadius: 18 }}>
      <div style={{ width: "100%", maxWidth: 360, background: D.card, border: `1px solid ${D.line}`, borderRadius: 20, padding: 20 }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: 12, background: `linear-gradient(135deg, ${D.petrol}, ${D.mint})`, display: "grid", placeItems: "center" }} aria-hidden="true">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0b0f12" strokeWidth="1.8" strokeLinecap="round">
              <path d="M9 18V6l9-2v12" />
              <circle cx="6.5" cy="18" r="2.5" />
              <circle cx="15.5" cy="16" r="2.5" />
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14.5, fontWeight: 600, color: D.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>The Long Wave</div>
            <div style={{ fontSize: 12.5, color: D.muted }}>Midnight Oil Protocol</div>
          </div>
        </div>
        <div style={{ marginTop: 16, height: 4, borderRadius: 999, background: "rgba(255,255,255,0.12)" }}>
          <div style={{ width: "42%", height: "100%", borderRadius: 999, background: D.mint }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10.5, color: D.muted, fontFamily: "ui-monospace, monospace" }}>
          <span>1:24</span><span>3:30</span>
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 22, marginTop: 10 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill={D.muted} aria-hidden="true"><path d="M6 5h2v14H6zM20 5v14l-11-7z" /></svg>
          <button
            type="button"
            aria-label={playing ? "Pause" : "Play"}
            onClick={() => setPlaying(!playing)}
            style={{ width: 44, height: 44, borderRadius: 999, border: 0, cursor: "pointer", background: D.ink, color: D.bg, display: "grid", placeItems: "center", transition: `transform 160ms ${spring}` }}
          >
            {playing ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4h4v16H7zM13 4h4v16h-4z" /></svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4l14 8-14 8z" /></svg>
            )}
          </button>
          <svg width="18" height="18" viewBox="0 0 24 24" fill={D.muted} aria-hidden="true"><path d="M18 5h-2v14h2zM4 5l11 7-11 7z" /></svg>
        </div>
      </div>
    </div>
  );
}

/* D04 — dynamic island */
export function DarkIsland() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: "#000", borderRadius: 18, padding: "44px 24px 56px", display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        style={{
          background: "#000", border: `1px solid ${D.line}`, cursor: "pointer",
          width: open ? 340 : 210, height: open ? 76 : 37, borderRadius: open ? 26 : 999,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          padding: open ? "10px 14px" : "0 16px",
          transition: `width 300ms ${spring}, height 300ms ${spring}, border-radius 300ms ${spring}`,
          overflow: "hidden",
        }}
        aria-label="Dynamic island"
      >
        <span style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <span style={{ width: open ? 40 : 22, height: open ? 40 : 22, borderRadius: 10, background: `linear-gradient(135deg, ${D.petrol}, ${D.mint})`, flexShrink: 0, transition: `width 300ms ${spring}, height 300ms ${spring}` }} />
          {open && (
            <span style={{ minWidth: 0, textAlign: "left" }}>
              <span style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: D.ink, whiteSpace: "nowrap" }}>The Long Wave</span>
              <span style={{ display: "block", fontSize: 10.5, color: D.muted }}>Midnight Oil Protocol</span>
            </span>
          )}
        </span>
        {open ? (
          <span style={{ display: "flex", alignItems: "flex-end", gap: 2.5, height: 22 }} aria-hidden="true">
            {[10, 16, 7, 14, 20, 11, 17].map((h, i) => (
              <span key={i} style={{ width: 3, height: h, borderRadius: 2, background: D.mint, opacity: 0.5 + (i % 3) * 0.25 }} />
            ))}
          </span>
        ) : (
          <span style={{ width: 8, height: 8, borderRadius: 999, background: D.mint, boxShadow: `0 0 8px ${D.mint}` }} aria-hidden="true" />
        )}
      </button>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{ background: "none", border: 0, color: D.muted, font: "inherit", fontSize: 12.5, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}
      >
        {open ? "Collapse the island" : "Expand the island"}
      </button>
    </div>
  );
}

/* D05 — one-tap checkout */
export function DarkPay() {
  const [done, setDone] = useState(false);
  return (
    <div style={{ padding: "34px 24px", display: "flex", justifyContent: "center", background: D.bg, borderRadius: 18 }}>
      <div style={{ width: "100%", maxWidth: 380, background: D.card, border: `1px solid ${D.line}`, borderRadius: 18, padding: 20 }}>
        <div style={{ display: "flex", gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 12, background: `linear-gradient(135deg, ${D.petrol}, ${D.mint})`, flexShrink: 0 }} aria-hidden="true" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: D.ink }}>PlanckUi Pro — yearly</div>
            <div style={{ fontSize: 12.5, color: D.muted }}>Badge removal · custom domain</div>
          </div>
          <div style={{ fontSize: 14.5, fontWeight: 650, color: D.ink }}>$29</div>
        </div>
        <button
          type="button"
          onClick={() => { setDone(true); window.setTimeout(() => setDone(false), 2400); }}
          style={{
            marginTop: 18, width: "100%", height: 46, borderRadius: 12, border: 0, cursor: "pointer",
            background: done ? D.mint : "#000", color: done ? "#08221a" : "#fff",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            font: "inherit", fontWeight: 600, fontSize: 14.5,
            transition: `background 240ms ${ease}, color 240ms ${ease}, transform 160ms ${ease}`,
          }}
        >
          {done ? (
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M4 10.5l4 4L16 6" /></svg>
          ) : (
            <>
              <AppleLogo size={13} /> Pay
            </>
          )}
        </button>
        <p style={{ margin: "12px 0 0", textAlign: "center", fontSize: 11, color: D.muted }}>
          {done ? "Workspace upgraded — welcome to Pro." : "One tap. Face ID. Never leaves your device."}
        </p>
      </div>
    </div>
  );
}

/* L01 — activity rings card */
function Ring({ pct, color, r, width }: { pct: number; color: string; r: number; width: number }) {
  const circ = 2 * Math.PI * r;
  return (
    <circle cx="45" cy="45" r={r} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round"
      strokeDasharray={`${(circ * pct) / 100} ${circ}`} transform="rotate(-90 45 45)" />
  );
}
export function LightRings() {
  return (
    <div style={{ padding: "34px 24px", display: "flex", justifyContent: "center", background: "#fff", borderRadius: 18 }}>
      <div style={{ width: "100%", maxWidth: 420, display: "flex", alignItems: "center", gap: 26, flexWrap: "wrap", justifyContent: "center" }}>
        <svg width="110" height="110" viewBox="0 0 90 90" aria-label="Three activity rings at 87, 62 and 45 percent">
          <circle cx="45" cy="45" r="38" fill="none" stroke="rgba(34,112,126,0.15)" strokeWidth="9" />
          <Ring pct={87} color="#22707e" r={38} width={9} />
          <circle cx="45" cy="45" r="27" fill="none" stroke="rgba(31,157,85,0.15)" strokeWidth="9" />
          <Ring pct={62} color="#1f9d55" r={27} width={9} />
          <circle cx="45" cy="45" r="16" fill="none" stroke="rgba(245,192,78,0.2)" strokeWidth="9" />
          <Ring pct={45} color="#f5c04e" r={16} width={9} />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 150 }}>
          {[
            ["Move", "420 / 500 kcal", L.petrol],
            ["Exercise", "31 / 45 min", L.mint],
            ["Stand", "9 / 12 hrs", "#f5c04e"],
          ].map(([k, v, c]) => (
            <div key={k} style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ width: 9, height: 9, borderRadius: 999, background: c, flexShrink: 0 }} aria-hidden="true" />
              <span style={{ fontSize: 12, color: L.muted, width: 64 }}>{k}</span>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: L.ink, marginLeft: "auto" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* L02 — home screen widget pair */
export function LightWidgets() {
  return (
    <div style={{ padding: "34px 24px", display: "flex", justifyContent: "center", background: "#f7f6f3", borderRadius: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16, maxWidth: 480, width: "100%" }}>
        <div style={{ background: "#fff", border: `1px solid ${L.line}`, borderRadius: 20, padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", color: L.mint }}>WEDNESDAY</span>
            <span style={{ fontSize: 11, color: L.muted }}>Sep 24</span>
          </div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 9 }}>
            {[["14:00", "Design review"], ["16:30", "Roast pickup"]].map(([t, e]) => (
              <div key={t} style={{ borderLeft: `2.5px solid ${L.petrol}`, paddingLeft: 9 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: L.ink }}>{e}</div>
                <div style={{ fontSize: 11, color: L.muted }}>{t}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: L.petrol, borderRadius: 20, padding: 18, color: "#fff", display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", opacity: 0.8 }}>WIDGET CREDITS</span>
          <span style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-0.03em", marginTop: 10 }}>∞</span>
          <span style={{ fontSize: 12, opacity: 0.85, marginTop: "auto", lineHeight: 1.45 }}>Every widget free, forever. No email asked.</span>
        </div>
      </div>
    </div>
  );
}

/* L03 — spotlight search */
const SPOT_ITEMS = ["Wall of Love", "Countdown timer", "Rating summary", "Newsletter signup", "FAQ accordion"];
export function LightSpotlight() {
  const [q, setQ] = useState("wall");
  const hits = SPOT_ITEMS.filter((x) => x.toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{ padding: "40px 24px 44px", display: "flex", justifyContent: "center", background: "rgba(0,0,0,0.03)", borderRadius: 18 }}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", border: `1px solid ${L.line}`, borderRadius: 14, padding: "13px 16px", boxShadow: "0 12px 40px rgba(0,0,0,0.10)" }}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke={L.muted} strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M9 3a6 6 0 104.4 10.1L17 16.8M9 3a6 6 0 010 12 6 6 0 000-12z" /></svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Spotlight search"
            style={{ flex: 1, border: 0, outline: "none", background: "transparent", font: "inherit", fontSize: 15, color: L.ink }}
            placeholder="Spotlight search"
          />
          <kbd style={{ border: `1px solid ${L.line}`, borderRadius: 5, background: "#fbfbfa", padding: "2px 6px", fontSize: 10.5, fontFamily: "ui-monospace, monospace", color: L.muted }}>⌘K</kbd>
        </div>
        <div style={{ marginTop: 10, background: "#fff", border: `1px solid ${L.line}`, borderRadius: 14, overflow: "hidden" }}>
          {hits.map((x, i) => (
            <div key={x} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: i === 0 ? "rgba(34,112,126,0.08)" : undefined, borderTop: i > 0 ? `1px solid ${L.line}` : undefined }}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke={L.petrol} strokeWidth="1.6" aria-hidden="true"><path d="M6 3h6l3 3v11H6zM9 8h4M9 11h4" /></svg>
              <span style={{ fontSize: 13.5, color: L.ink, flex: 1 }}>{x}</span>
              {i === 0 && <kbd style={{ border: `1px solid ${L.line}`, borderRadius: 4, padding: "1px 5px", fontSize: 10, fontFamily: "ui-monospace, monospace", color: L.muted }}>↩</kbd>}
            </div>
          ))}
          {hits.length === 0 && <div style={{ padding: "10px 14px", fontSize: 13, color: L.muted }}>No results for “{q}”.</div>}
        </div>
      </div>
    </div>
  );
}

/* L04 — iOS settings list */
export function LightSettingsList() {
  const [on, setOn] = useState(true);
  return (
    <div style={{ padding: "34px 24px 38px", display: "flex", justifyContent: "center", background: "#f7f6f3", borderRadius: 18 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ background: "#fff", border: `1px solid ${L.line}`, borderRadius: 12, overflow: "hidden" }}>
          {[
            { g: L.petrol, g2: "#35a3b5", label: "Widgets", val: "295 live" },
            { g: "#1f9d55", g2: "#35c477", label: "Reviews wall", val: "on" },
          ].map((r, i) => (
            <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderTop: i ? `1px solid ${L.line}` : undefined, background: "#fff" }}>
              <span style={{ width: 28, height: 28, borderRadius: 7, background: `linear-gradient(135deg, ${r.g}, ${r.g2})` }} aria-hidden="true" />
              <span style={{ flex: 1, fontSize: 14.5, color: L.ink }}>{r.label}</span>
              <span style={{ fontSize: 13, color: L.muted }}>{r.val}</span>
              <span style={{ color: "rgba(0,0,0,0.25)" }}>›</span>
            </div>
          ))}
        </div>
        <div style={{ background: "#fff", border: `1px solid ${L.line}`, borderRadius: 12, overflow: "hidden", marginTop: 14 }}>
          {[
            { g: "#ff9500", label: "Notifications", toggle: true, on },
            { g: "#5e5ce6", label: "Focus", toggle: true, on: false },
          ].map((r) => (
            <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", background: "#fff" }}>
              <span style={{ width: 28, height: 28, borderRadius: 7, background: r.g, display: "grid", placeItems: "center", color: "#fff", fontSize: 12 }} aria-hidden="true">●</span>
              <span style={{ flex: 1, fontSize: 14.5, color: L.ink }}>{r.label}</span>
              <button
                type="button"
                role="switch"
                aria-checked={r.on}
                aria-label={r.label}
                onClick={() => setOn(r.label === "Notifications" ? !on : on)}
                style={{ width: 46, height: 28, borderRadius: 999, border: 0, cursor: "pointer", position: "relative", background: r.on ? "#34c759" : "#e9e9ea", transition: "background 200ms ease" }}
              >
                <span style={{ position: "absolute", top: 2, left: r.on ? 20 : 2, width: 24, height: 24, borderRadius: 999, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.25)", transition: `left 200ms ${spring}` }} />
              </button>
            </div>
          ))}
        </div>
        <p style={{ margin: "12px 0 0", fontSize: 11.5, color: L.muted, textAlign: "center" }}>
          Grouped inset rows, one hairline apart — the iOS Settings grammar.
        </p>
      </div>
    </div>
  );
}

/* L05 — light control center */
export function LightControlCenter() {
  const [focus, setFocus] = useState(false);
  const [wifi, setWifi] = useState(true);
  const [bt, setBt] = useState(true);
  const [air, setAir] = useState(false);
  const tile: React.CSSProperties = { background: "#fff", border: `1px solid ${L.line}`, borderRadius: 18, padding: 16 };
  const dot = (on: boolean, label: string) => (
    <button
      key={label}
      type="button"
      aria-label={label}
      aria-pressed={on}
      onClick={() => (label === "Wi-Fi" ? setWifi(!wifi) : label === "Bluetooth" ? setBt(!bt) : setAir(!air))}
      style={{
        width: 34, height: 34, borderRadius: 999, border: 0, cursor: "pointer",
        background: on ? L.petrol : "rgba(0,0,0,0.07)", color: on ? "#fff" : "rgba(0,0,0,0.35)",
        display: "grid", placeItems: "center", transition: `background 200ms ${ease}, transform 160ms ${spring}`,
      }}
    >
      <span style={{ fontSize: 11, fontWeight: 700 }}>{label[0]}</span>
    </button>
  );
  return (
    <div style={{ padding: "34px 24px", display: "flex", justifyContent: "center", background: "#f7f6f3", borderRadius: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, maxWidth: 400, width: "100%" }}>
        <div style={{ ...tile, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, justifyItems: "center" }}>
            {dot(wifi, "Wi-Fi")}
            {dot(bt, "Bluetooth")}
            {dot(air, "AirDrop")}
            <span style={{ width: 34, height: 34 }} />
          </div>
          <div style={{ fontSize: 11.5, color: L.muted }}>Connectivity</div>
        </div>
        <div style={{ ...tile, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 12 }}>
          <span style={{ fontSize: 20, color: focus ? L.mint : "rgba(0,0,0,0.3)" }} aria-hidden="true">☾</span>
          <div style={{ fontSize: 11.5, color: L.muted }}>Focus {focus ? "on" : "off"}</div>
        </div>
        <div style={{ ...tile, gridColumn: "1 / -1" }}>
          <div style={{ fontSize: 11.5, color: L.muted, marginBottom: 9 }}>Brightness</div>
          <input type="range" min="10" max="100" defaultValue="72" aria-label="Brightness" style={{ width: "100%", accentColor: L.petrol, height: 24 }} />
        </div>
      </div>
    </div>
  );
}
