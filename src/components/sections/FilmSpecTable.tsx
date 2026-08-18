import type { FilmSpec } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Eastman's published performance data for one film line.
 *
 * Six numeric columns will never be readable on a phone, so below md each
 * shade becomes its own card: the shade name and light transmission lead,
 * then the four performance figures in a 2x2. No horizontal scrolling
 * anywhere, at any width.
 */
export default function FilmSpecTable({
  rows,
  accent,
}: {
  rows: FilmSpec[];
  accent?: boolean;
}) {
  return (
    <div className="min-w-0">
      {/* phones */}
      <div className="grid gap-3 sm:grid-cols-2 md:hidden">
        {rows.map((r) => (
          <div key={r.shade} className="plate-flat p-4">
            <div className="flex items-baseline justify-between gap-3 border-b border-line pb-3">
              <span className="font-display text-lg font-bold uppercase tracking-tight text-ink-text">
                {r.shade}
              </span>
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">
                {r.vlt}% light through
              </span>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
              {[
                { l: "Heat rejected", v: `${r.tser}%`, hot: accent },
                { l: "Infrared", v: `${r.ir}%`, hot: accent },
                { l: "UV blocked", v: `${r.uv}%`, hot: false },
                { l: "Glare cut", v: `${r.glare}%`, hot: false },
              ].map((c) => (
                <div key={c.l}>
                  <dt className="font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-muted">
                    {c.l}
                  </dt>
                  <dd
                    className={cn(
                      "price mt-0.5 text-[1.125rem] leading-none",
                      c.hot && "text-red"
                    )}
                  >
                    {c.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      {/* tablet and up */}
      <div className="hidden md:block">
        <table className="data-table w-full">
          <thead>
            <tr>
              <th>Shade</th>
              <th className="text-right">Visible light</th>
              <th className="text-right">Solar energy rejected</th>
              <th className="text-right">Infrared rejected</th>
              <th className="text-right">UV</th>
              <th className="text-right">Glare cut</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.shade}>
                <td className="font-display font-bold uppercase tracking-tight text-ink-text">
                  {r.shade}
                </td>
                <td className="num text-right">{r.vlt}%</td>
                <td className={cn("num text-right", accent && "text-red")}>{r.tser}%</td>
                <td className={cn("num text-right", accent && "text-red")}>{r.ir}%</td>
                <td className="num text-right">{r.uv}%</td>
                <td className="num text-right text-muted">{r.glare}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
