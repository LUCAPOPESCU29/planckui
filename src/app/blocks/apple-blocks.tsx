"use client";

import { useState } from "react";
import { AppleLogo } from "@/components/navs/shared";

/* Ten Apple-design blocks — website sections and OS moments in the Cupertino
   grammar: SF-style type, system blues used sparingly, hairlines, product
   photography treated with restraint, and hardware details done properly. */

const A = {
  ink: "#1d1d1f",
  sub: "#6e6e73",
  blue: "#0066cc",
  bg: "#f5f5f7",
  hair: "rgba(0,0,0,0.08)",
};

const LearnMore = ({ label = "Learn more" }: { label?: string }) => (
  <span style={{ color: A.blue, fontSize: 14 }}>
    {label} <span aria-hidden="true">›</span>
  </span>
);

/* A1 — product hero */
export function AppleProductHero() {
  return (
    <div className="overflow-hidden rounded-[18px] text-center" style={{ background: "#000" }}>
      <div style={{ padding: "64px 24px 40px" }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, letterSpacing: "0.14em", color: "#86868b" }}>IPHONE AIR</p>
        <h3 style={{ margin: "10px 0 0", fontSize: "clamp(34px,5vw,56px)", fontWeight: 650, letterSpacing: "-0.03em", color: "#f5f5f7" }}>
          The thinnest iPhone ever.
        </h3>
        <p style={{ margin: "14px auto 0", maxWidth: 420, fontSize: 16, lineHeight: 1.5, color: "#a1a1a6" }}>
          Titanium frame. All-day battery. A camera that sees in the dark so you
          don't have to.
        </p>
        <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 28 }}>
          <span style={{ color: "#2997ff", fontSize: 15 }}>Learn more ›</span>
          <span style={{ color: "#2997ff", fontSize: 15 }}>Buy ›</span>
        </div>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="https://picsum.photos/seed/plk-iphone-air/1600/620?grayscale" alt="" loading="lazy"
        style={{ width: "100%", height: 300, objectFit: "cover", filter: "brightness(0.75) contrast(1.05)" }} />
    </div>
  );
}

/* A2 — homepage product tile grid */
const TILES = [
  { n: "WATCH", t: "Series 11", s: "Smarter. Brighter. Mightier.", g: "linear-gradient(160deg,#1d1d1f,#3a3a3c)" },
  { n: "IPAD", t: "iPad Pro", s: "Unbelievably thin. Incredibly powerful.", g: "linear-gradient(160deg,#b8c6d8,#5f7391)" },
  { n: "AIRPODS", t: "AirPods Pro 3", s: "Adaptive Audio. Now with heart rate.", g: "linear-gradient(160deg,#f5f5f7,#d8d8dc)" },
  { n: "MAC", t: "MacBook Air", s: "Sky blue color. Sky high performance.", g: "linear-gradient(160deg,#a7c1d9,#33608c)" },
  { n: "TV+", t: "Apple TV+", s: "All original. All amazing.", g: "linear-gradient(160deg,#2c2c2e,#000)" },
  { n: "HOME", t: "HomePod mini", s: "Room-filling sound.", g: "linear-gradient(160deg,#ffe5b4,#f0c060)" },
];
export function AppleTileGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {TILES.map((t) => (
        <div key={t.n} className="flex flex-col items-center overflow-hidden rounded-[18px] pt-10 text-center transition-transform duration-300 hover:scale-[1.01]" style={{ background: t.g }}>
          <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(255,255,255,0.75)" }}>{t.n}</span>
          <h4 style={{ margin: "4px 0 0", fontSize: 21, fontWeight: 650, letterSpacing: "-0.02em", color: t.n === "AIRPODS" ? "#1d1d1f" : "#f5f5f7" }}>{t.t}</h4>
          <p style={{ margin: "3px 0 0", fontSize: 13.5, color: t.n === "AIRPODS" ? "#424245" : "rgba(245,245,247,0.75)" }}>{t.s}</p>
          <div style={{ margin: "10px 0 14px", display: "flex", gap: 16, color: "#2997ff", fontSize: 13.5 }}>
            <span>Learn more ›</span><span>Buy ›</span>
          </div>
          <div style={{ width: "82%", height: 120, borderRadius: "12px 12px 0 0", background: "rgba(0,0,0,0.25)", backdropFilter: "blur(6px)" }} aria-hidden="true" />
        </div>
      ))}
    </div>
  );
}

