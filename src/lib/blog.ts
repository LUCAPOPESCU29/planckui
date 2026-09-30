/* The PlanckUi blog — three engineering posts, content as structured blocks
   so the renderer stays a dumb mapper. Dates newest-first. */

export type BlogBlock =
  | { t: "p"; text: string }
  | { t: "h2"; text: string }
  | { t: "li"; text: string }
  | { t: "code"; text: string }
  | { t: "quote"; text: string };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string;
  readTime: string;
  blocks: BlogBlock[];
};

export const POSTS: BlogPost[] = [
  {
    slug: "embed-script-9kb",
    title: "How our embed script stays under 9 KB",
    excerpt:
      "No framework, no icon pack, no date library — the whole embed is one file of string-building functions. Here is every decision that keeps it small, and the three features we cut to get there.",
    tag: "Engineering",
    date: "2026-09-18",
    readTime: "5 min read",
    blocks: [
      { t: "p", text: "Every widget on this site ships inside a single script tag. Compressed, it weighs nine kilobytes — smaller than the average hero image's alt-text metadata. That number is not an accident and not a framework trick. It is a budget we set on day one, and every feature since has had to fit inside it." },
      { t: "h2", text: "The rule that did most of the work" },
      { t: "p", text: "Embeds render no JavaScript framework. Not a small one — none. A widget is a pure function that takes config and data and returns three strings: HTML, CSS and a small script. The host page's embed loader injects them into a shadow root and, when the widget needs behavior, wraps that script in a function bound to the shadow root. No virtual DOM, no hydration, no runtime to download." },
      { t: "p", text: "Because renderers are pure functions, the editor preview and the live embed can never drift — they call the exact same code. That property is worth more than any framework feature, and it costs zero bytes." },
      { t: "h2", text: "What nine kilobytes buys" },
      { t: "li", text: "One lazy render — an IntersectionObserver draws the widget when it enters the viewport, never before." },
      { t: "li", text: "Themes as four CSS custom properties — accent, radius, density and a light/dark toggle on the host element." },
      { t: "li", text: "Six inline icon paths — the entire icon set, replacing a 40 KB icon font." },
      { t: "li", text: "Dates via Intl — localized dates with zero date library." },
      { t: "h2", text: "The three features we cut" },
      { t: "p", text: "A markdown parser for review text. We support a tiny subset — bold, links, line breaks — in about forty lines. A animation library: every motion in every widget is a CSS transition on transform or opacity, which the CSS string handles natively. And server-side theming: themes are variables evaluated in the browser, not compiled variants." },
      { t: "quote", text: "The budget is the feature. Nine kilobytes is why the free plan could stay free — hosting nine-kilobyte responses at scale costs rounding errors." },
      { t: "h2", text: "The compounding part" },
      { t: "p", text: "Small embeds change the product, not just the performance page. Customers paste widgets onto pricing pages and checkout flows — surfaces where teams refuse third-party scripts — because a nine-kilobyte, lazy, shadow-scoped snippet is an easier sell internally than the widget itself is technically. The constraint became the sales pitch, and it started as a line in a design doc." },
    ],
  },
  {
    slug: "why-shadow-dom",
    title: "Why shadow DOM",
    excerpt:
      "Widget CSS versus site CSS is the oldest war in embeddable software. We considered iframes, prefixes and scoped styles — then picked the browser's native answer. What it solves, what it costs, and the two gaps we had to patch.",
    tag: "Engineering",
    date: "2026-09-11",
    readTime: "4 min read",
    blocks: [
      { t: "p", text: "Every embeddable widget eventually fights the same war: your CSS against the host site's. Their reset strips your list styles. Their `.card` class collides with yours. Their dark mode inverts your review cards into something unreadable. We evaluated the usual treaties before picking a side." },
      { t: "h2", text: "The options, honestly" },
      { t: "li", text: "Iframes — perfect isolation, but each iframe is a full document: slow, layout-shifting, and overlays get clipped at the frame boundary." },
      { t: "li", text: "CSS prefixes — rename every class plk- something. Works until the host site has a .plk-card of their own, or a global * selector." },
      { t: "li", text: "Scoped styles with a build step — moves the war into your pipeline and still loses to host !important rules." },
      { t: "p", text: "Shadow DOM wins because isolation is the platform feature, not a convention. Styles cannot cross the boundary in either direction — the host cannot break the widget and the widget cannot break the host." },
      { t: "h2", text: "The two gaps we patched" },
      { t: "p", text: "First: fonts. @font-face declarations don't cross into shadow roots, so the loader script re-declares the widget fonts at the document level and widgets reference them by name. Second: position fixed. Fixed elements inside a shadow root still position against the viewport, which escapes the widget frame — so the preview constrains any fixed-position element to its container with a containing-block rule." },
      { t: "quote", text: "Isolation is the platform feature. That sentence is the entire engineering argument." },
      { t: "h2", text: "What it costs" },
      { t: "p", text: "No global selectors inside widgets, and no shared stylesheets — every widget carries its own CSS string. We accepted that: theme tokens are four custom properties on the host, the per-widget CSS is generated from pure functions, and the discipline of small self-contained styles has kept every widget copy-pasteable for two years. The day that stops being true, we'll revisit — but it hasn't." },
    ],
  },
  {
    slug: "the-01g-bet",
    title: "The 0.1g bet",
    excerpt:
      "A kitchen scale measures to a tenth of a gram nobody needs — and sells millions because of it. Our design law bets on the same trick: one precision number, stated publicly, makes every future decision easier.",
    tag: "Design notes",
    date: "2026-09-04",
    readTime: "4 min read",
    blocks: [
      { t: "p", text: "There is a kitchen scale on our mood board. It's a spoon — a white plastic spoon with a tiny LCD screen — and it measures to a tenth of a gram. Nobody baking bread needs a tenth of a gram. The scale sells millions anyway, because the number does something no feature list can: it ends the conversation about whether the product is precise." },
      { t: "p", text: "When we started PlanckUi we made the same kind of bet, three times. Nine kilobytes for the embed script. Three hundred milliseconds for any animation. One accent color per widget. None of these numbers were negotiated after we wrote them down, and that was the point — a precision constraint is a decision-making machine you build once and use forever." },
      { t: "h2", text: "What the numbers decided for us" },
      { t: "li", text: "Nine kilobytes killed a markdown parser, an icon font and a date library — and forced the Intl trick and the forty-line mini-markdown." },
      { t: "li", text: "Three hundred milliseconds killed every animation longer than a breath, which killed the animation library before we installed one." },
      { t: "li", text: "One accent color killed the theme marketplace, the per-widget color pickers and two rebrands — in the first month." },
      { t: "p", text: "Each cut looked like a loss the week it happened. Each one saved a quarter of decisions later, because a stated constraint doesn't re-open every sprint." },
      { t: "h2", text: "How to pick your number" },
      { t: "p", text: "The number has to be checkable by anyone in thirty seconds — a file size, a stopwatch, a color picker. It has to be public, because private constraints get negotiated. And it has to cost you something real: our 0.1g moment was deleting the dark-theme marketplace two weeks before launch, with the rebrand already paid for. A constraint you never pay for is a slogan." },
      { t: "quote", text: "Precision is a bet you make once so you stop re-making it every sprint." },
      { t: "p", text: "The spoon scale isn't precise because it shows decimals. It's precise because the manufacturer decided what it would never do. Pick your tenth of a gram and write it down where the whole team can see it get expensive." },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}
