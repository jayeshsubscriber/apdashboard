"use client";

import { useEffect } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { getCustomerDetail } from "./customer-detail-data";
import { ClientProfileCard } from "./detail/ClientProfileCard";
import { FinancialOverviewCard } from "./detail/FinancialOverviewCard";
import { EquityHoldingsCard } from "./detail/EquityHoldingsCard";
import { MutualFundHoldingsCard } from "./detail/MutualFundHoldingsCard";
import { RecentTradesCard } from "./detail/RecentTradesCard";
import { AumBreakdownChart } from "./detail/AumBreakdownChart";
import { PnlSummaryCard } from "./detail/PnlSummaryCard";
import { ActivityTimeline } from "./detail/ActivityTimeline";

type Props = {
  ucc: string;
  onBack: () => void;
};

const REPORTS = ["P&L Report", "Trade Report", "Holding Report"] as const;

export function CustomerDetailView({ ucc, onBack }: Props) {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [ucc]);

  const detail = getCustomerDetail(ucc);

  if (!detail) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-muted-foreground text-sm">
            Customer with UCC <span className="font-semibold">{ucc}</span> not found.
          </div>
          <button
            type="button"
            onClick={onBack}
            className="mt-3 h-8 rounded-md border border-border bg-background px-3 text-sm font-semibold text-foreground hover:bg-muted"
          >
            Go Back
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 px-3 sm:px-6 py-4">
      {/* Header Area */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-muted"
          aria-label="Back to customers"
        >
          <ArrowLeft size={16} />
        </button>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Customer Details
        </h2>
        <span className="inline-flex rounded-sm border border-border bg-muted/20 px-2 py-0.5 text-[11px] font-semibold text-foreground">
          {ucc}
        </span>
      </div>

      <div className="mt-1 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
          {detail.profile.name}
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          {REPORTS.map((report) => (
            <button
              key={report}
              type="button"
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs font-semibold text-foreground hover:bg-muted"
            >
              <Download size={13} />
              {report}
            </button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className="mt-4 grid grid-cols-12 gap-4 items-start">
        {/* Left Column */}
        <div className="col-span-12 md:col-span-8 flex flex-col gap-4">
          <ClientProfileCard profile={detail.profile} />
          <FinancialOverviewCard financial={detail.financial} />
          <EquityHoldingsCard holdings={detail.equityHoldings} />
          <MutualFundHoldingsCard holdings={detail.mfHoldings} />
          <RecentTradesCard trades={detail.recentTrades} />
        </div>

        {/* Right Column */}
        <aside className="col-span-12 md:col-span-4 md:sticky md:top-20 flex flex-col gap-4">
          <AumBreakdownChart breakdown={detail.aumBreakdown} />
          <PnlSummaryCard pnl={detail.pnlSummary} />
          <ActivityTimeline activities={detail.activities} />
        </aside>
      </div>
    </main>
  );
}
