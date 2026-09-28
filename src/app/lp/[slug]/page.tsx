import { notFound } from "next/navigation";
import { LandingRenderer } from "@/components/landing-renderer";
import { LANDING_TEMPLATES } from "@/lib/landing-templates";

export function generateStaticParams() {
  return LANDING_TEMPLATES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = LANDING_TEMPLATES.find((x) => x.slug === slug);
  return { title: t ? `${t.brand} — landing page template · PlanckUi` : "Landing page" };
}

export default async function LandingTemplatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = LANDING_TEMPLATES.find((x) => x.slug === slug);
  if (!t) notFound();
  return <LandingRenderer t={t} />;
}
