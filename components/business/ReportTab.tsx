"use client";

import { useState } from "react";
import {
  TrendingUp, Download, ArrowRight,
  Users, BarChart2, BookOpen, Landmark,
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from "recharts";

// ─── Period filter ─────────────────────────────────────────────────────────
const PERIODS = [
  { key: "today",      label: "Today" },
  { key: "yesterday",  label: "Yesterday" },
  { key: "this_week",  label: "This Week" },
  { key: "last_week",  label: "Last Week" },
  { key: "mtd",        label: "MTD" },
  { key: "last_month", label: "Last Month" },
  { key: "current_fy", label: "Current FY" },
  { key: "custom",     label: "Custom" },
] as const;
type PeriodKey = (typeof PERIODS)[number]["key"];

// ─── Mock data ─────────────────────────────────────────────────────────────
const MOCK: Record<string, {
  totalEarnings: number;
  referral: { amount: number; accountsOpened: number };
  brokerage: {
    equity: number; fo: number; commodity: number; currency: number;
    activeCustomers: number; totalCustomers: number;
    inactiveCustomers: number;
  };
  royalty: {
    amount: number;
    topReferrals: { rank: number; ucc: string; name: string; amount: number }[];
  };
  mfTrail: { amount: number; aum: number; activeSchemes: number; regularClients: number };
  uplearn: { amount: number; subscriptions: number; courses: number; webinars: number; bootcamps: number };
}> = {
  mtd: {
    totalEarnings: 48230.5,
    referral: { amount: 12400, accountsOpened: 8 },
    brokerage: { equity: 18200, fo: 42600, commodity: 3100, currency: 0, activeCustomers: 261, totalCustomers: 40293, inactiveCustomers: 40032 },
    royalty: { amount: 9800, topReferrals: [{ rank: 1, ucc: "308241", name: "Amit Verma", amount: 3200 }, { rank: 2, ucc: "111874", name: "Priya Singh", amount: 2100 }, { rank: 3, ucc: "144723", name: "Rahul Jain", amount: 1800 }] },
    mfTrail: { amount: 4230, aum: 18500000, activeSchemes: 12, regularClients: 34 },
    uplearn: { amount: 1200, subscriptions: 3, courses: 0, webinars: 0, bootcamps: 1 },
  },
  "3m": {
    totalEarnings: 186400,
    referral: { amount: 38200, accountsOpened: 24 },
    brokerage: { equity: 62000, fo: 148000, commodity: 9400, currency: 0, activeCustomers: 312, totalCustomers: 40293, inactiveCustomers: 39981 },
    royalty: { amount: 42600, topReferrals: [{ rank: 1, ucc: "308241", name: "Amit Verma", amount: 14200 }, { rank: 2, ucc: "111874", name: "Priya Singh", amount: 9800 }, { rank: 3, ucc: "144723", name: "Rahul Jain", amount: 7400 }] },
    mfTrail: { amount: 12800, aum: 21200000, activeSchemes: 18, regularClients: 41 },
    uplearn: { amount: 3800, subscriptions: 9, courses: 2, webinars: 1, bootcamps: 3 },
  },
  "6m": {
    totalEarnings: 412800,
    referral: { amount: 78400, accountsOpened: 52 },
    brokerage: { equity: 142000, fo: 308000, commodity: 18200, currency: 0, activeCustomers: 380, totalCustomers: 40293, inactiveCustomers: 39913 },
    royalty: { amount: 98600, topReferrals: [{ rank: 1, ucc: "308241", name: "Amit Verma", amount: 38200 }, { rank: 2, ucc: "111874", name: "Priya Singh", amount: 22100 }, { rank: 3, ucc: "144723", name: "Rahul Jain", amount: 14800 }] },
    mfTrail: { amount: 28400, aum: 24600000, activeSchemes: 22, regularClients: 58 },
    uplearn: { amount: 5600, subscriptions: 14, courses: 4, webinars: 2, bootcamps: 5 },
  },
  "1y": {
    totalEarnings: 1201494.6,
    referral: { amount: 624133, accountsOpened: 148 },
    brokerage: { equity: 370818, fo: 573605, commodity: 134464, currency: 0, activeCustomers: 261, totalCustomers: 40293, inactiveCustomers: 40032 },
    royalty: { amount: 1139081, topReferrals: [{ rank: 1, ucc: "308241", name: "Amit Verma", amount: 315704 }, { rank: 2, ucc: "111874", name: "Priya Singh", amount: 103867 }, { rank: 3, ucc: "144723", name: "Rahul Jain", amount: 63396 }] },
    mfTrail: { amount: 58400, aum: 28400000, activeSchemes: 28, regularClients: 74 },
    uplearn: { amount: 5480, subscriptions: 18, courses: 6, webinars: 3, bootcamps: 8 },
  },
  today: {
    totalEarnings: 1240,
    referral: { amount: 0, accountsOpened: 0 },
    brokerage: { equity: 820, fo: 380, commodity: 40, currency: 0, activeCustomers: 18, totalCustomers: 40293, inactiveCustomers: 40275 },
    royalty: { amount: 0, topReferrals: [{ rank: 1, ucc: "308241", name: "Amit Verma", amount: 0 }, { rank: 2, ucc: "111874", name: "Priya Singh", amount: 0 }, { rank: 3, ucc: "144723", name: "Rahul Jain", amount: 0 }] },
    mfTrail: { amount: 0, aum: 28400000, activeSchemes: 28, regularClients: 74 },
    uplearn: { amount: 0, subscriptions: 0, courses: 0, webinars: 0, bootcamps: 0 },
  },
  yesterday: {
    totalEarnings: 3860,
    referral: { amount: 1500, accountsOpened: 1 },
    brokerage: { equity: 1200, fo: 900, commodity: 260, currency: 0, activeCustomers: 32, totalCustomers: 40293, inactiveCustomers: 40261 },
    royalty: { amount: 0, topReferrals: [{ rank: 1, ucc: "308241", name: "Amit Verma", amount: 0 }, { rank: 2, ucc: "111874", name: "Priya Singh", amount: 0 }, { rank: 3, ucc: "144723", name: "Rahul Jain", amount: 0 }] },
    mfTrail: { amount: 0, aum: 28400000, activeSchemes: 28, regularClients: 74 },
    uplearn: { amount: 160, subscriptions: 1, courses: 0, webinars: 0, bootcamps: 0 },
  },
  this_week: {
    totalEarnings: 18400,
    referral: { amount: 4500, accountsOpened: 3 },
    brokerage: { equity: 7200, fo: 5400, commodity: 800, currency: 0, activeCustomers: 68, totalCustomers: 40293, inactiveCustomers: 40225 },
    royalty: { amount: 1800, topReferrals: [{ rank: 1, ucc: "308241", name: "Amit Verma", amount: 820 }, { rank: 2, ucc: "111874", name: "Priya Singh", amount: 540 }, { rank: 3, ucc: "144723", name: "Rahul Jain", amount: 440 }] },
    mfTrail: { amount: 2400, aum: 28400000, activeSchemes: 28, regularClients: 74 },
    uplearn: { amount: 320, subscriptions: 2, courses: 0, webinars: 0, bootcamps: 1 },
  },
  last_week: {
    totalEarnings: 22600,
    referral: { amount: 6000, accountsOpened: 4 },
    brokerage: { equity: 8400, fo: 6800, commodity: 1200, currency: 0, activeCustomers: 82, totalCustomers: 40293, inactiveCustomers: 40211 },
    royalty: { amount: 3200, topReferrals: [{ rank: 1, ucc: "308241", name: "Amit Verma", amount: 1400 }, { rank: 2, ucc: "111874", name: "Priya Singh", amount: 980 }, { rank: 3, ucc: "144723", name: "Rahul Jain", amount: 820 }] },
    mfTrail: { amount: 2800, aum: 28000000, activeSchemes: 27, regularClients: 72 },
    uplearn: { amount: 400, subscriptions: 2, courses: 1, webinars: 0, bootcamps: 0 },
  },
  last_month: {
    totalEarnings: 62400,
    referral: { amount: 15800, accountsOpened: 11 },
    brokerage: { equity: 22000, fo: 18400, commodity: 3200, currency: 0, activeCustomers: 148, totalCustomers: 40293, inactiveCustomers: 40145 },
    royalty: { amount: 12400, topReferrals: [{ rank: 1, ucc: "308241", name: "Amit Verma", amount: 5200 }, { rank: 2, ucc: "111874", name: "Priya Singh", amount: 3800 }, { rank: 3, ucc: "144723", name: "Rahul Jain", amount: 2600 }] },
    mfTrail: { amount: 8400, aum: 26400000, activeSchemes: 24, regularClients: 62 },
    uplearn: { amount: 1800, subscriptions: 5, courses: 1, webinars: 1, bootcamps: 2 },
  },
  current_fy: {
    totalEarnings: 824600,
    referral: { amount: 214000, accountsOpened: 86 },
    brokerage: { equity: 248000, fo: 312000, commodity: 52000, currency: 0, activeCustomers: 320, totalCustomers: 40293, inactiveCustomers: 39973 },
    royalty: { amount: 682000, topReferrals: [{ rank: 1, ucc: "308241", name: "Amit Verma", amount: 214000 }, { rank: 2, ucc: "111874", name: "Priya Singh", amount: 86000 }, { rank: 3, ucc: "144723", name: "Rahul Jain", amount: 54000 }] },
    mfTrail: { amount: 42000, aum: 28400000, activeSchemes: 28, regularClients: 74 },
    uplearn: { amount: 4200, subscriptions: 14, courses: 4, webinars: 2, bootcamps: 6 },
  },
  custom: {
    totalEarnings: 1201494.6,
    referral: { amount: 624133, accountsOpened: 148 },
    brokerage: { equity: 370818, fo: 573605, commodity: 134464, currency: 0, activeCustomers: 261, totalCustomers: 40293, inactiveCustomers: 40032 },
    royalty: { amount: 1139081, topReferrals: [{ rank: 1, ucc: "308241", name: "Amit Verma", amount: 315704 }, { rank: 2, ucc: "111874", name: "Priya Singh", amount: 103867 }, { rank: 3, ucc: "144723", name: "Rahul Jain", amount: 63396 }] },
    mfTrail: { amount: 58400, aum: 28400000, activeSchemes: 28, regularClients: 74 },
    uplearn: { amount: 5480, subscriptions: 18, courses: 6, webinars: 3, bootcamps: 8 },
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────
function fmt(v: number) {
  if (v >= 10000000) return "₹" + (v / 10000000).toFixed(2) + "Cr";
  if (v >= 100000) return "₹" + (v / 100000).toFixed(2) + "L";
  return "₹" + v.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}
function fmtFull(v: number) {
  return "₹" + v.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const BROKERAGE_COLORS = [
  { key: "equity" as const,    label: "Equity",    color: "#1e3a5f" },
  { key: "fo" as const,        label: "F&O",       color: "#10b981" },
  { key: "commodity" as const, label: "Commodity", color: "#60a5fa" },
  { key: "currency" as const,  label: "Currency",  color: "#f59e0b" },
];

function ViewReportLink() {
  return (
    <button type="button" className="flex items-center gap-0.5 text-xs font-medium text-primary hover:underline">
      View Report <ArrowRight size={11} />
    </button>
  );
}

// ─── Individual Cards ──────────────────────────────────────────────────────

function ReferralRevenueCard({ data }: { data: typeof MOCK["mtd"]["referral"] }) {
  return (
    <div className="rounded-md border border-border bg-card p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={15} className="text-primary shrink-0" />
          <h3 className="text-sm font-semibold text-foreground">Referral Revenue</h3>
        </div>
        <ViewReportLink />
      </div>

      <p className="text-2xl font-bold text-foreground tracking-tight">{fmtFull(data.amount)}</p>

      <div className="border-t border-border pt-3 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Accounts opened</span>
        <span className="font-semibold text-foreground">{data.accountsOpened}</span>
      </div>
      <div className="flex items-center justify-between text-sm -mt-1">
        <span className="text-muted-foreground">Avg. per account</span>
        <span className="font-semibold text-foreground">
          {data.accountsOpened > 0 ? fmtFull(data.amount / data.accountsOpened) : "—"}
        </span>
      </div>
    </div>
  );
}

function BrokerageCommissionCard({ data }: { data: typeof MOCK["mtd"]["brokerage"] }) {
  const chartData = BROKERAGE_COLORS.map(({ key, label, color }) => ({
    name: label, value: data[key], color,
  }));
  const total = chartData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="rounded-md border border-border bg-card p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart2 size={15} className="text-primary shrink-0" />
          <h3 className="text-sm font-semibold text-foreground leading-tight">
            Brokerage Commission
          </h3>
        </div>
        <ViewReportLink />
      </div>

      {/* Donut + legend side by side */}
      <div className="flex items-center gap-4">
        <div className="w-[110px] h-[110px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius="52%"
                outerRadius="90%"
                cx="50%"
                cy="50%"
                stroke="var(--color-card)"
                strokeWidth={2}
              >
                {chartData.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: number) => [fmtFull(v)]}
                contentStyle={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)", borderRadius: "0.375rem", fontSize: "11px" }}
                itemStyle={{ color: "var(--color-foreground)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-1.5">
          {chartData.map((d) => (
            <div key={d.name} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-xs text-muted-foreground">{d.name}</span>
              </div>
              <span className="text-xs font-medium text-foreground">{fmt(d.value)}</span>
            </div>
          ))}
          <div className="pt-1 border-t border-border flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">Total</span>
            <span className="text-xs font-bold text-foreground">{fmt(total)}</span>
          </div>
        </div>
      </div>

      {/* Customer stats */}
      <div className="border-t border-border pt-3 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Active customers</span>
          <span className="font-medium text-foreground">
            {data.activeCustomers.toLocaleString("en-IN")} / {data.totalCustomers.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Inactive customers</span>
          <span className="font-medium text-foreground">
            {data.inactiveCustomers.toLocaleString("en-IN")} / {data.totalCustomers.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
}

function RoyaltyEarningsCard({ data }: { data: typeof MOCK["mtd"]["royalty"] }) {
  return (
    <div className="rounded-md border border-border bg-card p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp size={15} className="text-primary shrink-0" />
          <h3 className="text-sm font-semibold text-foreground">Royalty Earnings</h3>
        </div>
        <ViewReportLink />
      </div>

      <p className="text-2xl font-bold text-foreground tracking-tight">{fmtFull(data.amount)}</p>

      {/* Top referrals mini table */}
      <div className="border-t border-border pt-3">
        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Top 3 Referrals</p>
        <div className="rounded border border-border overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                {["#", "UCC", "Name", "Royalty"].map((h) => (
                  <th key={h} className="px-3 py-2 text-left font-semibold text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.topReferrals.map((r) => (
                <tr key={r.rank} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className="px-3 py-2 text-muted-foreground">{r.rank}</td>
                  <td className="px-3 py-2 font-medium text-foreground">{r.ucc}</td>
                  <td className="px-3 py-2 text-muted-foreground truncate max-w-[80px]">{r.name}</td>
                  <td className="px-3 py-2 font-medium text-foreground">{fmt(r.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MFTrailCard({ data }: { data: typeof MOCK["mtd"]["mfTrail"] }) {
  return (
    <div className="rounded-md border border-border bg-card p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Landmark size={15} className="text-primary shrink-0" />
          <h3 className="text-sm font-semibold text-foreground">MF Trail Commission</h3>
        </div>
        <ViewReportLink />
      </div>

      <p className="text-2xl font-bold text-foreground tracking-tight">{fmtFull(data.amount)}</p>

      <div className="border-t border-border pt-3 grid grid-cols-2 gap-x-4 gap-y-2">
        <div>
          <p className="text-xs text-muted-foreground">AUM Managed</p>
          <p className="text-sm font-semibold text-foreground mt-0.5">{fmt(data.aum)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Regular MF Clients</p>
          <p className="text-sm font-semibold text-foreground mt-0.5">{data.regularClients}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Active Schemes</p>
          <p className="text-sm font-semibold text-foreground mt-0.5">{data.activeSchemes}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Avg. Trail / Client</p>
          <p className="text-sm font-semibold text-foreground mt-0.5">
            {data.regularClients > 0 ? fmt(data.amount / data.regularClients) : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

function UpLearnRevenueCard({ data }: { data: typeof MOCK["mtd"]["uplearn"] }) {
  const items = [
    { label: "Subscriptions sold", value: data.subscriptions },
    { label: "Courses sold",       value: data.courses },
    { label: "Webinars sold",      value: data.webinars },
    { label: "Bootcamps sold",     value: data.bootcamps },
  ];

  return (
    <div className="rounded-md border border-border bg-card p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen size={15} className="text-primary shrink-0" />
          <h3 className="text-sm font-semibold text-foreground">UpLearn Revenue</h3>
        </div>
        <button type="button" className="flex items-center gap-0.5 text-xs font-medium text-primary hover:underline">
          Refer more <ArrowRight size={11} />
        </button>
      </div>

      <p className="text-2xl font-bold text-foreground tracking-tight">{fmtFull(data.amount)}</p>

      <div className="border-t border-border pt-3 space-y-2">
        {items.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-semibold text-foreground">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────
export function ReportTab() {
  const [period, setPeriod] = useState<PeriodKey>("current_fy");
  const d = MOCK[period];

  return (
    <main className="flex-1 p-4 sm:p-6">
      {/* Section heading */}
      <h2 className="flex items-center gap-2 border-l-[3px] border-primary pl-3 text-lg font-semibold text-foreground tracking-tight mb-5">
        <TrendingUp size={18} className="text-primary shrink-0" />
        Earnings Report
      </h2>

      <div className="space-y-5">
        {/* Summary: mobile = total+ledger row then pills; lg+ = one row: total | pills | ledger */}
        <div className="grid gap-3 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-4">
          <div className="flex items-end justify-between gap-3 lg:block">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5">Total Earnings</p>
              <p className="text-2xl font-bold text-foreground tracking-tight">{fmtFull(d.totalEarnings)}</p>
            </div>
            <button
              type="button"
              className="flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-background text-xs font-medium text-foreground hover:border-primary/40 hover:bg-muted/30 transition-colors shrink-0 lg:hidden"
            >
              <Download size={13} className="text-muted-foreground" />
              Earnings Ledger
            </button>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 min-w-0 lg:justify-end">
            {PERIODS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setPeriod(key as PeriodKey)}
                className={`shrink-0 h-7 rounded-full px-3 text-xs font-medium border transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
                  period === key
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex lg:items-center lg:justify-end">
            <button
              type="button"
              className="flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-background text-xs font-medium text-foreground hover:border-primary/40 hover:bg-muted/30 transition-colors shrink-0"
            >
              <Download size={13} className="text-muted-foreground" />
              Earnings Ledger
            </button>
          </div>
        </div>

        {/* Cards grid — 3 per row on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ReferralRevenueCard     data={d.referral}  />
          <BrokerageCommissionCard data={d.brokerage} />
          <RoyaltyEarningsCard     data={d.royalty}   />
          <MFTrailCard             data={d.mfTrail}   />
          <UpLearnRevenueCard      data={d.uplearn}   />
          <div className="rounded-md border border-dashed border-border bg-muted/10 flex items-center justify-center p-6">
            <p className="text-xs text-muted-foreground">More revenue streams coming soon</p>
          </div>
        </div>
      </div>
    </main>
  );
}
