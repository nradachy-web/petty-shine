import type { Metadata } from "next";
import Link from "next/link";

import QuoteForm from "@/components/quote/QuoteForm";
import ServiceSchema from "@/components/seo/ServiceSchema";
import PhoneLink from "@/components/tracking/PhoneLink";
import CTABand from "@/components/sections/CTABand";
import TrustBar from "@/components/sections/TrustBar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import KeyValueRow, { KeyValueList } from "@/components/ui/KeyValueRow";
import Plate from "@/components/ui/Plate";
import { PriceOrQuote } from "@/components/ui/PriceFigure";
import Section, { SectionHead } from "@/components/ui/Section";
import { BRAND, NEAREST_EXIT, QUOTE_CTA_LABEL, SERVICES } from "@/lib/constants";
import { milesLong } from "@/lib/utils";

/* ============================================================================
   /wheel-repair/

   Nothing here has ever had a published price, so this page has always been
   quote only and private pricing mode changes nothing about it. What it did
   need is the thing every quote only page needs: a reason to believe the
   quote will be fair, given in substance rather than in adjectives. That is
   what the two record blocks below do. They say what the three jobs actually
   are and what will change the answer, before anybody is asked for a phone
   number.
   ========================================================================== */

const SERVICE = SERVICES.find((s) => s.id === "wheel-repair")!;

/** The three jobs he lists under this heading. No published price on any of them. */
const WORK = [
  {
    k: "Curbed wheel repair",
    v: "The scraped face is repaired and refinished, then blended back to the rest of the wheel.",
  },
  {
    k: "Wheel refinishing",
    v: "The finish itself is redone. A color change lives here, and that is normally a set of four rather than one.",
  },
  {
    k: "Brake caliper refinishing",
    v: "Calipers cleaned back and refinished while the wheels are already off the car.",
  },
];

const BEFORE = [
  {
    k: "Bent or cracked wheels",
    v: "That is structural rather than cosmetic. Tell us what happened and we will look at it before anything is scheduled.",
  },
  {
    k: "One wheel or all four",
    v: "A single repair is finished to match the other three as closely as the finish allows. A color change is a set.",
  },
  {
    k: "The car stays here",
    v: "Wheels come off for this work, so plan on leaving the vehicle with us rather than waiting on it.",
  },
];

/** What actually moves the number, so the absence of a price reads as
    honesty rather than as a hidden one. */
const DRIVERS = [
  {
    k: "How far the rash goes",
    v: "A light scuff on the outer lip and damage that has taken material off the face are different amounts of work.",
  },
  {
    k: "What the finish started as",
    v: "Painted, machined, polished and powder coated wheels do not all refinish the same way, and the original finish is what the repair has to match.",
  },
  {
    k: "One wheel or a set",
    v: "Matching one repair into three untouched wheels is a different job from taking all four to the same new finish.",
  },
];

/* 156 characters. */
const DESCRIPTION =
  `Curbed wheel repair, wheel refinishing and brake caliper refinishing at ` +
  `${BRAND.name} in ${BRAND.city}, ${BRAND.state}. Tell us what the wheel ` +
  `looks like and we price it.`;

export const metadata: Metadata = {
  title: `Curbed Wheel Repair in ${BRAND.city}, ${BRAND.state}`,
  description: DESCRIPTION,
  alternates: { canonical: "/wheel-repair/" },
};

