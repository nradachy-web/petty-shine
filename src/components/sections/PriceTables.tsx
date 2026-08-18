import Link from "next/link";
import { Check } from "lucide-react";
import {
  BODY_TYPES,
  COATINGS,
  CORRECTION_LEVELS,
  DETAIL_SERVICES,
  PPF_PACKAGES,
  TINT_ADDONS,
  TINT_NOTES,
} from "@/lib/constants";
import { cn, money } from "@/lib/utils";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

/* ---------------------------------------------------------------
   Published pricing. Nobody else in this market puts real numbers
   on a page, so these tables are the site's sharpest weapon,
   they run wide, plain, and un-gated on purpose.
   --------------------------------------------------------------- */

/** One priced row, rendered as a card on phones. */
function PriceRowCard({
  title,
  sub,
  dyed,
  ceramic,
  time,
}: {
  title: string;
  sub: string;
  dyed: number;
  ceramic: number;
  time: string;
}) {
  return (
    <div className="plate-flat p-4">
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-display text-base font-bold uppercase leading-tight tracking-tight text-ink-text">
          {title}
        </h4>
        <span className="mt-0.5 shrink-0 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted">
          {time}
        </span>
      </div>
      <p className="mt-1 text-[0.8125rem] leading-snug text-muted">{sub}</p>
      <div className="mt-3.5 grid grid-cols-2 gap-px bg-line">
        <div className="bg-white px-3 py-2.5">
          <p className="font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-muted">
            Dyed · ATC
          </p>
          <p className="price mt-1 text-[1.375rem] leading-none">{money(dyed)}</p>
        </div>
        <div className="bg-paper-2 px-3 py-2.5">
          <p className="font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-red">
            Ceramic · CTX
          </p>
          <p className="price mt-1 text-[1.375rem] leading-none text-red">
            {money(ceramic)}
          </p>
        </div>
      </div>
    </div>
  );
}

