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
  Section,
  SectionHead,
} from "@/components/ui";
import {
  BRAND,
  INTERIOR_ADDONS,
  INTERIOR_PACKAGES,
  SERVICES,
} from "@/lib/constants";
import { money } from "@/lib/utils";

const SERVICE = SERVICES.find((s) => s.id === "interior-detailing")!;

const LOWEST = INTERIOR_PACKAGES[0];
const HIGHEST = INTERIOR_PACKAGES[INTERIOR_PACKAGES.length - 1];

const DESCRIPTION =
  `Interior detailing in ${BRAND.city}, ${BRAND.stateName}. ` +
  `${INTERIOR_PACKAGES.length} levels, from ${money(LOWEST.fromPrice)} to ` +
  `${money(HIGHEST.fromPrice)}, and Level 1 comes with every exterior ` +
  `detail. Call ${BRAND.phoneDisplay}.`;

export const metadata: Metadata = {
  title: `Interior Detailing in ${BRAND.city}, ${BRAND.state}`,
  description: DESCRIPTION,
  alternates: { canonical: "/interior-detailing/" },
};

export default function InteriorDetailingPage() {
  return (
    <>
      <ServiceSchema
        name="Interior Detailing"
        description={`${INTERIOR_PACKAGES.length} levels of interior detailing, from a deep vacuum to leather and vinyl restoration, at Petty Shine in ${BRAND.city}, ${BRAND.state}.`}
        url="/interior-detailing/"
        price={LOWEST.fromPrice}
        serviceType="Interior detailing"
      />

      <Breadcrumbs
        plane="sheet"
        trail={[{ label: SERVICE.name, href: SERVICE.href }]}
      />

      <Section plane="sheet" label={`${SERVICE.index} ${SERVICE.name}`}>
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-6">
            <h1 className="ps-display ps-display-lg">
              Interior detailing in {BRAND.city}
            </h1>

            <div className="ps-prose mt-6">
              <p>
                Interior work comes in {INTERIOR_PACKAGES.length} levels, all
                priced on this page. Level 1 is a full clean. Level 2 adds conditioning and protection to
                the leather, plastic and vinyl, and Level 3 takes those
                surfaces back toward new while sanitizing them, with an
                advanced process through the carpets and upholstery.
              </p>
              <p>
                A Level 1 interior is included with every exterior detail we
                do, so if you are already booking a detail you are not paying
                for the inside twice.
              </p>
            </div>

            <KeyValueList className="mt-9" label="Interior at a glance">
              <KeyValueRow k="Levels" v={INTERIOR_PACKAGES.length} />
              <KeyValueRow
                k="Starts at"
                v={<PriceFigure value={LOWEST.fromPrice} from />}
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

            <div className="mt-9 flex flex-wrap items-center gap-3">
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

          <div className="min-w-0 lg:col-span-6">
            <Plate
              id="interior-bmw-x5m"
              priority
              caption="X5 M, after an interior detail"
              sizes="(min-width: 1024px) 40rem, 100vw"
            />
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------
          Evidence. Leather and a dashboard, close enough to judge.
          --------------------------------------------------------------- */}
      <Section plane="shop" label="The surfaces" className="plane-arc">
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

        <div className="mt-12 grid min-w-0 gap-8 md:grid-cols-2 md:gap-10">
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
          THE LADDER.
          --------------------------------------------------------------- */}
      <Section plane="sheet" label="Levels" id="levels" className="plane-arc">
        <SectionHead
          title="Every level, priced."
          intro={
            <p>
              Every figure is a starting price. How dirty the interior is and
              how much of it is leather decide the rest, and you get that
              number in writing before work begins.
            </p>
          }
        />

        <div className="mt-11 border-b border-rule-light">
          {INTERIOR_PACKAGES.map((pkg, i) => (
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

              <p className="ps-prose mt-3 max-w-2xl">{pkg.blurb}</p>

              <div className="mt-2">
                <QuoteLink service={SERVICE.quoteKey}>
                  Get this priced
                </QuoteLink>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 grid min-w-0 gap-10 md:grid-cols-12 md:gap-14">
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
                  v={<QuoteLink service={SERVICE.quoteKey} />}
                  tone="pewter"
                />
              ))}
            </KeyValueList>
          </div>
        </div>

        <KeyValueList className="mt-14" label="Also true">
          <KeyValueRow
            k="Exterior"
            mono={false}
            v={
              <>
                Every exterior detail includes a Level 1 interior.{" "}
                <Link href="/auto-detailing/" className="link-inline">
                  The exterior levels
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
                Detailing, coatings and marine work are all published.{" "}
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
          body="Send the year, make and model and tell us what the inside looks like now."
        />
      </Section>

      <Section plane="shop" label="The work" className="plane-arc">
        <div className="grid min-w-0 gap-10 md:grid-cols-12 md:items-end md:gap-14">
          <div className="min-w-0 md:col-span-7">
            <Plate
              id="interior-mustang-65"
              caption="1965 Mustang, interior detail"
              sizes="(min-width: 768px) 36rem, 100vw"
            />
          </div>
          <div className="min-w-0 md:col-span-5">
            <SectionHead
              size="md"
              title="Old cars too."
              intro={
                <p>
                  An old interior and a new one are the same job with
                  different tolerances. Both come off the same levels.
                </p>
              }
            />
            <div className="mt-7">
              <Button href="/gallery/" tone="ghost" size="sm">
                See more of the work
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------
          One primary action, one solid cyan button: the form submit.
          --------------------------------------------------------------- */}
      <Section plane="sheet" label="Get a price" id="quote" className="plane-arc">
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
