import { BRAND, CITIES } from "@/lib/constants";

/**
 * Service node tied back to the business @id declared in the root layout.
 *
 * Deliberately minimal: no aggregateRating, because a rating a business
 * marks up about itself is ineligible, and no FAQPage, because it no
 * longer earns a result. What still works is the entity graph and the
 * BreadcrumbList the Breadcrumbs primitive emits.
 *
 * areaServed is derived from CITIES rather than typed. The previous
 * version of this file listed seven Michigan towns, which is exactly the
 * template leak this rebuild exists to remove.
 *
 * `price` takes a raw starting price straight from constants, never a
 * formatted string, and is omitted entirely for a service with no
 * published price. Do not invent one to fill the field.
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
  /** site relative, with the trailing slash, for example "/ceramic-coating/" */
  url: string;
  /** published starting price, omitted when nothing is published */
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
    areaServed: CITIES.map((c) => ({
      "@type": "City",
      name: c.name,
      addressRegion: BRAND.state,
    })),
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

export { ServiceSchema };
