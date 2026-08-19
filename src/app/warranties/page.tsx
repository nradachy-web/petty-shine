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
  REVIEWS,
} from "@/lib/constants";

const GTECHNIQ = CREDENTIALS.find((c) => c.id === "gtechniq")!;
const STEK = CREDENTIALS.find((c) => c.id === "stek")!;

/* The review about durability rather than about a finish, which is the thing
   a guarantee page is actually being read for. Matched on the review's own
   words so it cannot drift if the order in constants changes. */
const DURABILITY_REVIEW =
  REVIEWS.find((r) => r.text.includes("durability")) ?? REVIEWS[0];

/* 153 characters, inside what Google shows on a phone. No dollar figure. */
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
              {/* The who, what and where, in the first hundred words, as
                  plain sentences that survive being quoted on their own. */}
              <p>
                {BRAND.name} applies Gtechniq ceramic coatings and{" "}
                {PPF_FILM.brand} paint protection film at {BRAND.street} in{" "}
                {BRAND.city}, {BRAND.stateName}. A coating guarantee is issued
                by the manufacturer, not by the shop that applies it.
              </p>
              <p>
                It carries conditions, and the conditions are where these
                things come apart. Every term on this page is Gtechniq&rsquo;s
                own. We publish them here so you can read them before you spend
                the money rather than after.
              </p>
            </div>

            {/* Two ghost actions, not one. The call is for people who
                already know what they want; the anchor walks everyone
                else down to the form this page keeps promising. */}
            <div className="mt-8 flex flex-wrap gap-3">
              <PhoneLink
                placement="warranties-hero"
                className="ps-btn ps-btn--ghost"
              >
                Call {BRAND.phoneDisplay}
              </PhoneLink>
              <Button href="#quote-form" tone="ghost">
                Ask for the terms with your quote
              </Button>
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
              <KeyValueRow k="Issued by" v="Gtechniq" />
              <KeyValueRow k="Applied by" v={GTECHNIQ.label} />
            </KeyValueList>

            <div className="mt-7">
              <Button href="/ceramic-coating/" tone="ghost" size="sm">
                What is in each ceramic coating
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <Section plane="shop" label="Accreditation">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="Gtechniq issues the guarantee. We apply the coating."
              intro={<p>{GTECHNIQ_FACTS.proOnly}</p>}
            />

            <div className="ps-prose mt-6">
              <p>
                That is the part worth checking rather than taking anyone&rsquo;s
                word for. {BRAND.name} is listed at this address in{" "}
                <a href={GTECHNIQ.source} target="_blank" rel="noopener noreferrer">
                  Gtechniq&rsquo;s own detailer directory
                </a>{" "}
                and in{" "}
                <a href={STEK.source} target="_blank" rel="noopener noreferrer">
                  {PPF_FILM.brand} USA&rsquo;s installer directory
                </a>
                . Neither listing is ours to write.
              </p>
            </div>

            <KeyValueList className="mt-8" label="Credentials">
              <KeyValueRow k="Coating" v={GTECHNIQ.label} />
              <KeyValueRow k="Film" v={STEK.label} />
              <KeyValueRow k="Shop" v={BRAND.addressLine} />
            </KeyValueList>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <Plate
              id="coating-huracan"
              caption={`Ceramic coating, ${BRAND.city} ${BRAND.state}`}
              sizes="(min-width: 1024px) 40rem, 100vw"
            />

            {/* Social proof next to the claim it supports: this is the one
                review that talks about how the coating behaved a month
                later, which is what a guarantee page is read for. */}
            <blockquote className="mt-9 min-w-0 border-t border-rule-dark pt-7">
              <span aria-hidden className="block h-px w-6 bg-cyan-500" />
              <p className="mt-5 text-[1.0625rem] leading-relaxed text-spec-000">
                {DURABILITY_REVIEW.text}
              </p>
              <footer className="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-1 font-mono text-[0.6875rem] uppercase tracking-[0.18em]">
                <span className="text-spec-000">{DURABILITY_REVIEW.name}</span>
                <span className="text-ink-300">{DURABILITY_REVIEW.service}</span>
                <a
                  href={BRAND.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap-24 text-cyan-300 underline underline-offset-4"
                >
                  Read it on Google
                </a>
              </footer>
            </blockquote>
          </div>
        </div>
      </Section>

      <Section plane="sheet" label="The conditions">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="Read these before you spend the money."
              intro={
                <p>
                  These are the conditions Gtechniq attaches to its coating
                  guarantee. None of them are ours to waive, so we would rather
                  you saw them here than found them at a claim.
                </p>
              }
            />

            <div className="ps-prose mt-6">
              <p>{GTECHNIQ_FACTS.maintenanceNote}</p>
              <p>
                The two that catch people out are the inspection and the
                transfer. The guarantee is registered to you and not to the
                car, so selling the vehicle ends it, and a missed annual
                inspection ends the paint protection part of it outright.
              </p>
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
          </div>
        </div>
      </Section>

      <Section plane="shop" label="Paint protection film">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            {/* The headline leads with the promise. The reason the term is
                absent from the page still gets said, in the intro, where it
                reads as diligence rather than a refusal. */}
            <SectionHead
              size="md"
              title="The film term goes in writing with your quote."
              intro={
                <p>
                  We install {PPF_FILM.brand} film. We do not print a film
                  warranty term on this page until it has been verified for
                  the vehicle it applies to, because a term you cannot hold
                  anyone to is worth nothing at a claim.
                </p>
              }
            />

            <div className="ps-prose mt-6">
              <p>
                Ask for it and it comes back written against the film that is
                actually going on your car.
              </p>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/paint-protection-film/" tone="ghost" size="sm">
                What each coverage level covers
              </Button>
              <Button href="/paint-correction/" tone="ghost" size="sm">
                Correction before protection
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

      <Section plane="sheet" label="Get it in writing">
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
