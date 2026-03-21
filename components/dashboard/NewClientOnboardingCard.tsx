"use client";

import { useMemo, useState } from "react";
import { UserPlus } from "lucide-react";
import {
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";

type RangeId = "last60";

const RANGE_OPTIONS: Array<{ id: RangeId; label: string }> = [
  { id: "last60", label: "All (60 Days)" },
];

type DonutDatum = {
  name: string;
  value: number;
  fill: string;
};

type StatusDatum = {
  label: string;
  value: number;
  fill: string;
};

export function NewClientOnboardingCard() {
  // Dummy values until backend data is wired.
  const [rangeId, setRangeId] = useState<RangeId>("last60");

  const totalOpenAndProgress = 39675;
  const accountOpen = 37069;
  const accountInProgress = 2496;

  const appStatusData: StatusDatum[] = useMemo(
    () => [
      {
        label: "Ready to Trade",
        value: accountOpen,
        fill: "var(--chart-5)",
      },
      {
        label: "Application Not Submitted",
        value: accountInProgress,
        fill: "var(--chart-4)",
      },
      {
        label: "Application Under Review",
        value: 78,
        fill: "var(--chart-3)",
      },
      {
        label: "Application Rejected",
        value: 28,
        fill: "var(--chart-2)",
      },
      {
        label: "Account Activation Rejected",
        value: 28,
        fill: "var(--chart-1)",
      },
      {
        label: "Account Activation in Progress",
        value: 4,
        fill: "var(--chart-1)",
      },
    ],
    [accountInProgress, accountOpen]
  );

  const donutData: DonutDatum[] = useMemo(
    () => [
      { name: "Account Open", value: accountOpen, fill: "var(--chart-1)" },
      {
        name: "Account in Progress",
        value: accountInProgress,
        // Use a more contrasting token so the small slice is still visible.
        fill: "var(--chart-5)",
      },
    ],
    []
  );

  const maxAppValue = Math.max(...appStatusData.map((d) => d.value), 1);

  return (
    <section className="min-w-0 overflow-visible">
      <div className="p-5">
        {/* Master header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 border-l-[3px] border-primary pl-3 text-lg font-semibold text-foreground tracking-tight">
              <UserPlus size={18} className="text-primary shrink-0" />
              New Client Onboarding
            </h2>
          </div>

          <div className="shrink-0">
            <select
              aria-label="Onboarding range"
              value={rangeId}
              onChange={(e) => setRangeId(e.target.value as RangeId)}
              className="h-9 rounded-md border border-primary/30 bg-primary/10 px-4 text-sm font-medium text-primary outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              {RANGE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Two inner sections */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Left: Account status summary */}
          <div className="min-w-0 p-4">
            <h3 className="text-base font-semibold text-foreground tracking-tight">
              Client Onboarding Account Status Summary
            </h3>

            <div className="mt-4 flex items-center justify-center">
              {/* Donut + legend */}
              <div className="w-full flex flex-col items-center">
                <div className="relative w-full max-w-[240px] aspect-square">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donutData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={78}
                        outerRadius={110}
                        // Slice separation so small segments don't visually merge.
                        stroke="var(--card)"
                        strokeWidth={6}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground font-medium">
                        Total: {totalOpenAndProgress}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-4">
                  {donutData.map((d) => (
                    <div key={d.name} className="flex items-center gap-2">
                      <span
                        className="inline-block w-3 h-3 rounded-[2px]"
                        style={{ backgroundColor: d.fill }}
                      />
                      <span className="text-base text-muted-foreground font-medium">
                        {d.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: App status summary (placeholder) */}
          <div className="min-w-0 p-4">
            <h3 className="text-base font-semibold text-foreground tracking-tight">
              Client Onboarding App Status Summary
            </h3>

            <div className="mt-4 space-y-4">
              {appStatusData.map((d) => {
                const pct = (d.value / maxAppValue) * 100;
                return (
                  <div key={d.label}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
                        {d.label}
                      </div>
                      <div className="text-base font-semibold text-foreground shrink-0">
                        {d.value}
                      </div>
                    </div>

                    <div className="mt-1 h-3 rounded-full bg-muted">
                      <div
                        className="h-3 rounded-full"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: d.fill,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

