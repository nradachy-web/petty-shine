import type { Metadata } from "next";
import LegalPage from "@/components/sections/LegalPage";
import { BRAND } from "@/lib/constants";

/**
 * Rewritten for Petty Shine. The previous version of this file was the
 * previous client's, named a different business, and pointed at a
 * BRAND.email that does not exist here.
 *
 * OPEN ITEM FOR NICK: there is no published email address for the shop
 * anywhere in RECON, so every contact route below is the phone and the
 * street address. If Judson gives us an inbox, add it to BRAND and add
 * it here. There is also no SMS marketing program, so this policy does
 * not describe one. Do not add 10DLC consent language until there is a
 * real program to describe.
 */
export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${BRAND.name} handles the information you send through this website.`,
  alternates: { canonical: "/privacy-policy/" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      crumb="/privacy-policy/"
      title="Privacy Policy"
      updated="August 2026"
      intro={`This policy covers what ${BRAND.name} does with the information you send through this website. The short version: we use it to price and service your vehicle, and we do not sell it.`}
      blocks={[
        {
          h: "What we collect",
          p: [
            "The quote form asks for your name, your phone number, your vehicle, the service you are asking about, and anything you choose to add in the message field. Email is optional. Nothing else on this site asks you for information.",
            "When you arrive from an advertisement the link can carry a click identifier or campaign tags. We record those with the request so we can tell which advertising actually produces work. They identify the ad, not you.",
          ],
        },
        {
          h: "What we do with it",
          p: [
            "We use it to price the job, call you back about it, book the vehicle in, and do the work. That is the whole purpose.",
            "We do not sell your information, rent it, trade it, or hand it to anyone marketing to you.",
          ],
        },
        {
          h: "Phone and messages",
          p: [
            "If you leave a number, we use it to reach you about your request. We do not run a marketing text program and we do not add you to one.",
          ],
        },
        {
          h: "Who else touches it",
          p: [
            "The quote form is delivered to the shop by a third party form service, and this site may use Google Analytics and Google Ads conversion measurement to count how many visits turn into real requests. Those providers handle the data under their own terms.",
          ],
        },
        {
          h: "Cookies and measurement",
          p: [
            "Cookies and similar measurement may be used to count traffic and advertising performance. Blocking them in your browser does not stop you using this site or contacting the shop.",
          ],
        },
        {
          h: "How long we keep it",
          p: [
            "We keep quote and customer records for as long as we need them to service the vehicle and support any guarantee that applies to the work, and we take reasonable steps to protect them. No system is perfectly secure and we do not claim otherwise.",
          ],
        },
        {
          h: "Asking us to change or delete it",
          p: [
            `Call ${BRAND.phoneDisplay} or write to us at ${BRAND.addressLine} and ask. We will correct or delete what we hold.`,
          ],
        },
        {
          h: "Children",
          p: [
            "This site is not directed at children under 13 and we do not knowingly collect information from them.",
          ],
        },
        {
          h: "Contact",
          p: [
            `${BRAND.legalName}, ${BRAND.addressLine}. Phone ${BRAND.phoneDisplay}. Open ${BRAND.hoursShort}.`,
          ],
        },
      ]}
    />
  );
}
