import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-display text-5xl font-semibold tracking-tight">404</p>
      <p className="max-w-sm text-ink-2">
        This page took a day off. The catalog, however, is still fully staffed.
      </p>
      <Link href="/gallery" className="btn btn-primary btn-sm mt-2">
        Browse the catalog
      </Link>
    </div>
  );
}
