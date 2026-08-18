import { BRAND } from "@/lib/constants";

/**
 * Service node tied back to the business @id declared in the root layout.
 * Deliberately minimal: no aggregateRating (self-serving ratings are
 * ineligible for stars), no FAQPage (deprecated May 2026). The parts that
 * still do work are the entity graph and BreadcrumbList.
 */
export default function ServiceSchema({
  name,
  description,
  url,
  price,
  serviceType,
}: {
  name: string;
  description: string;
  url: string;
  price?: number;
  serviceType?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType: serviceType ?? name,
    url: `${BRAND.siteUrl}${url}`,
    provider: { "@id": `${BRAND.siteUrl}/#business` },
    areaServed: [
      "Whitmore Lake",
      "Ann Arbor",
      "Brighton",
      "South Lyon",
      "Pinckney",
      "Hamburg",
      "Dexter",
    ].map((n) => ({ "@type": "City", name: n, addressRegion: "MI" })),
    ...(price
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "USD",
            price,
            priceSpecification: {
              "@type": "PriceSpecification",
              minPrice: price,
              priceCurrency: "USD",
            },
            availableAtOrFrom: { "@id": `${BRAND.siteUrl}/#business` },
          },
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
