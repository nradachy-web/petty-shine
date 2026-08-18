import type { Metadata } from "next";
import Link from "next/link";

import QuoteForm from "@/components/quote/QuoteForm";
import PhoneLink from "@/components/tracking/PhoneLink";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import KeyValueRow, { KeyValueList } from "@/components/ui/KeyValueRow";
import Plate from "@/components/ui/Plate";
import { PriceOrQuote } from "@/components/ui/PriceFigure";
import { RevealGroup } from "@/components/ui/Reveal";
import Section, { SectionHead } from "@/components/ui/Section";
import { BRAND, REVIEWS, REVIEW_SUMMARY, SERVICES } from "@/lib/constants";
import type { PhotoId } from "@/lib/photos";

export const metadata: Metadata = {
  title: "Ceramic Coating and Detailing Photos",
  /* 158 characters. */
  description: `Real jobs photographed inside the shop in ${BRAND.city}, ${BRAND.stateName}. Ceramic coating, paint protection film, paint correction, interiors, trucks and one boat.`,
  alternates: { canonical: "/gallery/" },
};

/* ============================================================================
   THE SET

   29 photographs, every one a real job. They are grouped by what the work
   actually is, because a gallery sorted by filename asks the visitor to do
   the sorting, and the thing he is trying to decide is which service he
   needs.

   Captions are short restatements of the alt text in src/lib/photos.ts. The
   full alt text still rides on every <img>, so a screen reader gets the long
   version and a sighted reader gets the label.

   BLEED POLICY. Only the eight ids in BLEED_CLEARED may run edge to edge,
   and Plate enforces that in code. Every `lead` below is one of the eight.
   The four 640px sources (ppf-mclaren-gt, coating-corvette-c8-side,
   correction-reflection, coating-supra) are deliberately placed in the three
   column contact sheet, where the rendered box is around 385px and the
   source is not being asked to do anything it cannot.
   ========================================================================== */

interface Frame {
  id: PhotoId;
  caption: string;
}

interface Group {
  slug: string;
  index: string;
  title: string;
  /** the section's h2. Never a restatement of the datum label above it. */
  headline: string;
  intro: string;
  href: string;
  hrefLabel: string;
  /** bleed cleared opener, runs to the edge of the shell */
  lead?: Frame;
  /** framed opener at 720px, for a group with no cleared photo */
  plate?: Frame;
  frames: Frame[];
  cols: 2 | 3;
}

const HERO: Frame = {
  id: "coating-huracan",
  caption: "Lamborghini Huracan, coated",
};

