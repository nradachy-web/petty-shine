import type { Metadata } from "next";
import { Phone, MessageSquare, Clock, MapPin } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import QuoteForm from "@/components/quote/QuoteForm";
import RuleLabel from "@/components/ui/RuleLabel";
import { BRAND, RATING, SEO } from "@/lib/constants";

export const metadata: Metadata = {
  title: SEO.quote.title,
  description: SEO.quote.description,
  alternates: { canonical: "/quote/" },
  robots: { index: true, follow: true },
};

export default function QuotePage() {
  return (
    <>
      <Breadcrumbs trail={[{ label: "Get a Quote", href: "/quote/" }]} />

      <section className="section">
        <div className="container-site">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <RuleLabel>Quote builder</RuleLabel>
              <h1 className="display-lg mt-6">Build your quote</h1>
              <p className="mt-5 max-w-md leading-relaxed text-body">
                Four short steps. Tint prices come straight off our published rate
                sheet; film, coatings, and correction get a real number back from
                Justin, usually the same day during shop hours.
              </p>

              <div className="mt-9 space-y-4">
                <a
                  href={`tel:${BRAND.phoneTel}`}
                  className="plate flex items-center gap-4 p-4 transition-colors hover:border-red"
                >
                  <Phone className="h-5 w-5 shrink-0 text-red" aria-hidden />
                  <span>
                    <span className="block font-display text-lg font-bold uppercase tracking-tight text-ink-text">
                      {BRAND.phoneDisplay}
                    </span>
                    <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">
                      Call the shop
                    </span>
                  </span>
                </a>
                <a
                  href={`sms:${BRAND.phoneTel}`}
                  className="plate flex items-center gap-4 p-4 transition-colors hover:border-red"
                >
                  <MessageSquare className="h-5 w-5 shrink-0 text-red" aria-hidden />
                  <span>
                    <span className="block font-display text-lg font-bold uppercase tracking-tight text-ink-text">
                      Text a photo
                    </span>
                    <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">
                      Fastest way to price a detail
                    </span>
                  </span>
                </a>
              </div>

              <div className="mt-9 space-y-3 border-t border-line pt-6 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted">
                <p className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red" aria-hidden />
                  {BRAND.street}, {BRAND.city}, {BRAND.state} {BRAND.zip}
                </p>
                <p className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red" aria-hidden />
                  {BRAND.hoursShort}
                </p>
                <p className="pt-2 text-muted">
                  {RATING.value.toFixed(1)} from {RATING.count} Google reviews ·{" "}
                  {RATING.asOf}
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <QuoteForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
