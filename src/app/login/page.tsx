import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { Wordmark } from "@/components/SiteChrome";
import { currentUser } from "@/lib/auth";

export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await currentUser()) redirect("/dashboard");
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line">
        <div className="mx-auto flex h-14 max-w-6xl items-center px-6">
          <Wordmark />
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-2xl font-semibold">Welcome to PlanckUi</h1>
          <p className="mt-2 mb-6 text-sm text-ink-2">
            Sign in to collect testimonials and build widgets.
          </p>
          <LoginForm />
        </div>
      </main>
      <footer className="border-t border-line px-6 py-5 text-center text-sm text-ink-3">
        <Link href="/" className="transition-colors hover:text-ink">
          Back to the site
        </Link>
      </footer>
    </div>
  );
}
