import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { Wordmark } from "@/components/SiteChrome";
import { currentUser } from "@/lib/auth";

export const metadata = { title: "Sign in" };

/* Apple-flavored sign-in: one frosted card, centered, over a soft petrol
   glow. Same tokens as the rest of the app — glass stays on this one
   floating functional layer. */
export default async function LoginPage() {
  if (await currentUser()) redirect("/dashboard");
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <main className="relative grid flex-1 place-items-center px-6 py-16">
        <div className="glow" style={{ left: "50%", top: "-30%", translate: "-50% 0" }} />
        <div className="dotgrid absolute inset-0" />
        <div className="relative w-full max-w-sm">
          <div className="rise text-center">
            <span className="inline-block">
              <Wordmark size="lg" />
            </span>
          </div>
          <div
            className="rise rise-2 mt-6 rounded-[20px] border border-line p-7 shadow-lg"
            style={{
              background: "color-mix(in oklab, var(--surface) 78%, transparent)",
              backdropFilter: "blur(18px) saturate(1.5)",
              WebkitBackdropFilter: "blur(18px) saturate(1.5)",
            }}
          >
            <h1 className="font-display text-[22px] font-semibold tracking-[-0.02em]">
              Welcome to PlanckUi
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
              Collect testimonials and build widgets. No password — and the email
              can wait, or never come.
            </p>
            <div className="mt-6">
              <LoginForm />
            </div>
          </div>
          <p className="rise rise-3 mt-5 text-center text-xs text-ink-3">
            Just here for the blocks?{" "}
            <Link href="/blocks" className="text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)]">
              Copy them without an account
            </Link>
          </p>
        </div>
      </main>
      <footer className="relative px-6 pb-8 pt-4 text-center text-sm text-ink-3">
        <Link href="/" className="transition-colors hover:text-ink">
          Back to the site
        </Link>
      </footer>
    </div>
  );
}
