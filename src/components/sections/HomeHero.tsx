import LandingHero from "@/components/landing/LandingHero";
import { BRAND, SERVICES } from "@/lib/constants";

/* ============================================================================
   THE HOME HERO

   Rebuilt 2026-09-23 on the shared LandingHero, so the home page and the
   hundred and two landing pages carry one hero implementation and one set of
   LCP tuning.

   THE HEADLINE. The first pass ran "Not every shop is allowed to do this
   work." Judson did not like it, and the line he does like is "protect your
   investment", which is also what every service on this site is actually
   for. So that is the headline, with the paragraph doing the specific work:
   what the shop does, where it is, and the two credentials a visitor can
   check in a manufacturer's own directory.

   THE PHOTOGRAPH is coating-huracan: his own Huracan, under his own shop
   banner, with the Crystal Serum Ultra display against the wall.
   ========================================================================== */

const HERO_PHOTO = "coating-huracan" as const;

/** Reads out of SERVICES so it can never name a service the site does not sell. */
const EYEBROW = ["ceramic-coating", "paint-protection-film", "auto-detailing"]
  .map((id) => SERVICES.find((s) => s.id === id)!.name)
  .join(" · ");

export default function HomeHero() {
  return (
    <LandingHero
      photo={HERO_PHOTO}
      eyebrow={EYEBROW}
      title="Protect your *investment*."
      lead={
        <>
          <p>
            Ceramic coating, paint protection film, paint correction and detailing in {BRAND.city},{" "}
            {BRAND.stateName}. Gtechniq accredited, STEK authorized, and a free quote for your vehicle in about a minute.
          </p>
        </>
      }
      ctaLabel="Get a Free Quote"
      ctaHref="#quote"
      phonePlacement="home-hero"
      ariaLabel={`${BRAND.name}, ${BRAND.city}, ${BRAND.stateName}`}
      phoneDisplay={BRAND.phoneDisplay}
    />
  );
}

export { HomeHero };
