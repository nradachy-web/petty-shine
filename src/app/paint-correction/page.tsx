import type { Metadata } from "next";

import CTABand from "@/components/sections/CTABand";
import QuoteForm from "@/components/quote/QuoteForm";
import ServiceSchema from "@/components/seo/ServiceSchema";
import PhoneLink from "@/components/tracking/PhoneLink";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import DatumRule from "@/components/ui/DatumRule";
import KeyValueRow, { KeyValueList } from "@/components/ui/KeyValueRow";
import Plate from "@/components/ui/Plate";
import PriceFigure from "@/components/ui/PriceFigure";
import QuoteLink from "@/components/ui/QuoteLink";
import Section, { SectionHead } from "@/components/ui/Section";
import { BRAND, COATINGS, DETAIL_PACKAGES, SERVICES } from "@/lib/constants";
import { money } from "@/lib/utils";

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

const TIERS = [LEVEL_2, LEVEL_3];

const DESCRIPTION = `Paint correction and machine buffing in ${BRAND.city}, ${BRAND.stateName}. Enhancement from ${money(
  LEVEL_2.fromPrice
)}, true correction from ${money(
  LEVEL_3.fromPrice
)}, on swirls, water spots and oxidation.`;

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

export default function PaintCorrectionPage() {
  return (
    <>
      <ServiceSchema
        name={SERVICE.name}
        description={DESCRIPTION}
        url="/paint-correction/"
        price={LEVEL_2.fromPrice}
        serviceType="Automotive paint correction and machine polishing"
      />

      <Breadcrumbs
        plane="sheet"
        trail={[{ label: SERVICE.name, href: SERVICE.href }]}
      />

      <Section plane="sheet" label={`${SERVICE.index} ${SERVICE.name}`}>
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-6">
            <h1 className="ps-display ps-display-lg">
              Paint correction. Most people call it buffing.
            </h1>

            <div className="ps-prose mt-6">
              <p>
                Swirls, scratches, water spots and oxidation sit in the clear
                coat. A machine polish cuts that clear coat back until the
                damage is level with it, then refines the surface until the
                gloss comes back up.
              </p>
              <p>
                Two levels come out of that. An enhancement pass lifts the
                gloss and takes out the light to moderate defects. A true
                correction goes after the medium and heavy ones and removes
                them for good.
              </p>
              <p>
                It is also the step that decides what everything else is worth.
                A coating locks in whatever the paint looks like on the day it
                goes on, so the paint gets fixed first and protected second.
              </p>
            </div>

            <div className="mt-8">
              <Button href="#quote" tone="ghost">
                Tell us about the paint
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-6">
            <KeyValueList label="Paint correction prices">
              {TIERS.map((tier) => (
                <KeyValueRow
                  key={tier.id}
                  k={`${tier.name}, ${tier.subtitle}`}
                  v={<PriceFigure value={tier.fromPrice} from />}
                />
              ))}
              <KeyValueRow k="Shop" v={BRAND.addressLine} />
              <KeyValueRow k="Hours" v={BRAND.hoursShort} />
            </KeyValueList>

            <div className="mt-8">
              <PhoneLink
                placement="correction-hero"
                className="ps-btn ps-btn--ghost"
              >
                Call {BRAND.phoneDisplay}
              </PhoneLink>
            </div>
          </div>
        </div>
      </Section>

      <Section plane="shop" label="The proof" className="plane-arc">
        <Plate
          id="detail-f250-black"
          bleed
          priority
          caption="F-250 Super Duty, after correction"
        />

        <div className="mt-12 grid min-w-0 gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
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
                Every photograph on this page is a job that came through the
                shop. Do it yourself on your own car. Find a straight line in
                the reflection, a door frame or a light bar, and see whether it
                stays crisp or falls apart at the edge.
              </p>
            </div>

            <div className="mt-7">
              <Button href="/gallery/" tone="ghost">
                See more of the work
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
          </div>
        </div>
      </Section>

      <Section plane="sheet" label="Two levels" className="plane-arc">
        <SectionHead
          title="What each level costs."
          intro={
            <p>
              Both are published starting prices off the detailing ladder. The
              difference between them is how far the polishing goes and how
              much of the damage comes out. What your vehicle costs depends on
              its size and on the state of its paint.
            </p>
          }
        />

        <div className="mt-12">
          {TIERS.map((tier) => (
            <div key={tier.id} className="mt-16 min-w-0 first:mt-0">
              <DatumRule label={tier.subtitle} />

              <div className="mt-8 grid min-w-0 gap-9 lg:grid-cols-12 lg:gap-14">
                <div className="min-w-0 lg:col-span-5">
                  <h3 className="ps-display ps-display-md">{tier.name}</h3>

                  <div className="mt-5">
                    <PriceFigure value={tier.fromPrice} from size="lg" />
                  </div>

                  <div className="mt-6">
                    <QuoteLink service={SERVICE.quoteKey}>
                      Price this one on my vehicle
                    </QuoteLink>
                  </div>
                </div>

                <div className="min-w-0 lg:col-span-7">
                  <p className="ps-prose">{tier.blurb}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <DatumRule label="Where correction shows up again" className="mt-16 mb-8" />

        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="The nine year coating starts here."
              intro={
                <p>
                  {NINE.name} is the only coating tier that begins with a full
                  correction, which is why it costs what it costs and why it
                  carries a {NINE.guarantee} guarantee.
                </p>
              }
            />
            <div className="mt-7">
              <Button href="/ceramic-coating/" tone="ghost" size="sm">
                The three ceramic coatings
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <KeyValueList label={`${NINE.name} prep`}>
              <KeyValueRow
                k="Coating"
                v={`${NINE.name}, ${NINE.subtitle}`}
              />
              <KeyValueRow
                k="Starting price"
                v={<PriceFigure value={NINE.fromPrice} from />}
              />
              <KeyValueRow k="Prep" v={NINE.includes[1]} mono={false} />
              <KeyValueRow k="Base coat" v={NINE.base} />
            </KeyValueList>
          </div>
        </div>

        <CTABand
          variant="line"
          service={SERVICE.quoteKey}
          ctaLabel="Get a price"
          body="Send the year, make and model with a note on what the paint looks like and we will come back with a number."
          className="mt-16"
        />
      </Section>

      <Section plane="shop" label="The limits" className="plane-arc">
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
      </Section>

      <Section plane="sheet" label="Get a price" id="quote" className="plane-arc">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="Tell us what the paint looks like."
              intro={
                <p>
                  Color, age, whether it lives outside, and what you can see in
                  it in direct sun. That is usually enough to say which level it
                  needs before the car is here.
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
