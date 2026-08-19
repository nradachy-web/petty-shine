import type { Metadata } from "next";
import Link from "next/link";

import QuoteForm from "@/components/quote/QuoteForm";
import ServiceSchema from "@/components/seo/ServiceSchema";
import PhoneLink from "@/components/tracking/PhoneLink";
import CTABand from "@/components/sections/CTABand";
import TrustBar from "@/components/sections/TrustBar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import KeyValueRow, { KeyValueList } from "@/components/ui/KeyValueRow";
import Plate from "@/components/ui/Plate";
import { PriceOrQuote } from "@/components/ui/PriceFigure";
import Section, { SectionHead } from "@/components/ui/Section";
import {
  BRAND,
  MARINE_EXTRAS,
  MARINE_PACKAGES,
  NEAREST_EXIT,
  priceIsPublic,
  REVIEWS,
  SERVICES,
} from "@/lib/constants";
import { milesLong } from "@/lib/utils";

/* ============================================================================
   /marine-detailing/

   Boats are the one service on this site where almost nobody local publishes
   anything at all, so the page's job is to be findable and to be honest about
   what it can say. His published price list names three marine levels and
   never says what is inside them, so this page does not either. It says what
   the number is made of instead, which is the thing a boat owner is actually
   trying to work out.

   PRICING IS PRIVATE. The first pass typed a dollar figure straight into the
   meta description and passed a price into the Service schema. Both are gone.
   ========================================================================== */

const SERVICE = SERVICES.find((s) => s.id === "marine-detailing")!;
const LOWEST = MARINE_PACKAGES[0];

/** The one review that names the whole run, quote to final inspection.
    Verbatim from REVIEWS, with its real service label. */
const REVIEW = REVIEWS.find((r) => r.name === "Scott Fischer")!;

/** The page's pitch is that a boat is priced off the boat, so no quote
    slot on it may read "vehicle". One wording, used everywhere here. */
const BOAT_QUOTE_LABEL = "Quoted on your boat";

/** Schema may only carry a price the site is allowed to print. */
const SCHEMA_PRICE = priceIsPublic() ? LOWEST.fromPrice : undefined;

/** What a marine number is actually made of. Nothing here is invented: each
    line is a variable we can see, written as a plain sentence. */
const DRIVERS = [
  {
    k: "The length of the boat",
    v: "It is the first thing we ask, because it sets the hours before anything else does.",
  },
  {
    k: "What the hull has been through",
    v: "How much of the job is cleaning and how much is correction comes off the condition of the hull, not off the level you picked.",
  },
  {
    k: "The interior",
    v: "Marine interior work is priced on its own and sits on top of an exterior level rather than replacing it.",
  },
  {
    k: "Coating",
    v: "Marine ceramic coating is priced on its own too, and it goes on after the exterior work.",
  },
];

/* 155 characters. */
const DESCRIPTION =
  `Boat detailing at ${BRAND.name} in ${BRAND.city}, ${BRAND.state}. ` +
  `Three marine levels, marine interior work and marine ceramic coating, ` +
  `quoted on your boat. On your trailer.`;

export const metadata: Metadata = {
  title: `Boat Detailing in ${BRAND.city}, ${BRAND.state}`,
  description: DESCRIPTION,
  alternates: { canonical: "/marine-detailing/" },
};

