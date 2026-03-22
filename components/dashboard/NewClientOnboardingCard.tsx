"use client";

import { useMemo, useState } from "react";
import { UserPlus } from "lucide-react";
import {
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";

type RangeId = "1w" | "1m" | "3m";

const RANGE_OPTIONS: Array<{ id: RangeId; shortLabel: string; label: string }> = [
  { id: "1w", shortLabel: "1W", label: "Last 7 Days" },
  { id: "1m", shortLabel: "1M", label: "Last 30 Days" },
  { id: "3m", shortLabel: "3M", label: "Last 3 Months" },
];

// Mock data keyed by range — swap for real API data when backend is wired
const DATA_BY_RANGE: Record<
  RangeId,
  {
    totalOpenAndProgress: number;
    accountOpen: number;
    accountInProgress: number;
    appStatus: Array<{ label: string; value: number; fill: string }>;
  }
> = {
  "1w": {
    totalOpenAndProgress: 812,
    accountOpen: 736,
    accountInProgress: 76,
    appStatus: [
      { label: "Ready to Trade",               value: 736,  fill: "var(--chart-5)" },
      { label: "Application Not Submitted",     value: 48,   fill: "var(--chart-4)" },
      { label: "Application Under Review",      value: 16,   fill: "var(--chart-3)" },
      { label: "Application Rejected",          value: 8,    fill: "var(--chart-2)" },
      { label: "Account Activation Rejected",   value: 3,    fill: "var(--chart-1)" },
      { label: "Account Activation in Progress",value: 1,    fill: "var(--chart-1)" },
    ],
  },
  "1m": {
    totalOpenAndProgress: 4284,
    accountOpen: 3860,
    accountInProgress: 424,
    appStatus: [
      { label: "Ready to Trade",               value: 3860, fill: "var(--chart-5)" },
      { label: "Application Not Submitted",     value: 280,  fill: "var(--chart-4)" },
      { label: "Application Under Review",      value: 96,   fill: "var(--chart-3)" },
      { label: "Application Rejected",          value: 32,   fill: "var(--chart-2)" },
      { label: "Account Activation Rejected",   value: 12,   fill: "var(--chart-1)" },
      { label: "Account Activation in Progress",value: 4,    fill: "var(--chart-1)" },
    ],
  },
  "3m": {
    totalOpenAndProgress: 39675,
    accountOpen: 37069,
    accountInProgress: 2606,
    appStatus: [
      { label: "Ready to Trade",               value: 37069, fill: "var(--chart-5)" },
      { label: "Application Not Submitted",     value: 2496,  fill: "var(--chart-4)" },
      { label: "Application Under Review",      value: 78,    fill: "var(--chart-3)" },
      { label: "Application Rejected",          value: 28,    fill: "var(--chart-2)" },
      { label: "Account Activation Rejected",   value: 28,    fill: "var(--chart-1)" },
      { label: "Account Activation in Progress",value: 4,     fill: "var(--chart-1)" },
    ],
  },
};

export function NewClientOnboardingCard() {
  const [rangeId, setRangeId] = useState<RangeId>("3m");

  const d = DATA_BY_RANGE[rangeId];

  const donutData = useMemo(
    () => [
      { name: "Account Open",        value: d.accountOpen,        fill: "var(--chart-1)" },
      { name: "Account in Progress", value: d.accountInProgress,  fill: "var(--chart-5)" },
    ],
    [d.accountOpen, d.accountInProgress]
  );

  const maxAppValue = Math.max(...d.appStatus.map((s) => s.value), 1);

  return (
    <section className="min-w-0 overflow-visible">
      <div className="px-3 sm:px-5 py-4 sm:py-5">
        {/* Header — title left, pill filters right */}
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 border-l-[3px] border-primary pl-3 text-lg font-semibold text-foreground tracking-tight">
            <UserPlus size={18} className="text-primary shrink-0" />
            Client Onboarding
          </h2>

          <div className="flex items-center gap-1 shrink-0">
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setRangeId(opt.id)}
                className={`h-7 rounded-full border px-2.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
                  rangeId === opt.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {opt.shortLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Two inner sections */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Left: Account status donut */}
          <div className="min-w-0 p-4">
            <h3 className="text-base font-semibold text-foreground tracking-tight">
              Account Status Summary
            </h3>

            <div className="mt-4 flex items-center justify-center">
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
                        stroke="var(--card)"
                        strokeWidth={6}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-sm text-muted-foreground font-medium">
                      Total: {d.totalOpenAndProgress.toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-4">
                  {donutData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <span
                        className="inline-block w-3 h-3 rounded-[2px]"
                        style={{ backgroundColor: item.fill }}
                      />
                      <span className="text-sm text-muted-foreground font-medium">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: App status bars */}
          <div className="min-w-0 p-4">
            <h3 className="text-base font-semibold text-foreground tracking-tight">
              App Status Summary
            </h3>

            <div className="mt-4 space-y-4">
              {d.appStatus.map((item) => {
                const pct = (item.value / maxAppValue) * 100;
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
                        {item.label}
                      </div>
                      <div className="text-base font-semibold text-foreground shrink-0">
                        {item.value.toLocaleString("en-IN")}
                      </div>
                    </div>
                    <div className="mt-1 h-3 rounded-full bg-muted">
                      <div
                        className="h-3 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%`, backgroundColor: item.fill }}
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