export default function WheelRepairPage() {
  return (
    <>
      <ServiceSchema
        name={SERVICE.name}
        description={`Curbed wheel repair, wheel refinishing and brake caliper refinishing at ${BRAND.name}, ${BRAND.addressLine}, done with the wheels off the vehicle.`}
        url={SERVICE.href}
        serviceType="Wheel Repair"
      />

      <Breadcrumbs
        plane="sheet"
        trail={[{ label: SERVICE.name, href: SERVICE.href }]}
      />

      <Section plane="sheet" label={`${SERVICE.index} ${SERVICE.name}`}>
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-7">
            <h1 className="ps-display ps-display-xl">
              Curbed wheel repair in {BRAND.city}
            </h1>

            <div className="ps-prose mt-6">
              <p>
                Petty Shine repairs curbed wheels at {BRAND.street} in{" "}
                {BRAND.city}, {BRAND.stateName},{" "}
                {milesLong(NEAREST_EXIT.miles)} off {NEAREST_EXIT.label}.
              </p>
              <p>
                Curb rash gets repaired and refinished so the face of the wheel
                reads clean again. While the wheels are off, the calipers
                behind them can be refinished at the same time.
              </p>
              <p>
                Nothing here has a published price. One scuffed face and four
                wheels going to a new color are not the same job, so we look
                at the wheels before we put a number on them, and the number
                goes to you in writing before any work starts.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="#quote" tone="cyan">
                Send us the wheel
              </Button>
              <PhoneLink
                placement="wheel-repair-hero"
                className="ps-btn ps-btn--ghost"
              >
                Call {BRAND.phoneDisplay}
              </PhoneLink>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-5">
            <KeyValueList label="Wheel repair at a glance">
              <KeyValueRow
                k="Price"
                v={<PriceOrQuote service={SERVICE.quoteKey} value={null} />}
                strong
              />
              <KeyValueRow
                k="Wheels"
                v="Off the vehicle for every job here"
                mono={false}
              />
              <KeyValueRow k="Shop" v={BRAND.addressLine} />
              <KeyValueRow k="Hours" v={BRAND.hoursShort} />
            </KeyValueList>

            <PhoneLink
              placement="wheel-repair-panel"
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
        </div>
      </Section>

      {/* The trust row sits tight under the hero, the way it does on the
          other service pages and the way the reference site runs it. The
          negative margin pulls it up out of the section gap, because a
          full gap above it turns a trust row into a floating band. */}
      <TrustBar plane="sheet" className="-mt-6 md:-mt-10" />

      <Section plane="shop" label="Wheels off">
        <SectionHead
          align="split"
          title="The wheels come off the car."
          intro={
            <p>
              A curbed face is repaired properly with the wheel off and the
              barrel clean. It is also the only time the inside of the wheel
              and the caliper behind it are both reachable.
            </p>
          }
        />
        <div className="mt-9 md:mt-11">
          <Plate
            id="wheels-mustang"
            priority
            bleed
            caption={`Wheels off, Mustang, ${BRAND.city} shop`}
          />
        </div>
      </Section>

      {/* Three record blocks split across two columns rather than stacked
          in one. Stacked, the left column ran out of copy roughly 480px
          above the bottom of the right one, which is exactly the dead
          vertical space DIRECTION-V2 section 3 calls out. */}
      <Section plane="sheet" label="The work">
        <SectionHead
          align="split"
          title="Three jobs, one set of wheels."
          intro={
            <p>
              All three need the wheel off the car, so they are worth deciding
              on together rather than one at a time. What each one costs turns
              on the wheel itself, which is the second list.
            </p>
          }
        />

        <div className="mt-9 grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14 md:mt-11">
          <div className="min-w-0 lg:col-span-6">
            <h3 className="ps-heading text-lg">Wheel and caliper work</h3>
            <KeyValueList className="mt-5" label="Wheel and caliper work">
              {WORK.map((row) => (
                <KeyValueRow key={row.k} k={row.k} v={row.v} mono={false} />
              ))}
            </KeyValueList>

            <h3 className="ps-heading mt-10 text-lg">Before you book</h3>
            <KeyValueList className="mt-5" label="Before you book">
              {BEFORE.map((row) => (
                <KeyValueRow
                  key={row.k}
                  k={row.k}
                  v={row.v}
                  mono={false}
                  tone="pewter"
                />
              ))}
            </KeyValueList>
          </div>

          <div className="min-w-0 lg:col-span-6">
            <h3 className="ps-heading text-lg">What moves the number</h3>
            <KeyValueList className="mt-5" label="What moves a wheel repair price">
              {DRIVERS.map((row) => (
                <KeyValueRow key={row.k} k={row.k} v={row.v} mono={false} />
              ))}
            </KeyValueList>

            <div className="ps-prose mt-9">
              <p>
                Wheel coating is a separate thing again. It is one of the
                add-ons on the{" "}
                <Link href="/ceramic-coating/" className="link-inline">
                  ceramic coating page
                </Link>
                , and it is worth asking about while the wheels are already
                off.
              </p>
              <p>
                If the paint is going to get attention at the same time, the{" "}
                <Link href="/auto-detailing/" className="link-inline">
                  detailing levels
                </Link>{" "}
                are the other half of that conversation, and{" "}
                <Link href="/pricing/" className="link-inline">
                  what it costs, and how we quote it
                </Link>{" "}
                covers how both get priced.
              </p>
            </div>
          </div>
        </div>

        <CTABand
          variant="line"
          className="mt-11"
          service={SERVICE.quoteKey}
          ctaLabel={QUOTE_CTA_LABEL}
          body="A photo of the wheel in the message answers most of this in one go."
        />
      </Section>

      {/* ---------------------------------------------------------------
          One primary action, one solid cyan button: the form submit.
          --------------------------------------------------------------- */}
      <Section plane="shop" label="Get a price" id="quote">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="Tell us what the wheel looks like."
              intro={
                <p>
                  How far the rash goes, whether it is one wheel or the set,
                  and what finish the wheel started as. That is enough to come
                  back with a number.
                </p>
              }
            />

            <div className="mt-8">
              <PhoneLink
                placement="wheel-repair-quote"
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
              heading="Get the wheels quoted"
              intro="Year, make and model, then what happened to the wheel. It goes straight to the shop."
              source="/wheel-repair/"
              id="quote-form"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
