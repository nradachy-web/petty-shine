import type { Metadata } from "next";
import Link from "next/link";

import QuoteForm from "@/components/quote/QuoteForm";
import { SpecificationPending } from "@/components/ppf";
import CTABand from "@/components/sections/CTABand";
import TrustBar from "@/components/sections/TrustBar";
import ServiceSchema from "@/components/seo/ServiceSchema";
import PhoneLink from "@/components/tracking/PhoneLink";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import KeyValueRow, { KeyValueList } from "@/components/ui/KeyValueRow";
import Plate from "@/components/ui/Plate";
import { PriceOrQuote } from "@/components/ui/PriceFigure";
import Section, { SectionHead } from "@/components/ui/Section";
import { BRAND, NC_TINT_LAW, NEAREST_EXIT, SERVICES } from "@/lib/constants";
import { milesLong } from "@/lib/utils";

/* ============================================================================
   /window-tinting/

   Tint is the category with the most nonsense published in it, so this page's
   whole strategy is to be the one that prints the statute with a citation on
   every line. His old site promised "lifetime warranties" on films it never
   named, which is unenforceable and is one of the FORBIDDEN_CLAIMS the build
   audit fails on. Nothing here names a warranty that has not been verified.

   THE TRUST BAR EARNS ITS PLACE HERE. Tint is bought on trust and there is no
   way for a customer to check a tint shop's claims from the outside, so a row
   of credentials that each link out to the manufacturer's own directory is
   worth more on this page than on almost any other. It sits directly under
   the hero, which is where the reference sites run theirs.
   ========================================================================== */

const SERVICE = SERVICES.find((s) => s.id === "window-tinting")!;

/** What actually moves a tint number. None of it is how dark you want it,
    which is the thing most people assume and the thing the statute settles. */
const DRIVERS = [
  {
    k: "How many windows",
    v: "A two door coupe and a crew cab with a sunroof are not the same amount of glass, and glass is what tint is priced on.",
  },
  {
    k: "The shape of the back glass",
    v: "Back glass is heat shaped to its curve before it goes on, because a flat sheet will not lie down on curved glass. The deeper the curve, the longer that takes.",
  },
  {
    k: "Which film",
    v: "Laminate and ceramic film cost differently and behave differently in July. Both are held to the same standard by the statute, so the choice is about heat and longevity rather than about darkness.",
  },
  {
    k: "Whether there is film on it now",
    v: "Glass that already has film on it is a different starting point from bare glass, so say which one you have.",
  },
];

