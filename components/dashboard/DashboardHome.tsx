"use client";

import { CurrentMonthEarningCard } from "./CurrentMonthEarningCard";
import { PayoutSummaryCard } from "./PayoutSummaryCard";
import { BusinessOpportunitiesCard } from "./BusinessOpportunitiesCard";
import { MFTrailBannerCard } from "./MFTrailBannerCard";
import { EarningPotentialCard } from "./EarningPotentialCard";

export function DashboardHome() {
  return (
    <main className="flex-1 py-3">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-9 flex flex-col gap-3">
          <CurrentMonthEarningCard />
          <PayoutSummaryCard />
          <EarningPotentialCard />
          {/* Mobile: banner appears right after Revenue Summary */}
          <div className="lg:hidden">
            <MFTrailBannerCard />
          </div>
          <BusinessOpportunitiesCard />
        </div>

        {/* Desktop: banner sits in the right column, aligned with the top two sections */}
        <aside className="hidden lg:flex lg:col-span-3 flex-col gap-3">
          <MFTrailBannerCard />
        </aside>
      </div>
    </main>
  );
}

