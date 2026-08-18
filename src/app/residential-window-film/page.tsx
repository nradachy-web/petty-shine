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
  title: "Home Window Film and Tinting | Ann Arbor, Brighton & Livingston County",
  description:
    "Residential window film installed around Whitmore Lake, Ann Arbor, and Brighton. Cuts heat, glare, and UV fading in south and west-facing rooms, with privacy and decorative options.",
  alternates: { canonical: "/residential-window-film/" },
};

const FAQ_RES = [
  {
    q: "Will window film make my rooms dark?",
    a: "Only as much as you want. Solar control films come in a range from barely perceptible to strongly reflective, and the decorative White Frost option transmits 58% of visible light while still giving full privacy. We match the film to the room, not the other way round.",
  },
  {
    q: "Does home window film actually lower cooling costs?",
    a: "It reduces heat transfer through the glass, which is where a large share of summer heat gain comes from in a room with big south or west-facing windows. The films we use reject up to 87% of total solar energy. Whether that shows up as a number on your bill depends on the house.",
  },
  {
    q: "Will it stop my floors and furniture fading?",
    a: "It blocks up to 99% of UV, which is the main driver of fading in fabric, wood, and artwork. Visible light and heat also contribute, so film reduces fading substantially rather than eliminating it entirely.",
  },
  {
    q: "Can film be applied to any window?",
    a: "Most, but not all. Some glass types and some sealed units have restrictions, and the wrong film on the wrong glass can cause thermal stress. That's exactly what the on-site measure is for.",
  },
  {
    q: "How do I get a price?",
    a: "Residential work is quoted per project, glass count, sizes, orientation, and which film. Send a message with the address and roughly how many windows, and we'll arrange a look.",
  },
];

export default function ResidentialFilmPage() {
  return (
    <>
      <Breadcrumbs
        trail={[{ label: "Residential Window Film", href: "/residential-window-film/" }]}
      />
      <ServiceSchema
        name="Residential Window Film"
        description="Residential window film for heat, glare, UV, and privacy control on homes in Whitmore Lake, Ann Arbor, Brighton, and surrounding Livingston and Washtenaw County."
        url="/residential-window-film/"
        serviceType="Window tinting service"
      />

      <PageHero
        eyebrow="Home window film"
        title={
          <>
            Residential window film
            <br />
            for Michigan homes
          </>
        }
        sub="The same films and the same installer, on glass that isn't attached to a car. Solar control for the rooms that cook all afternoon, privacy where the neighbours are close, and UV protection for floors and furniture."
        photo="residential-home"
        ctaLabel="Get a home quote"
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHead
              eyebrow="Why homeowners call"
              title="One room in every house is unusable by 4pm."
            />
            <Prose className="mt-6">
              <p>
                Usually it faces west, has a lot of glass, and has furniture nobody
                sits on between May and September. Window film fixes the cause rather
                than the symptom: it reduces the solar energy coming through the glass
                before it becomes heat inside the room.
              </p>
              <p>
                It also handles the two problems people don&apos;t connect to their
                windows, glare on screens and televisions, and the slow fading of
                floors, rugs, and artwork under UV exposure.
              </p>
              <p>
                Everything is quoted per project after a measure. Glass type matters,
                and the wrong film on the wrong unit can cause thermal stress, so
                we&apos;d rather look first than guess from a photo.
              </p>
            </Prose>
          </div>
          <div className="lg:col-span-6">
            <div className="aspect-[4/3] overflow-hidden bg-graphite">
              <Photo id="residential-window" sizes="(min-width: 1024px) 50vw, 100vw" />
            </div>
          </div>
        </div>
      </Section>

      <Section tone="paper-2">
        <SectionHead
          align="split"
          eyebrow="Film options"
          title="Three lines that cover most homes."
          intro="Solar control, decorative privacy, or a warm reflective finish. Which one is right depends on the room's orientation, how much daylight you want to keep, and whether privacy is a factor."
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

      <FAQ items={FAQ_RES} title="Home window film questions" />

      <CTABand
        eyebrow="Residential quotes"
        title="Tell us which room is the problem."
        body="Send the address, roughly how many windows, and what you're trying to fix, heat, glare, privacy, or fading. We'll arrange a measure and quote the project properly."
        ctaLabel="Request a home quote"
      />
    </>
  );
}
