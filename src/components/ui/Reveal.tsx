"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

/**
 * Scroll-in reveals.
 *
 * The important property here is that the hidden state is NEVER server
 * rendered. An earlier version used framer-motion's `initial` + `whileInView`
 * with `once: true`, which shipped `opacity: 0` inline in the static HTML and
 * left the content dependent on one IntersectionObserver callback firing. If
 * JS failed, hydration stalled, or that single callback was missed, published
 * pricing simply never appeared.
 *
 * Now the markup renders visible, and JS *adds* the pre-animation state in a
 * layout effect (before paint, so there is no flash) then removes it when the
 * element scrolls in. Worst case for any failure is that content is visible
 * with no animation, which is the correct way round.
 */

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function useReveal<T extends HTMLElement>(delay = 0) {
  const ref = useRef<T>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion, and never hide content we cannot observe.
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    if (delay) el.style.setProperty("--reveal-delay", `${delay}s`);
    el.dataset.reveal = "pending";

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.dataset.reveal = "in";
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return ref;
}

export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  /** kept for API compatibility; distance is set in CSS */
  y?: number;
  className?: string;
}) {
  const ref = useReveal<HTMLDivElement>(delay);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * Staggers its children off a single observer, so a row of cards reads as one
 * gesture. The per-child delay is pure CSS (nth-child), which keeps the DOM
 * free of any index bookkeeping.
 */
export function RevealGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
  /** kept for API compatibility; cadence is set in CSS */
  stagger?: number;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`reveal-group ${className ?? ""}`}>
      {children}
    </div>
  );
}

/** A child of RevealGroup. Purely structural; the parent drives the motion. */
export function RevealItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
}) {
  return <div className={className}>{children}</div>;
}
