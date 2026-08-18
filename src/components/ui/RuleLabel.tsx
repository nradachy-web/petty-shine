import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import "./primitives.css";

export type RuleLabelTone = "default" | "strong" | "quiet" | "accent";

/**
 * The mono caps label. IBM Plex Mono, uppercase, wide tracking.
 *
 * This is the sourced fact voice: eyebrows, captions, metadata, the
 * address, hours, citations. It never sets a paragraph, a heading, a
 * review quote, or the About section.
 *
 * Colour comes from the plane, so the same label reads correctly on
 * near black and on paper with no prop. The "accent" tone resolves to
 * the plane's link colour, which is cyan-ink on paper, because
 * cyan-500 is 2.2:1 against the sheet and fails outright.
 */
export default function RuleLabel({
  children,
  tone = "default",
  className,
  id,
}: {
  children: ReactNode;
  tone?: RuleLabelTone;
  className?: string;
  id?: string;
}) {
  return (
    <span
      id={id}
      className={cn(
        "ps-rule-label",
        tone !== "default" && `ps-rule-label--${tone}`,
        className
      )}
    >
      {children}
    </span>
  );
}

export { RuleLabel };
