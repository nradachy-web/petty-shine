import type { Metadata } from "next";
import Link from "next/link";

import { PpfCoveragePlan } from "@/components/ppf";
import QuoteForm from "@/components/quote/QuoteForm";
import CTABand from "@/components/sections/CTABand";
import PhoneLink from "@/components/tracking/PhoneLink";
import {
  Button,
  DatumRule,
  KeyValueList,
  KeyValueRow,
  Plate,
  PriceFigure,
  Prose,
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
  NEAREST_EXIT,
  REVIEWS,
  REVIEW_SUMMARY,
  SERVICES,
} from "@/lib/constants";
import { drive, longDate, milesLong } from "@/lib/utils";

/* ============================================================================
   THE HOME PAGE

   The argument, in order: the shop, the four numbers that prove the headline,
   the whole service index with a price or a live quote link on every line, the
   PPF coverage plan, the work, the chemistry, the reviews, the owner, the
   drive times, and the form.

   TITLE AND DESCRIPTION ARE THE ROOT LAYOUT'S ON PURPOSE. app/layout.tsx
   builds HOME_TITLE and HOME_DESCRIPTION out of BRAND and uses them for the
   <title>, the meta description AND the OpenGraph card. Re-declaring them
   here would fork one string into two and let the tab title drift away from
   the link card. The canonical is declared, per the contract.
   ========================================================================== */

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/* --- facts, pulled once ---------------------------------------------- */

type Coating = (typeof COATINGS)[number];

/** The nine year coating. Found by id rather than index so a reorder in
    constants cannot silently repoint this at the $700 tier. */
const NINE = COATINGS.find(
  (c): c is Extract<Coating, { id: "petty-shine-nine" }> =>
    c.id === "petty-shine-nine"
)!;

const service = (id: string) => SERVICES.find((s) => s.id === id)!;

/**
 * The price strip. Four figures that prove the headline inside one second:
 * his cheapest way in, his signature product, the top of his ladder, and the
 * lowest published number on the site.
 */
const HEADLINE_PRICES = [
  {
    label: service("auto-detailing").name,
    value: service("auto-detailing").fromPrice!,
    href: service("auto-detailing").href,
  },
  {
    label: service("ceramic-coating").name,
    value: service("ceramic-coating").fromPrice!,
    href: service("ceramic-coating").href,
  },
  {
    label: `${NINE.name}, ${NINE.subtitle}`,
    value: NINE.fromPrice,
    href: service("ceramic-coating").href,
  },
  {
    label: service("interior-detailing").name,
    value: service("interior-detailing").fromPrice!,
    href: service("interior-detailing").href,
  },
];

/** Derived, never typed: how many of the five reviews use his first name. */
const OWNER_FIRST = BRAND.owner.split(" ")[0];
const NAMED_COUNT = REVIEWS.filter((r) => r.text.includes(OWNER_FIRST)).length;

const [LEAD_REVIEW, ...OTHER_REVIEWS] = REVIEWS;

/** Two even columns of towns, split off the measured list itself. */
const CITY_COLUMNS = [
  CITIES.slice(0, Math.ceil(CITIES.length / 2)),
  CITIES.slice(Math.ceil(CITIES.length / 2)),
];

const MONO_META =
  "font-mono text-[0.6875rem] uppercase leading-relaxed tracking-[0.2em]";

