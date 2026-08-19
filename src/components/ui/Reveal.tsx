"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useEnterOnce } from "./useEnterOnce";
import "./primitives.css";

/**
 * The safe scroll reveal.
 *
 * READ THIS BEFORE HAND ROLLING MOTION ANYWHERE ON THIS SITE.
 *
 * `initial={{opacity:0}}` plus `whileInView` plus `viewport={{once:true}}`
 * server renders `style="opacity:0"` into the static HTML. The content
 * then exists only if one IntersectionObserver callback fires. On the
 * previous build that hid every coating tier and its price on the page
 * whose only job was quoting them, and it shipped that way for weeks
 * because it looks fine in a browser with working JavaScript.
 *
 * This component renders its children visible. The pre-animation state
 * is ADDED by JS in a layout effect, before paint so there is no flash,
 * and removed on intersect. Under prefers-reduced-motion it does nothing
 * at all. See useEnterOnce.ts for the full failure table.
 *
 * Verify by loading any page with JavaScript disabled: every price, every
 * coverage line and every warranty term must be on the screen.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
  id,
}: {
  children: ReactNode;
  /** seconds */
  delay?: number;
  className?: string;
  id?: string;
}) {
  const ref = useEnterOnce<HTMLDivElement>("data-ps-reveal", delay);
  return (
    <div id={id} ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * Staggers its direct children off a single observer, so a row of tiers
 * reads as one gesture rather than six. The per child delay is pure CSS
 * nth-child, so there is no index bookkeeping in the DOM and no risk of
 * a child being left behind in the hidden state.
 */
export function RevealGroup({
  children,
  className,
  id,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  /**
   * The element the group renders as. A grid that is semantically a
   * list stays a real <ul> or <ol> and still gets the stagger, instead
   * of being wrapped in a div that would either break the markup or
   * stagger a single child.
   */
  as?: "div" | "ul" | "ol" | "dl";
}) {
  const ref = useEnterOnce<HTMLElement>("data-ps-reveal");
  return (
    <Tag
      id={id}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={cn("ps-reveal-group", className)}
    >
      {children}
    </Tag>
  );
}

/**
 * A direct child of RevealGroup. Purely structural, the parent drives the
 * motion. Kept so a group can wrap fragments without losing the stagger.
 */
export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export { Reveal };
