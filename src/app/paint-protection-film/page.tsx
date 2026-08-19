import type { Metadata } from "next";
import Link from "next/link";

import { PpfCoveragePlan, SpecificationPending } from "@/components/ppf";
import QuoteForm from "@/components/quote/QuoteForm";
import TrustBar from "@/components/sections/TrustBar";
import ServiceSchema from "@/components/seo/ServiceSchema";
import PhoneLink from "@/components/tracking/PhoneLink";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import DatumRule from "@/components/ui/DatumRule";
import KeyValueRow, { KeyValueList } from "@/components/ui/KeyValueRow";
import Plate from "@/components/ui/Plate";
import { PriceOrQuote } from "@/components/ui/PriceFigure";
import Section, { SectionHead } from "@/components/ui/Section";
import { asset } from "@/lib/asset";
import {
  BRAND,
  CITIES,
  CREDENTIALS,
  PPF_FILM,
  PPF_PACKAGES,
  REVIEWS,
  REVIEW_SUMMARY,
  SERVICES,
} from "@/lib/constants";
import { PHOTOS } from "@/lib/photos";
import { drive, longDate } from "@/lib/utils";

/* ============================================================================
   PAINT PROTECTION FILM

   THE MOST EXPENSIVE PAGE ON THE SITE. His Google Ads account spends more on
   film than on anything else, $1,239 on the phrase "paint protection film"
   alone over ninety days, and the old landing page turned 170 clicks into
   one lead. It did that by listing four package names in prose, pricing
   none, showing no coverage, and contradicting itself on which film it
   installs.

   SO THE PAGE IS BUILT IN THE ORDER A BUYER ASKS:
     what is this            the hero, one sentence and a photograph
     can I trust the shop    the trust row, both credentials linked to the
                             manufacturer's own directory
     what do I actually get  the Coverage Plan, immediately, not two screens
                             down. It is the flagship and it is the whole
                             answer to the question the ad click was asking.
     what film, what backs   the STEK specification and the honest gap
     what does it not do     the manufacturer's own limits, in his own words
     what will it cost       the form, inline, with the service locked

   PRICING. He publishes no film price and no source for one exists, so every
   price slot here is <PriceOrQuote service="ppf" value={null} />, which
   renders the tappable "Quoted on your vehicle" link into the form with the
   service already selected. No dollar figure appears on this page in either
   pricing mode, because there has never been a film figure to print.
   ========================================================================== */

const SERVICE = SERVICES.find((s) => s.id === "paint-protection-film")!;
const STEK = CREDENTIALS.find((c) => c.id === "stek")!;

/** The default rung of the ladder, so the copy and the diagram agree. */
const DEFAULT_PACKAGE = PPF_PACKAGES.find((p) => p.id === "full-front")!;

/**
 * The review that argues for a film job. None of the five verbatim Google
 * reviews names film, so this page shows the one that is about the process a
 * film customer is buying, quoting and scheduling and a final inspection,
 * and it prints the service that review was actually left for rather than
 * implying it was a film job.
 */
const PROCESS_REVIEW = REVIEWS.find((r) => r.name === "Scott Fischer")!;

/** Four towns the ad account's own search terms come from, with the drive
    measured from the shop. Real internal links with descriptive anchors,
    which is what the town pages are for. */
const FILM_TOWNS = ["greensboro-nc", "high-point-nc", "asheboro-nc", "winston-salem-nc"]
  .map((slug) => CITIES.find((c) => c.slug === slug)!)
  .filter(Boolean);

/* THE HERO PHOTOGRAPH is coating-corvette-c8, one of the eight ids cleared
   for full bleed and the only cleared frame that is the same car the
   Coverage Plan is drawn as. Its alt is empty here on purpose: it is the
   hero's ground rather than content, the heading beside it says what the
   page is, and the same frame is described in full on the gallery. No copy
   on this page claims the car in it is wearing film. The three photographs
   that are genuinely film work are further down, captioned, in The work. */
