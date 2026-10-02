/* Fifty landing-page templates. Each is a full page rendered by
   LandingRenderer from these tokens — palette, type family, hero layout and
   copy. Twenty are Apple originals; the rest span editorial, Swiss, dark,
   warm and brutalist families. */

export type Palette = {
  bg: string;
  surface: string;
  ink: string;
  muted: string;
  line: string;
};

export type LandingTemplate = {
  slug: string;
  brand: string;
  accent?: string;
  category: "apple" | "editorial" | "swiss" | "dark" | "warm" | "mono" | "brutal" | "gradient";
  kicker: string;
  headline: string;
  sub: string;
  cta: string;
  cta2?: string;
  heroLayout: "center" | "split" | "left" | "bleed";
  serifHead?: boolean;
  radius: number;
  pal: Palette;
  features: [string, string][];
  proof: [string, string][];
  quote: string;
  quoteBy: string;
  footerLine: string;
};

const P = {
  white: { bg: "#ffffff", surface: "#f5f5f7", ink: "#1d1d1f", muted: "#6e6e73", line: "rgba(0,0,0,0.08)" },
  appleDark: { bg: "#000000", surface: "#161617", ink: "#f5f5f7", muted: "#86868b", line: "rgba(255,255,255,0.12)" },
  bone: { bg: "#f7f6f3", surface: "#ffffff", ink: "#1a1a1a", muted: "#787774", line: "rgba(0,0,0,0.08)" },
  charcoal: { bg: "#0c0c0e", surface: "#16181c", ink: "#f2f2f2", muted: "#8a8f98", line: "rgba(255,255,255,0.09)" },
  warm: { bg: "#faf6f1", surface: "#ffffff", ink: "#2f2a25", muted: "#8a8177", line: "rgba(0,0,0,0.08)" },
  night: { bg: "#0a0f1e", surface: "#111827", ink: "#e5e7eb", muted: "#9ca3af", line: "rgba(255,255,255,0.08)" },
  paper: { bg: "#fbfbf9", surface: "#f4f4f0", ink: "#20211f", muted: "#6f716b", line: "rgba(0,0,0,0.09)" },
  ink: { bg: "#111111", surface: "#1b1b1b", ink: "#f7f6f3", muted: "#a3a3a0", line: "rgba(255,255,255,0.1)" },
};

