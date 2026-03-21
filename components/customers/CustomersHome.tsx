"use client";

import { useEffect, useState } from "react";
import { ClientOnboardingLeadsPanel } from "./panels/ClientOnboardingLeadsPanel";
import { CustomersPanel } from "./panels/CustomersPanel";
import { BusinessOpportunitiesPanel } from "./panels/BusinessOpportunitiesPanel";

const SECTION_TABS = [
  { id: "client-onboarding-leads", label: "Client Onboarding Leads" },
  { id: "customers", label: "Customers" },
  { id: "business-opportunities", label: "Business Opportunities" },
] as const;

export function CustomersHome() {
  const [activeTab, setActiveTab] = useState<(typeof SECTION_TABS)[number]["id"]>(SECTION_TABS[0].id);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTION_TABS.forEach((tab) => {
      const sectionEl = document.getElementById(tab.id);
      if (!sectionEl) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveTab(tab.id);
            }
          });
        },
        { rootMargin: "-30% 0px -60% 0px", threshold: 0.05 }
      );

      observer.observe(sectionEl);
      observers.push(observer);
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  const handleTabClick = (id: (typeof SECTION_TABS)[number]["id"]) => {
    const sectionEl = document.getElementById(id);
    setActiveTab(id);
    sectionEl?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="flex-1 px-4 py-4">
      <div className="sticky top-0 z-10 -mx-4 mb-3 border-b border-border bg-background/95 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <nav className="overflow-x-auto">
          <div className="flex min-w-max items-center gap-6 border-b border-border">
            {SECTION_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                className={`whitespace-nowrap rounded-none pb-2 text-[15px] font-medium transition-colors border-b-2 outline-none focus-visible:ring-1 focus-visible:ring-primary ${
                  activeTab === tab.id
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>
      </div>

      <section className="space-y-4">
        <section id="client-onboarding-leads" className="scroll-mt-24 md:scroll-mt-16">
          <ClientOnboardingLeadsPanel />
        </section>
        <section id="business-opportunities" className="scroll-mt-24 md:scroll-mt-16">
          <BusinessOpportunitiesPanel />
        </section>
        <section id="customers" className="scroll-mt-24 md:scroll-mt-16">
          <CustomersPanel />
        </section>
      </section>
    </main>
  );
}
