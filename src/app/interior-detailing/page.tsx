import type { Metadata } from "next";
import Link from "next/link";

import QuoteForm from "@/components/quote/QuoteForm";
import ServiceSchema from "@/components/seo/ServiceSchema";
import PhoneLink from "@/components/tracking/PhoneLink";
import CTABand from "@/components/sections/CTABand";
import TrustBar from "@/components/sections/TrustBar";
import {
  Breadcrumbs,
  Button,
  KeyValueList,
  KeyValueRow,
  Plate,
  PriceOrQuote,
  QuoteLink,
  Section,
  SectionHead,
} from "@/components/ui";
import {
  BRAND,
  INTERIOR_ADDONS,
  INTERIOR_PACKAGES,
  NEAREST_EXIT,
  priceIsPublic,
  QUOTE_CTA_LABEL,
  REVIEWS,
  SERVICES,
} from "@/lib/constants";
import { milesLong } from "@/lib/utils";

/* ============================================================================
   /interior-detailing/

   "interior car detailing near me" is a real term in his ad account, so this
   page has to answer it in its own right rather than as a footnote on the
   detailing page. Who, what and where are in the first hundred words as text.

   NO TRUST BAR HERE, on purpose. The bar's two credentials are a coating
   accreditation and a film installer listing, and neither of them says
   anything about leather or carpet. Running it on every page reflexively
   would turn a checkable claim into decoration. What this page carries at
   the decision point instead is a real attributed review and an honest
   statement of what an interior detail is not.

   PRICING IS PRIVATE. Every slot is <PriceOrQuote>, which renders the
   "Quoted on your vehicle" link and carries the service into the form.
   ========================================================================== */

const SERVICE = SERVICES.find((s) => s.id === "interior-detailing")!;

const LOWEST = INTERIOR_PACKAGES[0];

/** Schema may only carry a price the site is allowed to print. */
const SCHEMA_PRICE = priceIsPublic() ? LOWEST.fromPrice : undefined;

/** The one review of the five that names the inside of the car in the
    customer's own words. Steve Singleton's is real too but runs to one
    line, and a one line pull quote beside a full quote form reads as
    padding rather than as proof. */
const REVIEW = REVIEWS.find((r) => r.name === "Jacob Freeman")!;

/** What an interior detail is not, said before the money is discussed rather
    than after. Every line is a scope statement, not a warranty term. */
const SCOPE = [
  {
    k: "Cleaning is not repair",
    v: "A cracked dash, a tear in a seat or a burn in the upholstery is repair work rather than detailing. We will say so instead of quoting around it.",
  },
  {
    k: "Deep odor",
    v: "Odor sitting on the surfaces and odor that has soaked into the foam under them are two different problems. Say which one you have when you send the vehicle and the first number will be closer.",
  },
  {
    k: "Sun damaged leather",
    v: "Conditioning brings color and feel back a long way. It does not put back a hide that has gone hard and split, and no amount of product will.",
  },
];

/* 155 characters. */
const DESCRIPTION =
  `Interior car detailing in ${BRAND.city}, ${BRAND.stateName}. ` +
  `${INTERIOR_PACKAGES.length} levels, from a deep clean to leather and vinyl ` +
  `restoration. Quoted on your vehicle. Call ${BRAND.phoneDisplay}.`;

export const metadata: Metadata = {
  title: `Interior Car Detailing in ${BRAND.city}, ${BRAND.state}`,
  description: DESCRIPTION,
  alternates: { canonical: "/interior-detailing/" },
};

