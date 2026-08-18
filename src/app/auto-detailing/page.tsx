import type { Metadata } from "next";
import Link from "next/link";

import QuoteForm from "@/components/quote/QuoteForm";
import ServiceSchema from "@/components/seo/ServiceSchema";
import PhoneLink from "@/components/tracking/PhoneLink";
import CTABand from "@/components/sections/CTABand";
import {
  Breadcrumbs,
  Button,
  KeyValueList,
  KeyValueRow,
  Plate,
  PriceFigure,
  QuoteLink,
  RuleLabel,
  Section,
  SectionHead,
} from "@/components/ui";
import { BRAND, DETAIL_PACKAGES, NEAREST_EXIT, SERVICES } from "@/lib/constants";
import { milesLong, money } from "@/lib/utils";

const SERVICE = SERVICES.find((s) => s.id === "auto-detailing")!;

/** Both ends of the published ladder, read off the data rather than typed. */
const LOWEST = DETAIL_PACKAGES[0];
const HIGHEST = DETAIL_PACKAGES[DETAIL_PACKAGES.length - 1];

const DESCRIPTION =
  `Auto detailing in ${BRAND.city}, ${BRAND.stateName}. ` +
  `${DETAIL_PACKAGES.length} levels with published starting prices, ` +
  `from ${money(LOWEST.fromPrice)} to ${money(HIGHEST.fromPrice)}. ` +
  `Call ${BRAND.phoneDisplay}.`;

