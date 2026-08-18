import type { Metadata } from "next";
import Link from "next/link";

import QuoteReceipt from "@/components/quote/QuoteReceipt";
import PhoneLink from "@/components/tracking/PhoneLink";
import QuoteConversion from "@/components/tracking/QuoteConversion";
import Button from "@/components/ui/Button";
import KeyValueRow, { KeyValueList } from "@/components/ui/KeyValueRow";
import Plate from "@/components/ui/Plate";
import Section, { SectionHead } from "@/components/ui/Section";
import { BRAND, NEAREST_EXIT } from "@/lib/constants";
import { milesLong } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Request received",
  description: "Your quote request has been sent to Petty Shine.",
  robots: { index: false, follow: false },
};

const NEXT_STEPS = [
  {
    href: "/gallery/",
    label: "Look at the work",
    note: "Every photo is a vehicle that came through this shop.",
  },
  {
    href: "/pricing/",
    label: "Read the price list",
    note: "Starting prices for detailing, interior, marine and coatings.",
  },
  {
    href: "/ceramic-coating/",
    label: "See what the coatings cover",
    note: "Three tiers, the chemistry in each, and the guarantee terms.",
  },
];

export default function ThankYouPage() {
  return (
    <>
      {/* Fires the Google Ads form conversion, once, and only for a real
          submit made in this session. See src/lib/gtag.ts. */}
      <QuoteConversion />

      <Section plane="shop" label="Request received">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-6">
            <h1 className="ps-display ps-display-lg">Your request is in.</h1>

            <div className="ps-prose mt-6">
              <p>
                It went to the shop with the vehicle you gave us. The shop is
                open {BRAND.hoursShort}.
              </p>
              <p>
                If you would rather talk it through now, the number is below.
                Ask for {BRAND.owner.split(" ")[0]}.
              </p>
            </div>

            <div className="mt-8">
              <PhoneLink placement="thank-you" className="ps-btn ps-btn--cyan">
                Call {BRAND.phoneDisplay}
              </PhoneLink>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-6">
            <Plate
              id="detail-mustang-red"
              priority
              caption="Ford Mustang GT, in the shop"
              sizes="(min-width: 1024px) 38rem, 100vw"
            />
          </div>
        </div>
      </Section>

      <Section plane="sheet" label="What happens next">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            {/* Renders only for a visitor who actually submitted. */}
            <QuoteReceipt />

            <h2 className="ps-heading mt-10 text-2xl">
              Where you are dropping it off
            </h2>

            <KeyValueList className="mt-5">
              <KeyValueRow k="Address" v={BRAND.addressLine} />
              {BRAND.hours.map((h) => (
                <KeyValueRow key={h.days} k={h.days} v={h.time} />
              ))}
              <KeyValueRow k="Nearest exit" v={NEAREST_EXIT.label} />
              <KeyValueRow
                k="From the exit"
                v={milesLong(NEAREST_EXIT.miles)}
                tone="pewter"
              />
            </KeyValueList>

            <div className="mt-6">
              <a
                href={BRAND.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ps-btn ps-btn--ghost ps-btn--sm"
              >
                Open in Google Maps
              </a>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <SectionHead size="md" title="While you wait" />

            <ul className="mt-6 min-w-0 border-t border-rule-light">
              {NEXT_STEPS.map((s) => (
                <li key={s.href} className="min-w-0 border-b border-rule-light">
                  <Link
                    href={s.href}
                    className="flex min-w-0 items-baseline justify-between gap-6 py-5"
                  >
                    <span className="min-w-0">
                      <span className="ps-heading block text-lg">{s.label}</span>
                      <span className="mt-1 block text-[0.9375rem] leading-relaxed text-ink-600">
                        {s.note}
                      </span>
                    </span>
                    <span className="h-px w-6 flex-none bg-cyan-500" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-[0.9375rem] leading-relaxed text-ink-400">
              Nothing else happens with your number. No list, no sequence.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
