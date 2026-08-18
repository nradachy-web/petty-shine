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
import RuleLabel from "@/components/ui/RuleLabel";
import Section, { SectionHead } from "@/components/ui/Section";
import {
  BRAND,
  COATING_ADDONS,
  COATINGS,
  CREDENTIALS,
  GTECHNIQ_FACTS,
  SERVICES,
} from "@/lib/constants";
import { money } from "@/lib/utils";

const SERVICE = SERVICES.find((s) => s.id === "ceramic-coating")!;
const GTECHNIQ = CREDENTIALS.find((c) => c.id === "gtechniq")!;

/* COATINGS is a const tuple, so Extract keeps the exact member type and the
   named chemistry on the nine year tier is typed rather than optional. */
type Coating = (typeof COATINGS)[number];
const NINE = COATINGS.find((c) => c.id === "petty-shine-nine") as Extract<
  Coating,
  { id: "petty-shine-nine" }
>;

const DESCRIPTION = `Ceramic coating in ${BRAND.city}, ${BRAND.stateName}. Three tiers, from ${money(
  COATINGS[0].fromPrice
)} to ${money(NINE.fromPrice)}, up to a ${NINE.guarantee} Gtechniq guarantee. ${GTECHNIQ.label}.`;

export const metadata: Metadata = {
  title: `${SERVICE.name} in ${BRAND.city}, ${BRAND.state}`,
  description: DESCRIPTION,
  alternates: { canonical: "/ceramic-coating/" },
};

/* ---------------------------------------------------------------------------
   One tier of the ladder.

   Only the five and nine year coatings name a base and a top coat, because
   his own price list names a product for those two and names none for the
   three year tier. Rather than leave that tier's specification a row short,
   which reads as an omission, it carries `chemistryPending` from constants
   and says out loud that no product is published for it.
   ------------------------------------------------------------------------- */
function CoatingTier({ coating, index }: { coating: Coating; index: number }) {
  const subtitle = "subtitle" in coating ? coating.subtitle : null;
  const base = "base" in coating ? coating.base : null;
  const top = "top" in coating ? coating.top : null;
  const pending =
    "chemistryPending" in coating ? coating.chemistryPending : null;
  const named = "proOnly" in coating;
  const ruleLabel = `Tier ${String(index + 1).padStart(2, "0")} of ${String(
    COATINGS.length
  ).padStart(2, "0")}`;

  return (
    <div className="mt-16 min-w-0 first:mt-0">
      <DatumRule label={ruleLabel} labelTone={named ? "accent" : "default"} />

      <div className="mt-8 grid min-w-0 gap-9 lg:grid-cols-12 lg:gap-14">
        <div className="min-w-0 lg:col-span-5">
          <h3 className="ps-display ps-display-md">{coating.name}</h3>
          {subtitle ? (
            <p className="mt-2">
              <RuleLabel tone="quiet">{subtitle}</RuleLabel>
            </p>
          ) : null}

          <div className="mt-5">
            <PriceFigure value={coating.fromPrice} from size="lg" />
          </div>

          <p className="ps-prose mt-5">{coating.bestFor}.</p>

          {/* The tier goes with the click. Without the package key a lead
              off the nine year row and a lead off the three year row land
              in the shop inbox as the same lead. */}
          <div className="mt-6">
            <QuoteLink service={SERVICE.quoteKey} package={coating.id}>
              Price this one on my vehicle
            </QuoteLink>
          </div>
        </div>

        <div className="min-w-0 lg:col-span-7">
          <KeyValueList label={`${coating.name} specification`}>
            <KeyValueRow k="Guarantee" v={coating.guarantee} />
            {base ? <KeyValueRow k="Base coat" v={base} /> : null}
            {top ? <KeyValueRow k="Top coat" v={top} /> : null}
            {pending ? (
              <KeyValueRow
                k={pending.key}
                note={pending.note}
                v={pending.value}
                tone="pewter"
              />
            ) : null}
          </KeyValueList>

          <p className="mt-8">
            <RuleLabel>What is in it</RuleLabel>
          </p>

          <KeyValueList className="mt-3" label={`${coating.name}, what is included`}>
            {coating.includes.map((step, i) => (
              <KeyValueRow
                key={step}
                k={`Step ${String(i + 1).padStart(2, "0")}`}
                v={step}
                mono={false}
              />
            ))}
          </KeyValueList>
        </div>
      </div>
    </div>
  );
}

