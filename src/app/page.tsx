import type { Metadata } from "next";
import Link from "next/link";

import { CoverageLadder } from "@/components/ppf";
import QuoteForm from "@/components/quote/QuoteForm";
import CTABand from "@/components/sections/CTABand";
import HomeHero from "@/components/sections/HomeHero";
import ServiceCards from "@/components/sections/ServiceCards";
import StatBand from "@/components/sections/StatBand";
import TownChips from "@/components/sections/TownChips";
import PhoneLink from "@/components/tracking/PhoneLink";
import {
  Button,
  DatumRule,
  KeyValueList,
  KeyValueRow,
  Plate,
  Prose,
  Section,
  SectionHead,
} from "@/components/ui";
import {
  BRAND,
  CITIES,
  CREDENTIALS,
  GTECHNIQ_FACTS,
  NEAREST_EXIT,
  PPF_FILM,
  REVIEWS,
  REVIEW_SUMMARY,
} from "@/lib/constants";
import { cn, longDate, milesLong } from "@/lib/utils";

/* ============================================================================
   THE HOME PAGE

   REBUILT 2026-08-19. The first composition was honest and monotonous: after
   the hero, every band rendered the same texture, a mono label over ruled
   key and value rows, and the nine services were nine identical text lines
   whose right column repeated "Quoted on your vehicle" nine times. Held
   against the reference sites the diagnosis was simple: no numbers with
   presence, no photography in the argument, no shape a scanning eye can
   hold on to.

   SIX BANDS, and what each one is for now:
     1  hero: his own shop, his own banner, the trust row on its bottom edge
     2  paper: the stat band, then the two credentials, then all nine
        services as photographic cards
     3  dark: the film ladder at a glance, then the photographs
     4  paper: five reviews verbatim, near the decision point
     5  dark: the owner
     6  paper: the towns as links, then the form itself, inline

   WHAT LEFT THIS PAGE AND WHERE IT WENT. The nine year coating's full
   record moved to /ceramic-coating/, which is its selling page; the
   credential band here says it in one line and links it. The sixteen row
   drive time table moved back to /areas/ and each town page; the towns are
   chips here, still real links with the measured minutes on them. The
   fifteen row coverage matrix stays on /paint-protection-film/; the ladder
   here is its one glance version and links it.

   THE H1 IS THE HERO'S. <HomeHero> owns it and owns the page's one solid
   cyan button, so nothing in this file renders either. Every other action
   on the page is a ghost button or a quote link.
   ========================================================================== */

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

/** Derived, never typed: how many of the five reviews use his first name. */
const OWNER_FIRST = BRAND.owner.split(" ")[0];
const NAMED_COUNT = REVIEWS.filter((r) => r.text.includes(OWNER_FIRST)).length;

const [LEAD_REVIEW, ...OTHER_REVIEWS] = REVIEWS;

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

          Full bleed photograph, directional scrim, one display heading,
          one solid action and one outline action, and the trust row on
          the bottom edge. It renders its own <TrustBar>, so this page
          must never mount a second one.
          ================================================================ */}
      <HomeHero />

      {/* ================================================================
          2. THE RECORD PLANE

          The numbers first, at a size that reads as a claim being made
          on the record: the rating, the longest guarantee, the two
          accreditations, the photo count. Then the credentials those
          numbers hang off, then every service the shop sells, each on
          its own photograph.
          ================================================================ */}
      <Section plane="sheet" label="The record">
        <StatBand />

        <DatumRule label="Credentials" className="mb-6 mt-14 md:mt-16" />

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

        <p className="mt-5 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-600">
          The nine year coating those credentials unlock, and what its
          guarantee actually says, is written out on the{" "}
          <Link href="/ceramic-coating/" className="link-inline">
            ceramic coating page
          </Link>{" "}
          and on{" "}
          <Link href="/warranties/" className="link-inline">
            what is actually guaranteed
          </Link>
          .
        </p>

        <DatumRule label="Service index" className="mb-8 mt-14 md:mt-16" />

        {/* An h2, not an h3. The service index is a peer of the credential
            block above it rather than a child of it, and it only shares a
            <Section> with it because both live on the record plane. */}
        <h2 className="ps-display ps-display-md">
          Everything the shop does.
        </h2>

        <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-600">
          Nine services, one shop. Every job is quoted on the vehicle in
          front of us, and the number goes to you in writing before any work
          starts. How the number is decided is on the{" "}
          <Link href="/pricing/" className="link-inline">
            how we quote a job
          </Link>{" "}
          page.
        </p>

        <ServiceCards className="mt-8 md:mt-10" />

        <CTABand variant="line" className="mt-12" />
      </Section>

      {/* ================================================================
          3. THE FILM LADDER AND THE WORK, one dark band

          Film is the largest line in the ad account and the worst
          converting page on the old site. Everyone who lands here sees
          the ladder, not only the paid film clicks. The full fifteen
          row matrix lives on the film page; this is the glance.
          ================================================================ */}
      <Section plane="shop" label="Paint protection film">
        <SectionHead
          align="split"
          title="Film, in four coverage levels."
          intro={
            <>
              <p>{PPF_FILM.limits[0]}</p>
              <p>
                Each level contains everything in the level below it. Every
                body panel, and exactly which levels cover it, is drawn out
                panel by panel on the film page.
              </p>
            </>
          }
        />

        <div className="mt-8 md:mt-10">
          <CoverageLadder />
        </div>

        <div className="mt-8">
          <Button href="/paint-protection-film/" tone="ghost" size="sm">
            See every panel, against all four levels
          </Button>
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

        <p className={`${MONO_META} mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-ink-400`}>
          <span aria-hidden="true" className="tracking-[0.3em] text-cyan-ink">
            {"★★★★★"}
          </span>
          <span>
            {REVIEW_SUMMARY.rating} from {REVIEW_SUMMARY.count}{" "}
            {REVIEW_SUMMARY.source} reviews, checked{" "}
            {longDate(REVIEW_SUMMARY.checkedOn)}
          </span>
        </p>

        <blockquote className="mt-8 min-w-0 max-w-3xl">
          <span aria-hidden className="block h-px w-6 bg-cyan-500" />
          <p className="mt-6 text-[1.1875rem] leading-[1.55] text-ink-900 sm:text-[1.4375rem]">
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

          The towns as real links with the measured minutes riding on
          each chip. The full measured table, miles and routes included,
          lives on /areas/ and on every town's own page.
          ================================================================ */}
      <Section plane="sheet" label="Service area">
        <SectionHead
          align="split"
          title="How far you are from the shop."
          intro={
            <p>
              Sixteen towns, each one measured from the shop door rather than
              estimated. The minutes on each town are the real drive. If
              yours is not on the list, call and ask.
            </p>
          }
        />

        <p className={`${MONO_META} mt-6 text-ink-400`}>
          {NEAREST_EXIT.label}, {milesLong(NEAREST_EXIT.miles)} ·{" "}
          {CITIES.length} towns measured
        </p>

        <TownChips className="mt-6" />

        <div className="mt-8">
          <Button href="/areas/" tone="ghost" size="sm">
            Every town, with miles and routes
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

            {/* Authority at the decision point. Both rows go out to the
                manufacturer's own directory, so the last thing next to the
                form is the one claim on this site a visitor can verify
                without asking us. */}
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