const GROUPS: Group[] = [
  {
    slug: "ceramic-coating",
    index: "01",
    title: "Ceramic coating",
    headline:
      "What a coating looks like in the light.",
    intro:
      "Every car in this set left the shop with a coating on it. What you are looking at is polished paint under a coating, not a wax sitting on top of swirls.",
    href: "/ceramic-coating/",
    hrefLabel: "What is in each coating tier",
    lead: { id: "coating-corvette-c8", caption: "Corvette C8, Rapid Blue, coated" },
    frames: [
      { id: "coating-g-wagon", caption: "Mercedes-Benz G-Class, coated" },
      { id: "coating-corvette-z06", caption: "Corvette Z06, coated" },
      { id: "coating-corvette-c7", caption: "Corvette Grand Sport, coated" },
      { id: "coating-challenger-hellcat", caption: "Challenger Hellcat Widebody" },
      { id: "coating-corvette-c8-side", caption: "Corvette C8, side profile" },
    ],
    cols: 3,
  },
  {
    slug: "paint-protection-film",
    index: "02",
    title: "Paint protection film",
    headline:
      "Film, going on.",
    intro:
      "Two of these three frames are the install rather than the result, because film is a job you judge by the edges and the seams.",
    href: "/paint-protection-film/",
    hrefLabel: "What each coverage level covers",
    plate: { id: "ppf-install-closeup", caption: "Film squeegeed onto a black panel" },
    frames: [
      { id: "ppf-mclaren-gt", caption: "McLaren GT, in the shop" },
      { id: "ppf-jeep-install", caption: "Film going onto a Jeep hood" },
    ],
    cols: 2,
  },
  {
    slug: "paint-correction",
    index: "03",
    title: "Paint correction",
    headline:
      "Read the reflections.",
    intro:
      "Correction is hard to photograph, because what you are looking for is an absence. The straighter the reflection, the flatter the paint under it.",
    href: "/paint-correction/",
    hrefLabel: "How correction works",
    lead: { id: "detail-f250-black", caption: "F-250 Super Duty, corrected" },
    frames: [
      { id: "correction-reflection", caption: "Reflections in corrected black paint" },
      { id: "correction-red-panel", caption: "Red paint after machine polishing" },
      { id: "coating-supra", caption: "Toyota Supra, corrected" },
    ],
    cols: 3,
  },
  {
    slug: "the-wash",
    index: "04",
    title: "The wash",
    headline:
      "Before anything else.",
    intro:
      "Every job starts here. Foam and decontamination lift the grit off the paint before anything touches it.",
    href: "/auto-detailing/",
    hrefLabel: "The five detailing levels",
    frames: [
      { id: "wash-huracan-foam", caption: "Huracan, decontamination wash" },
      { id: "wash-porsche-911", caption: "Porsche 911, wash stage" },
      { id: "wash-f250-foam", caption: "F-250 Super Duty, foam stage" },
    ],
    cols: 3,
  },
  {
    slug: "interiors",
    index: "05",
    title: "Interiors",
    headline:
      "Leather, plastic, carpet, glass.",
    intro:
      "The first interior level comes with every exterior detail. The ones above it go further into the leather and the carpet.",
    href: "/interior-detailing/",
    hrefLabel: "The three interior levels",
    frames: [
      { id: "interior-bmw-x5m", caption: "BMW X5 M, tan leather" },
      { id: "interior-bmw-door", caption: "BMW door panel and seat" },
      { id: "interior-mustang-dash", caption: "Mustang dash and wheel" },
      { id: "interior-mustang-65", caption: "1965 Mustang interior" },
    ],
    cols: 2,
  },
  {
    slug: "trucks-and-jeeps",
    index: "06",
    title: "Trucks, Jeeps and the rest of it",
    headline:
      "Not everything here is a supercar.",
    intro:
      "Lifted trucks, Jeeps on 37s, a 1965 Mustang, and a Mustang GT with the wheels off it.",
    href: "/auto-detailing/",
    hrefLabel: "The five detailing levels",
    lead: { id: "detail-jeep-orange", caption: "Jeep on 37s, full detail" },
    frames: [
      { id: "detail-jeep-teal", caption: "Jeep Wrangler Rubicon" },
      { id: "detail-mustang-red", caption: "Mustang GT, in the shop" },
      { id: "wheels-mustang", caption: "Mustang, wheels off" },
      { id: "detail-raptor", caption: "F-150 Raptor, full detail" },
      { id: "detail-mustang-65", caption: "1965 Mustang, in the shop" },
      { id: "coating-challenger-demon", caption: "Challenger Widebody, full detail" },
    ],
    cols: 3,
  },
  {
    slug: "on-the-water",
    index: "07",
    title: "On the water",
    headline:
      "One boat, on its trailer.",
    intro:
      "Gelcoat is not clearcoat, so a boat gets its own process rather than a car detail done on a trailer.",
    href: "/marine-detailing/",
    hrefLabel: "How a boat is done",
    plate: { id: "marine-boat-trailer", caption: "Center console boat, marine detail" },
    frames: [],
    cols: 2,
  },
];

/** Derived, never typed. The index at the top can never drift from the set. */
function frameCount(g: Group): number {
  return (g.lead ? 1 : 0) + (g.plate ? 1 : 0) + g.frames.length;
}

