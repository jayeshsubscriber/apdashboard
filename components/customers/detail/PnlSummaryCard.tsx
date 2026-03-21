import type { PnlSummary } from "../customer-detail-data";
import { formatINR } from "../customer-detail-data";

type Props = { pnl: PnlSummary };

function valClass(v: number) {
  if (v > 0) return "text-emerald-700";
  if (v < 0) return "text-rose-700";
  return "text-foreground";
}

export function PnlSummaryCard({ pnl }: Props) {
  return (
    <section className="rounded-md border border-border bg-card p-4">
      <h3 className="text-sm font-semibold tracking-tight text-foreground">
        P&L Summary
      </h3>
      <div className="mt-3 space-y-3">
        <div>
          <div className="text-xs font-medium text-muted-foreground">
            Realized P&L
          </div>
          <div className={`mt-0.5 text-lg font-semibold ${valClass(pnl.realizedPnl)}`}>
            {formatINR(pnl.realizedPnl)}
          </div>
        </div>
        <div>
          <div className="text-xs font-medium text-muted-foreground">
            Unrealized P&L
          </div>
          <div className={`mt-0.5 text-lg font-semibold ${valClass(pnl.unrealizedPnl)}`}>
            {formatINR(pnl.unrealizedPnl)}
          </div>
        </div>
        <div className="border-t border-border pt-3">
          <div className="text-xs font-medium text-muted-foreground">
            Total P&L
          </div>
          <div className={`mt-0.5 text-xl font-semibold ${valClass(pnl.totalPnl)}`}>
            {formatINR(pnl.totalPnl)}
          </div>
        </div>
      </div>
    </section>
  );
}
