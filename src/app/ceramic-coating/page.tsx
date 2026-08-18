import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import CTABand from "@/components/sections/CTABand";
import TrustBar from "@/components/sections/TrustBar";
import QuoteForm from "@/components/quote/QuoteForm";
import ServiceSchema from "@/components/seo/ServiceSchema";
import PhoneLink from "@/components/tracking/PhoneLink";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import DatumRule from "@/components/ui/DatumRule";
import KeyValueRow, { KeyValueList } from "@/components/ui/KeyValueRow";
import Plate, { isBleedCleared } from "@/components/ui/Plate";
import { PriceOrQuote } from "@/components/ui/PriceFigure";
import QuoteLink from "@/components/ui/QuoteLink";
import RuleLabel from "@/components/ui/RuleLabel";
import Section, { SectionHead } from "@/components/ui/Section";
import { asset } from "@/lib/asset";
import { PHOTOS } from "@/lib/photos";
import {
  BRAND,
  CITIES,
  COATING_ADDONS,
  COATINGS,
  CREDENTIALS,
  GTECHNIQ_FACTS,
  REVIEWS,
  SERVICES,
} from "@/lib/constants";

const SERVICE = SERVICES.find((s) => s.id === "ceramic-coating")!;
const GTECHNIQ = CREDENTIALS.find((c) => c.id === "gtechniq")!;

/* COATINGS is a const tuple, so Extract keeps the exact member type and the
   named chemistry on the nine year tier is typed rather than optional. */
type Coating = (typeof COATINGS)[number];
const NINE = COATINGS.find((c) => c.id === "petty-shine-nine") as Extract<
  Coating,
  { id: "petty-shine-nine" }
>;

/* The guarantee terms, read off the tiers rather than typed, so a change in
   constants.ts rewrites the sentence. "3 year" becomes "3", and the list
   comes out as "3, 5 and 9 year guarantees". */
const GUARANTEE_YEARS = COATINGS.map((c) => c.guarantee.replace(/\s*year.*/i, ""));
const GUARANTEE_LINE = `${GUARANTEE_YEARS.slice(0, -1).join(", ")} and ${
  GUARANTEE_YEARS[GUARANTEE_YEARS.length - 1]
} year guarantees`;

/* THE COATING REVIEW. Filtered on the review's own service field rather than
   picked by hand, so it cannot end up quoting a detailing job on the coating
   page. Landon Brown's is the one that names the service outright. */
const COATING_REVIEW =
  REVIEWS.find(
    (r) => r.service.toLowerCase().includes("ceramic") && r.text.length > 200
  ) ?? REVIEWS[0];

/* The four towns that show up in his own paid search terms, in road order.
   Every figure is measured, and each links to that town's own page. */
const NEAR_TOWNS = ["greensboro-nc", "high-point-nc", "asheboro-nc", "randleman-nc"]
  .map((slug) => CITIES.find((c) => c.slug === slug)!)
  .sort((a, b) => a.minutes - b.minutes);

/* 156 characters. No dollar figure: PRICING_MODE is private, and a meta
   description is one of the three places the audit checks for a leak. */
const DESCRIPTION = `Ceramic coating in ${BRAND.city}, ${BRAND.stateName} by a ${GTECHNIQ.label}. Three coatings with ${GUARANTEE_LINE}, each quoted on your vehicle.`;

export const metadata: Metadata = {
  title: `${SERVICE.name} in ${BRAND.city}, ${BRAND.state}`,
  description: DESCRIPTION,
  alternates: { canonical: "/ceramic-coating/" },
};

/* ---------------------------------------------------------------------------
   THE HERO

   Same construction as the home hero, on this page's own photograph: full
   bleed frame, one flat tonal overlay, a letterspaced eyebrow, one display
   heading, one solid action and one outline action, and the trust row riding
   the bottom edge. The classes are the shared .hero block in globals.css, so
   this page cannot drift from the home page's version of the same thing.

   THE PHOTOGRAPH is his Rapid Blue C8 standing under his own banner, which
   is also the car the Coverage Plan on the film page is drawn from. It is
   one of the eight ids cleared for full bleed in Plate.tsx.

   --hero-focus is set here rather than inherited, because the value in
   globals.css is measured for the Huracan frame. This frame puts the car low
   and centred, so the crop holds the middle and drops a little more ceiling.
   ------------------------------------------------------------------------- */
