import ServiceLanding, { hubMetadata } from "@/components/landing/ServiceLanding";
import { KeyValueList, KeyValueRow, SectionHead } from "@/components/ui";
import { NC_TINT_LAW } from "@/lib/constants";
import { trackById } from "@/lib/landing";

const T = trackById("window-tinting")!;

export const metadata = hubMetadata(T);

/** The statute, cited on every row, because the rear glass myth gets
    published wrong on tint pages all over this state. */
export default function WindowTintingPage() {
  return (
    <ServiceLanding
      track={T}
      detailLabel="North Carolina law"
      detail={
        <>
          <SectionHead
            align="split"
            title="Every window, cited to the statute."
            intro={
              <p>
                The limits below are the statute, not our policy, and we do not install darker than they allow. Every citation is to {NC_TINT_LAW.statute}, so you can check any of it against what another shop tells you.
              </p>
            }
          />
          <KeyValueList className="mt-8 md:mt-10" label={`Window tint limits under ${NC_TINT_LAW.statute}`}>
            {NC_TINT_LAW.rows.map((row) => (
              <KeyValueRow key={row.key} k={row.key} v={row.value} note={row.cite} mono={false} />
            ))}
          </KeyValueList>
        </>
      }
    />
  );
}
