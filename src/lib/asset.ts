/**
 * Base path handling.
 *
 * Production serves at the domain root (www.pettyshine.com), so BASE is
 * empty and everything passes through untouched. The GitHub Pages *project*
 * preview serves from a subpath (/petty-shine), which Next's `basePath`
 * rewrites for <Link> and router navigation but NOT for raw asset URLs,
 * <img src>, <Script src>, favicons. Those go through asset().
 *
 * Set NEXT_PUBLIC_BASE_PATH="/petty-shine" for the preview build; unset it
 * (or set it empty) for the production build. Nothing else changes.
 */
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** True when this build is the subpath preview rather than the real site. */
export const IS_PREVIEW = BASE !== "";

export function asset(path: string): string {
  if (!path) return path;
  if (/^https?:\/\//.test(path)) return path;
  if (BASE && path.startsWith(BASE)) return path;
  return path.startsWith("/") ? `${BASE}${path}` : path;
}