const HERO_PHOTO = "coating-corvette-c8" as const;

if (process.env.NODE_ENV !== "production" && !isBleedCleared(HERO_PHOTO)) {
  // eslint-disable-next-line no-console
  console.warn(
    `[ceramic-coating] ${HERO_PHOTO} is not in BLEED_CLEARED and must not run full bleed.`
  );
}

function Hero() {
  const meta = PHOTOS[HERO_PHOTO];
  const widest = meta.sizes[meta.sizes.length - 1];
  const srcSet = (ext: "avif" | "webp") =>
    meta.sizes
      .map((w) => `${asset(`/photos/${HERO_PHOTO}-${w}.${ext}`)} ${w}w`)
      .join(", ");

  return (
    <section
      className="hero plane-shop"
      style={{ "--hero-focus": "50% 54%" } as CSSProperties}
      aria-label={`${SERVICE.name} at ${BRAND.name}, ${BRAND.city}, ${BRAND.stateName}`}
    >
      <picture className="hero__media">
        <source type="image/avif" srcSet={srcSet("avif")} sizes="100vw" />
        <source type="image/webp" srcSet={srcSet("webp")} sizes="100vw" />
        {/* alt is empty on purpose: the photograph is the hero's ground and
            the heading beside it already says what this page is. */}
        <img
          src={asset(`/photos/${HERO_PHOTO}-${widest}.webp`)}
          width={meta.w}
          height={meta.h}
          alt=""
          loading="eager"
          decoding="sync"
          fetchPriority="high"
        />
      </picture>
      <div className="hero__scrim" aria-hidden="true" />

      <div className="hero__body container-site">
        <div className="hero__copy">
          {/* The town, not the state name: at 390 the long form wraps and
              orphans "Carolina" onto its own line. The full state name is in
              the first sentence of the paragraph below. */}
          <p className="hero__eyebrow">
            {SERVICE.name} · {BRAND.city}, {BRAND.state}
          </p>

          <h1 className="ps-display ps-display-lg hero__title">
            The ceramic coating most shops are not allowed to apply.
          </h1>

          <div className="hero__prose">
            <p>
              Ceramic coating in {BRAND.city}, {BRAND.stateName}. {BRAND.name}{" "}
              is a {GTECHNIQ.label}, listed at this address in Gtechniq&rsquo;s
              own directory. Three coatings, with {GUARANTEE_LINE}.
            </p>
            <p>{GTECHNIQ_FACTS.proOnly}</p>
          </div>

          <div className="hero__actions">
            {/* The one solid action on this screen. Asking for a vehicle and
                a tier is a smaller step than booking a job. */}
            <Button href="#quote" tone="cyan">
              Get a price on your vehicle
            </Button>
            <PhoneLink placement="ceramic-hero" className="ps-btn ps-btn--ghost">
              Call {BRAND.phoneDisplay}
            </PhoneLink>
          </div>
        </div>
      </div>

      <TrustBar plane="none" className="hero__trust" />
    </section>
  );
}

/* ---------------------------------------------------------------------------
   One tier of the ladder.

   Only the five and nine year coatings name a base and a top coat, because
   his own price list names a product for those two and names none for the
   three year tier. Rather than leave that tier's specification a row short,
   which reads as an omission, it carries `chemistryPending` from constants
   and says out loud that no product is published for it.

   THE PRICE SLOT IS THE TIER'S ACTION. <PriceOrQuote> reads PRICING_MODE
   itself, so this file never branches on the flag: in private mode it is a
   tappable link into /quote/ carrying this tier's package key, and if the
   prices ever go back on the site the same call prints the figure.
   ------------------------------------------------------------------------- */
