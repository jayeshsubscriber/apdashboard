"use client";

import { CustomersPanel } from "./panels/CustomersPanel";
import { BusinessOpportunitiesPanel } from "./panels/BusinessOpportunitiesPanel";

/** Toggle to show the full Business Opportunities block on the Customers tab again. Dashboard is unchanged (uses BusinessOpportunitiesCard). */
const SHOW_BUSINESS_OPPORTUNITIES_ON_CUSTOMERS_PAGE = false;

type Props = { onSelectCustomer: (ucc: string) => void };

export function CustomersHome({ onSelectCustomer }: Props) {
  return (
    <main className="flex-1 py-3">
      <section className="space-y-4">
        {SHOW_BUSINESS_OPPORTUNITIES_ON_CUSTOMERS_PAGE ? (
          <section id="business-opportunities" className="scroll-mt-24 md:scroll-mt-16">
            <BusinessOpportunitiesPanel />
          </section>
        ) : null}
        <section id="customers" className="scroll-mt-24 md:scroll-mt-16">
          <CustomersPanel onSelectCustomer={onSelectCustomer} />
        </section>
      </section>
    </main>
  );
}
