import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import CTABand from "@/components/sections/CTABand";
import TrustBar from "@/components/sections/TrustBar";
import QuoteForm from "@/components/quote/QuoteForm";
import ServiceSchema from "@/components/seo/ServiceSchema";
import PhoneLink from "@/components/tracking/PhoneLink";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import DatumRule from "@/components/ui/DatumRule";
import KeyValueRow, { KeyValueList } from "@/components/ui/KeyValueRow";
import Plate, { isBleedCleared } from "@/components/ui/Plate";
import { PriceOrQuote } from "@/components/ui/PriceFigure";
import RuleLabel from "@/components/ui/RuleLabel";
import Section, { PlanePanel, SectionHead } from "@/components/ui/Section";
import { asset } from "@/lib/asset";
import { PHOTOS, type PhotoId } from "@/lib/photos";
import {
  BRAND,
  CITIES,
  COATINGS,
  DETAIL_PACKAGES,
  REVIEWS,
  SERVICES,
} from "@/lib/constants";

const SERVICE = SERVICES.find((s) => s.id === "paint-correction")!;

/* DETAIL_PACKAGES is a const tuple, so Extract keeps the exact member type
   and the subtitle on each tier is typed rather than optional. Level 2 is the
   enhancement pass, Level 3 is true correction. */
type DetailPackage = (typeof DETAIL_PACKAGES)[number];
const LEVEL_2 = DETAIL_PACKAGES.find((p) => p.id === "level-2") as Extract<
  DetailPackage,
  { id: "level-2" }
>;
const LEVEL_3 = DETAIL_PACKAGES.find((p) => p.id === "level-3") as Extract<
  DetailPackage,
  { id: "level-3" }
>;

type Coating = (typeof COATINGS)[number];
const NINE = COATINGS.find((c) => c.id === "petty-shine-nine") as Extract<
  Coating,
  { id: "petty-shine-nine" }
>;

/* The one review that describes a finish rather than a coating. Selected on
   the review's own service field so it cannot end up quoting the wrong job. */
const FINISH_REVIEW =
  REVIEWS.find((r) => r.service === "Detailing" && r.text.length > 120) ??
  REVIEWS[0];

/* The towns in his own paid search terms, nearest first, every figure
   measured. Each one links to that town's page with a real anchor. */
const NEAR_TOWNS = ["greensboro-nc", "high-point-nc", "asheboro-nc", "randleman-nc"]
  .map((slug) => CITIES.find((c) => c.slug === slug)!)
  .sort((a, b) => a.minutes - b.minutes);

/* 159 characters, and no dollar figure. PRICING_MODE is private, and a meta
   description is one of the three places the audit checks for a leak. */
const DESCRIPTION = `Paint correction and machine buffing in ${BRAND.city}, ${BRAND.stateName}. Two levels. Swirls, scratches, water spots and oxidation cut out of the clear coat for good.`;

export const metadata: Metadata = {
  title: `${SERVICE.name} in ${BRAND.city}, ${BRAND.state}`,
  description: DESCRIPTION,
  alternates: { canonical: "/paint-correction/" },
};

/* Honest limits. Nothing here is a manufacturer claim, so nothing here needs
   a source: it is what the process can and cannot reach. */
const LIMITS = [
  "Correction works on damage that sits in the clear coat. A scratch deep enough to catch a fingernail in has gone through it, and polishing will not bring that back.",
  "Every pass takes a little clear coat with it, and clear coat does not grow back. We cut the least that will do the job, and on thin or resprayed panels we stop earlier and tell you why.",
  "A dent, a crease or a chip is a different repair. So is a panel that needs paint.",
  "Correction fixes what is on the car today. It does not stop the next round of swirls, which is what a coating and a proper wash routine are for.",
];

/* ---------------------------------------------------------------------------
   THE HERO

   The shared .hero block from globals.css, on this page's own photograph, so
   a service page opens the way the home page opens: full bleed frame, one
   flat tonal overlay, letterspaced eyebrow, one display heading, one solid
   action and one outline action, trust row on the bottom edge.

   THE PHOTOGRAPH is the black F-250 standing in the shop after correction,
   which is the argument this page makes: black paint is where a polish
   either holds a reflection or does not. It is cleared for full bleed in
   Plate.tsx. --hero-focus keeps the cab and the reflection in the crop.
   ------------------------------------------------------------------------- */
const HERO_PHOTO = "detail-f250-black" as const;

