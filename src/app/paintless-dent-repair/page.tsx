import ServiceLanding, { hubMetadata } from "@/components/landing/ServiceLanding";
import { KeyValueList, KeyValueRow, SectionHead } from "@/components/ui";
import { trackById } from "@/lib/landing";

const T = trackById("paintless-dent-repair")!;

export const metadata = hubMetadata(T);

/** Paintless work needs intact paint and a way in behind the panel. Lose
    either one and it becomes a different repair, which the page says out
    loud rather than finding out halfway through. */
const SUITS = [
  { k: "Door dings", v: "The dimple left by the car parked too close, usually along the middle of a door." },
  { k: "Hail damage", v: "A hood or a roof full of small round dents with the paint still whole." },
  { k: "Parking lot dents", v: "Cart hits and knee height dents in a door or a quarter panel." },
  { k: "Soft edged dents", v: "A dent that rolls into the panel rather than folding it, with nothing broken through the clear coat." },
];
const STOPS = [
  { k: "Cracked or chipped paint", v: "Once the paint is broken the panel needs refinishing. Paintless work moves metal, it does not put paint back." },
  { k: "A sharp crease", v: "A crease stretches the metal. It can come a long way back and it will not read as untouched." },
  { k: "No access behind it", v: "Some dents sit over a brace or on the edge of a panel, where there is no way in from the back." },
  { k: "Filler under the paint", v: "A panel that has been repaired before does not move the way bare metal moves." },
];

export default function PaintlessDentRepairPage() {
  return (
    <ServiceLanding
      track={T}
      detailLabel="Suitability"
      detail={
        <>
          <SectionHead
            title="What comes out, and what does not."
            intro={
              <p>
                Paintless work needs two things: paint that is still intact, and a way in behind the panel. Send a photo and we will say which one yours is before you drive over.
              </p>
            }
          />
          <div className="mt-8 grid min-w-0 gap-10 md:mt-10 lg:grid-cols-2 lg:gap-14">
            <div className="min-w-0">
              <h3 className="ps-heading text-lg">Damage this suits</h3>
              <KeyValueList className="mt-5" label="Damage paintless repair suits">
                {SUITS.map((row) => (
                  <KeyValueRow key={row.k} k={row.k} v={row.v} mono={false} />
                ))}
              </KeyValueList>
            </div>
            <div className="min-w-0">
              <h3 className="ps-heading text-lg">Where it stops</h3>
              <KeyValueList className="mt-5" label="Where paintless repair stops">
                {STOPS.map((row) => (
                  <KeyValueRow key={row.k} k={row.k} v={row.v} mono={false} tone="pewter" />
                ))}
              </KeyValueList>
            </div>
          </div>
        </>
      }
    />
  );
}
