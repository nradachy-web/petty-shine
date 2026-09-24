import ServiceLanding, { hubMetadata } from "@/components/landing/ServiceLanding";
import CoatingTiers from "@/components/sections/CoatingTiers";
import { SectionHead } from "@/components/ui";
import { trackById } from "@/lib/landing";

/** The three tiers, the one thing on this page that is not on the template. */
const T = trackById("ceramic-coating")!;

export const metadata = hubMetadata(T);

export default function CeramicCoatingPage() {
  return (
    <ServiceLanding
      track={T}
      detailLabel="The three coatings"
      detail={
        <>
          <SectionHead
            title="What is in each one."
            intro={
              <p>
                What changes between them is how far the paint is corrected before anything goes on it, what goes on it, and how long Gtechniq stands behind it.
              </p>
            }
          />
          <CoatingTiers className="mt-9 md:mt-11" />
        </>
      }
    />
  );
}
