import type { Metadata } from "next";
import Link from "next/link";

import QuoteForm from "@/components/quote/QuoteForm";
import PhoneLink from "@/components/tracking/PhoneLink";
import TrustBar from "@/components/sections/TrustBar";
import {
  Breadcrumbs,
  Button,
  DatumRule,
  KeyValueList,
  KeyValueRow,
  Plate,
  QuoteLink,
  Section,
  SectionHead,
} from "@/components/ui";
import {
  BRAND,
  COATINGS,
  CREDENTIALS,
  DETAIL_PACKAGES,
  GTECHNIQ_FACTS,
  INTERIOR_PACKAGES,
  NC_TINT_LAW,
  REVIEWS,
  SERVICES,
} from "@/lib/constants";

/* ============================================================================
   /pricing/ , REBUILT FOR PRIVATE PRICING

   DIRECTION-V2 section 1: this page does not get deleted when the numbers
   come off. It keeps its route, because the ad account and every existing
   link point at it, and it changes job. It used to sell the number. It now
   sells the process that produces the number:

     what drives the price on each service
     what the tiers actually differ by, in substance rather than in price
     what happens when the vehicle is in front of us
     that the number goes to you in writing before work starts

   That last one is the load bearing sentence. In private pricing mode the
   visitor has lost the price anchor, so the thing they need most is a reason
   to believe they will not be ambushed at pickup. Reducing perceived risk is
   worth more here than a starting price ever was.

   WHAT IS DELIBERATELY NOT ON THIS PAGE ANY MORE. The five price tables. In
   private mode every one of their value cells renders the identical "Quoted
   on your vehicle" link, and twenty identical rows is not a price list, it is
   a page that has forgotten what it is for. The nine service index with a
   quote link per row already exists on /services/ and does not need saying
   twice. What is here instead is the substance those tables used to sit on
   top of, which is the part a competitor cannot copy and an assistant can
   quote.
   ========================================================================== */

/** Real, attributed, and about this exact page's subject: what the quoting
    process is like from the outside. */
const REVIEW = REVIEWS.find((r) => r.name === "Scott Fischer")!;

const [GTECHNIQ] = CREDENTIALS;

const NINE = COATINGS.find((c) => c.id === "petty-shine-nine")!;

const REGISTRATION = GTECHNIQ_FACTS.guaranteeTerms.find(
  (t) => t.key === "Registration",
)!;

/* 157 characters. */
const DESCRIPTION =
  `What moves the price on a detail, a coating, film, tint or a dent at ` +
  `${BRAND.name} in ${BRAND.city}, ${BRAND.state}, what happens at the ` +
  `walkthrough, and when you get the number.`;

export const metadata: Metadata = {
  title: "Pricing: What It Costs and How We Quote It",
  description: DESCRIPTION,
  alternates: { canonical: "/pricing/" },
};

/**
 * `as const` gives every entry in these arrays its own literal type, so an
 * optional key like `subtitle` exists on some members of the union and not
 * others. `in` is the narrowing that works on that shape.
 */
function subtitleOf(item: object): string | undefined {
  return "subtitle" in item && typeof item.subtitle === "string"
    ? item.subtitle
    : undefined;
}

/** The six things that actually move a number here. Every one of them is
    something visible on the vehicle, and every one is written as a plain
    declarative sentence that survives being lifted out of this layout. */
const DRIVERS = [
  {
    k: "The size of the vehicle",
    v: "A two seat coupe and a crew cab dually are not the same panel count, the same glass or the same hours on the floor.",
  },
  {
    k: "The condition of the paint",
    v: "Swirls, scratches, water spots and oxidation decide how much correction happens before anything is applied. On a detail or a coating this is the single biggest variable.",
  },
  {
    k: "What the interior has lived through",
    v: "Pets, smoke, spilled drinks and sun damaged leather are all more work than dust, and they are the difference between one interior level and the next.",
  },
  {
    k: "The panel count and the panel shape",
    v: "Paint protection film is cut and fitted panel by panel, so the same coverage level takes longer on a body with deep compound curves than on a flatter one.",
  },
  {
    k: "The glass",
    v: `Window tint is priced by how many windows there are and how far the back glass curves. It is not priced by how dark you want it, because ${NC_TINT_LAW.statute} holds every window except the windshield to the same standard.`,
  },
  {
    k: "The size of the damage, and where it sits",
    v: "A door ding on a flat panel and a crease that runs along a body line are different jobs. So is one curbed wheel against a set of four in a new finish.",
  },
];

