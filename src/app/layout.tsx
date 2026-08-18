import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Archivo, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { BRAND, SEO, GADS } from "@/lib/constants";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StickyCallBar from "@/components/layout/StickyCallBar";
import CtaClickTracking from "@/components/tracking/CtaClickTracking";
import StickyCTA from "@/components/fx/StickyCTA";
import { asset, IS_PREVIEW } from "@/lib/asset";

const display = Archivo({
  subsets: ["latin"],
  variable: "--font-display-raw",
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body-raw",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono-raw",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.siteUrl),
  title: {
    default: SEO.home.title,
    template: "%s | HD Auto Studio",
  },
  description: SEO.home.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BRAND.siteUrl,
    siteName: BRAND.name,
    title: SEO.home.title,
    description: SEO.home.description,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: BRAND.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.home.title,
    description: SEO.home.description,
    images: ["/og-image.jpg"],
  },
  // The subpath preview must never be indexed, canonicals already point at
  // the real domain, and an indexed preview would compete with it at launch.
  robots: IS_PREVIEW
    ? { index: false, follow: false, nocache: true }
    : { index: true, follow: true },
  icons: { icon: asset("/favicon.svg"), apple: asset("/logo-mark.png") },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
  width: "device-width",
  initialScale: 1,
};

/**
 * Organization + place data. AggregateRating is deliberately absent until
 * the real Google review count is verified, an invented rating is both a
 * structured-data violation and a trust problem.
 */
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "AutomotiveBusiness",
  "@id": `${BRAND.siteUrl}/#business`,
  name: BRAND.name,
  alternateName: BRAND.formerName,
  url: BRAND.siteUrl,
  telephone: BRAND.phoneDisplay,
  email: BRAND.email,
  image: `${BRAND.siteUrl}/logo-hd-auto-studio.png`,
  logo: `${BRAND.siteUrl}/logo-hd-auto-studio.png`,
  priceRange: "$$",
  foundingDate: String(BRAND.founded),
  founder: { "@type": "Person", name: BRAND.owner },
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
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
  ],
  sameAs: [BRAND.facebook, BRAND.mapsUrl],
  areaServed: [
    "Whitmore Lake",
    "Ann Arbor",
    "Brighton",
    "South Lyon",
    "Pinckney",
    "Hamburg",
    "Dexter",
    "Howell",
    "Northfield Township",
  ].map((name) => ({ "@type": "City", name, addressRegion: "MI" })),
  makesOffer: [
    { name: "Automotive Window Tinting", price: 125 },
    { name: "Ceramic Window Tint", price: 175 },
    { name: "Paint Protection Film", price: 1200 },
    { name: "Ceramic Coating", price: 900 },
    { name: "Paint Correction", price: 500 },
    { name: "Auto Detailing", price: 200 },
  ].map((o) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name: o.name },
    priceCurrency: "USD",
    price: o.price,
    priceSpecification: {
      "@type": "PriceSpecification",
      minPrice: o.price,
      priceCurrency: "USD",
    },
  })),
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        {/* The hero entrances are framer-motion, which server renders an
            opacity:0 inline style. Without JS that copy would never appear. */}
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-red focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <StickyCallBar />
        <StickyCTA />
        {/* bottom bar clearance on mobile */}
        <div className="h-[58px] lg:hidden" aria-hidden />
        <CtaClickTracking />

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

        {/* Modern Apex attribution rails, additive, never blocks the form */}
        <Script src={asset("/apex-attribution.js")} strategy="afterInteractive" />
      </body>
    </html>
  );
}