const HERO_PHOTO = "coating-corvette-c8" as const;
const HERO = PHOTOS[HERO_PHOTO];
const HERO_WIDEST = HERO.sizes[HERO.sizes.length - 1];
const heroSrcSet = (ext: "avif" | "webp") =>
  HERO.sizes
    .map((w) => `${asset(`/photos/${HERO_PHOTO}-${w}.${ext}`)} ${w}w`)
    .join(", ");

/* 157 characters, inside the 150 to 160 Google will actually show. The what
   and the where lead, the credential follows, and no price appears because
   he publishes none. Also the ServiceSchema description, which is why it is
   one string and not two. */
const DESCRIPTION = `Paint protection film in ${BRAND.city}, ${BRAND.stateName}, from an ${STEK.label}. See which panels each of the four coverage levels covers, on your car.`;

export const metadata: Metadata = {
  title: `${SERVICE.name} in ${BRAND.city}, ${BRAND.state}`,
  description: DESCRIPTION,
  alternates: { canonical: "/paint-protection-film/" },
};

const MONO_META =
  "font-mono text-[0.6875rem] uppercase leading-relaxed tracking-[0.2em]";

export default function PaintProtectionFilmPage() {
  return (
    <>
      <ServiceSchema
        name={SERVICE.name}
        description={DESCRIPTION}
        url="/paint-protection-film/"
        serviceType="Paint protection film installation"
      />

      {/* On the shop plane so the strip runs into the dark hero under it
          rather than cutting a pale band between the header and the photo.
          It emits the BreadcrumbList JSON-LD. */}
      <Breadcrumbs
        plane="shop"
        trail={[{ label: SERVICE.name, href: SERVICE.href }]}
      />

      {/* ================================================================
          THE HERO

          Full bleed photograph, one flat tonal overlay at a single
          opacity, a letterspaced eyebrow, one display heading, one solid
          action and one outline action. The overlay is never a gradient:
          a scrim that fades out is the most common tell of a template
          hero and DIRECTION-V2 section 2 forbids soft gradients outright.
          ================================================================ */}
      <section
        className="plane-shop relative isolate flex min-h-[29rem] flex-col overflow-hidden md:min-h-[34rem]"
        aria-label={`${SERVICE.name}, ${BRAND.name}`}
      >
        <picture className="hero-media-settle">
          <source type="image/avif" srcSet={heroSrcSet("avif")} sizes="100vw" />
          <source type="image/webp" srcSet={heroSrcSet("webp")} sizes="100vw" />
          <img
            src={asset(`/photos/${HERO_PHOTO}-${HERO_WIDEST}.webp`)}
            width={HERO.w}
            height={HERO.h}
            alt=""
            loading="eager"
            decoding="sync"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover object-[50%_46%]"
          />
        </picture>
        {/* The shared directional scrim: heavy where the copy sits, light
            over the car, heavy again at the base. Same class the home hero
            reads, so the two treatments cannot drift. */}
        <div aria-hidden="true" className="hero-scrim" />

        <div className="container-site relative flex flex-1 items-center py-14 md:py-20">
          <div className="min-w-0 max-w-[48rem]">
            <p className={`${MONO_META} text-spec-000`}>
              {SERVICE.name} · {BRAND.city}, {BRAND.state}
            </p>

            {/* The measure is set on the heading rather than on the column,
                because the heading is the only thing here that wants to run
                wider than the paragraph. At 36rem the first two lines came
                out as one word each, which reads as a typographic accident
                rather than as a break. */}
            <h1 className="ps-display ps-display-xl mt-6 max-w-[46rem]">
              Paint protection film takes the hit. The paint does not.
            </h1>

            <div className="mt-6 max-w-[34rem] text-[1rem] leading-[1.65] text-spec-000 md:text-[1.0625rem]">
              <p>
                Paint protection film is clear urethane laid over the panels
                that take the damage. Rocks and road grit hit the film. The
                paint under it stays the paint the car was built with.
              </p>
              <p className="mt-3">
                {BRAND.name} is an {STEK.label} in {BRAND.city},{" "}
                {BRAND.stateName}. Four coverage levels, drawn panel by panel
                below, and every one of them is quoted on your vehicle.
              </p>
            </div>

            <div
              /* Under 520 the two actions stack, and two stacked buttons at
                 their own natural widths read as a mistake, so they stretch
                 to one column. Same breakpoint the home hero uses. */
              className="mt-8 flex flex-col items-stretch gap-3 min-[520px]:flex-row min-[520px]:flex-wrap min-[520px]:items-center"
              /* The ghost button's hairline is built for a flat near black
                 ground and disappears over a photograph, so the rule
                 variable the primitive already reads is raised here rather
                 than the border being redeclared out from under it. */
              style={{ ["--ps-rule" as string]: "rgb(232 228 216 / 0.42)" }}
            >
              {/* The one solid cyan button on this screen. Asking for a
                  vehicle is a smaller step than booking a job. */}
              {/* Points at the section, not at the <form>. The header is
                  sticky and .ps-section carries scroll-margin-top, so a jump
                  to the form element itself would land its first field under
                  the navbar. */}
              <Button href="#quote" tone="cyan">
                Get a price
              </Button>
              <PhoneLink placement="ppf-hero" className="ps-btn ps-btn--ghost">
                Call {BRAND.phoneDisplay}
              </PhoneLink>
            </div>
          </div>
        </div>
      </section>

      {/* The hairline trust row, directly under the hero the way the
          reference runs it. It stays on the shop plane: it is well under
          400px tall, so it belongs to the band above it rather than
          starting a plane of its own. Both credentials link out to the
          manufacturer's own directory. */}
      <TrustBar plane="shop" />

      {/* ================================================================
          THE COVERAGE PLAN, as high on the page as it can go

          This is the answer to the question the ad click asked, so it
          comes before the specification, before the photographs and
          before the form. Four levels, each a strict superset of the one
          below, with a text record of all fifteen panels beside the
          drawing and an overlay showing what gets hit at highway speed.
          ================================================================ */}
      <Section plane="shop" label="Coverage">
        <SectionHead
          align="split"
          title="What the film actually covers."
          intro={
            <>
              <p>
                Four coverage levels, each one containing everything in the
                level below it. Every body panel is listed against all four, so
                you can see what a level covers and what the next one adds.
              </p>
              <p>
                {DEFAULT_PACKAGE.name} is marked, because it is the most common
                job the shop does.
              </p>
            </>
          }
        />
        <div className="mt-8 md:mt-10">
          <PpfCoveragePlan />
        </div>
      </Section>

      {/* ================================================================
          THE FILM ITSELF

          The record plane. STEK's own published specification, then the
          honest gap: his current site brands everything STEK and promises
          an XPEL warranty, and STEK's two websites publish different
          terms for DYNOshield. So the film and the warranty are settled
          in writing for the vehicle rather than claimed here.
          ================================================================ */}
      <Section plane="sheet" label="The film">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="We are an Authorized STEK installer."
              intro={<p>{STEK.body}</p>}
            />

            <div className="ps-prose mt-5">
              <p>
                Film is not a coating. A{" "}
                <Link href="/ceramic-coating/" className="link-inline">
                  ceramic coating
                </Link>{" "}
                is chemistry bonded to the clear coat. Film is a physical
                layer thick enough to absorb an impact, and it is meant to be
                replaced once it has taken enough of them.
              </p>
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
              {/* Never a dead cell. He publishes no film price, so this row
                  is the same tappable link the rest of the site uses, with
                  the service already selected on the form it opens. */}
              <KeyValueRow
                k="Price"
                v={<PriceOrQuote service={SERVICE.quoteKey} value={null} />}
                tone="pewter"
              />
            </KeyValueList>

            <SpecificationPending className="mt-8" />
          </div>
        </div>

        <DatumRule label="What film does not do" className="mb-7 mt-12" />

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

      {/* ================================================================
          THE WORK

          The three photographs on this page that are genuinely film work,
          captioned for what they are. None of the three is cleared for
          full bleed and ppf-mclaren-gt is a 960px source, so the widest
          any of them is asked to render is about a third of the shell.
          ================================================================ */}
      <Section plane="shop" label="The work">
        <SectionHead
          align="split"
          title="This is what it looks like going on."
          intro={
            <p>
              Film goes on wet and gets squeegeed down by hand, one panel at a
              time. Every vehicle on this page came through the shop on
              Branson Mill Road.
            </p>
          }
        />

        <div className="mt-6">
          <Button href="/gallery/" tone="ghost">
            See more of the work
          </Button>
        </div>

        {/* One ratio across all three, so the row reads as a contact sheet
            rather than as three photographs of three different shapes. The
            Jeep source is portrait and was setting the height of the whole
            row before this. */}
        <div className="mt-9 grid min-w-0 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Plate
            id="ppf-install-closeup"
            className="min-w-0"
            ratio="4 / 3"
            caption="Film squeegeed down on a black panel"
            sizes="(min-width: 1024px) 23rem, (min-width: 640px) 45vw, 100vw"
          />
          <Plate
            id="ppf-jeep-install"
            className="min-w-0"
            ratio="4 / 3"
            caption="Hood film going on, Jeep"
            sizes="(min-width: 1024px) 23rem, (min-width: 640px) 45vw, 100vw"
          />
          <Plate
            id="ppf-mclaren-gt"
            className="min-w-0"
            ratio="4 / 3"
            caption="McLaren GT, in the shop"
            sizes="(min-width: 1024px) 23rem, (min-width: 640px) 45vw, 100vw"
          />
        </div>
      </Section>

      {/* ================================================================
          THE CLOSE

          The form itself, not a link to one, with the service locked to
          film so the lead cannot arrive unqualified. The review sits
          beside it rather than on a reviews page, because this is where
          the decision gets made.
          ================================================================ */}
      <Section plane="sheet" label="Get a price" id="quote">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="Tell us the vehicle and we will price it."
              intro={
                <p>
                  There is no published price for film, because the panel
                  count and the size of the vehicle decide it. Send the year,
                  make and model with the coverage level you want and we will
                  come back with a number for that car, in writing, before any
                  work starts.
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

            {/* Social proof at the decision point, verbatim and attributed,
                with the service it was actually left for printed under it
                so nothing here implies it was a film job. */}
            <blockquote className="mt-9 min-w-0">
              <span aria-hidden className="block h-px w-6 bg-cyan-500" />
              <p className="mt-5 text-[0.9375rem] leading-relaxed text-ink-600">
                {PROCESS_REVIEW.text}
              </p>
              <footer
                className={`${MONO_META} mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-1`}
              >
                <span className="text-ink-900">{PROCESS_REVIEW.name}</span>
                <span className="text-ink-400">{PROCESS_REVIEW.service}</span>
              </footer>
            </blockquote>

            <p className={`${MONO_META} mt-4 text-ink-400`}>
              {REVIEW_SUMMARY.rating} from {REVIEW_SUMMARY.count}{" "}
              {REVIEW_SUMMARY.source} reviews, checked{" "}
              {longDate(REVIEW_SUMMARY.checkedOn)}
            </p>

            <KeyValueList className="mt-8" label="Shop">
              <KeyValueRow k="Installer" v={STEK.label} />
              <KeyValueRow k="Address" v={BRAND.addressLine} />
              {BRAND.hours.map((h) => (
                <KeyValueRow key={h.days} k={h.days} v={h.time} />
              ))}
            </KeyValueList>

            <p className="mt-6 max-w-md text-[0.9375rem] leading-relaxed text-ink-600">
              Film customers drive in from{" "}
              {FILM_TOWNS.map((c, i) => (
                <span key={c.slug}>
                  {i > 0 ? (i === FILM_TOWNS.length - 1 ? " and " : ", ") : ""}
                  <Link href={`/areas/${c.slug}/`} className="link-inline">
                    {c.name}
                  </Link>
                </span>
              ))}
              . Every drive time on this site was measured from the shop, so{" "}
              {FILM_TOWNS[0].name} is {drive(FILM_TOWNS[0].miles, FILM_TOWNS[0].minutes)}.
            </p>
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
