import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, MessageSquare, Car } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { Section, SectionHead, Prose } from "@/components/ui/Section";
import RuleLabel from "@/components/ui/RuleLabel";
import Photo from "@/components/ui/Photo";
import { BRAND, CITIES, SEO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact and Directions | 10170 Industrial Dr, Whitmore Lake MI 48189",
  description: SEO.contact.description,
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  return (
    <>
      <Breadcrumbs trail={[{ label: "Contact", href: "/contact/" }]} />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <RuleLabel>Contact</RuleLabel>
            <h1 className="display-lg mt-6">Talk to the shop</h1>
            <p className="mt-5 leading-relaxed text-body">
              You get Justin, not a call centre. Text is often fastest, send a photo
              of the vehicle with what you want done and you&apos;ll usually have a
              number back the same day.
            </p>

            <div className="mt-9 space-y-3">
              <a
                href={`tel:${BRAND.phoneTel}`}
                className="plate flex items-center gap-4 p-5 transition-colors hover:border-red"
              >
                <Phone className="h-5 w-5 shrink-0 text-red" aria-hidden />
                <span>
                  <span className="block font-display text-xl font-bold uppercase tracking-tight text-ink-text">
                    {BRAND.phoneDisplay}
                  </span>
                  <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">
                    Call or text
                  </span>
                </span>
              </a>

              <a
                href={`sms:${BRAND.phoneTel}`}
                className="plate flex items-center gap-4 p-5 transition-colors hover:border-red"
              >
                <MessageSquare className="h-5 w-5 shrink-0 text-red" aria-hidden />
                <span>
                  <span className="block font-display text-lg font-bold uppercase tracking-tight text-ink-text">
                    Send a text
                  </span>
                  <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">
                    Photos welcome
                  </span>
                </span>
              </a>

              <a
                href={`mailto:${BRAND.email}`}
                className="plate flex items-center gap-4 p-5 transition-colors hover:border-red"
              >
                <Mail className="h-5 w-5 shrink-0 text-red" aria-hidden />
                <span className="min-w-0">
                  <span className="block break-all font-display text-base font-bold uppercase leading-tight tracking-tight text-ink-text sm:text-lg">
                    {BRAND.email}
                  </span>
                  <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">
                    Email the shop
                  </span>
                </span>
              </a>

              <Link href="/quote/" className="btn btn-primary btn-lg btn-block">
                <Car className="h-4 w-4" aria-hidden />
                Build a quote instead
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="aspect-[16/10] overflow-hidden bg-graphite">
              <Photo id="shop-exterior" sizes="(min-width: 1024px) 60vw, 100vw" />
            </div>

            <div className="mt-6 grid gap-px bg-line sm:grid-cols-2">
              <div className="bg-white p-6">
                <h2 className="flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted">
                  <MapPin className="h-4 w-4 text-red" aria-hidden /> The shop
                </h2>
                <address className="mt-4 not-italic leading-relaxed text-ink-text">
                  {BRAND.street}
                  <br />
                  {BRAND.city}, {BRAND.state} {BRAND.zip}
                </address>
                <a
                  href={BRAND.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline mt-4 inline-block text-[0.875rem]"
                >
                  Directions on Google Maps
                </a>
              </div>

              <div className="bg-white p-6">
                <h2 className="flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted">
                  <Clock className="h-4 w-4 text-red" aria-hidden /> Hours
                </h2>
                <dl className="mt-4 space-y-2 text-[0.9375rem]">
                  {BRAND.hours.map((h) => (
                    <div key={h.days}>
                      <dt className="font-medium text-ink-text">{h.days}</dt>
                      <dd className="text-muted">{h.time}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <Prose className="mt-8 max-w-none">
              <h3>Dropping off</h3>
              <p>
                All work is by appointment so every vehicle gets the time it needs.
                Shorter services, most front-window tint, you can wait for in the
                lobby. Longer work stays with us for the day or overnight.
              </p>
              <p>
                For after-hours drop-off, park in the rear lot and use the secure key
                drop box on the side of the building. For after-hours pickup we&apos;ll
                give you a code to get your keys.
              </p>
            </Prose>
          </div>
        </div>
      </Section>

      <Section tone="paper-2">
        <SectionHead
          eyebrow="Getting here"
          title="Measured from each town centre."
          intro="We're just off Main Street in Whitmore Lake, minutes from US-23."
        />
        <div className="mt-8 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {CITIES.map((c) => (
            <div key={c.slug} className="bg-paper-2 p-5">
              <span className="font-display text-lg font-bold uppercase tracking-tight text-ink-text">
                {c.name}
              </span>
              <span className="mt-2 block font-mono text-[0.625rem] uppercase tracking-[0.14em] text-red">
                {c.miles} mi · about {c.minutes} min
              </span>
              <span className="mt-2 block text-[0.8125rem] leading-snug text-muted">
                {c.route}
              </span>
            </div>
          ))}
          <div className="hidden bg-paper-2 sm:block" aria-hidden />
        </div>
      </Section>
    </>
  );
}
