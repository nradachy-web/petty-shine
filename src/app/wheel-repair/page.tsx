import type { Metadata } from "next";
import Link from "next/link";

import QuoteForm from "@/components/quote/QuoteForm";
import ServiceSchema from "@/components/seo/ServiceSchema";
import PhoneLink from "@/components/tracking/PhoneLink";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import KeyValueRow, { KeyValueList } from "@/components/ui/KeyValueRow";
import Plate from "@/components/ui/Plate";
import QuoteLink from "@/components/ui/QuoteLink";
import Section, { SectionHead } from "@/components/ui/Section";
import { BRAND, SERVICES } from "@/lib/constants";

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

export const metadata: Metadata = {
  title: "Curbed Wheel Repair in Randleman, NC",
  description: `Curbed wheel repair, wheel refinishing and brake caliper refinishing at ${BRAND.name} in ${BRAND.city}, ${BRAND.state}. Tell us what the wheel looks like and we price it.`,
  alternates: { canonical: "/wheel-repair/" },
};

export default function WheelRepairPage() {
  return (
    <>
      <ServiceSchema
        name={SERVICE.name}
        description="Curbed wheel repair, wheel refinishing and brake caliper refinishing, done with the wheels off the vehicle."
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
            <h1 className="ps-display ps-display-lg">
              Curbed wheel repair and refinishing
            </h1>

            <div className="ps-prose mt-6">
              <p>
                Curb rash gets repaired and refinished so the face of the wheel
                reads clean again. While the wheels are off, the calipers behind
                them can be refinished at the same time.
              </p>
              <p>
                Nothing here has a published price. One scuffed face and four
                wheels in a new color are not the same job, so we look at the
                wheels before we put a number on them.
              </p>
            </div>

            <div className="mt-8">
              <Button href="#quote" tone="ghost">
                Send us the wheel
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-5">
            <PhoneLink
              placement="wheel-repair-hero"
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

            <KeyValueList className="mt-8" label="Wheel repair details">
              <KeyValueRow
                k="Price"
                v={<QuoteLink service={SERVICE.quoteKey} />}
                tone="pewter"
              />
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

      <Section plane="shop" label="Wheels off" className="plane-arc">
        <SectionHead
          title="The wheels come off the car."
          intro={
            <p>
              A curbed face is repaired properly with the wheel off and the
              barrel clean. It is also the only time the inside of the wheel and
              the caliper behind it are both reachable.
            </p>
          }
        />
        <div className="mt-10">
          <Plate
            id="wheels-mustang"
            priority
            bleed
            caption="Wheels off, Mustang, Randleman shop"
          />
        </div>
      </Section>

      <Section plane="sheet" label="The work" className="plane-arc">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              title="Three jobs, one set of wheels."
              intro={
                <p>
                  All three need the wheel off the car, so they are worth
                  deciding on together rather than one at a time.
                </p>
              }
            />

            <div className="ps-prose mt-6">
              <p>
                Wheel coating is a separate thing again. It is one of the add
                ons on the{" "}
                <Link href="/ceramic-coating/">ceramic coating</Link> page.
              </p>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <KeyValueList label="Wheel and caliper work">
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
        </div>
      </Section>

      <Section plane="shop" label="Get a price" id="quote" className="plane-arc">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="Tell us what the wheel looks like."
              intro={
                <p>
                  How far the rash goes, whether it is one wheel or the set, and
                  what finish the wheel started as. That is enough to come back
                  with a number.
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
