import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { BRAND, GADS } from "@/lib/constants";
import { photoSrc, PHOTOS } from "@/lib/photos";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StickyCallBar from "@/components/layout/StickyCallBar";
import CtaClickTracking from "@/components/tracking/CtaClickTracking";
import { asset, IS_PREVIEW } from "@/lib/asset";

/* ============================================================================
   FONTS

   Archivo carries display and body. It is loaded as the VARIABLE font with
   the wdth axis, because width 82 italic is what makes a heading sound like
   the wordmark on his shop banner (see .display-condensed in globals.css).
   Never swap this for a static cut: a static cut has no width axis and every
   display heading on the site silently falls back to width 100.

   Both calls resolve to the same self hosted woff2 for the upright roman, so
   the second one costs no extra download.
   ========================================================================== */

const display = Archivo({
  subsets: ["latin"],
  variable: "--font-display-raw",
  axes: ["wdth"],
  style: ["normal", "italic"],
  display: "swap",
});

const body = Archivo({
  subsets: ["latin"],
  variable: "--font-body-raw",
  axes: ["wdth"],
  display: "swap",
});

/**
 * Modern Apex attribution token. Empty means the rails are not wired for this
 * site yet, and the script tag is not rendered at all. See the tag in the body.
 */
const APEX_FORM_TOKEN = process.env.NEXT_PUBLIC_APEX_FORM_TOKEN || "";

/** The sourced fact voice. 400 and 500 only, per the design. */
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono-raw",
  weight: ["400", "500"],
  display: "swap",
});

/* ============================================================================
   METADATA

   Everything factual here comes out of BRAND. Nothing is typed twice.
   ========================================================================== */

const HOME_TITLE = `${BRAND.name} | Auto Detailing and Ceramic Coating in ${BRAND.city}, ${BRAND.state}`;

/* 149 characters. Google truncates a description near 160 on a phone, so
   every description on this site is written to land inside that, with the
   hook in the first clause rather than the last. */
const HOME_DESCRIPTION = `Auto detailing, ceramic coating, paint protection film and window tinting in ${BRAND.city}, ${BRAND.stateName}. Published prices and a quote on your vehicle.`;

/** His own shop, his own banner, his own car. */
const OG_ID = "coating-huracan" as const;
const OG_PHOTO = PHOTOS[OG_ID];
const OG_WIDTH = 1600;

/**
 * The link card image. public/og-image.jpg is that same frame cropped to
 * 1200x630 with no overlay, which is the ratio every link card actually
 * crops to. The 4:3 photo above is still what the JSON-LD carries, because
 * schema.org image wants the real photograph, not a social crop.
 */
const OG_CARD = { url: "/og-image.jpg", width: 1200, height: 630 } as const;

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.siteUrl),
  title: {
    default: HOME_TITLE,
    template: `%s | ${BRAND.name}`,
  },
  description: HOME_DESCRIPTION,

  /* EVERY PAGE MUST SET ITS OWN alternates.canonical. This one is the home
     page's, and Next hands it down to any page that does not declare one,
     which would point the whole site at the root. */
  alternates: { canonical: "/" },

  /* NO title, description or url here on purpose.

     Next fills og:title and og:description from each page's OWN title and
     description when this object leaves them out, and hands this object down
     whole when it does not. Pinning them here put the HOME page's title and
     description on the link card of all 53 pages, so sharing /pricing/ posted
     a card that said nothing about prices. The home page still reads
     HOME_TITLE and HOME_DESCRIPTION, because those are its own.

     url is dropped rather than moved: it was BRAND.siteUrl on every page, so
     every share resolved to the home page. Next does not infer og:url from
     alternates.canonical, so no og:url is emitted at all now and a sharer
     falls back to the URL it fetched, which is the right one. If a page ever
     needs an explicit og:url, that page sets openGraph.url itself. */
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: BRAND.name,
    images: [
      {
        url: OG_CARD.url,
        width: OG_CARD.width,
        height: OG_CARD.height,
        alt: OG_PHOTO.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_CARD.url],
  },

  /* The subpath preview must never be indexed. Canonicals already point at
     the real domain, and an indexed preview would compete with it at launch. */
  robots: IS_PREVIEW
    ? { index: false, follow: false, nocache: true }
    : { index: true, follow: true },

  icons: { icon: [{ url: asset("/favicon.svg"), type: "image/svg+xml" }] },
};

