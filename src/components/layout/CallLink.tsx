"use client";

import { BRAND } from "@/lib/constants";
import { trackCall } from "./callTracking";

/**
 * A tel: link that reports the click. Exists so the Footer can stay a server
 * component and ship no JavaScript beyond this one anchor.
 */
export default function CallLink({
  placement,
  className,
  children,
  "aria-label": ariaLabel,
}: {
  placement: string;
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
}) {
  return (
    <a
      href={`tel:${BRAND.phoneTel}`}
      onClick={() => trackCall(placement)}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
