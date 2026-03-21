import type { TradeRecord } from "../customer-detail-data";
import { formatINR } from "../customer-detail-data";

type Props = { trades: TradeRecord[] };

const COL_GRID =
  "grid grid-cols-[90px_minmax(100px,1fr)_70px_60px_50px_80px_90px]";

export function RecentTradesCard({ trades }: Props) {
  return (
    <section className="rounded-md border border-border bg-card overflow-hidden">
      <div className="p-4 pb-0">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          Recent Trades
        </h3>
      </div>
      <div className="mt-3 overflow-x-auto">
        <div
          className={`${COL_GRID} border-b border-border bg-muted/20 px-4 py-2 text-xs font-semibold text-muted-foreground`}
        >
          <div>Date</div>
          <div>Instrument</div>
          <div>Segment</div>
          <div>Side</div>
          <div className="text-right">Qty</div>
          <div className="text-right">Price</div>
          <div className="text-right">Value</div>
        </div>
        {trades.map((t, i) => (
          <div
            key={`${t.instrument}-${t.date}-${i}`}
            className={`${COL_GRID} border-b border-border px-4 py-2 text-[13px] last:border-b-0`}
          >
            <div className="text-muted-foreground">{t.date}</div>
            <div className="font-medium text-foreground truncate">{t.instrument}</div>
            <div>
              <span className="inline-flex rounded-sm border border-border bg-muted/20 px-1.5 py-0.5 text-[11px] font-semibold text-foreground">
                {t.segment}
              </span>
            </div>
            <div>
              <span
                className={`inline-flex rounded-sm border px-1.5 py-0.5 text-[11px] font-semibold ${
                  t.side === "Buy"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-rose-200 bg-rose-50 text-rose-700"
                }`}
              >
                {t.side}
              </span>
            </div>
            <div className="text-right text-muted-foreground">{t.qty}</div>
            <div className="text-right text-muted-foreground">{formatINR(t.price)}</div>
            <div className="text-right text-muted-foreground">{formatINR(t.value)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
