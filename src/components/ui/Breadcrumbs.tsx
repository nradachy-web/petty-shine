import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BRAND } from "@/lib/constants";

export interface Crumb {
  label: string;
  href: string;
}

/**
 * Breadcrumbs, with BreadcrumbList JSON-LD. Worth shipping: breadcrumb is
 * one of the few structured-data types in this vertical that still earns
 * a live rich result in 2026 (FAQPage and self-serving review stars do not).
 */
export default function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  const full = [{ label: "Home", href: "/" }, ...trail];

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
    <nav aria-label="Breadcrumb" className="border-b border-line bg-paper-2">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ol className="container-wide flex flex-wrap items-center gap-1 py-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">
        {full.map((c, i) => (
          <li key={c.href} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3 w-3 text-line" aria-hidden />}
            {i === full.length - 1 ? (
              <span className="text-ink-text">{c.label}</span>
            ) : (
              <Link href={c.href} className="transition-colors hover:text-red">
                {c.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
