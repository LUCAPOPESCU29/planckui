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
  const links = [
    { href: "/gallery", label: "Widgets" },
    { href: "/macbook-resources", label: "MacBook Resources" },
    { href: "/animations", label: "Animations" },
    { href: "/blocks", label: "Blocks" },
    { href: "/navigations", label: "Navigations" },
    { href: "/#pricing", label: "Pricing" },
  ];
  return (
    <div className="sticky top-4 z-50 flex justify-center px-4">
      <nav aria-label="Main" className="glass-pill-nav">
        <Wordmark />
        <div className="hidden items-center gap-1 text-sm text-ink-2 sm:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-1.5 transition-colors duration-150 hover:bg-surface-2 hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <ThemeToggle />
        <Link href="/dashboard" className="btn btn-primary rounded-full">
          Open app
        </Link>
      </nav>
    </div>
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
