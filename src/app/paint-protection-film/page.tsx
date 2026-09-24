import ServiceLanding, { hubMetadata } from "@/components/landing/ServiceLanding";
import { PpfCoveragePlan, SpecificationPending } from "@/components/ppf";
import PpfPackages from "@/components/ppf/PpfPackages";
import { DatumRule, KeyValueList, KeyValueRow, SectionHead } from "@/components/ui";
import { PPF_FILM, PPF_PACKAGES, PPF_DEFAULT_PACKAGE } from "@/lib/constants";
import { trackById } from "@/lib/landing";

const T = trackById("paint-protection-film")!;
const DEFAULT_PACKAGE = PPF_PACKAGES.find((p) => p.id === PPF_DEFAULT_PACKAGE)!;

export const metadata = hubMetadata(T);

/** Three things on this page the template does not carry: the four
    coverage levels drawn on one car, the panel by panel matrix, and the
    honest film record with its pending warranty line. All on the dark
    plane, because the coverage renders sit on the same near black. */
export default function PaintProtectionFilmPage() {
  return (
    <ServiceLanding
      track={T}
      detailLabel="Coverage"
      detailPlane="shop"
      detail={
        <>
          <SectionHead
            align="split"
            title="Four coverage levels, drawn on one car."
            intro={
              <p>
                Each level contains everything in the level below it. The cyan is where the film goes, drawn on an illustration rather than a customer&apos;s car. {DEFAULT_PACKAGE.name} is the most common job the shop does.
              </p>
            }
          />
          <PpfPackages className="mt-10 md:mt-12" />

          <DatumRule label="Every panel, against all four levels" className="mb-8 mt-16 md:mt-20" />
          <PpfCoveragePlan />

          <DatumRule label="The film" className="mb-8 mt-16 md:mt-20" />
          <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="min-w-0 lg:col-span-7">
              <KeyValueList label={`${PPF_FILM.brand} ${PPF_FILM.product}, published specification`}>
                {PPF_FILM.specs.map((spec) => (
                  <KeyValueRow key={spec.key} k={spec.key} v={spec.value} mono={false} />
                ))}
              </KeyValueList>
            </div>
            <div className="min-w-0 lg:col-span-5">
              <SpecificationPending />
            </div>
          </div>
        </>
      }
    />
  );
}
