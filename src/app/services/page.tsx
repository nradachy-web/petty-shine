import type { Metadata } from "next";
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
import { BRAND, CREDENTIALS, SERVICES, type ServiceLine } from "@/lib/constants";
import { spell, spellCap } from "../areas/[city]/facts";

/**
 * THE INDEX OF EVERYTHING
 *
 * One job: get a thumb from "I need something done" to the right page in as
 * few taps as possible. So the list is split the way a customer actually
 * sorts it, into the work that has a published starting price and the work
 * that has to be looked at first, and every row is a full width tap target
 * with the price on it rather than a name you have to open to price.
 */

const PRICED = SERVICES.filter((s) => s.fromPrice !== null);
const QUOTED = SERVICES.filter((s) => s.fromPrice === null);

export const metadata: Metadata = {
  title: "Services and Starting Prices",
  /* 156 characters. The old one ran to 215 and Google cut the service list
     off mid way, so the counts carry the page instead. */
  description: `Every service at ${BRAND.name} in ${BRAND.city}, ${BRAND.stateName}, with ${PRICED.length} published starting prices and ${QUOTED.length} quoted on your vehicle. Detailing, coating, film and tint.`,
  alternates: { canonical: "/services/" },
};

/** One row. The name and blurb are one big target, the price its own link. */
function ServiceRow({ s }: { s: ServiceLine }) {
  return (
    <li className="min-w-0 border-b border-rule-light">
      <div className="grid min-w-0 gap-x-8 gap-y-2 py-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <Link
          href={s.href}
          className="group block min-w-0 py-3 sm:py-4"
          aria-label={`${s.name}, ${s.blurb}`}
        >
          <span className="flex min-w-0 items-baseline gap-3">
            <span className="font-mono text-[0.6875rem] tabular-nums tracking-[0.18em] text-ink-400 transition-colors group-hover:text-cyan-ink">
              {s.index}
            </span>
            <span className="ps-heading min-w-0 text-[1.15rem] text-ink-900 underline decoration-rule-light decoration-1 underline-offset-[6px] transition-colors group-hover:decoration-cyan-500 sm:text-[1.3rem]">
              {s.name}
            </span>
          </span>
          <span className="mt-2 block max-w-md text-[0.9375rem] leading-relaxed text-ink-600">
            {s.blurb}
          </span>
        </Link>

        <div className="pb-3 sm:pb-0 sm:text-right">
          {s.fromPrice === null ? (
            <QuoteLink service={s.quoteKey} />
          ) : (
            <PriceFigure value={s.fromPrice} from />
          )}
        </div>
      </div>
    </li>
  );
}

