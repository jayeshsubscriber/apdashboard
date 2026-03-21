"use client";

import { NewClientOnboardingCard } from "@/components/dashboard/NewClientOnboardingCard";
import { ClientOnboardingLeadsPanel } from "@/components/customers/panels/ClientOnboardingLeadsPanel";

export function LeadsHome() {
  return (
    <main className="flex-1">
      <div className="flex flex-col gap-4 w-full">
        <NewClientOnboardingCard />
        <ClientOnboardingLeadsPanel />
      </div>
    </main>
  );
}
