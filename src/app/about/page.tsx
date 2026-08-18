import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { Section, SectionHead, Prose } from "@/components/ui/Section";
import { WhyPanel } from "@/components/sections/Proof";
import ReviewWall from "@/components/sections/ReviewWall";
import CTABand from "@/components/sections/CTABand";
import Photo from "@/components/ui/Photo";
import { BRAND, SEO, WHAT_TO_EXPECT, reviewsFor } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About the Shop, Formerly HD Automotive Detailing | Whitmore Lake MI",
  description: SEO.about.description,
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs trail={[{ label: "About", href: "/about/" }]} />

      <PageHero
        eyebrow={`Justin Warwick · ${BRAND.city}, ${BRAND.state}`}
        title={
          <>
            Not a volume shop.
            <br />
            Not a franchise.
          </>
        }
        sub="Since 2017, one person has been doing the work at 10170 Industrial Drive. Thousands of vehicles later, most of what comes through the door is a returning customer or someone they sent."
        photo="shop-front"
        compact
        ctaLabel="Talk to Justin"
        ctaHref="/contact/"
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHead eyebrow="The shop" title="Why we do it this way." />
            <Prose className="mt-6">
              <p>
                I&apos;m Justin Warwick. I started this business because I care about
                doing things properly, and since 2017 I&apos;ve been helping local
                drivers keep their vehicles clean, protected, and looking the way they
                should.
              </p>
              <p>
                Good results come from doing the basics correctly and not cutting
                corners. In practice that means proper prep work instead of rushed
                jobs, honest recommendations instead of upsells, and clear
                expectations instead of hype. If a service isn&apos;t a good fit for
                your vehicle or your goals, I&apos;ll tell you. I&apos;d rather earn
                trust than make a quick sale.
              </p>
              <h3>Why the name changed</h3>
              <p>
                For most of the last decade this was HD Automotive Detailing. Window
                tinting, ceramic coatings, paint protection film, and paint correction
                have all become major parts of the business, and the old name boxed it
                into detailing. HD Auto Studio reflects what the shop actually does
                now. Same owner, same address, same phone number.
              </p>
              <h3>Everything happens indoors</h3>
              <p>
                We don&apos;t do mobile work, and that&apos;s deliberate. Film, coatings,
                and correction all depend on controlled lighting, temperature, and a
                clean environment. Consistent results come from a controlled space,
                which is exactly what a driveway isn&apos;t.
              </p>
            </Prose>
          </div>

          <div className="lg:col-span-5 space-y-5">
            <div className="aspect-[4/3] overflow-hidden bg-graphite">
              <Photo id="correction-yukon" sizes="(min-width: 1024px) 40vw, 100vw" />
            </div>
            <div className="plate p-6">
              <h3 className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-muted">
                What to expect
              </h3>
              <ul className="mt-5 space-y-3">
                {WHAT_TO_EXPECT.map((w) => (
                  <li
                    key={w}
                    className="flex gap-3 text-[0.875rem] leading-snug text-body"
                  >
                    <span className="mt-2 h-px w-3 shrink-0 bg-red" aria-hidden />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      <WhyPanel />

      <ReviewWall
        items={reviewsFor("home", 3)}
        eyebrow="Repeat customers"
        title="The part that matters most"
        intro="Most of the work here comes from people who have already been here once."
      />

      <CTABand
        eyebrow="Come by"
        title="We're in Monday to Friday, 8 to 5."
        body="Stop in with questions, or send the vehicle details and we'll take it from there. No pressure, no sales pitch, just straight answers."
      />
    </>
  );
}
