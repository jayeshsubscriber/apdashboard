"use client";

import { BusinessOverviewSections } from "./BusinessOverviewSections";

export function BusinessOverview() {
  return (
    <main className="flex-1 px-3 sm:px-4 py-3">
      <section>
        <BusinessOverviewSections />
      </section>
    </main>
  );
}
