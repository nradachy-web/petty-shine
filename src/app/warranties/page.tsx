import type { Metadata } from "next";

import { SpecificationPending } from "@/components/ppf";
import QuoteForm from "@/components/quote/QuoteForm";
import PhoneLink from "@/components/tracking/PhoneLink";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import DatumRule from "@/components/ui/DatumRule";
import KeyValueRow, { KeyValueList } from "@/components/ui/KeyValueRow";
import Plate from "@/components/ui/Plate";
import Section, { SectionHead } from "@/components/ui/Section";
import {
  BRAND,
  COATINGS,
  CREDENTIALS,
  GTECHNIQ_FACTS,
  PPF_FILM,
} from "@/lib/constants";

const GTECHNIQ = CREDENTIALS.find((c) => c.id === "gtechniq")!;

/* 153 characters, inside what Google shows on a phone. */
const DESCRIPTION =
  "What a Gtechniq coating guarantee covers, in its own terms. Who issues it, how you register it, the inspection it requires, and why it does not transfer.";

export const metadata: Metadata = {
  title: "Coating and Film Guarantees",
  description: DESCRIPTION,
  alternates: { canonical: "/warranties/" },
};

export default function WarrantiesPage() {
  return (
    <>
      <Breadcrumbs
        plane="sheet"
        trail={[{ label: "Guarantees", href: "/warranties/" }]}
      />

      <Section plane="sheet" label="Guarantees">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-6">
            <h1 className="ps-display ps-display-lg">
              What is actually covered, and what is not.
            </h1>

            <div className="ps-prose mt-6">
              <p>
                A ceramic coating guarantee is issued by the manufacturer, not
                by the shop that applies it. It carries conditions, and the
                conditions are where these things come apart.
              </p>
              <p>
                Every term on this page is Gtechniq&rsquo;s own. We publish
                them here so you can read them before you spend the money
                rather than after.
              </p>
            </div>

            <div className="mt-8">
              <PhoneLink
                placement="warranties-hero"
                className="ps-btn ps-btn--ghost"
              >
                Call {BRAND.phoneDisplay}
              </PhoneLink>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-6">
            <DatumRule label="Guarantee term by coating" className="mb-7" />
            <KeyValueList label="Guarantee term by coating">
              {COATINGS.map((coating) => (
                <KeyValueRow
                  key={coating.id}
                  k={coating.name}
                  v={coating.guarantee}
                  note={"subtitle" in coating ? coating.subtitle : undefined}
                />
              ))}
            </KeyValueList>

            <div className="mt-7">
              <Button href="/ceramic-coating/" tone="ghost" size="sm">
                Every coating tier and what it costs
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <Section plane="shop" label="Accreditation" className="plane-arc">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:items-end lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="Gtechniq issues the guarantee. We apply the coating."
              intro={<p>{GTECHNIQ_FACTS.proOnly}</p>}
            />

            <KeyValueList className="mt-8" label="Credential">
              <KeyValueRow k="Listed as" v={GTECHNIQ.label} />
              <KeyValueRow k="Shop" v={BRAND.addressLine} />
            </KeyValueList>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <Plate
              id="coating-huracan"
              caption={`Ceramic coating, ${BRAND.city} ${BRAND.state}`}
              sizes="(min-width: 1024px) 40rem, 100vw"
            />
          </div>
        </div>
      </Section>

      <Section plane="sheet" label="The conditions" className="plane-arc">
        <SectionHead
          title="Read these before you spend the money."
          intro={
            <p>
              These are the conditions Gtechniq attaches to its coating
              guarantee. None of them are ours to waive, so we would rather you
              saw them here than found them at a claim.
            </p>
          }
        />

        <KeyValueList
          className="mt-10 max-w-3xl"
          label="Gtechniq guarantee terms"
        >
          {GTECHNIQ_FACTS.guaranteeTerms.map((term) => (
            <KeyValueRow
              key={term.key}
              k={term.key}
              v={term.value}
              mono={false}
            />
          ))}
        </KeyValueList>

        <DatumRule label="What a guarantee is not" className="mt-14 mb-7" />

        <div className="ps-prose max-w-2xl">
          <p>{GTECHNIQ_FACTS.maintenanceNote}</p>
        </div>
      </Section>

      <Section plane="shop" label="Paint protection film" className="plane-arc">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="Film has no term on this page yet."
              intro={
                <p>
                  We install {PPF_FILM.brand} film. We are not printing a film
                  warranty term here until it has been verified for the vehicle
                  it applies to, because a term you cannot hold anyone to is
                  worth nothing at a claim.
                </p>
              }
            />

            <div className="mt-7">
              <Button href="/paint-protection-film/" tone="ghost" size="sm">
                What each coverage level covers
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <SpecificationPending />

            <ul className="mt-8 min-w-0">
              {PPF_FILM.limits.map((limit) => (
                <li
                  key={limit}
                  className="flex min-w-0 gap-4 border-b border-rule-dark py-5"
                >
                  <span
                    className="mt-3 h-px w-3.5 flex-none bg-cyan-500"
                    aria-hidden
                  />
                  <span className="min-w-0 text-[0.9375rem] leading-relaxed text-ink-300">
                    {limit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section plane="sheet" label="Get it in writing" className="plane-arc">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="Ask us for the terms before you book."
              intro={
                <p>
                  Send the vehicle and what you want done. We will come back
                  with a price and the guarantee that goes with it, in writing,
                  before anything is scheduled.
                </p>
              }
            />

            <PhoneLink
              placement="warranties-page"
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
              heading={null}
              intro={null}
              source="/warranties/"
              id="quote-form"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
