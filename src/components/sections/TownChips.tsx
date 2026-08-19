import Link from "next/link";

import "./flagship.css";

import { CITIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * THE TOWN CHIPS.
 *
 * Sixteen measured towns as a cloud of real links into their own
 * pages, with the measured minutes riding on each chip. The first
 * build printed all sixteen as key and value rows on the home page,
 * which was five hundred pixels of table on a phone; the full table
 * with miles and routes still lives on /areas/ and on each town's own
 * page, which is where somebody comparing drive times actually is.
 *
 * The internal links keep their descriptive anchors: town name plus
 * measured minutes is exactly what the town page answers.
 */
export default function TownChips({
  className,
  slugs,
}: {
  className?: string;
  /** limit to these town slugs, in CITIES order. Omit for all sixteen. */
  slugs?: readonly string[];
}) {
  const towns = slugs ? CITIES.filter((c) => slugs.includes(c.slug)) : CITIES;
  return (
    <ul className={cn("towns", className)}>
      {towns.map((c) => (
        <li key={c.slug} className="min-w-0">
          <Link
            href={`/areas/${c.slug}/`}
            className="towns__chip"
            aria-label={`${c.name}, ${c.minutes} minutes from the shop`}
          >
            {c.name}
            <span className="towns__min" aria-hidden="true">
              {c.minutes} min
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export { TownChips };
