import type { CategoryId, ControlDef, WidgetDef, WidgetConfig } from "./types";

/* ---------------------------------------------------------------- helpers */

const PNOTE: ControlDef = { key: "note", label: "Caption under the card", type: "text" };
const pform = (...extra: ControlDef[]): ControlDef[] => [ACCENT, TEXT("Title"), PNOTE, ...extra];

const THEME: ControlDef = { key: "theme", label: "Theme", type: "theme" };
const ACCENT: ControlDef = { key: "accent", label: "Accent color", type: "color" };
const RADIUS: ControlDef = { key: "radius", label: "Corner radius", type: "range", min: 0, max: 24, step: 2 };
const DENSITY: ControlDef = { key: "density", label: "Density", type: "select", options: [
  { value: "cozy", label: "Cozy" }, { value: "compact", label: "Compact" } ] };
const BADGE: ControlDef = { key: "showBadge", label: "Made with PlanckUi badge", type: "toggle" };
const SPEED: ControlDef = { key: "speed", label: "Speed (seconds per loop)", type: "range", min: 4, max: 120, step: 1 };
const ITEMS = (label: string, help: string): ControlDef => ({ key: "items", label, type: "textarea", help });
const TEXT = (label: string): ControlDef => ({ key: "text", label, type: "text" });
const LINK = (label: string): ControlDef => ({ key: "link", label, type: "text" });

const base = (...extra: ControlDef[]): ControlDef[] => [THEME, ACCENT, RADIUS, DENSITY, ...extra, BADGE];
const form = (heading = "Heading"): ControlDef[] => [TEXT(heading)];

function live(id: string, name: string, category: CategoryId, blurb: string, def: Partial<WidgetDef> = {}): WidgetDef {
  return { id, name, category, blurb, status: "live", ...def };
}

/* ---------------------------------------------------------------- catalog */

