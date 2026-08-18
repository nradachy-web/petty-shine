import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import FAQ from "@/components/sections/FAQ";
import CTABand from "@/components/sections/CTABand";
import { FAQ_GENERAL, FAQ_TINT, SEO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Frequently Asked Questions, Tint, PPF, Coatings & Detailing",
  description: SEO.faq.description,
  alternates: { canonical: "/faq/" },
};

export default function FAQPage() {
  return (
    <>
      <Breadcrumbs trail={[{ label: "FAQ", href: "/faq/" }]} />

      <PageHero
        eyebrow="Questions"
        title={
          <>
            Everything people
            <br />
            ask before booking
          </>
        }
        sub="Timing, drop-off, pricing, warranties, cure times, and what we won't do. If your question isn't here, call or text, you'll get a straight answer either way."
        photo="tint-ram-trx"
        compact
      />

      <FAQ items={FAQ_GENERAL} title="About the shop" eyebrow="General" />
      <FAQ items={FAQ_TINT} title="Window tint" eyebrow="Tint" />

      <CTABand />
    </>
  );
}
