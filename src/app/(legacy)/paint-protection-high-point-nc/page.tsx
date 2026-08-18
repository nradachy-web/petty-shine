/* Redirect stub for the old Duda URL /paint-protection-high-point-nc. See _moved/Moved.tsx and
   _plan/CUTOVER.md. The copy lives in _moved/specs.ts so all eleven old
   addresses read as one set. */
import Moved, { movedMetadata } from "../_moved/Moved";
import { LEGACY } from "../_moved/specs";

const SPEC = LEGACY["paint-protection-high-point-nc"];

export const metadata = movedMetadata(SPEC);

export default function LegacyPaintProtectionHighPointNcPage() {
  return <Moved spec={SPEC} />;
}
