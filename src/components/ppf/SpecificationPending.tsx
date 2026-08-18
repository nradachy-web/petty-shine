import KeyValueRow, { KeyValueList } from "@/components/ui/KeyValueRow";
import { PENDING_SPEC } from "@/lib/constants";
import "./coverage.css";

/**
 * SPECIFICATION PENDING.
 *
 * His current PPF page brands every heading STEK and then, in a bullet
 * underneath, promises a ten year warranty from a completely different
 * film brand, one whose installer directory does not list him at all.
 * That contradiction is the worst factual error on the old site and it
 * is the reason this block exists. The brand name itself is a build
 * failure now, see FORBIDDEN_CLAIMS, so it is not repeated here.
 *
 * The honest answer is not to pick one of the two claims and publish it.
 * It is to say, in the same ruled rows as every other fact on the site,
 * that the film and the warranty are confirmed for the vehicle in
 * writing. Pewter carries it, because pewter is the colour of every
 * honest negative here and none of this is a warning.
 *
 * The rows come from PENDING_SPEC in constants. The moment Judson
 * confirms which film he installs and what backs it, the real values
 * drop into these same rows with zero layout change, and this component
 * stops being needed.
 *
 * It belongs directly under the coverage diagram, where the question
 * "what film is this" is being asked.
 */
export default function SpecificationPending({
  className,
  id,
}: {
  className?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={className ? `cov-pending ${className}` : "cov-pending"}
    >
      <p className="cov-pending__head">{PENDING_SPEC.heading}</p>
      <KeyValueList label={PENDING_SPEC.heading}>
        {PENDING_SPEC.rows.map((row) => (
          <KeyValueRow key={row.key} k={row.key} v={row.value} tone="pewter" />
        ))}
      </KeyValueList>
      <p className="cov-pending__note">{PENDING_SPEC.note}</p>
    </div>
  );
}

export { SpecificationPending };