export default function ServicesPage() {
  return (
    <>
      <Breadcrumbs
        plane="sheet"
        trail={[{ label: "Services", href: "/services/" }]}
      />

      <Section plane="sheet" label="Services">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <h1 className="ps-display ps-display-lg">Everything the shop does</h1>

            <div className="ps-prose mt-6">
              <p>
                {spellCap(SERVICES.length)} services, one building, in {BRAND.city}. Tap
                the one you came for and the page under it carries the real
                detail: what is included, what it starts at, and what it does
                not cover.
              </p>
              <p>
                {spellCap(PRICED.length)} of them publish a starting price. The
                other {spell(QUOTED.length)} depend on the vehicle far too much
                to put a number on in advance, so those get priced on yours.
              </p>
            </div>

            <PhoneLink
              placement="services-index"
              className="mt-8 flex min-w-0 items-center justify-between gap-4 border border-rule-light bg-sheet-060 px-5 py-5 transition-colors hover:border-cyan-500"
            >
              <span className="min-w-0">
                <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-400">
                  Or just call the shop
                </span>
                <span className="mt-1 block font-mono text-2xl tabular-nums text-ink-900">
                  {BRAND.phoneDisplay}
                </span>
              </span>
              <span className="h-px w-6 flex-none bg-cyan-500" aria-hidden />
            </PhoneLink>

            <p className="mt-4 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-400">
              {BRAND.hoursShort}
            </p>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <h2 className="ps-heading text-xl text-ink-900">
              Priced on the site
            </h2>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-600">
              Starting prices, published. What your vehicle costs depends on its
              size and the condition of the paint.
            </p>

            <ul className="mt-6 min-w-0 border-t border-rule-light">
              {PRICED.map((s) => (
                <ServiceRow key={s.id} s={s} />
              ))}
            </ul>

            <h2 className="ps-heading mt-14 text-xl text-ink-900">
              Priced on your vehicle
            </h2>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-600">
              No published number, because the honest one comes from looking at
              the vehicle. Every row below goes to the form with the service
              already filled in.
            </p>

            <ul className="mt-6 min-w-0 border-t border-rule-light">
              {QUOTED.map((s) => (
                <ServiceRow key={s.id} s={s} />
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="/pricing/" tone="ghost" size="sm">
                The full price list
              </Button>
              <Button href="/gallery/" tone="ghost" size="sm">
                See the work
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <Section plane="shop" label="Credentials" className="plane-arc">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:items-end lg:gap-14">
          <div className="min-w-0 lg:col-span-6">
            <SectionHead
              title="Both makers list this shop by name."
              intro={
                <p>
                  A coating and a film install are only worth what stands behind
                  them. Gtechniq and STEK each carry Petty Shine in their own
                  installer directory, which anyone can go and check, and which
                  is not something a website can award itself.
                </p>
              }
            />

            <div className="mt-9">
              <DatumRule label="Verified" className="mb-6" />
              <ul className="min-w-0">
                {CREDENTIALS.map((cr) => (
                  <li
                    key={cr.id}
                    className="min-w-0 border-b border-rule-dark py-5"
                  >
                    <p className="font-mono text-[0.8125rem] uppercase tracking-[0.14em] text-spec-000">
                      {cr.label}
                    </p>
                    <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-ink-300">
                      {cr.body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/ceramic-coating/" tone="ghost" size="sm">
                Ceramic coating
              </Button>
              <Button href="/paint-protection-film/" tone="ghost" size="sm">
                Paint protection film
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-6">
            <Plate
              id="coating-corvette-c8"
              priority
              caption="Corvette C8, ceramic coated"
              sizes="(min-width: 1024px) 38rem, 100vw"
            />
          </div>
        </div>
      </Section>

      <Section plane="sheet" label="Where the work comes from" className="plane-arc">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="Same list, wherever you are driving from."
              intro={
                <p>
                  Every service on this page is done at the one address. The
                  service area pages carry the measured road distance and drive
                  time from each town, so you can see the run before you commit
                  to it.
                </p>
              }
            />
            <div className="mt-7">
              <Button href="/areas/" tone="ghost" size="sm">
                Drive times by town
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <KeyValueList label="The shop">
              <KeyValueRow k="Address" v={BRAND.addressLine} />
              <KeyValueRow k="County" v={BRAND.county} tone="pewter" />
              {BRAND.hours.map((h) => (
                <KeyValueRow key={h.days} k={h.days} v={h.time} />
              ))}
              <KeyValueRow k="Phone" v={BRAND.phoneDisplay} />
            </KeyValueList>
          </div>
        </div>
      </Section>

      <Section plane="sheet" label="Get a price">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <h2 className="ps-display ps-display-md">
              Not sure which one you need?
            </h2>
            <div className="ps-prose mt-5">
              <p>
                Describe the vehicle and what is bothering you about it. Swirls,
                a dent, a curbed wheel, sun on the interior. We will tell you
                which service fixes it and what that one costs.
              </p>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <QuoteForm
              heading="Get a price for your vehicle"
              intro="It goes straight to the shop. Year, make, model and what you want done is enough to start."
              source="/services/"
              id="quote-form"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
