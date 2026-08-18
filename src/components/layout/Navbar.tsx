"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND, NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Wordmark from "./Wordmark";
import { trackCall } from "./callTracking";

/**
 * THE HEADER IS THE BANNER.
 *
 * His shop banner is a black field carrying the cyan wordmark, the phone
 * number, and RESTORE PROTECT RESTYLE MAINTAIN in letterspaced caps over an
 * edge to edge hairline rule. So the header is always the shop plane, the nav
 * labels are always upright letterspaced caps, and the bottom edge is always
 * the datum rule. It never goes transparent and it never changes height,
 * which means there is no scroll listener in here at all: one less thing to
 * jank on a phone and one less source of layout shift.
 *
 * No icon set anywhere, per the design direction. The menu control is three
 * hairlines in a hairline box, the caret is a stroke, and the call control is
 * the word CALL. Nothing here is a glyph out of a library.
 *
 * Keyboard: every dropdown is a real disclosure button with aria-expanded,
 * openable with Enter, Space or ArrowDown and closable with Escape. Nothing
 * on this site is reachable by hover only.
 */

function Caret({ open }: { open: boolean }) {
  return (
    <svg
      width="9"
      height="6"
      viewBox="0 0 9 6"
      aria-hidden
      focusable="false"
      className={cn("transition-transform duration-200", open && "rotate-180")}
    >
      <path
        d="M0.8 1.1 4.5 4.6 8.2 1.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

const NAV_LABEL =
  "font-display text-[0.8125rem] font-medium uppercase tracking-[0.14em]";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const groupBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  /* close everything on route change */
  useEffect(() => {
    setMenuOpen(false);
    setOpenGroup(null);
  }, [pathname]);

  /* Scroll lock. The scrollbar width is paid back as body padding, otherwise
     locking the body reflows the whole page sideways the moment the menu
     opens on a trackpad machine. */
  useEffect(() => {
    if (!menuOpen) return;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
    };
  }, [menuOpen]);

  /* Focus trap, Escape to close, focus handed back to the control that
     opened the menu. */
  useEffect(() => {
    if (!menuOpen) return;
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      const panel = panelRef.current;
      if (!panel) return;

      if (e.key === "Escape") {
        e.preventDefault();
        setMenuOpen(false);
        return;
      }
      if (e.key !== "Tab") return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (!panel.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      toggleRef.current?.focus();
    };
  }, [menuOpen]);

  const isActive = (href: string, children?: readonly { href: string }[]) => {
    if (pathname === href) return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return Boolean(children?.some((c) => pathname.startsWith(c.href)));
  };

  return (
    <>
      {/* The utility strip is the banner itself: his tagline in letterspaced
          caps on black, with the address, the hours and the number. */}
      <div className="hidden bg-shop-060 text-ink-300 md:block">
        <div className="container-site flex h-8 items-center justify-between gap-6 font-mono text-[0.6875rem] uppercase tracking-[0.16em]">
          <span className="truncate text-spec-000">
            {BRAND.taglineWords.join(" · ")}
          </span>
          <span className="flex shrink-0 items-center gap-6">
            <span className="tone-muted hidden xl:inline">
              {BRAND.street}, {BRAND.city}, {BRAND.state} {BRAND.zip}
            </span>
            <span className="tone-muted">{BRAND.hoursShort}</span>
            <a
              href={`tel:${BRAND.phoneTel}`}
              onClick={() => trackCall("header_utility")}
              className="text-spec-000 transition-colors hover:text-cyan-300"
            >
              {BRAND.phoneDisplay}
            </a>
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-shop-000 text-spec-000">
        <div className="container-site flex h-[60px] items-center justify-between gap-4 lg:h-[72px]">
          <Link href="/" aria-label="Petty Shine, home" className="shrink-0">
            <Wordmark size="sm" decorative className="lg:hidden" />
            <Wordmark size="md" decorative className="hidden lg:block" />
          </Link>

          {/* desktop navigation */}
          <nav aria-label="Main" className="hidden min-w-0 self-stretch lg:block">
            <ul className="flex h-full items-center gap-1">
              {NAV_LINKS.map((link) => {
                const children = "children" in link ? link.children : undefined;
                const active = isActive(link.href, children);
                const groupOpen = openGroup === link.href;
                const menuId = `nav-menu-${link.label.toLowerCase()}`;

                const label = (extra: string) => (
                  <>
                    {link.label}
                    {active && (
                      <span
                        aria-hidden
                        className={cn(
                          "absolute bottom-1.5 block h-px bg-cyan-500",
                          extra,
                        )}
                      />
                    )}
                  </>
                );

                if (!children) {
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          NAV_LABEL,
                          "relative block px-3 py-3 transition-colors",
                          active
                            ? "text-cyan-300"
                            : "text-spec-000 hover:text-cyan-300",
                        )}
                      >
                        {label("inset-x-3")}
                      </Link>
                    </li>
                  );
                }

                return (
                  <li
                    key={link.href}
                    className="relative flex h-full items-center"
                    onMouseEnter={() => setOpenGroup(link.href)}
                    onMouseLeave={() => setOpenGroup(null)}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                        setOpenGroup((g) => (g === link.href ? null : g));
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Escape" && groupOpen) {
                        e.stopPropagation();
                        setOpenGroup(null);
                        groupBtnRefs.current[link.href]?.focus();
                      }
                    }}
                  >
                    <span className="flex items-center">
                      <Link
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          NAV_LABEL,
                          "relative block py-3 pl-3 pr-1 transition-colors",
                          active
                            ? "text-cyan-300"
                            : "text-spec-000 hover:text-cyan-300",
                        )}
                      >
                        {label("left-3 right-1")}
                      </Link>
                      <button
                        type="button"
                        ref={(el) => {
                          groupBtnRefs.current[link.href] = el;
                        }}
                        aria-expanded={groupOpen}
                        /* The panel is only in the DOM while it is open, and
                           aria-controls pointing at an id that does not exist
                           is an invalid reference, so it is only written while
                           there is something to point at. Same rule as the
                           mobile toggle below. */
                        aria-controls={groupOpen ? menuId : undefined}
                        aria-label={`${link.label} services`}
                        onClick={() =>
                          setOpenGroup(groupOpen ? null : link.href)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "ArrowDown") {
                            e.preventDefault();
                            setOpenGroup(link.href);
                            requestAnimationFrame(() => {
                              document
                                .getElementById(menuId)
                                ?.querySelector<HTMLAnchorElement>("a")
                                ?.focus();
                            });
                          }
                        }}
                        className={cn(
                          "px-2 py-3 transition-colors",
                          active
                            ? "text-cyan-300"
                            : "text-ink-300 hover:text-cyan-300",
                        )}
                      >
                        <Caret open={groupOpen} />
                      </button>
                    </span>

                    {groupOpen && (
                      <ul
                        id={menuId}
                        className="absolute left-0 top-full w-[270px] border border-rule-dark border-t-cyan-500 bg-shop-060"
                      >
                        {children.map((c) => (
                          <li key={c.href}>
                            <Link
                              href={c.href}
                              className="block border-b border-rule-dark px-4 py-3 text-[0.875rem] text-spec-000 transition-colors last:border-b-0 hover:bg-shop-120 hover:text-cyan-300"
                            >
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2 md:gap-3">
            {/* THE NUMBER COMES DOWN TO 1024, NOT 1280.
                The utility strip above scrolls away after 32px, the mobile
                CALL control stops at 1024 and the call rail used to stop
                there too, so a laptop at 1024 to 1279 had no phone number
                on screen from the moment it started scrolling. The header
                is the one thing that is sticky at that width, so the number
                lives here from 1024 up. There is no room for the number and
                the GET A QUOTE button side by side at 1024, so the button
                waits for 1280 and the call rail carries the quote action in
                between. See StickyCallBar. */}
            <a
              href={`tel:${BRAND.phoneTel}`}
              onClick={() => trackCall("header")}
              className="hidden font-mono text-[0.8125rem] tabular-nums text-spec-000 transition-colors hover:text-cyan-300 lg:block"
            >
              {BRAND.phoneDisplay}
            </a>

            {/* Mobile call control. Not a glyph: the word, in a 44px box.
                The responsive display sits on the wrapper because .btn sets
                display: inline-flex unlayered, which beats a `lg:hidden`
                utility no matter the specificity. */}
            <span className="lg:hidden">
              <a
                href={`tel:${BRAND.phoneTel}`}
                onClick={() => trackCall("header_mobile")}
                aria-label={`Call Petty Shine on ${BRAND.phoneDisplay}`}
                className="btn btn-sm btn-outline h-11"
              >
                Call
              </a>
            </span>

            <span className="hidden xl:block">
              <Link href="/quote/" className="btn btn-sm btn-outline">
                Get a quote
              </Link>
            </span>

            <button
              type="button"
              ref={toggleRef}
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls={menuOpen ? "mobile-menu" : undefined}
              aria-label="Open menu"
              className="flex h-11 w-11 items-center justify-center border border-rule-dark transition-colors hover:border-cyan-500 lg:hidden"
            >
              <span aria-hidden className="flex flex-col gap-[5px]">
                <span className="block h-px w-5 bg-cyan-500" />
                <span className="block h-px w-5 bg-spec-000" />
                <span className="block h-px w-5 bg-spec-000" />
              </span>
            </button>
          </div>
        </div>

        {/* the motif, running edge to edge under the lockup, exactly the
            hairline that runs under the tagline on his banner */}
        <span
          aria-hidden
          className="datum-rule pointer-events-none absolute inset-x-0 bottom-0"
        />
      </header>

      {menuOpen && (
        <div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[60] flex flex-col bg-shop-000 text-spec-000 lg:hidden"
        >
          <div className="relative shrink-0">
            <div className="container-site flex h-[60px] items-center justify-between">
              <Link href="/" aria-label="Petty Shine, home">
                <Wordmark size="sm" decorative />
              </Link>
              <button
                type="button"
                ref={closeRef}
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center border border-rule-dark text-spec-000 transition-colors hover:border-cyan-500 hover:text-cyan-300"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  aria-hidden
                  focusable="false"
                >
                  <path
                    d="M1 1 15 15M15 1 1 15"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                </svg>
              </button>
            </div>
            <span
              aria-hidden
              className="datum-rule pointer-events-none absolute inset-x-0 bottom-0"
            />
          </div>

          <div className="container-site min-h-0 flex-1 overflow-y-auto overscroll-contain pb-10 pt-2">
            <nav aria-label="Main">
              <ul>
                {NAV_LINKS.map((link) => {
                  const children =
                    "children" in link ? link.children : undefined;
                  const active = isActive(link.href, children);
                  return (
                    <li
                      key={link.href}
                      className="border-b border-rule-dark py-1"
                    >
                      <Link
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "block py-3 font-display text-[1.375rem] font-medium uppercase tracking-[0.1em]",
                          active ? "text-cyan-300" : "text-spec-000",
                        )}
                      >
                        {link.label}
                      </Link>
                      {children && (
                        <ul className="pb-3">
                          {children.map((c) => (
                            <li key={c.href}>
                              <Link
                                href={c.href}
                                className="block py-2 pl-4 text-[0.9375rem] text-ink-300"
                              >
                                {c.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="mt-8 grid gap-3">
              <Link href="/quote/" className="btn btn-primary btn-block btn-lg">
                Get a quote
              </Link>
              <a
                href={`tel:${BRAND.phoneTel}`}
                onClick={() => trackCall("mobile_menu")}
                className="btn btn-outline btn-block btn-lg"
              >
                {BRAND.phoneDisplay}
              </a>
            </div>

            <dl className="mt-9 border-t border-rule-dark pt-5">
              <div className="kv-row">
                <dt className="kv-key">Shop</dt>
                <dd className="kv-value">
                  {BRAND.street}
                  <br />
                  {BRAND.city}, {BRAND.state} {BRAND.zip}
                </dd>
              </div>
              <div className="kv-row">
                <dt className="kv-key">Hours</dt>
                <dd className="kv-value">{BRAND.hoursShort}</dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </>
  );
}