export default function CeramicCoatingPage() {
  return (
    <>
      <ServiceSchema
        name={SERVICE.name}
        description={DESCRIPTION}
        url="/ceramic-coating/"
        price={COATINGS[0].fromPrice}
        serviceType="Ceramic coating application"
      />

      <Breadcrumbs
        plane="sheet"
        trail={[{ label: SERVICE.name, href: SERVICE.href }]}
      />

      <Section plane="sheet" label={`${SERVICE.index} ${SERVICE.name}`}>
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-6">
            <h1 className="ps-display ps-display-lg">
              Ceramic coating, and what each one costs.
            </h1>

            <div className="ps-prose mt-6">
              <p>
                A ceramic coating is a hard layer bonded to the clear coat.
                Water beads up and runs off it, bugs and road film let go with a
                rinse, and the paint keeps its gloss instead of going flat.
              </p>
              <p>
                We install three of them. Every price here is a starting
                price, because what a vehicle costs depends on its size and on
                what the paint needs before anything goes on it.
              </p>
            </div>

            <div className="mt-8">
              <Button href="#quote" tone="ghost">
                Get a price on your vehicle
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-6">
            <KeyValueList label="Ceramic coating prices">
              {COATINGS.map((c) => (
                <KeyValueRow
                  key={c.id}
                  k={"subtitle" in c ? `${c.name}, ${c.subtitle}` : c.name}
                  v={<PriceFigure value={c.fromPrice} from />}
                  strong={"proOnly" in c}
                />
              ))}
              <KeyValueRow k="Applied by" v={GTECHNIQ.label} />
              <KeyValueRow k="Shop" v={BRAND.addressLine} />
              <KeyValueRow k="Hours" v={BRAND.hoursShort} />
            </KeyValueList>

            <div className="mt-8">
              <PhoneLink
                placement="ceramic-hero"
                className="ps-btn ps-btn--ghost"
              >
                Call {BRAND.phoneDisplay}
              </PhoneLink>
            </div>
          </div>
        </div>
      </Section>

      <Section plane="shop" label="The work" className="plane-arc">
        <Plate
          id="coating-corvette-c8"
          bleed
          priority
          caption="Corvette C8, after ceramic coating"
        />

        <div className="mt-12 grid min-w-0 gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="Every car on this page came through the shop."
              intro={
                <p>
                  No stock photography anywhere on this site. These are jobs
                  that came in the door on Branson Mill Road, got washed,
                  decontaminated, polished and coated, and went home.
                </p>
              }
            />
            <div className="mt-7">
              <Button href="/gallery/" tone="ghost">
                See more of the work
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <div className="grid min-w-0 gap-6 sm:grid-cols-3">
              <Plate
                id="coating-corvette-c7"
                caption="Corvette Grand Sport"
                sizes="(min-width: 1024px) 15rem, (min-width: 640px) 30vw, 100vw"
              />
              <Plate
                id="coating-challenger-hellcat"
                caption="Challenger Hellcat"
                sizes="(min-width: 1024px) 15rem, (min-width: 640px) 30vw, 100vw"
              />
              <Plate
                id="coating-supra"
                caption="Toyota Supra"
                sizes="(min-width: 1024px) 15rem, (min-width: 640px) 30vw, 100vw"
              />
            </div>
          </div>
        </div>
      </Section>

      <Section plane="sheet" label="The three coatings" className="plane-arc">
        <SectionHead
          title="What is in each one."
          intro={
            <p>
              Prep, chemistry and guarantee, tier by tier. The two lower
              coatings polish the paint before they coat it. The top one
              corrects it.
            </p>
          }
        />

        <div className="mt-12">
          {COATINGS.map((c, i) => (
            <CoatingTier key={c.id} coating={c} index={i} />
          ))}
        </div>

        <CTABand
          variant="line"
          service={SERVICE.quoteKey}
          ctaLabel="Get a price"
          body="Send the year, make and model with the tier you are looking at and we will come back with a number for that car."
          className="mt-16"
        />
      </Section>

      <Section plane="shop" label="The Petty Shine" className="plane-arc">
        <Plate id="coating-huracan" bleed caption="Inside the shop, Randleman NC" />

        <div className="mt-12 grid min-w-0 gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-6">
            <SectionHead
              title="The nine year coating we put our own name on."
              intro={
                <p>
                  {NINE.name} is the {NINE.guarantee} package. It is the only
                  tier that starts with a full paint correction, and the only
                  one built on {NINE.base}.
                </p>
              }
            />

            <div className="ps-prose mt-6">
              <p>{GTECHNIQ_FACTS.proOnly}</p>
              <p>
                We are one. Petty Shine is listed in the Gtechniq accredited
                detailer directory under this address, which is what lets the
                guarantee stand on a car we coat.
              </p>
              <p>{GTECHNIQ_FACTS.hardness}</p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/quote/?service=ceramic" tone="ghost">
                Ask about the nine year coating
              </Button>
              <Button href="/paint-correction/" tone="ghost">
                How the correction works
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-6">
            <Plate
              id="coating-g-wagon"
              caption="G-Class, after ceramic coating"
              sizes="(min-width: 1024px) 34rem, 100vw"
            />
          </div>
        </div>
      </Section>

      <Section plane="sheet" label="The guarantee" className="plane-arc">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="Read the conditions before you book it."
              intro={
                <p>
                  These are Gtechniq&rsquo;s terms on the paint protection
                  guarantee, not ours. We would rather you know them now than
                  find them in year four.
                </p>
              }
            />

            <div className="ps-prose mt-6">
              <p>{GTECHNIQ_FACTS.maintenanceNote}</p>
            </div>

            <div className="mt-7">
              <Button href="/warranties/" tone="ghost" size="sm">
                What is actually guaranteed
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <KeyValueList label="Gtechniq guarantee terms">
              {GTECHNIQ_FACTS.guaranteeTerms.map((term) => (
                <KeyValueRow
                  key={term.key}
                  k={term.key}
                  v={term.value}
                  mono={false}
                />
              ))}
            </KeyValueList>

            <p className="mt-10">
              <RuleLabel>Add ons</RuleLabel>
            </p>

            <KeyValueList className="mt-3" label="Coating add ons">
              {COATING_ADDONS.map((addon) => (
                <KeyValueRow
                  key={addon}
                  k={addon}
                  v={
                    <QuoteLink service={SERVICE.quoteKey}>
                      Add to a quote
                    </QuoteLink>
                  }
                />
              ))}
            </KeyValueList>
          </div>
        </div>
      </Section>

      <Section plane="sheet" label="Get a price" id="quote">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="Tell us the vehicle and the tier."
              intro={
                <p>
                  A coating is quoted on the size of the vehicle and the state
                  of the paint, so the closer you describe both, the closer the
                  first number lands.
                </p>
              }
            />

            <PhoneLink
              placement="ceramic-quote"
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
              source="/ceramic-coating/"
              id="quote-form"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
