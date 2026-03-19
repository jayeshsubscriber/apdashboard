"use client";

import { useState } from "react";
import { Header } from "@/components/header/Header";
import { DashboardHome } from "@/components/dashboard/DashboardHome";

type TabId = "dashboard" | "customers" | "earnings";

function ComingSoon({ title }: { title: string }) {
  return (
    <main className="flex-1 flex items-center justify-center">
      <div className="text-muted-foreground text-sm">{title} coming soon.</div>
    </main>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header activeTab={activeTab} onTabChange={setActiveTab} partnerName="Rajesh Sharma" />

      {activeTab === "dashboard" && <DashboardHome />}
      {activeTab === "customers" && <ComingSoon title="Customers" />}
      {activeTab === "earnings" && <ComingSoon title="Earnings" />}
    </div>
  );
}