const TOTAL_FRAMES = 1 + GROUPS.reduce((n, g) => n + frameCount(g), 0);

/** The services this page actually shows work for, in ladder order. */
const SHOWN = [
  "auto-detailing",
  "ceramic-coating",
  "paint-protection-film",
  "paint-correction",
  "interior-detailing",
  "marine-detailing",
];

const LADDER = SERVICES.filter((s) => SHOWN.includes(s.id));

/** A detailing review, because this page is mostly detailing photographs. */
const PROOF = REVIEWS.find((r) => r.name === "Jacob Freeman")!;

/**
 * Two up on a phone, deliberately. The alternative is 23 full width
 * photographs in a column, which is roughly thirteen thousand pixels of
 * scroll on a 390px screen and reads as a feed rather than a set. The lead
 * plate in each group carries the size, the sheet carries the range.
 */
function ContactSheet({ group }: { group: Group }) {
  if (group.frames.length === 0) return null;
  return (
    <RevealGroup
      className={[
        "mt-9 grid min-w-0 grid-cols-2 items-start gap-x-4 gap-y-7 sm:gap-5",
        group.cols === 3 ? "lg:grid-cols-3" : "",
      ].join(" ")}
    >
      {group.frames.map((f) => (
        <Plate
          key={f.id}
          id={f.id}
          caption={f.caption}
          sizes={
            group.cols === 3
              ? "(min-width: 1024px) 24rem, 45vw"
              : "(min-width: 1240px) 36rem, 45vw"
          }
        />
      ))}
    </RevealGroup>
  );
}