function CoatingTier({ coating, index }: { coating: Coating; index: number }) {
  const subtitle = "subtitle" in coating ? coating.subtitle : null;
  const base = "base" in coating ? coating.base : null;
  const top = "top" in coating ? coating.top : null;
  const pending =
    "chemistryPending" in coating ? coating.chemistryPending : null;
  const named = "proOnly" in coating;
  const ruleLabel = `Tier ${String(index + 1).padStart(2, "0")} of ${String(
    COATINGS.length
  ).padStart(2, "0")}`;

  return (
    <div className="mt-12 min-w-0 first:mt-0">
      <DatumRule label={ruleLabel} labelTone={named ? "accent" : "default"} />

      {/* THE TWO COLUMNS ARE BALANCED ON PURPOSE. The first pass put the
          heading and one line of prose on the left against a specification
          and a five row process on the right, which left a third of the band
          empty on every desktop screenshot. The specification now sits under
          the heading it belongs to, and the process stands beside it. */}
      <div className="mt-7 grid min-w-0 gap-8 lg:grid-cols-12 lg:gap-14">
        <div className="min-w-0 lg:col-span-5">
          <h3 className="ps-display ps-display-md">{coating.name}</h3>
          {subtitle ? (
            <p className="mt-2">
              <RuleLabel tone="quiet">{subtitle}</RuleLabel>
            </p>
          ) : null}

          <p className="ps-prose mt-4">{coating.bestFor}.</p>

          <KeyValueList
            className="mt-6"
            label={`${coating.name} specification`}
          >
            <KeyValueRow k="Guarantee" v={coating.guarantee} />
            {base ? <KeyValueRow k="Base coat" v={base} /> : null}
            {top ? <KeyValueRow k="Top coat" v={top} /> : null}
            {pending ? (
              <KeyValueRow
                k={pending.key}
                note={pending.note}
                v={pending.value}
                tone="pewter"
              />
            ) : null}
          </KeyValueList>

          {/* The tier goes with the click. Without the package key a lead off
              the nine year row and a lead off the three year row land in the
              shop inbox as the same lead. */}
          <div className="mt-6">
            <PriceOrQuote
              service={SERVICE.quoteKey}
              package={coating.id}
              value={coating.fromPrice}
              size="lg"
            />
          </div>
        </div>

        <div className="min-w-0 lg:col-span-7">
          <p>
            <RuleLabel>What is in it</RuleLabel>
          </p>

          <KeyValueList className="mt-3" label={`${coating.name}, what is included`}>
            {coating.includes.map((step, i) => (
              <KeyValueRow
                key={step}
                k={`Step ${String(i + 1).padStart(2, "0")}`}
                v={step}
                mono={false}
              />
            ))}
          </KeyValueList>
        </div>
      </div>
    </div>
  );
}

