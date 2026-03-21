"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  CalendarClock,
  CircleDollarSign,
  CircleOff,
  IndianRupee,
  Landmark,
  TrendingUp,
  UserCheck,
  UserRoundCheck,
  Users,
  UserX,
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
type AumConfig = {
  totalLabel: string;
  segments: AumSegmentRow[];
  summaryMonth: string;
  summaryMetrics: AumSummaryMetric[];
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
      { label: "Total Clients", value: "1870" },
      { label: "Active Clients", value: "1393" },
      { label: "Inactive", value: "476" },
      { label: "Traded", value: "1268" },
      { label: "Never traded", value: "602" },
      { label: "Clients near churn", value: "29" },
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
      { label: "Total MF Clients", value: "1,870" },
      { label: "Clients with SIPs", value: "64" },
      { label: "Total Active SIPs", value: "166" },
      { label: "SIP Input Value", value: "₹2,73,659" },
      { label: "Upcoming SIPs in next 7 days", value: "83" },
    ],
  },
};

function formatNumber(value: number) {
  return value.toLocaleString("en-IN");
}

function SummaryMetricIcon({ label }: { label: string }) {
  const size = 15;
  const cls = "shrink-0 text-primary";

  switch (label) {
    case "AUM":
      return <Landmark size={size} className={cls} aria-hidden />;
    case "Equity Traded":
      return <BarChart3 size={size} className={cls} aria-hidden />;
    case "F&O Traded":
      return <TrendingUp size={size} className={cls} aria-hidden />;
    case "Total Clients":
    case "Total MF Clients":
      return <Users size={size} className={cls} aria-hidden />;
    case "Active Clients":
      return <UserCheck size={size} className={cls} aria-hidden />;
    case "Inactive":
      return <UserX size={size} className={cls} aria-hidden />;
    case "Traded":
      return <TrendingUp size={size} className={cls} aria-hidden />;
    case "Never traded":
      return <CircleOff size={size} className={cls} aria-hidden />;
    case "Clients near churn":
      return <AlertTriangle size={size} className={cls} aria-hidden />;
    case "Addition Rate":
    case "Total Active SIPs":
      return <CircleDollarSign size={size} className={cls} aria-hidden />;
    case "Withdrawal Rate":
      return <Wallet size={size} className={cls} aria-hidden />;
    case "Clients with SIPs":
      return <UserRoundCheck size={size} className={cls} aria-hidden />;
    case "SIP Input Value":
      return <IndianRupee size={size} className={cls} aria-hidden />;
    case "Upcoming SIPs in next 7 days":
      return <CalendarClock size={size} className={cls} aria-hidden />;
    case "MTF Traded":
    case "Fund Withdrawals":
    case "Fund Additions":
    case "Clients Traded":
    case "AUM Growth Rate":
      return <Landmark size={size} className={cls} aria-hidden />;
    default:
      return null;
  }
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
                {activeAumTab === "equity" ? "Equity AUM Overview" : "Mutual Funds AUM Overview"}
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
              <div className="rounded-md border border-border bg-card p-3">
                <div className="mb-2 text-sm font-semibold text-foreground">
                  Summary - {activeAumConfig.summaryMonth}
                </div>

                <div className="grid grid-cols-1 min-[420px]:grid-cols-3 overflow-hidden rounded-md border border-border divide-x divide-y divide-border">
                  {activeAumConfig.summaryMetrics.map((metric) => (
                    <article
                      key={metric.label}
                      className="flex min-h-[74px] flex-col items-start gap-2.5 p-2.5"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-medium leading-none text-muted-foreground">
                        <SummaryMetricIcon label={metric.label} />
                        <span>{metric.label}</span>
                      </div>
                      <div className="text-lg font-semibold leading-tight text-foreground min-[420px]:text-xl min-[420px]:leading-none">
                        {metric.value}
                      </div>
                    </article>
                  ))}
                  {activeAumConfig.summaryMetrics.length % 3 === 1 && (
                    <>
                      <div aria-hidden className="min-h-[74px] hidden min-[420px]:block" />
                      <div aria-hidden className="min-h-[74px] hidden min-[420px]:block" />
                    </>
                  )}
                  {activeAumConfig.summaryMetrics.length % 3 === 2 && (
                    <div aria-hidden className="min-h-[74px] hidden min-[420px]:block" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