export default function GalleryPage() {
  return (
    <>
      <Breadcrumbs plane="sheet" trail={[{ label: "Our Work", href: "/gallery/" }]} />

      {/* ---------- the opening. Photography lives on the shop plane. ---------- */}
      <Section plane="shop" label="Our work">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-7">
            <h1 className="ps-display ps-display-lg">Every car on this page came through the shop.</h1>

            <div className="ps-prose mt-6">
              <p>
                {TOTAL_FRAMES} photographs of ceramic coating, paint protection
                film, paint correction and detailing done at {BRAND.street} in{" "}
                {BRAND.city}, {BRAND.stateName}. There is no stock photography
                anywhere on this site.
              </p>
              <p>
                They are grouped by what the work was, so you can go straight
                to the thing you are thinking about.
              </p>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-5">
            <KeyValueList label="Contents">
              {GROUPS.map((g) => (
                <KeyValueRow
                  key={g.slug}
                  k={`${g.index} ${g.title}`}
                  tone="cyan"
                  v={
                    <a href={`#${g.slug}`} className="underline decoration-1 underline-offset-4">
                      {frameCount(g)} {frameCount(g) === 1 ? "frame" : "frames"}
                    </a>
                  }
                />
              ))}
            </KeyValueList>
          </div>
        </div>

        <div className="mt-9">
          <Plate id={HERO.id} caption={HERO.caption} bleed priority />
        </div>
      </Section>

      {/* ---------- groups 01 to 03 ---------- */}
      {GROUPS.slice(0, 3).map((g) => (
        <Section key={g.slug} id={g.slug} plane="shop" label={`${g.index} ${g.title}`}>
          <SectionHead
            size="md"
            align="split"
            title={g.headline}
            intro={
              <>
                <p>{g.intro}</p>
                <p>
                  <Link href={g.href}>{g.hrefLabel}</Link>
                </p>
              </>
            }
          />
          {g.lead ? (
            <div className="mt-9">
              <Plate id={g.lead.id} caption={g.lead.caption} bleed />
            </div>
          ) : null}
          {g.plate ? (
            <div className="mt-9">
              <Plate
                id={g.plate.id}
                caption={g.plate.caption}
                sizes="(min-width: 800px) 45rem, 100vw"
              />
            </div>
          ) : null}
          <ContactSheet group={g} />
        </Section>
      ))}

      {/* ---------- the record. What the work in these frames costs. ---------- */}
      <Section plane="sheet" label="What it costs">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="What the work above costs."
              intro={
                <p>
                  No car on this page cost the same as the one beside it. Size
                  and the condition of the paint move the number more than the
                  name of the service does, so a vehicle gets looked at before
                  it gets quoted, and the number goes to you in writing before
                  any work starts.
                </p>
              }
            />
            <div className="mt-7">
              <Button href="/pricing/" tone="ghost" size="sm">
                How a job gets priced
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <KeyValueList capped label="Quoted on your vehicle">
              {LADDER.map((s) => (
                <KeyValueRow
                  key={s.id}
                  k={`${s.index} ${s.name}`}
                  v={
                    <PriceOrQuote
                      service={s.quoteKey}
                      value={s.fromPrice}
                      size="sm"
                    />
                  }
                />
              ))}
            </KeyValueList>
          </div>
        </div>
      </Section>

      {/* ---------- groups 04 to 07 ---------- */}
      {GROUPS.slice(3).map((g) => (
        <Section key={g.slug} id={g.slug} plane="shop" label={`${g.index} ${g.title}`}>
          <SectionHead
            size="md"
            align="split"
            title={g.headline}
            intro={
              <>
                <p>{g.intro}</p>
                <p>
                  <Link href={g.href}>{g.hrefLabel}</Link>
                </p>
              </>
            }
          />
          {g.lead ? (
            <div className="mt-9">
              <Plate id={g.lead.id} caption={g.lead.caption} bleed />
            </div>
          ) : null}
          {g.plate ? (
            <div className="mt-9">
              <Plate
                id={g.plate.id}
                caption={g.plate.caption}
                sizes="(min-width: 800px) 45rem, 100vw"
              />
            </div>
          ) : null}
          <ContactSheet group={g} />
        </Section>
      ))}

      {/* ---------- the one primary action on this page ---------- */}
      <Section plane="sheet" label="Next step">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="Yours next."
              intro={
                <p>
                  Send the year, make and model with a note about what you want
                  done and we will come back with a number for it. Photographs
                  of the paint help.
                </p>
              }
            />

            <PhoneLink
              placement="gallery-page"
              className="mt-8 flex min-w-0 items-center justify-between gap-4 border border-rule-light bg-sheet-060 px-5 py-5 transition-colors hover:border-cyan-500"
            >
              <span className="min-w-0">
                <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-400">
                  Call the shop
                </span>
                <span className="mt-1 block font-mono text-2xl tabular-nums text-ink-900">
                  {BRAND.phoneDisplay}
                </span>
              </span>
              <span className="h-px w-6 flex-none bg-cyan-500" aria-hidden />
            </PhoneLink>

            <figure className="mt-8 border-t border-rule-light pt-7">
              <span className="block h-px w-6 bg-cyan-500" aria-hidden />
              <blockquote className="mt-4">
                <p className="max-w-xl text-[1.0625rem] leading-relaxed text-ink-600">
                  {PROOF.text}
                </p>
              </blockquote>
              <figcaption className="mt-4 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-400">
                {PROOF.name} · {REVIEW_SUMMARY.source} ·{" "}
                {REVIEW_SUMMARY.rating} from {REVIEW_SUMMARY.count} reviews
              </figcaption>
            </figure>

            <p className="cta-meta mt-7">
              {BRAND.street}
              <br />
              <span className="whitespace-nowrap">
                {BRAND.city}, {BRAND.state} {BRAND.zip}
              </span>
              <br />
              {BRAND.hoursShort}
            </p>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <QuoteForm
              heading="Get a price for your vehicle"
              intro="It goes straight to the shop. Year, make, model and what you want done is enough to start."
              source="/gallery/"
              id="quote-form"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
