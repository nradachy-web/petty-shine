"use client";

import { useEffect, useState } from "react";
import { readQuoteSubmission, type QuoteSubmission } from "@/lib/gtag";

/**
 * What the visitor just sent, shown back to them on /thank-you/.
 *
 * Read out of sessionStorage, which QuoteForm writes on a successful send, so
 * the page confirms something specific rather than a generic thank you. It
 * renders nothing at all on a direct visit, and nothing is server rendered,
 * so it can never leave an empty box on the page.
 *
 * Rows are hand drawn rather than using the shared KeyValueRow so the whole
 * quote path stays free of cross component dependencies.
 */
export default function QuoteReceipt() {
  const [submission, setSubmission] = useState<QuoteSubmission | null>(null);

  useEffect(() => {
    setSubmission(readQuoteSubmission());
  }, []);

  if (!submission) return null;

  const rows: Array<[string, string]> = [];
  if (submission.name) rows.push(["Name", submission.name]);
  if (submission.vehicle) rows.push(["Vehicle", submission.vehicle]);
  if (submission.service) rows.push(["Service", submission.service]);
  if (submission.packageName) rows.push(["Coverage", submission.packageName]);
  if (rows.length === 0) return null;

  return (
    <div className="min-w-0">
      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-ink-400">
        What you sent
      </p>
      <dl className="mt-3 border-t border-rule-light">
        {rows.map(([k, v]) => (
          <div
            key={k}
            className="flex items-baseline justify-between gap-4 border-b border-rule-light py-3"
          >
            <dt className="font-mono text-[0.75rem] uppercase tracking-[0.14em] text-ink-400">
              {k}
            </dt>
            <dd className="text-right font-mono text-[0.9375rem] tabular-nums text-ink-900">
              {v}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