/* A3 — TV+ cinematic banner */
export function AppleTVBanner() {
  return (
    <div className="relative overflow-hidden rounded-[18px]" style={{ background: "#000" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="https://picsum.photos/seed/plk-tv-severance/1600/560" alt="" loading="lazy"
        style={{ width: "100%", height: 360, objectFit: "cover", filter: "brightness(0.5) saturate(0.7)" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 40px 44px", background: "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.75))" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 600, color: "#f5f5f7" }}>
          <AppleLogo size={13} /> tv+
        </span>
        <h3 style={{ margin: "10px 0 0", fontSize: "clamp(26px,3.6vw,40px)", fontWeight: 700, letterSpacing: "-0.02em", color: "#f5f5f7" }}>
          TheGlyph
        </h3>
        <p style={{ margin: "8px 0 0", maxWidth: 420, fontSize: 14.5, lineHeight: 1.5, color: "rgba(245,245,247,0.8)" }}>
          A designer wakes up in a world where every interface is handwritten.
          New season now streaming.
        </p>
        <div style={{ marginTop: 16, display: "flex", gap: 18, alignItems: "center", fontSize: 13.5 }}>
          <button type="button" style={{ background: "#fff", color: "#000", border: 0, borderRadius: 8, padding: "9px 20px", font: "inherit", fontWeight: 600, cursor: "pointer" }}>
            Try it free
          </button>
          <span style={{ color: "#f5f5f7" }}>Season 2 ›</span>
        </div>
      </div>
    </div>
  );
}

/* A4 — Apple Intelligence card (petrol-mint glow, site palette) */
export function AppleIntelligence() {
  return (
    <div style={{ padding: 8, borderRadius: 24, background: `linear-gradient(120deg, #22707e, #1f9d55 55%, #8fd6a8)` }}>
      <div style={{ borderRadius: 17, background: "#0d1114", padding: "30px 28px", textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: "#8fd6a8" }}>PLANCKUI INTELLIGENCE</p>
        <h3 style={{ margin: "10px 0 0", fontSize: 22, fontWeight: 650, letterSpacing: "-0.02em", color: "#f2f5f6" }}>
          Proof that writes itself.
        </h3>
        <div style={{ margin: "22px auto 0", maxWidth: 400, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: 16, textAlign: "left" }}>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.65, color: "rgba(242,245,246,0.85)" }}>
            Summarize my 42 latest reviews into a trust paragraph for the pricing page.
          </p>
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ display: "flex", gap: 3 }} aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <span key={i} style={{ width: 5, height: 5, borderRadius: 999, background: "#8fd6a8", opacity: 0.4 + i * 0.3 }} />
              ))}
            </span>
            <span style={{ fontSize: 12, color: "rgba(242,245,246,0.6)" }}>Writing trust copy from 42 reviews…</span>
          </div>
        </div>
        <p style={{ margin: "16px 0 0", fontSize: 12, color: "rgba(242,245,246,0.45)" }}>
          Processed on-device. Your reviews never leave the building.
        </p>
      </div>
    </div>
  );
}

/* A5 — iOS notification stack */
export function AppleNotifications() {
  const notes = [
    { app: "Messages", g: "linear-gradient(180deg,#6ce77a,#28c840)", name: "Jonas", text: "The new wall of love is live. It's stupid good.", time: "now", rows: 2 },
    { app: "PlanckUi", g: "linear-gradient(135deg,#22707e,#1f9d55)", name: "PlanckUi", text: "42 reviews collected this week. 39 approved.", time: "8m", rows: 1 },
    { app: "Mail", g: "linear-gradient(180deg,#5fb2ff,#1a7cf0)", name: "Mail", text: "Your Sunday dispatch: the 0.1g bet", time: "1h", rows: 1 },
  ];
  return (
    <div className="flex flex-col items-center gap-2.5" style={{ background: "#f5f5f7", borderRadius: 18, padding: "34px 24px" }}>
      {notes.map((n, i) => (
        <div key={i} style={{ width: "100%", maxWidth: 380, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)", border: "1px solid rgba(0,0,0,0.05)", borderRadius: 18, padding: "12px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", marginLeft: i * 8, marginRight: i * 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 20, height: 20, borderRadius: 6, background: n.g, flexShrink: 0 }} aria-hidden="true" />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#1d1d1f", flex: 1 }}>{n.name}</span>
            <span style={{ fontSize: 11, color: "rgba(29,29,31,0.45)" }}>{n.time}</span>
          </div>
          <p style={{ margin: "5px 0 0", fontSize: 13.5, lineHeight: 1.45, color: "#1d1d1f" }}>{n.text}</p>
        </div>
      ))}
      <p style={{ margin: "10px 0 0", fontSize: 12, color: "#6e6e73" }}>Notifications stack, group and blur — the iOS grammar.</p>
    </div>
  );
}