export const metadata: Metadata = {
  title: `Auto Detailing in ${BRAND.city}, ${BRAND.state}`,
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
        name="Auto Detailing"
        description={`${DETAIL_PACKAGES.length} levels of exterior auto detailing, from a maintenance clean to full paint correction, at Petty Shine in ${BRAND.city}, ${BRAND.state}.`}
        url="/auto-detailing/"
        price={LOWEST.fromPrice}
        serviceType="Auto detailing"
      />

      <Breadcrumbs
        plane="sheet"
        trail={[{ label: SERVICE.name, href: SERVICE.href }]}
      />

      {/* ---------------------------------------------------------------
          The record plane opens the page, because the one thing nobody
          else in the area puts on a detailing page is the number.
          --------------------------------------------------------------- */}
      <Section plane="sheet" label={`${SERVICE.index} ${SERVICE.name}`}>
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-6">
            <h1 className="ps-display ps-display-lg">
              Auto detailing in {BRAND.city}
            </h1>

            <div className="ps-prose mt-6">
              <p>
                Exterior detail comes in {DETAIL_PACKAGES.length} levels, and
                every one of them is priced further down this page.
              </p>
              <p>
                The levels stack. Level 1 is the maintenance detail plus
                protection, and Level 2 is Level 1 plus a machine polish.
                Above that the work turns to correcting the paint rather than
                adding to the clean.
              </p>
              <p>
                The shop is at {BRAND.street} in {BRAND.city},{" "}
                {BRAND.stateName}, {milesLong(NEAREST_EXIT.miles)} off{" "}
                {NEAREST_EXIT.label}.
              </p>
            </div>

            <KeyValueList className="mt-9" label="Detailing at a glance">
              <KeyValueRow k="Levels" v={DETAIL_PACKAGES.length} />
              <KeyValueRow
                k="Starts at"
                v={<PriceFigure value={LOWEST.fromPrice} from />}
                strong
              />
              <KeyValueRow
                k="Interior"
                v="Level 1 included with every exterior detail"
                mono={false}
              />
              <KeyValueRow k="Shop" v={BRAND.addressLine} />
              <KeyValueRow k="Hours" v={BRAND.hoursShort} />
            </KeyValueList>

            <div className="mt-9 flex flex-wrap items-center gap-3">
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

          <div className="min-w-0 lg:col-span-6">
            <Plate
              id="detail-mustang-red"
              priority
              caption="Finished, under the shop banner"
              sizes="(min-width: 1024px) 40rem, 100vw"
            />
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------
          Evidence. What actually changes between the levels, next to a
          photo of the floor those levels happen on.
          --------------------------------------------------------------- */}
      <Section plane="shop" label="How the levels differ" className="plane-arc">
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

        <div className="mt-12">
          <Plate
            id="detail-jeep-orange"
            bleed
            caption="Any vehicle, same floor, same process"
          />
        </div>
      </Section>

      {/* ---------------------------------------------------------------
          THE LADDER. The reason this page exists.
          --------------------------------------------------------------- */}
      <Section plane="sheet" label="Levels" id="levels" className="plane-arc">
        <SectionHead
          title="Every level, priced."
          intro={
            <p>
              Every figure is a starting price, which is how they are
              published. Size and paint condition move the final number, and
              you get that number in writing before work begins.
            </p>
          }
        />

        <div className="mt-11 border-b border-rule-light">
          {DETAIL_PACKAGES.map((pkg, i) => {
            const subtitle = subtitleOf(pkg);
            return (
              <article
                key={pkg.id}
                id={pkg.id}
                className="min-w-0 border-t border-rule-light pt-6 pb-7 md:pt-8 md:pb-8"
              >
                <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <h3 className="ps-heading min-w-0 text-[1.3rem] md:text-[1.6rem]">
                    <span className="mr-3 font-mono text-[0.6875rem] tracking-[0.26em] text-ink-400">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {pkg.name}
                  </h3>
                  <PriceFigure value={pkg.fromPrice} from />
                </div>

                {subtitle ? (
                  <div className="mt-2">
                    <RuleLabel>{subtitle}</RuleLabel>
                  </div>
                ) : null}

                <p className="ps-prose mt-3 max-w-2xl">{pkg.blurb}</p>

                <div className="mt-2">
                  <QuoteLink service={SERVICE.quoteKey}>
                    Get this priced
                  </QuoteLink>
                </div>
              </article>
            );
          })}
        </div>

        <KeyValueList className="mt-12" label="Also true">
          <KeyValueRow
            k="Interior"
            mono={false}
            v={
              <>
                A Level 1 interior comes with every exterior detail above.{" "}
                <Link href="/interior-detailing/" className="link-inline">
                  The three interior levels
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
                  Coating tiers and prices
                </Link>
                .
              </>
            }
          />
          <KeyValueRow
            k="Everything else"
            mono={false}
            v={
              <>
                Coatings, marine work and interior work are all published too.{" "}
                <Link href="/pricing/" className="link-inline">
                  The full price list
                </Link>
                .
              </>
            }
          />
        </KeyValueList>

        <CTABand
          variant="line"
          className="mt-12"
          service={SERVICE.quoteKey}
          ctaLabel="Get a price"
          body="Send the year, make and model and we will come back with a number for that vehicle."
        />
      </Section>

      {/* ---------------------------------------------------------------
          The wash stage, on three vehicles that have nothing in common.
          That pairing is the argument: the process does not change.
          --------------------------------------------------------------- */}
      <Section plane="shop" label="The work" className="plane-arc">
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

        <div className="mt-12 grid min-w-0 grid-cols-2 gap-5 md:grid-cols-3 md:gap-6">
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

        <div className="mt-12 grid min-w-0 gap-8 md:grid-cols-12 md:items-end md:gap-10">
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
                Corvette read off the same levels at the same starting
                prices. Size and paint condition move it from there.
              </p>
            </div>
            <div className="mt-7">
              <Button href="/gallery/" tone="ghost" size="sm">
                See more of the work
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-14">
          <Plate
            id="wheels-mustang"
            bleed
            caption="Wheels off, Mustang, in the shop"
          />
        </div>
      </Section>

      {/* ---------------------------------------------------------------
          The page's one primary action, and its one solid cyan button:
          the submit inside QuoteForm.
          --------------------------------------------------------------- */}
      <Section plane="sheet" label="Get a price" id="quote" className="plane-arc">
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
