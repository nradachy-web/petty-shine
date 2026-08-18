import type { Metadata } from "next";
import { Check, X, Info } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { Section, SectionHead, Prose } from "@/components/ui/Section";
import CTABand from "@/components/sections/CTABand";
import { BRAND, WARRANTIES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Window Film, PPF and Ceramic Coating Warranties, In Plain English",
  description:
    "What each warranty on our work actually covers: LLumar film, GeoShield Ceramic Shield paint protection film, and System X ceramic coating, including the maintenance requirements and the parts most shops leave out.",
  alternates: { canonical: "/warranties/" },
};

export default function WarrantiesPage() {
  return (
    <>
      <Breadcrumbs trail={[{ label: "Warranties", href: "/warranties/" }]} />

      <PageHero
        eyebrow="Coverage, unedited"
        title={
          <>
            What our warranties
            <br />
            actually cover
          </>
        }
        sub="Three manufacturers, three sets of terms, and a few conditions that rarely make it into a sales pitch. All of it is below, including the annual inspection requirement and the fact that a coating warranty doesn't transfer when you sell the car."
        photo="ppf-classic-pickup-rear"
        compact
        ctaLabel="Ask us anything"
        ctaHref="/contact/"
      />

      <Section>
        <SectionHead
          align="split"
          eyebrow="Why this page exists"
          title="Nobody else around here publishes their terms."
          intro="Which is convenient, because the terms are where the interesting details live, the annual inspection fee, what transfers and what doesn't, and which defects are actually named. We'd rather you know all of it before you spend the money than discover it in year three."
        />
      </Section>

      {WARRANTIES.map((w, i) => (
        <Section key={w.id} tone={i % 2 === 0 ? "paper-2" : "paper"}>
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <h2 className="display-md">{w.product}</h2>
              <p className="mt-4 inline-block border-2 border-red px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-red">
                {w.headline}
              </p>
            </div>

            <div className="md:col-span-7">
              <div className="grid gap-px bg-line sm:grid-cols-2">
                <div className="bg-white p-5">
                  <h3 className="flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-good">
                    <Check className="h-4 w-4" aria-hidden /> Covered
                  </h3>
                  <ul className="mt-3 space-y-2 text-[0.875rem] leading-snug text-body">
                    {w.covers.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white p-5">
                  <h3 className="flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-red">
                    <X className="h-4 w-4" aria-hidden /> Not covered
                  </h3>
                  <ul className="mt-3 space-y-2 text-[0.875rem] leading-snug text-body">
                    {w.excludes.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {w.notes.map((n) => (
                  <p
                    key={n}
                    className="flex gap-3 text-[0.9375rem] leading-relaxed text-body"
                  >
                    <Info className="mt-1 h-4 w-4 shrink-0 text-red" aria-hidden />
                    {n}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Section>
      ))}

      <Section tone="wall">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <SectionHead
              tone="light"
              eyebrow="The short version"
              title="Ask for the paperwork. From anyone."
            />
          </div>
          <div className="md:col-span-6">
            <Prose className="text-light-2 [&_strong]:text-white">
              <p>
                Manufacturer warranties in this industry are administered through the
                installing shop, and none of these three brands publishes complete
                terms on a public web page. That means the certificate you get at
                pickup <strong>is</strong> the warranty, keep it with the vehicle.
              </p>
              <p>
                It also means you should be skeptical of any shop advertising terms it
                won&apos;t show you. If a competitor promises a nationwide, fully
                transferable, lifetime everything, ask which manufacturer document says
                so. It&apos;s a fair question and it has a real answer.
              </p>
              <p>
                Ours are on this page, and the paperwork is in the shop. Call{" "}
                <a href={`tel:${BRAND.phoneTel}`} className="text-white underline">
                  {BRAND.phoneDisplay}
                </a>{" "}
                and we&apos;ll walk you through any of it.
              </p>
            </Prose>
          </div>
        </div>
      </Section>

      <CTABand
        eyebrow="Questions first"
        title="Warranty questions are free."
        body="Whether or not you buy anything, if you want a straight answer about what a coating or film warranty really covers, call or text. We'd rather the market got smarter."
      />
    </>
  );
}