export function TintPriceTable({ showNotes = true }: { showNotes?: boolean }) {
  const extras = [
    {
      title: "Front two windows",
      sub: "Both front door windows, dyed or ceramic",
      dyed: TINT_ADDONS.frontTwoDyed,
      ceramic: TINT_ADDONS.frontTwoCeramic,
      time: "Under 1 hr",
    },
    {
      title: "Full windshield",
      sub: "Full glass, dyed or ceramic film",
      dyed: TINT_ADDONS.windshieldDyed,
      ceramic: TINT_ADDONS.windshieldCeramic,
      time: "1.5-2 hrs",
    },
  ];

  return (
    <div className="min-w-0">
      {/* Phones: cards. A four-column table at 393px is unreadable however
          you scroll it, so the row becomes the card and nothing overflows. */}
      <div className="space-y-3 md:hidden">
        {BODY_TYPES.map((b) => (
          <PriceRowCard
            key={b.id}
            title={b.label}
            sub={b.examples}
            dyed={b.tintDyed}
            ceramic={b.tintCeramic}
            time={b.tintTime}
          />
        ))}
        {extras.map((e) => (
          <PriceRowCard key={e.title} {...e} />
        ))}
      </div>

      {/* Tablet and up: the full table, which is the better scan at width. */}
      <div className="hidden md:block">
        <table className="data-table w-full">
          <colgroup>
            <col style={{ width: "46%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "18%" }} />
          </colgroup>
          <thead>
            <tr>
              <th>Vehicle</th>
              <th className="text-right">
                Dyed
                <span className="block text-[0.5625rem] tracking-[0.14em] text-muted">
                  LLumar ATC
                </span>
              </th>
              <th className="text-right">
                Ceramic
                <span className="block text-[0.5625rem] tracking-[0.14em] text-red">
                  most chosen
                </span>
              </th>
              <th className="text-right">Shop time</th>
            </tr>
          </thead>
          <tbody>
            {BODY_TYPES.map((b) => (
              <tr key={b.id}>
                <td>
                  <span className="block text-balance font-display font-bold uppercase tracking-tight text-ink-text">
                    {b.label}
                  </span>
                  <span className="mt-0.5 block text-[0.8125rem] text-muted">
                    {b.examples}
                  </span>
                </td>
                <td className="num text-right">{money(b.tintDyed)}</td>
                <td className="num text-right text-red">{money(b.tintCeramic)}</td>
                <td className="num text-right text-muted">{b.tintTime}</td>
              </tr>
            ))}
            {extras.map((e) => (
              <tr key={e.title}>
                <td>
                  <span className="block text-balance font-display font-bold uppercase tracking-tight text-ink-text">
                    {e.title}
                  </span>
                  <span className="mt-0.5 block text-[0.8125rem] text-muted">{e.sub}</span>
                </td>
                <td className="num text-right">{money(e.dyed)}</td>
                <td className="num text-right text-red">{money(e.ceramic)}</td>
                <td className="num text-right text-muted">{e.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showNotes && (
        <ul className="mt-6 space-y-2">
          {TINT_NOTES.map((n) => (
            <li key={n} className="flex gap-3 text-[0.875rem] leading-relaxed text-muted">
              <span className="mt-2 h-px w-3 shrink-0 bg-red" aria-hidden />
              {n}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function TierCards({
  items,
  columns = 3,
}: {
  items: {
    id: string;
    name: string;
    sub?: string;
    price: number;
    priceNote?: string;
    blurb: string;
    bullets?: readonly string[];
    footnote?: string;
    featured?: boolean;
    href?: string;
  }[];
  columns?: 2 | 3;
}) {
  return (
    <RevealGroup
      className={cn(
        "grid gap-5",
        columns === 3 ? "md:grid-cols-3" : "md:grid-cols-2"
      )}
      stagger={0.09}
    >
      {items.map((t) => (
        <RevealItem key={t.id} className="h-full">
        <div
          className={cn(
            "flex flex-col p-6 md:p-7",
            t.featured ? "plate border-t-[3px] border-t-red" : "plate-flat"
          )}
        >
          {t.featured && (
            <span className="mb-4 inline-block self-start bg-red px-2.5 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-white">
              Most chosen
            </span>
          )}
          <h3 className="display-sm">{t.name}</h3>
          {t.sub && (
            <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted">
              {t.sub}
            </p>
          )}

          <p className="mt-5 flex items-baseline gap-2">
            <span className="price-from">from</span>
            <span className="price text-[2.5rem] leading-none">{money(t.price)}</span>
          </p>
          {t.priceNote && (
            <p className="mt-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-red">
              {t.priceNote}
            </p>
          )}

          <p className="mt-5 text-[0.9375rem] leading-relaxed text-body">{t.blurb}</p>

          {t.bullets && (
            <ul className="mt-5 space-y-2.5">
              {t.bullets.map((b) => (
                <li key={b} className="flex gap-2.5 text-[0.875rem] leading-snug text-body">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-red" aria-hidden />
                  {b}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-auto pt-6">
            {t.footnote && (
              <p className="mb-4 border-t border-line pt-4 text-[0.8125rem] leading-relaxed text-muted">
                {t.footnote}
              </p>
            )}
            <Link
              href={t.href ?? "/quote/"}
              className={cn("btn btn-block", t.featured ? "btn-primary" : "btn-outline")}
            >
              Get this quoted
            </Link>
          </div>
        </div>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

export function CoatingTiers() {
  return (
    <TierCards
      items={COATINGS.map((c) => ({
        id: c.id,
        name: c.name,
        sub: c.subtitle,
        price: c.fromPrice,
        priceNote: `${c.protection} of protection · ${c.warranty}`,
        blurb: c.blurb,
        bullets: [
          "Hand wash, chemical decontamination, and clay bar",
          "At least one stage of machine polishing included",
          "Coating on body panels, trim, chrome, lights, and jambs",
          c.bestFor,
        ],
        featured: "featured" in c ? c.featured : false,
      }))}
    />
  );
}

export function PpfTiers() {
  return (
    <TierCards
      items={PPF_PACKAGES.map((p) => ({
        id: p.id,
        name: p.name,
        sub: "GeoShield Ceramic Shield",
        price: p.fromPrice,
        priceNote: "10-year manufacturer warranty",
        blurb: p.blurb,
        bullets: p.includes,
        footnote: p.bestFor,
        featured: "featured" in p ? p.featured : false,
      }))}
    />
  );
}

export function CorrectionTiers() {
  return (
    <TierCards
      items={CORRECTION_LEVELS.map((c) => ({
        id: c.id,
        name: c.name,
        price: c.fromPrice,
        blurb: c.blurb,
        bullets: c.bestFor,
        footnote: c.expect.join(" · "),
        featured: "featured" in c ? c.featured : false,
      }))}
    />
  );
}

export function DetailTiers() {
  return (
    <TierCards
      items={DETAIL_SERVICES.map((d) => ({
        id: d.id,
        name: d.name,
        sub: d.time,
        price: d.fromPrice,
        blurb: d.points[0],
        bullets: d.points.slice(1),
        featured: "featured" in d ? d.featured : false,
      }))}
    />
  );
}

export function DetailSizeTable() {
  const rows = BODY_TYPES.filter((b) => b.id !== "pickup-2door" && b.id !== "coupe");
  return (
    <div className="min-w-0">
      <div className="space-y-3 md:hidden">
        {rows.map((b) => (
          <div key={b.id} className="plate-flat p-4">
            <h4 className="font-display text-base font-bold uppercase leading-tight tracking-tight text-ink-text">
              {b.label}
            </h4>
            <div className="mt-3.5 grid grid-cols-3 gap-px bg-line">
              {[
                { l: "Interior", v: b.detailInterior, accent: false },
                { l: "Full", v: b.detailFull, accent: true },
                { l: "Exterior", v: b.detailExterior, accent: false },
              ].map((c) => (
                <div key={c.l} className={cn("px-2.5 py-2.5", c.accent ? "bg-paper-2" : "bg-white")}>
                  <p
                    className={cn(
                      "font-mono text-[0.5625rem] uppercase tracking-[0.14em]",
                      c.accent ? "text-red" : "text-muted"
                    )}
                  >
                    {c.l}
                  </p>
                  <p className={cn("price mt-1 text-[1.25rem] leading-none", c.accent && "text-red")}>
                    {money(c.v)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block">
        <table className="data-table w-full">
          <colgroup>
            <col style={{ width: "40%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "20%" }} />
          </colgroup>
          <thead>
            <tr>
              <th>Vehicle size</th>
              <th className="text-right">Interior</th>
              <th className="text-right">Full interior &amp; exterior</th>
              <th className="text-right">Exterior</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => (
              <tr key={b.id}>
                <td className="font-display font-bold uppercase tracking-tight text-ink-text">
                  {b.label}
                </td>
                <td className="num text-right">{money(b.detailInterior)}</td>
                <td className="num text-right text-red">{money(b.detailFull)}</td>
                <td className="num text-right">{money(b.detailExterior)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
