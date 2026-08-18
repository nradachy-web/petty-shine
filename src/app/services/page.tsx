import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ServiceGrid from "@/components/sections/ServiceGrid";
import { ProcessPanel } from "@/components/sections/Proof";
import CTABand from "@/components/sections/CTABand";

export const metadata: Metadata = {
  title: "Services, Tint, PPF, Ceramic Coating, Correction & Detailing",
  description:
    "Everything HD Auto Studio does in Whitmore Lake, MI: LLumar window tint, GeoShield paint protection film, System X ceramic coatings, paint correction, detailing, and architectural window film.",
  alternates: { canonical: "/services/" },
};

export default function ServicesPage() {
  return (
    <>
      <Breadcrumbs trail={[{ label: "Services", href: "/services/" }]} />

      <PageHero
        eyebrow="What we do"
        title={
          <>
            Six services,
            <br />
            one controlled shop
          </>
        }
        sub="Film, coatings, correction, and detailing, all performed in-house at 10170 Industrial Drive. Every one of them has a published starting price on this site."
        photo="tint-silverado-blue"
        compact
      />

      <ServiceGrid
        eyebrow="The menu"
        title="Pick the one that matches the problem."
        intro="Heat and glare is tint. Rock chips is film. Gloss and easy washing is a coating. Swirls is correction. Everything inside the car is detailing."
      />

      <ProcessPanel />

      <CTABand />
    </>
  );
}
