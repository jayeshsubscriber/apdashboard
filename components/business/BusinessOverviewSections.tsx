"use client";

import { useState } from "react";
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

type NewUserStatRow = {
  month: string;
  newUsers: number;
};

const NEW_USER_STATS: NewUserStatRow[] = [
  { month: "Jan 2025", newUsers: 18 },
  { month: "Feb 2025", newUsers: 34 },
  { month: "Mar 2025", newUsers: 27 },
  { month: "Apr 2025", newUsers: 41 },
  { month: "May 2025", newUsers: 53 },
  { month: "Jun 2025", newUsers: 48 },
  { month: "Jul 2025", newUsers: 36 },
  { month: "Aug 2025", newUsers: 29 },
  { month: "Sep 2025", newUsers: 62 },
  { month: "Oct 2025", newUsers: 74 },
  { month: "Nov 2025", newUsers: 88 },
  { month: "Dec 2025", newUsers: 95 },
  { month: "Jan 2026", newUsers: 112 },
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

const EQUITY_AUM_CONFIG: AumConfig = {
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
};

const MUTUAL_FUNDS_AUM_CONFIG: AumConfig = {
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
    default:
      return null;
  }
}

function AumTabContent({ config }: { config: AumConfig }) {
  const { segments, summaryMonth, summaryMetrics } = config;

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Chart + legend */}
      <div className="lg:w-[55%] shrink-0">
        <div className="h-[200px] min-h-[200px] sm:h-[248px] sm:min-h-[248px] overflow-visible">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 4, left: 4, bottom: 0 }}>
              <Pie
                data={segments}
                dataKey="value"
                nameKey="name"
                startAngle={180}
                endAngle={0}
                innerRadius="38%"
                outerRadius="130%"
                cx="50%"
                cy="96%"
                stroke="var(--color-card)"
                strokeWidth={3}
              >
                {segments.map((segment) => (
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
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
          {segments.map((segment) => (
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

      {/* Summary metrics */}
      <div className="flex-1 min-w-0">
        <div className="mb-2 text-sm font-semibold text-foreground">Summary - {summaryMonth}</div>
        <div className="grid grid-cols-2 overflow-hidden rounded-md border border-border divide-x divide-y divide-border">
          {summaryMetrics.map((metric) => (
            <article
              key={metric.label}
              className="flex min-h-[74px] flex-col items-start gap-2.5 p-2.5"
            >
              <div className="flex items-center gap-1.5 text-xs font-medium leading-none text-muted-foreground">
                <SummaryMetricIcon label={metric.label} />
                <span>{metric.label}</span>
              </div>
              <div className="text-base font-semibold leading-tight text-foreground sm:text-lg sm:leading-none">
                {metric.value}
              </div>
            </article>
          ))}
          {summaryMetrics.length % 2 === 1 && (
            <div aria-hidden className="min-h-[74px]" />
          )}
        </div>
      </div>
    </div>
  );
}

const AUM_TABS = ["Equity AUM", "Mutual Funds AUM"] as const;
type AumTab = (typeof AUM_TABS)[number];

function AumSummarySection() {
  const [activeTab, setActiveTab] = useState<AumTab>("Equity AUM");

  return (
    <div className="min-w-0 p-0">
      {/* Tab bar */}
      <div className="flex gap-1 mb-4">
        {AUM_TABS.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`h-8 rounded-full px-3 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-primary hover:bg-muted"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {activeTab === "Equity AUM" && (
        <AumTabContent config={EQUITY_AUM_CONFIG} />
      )}
      {activeTab === "Mutual Funds AUM" && (
        <AumTabContent config={MUTUAL_FUNDS_AUM_CONFIG} />
      )}
    </div>
  );
}

export function BusinessOverviewSections() {
  return (
    <section>
      <h2 className="flex items-center gap-2 border-l-[3px] border-primary pl-3 text-lg font-semibold tracking-tight text-foreground">
        <TrendingUp size={18} className="text-primary shrink-0" />
        Equity, F&amp;O, Commodity &amp; Currency Segment
      </h2>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            New Users Onboarded
          </h3>
          <div className="mt-2 h-[220px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={NEW_USER_STATS} margin={{ top: 8, right: 8, left: 0, bottom: 12 }}>
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
                  formatter={(value: number) => [formatNumber(value), "New Users"]}
                  labelStyle={{ color: "var(--color-foreground)" }}
                  contentStyle={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-card)",
                    borderRadius: "0.5rem",
                  }}
                />
                <Bar dataKey="newUsers" name="New Users" fill="var(--color-chart-3)" radius={[4, 4, 0, 0]}>
                  <LabelList
                    dataKey="newUsers"
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

      <section className="mt-5 w-full">
        <div className="mb-4">
          <h3 className="flex items-center gap-2 border-l-[3px] border-primary pl-3 text-base font-semibold tracking-tight text-foreground">
            <Wallet size={16} className="text-primary shrink-0" />
            AUM Summary
          </h3>
        </div>
        <AumSummarySection />
      </section>
    </section>
  );
}
