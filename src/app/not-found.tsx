import type { Metadata } from "next";
import Link from "next/link";

import PhoneLink from "@/components/tracking/PhoneLink";
import {
  Button,
  DatumRule,
  KeyValueList,
  KeyValueRow,
  PriceOrQuote,
  Section,
  SectionHead,
} from "@/components/ui";
import { BRAND, CITIES, SERVICES } from "@/lib/constants";
import { miles, milesLong } from "@/lib/utils";
import { spell } from "./areas/[city]/facts";

/**
 * 404. Static export renders this to out/404.html, which GitHub Pages serves
 * for any unmatched path.
 *
 * It is a real page rather than an apology, because of where its traffic will
 * come from. The old Duda site is being replaced under the same domain, and
 * four Google Ads final URLs plus every backlink point at old paths. A dead
 * end here is a wasted click that was already paid for, so the fastest route
 * back to the right page is the whole design: the numbered service index, then
 * the shop details, then the phone.
 *
 * The town pages moved from /window-tinting/<city>/ to /areas/<city>/ , so the
 * service area link matters here too.
 */

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <Section plane="sheet" label="404">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <h1 className="ps-display ps-display-lg">That page is not here.</h1>

            <div className="ps-prose mt-6">
              <p>
                The link is dead. The shop is not. Everything it does is
                listed here, so you can go straight to the page you were
                after.
              </p>
              <p>
                If you would rather not hunt for it, call and say what the
                vehicle needs.
              </p>
            </div>

            <PhoneLink
              placement="not-found"
              className="mt-8 flex min-w-0 items-center justify-between gap-4 border border-rule-light bg-sheet-060 px-5 py-5 transition-colors hover:border-cyan-500"
            >
              <span className="min-w-0">
                <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-400">
                  Call the shop
                </span>
                <span className="mt-1 block font-mono text-2xl tabular-nums text-ink-900">
                  {BRAND.phoneDisplay}
                </span>
              </span>
              <span className="h-px w-6 flex-none bg-cyan-500" aria-hidden />
            </PhoneLink>

            <KeyValueList className="mt-8" label="The shop">
              <KeyValueRow k="Address" v={BRAND.addressLine} />
              <KeyValueRow k="Hours" v={BRAND.hoursShort} />
            </KeyValueList>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/quote/" tone="cyan">
                Get a price
              </Button>
              <Button href="/" tone="ghost">
                Back to the front
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <DatumRule label="Everything the shop does" className="mb-7" />

            {/* One call for all nine rows. PriceOrQuote reads PRICING_MODE
                itself, so while pricing is private every row is a quote link
                carrying its own service, and none of them is a dead cell or a
                bare /quote/ href. The old code branched on fromPrice by hand
                and left the five priced rows on a plain PriceFigure with no
                service prop, which rendered five identical unqualified links. */}
            <KeyValueList label="Everything the shop quotes">
              {SERVICES.map((s) => (
                <KeyValueRow
                  key={s.id}
                  k={
                    <Link href={s.href} className="link-inline">
                      {s.index} {s.name}
                    </Link>
                  }
                  v={
                    <PriceOrQuote
                      service={s.quoteKey}
                      value={s.fromPrice}
                      size="sm"
                    />
                  }
                />
              ))}
            </KeyValueList>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/services/" tone="ghost" size="sm">
                Services index
              </Button>
              <Button href="/pricing/" tone="ghost" size="sm">
                How we quote
              </Button>
              <Button href="/gallery/" tone="ghost" size="sm">
                The work
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <Section plane="shop" label="Service area" className="plane-arc" rhythm="snug">
        <SectionHead
          size="md"
          title="Looking for your town?"
          intro={
            <p>
              Road distance and drive time from {spell(CITIES.length)} towns around the
              Triad, measured from the shop door. {CITIES[0].name} is{" "}
              {milesLong(CITIES[0].miles)} out,{" "}
              {CITIES[CITIES.length - 1].name} is{" "}
              {miles(CITIES[CITIES.length - 1].miles)}.
            </p>
          }
        />
        <div className="mt-7">
          <Button href="/areas/" tone="ghost">
            Drive times by town
          </Button>
        </div>
      </Section>
    </>
  );
}
