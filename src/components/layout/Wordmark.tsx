import { cn } from "@/lib/utils";

/**
 * The HD Auto Studio lockup, set in type rather than shipped as an image:
 * heavy grotesk "HD" over wide-tracked "AUTO STUDIO", bracketed by the two
 * red rules from the shop's own mark. Crisp at any size, themeable, and
 * roughly 40KB lighter than the PNG.
 */
export default function Wordmark({
  className,
  tone = "dark",
  size = "md",
}: {
  className?: string;
  /** "dark" = ink type for light backgrounds, "light" = white type */
  tone?: "dark" | "light";
  size?: "sm" | "md" | "lg";
}) {
  const scale = {
    sm: { hd: "text-[1.45rem]", sub: "text-[0.4375rem]", gap: "gap-[3px]" },
    md: { hd: "text-[1.9rem]", sub: "text-[0.5rem]", gap: "gap-[4px]" },
    lg: { hd: "text-[3.25rem]", sub: "text-[0.8125rem]", gap: "gap-[7px]" },
  }[size];

  return (
    <span
      className={cn("inline-flex flex-col leading-none", scale.gap, className)}
      aria-label="HD Auto Studio"
    >
      <span
        className={cn(
          "font-display font-black tracking-[-0.045em]",
          scale.hd,
          tone === "light" ? "text-white" : "text-ink-text"
        )}
      >
        HD
      </span>
      <span className="block h-[2px] w-full bg-red" />
      <span
        className={cn(
          "font-display font-semibold uppercase leading-none tracking-[0.42em]",
          scale.sub,
          tone === "light" ? "text-white" : "text-ink-text"
        )}
      >
        Auto Studio
      </span>
      <span className="block h-[2px] w-full bg-red" />
    </span>
  );
}
