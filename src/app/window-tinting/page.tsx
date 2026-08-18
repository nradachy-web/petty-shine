import type { Metadata } from "next";

import QuoteForm from "@/components/quote/QuoteForm";
import { SpecificationPending } from "@/components/ppf";
import CTABand from "@/components/sections/CTABand";
import ServiceSchema from "@/components/seo/ServiceSchema";
import PhoneLink from "@/components/tracking/PhoneLink";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import KeyValueRow, { KeyValueList } from "@/components/ui/KeyValueRow";
import Plate from "@/components/ui/Plate";
import QuoteLink from "@/components/ui/QuoteLink";
import Section, { SectionHead } from "@/components/ui/Section";
import { BRAND, NC_TINT_LAW, SERVICES } from "@/lib/constants";

const SERVICE = SERVICES.find((s) => s.id === "window-tinting")!;

/* 157 characters. The old one ran to 211 and Google cut it off in the middle
   of "with the statute printed on the page", which is the whole hook. */
const DESCRIPTION = `Window tinting in ${BRAND.city}, ${BRAND.stateName}. Laminate and ceramic film to the ${NC_TINT_LAW.statute} limit, the statute printed on the page, priced on your vehicle.`;

export const metadata: Metadata = {
  title: `${SERVICE.name} in ${BRAND.city}, ${BRAND.state}`,
  description: DESCRIPTION,
  alternates: { canonical: "/window-tinting/" },
};

