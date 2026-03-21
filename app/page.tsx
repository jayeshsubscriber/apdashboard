"use client";

import { useState } from "react";
import { Header } from "@/components/header/Header";
import { DashboardHome } from "@/components/dashboard/DashboardHome";
import { CustomersHome } from "@/components/customers/CustomersHome";
import { BusinessOverview } from "@/components/business/BusinessOverview";

type TabId = "dashboard" | "customers" | "business";
const BUSINESS_PILLS = [
  "Overview",
  "Report",
  "Statement",
  "Withdrawal",
  "GST Invoices",
] as const;
type BusinessPill = (typeof BUSINESS_PILLS)[number];

function ComingSoon({ title }: { title: string }) {
  return (
    <main className="flex-1 flex items-center justify-center">
      <div className="text-muted-foreground text-sm">{title} coming soon.</div>
    </main>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [activeBusinessPill, setActiveBusinessPill] =
    useState<BusinessPill>("Overview");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        partnerName="Rajesh Sharma"
      />

      {activeTab === "business" && (
        <div className="px-4 pt-4">
          <div className="flex w-full items-center gap-2 overflow-x-auto">
            {BUSINESS_PILLS.map((pill) => {
              const isActive = pill === activeBusinessPill;
              return (
                <button
                  key={pill}
                  onClick={() => setActiveBusinessPill(pill)}
                  className={`h-8 rounded-full px-3 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-white text-primary hover:bg-white/90"
                  }`}
                >
                  {pill}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "dashboard" && <DashboardHome />}
      {activeTab === "customers" && <CustomersHome />}
      {activeTab === "business" &&
        (activeBusinessPill === "Overview" ? (
          <BusinessOverview />
        ) : (
          <ComingSoon title={activeBusinessPill} />
        ))}
    </div>
  );
}
