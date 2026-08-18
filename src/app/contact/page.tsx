import type { Metadata } from "next";

import QuoteForm from "@/components/quote/QuoteForm";
import PhoneLink from "@/components/tracking/PhoneLink";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import KeyValueRow, { KeyValueList } from "@/components/ui/KeyValueRow";
import Plate from "@/components/ui/Plate";
import Section, { SectionHead } from "@/components/ui/Section";
import { BRAND, CITIES, NEAREST_EXIT } from "@/lib/constants";
import { driveTimeShort, milesLong, milesShort } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact and Directions",
  description: `Petty Shine is at ${BRAND.addressLine}. Call ${BRAND.phoneDisplay} or send your vehicle through for a price. Open ${BRAND.hoursShort}.`,
  alternates: { canonical: "/contact/" },
};

/** CITIES is already ordered by measured road distance from the shop door. */
const NEARBY = CITIES.slice(0, 8);

export default function ContactPage() {
  return (
    <>
      <Breadcrumbs plane="sheet" trail={[{ label: "Contact", href: "/contact/" }]} />

      <Section plane="sheet" label="Contact">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <h1 className="ps-display ps-display-lg">Come by the shop.</h1>

            <div className="ps-prose mt-6">
              <p>
                Call and talk it through, or send the vehicle through the form
                and we will come back with a price for it.
              </p>
            </div>

            <PhoneLink
              placement="contact-page"
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

            <KeyValueList className="mt-8" label="Shop details">
              <KeyValueRow k="Address" v={BRAND.street} />
              <KeyValueRow k="City" v={`${BRAND.city}, ${BRAND.state} ${BRAND.zip}`} />
              <KeyValueRow k="County" v={BRAND.county} tone="pewter" />
              {BRAND.hours.map((h) => (
                <KeyValueRow key={h.days} k={h.days} v={h.time} />
              ))}
              <KeyValueRow k="Nearest exit" v={NEAREST_EXIT.label} />
              <KeyValueRow
                k="From the exit"
                v={milesLong(NEAREST_EXIT.miles)}
                tone="pewter"
              />
            </KeyValueList>

            <div className="mt-6">
              <a
                href={BRAND.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ps-btn ps-btn--ghost ps-btn--sm"
              >
                Open in Google Maps
              </a>
            </div>

            <div className="ps-prose mt-7">
              <p>
                The shop is on Branson Mill Road in {BRAND.city}. The closest
                interchange is {NEAREST_EXIT.label},{" "}
                {milesLong(NEAREST_EXIT.miles)} out.
              </p>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <QuoteForm
              heading="Send us the vehicle"
              intro="It goes straight to the shop. Year, make, model and what you want done is enough to start."
              source="/contact/"
              id="quote-form"
            />
          </div>
        </div>
      </Section>

      <Section plane="shop" label="The shop">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:items-end lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              title="One building, one address."
              intro={
                <p>
                  Every photo on this site is a real job that came through here.
                  No stock photography anywhere on it.
                </p>
              }
            />
            <div className="mt-7">
              <Button href="/gallery/" tone="ghost">
                See the work
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <Plate
              id="detail-jeep-orange"
              caption="Inside the shop, Randleman NC"
              sizes="(min-width: 1024px) 45rem, 100vw"
            />
          </div>
        </div>
      </Section>

      <Section plane="sheet" label="Getting here">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="Measured, not estimated."
              intro={
                <p>
                  Road distance and drive time from the shop door, along the
                  route people actually take.
                </p>
              }
            />
            <div className="mt-7">
              <Button href="/areas/" tone="ghost" size="sm">
                Every town we cover
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <KeyValueList label="Drive times from the shop">
              {NEARBY.map((c) => (
                <KeyValueRow
                  key={c.slug}
                  k={c.name}
                  v={`${milesShort(c.miles)}, about ${driveTimeShort(c.minutes)}`}
                  note={c.route}
                />
              ))}
            </KeyValueList>
          </div>
        </div>
      </Section>
    </>
  );
}
