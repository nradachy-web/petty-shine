import type { MetadataRoute } from "next";

export const dynamic = "force-static";
import { BRAND, CITIES } from "@/lib/constants";

/**
 * THE SITEMAP IS THE IA, WRITTEN DOWN.
 *
 * Two rules keep it honest:
 *
 *   1. A route only appears here once its page is real. Every page still
 *      carrying a placeholder comment also carries robots noindex, and a
 *      noindex page in a sitemap is a contradiction Search Console reports
 *      as an error. Add the line here in the same commit that deletes the
 *      placeholder.
 *   2. Nothing is listed that is not linked from the site itself.
 *
 * THE TOWN PAGES MOVED. They were generated at /window-tinting/<city>/,
 * inherited from a previous client whose business was tint led. Petty Shine's
 * paid demand is detailing, coating, film and dent repair, so a tint scoped
 * town page was pointing sixteen URLs at the wrong service. That directory is
 * deleted and the sixteen live at /areas/<city>/ , built from each town's own
 * measured road distance, drive time, county and route. They are generated
 * from CITIES below rather than typed, so the sitemap can never drift from
 * the routes the build actually emits.
 *
 * Routes deliberately absent, and why:
 *   /thank-you/            noindex, and robots.ts disallows it
 *   /ceramic-window-tint/  DELETED 2026-08-18. It was a leftover route from
 *                          the previous client's site. Judson publishes no
 *                          ceramic film line, so there was no honest page to
 *                          write. Nothing links to it and no old Duda URL
 *                          points at it, so it needs no redirect stub.
 *   the legacy stubs       /35468/ /my-post/ /blog/ /randleman-nc/ and the
 *                          four /paint-protection-<city>-nc/ URLs. Every one
 *                          of them is a noindex redirect stub for a dead Duda
 *                          URL, so none belongs in a sitemap.
 */
type Entry = {
  path: string;
  priority: number;
  freq: MetadataRoute.Sitemap[number]["changeFrequency"];
};

/**
 * Live pages. Every one of these is finished and indexable.
 *
 * Verified 2026-08-18 against the rendered output: each path below emits
 * robots "index, follow" and a self referencing canonical, and none carries
 * a placeholder. The service pages sat commented out under PENDING after
 * they were built, which kept /paint-protection-film/ and /ceramic-coating/
 * out of the sitemap. Those two are the account's largest and second largest
 * spend landing pages, so the omission was the most expensive line in this
 * file.
 */
const LIVE: Entry[] = [
  { path: "/quote/", priority: 0.9, freq: "yearly" },
  { path: "/services/", priority: 0.85, freq: "monthly" },
  { path: "/contact/", priority: 0.8, freq: "yearly" },
  { path: "/areas/", priority: 0.7, freq: "monthly" },
  { path: "/faq/", priority: 0.6, freq: "monthly" },
  { path: "/reviews/", priority: 0.5, freq: "monthly" },
  { path: "/warranties/", priority: 0.6, freq: "monthly" },
  { path: "/privacy-policy/", priority: 0.2, freq: "yearly" },
  { path: "/terms/", priority: 0.2, freq: "yearly" },
];

/**
 * The town pages, one per measured entry in CITIES. Derived, never typed,
 * so adding a seventeenth town to constants.ts adds its page and its
 * sitemap line in the same edit.
 */
const TOWNS: Entry[] = CITIES.map((c) => ({
  path: `/areas/${c.slug}/`,
  priority: 0.5,
  freq: "yearly" as const,
}));

/**
 * The home page and the nine service pages, in the order the ad account
 * cares about them. Priority tracks real spend and real search demand, not
 * taste: film and coating carry the most money, detailing carries the most
 * volume, and the rest follow the service index.
 */
const PAGES: Entry[] = [
  { path: "/", priority: 1, freq: "weekly" },
  { path: "/paint-protection-film/", priority: 0.95, freq: "monthly" },
  { path: "/ceramic-coating/", priority: 0.95, freq: "monthly" },
  { path: "/auto-detailing/", priority: 0.95, freq: "monthly" },
  { path: "/pricing/", priority: 0.9, freq: "monthly" },
  { path: "/window-tinting/", priority: 0.9, freq: "monthly" },
  { path: "/paint-correction/", priority: 0.85, freq: "monthly" },
  { path: "/interior-detailing/", priority: 0.8, freq: "monthly" },
  { path: "/paintless-dent-repair/", priority: 0.8, freq: "monthly" },
  { path: "/wheel-repair/", priority: 0.8, freq: "monthly" },
  { path: "/marine-detailing/", priority: 0.8, freq: "monthly" },
  { path: "/gallery/", priority: 0.7, freq: "monthly" },
  { path: "/about/", priority: 0.6, freq: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [...LIVE, ...PAGES, ...TOWNS].map((s) => ({
    url: `${BRAND.siteUrl}${s.path}`,
    lastModified: now,
    changeFrequency: s.freq,
    priority: s.priority,
  }));
}
