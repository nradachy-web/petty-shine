import type { NextConfig } from "next";

/**
 * Petty Shine — static export.
 *
 * Production target is GitHub Pages at the domain root
 * (www.pettyshine.com): no basePath, and public/CNAME written by the
 * deploy workflow.
 *
 * The pre-launch preview is a GitHub Pages *project* page served from
 * /petty-shine, so set NEXT_PUBLIC_BASE_PATH="/petty-shine" for that
 * build. Raw asset URLs go through asset() in src/lib/asset.ts, since
 * basePath does not rewrite those.
 *
 * Images are pre-rendered to AVIF + WebP at four widths at build-prep time
 * (scripts/process-photos.py); with output: "export" the built-in optimizer
 * is unavailable anyway.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
