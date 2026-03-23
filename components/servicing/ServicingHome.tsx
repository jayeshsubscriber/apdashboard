"use client";

import { WealthProductsCard } from "@/components/dashboard/WealthProductsCard";
import { ProductTilesBar, type ProductCategory } from "./ProductTilesBar";
import { TrendingSection } from "./TrendingSection";
import { MutualFundsSection } from "./MutualFundsSection";
import { AdvisorySection } from "./AdvisorySection";

const SERVICING_SECTION_IDS: Record<ProductCategory, string> = {
  stocks: "servicing-stocks",
  "mutual-funds": "servicing-mutual-funds",
  advisory: "servicing-advisory",
  ipos: "servicing-ipos",
  "fixed-deposits": "servicing-fixed-deposits",
  bonds: "servicing-bonds",
  insurance: "servicing-insurance",
};

function scrollToServicingSection(id: ProductCategory) {
  const el = document.getElementById(SERVICING_SECTION_IDS[id]);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const SECTION_SCROLL_CLASS = "scroll-mt-20 md:scroll-mt-16";

export function ServicingHome() {
  return (
    <main>
      <ProductTilesBar onNavigate={scrollToServicingSection} />

      <div>
        <section id={SERVICING_SECTION_IDS.stocks} className={SECTION_SCROLL_CLASS}>
          <TrendingSection />
        </section>
        <section id={SERVICING_SECTION_IDS["mutual-funds"]} className={SECTION_SCROLL_CLASS}>
          <MutualFundsSection />
        </section>
        <section id={SERVICING_SECTION_IDS.advisory} className={SECTION_SCROLL_CLASS}>
          <AdvisorySection />
        </section>
        <section id={SERVICING_SECTION_IDS.ipos} className={SECTION_SCROLL_CLASS}>
          <WealthProductsCard />
        </section>
      </div>
    </main>
  );
}
