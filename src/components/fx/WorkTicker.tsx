import { WORK } from "@/lib/work";

/**
 * A slow conveyor of real vehicles through the bay, set like the placard
 * captions in the gallery. Two identical tracks scroll as one loop; the
 * second is aria-hidden so screen readers hear the list once. Pauses on
 * hover, and the global reduced-motion override freezes it to a static row.
 */
export default function WorkTicker() {
  const items = WORK.filter((w) => w.category !== "detail").slice(0, 14);

  const Track = ({ hidden = false }: { hidden?: boolean }) => (
    <div className="ticker-track" aria-hidden={hidden || undefined}>
      {items.map((w) => (
        <span
          key={`${hidden ? "b" : "a"}-${w.photo}`}
          className="flex items-center gap-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-dim"
        >
          <span className="h-[2px] w-4 bg-red" aria-hidden />
          <span className="text-light-2">{w.vehicle}</span>
          <span>{w.service}</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="on-wall ticker border-y border-white/10 py-3.5" aria-label="Recent vehicles through the shop">
      <Track />
      <Track hidden />
    </div>
  );
}
