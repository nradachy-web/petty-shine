import { PHOTOS, type PhotoId } from "@/lib/photos";
import { cn } from "@/lib/utils";
import { asset } from "@/lib/asset";

interface Props {
  id: PhotoId;
  /** overrides the registry alt, use when context makes a better description */
  alt?: string;
  className?: string;
  /** responsive `sizes` hint; defaults to full viewport width */
  sizes?: string;
  priority?: boolean;
  /** render at intrinsic size instead of filling the parent */
  intrinsic?: boolean;
}

function srcSet(id: PhotoId, ext: "avif" | "webp") {
  return PHOTOS[id].sizes
    .map((w) => `${asset(`/photos/${id}-${w}.${ext}`)} ${w}w`)
    .join(", ");
}

/**
 * Every photo on this site is a real job from the shop. Renditions are
 * pre-generated at build-prep time (scripts/process-photos.py) as AVIF and
 * WebP at four widths, so this is a plain <picture>, no runtime image
 * service, no layout shift, and AVIF saves roughly 25% over WebP on
 * photographic content like paint and gloss.
 *
 * Only the single above-the-fold hero on a page should get `priority`;
 * marking several defeats the purpose by making them contend.
 */
export default function Photo({
  id,
  alt,
  className,
  sizes = "100vw",
  priority = false,
  intrinsic = false,
}: Props) {
  const meta = PHOTOS[id];
  const widest = meta.sizes[meta.sizes.length - 1];

  return (
    <picture className="contents">
      <source type="image/avif" srcSet={srcSet(id, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(id, "webp")} sizes={sizes} />
      <img
        src={asset(`/photos/${id}-${widest}.webp`)}
        width={meta.w}
        height={meta.h}
        alt={alt ?? meta.alt}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : undefined}
        className={cn(
          intrinsic ? "h-auto w-full" : "h-full w-full object-cover",
          className
        )}
      />
    </picture>
  );
}
