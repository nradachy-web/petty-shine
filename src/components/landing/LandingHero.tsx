import type { CSSProperties, ReactNode } from "react";

import PhoneLink from "@/components/tracking/PhoneLink";
import TrustBar from "@/components/sections/TrustBar";
import { Button } from "@/components/ui";
import { isBleedCleared } from "@/components/ui/Plate";
import { asset } from "@/lib/asset";
import { PHOTOS, type PhotoId } from "@/lib/photos";

/* ============================================================================
   THE HERO, one implementation for every page that has one.

   Full bleed photograph, the directional scrim from globals.css, mono
   eyebrow, one display heading with one cyan word, one short paragraph, one
   solid button and one outline call link, and the trust row on the bottom
   edge. Home, the six service hubs and the ninety six town pages all render
   this, so the LCP tuning below happens in exactly one place.

   WHY THE PICTURE IS SPLIT BY VIEWPORT. On a phone the box is portrait and
   the 4:3 frame is cropped to about a third of its width, so an 800px
   rendition is already more pixels than the screen shows. Serving that one
   file under 768px caps the largest download on the page at roughly 35KB
   regardless of the phone's pixel ratio. Above 768px the normal width
   descriptors take over. A preload link per branch, with the same media
   query, lets the browser start the right file before it has parsed the
   <picture>.
   ========================================================================== */

/* Phones get a portrait cut of the same frame, made by scripts/process-photos.py's
   companion step, at 720px wide: sharper than the 35% slice a landscape
   file gives a portrait box, and about 30KB. */
const MOBILE_W = 720;
const MOBILE_SUFFIX = "m720";
const WIDE_W = [1024, 1600] as const;
const MOBILE_MQ = "(max-width: 767px)";
const WIDE_MQ = "(min-width: 768px)";

function src(id: PhotoId, w: number, ext: "avif" | "webp") {
  return asset(`/photos/${id}-${w}.${ext}`);
}

/** "Protect your *investment*." renders the starred word in cyan. */
export function emphasise(text: string): ReactNode[] {
  return text.split(/\*([^*]+)\*/).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="hero__hl">
        {part}
      </span>
    ) : (
      part
    )
  );
}

export interface LandingHeroProps {
  photo: PhotoId;
  /** object-position, "x% y%". */
  focus?: string;
  eyebrow: string;
  /** May carry one *emphasised* word. */
  title: string;
  lead: ReactNode;
  ctaLabel: string;
  ctaHref?: string;
  /** xl for the home page, lg for a service title that runs long. */
  size?: "xl" | "lg";
  phonePlacement: string;
  ariaLabel: string;
  phoneDisplay: string;
}

export default function LandingHero({
  photo,
  focus,
  eyebrow,
  title,
  lead,
  ctaLabel,
  ctaHref = "#quote",
  size = "xl",
  phonePlacement,
  ariaLabel,
  phoneDisplay,
}: LandingHeroProps) {
  const meta = PHOTOS[photo];
  const sizes: readonly number[] = meta.sizes;
  const wide = WIDE_W.filter((w) => sizes.includes(w));
  const mobileSrc = (ext: "avif" | "webp") => asset(`/photos/${photo}-${MOBILE_SUFFIX}.${ext}`);
  const mobileW = MOBILE_W;
  const wideSet = (ext: "avif" | "webp") => wide.map((w) => `${src(photo, w, ext)} ${w}w`).join(", ");

  if (process.env.NODE_ENV !== "production" && !isBleedCleared(photo)) {
    // eslint-disable-next-line no-console
    console.warn(`[LandingHero] ${photo} is not in BLEED_CLEARED and must not run full bleed.`);
  }

  return (
    <section
      className="hero plane-shop"
      style={focus ? ({ "--hero-focus": focus } as CSSProperties) : undefined}
      aria-label={ariaLabel}
    >
      {/* React hoists these into <head>. One per media branch, so a phone
          never fetches the desktop candidates and vice versa. */}
      <link
        rel="preload"
        as="image"
        type="image/avif"
        href={mobileSrc("avif")}
        media={MOBILE_MQ}
        fetchPriority="high"
      />
      {wide.length > 0 ? (
        <link
          rel="preload"
          as="image"
          type="image/avif"
          imageSrcSet={wideSet("avif")}
          imageSizes="100vw"
          media={WIDE_MQ}
            fetchPriority="high"
        />
      ) : null}

      <picture className="hero__media">
        <source type="image/avif" media={MOBILE_MQ} srcSet={mobileSrc("avif")} />
        <source type="image/webp" media={MOBILE_MQ} srcSet={mobileSrc("webp")} />
        {wide.length > 0 ? (
          <>
            <source type="image/avif" srcSet={wideSet("avif")} sizes="100vw" />
            <source type="image/webp" srcSet={wideSet("webp")} sizes="100vw" />
          </>
        ) : null}
        {/* alt is empty on purpose: the photograph is the ground and the
            heading beside it says what the page is. */}
        <img
          src={src(photo, wide[0] ?? mobileW, "webp")}
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
          <p className="hero__eyebrow">{eyebrow}</p>
          <h1 className={`ps-display ps-display-${size} hero__title`}>{emphasise(title)}</h1>
          <div className="hero__prose">{typeof lead === "string" ? <p>{lead}</p> : lead}</div>
          <div className="hero__actions">
            <Button href={ctaHref} tone="cyan">
              {ctaLabel}
            </Button>
            <PhoneLink placement={phonePlacement} className="ps-btn ps-btn--ghost">
              Call {phoneDisplay}
            </PhoneLink>
          </div>
        </div>
      </div>

      <TrustBar plane="none" className="hero__trust" />
    </section>
  );
}

export { LandingHero };
