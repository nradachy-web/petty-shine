import ServiceLanding, { hubMetadata } from "@/components/landing/ServiceLanding";
import { PpfCoveragePlan, SpecificationPending } from "@/components/ppf";
import { KeyValueList, KeyValueRow, SectionHead } from "@/components/ui";
import { PPF_FILM, PPF_PACKAGES, PPF_DEFAULT_PACKAGE } from "@/lib/constants";
import { trackById } from "@/lib/landing";

const T = trackById("paint-protection-film")!;
const DEFAULT_PACKAGE = PPF_PACKAGES.find((p) => p.id === PPF_DEFAULT_PACKAGE)!;

export const metadata = hubMetadata(T);

/** The coverage plan and the honest film record are the two things on
    this page the template does not carry. */
export default function PaintProtectionFilmPage() {
  return (
    <ServiceLanding
      track={T}
      detailLabel="Coverage"
      detail={
        <>
          <SectionHead
            align="split"
            title="What the film actually covers."
            intro={
              <p>
                Four coverage levels, each one containing everything in the level below it. Every body panel is listed against all four. {DEFAULT_PACKAGE.name} is marked because it is the most common job the shop does.
              </p>
            }
          />
          <div className="mt-8 md:mt-10">
            <PpfCoveragePlan />
          </div>
          <div className="mt-12 grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
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
