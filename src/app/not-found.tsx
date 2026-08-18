import Link from "next/link";
import RuleLabel from "@/components/ui/RuleLabel";
import { BRAND } from "@/lib/constants";

export default function NotFound() {
  return (
    <section className="on-wall section">
      <div className="container-site">
        <RuleLabel tone="light">404</RuleLabel>
        <h1 className="display-lg mt-6 text-white">
          That page took a wrong turn on US-23.
        </h1>
        <p className="mt-5 max-w-lg leading-relaxed text-light-2">
          The link is dead, but the shop isn&apos;t. Head back to the pricing page or
          call and we&apos;ll point you at what you were looking for.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/pricing/" className="btn btn-primary btn-lg">
            See pricing
          </Link>
          <a href={`tel:${BRAND.phoneTel}`} className="btn btn-outline-light btn-lg">
            Call {BRAND.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
