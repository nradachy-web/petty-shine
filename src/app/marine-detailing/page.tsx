import type { Metadata } from "next";

import QuoteForm from "@/components/quote/QuoteForm";
import ServiceSchema from "@/components/seo/ServiceSchema";
import PhoneLink from "@/components/tracking/PhoneLink";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import KeyValueRow, { KeyValueList } from "@/components/ui/KeyValueRow";
import Plate from "@/components/ui/Plate";
import PriceFigure from "@/components/ui/PriceFigure";
import Section, { SectionHead } from "@/components/ui/Section";
import {
  BRAND,
  MARINE_EXTRAS,
  MARINE_PACKAGES,
  SERVICES,
} from "@/lib/constants";

const SERVICE = SERVICES.find((s) => s.id === "marine-detailing")!;
const FROM = MARINE_PACKAGES[0].fromPrice;

const DESCRIPTION = `Boat detailing at ${BRAND.name} in ${BRAND.city}, ${BRAND.state}. Three published levels from $${FROM}, plus marine interior work and marine ceramic coating. Bring it on the trailer.`;

export const metadata: Metadata = {
  title: `Boat and Marine Detailing in ${BRAND.city}, ${BRAND.state}`,
  description: DESCRIPTION,
  alternates: { canonical: "/marine-detailing/" },
};

export default function MarineDetailingPage() {
  return (
    <>
      <ServiceSchema
        name={SERVICE.name}
        description="Boat and marine detailing, marine interior cleaning and marine ceramic coating, done at the shop with the boat on its trailer."
        url={SERVICE.href}
        price={FROM}
        serviceType="Boat detailing"
      />

      <Breadcrumbs
        plane="sheet"
        trail={[{ label: SERVICE.name, href: SERVICE.href }]}
      />

      <Section plane="sheet" label={`${SERVICE.index} ${SERVICE.name}`}>
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-7">
            <h1 className="ps-display ps-display-lg">Marine detailing</h1>

            <div className="ps-prose mt-6">
              <p>
                Boats get detailed at the shop, on their own trailer. Hitch it
                up and bring it to {BRAND.street} in {BRAND.city}.
              </p>
              <p>
                Three levels are published below, and every number is a starting
                price. A boat is priced by its length and by the condition of
                the hull, so the number on yours comes off the boat rather than
                off this page.
              </p>
            </div>

            <div className="mt-8">
              <Button href="#quote" tone="ghost">
                Tell us about the boat
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-5">
            <PhoneLink
              placement="marine-hero"
              className="flex min-w-0 items-center justify-between gap-4 border border-rule-light bg-sheet-060 px-5 py-5 transition-colors hover:border-cyan-500"
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

            <KeyValueList className="mt-8" label="Marine detailing details">
              <KeyValueRow
                k="Starting price"
                v={<PriceFigure value={FROM} from />}
              />
              <KeyValueRow k="Where" v="At the shop, on your trailer" />
              <KeyValueRow k="Address" v={BRAND.street} />
              <KeyValueRow
                k="City"
                v={`${BRAND.city}, ${BRAND.state} ${BRAND.zip}`}
              />
              <KeyValueRow k="Open" v={BRAND.hoursShort} />
            </KeyValueList>
          </div>
        </div>
      </Section>

      <Section plane="shop" label="On the trailer" className="plane-arc">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:items-end lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              title="It comes to us the way it goes to the ramp."
              intro={
                <p>
                  The boat in the photo came in behind a truck and left the same
                  way.
                  Nothing about the work needs the water, so the whole job
                  happens under the lights on Branson Mill Road.
                </p>
              }
            />
            <div className="mt-7">
              <Button href="/contact/" tone="ghost">
                Directions to the shop
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

      <Section plane="sheet" label="Published pricing" className="plane-arc">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              title="Real numbers, before you ask for them."
              intro={
                <p>
                  These are the starting prices the shop publishes for marine
                  work, put here so you can decide something before you pick up
                  the phone.
                </p>
              }
            />

            <div className="ps-prose mt-6">
              <p>
                What sits inside each level is settled on the boat, not here. A
                small runabout and a big center console at the same level are
                not the same job, and pretending otherwise on a web page is how
                a quote ends up wrong.
              </p>
              <p>
                Tell us the boat and we will say which level it needs and what
                that covers.
              </p>
            </div>

            <div className="mt-7">
              <Button href="/pricing/" tone="ghost" size="sm">
                Every published price
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <KeyValueList label="Marine detailing levels">
              {MARINE_PACKAGES.map((p) => (
                <KeyValueRow
                  key={p.id}
                  k={p.name}
                  v={<PriceFigure value={p.fromPrice} from />}
                />
              ))}
            </KeyValueList>

            <h3 className="ps-heading mt-10 text-lg">
              Marine interior and coating
            </h3>
            <KeyValueList className="mt-5" label="Marine add ons">
              {MARINE_EXTRAS.map((extra) => (
                <KeyValueRow
                  key={extra.key}
                  k={extra.key}
                  v={<PriceFigure value={extra.value} from />}
                />
              ))}
            </KeyValueList>

            <p className="mt-5 max-w-xl text-[0.9375rem] leading-relaxed text-ink-600">
              Add ons price on top of a level rather than replacing it.
            </p>
          </div>
        </div>
      </Section>

      <Section plane="shop" label="Get a price" id="quote" className="plane-arc">
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

            <div className="mt-8">
              <PhoneLink
                placement="marine-quote"
                className="ps-btn ps-btn--ghost"
              >
                Call {BRAND.phoneDisplay}
              </PhoneLink>
            </div>
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