/* 157 characters. */
const DESCRIPTION =
  `Window tinting in ${BRAND.city}, ${BRAND.stateName}. Laminate and ceramic ` +
  `film to the ${NC_TINT_LAW.statute} limit, the statute printed on the page, ` +
  `priced on your vehicle.`;

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
        description={`Laminate and ceramic automotive window film installed at ${BRAND.name}, ${BRAND.addressLine}, to the ${BRAND.stateName} light transmission limit set by ${NC_TINT_LAW.statute}.`}
        url="/window-tinting/"
        serviceType="Automotive window tinting"
      />

      <Breadcrumbs
        plane="sheet"
        trail={[{ label: SERVICE.name, href: SERVICE.href }]}
      />

      <Section plane="sheet" label={`${SERVICE.index} ${SERVICE.name}`}>
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-7">
            <h1 className="ps-display ps-display-xl">
              Window tinting in {BRAND.city}
            </h1>

            <div className="ps-prose mt-6">
              <p>
                Petty Shine installs laminate and ceramic window film on cars
                and trucks at {BRAND.street} in {BRAND.city}, {BRAND.stateName},{" "}
                {milesLong(NEAREST_EXIT.miles)} off {NEAREST_EXIT.label}.
              </p>
              <p>
                Most tint questions turn out to be law questions. North
                Carolina sets one standard for every window except the
                windshield, and it does not get looser for the back glass. The
                statute is printed further down this page with the citation on
                every line, so you can check it against what any shop tells
                you.
              </p>
              <p>
                Tint is quoted on the vehicle, and the number goes to you in
                writing before any work starts.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {/* The primary action, and it was missing. The hero ran two
                  ghost buttons, so the first solid thing on the page was the
                  submit inside the form near the foot of it. */}
              <Button href="#quote" tone="cyan">
                Get a price on your vehicle
              </Button>
              <Button href="#nc-law" tone="ghost">
                Read the {BRAND.stateName} limits
              </Button>
              <PhoneLink
                placement="window-tinting-hero"
                className="ps-btn ps-btn--ghost"
              >
                Call {BRAND.phoneDisplay}
              </PhoneLink>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-5">
            <Plate
              id="coating-g-wagon"
              priority
              caption={`In the shop, ${BRAND.city} ${BRAND.state}`}
              sizes="(min-width: 1024px) 32rem, 100vw"
            />

            <KeyValueList className="mt-8" label="Window tinting at a glance">
              <KeyValueRow
                k="Price"
                v={<PriceOrQuote service={SERVICE.quoteKey} value={null} />}
                strong
              />
              <KeyValueRow k="Film" v="Laminate or ceramic" />
              <KeyValueRow k="Legal standard" v={NC_TINT_LAW.statute} />
              <KeyValueRow k="Shop" v={BRAND.addressLine} />
              <KeyValueRow k="Hours" v={BRAND.hoursShort} />
            </KeyValueList>
          </div>
        </div>
      </Section>

      {/* The hairline row the reference runs directly under the hero.
          Pulled up into the hero section's bottom padding, because the
          reference runs it tight under the copy and a full section gap
          above it turns a trust row into a floating band. Nothing in
          .trustbar sets margin, so the utility is not fighting an
          unlayered rule. */}
      <TrustBar plane="sheet" className="-mt-6 md:-mt-10" />

      <Section plane="shop" label="In the shop">
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
              id="coating-challenger-demon"
              caption="Widebody Challenger outside the shop"
              sizes="(min-width: 1024px) 45rem, 100vw"
            />
          </div>
        </div>
      </Section>

      <Section plane="sheet" id="nc-law" label="North Carolina law">
        <SectionHead
          title="What North Carolina actually allows"
          intro={<p>{NC_TINT_LAW.myth}</p>}
        />

        {/* The statute sits in a column rather than running the full
            1240px, because its values are short and a full width table of
            short values is mostly empty paper. The commentary that used to
            sit under it now sits beside it, which is what fills the room a
            two column band opens up. */}
        <div className="mt-8 grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-7">
            <div className="ps-prose">
              <p>
                That one gets published wrong on tint pages all over this
                state, usually as a promise that the rear glass can go as dark
                as you like. It cannot. The limits below are the statute, not
                our policy, and we do not install darker than they allow.
              </p>
            </div>

            <KeyValueList
              className="mt-7"
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
          </div>

          <div className="min-w-0 lg:col-span-5">
            <h3 className="ps-heading text-lg">The two rows that matter</h3>
            <div className="ps-prose mt-4">
              <p>
                The meter tolerance is why a 35% film that meters a little low
                still passes, because the statute treats anything above 32% as
                legal.
              </p>
              <p>
                The windshield row is why the only tint on the glass in front
                of you is the top strip. Clear film is the exception there, and
                the statute names it.
              </p>
              <p>
                Every citation above is to {NC_TINT_LAW.statute}, so you can
                check any of it against what another shop tells you.
              </p>
            </div>
          </div>
        </div>

        <CTABand
          variant="line"
          service={SERVICE.quoteKey}
          ctaLabel="Get a price on your vehicle"
          body="Send us the year, make and model and what you want done to the glass."
          className="mt-10"
        />
      </Section>

      {/* ---------------------------------------------------------------
          WHAT MOVES THE NUMBER. Nothing on this page is priced, so this
          is what a visitor gets instead of a figure, and it is the more
          useful half of the answer.
          --------------------------------------------------------------- */}
      <Section plane="shop" label="What tint is priced on">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              title="Priced by the glass, not by the darkness."
              intro={
                <p>
                  How dark a window ends up is settled by the statute, so it is
                  the one thing on this list that does not move the number.
                  These are the things that do.
                </p>
              }
            />

            <div className="ps-prose mt-6">
              <p>
                What moves a price on every other service here, and what
                happens when the vehicle is in front of us, is set out on{" "}
                <Link href="/pricing/" className="link-inline">
                  what it costs, and how we quote it
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <KeyValueList label="What moves a window tint price">
              {DRIVERS.map((row) => (
                <KeyValueRow key={row.k} k={row.k} v={row.v} mono={false} />
              ))}
            </KeyValueList>
          </div>
        </div>
      </Section>

      <Section plane="sheet" label="Film and warranty" id="quote">
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

            <SpecificationPending className="mt-7" />

            <div className="ps-prose mt-6">
              <p>
                What is actually guaranteed on every service here, and who
                issues it, is on{" "}
                <Link href="/warranties/" className="link-inline">
                  the warranties page
                </Link>
                . Film for the paint rather than for the glass is{" "}
                <Link href="/paint-protection-film/" className="link-inline">
                  paint protection film
                </Link>
                .
              </p>
            </div>

            <PhoneLink
              placement="window-tinting-spec"
              className="mt-7 flex min-w-0 items-center justify-between gap-4 border border-rule-light bg-sheet-060 px-5 py-4 transition-colors hover:border-cyan-500"
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
