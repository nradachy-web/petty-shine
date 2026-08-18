import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Check } from "lucide-react";
import QuoteConversion from "@/components/tracking/QuoteConversion";
import RuleLabel from "@/components/ui/RuleLabel";
import Photo from "@/components/ui/Photo";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Request received",
  description: "Your quote request is in. Justin will be in touch shortly.",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <>
      <QuoteConversion />

      <section className="on-wall relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Photo id="tint-mustang-dark" priority sizes="100vw" className="opacity-30" />
          <div className="absolute inset-0 scrim-l" />
        </div>

        <div className="container-site relative py-24 md:py-32">
          <div className="max-w-2xl">
            <RuleLabel tone="light">Request received</RuleLabel>
            <h1 className="display-lg mt-6 text-white">
              Got it. Justin will be in touch.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-light-2">
              Your request landed in the shop inbox. During business hours you&apos;ll
              usually hear back the same day, and it&apos;ll come from{" "}
              <span className="font-semibold text-white">{BRAND.phoneDisplay}</span>, so
              keep an eye out for that number.
            </p>

            <ul className="mt-9 space-y-3">
              {[
                "We confirm the exact price for your vehicle before booking anything",
                "You'll get the realistic timeline, including whether it stays overnight",
                "No follow-up sequence, no marketing list, no pressure",
              ].map((p) => (
                <li key={p} className="flex gap-3 text-[0.9375rem] text-light-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-red" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a href={`tel:${BRAND.phoneTel}`} className="btn btn-primary btn-lg">
                <Phone className="h-4 w-4" aria-hidden />
                Call the shop now
              </a>
              <Link href="/gallery/" className="btn btn-outline-light btn-lg">
                Look at the work while you wait
              </Link>
            </div>

            <p className="mt-10 font-mono text-[0.6875rem] uppercase leading-relaxed tracking-[0.16em] text-dim">
              {BRAND.street} · {BRAND.city}, {BRAND.state} {BRAND.zip}
              <br />
              {BRAND.hoursShort}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
