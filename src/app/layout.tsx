import type { Metadata } from "next";
import { Archivo, Golos_Text, Geist_Mono } from "next/font/google";
import "./globals.css";

/* Font selection followed impeccable's procedure:
   brand words "quiet, precise, dependable" → machined instrument signage /
   technical standards document. Reflex fonts (Inter, Geist Sans, Space Grotesk,
   DM Sans, Outfit, …) rejected. Archivo: sturdy engineered grotesque for display.
   Golos Text: calm, even, highly legible body face. */
const display = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Golos_Text({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const code = Geist_Mono({
  variable: "--font-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PlanckUi — 395+ free widgets for any website",
    template: "%s · PlanckUi",
  },
  description:
    "Collect and show testimonials, reviews, social feeds and more. 290+ free widgets for any website. No credit card. No limits. Just paste it.",
  verification: {
    google: "XIry2rPCBglFdAN7t-QK_NcjoK3Qb5TZdvdMILdn3CI",
  },
  metadataBase: new URL("https://plank-ui.design"),
};

const themeInit = `
try {
  var t = localStorage.getItem("plk-theme");
  if (t === "dark" || (!t && matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.documentElement.classList.add("dark");
  }
} catch (e) {}
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${code.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