export const WIDGETS: WidgetDef[] = [
  /* ---- A. Testimonials & social proof ---- */
  live("wall-of-love", "Wall of Love", "proof", "A masonry grid of your best testimonials. The classic trust builder.", {
    needsCollection: true, defaults: { variant: "masonry", maxWidth: 1100 },
    controls: base({ key: "variant", label: "Layout", type: "select", options: [{ value: "masonry", label: "Masonry columns" }, { value: "grid", label: "Even grid" }] },
      { key: "maxColumns", label: "Max columns", type: "range", min: 1, max: 5, step: 1 }) }),
  live("testimonial-carousel", "Testimonial carousel", "proof", "A swipeable, snap-scrolling row of testimonial cards.", {
    needsCollection: true, controls: base() }),
  live("testimonial-marquee", "Testimonial marquee", "proof", "A slow, endless ticker of short quotes. Pauses on hover.", {
    needsCollection: true, defaults: { speed: 45, variant: "left" },
    controls: base(SPEED, { key: "variant", label: "Direction", type: "select", options: [{ value: "left", label: "Scroll left" }, { value: "right", label: "Scroll right" }] }) }),
  live("testimonial-spotlight", "Testimonial spotlight", "proof", "One big quote, beautifully set. Rotates through your favorites.", {
    needsCollection: true, controls: base() }),
  live("rating-summary", "Rating summary", "proof", "Average score with a star breakdown, computed from real data.", {
    needsCollection: true, controls: base() }),
  live("rating-badge", "Rating badge strip", "proof", "A compact one-line trust badge: score, stars, count.", {
    needsCollection: true, defaults: { density: "compact" }, controls: base() }),
  live("video-testimonial-wall", "Video testimonial wall", "proof", "Video testimonials in a tidy grid, loaded lazily.", {
    needsCollection: true, defaults: { maxColumns: 3 },
    controls: base({ key: "maxColumns", label: "Max columns", type: "range", min: 1, max: 4, step: 1 }) }),
  live("tweet-wall", "X / Twitter wall", "proof", "Curated posts as clean quote cards that open on X.", {
    defaults: { items: "https://x.com/jack/status/20 | just setting up my timeline | jack\nhttps://x.com/elonmusk/status/1584 | The proof is in the posting | Elon" },
    controls: base(ITEMS("Posts", "One per line: Post URL | Text (optional) | Author")) }),
  live("google-reviews-wall", "Google Reviews wall", "proof", "Your Google reviews, pasted in and displayed beautifully.", {
    defaults: { text: "Hallow Coffee · Google rating", items: "Priya S. | 5 | The flat white here reset my standards.\nMarc D. | 5 | Staff remembers your order. Sorcery." },
    controls: base(TEXT("Place label"), ITEMS("Reviews", "One per line: Name | Rating | Text")) }),
  live("google-rating-badge", "Google rating badge", "proof", "Compact Google score and review count.", {
    defaults: { density: "compact", items: "Priya S. | 5 | Great.\nMarc D. | 5 | Lovely.\nAna P. | 4 | Solid." },
    controls: base(ITEMS("Reviews", "One per line: Name | Rating | Text")) }),
  live("product-reviews-carousel", "Product reviews carousel", "proof", "Per-product reviews in a snap row.", {
    defaults: { items: "Aero Press | 5 | Changed my mornings. | Lena\nAero Press | 4 | Cleanup could be easier. | Rob\nGrinder | 5 | Grind consistency is unreal. | Kim" },
    controls: base(ITEMS("Reviews", "One per line: Product | Rating | Text | Author")) }),
  live("case-study-card", "Case study card", "proof", "A result-first customer story card.", {
    defaults: { text: "+212% trial signups | Fern & Co. replaced three tools and their conversion followed. | “It paid for itself in a week.” | Maya Okafor, Founder" },
    controls: base(TEXT("Headline | Result | Quote | Author"), LINK("Case study URL")) }),
  live("customer-story-spotlight", "Customer story spotlight", "proof", "Long-form story with metrics and quote.", {
    defaults: { items: "Maya Okafor | Founder, Fern & Co. | We stopped paying for widgets, started embedding them, and nobody noticed the difference — except our accountant. | 3 tools replaced · 0 regressions" },
    controls: base(ITEMS("Story", "One line: Name | Role | Quote | Key fact")) }),
  live("testimonial-comparison-table", "Testimonial comparison table", "proof", "Before/after outcomes in a table.", {
    defaults: { items: "Setup time | 2 weeks | 5 minutes\nMonthly cost | $99 | $0\nSupport | Ticket queue | A human" },
    controls: base(TEXT("Table label"), ITEMS("Rows", "One per line: Aspect | Before | After")) }),
  live("press-logos", "As-seen-in press logos", "proof", "A quiet row of media logos.", {
    defaults: { text: "As seen in", speed: 40, items: "https://placehold.co/120x36?text=The+Post\nhttps://placehold.co/120x36?text=Herald\nhttps://placehold.co/120x36?text=Wire" },
    controls: base(TEXT("Label"), SPEED, ITEMS("Logo URLs", "One image URL per line")) }),
  live("nps-score-card", "NPS score card", "proof", "Promoter score with trend, in one card.", {
    defaults: { text: "Q3 customer survey", items: "62 | 26 | 12" },
    controls: base(TEXT("Survey label"), ITEMS("Counts", "One line: Promoters | Passives | Detractors")) }),
  live("audio-testimonial-player", "Audio testimonial player", "proof", "Voice notes as playable quote cards.", {
    defaults: { items: "https://www2.cs.uic.edu/~i101/SoundFiles/YouAintNothingButaHoundDog.wav | Priya on the new checkout" },
    controls: base(ITEMS("Audio", "One per line: Audio URL | Speaker")) }),
  live("ugc-photo-wall", "UGC photo wall", "proof", "Customer photos with captions and credit.", {
    defaults: { maxColumns: 3, items: "https://picsum.photos/seed/plk-ugc1/600/700 | Morning setup | @hana\nhttps://picsum.photos/seed/plk-ugc2/600/500 | Bench day | @otto\nhttps://picsum.photos/seed/plk-ugc3/600/650 | First batch | @mira" },
    controls: base(ITEMS("Photos", "One per line: Image URL | Caption | Credit"),
      { key: "maxColumns", label: "Max columns", type: "range", min: 1, max: 5, step: 1 }) }),
  live("live-activity-feed", "Live activity feed", "proof", "Recent signups, reviews and purchases.", {
    defaults: { items: "Maya left a 5-star review | just now\nOtto ordered the starter kit | 2 min ago\nHana joined the community | 9 min ago" },
    controls: base(ITEMS("Events", "One per line: Event | When")) }),
  live("rating-highlights-card", "Rating highlights card", "proof", "Most-quoted phrases from your reviews.", {
    defaults: { items: "“set my standards” | 14\n“finally easy” | 11\n“should have switched sooner” | 8" },
    controls: base(ITEMS("Phrases", "One per line: Phrase | Count")) }),

  /* ---- B. Collection & forms ---- */
  live("testimonial-form", "Testimonial collection form", "collect", "Collect text, star ratings and video testimonials. Standalone page or embedded.", {
    needsCollection: true, defaults: { text: "How was your experience?", variant: "full" },
    controls: form("Headline").concat([
      { key: "askRating", label: "Ask for a star rating", type: "toggle" },
      { key: "askVideo", label: "Offer video recording", type: "toggle" },
      { key: "askRole", label: "Ask for name and role", type: "toggle" }]) }),
  live("star-comment-form", "Star + comment form", "collect", "The short version: a rating and a sentence. Higher response rates.", {
    needsCollection: true, defaults: { text: "How did we do?", variant: "short", askVideo: false, askRole: false },
    controls: form("Heading").concat([{ key: "askRating", label: "Ask for a star rating", type: "toggle" }]) }),
  live("video-recorder-standalone", "Video recorder widget", "collect", "A camera-first recorder you can drop anywhere.", {
    needsCollection: true, defaults: { text: "Say it on camera" }, controls: form("Heading") }),
  live("nps-survey", "NPS survey", "collect", "The one-question loyalty survey.", {
    needsCollection: true, defaults: { text: "How likely are you to recommend us?" }, controls: form("Question") }),
  live("side-feedback-tab", "Side feedback tab", "collect", "A quiet tab pinned to the viewport edge.", {
    needsCollection: true, defaults: { text: "Feedback" }, controls: form("Tab label") }),
  live("contact-form", "Contact form", "collect", "A contact form with a spam-proof backend.", {
    needsCollection: true, defaults: { text: "Write to us" }, controls: form("Heading") }),
  live("newsletter-signup", "Newsletter signup", "collect", "Email capture that notifies you instantly.", {
    needsCollection: true, defaults: { text: "One useful email a month" }, controls: form("Heading") }),
  live("multi-question-survey", "Multi-question survey", "collect", "Short surveys with progress.", {
    needsCollection: true, defaults: { text: "Quick survey", items: "What almost stopped you from buying?\nWhat should we improve first?" },
    controls: form("Heading").concat([ITEMS("Questions", "One question per line")]) }),
  live("poll", "Poll widget", "collect", "One-click polls with live results.", {
    needsCollection: true, defaults: { text: "Next feature: pick one", items: "Dark mode everywhere\nMore export options\nA mobile app" },
    controls: form("Question").concat([ITEMS("Options", "One option per line")]) }),
  live("quiz", "Quiz widget", "collect", "Scored quizzes for lead capture.", {
    needsCollection: true, defaults: { text: "Coffee knowledge check", items: "What is a ristretto? | A short shot;;A big latte;;A cold brew | 0\nBest grind for espresso? | Fine;;Coarse;;Whole | 0" },
    controls: form("Quiz title").concat([ITEMS("Questions", "One per line: Question | option;;option;;option | correct index (0-based)")]) }),
  live("feature-request-board", "Feature request board", "collect", "Public requests with submissions.", {
    needsCollection: true, defaults: { text: "What should we build next?", items: "Calendar sync | Two-way sync with the usual calendars\nTeam spaces | Shared workspaces for small teams" },
    controls: form("Board title").concat([ITEMS("Seeded requests", "One per line: Title | Description")]) }),
  live("bug-report-widget", "Bug report widget", "collect", "Bug reports straight from your users.", {
    needsCollection: true, defaults: { text: "Found something broken?" }, controls: form("Heading") }),
  live("rsvp-form", "RSVP form", "collect", "Event RSVPs with plus-ones.", {
    needsCollection: true, defaults: { text: "Will you join us?" }, controls: form("Question") }),
  live("booking-request-form", "Booking request form", "collect", "Request-a-slot form with confirmations.", {
    needsCollection: true, defaults: { text: "Request a slot" }, controls: form("Heading") }),

  /* ---- C. Social feeds ---- */
  live("instagram-grid", "Instagram grid feed", "social", "Your posts as a clean grid of cards that open on Instagram.", {
    defaults: { text: "@fern.and.co", items: "https://instagram.com/p/a1\nhttps://instagram.com/p/b2\nhttps://instagram.com/p/c3\nhttps://instagram.com/p/d4\nhttps://instagram.com/p/e5\nhttps://instagram.com/p/f6" },
    controls: base(TEXT("Handle"), ITEMS("Post URLs", "One post URL per line"), { key: "maxColumns", label: "Max columns", type: "range", min: 2, max: 6, step: 1 }) }),
  live("instagram-carousel", "Instagram carousel post", "social", "A single post, embedded as a rich card.", {
    defaults: { text: "@fern.and.co", items: "https://instagram.com/p/a1" }, controls: base(TEXT("Handle"), ITEMS("Post URLs", "One line: Post URL")) }),
  live("tiktok-feed", "TikTok feed", "social", "Vertical video cards that open on TikTok.", {
    defaults: { text: "@workshop", items: "https://tiktok.com/@user/video/1\nhttps://tiktok.com/@user/video/2\nhttps://tiktok.com/@user/video/3" },
    controls: base(TEXT("Handle"), ITEMS("Video URLs", "One video URL per line")) }),
  live("youtube-grid", "YouTube video grid", "social", "Real YouTube embeds in a responsive grid.", {
    defaults: { maxColumns: 3, items: "dQw4w9WgXcQ | Never gonna give you up\n9bZkp7q19f0 | Gangnam Style\nkJQP7kiw5Fk | Despacito" },
    controls: base(ITEMS("Videos", "One per line: Video ID or URL | Title"), { key: "maxColumns", label: "Max columns", type: "range", min: 1, max: 4, step: 1 }) }),
  live("youtube-shorts-row", "YouTube Shorts row", "social", "A horizontal shelf of Shorts, playable inline.", {
    defaults: { items: "dQw4w9WgXcQ\n9bZkp7q19f0\nkJQP7kiw5Fk" }, controls: base(ITEMS("Shorts", "One Video ID or URL per line")) }),
  live("x-profile-feed", "X profile feed", "social", "A profile card that opens your timeline on X.", {
    defaults: { text: "planckui", link: "https://x.com/planckui" }, controls: base(TEXT("Handle (no @)"), LINK("Profile URL")) }),
  live("linkedin-wall", "LinkedIn posts wall", "social", "Professional posts as cards that open on LinkedIn.", {
    defaults: { items: "https://linkedin.com/posts/a | We are hiring two engineers.\nhttps://linkedin.com/posts/b | Shipping changelog widget today." },
    controls: base(ITEMS("Posts", "One per line: Post URL | Teaser text")) }),
  live("facebook-page-feed", "Facebook page feed", "social", "Page updates as cards that open on Facebook.", {
    defaults: { items: "https://facebook.com/fernandco | Saturday market setup, 7am sharp." },
    controls: base(ITEMS("Posts", "One per line: Post URL | Teaser text")) }),
  live("pinterest-board", "Pinterest board", "social", "Pins as a masonry card grid.", {
    defaults: { items: "https://pinterest.com/pin/1 | Workshop shelf ideas\nhttps://pinterest.com/pin/2 | Small space storage" },
    controls: base(ITEMS("Pins", "One per line: Pin URL | Title")) }),
  live("threads-feed", "Threads feed", "social", "Threads posts as a quiet card list.", {
    defaults: { items: "https://threads.net/@user/post/1 | Ships tomorrow.\nhttps://threads.net/@user/post/2 | The badge is the business model." },
    controls: base(ITEMS("Posts", "One per line: Post URL | Teaser text")) }),
  live("reddit-posts", "Reddit posts", "social", "Posts from any subreddit, embedded as cards.", {
    defaults: { items: "https://reddit.com/r/woodworking/comments/a | Finished the bench, finally\nhttps://reddit.com/r/woodworking/comments/b | First dovetails ever" },
    controls: base(ITEMS("Posts", "One per line: Post URL | Title")) }),
  live("bluesky-feed", "Bluesky feed", "social", "A Bluesky timeline as clean cards.", {
    defaults: { items: "https://bsky.app/profile/user/post/1 | New widget day.\nhttps://bsky.app/profile/user/post/2 | Free means free." },
    controls: base(ITEMS("Posts", "One per line: Post URL | Text")) }),
  live("discord-server-card", "Discord server card", "social", "Member count and invite in one card.", {
    defaults: { text: "The Workshop · 1,200 members", link: "https://discord.gg/example" }, controls: base(TEXT("Server label"), LINK("Invite URL")) }),
  live("twitch-status", "Twitch status card", "social", "A live Twitch player embedded right on your page.", {
    defaults: { text: "weekend builds", link: "workshoplive" }, controls: base(TEXT("Stream label"), LINK("Channel name")) }),
  live("spotify-playlist", "Spotify playlist card", "social", "A real Spotify player for any playlist, album or track.", {
    defaults: { link: "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M" }, controls: base(LINK("Spotify URL")) }),

  /* ---- D. Promotion & conversion ---- */
  live("countdown-timer", "Countdown timer", "promo", "A ticking countdown to a launch, sale or event.", {
    defaults: { target: "", text: "Doors close in" },
    controls: base(TEXT("Label"), { key: "target", label: "Target date and time", type: "date" },
      { key: "variant", label: "Style", type: "select", options: [{ value: "boxes", label: "Boxes" }, { value: "inline", label: "Inline text" }] }) }),
  live("evergreen-countdown", "Evergreen countdown", "promo", "Per-visitor urgency: each visitor gets their own window, remembered.", {
    defaults: { text: "Your launch offer expires in", speed: 48 },
    controls: base(TEXT("Label"), { key: "speed", label: "Window (hours)", type: "range", min: 1, max: 96, step: 1 },
      { key: "variant", label: "Style", type: "select", options: [{ value: "boxes", label: "Boxes" }, { value: "inline", label: "Inline text" }] }) }),
  live("announcement-bar", "Announcement bar", "promo", "A slim top-of-page bar with a dismiss button.", {
    defaults: { text: "We just launched something — come see." },
    controls: base(TEXT("Message"), { key: "dismiss", label: "Allow dismiss", type: "toggle" }) }),
  live("email-capture-popup", "Email capture popup", "promo", "A polite, timed email ask — signups land in your inbox.", {
    needsCollection: true, defaults: { text: "Get the good stuff first", speed: 5 },
    controls: base(TEXT("Heading"), SPEED) }),
  live("exit-intent-popup", "Exit-intent popup", "promo", "One last ask before they leave.", {
    needsCollection: true, defaults: { text: "Before you go — one email, once a month." }, controls: base(TEXT("Heading")) }),
  live("sticky-cta", "Sticky CTA button", "promo", "A floating call-to-action that follows the reader.", {
    defaults: { text: "Get started", variant: "bottom-right", link: "https://example.com" },
    controls: base(TEXT("Button label"), LINK("Button URL"),
      { key: "variant", label: "Position", type: "select", options: [{ value: "bottom-right", label: "Bottom right" }, { value: "bottom-left", label: "Bottom left" }] }) }),
  live("floating-whatsapp-button", "Floating WhatsApp button", "promo", "Chat with us, floating and friendly.", {
    defaults: { text: "Chat with us", link: "https://wa.me/15551234567" }, controls: base(TEXT("Label"), LINK("wa.me link")) }),
  live("live-visitor-counter", "Live visitor counter", "promo", "A quiet right-now counter with a configured baseline.", {
    defaults: { text: "reading right now", items: "37" }, controls: base(TEXT("Label"), ITEMS("Baseline", "One line: your current typical number")) }),
  live("recent-sales-toasts", "Recent sales toasts", "promo", "Someone in Berlin just bought…", {
    defaults: { speed: 8, items: "Maya | Berlin | the starter kit\nOtto | Vienna | gift card\nHana | Zurich | annual plan" },
    controls: base(SPEED, ITEMS("Sales", "One per line: Name | City | What")) }),
  live("goal-progress-bar", "Goal progress bar", "promo", "Funding or signup goals, visually.", {
    defaults: { text: "Of 500 preorders", items: "342 | 500" }, controls: base(TEXT("Label"), ITEMS("Progress", "One line: Current | Goal")) }),
  live("coupon-reveal", "Coupon reveal widget", "promo", "Click-to-reveal discount codes.", {
    defaults: { text: "WELCOME10" }, controls: base(TEXT("Coupon code"), TEXT("Note")) }),
  live("spin-to-win", "Spin-to-win wheel", "promo", "A fair-feeling prize wheel.", {
    defaults: { items: "5% off\nFree shipping\n10% off\nTry again\n15% off\nTry again" }, controls: base(ITEMS("Segments", "One prize per line")) }),
  live("banner-rotator", "Banner rotator", "promo", "Rotate messages on a timer.", {
    defaults: { speed: 6, items: "Free shipping over €50\nNew: gift cards\n30-day returns, no questions" },
    controls: base(SPEED, ITEMS("Messages", "One per line")) }),
  live("waitlist-counter", "Waitlist counter", "promo", "People waiting, counted with a quiet count-up.", {
    defaults: { text: "people already in line", items: "1284" }, controls: base(TEXT("Label"), ITEMS("Count", "One line: current count")) }),

  /* ---- E. Media & content ---- */
  live("faq-accordion", "FAQ accordion", "media", "Questions and answers in accessible details/summary elements.", {
    defaults: { items: "Is it really free? | Yes. Every widget is free, forever. Pro only removes the badge.\nDo I need an account? | For most widgets, no. Accounts are for saving your data.\nWill it slow my site down? | No. The embed script is under 15 KB and renders lazily." },
    controls: base(ITEMS("Questions", "One per line: Question | Answer"),
      { key: "variant", label: "Style", type: "select", options: [{ value: "bordered", label: "Bordered" }, { value: "minimal", label: "Minimal" }] }) }),
  live("logo-carousel", "Logo carousel", "media", "Customer logos drifting slowly in a row.", {
    defaults: { speed: 40, labels: true, items: "https://placehold.co/140x40?text=Acme\nhttps://placehold.co/140x40?text=Fern+%26+Co\nhttps://placehold.co/140x40?text=Lattice\nhttps://placehold.co/140x40?text=Hallow\nhttps://placehold.co/140x40?text=Otto" },
    controls: base(SPEED, ITEMS("Logo URLs", "One image URL per line"), { key: "labels", label: "Grayscale until hover", type: "toggle" }) }),
  live("image-gallery", "Image gallery", "media", "A responsive grid with captions and a lightbox.", {
    defaults: { maxColumns: 3, items: "https://picsum.photos/seed/plk-a/800/600 | Morning light\nhttps://picsum.photos/seed/plk-b/800/600 | The workshop\nhttps://picsum.photos/seed/plk-c/800/600 | On the bench\nhttps://picsum.photos/seed/plk-d/800/600 | Tools of the trade\nhttps://picsum.photos/seed/plk-e/800/600 | Finishing touches\nhttps://picsum.photos/seed/plk-f/800/600 | Ready to ship" },
    controls: base(ITEMS("Images", "One per line: Image URL | Caption"), { key: "maxColumns", label: "Max columns", type: "range", min: 1, max: 5, step: 1 }) }),
  live("lightbox-gallery", "Lightbox gallery", "media", "Full-screen image viewing with captions and counter.", {
    defaults: { maxColumns: 3, items: "https://picsum.photos/seed/plk-l1/900/700 | First light\nhttps://picsum.photos/seed/plk-l2/900/700 | Grain and gloss\nhttps://picsum.photos/seed/plk-l3/900/700 | The long table" },
    controls: base(ITEMS("Images", "One per line: Image URL | Caption"), { key: "maxColumns", label: "Max columns", type: "range", min: 1, max: 5, step: 1 }) }),
  live("before-after-slider", "Before / after slider", "media", "Drag to compare two images, side by side in one frame.", {
    defaults: { items: "https://picsum.photos/seed/plk-before/900/600 | https://picsum.photos/seed/plk-after/900/600", text: "Before | After" },
    controls: base(ITEMS("Images", "One line: Before image URL | After image URL"), TEXT("Labels")) }),
  live("video-player-card", "Video player card", "media", "A framed video with a caption.", {
    defaults: { text: "Ninety seconds on why we exist", link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    controls: base(TEXT("Caption"), LINK("Video URL (YouTube or direct)")) }),
  live("podcast-player", "Podcast player", "media", "Episode list with inline playback.", {
    defaults: { text: "The Workshop Sessions", items: "https://www2.cs.uic.edu/~i101/SoundFiles/GoodMorning1.wav | Ep. 12 — Why free wins | 14 min\nhttps://www2.cs.uic.edu/~i101/SoundFiles/GettingBetter.wav | Ep. 11 — Pricing is a story | 22 min" },
    controls: base(TEXT("Show name"), ITEMS("Episodes", "One per line: Audio URL | Title | Duration")) }),
  live("audio-player", "Audio player", "media", "A quiet single-track player.", {
    defaults: { text: "Our jingle, finally released", link: "https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav" },
    controls: base(TEXT("Track title"), LINK("Audio URL")) }),
  live("pdf-viewer", "PDF viewer", "media", "Documents without leaving the page.", {
    defaults: { text: "Product one-pager", link: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
    controls: base(TEXT("Document title"), LINK("PDF URL")) }),
  live("timeline", "Timeline", "media", "Company history or roadmap as a line.", {
    defaults: { items: "2024 | The idea | Two people, one spreadsheet too many.\n2025 | First customers | The bakery on the corner still uses it daily.\n2026 | The catalog | One hundred and fifty widgets, all free." },
    controls: base(ITEMS("Moments", "One per line: Year | Title | Text")) }),
  live("changelog-feed", "Changelog feed", "media", "Ship notes, embedded.", {
    defaults: { items: "v1.4 | Today | Evergreen countdown and poll widgets ship.\nv1.3 | Last week | Shadow DOM embeds got 40% smaller.\nv1.2 | August | CSV import for past praise." },
    controls: base(ITEMS("Entries", "One per line: Version | Date | What changed")) }),
  live("blog-posts-embed", "Blog posts embed", "media", "Latest posts from any RSS feed.", {
    defaults: { link: "https://hnrss.org/frontpage", items: "5" },
    controls: base(LINK("RSS feed URL"), ITEMS("Count", "One line: how many posts")) }),

  /* ---- F. Commerce ---- */
  live("pricing-table", "Pricing table", "commerce", "Up to three plans from plain-text lines. No builder needed.", {
    defaults: { items: "Starter | $0 | 1 site;All widgets;Community support\nPro | $9 | Badge removal;Custom domain;Priority help\nStudio | $29 | 5 client seats;White-label;SSO" },
    controls: base(ITEMS("Plans", "One per line: Plan | Price | feature;feature;feature")) }),
  live("product-showcase-card", "Product showcase card", "commerce", "One product, framed nicely.", {
    defaults: { items: "The Starter Kit | €49 | https://picsum.photos/seed/plk-shop/800/600 | https://example.com/buy" },
    controls: base(ITEMS("Product", "One line: Name | Price | Image URL | Buy URL")) }),
  live("payment-link-button", "Payment link button", "commerce", "A button that opens any checkout link.", {
    defaults: { text: "Buy now — €49", link: "https://buy.stripe.com/example" }, controls: base(TEXT("Button label"), LINK("Checkout URL")) }),
  live("digital-product-card", "Digital product card", "commerce", "Files, license, download — one card.", {
    defaults: { items: "The Widget Handbook | €12 | PDF + EPUB, lifetime updates | https://example.com/download" },
    controls: base(ITEMS("Product", "One line: Name | Price | What's included | Link")) }),
  live("shopify-product-carousel", "Product carousel", "commerce", "Products from any store in a snap row — paste them here, API sync later.", {
    defaults: { items: "Enamel mug | €18 | https://picsum.photos/seed/plk-c1/500/500\nField journal | €24 | https://picsum.photos/seed/plk-c2/500/500\nCanvas apron | €39 | https://picsum.photos/seed/plk-c3/500/500" },
    controls: base(ITEMS("Products", "One per line: Name | Price | Image URL | Link (optional)")) }),
  live("etsy-feed", "Etsy feed", "commerce", "Listings from your Etsy shop as cards.", {
    defaults: { items: "Hand-thrown mug | €22 | https://picsum.photos/seed/plk-e1/500/500\nLinen apron | €45 | https://picsum.photos/seed/plk-e2/500/500" },
    controls: base(ITEMS("Listings", "One per line: Name | Price | Image URL | Link (optional)")) }),
  live("gumroad-embed", "Gumroad card", "commerce", "Sell directly with a card that opens your Gumroad checkout.", {
    defaults: { items: "The Free Widgets Report | $0+ | https://gumroad.com/l/example" },
    controls: base(ITEMS("Products", "One per line: Name | Price | Gumroad URL")) }),
  live("donation-button", "Donation button", "commerce", "Support-us, without the circus.", {
    defaults: { text: "Support this project", link: "https://example.com/donate" }, controls: base(TEXT("Button label"), LINK("Donation URL")) }),
  live("gift-card-widget", "Gift card widget", "commerce", "Sell gift cards inline.", {
    defaults: { text: "Give the workshop", items: "€25\n€50\n€100" }, controls: base(TEXT("Title"), ITEMS("Amounts", "One per line"), LINK("Checkout URL")) }),
  live("stock-badge", "Stock availability badge", "commerce", "Honest scarcity, shown quietly.", {
    defaults: { text: "In stock — 7 left of this batch" }, controls: base(TEXT("Badge text")) }),
  live("course-card", "Course card", "commerce", "Curriculum, price, enroll.", {
    defaults: { items: "Embeds for Non-Developers | 12 lessons · 3 hours | €79 | https://example.com/enroll" },
    controls: base(ITEMS("Course", "One line: Title | Meta | Price | Enroll URL")) }),

  /* ---- G. Info & local business ---- */
  live("link-in-bio", "Link in bio page", "info", "A whole landing page of links from a few text lines.", {
    defaults: { text: "Fern & Co. — plants and pots", items: "Shop the collection | https://example.com/shop\nCare guides | https://example.com/care\nInstagram | https://instagram.com/example\nWrite to us | mailto:hi@example.com" },
    controls: base(TEXT("Name or headline"), ITEMS("Links", "One per line: Title | URL")) }),
  live("google-maps-card", "Google Maps card", "info", "A map, framed and fast — keyless.", {
    defaults: { text: "Fern & Co., Hauptplatz 8, Graz" }, controls: base(TEXT("Address or place")) }),
  live("opening-hours", "Opening hours", "info", "Today's hours, highlighted automatically.", {
    defaults: { items: "Mon | 9:00 – 18:00\nTue | 9:00 – 18:00\nWed | Closed\nThu | 9:00 – 20:00\nFri | 9:00 – 18:00\nSat | 10:00 – 16:00\nSun | Closed" },
    controls: base(ITEMS("Hours", "One per line: Day | Hours")) }),
  live("location-directions", "Location + directions", "info", "Address with a one-tap route.", {
    defaults: { text: "Hauptplatz 8, 8010 Graz", link: "https://maps.google.com/?q=Hauptplatz+8+Graz" },
    controls: base(TEXT("Address"), LINK("Directions URL")) }),
  live("event-countdown", "Event countdown card", "info", "Date, venue, ticking clock.", {
    defaults: { text: "Open Workshop Night | Sa, Oct 3 · 19:00 · Hauptplatz 8", target: "", speed: 3 },
    controls: base(TEXT("Event line"), { key: "target", label: "Starts", type: "date" }) }),
  live("event-agenda", "Event agenda list", "info", "Sessions and speakers, in order.", {
    defaults: { items: "19:00 | Doors and coffee | —\n19:30 | Why embeds matter | M. Okafor\n20:15 | Live build: a widget in 10 minutes | Everyone" },
    controls: base(ITEMS("Agenda", "One per line: Time | Session | Speaker")) }),
  live("team-grid", "Team grid", "info", "Faces, names, roles.", {
    defaults: { maxColumns: 3, items: "Maya Okafor | Founder | https://i.pravatar.cc/240?img=5\nTomás Rivera | Workshop lead | https://i.pravatar.cc/240?img=12\nJune Park | Design | https://i.pravatar.cc/240?img=32" },
    controls: base(ITEMS("People", "One per line: Name | Role | Photo URL"), { key: "maxColumns", label: "Max columns", type: "range", min: 1, max: 5, step: 1 }) }),
  live("vcard-business-card", "vCard business card", "info", "A contact card that saves to phones.", {
    defaults: { items: "Maya Okafor | Founder, Fern & Co. | +43 316 000 000 | maya@fernand.co | Fern & Co." },
    controls: base(ITEMS("Details", "One line: Name | Role | Phone | Email | Organization")) }),
  live("qr-code-card", "QR code card", "info", "Any link as a scannable card.", {
    defaults: { text: "See the full catalog", link: "https://planckui.dev" }, controls: base(TEXT("Caption"), LINK("Link to encode")) }),
  live("wifi-share-card", "Wi-Fi share card", "info", "Guests scan to join your network.", {
    defaults: { text: "Guest Wi-Fi", items: "FernGuest | coffeefirst | WPA" },
    controls: base(TEXT("Label"), ITEMS("Network", "One line: SSID | Password | WPA or open")) }),
  live("weather-card", "Weather card", "info", "Today's weather, quietly — live data, no API key.", {
    defaults: { text: "Graz", link: "47.07,15.44" }, controls: base(TEXT("Place label"), LINK("Coordinates (lat,lon)")) }),
  live("world-clock", "World clock", "info", "Your team's cities at a glance.", {
    defaults: { items: "Graz | Europe/Vienna\nNew York | America/New_York\nTokyo | Asia/Tokyo" }, controls: base(ITEMS("Cities", "One per line: City | IANA timezone")) }),

  /* ---- H. Profiles & stats ---- */
  live("github-repo-card", "GitHub repo card", "profiles", "Stars, forks, language — live from the GitHub API.", {
    defaults: { link: "vercel/next.js" }, controls: base(LINK("Repository (user/repo)")) }),
  live("github-contributions-graph", "GitHub contributions graph", "profiles", "Your year of shipping, as an image.", {
    defaults: { link: "torvalds" }, controls: base(LINK("GitHub username")) }),
  live("product-hunt-card", "Product Hunt card", "profiles", "Rank, upvotes, badge — linked.", {
    defaults: { text: "PlanckUi — 160+ free widgets", link: "https://www.producthunt.com" },
    controls: base(TEXT("Product name"), LINK("Product Hunt URL")) }),
  live("app-store-rating-card", "App Store rating card", "profiles", "Rating and reviews, live from the iTunes API.", {
    defaults: { link: "https://apps.apple.com/app/id333903271" }, controls: base(LINK("App Store URL")) }),
  live("chrome-extension-reviews-card", "Chrome extension reviews card", "profiles", "Store rating for your extension.", {
    defaults: { text: "PlanckUi for Chrome · 4.9", link: "https://chromewebstore.google.com" },
    controls: base(TEXT("Extension label"), LINK("Store URL")) }),
  live("steam-profile", "Steam profile card", "profiles", "Games, hours, status — linked.", {
    defaults: { text: "weekendbuilder · 1,204 hrs", link: "https://steamcommunity.com/id/gabe" },
    controls: base(TEXT("Profile label"), LINK("Steam profile URL")) }),
  live("strava-activity", "Strava activity card", "profiles", "Last run or ride, linked.", {
    defaults: { text: "Morning 10k · 48:12", link: "https://strava.com" }, controls: base(TEXT("Activity label"), LINK("Activity URL")) }),
  live("goodreads-shelf", "Goodreads shelf", "profiles", "Currently reading, as a shelf.", {
    defaults: { items: "The Design of Everyday Things | Don Norman | ★★★★★\nShape Up | Ryan Singer | ★★★★" },
    controls: base(ITEMS("Books", "One per line: Title | Author | Stars")) }),
  live("letterboxd-films", "Letterboxd recent films", "profiles", "What you watched lately.", {
    defaults: { items: "Perfect Days | 2023 | ★★★★★\nPastoral: To Die in the Country | 1974 | ★★★★" },
    controls: base(ITEMS("Films", "One per line: Title | Year | Stars")) }),
  live("chess-stats", "Chess.com stats", "profiles", "Rating and record, live from the Chess.com public API.", {
    defaults: { link: "hikaru" }, controls: base(LINK("Chess.com username")) }),
  live("duolingo-streak", "Duolingo streak", "profiles", "Days practiced, counted on a dot grid.", {
    defaults: { text: "47-day streak · Spanish", items: "47" }, controls: base(TEXT("Label"), ITEMS("Streak", "One line: day count")) }),
  live("now-playing", "Now Playing", "profiles", "The track currently on repeat — a real Spotify embed.", {
    defaults: { link: "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT" }, controls: base(LINK("Spotify track URL")) }),

  /* ---- I. Micro-tools ---- */
  live("age-calculator", "Age calculator", "tools", "Exact age in years, months and days from a birth date.", {
    defaults: { text: "Your age" }, controls: base(TEXT("Label")) }),
  live("tip-calculator", "Tip calculator", "tools", "Bill, tip percent, split between friends. One card.", { defaults: {}, controls: base() }),
  live("split-bill-calculator", "Split bill calculator", "tools", "Who owes what, including tip, in two inputs.", { defaults: {}, controls: base() }),
  live("sale-price-calculator", "Sale price calculator", "tools", "Percent off, done instantly. For shop owners and shoppers.", { defaults: {}, controls: base() }),
  live("percentage-calculator", "Percentage calculator", "tools", "Of what, is what. Both directions.", { defaults: {}, controls: base() }),
  live("date-difference", "Date difference calculator", "tools", "Days between two dates, in every unit.", { defaults: {}, controls: base() }),
  live("loan-calculator", "Loan / mortgage calculator", "tools", "Monthly payments, total interest.", { defaults: {}, controls: base() }),
  live("bmi-calculator", "BMI calculator", "tools", "Body mass index, explained.", { defaults: {}, controls: base() }),
  live("unit-converter", "Unit converter", "tools", "Length, weight and temperature conversions.", { defaults: {}, controls: base() }),
  live("currency-converter", "Currency converter", "tools", "Live rates from the ECB via Frankfurter — no key, no cost.", {
    defaults: { text: "USD" }, controls: base(TEXT("From currency (code)")) }),
  live("password-generator", "Password generator", "tools", "Strong passwords, generated locally.", { defaults: {}, controls: base() }),
  live("qr-generator", "QR code generator", "tools", "Any link as a downloadable QR.", { defaults: {}, controls: base() }),
  live("color-palette-generator", "Color palette generator", "tools", "Accessible palettes from one color.", { defaults: {}, controls: base() }),
  live("json-formatter", "JSON formatter", "tools", "Paste, format, copy.", { defaults: {}, controls: base() }),
  live("markdown-preview", "Markdown preview", "tools", "Write markdown, see it rendered.", { defaults: {}, controls: base() }),
  live("invoice-generator", "Invoice generator", "tools", "A clean invoice from simple lines.", {
    defaults: { text: "Fern & Co. · INV-0042", items: "Widget setup | 1 | 120\nOnboarding call | 2 | 60" },
    controls: base(TEXT("Business · Invoice no."), ITEMS("Line items", "One per line: Description | Qty | Unit price")) }),

  /* ---- J. Layout & misc ---- */
  live("accordion", "Accordion", "layout", "Collapsible sections, accessible.", {
    defaults: { items: "What ships today? | Twenty-two widget types, all live.\nWhat is next? | More widgets, same price: zero." },
    controls: base(ITEMS("Sections", "One per line: Title | Content")) }),
  live("tabs", "Tabs", "layout", "Switch content without leaving the page.", {
    defaults: { items: "Overview | The fast path from data to embed.\nDetails | Shadow DOM, lazy loading, zero layout shift.\nSupport | A human answers, usually same day." },
    controls: base(ITEMS("Tabs", "One per line: Label | Content")) }),
  live("card-carousel", "Card carousel", "layout", "Snap-scrolling cards for anything.", {
    defaults: { items: "Fast | Under 15 KB, always.\nHonest | If it says live, it lives.\nFree | The plan is the product." },
    controls: base(ITEMS("Cards", "One per line: Title | Text")) }),
  live("text-marquee", "Text marquee", "layout", "A slow ribbon of words.", {
    defaults: { speed: 30, text: "collect · approve · embed · repeat ·" },
    controls: base(SPEED, TEXT("Text")) }),
  live("sticky-footer-bar", "Sticky footer bar", "layout", "A persistent bottom strip.", {
    defaults: { text: "Free plan — no card, ever.", link: "https://planckui.dev" },
    controls: base(TEXT("Message"), LINK("Link")) }),
  live("floating-action-menu", "Floating action menu", "layout", "Expanding buttons in a corner.", {
    defaults: { items: "Write to us | mailto:hi@example.com\nCall | tel:+43316000000\nDirections | https://maps.google.com" },
    controls: base(ITEMS("Actions", "One per line: Label | URL")) }),
  live("multi-step-wizard-form", "Multi-step wizard form", "layout", "Long forms, one step at a time — answers land in your inbox.", {
    needsCollection: true, defaults: { text: "Tell us about your project", items: "What are you building?\nWhat is your timeline?\nAnything else we should know?" },
    controls: form("Heading").concat([ITEMS("Steps", "One prompt per line")]) }),
  live("email-signature-card", "Email signature card", "layout", "A signature block you can copy.", {
    defaults: { items: "Maya Okafor | Founder, Fern & Co. | fernand.co | +43 316 000 000" },
    controls: base(ITEMS("Details", "One line: Name | Role | Site | Phone")) }),
  live("newsletter-archive-embed", "Newsletter archive embed", "layout", "Past issues, listed.", {
    defaults: { text: "From the archive", items: "Issue 12 — Why the badge stays | https://example.com/12 | Sep 2026\nIssue 11 — Pricing is a story | https://example.com/11 | Aug 2026" },
    controls: base(TEXT("Heading"), ITEMS("Issues", "One per line: Title | URL | Date")) }),
  live("awards-badges-row", "Awards & badges row", "layout", "Recognitions, displayed quietly.", {
    defaults: { items: "https://placehold.co/120x40?text=Best+of+2026\nhttps://placehold.co/120x40?text=Editor's+Choice" },
    controls: base(ITEMS("Badge URLs", "One image URL per line")) }),
  live("trust-badges", "Trust badges", "layout", "Secure, GDPR, money-back — a calm row.", {
    defaults: { items: "SSL secured\nGDPR ready\n30-day returns" }, controls: base(ITEMS("Badges", "One per line")) }),

  /* ---- K. Community & UGC ---- */
  live("instagram-story-reel", "Instagram story highlight reel", "community", "Story highlights as a row of circles.", {
    defaults: { text: "Highlights", items: "https://i.pravatar.cc/120?img=11 | Shop\nhttps://i.pravatar.cc/120?img=12 | Care\nhttps://i.pravatar.cc/120?img=13 | Workshop" },
    controls: base(TEXT("Row label"), ITEMS("Stories", "One per line: Image URL | Label")) }),
  live("user-video-reel-row", "User video reel row", "community", "Customer videos, scrollable.", {
    defaults: { items: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4 | Hana unboxes\nhttps://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4 | Otto builds" },
    controls: base(ITEMS("Videos", "One per line: Video URL | Caption")) }),
  live("review-request-link-card", "Review request link card", "community", "One link that gathers reviews — with its own QR.", {
    defaults: { text: "Leave a review — it takes 30 seconds", link: "https://planckui.dev" },
    controls: base(TEXT("Message"), LINK("Collection or review URL")) }),
  live("top-reviewers-leaderboard", "Top reviewers leaderboard", "community", "Your loudest fans, ranked.", {
    defaults: { items: "Maya O. | 14\nTomás R. | 9\nJune P. | 7" }, controls: base(ITEMS("Reviewers", "One per line: Name | Review count")) }),
  live("community-avatar-stack", "Community avatar stack", "community", "Faces of your community, stacked.", {
    defaults: { text: "1,200 builders already in", items: "https://i.pravatar.cc/80?img=1\nhttps://i.pravatar.cc/80?img=2\nhttps://i.pravatar.cc/80?img=3\nhttps://i.pravatar.cc/80?img=4\nhttps://i.pravatar.cc/80?img=5" },
    controls: base(TEXT("Caption"), ITEMS("Avatar URLs", "One image URL per line")) }),
  live("testimonial-qr-poster", "Testimonial QR poster", "community", "A printable poster that collects praise.", {
    defaults: { text: "Say something nice", link: "https://planckui.dev" }, controls: base(TEXT("Headline"), LINK("Collection URL")) }),
  live("celebration-kudoboard", "Celebration kudoboard", "community", "Notes for a person or a milestone.", {
    defaults: { text: "Notes for Otto's 10 years", items: "Maya | You built the first shelf with us. Legend.\nJune | The workshop smells better already." },
    controls: base(TEXT("Board title"), ITEMS("Notes", "One per line: Name | Note")) }),
  live("guestbook-wall", "Guestbook wall", "community", "Visitors leave a note. Moderated by you.", {
    needsCollection: true, defaults: { text: "Sign the guestbook" }, controls: base(TEXT("Heading")) }),

  /* ---- L. Utility & badges ---- */
  live("calorie-bmr-calculator", "Calorie / BMR calculator", "utility", "Daily energy needs, estimated.", { defaults: {}, controls: base() }),
  live("hours-worked-calculator", "Hours worked calculator", "utility", "Shift times to payable hours.", { defaults: {}, controls: base() }),
  live("timezone-meeting-planner", "Timezone meeting planner", "utility", "Overlap across cities.", {
    defaults: { items: "Graz | Europe/Vienna\nAustin | America/Chicago\nOsaka | Asia/Tokyo" },
    controls: base(ITEMS("Cities", "One per line: City | IANA timezone")) }),
  live("random-picker-wheel", "Random picker wheel", "utility", "Spin to choose a name.", {
    defaults: { items: "Maya\nOtto\nHana\nLena\nRob" }, controls: base(ITEMS("Names", "One per line")) }),
  live("reading-time-badge", "Reading time badge", "utility", "Minutes to read, computed.", {
    defaults: { text: "Paste your draft word count:", items: "1800" }, controls: base(TEXT("Label"), ITEMS("Words", "One line: word count")) }),
  live("link-preview-card", "Link preview card", "utility", "A rich card for any URL.", {
    defaults: { link: "https://planckui.dev" }, controls: base(LINK("URL")) }),
  live("screenshot-placeholder-generator", "Screenshot placeholder generator", "utility", "Placeholder images, sized.", { defaults: {}, controls: base() }),
  live("favicon-preview-card", "Favicon preview card", "utility", "See your favicon in context.", {
    defaults: { link: "https://planckui.dev" }, controls: base(LINK("Site URL")) }),
  live("uptime-badge", "Uptime badge", "utility", "A small badge that says we're up.", {
    defaults: { text: "All systems operational", variant: "operational" },
    controls: base(TEXT("Label"), { key: "variant", label: "Status", type: "select", options: [{ value: "operational", label: "Operational" }, { value: "degraded", label: "Degraded" }, { value: "down", label: "Down" }] }) }),
  live("status-page-embed", "Status page embed", "utility", "System status without the $99/mo.", {
    defaults: { text: "planckui.dev status", items: "API | operational\nEmbeds | operational\nDashboard | degraded" },
    controls: base(TEXT("Page label"), ITEMS("Services", "One per line: Service | operational, degraded or down")) }),

  /* ---- M. Pretty Progress — the premium dark collection (all free) ---- */
  live("pretty-event", "Pretty · Event countdown", "pretty", "A dark, calm countdown card with a mint progress ring.", {
    defaults: { text: "Launch day", note: "Pretty Progress" },
    controls: pform(TEXT("Event name"), { key: "target", label: "Target date and time", type: "date" }) }),
  live("pretty-birthday", "Pretty · Birthday countdown", "pretty", "The reference card: name, days and hours, mint ring.", {
    defaults: { text: "Sam's birthday 🎉", note: "Pretty Progress" },
    controls: pform(TEXT("Name"), { key: "target", label: "Target date and time", type: "date" }) }),
  live("pretty-launch", "Pretty · Launch dots", "pretty", "Countdown as a dot grid filling toward launch day.", {
    defaults: { text: "Project X", items: "40 | 10" },
    controls: pform(TEXT("Project name"), ITEMS("Dots", "One line: total dots | columns")) }),
  live("pretty-deadline", "Pretty · Deadline fill", "pretty", "Rising fill shows how much of the deadline is gone.", {
    defaults: { text: "Client deadline" }, controls: pform(TEXT("Deadline name"), { key: "target", label: "Target date and time", type: "date" }) }),
  live("pretty-exam", "Pretty · Exam countdown", "pretty", "Study time left, on a quiet dark ring.", {
    defaults: { text: "Exam day" }, controls: pform(TEXT("Exam name"), { key: "target", label: "Exam date", type: "date" }) }),
  live("pretty-wedding", "Pretty · Wedding dots", "pretty", "Every dot a day, filling toward the day itself.", {
    defaults: { text: "The big day" }, controls: pform(TEXT("Names"), { key: "target", label: "Wedding date", type: "date" }) }),
  live("pretty-vacation", "Pretty · Vacation countdown", "pretty", "Departure day, tracked on a mint ring.", {
    defaults: { text: "Wheels up" }, controls: pform(TEXT("Trip name"), { key: "target", label: "Departure", type: "date" }) }),
  live("pretty-newyear", "Pretty · New Year countdown", "pretty", "Counts to midnight, January 1st. Sets itself.", {
    defaults: { text: "New Year's Eve" }, controls: pform(TEXT("Label")) }),
  live("pretty-payday", "Pretty · Payday fill", "pretty", "A rising fill toward payday — any day you pick.", {
    defaults: { text: "Payday" }, controls: pform(TEXT("Label"), { key: "target", label: "Payday date", type: "date" }) }),
  live("pretty-hours", "Pretty · Hours countdown", "pretty", "Small countdown for the same-day stuff.", {
    defaults: { text: "Doors open" }, controls: pform(TEXT("Label"), { key: "target", label: "Target time", type: "date" }) }),

  live("pretty-ring", "Pretty · Progress ring", "pretty", "One number, one ring, zero clutter.", {
    defaults: { text: "Workout plan", pct: 62 }, controls: pform(TEXT("Title"), { key: "pct", label: "Progress", type: "range", min: 0, max: 100, step: 1 }) }),
  live("pretty-dots", "Pretty · Progress dots", "pretty", "Your percentage as a satisfying dot grid.", {
    defaults: { text: "Course progress", pct: 62 }, controls: pform(TEXT("Title"), { key: "pct", label: "Progress", type: "range", min: 0, max: 100, step: 1 }) }),
  live("pretty-fill", "Pretty · Progress fill", "pretty", "A rising panel with the big percentage.", {
    defaults: { text: "Semester progress", pct: 62 }, controls: pform(TEXT("Title"), { key: "pct", label: "Progress", type: "range", min: 0, max: 100, step: 1 }) }),
  live("pretty-goal-bar", "Pretty · Segment bar", "pretty", "Twenty segments, one honest number.", {
    defaults: { text: "Sprint progress", pct: 65 }, controls: pform(TEXT("Title"), { key: "pct", label: "Progress", type: "range", min: 0, max: 100, step: 1 }) }),
  live("pretty-gauge", "Pretty · Gauge", "pretty", "A half-circle gauge for anything measurable.", {
    defaults: { text: "Capacity", pct: 70 }, controls: pform(TEXT("Title"), { key: "pct", label: "Value", type: "range", min: 0, max: 100, step: 1 }) }),
  live("pretty-year", "Pretty · Year progress", "pretty", "Live: how much of the year is already gone.", {
    defaults: { text: "Time flies" }, controls: pform(TEXT("Title")) }),
  live("pretty-month", "Pretty · Month progress", "pretty", "The month burning down, live.", {
    defaults: { text: "This month" }, controls: pform(TEXT("Title")) }),
  live("pretty-week", "Pretty · Week progress", "pretty", "Monday to Sunday, as a percentage.", {
    defaults: { text: "This week" }, controls: pform(TEXT("Title")) }),
  live("pretty-day", "Pretty · Day progress", "pretty", "How much of today is left, live.", {
    defaults: { text: "Today" }, controls: pform(TEXT("Title")) }),
  live("pretty-steps", "Pretty · Step counter", "pretty", "Steps toward a daily goal — tap to add, saved locally.", {
    defaults: { text: "Today's steps", items: "7000 | 10000" },
    controls: pform(TEXT("Title"), ITEMS("Start | Goal", "One line: current steps | daily goal")) }),

  live("pretty-habit", "Pretty · Habit tracker", "pretty", "Thirty-five dots. Tap the days you kept the promise.", {
    defaults: { text: "Daily habit" }, controls: pform(TEXT("Habit name")) }),
  live("pretty-water", "Pretty · Water tracker", "pretty", "Eight glasses. Tap as you drink.", {
    defaults: { text: "Water today" }, controls: pform(TEXT("Title")) }),
  live("pretty-todo", "Pretty · Mini checklist", "pretty", "Up to six things. Tap them done.", {
    defaults: { text: "Today", items: "Ship the widget\nReply to Maya\nWalk before lunch\nRead 20 pages" },
    controls: pform(TEXT("List title"), ITEMS("Tasks", "One task per line")) }),
  live("pretty-timer", "Pretty · Focus timer", "pretty", "A start/pause focus ring for deep work.", {
    defaults: { text: "Focus session", speed: 25 },
    controls: pform(TEXT("Session name"), { key: "speed", label: "Minutes", type: "range", min: 5, max: 90, step: 5 }) }),
  live("pretty-stopwatch", "Pretty · Stopwatch", "pretty", "Start, stop, reset. Precise to a tenth.", {
    defaults: { text: "Stopwatch" }, controls: pform(TEXT("Label")) }),
  live("pretty-savings", "Pretty · Savings goal", "pretty", "A ring that fills as the number grows.", {
    defaults: { text: "Savings goal", items: "250 | 1000" },
    controls: pform(TEXT("Goal name"), ITEMS("Current | Goal", "One line: current | goal")) }),
  live("pretty-reading", "Pretty · Reading progress", "pretty", "Pages read, dots filled, +10 pages button.", {
    defaults: { text: "Now reading", items: "128 | 320" },
    controls: pform(TEXT("Book"), ITEMS("Page | Total", "One line: page | total pages")) }),
  live("pretty-workout", "Pretty · Workout tracker", "pretty", "Sessions done this cycle, one tap each.", {
    defaults: { text: "Workout plan" }, controls: pform(TEXT("Plan name")) }),
  live("pretty-streak", "Pretty · Streak", "pretty", "The number that keeps you honest, with a +1.", {
    defaults: { text: "Current streak", items: "12" }, controls: pform(TEXT("Streak name"), ITEMS("Days", "One line: days so far")) }),
  live("pretty-mood", "Pretty · Mood of the day", "pretty", "Pick a mood. It stays on this device.", {
    defaults: { text: "Today's mood" }, controls: pform(TEXT("Title")) }),
  live("pretty-budget", "Pretty · Budget burn", "pretty", "Spent versus budget, with a rising fill.", {
    defaults: { text: "Monthly budget", items: "420 | 600" },
    controls: pform(TEXT("Budget name"), ITEMS("Spent | Cap", "One line: spent | cap")) }),
  live("pretty-weight", "Pretty · Weight goal", "pretty", "From, current, target — nudge it daily.", {
    defaults: { text: "Weight goal", items: "80 | 76 | 70" },
    controls: pform(TEXT("Title"), ITEMS("Start | Current | Target", "One line: start | current | target (kg)")) }),
  live("pretty-fundraiser", "Pretty · Fundraiser", "pretty", "Raised, goal, backers — with a rising fill.", {
    defaults: { text: "Community fundraiser", items: "1240 | 5000 | 38" },
    controls: pform(TEXT("Cause name"), ITEMS("Raised | Goal | Backers", "One line: raised | goal | backers")) }),
  live("pretty-life", "Pretty · Life in weeks", "pretty", "Every dot one week. Persuasive little grid.", {
    defaults: { text: "Your life in weeks", items: "30" }, controls: pform(TEXT("Title"), ITEMS("Years lived", "One line: years lived")) }),
  live("pretty-vote", "Pretty · Two-option vote", "pretty", "Pick a side — animated rings, one vote per visitor.", {
    defaults: { text: "Pick a side", items: "Coffee\nTea" },
    controls: pform(TEXT("Question"), ITEMS("Options", "One option per line (first two count)")) }),

  /* ---- N. Aurora — modern analytics collection (all free) ---- */
  live("aurora-balance", "Aurora · Monthly Balance", "aurora", "The anchor analytics card: lime sparkline, stats, pulsing endpoint.", {
    defaults: { text: "Monthly Balance", accent: "#a3e635" },
    controls: base(TEXT("Title"), ACCENT) }),
  live("aurora-pulse", "Aurora · Revenue Pulse", "aurora", "Drag the slider and watch the revenue sparkline morph. Violet.", {
    defaults: { text: "Revenue pulse", accent: "#c084fc" }, controls: base(TEXT("Title"), ACCENT) }),
  live("aurora-uptime", "Aurora · Uptime Grid", "aurora", "91 days of uptime as a tap-to-explore status wall. Sky.", {
    defaults: { text: "Uptime — last 91 days", accent: "#38bdf8" }, controls: base(TEXT("Title"), ACCENT) }),
  live("aurora-energy", "Aurora · Energy Mix", "aurora", "Animated donut of solar, wind and grid. Switch day, week, month. Amber.", {
    defaults: { text: "Energy mix", accent: "#fbbf24" }, controls: base(TEXT("Title"), ACCENT) }),
  live("aurora-ticker", "Aurora · Ticker", "aurora", "Simulated market chart with timeframes and refresh. Fuchsia.", {
    defaults: { text: "PROOF · proof coin", accent: "#e879f9" }, controls: base(TEXT("Ticker name"), ACCENT) }),
  live("aurora-sleep", "Aurora · Sleep Arc", "aurora", "Your night as a glowing arc under twinkling stars. Indigo.", {
    defaults: { text: "Sleep arc", accent: "#818cf8" }, controls: base(TEXT("Title"), ACCENT) }),

  /* ---- O. Special collection (all free) ---- */
  live("special-hero", "Special · Hero banner", "special", "A tight mini hero: headline, sub, two CTAs.", {
    defaults: { accent: "#7dd3fc", showBadge: true },
    controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("special-features", "Special · Feature grid", "special", "Four reasons, two by two, from plain lines.", {
    defaults: { accent: "#fbbf24", showBadge: true },
    controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("special-integrations", "Special · Integrations", "special", "Connect buttons with real brand marks.", {
    defaults: { accent: "#a3e635", showBadge: true },
    controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("special-stats", "Special · Stat strip", "special", "Three numbers that count up on view.", {
    defaults: { accent: "#e879f9", showBadge: true },
    controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("special-cta", "Special · CTA banner", "special", "One message, one accent, two buttons.", {
    defaults: { accent: "#fda4af", showBadge: true },
    controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("special-testimonial", "Special · Single testimonial", "special", "Stars, quote, face. The classic.", {
    defaults: { accent: "#818cf8", showBadge: true },
    controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("special-newsletter", "Special · Newsletter block", "special", "Email capture with a memory.", {
    defaults: { accent: "#7dd3fc", showBadge: true },
    controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("special-cookie", "Special · Cookie bar", "special", "Accepts, remembers, disappears.", {
    defaults: { accent: "#fbbf24", showBadge: true },
    controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("special-notifications", "Special · Notification stack", "special", "Dismissible cards with slide-out.", {
    defaults: { accent: "#a3e635", showBadge: true },
    controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("special-download", "Special · App download", "special", "QR plus two store buttons.", {
    defaults: { accent: "#e879f9", showBadge: true },
    controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("special-roadmap", "Special · Roadmap", "special", "Now, Next, Later — three cards.", {
    defaults: { accent: "#fda4af", showBadge: true },
    controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("special-kanban", "Special · Mini kanban", "special", "Tap cards to move them across the board.", {
    defaults: { accent: "#818cf8", showBadge: true },
    controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("special-calendar", "Special · Mini calendar", "special", "This month, today ringed, tap to pick.", {
    defaults: { accent: "#7dd3fc", showBadge: true },
    controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("special-table", "Special · Sortable table", "special", "Click a header to sort the rows.", {
    defaults: { accent: "#fbbf24", showBadge: true },
    controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("special-command", "Special · Command search", "special", "Type to filter, live.", {
    defaults: { accent: "#a3e635", showBadge: true },
    controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("special-onboarding", "Special · Onboarding steps", "special", "Step dots with Back and Next.", {
    defaults: { accent: "#e879f9", showBadge: true },
    controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("special-fileupload", "Special · File uploader", "special", "Drop-zone styling, tap to add.", {
    defaults: { accent: "#fda4af", showBadge: true },
    controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("special-pricing", "Special · Pricing card", "special", "Monthly and yearly toggle on one plan.", {
    defaults: { accent: "#818cf8", showBadge: true },
    controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("special-avatars", "Special · Avatar group", "special", "Five faces that lift on hover.", {
    defaults: { accent: "#7dd3fc", showBadge: true },
    controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("special-socials", "Special · Social row", "special", "Brand icon buttons that glow.", {
    defaults: { accent: "#fbbf24", showBadge: true },
    controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("special-countdown-strip", "Special · Countdown strip", "special", "A slim hours-minutes-seconds strip.", {
    defaults: { accent: "#a3e635", showBadge: true },
    controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("special-quote-wall", "Special · Quote wall", "special", "Three short quotes, masonry style.", {
    defaults: { accent: "#e879f9", showBadge: true },
    controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("special-chips", "Special · Filter chips", "special", "Multi-select chips with a live count.", {
    defaults: { accent: "#fda4af", showBadge: true },
    controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("special-progress-feed", "Special · Setup checklist", "special", "Check circles with a progress count.", {
    defaults: { accent: "#818cf8", showBadge: true },
    controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("special-profile", "Special · Profile card", "special", "Avatar, bio, and a follow toggle.", {
    defaults: { accent: "#7dd3fc", showBadge: true },
    controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("special-search", "Special · Live search", "special", "Filters its list as you type.", {
    defaults: { accent: "#fbbf24", showBadge: true },
    controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("special-stepper", "Special · Process stepper", "special", "Tappable process pills.", {
    defaults: { accent: "#a3e635", showBadge: true },
    controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("special-toasts", "Special · Toast styles", "special", "Three buttons, three toasts.", {
    defaults: { accent: "#e879f9", showBadge: true },
    controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("special-badges", "Special · Trust badges", "special", "Six reasons, pill shaped.", {
    defaults: { accent: "#fda4af", showBadge: true },
    controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("special-logos", "Special · Logo marquee", "special", "Names drifting in an endless loop.", {
    defaults: { accent: "#818cf8", showBadge: true },
    controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("special-feature-tour", "Special · Feature tour", "special", "Apple-style hotspot tour: pill features, one expanded, synced visual panel.", {
    needsCollection: false,
    defaults: { text: "Feature tour" },
    controls: base(TEXT("Label"), ITEMS("Features", "One feature name per line")) }),
  live("special-gradient-menu", "Special · Gradient menu", "special", "A nav pill with a gliding gradient indicator.", {
    defaults: { text: "Menu" },
    controls: base(TEXT("Label"), ITEMS("Menu items", "One item per line")) }),
  live("special-signin-card", "Special · Sign-in card", "special", "Email and password with show/hide, social buttons and validation.", {
    defaults: { text: "Welcome back" }, controls: base(TEXT("Title")) }),
  live("special-pricing-section", "Special · Pricing section", "special", "Three tiers with a monthly and yearly toggle and a popular badge.", {
    defaults: { text: "Simple pricing" },
    controls: base(TEXT("Title"), ITEMS("Tiers", "One per line: Name | Price | feature;feature;feature")) }),
  live("pf-google", "Google sign-in", "platforms", "Clean white Google auth with the real G mark.", { defaults: { accent: "#4285f4" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-apple", "Apple sign-in", "platforms", "Dark glass Apple ID card with glowing mark.", { defaults: { accent: "#f5f5f7" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-github", "GitHub sign-in", "platforms", "Octocat dark card for developer sign-in.", { defaults: { accent: "#58a6ff" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-x", "X sign-in", "platforms", "Black post card that opens on X.", { defaults: { accent: "#e7e9ea" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-ms", "Microsoft auth", "platforms", "Four-squares Microsoft auth card.", { defaults: { accent: "#0067b8" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-slack", "Slack login", "platforms", "Aubergine Slack workspace login.", { defaults: { accent: "#611f69" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-discord", "Discord login", "platforms", "Blurple welcome-back card.", { defaults: { accent: "#5865f2" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-spotify", "Spotify login", "platforms", "Black and green music login.", { defaults: { accent: "#1db954" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-notion", "Notion sign-in", "platforms", "Minimal white Notion card.", { defaults: { accent: "#111827" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-linear", "Linear login", "platforms", "Dark violet product login.", { defaults: { accent: "#5e6ad2" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-stripe-auth", "Stripe dashboard", "platforms", "Striped fintech sign-in card.", { defaults: { accent: "#635bff" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-twitch", "Twitch login", "platforms", "Purple streaming login card.", { defaults: { accent: "#9146ff" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-x-post", "X post", "platforms", "A post card that opens on X.", { defaults: { accent: "#e7e9ea" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-linkedin", "LinkedIn post", "platforms", "Professional post card.", { defaults: { accent: "#0a66c2" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-reddit", "Reddit post", "platforms", "Community post card.", { defaults: { accent: "#ff4500" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-threads", "Threads post", "platforms", "Short-form Threads card.", { defaults: { accent: "#000000" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-facebook", "Facebook post", "platforms", "Blue social post card.", { defaults: { accent: "#1877f2" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-instagram", "Instagram post", "platforms", "Visual-first post with photo.", { defaults: { accent: "#e1306c" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-tiktok", "TikTok post", "platforms", "Short-video post card.", { defaults: { accent: "#010101" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-pinterest", "Pinterest pin", "platforms", "Save-worthy pin card.", { defaults: { accent: "#e60023" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-whatsapp", "WhatsApp chat", "platforms", "Green chat with online state.", { defaults: { accent: "#25d366" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-telegram", "Telegram channel", "platforms", "Channel card with subscriber count.", { defaults: { accent: "#229ed9" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-messenger", "Messenger card", "platforms", "Chat preview with typing state.", { defaults: { accent: "#0084ff" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-slackmsg", "Slack message", "platforms", "Workspace message card.", { defaults: { accent: "#611f69" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-discord-embed", "Discord embed", "platforms", "Announcement embed for servers.", { defaults: { accent: "#5865f2" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-zoom", "Zoom meeting", "platforms", "Meeting card with join button.", { defaults: { accent: "#2d8cff" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-notionpg", "Notion page", "platforms", "Page card with share state.", { defaults: { accent: "#111827" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-figma", "Figma file", "platforms", "Design file with collaborators.", { defaults: { accent: "#a259ff" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-gmail", "Gmail email", "platforms", "Inbox row with sender and snippet.", { defaults: { accent: "#ea4335" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-gdocs", "Google Docs card", "platforms", "Live doc card with editors.", { defaults: { accent: "#4285f4" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-gdrive", "Drive meter", "platforms", "Storage bar at 62 percent.", { defaults: { accent: "#4285f4" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-dropbox", "Dropbox file", "platforms", "Synced file card.", { defaults: { accent: "#0061ff" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-trello", "Trello board", "platforms", "Board card with lists.", { defaults: { accent: "#0079bf" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-github-pr", "GitHub PR card", "platforms", "PR card with green checks.", { defaults: { accent: "#238636" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-stripe-pay", "Stripe payment", "platforms", "Fintech payment card, Stripe-styled.", { defaults: { accent: "#635bff" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-paypal", "PayPal checkout", "platforms", "Classic PayPal button card.", { defaults: { accent: "#0070ba" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-venmo", "Venmo send", "platforms", "Peer-to-peer payment card.", { defaults: { accent: "#3d95ce" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-meta", "MetaMask connect", "platforms", "Wallet connect on Ethereum.", { defaults: { accent: "#f6851b" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-shopify", "Shopify order", "platforms", "Order status with tracking.", { defaults: { accent: "#5e8e3e" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-airbnb", "Airbnb listing", "platforms", "Stay card with rating and price.", { defaults: { accent: "#ff385c" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-uber", "Uber ride", "platforms", "Driver-arriving trip card.", { defaults: { accent: "#0e0e0e" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-tracker", "Order tracker", "platforms", "Shipment progress with steps.", { defaults: { accent: "#0e0e0e" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-steam", "Steam game card", "platforms", "Store card for PC gaming.", { defaults: { accent: "#1b2838" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-gplay", "Play Store app card", "platforms", "Install card with rating.", { defaults: { accent: "#34a853" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-ph", "Product Hunt launch", "platforms", "Launch card with upvotes.", { defaults: { accent: "#da552f" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-wa-cta", "WhatsApp CTA", "platforms", "Green click-to-chat card with live pulse.", { defaults: { accent: "#25d366" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-ig-grid", "Instagram grid", "platforms", "3x3 latest posts with like counts.", { defaults: { accent: "#e1306c" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-yt-card", "YouTube card", "platforms", "Video card with thumbnail and play state.", { defaults: { accent: "#ff0000" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-tg-chat", "Telegram chat", "platforms", "Group chat bubbles with member count.", { defaults: { accent: "#229ed9" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("pf-li-banner", "LinkedIn profile", "platforms", "Banner profile card with follow button.", { defaults: { accent: "#0a66c2" }, controls: base(TEXT("Title"), ITEMS("Content", "Lines: value | value | value")) }),
  live("iosw-current", "Weather · Current", "weather", "Apple Weather hero: thin display temp over a sky gradient.", { defaults: { text: "Cupertino", cond: "Mostly Sunny", temp: 21, hi: 24, lo: 14 }, controls: base(TEXT("City"), TEXT("Condition")) }),
  live("iosw-hourly", "Weather · Hourly", "weather", "Scrollable hour strip with SF-style glyphs. Now highlighted.", { defaults: { text: "Cupertino", items: "Now|21|sun\n11AM|21|sun\n12PM|22|partly\n1PM|23|partly\n2PM|23|cloud\n3PM|22|rain\n4PM|21|rain\n5PM|20|rain" }, controls: base(TEXT("City"), ITEMS("Hours", "Lines: label | temp | icon (sun, partly, cloud, rain, storm, snow)")) }),
  live("iosw-daily", "Weather · 10-Day", "weather", "Rows with the gradient temperature range bars.", { defaults: { text: "10-Day Forecast", items: "Today|24|14|sun\nTue|23|14|partly\nWed|21|13|cloud\nThu|19|12|rain\nFri|18|11|rain\nSat|22|13|partly\nSun|25|15|sun\nMon|26|16|sun" }, controls: base(TEXT("Title"), ITEMS("Days", "Lines: day | high | low | icon (sun, partly, cloud, rain, storm, snow)")) }),
  live("iosw-stats", "Weather · Conditions", "weather", "UV, feels like, humidity and wind as frosted tiles.", { defaults: { text: "Cupertino", uv: 4, feels: 23, hum: 62, wind: 12 }, controls: base(TEXT("City")) }),
  live("iosw-sun", "Weather · Sun Path", "weather", "Daylight arc with the sun exactly where it belongs.", { defaults: { text: "Sun Path", rise: "06:14", set: "19:48", progress: 62 }, controls: base(TEXT("Title")) }),
  live("mac-dock", "Mac · The Dock", "mac", "Vibrancy glass dock with hover magnification and running dots.", { defaults: { items: "Finder|finder|run\nSafari|safari|run\nMail|mail\nMessages|chat|run\nMusic|music\nPhotos|photos\nNotes|note\nCalendar|cal\nTerminal|terminal\nTrash|trash" }, controls: base(ITEMS("Apps", "Lines: name | icon (finder, safari, mail, chat, music, photos, notes, cal, terminal, trash) | run")) }),
  live("mac-dock-connected", "Mac · Connected Dock", "mac", "CoolDock-style: app tiles beside live GitHub, Linear and Stripe tiles.", { defaults: { text: "Connected Dock", items: "GitHub|github|128|new stars this week\nLinear|linear|7|issues assigned to you\nStripe|stripe|$1,284|MRR this month\nSafari|safari||\nMail|mail|3|unread" }, controls: base(TEXT("Title"), ITEMS("Tiles", "Lines: name | icon | value | label")) }),
  live("mac-menubar", "Mac · Menu Bar", "mac", "The menu bar with an open connected-workspace status menu.", { defaults: { text: "workspace" }, controls: base(TEXT("Title")) }),
  live("mac-controlcenter", "Mac · Control Center", "mac", "Toggles, brightness and sound sliders, now playing.", { defaults: {}, controls: base(TEXT("Title")) }),
  live("mac-spotlight", "Mac · Spotlight", "mac", "Command palette with calculator, apps and files.", { defaults: { text: "ship" }, controls: base(TEXT("Query")) }),
  live("mac-launchpad", "Mac · Launchpad", "mac", "Blurred backdrop app grid with search and page dots.", { defaults: {}, controls: base(TEXT("Title")) }),
  live("mac-nowplaying", "Mac · Now Playing", "mac", "Album art, progress and transport controls in glass.", { defaults: { text: "God's Plan", artist: "Drake — Scorpion" }, controls: base(TEXT("Track"), TEXT("Artist")) }),
  live("mac-stats", "Mac · This Mac", "mac", "CPU, memory, disk and battery gauges in a glass tile.", { defaults: { text: "This Mac" }, controls: base(TEXT("Title")) }),
  live("mac-calendar", "Mac · Today", "mac", "Today's schedule with colored event bars.", { defaults: { items: "09:30|Standup||#007AFF\n11:00|Deep work: dock widgets||#AF52DE\n14:30|1:1 with Maya||#34C759\n18:00|Ship v2.7||#FF9500" }, controls: base(TEXT("Title"), ITEMS("Events", "Lines: time | title | (unused) | color")) }),
  live("mac-shelf", "Mac · Shelf", "mac", "A drop zone for files you are using right now.", { defaults: { text: "Shelf", items: "launch-notes.md|edited 2m ago|12 KB\nlogo-v3.svg|edited 1h ago|88 KB\nbudget.numbers|yesterday|204 KB" }, controls: base(TEXT("Title"), ITEMS("Files", "Lines: name | edited | size")) }),
  /* ---- 2026 expansion: 100 more tools (auto-registered) ---- */
  live("vat-calculator", "VAT calculator", "tools", "Add or remove VAT from any amount, both directions..", { defaults: {}, controls: base() }),
  live("sales-tax-calculator", "Sales tax calculator", "tools", "Tax and total from a pre-tax price..", { defaults: {}, controls: base() }),
  live("discount-calculator", "Discount calculator", "tools", "What you save and what you pay..", { defaults: {}, controls: base() }),
  live("compound-interest-calculator", "Compound interest calculator", "tools", "Future value with monthly, quarterly or yearly compounding..", { defaults: {}, controls: base() }),
  live("simple-interest-calculator", "Simple interest calculator", "tools", "Interest without compounding, the classic way..", { defaults: {}, controls: base() }),
  live("cagr-calculator", "CAGR calculator", "tools", "Compound annual growth rate between two values..", { defaults: {}, controls: base() }),
  live("roi-calculator", "ROI calculator", "tools", "Return on investment as profit and percentage..", { defaults: {}, controls: base() }),
  live("profit-margin-calculator", "Profit margin calculator", "tools", "Margin and profit from revenue and cost..", { defaults: {}, controls: base() }),
  live("markup-calculator", "Markup calculator", "tools", "Selling price from cost and target margin..", { defaults: {}, controls: base() }),
  live("break-even-calculator", "Break-even calculator", "tools", "Units and revenue needed to cover fixed costs..", { defaults: {}, controls: base() }),
  live("hourly-to-salary", "Hourly to salary", "tools", "Annual and monthly pay from an hourly rate..", { defaults: {}, controls: base() }),
  live("salary-to-hourly", "Salary to hourly", "tools", "Your real hourly rate from an annual salary..", { defaults: {}, controls: base() }),
  live("savings-goal-calculator", "Savings goal calculator", "tools", "Monthly savings needed to hit a goal..", { defaults: {}, controls: base() }),
  live("debt-payoff-calculator", "Debt payoff calculator", "tools", "Months and interest to clear a balance..", { defaults: {}, controls: base() }),
  live("inflation-calculator", "Inflation calculator", "tools", "What today's money will cost, and what it'll buy..", { defaults: {}, controls: base() }),
  live("net-to-gross-calculator", "Net to gross salary", "tools", "Gross pay and tax from a net amount..", { defaults: {}, controls: base() }),
  live("subscription-cost-calculator", "Subscription cost calculator", "tools", "True yearly and daily cost of a subscription..", { defaults: {}, controls: base() }),
  live("fuel-cost-calculator", "Fuel cost calculator", "tools", "Liters and cost for any distance..", { defaults: {}, controls: base() }),
  live("electricity-cost-calculator", "Electricity cost calculator", "tools", "What an appliance really costs to run..", { defaults: {}, controls: base() }),
  live("unit-price-calculator", "Unit price calculator", "tools", "Compare packs by price per unit and per 100..", { defaults: {}, controls: base() }),
  live("payment-split-calculator", "Payment split calculator", "tools", "Split a bill by percentage, not by heads..", { defaults: {}, controls: base() }),
  live("apr-calculator", "Approximate APR", "tools", "Effective rate from interest, fees and term..", { defaults: {}, controls: base() }),
  live("overtime-pay-calculator", "Overtime pay calculator", "tools", "Regular, overtime and total pay..", { defaults: {}, controls: base() }),
  live("invoice-total-calculator", "Invoice total", "tools", "Subtotal, tax and grand total..", { defaults: {}, controls: base() }),
  live("future-value-calculator", "Future value calculator", "tools", "Lump sum plus monthly contributions, compounded..", { defaults: {}, controls: base() }),
  live("bmr-calculator", "BMR calculator", "utility", "Basal metabolic rate (Mifflin-St Jeor)..", { defaults: {}, controls: base() }),
  live("daily-calorie-calculator", "Daily calorie calculator", "utility", "Maintenance calories from activity level..", { defaults: {}, controls: base() }),
  live("water-intake-calculator", "Water intake calculator", "utility", "Daily hydration target for your weight and workout..", { defaults: {}, controls: base() }),
  live("protein-intake-calculator", "Protein intake calculator", "utility", "Grams per day by goal..", { defaults: {}, controls: base() }),
  live("body-fat-calculator", "Body fat calculator", "utility", "US Navy method from neck, waist and hips..", { defaults: {}, controls: base() }),
  live("ideal-weight-calculator", "Ideal weight calculator", "utility", "Devine formula from height..", { defaults: {}, controls: base() }),
  live("running-pace-calculator", "Running pace calculator", "utility", "Pace and speed from distance and time..", { defaults: {}, controls: base() }),
  live("race-time-calculator", "Race time predictor", "utility", "Riegel prediction from a recent race..", { defaults: {}, controls: base() }),
  live("one-rep-max-calculator", "One rep max calculator", "utility", "Epley 1RM plus training percentages..", { defaults: {}, controls: base() }),
  live("heart-rate-zones", "Heart rate zones", "utility", "Five Karvonen training zones..", { defaults: {}, controls: base() }),
  live("steps-to-calories", "Steps to calories", "utility", "Calories and distance from your step count..", { defaults: {}, controls: base() }),
  live("sleep-cycle-calculator", "Sleep cycle calculator", "utility", "Bedtimes for full 90-minute sleep cycles..", { defaults: {}, controls: base() }),
  live("due-date-calculator", "Due date calculator", "utility", "Pregnancy due date and current week..", { defaults: {}, controls: base() }),
  live("calories-burned-calculator", "Calories burned", "utility", "Burn by activity, weight and minutes..", { defaults: {}, controls: base() }),
  live("waist-to-height-calculator", "Waist to height ratio", "utility", "Ratio with WHO-style assessment..", { defaults: {}, controls: base() }),
  live("macros-calculator", "Macro split calculator", "utility", "Protein, carbs and fat from daily calories..", { defaults: {}, controls: base() }),
  live("protein-per-meal-calculator", "Protein per meal", "utility", "Daily protein spread over your meals..", { defaults: {}, controls: base() }),
  live("caffeine-calculator", "Caffeine calculator", "utility", "How much caffeine is left in your system..", { defaults: {}, controls: base() }),
  live("calorie-deficit-calculator", "Calorie deficit calculator", "utility", "Daily intake for your loss pace..", { defaults: {}, controls: base() }),
  live("walking-time-calculator", "Walking time", "utility", "Time for any distance at three paces..", { defaults: {}, controls: base() }),
  live("cycling-speed-calculator", "Cycling speed", "utility", "Average speed from distance and time..", { defaults: {}, controls: base() }),
  live("height-predictor", "Child height predictor", "utility", "Mid-parental height estimate..", { defaults: {}, controls: base() }),
  live("hydration-reminder", "Hydration calculator", "utility", "Daily target and hourly sips..", { defaults: {}, controls: base() }),
  live("rest-timer", "Rest timer", "utility", "A set-length countdown between exercises..", { defaults: {}, controls: base() }),
  live("kg-lb-converter", "Kilograms to pounds", "utility", "Two-way weight converter..", { defaults: {}, controls: base() }),
  live("cm-inch-converter", "Centimeters to inches", "utility", "Two-way length converter..", { defaults: {}, controls: base() }),
  live("celsius-fahrenheit-converter", "Celsius to Fahrenheit", "utility", "Two-way temperature converter..", { defaults: {}, controls: base() }),
  live("km-miles-converter", "Kilometers to miles", "utility", "Two-way distance converter..", { defaults: {}, controls: base() }),
  live("liter-gallon-converter", "Liters to gallons", "utility", "Two-way volume converter..", { defaults: {}, controls: base() }),
  live("ml-oz-converter", "Milliliters to fluid ounces", "utility", "Two-way small-volume converter..", { defaults: {}, controls: base() }),
  live("sqm-sqft-converter", "Square meters to square feet", "utility", "Two-way area converter..", { defaults: {}, controls: base() }),
  live("bytes-converter", "Megabytes to gigabytes", "utility", "Two-way storage converter..", { defaults: {}, controls: base() }),
  live("seconds-hms-converter", "Seconds to HH:MM:SS", "utility", "Two-way duration converter..", { defaults: {}, controls: base() }),
  live("decimal-binary-converter", "Decimal to binary", "utility", "Two-way base converter..", { defaults: {}, controls: base() }),
  live("decimal-hex-converter", "Decimal to hexadecimal", "utility", "Two-way base converter..", { defaults: {}, controls: base() }),
  live("mpg-converter", "MPG to L/100km", "utility", "Two-way fuel economy converter..", { defaults: {}, controls: base() }),
  live("bar-psi-converter", "Bar to PSI", "utility", "Two-way pressure converter..", { defaults: {}, controls: base() }),
  live("knots-kmh-converter", "Knots to km/h", "utility", "Two-way speed converter..", { defaults: {}, controls: base() }),
  live("radians-degrees-converter", "Radians to degrees", "utility", "Two-way angle converter..", { defaults: {}, controls: base() }),
  live("unix-timestamp-converter", "Unix timestamp converter", "utility", "Epoch seconds to date and back..", { defaults: {}, controls: base() }),
  live("number-to-words", "Number to words", "utility", "English words up to 999 million..", { defaults: {}, controls: base() }),
  live("roman-numeral-converter", "Roman numerals", "utility", "Numbers to roman numerals and back..", { defaults: {}, controls: base() }),
  live("base64-converter", "Base64 converter", "utility", "Text to base64 and back..", { defaults: {}, controls: base() }),
  live("url-encoder", "URL encoder", "utility", "Percent-encode or decode any string..", { defaults: {}, controls: base() }),
  live("case-converter", "Case converter", "utility", "UPPER, lower and Title Case at once..", { defaults: {}, controls: base() }),
  live("word-counter", "Word counter", "utility", "Words, characters and sentences as you type..", { defaults: {}, controls: base() }),
  live("text-reverser", "Text reverser", "utility", "Flip characters, words or lines..", { defaults: {}, controls: base() }),
  live("slug-generator", "Slug generator", "utility", "URL-safe slugs from any title..", { defaults: {}, controls: base() }),
  live("number-scale-converter", "Number to K/M/B", "utility", "Compact social-media style number formatting..", { defaults: {}, controls: base() }),
  live("dice-roller", "Dice roller", "tools", "Roll up to ten dice of any size..", { defaults: {}, controls: base() }),
  live("coin-flip", "Coin flip", "tools", "A clean two-way decider..", { defaults: {}, controls: base() }),
  live("random-number-generator", "Random number", "tools", "Any range, uniform pick..", { defaults: {}, controls: base() }),
  live("lottery-number-generator", "Lottery numbers", "tools", "Six unique picks from 1–49..", { defaults: {}, controls: base() }),
  live("random-picker", "Random picker", "tools", "One line, one winner..", { defaults: {}, controls: base() }),
  live("team-randomizer", "Team randomizer", "tools", "Shuffle names into fair teams..", { defaults: {}, controls: base() }),
  live("pin-generator", "PIN generator", "tools", "Numeric PINs of any length..", { defaults: {}, controls: base() }),
  live("random-color-generator", "Random color", "tools", "A hex color with live swatch..", { defaults: {}, controls: base() }),
  live("username-generator", "Username generator", "tools", "Adjective, noun, number — done..", { defaults: {}, controls: base() }),
  live("raffle-winner", "Raffle winner", "tools", "Animated draw from your entries..", { defaults: {}, controls: base() }),
  live("pomodoro-timer", "Pomodoro timer", "tools", "25/5 focus cycles with one tap..", { defaults: {}, controls: base() }),
  live("kitchen-timer", "Kitchen timer", "tools", "Minutes, seconds and a loud Done!.", { defaults: {}, controls: base() }),
  live("metronome", "Metronome", "tools", "Audio clicks at any tempo..", { defaults: {}, controls: base() }),
  live("breathing-timer", "Breathing exercise", "tools", "Guided 4-7-8 breathing animation..", { defaults: {}, controls: base() }),
  live("reaction-test", "Reaction time test", "tools", "Tap the moment it turns green..", { defaults: {}, controls: base() }),
  live("typing-speed-test", "Typing speed test", "tools", "WPM and accuracy in one sentence..", { defaults: {}, controls: base() }),
  live("work-hours-calculator", "Work hours calculator", "tools", "Hours and overtime from start, end and break..", { defaults: {}, controls: base() }),
  live("bedtime-calculator", "Bedtime calculator", "tools", "Bedtimes for full sleep cycles..", { defaults: {}, controls: base() }),
  live("countdown-to-date", "Live date countdown", "tools", "A ticking countdown to any day..", { defaults: {}, controls: base() }),
  live("stopwatch", "Stopwatch", "tools", "Start, stop and reset, tenths included..", { defaults: {}, controls: base() }),
  live("word-of-the-day", "Word of the day", "tools", "A rare word with its meaning, daily..", { defaults: {}, controls: base() }),
  live("quote-of-the-day", "Quote of the day", "tools", "A design classic, daily..", { defaults: {}, controls: base() }),
  live("yes-no-decider", "Yes or no decider", "tools", "Let the widget make the call..", { defaults: {}, controls: base() }),
  live("color-contrast-checker", "Color contrast checker", "utility", "WCAG contrast ratio for any foreground and background pair.", { defaults: {}, controls: base() }),
  live("magic-8-ball", "Magic 8 ball", "utility", "Ask a question, receive an ominous answer.", { defaults: {}, controls: base() }),
  live("random-emoji", "Random emoji picker", "utility", "One emoji, chosen by fate.", { defaults: {}, controls: base() }),
  live("interval-timer", "Interval timer", "utility", "Alternating work and rest countdown for intervals.", { defaults: {}, controls: base() }),
  live("ratio-calculator", "Ratio calculator", "utility", "Solve a:b = c:d for the missing value.", { defaults: {}, controls: base() }),
  live("week-number-calculator", "Week number calculator", "utility", "The ISO week for any date.", { defaults: {}, controls: base() }),
  live("ap-signin", "Apple · Sign in", "apple", "Sign in with Apple ID — the real mark, iOS fields, zero friction.", { defaults: { text: "you@icloud.com" }, controls: base(TEXT("Email")) }),
  live("ap-signin-dark", "Apple · Sign in Dark", "apple", "The Apple ID card locked to its gorgeous dark mode.", { defaults: { text: "you@icloud.com" }, controls: base(TEXT("Email")) }),
  live("ap-otp", "Apple · One-Time Code", "apple", "Six-box verification with the live caret and resend timer.", { defaults: {}, controls: base(TEXT("Title")) }),
  live("ap-faceid", "Apple · Face ID Pay", "apple", "Double-click to confirm — Face ID payment sheet.", { defaults: { text: "Confirm Purchase", sub: "PlanckUi Pro · $4.99/month" }, controls: base(TEXT("Title"), TEXT("Subtitle")) }),
  live("ap-aichat", "Apple · AI Chat", "apple", "Apple Intelligence-style chat with the animated glow mark.", { defaults: { text: "Summarize my reviews", sub: "Customers love the new checkout — 92% of this week's reviews mention it." }, controls: base(TEXT("Question"), TEXT("Answer")) }),
  live("ap-aibutton", "Apple · AI Button", "apple", "The glowing Apple Intelligence button that floats on your site.", { defaults: {}, controls: base(TEXT("Title")) }),
  live("ap-aisummary", "Apple · AI Summary", "apple", "A morning summary notification, written like Siri would.", { defaults: { text: "This morning: 4 new 5-star reviews, checkout uptime 100%, and 2 feature requests about dark mode." }, controls: base(TEXT("Summary")) }),
  live("ap-alert", "Apple · Alert", "apple", "The honest iOS permission alert — great for consent moments.", { defaults: { text: "planck-ui.design" }, controls: base(TEXT("Site Name")) }),
  live("ap-actionsheet", "Apple · Action Sheet", "apple", "Share sheet with Copy HTML, link and Messages actions.", { defaults: {}, controls: base(TEXT("Title")) }),
  live("ap-settings", "Apple · Settings Toggles", "apple", "Inset grouped list with real iOS switches and system icons.", { defaults: {}, controls: base(TEXT("Title")) }),
  live("ap-segmented", "Apple · Segmented Chart", "apple", "Segmented control over a weekly bar chart.", { defaults: { text: "Widget installs" }, controls: base(TEXT("Title")) }),
  live("ap-tabbar", "Apple · Tab Bar", "apple", "Five-tab iOS bar with live SF-style glyphs.", { defaults: {}, controls: base(TEXT("Title")) }),
  live("ap-largetitle", "Apple · Settings List", "apple", "Large-title screen with search and grouped rows.", { defaults: { text: "Settings" }, controls: base(TEXT("Title")) }),
  live("ap-today", "Apple · Today Card", "apple", "App Store Today card featuring your product.", { defaults: { text: "PlanckUi" }, controls: base(TEXT("Title")) }),
  live("ap-appcard", "Apple · App Rows", "apple", "App rows with ratings and GET buttons.", { defaults: { text: "Essential widgets" }, controls: base(TEXT("Title")) }),
  live("ap-pay", "Apple · Pay Sheet", "apple", "Payment sheet with card, shipping and total.", { defaults: { text: "$49.00" }, controls: base(TEXT("Total")) }),
  live("ap-player", "Apple · Now Playing", "apple", "iOS music player with scrubber and transport controls.", { defaults: { text: "Heaven", sub: "Navid — Scorpion" }, controls: base(TEXT("Track"), TEXT("Artist")) }),
  live("ap-lockscreen", "Apple · Lock Screen", "apple", "9:41 lock screen with widgets and a notification.", { defaults: {}, controls: base(TEXT("Title")) }),
  live("ap-island", "Apple · Dynamic Island", "apple", "Live Activity pill — delivery status with an audio bar.", { defaults: {}, controls: base(TEXT("Title")) }),
  live("ap-notifs", "Apple · Notifications", "apple", "Stacked iOS notifications for announcements.", { defaults: {}, controls: base(TEXT("Title")) }),
  live("ap-siri", "Apple · Siri Suggestions", "apple", "Prediction chips grid in the Siri card style.", { defaults: {}, controls: base(TEXT("Title")) }),
  live("ap-rings", "Apple · Activity Rings", "apple", "Move, Exercise and Stand rings for challenges and stats.", { defaults: { text: "Activity" }, controls: base(TEXT("Title")) }),
  live("ap-steps", "Apple · Steps", "apple", "Weekly step chart in the Health card style.", { defaults: { text: "8,412" }, controls: base(TEXT("Steps")) }),
  live("ap-wallet", "Apple · Wallet Pass", "apple", "Boarding pass with barcode — flights, events, tickets.", { defaults: {}, controls: base(TEXT("Title")) }),
  live("ap-place", "Apple · Place Card", "apple", "Maps place card with photo, hours and directions.", { defaults: { text: "Fern & Coffee" }, controls: base(TEXT("Place")) }),
  live("ap-contact", "Apple · Contact Card", "apple", "Contact card with call, message and video actions.", { defaults: { text: "Maya Okafor", sub: "Design engineer · PlanckUi" }, controls: base(TEXT("Name"), TEXT("Role")) }),
  live("ap-weathertile", "Apple · Weather Tile", "apple", "Compact forecast tile with hourly strip.", { defaults: { text: "Cupertino" }, controls: base(TEXT("City")) }),
  live("ap-calwidget", "Apple · Calendar", "apple", "Today's schedule with colored event bars.", { defaults: { text: "Today" }, controls: base(TEXT("Title")) }),
  live("ap-battery", "Apple · Batteries", "apple", "Device battery rings for iPhone, Watch and AirPods.", { defaults: { text: "Batteries" }, controls: base(TEXT("Title")) }),
  live("ap-screentime", "Apple · Screen Time", "apple", "Category time breakdown with the daily average.", { defaults: { text: "Screen Time" }, controls: base(TEXT("Title")) }),
];

export const LIVE_WIDGETS = WIDGETS.filter((w) => w.status === "live");

export function getWidget(id: string): WidgetDef | undefined {
  return WIDGETS.find((w) => w.id === id);
}

export function defaultsFor(def: WidgetDef): WidgetConfig {
  return {
    theme: "light",
    accent: "oklch(0.47 0.1 203)",
    radius: 12,
    density: "cozy",
    showBadge: true,
    ...def.defaults,
  };
}
