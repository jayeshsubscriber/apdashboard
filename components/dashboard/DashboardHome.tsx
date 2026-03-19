"use client";

import { CurrentMonthEarningCard } from "./CurrentMonthEarningCard";
import { PayoutSummaryCard } from "./PayoutSummaryCard";
import { NewClientOnboardingCard } from "./NewClientOnboardingCard";

export function DashboardHome() {
  return (
    <main className="flex-1 p-4">
      <div className="grid grid-cols-12 gap-4 items-start">
        <div className="col-span-9 flex flex-col gap-3">
          <CurrentMonthEarningCard />
          <PayoutSummaryCard />
          <NewClientOnboardingCard />
        </div>

        {/* Reserved space for other right-side sections (Business Metrics, What's New, etc.) */}
        <aside className="col-span-3 flex flex-col gap-3">
          <div className="h-[180px] rounded-md border border-border bg-card" />
        </aside>
      </div>
    </main>
  );
}

