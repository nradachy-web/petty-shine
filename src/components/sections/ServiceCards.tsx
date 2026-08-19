import Link from "next/link";

import "./flagship.css";

import { QuoteLink } from "@/components/ui";
import { SERVICES, type ServiceLine } from "@/lib/constants";
import { PHOTOS } from "@/lib/photos";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/utils";

/**
 * THE SERVICE CARDS.
 *
 * The service index, carried by his own photography. The first build
 * rendered the nine services as nine ruled text rows whose right column
 * repeated the same "Quoted on your vehicle" link nine times: honest,
 * scannable, and the least persuasive thing a shop with 29 real job
 * photos could put in front of a visitor deciding where to go.
 *
 * Each card: the photo, the mono index, the name, one line, and the
 * quote link as its own smaller ask. The whole card is one link into
 * the service page through the name's stretched pseudo element. The
 * two services with no honest photograph render a typographic media
 * slot instead: the rule is real photos or none, never a stand-in.
 *
 * Card photos render at column width, never larger, so the 640px
 * sources the bleed policy protects are safe in this grid by
 * construction.
 */

const CARD_SIZES = "(min-width: 1024px) 25rem, (min-width: 640px) 46vw, 100vw";

function CardMedia({ service }: { service: ServiceLine }) {
  if (!service.photoId) {
    return (
      <div className="svc-card__media svc-card__type" aria-hidden="true">
        <span className="svc-card__typeIndex">{service.index}</span>
        <span className="svc-card__typeNote">
          Real photos only. This one has not been shot yet.
        </span>
      </div>
    );
  }

  const meta = PHOTOS[service.photoId];
  const widest = meta.sizes[meta.sizes.length - 1];
  const srcSet = (ext: "avif" | "webp") =>
    meta.sizes
      .map((w) => `${asset(`/photos/${service.photoId}-${w}.${ext}`)} ${w}w`)
      .join(", ");

  return (
    <picture className="svc-card__media">
      <source type="image/avif" srcSet={srcSet("avif")} sizes={CARD_SIZES} />
      <source type="image/webp" srcSet={srcSet("webp")} sizes={CARD_SIZES} />
      {/* alt is empty on purpose: the card's own heading names the
          service, and the same frames carry their full descriptions in
          the gallery. A second reading of the photo inside the card's
          link is noise for a screen reader. */}
      <img
        src={asset(`/photos/${service.photoId}-${widest}.webp`)}
        width={meta.w}
        height={meta.h}
        alt=""
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
}

export default function ServiceCards({
  services = SERVICES,
  className,
}: {
  services?: readonly ServiceLine[];
  className?: string;
}) {
  return (
    <ul className={cn("svc-grid", className)}>
      {services.map((s) => (
        <li key={s.id} className="svc-card">
          <CardMedia service={s} />
          <div className="svc-card__body">
            <div className="svc-card__head">
              <span className="svc-card__index" aria-hidden="true">
                {s.index}
              </span>
              <h3 className="svc-card__name">
                <Link href={s.href}>{s.name}</Link>
              </h3>
            </div>
            <p className="svc-card__blurb">{s.blurb}</p>
            <div className="svc-card__foot">
              {/* The card's action gets a verb. "Quoted on your vehicle" is
                  the right words for a price slot, where it is a value; on a
                  card it is a button, and a button asks. The accessible name
                  still carries the service so nine of these read as nine
                  different links. */}
              <QuoteLink
                service={s.quoteKey}
                ariaLabel={`Get a price, ${s.name}`}
              >
                Get a price
              </QuoteLink>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export { ServiceCards };
