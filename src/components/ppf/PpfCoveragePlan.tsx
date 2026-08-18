"use client";

import {
  IMPACT_PANELS,
  PANEL_LABELS,
  PANEL_ORDER,
  PPF_DEFAULT_PACKAGE,
  PPF_PACKAGES,
  type PanelId,
} from "@/lib/constants";
import CoveragePlanFrame from "./CoveragePlanFrame";
import { CAR_SIDE_MAP } from "./carSideMap";

/**
 * The Coverage Plan, wired to Petty Shine's four published PPF packages.
 *
 * Every panel id, every label, the installation order, the impact set
 * and the default tier come out of src/lib/constants.ts. Nothing on this
 * page is typed in, so the diagram and the words beside it cannot drift
 * apart and cannot drift from the four packages he actually sells.
 *
 * Drop it on a page with no props:
 *
 *     <Section plane="shop" label="Coverage">
 *       <PpfCoveragePlan />
 *     </Section>
 *
 * The map and the constants are imported here rather than passed in, so
 * none of the geometry crosses the server to client boundary as props.
 */
export default function PpfCoveragePlan({
  className,
}: {
  className?: string;
}) {
  return (
    <CoveragePlanFrame<PanelId>
      map={CAR_SIDE_MAP}
      packages={PPF_PACKAGES}
      order={PANEL_ORDER}
      labels={PANEL_LABELS}
      impactPanels={IMPACT_PANELS}
      defaultPackageId={PPF_DEFAULT_PACKAGE}
      service="ppf"
      uid="ppf-coverage"
      legend="Coverage level"
      className={className}
    />
  );
}

export { PpfCoveragePlan };
