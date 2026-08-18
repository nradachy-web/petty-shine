import Link from "next/link";
import { Phone, MessageSquare } from "lucide-react";
import { BRAND } from "@/lib/constants";
import RuleLabel from "@/components/ui/RuleLabel";

export default function CTABand({
  eyebrow = "Next step",
  title = "Tell us the vehicle. We'll tell you the number.",
  body = "Most tint jobs price instantly from our published rates. Coatings, film, and correction start with a quick look at the car, with no obligation attached.",
  ctaLabel = "Build my quote",
  ctaHref = "/quote/",
}: {
  eyebrow?: string;
  title?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <section className="on-wall section grain relative overflow-hidden">
      <div className="container-site relative">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <RuleLabel tone="light">{eyebrow}</RuleLabel>
            <h2 className="display-lg mt-6 text-white">{title}</h2>
            <p className="mt-5 max-w-xl leading-relaxed text-light-2">{body}</p>
          </div>
          <div className="md:col-span-5">
            <div className="flex flex-col gap-3">
              <Link href={ctaHref} className="btn btn-primary btn-lg btn-block">
                {ctaLabel}
              </Link>
              <a
                href={`tel:${BRAND.phoneTel}`}
                className="btn btn-outline-light btn-lg btn-block"
              >
                <Phone className="h-4 w-4" aria-hidden />
                Call {BRAND.phoneDisplay}
              </a>
              <a
                href={`sms:${BRAND.phoneTel}`}
                className="flex items-center justify-center gap-2 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-light-2 transition-colors hover:text-white"
              >
                <MessageSquare className="h-3.5 w-3.5" aria-hidden />
                Or text a photo of your vehicle
              </a>
              <p className="text-center font-mono text-[0.625rem] uppercase tracking-[0.14em] text-dim">
                Texts answered same day during shop hours
              </p>
            </div>
            <p className="mt-5 font-mono text-[0.625rem] uppercase leading-relaxed tracking-[0.14em] text-dim">
              {BRAND.street}
              <br />
              <span className="whitespace-nowrap">
                {BRAND.city}, {BRAND.state} {BRAND.zip}
              </span>
              <br />
              {BRAND.hoursShort}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
