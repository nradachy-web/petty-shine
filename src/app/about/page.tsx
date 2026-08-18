import type { Metadata } from "next";
import Link from "next/link";

import QuoteForm from "@/components/quote/QuoteForm";
import TrustBar from "@/components/sections/TrustBar";
import PhoneLink from "@/components/tracking/PhoneLink";
import {
  Breadcrumbs,
  Button,
  Plate,
  Section,
  SectionHead,
} from "@/components/ui";
import { isBleedCleared } from "@/components/ui/Plate";
import { asset } from "@/lib/asset";
import {
  BRAND,
  CREDENTIALS,
  GTECHNIQ_FACTS,
  INTERIOR_PACKAGES,
  PPF_FILM,
  REVIEWS,
  REVIEW_SUMMARY,
  SERVICES,
} from "@/lib/constants";
import { PHOTOS } from "@/lib/photos";
import { spell } from "../areas/[city]/facts";

/* ============================================================================
   THE ONE PAGE WITHOUT A TABLE ON IT.

   Everywhere else on this site the sourced fact voice is IBM Plex Mono and
   the facts arrive as ruled key and value rows. Not here. The design rules
   reserve mono for prices, spec values, warranty terms and citations, and
   say plainly that it never sets the About page, so there is not a single
   KeyValueRow below and every sentence is Archivo. The phone number is the
   one exception, and it is a number read off a source, not a sentence.

   What is left has to carry itself on evidence. What this page is allowed to
   say is bounded hard by _plan/RECON.md: no founding year, no years in
   business, no family language, and nothing whatsoever about the road this
   shop happens to sit on. So the page is built out of the four things that
   are actually proven: the photographs, the two manufacturer directories
   that list him, the conditions those manufacturers publish, and the reviews
   that use his name.

   SECOND PASS. Nick's review called About the thinnest page on the site and
   said the credentials belong here prominently. Three things changed:

     1. It opens on a full bleed photograph with the trust row on its bottom
        edge, which is the bar the reference sites set. The old opening was a
        paper band with an h1 in the left column and nothing under it, which
        left roughly 300px of empty sheet on desktop.
     2. The credentials are a split panel meeting on a hard vertical edge,
        one dark and one paper, each carrying one maker and each linking into
        that maker's own directory. That link is the whole argument.
     3. A new band states how a job actually runs, out of facts that exist:
        the vehicle is looked at before it is quoted, the number goes in
        writing before work starts, and there is no published turnaround
        because an honest one cannot be written before anyone has seen it.

   FIRST NAME is derived rather than typed, because BRAND.owner is the spine.
   ========================================================================== */

const FIRST_NAME = BRAND.owner.split(" ")[0];

const GTECHNIQ = CREDENTIALS.find((c) => c.id === "gtechniq")!;
const STEK = CREDENTIALS.find((c) => c.id === "stek")!;

/** Link labels describing where each citation points. */
const SOURCE_LABEL: Record<string, string> = {
  gtechniq: "Look him up in Gtechniq's detailer directory",
  stek: "Look him up in STEK USA's installer directory",
};

/** The service page each credential is the argument for. */
const CREDENTIAL_PAGE: Record<string, { href: string; label: string }> = {
  gtechniq: { href: "/ceramic-coating/", label: "What is in each coating tier" },
  stek: {
    href: "/paint-protection-film/",
    label: "What each film coverage level covers",
  },
};

/** The one extra sentence each credential earns, straight out of the spine. */
const CREDENTIAL_NOTE: Record<string, string> = {
  gtechniq: GTECHNIQ_FACTS.proOnly,
  stek: `The film is ${PPF_FILM.brand} ${PPF_FILM.product}. We do not publish a warranty term for it, because ${PPF_FILM.brand}'s own two websites do not agree on one, and a warranty this shop cannot back is worth nothing to you.`,
};

/** The reviews that use his name, pulled from the spine rather than chosen. */
const BY_NAME = REVIEWS.filter((r) => r.text.includes(FIRST_NAME));

/**
 * The eyebrow. Two items and no more: at 1440 a four service eyebrow ran to
 * two lines and opened the page on a typo shaped hole, which is the same
 * trap the home hero's comment records. The full service list is one
 * paragraph below it in plain text, so nothing is lost.
 */
