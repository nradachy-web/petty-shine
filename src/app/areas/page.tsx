import type { Metadata } from "next";
import Link from "next/link";

import QuoteForm from "@/components/quote/QuoteForm";
import PhoneLink from "@/components/tracking/PhoneLink";
import {
  Breadcrumbs,
  Button,
  DatumRule,
  KeyValueList,
  KeyValueRow,
  Plate,
  Section,
  SectionHead,
} from "@/components/ui";
import { BRAND, CITIES, NEAREST_EXIT } from "@/lib/constants";
import { drive, miles, milesLong } from "@/lib/utils";
import {
  CITY_COUNT,
  cityHref,
  countyGroups,
  nameList,
  spell,
  spellCap,
} from "./[city]/facts";

export const metadata: Metadata = {
  title: "Service Area and Drive Times",
  /* 156 characters, inside what Google shows on a phone. */
  description: `Petty Shine is at ${BRAND.addressLine}. Road distance and drive time from ${CITY_COUNT} Triad towns, measured from the door. Call ${BRAND.phoneDisplay}.`,
  alternates: { canonical: "/areas/" },
};

const COUNTIES = countyGroups();
const HOME_COUNTY_COUNT = CITIES.filter((c) => c.county === BRAND.county).length;

/** The two ends of the measured set, used in the opening paragraph. */
const NEAREST = CITIES[0];
const FARTHEST = CITIES[CITIES.length - 1];

export default function AreasPage() {
  return (
    <>
      <Breadcrumbs
        plane="sheet"
        trail={[{ label: "Service area", href: "/areas/" }]}
      />

      <Section plane="sheet" label="Service area">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <h1 className="ps-display ps-display-lg">
              {spellCap(CITY_COUNT)} towns, measured
            </h1>

            <div className="ps-prose mt-6">
              <p>
                There is one shop and it is at {BRAND.street} in {BRAND.city}.
                Everything below is road distance and drive time from that door,
                measured along the route people actually take. None of it is
                estimated and none of it is straight line mileage.
              </p>
              <p>
                {NEAREST.name} is {milesLong(NEAREST.miles)} out.{" "}
                {FARTHEST.name} is {miles(FARTHEST.miles)}. Every town on the
                list has its own page with the route, the county line and the
                exit.
              </p>
            </div>

            <KeyValueList className="mt-8" label="The shop">
              <KeyValueRow k="Address" v={BRAND.street} />
              <KeyValueRow
                k="City"
                v={`${BRAND.city}, ${BRAND.state} ${BRAND.zip}`}
              />
              <KeyValueRow k="County" v={BRAND.county} tone="pewter" />
              <KeyValueRow k="Nearest exit" v={NEAREST_EXIT.label} />
              <KeyValueRow
                k="From the exit"
                v={milesLong(NEAREST_EXIT.miles)}
                tone="pewter"
              />
              <KeyValueRow k="Hours" v={BRAND.hoursShort} />
            </KeyValueList>

            <PhoneLink
              placement="areas-index"
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
          </div>

          <div className="min-w-0 lg:col-span-7">
            <DatumRule label="Sorted by road distance" className="mb-7" />
            <KeyValueList label="Drive distance and time from the shop">
              {CITIES.map((c) => (
                <KeyValueRow
                  key={c.slug}
                  k={
                    <Link href={cityHref(c)} className="link-inline">
                      {c.name}
                    </Link>
                  }
                  note={c.route}
                  v={drive(c.miles, c.minutes)}
                />
              ))}
            </KeyValueList>

            <p className="mt-5 text-[0.8125rem] leading-relaxed text-ink-400">
              Each time is the measured time for that route. Traffic sits on top
              of it.
            </p>
          </div>
        </div>
      </Section>

      <Section plane="shop" label="The shop" className="plane-arc">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:items-end lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              title="One building, one address."
              intro={
                <p>
                  The vehicle comes to {BRAND.street}, the work happens there,
                  and it goes home from there. Every photo on this site is a
                  real job that came through that building. No stock
                  photography anywhere on it.
                </p>
              }
            />
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/contact/" tone="ghost">
                Directions and hours
              </Button>
              <Button href="/gallery/" tone="ghost">
                See the work
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <Plate
              id="coating-huracan"
              priority
              caption={`Inside the shop, ${BRAND.city} ${BRAND.state}`}
              sizes="(min-width: 1024px) 45rem, 100vw"
            />
          </div>
        </div>
      </Section>

      <Section plane="sheet" label="By county" className="plane-arc">
        <SectionHead
          size="md"
          title={`${spellCap(COUNTIES.length)} counties, one shop.`}
          intro={
            <p>
              The shop sits in {BRAND.county}. {spellCap(HOME_COUNTY_COUNT)} of
              the towns on the list are in it, and the rest are a county line
              away.
            </p>
          }
        />

        <div className="mt-9 grid min-w-0 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {COUNTIES.map((g) => (
            <div key={g.county} className="min-w-0">
              <DatumRule
                label={g.county}
                labelTone={g.county === BRAND.county ? "strong" : "default"}
                className="mb-4"
              />
              <p className="text-[0.9375rem] leading-relaxed text-ink-600">
                {nameList(g.towns)}
              </p>
              <p className="mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-400">
                {g.towns.length} town{g.towns.length === 1 ? "" : "s"},{" "}
                {g.towns.length === 1
                  ? milesLong(g.towns[0].miles)
                  : `${miles(g.towns[0].miles)} to ${milesLong(g.towns[g.towns.length - 1].miles)}`}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section plane="sheet" label="Get a price">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <h2 className="ps-display ps-display-md">
              Distance is the easy part.
            </h2>
            <div className="ps-prose mt-5">
              <p>
                What a job costs depends on the vehicle and the shape the paint
                is in, so every published price on this site is a starting
                price. Send us the vehicle and we will price that one.
              </p>
              <p>
                If your town is not on the list, call anyway. The list is what
                we measured, not a boundary.
              </p>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <QuoteForm
              heading="Get a price for your vehicle"
              intro="It goes straight to the shop. Year, make, model and what you want done is enough to start."
              source="/areas/"
              id="quote-form"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
