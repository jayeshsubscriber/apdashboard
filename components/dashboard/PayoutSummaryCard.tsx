"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const allMonths = [
  "March 2023",
  "April 2023",
  "May 2023",
  "June 2023",
  "July 2023",
  "August 2023",
  "September 2023",
  "October 2023",
  "November 2023",
  "December 2023",
  "January 2024",
  "February 2024",
];

type RangeId = "last6" | "last3" | "last12";

const RANGE_OPTIONS: Array<{ id: RangeId; label: string; count: number }> = [
  { id: "last6", label: "Last 6 Months", count: 6 },
  { id: "last3", label: "Last 3 Months", count: 3 },
  { id: "last12", label: "Last 1 Year", count: 12 },
];

// Realistic (dummy) payout figures per month until backend wiring.
// Note: values are positive numbers to keep chart axes consistent.
const PAYOUT_BY_MONTH: Record<
  (typeof allMonths)[number],
  { referralFee: number; brokerage: number; mfCommission: number; other: number }
> = {
  "March 2023": { referralFee: 4500, brokerage: 26000, mfCommission: 7000, other: 2000 },
  "April 2023": { referralFee: 4800, brokerage: 28000, mfCommission: 7200, other: 2200 },
  "May 2023": { referralFee: 5200, brokerage: 25000, mfCommission: 7400, other: 1800 },
  "June 2023": { referralFee: 6000, brokerage: 30000, mfCommission: 7800, other: 2400 },
  "July 2023": { referralFee: 5800, brokerage: 29000, mfCommission: 7600, other: 2100 },
  "August 2023": { referralFee: 6500, brokerage: 31000, mfCommission: 8000, other: 2300 },
  "September 2023": { referralFee: 7000, brokerage: 32000, mfCommission: 8200, other: 2500 },
  "October 2023": { referralFee: 7300, brokerage: 34000, mfCommission: 8500, other: 2600 },
  "November 2023": { referralFee: 6800, brokerage: 33000, mfCommission: 8400, other: 2550 },
  "December 2023": { referralFee: 7600, brokerage: 36000, mfCommission: 8700, other: 2700 },
  "January 2024": { referralFee: 8200, brokerage: 38000, mfCommission: 9000, other: 2900 },
  "February 2024": { referralFee: 7900, brokerage: 37000, mfCommission: 8800, other: 2800 },
};

function formatMoney(v: number) {
  if (v === 0) return "0.00";
  return v.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function PayoutSummaryCard() {
  const [rangeId, setRangeId] = useState<RangeId>("last6");
  const range = useMemo(
    () => RANGE_OPTIONS.find((o) => o.id === rangeId) ?? RANGE_OPTIONS[0],
    [rangeId]
  );

  const months = useMemo(() => {
    return allMonths.slice(-range.count);
  }, [range.count]);

  const data = useMemo(() => {
    return months.map((month) => ({
      month,
      ...PAYOUT_BY_MONTH[month],
    }));
  }, [months]);

  const tickInterval = months.length <= 6 ? 0 : 2;
  // Grouped bars use individual series values, so Y axis max should not be the sum.
  const maxValue = Math.max(
    ...data.map((d) =>
      Math.max(d.referralFee, d.brokerage, d.mfCommission, d.other)
    ),
    100
  );
  const chartMax = Math.ceil(maxValue / 10000) * 10000;

  return (
    <section className="rounded-md border border-border bg-card overflow-hidden min-h-[340px]">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground tracking-tight">
              Payout Summary
            </h2>
          </div>

          <div className="shrink-0">
            <select
              aria-label="Time interval"
              value={rangeId}
              onChange={(e) => setRangeId(e.target.value as RangeId)}
              className="h-10 rounded-md border border-border bg-card px-4 text-sm text-muted-foreground outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              {RANGE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 6, right: 18, left: 0, bottom: 0 }}
              barGap={6}
              barCategoryGap="15%"
            >
              <CartesianGrid
                stroke="var(--border)"
                strokeDasharray="3 3"
                vertical={true}
                horizontal={true}
              />

              <XAxis
                dataKey="month"
                interval={tickInterval}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 14, fill: "var(--muted-foreground)" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={52}
                tick={{ fontSize: 14, fill: "var(--muted-foreground)" }}
                domain={[0, chartMax]}
                tickFormatter={formatMoney}
              />

              <Legend
                verticalAlign="top"
                align="center"
                height={34}
                formatter={(value) => String(value)}
                wrapperStyle={{ color: "var(--muted-foreground)" }}
              />

              {/* Grouped bars (one bar per series per month). */}
              <Bar
                dataKey="referralFee"
                name="Referral Fee"
                fill="var(--chart-1)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="brokerage"
                name="Brokerage"
                fill="var(--chart-2)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="mfCommission"
                name="MF Commission"
                fill="var(--chart-3)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="other"
                name="Other"
                fill="var(--chart-4)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

