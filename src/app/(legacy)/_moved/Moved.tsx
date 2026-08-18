import type { Metadata } from "next";

import PhoneLink from "@/components/tracking/PhoneLink";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import KeyValueRow, { KeyValueList } from "@/components/ui/KeyValueRow";
import Section from "@/components/ui/Section";
import { asset } from "@/lib/asset";
import { BRAND } from "@/lib/constants";
import type { MovedSpec } from "./specs";

/* ============================================================================
   THE REDIRECT STUB

   GitHub Pages serves static files. It cannot issue a 301. So every old Duda
   URL gets a real page at its old path, and that page moves the visitor four
   independent ways, in this order:

     1. an inline script, first thing in the document body, which is the fast
        path and the ONLY one that carries the query string forward. That
        matters more than it looks: the four paid ad groups land here with a
        gclid attached, and a gclid that does not survive the hop is a
        conversion Google Ads never gets to attribute.
     2. <meta http-equiv="refresh" content="0; ..."> in the head, which is the
        no-JavaScript path and is what Google treats as equivalent to a 301.
     3. <link rel="canonical"> at the new URL, so any crawler that indexes the
        stub anyway consolidates the signal onto the real page.
     4. a real visible sentence and a real link, for the reader who has
        JavaScript off AND meta refresh blocked. That reader gets a page that
        looks deliberate, not a page that looks broken.

   noindex, follow: the stub itself must never rank, but link equity should
   still flow through it. Note the known tension, and live with it on purpose:
   Google calls noindex plus a cross-page canonical a conflicting signal. The
   stub is the page we are willing to lose. The conversion path is the visible
   link and the phone number below it, which work whatever a crawler decides.

   No photograph on this page. Every millisecond here is a millisecond the
   visitor is not on the page they asked for, so nothing loads that does not
   help them leave.
   ========================================================================== */

export function movedMetadata(spec: MovedSpec): Metadata {
  return {
    title: spec.title,
    description: spec.description,
    /* Points at the destination, not at this path. metadataBase in the root
       layout resolves it against www.pettyshine.com. */
    alternates: { canonical: spec.to },
    robots: { index: false, follow: true },
    /* Without this the root layout's home page card is inherited, so a stub
       pasted into a text message would preview as the home page. */
    openGraph: {
      title: spec.title,
      description: spec.description,
      url: spec.to,
    },
    twitter: { title: spec.title, description: spec.description },
  };
}

export default function Moved({ spec }: { spec: MovedSpec }) {
  /* asset() adds the base path on the GitHub Pages subpath preview. <Link>
     handles that itself; a raw meta refresh URL and a raw location.replace
     do not. */
  const target = asset(spec.to);

  /* Loop guard first, then the hop. location.replace so the back button
     returns to wherever the visitor came from instead of bouncing off this
     page again. search and hash ride along, which is how gclid survives. */
  const hop = `(function(){try{var t=${JSON.stringify(
    target
  )};var here=location.pathname.replace(/\\/+$/,"");if(here===t.replace(/\\/+$/,""))return;location.replace(t+location.search+location.hash);}catch(e){}})();`;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: hop }} />
      <meta httpEquiv="refresh" content={`0; url=${target}`} />

      {/* Breadcrumbs renders the LAST crumb as aria-current, not as a link. So a
          moved page gets two: the destination, which stays tappable and is a
          second real way out, then this page itself. A removed page gets one,
          because there is nowhere above it to go. */}
      <Breadcrumbs
        plane="sheet"
        trail={
          spec.removed
            ? [{ label: "Page removed", href: `${spec.from}/` }]
            : [
                { label: spec.destination, href: spec.to },
                { label: "Moved", href: `${spec.from}/` },
              ]
        }
      />

      <Section plane="sheet" label={spec.removed ? "Removed" : "Moved"}>
        <div className="max-w-2xl">
          <h1 className="ps-display ps-display-lg">{spec.heading}</h1>

          <div className="ps-prose mt-6">
            <p>{spec.lead}</p>
            <p>If the page does not move on its own, use the link below.</p>
          </div>

          <KeyValueList className="mt-9" label="Page address">
            <KeyValueRow k="Old page" v={spec.from} />
            {spec.removed ? (
              <KeyValueRow k="Status" v="Removed" tone="pewter" />
            ) : (
              <KeyValueRow k="New page" v={spec.to} strong />
            )}
          </KeyValueList>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button href={spec.to} tone="cyan">
              {spec.action}
            </Button>
            <PhoneLink
              placement={`legacy${spec.from}`}
              className="ps-btn ps-btn--ghost"
            >
              Call {BRAND.phoneDisplay}
            </PhoneLink>
          </div>
        </div>
      </Section>
    </>
  );
}

export { Moved };
