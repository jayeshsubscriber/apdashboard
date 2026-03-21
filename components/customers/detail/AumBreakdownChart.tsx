"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { AumBreakdown } from "../customer-detail-data";
import { formatINR } from "../customer-detail-data";

type Props = { breakdown: AumBreakdown };

const COLORS = [
  { key: "equity" as const, label: "Equity", color: "var(--color-chart-1)" },
  { key: "mf" as const, label: "Mutual Funds", color: "var(--color-chart-2)" },
  { key: "cash" as const, label: "Cash", color: "var(--color-chart-4)" },
];

export function AumBreakdownChart({ breakdown }: Props) {
  const data = COLORS.map(({ key, label, color }) => ({
    name: label,
    value: breakdown[key],
    color,
  }));

  const total = breakdown.equity + breakdown.mf + breakdown.cash;

  return (
    <section className="rounded-md border border-border bg-card p-4">
      <h3 className="text-sm font-semibold tracking-tight text-foreground">
        AUM Breakdown
      </h3>
      <div className="text-center text-xs text-muted-foreground mt-1">
        Total: <span className="font-semibold text-foreground">{formatINR(total)}</span>
      </div>
      <div className="h-[180px] mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="50%"
              outerRadius="90%"
              cx="50%"
              cy="50%"
              stroke="var(--color-card)"
              strokeWidth={3}
            >
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [formatINR(value), "Amount"]}
              contentStyle={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-card)",
                borderRadius: "0.5rem",
              }}
              itemStyle={{ color: "var(--color-foreground)" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
        {data.map((d) => (
          <div key={d.name} className="inline-flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: d.color }}
            />
            <span>{d.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
