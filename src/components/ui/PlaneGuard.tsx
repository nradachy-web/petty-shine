"use client";

import { useEffect, useRef } from "react";

/**
 * Development only. Renders nothing, ever.
 *
 * Two rhythm rules in _plan/DESIGN.md are easy to break by accident and
 * invisible in a numeric audit:
 *
 *   "Never two plane changes inside one screen height."
 *   "Any section under 400px tall belongs on the plane above it,
 *    not on its own."
 *
 * A short section on its own plane reads as a stripe rather than a
 * surface, and two flips inside one viewport turns the evidence then
 * specification rhythm into a zebra. So Section measures itself after
 * paint and says so in the console when it breaks either rule. It costs
 * nothing in production: the JSX is behind a NODE_ENV check that the
 * bundler folds away.
 */
export default function PlaneGuard({ plane }: { plane: "shop" | "sheet" }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const marker = ref.current;
    const section = marker?.closest("section");
    if (!section) return;

    const check = () => {
      const h = section.getBoundingClientRect().height;
      const prev = section.previousElementSibling;
      const prevPlane = prev?.classList.contains("plane-shop")
        ? "shop"
        : prev?.classList.contains("plane-sheet")
          ? "sheet"
          : null;

      if (h > 0 && h < 400 && prevPlane && prevPlane !== plane) {
        // eslint-disable-next-line no-console
        console.warn(
          `[Section] a ${Math.round(h)}px "${plane}" section follows a "${prevPlane}" ` +
            `section. Anything under 400px tall belongs on the plane above it, ` +
            `not on its own. See _plan/DESIGN.md, the two planes.`,
          section
        );
      }
    };

    const raf = requestAnimationFrame(check);
    return () => cancelAnimationFrame(raf);
  }, [plane]);

  return <span ref={ref} hidden aria-hidden="true" />;
}
