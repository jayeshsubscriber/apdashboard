"use client";

import { CurrentMonthEarningCard } from "./CurrentMonthEarningCard";
import { PayoutSummaryCard } from "./PayoutSummaryCard";
import { NewClientOnboardingCard } from "./NewClientOnboardingCard";
import { ClientReferralLinkCard } from "./ClientReferralLinkCard";
import { BusinessOpportunitiesCard } from "./BusinessOpportunitiesCard";
import { WealthProductsCard } from "./WealthProductsCard";

export function DashboardHome() {
  return (
    <main className="flex-1 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-9 flex flex-col gap-3">
          <CurrentMonthEarningCard />
          <PayoutSummaryCard />
          <NewClientOnboardingCard />
          <BusinessOpportunitiesCard />
          <WealthProductsCard />
        </div>

        <aside className="lg:col-span-3 flex flex-col gap-3">
          <ClientReferralLinkCard />
          <div className="h-[180px] rounded-md border border-border bg-card" />
        </aside>
      </div>
    </main>
  );
}

