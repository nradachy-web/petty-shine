import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

/** lucide-react v1 dropped brand marks, so the Facebook glyph is inline. */
function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.9h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}
import { BRAND, CITIES, SERVICES } from "@/lib/constants";
import Wordmark from "./Wordmark";

const COMPANY = [
  { label: "About the shop", href: "/about/" },
  { label: "Our work", href: "/gallery/" },
  { label: "Pricing", href: "/pricing/" },
  { label: "FAQ", href: "/faq/" },
  { label: "Contact", href: "/contact/" },
];

export default function Footer() {
  return (
    <footer className="on-wall border-t-2 border-red">
      <div className="container-wide py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Wordmark size="lg" tone="light" />
            <p className="mt-6 max-w-xs text-[0.9375rem] leading-relaxed text-light-2">
              Window tint, paint protection film, ceramic coatings, correction, and
              detailing, installed in-house in Whitmore Lake since {BRAND.founded}.
            </p>

            <div className="mt-7 space-y-3 text-[0.9375rem]">
              <a
                href={`tel:${BRAND.phoneTel}`}
                className="flex items-center gap-3 text-white transition-colors hover:text-red"
              >
                <Phone className="h-4 w-4 shrink-0 text-red" aria-hidden />
                <span className="font-mono">{BRAND.phoneDisplay}</span>
              </a>
              <a
                href={`mailto:${BRAND.email}`}
                className="flex items-center gap-3 text-light-2 transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4 shrink-0 text-red" aria-hidden />
                {BRAND.email}
              </a>
              <a
                href={BRAND.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-light-2 transition-colors hover:text-white"
              >
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-red" aria-hidden />
                <span>
                  {BRAND.street}
                  <br />
                  {BRAND.city}, {BRAND.state} {BRAND.zip}
                </span>
              </a>
              <div className="flex items-start gap-3 text-light-2">
                <Clock className="mt-1 h-4 w-4 shrink-0 text-red" aria-hidden />
                <span>
                  {BRAND.hours.map((h) => (
                    <span key={h.days} className="block">
                      {h.days}: {h.time}
                    </span>
                  ))}
                </span>
              </div>
              <a
                href={BRAND.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-light-2 transition-colors hover:text-white"
              >
                <FacebookIcon className="h-4 w-4 shrink-0 text-red" />
                Facebook
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="rule-top font-mono text-[0.6875rem] uppercase tracking-[0.24em] text-white">
              Services
            </h4>
            <ul className="mt-5 space-y-2.5 text-[0.9375rem]">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <Link
                    href={s.href}
                    className="text-light-2 transition-colors hover:text-red"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/ceramic-window-tint/"
                  className="text-light-2 transition-colors hover:text-red"
                >
                  Ceramic Window Tint
                </Link>
              </li>
              <li>
                <Link
                  href="/llumar-window-film/"
                  className="text-light-2 transition-colors hover:text-red"
                >
                  LLumar ATC vs CTX
                </Link>
              </li>
              <li>
                <Link
                  href="/warranties/"
                  className="text-light-2 transition-colors hover:text-red"
                >
                  Warranties
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="rule-top font-mono text-[0.6875rem] uppercase tracking-[0.24em] text-white">
              Service area
            </h4>
            <ul className="mt-5 space-y-2.5 text-[0.9375rem]">
              {CITIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/window-tinting/${c.slug}/`}
                    className="text-light-2 transition-colors hover:text-red"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="rule-top font-mono text-[0.6875rem] uppercase tracking-[0.24em] text-white">
              Company
            </h4>
            <ul className="mt-5 space-y-2.5 text-[0.9375rem]">
              {COMPANY.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="text-light-2 transition-colors hover:text-red"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-dim md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {BRAND.legalName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/privacy-policy/" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms/" className="transition-colors hover:text-white">
              Terms
            </Link>
            <a
              href="https://www.modernapexstrategies.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              Website &amp; marketing by Modern Apex Strategies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