/* A6 — App Store product card */
export function AppleAppStore() {
  const [got, setGot] = useState(false);
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "34px 24px", background: A.bg, borderRadius: 18 }}>
      <div style={{ width: "100%", maxWidth: 420, background: "#fff", border: `1px solid ${A.hair}`, borderRadius: 18, padding: 20 }}>
        <div style={{ display: "flex", gap: 14 }}>
          <span style={{ width: 64, height: 64, borderRadius: 15, background: `linear-gradient(135deg, #22707e, #1f9d55)`, display: "grid", placeItems: "center", color: "#fff", fontWeight: 700, fontSize: 20, flexShrink: 0 }} aria-hidden="true">pUi</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: A.ink }}>PlanckUi Widgets</div>
            <div style={{ fontSize: 12, color: A.sub }}>Embed social proof anywhere</div>
            <div style={{ marginTop: 5, display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: A.sub }}>
              <span style={{ color: "#f5c04e" }}>★★★★★</span> 4.9 (12.4K)
            </div>
          </div>
          <button
            type="button"
            onClick={() => setGot(!got)}
            style={{
              alignSelf: "flex-start", border: 0, cursor: "pointer", borderRadius: 999,
              padding: "5px 18px", fontSize: 13, fontWeight: 700,
              background: got ? "#f0f0f0" : A.blue, color: got ? "#8e8e93" : A.blue,
              transition: "background 200ms ease, color 200ms ease",
            }}
          >
            {got ? "OPEN" : "GET"}
          </button>
        </div>
        <div style={{ marginTop: 16, display: "flex", justifyContent: "space-around", borderTop: `1px solid ${A.hair}`, paddingTop: 14, textAlign: "center" }}>
          {[["4.9", "★★★★★ 128K Ratings"], ["#2", "Top Utilities"], ["9+", "Age"]].map(([b, s]) => (
            <div key={s}>
              <div style={{ fontSize: 13, fontWeight: 600, color: A.sub }}>{b}</div>
              <div style={{ fontSize: 10, color: A.sub, maxWidth: 90 }}>{s}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, fontSize: 11.5, color: A.sub }}>In-App Purchases</div>
      </div>
    </div>
  );
}