/** The commitment ladder, written down. Every step is smaller than booking
    a job, which is section 5's point: the easiest next step on any page
    should be smaller than the sale. */
const WALKTHROUGH = [
  {
    n: "01",
    k: "You send the vehicle",
    v: "Year, make, model, and what you want looked at. That is a smaller thing to do than booking a job, and it is all we need to start.",
  },
  {
    n: "02",
    k: "We look at it",
    v: "Which level a vehicle actually needs comes off the paint, the glass or the interior in front of us. That is a look rather than a guess, and it is why the number is not on this page.",
  },
  {
    n: "03",
    k: "You get the number in writing",
    v: "Before any work starts.",
  },
  {
    n: "04",
    k: "You decide",
    v: "Nothing on this site books a job. Sending a vehicle through costs you a phone call at worst.",
  },
];

/** The services whose tiers are not a ladder of levels, each with the one
    sentence that says what its number is actually made of. */
const QUOTED_ON = [
  {
    href: "/paint-protection-film/",
    label: "Paint protection film, and the four coverage levels",
    v: "The four coverage levels differ by which panels get film, and the coverage plan on that page draws every panel in each one so you can see it rather than read it.",
  },
  {
    href: "/window-tinting/",
    label: `Window tinting, and what ${NC_TINT_LAW.statute} allows`,
    v: "The number comes off the window count and the shape of the glass. How dark it ends up is set by the statute, not by the price.",
  },
  {
    href: "/paintless-dent-repair/",
    label: "Paintless dent repair, without touching the paint",
    v: "Priced by how deep the dent is and where it sits on the panel. A shallow ding in the middle of a door is not a crease on a body line.",
  },
  {
    href: "/wheel-repair/",
    label: "Curbed wheel repair and caliper refinishing",
    v: "Priced by how far the rash goes and whether it is one wheel or a set going to a new finish.",
  },
  {
    href: "/marine-detailing/",
    label: "Marine detailing, at the shop on your trailer",
    v: "Priced by the length of the boat and the condition of the hull. A small runabout and a big center console at the same level are not the same job.",
  },
];

const CONTENTS = [
  { id: "drivers", label: "What moves the number" },
  { id: "walkthrough", label: "How the quote happens" },
  { id: "tiers", label: "What separates the tiers" },
  { id: "quote", label: "Get a price" },
];

