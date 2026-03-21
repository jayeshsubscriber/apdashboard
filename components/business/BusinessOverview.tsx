"use client";

import { BusinessOverviewSections } from "./BusinessOverviewSections";

export function BusinessOverview() {
  return (
    <main className="flex-1 p-4">
      <section className="p-1">
        <BusinessOverviewSections />
      </section>
    </main>
  );
}