/* A7 — Watch rings strip (dark) */
export function AppleWatchStrip() {
  const stats = [
    ["12,847", "steps today"],
    ["48 min", "in zone 3"],
    ["72 bpm", "resting heart"],
  ];
  return (
    <div className="overflow-hidden rounded-[18px]" style={{ background: "#000" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "28px 32px", flexWrap: "wrap", justifyContent: "center" }}>
        <svg width="76" height="76" viewBox="0 0 90 90" style={{ transform: "rotate(-90deg)", flexShrink: 0 }} aria-label="Activity rings">
          <circle cx="45" cy="45" r="38" fill="none" stroke="#2d0a1e" strokeWidth="9" />
          <circle cx="45" cy="45" r="38" fill="none" stroke="#fa114f" strokeWidth="9" strokeLinecap="round" strokeDasharray="188 239" transform="rotate(-0 45 45)" />
          <circle cx="45" cy="45" r="27" fill="none" stroke="#0a2f12" strokeWidth="9" />
          <circle cx="45" cy="45" r="27" fill="none" stroke="#92e82a" strokeWidth="9" strokeLinecap="round" strokeDasharray="105 170" />
          <circle cx="45" cy="45" r="16" fill="none" stroke="#0a2536" strokeWidth="9" />
          <circle cx="45" cy="45" r="16" fill="none" stroke="#1eeaef" strokeWidth="9" strokeLinecap="round" strokeDasharray="66 101" />
        </svg>
        <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
          {stats.map(([v, l]) => (
            <div key={l}>
              <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", color: "#f5f5f7", fontVariantNumeric: "tabular-nums" }}>{v}</div>
              <div style={{ fontSize: 11.5, color: "#86868b" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* A8 — QuickType keyboard */
export function AppleKeyboard() {
  const [word, setWord] = useState("The");
  const keys = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const home = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
  const key: React.CSSProperties = {
    flex: 1, height: 42, borderRadius: 6, background: "#fff", color: "#1d1d1f",
    display: "grid", placeItems: "center", fontSize: 15.5, fontWeight: 400,
    boxShadow: "0 1px 0 rgba(0,0,0,0.3)", fontFamily: "-apple-system, system-ui, sans-serif",
  };
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "34px 24px", background: A.bg, borderRadius: 18 }}>
      <div style={{ width: "100%", maxWidth: 390, background: "#d1d4d9", borderRadius: 18, padding: "8px 6px 10px" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
          {["The", "They", "This"].map((w) => (
            <button key={w} type="button" onClick={() => setWord(w)}
              style={{ flex: 1, border: 0, background: word === w ? "#007aff" : "transparent", color: word === w ? "#fff" : "#1d1d1f", font: "inherit", fontSize: 13.5, padding: "6px 0", borderRadius: 6, cursor: "pointer" }}>
              {w}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 3, marginBottom: 3 }}>{keys.slice(0, 10).map((k) => <span key={k} style={key}>{k}</span>)}</div>
        <div style={{ display: "flex", gap: 3, marginBottom: 3, padding: "0 14px" }}>{home.map((k) => <span key={k} style={key}>{k}</span>)}</div>
        <div style={{ display: "flex", gap: 3, padding: "0 30px" }}>
          <span style={{ ...key, flex: 1.3, fontSize: 12 }}>⇧</span>
          {keys.slice(6).map((k) => <span key={k} style={key}>{k}</span>)}
          <span style={{ ...key, flex: 1.3, fontSize: 12 }}>⌫</span>
        </div>
        <div style={{ marginTop: 6, textAlign: "center", fontSize: 12.5, color: "#1d1d1f" }}>{word} is what you meant to type.</div>
      </div>
    </div>
  );
}

/* A9 — AirPods pairing card */
export function AppleAirPods() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "38px 24px", background: A.bg, borderRadius: 18 }}>
      <div style={{ textAlign: "center", width: "100%", maxWidth: 320 }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 10 }} aria-hidden="true">
          <span style={{ width: 54, height: 54, borderRadius: "50% 50% 8px 8px", background: "linear-gradient(180deg,#fff,#e8e8ed)", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)" }} />
          <span style={{ width: 54, height: 54, borderRadius: "50% 50% 8px 8px", background: "linear-gradient(180deg,#fff,#e8e8ed)", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)" }} />
        </div>
        <h4 style={{ margin: "18px 0 0", fontSize: 19, fontWeight: 650, letterSpacing: "-0.02em", color: A.ink }}>AirPods Pro</h4>
        <p style={{ margin: "4px 0 0", fontSize: 13.5, color: A.sub }}>Connected · 84% · Adaptive Audio</p>
        <div style={{ marginTop: 18, display: "flex", gap: 10, justifyContent: "center" }}>
          <button type="button" style={{ background: A.blue, color: "#fff", border: 0, borderRadius: 10, padding: "10px 22px", font: "inherit", fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}>Connect</button>
          <button type="button" style={{ background: "transparent", color: A.blue, border: `1px solid ${A.hair}`, borderRadius: 10, padding: "10px 22px", font: "inherit", fontSize: 13.5, cursor: "pointer" }}>Ear Tip Guide</button>
        </div>
        <p style={{ margin: "16px 0 0", fontSize: 11.5, color: A.sub }}>Noise control adapts to your surroundings.</p>
      </div>
    </div>
  );
}

/* A10 — 2FA autofill sheet */
export function AppleTwoFactor() {
  const [filled, setFilled] = useState(false);
  const code = "418 392";
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "38px 24px", background: "#000", borderRadius: 18 }}>
      <div style={{ width: "100%", maxWidth: 340, background: "#1c1c1e", borderRadius: 18, padding: 22, border: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg,#22707e,#1f9d55)", display: "grid", placeItems: "center", color: "#fff", fontWeight: 700, fontSize: 13 }}>pUi</span>
          <div>
            <div style={{ fontSize: 14.5, fontWeight: 600, color: "#f5f5f7" }}>Verification code</div>
            <div style={{ fontSize: 12, color: "#86868b" }}>PlanckUi · from now</div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setFilled(!filled)}
          style={{
            marginTop: 16, width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
            padding: "13px 15px", cursor: "pointer", font: "inherit",
          }}
        >
          <span style={{ fontSize: 20, fontWeight: 650, letterSpacing: "0.28em", color: filled ? "#f5f5f7" : "#86868b", fontVariantNumeric: "tabular-nums" }}>
            {filled ? code.replace(/ /g, "") : "••••••"}
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#2997ff" }}>Autofill</span>
        </button>
        <p style={{ margin: "14px 0 0", fontSize: 12, lineHeight: 1.5, color: "#86868b" }}>
          {filled
            ? "Code filled from Messages. Sign-in continues on the device."
            : "Tap to let Messages fill the code — nothing is typed by hand."}
        </p>
      </div>
    </div>
  );
}
