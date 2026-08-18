import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { Section, SectionHead, Prose } from "@/components/ui/Section";
import { CoatingTiers } from "@/components/sections/PriceTables";
import Gallery from "@/components/sections/Gallery";
import { WORK } from "@/lib/work";
import ReviewWall from "@/components/sections/ReviewWall";
import FAQ from "@/components/sections/FAQ";
import CTABand from "@/components/sections/CTABand";
import ServiceSchema from "@/components/seo/ServiceSchema";
import Photo from "@/components/ui/Photo";
import { COATING_NOTES, SEO, WARRANTIES, reviewsFor } from "@/lib/constants";

export const metadata: Metadata = {
  title: "System X Ceramic Coating in Whitmore Lake, MI",
  description: SEO.coating.description,
  alternates: { canonical: "/ceramic-coating/" },
};

const FAQ_COATING = [
  {
    q: "Does a ceramic coating fix scratches or swirl marks?",
    a: "No, and this is the single most oversold thing in the industry. A coating preserves the paint exactly as it is on the day it goes on. If the paint has swirls, you're sealing swirls under a glossy layer. That's why every coating we do includes at least one stage of machine polishing first.",
  },
  {
    q: "How long does a ceramic coating take?",
    a: "Most coatings need one or more days. Day one is preparation, correction, and application; the vehicle then stays in our locked shop overnight to cure, needing to stay dry for a minimum of 12 hours and preferably 24. Heavier correction adds time.",
  },
  {
    q: "Why do you inspect before quoting?",
    a: "Because paint condition determines the price. Two identical vehicles can need wildly different correction, and quoting sight-unseen means either padding the number or surprising you on service day. We'd rather look at it for ten minutes.",
  },
  {
    q: "What does a ceramic coating actually do?",
    a: "Dirt, water, and grime release far more easily, so washing gets simpler and safer. Gloss and depth improve. UV, oxidation, acid rain, and paint chalking are what the System X warranty specifically covers. It does not stop rock chips, that's what paint protection film is for.",
  },
  {
    q: "Is the annual inspection really required?",
    a: "Yes, and we'd rather you hear it now than in year three. System X requires an annual inspection by an approved applicator within 30 days either side of the anniversary date, and it carries a fee. Miss the window and the warranty voids. The inspection is essentially a thorough exterior detail plus a compatible top coat.",
  },
  {
    q: "Does the warranty transfer if I sell the car?",
    a: "No. System X registers the warranty in the vehicle owner's name and it does not transfer. The coating itself obviously stays on the car, and Pro+ and Max G+ register to CARFAX, but the coverage doesn't follow the sale.",
  },
  {
    q: "Which surfaces get coated?",
    a: "All painted exterior surfaces, body panels, bumpers, painted trim, plus exterior plastic trim, chrome, grilles, headlights, tail lights, and door jambs.",
  },
  {
    q: "How do I maintain it?",
    a: "Hand wash with proper technique, avoid automatic brush washes entirely, dry safely, and remove bug residue and bird droppings promptly. System X's terms are explicit that brush-wash damage isn't covered. We go through all of it at pickup.",
  },
];

