import RuleLabel from "./RuleLabel";
import { cn } from "@/lib/utils";

export function Section({
  children,
  tone = "paper",
  width = "site",
  className,
  id,
}: {
  children: React.ReactNode;
  tone?: "paper" | "paper-2" | "wall";
  width?: "site" | "wide" | "tight";
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "section scroll-mt-24",
        tone === "paper-2" && "bg-paper-2",
        tone === "wall" && "on-wall",
        className
      )}
    >
      <div
        className={cn(
          width === "wide" && "container-wide",
          width === "site" && "container-site",
          width === "tight" && "container-tight"
        )}
      >
        {children}
      </div>
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  intro,
  tone = "dark",
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  tone?: "dark" | "light";
  align?: "left" | "split";
  className?: string;
}) {
  if (align === "split") {
    return (
      <div className={cn("grid gap-8 md:grid-cols-12 md:items-end", className)}>
        <div className="md:col-span-7">
          {eyebrow && <RuleLabel tone={tone === "light" ? "light" : "red"}>{eyebrow}</RuleLabel>}
          <h2 className={cn("display-lg", eyebrow && "mt-6")}>{title}</h2>
        </div>
        {intro && (
          <div
            className={cn(
              "leading-relaxed md:col-span-5",
              tone === "light" ? "text-light-2" : "text-muted"
            )}
          >
            {intro}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow && <RuleLabel tone={tone === "light" ? "light" : "red"}>{eyebrow}</RuleLabel>}
      <h2 className={cn("display-md", eyebrow && "mt-6")}>{title}</h2>
      {intro && (
        <div
          className={cn(
            "mt-4 leading-relaxed",
            tone === "light" ? "text-light-2" : "text-muted"
          )}
        >
          {intro}
        </div>
      )}
    </div>
  );
}

/** Long-form body copy with consistent rhythm. */
export function Prose({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl space-y-5 leading-relaxed text-body [&_a]:link-underline [&_h3]:pt-3 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-bold [&_h3]:uppercase [&_h3]:tracking-tight [&_h3]:text-ink-text [&_strong]:font-semibold [&_strong]:text-ink-text",
        className
      )}
    >
      {children}
    </div>
  );
}
