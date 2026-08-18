import type { Metadata } from "next";

import { PpfCoveragePlan, SpecificationPending } from "@/components/ppf";
import QuoteForm from "@/components/quote/QuoteForm";
import ServiceSchema from "@/components/seo/ServiceSchema";
import PhoneLink from "@/components/tracking/PhoneLink";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import DatumRule from "@/components/ui/DatumRule";
import KeyValueRow, { KeyValueList } from "@/components/ui/KeyValueRow";
import Plate from "@/components/ui/Plate";
import QuoteLink from "@/components/ui/QuoteLink";
import Section, { SectionHead } from "@/components/ui/Section";
import { BRAND, CREDENTIALS, PPF_FILM, SERVICES } from "@/lib/constants";

const SERVICE = SERVICES.find((s) => s.id === "paint-protection-film")!;
const STEK = CREDENTIALS.find((c) => c.id === "stek")!;

/* 155 characters, inside what Google shows on a phone. Also the ServiceSchema
   description below, which is why it is one string and not two. */
const DESCRIPTION =
  "STEK paint protection film in Randleman, North Carolina. See which panels each of the four coverage levels puts film on, then get a price for your vehicle.";

export const metadata: Metadata = {
  title: `${SERVICE.name} in ${BRAND.city}, ${BRAND.state}`,
  description: DESCRIPTION,
  alternates: { canonical: "/paint-protection-film/" },
};

export default function PaintProtectionFilmPage() {
  return (
    <>
      <ServiceSchema
        name={SERVICE.name}
        description={DESCRIPTION}
        url="/paint-protection-film/"
        serviceType="Paint protection film installation"
      />

      <Breadcrumbs
        plane="sheet"
        trail={[{ label: SERVICE.name, href: SERVICE.href }]}
      />

      <Section plane="sheet" label={`${SERVICE.index} ${SERVICE.name}`}>
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-6">
            <h1 className="ps-display ps-display-lg">{SERVICE.name}</h1>

            <div className="ps-prose mt-6">
              <p>
                Paint protection film is clear urethane laid over the panels
                that take the damage. Rocks and road grit hit the film. The
                paint under it stays the paint the car was built with.
              </p>
              <p>
                It is not a coating and it is not a wax. A coating is chemistry
                bonded to the clear coat. Film is a physical layer thick enough
                to absorb an impact, and it is meant to be replaced once it has
                taken enough of them.
              </p>
              <p>
                So the first real question is which panels it goes on. The
                drawing below answers that, one coverage level at a time.
              </p>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-6">
            <KeyValueList label="Details">
              <KeyValueRow
                k="Price"
                v={<QuoteLink service={SERVICE.quoteKey} />}
                tone="pewter"
              />
              <KeyValueRow k="Installer" v={STEK.label} />
              <KeyValueRow k="Shop" v={BRAND.addressLine} />
              <KeyValueRow k="Hours" v={BRAND.hoursShort} />
            </KeyValueList>

            <div className="mt-8">
              <PhoneLink placement="ppf-hero" className="ps-btn ps-btn--ghost">
                Call {BRAND.phoneDisplay}
              </PhoneLink>
            </div>
          </div>
        </div>
      </Section>

      <Section plane="shop" label="Coverage" className="plane-arc">
        <SectionHead
          title="What the film actually covers."
          intro="Four coverage levels, each one a strict superset of the one below it. Pick a level and the drawing shows exactly which panels get film and which are left bare."
        />
        <div className="mt-10">
          <PpfCoveragePlan />
        </div>
      </Section>

      <Section plane="sheet" label="The film" className="plane-arc">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="We are an Authorized STEK installer."
              intro={<p>{STEK.body}</p>}
            />

            <div className="ps-prose mt-5">
              <p>
                The table is STEK&rsquo;s published specification for
                DYNOshield. STEK builds more than one film, so which one goes
                on your vehicle, and what backs it, is settled in writing
                before any work starts.
              </p>
            </div>

            <div className="mt-7">
              <Button href="/warranties/" tone="ghost" size="sm">
                What is actually guaranteed
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <DatumRule
              label={`${PPF_FILM.brand} ${PPF_FILM.product}`}
              className="mb-7"
            />
            <KeyValueList label={`${PPF_FILM.brand} ${PPF_FILM.product}`}>
              {PPF_FILM.specs.map((spec) => (
                <KeyValueRow key={spec.key} k={spec.key} v={spec.value} />
              ))}
            </KeyValueList>

            <SpecificationPending className="mt-8" />
          </div>
        </div>

        <DatumRule label="What film does not do" className="mt-14 mb-7" />

        <ul className="min-w-0">
          {PPF_FILM.limits.map((limit) => (
            <li
              key={limit}
              className="flex min-w-0 gap-4 border-b border-rule-light py-5"
            >
              <span
                className="mt-3 h-px w-3.5 flex-none bg-cyan-500"
                aria-hidden
              />
              <span className="min-w-0 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-600">
                {limit}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section plane="shop" label="The work" className="plane-arc">
        <SectionHead
          size="md"
          title="This is what it looks like going on."
          intro={
            <p>
              Film goes on wet and gets squeegeed down by hand, one panel at a
              time. Every vehicle on this page came through the shop on Branson
              Mill Road.
            </p>
          }
        />

        <div className="mt-7">
          <Button href="/gallery/" tone="ghost">
            See more of the work
          </Button>
        </div>

        {/* A contact sheet, bottom aligned. None of these three ids are in
            BLEED_CLEARED, and ppf-mclaren-gt is a 960px source, so the widest
            any of them is asked to render is roughly a third of the shell. */}
        <div className="mt-11 grid min-w-0 gap-8 sm:grid-cols-2 sm:items-end lg:grid-cols-3">
          <Plate
            id="ppf-install-closeup"
            className="min-w-0"
            caption="Film squeegeed down on a black panel"
            sizes="(min-width: 1024px) 23rem, (min-width: 640px) 45vw, 100vw"
          />
          <Plate
            id="ppf-jeep-install"
            className="min-w-0"
            caption="Hood film going on, Jeep"
            sizes="(min-width: 1024px) 23rem, (min-width: 640px) 45vw, 100vw"
          />
          <Plate
            id="ppf-mclaren-gt"
            className="min-w-0"
            caption="McLaren GT, in the shop"
            sizes="(min-width: 1024px) 23rem, (min-width: 640px) 45vw, 100vw"
          />
        </div>
      </Section>

      <Section plane="sheet" label="Get a price" className="plane-arc">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="Tell us the vehicle and we will price it."
              intro={
                <p>
                  There is no published price for film because the panel count
                  and the size of the vehicle decide it. Send the year, make
                  and model with the coverage level you want and we will come
                  back with a number for that car.
                </p>
              }
            />

            <PhoneLink
              placement="ppf-page"
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
              source="/paint-protection-film/"
              id="quote-form"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
