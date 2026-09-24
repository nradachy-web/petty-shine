import PhoneLink from "@/components/tracking/PhoneLink";
import QuoteLink from "@/components/ui/QuoteLink";
import { asset } from "@/lib/asset";
import { BRAND, PANEL_LABELS, PPF_PACKAGES, type PpfPackage } from "@/lib/constants";
import { cn } from "@/lib/utils";
import "./packages.css";

/* ============================================================================
   THE FOUR COVERAGE LEVELS, one row each. Added 2026-09-23.

   Judson's old page did this with a stock 3D render per package, the covered
   panels tinted blue, and the list beside it. That is the right idea for a
   film page: a buyer wants to see WHERE the film goes before they read what
   it costs. This is the same idea done properly.

   THE PICTURES are one studio illustration of a generic coupe, rendered
   once and then tinted four times so the car, the angle, the light and the
   floor never change between rows and only the cyan does. It is an
   illustration of coverage, captioned as one, and it is not a customer's
   car: the real film work is in the photographs further down the page and
   in the gallery.

   EVERY WORD comes out of PPF_PACKAGES and PANEL_LABELS. Adding a fifth
   level to constants.ts adds a fifth row here with its own picture slot.
   ========================================================================== */

const WIDTHS = [640, 960, 1200] as const;
const SIZES = "(min-width: 1024px) 50vw, 100vw";

function srcSet(id: string, ext: "avif" | "webp") {
  return WIDTHS.map((w) => `${asset(`/ppf/${id}-${w}.${ext}`)} ${w}w`).join(", ");
}

function labels(ids: readonly string[]): string[] {
  return ids.map((id) => PANEL_LABELS[id as keyof typeof PANEL_LABELS]);
}

/** "Front bumper, hood and mirrors" */
function list(ids: readonly string[]): string {
  const names = labels(ids).map((n) => n.toLowerCase());
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

function Row({ pkg, index }: { pkg: PpfPackage; index: number }) {
  const n = String(index + 1).padStart(2, "0");
  const flipped = index % 2 === 1;
  return (
    <li className={cn("ppk", flipped && "ppk--flip")}>
      <figure className="ppk__media">
        <picture>
          <source type="image/avif" srcSet={srcSet(pkg.id, "avif")} sizes={SIZES} />
          <source type="image/webp" srcSet={srcSet(pkg.id, "webp")} sizes={SIZES} />
          <img
            src={asset(`/ppf/${pkg.id}-960.webp`)}
            width={1200}
            height={834}
            alt={`Coverage illustration for ${pkg.name}: ${list(pkg.panels)} shown in cyan on a white coupe`}
            loading="lazy"
            decoding="async"
          />
        </picture>
        <figcaption className="ppk__caption">
          {n} / {pkg.name}
        </figcaption>
      </figure>

      <div className="ppk__body">
        <p className="ppk__eyebrow">
          Level {n} of {String(PPF_PACKAGES.length).padStart(2, "0")}
        </p>
        <h3 className="ps-display ps-display-md ppk__name">{pkg.name}</h3>
        <p className="ppk__lead">
          {pkg.addsOver
            ? `Everything in ${pkg.addsOver}, plus the ${list(pkg.addedPanels)}. `
            : `The ${list(pkg.panels)}. `}
          {pkg.bestFor}
          {pkg.note ? ` ${pkg.note}` : ""}
        </p>

        <p className="ppk__label">This level covers</p>
        <ul className="ppk__panels">
          {labels(pkg.panels).map((name, i) => (
            <li key={name} className={cn("ppk__panel", i >= pkg.panels.length - pkg.addedPanels.length && pkg.addsOver && "is-added")}>
              <svg className="ppk__check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              {name}
            </li>
          ))}
        </ul>

        <p className="ppk__terms">
          The exact film and its warranty are confirmed for your vehicle with your quote, before any work starts.
        </p>

        <div className="ppk__actions">
          <QuoteLink service="ppf" package={pkg.id} ariaLabel={`Get a free quote, ${pkg.name}`}>
            Get a free quote
          </QuoteLink>
          <PhoneLink placement={`ppf-level-${n}`} className="ppk__tel">
            Call {BRAND.phoneDisplay}
          </PhoneLink>
        </div>
      </div>
    </li>
  );
}

export default function PpfPackages({ className }: { className?: string }) {
  return (
    <ol className={cn("ppks", className)}>
      {PPF_PACKAGES.map((p, i) => (
        <Row key={p.id} pkg={p} index={i} />
      ))}
    </ol>
  );
}

export { PpfPackages };

/** Used by the film page's intro, so the sentence and the rows agree. */
export function packageCount(): number {
  return PPF_PACKAGES.length;
}

