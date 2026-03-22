"use client";

import { useState } from "react";
import { WealthProductsCard } from "@/components/dashboard/WealthProductsCard";
import { ProductTilesBar, type ProductCategory } from "./ProductTilesBar";
import { TrendingSection } from "./TrendingSection";
import { MutualFundsSection } from "./MutualFundsSection";

function ComingSoonPane({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center py-24 text-muted-foreground">
      <p className="text-sm font-medium">{label} — coming soon</p>
    </div>
  );
}

export function ServicingHome() {
  const [active, setActive] = useState<ProductCategory>("stocks");

  return (
    <main>
      <ProductTilesBar active={active} onSelect={setActive} />

      <div>
        {(active === "advisory" || active === "ipos") && <WealthProductsCard />}
        {active === "stocks"          && <><TrendingSection /><MutualFundsSection /></>}
        {active === "mutual-funds"    && <MutualFundsSection />}
        {active === "fo"              && <ComingSoonPane label="F&O" />}
        {active === "fixed-deposits"  && <ComingSoonPane label="Fixed Deposits" />}
        {active === "bonds"           && <ComingSoonPane label="Bonds" />}
        {active === "insurance"       && <ComingSoonPane label="Insurance" />}
      </div>
    </main>
  );
}
