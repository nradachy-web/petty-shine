import type { CSSProperties } from "react";
import { PHOTOS, type PhotoId } from "@/lib/photos";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/utils";
import "./primitives.css";

/* ============================================================
   THE FULL BLEED POLICY

   17 of the 29 source photos stop at 1024px and 4 stop at 640px,
   because his old CDN capped them. Running a 960px source edge to
   edge on a modern phone at 3x is a visibly soft photograph, and a
   soft photograph on a detailing site argues against the shop.

   These eight are the only assets with a 1600px rendition on disk,
   and they are the only ids cleared to bleed. Everything else caps
   at 720 CSS px inside a hairline frame.

   The four this rule exists to protect are ppf-mclaren-gt,
   coating-corvette-c8-side, correction-reflection and coating-supra:
   all four are 960x720 sources, all four are tempting hero photos,
   and all four would look broken edge to edge.

   Source: _plan/DESIGN.md rule 5. Exported so the audit script can
   check it without re-deriving the list.
   ============================================================ */

export const BLEED_CLEARED = [
  "coating-corvette-c8",
  "coating-g-wagon",
  "coating-huracan",
  "detail-f250-black",
  "detail-jeep-orange",
  "detail-jeep-teal",
  "detail-mustang-red",
  "wheels-mustang",
] as const satisfies readonly PhotoId[];

export type BleedClearedId = (typeof BLEED_CLEARED)[number];

/** Framed plates cap here, in CSS pixels. */
export const PLATE_MAX_WIDTH = 720;

export function isBleedCleared(id: PhotoId): id is BleedClearedId {
  return (BLEED_CLEARED as readonly string[]).includes(id);
}

/**
 * The list above is a design decision, but it happens to coincide
 * exactly with the eight photos that have a 1600px rendition on disk.
 * If someone reprocesses the photos and that stops being true, the list
 * has drifted from reality and one of the two needs updating. Dev only.
 */
if (process.env.NODE_ENV !== "production") {
  const hasLargeSource = (id: PhotoId) =>
    (PHOTOS[id].sizes as readonly number[]).includes(1600);
  const drift = [
    ...(Object.keys(PHOTOS) as PhotoId[]).filter(
      (id) => hasLargeSource(id) && !isBleedCleared(id)
    ),
    ...BLEED_CLEARED.filter((id) => !hasLargeSource(id)),
  ];
  if (drift.length > 0) {
    // eslint-disable-next-line no-console
    console.warn(
      `[Plate] BLEED_CLEARED has drifted from the renditions on disk: ${drift.join(", ")}. ` +
        `Reconcile the list in Plate.tsx with _plan/DESIGN.md rule 5.`
    );
  }
}

function srcSet(id: PhotoId, ext: "avif" | "webp"): string {
  return PHOTOS[id].sizes
    .map((w) => `${asset(`/photos/${id}-${w}.${ext}`)} ${w}w`)
    .join(", ");
}

export interface PlateProps {
  id: PhotoId;
  /**
   * Eager load, high fetch priority, synchronous decode. Exactly one
   * photo per page should carry this: the one above the fold. Marking
   * several defeats the purpose by making them contend.
   */
  priority?: boolean;
  /**
   * Edge to edge. Honoured only for ids in BLEED_CLEARED; anything
   * else falls back to framed and warns in development.
   */
  bleed?: boolean;
  /** mono caps line under the plate, preceded by a 14px cyan mark */
  caption?: string;
  /** overrides the registry alt when context gives a better one */
  alt?: string;
  /** CSS aspect-ratio, for example "16 / 9". Crops with object-fit. */
  ratio?: string;
  /** responsive sizes hint. Defaults are right for both modes. */
  sizes?: string;
  className?: string;
  /** classes for the frame itself, for a ring or a corner treatment */
  frameClassName?: string;
  imgClassName?: string;
}

/**
 * THE IMAGE PRIMITIVE.
 *
 * Emits a real <picture> with AVIF and WebP sources, a srcset built
 * from the widths that actually exist on disk for that id, and the
 * intrinsic width and height on the <img> so the browser reserves the
 * right box and nothing shifts while the photo loads.
 *
 * Renditions are pre-generated at build prep time by
 * scripts/process-photos.py, so there is no runtime image service and
 * no dependency on Next's optimizer, which output:"export" disables
 * anyway. AVIF saves roughly a quarter over WebP on paint and gloss.
 *
 * THE BLEED POLICY IS ENFORCED HERE, IN CODE, NOT BY CONVENTION.
 * bleed on an uncleared id renders framed and warns in development.
 * That is deliberate: a convention in a document gets forgotten by the
 * fourth page, and the failure is silent and permanent.
 */
export default function Plate({
  id,
  priority = false,
  bleed = false,
  caption,
  alt,
  ratio,
  sizes,
  className,
  frameClassName,
  imgClassName,
}: PlateProps) {
  const meta = PHOTOS[id];
  const cleared = isBleedCleared(id);
  const willBleed = bleed && cleared;

  if (bleed && !cleared && process.env.NODE_ENV !== "production") {
    const widest = meta.sizes[meta.sizes.length - 1];
    // eslint-disable-next-line no-console
    console.warn(
      `[Plate] bleed was requested for "${id}", which is not in BLEED_CLEARED. ` +
        `Its source is ${meta.w}x${meta.h} and its largest rendition on disk is ${widest}px, ` +
        `so edge to edge would visibly upscale it. Rendering framed at ${PLATE_MAX_WIDTH}px instead. ` +
        `See _plan/DESIGN.md rule 5.`
    );
  }

  const widest = meta.sizes[meta.sizes.length - 1];
  const resolvedSizes =
    sizes ??
    (willBleed
      ? "100vw"
      : `(min-width: ${PLATE_MAX_WIDTH + 80}px) ${PLATE_MAX_WIDTH}px, 100vw`);

  const frameStyle: CSSProperties | undefined = ratio
    ? { aspectRatio: ratio }
    : undefined;

  return (
    <figure
      className={cn("plate", willBleed ? "plate--bleed" : "plate--framed", className)}
    >
      <picture className={cn("plate__frame", frameClassName)} style={frameStyle}>
        <source type="image/avif" srcSet={srcSet(id, "avif")} sizes={resolvedSizes} />
        <source type="image/webp" srcSet={srcSet(id, "webp")} sizes={resolvedSizes} />
        <img
          src={asset(`/photos/${id}-${widest}.webp`)}
          width={meta.w}
          height={meta.h}
          alt={alt ?? meta.alt}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : undefined}
          className={cn("plate__img", ratio && "plate__img--cover", imgClassName)}
        />
      </picture>
      {caption ? <figcaption className="plate__caption">{caption}</figcaption> : null}
    </figure>
  );
}

export { Plate };
