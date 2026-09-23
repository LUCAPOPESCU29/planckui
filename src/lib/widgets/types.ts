export type Theme = "light" | "dark";

export interface WidgetConfig {
  theme: Theme;
  accent: string;
  radius: number;
  density: "cozy" | "compact";
  maxWidth?: number;
  speed?: number; // marquee duration in seconds
  target?: string; // countdown target, ISO date
  text?: string; // announcement / promo text
  items?: string; // "left | right" lines for lists (faq, links, plans, logos)
  showBadge: boolean;
  variant?: string;
  [key: string]: unknown;
}

export interface TestimonialData {
  id: string;
  author: string;
  role?: string;
  avatar?: string;
  rating: number;
  text: string;
  videoUrl?: string;
  createdAt: string;
}

export interface RenderInput {
  config: WidgetConfig;
  items?: TestimonialData[];
  extra?: Record<string, unknown>;
}

export interface RenderResult {
  html: string;
  css: string;
  js?: string;
}

export type ControlType =
  | "theme"
  | "color"
  | "range"
  | "select"
  | "toggle"
  | "text"
  | "textarea"
  | "date";

export interface ControlDef {
  key: string;
  label: string;
  type: ControlType;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
  help?: string;
  when?: (c: WidgetConfig) => boolean;
}

export type CategoryId =
  | "proof"
  | "collect"
  | "social"
  | "promo"
  | "media"
  | "commerce"
  | "info"
  | "profiles"
  | "tools"
  | "layout"
  | "community"
  | "utility"
  | "pretty"
  | "aurora"
  | "special"
  | "platforms"
  | "weather";

export interface WidgetDef {
  id: string;
  name: string;
  category: CategoryId;
  blurb: string;
  status: "live" | "planned";
  needsCollection?: boolean;
  defaults?: Partial<WidgetConfig>;
  controls?: ControlDef[];
}

export const CATEGORIES: { id: CategoryId; name: string }[] = [
  { id: "proof", name: "Testimonials & social proof" },
  { id: "collect", name: "Collection & forms" },
  { id: "social", name: "Social feeds" },
  { id: "promo", name: "Promotion & conversion" },
  { id: "media", name: "Media & content" },
  { id: "commerce", name: "Commerce" },
  { id: "info", name: "Info & local business" },
  { id: "profiles", name: "Profiles & stats" },
  { id: "tools", name: "Micro-tools" },
  { id: "layout", name: "Layout & misc" },
  { id: "community", name: "Community & UGC" },
  { id: "utility", name: "Utility & badges" },
  { id: "pretty", name: "Pretty Progress — premium collection" },
  { id: "aurora", name: "Aurora — modern analytics, premium & free" },
  { id: "special", name: "Special — the 21st.dev-inspired collection" },
  { id: "platforms", name: "Platforms — real brands, real logos" },
  { id: "weather", name: "Weather — the Apple-style collection" },
];
