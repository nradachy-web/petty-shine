import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

import QuoteForm from "@/components/quote/QuoteForm";
import PhoneLink from "@/components/tracking/PhoneLink";
import {
  Breadcrumbs,
  Button,
  DatumRule,
  KeyValueList,
  KeyValueRow,
  Plate,
  PriceFigure,
  QuoteLink,
  Section,
  SectionHead,
} from "@/components/ui";
import {
  BRAND,
  CITIES,
  COATINGS,
  CREDENTIALS,
  GTECHNIQ_FACTS,
  NC_TINT_LAW,
  NEAREST_EXIT,
  PENDING_SPEC,
  PPF_FILM,
  SERVICES,
} from "@/lib/constants";
import { miles, milesLong } from "@/lib/utils";
import { spell, spellCap } from "../areas/[city]/facts";

/**
 * NO FAQPage SCHEMA ON THIS PAGE.
 *
 * Google removed the FAQ rich result for the general web in 2026, so the
 * markup costs bytes and returns nothing. The BreadcrumbList emitted by the
 * Breadcrumbs primitive is the structured data that still earns a result.
 *
 * Every answer below resolves to a value in src/lib/constants.ts. Where no
 * value exists, the answer says so plainly rather than filling the gap. That
 * applies especially to turnaround time and to the film warranty, both of
 * which the old site guessed at.
 */

const GTECHNIQ = CREDENTIALS.find((c) => c.id === "gtechniq")!;
const STEK = CREDENTIALS.find((c) => c.id === "stek")!;

const NINE_YEAR = COATINGS.find((c) => c.id === "petty-shine-nine")!;
const PPF = SERVICES.find((s) => s.id === "paint-protection-film")!;
const TINT = SERVICES.find((s) => s.id === "window-tinting")!;

const PRICED = SERVICES.filter((s) => s.fromPrice !== null);
const QUOTED = SERVICES.filter((s) => s.fromPrice === null);

const NEAREST = CITIES[0];
const FARTHEST = CITIES[CITIES.length - 1];

export const metadata: Metadata = {
  title: "Questions People Actually Ask",
  /* 155 characters. The old one ran to 205 and lost the rear glass clause,
     which is the answer most people arrive looking for. */
  description: `What a ceramic coating costs, what the ${NINE_YEAR.guarantee} guarantee really requires, whether film stops rock chips, and why ${BRAND.stateName} allows no darker rear glass.`,
  alternates: { canonical: "/faq/" },
};

/** A question. h3 under a section h2, so the outline stays in order. */
function Question({
  id,
  q,
  children,
}: {
  id: string;
  q: string;
  children: ReactNode;
}) {
  return (
    <div
      id={id}
      className="min-w-0 scroll-mt-28 border-t border-rule-light pt-7"
    >
      <h3 className="ps-heading text-[1.15rem] text-ink-900 sm:text-[1.35rem]">
        {q}
      </h3>
      <div className="mt-4 min-w-0">{children}</div>
    </div>
  );
}

function Answer({ children }: { children: ReactNode }) {
  return <div className="ps-prose max-w-2xl text-[0.9375rem]">{children}</div>;
}

const INDEX = [
  { id: "coating-cost", label: "What does a ceramic coating cost?" },
  {
    id: "guarantee",
    label: `What does the ${NINE_YEAR.guarantee} guarantee actually require?`,
  },
  { id: "who-can-apply", label: "Can any shop apply Crystal Serum Ultra?" },
  { id: "exotics", label: "Do you work on exotics and classics?" },
  { id: "rock-chips", label: "Does paint protection film stop rock chips?" },
  { id: "self-heal", label: "Will a scratch in the film heal?" },
  { id: "which-film", label: "Which film do you install, and what backs it?" },
  {
    id: "rear-glass",
    label: `Can the back glass be darker than the front in ${BRAND.stateName}?`,
  },
  { id: "how-long", label: "How long will my vehicle be with you?" },
  { id: "starting-prices", label: "Is the published price the final price?" },
  { id: "where", label: "Where are you, and how far do people drive?" },
];