if (process.env.NODE_ENV !== "production" && !isBleedCleared(HERO_PHOTO)) {
  // eslint-disable-next-line no-console
  console.warn(
    `[paint-correction] ${HERO_PHOTO} is not in BLEED_CLEARED and must not run full bleed.`
  );
}

function Hero() {
  const meta = PHOTOS[HERO_PHOTO];
  const widest = meta.sizes[meta.sizes.length - 1];
  const srcSet = (ext: "avif" | "webp") =>
    meta.sizes
      .map((w) => `${asset(`/photos/${HERO_PHOTO}-${w}.${ext}`)} ${w}w`)
      .join(", ");

  return (
    <section
      className="hero plane-shop"
      style={{ "--hero-focus": "56% 50%" } as CSSProperties}
      aria-label={`${SERVICE.name} at ${BRAND.name}, ${BRAND.city}, ${BRAND.stateName}`}
    >
      <picture className="hero__media">
        <source type="image/avif" srcSet={srcSet("avif")} sizes="100vw" />
        <source type="image/webp" srcSet={srcSet("webp")} sizes="100vw" />
        {/* alt is empty on purpose: the photograph is the hero's ground and
            the heading beside it already says what this page is. */}
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
          {/* The town, not the state name: at 390 the long form wraps and
              orphans "Carolina" onto its own line. The full state name is in
              the first sentence of the paragraph below. */}
          <p className="hero__eyebrow">
            {SERVICE.name} · {BRAND.city}, {BRAND.state}
          </p>

          <h1 className="ps-display ps-display-lg hero__title">
            Paint correction. Most people call it buffing.
          </h1>

          <div className="hero__prose">
            <p>
              Paint correction in {BRAND.city}, {BRAND.stateName}. Swirls,
              scratches, water spots and oxidation sit in the clear coat. A
              machine polish cuts that clear coat back until the damage is level
              with it, then refines the surface until the gloss comes back up.
            </p>
            <p>
              It is also the step that decides what everything else is worth. A
              coating locks in whatever the paint looks like on the day it goes
              on, so the paint gets fixed first and protected second.
            </p>
          </div>

          <div className="hero__actions">
            {/* The one solid action on this screen. Describing the paint is a
                smaller step than booking a job. */}
            <Button href="#quote" tone="cyan">
              Get a price on your vehicle
            </Button>
            <PhoneLink
              placement="correction-hero"
              className="ps-btn ps-btn--ghost"
            >
              Call {BRAND.phoneDisplay}
            </PhoneLink>
          </div>
        </div>
      </div>

      <TrustBar plane="none" className="hero__trust" />
    </section>
  );
}

/* ---------------------------------------------------------------------------
   THE TWO LEVELS, as a split panel.

   DIRECTION-V2 section 3: split panels meeting on a hard vertical edge, one
   light and one dark, each carrying one idea. This page is the one place on
   the site where that device is the content rather than a decoration, because
   the whole decision is binary: an enhancement pass, or a true correction.

   The plane inversion is side by side rather than stacked, so the rule about
   never changing plane twice in one screen height still holds vertically.
   ------------------------------------------------------------------------- */
function LevelPanel({
  plane,
  tier,
  index,
  body,
  quoteLabel,
  photo,
}: {
  plane: "sheet" | "shop";
  /* The two tiers that carry a subtitle. Typed as the two members rather
     than as the union, because Maintenance Detail has no subtitle and the
     panel's heading is the subtitle. */
  tier: typeof LEVEL_2 | typeof LEVEL_3;
  index: number;
  body: string;
  /* Each level gets its own quote label. Two identical "Quoted on your
     vehicle" links side by side read as one repeated element, and the
     label is the last word each panel says. */
  quoteLabel: string;
  /* Optional proof photograph, framed, never bleed. Only the full
     correction panel carries one: the sheet panel stays text-only so the
     two planes keep their contrast. */
  photo?: { id: PhotoId; caption: string };
}) {
  return (
    <PlanePanel
      plane={plane}
      className="px-5 py-12 md:px-9 md:py-14 lg:px-12 lg:py-16"
    >
      <DatumRule label={`Level ${String(index).padStart(2, "0")}`} />

      <h3 className="ps-display ps-display-md mt-7">{tier.subtitle}</h3>

      <div className="ps-prose mt-4">
        <p>{tier.blurb}</p>
        <p>{body}</p>
      </div>

      {photo ? (
        <Plate
          id={photo.id}
          caption={photo.caption}
          className="mt-7 max-w-sm"
          sizes="(min-width: 1024px) 24rem, (min-width: 640px) 60vw, 100vw"
        />
      ) : null}

      <KeyValueList className="mt-7" label={`${tier.name} specification`}>
        <KeyValueRow k="Package" v={tier.name} />
        {/* Sentence-shaped value, so no mono: right-aligned mono is for
            figures, and this one is prose. */}
        <KeyValueRow
          k="Quoted on"
          v="Vehicle size and paint condition"
          mono={false}
        />
      </KeyValueList>

      <div className="mt-7">
        {/* No package key: the quote form ladders film coverage and coating
            tiers, and correction is not one of them, so a package param here
            would ride into a field that does not exist. */}
        <PriceOrQuote
          service={SERVICE.quoteKey}
          value={tier.fromPrice}
          size="lg"
          quoteLabel={quoteLabel}
        />
      </div>
    </PlanePanel>
  );
}

