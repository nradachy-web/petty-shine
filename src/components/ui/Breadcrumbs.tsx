import Link from "next/link";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";
import "./primitives.css";

export interface Crumb {
  label: string;
  /** always with a trailing slash */
  href: string;
}

/**
 * Breadcrumbs, with BreadcrumbList JSON-LD.
 *
 * Worth shipping when almost no structured data is: breadcrumb is one
 * of the few types in this vertical that still earns a live rich result
 * in 2026. FAQPage lost its treatment, and self serving aggregateRating
 * on your own site is ineligible, which is why his 4.9 does not get
 * marked up anywhere on this build.
 *
 * Renders on whichever plane it sits in, so it works under a dark hero
 * or on paper without a prop.
 */
export default function Breadcrumbs({
  trail,
  plane,
  className,
}: {
  trail: Crumb[];
  /** forces a plane. Omit to inherit from the section above. */
  plane?: "shop" | "sheet";
  className?: string;
}) {
  const full: Crumb[] = [{ label: "Home", href: "/" }, ...trail];

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: full.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: `${BRAND.siteUrl}${c.href}`,
    })),
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "crumbs",
        plane === "shop" && "plane-shop",
        plane === "sheet" && "plane-sheet",
        className
      )}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ol className="ps-shell crumbs__list">
        {full.map((c, i) => {
          const last = i === full.length - 1;
          return (
            <li key={c.href} className="crumbs__item">
              {i > 0 ? (
                <span className="crumbs__sep" aria-hidden="true">
                  /
                </span>
              ) : null}
              {last ? (
                <span className="crumbs__current" aria-current="page">
                  {c.label}
                </span>
              ) : (
                <Link href={c.href} className="crumbs__link">
                  {c.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export { Breadcrumbs };
