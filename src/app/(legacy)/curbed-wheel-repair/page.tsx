/* Redirect stub for the old Duda URL /curbed-wheel-repair. See _moved/Moved.tsx and
   _plan/CUTOVER.md. The copy lives in _moved/specs.ts so all eleven old
   addresses read as one set. */
import Moved, { movedMetadata } from "../_moved/Moved";
import { LEGACY } from "../_moved/specs";

const SPEC = LEGACY["curbed-wheel-repair"];

export const metadata = movedMetadata(SPEC);

export default function LegacyCurbedWheelRepairPage() {
  return <Moved spec={SPEC} />;
}
