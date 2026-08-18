import { cn } from "@/lib/utils";

/**
 * The signature motif: wide-tracked caps bracketed by two red rules,
 * lifted directly from the HD Auto Studio wordmark. Used as the eyebrow
 * on every major section so the whole site reads as one lockup.
 */
export default function RuleLabel({
  children,
  className,
  tone = "red",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "red" | "light";
}) {
  return (
    <span
      className={cn("rule-label", className)}
      style={
        tone === "light"
          ? ({ "--rule-color": "#ffffff" } as React.CSSProperties)
          : undefined
      }
    >
      <span>{children}</span>
    </span>
  );
}
