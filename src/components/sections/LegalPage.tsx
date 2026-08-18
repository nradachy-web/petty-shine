import Breadcrumbs from "@/components/ui/Breadcrumbs";
import RuleLabel from "@/components/ui/RuleLabel";

export interface LegalBlock {
  h: string;
  p: string[];
}

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
      <Breadcrumbs trail={[{ label: title, href: crumb }]} />
      <section className="section">
        <div className="container-tight">
          <RuleLabel>Legal</RuleLabel>
          <h1 className="display-lg mt-6">{title}</h1>
          <p className="mt-3 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted">
            Last updated {updated}
          </p>
          <p className="mt-7 text-lg leading-relaxed text-body">{intro}</p>

          <div className="mt-12 space-y-10">
            {blocks.map((b) => (
              <div key={b.h}>
                <h2 className="border-t-2 border-ink-text pt-4 font-display text-xl font-bold uppercase tracking-tight text-ink-text">
                  {b.h}
                </h2>
                <div className="mt-4 space-y-4 leading-relaxed text-body">
                  {b.p.map((para) => (
                    <p key={para.slice(0, 40)}>{para}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
