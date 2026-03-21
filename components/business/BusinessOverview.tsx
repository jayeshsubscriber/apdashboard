"use client";

import { useMemo, useState } from "react";
import {
  BarChart3,
  CalendarClock,
  CircleDollarSign,
  Landmark,
  TrendingUp,
  UserCheck,
  Users,
  Wallet,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type EquityStatRow = {
  month: string;
  clients: number;
  orders: number;
};

type AppDownloadStatRow = {
  month: string;
  downloads: number;
};

type InactiveClientStatRow = {
  month: string;
  inactiveClients: number;
};

type AumSegmentRow = {
  name: string;
  value: number;
  amountLabel: string;
  color: string;
};

type AumTabId = "equity" | "mutualFunds";
type AumSummaryMetric = {
  label: string;
  value: string;
};
type MfQuickviewMetric = {
  id: string;
  label: string;
  value: string;
};
type AumConfig = {
  totalLabel: string;
  segments: AumSegmentRow[];
  summaryMonth: string;
  summaryMetrics: AumSummaryMetric[];
  mfQuickviewMetrics?: MfQuickviewMetric[];
};

const EQUITY_STATS: EquityStatRow[] = [
  { month: "Jan 2025", clients: 96, orders: 559 },
  { month: "Feb 2025", clients: 262, orders: 16294 },
  { month: "Mar 2025", clients: 244, orders: 19271 },
  { month: "Apr 2025", clients: 249, orders: 17141 },
  { month: "May 2025", clients: 273, orders: 17681 },
  { month: "Jun 2025", clients: 285, orders: 21035 },
  { month: "Jul 2025", clients: 275, orders: 16059 },
  { month: "Aug 2025", clients: 248, orders: 15456 },
  { month: "Sep 2025", clients: 273, orders: 17278 },
  { month: "Oct 2025", clients: 267, orders: 17515 },
  { month: "Nov 2025", clients: 241, orders: 19782 },
  { month: "Dec 2025", clients: 268, orders: 20540 },
  { month: "Jan 2026", clients: 270, orders: 23222 },
];

const APP_DOWNLOAD_STATS: AppDownloadStatRow[] = [
  { month: "Feb 2025", downloads: 1 },
  { month: "Mar 2025", downloads: 2 },
  { month: "Apr 2025", downloads: 1 },
  { month: "May 2025", downloads: 0 },
  { month: "Jun 2025", downloads: 2 },
  { month: "Jul 2025", downloads: 3 },
  { month: "Aug 2025", downloads: 2 },
  { month: "Sep 2025", downloads: 1 },
  { month: "Oct 2025", downloads: 2 },
  { month: "Nov 2025", downloads: 14 },
  { month: "Dec 2025", downloads: 6 },
  { month: "Jan 2026", downloads: 14 },
];

const INACTIVE_CLIENT_STATS: InactiveClientStatRow[] = [
  { month: "Jan 2025", inactiveClients: 1 },
  { month: "Feb 2025", inactiveClients: 5 },
  { month: "Mar 2025", inactiveClients: 2 },
  { month: "Apr 2025", inactiveClients: 0 },
  { month: "May 2025", inactiveClients: 1 },
  { month: "Jun 2025", inactiveClients: 6 },
  { month: "Jul 2025", inactiveClients: 4 },
  { month: "Aug 2025", inactiveClients: 2 },
  { month: "Sep 2025", inactiveClients: 25 },
  { month: "Oct 2025", inactiveClients: 11 },
  { month: "Nov 2025", inactiveClients: 15 },
  { month: "Jan 2026", inactiveClients: 43 },
];

const AUM_TABS: Array<{ id: AumTabId; label: string }> = [
  { id: "equity", label: "Equity" },
  { id: "mutualFunds", label: "Mutual Funds" },
];

const AUM_CONFIG_BY_TAB: Record<AumTabId, AumConfig> = {
  equity: {
    totalLabel: "Rs 4,21,674",
    segments: [
      {
        name: "Holdings",
        value: 62.4,
        amountLabel: "Rs 2,63,124",
        color: "var(--color-chart-2)",
      },
      {
        name: "MTF",
        value: 21.8,
        amountLabel: "Rs 91,933",
        color: "var(--color-chart-3)",
      },
      {
        name: "Wallet Balance (Cash + Margin EOD)",
        value: 15.8,
        amountLabel: "Rs 66,617",
        color: "var(--color-chart-4)",
      },
    ],
    summaryMonth: "Jan 2026",
    summaryMetrics: [
      { label: "AUM", value: "Rs 4,21,674 (+7.89%)" },
      { label: "Equity Traded", value: "270 (+12.40%)" },
      { label: "F&O Traded", value: "118 (+9.25%)" },
    ],
  },
  mutualFunds: {
    totalLabel: "Rs 2,86,940",
    segments: [
      {
        name: "Equity MF",
        value: 68.4,
        amountLabel: "Rs 1,96,266",
        color: "var(--color-chart-2)",
      },
      {
        name: "Debt MF",
        value: 22.6,
        amountLabel: "Rs 64,848",
        color: "var(--color-chart-3)",
      },
      {
        name: "Hybrid MF",
        value: 9,
        amountLabel: "Rs 25,826",
        color: "var(--color-chart-4)",
      },
    ],
    summaryMonth: "Jan 2026",
    summaryMetrics: [
      { label: "AUM", value: "Rs 2,86,940 (+9.32%)" },
      { label: "Addition Rate", value: "10.90 %" },
      { label: "Withdrawal Rate", value: "14.11 %" },
    ],
    mfQuickviewMetrics: [
      { id: "totalMfClients", label: "Total MF Clients", value: "1,870" },
      { id: "clientsWithSips", label: "Clients with SIPs", value: "64" },
      { id: "totalActiveSips", label: "Total Active SIPs", value: "166" },
      { id: "sipInputValue", label: "SIP Input Value", value: "Rs 2,73,659" },
      { id: "upcomingSips7Days", label: "Upcoming SIPs in next 7 days", value: "83" },
    ],
  },
};

function formatNumber(value: number) {
  return value.toLocaleString("en-IN");
}

export function BusinessOverview() {
  const [activeAumTab, setActiveAumTab] = useState<AumTabId>("equity");
  const activeAumConfig = useMemo(
    () => AUM_CONFIG_BY_TAB[activeAumTab],
    [activeAumTab]
  );

  return (
    <main className="flex-1 p-4">
      <section className="p-1">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Equity, F&amp;O, Commodity &amp; Currency Segment
        </h2>

        <div className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <article className="min-w-0 rounded-md border border-border bg-card p-3">
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              Active Clients (Traded)
            </h3>
            <div className="mt-2 h-[220px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={EQUITY_STATS} margin={{ top: 8, right: 8, left: 0, bottom: 12 }}>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    interval={0}
                    angle={-35}
                    textAnchor="end"
                    height={52}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 9, fill: "var(--color-muted-foreground)" }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatNumber(value), "Clients"]}
                    labelStyle={{ color: "var(--color-foreground)" }}
                    contentStyle={{
                      borderColor: "var(--color-border)",
                      backgroundColor: "var(--color-card)",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Bar dataKey="clients" name="Clients" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]}>
                    <LabelList
                      dataKey="clients"
                      position="top"
                      formatter={(value: number) => formatNumber(value)}
                      fill="var(--color-muted-foreground)"
                      fontSize={10}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="min-w-0 rounded-md border border-border bg-card p-3">
            <h3 className="text-base font-semibold tracking-tight text-foreground">Total Orders</h3>
            <div className="mt-2 h-[220px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={EQUITY_STATS} margin={{ top: 8, right: 8, left: 0, bottom: 12 }}>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    interval={0}
                    angle={-35}
                    textAnchor="end"
                    height={52}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 9, fill: "var(--color-muted-foreground)" }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                    tickFormatter={formatNumber}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatNumber(value), "Orders"]}
                    labelStyle={{ color: "var(--color-foreground)" }}
                    contentStyle={{
                      borderColor: "var(--color-border)",
                      backgroundColor: "var(--color-card)",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Bar dataKey="orders" name="Orders" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]}>
                    <LabelList
                      dataKey="orders"
                      position="top"
                      formatter={(value: number) => formatNumber(value)}
                      fill="var(--color-muted-foreground)"
                      fontSize={10}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>
          <article className="min-w-0 rounded-md border border-border bg-card p-3">
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              App Download Statistics
            </h3>
            <div className="mt-2 h-[220px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={APP_DOWNLOAD_STATS}
                  margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
                >
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatNumber(value), "Downloads"]}
                    labelStyle={{ color: "var(--color-foreground)" }}
                    contentStyle={{
                      borderColor: "var(--color-border)",
                      backgroundColor: "var(--color-card)",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Bar
                    dataKey="downloads"
                    name="App Downloads"
                    fill="var(--color-chart-2)"
                    radius={[4, 4, 0, 0]}
                  >
                    <LabelList
                      dataKey="downloads"
                      position="top"
                      formatter={(value: number) => formatNumber(value)}
                      fill="var(--color-muted-foreground)"
                      fontSize={10}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="min-w-0 rounded-md border border-border bg-card p-3">
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              Closed/Inactive Client Accounts
            </h3>
            <div className="mt-2 h-[220px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={INACTIVE_CLIENT_STATS}
                  margin={{ top: 8, right: 8, left: 0, bottom: 12 }}
                >
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    interval={0}
                    angle={-35}
                    textAnchor="end"
                    height={52}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 9, fill: "var(--color-muted-foreground)" }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatNumber(value), "Inactive Clients"]}
                    labelStyle={{ color: "var(--color-foreground)" }}
                    contentStyle={{
                      borderColor: "var(--color-border)",
                      backgroundColor: "var(--color-card)",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Bar
                    dataKey="inactiveClients"
                    name="Inactive Clients"
                    fill="var(--color-chart-1)"
                    radius={[4, 4, 0, 0]}
                  >
                    <LabelList
                      dataKey="inactiveClients"
                      position="top"
                      formatter={(value: number) => formatNumber(value)}
                      fill="var(--color-muted-foreground)"
                      fontSize={10}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>
          </div>
        </div>

        <section className="mt-5 w-full">
          <div className="mb-4">
            <h3 className="text-base font-semibold tracking-tight text-foreground">AUM Summary</h3>
          </div>

          <div className="mb-3 border-b border-border">
            <div className="flex items-center gap-5">
              {AUM_TABS.map((tab) => {
                const isActive = tab.id === activeAumTab;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveAumTab(tab.id)}
                    className={`rounded-none border-b-2 pb-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-7 rounded-md border border-border bg-card px-2.5 pb-2 pt-2">
              <div className="mb-1 text-base font-semibold tracking-tight text-foreground">
                AUM Overview
              </div>
              {/* Keep legend inside card so labels remain fully visible */}
              <div className="h-[248px] overflow-visible">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 0, right: 4, left: 4, bottom: 0 }}>
                    <Pie
                      data={activeAumConfig.segments}
                      dataKey="value"
                      nameKey="name"
                      startAngle={180}
                      endAngle={0}
                      innerRadius="46%"
                      outerRadius="106%"
                      cx="50%"
                      cy="88%"
                      stroke="var(--color-card)"
                      strokeWidth={3}
                    >
                      {activeAumConfig.segments.map((segment) => (
                        <Cell key={segment.name} fill={segment.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(_, __, item) => {
                        const payload = item?.payload as AumSegmentRow | undefined;
                        const amount = payload?.amountLabel ?? "";
                        const percent =
                          payload?.value !== undefined ? `${payload.value.toFixed(2)}%` : "";
                        return [`${amount} (${percent})`, "Amount"];
                      }}
                      labelFormatter={(_, payload) => payload?.[0]?.name ?? ""}
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
              <div className="mt-1 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
                {activeAumConfig.segments.map((segment) => (
                  <div key={segment.name} className="inline-flex items-center gap-1.5 whitespace-nowrap">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: segment.color }}
                    />
                    <span>{segment.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div
                className={
                  activeAumTab === "mutualFunds"
                    ? "grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_260px] gap-3 items-start"
                    : "block"
                }
              >
                <div className="rounded-md border border-border bg-card p-3">
                  <div className="mb-2 text-sm font-semibold text-foreground">
                    Summary - {activeAumConfig.summaryMonth}
                  </div>

                  <div className="space-y-2.5">
                    {activeAumConfig.summaryMetrics.map((metric) => (
                      <div key={metric.label} className="rounded-md border border-border bg-muted/20 p-3">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          {metric.label === "Equity Traded" && (
                            <BarChart3 size={14} className="text-muted-foreground" />
                          )}
                          {metric.label === "F&O Traded" && (
                            <TrendingUp size={14} className="text-muted-foreground" />
                          )}
                          {metric.label === "MTF Traded" && (
                            <Landmark size={14} className="text-muted-foreground" />
                          )}
                          {metric.label === "Withdrawal Rate" && (
                            <Wallet size={14} className="text-muted-foreground" />
                          )}
                          {metric.label === "Fund Withdrawals" && (
                            <Wallet size={14} className="text-muted-foreground" />
                          )}
                          {metric.label === "Addition Rate" && (
                            <CircleDollarSign size={14} className="text-muted-foreground" />
                          )}
                          {metric.label === "Fund Additions" && (
                            <CircleDollarSign size={14} className="text-muted-foreground" />
                          )}
                          {metric.label === "Clients Traded" && (
                            <BarChart3 size={14} className="text-muted-foreground" />
                          )}
                          {metric.label === "AUM" && <Landmark size={14} className="text-muted-foreground" />}
                          {metric.label === "AUM Growth Rate" && (
                            <Landmark size={14} className="text-muted-foreground" />
                          )}
                          <span>{metric.label}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-xl font-semibold">
                          <span className="text-foreground">{metric.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {activeAumTab === "mutualFunds" && activeAumConfig.mfQuickviewMetrics && (
                  <aside className="rounded-md border border-border bg-card p-3">
                    <div className="mb-2 text-sm font-semibold text-foreground">Quickview</div>
                    <div className="grid grid-cols-2 divide-x divide-y rounded-md border border-border">
                      {activeAumConfig.mfQuickviewMetrics.map((metric, idx) => (
                        <article
                          key={metric.id}
                          className={`flex flex-col items-start gap-1.5 p-2.5 min-h-[74px] ${
                            idx === activeAumConfig.mfQuickviewMetrics!.length - 1
                              ? "col-span-2"
                              : ""
                          }`}
                        >
                          <div className="flex items-center gap-1.5 text-xs font-medium leading-none text-muted-foreground">
                            {metric.id === "totalMfClients" && (
                              <Users size={15} className="text-primary" aria-hidden />
                            )}
                            {metric.id === "clientsWithSips" && (
                              <UserCheck size={15} className="text-primary" aria-hidden />
                            )}
                            {metric.id === "totalActiveSips" && (
                              <BarChart3 size={15} className="text-primary" aria-hidden />
                            )}
                            {metric.id === "sipInputValue" && (
                              <CircleDollarSign size={15} className="text-primary" aria-hidden />
                            )}
                            {metric.id === "upcomingSips7Days" && (
                              <CalendarClock size={15} className="text-primary" aria-hidden />
                            )}
                            <span>{metric.label}</span>
                          </div>
                          <div className="text-xl font-semibold leading-none text-foreground">
                            {metric.value}
                          </div>
                        </article>
                      ))}
                    </div>
                  </aside>
                )}
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
