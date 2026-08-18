"use client";

import CoveragePlan, { type CoveragePlanProps } from "./CoveragePlan";
import CoverageStack from "./CoverageStack";
import "./coverage.css";

/**
 * Both renderings, and the one rule that picks between them.
 *
 * The static HTML contains the interactive plan showing the default
 * package fully drawn, AND the stack of all four packages fully drawn.
 * Neither of them is hidden by a script and neither of them needs one to
 * appear. CSS alone decides which is on screen:
 *
 *   the stylesheet             the stack is display:none, the plan shows
 *   prefers-reduced-motion     the stack shows, the plan is hidden
 *   scripting disabled         the stack shows, the plan is hidden,
 *                              because the <noscript> style below only
 *                              parses when scripting is off
 *
 * Reason through the static HTML and it holds up. Strip every script and
 * every stylesheet and you are left with five drawn diagrams, five
 * coverage lists, five buttons into the quote form, and four working
 * radio inputs. Nothing about the answer to "what do I actually get"
 * depends on JavaScript arriving.
 */

export type CoveragePlanFrameProps<Id extends string> = CoveragePlanProps<Id>;

export default function CoveragePlanFrame<Id extends string>(
  props: CoveragePlanFrameProps<Id>
) {
  const {
    map,
    packages,
    order,
    labels,
    impactPanels,
    defaultPackageId,
    service,
    uid,
    coveredLabel,
    uncoveredLabel,
    impactHead,
    impactBody,
    impactLabel,
    impactNote,
    impactSwatchLabel,
    recordLabel,
    subjectNote,
    actionNote,
  } = props;

  return (
    <>
      <noscript
        dangerouslySetInnerHTML={{
          __html:
            "<style>.cov-live{display:none!important}" +
            ".cov-static{display:block!important}</style>",
        }}
      />
      <CoveragePlan {...props} />
      <CoverageStack
        map={map}
        packages={packages}
        order={order}
        labels={labels}
        impactPanels={impactPanels}
        defaultPackageId={defaultPackageId}
        service={service}
        uid={uid ? `${uid}-static` : undefined}
        coveredLabel={coveredLabel}
        uncoveredLabel={uncoveredLabel}
        impactHead={impactHead}
        impactBody={impactBody}
        impactLabel={impactLabel}
        impactNote={impactNote}
        impactSwatchLabel={impactSwatchLabel}
        recordLabel={recordLabel}
        subjectNote={subjectNote}
        actionNote={actionNote}
      />
    </>
  );
}

export { CoveragePlanFrame };
