"use client";

import { useState } from "react";
import { Header } from "@/components/header/Header";
import { DashboardHome } from "@/components/dashboard/DashboardHome";
import { CustomersHome } from "@/components/customers/CustomersHome";
import { CustomerDetailView } from "@/components/customers/CustomerDetailView";
import { BusinessOverview } from "@/components/business/BusinessOverview";
import { WithdrawalTab } from "@/components/business/WithdrawalTab";
import { GSTInvoicesTab } from "@/components/business/GSTInvoicesTab";
import { StatementTab } from "@/components/business/StatementTab";
import { ReportTab } from "@/components/business/ReportTab";
import { LeadsHome } from "@/components/leads/LeadsHome";
import { ServicingHome } from "@/components/servicing/ServicingHome";

type TabId = "dashboard" | "customers" | "servicing" | "leads" | "business";
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
  const [selectedCustomerUcc, setSelectedCustomerUcc] = useState<string | null>(null);

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    if (tab !== "customers") setSelectedCustomerUcc(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background pb-[calc(env(safe-area-inset-bottom)+5.25rem)] md:pb-0">
      <Header
        activeTab={activeTab}
        onTabChange={handleTabChange}
        partnerName="Rajesh Sharma"
      />

      {activeTab === "business" && (
        <div className="px-3 sm:px-4 pt-3">
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

      {activeTab === "dashboard" && <DashboardHome onNavigateToServicing={() => handleTabChange("servicing")} />}
      {activeTab === "customers" &&
        (selectedCustomerUcc ? (
          <CustomerDetailView
            ucc={selectedCustomerUcc}
            onBack={() => setSelectedCustomerUcc(null)}
          />
        ) : (
          <CustomersHome onSelectCustomer={setSelectedCustomerUcc} />
        ))}
      {activeTab === "servicing" && <ServicingHome />}
      {activeTab === "leads" && <LeadsHome />}
      {activeTab === "business" && activeBusinessPill === "Overview" && <BusinessOverview />}
      {activeTab === "business" && activeBusinessPill === "Report" && <ReportTab />}
      {activeTab === "business" && activeBusinessPill === "Statement" && <StatementTab />}
      {activeTab === "business" && activeBusinessPill === "Withdrawal" && <WithdrawalTab />}
      {activeTab === "business" && activeBusinessPill === "GST Invoices" && <GSTInvoicesTab />}
      {activeTab === "business" &&
        activeBusinessPill !== "Overview" &&
        activeBusinessPill !== "Report" &&
        activeBusinessPill !== "Statement" &&
        activeBusinessPill !== "Withdrawal" &&
        activeBusinessPill !== "GST Invoices" && (
          <ComingSoon title={activeBusinessPill} />
        )}
    </div>
  );
}
