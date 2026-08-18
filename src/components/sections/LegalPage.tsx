import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Section from "@/components/ui/Section";
import RuleLabel from "@/components/ui/RuleLabel";

export interface LegalBlock {
  h: string;
  p: string[];
}

/**
 * The shell both legal pages share.
 *
 * Paper plane, narrow measure, one ruled heading per block. Legal copy
 * is prose, so none of it is set in mono: on this site mono means a
 * sourced fact, and a policy paragraph is not one. The only mono here
 * is the "last updated" line, which is a date.
 */
export default function LegalPage({
  title,
  updated,
  intro,
  blocks,
  crumb,
}: {
  title: string;
  updated: string;
  intro: string;
  blocks: LegalBlock[];
  crumb: string;
}) {
  return (
    <>
      <Breadcrumbs plane="sheet" trail={[{ label: title, href: crumb }]} />

      <Section plane="sheet" width="tight" label="Legal">
        <h1 className="ps-display ps-display-lg">{title}</h1>

        <RuleLabel className="mt-4 block">Last updated {updated}</RuleLabel>

        <div className="ps-prose mt-7">
          <p>{intro}</p>
        </div>

        <div className="mt-12 space-y-11">
          {blocks.map((b) => (
            <div key={b.h}>
              <h2 className="ps-heading border-t border-rule-light pt-4 text-xl">
                {b.h}
              </h2>
              <div className="ps-prose mt-4">
                {b.p.map((para) => (
                  <p key={para.slice(0, 40)}>{para}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

export { LegalPage };
