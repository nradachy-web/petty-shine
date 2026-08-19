import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import QuoteForm from "@/components/quote/QuoteForm";
import ServiceSchema from "@/components/seo/ServiceSchema";
import PhoneLink from "@/components/tracking/PhoneLink";
import CTABand from "@/components/sections/CTABand";
import TownChips from "@/components/sections/TownChips";
import TrustBar from "@/components/sections/TrustBar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import KeyValueRow, { KeyValueList } from "@/components/ui/KeyValueRow";
import Plate, { isBleedCleared } from "@/components/ui/Plate";
import { PriceOrQuote } from "@/components/ui/PriceFigure";
import Section, { SectionHead } from "@/components/ui/Section";
import { asset } from "@/lib/asset";
import { PHOTOS } from "@/lib/photos";
import {
  BRAND,
  NEAREST_EXIT,
  QUOTE_CTA_LABEL,
  REVIEWS,
  SERVICES,
} from "@/lib/constants";
import { milesLong } from "@/lib/utils";

/* ============================================================================
   /wheel-repair/

   Nothing here has ever had a published price, so this page has always been
   quote only and private pricing mode changes nothing about it. What it did
   need is the thing every quote only page needs: a reason to believe the
   quote will be fair, given in substance rather than in adjectives. That is
   what the two record blocks below do. They say what the three jobs actually
   are and what will change the answer, before anybody is asked for a phone
   number.

   This pass also gives the page the same full bleed hero the other money
   pages open with. It was the one service page still opening as bare text,
   which read as a lesser page rather than as a quieter one.
   ========================================================================== */

const SERVICE = SERVICES.find((s) => s.id === "wheel-repair")!;

/** The three jobs he lists under this heading. No published price on any of them. */
const WORK = [
  {
    k: "Curbed wheel repair",
    v: "The scraped face is repaired and refinished, then blended back to the rest of the wheel.",
  },
  {
    k: "Wheel refinishing",
    v: "The finish itself is redone. A color change lives here, and that is normally a set of four rather than one.",
  },
  {
    k: "Brake caliper refinishing",
    v: "Calipers cleaned back and refinished while the wheels are already off the car.",
  },
];

const BEFORE = [
  {
    k: "Bent or cracked wheels",
    v: "That is structural rather than cosmetic. Tell us what happened and we will look at it before anything is scheduled.",
  },
  {
    k: "One wheel or all four",
    v: "A single repair is finished to match the other three as closely as the finish allows. A color change is a set.",
  },
  {
    k: "The car stays here",
    v: "Wheels come off for this work, so plan on leaving the vehicle with us rather than waiting on it.",
  },
];

/** What actually moves the number, so the absence of a price reads as
    honesty rather than as a hidden one. */
const DRIVERS = [
  {
    k: "How far the rash goes",
    v: "A light scuff on the outer lip and damage that has taken material off the face are different amounts of work.",
  },
  {
    k: "What the finish started as",
    v: "Painted, machined, polished and powder coated wheels do not all refinish the same way, and the original finish is what the repair has to match.",
  },
  {
    k: "One wheel or a set",
    v: "Matching one repair into three untouched wheels is a different job from taking all four to the same new finish.",
  },
];

/* The review that names the quoting and the scheduling, which is the exact
   promise a quote only page asks a stranger to take on faith. Selected on
   the review's own text so it cannot drift to a different one. */
const PROCESS_REVIEW =
  REVIEWS.find((r) => r.text.includes("quoting and scheduling")) ?? REVIEWS[0];

/* 156 characters. */
const DESCRIPTION =
  `Curbed wheel repair, wheel refinishing and brake caliper refinishing at ` +
  `${BRAND.name} in ${BRAND.city}, ${BRAND.state}. Tell us what the wheel ` +
  `looks like and we price it.`;

export const metadata: Metadata = {
  title: `Curbed Wheel Repair in ${BRAND.city}, ${BRAND.state}`,
  description: DESCRIPTION,
  alternates: { canonical: "/wheel-repair/" },
};

