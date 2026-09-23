import type { TestimonialData } from "./types";

/* Demo data reads like real customers on purpose — demo states must teach
   what real data will look like, never lorem ipsum. */
export const DEMO_TESTIMONIALS: TestimonialData[] = [
  {
    id: "d1",
    author: "Maya Okafor",
    role: "Founder, Fern & Co.",
    rating: 5,
    text: "I replaced a $25/month subscription with this in one afternoon. Pasted the snippet, and the wall of love just appeared on my homepage. Still slightly annoyed at how easy it was.",
    createdAt: "2026-08-14",
  },
  {
    id: "d2",
    author: "Tomás Rivera",
    role: "Runs a bike repair shop",
    rating: 5,
    text: "Customers started mentioning the reviews on my site. One said it was the reason she trusted me with her frame repair. That call paid for the year, which is funny, because the year was free.",
    createdAt: "2026-07-30",
  },
  {
    id: "d3",
    author: "June Park",
    role: "Illustrator",
    rating: 4,
    text: "The collection form is better than the one I was paying for. Clients record a short video right in the browser and I approve it from my phone. Only wish the video files were smaller.",
    createdAt: "2026-09-02",
  },
  {
    id: "d4",
    author: "Ade Balogun",
    role: "CTO, Lattice Labs",
    rating: 5,
    text: "The embed script is 9 KB, renders in a shadow root, and caused zero layout shift on a page I am scored on. This is how embeds should have worked all along.",
    createdAt: "2026-08-21",
  },
  {
    id: "d5",
    author: "Sofia Lindqvist",
    role: "Bakery owner",
    rating: 5,
    text: "I am not a technical person. I copied the code, pasted it, and asked my nephew if it looked broken. It did not. The cake reviews look lovely.",
    createdAt: "2026-06-18",
  },
  {
    id: "d6",
    author: "Daniel Weiss",
    role: "Indie hacker",
    rating: 4,
    text: "Shipped my landing page with the marquee and the rating badge. Two widgets, ten minutes, zero dollars. The paid tool I removed had worse defaults.",
    createdAt: "2026-09-10",
  },
];
