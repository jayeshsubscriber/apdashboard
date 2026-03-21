import type { MutualFundHolding } from "../customer-detail-data";
import { formatINR } from "../customer-detail-data";

type Props = { holdings: MutualFundHolding[] };

const COL_GRID =
  "grid grid-cols-[minmax(140px,1.5fr)_80px_60px_70px_90px_90px_90px_70px]";

function retClass(v: number) {
  if (v > 0) return "text-emerald-700";
  if (v < 0) return "text-rose-700";
  return "text-foreground";
}

export function MutualFundHoldingsCard({ holdings }: Props) {
  const totalInvested = holdings.reduce((s, h) => s + h.invested, 0);
  const totalCurrent = holdings.reduce((s, h) => s + h.currentValue, 0);
  const totalReturns = totalCurrent - totalInvested;
  const totalRetPct = totalInvested
    ? ((totalReturns / totalInvested) * 100).toFixed(2)
    : "0";

  return (
    <section className="rounded-md border border-border bg-card overflow-hidden">
      <div className="p-4 pb-0">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          Mutual Fund Holdings
        </h3>
      </div>
      <div className="mt-3 overflow-x-auto">
        <div
          className={`${COL_GRID} border-b border-border bg-muted/20 px-4 py-2 text-xs font-semibold text-muted-foreground`}
        >
          <div>Fund Name</div>
          <div>Folio</div>
          <div className="text-right">Units</div>
          <div className="text-right">NAV</div>
          <div className="text-right">Invested</div>
          <div className="text-right">Current Val.</div>
          <div className="text-right">Returns</div>
          <div className="text-right">Returns %</div>
        </div>
        {holdings.map((h) => (
          <div
            key={h.folio}
            className={`${COL_GRID} border-b border-border px-4 py-2 text-[13px] last:border-b-0`}
          >
            <div className="font-medium text-foreground truncate pr-2">
              {h.fundName}
            </div>
            <div className="text-muted-foreground font-mono text-xs">
              {h.folio}
            </div>
            <div className="text-right text-muted-foreground">
              {h.units.toFixed(2)}
            </div>
            <div className="text-right text-muted-foreground">
              {h.nav.toFixed(2)}
            </div>
            <div className="text-right text-muted-foreground">
              {formatINR(h.invested)}
            </div>
            <div className="text-right text-muted-foreground">
              {formatINR(h.currentValue)}
            </div>
            <div className={`text-right font-medium ${retClass(h.returns)}`}>
              {formatINR(h.returns)}
            </div>
            <div
              className={`text-right font-medium ${retClass(h.returnsPercent)}`}
            >
              {h.returnsPercent > 0 ? "+" : ""}
              {h.returnsPercent}%
            </div>
          </div>
        ))}
        <div
          className={`${COL_GRID} border-t border-border bg-muted/10 px-4 py-2 text-[13px] font-semibold`}
        >
          <div className="text-foreground">Total</div>
          <div />
          <div />
          <div />
          <div className="text-right text-foreground">
            {formatINR(totalInvested)}
          </div>
          <div className="text-right text-foreground">
            {formatINR(totalCurrent)}
          </div>
          <div className={`text-right ${retClass(totalReturns)}`}>
            {formatINR(totalReturns)}
          </div>
          <div className={`text-right ${retClass(Number(totalRetPct))}`}>
            {Number(totalRetPct) > 0 ? "+" : ""}
            {totalRetPct}%
          </div>
        </div>
      </div>
    </section>
  );
}
