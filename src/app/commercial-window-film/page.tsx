import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { Section, SectionHead, Prose } from "@/components/ui/Section";
import FAQ from "@/components/sections/FAQ";
import CTABand from "@/components/sections/CTABand";
import ServiceSchema from "@/components/seo/ServiceSchema";
import Photo from "@/components/ui/Photo";
import { ARCHITECTURAL_FILMS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Commercial and Security Window Film | Washtenaw & Livingston County",
  description:
    "Commercial window film for offices, storefronts, schools, and government buildings around Whitmore Lake, Ann Arbor, and Brighton. Heat, glare, privacy, and UV control on architectural glass.",
  alternates: { canonical: "/commercial-window-film/" },
};

const FAQ_COM = [
  {
    q: "Do you work with businesses, schools, and government buildings?",
    a: "Yes, offices, storefronts, schools, and government agencies are all part of the architectural side of the shop. Scope, glass type, and access determine scheduling; a lot of this work happens outside business hours.",
  },
  {
    q: "What problem does commercial film usually solve?",
    a: "Four things, usually in combination: employees roasting on the sun side of the building, glare making screens unusable, daytime privacy on ground-floor glass, and cooling load. Dual reflective film addresses all four at once.",
  },
  {
    q: "Will film change how the building looks from outside?",
    a: "It can, deliberately. Solar Bronze 20 gives a warm copper exterior finish; Super Alloy reads as a clean mirrored surface during daylight; White Frost is a frosted decorative look for partitions and entries. Sample first, install second.",
  },
  {
    q: "Can you do partial installs, just the west elevation?",
    a: "Frequently. Sun problems are rarely evenly distributed. Filming only the affected elevation is often the sensible spend, though matching appearance across the façade is worth thinking about before you commit.",
  },
  {
    q: "How is commercial work quoted?",
    a: "Per project, after an on-site measure. Glass count, sizes, film selection, access, and hours all factor in. You get a written quote before anything is ordered.",
  },
];

export default function CommercialFilmPage() {
  return (
    <>
      <Breadcrumbs
        trail={[{ label: "Commercial Window Film", href: "/commercial-window-film/" }]}
      />
      <ServiceSchema
        name="Commercial Window Film"
        description="Commercial and security window film for offices, storefronts, schools, and government buildings in Washtenaw and Livingston County, Michigan."
        url="/commercial-window-film/"
        serviceType="Window tinting service"
      />

      <PageHero
        eyebrow="Commercial &amp; architectural"
        title={
          <>
            Commercial window film
            <br />
            for local businesses
          </>
        }
        sub="Storefronts, offices, schools, and government buildings. Heat load, glare, daytime privacy, UV, and appearance, measured on site, quoted in writing, installed around your hours."
        photo="commercial-hemlock"
        ctaLabel="Request a site measure"
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHead
              eyebrow="What it fixes"
              title="The sun side of the building, and everyone sitting in it."
            />
            <Prose className="mt-6">
              <p>
                Commercial glass is usually specified for daylight and appearance, not
                for the people working three feet behind it. Film is the retrofit:
                dual reflective solar film rejects up to 87% of total solar energy and
                blocks up to 99% of UV while keeping the view from the inside intact.
              </p>
              <p>
                Daytime privacy comes along with it, the mirrored outer layer stops
                passers-by seeing in without turning the office into a cave. For
                conference rooms and entries where you want privacy but not darkness,
                decorative frost is the usual answer.
              </p>
              <p>
                Every project starts with an on-site measure. Glass type, existing
                coatings, and sealed-unit construction all affect which films are safe
                to apply, and that is not a judgement to make from a photo.
              </p>
            </Prose>
          </div>
          <div className="lg:col-span-6 space-y-5">
            <div className="aspect-[4/3] overflow-hidden bg-graphite">
              <Photo id="commercial-office" sizes="(min-width: 1024px) 50vw, 100vw" />
            </div>
            <figcaption className="placard">
              <span className="placard-line">
                <span className="text-ink-text">Office glazing</span>
              </span>
              <span className="mt-1 block pl-[22px]">
                Filmed and unfilmed bays, same elevation, same afternoon
              </span>
            </figcaption>
          </div>
        </div>
      </Section>

      <Section tone="paper-2">
        <SectionHead
          align="split"
          eyebrow="Film options"
          title="Performance, decorative, or both."
          intro="Most buildings end up with a solar control film on the exposed elevations and a decorative film on interior glass. Samples before commitment, always."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {ARCHITECTURAL_FILMS.map((f) => (
            <div key={f.id} className="plate flex h-full flex-col p-6 md:p-7">
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-red">
                {f.type}
              </span>
              <h3 className="display-sm mt-2">{f.name}</h3>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-body">{f.blurb}</p>
              <dl className="mt-auto space-y-2.5 border-t border-line pt-5">
                {f.specs.map((s) => (
                  <div key={s.label} className="flex items-baseline justify-between gap-4">
                    <dt className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">
                      {s.label}
                    </dt>
                    <dd className="text-right text-[0.875rem] font-medium text-ink-text">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </Section>

      <FAQ items={FAQ_COM} title="Commercial film questions" />

      <CTABand
        eyebrow="Commercial quotes"
        title="Send the address and the elevation that's cooking."
        body="We'll come measure, bring samples, and put a written number in front of you before anything is ordered. Installs are scheduled around your operating hours."
        ctaLabel="Request a site measure"
      />
    </>
  );
}
