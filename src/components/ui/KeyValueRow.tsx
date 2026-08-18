import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import "./primitives.css";

export type KeyValueTone = "default" | "pewter" | "cyan";

export interface KeyValueRowProps {
  /** the key, left column */
  k: ReactNode;
  /** the value, right column */
  v: ReactNode;
  /**
   * Is this value a sourced fact?
   *
   * DEFAULTS TO TRUE, which is the opposite of what the `?` usually
   * implies, and it is deliberate. Almost everything this component
   * renders is a published number: a price, a coverage line, a film
   * spec, a warranty term, the address, the hours. Those are set in
   * IBM Plex Mono with tabular figures and hard right alignment,
   * because on this site mono means a real sourced fact.
   *
   * PASS mono={false} FOR A SENTENCE. A prose value gets the body face
   * and a left aligned column, because a ragged left paragraph is close
   * to unreadable and because the type rules forbid mono paragraphs.
   * Every value in GTECHNIQ_FACTS.guaranteeTerms and NC_TINT_LAW.rows
   * is a sentence, so those tables pass mono={false}.
   */
  mono?: boolean;
  /**
   * "pewter" carries every honest negative: not included, quoted on
   * your vehicle, confirmed at consultation. Never red, never warning
   * yellow. "cyan" is for a value that is itself a link.
   */
  tone?: KeyValueTone;
  /** overrides the layout that `mono` would pick */
  layout?: "figure" | "prose";
  /** small mono line under the key. Built for statute citations. */
  note?: string;
  /** heavier treatment, for a total or a featured tier */
  strong?: boolean;
  className?: string;
  id?: string;
}

/**
 * THE WORKHORSE.
 *
 * Every price table, coverage list, spec table and warranty term on this
 * site is one of these. Key on the left, value hard right with tabular
 * figures, a hairline between rows.
 *
 * It reads every colour from the plane's CSS variables rather than
 * hardcoding them, so the identical row renders warm specular white on
 * near black inside a .plane-shop section and near black on paper
 * inside a .plane-sheet section, with no prop and no branch. A paper
 * panel nested inside a dark band works too, because the variables
 * resolve from the nearest plane ancestor.
 *
 * Wrap a run of rows in <KeyValueList> for the closing hairline and the
 * mobile overflow guard.
 */
export default function KeyValueRow({
  k,
  v,
  mono = true,
  tone = "default",
  layout,
  note,
  strong = false,
  className,
  id,
}: KeyValueRowProps) {
  const shape = layout ?? (mono ? "figure" : "prose");

  return (
    <div
      id={id}
      className={cn(
        "kv",
        shape === "prose" && "kv--prose",
        tone !== "default" && `kv--${tone}`,
        strong && "kv--strong",
        className
      )}
    >
      <span className="kv__k">
        {k}
        {note ? <span className="kv__note">{note}</span> : null}
      </span>
      <span className={cn("kv__v", mono && "kv__v--mono")}>{v}</span>
    </div>
  );
}

/**
 * The container for a run of rows. Adds the opening hairline so a table
 * is closed at both ends, and carries the min-width:0 that stops a wide
 * row inflating its own grid parent past the viewport on a phone.
 */
export function KeyValueList({
  children,
  capped = true,
  className,
  id,
  label,
}: {
  children: ReactNode;
  /** hairline above the first row */
  capped?: boolean;
  className?: string;
  id?: string;
  /** accessible name, when the list is a table of something specific */
  label?: string;
}) {
  return (
    <div
      id={id}
      role={label ? "group" : undefined}
      aria-label={label}
      className={cn("kv-list", capped && "kv-list--capped", className)}
    >
      {children}
    </div>
  );
}

export { KeyValueRow };
