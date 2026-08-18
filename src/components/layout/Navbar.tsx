"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, ChevronDown, MapPin } from "lucide-react";
import { BRAND, NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Wordmark from "./Wordmark";
import ScrollProgress from "@/components/fx/ScrollProgress";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setOpenGroup(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* utility strip, local proof before anything else loads */}
      <div className="hidden bg-ink text-light-2 md:block">
        <div className="container-wide flex h-9 items-center justify-between font-mono text-[0.6875rem] uppercase tracking-[0.16em]">
          <span className="flex items-center gap-2">
            <MapPin className="h-3 w-3 text-red" aria-hidden />
            {BRAND.street}, {BRAND.city}, {BRAND.state}
          </span>
          <span className="flex items-center gap-6">
            <span className="text-dim">{BRAND.hoursShort}</span>
            <a
              href={`tel:${BRAND.phoneTel}`}
              className="text-white transition-colors hover:text-red"
            >
              Call or text {BRAND.phoneDisplay}
            </a>
          </span>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-all duration-300",
          scrolled
            ? "border-line bg-paper/95 backdrop-blur-md"
            : "border-transparent bg-paper"
        )}
      >
        <ScrollProgress />
        <div className="container-wide flex h-[68px] items-center justify-between gap-6 md:h-[76px]">
          <Link href="/" aria-label="HD Auto Studio home" className="shrink-0">
            <Wordmark size="md" />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => {
              const children = "children" in link ? link.children : undefined;
              const active = pathname.startsWith(link.href);
              if (!children) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-3 py-2 font-display text-[0.9375rem] font-semibold uppercase tracking-[0.02em] transition-colors",
                      active ? "text-red" : "text-ink-text hover:text-red"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              }
              return (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setOpenGroup(link.href)}
                  onMouseLeave={() => setOpenGroup(null)}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center gap-1 px-3 py-2 font-display text-[0.9375rem] font-semibold uppercase tracking-[0.02em] transition-colors",
                      active ? "text-red" : "text-ink-text hover:text-red"
                    )}
                  >
                    {link.label}
                    <ChevronDown className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                  {openGroup === link.href && (
                    <div className="absolute left-0 top-full w-[268px] border-t-2 border-red bg-white shadow-[0_24px_48px_-24px_rgba(23,23,26,0.45)]">
                      {children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          className="block border-b border-line px-4 py-3 text-sm text-body transition-colors last:border-0 hover:bg-paper-2 hover:text-red"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${BRAND.phoneTel}`}
              className="hidden items-center gap-2 font-mono text-sm font-medium text-ink-text transition-colors hover:text-red md:flex lg:hidden xl:flex"
            >
              <Phone className="h-4 w-4 text-red" aria-hidden />
              {BRAND.phoneDisplay}
            </a>
            <Link href="/quote/" className="btn btn-primary btn-sm hidden sm:inline-flex">
              Get my price
            </Link>
            <button
              onClick={() => setOpen(true)}
              className="p-2 text-ink-text lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* mobile panel */}
      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-ink text-light lg:hidden">
          <div className="container-site flex h-[68px] shrink-0 items-center justify-between">
            <Wordmark size="md" tone="light" />
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-2">
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="container-site flex-1 overflow-y-auto pb-8 pt-2">
            {NAV_LINKS.map((link) => {
              const children = "children" in link ? link.children : undefined;
              return (
                <div key={link.href} className="border-b border-white/10 py-1">
                  <Link
                    href={link.href}
                    className="block py-3 font-display text-2xl font-bold uppercase tracking-tight text-white"
                  >
                    {link.label}
                  </Link>
                  {children && (
                    <div className="pb-3">
                      {children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          className="block py-1.5 pl-4 text-[0.9375rem] text-light-2"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <Link
              href="/contact/"
              className="block border-b border-white/10 py-4 font-display text-2xl font-bold uppercase tracking-tight text-white"
            >
              Contact
            </Link>

            <div className="mt-7 grid gap-3">
              <Link href="/quote/" className="btn btn-primary btn-block btn-lg">
                Get my price
              </Link>
              <a
                href={`tel:${BRAND.phoneTel}`}
                className="btn btn-outline-light btn-block btn-lg"
              >
                <Phone className="h-4 w-4" /> {BRAND.phoneDisplay}
              </a>
            </div>
            <p className="mt-6 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-dim">
              {BRAND.street}
              <br />
              {BRAND.city}, {BRAND.state} {BRAND.zip}
              <br />
              {BRAND.hoursShort}
            </p>
          </nav>
        </div>
      )}
    </>
  );
}
