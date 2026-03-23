"use client";

import { CurrentMonthEarningCard } from "./CurrentMonthEarningCard";
import { PayoutSummaryCard } from "./PayoutSummaryCard";
import { BusinessOpportunitiesCard } from "./BusinessOpportunitiesCard";
import { MFTrailBannerCard } from "./MFTrailBannerCard";
import { EarningPotentialCard } from "./EarningPotentialCard";
import { SmartSuggestionsCard } from "./SmartSuggestionsCard";
import { ProductTilesBar } from "@/components/servicing/ProductTilesBar";

interface DashboardHomeProps {
  onNavigateToServicing?: () => void;
  onSelectCustomer?: (ucc: string) => void;
}

export function DashboardHome({ onNavigateToServicing, onSelectCustomer }: DashboardHomeProps) {
  return (
    <main className="flex-1 py-3">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-9 flex flex-col gap-3">
          <CurrentMonthEarningCard />
          <PayoutSummaryCard />
          <EarningPotentialCard />
          <ProductTilesBar variant="dashboard" onTileClick={onNavigateToServicing} />
          <BusinessOpportunitiesCard onSelectCustomer={onSelectCustomer} />
          {/* Mobile: Smart Suggestions + banner at bottom */}
          <div className="lg:hidden px-4 flex flex-col gap-3">
            <SmartSuggestionsCard />
            <MFTrailBannerCard />
          </div>
        </div>

        {/* Desktop: Smart Suggestions + MF banner in right column */}
        <aside className="hidden lg:flex lg:col-span-3 flex-col gap-3 pr-4">
          <SmartSuggestionsCard />
          <MFTrailBannerCard />
        </aside>
      </div>
    </main>
  );
}
