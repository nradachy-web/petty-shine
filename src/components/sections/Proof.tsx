import { BRAND, DIFFERENTIATORS, PROCESS_STEPS, RATING } from "@/lib/constants";
import RuleLabel from "@/components/ui/RuleLabel";
import Photo from "@/components/ui/Photo";
import CountUp from "@/components/fx/CountUp";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

/** Thin strip of hard numbers, directly under the hero, counting up as it enters. */
export function ProofBar() {
  const stats = [
    { to: RATING.value, decimals: 1, suffix: "", l: `Google rating · ${RATING.count} reviews` },
    { to: new Date().getFullYear() - BRAND.founded, decimals: 0, suffix: "+", l: "Years in Whitmore Lake" },
    { to: 105, decimals: 0, suffix: "", l: "Reviews. 103 of them five stars" },
    { to: 0, decimals: 0, suffix: "", l: "Prices hidden behind a phone call" },
  ];
  return (
    <section id="after-hero" className="scroll-mt-24 border-b border-line bg-paper-2">
      <RevealGroup className="container-wide grid grid-cols-2 gap-px bg-line md:grid-cols-4" stagger={0.1}>
        {stats.map((s) => (
          <RevealItem key={s.l} className="bg-paper-2 px-2 py-7 text-center md:py-9" y={14}>
            <p className="price text-[2.5rem] leading-none md:text-[3rem]">
              <CountUp to={s.to} decimals={s.decimals} suffix={s.suffix} />
            </p>
            <p className="mx-auto mt-2 max-w-[26ch] font-mono text-[0.625rem] uppercase leading-relaxed tracking-[0.12em] text-muted">
              {s.l}
            </p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}

/** Why this shop, in four numbered claims that are all checkable. */
export function WhyPanel() {
  return (
    <section className="on-wall section grain relative overflow-hidden">
      <div className="container-wide relative">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <RuleLabel tone="light">Why here</RuleLabel>
            <h2 className="display-lg mt-6 text-white">
              A one-man shop is a feature, not a limitation.
            </h2>
            <p className="mt-6 leading-relaxed text-light-2">
              Justin Warwick has been installing film and correcting paint in
              Whitmore Lake since {BRAND.founded}. He answers the phone, quotes the
              job, and does the work. There is no service writer between you and the
              person holding the squeegee.
            </p>
            <div className="mt-9 aspect-[4/3] overflow-hidden">
              <Photo
                id="ppf-corvette-c8-install"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </div>
          </div>

          <div className="lg:col-span-7 lg:pl-6">
            {DIFFERENTIATORS.map((d) => (
              <div
                key={d.n}
                className="grid gap-3 border-b border-white/10 py-7 first:pt-0 md:grid-cols-12 md:gap-6"
              >
                <span className="font-mono text-[0.6875rem] tracking-[0.2em] text-red md:col-span-2">
                  {d.n}
                </span>
                <h3 className="font-display text-xl font-bold uppercase tracking-tight text-white md:col-span-4">
                  {d.title}
                </h3>
                <p className="leading-relaxed text-light-2 md:col-span-6">{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** How a job actually runs, start to finish. */
export function ProcessPanel() {
  return (
    <section className="section">
      <div className="container-site">
        <div className="max-w-2xl">
          <RuleLabel>How it goes</RuleLabel>
          <h2 className="display-md mt-6">
            Four steps, and you know the number before step three.
          </h2>
        </div>

        <div className="mt-10 grid gap-px bg-line md:grid-cols-4">
          {PROCESS_STEPS.map((s) => (
            <div key={s.n} className="bg-paper p-6 md:p-7">
              <span className="font-mono text-[0.6875rem] tracking-[0.2em] text-red">
                {s.n}
              </span>
              <h3 className="mt-4 font-display text-lg font-bold uppercase leading-tight tracking-tight text-ink-text">
                {s.title}
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-body">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