export default function WindowTintingPage() {
  return (
    <>
      <ServiceSchema
        name="Window Tinting"
        description={`Laminate and ceramic automotive window film installed at ${BRAND.addressLine}, to the ${BRAND.stateName} light transmission limit set by ${NC_TINT_LAW.statute}.`}
        url="/window-tinting/"
        serviceType="Automotive window tinting"
      />

      <Breadcrumbs
        plane="sheet"
        trail={[{ label: SERVICE.name, href: SERVICE.href }]}
      />

      <Section plane="sheet" label={`${SERVICE.index} ${SERVICE.name}`}>
        <h1 className="ps-display ps-display-lg">
          Window tinting in {BRAND.city}, installed to the {BRAND.stateName}{" "}
          limit.
        </h1>

        <div className="ps-prose mt-6 max-w-2xl">
          <p>
            We install laminate and ceramic window film on cars and trucks at
            the shop on {BRAND.street}.
          </p>
          <p>
            Most tint questions turn out to be law questions. North Carolina
            sets one standard for every window except the windshield, and it
            does not get looser for the back glass. The statute is printed
            further down this page with the citation on every line, so you can
            check it against what any shop tells you.
          </p>
        </div>

        <KeyValueList className="mt-9 max-w-2xl" label="Window tinting details">
          <KeyValueRow
            k="Price"
            v={<QuoteLink service={SERVICE.quoteKey} />}
            tone="pewter"
          />
          <KeyValueRow k="Film" v="Laminate or ceramic" />
          <KeyValueRow k="Legal standard" v={NC_TINT_LAW.statute} />
          <KeyValueRow k="Shop" v={BRAND.addressLine} />
          <KeyValueRow k="Hours" v={BRAND.hoursShort} />
        </KeyValueList>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <PhoneLink placement="window-tinting-hero" className="ps-btn ps-btn--ghost">
            Call {BRAND.phoneDisplay}
          </PhoneLink>
          <a href="#nc-law" className="ps-btn ps-btn--ghost">
            Read the North Carolina limits
          </a>
        </div>
      </Section>

      <Section plane="shop" label="In the shop" className="plane-arc">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:items-end lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              title="Laminate or ceramic, cut and fitted here."
              intro={
                <p>
                  The glass is cleaned and decontaminated before any film
                  touches it, because whatever is left under the film stays
                  under the film. Back glass is heat shaped to its curve
                  before it goes on, because a flat sheet will not lie down on
                  curved glass.
                </p>
              }
            />

            <div className="ps-prose mt-6">
              <p>
                Which film goes on depends on the vehicle and on how it gets
                used. Tell us that and we will tell you which one is worth the
                money on yours.
              </p>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button href="/paint-protection-film/" tone="ghost">
                Film for the paint
              </Button>
              <Button href="/gallery/" tone="ghost">
                See the work
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <Plate
              id="coating-g-wagon"
              priority
              caption={`In the shop, ${BRAND.city} ${BRAND.state}`}
              sizes="(min-width: 1024px) 45rem, 100vw"
            />
          </div>
        </div>
      </Section>

      <Section
        plane="sheet"
        id="nc-law"
        label="North Carolina law"
        className="plane-arc"
      >
        <SectionHead
          title="What North Carolina actually allows"
          intro={<p>{NC_TINT_LAW.myth}</p>}
        />

        <div className="ps-prose mt-6 max-w-2xl">
          <p>
            That one gets published wrong on tint pages all over this state,
            usually as a promise that the rear glass can go as dark as you
            like. It cannot. The limits below are the statute, not our policy,
            and we do not install darker than they allow.
          </p>
        </div>

        <KeyValueList
          className="mt-9"
          label={`Window tint limits under ${NC_TINT_LAW.statute}`}
        >
          {NC_TINT_LAW.rows.map((row) => (
            <KeyValueRow
              key={row.key}
              k={row.key}
              v={row.value}
              note={row.cite}
              mono={false}
            />
          ))}
        </KeyValueList>

        <div className="ps-prose mt-9 max-w-2xl">
          <p>
            Two of those rows do more work than the rest. The meter tolerance
            is why a 35% film that meters a little low still passes, because
            the statute treats anything above 32% as legal. The windshield row
            is why the only tint on the glass in front of you is the top strip.
            Clear film is the exception there, and the statute names it.
          </p>
        </div>

        <CTABand
          variant="line"
          service={SERVICE.quoteKey}
          ctaLabel="Get a price on your vehicle"
          body="Send us the year, make and model and what you want done to the glass."
          className="mt-10"
        />
      </Section>

      <Section plane="shop" label="Ceramic film" className="plane-arc">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:items-end lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              title="What ceramic film does that dyed film does not."
              intro={
                <p>
                  Two films can measure the same 35% at the window and behave
                  nothing alike in July. Shade is not what stops heat, so a
                  darker window is not automatically a cooler one.
                </p>
              }
            />

            <div className="ps-prose mt-6">
              <p>
                Ceramic film does that work with ceramic particles held in the
                film instead of with dye. It carries no metal, so it does not
                fight the phone in your hand or the antenna in the glass.
              </p>
              <p>
                Laminate film costs less and it is still the right call on
                plenty of vehicles. Both are held to the same 35%, so the
                choice is about heat and longevity rather than about how dark
                the car ends up.
              </p>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <Plate
              id="interior-bmw-x5m"
              caption="Where the heat lands, BMW X5 M"
              sizes="(min-width: 1024px) 45rem, 100vw"
            />
          </div>
        </div>
      </Section>

      <Section plane="sheet" label="Film and warranty" className="plane-arc">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="The film and the warranty, in writing."
              intro={
                <p>
                  We name the film and the terms behind it for your vehicle
                  before the work starts, and we hand it to you in writing. We
                  do not publish a warranty on this page that we have not
                  verified.
                </p>
              }
            />

            <SpecificationPending className="mt-8" />

            <div className="mt-7">
              <Button href="/warranties/" tone="ghost" size="sm">
                What is actually guaranteed
              </Button>
            </div>

            <div className="mt-8">
              <PhoneLink
                placement="window-tinting-spec"
                className="flex min-w-0 items-center justify-between gap-4 border border-rule-light bg-sheet-060 px-5 py-4 transition-colors hover:border-cyan-500"
              >
                <span className="min-w-0">
                  <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-400">
                    Rather call
                  </span>
                  <span className="mt-1 block font-mono text-xl tabular-nums text-ink-900">
                    {BRAND.phoneDisplay}
                  </span>
                </span>
                <span className="h-px w-6 flex-none bg-cyan-500" aria-hidden />
              </PhoneLink>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <QuoteForm
              service={SERVICE.quoteKey}
              lockService
              heading="Get a price on your glass"
              intro="Year, make and model is enough to start. Say how dark you want it and we will tell you what the law allows on that vehicle."
              source="/window-tinting/"
              id="quote-form"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
