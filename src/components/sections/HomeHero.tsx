import PhoneLink from "@/components/tracking/PhoneLink";
import { Button } from "@/components/ui";
import { isBleedCleared } from "@/components/ui/Plate";
import TrustBar from "@/components/sections/TrustBar";
import { asset } from "@/lib/asset";
import { PHOTOS } from "@/lib/photos";
import { BRAND, SERVICES } from "@/lib/constants";
import { cn } from "@/lib/utils";

/* ============================================================================
   THE HOME HERO

   Built to the reference bar Nick set: vassolaw.com, top-choicedetailing.com,
   midwesttintdetail.com. What all three actually do, and what this does:

     full bleed photograph, one flat tonal overlay, a small letterspaced
     eyebrow, one large confident display heading, one solid action and one
     outline action, and a hairline trust row on the bottom edge.

   THE PHOTOGRAPH is coating-huracan: his own Huracan, under his own shop
   banner, with the Gtechniq Crystal Serum Ultra display standing against the
   wall at the right edge. It is one of the eight ids cleared for full bleed
   in Plate.tsx, and it is the only photograph on the page that should carry
   priority. The frame argues the whole page before a word is read: the cars
   he works on, the brand as it physically exists in the building, and the
   credential, all in one exposure.

   WHY THE PICTURE IS HAND ROLLED RATHER THAN A <Plate>. Plate is the image
   primitive for content, and it is right for content: it owns the bleed
   policy, the frame, the caption and the aspect box. A hero background is a
   different job. It has to fill a box whose height is set by the copy inside
   it, at every width, which means no aspect-ratio and object-fit: cover on an
   absolutely positioned image. Plate writes aspectRatio as an inline style,
   which nothing can beat without !important. So this file emits the same
   <picture> Plate would, from the same registry, and asserts the bleed policy
   against the same exported predicate in development. Nothing here can drift
   from the registry: every width, the intrinsic size and the alt text are
   read out of PHOTOS.

   THE HEADLINE IS NOT ABOUT PRICE ANY MORE. The first pass ran "The prices
   are on the website." DIRECTION-V2 section 1 takes pricing off the site, so
   the wedge is now the credential, which is stronger anyway. Crystal Serum
   Ultra is professional application only and Gtechniq voids the guarantee if
   a shop that is not accredited applies it, so the nine year coating is a
   thing a customer physically cannot buy from most shops around here. Four
   headlines were written and rendered at 390 and 1440 before this one was
   picked:

     "Not every shop is allowed to do this work."
     "Check the credential before you hand over the keys."
     "The coating most shops are not allowed to apply."
     "Some of this work is not open to every shop."

   The first won. It is one sentence of the owner's own claim, it is true and
   checkable in two manufacturer directories, it survives being lifted out of
   the layout by an assistant answering "who does ceramic coating near
   Randleman", and it is not a slogan swapped in for a slogan. The second
   tested as an instruction to the reader rather than a statement about the
   shop and read colder at 76px. The third narrowed the whole page to coating
   when "car detailing near me" is his highest volume term. The fourth was
   the same sentence as the first, said more weakly.

   THE OVERLAY IS FLAT. One rgba fill at one opacity across the whole frame,
   never a gradient. DIRECTION-V2 section 2 forbids curves, blobs, glows and
   soft gradients, and a scrim that fades out is the single most common tell
   of a template hero.
   ========================================================================== */

const HERO_PHOTO = "coating-huracan" as const;

if (process.env.NODE_ENV !== "production" && !isBleedCleared(HERO_PHOTO)) {
  // eslint-disable-next-line no-console
  console.warn(
    `[HomeHero] ${HERO_PHOTO} is not in BLEED_CLEARED, so it has no 1600px ` +
      `rendition and must not run full bleed. See _plan/DESIGN.md rule 5.`
  );
}

/** The eyebrow reads out of SERVICES so it can never name a service the site
    does not sell. The reference ends its eyebrow on the town; this one does
    not, because with the town appended it runs to two lines at 1440 and
    orphans "NC" onto its own line. The town is on the trust row 300px below
    it and in the first sentence of the paragraph, so nothing is lost. */
const EYEBROW = ["auto-detailing", "ceramic-coating", "paint-protection-film"]
  .map((id) => SERVICES.find((s) => s.id === id)!.name)
  .join(" · ");

export interface HomeHeroProps {
  id?: string;
  className?: string;
}

export default function HomeHero({ id, className }: HomeHeroProps) {
  const meta = PHOTOS[HERO_PHOTO];
  const widest = meta.sizes[meta.sizes.length - 1];
  const srcSet = (ext: "avif" | "webp") =>
    meta.sizes
      .map((w) => `${asset(`/photos/${HERO_PHOTO}-${w}.${ext}`)} ${w}w`)
      .join(", ");

  return (
    <section
      id={id}
      className={cn("hero plane-shop", className)}
      aria-label={`${BRAND.name}, ${BRAND.city}, ${BRAND.stateName}`}
    >
      <picture className="hero__media">
        <source type="image/avif" srcSet={srcSet("avif")} sizes="100vw" />
        <source type="image/webp" srcSet={srcSet("webp")} sizes="100vw" />
        {/* alt is empty on purpose. The photograph is the hero's ground, the
            heading beside it already says what the shop is, and the same
            frame is described in full on the gallery. A second description
            of the same picture read out over the h1 is noise. */}
        <img
          src={asset(`/photos/${HERO_PHOTO}-${widest}.webp`)}
          width={meta.w}
          height={meta.h}
          alt=""
          loading="eager"
          decoding="sync"
          fetchPriority="high"
        />
      </picture>
      <div className="hero__scrim" aria-hidden="true" />

      <div className="hero__body container-site">
        <div className="hero__copy">
          <p className="hero__eyebrow">{EYEBROW}</p>

          <h1 className="ps-display ps-display-xl hero__title">
            Not every shop is <span className="hero__hl">allowed</span> to do
            this work.
          </h1>

          <div className="hero__prose">
            <p>
              Auto detailing, ceramic coating, paint protection film, window
              tint and dent repair, in {BRAND.city}, {BRAND.stateName}.
            </p>
            <p>
              Gtechniq only lets an accredited detailer apply Crystal Serum
              Ultra, and STEK lists this shop in its own installer directory.
              Both are worth checking before you book anywhere.
            </p>
          </div>

          <div className="hero__actions">
            {/* The one solid cyan button on this screen. Asking for a vehicle
                and a service is a smaller step than booking a job, so it is
                the primary action here and on every page. */}
            <Button href="/quote/" tone="cyan">
              Get a price
            </Button>
            <PhoneLink placement="home-hero" className="ps-btn ps-btn--ghost">
              Call {BRAND.phoneDisplay}
            </PhoneLink>
          </div>
        </div>
      </div>

      {/* The bar rides the bottom edge of the photograph, over the shop floor,
          the way the reference does. plane="none" so it takes its rule and
          text colours from this section rather than painting its own ground
          over the picture. */}
      <TrustBar plane="none" className="hero__trust" />
    </section>
  );
}

export { HomeHero };
