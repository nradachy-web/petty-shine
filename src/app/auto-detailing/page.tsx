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
  RuleLabel,
  Section,
  SectionHead,
} from "@/components/ui";
import {
  BRAND,
  CITIES,
  DETAIL_PACKAGES,
  NEAREST_EXIT,
  priceIsPublic,
  QUOTE_CTA_LABEL,
  REVIEWS,
  SERVICES,
} from "@/lib/constants";
import { drive, milesLong } from "@/lib/utils";

/* ============================================================================
   /auto-detailing/

   THIS PAGE HAS TO OWN "car detailing near me". It is the highest volume real
   search term in his ad account, 31 clicks in 90 days, more than any other
   single term, and today it lands on a page his account never built for it.
   So the title, the h1 and the first sentence all say "car detailing" in the
   form people actually type it, and "auto detailing" appears in the same
   first paragraph because that is the name the rest of the site and his own
   Google Business Profile use. Both entities, once each, in the first hundred
   words, with the town and the state beside them.

   PRICING IS PRIVATE. Every slot goes through <PriceOrQuote>, which renders
   the tappable "Quoted on your vehicle" link instead of a number and carries
   the service into the form. Nothing on this page branches on the flag, and
   nothing on it says the levels are priced here any more, because they are
   not. The first pass opened "every one of them is priced further down this
   page", which is now a promise the page cannot keep.

   THE ONE SOLID CYAN BUTTON on this page is the quote form's submit. Every
   other action is a ghost button or a quote link.
   ========================================================================== */

const SERVICE = SERVICES.find((s) => s.id === "auto-detailing")!;

/** The published floor, read off the data rather than typed. In private
    mode it never prints, but it still drives the schema field below. */
const LOWEST = DETAIL_PACKAGES[0];

/** Schema may only carry a price the site is allowed to print. A component
    cannot cover a JSON-LD field, so this is the one place the flag is read
    directly, through the helper constants.ts exports for exactly this. */
const SCHEMA_PRICE = priceIsPublic() ? LOWEST.fromPrice : undefined;

/** The five towns his own search terms name, plus the two closest, so a
    "car detailing near me" search from any of them lands on a real page
    about that town rather than on a swapped name. */
const NEARBY = ["greensboro-nc", "high-point-nc", "asheboro-nc", "archdale-nc", "randleman-nc", "trinity-nc"]
  .map((slug) => CITIES.find((c) => c.slug === slug)!)
  .sort((a, b) => a.miles - b.miles);

/** Real, attributed, and about this exact service. Jacob Freeman's review
    is the other detailing one and it names the inside of the car, so it
    goes on /interior-detailing/ instead and neither page repeats the
    other. */
const REVIEW = REVIEWS.find((r) => r.name === "Landon Brown")!;

/* 156 characters. */
const DESCRIPTION =
  `Car detailing in ${BRAND.city}, ${BRAND.stateName}. ` +
  `${DETAIL_PACKAGES.length} levels, from a maintenance clean to paint ` +
  `correction. Quoted on your vehicle, in writing. Call ${BRAND.phoneDisplay}.`;

export const metadata: Metadata = {
  title: `Car Detailing in ${BRAND.city}, ${BRAND.state}`,
  description: DESCRIPTION,
  alternates: { canonical: "/auto-detailing/" },
};

/** `as const` gives each package its own literal type, so optional keys
 *  have to be read with `in` rather than assumed onto the union. */
function subtitleOf(pkg: (typeof DETAIL_PACKAGES)[number]): string | null {
  return "subtitle" in pkg ? pkg.subtitle : null;
}