/* ---------------------------------------------------------------------------
   THE HERO

   The shared .hero block from globals.css, the way the sibling money pages
   open: full bleed frame, one flat tonal overlay, letterspaced eyebrow, one
   display heading, one solid action and one outline action, trust row on
   the bottom edge.

   THE PHOTOGRAPH is the Mustang standing with all four wheels off, which is
   the single fact this page most needs a stranger to believe: the wheels
   come off the car here. It is cleared for full bleed in Plate.tsx.
   --hero-focus keeps the open arches low in the crop.
   ------------------------------------------------------------------------- */
const HERO_PHOTO = "wheels-mustang" as const;

if (process.env.NODE_ENV !== "production" && !isBleedCleared(HERO_PHOTO)) {
  // eslint-disable-next-line no-console
  console.warn(
    `[wheel-repair] ${HERO_PHOTO} is not in BLEED_CLEARED and must not run full bleed.`
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
      style={{ "--hero-focus": "50% 56%" } as CSSProperties}
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
          <p className="hero__eyebrow">
            {SERVICE.name} · {BRAND.city}, {BRAND.state}
          </p>

          <h1 className="ps-display ps-display-lg hero__title">
            Curbed wheel repair in {BRAND.city}
          </h1>

          <div className="hero__prose">
            <p>
              Petty Shine repairs curbed wheels at {BRAND.street} in{" "}
              {BRAND.city}, {BRAND.stateName},{" "}
              {milesLong(NEAREST_EXIT.miles)} off {NEAREST_EXIT.label}. Curb
              rash gets repaired and refinished so the face of the wheel reads
              clean again, and while the wheels are off, the calipers behind
              them can be refinished at the same time.
            </p>
            <p>
              Nothing here has a published price. One scuffed face and four
              wheels going to a new color are not the same job, so we look at
              the wheels before we put a number on them, and the number goes
              to you in writing before any work starts.
            </p>
          </div>

          <div className="hero__actions">
            {/* The one solid action on this screen. */}
            <Button href="#quote" tone="cyan">
              Send us the wheel
            </Button>
            <PhoneLink
              placement="wheel-repair-hero"
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

export default function WheelRepairPage() {
  return (
    <>
      <ServiceSchema
        name={SERVICE.name}
        description={`Curbed wheel repair, wheel refinishing and brake caliper refinishing at ${BRAND.name}, ${BRAND.addressLine}, done with the wheels off the vehicle.`}
        url={SERVICE.href}
        serviceType="Wheel Repair"
      />

      <Breadcrumbs
        plane="shop"
        trail={[{ label: SERVICE.name, href: SERVICE.href }]}
      />

      <Hero />

      {/* The Mustang moved up into the hero, so this band runs the black
          F-250 instead of printing the same photograph twice on one page.
          The caption stays honest to what the photo is: finished paint on
          the shop floor, not a wheel in progress. No priority flag, because
          this plate now sits a full hero below the fold. */}
      <Section plane="shop" label="Wheels off">
        <SectionHead
          align="split"
          title="The wheels come off the car."
          intro={
            <p>
              A curbed face is repaired properly with the wheel off and the
              barrel clean. It is also the only time the inside of the wheel
              and the caliper behind it are both reachable.
            </p>
          }
        />
        <div className="mt-9 md:mt-11">
          <Plate
            id="detail-f250-black"
            bleed
            caption={`Black F-250 on the shop floor, ${BRAND.city}`}
          />
        </div>
      </Section>

      {/* Three record blocks split across two columns rather than stacked
          in one. Stacked, the left column ran out of copy roughly 480px
          above the bottom of the right one, which is exactly the dead
          vertical space DIRECTION-V2 section 3 calls out. */}
      <Section plane="sheet" label="The work">
        <SectionHead
          align="split"
          title="Three jobs, one set of wheels."
          intro={
            <p>
              All three need the wheel off the car, so they are worth deciding
              on together rather than one at a time. What each one costs turns
              on the wheel itself, which is the second list.
            </p>
          }
        />

        <div className="mt-9 grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14 md:mt-11">
          <div className="min-w-0 lg:col-span-6">
            <h3 className="ps-heading text-lg">Wheel and caliper work</h3>
            <KeyValueList className="mt-5" label="Wheel and caliper work">
              {WORK.map((row) => (
                <KeyValueRow key={row.k} k={row.k} v={row.v} mono={false} />
              ))}
            </KeyValueList>

            <h3 className="ps-heading mt-10 text-lg">Before you book</h3>
            <KeyValueList className="mt-5" label="Before you book">
              {BEFORE.map((row) => (
                <KeyValueRow
                  key={row.k}
                  k={row.k}
                  v={row.v}
                  mono={false}
                  tone="pewter"
                />
              ))}
            </KeyValueList>
          </div>

          <div className="min-w-0 lg:col-span-6">
            <h3 className="ps-heading text-lg">What moves the number</h3>
            <KeyValueList className="mt-5" label="What moves a wheel repair price">
              {DRIVERS.map((row) => (
                <KeyValueRow key={row.k} k={row.k} v={row.v} mono={false} />
              ))}
            </KeyValueList>

            <div className="ps-prose mt-9">
              <p>
                Wheel coating is a separate thing again. It is one of the
                add-ons on the{" "}
                <Link href="/ceramic-coating/" className="link-inline">
                  ceramic coating page
                </Link>
                , and it is worth asking about while the wheels are already
                off.
              </p>
              <p>
                If the paint is going to get attention at the same time, the{" "}
                <Link href="/auto-detailing/" className="link-inline">
                  detailing levels
                </Link>{" "}
                are the other half of that conversation, and{" "}
                <Link href="/pricing/" className="link-inline">
                  what it costs, and how we quote it
                </Link>{" "}
                covers how both get priced.
              </p>
            </div>

            {/* Social proof at the decision point, verbatim and attributed.
                This one praises the quoting and the scheduling, which is
                what a page with no published price has to prove. */}
            <blockquote className="mt-9 min-w-0 border-t border-rule-light pt-7">
              <span aria-hidden className="block h-px w-6 bg-cyan-500" />
              <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-900">
                {PROCESS_REVIEW.text}
              </p>
              <footer className="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-1 font-mono text-[0.6875rem] uppercase tracking-[0.18em]">
                <span className="text-ink-900">{PROCESS_REVIEW.name}</span>
                <span className="text-ink-400">{PROCESS_REVIEW.service}</span>
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
          className="mt-11"
          service={SERVICE.quoteKey}
          ctaLabel={QUOTE_CTA_LABEL}
          body="A photo of the wheel in the message answers most of this in one go."
        />
      </Section>

      {/* ---------------------------------------------------------------
          One primary action, one solid cyan button: the form submit. The
          at a glance list that used to ride beside the old text hero
          lives here now, next to the form the facts support.
          --------------------------------------------------------------- */}
      <Section plane="shop" label="Get a price" id="quote">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="Tell us what the wheel looks like."
              intro={
                <p>
                  How far the rash goes, whether it is one wheel or the set,
                  and what finish the wheel started as. That is enough to come
                  back with a number.
                </p>
              }
            />

            <div className="mt-8">
              <PhoneLink
                placement="wheel-repair-quote"
                className="ps-btn ps-btn--ghost"
              >
                Call {BRAND.phoneDisplay}
              </PhoneLink>
            </div>

            <KeyValueList className="mt-8" label="Wheel repair at a glance">
              <KeyValueRow
                k="Price"
                v={<PriceOrQuote service={SERVICE.quoteKey} value={null} />}
                strong
              />
              <KeyValueRow
                k="Wheels"
                v="Off the vehicle for every job here"
                mono={false}
              />
              <KeyValueRow k="Shop" v={BRAND.addressLine} />
              <KeyValueRow k="Hours" v={BRAND.hoursShort} />
            </KeyValueList>

            {/* The towns the wheels actually come from, as real links into
                their own pages with the measured minutes on each chip. */}
            <p className="mt-9 font-mono text-[0.6875rem] uppercase leading-relaxed tracking-[0.2em] text-ink-300">
              Where the wheels come from, minutes measured from the shop door
            </p>
            <TownChips
              className="mt-4"
              slugs={["greensboro-nc", "high-point-nc", "asheboro-nc", "randleman-nc"]}
            />
          </div>

          <div className="min-w-0 lg:col-span-7">
            <QuoteForm
              service={SERVICE.quoteKey}
              lockService
              heading="Get the wheels quoted"
              intro="Year, make and model, then what happened to the wheel. It goes straight to the shop."
              source="/wheel-repair/"
              id="quote-form"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
