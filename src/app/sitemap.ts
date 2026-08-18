import type { MetadataRoute } from "next";

export const dynamic = "force-static";
import { BRAND, CITIES } from "@/lib/constants";

const STATIC: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, freq: "weekly" },
  { path: "/window-tinting/", priority: 0.95, freq: "monthly" },
  { path: "/ceramic-window-tint/", priority: 0.95, freq: "monthly" },
  { path: "/paint-protection-film/", priority: 0.9, freq: "monthly" },
  { path: "/ceramic-coating/", priority: 0.9, freq: "monthly" },
  { path: "/paint-correction/", priority: 0.85, freq: "monthly" },
  { path: "/auto-detailing/", priority: 0.85, freq: "monthly" },
  { path: "/llumar-window-film/", priority: 0.8, freq: "yearly" },
  { path: "/pricing/", priority: 0.9, freq: "monthly" },
  { path: "/warranties/", priority: 0.7, freq: "yearly" },
  { path: "/residential-window-film/", priority: 0.75, freq: "monthly" },
  { path: "/commercial-window-film/", priority: 0.75, freq: "monthly" },
  { path: "/services/", priority: 0.7, freq: "monthly" },
  { path: "/areas/", priority: 0.7, freq: "monthly" },
  { path: "/gallery/", priority: 0.7, freq: "monthly" },
  { path: "/reviews/", priority: 0.7, freq: "weekly" },
  { path: "/about/", priority: 0.6, freq: "yearly" },
  { path: "/contact/", priority: 0.8, freq: "yearly" },
  { path: "/faq/", priority: 0.6, freq: "monthly" },
  { path: "/quote/", priority: 0.85, freq: "yearly" },
  { path: "/privacy-policy/", priority: 0.2, freq: "yearly" },
  { path: "/terms/", priority: 0.2, freq: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...STATIC.map((s) => ({
      url: `${BRAND.siteUrl}${s.path}`,
      lastModified: now,
      changeFrequency: s.freq,
      priority: s.priority,
    })),
    ...CITIES.map((c) => ({
      url: `${BRAND.siteUrl}/window-tinting/${c.slug}/`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ];
}
