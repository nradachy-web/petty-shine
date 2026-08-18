import type { Metadata } from "next";

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

const SERVICE = SERVICES.find((s) => s.id === "paintless-dent-repair")!;

/**
 * This route takes competitor brand traffic. People searching a dent chain
 * by name land here, so the page answers one question first: can you fix
 * mine, and what does that involve. Nothing is priced, because nothing is
 * published, so the whole page runs to the inline form.
 */
const SUITS = [
  {
    k: "Door dings",
    v: "The dimple left by the car parked too close, usually along the middle of a door.",
  },
  {
    k: "Hail damage",
    v: "A hood or a roof full of small round dents with the paint still whole.",
  },
  {
    k: "Parking lot dents",
    v: "Cart hits and knee height dents in a door or a quarter panel.",
  },
  {
    k: "Soft edged dents",
    v: "A dent that rolls into the panel rather than folding it, with nothing broken through the clear coat.",
  },
];

const STOPS = [
  {
    k: "Cracked or chipped paint",
    v: "Once the paint is broken the panel needs refinishing. Paintless work moves metal, it does not put paint back.",
  },
  {
    k: "A sharp crease",
    v: "A crease stretches the metal. It can come a long way back and it will not read as untouched.",
  },
  {
    k: "No access behind it",
    v: "Some dents sit over a brace or on the edge of a panel, where there is no way in from the back.",
  },
  {
    k: "Filler under the paint",
    v: "A panel that has been repaired before does not move the way bare metal moves.",
  },
];

export const metadata: Metadata = {
  title: "Paintless Dent Repair in Randleman, NC",
  description: `Paintless dent repair at ${BRAND.name} in ${BRAND.city}, ${BRAND.state}. Door dings, hail and parking lot dents worked out from behind the panel, paint left alone.`,
  alternates: { canonical: "/paintless-dent-repair/" },
};

export default function PaintlessDentRepairPage() {
  return (
    <>
      <ServiceSchema
        name={SERVICE.name}
        description="Paintless dent repair on door dings, hail damage and parking lot dents, worked out from behind the panel with the original paint left intact."
        url={SERVICE.href}
        serviceType="Paintless Dent Repair"
      />

      <Breadcrumbs
        plane="sheet"
        trail={[{ label: SERVICE.name, href: SERVICE.href }]}
      />

      <Section plane="sheet" label={`${SERVICE.index} ${SERVICE.name}`}>
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-7">
            <h1 className="ps-display ps-display-lg">Paintless dent repair</h1>

            <div className="ps-prose mt-6">
              <p>
                We take dents out from behind the panel. The metal is worked
                back to where it started and the factory paint stays on the car,
                so nothing gets filled and nothing gets resprayed.
              </p>
              <p>
                It suits some damage and not other damage. The two tables below
                say which is which. If yours falls on the wrong side of that
                line, we would rather tell you now than after the car is here.
              </p>
            </div>

            <div className="mt-8">
              <Button href="#quote" tone="ghost">
                Tell us about the dent
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-5">
            <PhoneLink
              placement="pdr-hero"
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

            <KeyValueList className="mt-8" label="Dent repair details">
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

      <Section plane="shop" label="Reading the panel" className="plane-arc">
        <SectionHead
          title="A dent shows up in the reflection."
          intro={
            <p>
              Straight lines are what give one away. A panel that looks flat
              under the lights will bend a reflection the moment you move your
              head, and that bend is how deep the dent goes.
            </p>
          }
        />
        <div className="mt-10">
          <Plate
            id="detail-f250-black"
            priority
            bleed
            caption="Ford F-250 Super Duty, Randleman shop"
          />
        </div>
      </Section>

      <Section plane="sheet" label="Suitability" className="plane-arc">
        <SectionHead
          title="What comes out, and what does not."
          intro={
            <p>
              Paintless work needs two things: paint that is still intact, and a
              way in behind the panel. Lose either one and it becomes a
              different repair.
            </p>
          }
        />

        <div className="mt-10 grid min-w-0 gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="min-w-0">
            <h3 className="ps-heading text-lg">Damage this suits</h3>
            <KeyValueList className="mt-5" label="Damage paintless repair suits">
              {SUITS.map((row) => (
                <KeyValueRow key={row.k} k={row.k} v={row.v} mono={false} />
              ))}
            </KeyValueList>
          </div>

          <div className="min-w-0">
            <h3 className="ps-heading text-lg">Where it stops</h3>
            <KeyValueList className="mt-5" label="Where paintless repair stops">
              {STOPS.map((row) => (
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

        <div className="ps-prose mt-9 max-w-2xl">
          <p>
            A dent on the second table is not a dead end, it just stops being
            paintless. Send it through anyway and we will tell you what it
            actually needs.
          </p>
        </div>
      </Section>

      <Section plane="shop" label="Get a price" id="quote" className="plane-arc">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="There is no price list for a dent."
              intro={
                <p>
                  What it costs comes down to how deep the dent is and which
                  panel it sits on. One ding in a door is not the same job as a
                  hood after a hailstorm, so we price the car in front of us.
                </p>
              }
            />

            <div className="ps-prose mt-6">
              <p>
                Put the panel and roughly how big it is in the message box. That
                is usually enough to come back with a number.
              </p>
            </div>

            <div className="mt-8">
              <PhoneLink placement="pdr-quote" className="ps-btn ps-btn--ghost">
                Call {BRAND.phoneDisplay}
              </PhoneLink>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <QuoteForm
              service={SERVICE.quoteKey}
              lockService
              heading="Tell us about the dent"
              intro="Year, make and model, then where the dent is and roughly how big. It goes straight to the shop."
              source="/paintless-dent-repair/"
              id="quote-form"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
