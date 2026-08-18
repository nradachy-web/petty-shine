import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { Section, SectionHead, Prose } from "@/components/ui/Section";
import PriceEngine from "@/components/quote/PriceEngine";
import CTABand from "@/components/sections/CTABand";
import FilmSpecTable from "@/components/sections/FilmSpecTable";
import FAQ from "@/components/sections/FAQ";
import { ATC_SPECS, CTX_SPECS, FILM_SPEC_FOOTNOTE, WARRANTIES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "LLumar ATC vs CTX Window Film, Compared Side by Side",
  description:
    "The published Eastman performance data for both LLumar automotive films we install: visible light, total solar energy rejection, infrared rejection, UV and glare, shade by shade.",
  alternates: { canonical: "/llumar-window-film/" },
};

const FAQ_FILM = [
  {
    q: "Does the shade number equal the tint percentage?",
    a: "Not exactly, and this trips people up. LLumar names shades on a nominal scale, but measured VLT differs, ATC 15 measures 18% VLT, ATC 20 measures 25%, CTX 15 measures 20%. When we quote a shade we're talking about the product name; the measured number is in the tables on this page.",
  },
  {
    q: "Which film do most people pick?",
    a: "Split roughly by what the vehicle does. Cars that sit outside all day, or that people keep long-term, go ceramic. Cars where the goal is a clean factory look on a budget go dyed. Both are color-stable and both block more than 99% of UV.",
  },
  {
    q: "Will either film fade purple?",
    a: "No. That's the failure mode of cheap surface-dyed film. LLumar integrates the charcoal hue through the film for color stability, and both lines carry a manufacturer's lifetime limited warranty against cracking, bubbling, yellowing, and discoloration.",
  },
  {
    q: "Do you install FormulaOne?",
    a: "No. FormulaOne is LLumar's SelectPro-exclusive line. We install ATC and CTX and we're not going to imply otherwise, if a shop quotes you FormulaOne, ask to see their SelectPro accreditation.",
  },
];


export default function LlumarPage() {
  const llumar = WARRANTIES.find((w) => w.id === "llumar")!;

  return (
    <>
      <Breadcrumbs
        trail={[
          { label: "Window Tinting", href: "/window-tinting/" },
          { label: "LLumar Film", href: "/llumar-window-film/" },
        ]}
      />

      <PageHero
        eyebrow="The film we install"
        title={
          <>
            LLumar ATC vs CTX,
            <br />
            side by side
          </>
        }
        sub="Most shops in this market name no film brand at all. Here are both of ours, with the manufacturer's published numbers rather than adjectives, so you can pick on data instead of vibes."
        photo="tint-gto"
        compact
      />

      <Section>
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="display-sm">ATC, color-stable dyed</h2>
            <Prose className="mt-4">
              <p>
                LLumar&apos;s dyed line. The charcoal hue is integrated through the
                film rather than applied to the surface, which is what keeps it from
                the cracking, peeling, and purple fade cheap film is famous for.
              </p>
              <p>
                Good heat rejection, strong glare control, and more than 99% UV
                blocked. It&apos;s the budget pick, and it looks factory.
              </p>
            </Prose>
          </div>
          <div>
            <h2 className="display-sm">CTX, ceramic</h2>
            <Prose className="mt-4">
              <p>
                Ceramic construction, no metal, no mirror. Eastman describes it as
                excellent heat rejection without blocking electronic signal
                transmission, so phones, GPS, and keyless entry behave normally.
              </p>
              <p>
                The reason to pay more is the infrared column below: roughly double
                ATC at the same visible darkness, and it&apos;s the part you feel.
              </p>
            </Prose>
          </div>
        </div>

        <h3 className="display-sm mt-14">LLumar CTX, ceramic</h3>
        <div className="mt-5">
          <FilmSpecTable rows={CTX_SPECS} accent />
        </div>

        <h3 className="display-sm mt-12">LLumar ATC, dyed</h3>
        <div className="mt-5">
          <FilmSpecTable rows={ATC_SPECS} />
        </div>

        <p className="mt-6 max-w-3xl text-[0.75rem] leading-relaxed text-muted">
          {FILM_SPEC_FOOTNOTE}
        </p>
      </Section>

      <Section tone="paper-2">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead
              eyebrow="Warranty"
              title="What the film warranty covers."
              intro={llumar.headline}
            />
            <ul className="mt-6 space-y-2.5">
              {llumar.covers.map((c) => (
                <li key={c} className="text-[0.9375rem] text-body">
                  · {c}
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-3">
              {llumar.notes.map((n) => (
                <p
                  key={n}
                  className="border-l-2 border-red pl-4 text-[0.8125rem] leading-relaxed text-muted"
                >
                  {n}
                </p>
              ))}
            </div>
            <Link href="/warranties/" className="btn btn-outline mt-7 inline-flex">
              All three warranties
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <div className="lg:col-span-7">
            <PriceEngine heading="Price either film on my vehicle" />
          </div>
        </div>
      </Section>

      <FAQ items={FAQ_FILM} title="Film questions" />

      <CTABand
        title="Still deciding between the two?"
        body="Tell us the vehicle, where it parks, and how long you plan to keep it. That's usually enough for us to tell you which film is actually worth your money."
      />
    </>
  );
}