export const LANDING_TEMPLATES: LandingTemplate[] = [
  /* ---------------- Apple originals (20) ---------------- */
  {
    slug: "apple-iphone-air", brand: "iPhone Air", category: "apple",
    kicker: "iPhone Air", headline: "The thinnest iPhone ever.", sub: "Titanium frame, all-day battery and a camera that sees in the dark. So you don't have to.",
    cta: "Buy", cta2: "Learn more", heroLayout: "center", radius: 18, pal: P.appleDark,
    features: [["Titanium frame", "Forged, polished, impossibly light."], ["All-day battery", "Twenty-seven hours of video playback."], ["A19 Pro chip", "The fastest chip in any smartphone."]],
    proof: [["27 hrs", "video playback"], ["6.4 mm", "thin"], ["A19 Pro", "chip"]],
    quote: "It's the first phone that disappeared in my pocket and my workflow at the same time.", quoteBy: "Reviewing, unanimously",
    footerLine: "iPhone Air — from $999 or $41.62/mo. for 24 mo.",
  },
  {
    slug: "apple-watch", brand: "Watch", category: "apple",
    kicker: "WATCH SERIES 11", headline: "Smarter. Brighter. Mightier.", sub: "The best way to watch your health — with a display twice as bright and the toughest glass yet.",
    cta: "Buy", cta2: "Learn more", heroLayout: "center", radius: 18, pal: P.appleDark,
    features: [["Always-On Retina", "Up to 2× brighter at an angle."], ["Sleep score", "Understand your nights at a glance."], ["Cycle tracking", "Private, on-device insights."]],
    proof: [["2×", "brighter display"], ["36 hrs", "battery"], ["5 atm", "water resistant"]],
    quote: "It told me about my sleep apnea before any doctor did.", quoteBy: "Series 11 owner",
    footerLine: "Watch Series 11 — from $399.",
  },
  {
    slug: "apple-macbook-air", brand: "MacBook Air", category: "apple",
    kicker: "MACBOOK AIR", headline: "Sky blue. Sky high.", sub: "The most affordable Mac laptop, now in a color pulled straight from the sky — with the M4 chip inside.",
    cta: "Buy", cta2: "Learn more", heroLayout: "center", radius: 18, pal: { ...P.white },
    features: [["M4 chip", "Faster than the air it's named for."], ["18-hour battery", "A workday, then your evening."], ["Sky blue", "An anodized seal that never fades."]],
    proof: [["13.6″", "Liquid Retina"], ["M4", "chip"], ["1.24 kg", "light"]],
    quote: "It's the laptop I recommend to every student, every parent and every founder.", quoteBy: "Every reviewer, basically",
    footerLine: "MacBook Air — from $999 or $41.62/mo. for 24 mo.",
  },
  {
    slug: "apple-ipad-pro", brand: "iPad Pro", category: "apple",
    kicker: "IPAD PRO", headline: "Unbelievably thin. Incredibly powerful.", sub: "The thinnest Apple product ever made — with the outrageous performance of M4 and the precision of ProMotion.",
    cta: "Buy", cta2: "Learn more", heroLayout: "center", radius: 18, pal: P.charcoal,
    features: [["Ultra Retina XDR", "The brightest, most precise display."], ["Apple Pencil Pro", "Squeeze, roll, hover."], ["5.1 mm", "Thinner than a pencil."]],
    proof: [["5.1 mm", "thin"], ["M4", "chip"], ["Tandem OLED", "display"]],
    quote: "It replaced my laptop, my sketchbook and half my desk.", quoteBy: "Illustrator, verified owner",
    footerLine: "iPad Pro — from $999.",
  },
  {
    slug: "apple-airpods-pro", brand: "AirPods Pro", category: "apple",
    kicker: "AIRPODS PRO", headline: "Adaptive Audio. Now with heart rate.", sub: "Noise control that understands your surroundings — and a pulse sensor that understands you.",
    cta: "Buy", cta2: "Learn more", heroLayout: "center", radius: 18, pal: { ...P.white },
    features: [["Adaptive Audio", "Blends transparency and cancellation."], ["Heart rate sensing", "Precision during workouts."], ["H2 chip", "The brains behind the quiet."]],
    proof: [["2×", "more noise canceled"], ["6 hrs", "listening"], ["IP54", "sweat resistant"]],
    quote: "I hear the commute disappear and my heart rate appear. Magic.", quoteBy: "Runner, verified owner",
    footerLine: "AirPods Pro — from $249.",
  },
  {
    slug: "apple-tv", brand: "Apple TV+", category: "apple",
    kicker: " TV+", headline: "All original. All amazing.", sub: "Emmy-winning stories you can't see anywhere else — streaming in 4K HDR on every screen you own.",
    cta: "Try it free", cta2: "Watch now", heroLayout: "bleed", radius: 0, pal: P.charcoal,
    features: [["Originals", "Stories with a point of view."], ["4K HDR", "Dolby Vision on every title."], ["Share Play", "Watch together, apart."]],
    proof: [["250+", "originals"], ["4K HDR", "on everything"], ["6 accounts", "family sharing"]],
    quote: "The only streaming service I keep without thinking about it.", quoteBy: "Subscriber since 2019",
    footerLine: "Apple TV+ — $9.99/mo. after free trial.",
  },
  {
    slug: "apple-music", brand: "Apple Music", category: "apple",
    kicker: "APPLE MUSIC", headline: "100 million songs. Zero interruptions.", sub: "Spatial Audio that puts you inside the track, lossless the way it was recorded, and Sing along to every chorus.",
    cta: "Try it free", cta2: "Learn more", heroLayout: "center", radius: 18, pal: { ...P.charcoal },
    features: [["Spatial Audio", "Music that moves around you."], ["Lossless", "Every bit of every master."], ["Sing", "Karaoke for your living room."]],
    proof: [["100M", "songs"], ["Lossless", "always"], ["0", "ads"]],
    quote: "Spatial Audio ruined regular headphones for me. Worth it.", quoteBy: "Listener, verified",
    footerLine: "Apple Music — $10.99/mo. after trial.",
  },
  {
    slug: "apple-pay", brand: "Apple Pay", category: "apple",
    kicker: "APPLE PAY", headline: "Pay the Apple way.", sub: "Faster checkout, safer than cards, private by design. Your card numbers are never stored or shared.",
    cta: "Set up Apple Pay", cta2: "Learn more", heroLayout: "center", radius: 18, pal: { ...P.white },
    features: [["Private by design", "Numbers never stored or shared."], ["Everywhere", "Stores, apps and the web."], ["Express transit", "Just ride. No unlocking."]],
    proof: [["1 tap", "checkout"], ["0", "card numbers shared"], ["80+", "countries"]],
    quote: "Checkout went from forty seconds to two.", quoteBy: "Merchant, verified",
    footerLine: "Apple Pay — built into every Apple device.",
  },
  {
    slug: "apple-icloud", brand: "iCloud+", category: "apple",
    kicker: "ICLOUD+", headline: "Storage that keeps everything, safely.", sub: "All your photos, files and notes — encrypted in transit, synced everywhere, private end to end.",
    cta: "Try it free", cta2: "Compare plans", heroLayout: "center", radius: 18, pal: { ...P.white },
    features: [["iCloud Private Relay", "Internet browsing, anonymized."], ["Hide My Email", "Random addresses that forward."], ["Custom Email Domain", "Your domain, iCloud mail."]],
    proof: [["2 TB", "family sharing"], ["End-to-end", "encryption"], ["3 devices", "seamless handoff"]],
    quote: "Photos from four devices, one library, zero thinking.", quoteBy: "Family plan owner",
    footerLine: "iCloud+ — from $0.99/mo.",
  },
  {
    slug: "apple-vision-pro", brand: "Apple Vision Pro", category: "apple",
    kicker: "APPLE VISION PRO", headline: "Welcome to the era of spatial computing.", sub: "Your apps live in your space. Your movies fill a wall. Your eyes do the navigating.",
    cta: "Buy", cta2: "Learn more", heroLayout: "center", radius: 18, pal: { ...P.charcoal },
    features: [["EyeSight", "See others. Be seen."], ["Spatial photos", "Step back inside moments."], ["visionOS", "An operating system for space."]],
    proof: [["23M", "pixels"], ["Eye", "navigation"], ["12", "cameras"]],
    quote: "I watched a movie on a screen the size of my wall, in a hotel room.", quoteBy: "Owner, verified",
    footerLine: "Apple Vision Pro — from $3,499.",
  },
  {
    slug: "apple-store", brand: "Store", category: "apple",
    kicker: "STORE", headline: "The best way to buy the products you love.", sub: "Shop one on one with a Specialist, trade in what you have, and switch to iPhone easily.",
    cta: "Shop", cta2: "Visit a store", heroLayout: "center", radius: 18, pal: { ...P.white },
    features: [["Personal Setup", "One on one, on your schedule."], ["Trade In", "Credit toward your next device."], ["Monthly payments", "Low or no interest."]],
    proof: [["Free", "delivery"], ["1:1", "specialists"], ["Trade-in", "credit"]],
    quote: "Bought, set up and transferred in one appointment.", quoteBy: "Store customer",
    footerLine: "The Apple Store — shop the way you want.",
  },
  {
    slug: "apple-fitness", brand: "Fitness+", category: "apple",
    kicker: "FITNESS+", headline: "Workouts for everybody. Workouts for every body.", sub: "Thousands of studio-style workouts, from HIIT to meditation, with trainers who make starting easy.",
    cta: "Try it free", cta2: "Learn more", heroLayout: "bleed", radius: 18, pal: { ...P.charcoal },
    features: [["For every body", "Trainers and modifications for all."], ["Apple Music inside", "Work out to your playlists."], ["Time to Walk", "Audio, outdoors, no screen."]],
    proof: [["Thousands", "of workouts"], ["New", "every week"], ["12", "workout types"]],
    quote: "It's the first fitness app my whole family actually uses.", quoteBy: "Subscriber, verified",
    footerLine: "Fitness+ — one month free, then $9.99/mo.",
  },
  {
    slug: "apple-support", brand: "Apple Support", category: "apple",
    kicker: "APPLE SUPPORT", headline: "Help that shows up before you need it.", sub: "Search, chat or call — with answers written by the people who built the products.",
    cta: "Get support", cta2: "Contact us", heroLayout: "center", radius: 18, pal: { ...P.white },
    features: [["Search", "Answers written by Apple."], ["Genius Bar", "Reserve a time, skip the wait."], ["Repair", "Genuine parts, real technicians."]],
    proof: [["24/7", "chat and call"], ["Genuine", "parts only"], ["90 days", "on repairs"]],
    quote: "The answer I needed was the first search result. From Apple itself.", quoteBy: "Support user",
    footerLine: "Apple Support — help, in plain words.",
  },
  {
    slug: "apple-business", brand: "Apple at Work", category: "apple",
    kicker: "APPLE AT WORK", headline: "Tools your team already knows how to use.", sub: "Deploy in days, not quarters. With device management your IT lead will actually enjoy.",
    cta: "Talk to sales", cta2: "Shop for business", heroLayout: "split", radius: 18, pal: { ...P.white },
    features: [["Simple deployment", "Zero-touch from the box."], ["Built-in security", "Chip-level, out of the box."], ["Trade-in for credit", "Old devices fund new ones."]],
    proof: [["Days", "not quarters"], ["Chip-level", "security"], ["24/7", "enterprise support"]],
    quote: "Our rollout took an afternoon. Our old MDM took a quarter.", quoteBy: "IT lead, enterprise",
    footerLine: "Apple at Work — hardware your team knows.",
  },
  {
    slug: "apple-developer", brand: "Developer", category: "apple",
    kicker: "APPLE DEVELOPER", headline: "Build for a billion devices.", sub: "SDKs, simulators and TestFlight — plus theDesign Awards inspiration. Ship to every Apple screen with one membership.",
    cta: "Get started", cta2: "Download Xcode", heroLayout: "center", radius: 0, pal: { ...P.charcoal },
    features: [["Xcode 16", "One tool, every platform."], ["TestFlight", "Beta testing, built in."], ["App Review", "Human, fast, fair."]],
    proof: [["1.5B", "devices"], ["Swift", "one language"], ["84%", "of apps updated yearly"]],
    quote: "One membership, every Apple platform. The distribution story sells itself.", quoteBy: "Indie developer",
    footerLine: "Apple Developer Program — $99/yr.",
  },
  {
    slug: "apple-intelligence", brand: "Apple Intelligence", category: "apple",
    kicker: "APPLE INTELLIGENCE", headline: "AI for the rest of us.", sub: "Personal, private, powerful. It understands your context — and draws a circle around your privacy.",
    cta: "Learn more", cta2: "Watch the film", heroLayout: "center", radius: 18, pal: { ...P.charcoal },
    features: [["Private Cloud Compute", "Your data never leaves the device."], ["Writing Tools", "Rewrite, proofread, summarize."], ["Clean Up", "Remove distractions from photos."]],
    proof: [["On-device", "by default"], ["Zero", "data retention"], ["Free", "with updates"]],
    quote: "It's the first AI feature set I trust with my actual life.", quoteBy: "User, verified",
    footerLine: "Apple Intelligence — free with compatible devices.",
  },
  {
    slug: "apple-homepod", brand: "HomePod mini", category: "apple",
    kicker: "HOMEPOD MINI", headline: "Room-filling sound. Every color but neutral.", sub: "Five vivid colors, a fabric weave, and computational audio that measures the room before the first note.",
    cta: "Buy", cta2: "Learn more", heroLayout: "center", radius: 18, pal: { ...P.white },
    features: [["Computational audio", "Complex tuning, in real time."], ["Siri at home", "Requests handled, privately."], ["Intercom", "One message, every room."]],
    proof: [["5", "colors"], ["360°", "sound"], ["Siri", "built in"]],
    quote: "Small speaker, whole-apartment sound.", quoteBy: "Owner, verified",
    footerLine: "HomePod mini — $99.",
  },
  {
    slug: "apple-titanium", brand: "Titanium", category: "apple",
    kicker: "MATERIALS", headline: "Forged in titanium.", sub: "Aerospace-grade alloy, brushed to a satin finish — stronger than any steel at nearly half the weight.",
    cta: "Learn more", cta2: "Compare materials", heroLayout: "left", radius: 0, pal: { ...P.charcoal },
    features: [["Aerospace grade", "The same alloy as jet engines."], ["Satin finish", "Brushed by precision machinery."], ["Half the weight", "Of the stainless it replaced."]],
    proof: [["Grade 5", "titanium"], ["½", "the weight"], ["Full", "recyclable"]],
    quote: "The material story isn't marketing — it's why it survives me.", quoteBy: "Owner, verified",
    footerLine: "Titanium — the material chapter.",
  },
  {
    slug: "apple-trade-in", brand: "Trade In", category: "apple",
    kicker: "APPLE TRADE IN", headline: "Your old device is worth something. To you and the planet.", sub: "Get credit toward a purchase, or recycle it free — either way, the materials come back as new products.",
    cta: "Get your estimate", cta2: "Recycle", heroLayout: "center", radius: 18, pal: { ...P.white },
    features: [["Instant estimate", "Answer a few questions online."], ["Free recycling", "Even without credit."], ["100% recycled", "Rare earths in our magnets."]],
    proof: [["Robot", "Daisy disassembles 200/hr"], ["100%", "recycled rare earths"], ["Free", "shipping both ways"]],
    quote: "My old phone came back as the magnets in my new one. Genuinely cool.", quoteBy: "Trade-in customer",
    footerLine: "Apple Trade In — it works for our planet.",
  },
  {
    slug: "apple-keynote", brand: "Keynote", category: "apple",
    kicker: "SEPTEMBER EVENT", headline: "One night. Everything new.", sub: "Streaming from Cupertino — the hardware, the software and a few things nobody guessed.",
    cta: "Watch the replay", cta2: "Add to calendar", heroLayout: "bleed", radius: 0, pal: { ...P.appleDark },
    features: [["iPhone", "The thinnest ever."], ["Watch", "Brighter, mightier."], ["AirPods", "With heart rate."]],
    proof: [["Live", "in 40 languages"], ["Replay", "forever"], ["ASL", "interpreted"]],
    quote: "Twenty minutes in and they had already shipped three surprises.", quoteBy: "Live viewer",
    footerLine: "Apple Event — streaming and on replay.",
  },

  /* ---------------- Editorial serif (4) ---------------- */
  {
    slug: "meridian-journal", brand: "Meridian", category: "editorial",
    kicker: "A SLOW JOURNAL — ISSUE 12", headline: "Notes on paying attention.", sub: "Essays on craft, slowness and the texture of ordinary work. Published four times a year, in paper and pixels.",
    cta: "Subscribe", cta2: "Read issue 12", heroLayout: "left", serifHead: true, radius: 0, pal: P.bone,
    features: [["Essays", "Long, and worth the length."], ["Letters", "From readers, replied in kind."], ["Field notes", "Short observations, unpolished."]],
    proof: [["4", "issues a year"], ["1,200", "subscribers"], ["0", "advertisers"]],
    quote: "The only publication I read twice.", quoteBy: "A subscriber",
    footerLine: "Meridian — written slowly, on purpose.",
  },
  {
    slug: "salt-and-stone", brand: "Salt & Stone", category: "editorial",
    kicker: "OBJECTS FOR THE TABLE", headline: "Stoneware for unhurried meals.", sub: "Each piece thrown by hand in our Lisbon studio, glazed in muted coastal tones. No two alike — that's the point.",
    cta: "Browse the collection", cta2: "Our studio", heroLayout: "split", serifHead: true, radius: 0, pal: P.warm,
    features: [["Thrown by hand", "Small variations, on purpose."], ["Coastal glazes", "Muted tones from sea clay."], ["Fired twice", "Dishwasher-safe, honestly."]],
    proof: [["Lisbon", "studio"], ["2", "firings"], ["6 wks", "lead time"]],
    quote: "Every plate is slightly different, which makes the table feel alive.", quoteBy: "Restaurant client",
    footerLine: "Salt & Stone — made slowly in Lisbon.",
  },
  {
    slug: "the-ledger", brand: "The Ledger", category: "editorial",
    kicker: "A FINANCE MAGAZINE", headline: "Money, explained without shouting.", sub: "Long-form reporting on markets, behavior and the systems between them. Print quarterly, online weekly.",
    cta: "Get the print edition", cta2: "Read online", heroLayout: "center", serifHead: true, radius: 0, pal: P.paper,
    features: [["Reporting", "Primary sources, always cited."], ["Explainers", "For the rest of us."], ["No hot takes", "We wait for the data."]],
    proof: [["Quarterly", "print"], ["Weekly", "online"], ["0", "sponsored posts"]],
    quote: "The rare finance magazine that assumes I'm smart and busy.", quoteBy: "Subscriber",
    footerLine: "The Ledger — finance, calmly.",
  },
  {
    slug: "fieldnotes", brand: "Fieldnotes", category: "editorial",
    kicker: "A TRAVEL JOURNAL", headline: "Places, written before the photos.", sub: "Dispatches from slow travel — trains, ferries and small towns. Words first; the photos come later.",
    cta: "Read the latest", cta2: "Archive", heroLayout: "split", serifHead: true, radius: 0, pal: P.paper,
    features: [["Dispatches", "One place, one week, one piece."], ["No lists", "We don't rank sunsets."], ["Maps", "Hand-drawn, approximate."]],
    proof: [["31", "places visited"], ["12", "countries"], ["0", "top-ten lists"]],
    quote: "Reading it feels like walking. I don't know how else to say it.", quoteBy: "Reader",
    footerLine: "Fieldnotes — travel writing, unhurried.",
  },

  /* ---------------- Swiss (3) ---------------- */
  {
    slug: "bureau-type", brand: "Bureau", category: "swiss",
    kicker: "TYPE FOUNDRY — ZÜRICH", headline: "Typefaces for public signage.", sub: "Grid-built letterforms for transit, museums and public institutions. Licensed per city, not per seat.",
    cta: "View typefaces", cta2: "Licensing", heroLayout: "left", radius: 0, pal: { bg: "#ffffff", surface: "#f2f2f2", ink: "#111111", muted: "#6b6b6b", line: "#e5e5e5" },
    features: [["Grid-built", "Every curve derives from the grid."], ["Per-city license", "One fee, unlimited signage."], ["Variable first", "Weight, width and optical size axes."]],
    proof: [["12", "typefaces"], ["40+", "cities licensed"], ["1957", "founded"]],
    quote: "The only foundry whose license we didn't have to explain to legal.", quoteBy: "Transit authority",
    footerLine: "Bureau — Zürich, since 1957.",
  },
  {
    slug: "grid-architecture", brand: "Grid", category: "swiss",
    kicker: "ARCHITECTURE STUDIO", headline: "Buildings that defer to light.", sub: "We design institutional buildings where the grid serves the sun — museums, libraries, courthouses.",
    cta: "Selected works", cta2: "Studio", heroLayout: "left", radius: 0, pal: { bg: "#ffffff", surface: "#f4f4f4", ink: "#111111", muted: "#6b6b6b", line: "#e8e8e8" },
    features: [["Light studies", "Every façade simulated seasonally."], ["Public first", "Lobbies that belong to the city."], ["Long life", "Fifty-year material guarantees."]],
    proof: [["14", "built works"], ["3", "museums"], ["50 yr", "guarantees"]],
    quote: "The reading room is the best public room in the city, and it's free.", quoteBy: "City librarian",
    footerLine: "Grid — architecture studio, Basel.",
  },
  {
    slug: "helvetica-posters", brand: "Neue Plakate", category: "swiss",
    kicker: "POSTER WORKSHOP", headline: "Posters. Nothing else.", sub: "International-style poster printing for exhibitions and theaters. One color, one typeface, one size — 50 × 70.",
    cta: "Print with us", cta2: "Archive", heroLayout: "center", radius: 0, pal: { bg: "#f6f6f4", surface: "#eeeeec", ink: "#141414", muted: "#6f6f6f", line: "#e4e4e2" },
    features: [["One size", "50 × 70 centimeters, always."], ["One color", "Black ink on white stock."], ["Silkscreen", "Pulled by hand, in runs of 100."]],
    proof: [["100", "per edition"], ["1", "color"], ["50×70", "centimeters"]],
    quote: "The posters sell out the shows before the reviews do.", quoteBy: "Theater director",
    footerLine: "Neue Plakate — printed in Bern.",
  },

  /* ---------------- Dark cinematic (4) ---------------- */
  {
    slug: "waveform-audio", brand: "Waveform", category: "dark",
    kicker: "AUDIO API", headline: "Audio infrastructure for builders.", sub: "Transcode, analyze and stream audio with one API. Built by ex-broadcast engineers who got tired of ffmpeg flags.",
    cta: "Get an API key", cta2: "Read the docs", heroLayout: "center", radius: 14, pal: P.charcoal,
    features: [["Transcode", "Any format in, four out."], ["Analyze", "Loudness, tempo, silence."], ["Stream", "HLS and DASH, worldwide."]],
    proof: [["4.2B", "minutes processed"], ["99.99%", "uptime"], ["180 ms", "p95 latency"]],
    quote: "We deleted 4,000 lines of ffmpeg flags and slept better.", quoteBy: "CTO, podcast network",
    footerLine: "Waveform — audio infrastructure.",
  },
  {
    slug: "halide-camera", brand: "Halide", category: "dark",
    kicker: "CAMERA APP", headline: "Your camera, with real controls.", sub: "Manual focus, real histograms and raw files that respect your photography — in an interface you can use at a sprint.",
    cta: "Download", cta2: "Read the manual", heroLayout: "center", radius: 14, pal: P.charcoal,
    features: [["Manual focus", "Sweep, pinch, precision."], ["Real histogram", "Live, per-channel."], ["ProRAW", "Full resolution, no fuss."]],
    proof: [["4.9★", "App Store"], ["ProRAW", "native"], ["1 hand", "designed for"]],
    quote: "The first camera app that respects the photograph.", quoteBy: "Photographer",
    footerLine: "Halide — for iPhone, today.",
  },
  {
    slug: "loom-ai", brand: "Loom", category: "dark",
    kicker: "MEETING NOTES", headline: "Meetings that write themselves down.", sub: "Loom joins, listens and leaves you a decision log — not a transcript dump. On-device, private, free for small teams.",
    cta: "Try with your team", cta2: "How it works", heroLayout: "center", radius: 14, pal: P.night,
    features: [["Decision logs", "What was decided, by whom."], ["On-device", "Nothing leaves the laptop."], ["Weekly digest", "One email, every Monday."]],
    proof: [["12,000", "teams"], ["4 hrs", "saved weekly"], ["0", "audio uploaded"]],
    quote: "The Monday digest ended our 'what did we decide?' thread.", quoteBy: "Product lead",
    footerLine: "Loom — free for teams under ten.",
  },
  {
    slug: "noir-fragrance", brand: "Noir", category: "dark",
    kicker: "EAU DE PARFUM", headline: "Worn at night. Noticed at dawn.", sub: "Smoked cedar, black pepper and a trace of iris — blended in Grasse, aged six months, bottled in darkness.",
    cta: "Order a sample", cta2: "The notes", heroLayout: "center", radius: 12, pal: P.ink,
    features: [["Smoked cedar", "The base that lasts until morning."], ["Black pepper", "The opening that earns the name."], ["Aged 6 months", "Mellowed before bottling."]],
    proof: [["Grasse", "blended"], ["6 mo", "aged"], ["50 ml", "EDP"]],
    quote: "Three people asked. Two wrote it down. One was my dentist.", quoteBy: "Verified buyer",
    footerLine: "Noir — applied at night.",
  },

  /* ---------------- Warm D2C (4) ---------------- */
  {
    slug: "petal-flowers", brand: "Petal", category: "warm",
    kicker: "FLOWER SUBSCRIPTION", headline: "Weekly flowers, whatever the week.", sub: "Seasonal stems from growers within an hour of the city, arranged in paper and delivered Tuesdays.",
    cta: "Start weekly", cta2: "This week's stems", heroLayout: "split", serifHead: true, radius: 14, pal: P.warm,
    features: [["Local growers", "Within an hour of the city."], ["Seasonal always", "Whatever grew this week."], ["Paper wrap", "No plastic, ever."]],
    proof: [["Tuesdays", "delivery"], ["< 1 hr", "from the farm"], ["0", "plastic"]],
    quote: "Tuesday is the best hour of my week.", quoteBy: "Subscriber, 2 years",
    footerLine: "Petal — flowers that were growing this morning.",
  },
  {
    slug: "oat-ceramics", brand: "Oat", category: "warm",
    kicker: "CERAMICS STUDIO", headline: "Mugs with thumbs in mind.", sub: "Wheel-thrown stoneware in oat, ash and clay tones — fired to hold heat through a long breakfast.",
    cta: "Shop mugs", cta2: "Studio visits", heroLayout: "split", serifHead: true, radius: 14, pal: P.warm,
    features: [["Wheel-thrown", "One pair of hands per piece."], ["Heat-holding", "Thick walls, warm coffee."], ["Oat glaze", "The color of the kiln's namesake."]],
    proof: [["1", "pair of hands"], ["1260°", "firing"], ["Dishwasher", "safe"]],
    quote: "The mug that ended my mug-buying habit.", quoteBy: "Verified buyer",
    footerLine: "Oat — thrown in small batches.",
  },
  {
    slug: "moss-plants", brand: "Moss", category: "warm",
    kicker: "PLANT CARE", headline: "Plants that survive your vacation.", sub: "Six hardy species, self-watering pots and a care card written by someone who has killed plants before.",
    cta: "Build your shelf", cta2: "The care card", heroLayout: "split", serifHead: true, radius: 14, pal: P.warm,
    features: [["Hardy species", "Survive two weeks away."], ["Self-watering", "Two-week reservoirs."], ["Honest care card", "Written by a reformed killer."]],
    proof: [["6", "hardy species"], ["2 wks", "reservoir"], ["1", "honest card"]],
    quote: "My plants met my in-laws and everyone survived.", quoteBy: "Verified buyer",
    footerLine: "Moss — plants for people who travel.",
  },
  {
    slug: "ember-kitchen", brand: "Ember", category: "warm",
    kicker: "WOOD-FIRED KITCHEN", headline: "Fire, salt, time.", sub: "A forty-seat room around one wood fire. The menu changes when the market does — usually Wednesday.",
    cta: "Reserve a seat", cta2: "This week's menu", heroLayout: "center", serifHead: true, radius: 0, pal: P.warm,
    features: [["One fire", "Everything touches the wood."], ["Market menu", "Changes midweek, not quarterly."], ["Forty seats", "Come hungry, come early."]],
    proof: [["40", "seats"], ["1", "wood fire"], ["Wed", "menu change"]],
    quote: "The carrot starter was the best thing I ate this year.", quoteBy: "Regular, table 4",
    footerLine: "Ember — Thursday to Sunday, from 6.",
  },

  /* ---------------- Mono dev (3) ---------------- */
  {
    slug: "terminal-coffee", brand: "Terminal Coffee", category: "mono",
    kicker: "CLI TOOL", headline: "Coffee, from the command line.", sub: "track, brew and log your coffee without opening a browser. Exports to CSV, syncs nothing, asks for nothing.",
    cta: "brew install", cta2: "Read the README", heroLayout: "left", radius: 0, pal: P.ink,
    features: [["Local-first", "Your log never leaves disk."], ["CSV export", "For the spreadsheet people."], ["No accounts", "There is no server."]],
    proof: [["0", "servers"], ["CSV", "export"], ["4.9★", "from nerds"]],
    quote: "Finally a coffee app that respects the terminal.", quoteBy: "HN commenter",
    footerLine: "Terminal Coffee — open source, MIT.",
  },
  {
    slug: "kernel-newsletter", brand: "Kernel", category: "mono",
    kicker: "SYSTEMS NEWSLETTER", headline: "Systems, in plain text.", sub: "A weekly letter on kernels, caches and the failure modes of distributed things. Plain text, every Tuesday.",
    cta: "Subscribe", cta2: "Read the archive", heroLayout: "left", radius: 0, pal: P.ink,
    features: [["Plain text", "No tracking pixels, obviously."], ["Deep dives", "One topic, thoroughly."], ["Tuesday", "Like clockwork, 07:00 UTC."]],
    proof: [["24K", "readers"], ["Tuesdays", "07:00 UTC"], ["120+", "issues"]],
    quote: "The only newsletter I read the same day it arrives.", quoteBy: "Staff engineer",
    footerLine: "Kernel — plain text about systems.",
  },
  {
    slug: "dispatch-mail", brand: "Dispatch", category: "mono",
    kicker: "EMAIL DIGEST", headline: "Your feeds, compressed.", sub: "Forty sources, one weekly digest, zero algorithm. Filtered by rules you write, delivered as plain text.",
    cta: "Start free", cta2: "How filtering works", heroLayout: "left", radius: 0, pal: P.ink,
    features: [["Your rules", "Filters you write, in plain text."], ["Weekly", "One digest, Friday 06:00."], ["No algorithm", "Nothing is 'recommended'."]],
    proof: [["40", "sources"], ["1", "digest/week"], ["0", "algorithms"]],
    quote: "My reading queue went from 400 tabs to one email.", quoteBy: "Reader",
    footerLine: "Dispatch — plain text, on purpose.",
  },

  /* ---------------- Brutalist (2) ---------------- */
  {
    slug: "concrete-portfolio", brand: "Concrete", category: "brutal",
    kicker: "PORTFOLIO — 2019–2026", headline: "WORK. NO THUMBNAILS.", sub: "Seven public buildings, photographed as built — not as rendered. Full construction documents on request.",
    cta: "ENTER", cta2: "DOCUMENTS", heroLayout: "center", radius: 0, pal: { bg: "#e8e6e1", surface: "#dcd9d2", ink: "#141414", muted: "#5a5852", line: "#c9c6bf" },
    features: [["As built", "Photographed after completion."], ["Documents", "Full drawings, on request."], ["Public", "Seven buildings, open access."]],
    proof: [["7", "public buildings"], ["2019", "started"], ["100%", "built as drawn"]],
    quote: "The drawings they publish are the ones they built. Rare.", quoteBy: "Fellow architect",
    footerLine: "Concrete — seven buildings, no thumbnails.",
  },
  {
    slug: "loud-events", brand: "LOUD", category: "brutal",
    kicker: "EVENT POSTERS", headline: "TURN IT UP.", sub: "Posters for basement shows and warehouse sets. Screen-printed, limited, gone. New drops every first Friday.",
    cta: "SEE DROPS", cta2: "ARCHIVE", heroLayout: "center", radius: 0, pal: { bg: "#111111", surface: "#1d1d1d", ink: "#f5f5f2", muted: "#8a8a85", line: "#2c2c2c" },
    features: [["Screen-printed", "Two colors, pulled by hand."], ["Limited", "Thirty of each. Then gone."], ["First Fridays", "New drop, first Friday, noon."]],
    proof: [["30", "per edition"], ["2", "colors"], ["1st", "Friday drops"]],
    quote: "The posters outlive the shows. They're the artifact.", quoteBy: "Show promoter",
    footerLine: "LOUD — first Friday, noon.",
  },

  /* ---------------- Gradient modern SaaS (3) ---------------- */
  {
    slug: "relay-messaging", brand: "Relay", category: "gradient",
    kicker: "TEAM MESSAGING", headline: "Fewer channels. Clearer decisions.", sub: "Relay replaces channel sprawl with decision threads — every conversation ends in a recorded call, not a scroll.",
    cta: "Start free", cta2: "Watch the tour", heroLayout: "center", radius: 20, pal: { ...P.white },
    features: [["Decision threads", "Conversations that conclude."], ["Quiet hours", "Notifications respect dinner."], ["Search that works", "Every decision, findable."]],
    proof: [["12,400", "teams"], ["-38%", "messages sent"], ["4.9★", "team rating"]],
    quote: "We cancelled three tools and kept Relay.", quoteBy: "Head of Product, Fern & Co",
    footerLine: "Relay — free under ten people.",
  },
  {
    slug: "plume-writing", brand: "Plume", category: "gradient",
    kicker: "WRITING APP", headline: "A quiet place to write badly first.", sub: "Drafts before polish. Plume hides every editing tool until you ask — because rewriting while writing is how writing dies.",
    cta: "Start writing", cta2: "The manifesto", heroLayout: "center", radius: 20, pal: P.paper,
    features: [["Drafts first", "Editing tools wait until asked."], ["Focus mode", "One sentence at a time, optional."], ["Local files", "Plain text, yours forever."]],
    proof: [["0", "notifications"], [".txt", "plain text"], ["1", "font, on purpose"]],
    quote: "Finished my first draft in eleven days. Eleven.", quoteBy: "Novelist",
    footerLine: "Plume — drafts before polish.",
  },
  {
    slug: "stride-running", brand: "Stride", category: "gradient",
    kicker: "RUNNING CLUB", headline: "Train with people at your exact pace.", sub: "Pace-matched group runs every Saturday — no watches compared, no egos brought. Just the pace you signed up for.",
    cta: "Join Saturday", cta2: "Find your pace", heroLayout: "split", radius: 20, pal: { ...P.white },
    features: [["Pace-matched", "Nobody waits. Nobody sprints off."], ["Saturdays", "07:30, any weather."], ["Real routes", "Measured, marked, marshaled."]],
    proof: [["Sat", "07:30"], ["6", "pace groups"], ["1,100", "members"]],
    quote: "First running club where I wasn't the slowest or the fastest.", quoteBy: "Member, pace group D",
    footerLine: "Stride — Saturdays, 07:30, any weather.",
  },
];

