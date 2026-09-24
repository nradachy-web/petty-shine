import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ServiceLanding, { townMetadata } from "@/components/landing/ServiceLanding";
import { CITIES } from "@/lib/constants";
import { LANDING_TRACKS, trackById } from "@/lib/landing";

/**
 * THE SERVICE BY TOWN PAGES, /{service}/{town}/
 *
 * Six paid services times the sixteen measured towns. Every page is composed
 * from the service's landing record and the town's measured facts, so none
 * of the ninety six is written by hand and none can say something the two
 * sources do not. The static routes (/ceramic-coating/, /about/ and so on)
 * win over this dynamic segment, and dynamicParams is off so nothing outside
 * the two lists can ever render.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return LANDING_TRACKS.flatMap((t) => CITIES.map((c) => ({ service: t.slug, city: c.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string; city: string }>;
}): Promise<Metadata> {
  const { service, city } = await params;
  const t = trackById(service);
  const c = CITIES.find((x) => x.slug === city);
  if (!t || !c) return {};
  return townMetadata(t, c);
}

export default async function ServiceTownPage({
  params,
}: {
  params: Promise<{ service: string; city: string }>;
}) {
  const { service, city } = await params;
  const t = trackById(service);
  const c = CITIES.find((x) => x.slug === city);
  if (!t || !c) notFound();
  return <ServiceLanding track={t} city={c} />;
}
