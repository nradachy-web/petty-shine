import type { Metadata } from "next";
import Link from "next/link";

import { PpfCoveragePlan } from "@/components/ppf";
import QuoteForm from "@/components/quote/QuoteForm";
import CTABand from "@/components/sections/CTABand";
import HomeHero from "@/components/sections/HomeHero";
import PhoneLink from "@/components/tracking/PhoneLink";
import {
  Button,
  DatumRule,
  KeyValueList,
  KeyValueRow,
  Plate,
  PriceOrQuote,
  Prose,
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
  PPF_FILM,
  REVIEWS,
  REVIEW_SUMMARY,
  SERVICES,
} from "@/lib/constants";
import { cn, drive, longDate, milesLong } from "@/lib/utils";

/* ============================================================================
   THE HOME PAGE

   THE PREMISE CHANGED. The first pass opened on "The prices are on the
   website." and its second beat was a strip of four starting prices. Judson
   does not publish his prices, so DIRECTION-V2 section 1 takes every figure
   off the site, which takes the whole argument with it. A price strip in
   private pricing mode renders four identical "Quoted on your vehicle" links
   under four labels, which is the worst version of that slot: four cells of
   the same words, proving nothing.

   WHAT REPLACES IT IS THE CREDENTIAL, and it is the stronger wedge anyway.
   Gtechniq only lets an accredited detailer apply Crystal Serum Ultra and
   voids the guarantee if anyone else does, so the nine year coating is a
   thing a customer physically cannot buy from most shops around here. STEK
   lists him in its own installer directory. Both are checkable in a database
   this website cannot edit, and both are linked so the visitor can check
   them. That band now sits where the prices were, directly under the hero,
   and it carries the page's own h2.

   SIX BANDS, and what each one is for:
     1  hero, his own shop, his own banner, the trust row on its bottom edge
     2  paper: the credential, the nine year record, the whole service index
     3  dark: the coverage plan, then the photographs
     4  paper: five reviews verbatim, near the decision point
     5  dark: the owner
     6  paper: measured drive times, then the form itself, inline

   TWO BANDS ON ONE PLANE ARE ONE SECTION. Two <Section> elements sharing a
   plane stack 96px of their own padding against each other with no colour
   change to explain the hole, which is the dead vertical space DIRECTION-V2
   section 3 asks to be tightened. Inside one band the site's own datum rule
   does the separating instead.

   THE H1 IS THE HERO'S. <HomeHero> owns it and owns the page's one solid
   cyan button, so nothing in this file renders either. Every other action on
   the page is a ghost button or a quote link.
   ========================================================================== */

/* TITLE AND DESCRIPTION ARE THIS PAGE'S OWN, not the layout's any more.
   The layout still builds HOME_TITLE and HOME_DESCRIPTION for its own
   defaults, but that description ends "Published prices and a quote on your
   vehicle", which is a promise this site can no longer keep. `absolute`
   bypasses the "%s | Petty Shine" template, which would push a descriptive
   title past 60 characters. Both are built from BRAND so the town and the
   state can never drift from the rest of the site. */
const TITLE = `${BRAND.name} | Detailing and Ceramic Coating, ${BRAND.city} ${BRAND.state}`;

/* 160 characters, the top of the range Google will show. The who, the what
   and the where come first, both credentials second, and no dollar figure
   appears because none may. */
