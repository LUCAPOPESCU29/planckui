import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, POSTS, type BlogBlock } from "@/lib/blog";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: `${post.title} — PlanckUi blog`,
    description: post.excerpt,
  };
}

function Block({ b }: { b: BlogBlock }) {
  switch (b.t) {
    case "h2":
      return (
        <h2 className="mt-10 mb-3 font-display text-[20px] font-semibold tracking-[-0.015em] text-ink">{b.text}</h2>
      );
    case "li":
      return (
        <li className="flex gap-2.5 text-[15px] leading-relaxed text-ink-2">
          <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden="true" /> {b.text}
        </li>
      );
    case "code":
      return (
        <pre className="my-5 overflow-x-auto rounded-[12px] p-4 font-mono text-[12.5px] leading-relaxed"
          style={{ background: "#16181c", color: "#e8ecf1", border: "1px solid rgba(255,255,255,0.08)" }}>
          {b.text}
        </pre>
      );
    case "quote":
      return (
        <blockquote className="my-6 border-l-2 border-[var(--accent)] pl-5 font-display text-[18px] font-medium leading-relaxed text-ink">
          {b.text}
        </blockquote>
      );
    default:
      return <p className="my-4 text-[15.5px] leading-[1.75] text-ink-2">{b.text}</p>;
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const idx = POSTS.findIndex((p) => p.slug === slug);
  const next = POSTS[idx + 1] ?? POSTS[0];

  return (
    <main className="mx-auto max-w-2xl px-6 pb-24 pt-20">
      <Link href="/blog" className="text-[13px] font-medium text-[var(--accent)]">← Blog</Link>
      <div className="mt-6 flex items-center gap-3 text-xs text-ink-3">
        <span className="font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">{post.tag}</span>
        <span>·</span>
        <time dateTime={post.date}>
          {new Date(post.date + "T00:00:00").toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}
        </time>
        <span>·</span>
        <span>{post.readTime}</span>
      </div>
      <h1 className="mt-4 font-display text-[clamp(26px,4vw,38px)] font-semibold leading-[1.12] tracking-[-0.025em] text-ink">
        {post.title}
      </h1>
      <p className="mt-4 text-[16px] leading-relaxed text-ink-2">{post.excerpt}</p>

      <article className="mt-8 border-t border-line pt-8">
        {post.blocks.map((b, i) => <Block key={i} b={b} />)}
      </article>

      <div className="mt-14 rounded-[14px] border border-line bg-[var(--surface-2)] p-6">
        <p className="text-sm leading-relaxed text-ink-2">
          Everything in this post is live on the site —{" "}
          <Link href="/gallery" className="font-medium text-[var(--accent)]">590 widgets</Link> and{" "}
          <Link href="/blocks" className="font-medium text-[var(--accent)]">55 copy-paste blocks</Link>, all free,
          no email asked.
        </p>
      </div>

      <div className="mt-10 flex items-center justify-between border-t border-line pt-6 text-sm">
        <Link href="/blog" className="font-medium text-[var(--accent)]">← All posts</Link>
        <span className="text-ink-3">
          Next: <Link href={`/blog/${next.slug}`} className="font-medium text-[var(--accent)]">{next.title}</Link>
        </span>
      </div>
    </main>
  );
}
