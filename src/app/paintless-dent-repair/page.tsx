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
import RuleLabel from "@/components/ui/RuleLabel";
import Section, { SectionHead } from "@/components/ui/Section";
import { asset } from "@/lib/asset";
import { PHOTOS } from "@/lib/photos";
import { BRAND, CITIES, REVIEWS, SERVICES } from "@/lib/constants";

const SERVICE = SERVICES.find((s) => s.id === "paintless-dent-repair")!;

/**
 * This route takes competitor brand traffic. People searching a dent chain
 * by name land here, so the page answers one question first: can you fix
 * mine, and what does that involve. Nothing is priced, because nothing is
 * published, so every path on the page ends in the quote form.
 */
const SUITS = [
  {
    k: "Door dings",
    v: "The dimple left by the car parked too close, usually along the middle of a door.",
  },
  {
    k: "Hail damage",
    v: "A hood or a roof full of small round dents with the paint still whole.",
  },
  {
    k: "Parking lot dents",
    v: "Cart hits and knee height dents in a door or a quarter panel.",
  },
  {
    k: "Soft edged dents",
    v: "A dent that rolls into the panel rather than folding it, with nothing broken through the clear coat.",
  },
];

const STOPS = [
  {
    k: "Cracked or chipped paint",
    v: "Once the paint is broken the panel needs refinishing. Paintless work moves metal, it does not put paint back.",
  },
  {
    k: "A sharp crease",
    v: "A crease stretches the metal. It can come a long way back and it will not read as untouched.",
  },
  {
    k: "No access behind it",
    v: "Some dents sit over a brace or on the edge of a panel, where there is no way in from the back.",
  },
  {
    k: "Filler under the paint",
    v: "A panel that has been repaired before does not move the way bare metal moves.",
  },
];

/* The review that speaks to process rather than to a finish, which is what
   matters on the one page where nothing can be priced in advance. */
const PROCESS_REVIEW =
  REVIEWS.find((r) => r.text.includes("quoting and scheduling")) ?? REVIEWS[0];

/* The towns in his own paid search terms, nearest first, every figure
   measured, each linking to that town's page with a real anchor. */
const NEAR_TOWNS = ["greensboro-nc", "high-point-nc", "asheboro-nc", "randleman-nc"]
  .map((slug) => CITIES.find((c) => c.slug === slug)!)
  .sort((a, b) => a.minutes - b.minutes);

/* 157 characters. Nothing is priced on this page and nothing is priced in
   this description, which is the honest version either way. */
const DESCRIPTION = `Paintless dent repair in ${BRAND.city}, ${BRAND.stateName}. Door dings, hail damage and parking lot dents worked out from behind the panel, factory paint left alone.`;

export const metadata: Metadata = {
  title: `${SERVICE.name} in ${BRAND.city}, ${BRAND.state}`,
  description: DESCRIPTION,
  alternates: { canonical: "/paintless-dent-repair/" },
};

/* ---------------------------------------------------------------------------
   THE HERO

   The shared .hero block from globals.css, so a service page opens the way
   the home page opens: full bleed frame, one flat tonal overlay, a
   letterspaced eyebrow, one display heading, one solid action and one
   outline action, and the trust row on the bottom edge.

   THE PHOTOGRAPH is the red Mustang GT standing under his own banner. A dent
   page needs a large unbroken painted panel in the frame, and this is the
   flattest, cleanest body side in the set. It is cleared for full bleed in
   Plate.tsx.
   ------------------------------------------------------------------------- */
const HERO_PHOTO = "detail-mustang-red" as const;

if (process.env.NODE_ENV !== "production" && !isBleedCleared(HERO_PHOTO)) {
  // eslint-disable-next-line no-console
  console.warn(
    `[paintless-dent-repair] ${HERO_PHOTO} is not in BLEED_CLEARED and must not run full bleed.`
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
      style={{ "--hero-focus": "58% 52%" } as CSSProperties}
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
            The dent comes out. The paint stays on.
          </h1>

          <div className="hero__prose">
            <p>
              Paintless dent repair in {BRAND.city}, {BRAND.stateName}. We work
              the metal back from behind the panel, so the factory paint stays
              on the car. Nothing is filled, nothing is sanded and nothing is
              resprayed.
            </p>
            <p>
              It suits some damage and not other damage. If yours falls on the
              wrong side of that line, we would rather tell you now than after
              the car is here.
            </p>
          </div>

          <div className="hero__actions">
            {/* The one solid action on this screen. Describing the dent is a
                smaller step than booking a job. */}
            <Button href="#quote" tone="cyan">
              Tell us about the dent
            </Button>
            <PhoneLink placement="pdr-hero" className="ps-btn ps-btn--ghost">
              Call {BRAND.phoneDisplay}
            </PhoneLink>
          </div>
        </div>
      </div>

      <TrustBar plane="none" className="hero__trust" />
    </section>
  );
}