export default function AutoDetailingPage() {
  return (
    <>
      <ServiceSchema
        name="Car Detailing"
        description={`${DETAIL_PACKAGES.length} levels of car detailing, from a maintenance clean to full paint correction, at ${BRAND.name}, ${BRAND.addressLine}.`}
        url="/auto-detailing/"
        price={SCHEMA_PRICE}
        serviceType="Auto detailing"
      />

      <Breadcrumbs
        plane="sheet"
        trail={[{ label: SERVICE.name, href: SERVICE.href }]}
      />

      {/* ---------------------------------------------------------------
          THE HERO. Who, what and where in the first hundred words, as
          real text, so an assistant answering "car detailing near
          Randleman" has a sentence it can lift whole.
          --------------------------------------------------------------- */}
      <Section plane="sheet" label={`${SERVICE.index} ${SERVICE.name}`}>
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-7">
            <h1 className="ps-display ps-display-xl">
              Car detailing in {BRAND.city}
            </h1>

            <div className="ps-prose mt-6">
              <p>
                Petty Shine is an auto detailing shop at {BRAND.street} in{" "}
                {BRAND.city}, {BRAND.stateName}, {milesLong(NEAREST_EXIT.miles)}{" "}
                off {NEAREST_EXIT.label}. Car detailing is the work that comes
                through the doors most.
              </p>
              <p>
                Exterior detailing runs in {DETAIL_PACKAGES.length} levels, and
                what separates them is what happens to the paint. The lower
                levels clean it and put protection on top. The higher ones cut
                and polish the defects out of it.
              </p>
              <p>
                Every level is quoted on the vehicle in front of us, and the
                number goes to you in writing before any work starts.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {/* The primary action, and it was missing. This is the page that
                  has to own "car detailing near me", and until the quote form
                  at the foot of it there was nothing solid on the page to
                  press: two ghost buttons and a scroll. Same two action hero
                  the other service pages run, pointed at the inline form. */}
              <Button href="#quote" tone="cyan">
                Get a price on your vehicle
              </Button>
              <Button href="#levels" tone="ghost">
                See the {DETAIL_PACKAGES.length} levels
              </Button>
              <PhoneLink
                placement="auto-detailing-hero"
                className="ps-btn ps-btn--ghost"
              >
                Call {BRAND.phoneDisplay}
              </PhoneLink>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-5">
            <Plate
              id="detail-mustang-red"
              priority
              caption="Finished, under the shop banner"
              sizes="(min-width: 1024px) 32rem, 100vw"
            />

            <KeyValueList className="mt-8" label="Detailing at a glance">
              <KeyValueRow k="Levels" v={DETAIL_PACKAGES.length} />
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
                k="Interior"
                v="Level 1 with every exterior detail"
                mono={false}
              />
              <KeyValueRow k="Shop" v={BRAND.addressLine} />
              <KeyValueRow k="Hours" v={BRAND.hoursShort} />
            </KeyValueList>
          </div>
        </div>
      </Section>

      {/* The hairline row the reference runs directly under its hero.
          Every value comes out of constants and both credentials link to
          the manufacturer's own directory, which is the argument.

          Pulled up into the hero section's bottom padding, because the
          reference runs it tight under the copy and a full section gap
          above it turns a trust row into a floating band. Nothing in
          .trustbar sets margin, so the utility is not fighting an
          unlayered rule. */}
      <TrustBar plane="sheet" className="-mt-6 md:-mt-10" />

      {/* ---------------------------------------------------------------
          Evidence, on the dark plane. What actually changes between the
          levels, next to the floor those levels happen on.
          --------------------------------------------------------------- */}
      <Section plane="shop" label="How the levels differ">
        <SectionHead
          align="split"
          title="It comes down to what happens to the paint."
          intro={
            <>
              <p>
                A maintenance detail is a full clean, door jambs included.
                Level 1 adds a wax or sealant on top of that clean. Level 2
                puts a machine polish on the paint and pulls the gloss back.
                Level 3 corrects the paint permanently.
              </p>
              <p>
                The Petty Shine sits above all of it and gets built around
                whatever that particular paint needs.
              </p>
            </>
          }
        />

        <div className="mt-9 md:mt-11">
          <Plate
            id="detail-jeep-orange"
            bleed
            caption="Any vehicle, same floor, same process"
          />
        </div>
      </Section>

      {/* ---------------------------------------------------------------
          THE LADDER. The reason this page exists. Nothing here prints a
          number, so every row ends in a tap target instead.
          --------------------------------------------------------------- */}
      <Section plane="sheet" label="Levels" id="levels">
        <SectionHead
          title="What each level actually does."
          intro={
            <p>
              The levels stack, so each one carries the work below it. Pick by
              what the paint looks like now rather than by name, and if you are
              not sure, say what you see and we will tell you which level it
              needs.
            </p>
          }
        />

        <div className="mt-8 border-b border-rule-light md:mt-10">
          {DETAIL_PACKAGES.map((pkg, i) => {
            const subtitle = subtitleOf(pkg);
            return (
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
                  {/* The row's one action. In private mode this is the
                      "Quoted on your vehicle" link, in public mode it is
                      the starting price. The page does not know which.

                      No `package` prop on purpose: QuoteForm's
                      PACKAGE_GROUPS only defines a ladder for ppf and
                      ceramic, so a detailing package id would ride into
                      the URL and then be dropped on the floor.

                      The visible wording stays QUOTE_CTA_LABEL, one
                      wording sitewide, and the level name is appended
                      for screen readers only, so five links on one page
                      do not all announce themselves identically. */}
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

                {subtitle ? (
                  <div className="mt-2">
                    <RuleLabel>{subtitle}</RuleLabel>
                  </div>
                ) : null}

                <p className="ps-prose mt-3 max-w-2xl">{pkg.blurb}</p>
              </article>
            );
          })}
        </div>

        <KeyValueList className="mt-10" label="Also true">
          <KeyValueRow
            k="Interior"
            mono={false}
            v={
              <>
                A Level 1 interior comes with every exterior detail above.{" "}
                <Link href="/interior-detailing/" className="link-inline">
                  What the three interior levels do
                </Link>
                .
              </>
            }
          />
          <KeyValueRow
            k="Correction"
            mono={false}
            v={
              <>
                Level 3 is paint correction, and it is the same work sold on
                its own.{" "}
                <Link href="/paint-correction/" className="link-inline">
                  Paint correction, on its own
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
                Level 2 can be finished with a ceramic coating on qualifying
                paint.{" "}
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
                What moves a detailing price, and what happens when you bring
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
          body="Send the year, make and model and we will come back with a number for that vehicle, in writing, before anything starts."
        />
      </Section>

      {/* ---------------------------------------------------------------
          The wash stage, on three vehicles that have nothing in common.
          That pairing is the argument: the process does not change.
          --------------------------------------------------------------- */}
      <Section plane="shop" label="The work">
        <SectionHead
          align="split"
          title="Every level starts the same way."
          intro={
            <p>
              A work truck and a Lamborghini get the same wash and the same
              decontamination before anything else happens. Every photo on this
              page is a vehicle that came through the shop.
            </p>
          }
        />

        <div className="mt-9 grid min-w-0 grid-cols-2 gap-5 md:mt-11 md:grid-cols-3 md:gap-6">
          <Plate
            id="wash-f250-foam"
            ratio="4 / 3"
            caption="F-250 Super Duty"
            sizes="(min-width: 768px) 24rem, 45vw"
          />
          <Plate
            id="wash-huracan-foam"
            ratio="4 / 3"
            caption="Huracan, decontamination wash"
            sizes="(min-width: 768px) 24rem, 45vw"
          />
          <Plate
            id="wash-porsche-911"
            ratio="4 / 3"
            className="col-span-2 md:col-span-1"
            caption="911, in the wash bay"
            sizes="(min-width: 768px) 24rem, 100vw"
          />
        </div>

        <div className="mt-10 grid min-w-0 gap-8 md:grid-cols-12 md:items-end md:gap-10">
          <div className="min-w-0 md:col-span-7">
            <Plate
              id="detail-raptor"
              caption="Raptor, finished"
              sizes="(min-width: 768px) 36rem, 100vw"
            />
          </div>
          <div className="min-w-0 md:col-span-5">
            <div className="ps-prose">
              <p>
                The ladder does not change with the vehicle. A Raptor and a
                Corvette read off the same levels. Size and paint condition
                move the number from there.
              </p>
            </div>
            <div className="mt-7">
              <Button href="/gallery/" tone="ghost" size="sm">
                See more of the work
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------
          THE TOWNS. Real internal links with descriptive anchors, each
          carrying its own measured road distance and drive time, which
          is the substance that keeps sixteen town pages from being one
          page with a name swapped in it.
          --------------------------------------------------------------- */}
      <Section plane="sheet" label="Service area">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              title="Where the cars come from."
              intro={
                <p>
                  Vehicles come to the shop rather than the other way round, so
                  the useful number is the drive. Every distance below was
                  measured on the road from {BRAND.street}, not in a straight
                  line.
                </p>
              }
            />

            <div className="ps-prose mt-6">
              <p>
                {CITIES.length} towns have their own page with the route, the
                distance and the drive time on it.{" "}
                <Link href="/areas/" className="link-inline">
                  Every town we detail cars for
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <KeyValueList label="Towns we detail cars for">
              {NEARBY.map((c) => (
                <KeyValueRow
                  key={c.slug}
                  k={
                    <Link href={`/areas/${c.slug}/`} className="link-inline">
                      Car detailing in {c.name}
                    </Link>
                  }
                  note={c.route}
                  v={drive(c.miles, c.minutes)}
                />
              ))}
            </KeyValueList>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------
          The one primary action, and the page's one solid cyan button:
          the submit inside QuoteForm. A real review sits beside it,
          because the decision point is the place proof is worth
          anything.
          --------------------------------------------------------------- */}
      <Section plane="sheet" label="Get a price" id="quote">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              title="Tell us the vehicle."
              intro={
                <p>
                  Year, make, model and which level you are looking at is
                  enough to start. If you are not sure which level, say what
                  the paint looks like now and we will tell you.
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
              placement="auto-detailing-panel"
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
              source="/auto-detailing/"
              id="quote-form"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