export default function FaqPage() {
  return (
    <>
      <Breadcrumbs
        plane="sheet"
        trail={[{ label: "Questions", href: "/faq/" }]}
      />

      <Section plane="sheet" label="Questions">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <h1 className="ps-display ps-display-lg">Questions we get asked</h1>

            <div className="ps-prose mt-6">
              <p>
                These are the ones that come up on the phone every week. The
                answers carry the real numbers and the real conditions, up to
                and including the parts that are not in our favor.
              </p>
              <p>
                Where there is no honest number to give, the answer says so
                instead of inventing one.
              </p>
            </div>

            <PhoneLink
              placement="faq-index"
              className="mt-8 flex min-w-0 items-center justify-between gap-4 border border-rule-light bg-sheet-060 px-5 py-5 transition-colors hover:border-cyan-500"
            >
              <span className="min-w-0">
                <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-400">
                  Ask us directly
                </span>
                <span className="mt-1 block font-mono text-2xl tabular-nums text-ink-900">
                  {BRAND.phoneDisplay}
                </span>
              </span>
              <span className="h-px w-6 flex-none bg-cyan-500" aria-hidden />
            </PhoneLink>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <DatumRule label="On this page" className="mb-6" />
            <ul className="min-w-0">
              {INDEX.map((item, i) => (
                <li
                  key={item.id}
                  className="min-w-0 border-b border-rule-light"
                >
                  <a
                    href={`#${item.id}`}
                    className="flex min-w-0 items-baseline gap-3 py-3.5 text-[0.9375rem] leading-snug text-ink-600 transition-colors hover:text-cyan-ink"
                  >
                    <span className="font-mono text-[0.6875rem] tabular-nums tracking-[0.16em] text-ink-400">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}

      <Section plane="sheet" label="Ceramic coating">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-4">
            <SectionHead
              size="md"
              title="Prices, chemistry and the guarantee"
              intro={
                <p>
                  Three tiers are published with their starting prices, and the
                  conditions attached to the longest one are published with
                  them.
                </p>
              }
            />
          </div>
          <div className="min-w-0 lg:col-span-8">
            <div className="grid min-w-0 gap-12">
              <Question id="coating-cost" q="What does a ceramic coating cost?">
                <Answer>
                  <p>
                    Three tiers, and all three starting prices are published.
                    The number moves with the size of the vehicle and how much
                    correction the paint needs before anything is applied, so
                    what is below is where each one starts.
                  </p>
                </Answer>
                <KeyValueList className="mt-6" label="Coating starting prices">
                  {COATINGS.map((c) => (
                    <KeyValueRow
                      key={c.id}
                      k={c.name}
                      note={`${c.guarantee} guarantee`}
                      v={<PriceFigure value={c.fromPrice} from size="sm" />}
                    />
                  ))}
                </KeyValueList>
                <div className="mt-6">
                  <Button href="/ceramic-coating/" tone="ghost" size="sm">
                    What is in each tier
                  </Button>
                </div>
              </Question>

              <Question
                id="guarantee"
                q={`What does the ${NINE_YEAR.guarantee} guarantee actually require?`}
              >
                <Answer>
                  <p>
                    More than most people expect, and it is worth knowing before
                    you buy rather than after. The guarantee is issued by
                    Gtechniq, not by this shop, and these are its published
                    conditions.
                  </p>
                </Answer>
                <KeyValueList className="mt-6" label="Guarantee conditions">
                  {GTECHNIQ_FACTS.guaranteeTerms.map((t) => (
                    <KeyValueRow
                      key={t.key}
                      k={t.key}
                      v={t.value}
                      mono={false}
                    />
                  ))}
                </KeyValueList>
                <Answer>
                  <p className="mt-6">{GTECHNIQ_FACTS.maintenanceNote}</p>
                </Answer>
                <div className="mt-6">
                  <Button href="/warranties/" tone="ghost" size="sm">
                    Every guarantee in full
                  </Button>
                </div>
              </Question>

              <Question
                id="who-can-apply"
                q="Can any shop apply Crystal Serum Ultra?"
              >
                <Answer>
                  <p>{GTECHNIQ_FACTS.proOnly}</p>
                  <p>
                    So the credential is the product. {BRAND.name}{" "}
                    is listed in
                    Gtechniq&rsquo;s own directory as an accredited detailer,
                    and that listing is theirs rather than ours, so you can go
                    and check it before you book anything.
                  </p>
                  <p>{GTECHNIQ_FACTS.hardness}</p>
                </Answer>
              </Question>
            </div>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}

      <Section plane="shop" label="The cars" className="plane-arc">
        <SectionHead
          title="Cars that have been in the shop"
          intro="Every photograph on this site is a job that came through the building on Branson Mill Road. Nothing here is stock."
        />

        <div className="mt-10 grid min-w-0 gap-8 md:grid-cols-2">
          <Plate
            id="ppf-mclaren-gt"
            priority
            caption="McLaren GT"
            sizes="(min-width: 768px) 32rem, 100vw"
          />
          <Plate
            id="coating-huracan"
            caption="Lamborghini Huracan, ceramic coated"
            sizes="(min-width: 768px) 32rem, 100vw"
          />
        </div>

        <div
          id="exotics"
          className="mt-12 max-w-2xl min-w-0 scroll-mt-28 border-t border-rule-dark pt-7"
        >
          <h3 className="ps-heading text-[1.15rem] text-spec-000 sm:text-[1.35rem]">
            Do you work on exotics and classics?
          </h3>
          <div className="ps-prose mt-4 text-[0.9375rem]">
            <p>
              Yes, and the photographs are the answer rather than a claim. A
              McLaren GT, a Lamborghini Huracan, a Corvette C8 and a Z06, a
              Mercedes G-Class, a Porsche 911, a Toyota Supra and a 1965 Mustang
              have all been through the same bay.
            </p>
            <p>
              The process does not change with the badge. What changes is how
              much correction the paint needs and how long the panels take, and
              that is exactly what the quote is for.
            </p>
          </div>
          <div className="mt-7">
            <Button href="/gallery/" tone="ghost" size="sm">
              See all of the work
            </Button>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}

      <Section
        plane="sheet"
        label="Paint protection film"
        className="plane-arc"
      >
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-4">
            <SectionHead
              size="md"
              title="What film does, and what it does not"
              intro={
                <p>
                  Film is the one product on this site where the honest answer
                  is the selling point, so the limits are printed next to the
                  specification.
                </p>
              }
            />
          </div>
          <div className="min-w-0 lg:col-span-8">
            <div className="grid min-w-0 gap-12">
              <Question
                id="rock-chips"
                q="Does paint protection film stop rock chips?"
              >
                <Answer>
                  <p>{PPF_FILM.limits[0]}</p>
                  <p>
                    That is the whole idea. Urethane thick enough to absorb an
                    impact goes over the panels that get hit, and it wears
                    instead of the paint. A chip in the film is the film doing
                    exactly what it was bought to do, and film is replaceable in
                    a way that factory paint is not.
                  </p>
                </Answer>
                <div className="mt-6">
                  <Button href="/paint-protection-film/" tone="ghost" size="sm">
                    See which panels each level covers
                  </Button>
                </div>
              </Question>

              <Question id="self-heal" q="Will a scratch in the film heal?">
                <Answer>
                  <p>{PPF_FILM.limits[1]}</p>
                  <p>
                    So light swirls and wash marks come back out with heat. A
                    deep scratch does not, and any shop that tells you otherwise
                    is describing a product that does not exist.
                  </p>
                </Answer>
              </Question>

              <Question
                id="which-film"
                q="Which film do you install, and what backs it?"
              >
                <Answer>
                  <p>
                    {PPF_FILM.brand} {PPF_FILM.product}. {STEK.body}
                  </p>
                  <p>{PENDING_SPEC.note}</p>
                </Answer>

                <div className="mt-6 grid min-w-0 gap-8 md:grid-cols-2">
                  <KeyValueList label={`${PPF_FILM.brand} ${PPF_FILM.product}`}>
                    {PPF_FILM.specs.map((s) => (
                      <KeyValueRow key={s.key} k={s.key} v={s.value} />
                    ))}
                  </KeyValueList>

                  <div className="min-w-0">
                    <DatumRule label={PENDING_SPEC.heading} className="mb-4" />
                    <KeyValueList capped={false} label={PENDING_SPEC.heading}>
                      {PENDING_SPEC.rows.map((r) => (
                        <KeyValueRow
                          key={r.key}
                          k={r.key}
                          v={r.value}
                          tone="pewter"
                        />
                      ))}
                    </KeyValueList>
                  </div>
                </div>

                <div className="mt-7">
                  <QuoteLink service={PPF.quoteKey}>
                    Get film priced on your vehicle
                  </QuoteLink>
                </div>
              </Question>
            </div>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}

      <Section plane="sheet" label="Window tint">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-4">
            <SectionHead
              size="md"
              title={`Tint and ${BRAND.stateName} law`}
              intro={
                <p>
                  This is the single most common misunderstanding that walks in
                  the door, so it gets the statute printed next to it.
                </p>
              }
            />
          </div>
          <div className="min-w-0 lg:col-span-8">
            <div className="grid min-w-0 gap-12">
              <Question
                id="rear-glass"
                q={`Can the back glass be darker than the front in ${BRAND.stateName}?`}
              >
                <Answer>
                  <p>
                    <strong>No.</strong> {NC_TINT_LAW.myth}
                  </p>
                  <p>
                    Plenty of states do allow darker glass behind the driver,
                    which is where the idea comes from. {BRAND.stateName} is not
                    one of them, and a film that is legal one state up is a
                    ticket here. Everything we install goes on to the limit in{" "}
                    {NC_TINT_LAW.statute} and no darker.
                  </p>
                </Answer>

                <KeyValueList
                  className="mt-6"
                  label={`${NC_TINT_LAW.statute} limits`}
                >
                  {NC_TINT_LAW.rows.map((r) => (
                    <KeyValueRow
                      key={r.key}
                      k={r.key}
                      note={r.cite}
                      v={r.value}
                      mono={false}
                    />
                  ))}
                </KeyValueList>

                <div className="mt-7 flex flex-wrap items-center gap-6">
                  <Button href="/window-tinting/" tone="ghost" size="sm">
                    Window tinting
                  </Button>
                  <QuoteLink service={TINT.quoteKey} />
                </div>
              </Question>
            </div>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}

      <Section plane="sheet" label="Practical">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-4">
            <SectionHead
              size="md"
              title="Booking, pricing and the shop"
              intro={
                <p>
                  The ones that come up on almost every call, including the one
                  this site refuses to guess at.
                </p>
              }
            />
          </div>
          <div className="min-w-0 lg:col-span-8">
            <div className="grid min-w-0 gap-12">
              <Question id="how-long" q="How long will my vehicle be with you?">
                <Answer>
                  <p>
                    We do not publish a turnaround time, because an honest one
                    cannot be written before anyone has seen the vehicle. A
                    maintenance detail and a full correction under a nine year
                    coating are not the same week of work.
                  </p>
                  <p>
                    The turnaround is confirmed when the vehicle is booked, at
                    the same time as the price, so you know both before you hand
                    over the keys.
                  </p>
                </Answer>
              </Question>

              <Question
                id="starting-prices"
                q="Is the published price the final price?"
              >
                <Answer>
                  <p>
                    It is a starting price. {spellCap(PRICED.length)} of the{" "}
                    {spell(SERVICES.length)} services on this site publish one,
                    and the number moves with the size of the vehicle and the
                    condition of the paint. A single cab truck and a three row
                    SUV are not the same job at the same price.
                  </p>
                  <p>
                    The other {spell(QUOTED.length)} publish nothing, because
                    there is no honest starting number for them. Those get
                    looked at and quoted, and the quote is the price.
                  </p>
                </Answer>
                <div className="mt-6">
                  <Button href="/pricing/" tone="ghost" size="sm">
                    The full price list
                  </Button>
                </div>
              </Question>

              <Question
                id="where"
                q="Where are you, and how far do people drive?"
              >
                <Answer>
                  <p>
                    {BRAND.addressLine}, in {BRAND.county}. The closest
                    interchange is {NEAREST_EXIT.label},{" "}
                    {milesLong(NEAREST_EXIT.miles)} from the door.
                  </p>
                  <p>
                    We measured the road distance from {spell(CITIES.length)}{" "}
                    towns around the Triad, from {NEAREST.name} at{" "}
                    {milesLong(NEAREST.miles)} out to {FARTHEST.name} at{" "}
                    {miles(FARTHEST.miles)}. Each one has{" "}
                    <Link href="/areas/" className="link-inline">
                      its own drive time and route
                    </Link>
                    .
                  </p>
                </Answer>

                <KeyValueList className="mt-6" label="The shop">
                  <KeyValueRow k="Address" v={BRAND.street} />
                  <KeyValueRow
                    k="City"
                    v={`${BRAND.city}, ${BRAND.state} ${BRAND.zip}`}
                  />
                  {BRAND.hours.map((h) => (
                    <KeyValueRow key={h.days} k={h.days} v={h.time} />
                  ))}
                  <KeyValueRow k="Phone" v={BRAND.phoneDisplay} />
                </KeyValueList>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button href="/contact/" tone="ghost" size="sm">
                    Directions
                  </Button>
                  <Button href="/areas/" tone="ghost" size="sm">
                    Drive times by town
                  </Button>
                </div>
              </Question>
            </div>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}

      <Section plane="sheet" label="Still not answered">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <h2 className="ps-display ps-display-md">
              Ask us the awkward one.
            </h2>
            <div className="ps-prose mt-5">
              <p>
                If the question you came with is not on this page, put it in the
                notes on the form. It reaches the shop, not a call center, and
                the answer comes back with the price.
              </p>
              <p>
                The phone is quicker. The shop is open {BRAND.hoursShort}.
              </p>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <QuoteForm
              heading="Ask, or get a price"
              intro="It goes straight to the shop. Year, make, model and what you want done is enough to start."
              source="/faq/"
              id="quote-form"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
