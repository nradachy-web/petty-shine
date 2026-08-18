import type { MetadataRoute } from "next";

export const dynamic = "force-static";
import { BRAND } from "@/lib/constants";
import { IS_PREVIEW } from "@/lib/asset";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: IS_PREVIEW
      ? [{ userAgent: "*", disallow: "/" }]
      : [{ userAgent: "*", allow: "/", disallow: ["/thank-you/"] }],
    sitemap: `${BRAND.siteUrl}/sitemap.xml`,
    host: BRAND.siteUrl,
  };
}