export default function PaintCorrectionPage() {
  return (
    <>
      {/* No `price` prop while PRICING_MODE is private: a number in an Offer
          node is a published price like any other. */}
      <ServiceSchema
        name={SERVICE.name}
        description={DESCRIPTION}
        url="/paint-correction/"
        serviceType="Automotive paint correction and machine polishing"
      />

      <Breadcrumbs
        plane="shop"
        trail={[{ label: SERVICE.name, href: SERVICE.href }]}
      />

      <Hero />

      {/* The header rides inside the full width band rather than in a
          section of its own, so the intro sits directly above the panels
          instead of leaving a dead strip between two sections. */}
      <Section plane="sheet" width="full" rhythm="flush">
        <div className="container-site pt-14 pb-6 md:pt-20 md:pb-8">
          <DatumRule label="Two levels" className="mb-8 md:mb-11" />
          <SectionHead
            title="How far do you want it taken."
            intro={
              <p>
                Both levels are machine polishing on the same paint. What
                changes is how many stages it takes, how much clear coat comes
                off, and how much of the damage goes with it.
              </p>
            }
          />
        </div>

        <div className="grid min-w-0 lg:grid-cols-2">
          <LevelPanel
            plane="sheet"
            tier={LEVEL_2}
            index={2}
            body="One polishing stage. The gloss comes up and the light defects go, which on most daily driven paint is the visible difference people are actually asking for."
            quoteLabel="Price the enhancement"
          />
          <LevelPanel
            plane="shop"
            tier={LEVEL_3}
            index={3}
            body="It takes more than one stage, and it removes the defect rather than filling or hiding it. It is also what the nine year coating starts with."
            quoteLabel="Price the full correction"
            photo={{
              id: "coating-supra",
              caption: "White Supra after paint correction",
            }}
          />
        </div>
      </Section>

      <Section plane="sheet" label="The test">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="Look at the edge of the reflection."
              intro={
                <p>
                  Swirled paint scatters light in every direction, so anything
                  reflected in it goes soft and grey at the edges. Corrected
                  paint holds the edge hard, and that is the whole test.
                </p>
              }
            />

            <div className="ps-prose mt-6">
              <p>
                Do it yourself on your own car before you call anyone. Find a
                straight line in the reflection, a door frame or a light bar,
                and see whether it stays crisp or falls apart. Every photograph
                on this page is a vehicle that came through the shop.
              </p>
            </div>

            <div className="mt-7">
              <Button href="/gallery/" tone="ghost" size="sm">
                More of the work, by vehicle
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <div className="grid min-w-0 gap-6 sm:grid-cols-2">
              <Plate
                id="correction-reflection"
                caption="Black paint holding a reflection"
                sizes="(min-width: 1024px) 20rem, (min-width: 640px) 45vw, 100vw"
              />
              <Plate
                id="correction-red-panel"
                caption="Red paint after machine polishing"
                sizes="(min-width: 1024px) 20rem, (min-width: 640px) 45vw, 100vw"
              />
            </div>

            {/* Social proof at the decision point, verbatim and attributed. */}
            <blockquote className="mt-9 min-w-0 border-t border-rule-light pt-7">
              <span aria-hidden className="block h-px w-6 bg-cyan-500" />
              <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-900">
                {FINISH_REVIEW.text}
              </p>
              <footer className="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-1 font-mono text-[0.6875rem] uppercase tracking-[0.18em]">
                <span className="text-ink-900">{FINISH_REVIEW.name}</span>
                <span className="text-ink-400">{FINISH_REVIEW.service}</span>
                <a
                  href={BRAND.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap-24 text-cyan-ink underline underline-offset-4"
                >
                  Read it on Google
                </a>
              </footer>
            </blockquote>
          </div>
        </div>

        <CTABand
          variant="line"
          service={SERVICE.quoteKey}
          ctaLabel="Get a price"
          body="Send the year, make and model with a note on what you can see in the paint in direct sun, and we will come back with a number in writing."
          className="mt-12"
        />
      </Section>

      <Section plane="shop" label="The limits">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="What a polish will not fix."
              intro={
                <p>
                  Correction has a hard boundary and it is better to hear it
                  before the car is booked in than after it is in the shop.
                </p>
              }
            />

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/paintless-dent-repair/" tone="ghost" size="sm">
                Dents and door dings
              </Button>
              <Button href="/paint-protection-film/" tone="ghost" size="sm">
                Chips and rock damage
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <ul className="min-w-0 border-t border-rule-dark">
              {LIMITS.map((limit) => (
                <li
                  key={limit}
                  className="flex min-w-0 gap-4 border-b border-rule-dark py-5"
                >
                  <span
                    className="mt-3 h-px w-3.5 flex-none bg-cyan-500"
                    aria-hidden
                  />
                  <span className="min-w-0 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-300">
                    {limit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* The handoff to the coating page is its own ruled row rather than a
            tail on the left column, which is what left a third of this band
            empty on the first pass. */}
        <DatumRule label="After the correction" className="mt-14 mb-8" />

        <div className="grid min-w-0 gap-9 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <h3 className="ps-display ps-display-md">
              The nine year coating starts here.
            </h3>

            <div className="ps-prose mt-4">
              <p>
                {NINE.name} is the only coating tier that begins with a full
                correction, which is why it is the one that carries a{" "}
                {NINE.guarantee} guarantee from Gtechniq. Correcting the paint
                and then leaving it unprotected is the version of this that
                costs you twice.
              </p>
            </div>

            <div className="mt-7">
              <Button href="/ceramic-coating/" tone="ghost" size="sm">
                The three ceramic coatings
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <KeyValueList label={`${NINE.name} prep`}>
              <KeyValueRow k="Coating" v={`${NINE.name}, ${NINE.subtitle}`} />
              <KeyValueRow k="Prep" v={NINE.includes[1]} mono={false} />
              <KeyValueRow k="Base coat" v={NINE.base} />
              <KeyValueRow k="Guarantee" v={`${NINE.guarantee}, issued by Gtechniq`} />
            </KeyValueList>
          </div>
        </div>
      </Section>

      <Section plane="sheet" label="Get a price" id="quote">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="Tell us what the paint looks like."
              intro={
                <p>
                  Color, age, whether it lives outside, and what you can see in
                  it in direct sun. That is usually enough to say which level it
                  needs before the car is here. You get the number in writing
                  before anything is scheduled.
                </p>
              }
            />

            <PhoneLink
              placement="correction-quote"
              className="mt-8 flex min-w-0 items-center justify-between gap-4 border border-rule-light bg-sheet-060 px-5 py-5 transition-colors hover:border-cyan-500"
            >
              <span className="min-w-0">
                <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-400">
                  Rather call
                </span>
                <span className="mt-1 block font-mono text-2xl tabular-nums text-ink-900">
                  {BRAND.phoneDisplay}
                </span>
              </span>
              <span className="h-px w-6 flex-none bg-cyan-500" aria-hidden />
            </PhoneLink>

            <KeyValueList className="mt-6" label="Shop">
              <KeyValueRow k="Address" v={BRAND.addressLine} />
              {BRAND.hours.map((h) => (
                <KeyValueRow key={h.days} k={h.days} v={h.time} />
              ))}
            </KeyValueList>

            <p className="mt-9">
              <RuleLabel>Where the cars come from</RuleLabel>
            </p>

            <KeyValueList className="mt-3" label="Drive times to the shop">
              {NEAR_TOWNS.map((town) => (
                <KeyValueRow
                  key={town.slug}
                  k={
                    <Link href={`/areas/${town.slug}/`} className="link-inline">
                      Paint correction in {town.name}
                    </Link>
                  }
                  v={`${town.minutes} min via ${town.route}`}
                />
              ))}
            </KeyValueList>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <QuoteForm
              service={SERVICE.quoteKey}
              lockService
              heading={null}
              intro={null}
              source="/paint-correction/"
              id="quote-form"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
