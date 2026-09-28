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
