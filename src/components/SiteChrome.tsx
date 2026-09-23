import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Wordmark({ size = "base" }: { size?: "base" | "lg" }) {
  return (
    <Link
      href="/"
      className={`font-display font-semibold tracking-tight ${size === "lg" ? "text-xl" : "text-[17px]"}`}
    >
      PlanckUi
    </Link>
  );
}

export function SiteNav() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Wordmark />
          <nav className="hidden items-center gap-6 text-sm text-ink-2 sm:flex">
            <Link href="/gallery" className="transition-colors hover:text-ink">
              Widgets
            </Link>
            <Link href="/animations" className="transition-colors hover:text-ink">
              Animations
            </Link>
            <Link href="/blocks" className="transition-colors hover:text-ink">
              Blocks
            </Link>
            <Link href="/#pricing" className="transition-colors hover:text-ink">
              Pricing
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/dashboard" className="btn btn-primary btn-sm">
            Open app
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-ink-3 sm:flex-row sm:items-center sm:justify-between">
        <span>
          PlanckUi — every widget free, forever. Made with PlanckUi, obviously.
        </span>
        <nav className="flex gap-5">
          <Link href="/gallery" className="transition-colors hover:text-ink">
            Catalog
          </Link>
          <Link href="/dashboard" className="transition-colors hover:text-ink">
            Dashboard
          </Link>
        </nav>
      </div>
    </footer>
  );
}
