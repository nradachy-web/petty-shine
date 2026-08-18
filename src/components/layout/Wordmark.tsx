import { cn } from "@/lib/utils";

/**
 * THE PETTY SHINE LOCKUP.
 *
 * Built, not shipped as a PNG. The reasoning is in the report, the short
 * version is three things:
 *
 * 1. The PNG in /public is the white background website version, and RECON
 *    calls it "the odd one out". His real, physical brand is the shop banner:
 *    cyan wordmark with a fine silver outline, a heavy cyan swoosh with a
 *    thinner pewter arc nested inside it, all on black. This draws that.
 * 2. Colour has to change per plane. On the paper plane cyan-500 is 2.2:1 and
 *    fails outright, so the type has to become cyan-ink there. A PNG cannot do
 *    that. This can, and it is the only reason the mark is legible on paper.
 * 3. Sharpness and weight. Roughly 1KB of inline SVG against a 56KB PNG, and
 *    razor sharp at any pixel ratio.
 *
 * Robustness note: the wordmark uses textLength + lengthAdjust, so the lockup
 * occupies exactly the same box whether or not Archivo, its italics, or its
 * width axis have loaded. There is no reflow and no wrong size, worst case is
 * a slightly different grotesk squeezed into the identical footprint.
 *
 * Every colour carries a literal hex fallback so the mark can never render
 * invisible if a theme token is renamed.
 */

const CYAN = "var(--color-cyan-500, #00C1F3)";
const CYAN_INK = "var(--color-cyan-ink, #006B93)";
const PEWTER = "var(--color-pewter, #9BA7AE)";

/** Widths in CSS pixels. Height is always 30% of width (viewBox 400 x 120). */
const SIZES = {
  sm: 124,
  md: 150,
  lg: 226,
  xl: 312,
} as const;

export type WordmarkSize = keyof typeof SIZES;

export default function Wordmark({
  size = "md",
  plane = "shop",
  decorative = false,
  className,
}: {
  size?: WordmarkSize;
  /** Which plane the mark is sitting on. Drives the type colour. */
  plane?: "shop" | "sheet";
  /** True when a parent link already carries the accessible name. */
  decorative?: boolean;
  className?: string;
}) {
  const width = SIZES[size];
  const height = Math.round(width * 0.3);
  const onShop = plane === "shop";

  // The fine silver outline on his banner only reads at real size. Below the
  // large sizes it just muddies the counters, so it is dropped.
  const outline = onShop && (size === "lg" || size === "xl");

  return (
    <svg
      className={cn("block", className)}
      width={width}
      height={height}
      viewBox="0 0 400 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : "Petty Shine"}
      aria-hidden={decorative || undefined}
      focusable="false"
    >
      {/* The heavy swoosh. Two elliptical arcs, thick on the left and
          tapering to both tips, top limb longer than the bottom, exactly
          as it runs on the banner. */}
      <path
        d="M315.3 26.6 A174 52 0 1 0 263.7 105.9 L266.2 98.9 A158 44 0 1 1 313 31.7 Z"
        fill={CYAN}
      />
      {/* the thinner silver arc nested inside it */}
      <path
        d="M330 43.5 A150 36 0 1 0 242.4 94.2"
        fill="none"
        stroke={PEWTER}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <text
        x={118}
        y={86}
        textLength={264}
        lengthAdjust="spacingAndGlyphs"
        fill={onShop ? CYAN : CYAN_INK}
        stroke={outline ? PEWTER : undefined}
        strokeWidth={outline ? 1.1 : undefined}
        paintOrder="stroke"
        style={{
          fontFamily: "var(--font-display), Archivo, system-ui, sans-serif",
          fontSize: "58px",
          fontWeight: 800,
          fontStyle: "italic",
          fontStretch: "82%",
          letterSpacing: "-0.005em",
        }}
      >
        PETTY SHINE
      </text>
    </svg>
  );
}