export default function PaintlessDentRepairPage() {
  return (
    <>
      <ServiceSchema
        name={SERVICE.name}
        description={DESCRIPTION}
        url={SERVICE.href}
        serviceType="Paintless Dent Repair"
      />

      <Breadcrumbs
        plane="shop"
        trail={[{ label: SERVICE.name, href: SERVICE.href }]}
      />

      <Hero />

      <Section plane="sheet" label="Suitability">
        <SectionHead
          title="What comes out, and what does not."
          intro={
            <p>
              Paintless work needs two things: paint that is still intact, and a
              way in behind the panel. Lose either one and it becomes a
              different repair, which we will say out loud rather than find out
              halfway through.
            </p>
          }
        />

        <div className="mt-9 grid min-w-0 gap-10 lg:mt-11 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-4">
            <h3 className="ps-heading text-lg">Damage this suits</h3>
            <KeyValueList className="mt-5" label="Damage paintless repair suits">
              {SUITS.map((row) => (
                <KeyValueRow key={row.k} k={row.k} v={row.v} mono={false} />
              ))}
            </KeyValueList>
          </div>

          {/* One photograph between the two lists, so this screen is not
              eight prose rows deep. It is corrected paint, not dent work,
              and the caption says so. What it shows is a panel read in
              reflection, the same test both lists lean on. 960px source,
              so it stays framed, never bleed. */}
          <div className="min-w-0 lg:col-span-4 lg:self-center">
            <Plate
              id="correction-reflection"
              caption="Corrected black paint holding straight reflections, the lines a dent would bend"
              sizes="(min-width: 1024px) 22rem, 100vw"
            />
          </div>

          <div className="min-w-0 lg:col-span-4">
            <h3 className="ps-heading text-lg">Where it stops</h3>
            <KeyValueList className="mt-5" label="Where paintless repair stops">
              {STOPS.map((row) => (
                <KeyValueRow
                  key={row.k}
                  k={row.k}
                  v={row.v}
                  mono={false}
                  tone="pewter"
                />
              ))}
            </KeyValueList>
          </div>
        </div>

        <DatumRule label="What it costs" className="mt-14 mb-8" />

        <div className="grid min-w-0 gap-9 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <h3 className="ps-display ps-display-md">
              There is no price list for a dent.
            </h3>

            <div className="ps-prose mt-4">
              <p>
                What it costs comes down to how deep the dent is and which panel
                it sits on. One ding in a door is not the same job as a hood
                after a hailstorm, so we price the car in front of us and put
                the number in writing before any work starts.
              </p>
              <p>
                A dent on the second table is not a dead end either. It stops
                being paintless, and we will tell you what it actually needs.
              </p>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <KeyValueList label="Dent repair, the record">
              <KeyValueRow
                k="Price"
                v={<PriceOrQuote service={SERVICE.quoteKey} value={null} />}
              />
              {/* Sentence shaped values, so no mono and no right alignment. */}
              <KeyValueRow
                k="Quoted on"
                v="The panel, and how deep the dent is"
                mono={false}
              />
              <KeyValueRow
                k="Paint"
                v="Factory paint stays on the car"
                mono={false}
              />
              <KeyValueRow k="Shop" v={BRAND.addressLine} />
              <KeyValueRow k="Open" v={BRAND.hoursShort} />
            </KeyValueList>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/paint-correction/" tone="ghost" size="sm">
                Scratches and swirls instead
              </Button>
              <Button href="/wheel-repair/" tone="ghost" size="sm">
                Curbed wheel repair
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <Section plane="shop" label="Reading the panel">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="A dent shows up in the reflection."
              intro={
                <p>
                  Straight lines are what give one away. A panel that looks flat
                  under the lights will bend a reflection the moment you move
                  your head, and how much it bends is how deep the dent goes.
                </p>
              }
            />

            <div className="ps-prose mt-6">
              <p>
                Photograph it the same way before you send it in. Stand so a
                straight edge, a door frame or a light bar, runs across the
                panel in the reflection, then take the picture at an angle
                rather than square on. That single photo usually tells us more
                than a paragraph does.
              </p>
            </div>

            {/* Social proof at the decision point. This one is about the
                process, which is what has to carry a page where the number
                cannot be published in advance. */}
            <blockquote className="mt-9 min-w-0 border-t border-rule-dark pt-7">
              <span aria-hidden className="block h-px w-6 bg-cyan-500" />
              <p className="mt-5 text-[1.0625rem] leading-relaxed text-spec-000">
                {PROCESS_REVIEW.text}
              </p>
              <footer className="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-1 font-mono text-[0.6875rem] uppercase tracking-[0.18em]">
                <span className="text-spec-000">{PROCESS_REVIEW.name}</span>
                <span className="text-ink-300">{PROCESS_REVIEW.service}</span>
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

          <div className="min-w-0 lg:col-span-7">
            {/* One plate, not two. A second stacked photograph ran this
                column 400px past the copy beside it and put the dead space
                back that this pass exists to remove. */}
            <Plate
              id="coating-corvette-z06"
              caption="Black paint under the shop lights, Randleman NC"
              sizes="(min-width: 1024px) 44rem, 100vw"
            />
          </div>
        </div>

        {/* The section above just taught the reflection photo. This line
            asks for it while the instruction is still on screen, and the
            quote link carries the visitor the rest of the way. Line
            variant: the hero already holds this page's one solid button. */}
        <CTABand
          variant="line"
          service={SERVICE.quoteKey}
          ctaLabel="Get a price"
          body="Take that reflection photo and send it with the year, make and model. We will come back with a number for the dent, in writing, before the car is here."
          className="mt-12"
        />
      </Section>

      <Section plane="sheet" label="Get a price" id="quote">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="Send the panel and roughly how big."
              intro={
                <p>
                  Year, make and model, then where the dent is and about how
                  wide it is. Add the photograph if you have one. That is
                  usually enough to come back with a number without the car
                  being here.
                </p>
              }
            />

            <PhoneLink
              placement="pdr-quote"
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

            <p className="mt-9">
              <RuleLabel>Where the cars come from</RuleLabel>
            </p>

            <KeyValueList className="mt-3" label="Drive times to the shop">
              {NEAR_TOWNS.map((town) => (
                <KeyValueRow
                  key={town.slug}
                  k={
                    <Link href={`/areas/${town.slug}/`} className="link-inline">
                      Dent repair in {town.name}
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
              source="/paintless-dent-repair/"
              id="quote-form"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
