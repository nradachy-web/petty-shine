import type { Metadata } from "next";
import LegalPage from "@/components/sections/LegalPage";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms of use for the HD Auto Studio website, including pricing, quotes, appointments, warranty administration, and text messaging terms.",
  alternates: { canonical: "/terms/" },
};

export default function TermsPage() {
  return (
    <LegalPage
      crumb="/terms/"
      title="Terms & Conditions"
      updated="August 2026"
      intro={`These terms cover the use of this website and the quotes it produces. They don't replace the paperwork you sign at the shop, where the two differ, the paperwork governs.`}
      blocks={[
        {
          h: "Pricing and quotes",
          p: [
            "Prices shown on this site are starting prices for vehicles in average condition, published in good faith and current as of the last update. Final pricing depends on vehicle size, condition, film or coating selection, and the work actually required, and is confirmed before any service is scheduled.",
            "An instant price produced by the quote builder is an estimate based on the vehicle body type it identifies. It is not a binding offer, and we will confirm the exact figure with you before booking.",
          ],
        },
        {
          h: "Appointments",
          p: [
            "All services are performed by appointment. If your vehicle has conditions that require additional time, heavy pet hair, severe staining, mold, biohazard, or heavy construction contamination, tell us before booking. Appointments may be rescheduled on arrival if those conditions were not disclosed.",
            "Additional services are never performed without your approval. If we find something worth addressing, we contact you first.",
          ],
        },
        {
          h: "Warranties",
          p: [
            "Manufacturer warranties on window film, paint protection film, and ceramic coatings are provided and administered by the respective manufacturers, subject to their terms, registration requirements, and maintenance conditions. Summaries on this site are provided for convenience; the certificate and manufacturer terms you receive govern.",
            "Some coverage requires registration within a set period and periodic paid inspections. Failing to meet those requirements can void the warranty. We explain the requirements at pickup.",
          ],
        },
        {
          h: "Text messaging terms",
          p: [
            `By providing your phone number and opting in, you agree to receive text messages from ${BRAND.name} at that number. Message frequency varies. Message and data rates may apply.`,
            "Reply STOP to any message to opt out; reply HELP for assistance. Carriers are not liable for delayed or undelivered messages. Consent is not a condition of purchase.",
            "See our Privacy Policy for how mobile information is handled.",
          ],
        },
        {
          h: "Site content",
          p: [
            "Photographs on this site are of work performed at our shop. Product names, logos, and trademarks referenced, including LLumar, CTX, GeoShield, and System X, are the property of their respective owners and are used to identify the products we install.",
            "We try to keep everything on this site accurate and current, but we make no warranty that it is error-free.",
          ],
        },
        {
          h: "Contact",
          p: [
            `${BRAND.name}, ${BRAND.street}, ${BRAND.city}, ${BRAND.state} ${BRAND.zip}. Phone ${BRAND.phoneDisplay}. Email ${BRAND.email}.`,
          ],
        },
      ]}
    />
  );
}
