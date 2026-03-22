"use client";

import { useMemo, useState, useEffect } from "react";
import { BarChart3 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function useIsNarrow(breakpoint = 640) {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const check = () => setNarrow(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return narrow;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-card shadow-md px-3 py-2 text-sm">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {[...payload].reverse().map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span
            className="inline-block w-2.5 h-2.5 rounded-sm shrink-0"
            style={{ background: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium text-foreground">
            ₹{entry.value.toLocaleString("en-IN")}
          </span>
        </div>
      ))}
    </div>
  );
}

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

const RANGE_OPTIONS: Array<{ id: RangeId; label: string; shortLabel: string; count: number }> = [
  { id: "last3",  label: "Last 3 Months", shortLabel: "3M", count: 3 },
  { id: "last6",  label: "Last 6 Months", shortLabel: "6M", count: 6 },
  { id: "last12", label: "Last 1 Year",   shortLabel: "1Y", count: 12 },
];

const SERIES_COLORS = {
  referralFee:  "#f97316",
  brokerage:    "#6366f1",
  mfCommission: "#06b6d4",
  other:        "#f59e0b",
} as const;

const SERIES = [
  { key: "referralFee"  as const, label: "Referral Fee",   color: SERIES_COLORS.referralFee },
  { key: "brokerage"    as const, label: "Brokerage",       color: SERIES_COLORS.brokerage },
  { key: "mfCommission" as const, label: "MF Commission",  color: SERIES_COLORS.mfCommission },
  { key: "other"        as const, label: "Other",           color: SERIES_COLORS.other },
];

function formatYAxisMobile(v: number) {
  if (v === 0) return "0";
  if (v >= 1000) return `${Math.round(v / 1000)}k`;
  return String(v);
}

function formatTotal(value: number) {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000)   return `₹${(value / 1000).toFixed(1)}k`;
  return `₹${value}`;
}

const BAR_WIDTH_DESKTOP = 26;
const BAR_WIDTH_MOBILE  = 24;

const PAYOUT_BY_MONTH: Record<
  (typeof allMonths)[number],
  { referralFee: number; brokerage: number; mfCommission: number; other: number }
> = {
  "March 2023":    { referralFee: 4500, brokerage: 26000, mfCommission: 7000, other: 2000 },
  "April 2023":    { referralFee: 4800, brokerage: 28000, mfCommission: 7200, other: 2200 },
  "May 2023":      { referralFee: 5200, brokerage: 25000, mfCommission: 7400, other: 1800 },
  "June 2023":     { referralFee: 6000, brokerage: 30000, mfCommission: 7800, other: 2400 },
  "July 2023":     { referralFee: 5800, brokerage: 29000, mfCommission: 7600, other: 2100 },
  "August 2023":   { referralFee: 6500, brokerage: 31000, mfCommission: 8000, other: 2300 },
  "September 2023":{ referralFee: 7000, brokerage: 32000, mfCommission: 8200, other: 2500 },
  "October 2023":  { referralFee: 7300, brokerage: 34000, mfCommission: 8500, other: 2600 },
  "November 2023": { referralFee: 6800, brokerage: 33000, mfCommission: 8400, other: 2550 },
  "December 2023": { referralFee: 7600, brokerage: 36000, mfCommission: 8700, other: 2700 },
  "January 2024":  { referralFee: 8200, brokerage: 38000, mfCommission: 9000, other: 2900 },
  "February 2024": { referralFee: 7900, brokerage: 37000, mfCommission: 8800, other: 2800 },
};

/** 2×2 legend shown below the chart on all screen sizes */
function ChartLegend() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1.5 mt-3 px-1">
      {SERIES.map((s) => (
        <div key={s.key} className="flex items-center gap-1.5 min-w-0">
          <span
            className="inline-block w-2.5 h-2.5 rounded-sm shrink-0"
            style={{ background: s.color }}
          />
          <span className="text-xs text-muted-foreground truncate">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

export function PayoutSummaryCard() {
  const isMobile = useIsNarrow(640);
  const [rangeId, setRangeId] = useState<RangeId>("last6");

  const range = useMemo(
    () => RANGE_OPTIONS.find((o) => o.id === rangeId) ?? RANGE_OPTIONS[1],
    [rangeId]
  );

  const months = useMemo(() => allMonths.slice(-range.count), [range.count]);

  const data = useMemo(() => {
    return months.map((month) => {
      const d = PAYOUT_BY_MONTH[month];
      return {
        month,
        ...d,
        total: d.referralFee + d.brokerage + d.mfCommission + d.other,
      };
    });
  }, [months]);

  // Always stacked — max = total per month
  const maxValue = Math.max(...data.map((d) => d.referralFee + d.brokerage + d.mfCommission + d.other), 100);
  const chartMax = Math.ceil(maxValue / 10000) * 10000 + 5000;

  return (
    <section className="min-w-0 overflow-hidden">
      <div className="px-3 sm:px-5 py-4 sm:py-5">
        {/* Header — title left, pill filters right */}
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 border-l-[3px] border-primary pl-3 text-lg font-semibold text-foreground tracking-tight">
            <BarChart3 size={18} className="text-primary shrink-0" />
            Revenue Summary
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

        {/* Chart */}
        <div className="mt-3 h-[240px] sm:h-[270px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 24, right: 4, left: 0, bottom: 0 }}
              barCategoryGap="30%"
            >
              <CartesianGrid
                stroke="#e5e7eb"
                strokeDasharray="3 3"
                vertical={false}
                horizontal={true}
              />

              <XAxis
                dataKey="month"
                interval={0}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: isMobile ? 10 : 12, fill: "#6b7280" }}
                tickFormatter={(val: string) => {
                  const [month, year] = val.split(" ");
                  return `${month.slice(0, 3)} '${year.slice(2)}`;
                }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                width={isMobile ? 32 : 40}
                tick={{ fontSize: isMobile ? 10 : 12, fill: "#6b7280" }}
                domain={[0, chartMax]}
                tickFormatter={formatYAxisMobile}
              />

              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />

              {/* Always stacked bars */}
              {SERIES.map((s, i) => {
                const isLast = i === SERIES.length - 1;
                return (
                  <Bar
                    key={s.key}
                    dataKey={s.key}
                    name={s.label}
                    fill={s.color}
                    stackId="stack"
                    barSize={isMobile ? BAR_WIDTH_MOBILE : BAR_WIDTH_DESKTOP}
                    minPointSize={3}
                    radius={isLast ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                  >
                    {isLast && (
                      <LabelList
                        dataKey="total"
                        position="top"
                        content={(props) => {
                          const { x, y, width, value } = props as { x?: number; y?: number; width?: number; value?: number };
                          // On mobile, only show labels when bars are wide enough (3M = 3 bars)
                          if (isMobile && months.length > 3) return null;
                          if (!value || x == null || y == null || width == null) return null;
                          return (
                            <text
                              x={Number(x) + Number(width) / 2}
                              y={Number(y) - 5}
                              textAnchor="middle"
                              fontSize={isMobile ? 10 : 11}
                              fontWeight="700"
                              fill="#542087"
                            >
                              {formatTotal(Number(value))}
                            </text>
                          );
                        }}
                      />
                    )}
                  </Bar>
                );
              })}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend below chart — all screen sizes */}
        <ChartLegend />
      </div>
    </section>
  );
}