export const viewport: Viewport = {
  themeColor: "#0A0B09",
  width: "device-width",
  initialScale: 1,
};

/* ============================================================================
   LOCAL BUSINESS STRUCTURED DATA

   AutomotiveBusiness is the LocalBusiness subtype for this vertical.

   NO aggregateRating. Google treats a rating a business marks up about
   itself as self serving and ineligible, and the 47 count is a figure to
   recheck on publish day rather than freeze into markup.

   NO priceRange either. It is a claim about his prices that no source backs.

   Nothing in this object names a road, a neighbour, a township or a family.
   Read FORBIDDEN_CLAIMS in src/lib/constants.ts before adding a field.
   ========================================================================== */

const DAY_NAMES: Record<string, string> = {
  Mo: "Monday",
  Tu: "Tuesday",
  We: "Wednesday",
  Th: "Thursday",
  Fr: "Friday",
  Sa: "Saturday",
  Su: "Sunday",
};
const DAY_ORDER = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

/** Turns one BRAND.hoursSchema entry, "Mo-Fr 08:00-17:00", into schema.org. */
function openingHours(spec: string) {
  const [days, time] = spec.split(" ");
  const [opens, closes] = time.split("-");
  const [first, last] = days.split("-");
  const from = DAY_ORDER.indexOf(first);
  const to = last ? DAY_ORDER.indexOf(last) : from;
  return {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: DAY_ORDER.slice(from, to + 1).map((d) => DAY_NAMES[d]),
    opens,
    closes,
  };
}

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "AutomotiveBusiness",
  "@id": `${BRAND.siteUrl}/#business`,
  name: BRAND.name,
  legalName: BRAND.legalName,
  description: HOME_DESCRIPTION,
  url: BRAND.siteUrl,
  telephone: BRAND.phoneDisplay,
  image: `${BRAND.siteUrl}${photoSrc(OG_ID, OG_WIDTH)}`,
  logo: `${BRAND.siteUrl}/logo-petty-shine.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: BRAND.street,
    addressLocality: BRAND.city,
    addressRegion: BRAND.state,
    postalCode: BRAND.zip,
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: BRAND.geo.lat,
    longitude: BRAND.geo.lng,
  },
  hasMap: BRAND.mapsUrl,
  openingHoursSpecification: BRAND.hoursSchema.map(openingHours),
  sameAs: [BRAND.facebook, BRAND.instagram],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
        {/* Backstop for the hidden resting state bug. Nothing on this site is
            supposed to server render an opacity:0 style, the Reveal primitive
            adds its pre animation state after mount instead. If any library
            slips one through anyway, this makes the content visible with
            JavaScript off rather than blank. */}
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-cyan-500 focus:px-4 focus:py-2 focus:text-shop-000"
        >
          Skip to content
        </a>

        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <StickyCallBar />

        {/* One delegated listener behind every tel: link on the site, so a
            call link a later page forgets to wire still reports. It calls the
            same trackPhoneClick as the per link handlers, and that function
            drops a repeat of the same conversion inside 1.5 seconds, so the
            overlap cannot double count. See src/lib/gtag.ts. */}
        <CtaClickTracking />

        {/* No gtag id, no Google script at all. See src/lib/gtag.ts. */}
        {GADS.googleTagId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GADS.googleTagId}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GADS.googleTagId}');${
                GADS.ga4Id ? `gtag('config','${GADS.ga4Id}');` : ""
              }`}
            </Script>
          </>
        )}

        {/* Modern Apex attribution rails, vendored at public/apex-attribution.js.

            The file returns on its first line when it has no data-token, by its
            own documented contract, so an untokenised tag was costing every
            visitor a 13,100 byte preload and fetch for a script that then did
            nothing. Same rule as the Google tag above: no id, no tag.

            Set NEXT_PUBLIC_APEX_FORM_TOKEN to the per client form token Modern
            Apex issues and the rails wire themselves up at the next build. That
            covers the heartbeat and tel: clicks on their own. FORM leads also
            need QuoteForm to call window.apexAttribution.attach({name, email,
            phone, message}) after its own Web3Forms post, which it does not do
            today. Nothing here blocks the form either way. */}
        {APEX_FORM_TOKEN && (
          <Script
            src={asset("/apex-attribution.js")}
            strategy="afterInteractive"
            data-token={APEX_FORM_TOKEN}
          />
        )}
      </body>
    </html>
  );
}