/* The remaining slots, filled with distinct products to reach fifty */
const EXTRA: LandingTemplate[] = [
  { slug: "aurea-watches", brand: "Aurea", category: "warm", kicker: "WATCHMAKERS — GENEVA", headline: "Watches that outlive their warranty.", sub: "Hand-assembled movements with a hundred-year service guarantee — your grandchildren will wind the same gears.", cta: "Book a viewing", cta2: "The calibre", heroLayout: "split", serifHead: true, radius: 8, pal: { ...P.paper }, features: [["Hand-assembled", "One watchmaker, one watch."], ["100-yr service", "Guaranteed, in writing."], ["In-house calibre", "Designed, not bought."]], proof: [["100 yr", "service guarantee"], ["1", "watchmaker per watch"], ["Genève", "atelier"]], quote: "It will be accurate when my granddaughter winds it.", quoteBy: "Founder's promise", footerLine: "Aurea — Geneva, by appointment." },
  { slug: "grain-photo", brand: "Grain", category: "mono", kicker: "PHOTO PORTFOLIOS", headline: "A portfolio that respects the grain.", sub: "Full-bleed, keyboard-driven, no like buttons. Built for photographers who print — from the same people who print.", cta: "Start a portfolio", cta2: "See examples", heroLayout: "left", radius: 0, pal: P.ink, features: [["Keyboard-driven", "Arrows and J/K. That's it."], ["No likes", "There is no counter."], ["Print-ready", "Every image, full resolution."]], proof: [["0", "like buttons"], ["J/K", "keyboard"], ["RAW", "downloadable"]], quote: "The only portfolio where my grain survived.", quoteBy: "Photographer", footerLine: "Grain — portfolios that print." },
  { slug: "fjord-travel", brand: "Fjord", category: "warm", kicker: "NORDIC TRAVEL", headline: "Slow north, by ferry and rail.", sub: "Fourteen-day itineraries through fjords and fishing towns — trains, ferries and rooms with owners who cook.", cta: "See the route", cta2: "Rooms", heroLayout: "split", serifHead: true, radius: 12, pal: P.paper, features: [["By ferry and rail", "No flights inside the route."], ["Owner-run rooms", "Dinner cooked by your host."], ["14 days", "Unhurried by design."]], proof: [["14", "days"], ["0", "flights"], ["11", "owner-run rooms"]], quote: "The first trip where I never opened my laptop.", quoteBy: "Traveler, route 3", footerLine: "Fjord — the slow north, by rail." },
  { slug: "hearth-cabins", brand: "Hearth", category: "warm", kicker: "CABIN RENTALS", headline: "Cabins with one room and no Wi-Fi.", sub: "Nine cabins, ninety minutes from the city — wood stove, record player, and a key box because nobody works here.", cta: "Check dates", cta2: "The nine cabins", heroLayout: "center", serifHead: true, radius: 14, pal: P.paper, features: [["No Wi-Fi", "That's the amenity."], ["Wood stove", "Split wood included."], ["Records", "A crate of them, per cabin."]], proof: [["9", "cabins"], ["90 min", "from the city"], ["0", "Wi-Fi networks"]], quote: "The absence of Wi-Fi is the luxury.", quoteBy: "Weekend guest", footerLine: "Hearth — nine cabins, no networks." },
  { slug: "loom-meetings", brand: "Stride Meetings", category: "gradient", kicker: "MEETING NOTES", headline: "Notes that read like decisions.", sub: "Stride sits in your meeting, extracts the decisions and leaves the small talk in the room.", cta: "Try free", cta2: "See a sample", heroLayout: "center", radius: 16, pal: P.night, features: [["Decision extraction", "Outcomes, not transcripts."], ["On-device", "Audio never uploaded."], ["Weekly rollup", "Every decision, one email."]], proof: [["4 hrs", "saved weekly"], ["On-device", "processing"], ["1 email", "per week"]], quote: "Our standup notes finally outlive the standup.", quoteBy: "Engineering manager", footerLine: "Stride — decisions, recorded." },
];