const EYEBROW = `${SERVICES[0].name} · ${BRAND.city}, ${BRAND.stateName}`;

/**
 * HIS OWN MUSTANG UNDER HIS OWN BANNER.
 *
 * The home hero is coating-huracan, so this page takes a different frame on
 * purpose, and it takes one with the shop banner physically in it: the
 * wordmark, the swoosh, and RESTORE PROTECT RESTYLE MAINTAIN, which is the
 * taxonomy this whole site is laid out on. A domestic muscle car also says
 * more about who walks in here than a second exotic would.
 *
 * It is one of the eight ids Plate clears for full bleed, asserted below
 * against the same exported predicate the primitive uses.
 */
const HERO_PHOTO = "detail-mustang-red" as const;

if (process.env.NODE_ENV !== "production" && !isBleedCleared(HERO_PHOTO)) {
  // eslint-disable-next-line no-console
  console.warn(
    `[about] ${HERO_PHOTO} is not in BLEED_CLEARED, so it has no 1600px ` +
      `rendition and must not run full bleed. See _plan/DESIGN.md rule 5.`
  );
}

export const metadata: Metadata = {
  title: "About the Shop",
  /* 156 characters. The old one ran to 144 and spent a third of them on the
     street address, which the trust row and the footer both already carry. */
  description: `${BRAND.owner} owns and runs ${BRAND.name} in ${BRAND.city}, ${BRAND.stateName}. ${CREDENTIALS[0].label} and ${CREDENTIALS[1].label}, listed in both directories.`,
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  const meta = PHOTOS[HERO_PHOTO];
  const widest = meta.sizes[meta.sizes.length - 1];
  const srcSet = (ext: "avif" | "webp") =>
    meta.sizes
      .map((w) => `${asset(`/photos/${HERO_PHOTO}-${w}.${ext}`)} ${w}w`)
      .join(", ");

  return (
    <>
      {/* The crumb sits ABOVE the hero, on the shop plane, the way it does
          on every other photographic hero page. Below the hero it landed
          between the trust row and the first section as a stray paper
          strip, and it was the only page on the site that read that way. */}
      <Breadcrumbs plane="shop" trail={[{ label: "About", href: "/about/" }]} />

      {/* ---------------------------------------------------------------
          THE HERO. Same construction as the home hero: full bleed
          photograph, one flat tonal overlay, letterspaced eyebrow, one
          display h1, one solid action and one outline action, trust row
          riding the bottom edge. No gradient, no vignette, no curve.
          --------------------------------------------------------------- */}
      <section
        className="hero plane-shop"
        aria-label={`About ${BRAND.name}, ${BRAND.city}, ${BRAND.stateName}`}
      >
        <picture className="hero__media">
          <source type="image/avif" srcSet={srcSet("avif")} sizes="100vw" />
          <source type="image/webp" srcSet={srcSet("webp")} sizes="100vw" />
          {/* Empty alt on purpose. The photograph is the hero's ground, the
              heading beside it says what the page is, and the same frame is
              described in full on the gallery. */}
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
              {BRAND.owner} runs this shop.
            </h1>

            <div className="hero__prose">
              <p>
                {BRAND.name} is an auto detailing shop at {BRAND.street} in{" "}
                {BRAND.city}, {BRAND.stateName}. It does detailing, paint
                correction, ceramic coating, paint protection film, window
                tinting and dent repair, in one building, on one address.
              </p>
              <p>
                Two manufacturers list it by name in their own installer
                directories. Those listings are theirs, not ours, and you can
                read both of them before you call anybody.
              </p>
            </div>

            <div className="hero__actions">
              {/* The one solid cyan button on this screen. Asking for a
                  vehicle and a service is a smaller step than booking a job,
                  so it is the primary action here as it is everywhere. */}
              <Button href="/quote/" tone="cyan">
                Get a price
              </Button>
              <PhoneLink placement="about-hero" className="ps-btn ps-btn--ghost">
                Call {BRAND.phoneDisplay}
              </PhoneLink>
            </div>
          </div>
        </div>

        <TrustBar plane="none" className="hero__trust" />
      </section>

      {/* ---------------------------------------------------------------
          THE CREDENTIALS. A split panel meeting on a hard vertical edge,
          one dark and one paper, each carrying one maker.
          --------------------------------------------------------------- */}
      <Section
        plane="sheet"
        width="full"
        rhythm="flush"
        ariaLabel="The two manufacturer credentials"
      >
        <div className="grid min-w-0 lg:grid-cols-2">
          {[GTECHNIQ, STEK].map((credential, i) => {
            const page = CREDENTIAL_PAGE[credential.id];
            return (
              <div
                key={credential.id}
                className={[
                  "min-w-0 px-5 py-14 sm:px-8 md:py-20 lg:px-14",
                  i === 0
                    ? "plane-shop bg-shop-000 text-spec-000"
                    : "plane-sheet bg-sheet-000 text-ink-600",
                ].join(" ")}
              >
                <div className="min-w-0 max-w-xl lg:mx-auto">
                  <p
                    className={[
                      "font-mono text-[0.6875rem] uppercase tracking-[0.22em]",
                      i === 0 ? "text-ink-300" : "text-ink-400",
                    ].join(" ")}
                  >
                    Verified in their directory
                  </p>
                  <span
                    className="mt-5 block h-px w-6 bg-cyan-500"
                    aria-hidden
                  />

                  <h2
                    className={[
                      "ps-display ps-display-md mt-6",
                      i === 0 ? "text-spec-000" : "text-ink-900",
                    ].join(" ")}
                  >
                    {credential.label}
                  </h2>

                  <div className="ps-prose mt-5">
                    <p>{credential.body}</p>
                    <p>{CREDENTIAL_NOTE[credential.id]}</p>
                  </div>

                  <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-4">
                    <a
                      href={credential.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ps-btn ps-btn--ghost ps-btn--sm"
                    >
                      {SOURCE_LABEL[credential.id]}
                    </a>
                    <Link href={page.href} className="link-inline text-[0.9375rem]">
                      {page.label}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ---------------------------------------------------------------
          HOW A JOB RUNS. Built only out of things that are true and
          sourced. There is no turnaround time here because nothing in any
          source supports one, and the absence is stated rather than filled.
          --------------------------------------------------------------- */}
      <Section plane="sheet" label="How a job runs">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="Looked at first, quoted second."
              intro={
                <p>
                  Most shops answer a price question with a phone number.
                  This one tells you what it can tell you up front, says
                  which part depends on the vehicle, and puts the number in
                  writing before anyone touches the car.
                </p>
              }
            />
            <div className="mt-8">
              <Button href="/pricing/" tone="ghost" size="sm">
                What drives the number
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <div className="border-t border-rule-light">
              {[
                {
                  h: "The vehicle gets looked at before it gets a number.",
                  p: "Size and the condition of the paint are what move a price, and neither can be read off a make and model. So the quote comes after the walkthrough, and it is a real number rather than a range.",
                },
                {
                  h: "The number goes to you in writing before work starts.",
                  p: "Nothing gets added to it in the bay. If something turns up under the dirt that changes the job, the conversation happens before the work does, not on the invoice at pickup.",
                },
                {
                  h: "There is no published turnaround time, on purpose.",
                  p: "A maintenance detail and a full correction under a ceramic coating are not the same week of work. An honest turnaround cannot be written before anyone has seen the vehicle, so it is confirmed when the vehicle is booked, at the same time as the price.",
                },
                {
                  h: "The interior comes with the exterior.",
                  p: `${INTERIOR_PACKAGES[0].name} is included with every exterior detailing service, so the inside of the car is not a separate conversation you find out about later.`,
                },
              ].map((row) => (
                <div key={row.h} className="border-b border-rule-light py-7">
                  <h3 className="ps-heading text-[1.0625rem] text-ink-900 sm:text-xl">
                    {row.h}
                  </h3>
                  <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-600">
                    {row.p}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------
          WHAT COMES THROUGH THE DOOR.
          --------------------------------------------------------------- */}
      <Section plane="shop" label="The shop">
        <SectionHead
          size="md"
          align="split"
          className="md:items-start"
          title="What comes through the door."
          intro={
            <p>
              A McLaren GT, a lifted F-250, a Jeep on 37s, a 1965 Mustang and a
              boat on its trailer are all in the photographs on this site.
              Nothing about the process changes with the badge on the hood.
            </p>
          }
        />

        <div className="mt-8">
          <Plate
            id="coating-huracan"
            caption="The shop, with the Gtechniq banner on the right"
            bleed
          />
        </div>

        <div className="mt-8 grid min-w-0 grid-cols-2 items-start gap-x-4 gap-y-7 sm:gap-5">
          <Plate
            id="wheels-mustang"
            caption="Mustang, wheels off"
            sizes="(min-width: 1240px) 36rem, 45vw"
          />
          <Plate
            id="detail-f250-black"
            caption="F-250 Super Duty, corrected"
            sizes="(min-width: 1240px) 36rem, 45vw"
          />
        </div>

        <div className="mt-9 flex flex-wrap gap-3">
          <Button href="/gallery/" tone="ghost">
            See all of it
          </Button>
          <Button href="/services/" tone="ghost">
            Everything the shop does
          </Button>
        </div>
      </Section>

      {/* ---------------------------------------------------------------
          THE REVIEWS THAT USE HIS NAME. Social proof sitting directly
          above the decision point rather than parked on /reviews/.
          --------------------------------------------------------------- */}
      <Section plane="sheet" label="In their words">
        <SectionHead
          size="md"
          align="split"
          className="md:items-start"
          title="The reviews use his name."
          intro={
            <p>
              {BY_NAME.length} of the {REVIEWS.length} reviews quoted on this
              site name {FIRST_NAME} rather than the shop. They are below, in
              full, with the spelling and the punctuation left as written. The
              profile they came off shows {REVIEW_SUMMARY.rating} from{" "}
              {REVIEW_SUMMARY.count} {REVIEW_SUMMARY.source} reviews.
            </p>
          }
        />

        <div className="mt-8 min-w-0 border-b border-rule-light">
          {BY_NAME.map((review) => (
            <figure
              key={review.name}
              className="grid min-w-0 gap-4 border-t border-rule-light py-8 md:grid-cols-12 md:gap-10 md:py-10"
            >
              <figcaption className="min-w-0 md:col-span-4">
                <span className="block h-px w-6 bg-cyan-500" aria-hidden />
                {/* No mono anywhere in this page's copy, including here. The
                    service tag that /reviews/ carries beside each quote is
                    deliberately dropped. */}
                <span className="ps-heading mt-4 block text-lg text-ink-900">
                  {review.name}
                </span>
              </figcaption>

              <blockquote className="min-w-0 md:col-span-8">
                <p className="max-w-2xl text-[1.0625rem] leading-relaxed text-ink-600">
                  {review.text}
                </p>
              </blockquote>
            </figure>
          ))}
        </div>

        <div className="mt-8">
          <Button href="/reviews/" tone="ghost">
            All {spell(REVIEWS.length)} reviews, in full
          </Button>
        </div>
      </Section>

      <Section plane="sheet" label="Next step">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="Bring it by."
              intro={
                <p>
                  The shop is at {BRAND.addressLine}, open {BRAND.hoursShort}.
                  Call and talk it through, or send the year, make and model
                  through the form and we will come back with a number for it.
                </p>
              }
            />

            <PhoneLink
              placement="about-page"
              className="mt-8 flex min-w-0 items-center justify-between gap-4 border border-rule-light bg-sheet-060 px-5 py-5 transition-colors hover:border-cyan-500"
            >
              <span className="min-w-0">
                <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-400">
                  Call the shop
                </span>
                <span className="mt-1 block font-mono text-2xl tabular-nums text-ink-900">
                  {BRAND.phoneDisplay}
                </span>
              </span>
              <span className="h-px w-6 flex-none bg-cyan-500" aria-hidden />
            </PhoneLink>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={BRAND.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ps-btn ps-btn--ghost ps-btn--sm"
              >
                Open in Google Maps
              </a>
              <Button href="/areas/" tone="ghost" size="sm">
                Drive times by town
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <QuoteForm
              heading="Get a price for your vehicle"
              intro="It goes straight to the shop. Year, make, model and what you want done is enough to start."
              source="/about/"
              id="quote-form"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
