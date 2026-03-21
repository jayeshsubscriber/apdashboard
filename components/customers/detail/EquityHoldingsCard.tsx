import type { EquityHolding } from "../customer-detail-data";
import { formatINR } from "../customer-detail-data";

type Props = { holdings: EquityHolding[] };

const COL_GRID =
  "grid grid-cols-[minmax(120px,1.2fr)_50px_80px_80px_90px_90px_90px_70px]";

function pnlClass(v: number) {
  if (v > 0) return "text-emerald-700";
  if (v < 0) return "text-rose-700";
  return "text-foreground";
}

export function EquityHoldingsCard({ holdings }: Props) {
  const totalInvested = holdings.reduce((s, h) => s + h.invested, 0);
  const totalCurrent = holdings.reduce((s, h) => s + h.currentValue, 0);
  const totalPnl = totalCurrent - totalInvested;
  const totalPnlPct = totalInvested ? ((totalPnl / totalInvested) * 100).toFixed(2) : "0";

  return (
    <section className="rounded-md border border-border bg-card overflow-hidden">
      <div className="p-4 pb-0">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          Equity Holdings
        </h3>
      </div>
      <div className="mt-3 overflow-x-auto">
        {/* Header */}
        <div
          className={`${COL_GRID} border-b border-border bg-muted/20 px-4 py-2 text-xs font-semibold text-muted-foreground`}
        >
          <div>Stock</div>
          <div className="text-right">Qty</div>
          <div className="text-right">Avg Price</div>
          <div className="text-right">CMP</div>
          <div className="text-right">Invested</div>
          <div className="text-right">Current Val.</div>
          <div className="text-right">P&L</div>
          <div className="text-right">P&L %</div>
        </div>
        {/* Rows */}
        {holdings.map((h) => (
          <div
            key={h.stockName}
            className={`${COL_GRID} border-b border-border px-4 py-2 text-[13px] last:border-b-0`}
          >
            <div className="font-medium text-foreground truncate">{h.stockName}</div>
            <div className="text-right text-muted-foreground">{h.qty}</div>
            <div className="text-right text-muted-foreground">{formatINR(h.avgPrice)}</div>
            <div className="text-right text-muted-foreground">{formatINR(h.currentPrice)}</div>
            <div className="text-right text-muted-foreground">{formatINR(h.invested)}</div>
            <div className="text-right text-muted-foreground">{formatINR(h.currentValue)}</div>
            <div className={`text-right font-medium ${pnlClass(h.pnl)}`}>
              {formatINR(h.pnl)}
            </div>
            <div className={`text-right font-medium ${pnlClass(h.pnlPercent)}`}>
              {h.pnlPercent > 0 ? "+" : ""}{h.pnlPercent}%
            </div>
          </div>
        ))}
        {/* Totals */}
        <div
          className={`${COL_GRID} border-t border-border bg-muted/10 px-4 py-2 text-[13px] font-semibold`}
        >
          <div className="text-foreground">Total</div>
          <div />
          <div />
          <div />
          <div className="text-right text-foreground">{formatINR(totalInvested)}</div>
          <div className="text-right text-foreground">{formatINR(totalCurrent)}</div>
          <div className={`text-right ${pnlClass(totalPnl)}`}>{formatINR(totalPnl)}</div>
          <div className={`text-right ${pnlClass(Number(totalPnlPct))}`}>
            {Number(totalPnlPct) > 0 ? "+" : ""}{totalPnlPct}%
          </div>
        </div>
      </div>
    </section>
  );
}