/* --- final seven, reaching fifty --- */
LANDING_TEMPLATES.push(
  { slug: "tide-surf", brand: "Tide", category: "dark", kicker: "SURF REPORTS", headline: "The report, before the light.", sub: "Swell period, wind direction and tide — written by forecasters at 05:00, delivered before your first coffee.", cta: "Get the report", cta2: "Sample report", heroLayout: "center", radius: 12, pal: P.charcoal, features: [["05:00", "written daily"], ["3 spots", "your local break"], ["No app", "just the report"]], proof: [["05:00", "daily"], ["3", "local spots"], ["0", "ads"]], quote: "I check the report before I check the sky.", quoteBy: "Dawn patroller", footerLine: "Tide — written at 05:00." },
  { slug: "vera-artist", brand: "Vera", category: "gradient", kicker: "NEW ALBUM — OUT NOW", headline: "Recorded in a barn. Mixed in the rain.", sub: "Nine tracks, one microphone, no metronome. Vera's second record — out on all platforms and on tape.", cta: "Listen", cta2: "On tape", heroLayout: "center", radius: 20, pal: { ...P.white }, features: [["One mic", "The whole record."], ["No metronome", "The tempo breathes."], ["Tape", "300 copies, hand-numbered."]], proof: [["9", "tracks"], ["300", "tapes"], ["1", "microphone"]], quote: "The best record to come out of that barn since the barn.", quoteBy: "Local press", footerLine: "Vera — out now on all platforms." },
  { slug: "lighthouse-status", brand: "Lighthouse", category: "mono", kicker: "STATUS PAGE", headline: "Your uptime, in public.", sub: "A status page your users check on purpose — plain, fast, honest about incidents.", cta: "Claim your page", cta2: "See a live one", heroLayout: "left", radius: 0, pal: P.paper, features: [["Plain", "No dashboards to decode."], ["Honest", "Incidents stay visible."], ["Fast", "Static page, one request."]], proof: [["1 req", "static page"], ["60s", "check interval"], ["RSS", "incident feed"]], quote: "Our status page became a trust page.", quoteBy: "DevOps lead", footerLine: "Lighthouse — uptime in public." },
  { slug: "doodle-kids", brand: "Doodle", category: "warm", kicker: "LEARNING BY MAIL", headline: "A craft letter for small hands.", sub: "A paper envelope every month: scissors, glue, one idea. Screen-free, tried on actual children.", cta: "Start the letter", cta2: "This month", heroLayout: "split", radius: 14, pal: P.warm, features: [["By mail", "Paper, scissors, one idea."], ["Screen-free", "Tried on real children."], ["Ages 4–8", "Grown-up helper optional."]], proof: [["1", "envelope/month"], ["4–8", "ages"], ["0", "screens"]], quote: "The envelope competes with cartoons. It wins.", quoteBy: "Parent of two", footerLine: "Doodle — a craft letter, monthly." },
  { slug: "kestrel-optics", brand: "Kestrel", category: "editorial", kicker: "OPTICS — EST. 1988", headline: "Glass, ground for songbirds.", sub: "Binoculars assembled and aligned by two opticians in a workshop above a bookshop. Serviced for as long as we do.", cta: "The models", cta2: "Servicing", heroLayout: "split", serifHead: true, radius: 0, pal: P.paper, features: [["Aligned by hand", "Two opticians, no line."], ["Serviced forever", "As long as we do."], ["Songbird tuned", "Close focus to 1.8 m."]], proof: [["1.8 m", "close focus"], ["2", "opticians"], ["1988", "established"]], quote: "I identify warblers at forty meters. Enough said.", quoteBy: "Birder, 30 years", footerLine: "Kestrel — glass, ground for songbirds." },
  { slug: "ampere-ebike", brand: "Ampere", category: "gradient", kicker: "E-BIKE", headline: "The commute that arrives unbothered.", sub: "Sixty kilometers of range, a belt drive that never needs oil, and a battery you can charge under your desk.", cta: "Book a test ride", cta2: "Specs", heroLayout: "split", radius: 16, pal: { ...P.white }, features: [["60 km range", "A week of commutes."], ["Belt drive", "No oil, no noise."], ["Under-desk charge", "The battery is the size of a book."]], proof: [["60 km", "range"], ["0", "oil"], ["1 hr", "charge"]], quote: "I sold my second car. The bike replaced it, not the train.", quoteBy: "Commuter, verified", footerLine: "Ampere — the commute, unbothered." },
  { slug: "purl-knit", brand: "Purl", category: "warm", kicker: "KNITTING PATTERNS", headline: "Patterns that assume you can knit.", sub: "No twenty-page tutorials — charts, grades and schematics for knitters who know their needles. Tested on three body sizes.", cta: "Browse patterns", cta2: "Test knits", heroLayout: "split", serifHead: true, radius: 0, pal: P.paper, features: [["Charts first", "For knitters who know."], ["Three sizes", "Tested on real bodies."], ["Yarn-agnostic", "Any wool that blocks."]], proof: [["3", "sizes tested"], ["40+", "patterns"], ["0", "tutorial pages"]], quote: "The first pattern designer who trusts my swatch.", quoteBy: "Knitter, 20 years", footerLine: "Purl — patterns for knitters." },
);

