import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Gallery from "@/components/sections/Gallery";
import CTABand from "@/components/sections/CTABand";
import { SEO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Photo Gallery, Real Cars From Our Whitmore Lake Bay",
  description: SEO.gallery.description,
  alternates: { canonical: "/gallery/" },
};

export default function GalleryPage() {
  return (
    <>
      <Breadcrumbs trail={[{ label: "Our Work", href: "/gallery/" }]} />

      <PageHero
        eyebrow="The work"
        title={
          <>
            Every car here
            <br />
            was done here
          </>
        }
        sub="Daily drivers, crew cabs, classics, and the occasional Bentley, tint, paint protection film, ceramic coatings, correction, and the interiors nobody else wanted to touch. No stock photography anywhere on this site."
        photo="coating-bentayga-side"
        compact
      />

      <Gallery title="Filter by service" eyebrow="Gallery" />

      <CTABand
        title="Want yours in here?"
        body="Send the vehicle and what you're after. We'll price it from the published rates and tell you the next opening."
      />
    </>
  );
}
