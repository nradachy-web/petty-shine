import type { Metadata } from "next";

import ServiceCards from "@/components/sections/ServiceCards";
import TownChips from "@/components/sections/TownChips";
import PhoneLink from "@/components/tracking/PhoneLink";
import {
  Button,
  DatumRule,
  KeyValueList,
  KeyValueRow,
  Section,
  SectionHead,
} from "@/components/ui";
import { BRAND, CITIES } from "@/lib/constants";
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
 * back to the right page is the whole design: the phone and shop details,
 * then the service cards, then the town chips.
 *
 * The town pages moved from /window-tinting/<city>/ to /areas/<city>/ , so
 * the service area band links every town directly instead of pointing at the
 * index and hoping.
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
          <div className="min-w-0 lg:col-span-7">
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

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/quote/" tone="cyan">
                Get a price
              </Button>
              <Button href="/" tone="ghost">
                Back to the front
              </Button>
            </div>
          </div>

          {/* The phone and the shop facts hold the right column now that the
              service list runs full width below. Same content as before,
              different cell. */}
          <div className="min-w-0 lg:col-span-5">
            <PhoneLink
              placement="not-found"
              className="flex min-w-0 items-center justify-between gap-4 border border-rule-light bg-sheet-060 px-5 py-5 transition-colors hover:border-cyan-500"
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
          </div>
        </div>

        <DatumRule
          label="Everything the shop does"
          className="mb-8 mt-14 md:mt-16"
        />

        {/* The nine services as photo cards, not nine ruled rows. The old
            KeyValueList printed "Quoted on your vehicle" in the right column
            nine times, and nine identical cells read as filler on the one
            page whose whole job is re-routing a paid click. The cards carry
            the same numbered index on the shop's own photographs, each with
            its own quote link. Full width because the card grid is sized for
            the section column, not a half column. */}
        <ServiceCards />

        <div className="mt-10 flex flex-wrap gap-3">
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

        <p className="mt-6 font-mono text-[0.6875rem] uppercase leading-relaxed tracking-[0.2em] tone-muted">
          {CITIES.length} towns measured · the minutes on each chip are the
          real drive
        </p>

        {/* The chips, not just a link to them. Old town URLs are exactly the
            paths that land on this page, so the visitor who arrives from a
            town query gets the town's new page in one tap instead of a
            detour through the index. */}
        <TownChips className="mt-6" />

        <div className="mt-8">
          <Button href="/areas/" tone="ghost">
            Every town, with miles and routes
          </Button>
        </div>
      </Section>
    </>
  );
}
