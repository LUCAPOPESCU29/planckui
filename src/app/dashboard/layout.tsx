import Link from "next/link";
import type { ReactNode } from "react";
import { Wordmark } from "@/components/SiteChrome";
import { SignOutButton } from "@/components/SignOutButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GuestBar } from "@/components/GuestBar";
import { requireUser } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-line" style={{ background: "var(--bg)" }}>
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-5">
            <Wordmark />
            <nav className="scrollbar-none -mx-1 flex items-center gap-1 overflow-x-auto text-sm">
              {[
                { href: "/dashboard", label: "Overview" },
                { href: "/dashboard/widgets", label: "My widgets" },
                { href: "/dashboard/widgets/new", label: "New widget" },
                { href: "/gallery", label: "Catalog" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-[8px] px-3 py-1.5 whitespace-nowrap text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <SignOutButton />
          </div>
        </div>
      </header>
      {user.email === null && <GuestBar />}
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">{children}</main>
    </div>
  );
}
