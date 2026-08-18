import { Fragment } from "react";
import Link from "next/link";
import {
  BRAND,
  CITIES,
  CREDENTIALS,
  NEAREST_EXIT,
  SERVICES,
} from "@/lib/constants";
import { asset } from "@/lib/asset";
import { milesShort } from "@/lib/utils";
import Wordmark from "./Wordmark";
import CallLink from "./CallLink";

/**
 * The footer is the last sheet of the record: the number, the address, the
 * hours, the numbered service index, the towns, and the two credentials.
 *
 * The credentials are here because both are verified in the manufacturers'
 * own installer directories and his current website mentions neither of them.
 * Each one links straight out to the directory page that lists him, because a
 * claim a customer can check in one tap is worth more than a badge.
 *
 * No icon set, per the design direction. Mono labels do the work icons would.
 */

/** A datum rule with its mono label riding under it, as the motif specifies. */
function ColumnHead({ label, id }: { label: string; id?: string }) {
  return (
    <div className="datum-head">
      <span aria-hidden className="datum-rule" />
      <h2 id={id} className="datum-label">
        {label}
      </h2>
    </div>
  );
}

/** "Randolph, Guilford, Davidson, Forsyth and Alamance counties" */
function countyLine(): string {
  const counties = Array.from(
    new Set(CITIES.map((c) => c.county.replace(/\s+County$/, ""))),
  );
  if (counties.length < 2) return `${counties[0]} County`;
  return `${counties.slice(0, -1).join(", ")} and ${
    counties[counties.length - 1]
  } counties`;
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="plane-shop">
      <span aria-hidden className="datum-rule" />

      <div className="container-site py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-12 md:gap-x-8 md:gap-y-14">
          {/* the shop */}
          <div className="min-w-0 md:col-span-5 lg:col-span-4">
            <Wordmark size="lg" />

            <p className="mt-5 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-spec-000">
              {BRAND.taglineWords.join(" · ")}
            </p>

            <p className="mt-5 max-w-sm text-[0.9375rem] leading-relaxed">
              Ceramic coating, paint protection film, paint correction and
              detailing. One shop, in {BRAND.city}, {BRAND.stateName}.
            </p>

            <dl className="mt-8 border-t border-rule-dark">
              <div className="kv-row">
                <dt className="kv-key shrink-0">Call</dt>
                <dd className="min-w-0">
                  <CallLink
                    placement="footer"
                    className="kv-value tap-24 block text-cyan-300 transition-colors hover:text-cyan-500"
                  >
                    {BRAND.phoneDisplay}
                  </CallLink>
                </dd>
              </div>

              <div className="kv-row">
                <dt className="kv-key shrink-0">Shop</dt>
                <dd className="min-w-0">
                  <a
                    href={BRAND.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="kv-value block transition-colors hover:text-cyan-300"
                  >
                    {BRAND.street}
                    <br />
                    {BRAND.city}, {BRAND.state} {BRAND.zip}
                  </a>
                  <p className="mono-key tone-muted mt-2 text-right text-[0.6875rem] uppercase tracking-[0.14em]">
                    {NEAREST_EXIT.label}, {milesShort(NEAREST_EXIT.miles)}
                  </p>
                </dd>
              </div>

              {BRAND.hours.map((h) => (
                <div key={h.days} className="kv-row">
                  <dt className="kv-key shrink-0">{h.days}</dt>
                  <dd className="kv-value min-w-0">{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* the numbered service index */}
          <nav
            aria-labelledby="footer-services"
            className="min-w-0 md:col-span-4 lg:col-span-3"
          >
            <ColumnHead label="Services" id="footer-services" />
            <ul className="mt-5 space-y-2.5">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <Link
                    href={s.href}
                    className="group flex items-baseline gap-3 text-[0.9375rem] text-spec-000 transition-colors hover:text-cyan-300"
                  >
                    <span className="mono-key text-[0.6875rem] transition-colors group-hover:text-cyan-300">
                      {s.index}
                    </span>
                    <span className="min-w-0">{s.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ----------------------------------------------------------------
              WHERE HE WORKS, AND THE ONLY PLACE THE SIXTEEN TOWNS ARE LINKED
              FROM EVERY PAGE.

              These were sixteen plain <span>s. Read as SEO that meant the town
              pages had no inbound link from any service page at all: five of
              the nine services named a handful of towns in their own copy,
              four named none, and nine towns were reachable only from /areas/
              and from each other. A town page nothing links to is a page
              Google finds through the sitemap and then ranks like an orphan.

              Linking them here fixes it in one place instead of nine, and it
              is the honest version of the fix: the anchor is the town's own
              name under a heading that says Service area, which is what the
              page is about. No keyword stuffing, and the footer looks the
              same. tap-24 is on each one because sixteen mono names at 13px
              is a dense tap target on a phone.
              ---------------------------------------------------------------- */}
          <nav
            aria-labelledby="footer-areas"
            className="min-w-0 md:col-span-3 lg:col-span-3"
          >
            <ColumnHead label="Service area" id="footer-areas" />
            <p className="mt-5 font-mono text-[0.8125rem] leading-[1.9] text-spec-000">
              {CITIES.map((c, i) => (
                /* The separator rides with the town BEFORE it, inside one
                   nowrap wrapper, and the only breakable space is between
                   wrappers. Left on its own it is a breakable token with a
                   space either side, so a wrapped line ended on a stranded
                   dot and the next one opened on another. Now every wrapped
                   line ends "Trinity ·" and the next starts on a name. */
                <Fragment key={c.slug}>
                  <span className="whitespace-nowrap">
                    <Link
                      href={`/areas/${c.slug}/`}
                      className="tap-24 transition-colors hover:text-cyan-300"
                    >
                      {c.name}
                    </Link>
                    {i < CITIES.length - 1 && (
                      <span aria-hidden className="tone-muted">
                        {" ·"}
                      </span>
                    )}
                  </span>
                  {/* the one breakable space, deliberately outside the
                      nowrap wrapper. Inside it, it stops being a break
                      opportunity and the whole list becomes one long line. */}
                  {i < CITIES.length - 1 && " "}
                </Fragment>
              ))}
            </p>
            <p className="tone-muted mt-4 text-[0.8125rem] leading-relaxed">
              {countyLine()}, {BRAND.stateName}.
            </p>
            <p className="mt-3 text-[0.8125rem] leading-relaxed">
              <Link
                href="/areas/"
                className="tap-24 text-cyan-300 transition-colors hover:text-cyan-500"
              >
                Drive times from all {CITIES.length} towns
              </Link>
            </p>
          </nav>

          {/* the rest of the site */}
          <nav
            aria-labelledby="footer-more"
            className="min-w-0 md:col-span-4 lg:col-span-2"
          >
            <ColumnHead label="More" id="footer-more" />
            <ul className="mt-5 space-y-0.5 text-[0.9375rem]">
              <li>
                <Link
                  href="/pricing/"
                  className="tap-24 text-spec-000 transition-colors hover:text-cyan-300"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery/"
                  className="tap-24 text-spec-000 transition-colors hover:text-cyan-300"
                >
                  Our Work
                </Link>
              </li>
              <li>
                <Link
                  href="/about/"
                  className="tap-24 text-spec-000 transition-colors hover:text-cyan-300"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/quote/"
                  className="tap-24 text-cyan-300 transition-colors hover:text-cyan-500"
                >
                  Get a quote
                </Link>
              </li>
            </ul>

            <ul className="mono-key mt-6 space-y-0.5 border-t border-rule-dark pt-5 text-[0.6875rem] uppercase tracking-[0.16em]">
              <li>
                <a
                  href={BRAND.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap-24 transition-colors hover:text-cyan-300"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={BRAND.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap-24 transition-colors hover:text-cyan-300"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href={BRAND.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap-24 transition-colors hover:text-cyan-300"
                >
                  Directions
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* the two verified credentials */}
        <div className="mt-14 min-w-0">
          <ColumnHead label="Credentials" />
          <ul className="mt-5 flex flex-wrap gap-3">
            {CREDENTIALS.map((c) => (
              <li key={c.id}>
                <a
                  href={c.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border border-cyan-500 px-4 py-3 transition-colors hover:bg-shop-060"
                >
                  <span className="block text-[0.9375rem] font-medium text-spec-000">
                    {c.label}
                  </span>
                  <span className="mono-key mt-1 block text-[0.625rem] uppercase tracking-[0.16em]">
                    Listed at {new URL(c.source).hostname.replace(/^www\./, "")}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mono-key mt-14 flex flex-col gap-3 border-t border-rule-dark pt-6 text-[0.625rem] uppercase tracking-[0.12em] md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {year} {BRAND.legalName}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href="/privacy-policy/"
              className="tap-24 transition-colors hover:text-spec-000"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms/"
              className="tap-24 transition-colors hover:text-spec-000"
            >
              Terms
            </Link>
            {/* /llms.txt is the shop written out in plain sentences for an
                assistant to quote: the address, the hours, the nine services,
                both credentials with the directory URL behind each one, the
                sixteen measured towns, and the things this shop does not
                claim. It is generated from src/lib/constants.ts by
                src/app/llms.txt/route.ts, so it cannot drift from the pages.

                It is linked because an unlinked file is a file nothing
                crawls. asset(), not <Link>: it is a flat file, not a route,
                so the subpath preview has to rewrite it by hand. */}
            <a
              href={asset("/llms.txt")}
              className="tap-24 transition-colors hover:text-spec-000"
            >
              llms.txt
            </a>
            <a
              href="https://modernapexstrategies.com"
              target="_blank"
              rel="noopener noreferrer"
              className="tap-24 transition-colors hover:text-spec-000"
            >
              Website &amp; marketing by Modern Apex Strategies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
