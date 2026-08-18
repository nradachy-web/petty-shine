/* Redirect stub for the old Duda URL /35468. See _moved/Moved.tsx and
   _plan/CUTOVER.md. The copy lives in _moved/specs.ts so all eleven old
   addresses read as one set. */
import Moved, { movedMetadata } from "../_moved/Moved";
import { LEGACY } from "../_moved/specs";

const SPEC = LEGACY["35468"];

export const metadata = movedMetadata(SPEC);

export default function Legacy35468Page() {
  return <Moved spec={SPEC} />;
}