export default function MarineDetailingPage() {
  return (
    <>
      <ServiceSchema
        name="Boat and Marine Detailing"
        description={`Boat detailing, marine interior cleaning and marine ceramic coating at ${BRAND.name}, ${BRAND.addressLine}, done at the shop with the boat on its trailer.`}
        url={SERVICE.href}
        price={SCHEMA_PRICE}
        serviceType="Boat detailing"
      />

      <Breadcrumbs
        plane="sheet"
        trail={[{ label: SERVICE.name, href: SERVICE.href }]}
      />

      <Section plane="sheet" label={`${SERVICE.index} ${SERVICE.name}`}>
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-7">
            <h1 className="ps-display ps-display-xl">
              Boat detailing in {BRAND.city}
            </h1>

            <div className="ps-prose mt-6">
              <p>
                Petty Shine details boats at {BRAND.street} in {BRAND.city},{" "}
                {BRAND.stateName}, {milesLong(NEAREST_EXIT.miles)} off{" "}
                {NEAREST_EXIT.label}. The boat stays on its own trailer for the
                whole job, so hitch it up and bring it to the shop.
              </p>
              <p>
                Marine detailing runs in {MARINE_PACKAGES.length} levels, and
                marine interior work and marine ceramic coating are priced
                separately from them. Which level a boat needs is decided on
                the boat.
              </p>
              <p>
                Nothing about the work needs the water, and you get the number
                in writing before any of it starts.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="#quote" tone="cyan">
                Tell us about the boat
              </Button>
              <PhoneLink placement="marine-hero" className="ps-btn ps-btn--ghost">
                Call {BRAND.phoneDisplay}
              </PhoneLink>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-5">
            <KeyValueList label="Marine detailing at a glance">
              <KeyValueRow k="Levels" v={MARINE_PACKAGES.length} />
              <KeyValueRow
                k="Price"
                v={
                  <PriceOrQuote
                    service={SERVICE.quoteKey}
                    value={LOWEST.fromPrice}
                    quoteLabel={BOAT_QUOTE_LABEL}
                  />
                }
                strong
              />
              <KeyValueRow
                k="Where"
                v="At the shop, on your trailer"
                mono={false}
              />
              <KeyValueRow k="Shop" v={BRAND.addressLine} />
              <KeyValueRow k="Hours" v={BRAND.hoursShort} />
            </KeyValueList>
            {/* The bordered phone panel used to sit here too, which put
                the number on this screen twice. It lives in the quote
                section now; the ghost button beside the headline is the
                hero's one way to call. */}
          </div>
        </div>
      </Section>

      {/* The trust row sits tight under the hero, the way it does on the
          other service pages and the way the reference site runs it. The
          negative margin pulls it up out of the section gap, because a
          full gap above it turns a trust row into a floating band. */}
      <TrustBar plane="sheet" className="-mt-6 md:-mt-10" />

      <Section plane="shop" label="On the trailer">
        {/* items-center, not items-end. The photograph is nearly twice
            the height of this copy block, and bottom aligning a short
            column against a tall one banks all the empty space above the
            heading, which reads as a mistake rather than as a decision. */}
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              title="It comes to us the way it goes to the ramp."
              intro={
                <p>
                  The boat in the photograph came in behind a truck and left
                  the same way. The whole job happens under the lights on
                  Branson Mill Road.
                </p>
              }
            />
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button href="/contact/" tone="ghost" size="sm">
                Directions to the shop
              </Button>
              <Button href="/gallery/" tone="ghost" size="sm">
                See more of the work
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <Plate
              id="marine-boat-trailer"
              priority
              caption="Center console on the trailer, after a marine detail"
              sizes="(min-width: 1024px) 40rem, 100vw"
            />
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------
          What the number is made of, then the levels themselves. His
          published list names the levels and never says what is in them,
          so neither does this page.
          --------------------------------------------------------------- */}
      <Section plane="sheet" label="How a boat is quoted" id="levels">
        <SectionHead
          align="split"
          title="A boat is priced off the boat."
          intro={
            <p>
              A small runabout and a big center console at the same level are
              not the same job, and pretending otherwise on a web page is how a
              quote ends up wrong. Tell us the boat and we will say which level
              it needs and what that covers on yours.
            </p>
          }
        />

        {/* Two even columns, so the record on the right no longer runs
            440px past the bottom of the column beside it. */}
        <div className="mt-9 grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14 md:mt-11">
          <div className="min-w-0 lg:col-span-6">
            <h3 className="ps-heading text-lg">What moves the number</h3>
            <KeyValueList className="mt-5" label="What moves a marine price">
              {DRIVERS.map((row) => (
                <KeyValueRow key={row.k} k={row.k} v={row.v} mono={false} />
              ))}
            </KeyValueList>

            <div className="mt-9">
              <Button href="/pricing/" tone="ghost" size="sm">
                How we quote everything else
              </Button>
            </div>

            {/* One photograph in the back half, so the levels do not
                read as a wall of text. The registry has exactly one
                marine photo and it already ran full in the section
                above, so this is a wide crop of it: a different
                framing reads as a second moment, not a copy. It also
                squares this column against the two lists beside it. */}
            <Plate
              id="marine-boat-trailer"
              ratio="21 / 9"
              caption="The same center console, on the trailer it arrived on"
              sizes="(min-width: 1024px) 34rem, 100vw"
              className="mt-10"
            />
          </div>

          <div className="min-w-0 lg:col-span-6">
            <h3 className="ps-heading text-lg">
              Marine detailing levels
            </h3>
            <KeyValueList className="mt-5" label="Marine detailing levels">
              {MARINE_PACKAGES.map((p) => (
                <KeyValueRow
                  key={p.id}
                  k={p.name}
                  v={
                    <PriceOrQuote
                      service={SERVICE.quoteKey}
                      value={p.fromPrice}
                      quoteLabel={
                        <>
                          {BOAT_QUOTE_LABEL}
                          <span className="sr-only">
                            , marine {p.name.toLowerCase()}
                          </span>
                        </>
                      }
                    />
                  }
                />
              ))}
            </KeyValueList>

            <h3 className="ps-heading mt-10 text-lg">
              Marine interior and coating
            </h3>
            <KeyValueList className="mt-5" label="Marine interior and coating">
              {MARINE_EXTRAS.map((extra) => (
                <KeyValueRow
                  key={extra.key}
                  k={extra.key}
                  v={
                    <PriceOrQuote
                      service={SERVICE.quoteKey}
                      value={extra.value}
                      quoteLabel={
                        <>
                          {BOAT_QUOTE_LABEL}
                          <span className="sr-only">
                            , marine {extra.key.toLowerCase()}
                          </span>
                        </>
                      }
                    />
                  }
                />
              ))}
            </KeyValueList>

            <p className="mt-5 max-w-xl text-[0.9375rem] leading-relaxed text-ink-600">
              Interior and coating price on top of a level rather than
              replacing it.
            </p>
          </div>
        </div>

        <CTABand
          variant="line"
          className="mt-11"
          service={SERVICE.quoteKey}
          ctaLabel="Get the boat quoted"
          body="Make, model and length is enough to start, and a line about the shape the hull is in gets the first number closer."
        />
      </Section>

      {/* ---------------------------------------------------------------
          One primary action, one solid cyan button: the form submit.
          A real review sits beside it, because the decision point is
          the place proof is worth anything, and the phone panel from
          the hero lives down here now so each screen carries the
          number once.
          --------------------------------------------------------------- */}
      <Section plane="shop" label="Get a price" id="quote">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="Tell us the boat."
              intro={
                <p>
                  Make and model go in the fields. The length, and the shape
                  the hull is in, go in the message, because those are what
                  move the number.
                </p>
              }
            />

            <div className="ps-prose mt-6">
              <p>
                If the boat is due a wash and a coat rather than a full detail,
                say that too. The same shop does{" "}
                <Link href="/ceramic-coating/" className="link-inline">
                  ceramic coating on vehicles
                </Link>{" "}
                and{" "}
                <Link href="/auto-detailing/" className="link-inline">
                  car detailing in {BRAND.city}
                </Link>
                , and plenty of boats arrive behind something that could use
                both.
              </p>
            </div>

            {/* Social proof at the decision point rather than parked on
                a reviews page. Verbatim and attributed, and the service
                it names is read off the review record so it cannot be
                mislabelled. */}
            <blockquote className="mt-8 min-w-0 border-t border-rule-dark pt-7">
              <span aria-hidden className="block h-px w-6 bg-cyan-500" />
              <p className="mt-5 text-[1.0625rem] leading-relaxed text-spec-000">
                {REVIEW.text}
              </p>
              <footer className="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-1 font-mono text-[0.6875rem] uppercase tracking-[0.18em]">
                <span className="text-spec-000">{REVIEW.name}</span>
                <span className="text-ink-300">{REVIEW.service}</span>
                <a
                  href={BRAND.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap-24 text-cyan-300 underline underline-offset-4"
                >
                  Read it on Google
                </a>
              </footer>
            </blockquote>

            <PhoneLink
              placement="marine-quote"
              className="mt-8 flex min-w-0 items-center justify-between gap-4 border border-rule-dark bg-shop-060 px-5 py-5 transition-colors hover:border-cyan-500"
            >
              <span className="min-w-0">
                <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-300">
                  Or call the shop
                </span>
                <span className="mt-1 block font-mono text-2xl tabular-nums text-spec-000">
                  {BRAND.phoneDisplay}
                </span>
              </span>
              <span className="h-px w-6 flex-none bg-cyan-500" aria-hidden />
            </PhoneLink>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <QuoteForm
              service={SERVICE.quoteKey}
              lockService
              subject="boat"
              heading="Get the boat quoted"
              intro="It goes straight to the shop. The more you put here, the closer the first number is."
              source="/marine-detailing/"
              id="quote-form"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
