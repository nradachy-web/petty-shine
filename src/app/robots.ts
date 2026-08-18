import type { MetadataRoute } from "next";

export const dynamic = "force-static";
import { BRAND } from "@/lib/constants";
import { IS_PREVIEW } from "@/lib/asset";

/**
 * robots.txt
 *
 * TWO BUILDS, TWO ANSWERS.
 *
 * The GitHub Pages preview serves the whole site from a subpath, which makes
 * it a complete second copy of pettyshine.com on a different host. Indexed,
 * it would compete with the real domain on the day of the cutover, and the
 * page canonicals all point at the real domain, which is a mixed signal
 * rather than a fix. So the preview disallows everything and advertises no
 * sitemap at all: there is nothing on it a crawler should be reading.
 *
 * IS_PREVIEW is derived from NEXT_PUBLIC_BASE_PATH in src/lib/asset.ts, the
 * same switch that rewrites raw asset URLs, so the two can never disagree
 * about which build this is.
 *
 * On the real build:
 *   /thank-you/  is disallowed. It is the post submit page, it carries its
 *                own noindex, and an indexed thank you page collects search
 *                traffic that never saw the form and reports a conversion
 *                that never happened.
 * Everything else is open. There is nothing on this site worth hiding, and
 * the sitemap lists only finished, indexable pages.
 */
export default function robots(): MetadataRoute.Robots {
  if (IS_PREVIEW) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/thank-you/"] }],
    sitemap: `${BRAND.siteUrl}/sitemap.xml`,
    host: BRAND.siteUrl,
  };
}
