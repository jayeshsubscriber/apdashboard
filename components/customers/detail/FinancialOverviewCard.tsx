import {
  Landmark,
  Layers,
  Wallet,
  BarChart3,
  CircleDollarSign,
  TrendingUp,
} from "lucide-react";
import type { FinancialOverview } from "../customer-detail-data";
import { formatINR } from "../customer-detail-data";

type Props = { financial: FinancialOverview };

const METRICS: {
  key: keyof FinancialOverview;
  label: string;
  icon: typeof Landmark;
}[] = [
  { key: "equityAum", label: "Equity AUM", icon: BarChart3 },
  { key: "mfAum", label: "MF AUM", icon: TrendingUp },
  { key: "totalAum", label: "Total AUM", icon: Landmark },
  { key: "availableToTrade", label: "Available to Trade", icon: Wallet },
  { key: "netLedgerBalance", label: "Net Ledger Balance", icon: CircleDollarSign },
  { key: "brokerageMtd", label: "Brokerage MTD", icon: Layers },
];

export function FinancialOverviewCard({ financial }: Props) {
  return (
    <section className="rounded-md border border-border bg-card p-4">
      <h3 className="text-lg font-semibold tracking-tight text-foreground">
        Financial Overview
      </h3>
      <div className="mt-3 grid grid-cols-3 gap-3">
        {METRICS.map(({ key, label, icon: Icon }) => (
          <div
            key={key}
            className="rounded-md border border-border bg-muted/20 p-3"
          >
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Icon size={14} className="text-primary" />
              <span>{label}</span>
            </div>
            <div className="mt-1 text-xl font-semibold text-foreground leading-none">
              {formatINR(financial[key])}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