/* 45 more landing pages — new palette families: petrol-mint darks, warm
   creams, sage, terracotta, ink monochromes. Same renderer, same motion
   law; the variety comes from palette, type family and hero layout. */

const D1 = { bg: "#0a0d12", surface: "#141a21", ink: "#eef2f4", muted: "#8b97a3", line: "rgba(255,255,255,0.09)" };
const D2 = { bg: "#0d1117", surface: "#171d24", ink: "#e8ecf1", muted: "#93a1ad", line: "rgba(255,255,255,0.08)" };
const W1 = { bg: "#ffffff", surface: "#f7f6f3", ink: "#1d1d1f", muted: "#6e6e73", line: "rgba(0,0,0,0.08)" };
const W2 = { bg: "#fbfaf7", surface: "#f3f1ea", ink: "#26221c", muted: "#7d766b", line: "rgba(0,0,0,0.07)" };
const S1 = { bg: "#f4f4f2", surface: "#ebebe8", ink: "#161616", muted: "#666663", line: "#dddddb" };

LANDING_TEMPLATES.push(
  /* ---- Apple grammar, original brands (8) ---- */
  { slug: "lumen-light", brand: "Lumen", category: "dark", kicker: "SMART LIGHTING", headline: "Light that learns the room.", sub: "Lumen reads the hour, the weather and your calendar — and tunes every lamp before you ask. No scenes to set up, no apps to open.", cta: "Buy the starter kit", cta2: "How it learns", heroLayout: "center", radius: 18, pal: D1, accent: "oklch(0.82 0.12 200)", features: [["Learns in a week", "No scenes, no schedules to write."], ["One bulb, every hue", "Petrol at noon. Amber by nine."], ["Private by design", "The schedule never leaves home."]], proof: [["7 days", "to learn your rhythm"], ["0", "apps after setup"], ["-31%", "energy vs. always-on"]], quote: "It dimmed itself before the film started. Nobody touched a switch.", quoteBy: "Owner, three months in", footerLine: "Lumen — light that learns the room." },
  { slug: "fjell-watch", brand: "Fjell", category: "apple", kicker: "FJELL — TITANIUM TRAIL WATCH", headline: "Built for the walk home in the rain.", sub: "Sapphire crystal, a ten-day battery and offline maps that work where the signal doesn't. Designed above the Arctic Circle.", cta: "Buy Fjell", cta2: "Compare models", heroLayout: "center", radius: 18, pal: { ...P.appleDark }, accent: "oklch(0.82 0.12 152)", features: [["10-day battery", "A full trek between charges."], ["Offline topo maps", "No signal, no problem."], ["Grade-5 titanium", "Tested at −30°C."]], proof: [["10 days", "battery"], ["−30°C", "tested"], ["Sapphire", "crystal"]], quote: "Two hundred kilometers of Norwegian rain. Not one glitch.", quoteBy: "Field tester", footerLine: "Fjell — designed above the Arctic Circle." },
  { slug: "nova-earbuds", brand: "Nova", category: "apple", kicker: "NOVA EARBUDS", headline: "Silence, on demand.", sub: "Forty decibels of cancellation, a case that charges from any phone, and sound tuned by people who mix records for a living.", cta: "Pre-order", cta2: "The sound test", heroLayout: "center", radius: 18, pal: { bg: "#0e0d12", surface: "#191723", ink: "#f0eef6", muted: "#9b96ad", line: "rgba(255,255,255,0.09)" }, accent: "oklch(0.78 0.14 300)", features: [["−40 dB cancellation", "Measured, not marketed."], ["Wireless charging case", "Top up from any phone."], ["Studio tuning", "Flat where it matters."]], proof: [["−40 dB", "cancellation"], ["8 hrs", "per charge"], ["32 hrs", "with case"]], quote: "The commute disappeared. The mix stayed honest.", quoteBy: "Mixing engineer", footerLine: "Nova — silence, on demand." },
  { slug: "atlas-laptop", brand: "Atlas", category: "apple", kicker: "ATLAS WORKBOOK", headline: "A workstation that fits the overhead bin.", sub: "Fourteen inches, thirty-two gigabytes and a keyboard you can feel — machined from a single block of aluminum.", cta: "Configure yours", cta2: "Compare", heroLayout: "center", radius: 18, pal: { ...P.white }, accent: "#22707e", features: [["32 GB memory", "Standard. Not an upgrade."], ["Machined body", "One block. No seams."], ["Keys you can feel", "1.5 mm travel. Finally."]], proof: [["32 GB", "memory standard"], ["14″", "display"], ["18 hrs", "battery"]], quote: "The first laptop I didn't immediately dock.", quoteBy: "Field engineer", footerLine: "Atlas — machined, not assembled." },
  { slug: "pillo-sleep", brand: "Pillo", category: "apple", kicker: "SLEEP TRACKER", headline: "Better mornings, by the numbers.", sub: "A sensor under the mattress — nothing to wear, nothing to charge. Pillo scores your nights and suggests one change at a time.", cta: "Pre-order", cta2: "How scoring works", heroLayout: "center", radius: 18, pal: { bg: "#0d0f16", surface: "#161927", ink: "#eceef6", muted: "#9aa0b8", line: "rgba(255,255,255,0.08)" }, accent: "oklch(0.75 0.13 280)", features: [["Nothing to wear", "Under-mattress sensor."], ["One change at a time", "Suggestions, not lectures."], ["No subscription", "Buy once. Score forever."]], proof: [["0", "things to wear"], ["1", "change at a time"], ["No", "subscription"]], quote: "It found the 11 pm coffee I refused to give up. Then I gave it up.", quoteBy: "Verified owner", footerLine: "Pillo — better mornings, by the numbers." },
  { slug: "volt-charging", brand: "Volt", category: "apple", kicker: "CHARGING NETWORK", headline: "Charge where you already park.", sub: "Four thousand curbside chargers in twelve cities — reserve overnight, wake up full. No apps fighting for spots at 2 am.", cta: "Find a charger", cta2: "For cities", heroLayout: "split", radius: 18, pal: { ...P.white }, accent: "#1f9d55", features: [["Reserve overnight", "Your spot, while you sleep."], ["4,000+", "curbside points"], ["One plug", "Every car, one standard."]], proof: [["4,000+", "chargers"], ["12", "cities"], ["100%", "renewable"]], quote: "Charging stopped being a planning problem.", quoteBy: "EV driver, Berlin", footerLine: "Volt — charge where you park." },
  { slug: "halo-speaker", brand: "Halo", category: "apple", kicker: "HALO SPEAKER", headline: "The room, tuned by the speaker.", sub: "Halo measures its reflections for thirty seconds, then flattens the standing waves your living room was born with.", cta: "Buy Halo", cta2: "The acoustics", heroLayout: "center", radius: 18, pal: { bg: "#101012", surface: "#1a1a1e", ink: "#f4f2ef", muted: "#a09d98", line: "rgba(255,255,255,0.09)" }, accent: "oklch(0.85 0.1 85)", features: [["Room correction", "Thirty seconds, once."], ["360° array", "Eight drivers, no sweet spot."], ["One fabric", "Knit, not sprayed."]], proof: [["8", "drivers"], ["30 s", "room tuning"], ["360°", "array"]], quote: "It tuned itself to a room with a brick wall. And won.", quoteBy: "Verified owner", footerLine: "Halo — the room, tuned by the speaker." },
  { slug: "iris-camera", brand: "Iris", category: "apple", kicker: "IRIS — CAMERA APP", headline: "Manual controls, at a sprint.", sub: "Every dial one thumb away — ISO, shutter and focus without leaving the viewfinder. Built by photographers who shoot while walking.", cta: "Get Iris", cta2: "The interface", heroLayout: "center", radius: 18, pal: { bg: "#0c0e0d", surface: "#151917", ink: "#eef3ef", muted: "#93a39a", line: "rgba(255,255,255,0.08)" }, accent: "oklch(0.8 0.14 150)", features: [["One-thumb dials", "ISO, shutter, focus. No menus."], ["Live histogram", "Per channel, always visible."], ["Raw, always", "Your negatives, untouched."]], proof: [["0", "menus"], ["1 thumb", "every control"], ["Raw", "by default"]], quote: "The first camera app I can use while walking.", quoteBy: "Street photographer", footerLine: "Iris — manual controls, at a sprint." },

  /* ---- Editorial serif (6) ---- */
  { slug: "silver-and-salt", brand: "Silver & Salt", category: "editorial", kicker: "A PHOTOGRAPHY JOURNAL", headline: "Prints that hold their grain.", sub: "A quarterly journal of analog photography — silver gelatin, contact sheets and the stories behind exposures that took years.", cta: "Issue 09", cta2: "The archive", heroLayout: "left", serifHead: true, radius: 0, pal: { bg: "#f6f5f1", surface: "#eceae3", ink: "#1c1b18", muted: "#77746c", line: "rgba(0,0,0,0.09)" }, accent: "#3a3a3a", features: [["Silver gelatin", "Printed in a darkroom, not a plotter."], ["Contact sheets", "The misses, published too."], ["Quarterly", "Four issues. No fillers."]], proof: [["9", "issues"], ["4", "prints per issue"], ["300", "copies each"]], quote: "The only photography magazine I keep on the shelf spine-out.", quoteBy: "Subscriber", footerLine: "Silver & Salt — quarterly, in print." },
  { slug: "gainsford-hotel", brand: "The Gainsford", category: "editorial", kicker: "COUNTRY HOUSE HOTEL", headline: "Twenty-two rooms. No televisions.", sub: "A Georgian house on the moor — long breakfasts, wet dogs welcome by the side door, and a bar that closes when the last glass does.", cta: "Check availability", cta2: "The house", heroLayout: "split", serifHead: true, radius: 0, pal: { bg: "#f5f2ec", surface: "#ffffff", ink: "#242019", muted: "#7d766a", line: "rgba(0,0,0,0.09)" }, accent: "#5a5343", features: [["No televisions", "The moor is the program."], ["Wet dogs", "Welcome, by the side door."], ["Long breakfasts", "Served until noon. Genuinely."]], proof: [["22", "rooms"], ["1734", "built"], ["1200", "acres of moor"]], quote: "We came for two nights and rearranged the month.", quoteBy: "Returning guest", footerLine: "The Gainsford — est. 1734, unmoved." },
  { slug: "lodestone", brand: "Lodestone", category: "editorial", kicker: "MARITIME HISTORY", headline: "Every lighthouse keeps a logbook.", sub: "Quarterly essays from keepers, wreck divers and chartmakers — the coast written by the people who work it.", cta: "Issue seven", cta2: "Subscribe", heroLayout: "left", serifHead: true, radius: 0, pal: { bg: "#f2f3f2", surface: "#e7e9e7", ink: "#17201d", muted: "#68756f", line: "rgba(0,0,0,0.08)" }, accent: "#2f5d50", features: [["Keepers", "First-person logbook excerpts."], ["Charts", "Reproduced at full scale."], ["Wreck divers", "The coast from below."]], proof: [["7", "issues"], ["60", "keepers interviewed"], ["1888", "oldest logbook"]], quote: "The only magazine my father and I read separately, then call about.", quoteBy: "Subscriber", footerLine: "Lodestone — the coast, by the people who work it." },
  { slug: "wildflower-press", brand: "Wildflower Press", category: "editorial", kicker: "BOTANY BOOKS", headline: "Field guides for the unhurried.", sub: "Botany you can read in bed — illustrated by hand, indexed by habitat, written by working botanists.", cta: "The collection", cta2: "The illustrators", heroLayout: "center", serifHead: true, radius: 0, pal: { bg: "#f4f6f0", surface: "#e9ede2", ink: "#1d241a", muted: "#6f7a68", line: "rgba(0,0,0,0.08)" }, accent: "#4a6741", features: [["Hand-illustrated", "No stock photography, ever."], ["By habitat", "Index the way you walk."], ["Working botanists", "Authors with mud on their boots."]], proof: [["4", "titles"], ["200+", "plates per book"], ["Hand", "illustrated"]], quote: "The first field guide I read cover to cover in one evening.", quoteBy: "Reader", footerLine: "Wildflower Press — botany for the unhurried." },
  { slug: "covered-food", brand: "Covered", category: "editorial", kicker: "FOOD WRITING", headline: "The dish before the décor.", sub: "A journal about kitchens — recipes with the failures kept in, profiles of the cooks, and the economics nobody prints.", cta: "Issue three", cta2: "Recipes", heroLayout: "left", serifHead: true, radius: 0, pal: { bg: "#faf7f2", surface: "#f1ebe1", ink: "#231d15", muted: "#7e7466", line: "rgba(0,0,0,0.08)" }, accent: "#8a5a2c", features: [["Failures kept in", "The collapsed soufflé, printed."], ["Cooks, profiled", "Not chefs. Cooks."], ["The economics", "What the menu actually costs."]], proof: [["3", "issues"], ["40+", "recipes"], ["0", "star ratings"]], quote: "Finally, food writing with the arithmetic left in.", quoteBy: "Reader, chef", footerLine: "Covered — kitchens, in print." },
  { slug: "longwave-radio", brand: "Longwave", category: "editorial", kicker: "RADIO ESSAYS", headline: "Essays for the radio, on paper.", sub: "Scripts from a midnight radio hour — broadcast, then printed with the parts the timing cut.", cta: "Season four", cta2: "The archive", heroLayout: "center", serifHead: true, radius: 0, pal: { bg: "#f3f2ef", surface: "#e9e7e0", ink: "#1b1a17", muted: "#74716a", line: "rgba(0,0,0,0.08)" }, accent: "#434343", features: [["The scripts", "Printed with the cut parts."], ["Midnight hour", "Broadcast, then on paper."], ["Fourteen essays", "One season."]], proof: [["14", "essays"], ["1", "midnight hour"], ["3", "seasons"]], quote: "Radio you can read in bed. It works.", quoteBy: "Listener", footerLine: "Longwave — essays for the radio." },

  /* ---- Swiss (4) ---- */
  { slug: "kessel-design", brand: "Kessel", category: "swiss", kicker: "INDUSTRIAL DESIGN — ESSEN", headline: "Objects that survive the factory floor.", sub: "Housings, handles and control panels for industrial equipment — designed for gloved hands, ten-year shifts and yesterday's budget.", cta: "Selected work", cta2: "The studio", heroLayout: "left", radius: 0, pal: { bg: "#ffffff", surface: "#f0f0ef", ink: "#141414", muted: "#666663", line: "#e2e2e0" }, accent: "#c8102e", features: [["Gloved hands", "Every control tested with mitts."], ["Ten-year shifts", "Materials rated for the decade."], ["Yesterday's budget", "Designed within existing tooling."]], proof: [["40+", "products"], ["10 yr", "shift rating"], ["1986", "founded"]], quote: "The only design studio that asked about our cleaning schedule.", quoteBy: "Plant manager", footerLine: "Kessel — Essen, since 1986." },
  { slug: "norm-furniture", brand: "Norm", category: "swiss", kicker: "FURNITURE SYSTEMS", headline: "Furniture sold as a system, not a set.", sub: "Twelve parts, four joints, infinite arrangements. Cut, drilled and edged to your room's exact measurements.", cta: "The system", cta2: "Configure", heroLayout: "left", radius: 0, pal: { bg: "#fbfbfa", surface: "#f1f1ef", ink: "#191919", muted: "#6d6d6a", line: "#e3e3e1" }, accent: "#1d1d1f", features: [["Twelve parts", "The entire catalog."], ["Cut to measure", "Your room's exact numbers."], ["Four joints", "No fasteners, no glue."]], proof: [["12", "parts"], ["4", "joints"], ["∞", "arrangements"]], quote: "We moved office twice. The furniture came with us, re-cut.", quoteBy: "Studio manager", footerLine: "Norm — furniture as a system." },
  { slug: "stopp-clocks", brand: "Stopp", category: "swiss", kicker: "CLOCKS — SCHAFFHAUSEN", headline: "Time, read at a glance.", sub: "Station clocks and kitchen timers with a single hand and no numbers — because you learned to tell time once, decades ago.", cta: "The clocks", cta2: "Kitchen series", heroLayout: "center", radius: 0, pal: { bg: "#ffffff", surface: "#f1f1f1", ink: "#141414", muted: "#696966", line: "#e4e4e2" }, accent: "#141414", features: [["One hand", "Minutes matter. Seconds don't."], ["No numbers", "You learned this in kindergarten."], ["Railway accuracy", "The minute hand waits for the last train."]], proof: [["1", "hand"], ["0", "numbers"], ["±1 s", "per day"]], quote: "Guests think it's art. It's just a very honest clock.", quoteBy: "Kitchen owner", footerLine: "Stopp — Schaffhausen." },
  { slug: "vier-accounting", brand: "Vier", category: "swiss", kicker: "ACCOUNTING — ZUG", headline: "Accounting in four columns.", sub: "Swiss bookkeeping for small companies: date, account, debit, credit. Nothing hidden in a sub-menu since 1998.", cta: "The method", cta2: "Pricing", heroLayout: "left", radius: 0, pal: { bg: "#ffffff", surface: "#f2f2f0", ink: "#161616", muted: "#676764", line: "#e3e3e1" }, accent: "#1d4ed8", features: [["Four columns", "Date, account, debit, credit."], ["No sub-menus", "Nothing hidden since 1998."], ["Auditor-ready", "Print the year. Hand it over."]], proof: [["4", "columns"], ["1998", "method since"], ["0", "sub-menus"]], quote: "Our auditor asked what software we use. It's a notebook.", quoteBy: "Client, Zug", footerLine: "Vier — Zug, since 1998." },

  /* ---- Dark (7) ---- */
  { slug: "umbra-vpn", brand: "Umbra", category: "dark", kicker: "PRIVATE NETWORK", headline: "The VPN with amnesia.", sub: "Umbra routes your traffic and forgets it — no logs, no accounts, no email. Pay in monero if you like. We couldn't tell anyone even if asked.", cta: "Get Umbra", cta2: "The no-log audit", heroLayout: "center", radius: 16, pal: { bg: "#0a0c10", surface: "#131720", ink: "#e9edf2", muted: "#8b95a3", line: "rgba(255,255,255,0.08)" }, accent: "#8fd6a8", features: [["No logs", "Audited, published, twice."], ["No accounts", "A key is your identity."], ["Monero accepted", "Payment that forgets too."]], proof: [["0", "logs kept"], ["2×", "audited"], ["38", "countries"]], quote: "The first VPN whose privacy policy is one sentence long.", quoteBy: "Security researcher", footerLine: "Umbra — the VPN with amnesia." },
  { slug: "cipher-keys", brand: "Cipher", category: "dark", kicker: "PASSWORD MANAGER", headline: "Your keys, encrypted by math you can check.", sub: "Open-source, local-first, sync by scrypt — Cipher never sees a master password because there's nothing to intercept.", cta: "Download free", cta2: "The protocol", heroLayout: "center", radius: 16, pal: { bg: "#0b0d13", surface: "#141824", ink: "#eceff5", muted: "#8e99b0", line: "rgba(255,255,255,0.08)" }, accent: "oklch(0.78 0.12 275)", features: [["Local-first", "Nothing to intercept."], ["Open source", "Every line, auditable."], ["Scrypt sync", "Your phrase, your keys."]], proof: [["0", "servers holding secrets"], ["100%", "open source"], ["∞", "devices"]], quote: "The first manager where I read the sync code and relaxed.", quoteBy: "Security engineer", footerLine: "Cipher — math you can check." },
  { slug: "eclipse-podcasts", brand: "Eclipse", category: "dark", kicker: "PODCAST NETWORK", headline: "Shows for the insomnia hours.", sub: "A small network of slow, unhurried shows — field recordings, long interviews and one hour of static, weekly.", cta: "Browse shows", cta2: "Subscribe", heroLayout: "center", radius: 16, pal: { bg: "#0c0d11", surface: "#15171e", ink: "#eef0f4", muted: "#9096a8", line: "rgba(255,255,255,0.08)" }, accent: "oklch(0.75 0.1 275)", features: [["Slow, on purpose", "No hooks. No ramps."], ["Field recordings", "One place, per episode."], ["Weekly", "Thursday, midnight UTC."]], proof: [["6", "shows"], ["Thu", "midnight UTC"], ["120+", "episodes"]], quote: "The only network where 'boring' is the compliment.", quoteBy: "Listener", footerLine: "Eclipse — shows for the insomnia hours." },
  { slug: "obsidian-audio", brand: "Obsidian", category: "dark", kicker: "SOUND DESIGN", headline: "Sound design for rooms that echo.", sub: "Bespoke audio identities for museums, hotels and stations — recorded on site, mixed for the architecture you actually built.", cta: "Start a project", cta2: "Selected rooms", heroLayout: "split", radius: 16, pal: { bg: "#0d0e12", surface: "#171922", ink: "#edeff4", muted: "#8e94a8", line: "rgba(255,255,255,0.08)" }, accent: "oklch(0.72 0.1 260)", features: [["Recorded on site", "Your room's own reverb."], ["Mixed for architecture", "Not for headphones."], ["Installed", "We tune the speakers too."]], proof: [["22", "rooms tuned"], ["6", "museums"], ["100%", "on-site recorded"]], quote: "The lobby sounds like the building looks. No one could say why that matters until it happened.", quoteBy: "Museum director", footerLine: "Obsidian — sound design for rooms that echo." },
  { slug: "nocturne-jazz", brand: "Nocturne", category: "dark", kicker: "JAZZ CLUB — BASEL", headline: "Two sets. No talking over the trio.", sub: "A listening room for forty people — the trio plays two sets, the bar closes between them, and the coat check is honest.", cta: "This week's sets", cta2: "Reserve", heroLayout: "center", radius: 14, pal: { bg: "#0b0c0e", surface: "#151619", ink: "#f0f0f2", muted: "#94959c", line: "rgba(255,255,255,0.08)" }, accent: "oklch(0.8 0.08 90)", features: [["Two sets", "20:00 and 22:30. Sharp."], ["Forty seats", "Listening room, not a bar."], ["The trio", "Resident since 2019."]], proof: [["40", "seats"], ["2", "sets nightly"], ["2019", "the trio, together"]], quote: "The room sounds like a record. The bar sounds like nothing, which helps.", quoteBy: "Regular, seat 12", footerLine: "Nocturne — Basel, Thursday to Sunday." },
  { slug: "onyx-search", brand: "Onyx", category: "dark", kicker: "PRIVATE SEARCH", headline: "Search that keeps no history.", sub: "Same results as the big engines, zero query storage — proxy fetches, rotating exits, and a page that forgets you the second it loads.", cta: "Make default", cta2: "How it works", heroLayout: "center", radius: 14, pal: { bg: "#0a0b0d", surface: "#141519", ink: "#eef0f3", muted: "#8d939e", line: "rgba(255,255,255,0.08)" }, accent: "oklch(0.72 0.06 280)", features: [["No query storage", "Checked by the audit, twice."], ["Rotating exits", "One exit per search."], ["Same results", "Proxy fetches, real index."]], proof: [["0", "queries stored"], ["1", "exit per search"], ["2×", "independently audited"]], quote: "Switched my default and forgot it exists. Which is the point.", quoteBy: "Daily user", footerLine: "Onyx — search that keeps no history." },
  { slug: "dusk-sleep", brand: "Dusk", category: "dark", kicker: "SLEEP SOUNDS", headline: "One sound. No screen.", sub: "Dusk plays one generated soundscape — brown noise tuned to your room — and turns the display off. That's the entire feature list.", cta: "Get Dusk", cta2: "Why brown noise", heroLayout: "center", radius: 14, pal: { bg: "#0a0b0f", surface: "#12141c", ink: "#e9ecf3", muted: "#8890a3", line: "rgba(255,255,255,0.07)" }, accent: "oklch(0.7 0.08 280)", features: [["One soundscape", "Generated, never looped."], ["Screen off", "The display is not the product."], ["No account", "It has nothing to remember."]], proof: [["1", "soundscape"], ["0", "accounts"], ["∞", "playback"]], quote: "Deleted three sleep apps. Dusk is a knob and a sound.", quoteBy: "Light sleeper", footerLine: "Dusk — one sound, no screen." },

  /* ---- Warm (8) ---- */
  { slug: "fig-and-fern", brand: "Fig & Fern", category: "warm", kicker: "VEGETARIAN KITCHEN", headline: "Vegetables, treated like the main event.", sub: "A twelve-table kitchen where the menu is whatever the farm brought — cooked over fire, served on the potter's seconds.", cta: "Reserve", cta2: "This week's menu", heroLayout: "split", serifHead: true, radius: 14, pal: { bg: "#f8f5ee", surface: "#ffffff", ink: "#26221a", muted: "#7f7868", line: "rgba(0,0,0,0.08)" }, accent: "#5a7247", features: [["Farm menu", "Whatever came this morning."], ["Cooked over fire", "No gas line in the building."], ["Potter's seconds", "The plates with character."]], proof: [["12", "tables"], ["1", "menu a week"], ["9 km", "to the farm"]], quote: "The carrot plate converted my steak-only father-in-law.", quoteBy: "Regular, table 3", footerLine: "Fig & Fern — vegetables as the main event." },
  { slug: "byre-barns", brand: "Byre", category: "warm", kicker: "BARN CONVERSIONS", headline: "Barns that keep their beams.", sub: "We convert agricultural barns into homes — keeping the frame, the hay door and the swallow's nest entrance, because they were the best parts.", cta: "Current projects", cta2: "The method", heroLayout: "left", radius: 14, pal: { bg: "#f6f3ed", surface: "#ffffff", ink: "#25211a", muted: "#7c7466", line: "rgba(0,0,0,0.08)" }, accent: "#8a5a2c", features: [["The frame stays", "Every original beam kept."], ["Swallow entrance", "Rebuilt into the gable."], ["Hay door", "Now the balcony door."]], proof: [["9", "barns converted"], ["100%", "frames kept"], ["3", "swallow colonies"]], quote: "They argued with the planner for our swallows. And won.", quoteBy: "Client, Byre 04", footerLine: "Byre — barns that keep their beams." },
  { slug: "clover-farm", brand: "Clover", category: "warm", kicker: "FARM SHOP", headline: "Everything here has a first name.", sub: "One farm shop, four neighboring farms, a chalkboard that says which field this morning's eggs came from.", cta: "Opening hours", cta2: "The farms", heroLayout: "center", radius: 14, pal: { bg: "#f7f4ea", surface: "#ffffff", ink: "#232015", muted: "#7e7767", line: "rgba(0,0,0,0.08)" }, accent: "#6b7d3f", features: [["Four farms", "One shop, all neighbors."], ["The chalkboard", "Field names, every morning."], ["Honest bread", "Baked in the old dairy."]], proof: [["4", "neighboring farms"], ["1", "old dairy bakery"], ["7", "days a week"]], quote: "The eggs have a first name. The bread has a street address.", quoteBy: "Local, weekly", footerLine: "Clover — everything has a first name." },
  { slug: "bramble-preserves", brand: "Bramble", category: "warm", kicker: "JAM & PRESERVES", headline: "Jam with the season's argument in it.", sub: "Small-batch preserves made when the fruit is right — damson in September, seville in January, nothing in between.", cta: "The pantry", cta2: "This month", heroLayout: "split", serifHead: true, radius: 14, pal: { bg: "#f9f4ef", surface: "#ffffff", ink: "#281f18", muted: "#827869", line: "rgba(0,0,0,0.08)" }, accent: "#a04b2e", features: [["Seasonal, honestly", "Damson in September. Then gone."], ["Small batch", "Forty jars, one afternoon."], ["Less sugar", "Fruit first. It sets slower."]], proof: [["40", "jars per batch"], ["9", "fruits, in season"], ["Less", "sugar, slower set"]], quote: "The damson is worth setting an alarm for.", quoteBy: "Market regular", footerLine: "Bramble — jam when the fruit is right." },
  { slug: "wren-stationery", brand: "Wren", category: "warm", kicker: "STATIONERY", headline: "Paper for people who still write.", sub: "Letterpress notecards, linen-bound notebooks and ink made in small batches — printed on a 1962 Heidelberg that squeaks with pride.", cta: "The shop", cta2: "Custom printing", heroLayout: "split", serifHead: true, radius: 14, pal: { bg: "#f9f6f0", surface: "#ffffff", ink: "#241f18", muted: "#807a6e", line: "rgba(0,0,0,0.08)" }, accent: "#3f5d4e", features: [["Letterpress", "1962 Heidelberg, audible."], ["Linen-bound", "Notebooks that lie flat."], ["Small-batch ink", "Mixed monthly, in the shop."]], proof: [["1962", "the press"], ["90 g", "cotton paper"], ["3", "ink shades"]], quote: "My thank-you notes got noticeably better handwriting.", quoteBy: "Stationery convert", footerLine: "Wren — paper for people who write." },
  { slug: "solstice-yoga", brand: "Solstice", category: "warm", kicker: "YOGA RETREAT", headline: "A week where the schedule is optional.", sub: "Two classes a day in a converted barn, more yoga in the meadow if you want it, and a valley that doesn't care either way.", cta: "2027 dates", cta2: "The barn", heroLayout: "center", serifHead: true, radius: 14, pal: { bg: "#f5f3ea", surface: "#ffffff", ink: "#22241c", muted: "#7c8070", line: "rgba(0,0,0,0.08)" }, accent: "#56693f", features: [["Two classes", "Morning and dusk. That's it."], ["The meadow", "Optional third session."], ["The valley", "Doesn't care. That helps."]], proof: [["2", "classes a day"], ["12", "guests max"], ["1", "converted barn"]], quote: "I did three sessions and napped through four. Both counted.", quoteBy: "Guest, week two", footerLine: "Solstice — the schedule is optional." },
  { slug: "hive-beekeepers", brand: "Hive", category: "warm", kicker: "BEEKEEPERS", headline: "Honey with a hive address.", sub: "Six hives on the edge of the heath — each jar labeled with the hive, the month and what was flowering.", cta: "This year's jars", cta2: "Meet the hives", heroLayout: "center", serifHead: true, radius: 14, pal: { bg: "#faf5e8", surface: "#ffffff", ink: "#2a2210", muted: "#87795d", line: "rgba(0,0,0,0.08)" }, accent: "#b8860b", features: [["Hive-labeled", "Hive, month, flowering."], ["Heath honey", "Ling heather, September only."], ["Raw", "Unfiltered, unset, unbothered."]], proof: [["6", "hives"], ["Sep", "heather season"], ["Raw", "unfiltered"]], quote: "The September jar tastes like the heath smells. I didn't know honey could.", quoteBy: "Local, three years", footerLine: "Hive — honey with a hive address." },
  { slug: "loom-textiles", brand: "Loom", category: "warm", kicker: "HANDWOVEN TEXTILES", headline: "Throws with the weaver's knot left in.", sub: "Wool throws woven on a 1948 loom — the weaver's knot is left visible in every fringe, because that's where the wool changed.", cta: "This winter's wool", cta2: "The loom", heroLayout: "split", serifHead: true, radius: 14, pal: { bg: "#f6f2ec", surface: "#ffffff", ink: "#26201a", muted: "#7f7668", line: "rgba(0,0,0,0.08)" }, accent: "#7a5c3e", features: [["1948 loom", "One loom. One weaver."], ["The knot stays", "Where the wool changed, marked."], ["Local wool", "From four farms you can visit."]], proof: [["1948", "the loom"], ["4", "wool farms"], ["1", "weaver"]], quote: "The knot in the fringe is the best part. It's the signature.", quoteBy: "Interior designer", footerLine: "Loom — the weaver's knot stays in." },

  /* ---- Mono dev (4) ---- */
  { slug: "static-radio", brand: "Static", category: "mono", kicker: "RADIO ENGINEERING BLOG", headline: "Essays on the noise floor.", sub: "A blog about radio engineering — antennas, filters and the physics of why your signal dies at the exact wrong moment.", cta: "Read issue 31", cta2: "The archive", heroLayout: "left", radius: 0, pal: { bg: "#101214", surface: "#181b1f", ink: "#e8ebee", muted: "#8b95a0", line: "rgba(255,255,255,0.08)" }, accent: "oklch(0.8 0.12 160)", features: [["Noise floor", "The physics of the wrong moment."], ["Antennas", "Designs you can build in a weekend."], ["No sponsor", "One reader donation, if you insist."]], proof: [["31", "issues"], ["0", "sponsors"], ["Wknd", "buildable antennas"]], quote: "Issue 19 fixed an interference problem two engineers couldn't.", quoteBy: "Amateur radio operator", footerLine: "Static — essays on the noise floor." },
  { slug: "patch-changelog", brand: "Patch", category: "mono", kicker: "CHANGELOG TOOL", headline: "Changelogs users actually read.", sub: "Write releases in plain sentences. Patch renders them as a page your users subscribe to — no dashboard, no login for readers.", cta: "Start writing", cta2: "A live example", heroLayout: "left", radius: 0, pal: { bg: "#0e1113", surface: "#161b1e", ink: "#e6ebee", muted: "#8b98a3", line: "rgba(255,255,255,0.08)" }, accent: "oklch(0.8 0.12 200)", features: [["Plain sentences", "Users subscribe in one click."], ["No login", "Readers never see a dashboard."], ["RSS first", "The feed is the product."]], proof: [["1", "markdown file"], ["RSS", "first-class"], ["0", "dashboard for readers"]], quote: "Our changelog went from a graveyard to the most-clicked link.", quoteBy: "Product team", footerLine: "Patch — changelogs users read." },
  { slug: "fork-funding", brand: "Fork", category: "mono", kicker: "OPEN SOURCE FUNDING", headline: "Fund the forks that fix things.", sub: "Backers pledge per merged fix, not per month. Maintainers get paid for the work that actually lands.", cta: "Back a repo", cta2: "For maintainers", heroLayout: "left", radius: 0, pal: { bg: "#0d0f11", surface: "#15181c", ink: "#e7ecf0", muted: "#8794a1", line: "rgba(255,255,255,0.08)" }, accent: "oklch(0.8 0.12 145)", features: [["Per merged fix", "Paid when it lands, not before."], ["Public ledger", "Every pledge, on the record."], ["No exclusives", "Forks stay forks."]], proof: [["€84k", "paid to maintainers"], ["214", "repos funded"], ["0", "exclusivity clauses"]], quote: "The first funding model that pays for fixes instead of promises.", quoteBy: "Maintainer, 4k stars", footerLine: "Fork — fund the forks that fix things." },
  { slug: "manpage-docs", brand: "Man Page", category: "mono", kicker: "DOCS GENERATOR", headline: "Docs that look like the tool feels.", sub: "Generate man-style documentation straight from your CLI's help output — flags, exits and examples, no markdown site needed.", cta: "Try with your CLI", cta2: "Example output", heroLayout: "left", radius: 0, pal: { bg: "#0b0d0f", surface: "#141719", ink: "#e6eaee", muted: "#8b96a2", line: "rgba(255,255,255,0.08)" }, accent: "oklch(0.8 0.1 210)", features: [["From --help", "Parses what your CLI already says."], ["Man-style", "The format thirty years of tools use."], ["Static", "One HTML file. Host anywhere."]], proof: [["1", "command"], ["1", "HTML file"], ["0", "markdown site"]], quote: "Our CLI finally has docs, and they match the binary.", quoteBy: "Tool author", footerLine: "Man Page — docs that look like the tool feels." },

  /* ---- Brutalist (3) ---- */
  { slug: "raw-counters", brand: "RAW", category: "brutal", kicker: "COUNTERTOPS", headline: "CONCRETE. HONEST ABOUT IT.", sub: "Kitchen counters cast in exposed concrete — every air bubble kept, every seam declared. Sealed twice a year with wax you apply yourself.", cta: "GET A QUOTE", cta2: "THE PROCESS", heroLayout: "center", radius: 0, pal: { bg: "#e6e4df", surface: "#d9d6cf", ink: "#161614", muted: "#5f5c55", line: "#c7c4bc" }, accent: "#161614", features: [["Every bubble kept", "Air is part of the finish."], ["Seams declared", "Marked in the drawing, not hidden."], ["Wax, twice a year", "You maintain it. It lasts decades."]], proof: [["100%", "cast on site"], ["2×/yr", "wax, by you"], ["50 yr", "lifespan"]], quote: "It looks unfinished until you live with it a month. Then nothing else looks finished.", quoteBy: "Kitchen client", footerLine: "RAW — concrete, honest about it." },
  { slug: "stack-zines", brand: "STACK", category: "brutal", kicker: "ZINE DISTRIBUTOR", headline: "ZINES FOR THE BASEMENT SHOW.", sub: "We distribute photocopied music zines — stapled, folded wrong, ink on your fingers. Forty titles, restocked when the copier works.", cta: "THIS MONTH", cta2: "SUBMIT A ZINE", heroLayout: "center", radius: 0, pal: { bg: "#141414", surface: "#1f1f1f", ink: "#f2f2ee", muted: "#8f8f88", line: "#2e2e2e" }, accent: "#f5c04e", features: [["Photocopied", "Deliberately. It's the medium."], ["40 titles", "Restocked when the copier works."], ["Stapled wrong", "On purpose. Mostly."]], proof: [["40", "titles"], ["1st", "Friday restock"], ["€3", "average cover"]], quote: "STACK is where I found half the bands I book now.", quoteBy: "Basement show promoter", footerLine: "STACK — zines for the basement show." },
  { slug: "block-boxing", brand: "BLOCK", category: "brutal", kicker: "BOXING GYM", headline: "NO MIRRORS. NO MUSIC. NO MERCY.", sub: "A boxing gym in a former cold-storage warehouse. Bags, rings, a schedule on a whiteboard and a coach who counts your reps out loud.", cta: "FIRST SESSION FREE", cta2: "SCHEDULE", heroLayout: "center", radius: 0, pal: { bg: "#101112", surface: "#1a1b1d", ink: "#f0f0ee", muted: "#8e8e8a", line: "#26272a" }, accent: "#f5f5f2", features: [["No mirrors", "The bag tells you the truth."], ["Whiteboard schedule", "Erased and rewritten weekly."], ["Coach counts", "Out loud. To your face."]], proof: [["0", "mirrors"], ["1", "whiteboard"], ["6", "coaches, all ex-fighters"]], quote: "The whiteboard is the app. It works.", quoteBy: "Member, three years", footerLine: "BLOCK — no mirrors, no music, no mercy." },

  /* ---- Gradient modern (5) ---- */
  { slug: "flux-design", brand: "Flux", category: "gradient", kicker: "DESIGN TOOL", headline: "The canvas that computes.", sub: "Flux is a design tool where every shape is a live calculation — move a node and the whole system recomputes around it, instantly.", cta: "Try in browser", cta2: "Watch the demo", heroLayout: "center", radius: 20, pal: { bg: "#ffffff", surface: "#f6f7f9", ink: "#16181d", muted: "#6b7280", line: "rgba(0,0,0,0.07)" }, accent: "#22707e", features: [["Live constraints", "Every shape recomputes. Instantly."], ["One file", "The design IS the source."], ["Keyboard-first", "Your hands never find a menu."]], proof: [["60 fps", "recompute"], ["1", "file format"], ["0", "plugins needed"]], quote: "It feels less like drawing and more like arguing with a very fast mathematician.", quoteBy: "Design engineer", footerLine: "Flux — the canvas that computes." },
  { slug: "orbit-planning", brand: "Orbit", category: "gradient", kicker: "PROJECT PLANNING", headline: "Plans that survive Monday.", sub: "Orbit holds the plan loosely — when reality changes, dependencies re-flow, dates re-ask and nobody replans by hand.", cta: "Start a plan", cta2: "How re-flow works", heroLayout: "split", radius: 20, pal: { ...P.white }, accent: "#22707e", features: [["Re-flow", "Change one date, see the blast radius."], ["Re-ask", "Conflicts surface as questions."], ["No replanning", "By hand. Ever."]], proof: [["-38%", "status meetings"], ["1", "source of truth"], ["3 s", "re-flow time"]], quote: "The plan finally survives contact with the team.", quoteBy: "Delivery lead", footerLine: "Orbit — plans that survive Monday." },
  { slug: "prism-palettes", brand: "Prism", category: "gradient", kicker: "COLOR PALETTES", headline: "Palettes that pass contrast before you pick them.", sub: "Every generated palette is pre-checked against WCAG contrast for the pairings you'll actually use — text on accent, accent on surface.", cta: "Generate", cta2: "How checking works", heroLayout: "center", radius: 20, pal: { ...P.paper }, accent: "#1f9d55", features: [["Pre-checked", "Contrast passes before you see it."], ["Real pairings", "Text on accent, not swatches."], ["Export anywhere", "CSS, Swift, Compose, Figma."]], proof: [["AA+", "guaranteed pairs"], ["4", "export targets"], ["0", "contrast surprises"]], quote: "The first palette tool that thinks about contrast so I don't have to.", quoteBy: "Product designer", footerLine: "Prism — palettes that pass contrast." },
  { slug: "nimbus-weather", brand: "Nimbus", category: "gradient", kicker: "WEATHER API", headline: "Weather data with a memory.", sub: "Nimbus keeps every forecast it ever made — so you can measure the forecast against the weather and trust the next one.", cta: "Get an API key", cta2: "Forecast accuracy", heroLayout: "split", radius: 20, pal: { bg: "#f4f6f8", surface: "#ffffff", ink: "#181d24", muted: "#697180", line: "rgba(0,0,0,0.07)" }, accent: "#22707e", features: [["Forecast memory", "Every prediction, kept public."], ["Hyper-local", "Down to the rooftop."], ["Honest bands", "Confidence, not certainty."]], proof: [["6 yrs", "of kept forecasts"], ["40 m", "grid resolution"], ["180+", "countries"]], quote: "The only weather API that publishes its own miss rate.", quoteBy: "Sailing app founder", footerLine: "Nimbus — weather data with a memory." },
  { slug: "braid-orchestrator", brand: "Braid", category: "gradient", kicker: "API ORCHESTRATOR", headline: "Twelve APIs. One braid.", sub: "Braid wires your payment, mail and database calls into one ordered flow — retries braided in, failures isolated, logs you can read.", cta: "Start braiding", cta2: "Read the docs", heroLayout: "center", radius: 20, pal: { ...P.charcoal }, accent: "#8fd6a8", features: [["One flow", "Twelve calls, one braid."], ["Failures isolated", "One service failing isn't your outage."], ["Readable logs", "Ordered, plain, diffable."]], proof: [["12", "APIs, one flow"], ["3", "retries braided in"], ["1", "log you can read"]], quote: "The braid replaced a queue, two cron jobs and a prayer.", quoteBy: "Backend lead", footerLine: "Braid — twelve APIs, one braid." },
);
