import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import DatumRule from "./DatumRule";
import PlaneGuard from "./PlaneGuard";
import "./primitives.css";

export type Plane = "shop" | "sheet";
export type SectionWidth = "tight" | "site" | "wide" | "full";

export interface SectionProps {
  /**
   * "shop" is near black and warm. His photography lives there and it
   * is where the site is proud. "sheet" is cool off white paper. Every
   * price, product name, coverage line and warranty term lives there
   * and it is where the site is trusted.
   *
   * You scroll between them: evidence, then specification, then
   * evidence, then specification. The rhythm is the argument.
   */
  plane: Plane;
  /** mono caps label riding on the section's opening datum rule */
  label?: string;
  children: ReactNode;
  /**
   * "full" removes the max width and the gutter, which is what a bleed
   * Plate needs to reach the real edge of the screen.
   */
  width?: SectionWidth;
  /** vertical rhythm. "flush" for a section that owns its own spacing. */
  rhythm?: "default" | "snug" | "flush";
  id?: string;
  className?: string;
  /** classes on the inner shell rather than the plane */
  innerClassName?: string;
  /** accessible name, when a section is a real landmark */
  ariaLabel?: string;
  ariaLabelledBy?: string;
}

/**
 * Vertical rhythm, plane, and the opening datum rule. Every band on
 * this site is one of these.
 *
 * The plane class is what publishes the colour variables that every
 * other primitive reads, so a KeyValueRow, a Plate frame or a
 * PriceFigure dropped anywhere inside gets the right colours with no
 * prop passed to it.
 */
export default function Section({
  plane,
  label,
  children,
  width = "site",
  rhythm = "default",
  id,
  className,
  innerClassName,
  ariaLabel,
  ariaLabelledBy,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={cn(
        "ps-section",
        plane === "shop" ? "plane-shop" : "plane-sheet",
        rhythm === "snug" && "ps-section--snug",
        rhythm === "flush" && "ps-section--flush",
        className
      )}
    >
      {process.env.NODE_ENV !== "production" ? <PlaneGuard plane={plane} /> : null}
      <div
        className={cn(
          "ps-shell",
          width === "tight" && "ps-shell--tight",
          width === "wide" && "ps-shell--wide",
          width === "full" && "ps-shell--full",
          innerClassName
        )}
      >
        {label ? <DatumRule label={label} className="mb-8 md:mb-11" /> : null}
        {children}
      </div>
    </section>
  );
}

/**
 * A section's opening block: display heading, optional intro. The
 * eyebrow lives on the Section's own datum rule, not here, so a section
 * never carries two competing labels.
 */
export function SectionHead({
  title,
  intro,
  size = "lg",
  align = "stack",
  id,
  className,
}: {
  title: ReactNode;
  intro?: ReactNode;
  size?: "xl" | "lg" | "md";
  /** "split" puts the intro in a second column on desktop */
  align?: "stack" | "split";
  id?: string;
  className?: string;
}) {
  const heading = (
    <h2 id={id} className={cn("ps-display", `ps-display-${size}`)}>
      {title}
    </h2>
  );

  if (align === "split") {
    return (
      <div className={cn("grid gap-7 md:grid-cols-12 md:items-end", className)}>
        <div className="md:col-span-7">{heading}</div>
        {intro ? <div className="ps-prose md:col-span-5">{intro}</div> : null}
      </div>
    );
  }

  return (
    <div className={cn("max-w-3xl", className)}>
      {heading}
      {intro ? <div className="ps-prose mt-5">{intro}</div> : null}
    </div>
  );
}

/**
 * Long form body copy. Archivo, never mono: the type rules reserve mono
 * for sourced facts, so a paragraph is never set in it no matter how
 * technical the paragraph is.
 */
export function Prose({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div id={id} className={cn("ps-prose", className)}>
      {children}
    </div>
  );
}

/**
 * A plane inversion inside a section, for a paper panel sitting on the
 * dark plane or the reverse. It republishes the colour variables, so
 * every primitive inside flips with it.
 */
export function PlanePanel({
  plane,
  children,
  className,
  id,
}: {
  plane: Plane;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={cn(
        plane === "shop" ? "plane-shop" : "plane-sheet",
        "min-w-0",
        className
      )}
      style={{ background: "var(--ps-ground)", color: "var(--ps-body)" }}
    >
      {children}
    </div>
  );
}

export { Section };