export default function PricingPage() {
  return (
    <>
      <Breadcrumbs plane="sheet" trail={[{ label: "Pricing", href: "/pricing/" }]} />

      {/* ---------------------------------------------------------------
          The who, what and where in the first hundred words, and the
          reason the number is not printed, said once and plainly.
          --------------------------------------------------------------- */}
      <Section plane="sheet" label="Pricing">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-7">
            <h1 className="ps-display ps-display-lg">
              What it costs, and how we quote it
            </h1>

            <div className="ps-prose mt-6">
              <p>
                Petty Shine is at {BRAND.street} in {BRAND.city},{" "}
                {BRAND.stateName}. Auto detailing, ceramic coating, paint
                protection film, window tint, dent repair and wheel repair are
                all quoted the same way here, on the vehicle they are being
                done to.
              </p>
              <p>
                So this page is not a price list. It is what moves the number
                on each of those services, what actually separates one tier
                from the next, and what happens when the vehicle is in front of
                us.
              </p>
              <p>
                You get the number in writing before any work starts. That is
                the part worth knowing, and it is the part a starting price
                never told you.
              </p>
            </div>

            <DatumRule label="On this page" className="mt-9 mb-5" />
            <ul className="flex min-w-0 flex-wrap gap-x-6 gap-y-2">
              {CONTENTS.map((c) => (
                <li key={c.id}>
                  <Link href={`#${c.id}`} className="link-inline text-[0.9375rem]">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0 lg:col-span-5">
            <KeyValueList label="How a price gets made here">
              <KeyValueRow
                k="Quoted on"
                v="The vehicle in front of us, not a table"
                mono={false}
              />
              <KeyValueRow
                k="What moves it"
                v="Size, and the condition of the paint, glass or interior"
                mono={false}
              />
              <KeyValueRow
                k="You get it"
                v="In writing, before any work starts"
                mono={false}
              />
              <KeyValueRow k="Shop" v={BRAND.addressLine} />
              <KeyValueRow k="Hours" v={BRAND.hoursShort} />
            </KeyValueList>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {/* The primary action, and it was missing. With no published
                  price this page is the whole pricing conversation, so the
                  thing it asks for has to be solid and it has to be the
                  vehicle. Everything else here is a ghost. */}
              <Button href="#quote" tone="cyan">
                Get a price on your vehicle
              </Button>
              <Button href="#walkthrough" tone="ghost">
                How the quote happens
              </Button>
              <PhoneLink
                placement="pricing-hero"
                className="ps-btn ps-btn--ghost"
              >
                Call {BRAND.phoneDisplay}
              </PhoneLink>
            </div>
          </div>
        </div>
      </Section>

      {/* The hairline row the reference runs directly under the hero.
          Pulled up into the hero section's bottom padding, because the
          reference runs it tight under the copy and a full section gap
          above it turns a trust row into a floating band. Nothing in
          .trustbar sets margin, so the utility is not fighting an
          unlayered rule. */}
      <TrustBar plane="sheet" className="-mt-6 md:-mt-10" />

      {/* ---------------------------------------------------------------
          WHAT MOVES THE NUMBER. Six plain sentences, each one a real
          answer to "why can't you just tell me a price".
          --------------------------------------------------------------- */}
      <Section plane="sheet" label="Variables" id="drivers">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              title="What actually moves the number."
              intro={
                <p>
                  None of these are guesses. Each one is something we can see
                  on the vehicle, and each one is the reason two of the same
                  model can quote differently on the same day.
                </p>
              }
            />

            <div className="ps-prose mt-6">
              <p>
                A number given before anyone has looked at the vehicle is a
                guess with a dollar sign in front of it. The honest version is
                to say what the guess would be made of, and then go and look.
              </p>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <KeyValueList label="What moves a price at Petty Shine">
              {DRIVERS.map((row) => (
                <KeyValueRow key={row.k} k={row.k} v={row.v} mono={false} />
              ))}
            </KeyValueList>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------
          THE WALKTHROUGH, on the dark plane, against the floor it
          actually happens on.
          --------------------------------------------------------------- */}
      <Section plane="shop" label="The walkthrough" id="walkthrough">
        <SectionHead
          align="split"
          title="What happens when you bring it in."
          intro={
            <p>
              Four steps, and the first one is the only one that needs anything
              from you. The vehicle in the photograph came in for paint
              correction and left black again.
            </p>
          }
        />

        <div className="mt-8 grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14 md:mt-10">
          <div className="min-w-0 lg:col-span-7">
            <KeyValueList label="How a Petty Shine quote happens">
              {WALKTHROUGH.map((step) => (
                <KeyValueRow
                  key={step.n}
                  k={
                    <>
                      <span className="mr-3 font-mono text-[0.6875rem] tracking-[0.26em] text-ink-300">
                        {step.n}
                      </span>
                      {step.k}
                    </>
                  }
                  v={step.v}
                  mono={false}
                />
              ))}
            </KeyValueList>

            {/* Hand rolled rather than a <CTABand>, because this page
                carries its own quote form and the honest next step is
                the form 400px below rather than a hop to /quote/. A
                CTABand with no service prop would have shipped a link
                into an empty form, which is the one thing the whole
                pricing gate exists to prevent. */}
            <div className="mt-9">
              <DatumRule />
              <div className="flex flex-col gap-4 pt-5 md:flex-row md:items-center md:justify-between md:gap-8">
                <p className="max-w-lg text-[0.9375rem] leading-relaxed text-ink-300">
                  Year, make and model is enough to start step one. The form is
                  at the bottom of this page and it goes straight to the shop.
                </p>
                <Button href="#quote" tone="ghost" size="sm">
                  Send the vehicle
                </Button>
              </div>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-5">
            <Plate
              id="detail-f250-black"
              caption="F-250 Super Duty after paint correction"
              sizes="(min-width: 1024px) 32rem, 100vw"
            />
            <div className="mt-7">
              <Button href="/gallery/" tone="ghost" size="sm">
                See more of the work
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------
          WHAT SEPARATES THE TIERS, in substance rather than in price.
          The old page answered this with a column of dollar figures,
          which answered "how much" and never answered "which one".
          --------------------------------------------------------------- */}
      <Section plane="sheet" label="The tiers" id="tiers">
        <SectionHead
          title="What separates one tier from the next."
          intro={
            <p>
              Every ladder on this site is stacked, so each level carries the
              work below it. What changes going up is the work, and the work is
              what you are choosing between.
            </p>
          }
        />

        <div className="mt-9 grid min-w-0 gap-11 lg:grid-cols-12 lg:gap-14 md:mt-11">
          <div className="min-w-0 lg:col-span-7">
            <h3 className="ps-heading text-[1.3rem] md:text-[1.5rem]" id="detailing">
              Detailing, {DETAIL_PACKAGES.length} levels
            </h3>
            <p className="ps-prose mt-3">
              What separates them is what happens to the paint. The lower
              levels clean it and put protection on top of it. The higher ones
              cut and polish the defects out of it permanently.
            </p>
            <KeyValueList className="mt-6" label="What each detailing level does">
              {DETAIL_PACKAGES.map((pkg) => (
                <KeyValueRow
                  key={pkg.id}
                  k={pkg.name}
                  note={subtitleOf(pkg)}
                  v={pkg.blurb}
                  mono={false}
                />
              ))}
            </KeyValueList>
            <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-3">
              <QuoteLink service="detailing" />
              <Link href="/auto-detailing/" className="link-inline">
                Car detailing in {BRAND.city}
              </Link>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-5">
            <h3 className="ps-heading text-[1.3rem] md:text-[1.5rem]">
              Interior, {INTERIOR_PACKAGES.length} levels
            </h3>
            <p className="ps-prose mt-3">
              What separates them is how far each surface gets taken. A Level 1
              interior is included with every exterior detail, so it is only a
              separate number when the inside is the whole job.
            </p>
            <KeyValueList className="mt-6" label="What each interior level does">
              {INTERIOR_PACKAGES.map((pkg) => (
                <KeyValueRow key={pkg.id} k={pkg.name} v={pkg.blurb} mono={false} />
              ))}
            </KeyValueList>
            <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-3">
              <QuoteLink service="interior" />
              <Link href="/interior-detailing/" className="link-inline">
                Interior detailing levels
              </Link>
            </div>
          </div>
        </div>

        {/* ---- CERAMIC COATING. The specificity that outsells an
             adjective, and the credential that can be checked. ---- */}
        <div className="mt-12 grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <h3 className="ps-heading text-[1.3rem] md:text-[1.5rem]" id="coating">
              Ceramic coating, {COATINGS.length} tiers
            </h3>
            <div className="ps-prose mt-3">
              <p>
                What separates them is how much correction happens before the
                coating goes on, and what chemistry goes on afterward.
              </p>
              <p>
                {GTECHNIQ_FACTS.hardness} That tier carries a{" "}
                {NINE.guarantee} guarantee, issued by Gtechniq rather than by
                us. {REGISTRATION.value}
              </p>
              <p>
                {GTECHNIQ_FACTS.proOnly} This shop is listed as a{" "}
                <a
                  href={GTECHNIQ.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-inline"
                >
                  {/* One template string, not an expression followed by
                      a text node. The JSX transform ate the leading
                      space of that text node and shipped
                      "Detailerin Gtechniq's own directory" into the
                      built HTML. */}
                  {`${GTECHNIQ.label} in Gtechniq's own directory`}
                </a>
                , which is worth checking before you book anywhere.
              </p>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <KeyValueList label="What each coating tier is">
              {COATINGS.map((coating) => {
                const subtitle = subtitleOf(coating);
                return (
                  <KeyValueRow
                    key={coating.id}
                    k={subtitle ? `${coating.name}, ${subtitle}` : coating.name}
                    note={`${coating.guarantee} guarantee`}
                    v={coating.bestFor}
                    mono={false}
                  />
                );
              })}
            </KeyValueList>
            <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-3">
              <QuoteLink service="ceramic" />
              <Link href="/ceramic-coating/" className="link-inline">
                The coating tiers and the guarantee terms
              </Link>
            </div>
          </div>
        </div>

        {/* ---- EVERYTHING WITH NO LADDER OF LEVELS. One sentence each,
             saying what its number is actually made of. ---- */}
        <div className="mt-12">
          <h3 className="ps-heading text-[1.3rem] md:text-[1.5rem]">
            The rest, and what each one is priced on
          </h3>
          <KeyValueList className="mt-6" label="How the remaining services are priced">
            {QUOTED_ON.map((row) => (
              <KeyValueRow
                key={row.href}
                k={
                  <Link href={row.href} className="link-inline">
                    {row.label}
                  </Link>
                }
                v={row.v}
                mono={false}
              />
            ))}
          </KeyValueList>
        </div>
      </Section>

      {/* ---------------------------------------------------------------
          One primary action, one solid cyan button: the form submit.
          The review sits beside it because the decision point is the
          only place proof is worth anything.
          --------------------------------------------------------------- */}
      <Section plane="sheet" label="Get a price" id="quote">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              title="Get the real number."
              intro={
                <p>
                  Tell us the year, make and model and what you want looked at.
                  It goes straight to the shop and comes back with a price for
                  that vehicle.
                </p>
              }
            />

            <figure className="mt-8 border-t border-rule-light pt-6">
              <blockquote className="ps-prose">
                <p>{REVIEW.text}</p>
              </blockquote>
              <figcaption className="mt-4 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-400">
                {REVIEW.name}
                <span aria-hidden="true"> · </span>
                {REVIEW.service}
                <span aria-hidden="true"> · </span>
                Google
              </figcaption>
            </figure>

            <PhoneLink
              placement="pricing-panel"
              className="mt-8 flex min-w-0 items-center justify-between gap-4 border border-rule-light bg-sheet-060 px-5 py-5 transition-colors hover:border-cyan-500"
            >
              <span className="min-w-0">
                <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-400">
                  Or call the shop
                </span>
                <span className="mt-1 block font-mono text-2xl tabular-nums text-ink-900">
                  {BRAND.phoneDisplay}
                </span>
              </span>
              <span className="h-px w-6 flex-none bg-cyan-500" aria-hidden />
            </PhoneLink>

            <KeyValueList className="mt-8" label="Shop">
              <KeyValueRow k="Address" v={BRAND.addressLine} />
              {BRAND.hours.map((h) => (
                <KeyValueRow key={h.days} k={h.days} v={h.time} />
              ))}
              <KeyValueRow
                k="Services"
                mono={false}
                v={
                  <Link href="/services/" className="link-inline">
                    All {SERVICES.length} services
                  </Link>
                }
              />
            </KeyValueList>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <QuoteForm
              heading="Send us the vehicle"
              intro="Pick the service, add the vehicle, and the number comes back from the shop."
              source="/pricing/"
              id="quote-form"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