const DESCRIPTION = `Auto detailing, ceramic coating, paint protection film and window tinting in ${BRAND.city}, ${BRAND.stateName}. ${CREDENTIALS[0].label}, ${CREDENTIALS[1].label}.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
};

/* --- facts, pulled once ---------------------------------------------- */

type Coating = (typeof COATINGS)[number];

/** The nine year coating. Found by id rather than index so a reorder in
    constants cannot silently repoint this at another tier. */
const NINE = COATINGS.find(
  (c): c is Extract<Coating, { id: "petty-shine-nine" }> =>
    c.id === "petty-shine-nine"
)!;

/** The registration term, by key rather than by position. It is the most
    specific true thing about the guarantee and the one most customers do
    not know until it is too late to do it. */
const REGISTRATION = GTECHNIQ_FACTS.guaranteeTerms.find(
  (t) => t.key === "Registration"
)!;

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

/** The mono caps link out to a manufacturer's own directory. 44px tall so it
    is a real tap target, and it says where it goes rather than "learn more". */
const DIRECTORY_LINK =
  "mt-4 inline-flex min-h-[44px] items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-cyan-ink underline-offset-4 hover:underline";

export default function HomePage() {
  return (
    <>
      {/* ================================================================
          1. THE HERO

          Full bleed photograph, one flat overlay, one display heading,
          one solid action and one outline action, and the trust row on
          the bottom edge. It renders its own <TrustBar>, so this page
          must never mount a second one.
          ================================================================ */}
      <HomeHero />

      {/* ================================================================
          2. THE RECORD PLANE

          The credential, then the record it buys, then every service the
          shop sells. One paper band, because it is one argument: here is
          the thing you cannot get elsewhere, here is exactly what it is,
          and here is the whole list with a way to get a number on every
          line of it.
          ================================================================ */}
      <Section plane="sheet" label="Credentials">
        <SectionHead
          align="split"
          title="Two things you can check before you call."
          intro={
            <>
              <p>{GTECHNIQ_FACTS.proOnly}</p>
              <p>
                Gtechniq and STEK each publish their own list of the shops
                they have approved. Petty Shine is on both. Neither list is
                ours, so neither one can be edited from this website.
              </p>
            </>
          }
        />

        <div className="mt-8 grid min-w-0 border-t border-rule-light md:mt-10 md:grid-cols-2">
          {CREDENTIALS.map((c, i) => (
            <div
              key={c.id}
              className={cn(
                "min-w-0 border-b border-rule-light py-7 md:py-8",
                i === 0
                  ? "md:border-r md:border-rule-light md:pr-10"
                  : "md:pl-10"
              )}
            >
              <h3 className="ps-heading text-[1.0625rem] text-ink-900 md:text-[1.1875rem]">
                {c.label}
              </h3>
              <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-ink-600">
                {c.body}
              </p>
              <a
                href={c.source}
                target="_blank"
                rel="noopener noreferrer"
                className={DIRECTORY_LINK}
              >
                Check the listing
                <span className="sr-only">
                  {" "}
                  for {c.label}. Opens in a new tab.
                </span>
                <span aria-hidden="true">{"↗"}</span>
              </a>
            </div>
          ))}
        </div>

        <DatumRule label="The nine year coating" className="mb-6 mt-12" />

        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-6">
            <KeyValueList label={`${NINE.name}, ${NINE.subtitle}`}>
              <KeyValueRow k="Base coat" v={NINE.base} />
              <KeyValueRow k="Top coat" v={NINE.top} />
              <KeyValueRow k="Guarantee" v={`${NINE.guarantee}, from Gtechniq`} />
              <KeyValueRow
                k={REGISTRATION.key}
                v={REGISTRATION.value}
                mono={false}
              />
              <KeyValueRow
                k="Price"
                v={
                  <PriceOrQuote
                    service="ceramic"
                    package={NINE.id}
                    value={NINE.fromPrice}
                  />
                }
                strong
              />
            </KeyValueList>
          </div>

          <div className="min-w-0 lg:col-span-6">
            <Prose>
              <p>{GTECHNIQ_FACTS.hardness}</p>
              <p>{GTECHNIQ_FACTS.maintenanceNote}</p>
            </Prose>

            {/* Under 520 they stack, and two stacked buttons at their own
                natural widths read as a ragged mistake, so they stretch to
                one column. Same breakpoint the hero uses. */}
            <div className="mt-8 flex flex-col items-stretch gap-3 min-[520px]:flex-row min-[520px]:flex-wrap min-[520px]:items-center">
              <Button href="/ceramic-coating/" tone="ghost">
                All three coating tiers
              </Button>
              <Button href="/warranties/" tone="ghost">
                What is actually guaranteed
              </Button>
            </div>
          </div>
        </div>

        <DatumRule label="Service index" className="mt-14 md:mt-16" />

        {/* An h2, not an h3. The service index is a peer of the credential
            block above it rather than a child of it, and it only shares a
            <Section> with it because both live on the record plane. The two
            credential names above are the h3s, and they really are children
            of the h2 they sit under, so the order stays h1, h2, h3, h3, h2
            with nothing skipped. */}
        <h2 className="ps-display ps-display-md mt-8">
          Everything the shop does.
        </h2>

        <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-600">
          Nothing here is priced on the website. What decides the number on
          each job is written out on the{" "}
          <Link href="/pricing/" className="link-inline">
            how we quote a job
          </Link>{" "}
          page, and the number for your vehicle goes to you in writing before
          any work starts.
        </p>

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
                /* The service name is how a phone gets from the home page into
                   a money page, and the 17px line box made it a 19px tall hit
                   area. The padding takes it past the minimum target size and
                   the negative margin gives the row its spacing back. */
                className="-my-1 min-w-0 py-1 ps-heading text-[1.0625rem] text-ink-900 underline-offset-4 hover:underline md:text-[1.1875rem]"
              >
                {s.name}
              </Link>

              <p className="col-start-2 max-w-md text-[0.9375rem] leading-relaxed text-ink-600">
                {s.blurb}
              </p>

              <div className="col-start-2 justify-self-end pt-1 md:col-start-3 md:row-span-2 md:row-start-1 md:self-center md:pt-0">
                {/* One call for all nine rows, priced or not. PriceOrQuote
                    reads PRICING_MODE itself and renders the quote link
                    with this service already selected, so no row is ever a
                    dead label and no page branches on the flag by hand. */}
                <PriceOrQuote service={s.quoteKey} value={s.fromPrice} />
              </div>
            </li>
          ))}
        </ul>

        <CTABand variant="line" className="mt-12" />
      </Section>

      {/* ================================================================
          3. THE COVERAGE PLAN AND THE WORK, one dark band

          Film is the largest line in the ad account and the worst
          converting page on the old site. Everyone who lands here sees
          the ladder, not only the paid film clicks.

          The intro carries the honest loss aversion frame out of
          PPF_FILM.limits: film is sacrificial, it takes the chip so the
          paint does not. No countdown, no scarcity, no invented risk.

          THE PHOTOGRAPHS SHARE THIS SECTION rather than starting their
          own. Two bands on the same plane put 96px of their own padding
          against each other with no colour change to explain it, which
          is exactly the dead vertical space DIRECTION-V2 section 3 calls
          out. On one plane the site's own datum rule separates them, the
          way it already does inside the record band above.
          ================================================================ */}
      <Section plane="shop" label="Paint protection film">
        <SectionHead
          align="split"
          title="Film, panel by panel."
          intro={
            <>
              <p>{PPF_FILM.limits[0]}</p>
              <p>
                Four coverage levels, each one containing everything in the
                level below it. Every body panel and exactly which levels cover
                it, on one page.
              </p>
            </>
          }
        />

        <div className="mt-6">
          <Button href="/paint-protection-film/" tone="ghost" size="sm">
            The full film page
          </Button>
        </div>

        <div className="mt-8 md:mt-10">
          <PpfCoveragePlan />
        </div>

        <DatumRule label="The work" className="mb-8 mt-16 md:mt-20" />

        <SectionHead
          align="split"
          title="This is what parks in the shop."
          intro={
            <p>
              Every photograph on this site came out of this shop, off a
              vehicle that was in for work. None of it is stock.
            </p>
          }
        />

        <div className="mt-8 md:mt-10">
          <Plate
            id="coating-corvette-c8"
            bleed
            ratio="16 / 9"
            sizes="100vw"
            caption="01 / Ceramic coating, Corvette C8"
          />
        </div>

        <div className="mt-8 grid min-w-0 gap-8 sm:grid-cols-2 md:mt-10 md:gap-10">
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

        <div className="mt-9">
          <Button href="/gallery/" tone="ghost">
            See all the work
          </Button>
        </div>
      </Section>

      {/* ================================================================
          4. FIVE REVIEWS, VERBATIM

          Their punctuation, their capitals, their typos. Five real
          attributed reviews is enough, so the page does not pad and
          carries no aggregateRating markup, which is ineligible when a
          business marks up its own rating.

          On paper, because a review is a record of what somebody
          actually said, and because it sits directly before the owner
          and the form rather than being parked on a reviews page.
          ================================================================ */}
      <Section plane="sheet" label="Reviews">
        <SectionHead
          align="split"
          title="Five reviews, word for word."
          intro={
            <p>
              Copied off Google exactly as they were written. Nothing has been
              tidied up and nothing has been shortened.
            </p>
          }
        />

        <p className={`${MONO_META} mt-6 text-ink-400`}>
          {REVIEW_SUMMARY.rating} from {REVIEW_SUMMARY.count}{" "}
          {REVIEW_SUMMARY.source} reviews, checked{" "}
          {longDate(REVIEW_SUMMARY.checkedOn)}
        </p>

        <blockquote className="mt-8 min-w-0 max-w-3xl">
          <span aria-hidden className="block h-px w-6 bg-cyan-500" />
          <p className="mt-6 text-[1.125rem] leading-relaxed text-ink-900 sm:text-[1.3125rem] sm:leading-[1.6]">
            {LEAD_REVIEW.text}
          </p>
          <footer
            className={`${MONO_META} mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-1`}
          >
            <span className="text-ink-900">{LEAD_REVIEW.name}</span>
            <span className="text-ink-400">{LEAD_REVIEW.service}</span>
          </footer>
        </blockquote>

        <div className="mt-10 grid min-w-0 gap-x-12 gap-y-9 sm:grid-cols-2">
          {OTHER_REVIEWS.map((r) => (
            <blockquote
              key={r.name}
              className="min-w-0 border-t border-rule-light pt-6"
            >
              <p className="text-[0.9375rem] leading-relaxed text-ink-600">
                {r.text}
              </p>
              <footer
                className={`${MONO_META} mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-1`}
              >
                <span className="text-ink-900">{r.name}</span>
                <span className="text-ink-400">{r.service}</span>
              </footer>
            </blockquote>
          ))}
        </div>

        <div className="mt-9">
          <Button href="/reviews/" tone="ghost" size="sm">
            Every review we can show
          </Button>
        </div>
      </Section>

      {/* ================================================================
          5. THE OWNER

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
                shop is, when it is open, and who backs the work.
              </p>
            </Prose>

            <KeyValueList className="mt-8" label="The shop">
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
          6. THE SERVICE AREA, THEN THE CLOSE

          Every distance and time was measured from the shop address.
          None of it is estimated, and none of it is rounded to sound
          closer than it is.
          ================================================================ */}
      <Section plane="sheet" label="Service area">
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
        <KeyValueList className="mt-8 max-w-2xl" label="Getting here">
          <KeyValueRow
            k="Nearest exit"
            v={`${NEAREST_EXIT.label}, ${milesLong(NEAREST_EXIT.miles)}`}
          />
          <KeyValueRow k="Towns measured" v={String(CITIES.length)} />
        </KeyValueList>

        <DatumRule label="Measured drive times" className="mb-6 mt-12" />

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

        <div className="mt-9">
          <Button href="/areas/" tone="ghost" size="sm">
            Every town we cover
          </Button>
        </div>

        {/* ------------------------------------------------------------
            THE CLOSE, in the same paper band

            The form itself, not a link to one. It carries
            data-quote-form, so the sticky call rail hides while it is on
            screen and can never sit over the submit button.
            ------------------------------------------------------------ */}
        <DatumRule label="Get a price" className="mb-8 mt-16 md:mt-20" />

        <div
          id="quote"
          className="grid min-w-0 scroll-mt-24 gap-10 lg:grid-cols-12 lg:gap-14"
        >
          <div className="min-w-0 lg:col-span-5">
            <h2 className="ps-display ps-display-lg">
              Send the vehicle. We will send a number back.
            </h2>

            <Prose className="mt-6">
              <p>
                It goes straight to the shop. The year, the make, the model
                and what you want done is enough to start, and anything you
                add gets the first number closer.
              </p>
              <p>
                Size of the vehicle and condition of the paint decide the
                price, so it is quoted on the car in front of us and put in
                writing before any work starts.
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

            {/* Authority at the decision point, which is section 5 of
                DIRECTION-V2. Both rows go out to the manufacturer's own
                directory, so the last thing next to the form is the one
                claim on this site a visitor can verify without asking us. */}
            <div className="mt-9 border-t border-rule-light">
              {CREDENTIALS.map((c) => (
                <a
                  key={c.id}
                  href={c.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-[56px] min-w-0 flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-rule-light py-3"
                >
                  <span className="min-w-0 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-900">
                    {c.label}
                  </span>
                  <span className="flex-none font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-cyan-ink group-hover:underline">
                    Check the listing
                    <span className="sr-only"> for {c.label}. Opens in a new tab.</span>
                    <span aria-hidden="true"> {"↗"}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <QuoteForm heading={null} intro={null} source="/" />
          </div>
        </div>
      </Section>
    </>
  );
}
