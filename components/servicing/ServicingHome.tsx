"use client";

import { WealthProductsCard } from "@/components/dashboard/WealthProductsCard";

export function ServicingHome() {
  return (
    <main className="flex-1 p-4">
      <div className="flex flex-col gap-3">
        <WealthProductsCard />
      </div>
    </main>
  );
}