export default function HomePage() {
  return (
    <>
      {/* ================================================================
          1. THE SHOP PLANE

          His Huracan, under his own banner, with the Gtechniq Crystal
          Serum Ultra display on the wall behind it. One photograph that
          carries the cars he works on, the brand as it physically exists,
          and the credential, so the page argues before it says anything.

          It is the only photo on the page marked priority, and it is one
          of the eight ids cleared to bleed.
          ================================================================ */}
      <Section
        plane="shop"
        width="full"
        rhythm="flush"
        ariaLabel={`${BRAND.name}, ${BRAND.city} ${BRAND.state}`}
      >
        {/* THE PHOTO IS NEVER STRETCHED TO THE COLUMN.
            Cover-cropping this frame to a taller box eats the sides, and the
            sides are the argument: the wordmark runs to the right of centre
            and the Gtechniq Crystal Serum Ultra display stands at the right
            edge. So the photo keeps its own 4:3, sits hard against the header,
            and the shop plane fills whatever the copy column is taller by.
            The left padding lands the copy on the site shell's own left edge
            at every width above the shell's max. */}
        <div className="grid min-w-0 xl:grid-cols-[minmax(0,1fr)_minmax(0,58%)] xl:items-start">
          <div className="order-2 flex min-w-0 flex-col justify-center px-5 py-12 md:px-8 md:py-16 xl:order-1 xl:pb-32 xl:pt-20 xl:pl-[max(2rem,calc((100vw-77.5rem)/2+2rem))] xl:pr-14">
            <div className="min-w-0 max-w-[34rem]">
              <DatumRule label={`${BRAND.city}, ${BRAND.stateName}`} />

              <h1 className="ps-display ps-display-xl mt-7">
                The prices are on the website.
              </h1>

              <Prose className="mt-6">
                <p>
                  Auto detailing, ceramic coating, paint protection film,
                  window tint and dent repair, in {BRAND.city},{" "}
                  {BRAND.stateName}.
                </p>
                <p>
                  Every price we can publish is published, starting with the
                  four below. The work that has to be seen first gets quoted on
                  your vehicle, in writing, before anything starts.
                </p>
              </Prose>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                {/* The one solid cyan button on this screen. */}
                <Button href="/quote/" tone="cyan">
                  Get a price
                </Button>
                <PhoneLink
                  placement="home-hero"
                  className="ps-btn ps-btn--ghost"
                >
                  Call {BRAND.phoneDisplay}
                </PhoneLink>
              </div>

              <p className={`${MONO_META} mt-8 text-ink-300`}>
                {BRAND.addressLine}
                <br />
                {BRAND.hoursShort}
              </p>
            </div>
          </div>

          <div className="order-1 min-w-0 xl:order-2">
            <div className="mx-auto w-full max-w-[52rem] xl:mx-0 xl:max-w-none">
              <Plate
                id="coating-huracan"
                priority
                bleed
                ratio="4 / 3"
                sizes="(min-width: 1280px) 58vw, (min-width: 832px) 832px, 100vw"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ================================================================
          2 and 3. THE RECORD PLANE

          The price strip and the service index are one band, not two.
          A plane change buys a fact, and the fact here is the same one
          twice: he publishes numbers.
          ================================================================ */}
      <Section
        plane="sheet"
        label="Published starting prices"
        className="plane-arc"
      >
        <SectionHead
          title="What it costs, before you call."
          intro={
            <p>
              Every figure on this site is a starting price. Size of the vehicle
              and condition of the paint decide the rest.
            </p>
          }
        />

        <ul className="mt-10 grid min-w-0 grid-cols-2 gap-x-6 gap-y-9 md:mt-12 md:grid-cols-4 md:gap-x-8">
          {HEADLINE_PRICES.map((p) => (
            <li key={p.label} className="min-w-0">
              {/* h-full plus mt-auto so a two line label cannot drop its own
                  figure below the other three. The prices sit on one line. */}
              <Link href={p.href} className="group flex h-full min-w-0 flex-col">
                <span aria-hidden className="flex h-px w-full">
                  <span className="h-px w-6 flex-none bg-cyan-500" />
                  <span className="h-px flex-1 bg-rule-light transition-colors group-hover:bg-cyan-500" />
                </span>
                <span
                  className={`${MONO_META} mt-4 block text-ink-400 group-hover:text-ink-900`}
                >
                  {p.label}
                </span>
                <span className="mt-auto block pt-3">
                  <PriceFigure value={p.value} from size="lg" />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <DatumRule label="Service index" className="mt-16 md:mt-20" />

        <h3 className="ps-display ps-display-md mt-8">
          Everything the shop does.
        </h3>

        <ul className="mt-8 min-w-0 border-t border-rule-light">
          {SERVICES.map((s) => (
            <li
              key={s.id}
              className="grid min-w-0 grid-cols-[2.25rem_minmax(0,1fr)] items-baseline gap-y-1 border-b border-rule-light py-4 md:grid-cols-[2.75rem_minmax(0,1fr)_auto] md:gap-x-8 md:py-5"
            >
              <span className="font-mono text-[0.75rem] tabular-nums tracking-[0.16em] text-cyan-ink">
                {s.index}
              </span>

              <Link
                href={s.href}
                className="ps-heading min-w-0 text-[1.0625rem] text-ink-900 underline-offset-4 hover:underline md:text-[1.1875rem]"
              >
                {s.name}
              </Link>

              <p className="col-start-2 max-w-md text-[0.9375rem] leading-relaxed text-ink-600">
                {s.blurb}
              </p>

              <div className="col-start-2 justify-self-end pt-1 md:col-start-3 md:row-span-2 md:row-start-1 md:self-center md:pt-0">
                {s.fromPrice === null ? (
                  /* Four rows carry this link, so each one names its own
                     service for anyone reading the page by its link list. */
                  <QuoteLink service={s.quoteKey}>
                    Quoted on your vehicle
                    <span className="sr-only">, {s.name}</span>
                  </QuoteLink>
                ) : (
                  <PriceFigure value={s.fromPrice} from />
                )}
              </div>
            </li>
          ))}
        </ul>

        <CTABand variant="line" className="mt-12" />
      </Section>

      {/* ================================================================
          4. THE COVERAGE PLAN, on the home page on purpose

          Film is the largest line in the ad account and the worst
          converting page on the old site. Everyone who lands here sees
          the ladder, not only the paid film clicks.
          ================================================================ */}
      <Section
        plane="shop"
        label="Paint protection film"
        className="plane-arc"
      >
        <SectionHead
          title="Film, panel by panel."
          intro={
            <p>
              Four coverage levels, each one a strict superset of the one below
              it. Pick a level and the drawing shows which panels get film and
              which are left bare. Film is quoted on your vehicle.
            </p>
          }
        />

        <div className="mt-7">
          <Button href="/paint-protection-film/" tone="ghost" size="sm">
            The full film page
          </Button>
        </div>

        <div className="mt-10 md:mt-14">
          <PpfCoveragePlan />
        </div>
      </Section>

      {/* ================================================================
          5. THE PLATES

          Numbered and captioned, the way a photograph is filed rather
          than the way a thumbnail grid is decorated. Only bleed-cleared
          ids run edge to edge.
          ================================================================ */}
      <Section plane="shop" label="The work">
        <SectionHead
          title="This is what parks in the shop."
          intro={
            <p>
              Every photograph on this site came out of this shop, off a
              vehicle that was in for work. None of it is stock.
            </p>
          }
        />

        <div className="mt-10 md:mt-14">
          <Plate
            id="coating-corvette-c8"
            bleed
            ratio="16 / 9"
            sizes="100vw"
            caption="01 / Ceramic coating, Corvette C8"
          />
        </div>

        <div className="mt-10 grid min-w-0 gap-8 sm:grid-cols-2 md:mt-12 md:gap-10">
          <Plate
            id="coating-g-wagon"
            sizes="(min-width: 1024px) 36rem, (min-width: 640px) 46vw, 100vw"
            caption="02 / Ceramic coating, Mercedes G-Class"
          />
          <Plate
            id="coating-challenger-hellcat"
            sizes="(min-width: 1024px) 36rem, (min-width: 640px) 46vw, 100vw"
            caption="03 / Correction and coating, Hellcat"
          />
        </div>

        <div className="mt-10">
          <Button href="/gallery/" tone="ghost">
            See all the work
          </Button>
        </div>
      </Section>

      {/* ================================================================
          6. THE NAMED CHEMISTRY

          The one thing on this site a competitor cannot copy by
          rewriting a page: he is accredited, so he can put on a coating
          the customer is not allowed to buy.
          ================================================================ */}
      <Section plane="sheet" label="Named chemistry" className="plane-arc">
        <SectionHead
          align="split"
          title="The coating you cannot buy."
          intro={<p>{GTECHNIQ_FACTS.proOnly}</p>}
        />

        <div className="mt-12 grid min-w-0 gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <KeyValueList label={`${NINE.name}, ${NINE.subtitle}`}>
              <KeyValueRow k="Base coat" v={NINE.base} />
              <KeyValueRow k="Top coat" v={NINE.top} />
              <KeyValueRow k="Guarantee" v={NINE.guarantee} />
              <KeyValueRow
                k="Starting price"
                v={<PriceFigure value={NINE.fromPrice} from />}
                strong
              />
            </KeyValueList>

            <Prose className="mt-8">
              <p>{GTECHNIQ_FACTS.hardness}</p>
            </Prose>

            <div className="mt-8">
              <Button href="/ceramic-coating/" tone="ghost">
                All three coating tiers
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <DatumRule label="Credentials" className="mb-6" />
            <KeyValueList capped={false}>
              {CREDENTIALS.map((c) => (
                <KeyValueRow key={c.id} k={c.label} v={c.body} mono={false} />
              ))}
            </KeyValueList>

            <DatumRule
              label="What the guarantee actually says"
              className="mb-6 mt-12"
            />
            <KeyValueList capped={false}>
              {GTECHNIQ_FACTS.guaranteeTerms.slice(0, 2).map((t) => (
                <KeyValueRow key={t.key} k={t.key} v={t.value} mono={false} />
              ))}
            </KeyValueList>
          </div>
        </div>
      </Section>

      {/* ================================================================
          7. FIVE REVIEWS, VERBATIM

          Their punctuation, their capitals, their typos. Five real
          attributed reviews is enough, so the page does not pad and
          carries no aggregateRating markup.
          ================================================================ */}
      <Section plane="shop" label="Reviews" className="plane-arc">
        <SectionHead
          title="Five reviews, word for word."
          intro={
            <p>
              Copied off Google exactly as they were written. Nothing has been
              tidied up and nothing has been shortened.
            </p>
          }
        />

        <p className={`${MONO_META} mt-6 text-ink-300`}>
          {REVIEW_SUMMARY.rating} from {REVIEW_SUMMARY.count}{" "}
          {REVIEW_SUMMARY.source} reviews, checked{" "}
          {longDate(REVIEW_SUMMARY.checkedOn)}
        </p>

        <blockquote className="mt-10 min-w-0 max-w-3xl">
          <span aria-hidden className="block h-px w-6 bg-cyan-500" />
          <p className="mt-6 text-[1.125rem] leading-relaxed text-spec-000 sm:text-[1.3125rem] sm:leading-[1.6]">
            {LEAD_REVIEW.text}
          </p>
          <footer
            className={`${MONO_META} mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-1`}
          >
            <span className="text-spec-000">{LEAD_REVIEW.name}</span>
            <span className="text-ink-300">{LEAD_REVIEW.service}</span>
          </footer>
        </blockquote>

        <div className="mt-12 grid min-w-0 gap-x-12 gap-y-10 sm:grid-cols-2">
          {OTHER_REVIEWS.map((r) => (
            <blockquote
              key={r.name}
              className="min-w-0 border-t border-rule-dark pt-6"
            >
              <p className="text-[0.9375rem] leading-relaxed text-ink-300">
                {r.text}
              </p>
              <footer
                className={`${MONO_META} mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-1`}
              >
                <span className="text-spec-000">{r.name}</span>
                <span className="text-ink-300">{r.service}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </Section>

      {/* ================================================================
          8. THE OWNER

          Same plane as the reviews, because it is the same argument.
          The count of reviews that use his first name is derived from
          the review text itself, so it can never drift.
          ================================================================ */}
      <Section plane="shop" label="The owner">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
          <div className="min-w-0 lg:col-span-6">
            <h2 className="ps-display ps-display-lg">
              {BRAND.owner} owns the shop.
            </h2>

            <Prose className="mt-6">
              <p>
                {NAMED_COUNT} of the {REVIEWS.length} reviews above name him
                rather than the business.
              </p>
              <p>
                The rest of what there is to say is on the record: where the
                shop is, when it is open, and what it charges.
              </p>
            </Prose>

            <KeyValueList className="mt-9" label="The shop">
              <KeyValueRow k="Owner" v={BRAND.owner} />
              <KeyValueRow k="Shop" v={BRAND.addressLine} />
              {BRAND.hours.map((h) => (
                <KeyValueRow key={h.days} k={h.days} v={h.time} />
              ))}
            </KeyValueList>

            <div className="mt-8">
              <Button href="/about/" tone="ghost">
                More about the shop
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-6">
            <Plate
              id="detail-mustang-red"
              sizes="(min-width: 1024px) 36rem, 100vw"
              caption="Ford Mustang GT, under the shop banner"
            />
          </div>
        </div>
      </Section>

      {/* ================================================================
          9. THE SERVICE AREA, as a record

          Every distance and time was measured from the shop address.
          None of it is estimated, and none of it is rounded to sound
          closer than it is.
          ================================================================ */}
      <Section plane="sheet" label="Service area" className="plane-arc">
        <SectionHead
          align="split"
          title="How far you are from the shop."
          intro={
            <p>
              Every distance and drive time below was measured from the shop,
              not estimated. If your town is not on the list, call and ask.
            </p>
          }
        />

        {/* The address itself is on the record in the owner block above, so
            this list carries only what the drive adds to it. */}
        <KeyValueList className="mt-10 max-w-2xl" label="Getting here">
          <KeyValueRow
            k="Nearest exit"
            v={`${NEAREST_EXIT.label}, ${milesLong(NEAREST_EXIT.miles)}`}
          />
          <KeyValueRow k="Towns measured" v={String(CITIES.length)} />
        </KeyValueList>

        <DatumRule label="Measured drive times" className="mb-6 mt-14" />

        <div className="grid min-w-0 gap-x-14 md:grid-cols-2">
          {CITY_COLUMNS.map((column, i) => (
            <KeyValueList
              key={i}
              capped={i === 0}
              className="md:border-t md:border-rule-light"
              label={i === 0 ? "Towns we cover" : undefined}
            >
              {column.map((c) => (
                <KeyValueRow
                  key={c.slug}
                  k={c.name}
                  v={drive(c.miles, c.minutes)}
                />
              ))}
            </KeyValueList>
          ))}
        </div>

        <div className="mt-10">
          <Button href="/areas/" tone="ghost" size="sm">
            Every town we cover
          </Button>
        </div>
      </Section>

      {/* ================================================================
          10. THE CLOSE

          The form itself, not a link to one. It carries data-quote-form,
          so the sticky call rail hides while it is on screen and can
          never sit over the submit button.
          ================================================================ */}
      <Section plane="sheet" label="Get a price" id="quote">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <h2 className="ps-display ps-display-lg">
              Send the vehicle. We will send a number back.
            </h2>

            <Prose className="mt-6">
              <p>
                It goes straight to the shop. The year, the make, the model and
                what you want done is enough to start, and anything you add
                gets the first number closer.
              </p>
            </Prose>

            <PhoneLink
              placement="home-close"
              className="mt-8 flex min-w-0 items-center justify-between gap-4 border border-rule-light bg-sheet-060 px-5 py-4 transition-colors hover:border-cyan-500"
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

            {/* The full hours table is on the record in the owner block. This
                is the one line that matters next to a phone number. */}
            <p className={`${MONO_META} mt-5 text-ink-400`}>
              {BRAND.hoursShort}
            </p>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <QuoteForm heading={null} intro={null} source="/" />
          </div>
        </div>
      </Section>
    </>
  );
}
