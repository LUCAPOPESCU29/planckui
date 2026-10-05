import Link from "next/link";
import { POSTS } from "@/lib/blog";

export const metadata = {
  title: "Blog — PlanckUi",
  description: "Engineering and design notes from the PlanckUi embed platform.",
};

export default function BlogIndex() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-20">
      <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">Blog</p>
      <h1 className="mt-3 max-w-2xl text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-ink">
        Engineering and design notes.
      </h1>
      <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-ink-2">
        How the embeds work, why the constraints exist, and what we cut to keep
        them. Written by the people building it.
      </p>

      <div className="mt-12 flex flex-col gap-10">
        {POSTS.map((p) => (
          <article key={p.slug} className="border-b border-line pb-10">
            <div className="flex items-center gap-3 text-xs text-ink-3">
              <span className="font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">{p.tag}</span>
              <span>·</span>
              <time dateTime={p.date}>
                {new Date(p.date + "T00:00:00").toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}
              </time>
              <span>·</span>
              <span>{p.readTime}</span>
            </div>
            <h2 className="mt-3 text-[clamp(20px,2.6vw,26px)] font-semibold leading-snug tracking-[-0.015em]">
              <Link href={`/blog/${p.slug}`} className="transition-colors duration-150 hover:text-[var(--accent)]">
                {p.title}
              </Link>
            </h2>
            <p className="mt-2.5 max-w-[62ch] text-[14.5px] leading-relaxed text-ink-2">{p.excerpt}</p>
            <Link href={`/blog/${p.slug}`} className="mt-3 inline-block text-[13.5px] font-medium text-[var(--accent)]">
              Read the post →
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-8 rounded-[14px] border border-line bg-[var(--surface-2)] p-6">
        <p className="text-sm leading-relaxed text-ink-2">
          Prefer the short version? Everything above ships as{" "}
          <Link href="/blocks" className="font-medium text-[var(--accent)]">copy-paste blocks</Link> and{" "}
          <Link href="/gallery" className="font-medium text-[var(--accent)]">590 free widgets</Link> — no
          email asked.
        </p>
      </div>
    </main>
  );
}
