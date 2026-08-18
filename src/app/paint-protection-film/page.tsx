import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Shield } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { Section, SectionHead, Prose } from "@/components/ui/Section";
import { PpfTiers } from "@/components/sections/PriceTables";
import Gallery from "@/components/sections/Gallery";
import { WORK } from "@/lib/work";
import ReviewWall from "@/components/sections/ReviewWall";
import FAQ from "@/components/sections/FAQ";
import CTABand from "@/components/sections/CTABand";
import ServiceSchema from "@/components/seo/ServiceSchema";
import Photo from "@/components/ui/Photo";
import { PPF_AREAS, SEO, reviewsFor } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Paint Protection Film (Clear Bra) in Whitmore Lake, MI | 10-Year Warranty",
  description: SEO.ppf.description,
  alternates: { canonical: "/paint-protection-film/" },
};

const PROCESS = [
  {
    n: "01",
    t: "Inspection and prep",
    b: "The vehicle is inspected and thoroughly cleaned, with surface contamination removed. If light polishing would improve the finish before film goes on, we discuss it up front rather than filming over it.",
  },
  {
    n: "02",
    t: "Surface preparation",
    b: "Every area being protected gets prepped for a clean bond. This is the step that separates a install that lasts from one that starts lifting or trapping debris in year two.",
  },
  {
    n: "03",
    t: "Installation",
    b: "Film goes on panel by panel using vehicle-specific patterns, or custom fitment where a pattern doesn't exist. High-impact areas get extra attention on adhesion and edges.",
  },
  {
    n: "04",
    t: "Cure and final check",
    b: "Edges and panels are inspected, then the vehicle stays inside overnight in most cases so the film can set properly and any small adjustments happen before pickup.",
  },
];

const FAQ_PPF = [
  {
    q: "How long does paint protection film last?",
    a: "The GeoShield Ceramic Shield we install carries a 10-year manufacturer warranty against delamination, yellowing, bubbling, and cracking. Real-world life depends on how the vehicle is driven and maintained. It isn't permanent, it's designed to be removed and replaced when it has done its job.",
  },
  {
    q: "Will PPF damage my paint when it's removed?",
    a: "Installed and removed correctly, it should not. In most cases it preserves the paint underneath by taking the chips, scratches, and UV exposure the panel would otherwise absorb.",
  },
  {
    q: "Can you see the film once it's installed?",
    a: "Barely. It's a clear, gloss film designed to disappear into the finish. Depending on coverage and panel shape there can be a subtle edge or seam, and we'll show you where those land before we start.",
  },
  {
    q: "Is PPF worth it on a daily driver?",
    a: "That's where it makes the most sense. Daily drivers see the highway miles, the parking-lot dings, and the Michigan winter road treatment. PPF reduces the damage in the areas that take it first, bumper, hood edge, mirrors, rockers.",
  },
  {
    q: "Does PPF replace a ceramic coating?",
    a: "Partly. The film we install is ceramic-infused, so the covered panels get gloss and hydrophobic behavior built in. It doesn't cover the panels that aren't filmed, plenty of customers do full front PPF plus a coating on the rest of the car, and plenty are perfectly happy with the film alone. We'll give you a straight recommendation based on how you drive it.",
  },
  {
    q: "What doesn't PPF protect against?",
    a: "It isn't bulletproof. It won't stop dents, deep gouges, or collision damage, and it won't make a vehicle indestructible. Its job is reducing the everyday damage that accumulates.",
  },
  {
    q: "Can PPF go on an older car with existing paint damage?",
    a: "Usually yes, but existing chips, failing clear coat, or previous respray affect the result. We inspect first and tell you honestly whether film is the right call on that particular paint.",
  },
];

