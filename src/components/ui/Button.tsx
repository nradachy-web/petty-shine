import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import "./primitives.css";

export type ButtonTone = "cyan" | "ghost";

export interface ButtonProps {
  children: ReactNode;
  /**
   * Internal route (always with a trailing slash), or a tel:, sms: or
   * mailto: URL. Omit for a real <button>.
   */
  href?: string;
  /**
   * THE CYAN RULE, ABSOLUTE.
   *
   * cyan-500 appears only as a 1px rule, a stroke, a chip border, a
   * small mark, and EXACTLY ONE SOLID BUTTON PER SCREEN. Never a
   * background wash, never a gradient, never body text. Cyan at real
   * surface area turns this into a car wash chain instantly.
   *
   * So tone="cyan" goes on a page's single primary action and nothing
   * else. Every other action on the screen is tone="ghost".
   */
  tone?: ButtonTone;
  block?: boolean;
  size?: "md" | "sm";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  id?: string;
  onClick?: () => void;
  "aria-label"?: string;
}

/**
 * The only button on this site.
 *
 * There is no shadow, no radius and no gradient on it, because there is
 * no shadow, radius or gradient anywhere in this design. A solid cyan
 * rectangle with near black caps is the whole thing.
 *
 * tel: links go out as a plain anchor so the delegated listener in
 * components/tracking/CtaClickTracking.tsx picks up the click and fires
 * the Google Ads call conversion. His account has no website call
 * conversion at all today, so that listener is the most valuable thing
 * on the site and nothing here may swallow its click.
 */
export default function Button({
  children,
  href,
  tone = "ghost",
  block = false,
  size = "md",
  type = "button",
  disabled = false,
  className,
  id,
  onClick,
  "aria-label": ariaLabel,
}: ButtonProps) {
  const classes = cn(
    "ps-btn",
    `ps-btn--${tone}`,
    block && "ps-btn--block",
    size === "sm" && "ps-btn--sm",
    className
  );

  if (href && !disabled) {
    const external = /^(tel:|sms:|mailto:|https?:)/.test(href);
    if (external) {
      return (
        <a id={id} href={href} className={classes} aria-label={ariaLabel}>
          {children}
        </a>
      );
    }
    return (
      <Link id={id} href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button
      id={id}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classes}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

export { Button };