export default function CeramicCoatingPage() {
  return (
    <>
      {/* No `price` prop while PRICING_MODE is private: a number in an Offer
          node is a published price like any other. */}
      <ServiceSchema
        name={SERVICE.name}
        description={DESCRIPTION}
        url="/ceramic-coating/"
        serviceType="Ceramic coating application"
      />

      <Breadcrumbs
        plane="shop"
        trail={[{ label: SERVICE.name, href: SERVICE.href }]}
      />

      <Hero />

      <Section plane="sheet" label="The three coatings">
        <SectionHead
          title="What is in each one."
          intro={
            <p>
              Every step of every tier is published below. What changes between
              them is how far the paint is corrected before anything goes on
              it, what goes on it, and how long Gtechniq stands behind it.
            </p>
          }
        />

        <div className="mt-9 md:mt-11">
          {COATINGS.map((c, i) => (
            <CoatingTier key={c.id} coating={c} index={i} />
          ))}
        </div>

        <CTABand
          variant="line"
          service={SERVICE.quoteKey}
          ctaLabel="Get a price"
          body="Send the year, make and model with the tier you are looking at and we will come back with a number for that car, in writing, before anything is scheduled."
          className="mt-12"
        />
      </Section>

      <Section plane="shop" label="Accreditation">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-6">
            <SectionHead
              title="The nine year coating we put our own name on."
              intro={
                <p>
                  {NINE.name} is the {NINE.guarantee} package. It is the only
                  tier that starts with a full paint correction, and the only
                  one built on {NINE.base}.
                </p>
              }
            />

            <div className="ps-prose mt-6">
              <p>{GTECHNIQ_FACTS.hardness}</p>
              <p>
                The accreditation is not ours to award and it is not ours to
                claim quietly. {BRAND.name} is listed at {BRAND.street} in{" "}
                <a
                  href={GTECHNIQ.source}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Gtechniq&rsquo;s own Find A Detailer directory
                </a>
                . Check it before you book anywhere, including here.
              </p>
            </div>

            {/* The same four facts as plain rows, so the specification of the
                top tier is readable as text and not only inside a ladder
                three sections up the page. */}
            <KeyValueList className="mt-8" label="The nine year coating">
              <KeyValueRow k="Applied by" v={GTECHNIQ.label} />
              <KeyValueRow k="Base coat" v={NINE.base} />
              <KeyValueRow k="Top coat" v={NINE.top} />
              <KeyValueRow k="Guarantee" v={`${NINE.guarantee}, issued by Gtechniq`} />
            </KeyValueList>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/paint-correction/" tone="ghost" size="sm">
                How the paint correction works
              </Button>
              <Button href="/warranties/" tone="ghost" size="sm">
                What the guarantee covers
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-6">
            <Plate
              id="coating-huracan"
              caption="The Crystal Serum Ultra display on the shop wall, behind a coated Huracan"
              sizes="(min-width: 1024px) 34rem, 100vw"
            />

            {/* Social proof at the decision point rather than parked on a
                reviews page, and in the column that would otherwise run
                short against the copy beside it. Verbatim and attributed,
                and the service it names is read off the review record so it
                cannot be mislabelled. */}
            <blockquote className="mt-9 min-w-0 border-t border-rule-dark pt-7">
              <span aria-hidden className="block h-px w-6 bg-cyan-500" />
              <p className="mt-5 text-[1.0625rem] leading-relaxed text-spec-000">
                {COATING_REVIEW.text}
              </p>
              <footer className="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-1 font-mono text-[0.6875rem] uppercase tracking-[0.18em]">
                <span className="text-spec-000">{COATING_REVIEW.name}</span>
                <span className="text-ink-300">{COATING_REVIEW.service}</span>
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

      <Section plane="sheet" label="The guarantee">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="Read the conditions before you book it."
              intro={
                <p>
                  These are Gtechniq&rsquo;s terms on the paint protection
                  guarantee, not ours. We would rather you know them now than
                  find them in year four.
                </p>
              }
            />

            <div className="ps-prose mt-6">
              <p>{GTECHNIQ_FACTS.maintenanceNote}</p>
              <p>
                A coating protects the paint it goes on top of. Coat swirled
                paint and the swirls are still there under it, which is why the
                top tier corrects the paint first and why we say what your
                paint needs before we quote a tier.
              </p>
            </div>

            <div className="mt-7">
              <Button href="/warranties/" tone="ghost" size="sm">
                Every term, in full
              </Button>
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

            <p className="mt-9">
              <RuleLabel>Add ons</RuleLabel>
            </p>

            <KeyValueList className="mt-3" label="Coating add ons">
              {COATING_ADDONS.map((addon) => (
                <KeyValueRow
                  key={addon}
                  k={addon}
                  v={
                    <QuoteLink
                      service={SERVICE.quoteKey}
                      ariaLabel={`Add ${addon.toLowerCase()} to a quote`}
                    >
                      Add to a quote
                    </QuoteLink>
                  }
                />
              ))}
            </KeyValueList>
          </div>
        </div>
      </Section>

      <Section plane="shop" label="Get a price" id="quote">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="Tell us the vehicle and the tier."
              intro={
                <p>
                  A coating is quoted on the size of the vehicle and the state
                  of the paint, so the closer you describe both, the closer the
                  first number lands. You get it in writing before anything is
                  scheduled.
                </p>
              }
            />

            <PhoneLink
              placement="ceramic-quote"
              className="mt-8 flex min-w-0 items-center justify-between gap-4 border border-rule-dark bg-shop-060 px-5 py-5 transition-colors hover:border-cyan-500"
            >
              <span className="min-w-0">
                <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-300">
                  Rather call
                </span>
                <span className="mt-1 block font-mono text-2xl tabular-nums text-spec-000">
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

            <p className="mt-9">
              <RuleLabel>Where the cars come from</RuleLabel>
            </p>

            <KeyValueList className="mt-3" label="Drive times to the shop">
              {NEAR_TOWNS.map((town) => (
                <KeyValueRow
                  key={town.slug}
                  k={
                    <Link href={`/areas/${town.slug}/`} className="link-inline">
                      Ceramic coating in {town.name}
                    </Link>
                  }
                  v={`${town.minutes} min via ${town.route}`}
                />
              ))}
            </KeyValueList>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <QuoteForm
              service={SERVICE.quoteKey}
              lockService
              heading={null}
              intro={null}
              source="/ceramic-coating/"
              id="quote-form"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