export default function CeramicCoatingPage() {
  const sysx = WARRANTIES.find((w) => w.id === "systemx")!;

  return (
    <>
      <Breadcrumbs trail={[{ label: "Ceramic Coating", href: "/ceramic-coating/" }]} />
      <ServiceSchema
        name="Ceramic Coating"
        description="System X ceramic coatings applied in Whitmore Lake, Michigan, with decontamination and machine polishing included. Crystal+, Pro+, and Max G+ tiers."
        url="/ceramic-coating/"
        price={900}
      />

      <PageHero
        eyebrow="System X ceramic coating"
        title={
          <>
            Ceramic coating
            <br />
            in Whitmore Lake, MI
          </>
        }
        sub="Three System X tiers, from $900. Every one of them includes decontamination and at least one stage of machine polishing, because a coating preserves paint exactly as it finds it, and locking in swirl marks for six years is not protection."
        photo="coating-bentayga-front"
        price="From $900 · includes one stage of correction"
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHead
              eyebrow="Read this first"
              title="A coating is only as good as what's under it."
            />
            <Prose className="mt-6">
              <p>
                Ceramic coatings do a real job: water and dirt release more easily,
                washing gets simpler and safer, gloss and depth improve, and the paint
                is shielded from UV, oxidation, and acid rain. That&apos;s worth
                paying for.
              </p>
              <p>
                What they don&apos;t do is repair. A coating is a clear layer over the
                paint as it exists at that moment, so every job here starts with a
                hand wash, chemical decontamination, clay bar, and at least one stage
                of machine polishing. Heavier defects may warrant a second or third
                stage, which we discuss during the inspection rather than discovering
                on service day.
              </p>
            </Prose>

            <div className="mt-8 grid gap-px bg-line sm:grid-cols-2">
              <div className="bg-paper-2 p-5">
                <h3 className="flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-good">
                  <Check className="h-4 w-4" aria-hidden /> What it does
                </h3>
                <ul className="mt-3 space-y-2 text-[0.875rem] leading-snug text-body">
                  {sysx.covers.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                  <li>Easier washing and better water behaviour</li>
                </ul>
              </div>
              <div className="bg-paper-2 p-5">
                <h3 className="flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-red">
                  <X className="h-4 w-4" aria-hidden /> What it doesn&apos;t
                </h3>
                <ul className="mt-3 space-y-2 text-[0.875rem] leading-snug text-body">
                  {sysx.excludes.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                  <li>Rock chips, that&apos;s paint protection film</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="aspect-[4/3] overflow-hidden bg-graphite">
              <Photo id="coating-corvette-c5" sizes="(min-width: 1024px) 50vw, 100vw" />
            </div>
            <figcaption className="placard mt-3">
              <span className="placard-line">
                <span className="text-ink-text">Corvette C5</span>
              </span>
              <span className="mt-1 block pl-[22px]">
                Multi-stage correction · System X coating
              </span>
            </figcaption>
          </div>
        </div>
      </Section>

      <Section tone="paper-2" id="pricing">
        <SectionHead
          align="split"
          eyebrow="Coating tiers"
          title="Three levels, all with correction included."
          intro="Protection ratings are System X's published effectiveness figures; warranty terms are Element 119's. We list both because they aren't the same number, and most shops quote whichever one sounds better."
        />
        <div className="mt-10">
          <CoatingTiers />
        </div>
        <ul className="mt-8 space-y-2">
          {COATING_NOTES.map((n) => (
            <li key={n} className="flex gap-3 text-[0.875rem] leading-relaxed text-muted">
              <span className="mt-2 h-px w-3 shrink-0 bg-red" aria-hidden />
              {n}
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <SectionHead
          eyebrow="What to expect"
          title="One vehicle at a time, and it stays the night."
        />
        <div className="mt-10 grid gap-px bg-line md:grid-cols-2">
          {[
            {
              t: "Inspection before scheduling",
              b: "We look at the paint, discuss coating options, and book enough time to meet the expectation we've set. It's how we avoid surprises and delays on service day.",
            },
            {
              t: "Preparation is the job",
              b: "Hand wash, chemical decontamination, clay bar, then machine polishing. Skipping or rushing this compromises both the appearance and how the coating performs.",
            },
            {
              t: "Every exterior surface",
              b: "Body panels, bumpers, and painted trim, plus exterior plastic trim, chrome, grilles, headlights, tail lights, and door jambs.",
            },
            {
              t: "Overnight cure",
              b: "The vehicle stays in our locked shop and must remain dry for at least 12 hours, 24 preferred. Some paint conditions or coatings need longer, and we'll say so before you drop it off.",
            },
          ].map((s) => (
            <div key={s.t} className="bg-paper p-6 md:p-7">
              <h3 className="font-display text-lg font-bold uppercase tracking-tight text-ink-text">
                {s.t}
              </h3>
              <p className="mt-3 leading-relaxed text-body">{s.b}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="wall">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <SectionHead
              tone="light"
              eyebrow="Warranty, unedited"
              title="Including the parts other shops leave out."
              intro="System X coverage is real and it's manufacturer-backed. It also has conditions, and you should know them before you spend $900 to $1,950."
            />
            <Link href="/warranties/" className="btn btn-outline-light mt-7 inline-flex">
              Read the full terms
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <div className="md:col-span-6">
            <ul className="space-y-4">
              {sysx.notes.map((n) => (
                <li
                  key={n}
                  className="border-l-2 border-red pl-4 text-[0.9375rem] leading-relaxed text-light-2"
                >
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Gallery
        items={WORK.filter((w) => w.category === "coating")}
        filterable={false}
        eyebrow="Coated"
        title="Coating work from the shop"
      />

      <ReviewWall
        items={reviewsFor("coating", 3)}
        eyebrow="Coating customers"
        title="Five vehicles, one customer"
        intro="Repeat coating customers are the review we care about most, it means the finish held up."
      />

      <FAQ items={FAQ_COATING} title="Ceramic coating questions" />

      <CTABand
        eyebrow="Book an inspection"
        title="Bring the car by. Ten minutes decides the right tier."
        body="Coating quotes start with a look at the paint, condition drives both the correction level and the price. There's no charge and no obligation attached to the inspection."
      />
    </>
  );
}