export default function PPFPage() {
  return (
    <>
      <Breadcrumbs
        trail={[{ label: "Paint Protection Film", href: "/paint-protection-film/" }]}
      />
      <ServiceSchema
        name="Paint Protection Film"
        description="GeoShield Ceramic Shield paint protection film installed in Whitmore Lake, Michigan. 6.5-mil TPU with heat-activated self-healing and a 10-year manufacturer warranty."
        url="/paint-protection-film/"
        price={1200}
      />

      <PageHero
        eyebrow="GeoShield Ceramic Shield"
        title={
          <>
            Paint protection film
            <br />
            in Whitmore Lake, MI
          </>
        }
        sub="A clear, self-healing layer over the panels that take the hits first. 6.5-mil TPU with ceramic-infused layers and a 135° water contact angle, backed by a 10-year manufacturer warranty against delamination, yellowing, bubbling, and cracking."
        photo="ppf-corvette-c8-install"
        price="From $1,200 · partial front"
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHead
              eyebrow="What it is"
              title="Clear armor for the front third of your car."
            />
            <Prose className="mt-6">
              <p>
                Paint protection film, PPF, or &ldquo;clear bra&rdquo;, is a
                transparent urethane film applied over painted surfaces to absorb rock
                chips, scratches, and everyday road damage. It goes where damage
                actually happens: the bumper, the leading edge of the hood, the
                fenders, the mirrors.
              </p>
              <p>
                Once installed it&apos;s close to invisible, and the film we use heals
                its own swirls and light scratches with heat. It isn&apos;t a magic
                shield and we won&apos;t sell it as one, but on a vehicle you intend
                to keep, it is the difference between a front end that looks four years
                old and one that doesn&apos;t.
              </p>
            </Prose>

            <h3 className="mt-10 font-display text-xl font-bold uppercase tracking-tight text-ink-text">
              Common areas we protect
            </h3>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {PPF_AREAS.map((a) => (
                <li key={a} className="flex gap-2.5 text-[0.9375rem] leading-snug text-body">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-red" aria-hidden />
                  {a}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6">
            <div className="aspect-[4/3] overflow-hidden bg-graphite">
              <Photo id="ppf-corvette-c8-front" sizes="(min-width: 1024px) 50vw, 100vw" />
            </div>
            <div className="plate-flat mt-5 grid grid-cols-2 gap-px bg-line">
              {[
                { n: "6.5", l: "mil TPU core" },
                { n: "135°", l: "water contact angle" },
                { n: "10 yr", l: "manufacturer warranty" },
                { n: "Self", l: "healing, heat activated" },
              ].map((s) => (
                <div key={s.l} className="bg-white p-5">
                  <p className="price text-[1.75rem] leading-none">{s.n}</p>
                  <p className="mt-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">
                    {s.l}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section tone="paper-2" id="pricing">
        <SectionHead
          align="split"
          eyebrow="Coverage and pricing"
          title="Three levels of coverage."
          intro="Final pricing depends on vehicle size, paint condition, and exactly which panels you want covered. Coverage can be customised, these are the three most people start from."
        />
        <div className="mt-10">
          <PpfTiers />
        </div>
      </Section>

      <Section>
        <SectionHead
          eyebrow="The install"
          title="Preparation, fitment, and not rushing it."
          intro="Every vehicle is different, so the process flexes with paint condition and coverage. What doesn't flex is the prep."
        />
        <div className="mt-10 grid gap-px bg-line md:grid-cols-4">
          {PROCESS.map((p) => (
            <div key={p.n} className="bg-paper p-6">
              <span className="font-mono text-[0.6875rem] tracking-[0.2em] text-red">
                {p.n}
              </span>
              <h3 className="mt-4 font-display text-lg font-bold uppercase leading-tight tracking-tight text-ink-text">
                {p.t}
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-body">{p.b}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="wall">
        <div className="grid gap-10 md:grid-cols-12 md:items-center">
          <div className="md:col-span-7">
            <SectionHead
              tone="light"
              eyebrow="Warranty"
              title="What the 10-year warranty actually covers."
              intro="Delamination, yellowing, bubbling, and cracking, those four, named by the manufacturer. GeoShield doesn't publish the full terms publicly, so we hand you the paperwork rather than paraphrasing it."
            />
          </div>
          <div className="md:col-span-5">
            <Link href="/warranties/" className="btn btn-outline-light btn-lg">
              <Shield className="h-4 w-4" aria-hidden />
              All warranties, in plain English
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </Section>

      <Gallery
        items={WORK.filter((w) => w.category === "ppf")}
        filterable={false}
        eyebrow="Film work"
        title="PPF installs from our bay"
      />

      <ReviewWall items={reviewsFor("ppf", 3)} eyebrow="Customers" title="From the review page" />

      <FAQ items={FAQ_PPF} title="Paint protection film questions" />

      <CTABand
        title="Not sure how much coverage you need?"
        body="Send the vehicle and how you drive it. We'll recommend coverage based on that instead of quoting the biggest package by default, and we'll tell you if film isn't the right call for that paint."
      />
    </>
  );
}
