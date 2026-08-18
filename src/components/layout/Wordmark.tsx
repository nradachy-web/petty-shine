import { asset } from "@/lib/asset";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * THE PETTY SHINE LOCKUP.
 *
 * This ships HIS ACTUAL LOGO FILE. It used to be a hand drawn SVG
 * approximation, which Nick correctly rejected on 2026-08-18: the redraw
 * turned the open tapered crescent of the real mark into a closed oval ring
 * around the wordmark, which reads as a generic dealer badge rather than as
 * Petty Shine.
 *
 * The redraw was justified at the time on the grounds that cyan-500 measures
 * 2.2:1 on the paper plane and a PNG cannot recolour itself. That reasoning
 * was wrong twice. WCAG exempts logotypes from contrast minimums outright, and
 * in practice the mark is only ever placed on the dark plane anyway: the
 * Navbar and the Footer are the only two callers and both are shop plane.
 *
 * A client's logo is their logo. If it ever has to sit on paper, put it on a
 * dark plate rather than redrawing it, because the mark carries white inside
 * the crescent and in the outline of the type, and both vanish on the sheet.
 *
 * SOURCE FILE: public/logo-petty-shine.png, 400x189, transparent, lifted from
 * his own site. public/logo-petty-shine@2x.png is the 800x378 upscale.
 * Both are soft at the largest size. See _plan/RECON.md, a real vector or a
 * higher resolution original is an open ask for Judson.
 */

/** Widths in CSS pixels. The source art is 400x189, so height is 47.25%. */
const SIZES = {
  sm: 124,
  md: 150,
  lg: 200,
  xl: 260,
} as const;

const RATIO = 189 / 400;

export type WordmarkSize = keyof typeof SIZES;

export default function Wordmark({
  size = "md",
  decorative = false,
  className,
}: {
  size?: WordmarkSize;
  /** True when a parent link already carries the accessible name. */
  decorative?: boolean;
  className?: string;
  /**
   * Accepted and ignored. Kept so existing callers keep compiling. The mark is
   * only placed on the shop plane, see the note above.
   */
  plane?: "shop" | "sheet";
}) {
  const width = SIZES[size];
  const height = Math.round(width * RATIO);

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={asset("/logo-petty-shine.png")}
      srcSet={`${asset("/logo-petty-shine.png")} 1x, ${asset(
        "/logo-petty-shine@2x.png"
      )} 2x`}
      width={width}
      height={height}
      alt={decorative ? "" : BRAND.name}
      aria-hidden={decorative || undefined}
      decoding="async"
      className={cn("block h-auto", className)}
      style={{ width, height }}
    />
  );
}
