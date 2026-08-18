import type { Metadata } from "next";
import LegalPage from "@/components/sections/LegalPage";
import { BRAND } from "@/lib/constants";

/**
 * Rewritten for Petty Shine. The previous version named a different
 * business, described a per body type price calculator this site does
 * not have, and listed film brands he does not install.
 *
 * Read FORBIDDEN_CLAIMS in src/lib/constants.ts before editing a word of
 * this. No warranty term is stated anywhere on this page on purpose.
 */
export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: `Terms covering the use of the ${BRAND.name} website and the quotes it produces, including how a quote is confirmed and who backs the coating and film guarantees.`,
  alternates: { canonical: "/terms/" },
};

export default function TermsPage() {
  return (
    <LegalPage
      crumb="/terms/"
      title="Terms and Conditions"
      updated="August 2026"
      intro="These terms cover this website and the quotes it produces. They do not replace the paperwork you sign at the shop. Where the two differ, the paperwork governs."
      blocks={[
        {
          h: "Prices and quotes",
          p: [
            /* PRICING_MODE is "private", so this page may not describe the
               site as publishing prices. It did, and the paragraph opened
               "Every price on this site is a starting price", which was a
               claim the rest of the site no longer made. */
            "This site does not publish prices. What a vehicle actually needs decides the figure, so the number comes back on the vehicle in front of us and we confirm it with you before anything starts.",
            "A price you are given through the quote form is a quote on a described vehicle, not a binding offer. We confirm it in writing once we have seen the vehicle.",
          ],
        },
        {
          h: "Appointments",
          p: [
            "Work is done by appointment. If the vehicle has conditions that take real extra time, heavy pet hair, mold, biohazard, deep staining or construction overspray, tell us when you book. An appointment can be rescheduled on arrival if those conditions were not mentioned.",
            "We do not perform extra work without asking you first. If we find something worth addressing, we call.",
          ],
        },
        {
          h: "Guarantees",
          p: [
            "Coating and film guarantees are issued and administered by the manufacturer, not by this shop, and they carry the manufacturer conditions, including registration and inspection requirements. Anything summarized on this site is a summary. The certificate and the manufacturer terms you receive are what govern.",
            "Some coverage becomes invalid if a registration deadline or an inspection is missed. We explain what applies to your vehicle at pickup, and we put the terms of your work in writing before it begins.",
          ],
        },
        {
          h: "What is on this site",
          p: [
            "The photographs are of work done at this shop. Product names and trademarks that appear, including Gtechniq and STEK, belong to their owners and are used only to identify the products we install.",
            "We keep this site accurate and we correct it when something changes, but we do not warrant that it is free of error.",
          ],
        },
        {
          h: "Contact",
          p: [
            /* BRAND.hours sources when the shop is OPEN. It does not source
               who answers a phone or how quickly, so nothing here says that. */
            `${BRAND.legalName}, ${BRAND.addressLine}. Phone ${BRAND.phoneDisplay}. The shop is open ${BRAND.hoursShort}.`,
          ],
        },
      ]}
    />
  );
}
