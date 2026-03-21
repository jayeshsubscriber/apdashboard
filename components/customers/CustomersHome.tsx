"use client";

import { CustomersPanel } from "./panels/CustomersPanel";
import { BusinessOpportunitiesPanel } from "./panels/BusinessOpportunitiesPanel";

type Props = { onSelectCustomer: (ucc: string) => void };

export function CustomersHome({ onSelectCustomer }: Props) {
  return (
    <main className="flex-1 px-4 py-4">
      <section className="space-y-4">
        <section id="business-opportunities" className="scroll-mt-24 md:scroll-mt-16">
          <BusinessOpportunitiesPanel />
        </section>
        <section id="customers" className="scroll-mt-24 md:scroll-mt-16">
          <CustomersPanel onSelectCustomer={onSelectCustomer} />
        </section>
      </section>
    </main>
  );
}
