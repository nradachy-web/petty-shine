import type { Metadata } from "next";
import LegalPage from "@/components/sections/LegalPage";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How HD Auto Studio collects, uses, and protects the information you send through this website, including SMS consent and mobile information handling.",
  alternates: { canonical: "/privacy-policy/" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      crumb="/privacy-policy/"
      title="Privacy Policy"
      updated="August 2026"
      intro={`This policy explains what ${BRAND.name} does with the information you send us through this website. The short version: we use it to quote and service your vehicle, and we don't sell or share it.`}
      blocks={[
        {
          h: "Information we collect",
          p: [
            "When you submit a quote request we collect the details you provide: your name, phone number, email address, ZIP code, vehicle information, the services you're interested in, and any notes you add.",
            "We also record basic marketing attribution data when it is present in the link you arrived from, for example a Google Ads click identifier or UTM parameters, so we can tell which advertising is working. This is standard practice and is not used to identify you personally.",
          ],
        },
        {
          h: "How we use it",
          p: [
            "To prepare your quote, contact you about it, schedule your appointment, and service your vehicle. If you consent to marketing messages, we may also send occasional offers or reminders.",
            "We do not sell your information. We do not rent it, trade it, or provide it to third-party marketers.",
          ],
        },
        {
          h: "Text messaging and mobile information",
          p: [
            "If you provide your phone number and consent, we may send you text messages about your quote, appointment, or service. Message frequency varies. Message and data rates may apply. Reply STOP to opt out at any time, or HELP for help.",
            "No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. All the above categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.",
            "Consent to receive text messages is not a condition of any purchase.",
          ],
        },
        {
          h: "Service providers",
          p: [
            "This site uses a third-party form service to deliver quote requests to our inbox, and may use Google Analytics and Google Ads conversion measurement to understand site performance. These providers process data on our behalf and are bound by their own privacy terms.",
          ],
        },
        {
          h: "Cookies and analytics",
          p: [
            "We may use cookies and similar technologies to measure site traffic and advertising performance. You can control cookies through your browser settings; blocking them will not prevent you from using this site or contacting us.",
          ],
        },
        {
          h: "Data retention and security",
          p: [
            "We keep quote and customer records for as long as needed to service your vehicle and honour any applicable warranty, and we take reasonable measures to protect them. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.",
          ],
        },
        {
          h: "Your choices",
          p: [
            `You can ask us to correct or delete your information at any time by emailing ${BRAND.email} or calling ${BRAND.phoneDisplay}. You can opt out of marketing texts by replying STOP and out of marketing emails using the unsubscribe link.`,
          ],
        },
        {
          h: "Children",
          p: [
            "This site is not directed to children under 13 and we do not knowingly collect information from them.",
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