export default function InteriorDetailingPage() {
  return (
    <>
      <ServiceSchema
        name="Interior Car Detailing"
        description={`${INTERIOR_PACKAGES.length} levels of interior car detailing, from a deep clean to leather and vinyl restoration, at ${BRAND.name}, ${BRAND.addressLine}.`}
        url="/interior-detailing/"
        price={SCHEMA_PRICE}
        serviceType="Interior detailing"
      />

      <Breadcrumbs
        plane="sheet"
        trail={[{ label: SERVICE.name, href: SERVICE.href }]}
      />

      <Section plane="sheet" label={`${SERVICE.index} ${SERVICE.name}`}>
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-7">
            <h1 className="ps-display ps-display-xl">
              Interior detailing in {BRAND.city}
            </h1>

            <div className="ps-prose mt-6">
              <p>
                Petty Shine details car interiors at {BRAND.street} in{" "}
                {BRAND.city}, {BRAND.stateName},{" "}
                {milesLong(NEAREST_EXIT.miles)} off {NEAREST_EXIT.label}.
              </p>
              <p>
                Interior work runs in {INTERIOR_PACKAGES.length} levels. Level
                1 is a full clean. Level 2 conditions and protects the leather,
                plastic and vinyl on top of that clean. Level 3 takes those
                surfaces back toward new while sanitizing them, with an
                advanced process through the carpets and upholstery.
              </p>
              <p>
                A Level 1 interior is included with every exterior detail, so
                if you are already booking a detail you are not paying for the
                inside twice.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {/* The primary action, and it was missing. The hero ran two
                  ghost buttons, so the first solid thing on the page was the
                  submit inside the form near the foot of it. */}
              <Button href="#quote" tone="cyan">
                Get a price on your vehicle
              </Button>
              <Button href="#levels" tone="ghost">
                See the {INTERIOR_PACKAGES.length} levels
              </Button>
              <PhoneLink
                placement="interior-detailing-hero"
                className="ps-btn ps-btn--ghost"
              >
                Call {BRAND.phoneDisplay}
              </PhoneLink>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-5">
            <Plate
              id="interior-bmw-x5m"
              priority
              caption="X5 M, after an interior detail"
              sizes="(min-width: 1024px) 32rem, 100vw"
            />

            <KeyValueList className="mt-8" label="Interior at a glance">
              <KeyValueRow k="Levels" v={INTERIOR_PACKAGES.length} />
              <KeyValueRow
                k="Price"
                v={
                  <PriceOrQuote
                    service={SERVICE.quoteKey}
                    value={LOWEST.fromPrice}
                  />
                }
                strong
              />
              <KeyValueRow
                k="Included"
                v="Level 1 with every exterior detail"
                mono={false}
              />
              <KeyValueRow k="Shop" v={BRAND.addressLine} />
              <KeyValueRow k="Hours" v={BRAND.hoursShort} />
            </KeyValueList>
          </div>
        </div>
      </Section>

      {/* The trust row sits tight under the hero, the way it does on the
          other service pages and the way the reference site runs it. The
          negative margin pulls it up out of the section gap, because a
          full gap above it turns a trust row into a floating band. */}
      <TrustBar plane="sheet" className="-mt-6 md:-mt-10" />

      {/* ---------------------------------------------------------------
          Evidence. Leather and a dashboard, close enough to judge.
          --------------------------------------------------------------- */}
      <Section plane="shop" label="The surfaces">
        <SectionHead
          align="split"
          title="Leather, plastic, vinyl, glass, carpet."
          intro={
            <p>
              An interior is several different materials sitting against each
              other, and each one wants something different from the last.
              What separates the levels is how far each of those surfaces gets
              taken.
            </p>
          }
        />

        <div className="mt-9 grid min-w-0 gap-8 md:mt-11 md:grid-cols-2 md:gap-10">
          <Plate
            id="interior-bmw-door"
            ratio="4 / 3"
            caption="Door card and seat, conditioned"
            sizes="(min-width: 768px) 34rem, 100vw"
          />
          <Plate
            id="interior-mustang-dash"
            ratio="4 / 3"
            caption="Dash and wheel, cleaned"
            sizes="(min-width: 768px) 34rem, 100vw"
          />
        </div>
      </Section>

      {/* ---------------------------------------------------------------
          THE LADDER. Nothing prints a number, so every row ends in a
          tap target rather than in a blank.
          --------------------------------------------------------------- */}
      <Section plane="sheet" label="Levels" id="levels">
        <SectionHead
          title="What each level actually does."
          intro={
            <p>
              The levels stack, so each one carries the work below it. Pick by
              what the inside looks like now, and if you are not sure, describe
              it and we will tell you which level it needs.
            </p>
          }
        />

        <div className="mt-8 border-b border-rule-light md:mt-10">
          {INTERIOR_PACKAGES.map((pkg, i) => (
            <article
              key={pkg.id}
              id={pkg.id}
              className="min-w-0 border-t border-rule-light pt-6 pb-6 md:pt-7 md:pb-7"
            >
              <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <h3 className="ps-heading min-w-0 text-[1.3rem] md:text-[1.6rem]">
                  <span className="mr-3 font-mono text-[0.6875rem] tracking-[0.26em] text-ink-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {pkg.name}
                </h3>
                {/* The visible wording is QUOTE_CTA_LABEL, one wording
                    sitewide. The level name is appended for screen readers
                    only so three links on one page do not all announce
                    themselves identically. */}
                <PriceOrQuote
                  service={SERVICE.quoteKey}
                  value={pkg.fromPrice}
                  quoteLabel={
                    <>
                      {QUOTE_CTA_LABEL}
                      <span className="sr-only">, {pkg.name}</span>
                    </>
                  }
                />
              </div>

              <p className="ps-prose mt-3 max-w-2xl">{pkg.blurb}</p>
            </article>
          ))}
        </div>

        <div className="mt-11 grid min-w-0 gap-10 md:grid-cols-12 md:gap-14">
          <div className="min-w-0 md:col-span-5">
            <h2 className="ps-heading text-[1.3rem] md:text-[1.5rem]">
              Add-ons
            </h2>
            <div className="ps-prose mt-4">
              <p>
                These sit outside the levels because what they cost depends
                on what is actually in the vehicle. Either one can be added to
                any level.
              </p>
            </div>
          </div>

          <div className="min-w-0 md:col-span-7">
            <KeyValueList label="Interior add-ons">
              {INTERIOR_ADDONS.map((addon) => (
                <KeyValueRow
                  key={addon}
                  k={addon}
                  v={
                    <QuoteLink
                      service={SERVICE.quoteKey}
                      ariaLabel={`${QUOTE_CTA_LABEL}, ${addon}`}
                    />
                  }
                  tone="pewter"
                />
              ))}
            </KeyValueList>
          </div>
        </div>

        {/* ---- The one photograph inside the ladder. The levels run long
             as one text column, and a run that long needs a visual moment
             before the scope talk. The old-car copy rides with it because
             the photo is the proof of the sentence beside it. ---- */}
        <div className="mt-11 grid min-w-0 gap-10 md:grid-cols-12 md:items-end md:gap-14">
          <div className="min-w-0 md:col-span-7">
            <Plate
              id="interior-mustang-65"
              caption="1965 Mustang, interior detail"
              sizes="(min-width: 768px) 36rem, 100vw"
            />
          </div>
          <div className="min-w-0 md:col-span-5">
            <h2 className="ps-heading text-[1.3rem] md:text-[1.5rem]">
              Old cars too
            </h2>
            <div className="ps-prose mt-4">
              <p>
                An old interior and a new one are the same job with different
                tolerances. Both come off the same levels.
              </p>
            </div>
            <div className="mt-7">
              <Button href="/gallery/" tone="ghost" size="sm">
                See more of the work
              </Button>
            </div>
          </div>
        </div>

        {/* ---- What an interior detail is not. Said here, before the
             money, rather than at pickup. ---- */}
        <div className="mt-11 grid min-w-0 gap-10 md:grid-cols-12 md:gap-14">
          <div className="min-w-0 md:col-span-5">
            <h2 className="ps-heading text-[1.3rem] md:text-[1.5rem]">
              What a detail will not fix
            </h2>
            <div className="ps-prose mt-4">
              <p>
                A clean interior and a repaired one are different things, and
                the difference is worth knowing before anyone quotes you.
              </p>
            </div>
          </div>

          <div className="min-w-0 md:col-span-7">
            <KeyValueList label="The limits of an interior detail">
              {SCOPE.map((row) => (
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
        </div>

        <KeyValueList className="mt-11" label="Also true">
          <KeyValueRow
            k="Exterior"
            mono={false}
            v={
              <>
                Every exterior detail includes a Level 1 interior.{" "}
                <Link href="/auto-detailing/" className="link-inline">
                  Car detailing in {BRAND.city}
                </Link>
                .
              </>
            }
          />
          <KeyValueRow
            k="Coating"
            mono={false}
            v={
              <>
                Interior ceramic coating is offered as a coating add-on.{" "}
                <Link href="/ceramic-coating/" className="link-inline">
                  The three Gtechniq coating tiers
                </Link>
                .
              </>
            }
          />
          <KeyValueRow
            k="The number"
            mono={false}
            v={
              <>
                What moves an interior price, and what happens when you bring
                the vehicle in.{" "}
                <Link href="/pricing/" className="link-inline">
                  What it costs, and how we quote it
                </Link>
                .
              </>
            }
          />
        </KeyValueList>

        <CTABand
          variant="line"
          className="mt-10"
          service={SERVICE.quoteKey}
          ctaLabel="Get a price"
          body="Send the year, make and model and tell us what the inside looks like now."
        />
      </Section>

      {/* ---------------------------------------------------------------
          One primary action, one solid cyan button: the form submit.
          --------------------------------------------------------------- */}
      <Section plane="sheet" label="Get a price" id="quote">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              title="Tell us the vehicle."
              intro={
                <p>
                  Year, make and model, plus a line about what the inside looks
                  like now. Pets, smoke, spilled coffee and sun damaged leather
                  all change the answer, so say so and the first number will be
                  closer.
                </p>
              }
            />

            <figure className="mt-8 border-t border-rule-light pt-6">
              <blockquote className="ps-prose">
                <p>{REVIEW.text}</p>
              </blockquote>
              <figcaption className="mt-4 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-400">
                {REVIEW.name}
                <span aria-hidden="true"> · </span>
                {REVIEW.service}
                <span aria-hidden="true"> · </span>
                Google
              </figcaption>
            </figure>

            <PhoneLink
              placement="interior-detailing-panel"
              className="mt-8 flex min-w-0 items-center justify-between gap-4 border border-rule-light bg-sheet-060 px-5 py-5 transition-colors hover:border-cyan-500"
            >
              <span className="min-w-0">
                <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-400">
                  Or call the shop
                </span>
                <span className="mt-1 block font-mono text-2xl tabular-nums text-ink-900">
                  {BRAND.phoneDisplay}
                </span>
              </span>
              <span className="h-px w-6 flex-none bg-cyan-500" aria-hidden />
            </PhoneLink>

            <KeyValueList className="mt-8" label="Shop">
              <KeyValueRow k="Address" v={BRAND.addressLine} />
              {BRAND.hours.map((h) => (
                <KeyValueRow key={h.days} k={h.days} v={h.time} />
              ))}
            </KeyValueList>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <QuoteForm
              service={SERVICE.quoteKey}
              lockService
              heading="Send us the vehicle"
              intro="It goes straight to the shop. The more you put here, the closer the first number is."
              source="/interior-detailing/"
              id="quote-form"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
