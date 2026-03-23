"use client";

import { useState } from "react";
import { ChevronRight, Eye, EyeOff, Layers, Lightbulb, MessageCircle, Phone } from "lucide-react";
import { BOActionModal, type BOActionPayload, type BOActionType } from "./BOActionModal";

const WhatsAppIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const visible = local.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(local.length - 2, 3))}@${domain}`;
}

function maskPhone(phone: string) {
  if (phone.length <= 6) return "*".repeat(phone.length);
  return `${"*".repeat(6)}${phone.slice(6)}`;
}

function buildWhatsAppUrl(name: string, phone: string, currentStep: string) {
  const message = `Hi ${name}! 👋\n\nYour Upstox account opening is almost complete — you're just a step away!\n\nYou're currently at the *${currentStep}* step. Completing it takes less than 2 minutes.\n\nHere's why thousands of investors choose Upstox:\n✅ Zero brokerage on delivery trades\n✅ Advanced charting & research tools\n✅ Instant account activation\n✅ Trusted by 1 Cr+ investors\n\nComplete your application now 👉 https://upstox.com/open-account/\n\nNeed help? Reply here and I'll guide you through it!`;
  const clean = phone.replace(/\D/g, "");
  const intl = clean.startsWith("91") ? clean : `91${clean}`;
  return `https://wa.me/${intl}?text=${encodeURIComponent(message)}`;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type PillId =
  | "leads" | "readyToTrade" | "recentlyActivated"
  | "likelyToLapse" | "highFnO" | "topFive"
  | "equity" | "fno" | "intraday" | "ipo" | "mf" | "mtf"
;

type Pill = { id: PillId; label: string; count: number };
type Section = { title: string; pills: Pill[] };

type SimpleRow             = { name: string; metric: string };
type LeadRow               = { clientUcc: string; dateCreated: string; lastUpdated: string; name: string; email: string; phoneNumber: string; currentStep: string };
type ReadyToTradeRow       = { ucc: string; name: string; phoneNumber: string; accountOpened: string; orderPlaced: boolean };
type RecentlyActivatedRow  = { ucc: string; name: string; phoneNumber: string; accountOpened: string; recentOrder: string; orderDate: string };
type LikelyToLapseRow      = { ucc: string; name: string; phoneNumber: string; lastTraded: string; daysInactive: number; productsTraded: string };
type HighFnORow            = { ucc: string; name: string; phoneNumber: string; netLoss: string; lossPeriod: string };
type TopFiveRow            = { ucc: string; name: string; phoneNumber: string; prevMonthRevenue: string; productsHeld: string };
type EquityUpsellRow       = { ucc: string; name: string; phoneNumber: string; portfolioValue: string; lastTraded: string };
type FnOUpsellRow          = { ucc: string; name: string; phoneNumber: string; monthlyTurnover: string; contractsTraded: number };
type IntradayUpsellRow     = { ucc: string; name: string; phoneNumber: string; avgDailyTrades: number; monthlyVolume: string };
type IpoUpsellRow          = { ucc: string; name: string; phoneNumber: string; lastIpoApplied: string; applicationAmount: string };
type MfUpsellRow           = { ucc: string; name: string; phoneNumber: string; monthlySip: string; totalInvestment: string };
type MtfUpsellRow          = { ucc: string; name: string; phoneNumber: string; mtfUtilized: string; creditLimit: string };
type DetailPane =
  | { kind: "simple";             title: string; metricHeader: string; rows: SimpleRow[]; insight: string }
  | { kind: "leads";              title: string; rows: LeadRow[]; insight: string }
  | { kind: "readyToTrade";       title: string; rows: ReadyToTradeRow[]; insight: string }
  | { kind: "recentlyActivated";  title: string; rows: RecentlyActivatedRow[]; insight: string }
  | { kind: "likelyToLapse";      title: string; rows: LikelyToLapseRow[]; insight: string }
  | { kind: "highFnO";            title: string; rows: HighFnORow[]; insight: string }
  | { kind: "topFive";            title: string; rows: TopFiveRow[]; insight: string }
  | { kind: "equityUpsell";       title: string; rows: EquityUpsellRow[]; insight: string }
  | { kind: "fnoUpsell";          title: string; rows: FnOUpsellRow[]; insight: string }
  | { kind: "intradayUpsell";     title: string; rows: IntradayUpsellRow[]; insight: string }
  | { kind: "ipoUpsell";          title: string; rows: IpoUpsellRow[]; insight: string }
  | { kind: "mfUpsell";           title: string; rows: MfUpsellRow[]; insight: string }
  | { kind: "mtfUpsell";          title: string; rows: MtfUpsellRow[]; insight: string };

// ─── Static data ──────────────────────────────────────────────────────────────

const SECTIONS: Section[] = [
  {
    title: "Onboarding & Activation",
    pills: [
      { id: "leads",             label: "Leads",              count: 38  },
      { id: "readyToTrade",      label: "Ready to trade",     count: 214 },
      { id: "recentlyActivated", label: "Recently activated", count: 162 },
    ],
  },
  {
    title: "At Risk",
    pills: [
      { id: "likelyToLapse", label: "Likely to lapse",    count: 25 },
      { id: "highFnO",       label: "High F&O losses",    count: 5  },
      { id: "topFive",       label: "Top 5% clients",     count: 4  },
    ],
  },
  {
    title: "Upsell",
    pills: [
      { id: "equity",   label: "Equity clients",   count: 96  },
      { id: "fno",      label: "F&O clients",       count: 16  },
      { id: "intraday", label: "Intraday clients",  count: 96  },
      { id: "ipo",      label: "IPO clients",       count: 2   },
      { id: "mf",       label: "MF clients",        count: 381 },
      { id: "mtf",      label: "MTF clients",       count: 14  },
    ],
  },
];

const DETAIL_MAP: Record<PillId, DetailPane> = {
  leads: {
    kind: "leads",
    title: "Leads",
    insight: "These prospects started account opening but haven't completed it. A quick follow-up call or WhatsApp message can unblock the step they're stuck on and move them to active.",
    rows: [
      { clientUcc: "SDKR3321", dateCreated: "03 Mar 2026", lastUpdated: "05 Mar 2026", name: "Sandeep Kumar",   email: "sandeep.kumar@gmail.com",   phoneNumber: "9876543210", currentStep: "PAN & DOB"        },
      { clientUcc: "HMLK8842", dateCreated: "02 Mar 2026", lastUpdated: "04 Mar 2026", name: "Harshali Mane",   email: "harshali.mane@yahoo.com",   phoneNumber: "9988776655", currentStep: "ESign"             },
      { clientUcc: "PSHA4431", dateCreated: "01 Mar 2026", lastUpdated: "03 Mar 2026", name: "Prasad Shah",     email: "prasad.shah@outlook.com",   phoneNumber: "9123456780", currentStep: "Bank Verification" },
      { clientUcc: "ABHS1190", dateCreated: "28 Feb 2026", lastUpdated: "02 Mar 2026", name: "Amit Bhosale",    email: "amit.bhosale@gmail.com",    phoneNumber: "9012345678", currentStep: "IPV"               },
      { clientUcc: "NSLK7163", dateCreated: "27 Feb 2026", lastUpdated: "01 Mar 2026", name: "Nikita Salunkhe", email: "nikita.salunkhe@gmail.com", phoneNumber: "9871234506", currentStep: "ESign"             },
    ],
  },
  readyToTrade: {
    kind: "readyToTrade",
    title: "Ready to trade",
    insight: "Accounts are open but these clients haven't placed their first trade yet. Reach out to help them get started — share a market opportunity or a simple SIP idea to kick off their journey.",
    rows: [
      { ucc: "SDKR3321", name: "Sandeep Kumar",   phoneNumber: "9876543210", accountOpened: "01 Mar 2026", orderPlaced: false },
      { ucc: "HMLK8842", name: "Harshali Mane",   phoneNumber: "9988776655", accountOpened: "28 Feb 2026", orderPlaced: false },
      { ucc: "PSHA4431", name: "Prasad Shah",     phoneNumber: "9123456780", accountOpened: "25 Feb 2026", orderPlaced: true  },
      { ucc: "ABHS1190", name: "Amit Bhosale",    phoneNumber: "9012345678", accountOpened: "22 Feb 2026", orderPlaced: false },
      { ucc: "NSLK7163", name: "Nikita Salunkhe", phoneNumber: "9871234506", accountOpened: "20 Feb 2026", orderPlaced: false },
    ],
  },
  recentlyActivated: {
    kind: "recentlyActivated",
    title: "Recently activated",
    insight: "These clients placed their first trade in the last 30 days. Build on this early momentum — congratulate them and suggest their next investment to deepen engagement.",
    rows: [
      { ucc: "RSWY8821", name: "Rahul Suryawanshi", phoneNumber: "9823401234", accountOpened: "01 Mar 2026", recentOrder: "Equity",        orderDate: "05 Mar 2026" },
      { ucc: "SNIK2043", name: "Shruti Naik",       phoneNumber: "9765098321", accountOpened: "25 Feb 2026", recentOrder: "Mutual Funds",  orderDate: "02 Mar 2026" },
      { ucc: "MKRD1297", name: "Manish Korde",      phoneNumber: "9654123780", accountOpened: "22 Feb 2026", recentOrder: "Bonds",         orderDate: "28 Feb 2026" },
      { ucc: "TPAT4471", name: "Tejas Patil",       phoneNumber: "9543210987", accountOpened: "18 Feb 2026", recentOrder: "F&O",           orderDate: "25 Feb 2026" },
      { ucc: "AKMB3905", name: "Aarti Kamble",      phoneNumber: "9432109876", accountOpened: "15 Feb 2026", recentOrder: "FD",            orderDate: "20 Feb 2026" },
    ],
  },
  likelyToLapse: {
    kind: "likelyToLapse",
    title: "Likely to lapse",
    insight: "These clients haven't traded in 30+ days and are at risk of going dormant. Reach out now with a relevant market update or product idea — early re-engagement is far easier than winning them back later.",
    rows: [
      { ucc: "SHJV1174",   name: "Samadhan Bhaskar Rakibe",    phoneNumber: "9812345670", lastTraded: "26 Feb 2026", daysInactive: 24, productsTraded: "Equity, F&O"    },
      { ucc: "M61747471",  name: "Mira Trymbak Pawar",         phoneNumber: "9723456781", lastTraded: "24 Feb 2026", daysInactive: 26, productsTraded: "Equity"          },
      { ucc: "B564881",    name: "Bhushan Subhash Shinde",     phoneNumber: "9634567892", lastTraded: "23 Feb 2026", daysInactive: 27, productsTraded: "MF, Bonds"       },
      { ucc: "AAA6180438", name: "Yashodeep Yashwant Kulkarni",phoneNumber: "9545678903", lastTraded: "21 Feb 2026", daysInactive: 29, productsTraded: "Equity, ETFs"    },
      { ucc: "SHJV1187",   name: "Ajit Jaychand Dagade",       phoneNumber: "9456789014", lastTraded: "20 Feb 2026", daysInactive: 30, productsTraded: "F&O"             },
    ],
  },
  highFnO: {
    kind: "highFnO",
    title: "High F&O losses",
    insight: "These clients have incurred significant F&O losses this month. Check in with empathy — help them review their strategy, set stop-losses, or consider diversifying into less volatile products.",
    rows: [
      { ucc: "PDBS8182", name: "Prasad Bhosale",  phoneNumber: "9867541230", netLoss: "₹1,42,000", lossPeriod: "Last 7 days"  },
      { ucc: "NTGV2197", name: "Nitin Gavhane",   phoneNumber: "9756432109", netLoss: "₹1,11,300", lossPeriod: "Last 7 days"  },
      { ucc: "AKMR7165", name: "Akash More",      phoneNumber: "9645321098", netLoss: "₹94,600",   lossPeriod: "Last 30 days" },
      { ucc: "SGKL6291", name: "Sagar Kulkarni",  phoneNumber: "9534210987", netLoss: "₹88,200",   lossPeriod: "Last 30 days" },
      { ucc: "RHPT5408", name: "Rohan Patil",     phoneNumber: "9423109876", netLoss: "₹73,900",   lossPeriod: "Mar 2026"     },
    ],
  },
  topFive: {
    kind: "topFive",
    title: "Top 5% clients",
    insight: "Your highest-revenue clients — they deserve white-glove attention. Schedule a personal check-in, share exclusive market insights, and ensure they feel valued to protect this relationship.",
    rows: [
      { ucc: "VVRA3108", name: "Vivek Rane",      phoneNumber: "9811223344", prevMonthRevenue: "₹58,000", productsHeld: "Equity, F&O, MF"     },
      { ucc: "ANKS1472", name: "Aniket Shinde",   phoneNumber: "9722334455", prevMonthRevenue: "₹49,700", productsHeld: "Equity, ETFs"         },
      { ucc: "PRCV9324", name: "Priya Chavan",    phoneNumber: "9633445566", prevMonthRevenue: "₹44,300", productsHeld: "MF, Bonds, FD"        },
      { ucc: "KRJT5506", name: "Kiran Jagtap",    phoneNumber: "9544556677", prevMonthRevenue: "₹38,900", productsHeld: "Equity, F&O"          },
      { ucc: "DPMN7112", name: "Deepali Mane",    phoneNumber: "9455667788", prevMonthRevenue: "₹34,100", productsHeld: "Equity, MF, Bonds"    },
    ],
  },
  equity: {
    kind: "equityUpsell",
    title: "Equity clients",
    insight: "Active equity traders who haven't explored other products yet. Introduce them to F&O for hedging, ETFs for diversification, or SIPs for long-term wealth — based on their risk appetite.",
    rows: [
      { ucc: "SHJV1174",   name: "Samadhan Bhaskar Rakibe", phoneNumber: "9812345670", portfolioValue: "₹4.2L",  lastTraded: "20 Mar 2026" },
      { ucc: "M61747471",  name: "Mira Trymbak Pawar",      phoneNumber: "9723456781", portfolioValue: "₹3.8L",  lastTraded: "19 Mar 2026" },
      { ucc: "AAA6180438", name: "Yashodeep Kulkarni",      phoneNumber: "9634567892", portfolioValue: "₹2.9L",  lastTraded: "18 Mar 2026" },
      { ucc: "PDBS8182",   name: "Prasad Bhosale",          phoneNumber: "9545678903", portfolioValue: "₹2.4L",  lastTraded: "17 Mar 2026" },
      { ucc: "SHJV2023",   name: "Nikhil Patankar",         phoneNumber: "9456789014", portfolioValue: "₹1.9L",  lastTraded: "15 Mar 2026" },
    ],
  },
  fno: {
    kind: "fnoUpsell",
    title: "F&O clients",
    insight: "F&O traders with growing volume but no MTF or equity holdings. Nudge them towards Margin Trade Funding to amplify their positions, or equity SIPs to balance their high-risk exposure.",
    rows: [
      { ucc: "GNKD4528", name: "Ganesh Kadam",  phoneNumber: "9811122233", monthlyTurnover: "₹18.4L", contractsTraded: 142 },
      { ucc: "YGPW6731", name: "Yogesh Pawar",  phoneNumber: "9722233344", monthlyTurnover: "₹14.2L", contractsTraded: 118 },
      { ucc: "SJKL2087", name: "Sujata Koli",   phoneNumber: "9633344455", monthlyTurnover: "₹11.6L", contractsTraded: 96  },
      { ucc: "NDSL1128", name: "Ninad Salvi",   phoneNumber: "9544455566", monthlyTurnover: "₹9.8L",  contractsTraded: 84  },
      { ucc: "MRJT6650", name: "Mrunal Jagtap", phoneNumber: "9455566677", monthlyTurnover: "₹8.1L",  contractsTraded: 71  },
    ],
  },
  intraday: {
    kind: "intradayUpsell",
    title: "Intraday clients",
    insight: "Frequent intraday traders who are highly active but may be missing out on positional opportunities. Suggest swing trading, F&O strategies, or a small SIP to build wealth alongside their trading.",
    rows: [
      { ucc: "PRCV9324", name: "Priya Chavan",            phoneNumber: "9811223344", avgDailyTrades: 8,  monthlyVolume: "₹22.1L" },
      { ucc: "KRJT5506", name: "Kiran Jagtap",            phoneNumber: "9722334455", avgDailyTrades: 7,  monthlyVolume: "₹19.4L" },
      { ucc: "DPMN7112", name: "Deepali Mane",            phoneNumber: "9633445566", avgDailyTrades: 6,  monthlyVolume: "₹16.8L" },
      { ucc: "SHJV1174", name: "Samadhan Bhaskar Rakibe", phoneNumber: "9544556677", avgDailyTrades: 5,  monthlyVolume: "₹14.2L" },
      { ucc: "M61747471",name: "Mira Trymbak Pawar",      phoneNumber: "9455667788", avgDailyTrades: 5,  monthlyVolume: "₹12.9L" },
    ],
  },
  ipo: {
    kind: "ipoUpsell",
    title: "IPO clients",
    insight: "Clients who have shown interest in recent IPOs. Alert them to upcoming IPO opportunities and help them apply — this drives engagement and positions you as a proactive advisor.",
    rows: [
      { ucc: "VVRA3108", name: "Vivek Rane",    phoneNumber: "9811223344", lastIpoApplied: "Apex Green Energy",   applicationAmount: "₹14,000" },
      { ucc: "ANKS1472", name: "Aniket Shinde", phoneNumber: "9722334455", lastIpoApplied: "Nexa Finance",        applicationAmount: "₹10,500" },
      { ucc: "PRCV9324", name: "Priya Chavan",  phoneNumber: "9633445566", lastIpoApplied: "Apex Green Energy",   applicationAmount: "₹7,000"  },
      { ucc: "KRJT5506", name: "Kiran Jagtap",  phoneNumber: "9544556677", lastIpoApplied: "Nexa Finance",        applicationAmount: "₹7,000"  },
      { ucc: "DPMN7112", name: "Deepali Mane",  phoneNumber: "9455667788", lastIpoApplied: "Apex Green Energy",   applicationAmount: "₹3,500"  },
    ],
  },
  mf: {
    kind: "mfUpsell",
    title: "MF clients",
    insight: "Regular MF investors building long-term wealth. Engage them to increase their SIP amount, explore equity funds, or consider debt funds to balance their portfolio.",
    rows: [
      { ucc: "PDBS8182",   name: "Prasad Bhosale",       phoneNumber: "9867541230", monthlySip: "₹25,000", totalInvestment: "₹12.5L" },
      { ucc: "M61747471",  name: "Mira Trymbak Pawar",   phoneNumber: "9756432109", monthlySip: "₹18,000", totalInvestment: "₹9.8L"  },
      { ucc: "SHJV1187",   name: "Rahul Singh",          phoneNumber: "9645321098", monthlySip: "₹12,000", totalInvestment: "₹7.2L"  },
      { ucc: "AAA6180438", name: "Yashodeep Kulkarni",   phoneNumber: "9534210987", monthlySip: "₹10,000", totalInvestment: "₹6.4L"  },
      { ucc: "AADK110932", name: "Neha Kulkarni",        phoneNumber: "9423109876", monthlySip: "₹8,000",  totalInvestment: "₹5.9L"  },
    ],
  },
  mtf: {
    kind: "mtfUpsell",
    title: "MTF clients",
    insight: "Clients eligible for Margin Trade Funding with significant upsell potential. Share how MTF can help them take larger positions with existing holdings — a direct revenue and engagement driver.",
    rows: [
      { ucc: "RSWY8821", name: "Rahul Suryawanshi", phoneNumber: "9823401234", mtfUtilized: "₹18,400", creditLimit: "₹50,000" },
      { ucc: "SNIK2043", name: "Shruti Naik",       phoneNumber: "9765098321", mtfUtilized: "₹15,200", creditLimit: "₹45,000" },
      { ucc: "MKRD1297", name: "Manish Korde",      phoneNumber: "9654123780", mtfUtilized: "₹12,800", creditLimit: "₹40,000" },
      { ucc: "TPAT4471", name: "Tejas Patil",       phoneNumber: "9543210987", mtfUtilized: "₹10,100", creditLimit: "₹35,000" },
      { ucc: "AKMB3905", name: "Aarti Kamble",      phoneNumber: "9432109876", mtfUtilized: "₹8,600",  creditLimit: "₹30,000" },
    ],
  },
};

// ─── Detail panel ─────────────────────────────────────────────────────────────

const COMPLETE_APPLICATION_URL = "https://upstox.com/customer-onboarding/verify/pan/";

function LeadsTable({ pane }: { pane: Extract<DetailPane, { kind: "leads" }> }) {
  const [revealedEmails, setRevealedEmails] = useState<Record<string, boolean>>({});
  const [revealedPhones, setRevealedPhones] = useState<Record<string, boolean>>({});

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Date created</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Last updated</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Name</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Email</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Mobile</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Current step</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Suggestions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {pane.rows.map((r) => (
            <tr key={r.clientUcc} className="hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => window.open(COMPLETE_APPLICATION_URL, "_blank")}>
              <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">{r.dateCreated}</td>
              <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">{r.lastUpdated}</td>
              <td className="px-3 py-2.5 font-medium text-foreground whitespace-nowrap">{r.name}</td>
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs text-muted-foreground">
                    {revealedEmails[r.clientUcc] ? r.email : maskEmail(r.email)}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setRevealedEmails((p) => ({ ...p, [r.clientUcc]: !p[r.clientUcc] })); }}
                    className="shrink-0 text-muted-foreground hover:text-foreground"
                    aria-label={revealedEmails[r.clientUcc] ? "Hide email" : "Show email"}
                  >
                    {revealedEmails[r.clientUcc] ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                </div>
              </td>
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs text-muted-foreground">
                    {revealedPhones[r.clientUcc] ? r.phoneNumber : maskPhone(r.phoneNumber)}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setRevealedPhones((p) => ({ ...p, [r.clientUcc]: !p[r.clientUcc] })); }}
                    className="shrink-0 text-muted-foreground hover:text-foreground"
                    aria-label={revealedPhones[r.clientUcc] ? "Hide mobile" : "Show mobile"}
                  >
                    {revealedPhones[r.clientUcc] ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                </div>
              </td>
              <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">{r.currentStep}</td>
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-2.5">
                  <a
                    href={buildWhatsAppUrl(r.name, r.phoneNumber, r.currentStep)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center w-6 h-6 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
                    aria-label="Send WhatsApp nudge"
                    title="Send WhatsApp message"
                  >
                    <WhatsAppIcon size={13} />
                  </a>
                  <a
                    href={COMPLETE_APPLICATION_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary hover:underline whitespace-nowrap"
                  >
                    View Application <ChevronRight size={11} />
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ReadyToTradeTable({ pane, onSelectCustomer, onAction }: { pane: Extract<DetailPane, { kind: "readyToTrade" }>; onSelectCustomer?: (ucc: string) => void; onAction?: (p: BOActionPayload) => void }) {
  const [revealedPhones, setRevealedPhones] = useState<Record<string, boolean>>({});

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px] text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Name (UCC)</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Mobile</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Account opened</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Order placed</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Suggestions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {pane.rows.map((r) => (
            <tr key={r.ucc} className="hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => onSelectCustomer?.(r.ucc)}>
              <td className="px-3 py-2.5">
                <div className="font-medium text-foreground">{r.name} <span className="font-mono font-normal text-muted-foreground">({r.ucc})</span></div>
              </td>
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs text-muted-foreground">
                    {revealedPhones[r.ucc] ? r.phoneNumber : maskPhone(r.phoneNumber)}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setRevealedPhones((p) => ({ ...p, [r.ucc]: !p[r.ucc] })); }}
                    className="shrink-0 text-muted-foreground hover:text-foreground"
                    aria-label={revealedPhones[r.ucc] ? "Hide mobile" : "Show mobile"}
                  >
                    {revealedPhones[r.ucc] ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                </div>
              </td>
              <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">{r.accountOpened}</td>
              <td className="px-3 py-2.5">
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                  r.orderPlaced
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-muted text-muted-foreground border border-border"
                }`}>
                  {r.orderPlaced ? "Yes" : "No"}
                </span>
              </td>
              <td className="px-3 py-2.5">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onAction?.({ type: "suggest", customerName: r.name, customerUcc: r.ucc, customerPhone: r.phoneNumber }); }}
                  className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary hover:underline whitespace-nowrap"
                >
                  Suggest Products <ChevronRight size={11} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RecentlyActivatedTable({ pane, onSelectCustomer, onAction }: { pane: Extract<DetailPane, { kind: "recentlyActivated" }>; onSelectCustomer?: (ucc: string) => void; onAction?: (p: BOActionPayload) => void }) {
  const [revealedPhones, setRevealedPhones] = useState<Record<string, boolean>>({});

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px] text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Name (UCC)</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Mobile</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Account opened</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Recent order placed</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Order date</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Suggestions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {pane.rows.map((r) => (
            <tr key={r.ucc} className="hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => onSelectCustomer?.(r.ucc)}>
              <td className="px-3 py-2.5">
                <div className="font-medium text-foreground">{r.name} <span className="font-mono font-normal text-muted-foreground">({r.ucc})</span></div>
              </td>
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs text-muted-foreground">
                    {revealedPhones[r.ucc] ? r.phoneNumber : maskPhone(r.phoneNumber)}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setRevealedPhones((p) => ({ ...p, [r.ucc]: !p[r.ucc] })); }}
                    className="shrink-0 text-muted-foreground hover:text-foreground"
                    aria-label={revealedPhones[r.ucc] ? "Hide mobile" : "Show mobile"}
                  >
                    {revealedPhones[r.ucc] ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                </div>
              </td>
              <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">{r.accountOpened}</td>
              <td className="px-3 py-2.5">
                <span className="inline-flex rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium text-foreground whitespace-nowrap">
                  {r.recentOrder}
                </span>
              </td>
              <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">{r.orderDate}</td>
              <td className="px-3 py-2.5">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onAction?.({ type: "suggest", customerName: r.name, customerUcc: r.ucc, customerPhone: r.phoneNumber }); }}
                  className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary hover:underline whitespace-nowrap"
                >
                  Suggest Products <ChevronRight size={11} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LikelyToLapseTable({ pane, onSelectCustomer, onAction }: { pane: Extract<DetailPane, { kind: "likelyToLapse" }>; onSelectCustomer?: (ucc: string) => void; onAction?: (p: BOActionPayload) => void }) {
  const [revealedPhones, setRevealedPhones] = useState<Record<string, boolean>>({});
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Name (UCC)</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Mobile</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Last traded</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Days inactive</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Products traded</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Suggestions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {pane.rows.map((r) => (
            <tr key={r.ucc} className="hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => onSelectCustomer?.(r.ucc)}>
              <td className="px-3 py-2.5 font-medium text-foreground whitespace-nowrap">
                {r.name} <span className="font-mono font-normal text-muted-foreground">({r.ucc})</span>
              </td>
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs text-muted-foreground">{revealedPhones[r.ucc] ? r.phoneNumber : maskPhone(r.phoneNumber)}</span>
                  <button type="button" onClick={(e) => { e.stopPropagation(); setRevealedPhones((p) => ({ ...p, [r.ucc]: !p[r.ucc] })); }} className="shrink-0 text-muted-foreground hover:text-foreground" aria-label={revealedPhones[r.ucc] ? "Hide mobile" : "Show mobile"}>
                    {revealedPhones[r.ucc] ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                </div>
              </td>
              <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">{r.lastTraded}</td>
              <td className="px-3 py-2.5">
                <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 whitespace-nowrap">
                  {r.daysInactive} days
                </span>
              </td>
              <td className="px-3 py-2.5 text-xs text-muted-foreground">{r.productsTraded}</td>
              <td className="px-3 py-2.5">
                <button type="button" onClick={(e) => { e.stopPropagation(); onAction?.({ type: "reengage", customerName: r.name, customerUcc: r.ucc, customerPhone: r.phoneNumber }); }} className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary hover:underline whitespace-nowrap">
                  Re-engage <ChevronRight size={11} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function HighFnOTable({ pane, onSelectCustomer, onAction }: { pane: Extract<DetailPane, { kind: "highFnO" }>; onSelectCustomer?: (ucc: string) => void; onAction?: (p: BOActionPayload) => void }) {
  const [revealedPhones, setRevealedPhones] = useState<Record<string, boolean>>({});
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Name (UCC)</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Mobile</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Net F&amp;O Loss</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Loss period</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Suggestions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {pane.rows.map((r) => (
            <tr key={r.ucc} className="hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => onSelectCustomer?.(r.ucc)}>
              <td className="px-3 py-2.5 font-medium text-foreground whitespace-nowrap">
                {r.name} <span className="font-mono font-normal text-muted-foreground">({r.ucc})</span>
              </td>
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs text-muted-foreground">{revealedPhones[r.ucc] ? r.phoneNumber : maskPhone(r.phoneNumber)}</span>
                  <button type="button" onClick={(e) => { e.stopPropagation(); setRevealedPhones((p) => ({ ...p, [r.ucc]: !p[r.ucc] })); }} className="shrink-0 text-muted-foreground hover:text-foreground" aria-label={revealedPhones[r.ucc] ? "Hide mobile" : "Show mobile"}>
                    {revealedPhones[r.ucc] ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                </div>
              </td>
              <td className="px-3 py-2.5 text-xs font-semibold text-red-600 whitespace-nowrap">{r.netLoss}</td>
              <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">{r.lossPeriod}</td>
              <td className="px-3 py-2.5">
                <button type="button" onClick={(e) => { e.stopPropagation(); onAction?.({ type: "schedule", customerName: r.name, customerUcc: r.ucc, customerPhone: r.phoneNumber }); }} className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary hover:underline whitespace-nowrap">
                  Schedule Call <ChevronRight size={11} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TopFiveTable({ pane, onSelectCustomer, onAction }: { pane: Extract<DetailPane, { kind: "topFive" }>; onSelectCustomer?: (ucc: string) => void; onAction?: (p: BOActionPayload) => void }) {
  const [revealedPhones, setRevealedPhones] = useState<Record<string, boolean>>({});
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[580px] text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Name (UCC)</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Mobile</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Prev month revenue</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Products held</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Suggestions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {pane.rows.map((r) => (
            <tr key={r.ucc} className="hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => onSelectCustomer?.(r.ucc)}>
              <td className="px-3 py-2.5 font-medium text-foreground whitespace-nowrap">
                {r.name} <span className="font-mono font-normal text-muted-foreground">({r.ucc})</span>
              </td>
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs text-muted-foreground">{revealedPhones[r.ucc] ? r.phoneNumber : maskPhone(r.phoneNumber)}</span>
                  <button type="button" onClick={(e) => { e.stopPropagation(); setRevealedPhones((p) => ({ ...p, [r.ucc]: !p[r.ucc] })); }} className="shrink-0 text-muted-foreground hover:text-foreground" aria-label={revealedPhones[r.ucc] ? "Hide mobile" : "Show mobile"}>
                    {revealedPhones[r.ucc] ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                </div>
              </td>
              <td className="px-3 py-2.5 text-xs font-semibold text-foreground whitespace-nowrap">{r.prevMonthRevenue}</td>
              <td className="px-3 py-2.5 text-xs text-muted-foreground">{r.productsHeld}</td>
              <td className="px-3 py-2.5">
                <button type="button" onClick={(e) => { e.stopPropagation(); onAction?.({ type: "checkin", customerName: r.name, customerUcc: r.ucc, customerPhone: r.phoneNumber }); }} className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary hover:underline whitespace-nowrap">
                  Schedule Check-in <ChevronRight size={11} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UpsellNameCell({ name, ucc }: { name: string; ucc: string }) {
  return <span className="font-medium text-foreground whitespace-nowrap">{name} <span className="font-mono font-normal text-muted-foreground">({ucc})</span></span>;
}

function UpsellMobileCell({ ucc, phoneNumber, revealed, onToggle }: { ucc: string; phoneNumber: string; revealed: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-mono text-xs text-muted-foreground">{revealed ? phoneNumber : maskPhone(phoneNumber)}</span>
      <button type="button" onClick={onToggle} className="shrink-0 text-muted-foreground hover:text-foreground" aria-label={revealed ? "Hide mobile" : "Show mobile"}>
        {revealed ? <EyeOff size={12} /> : <Eye size={12} />}
      </button>
    </div>
  );
}

function UpsellCTA({ onClick }: { onClick?: (e: React.MouseEvent) => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary hover:underline whitespace-nowrap">
      Suggest Product <ChevronRight size={11} />
    </button>
  );
}

function EquityUpsellTable({ pane, onSelectCustomer, onAction }: { pane: Extract<DetailPane, { kind: "equityUpsell" }>; onSelectCustomer?: (ucc: string) => void; onAction?: (p: BOActionPayload) => void }) {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px] text-sm">
        <thead><tr className="border-b border-border bg-muted/30">
          <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Name (UCC)</th>
          <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Mobile</th>
          <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Equity Portfolio</th>
          <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Last traded</th>
          <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Suggestions</th>
        </tr></thead>
        <tbody className="divide-y divide-border">
          {pane.rows.map((r) => (
            <tr key={r.ucc} className="hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => onSelectCustomer?.(r.ucc)}>
              <td className="px-3 py-2.5"><UpsellNameCell name={r.name} ucc={r.ucc} /></td>
              <td className="px-3 py-2.5"><UpsellMobileCell ucc={r.ucc} phoneNumber={r.phoneNumber} revealed={!!revealed[r.ucc]} onToggle={() => setRevealed(p => ({ ...p, [r.ucc]: !p[r.ucc] }))} /></td>
              <td className="px-3 py-2.5 text-xs font-semibold text-foreground whitespace-nowrap">{r.portfolioValue}</td>
              <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">{r.lastTraded}</td>
              <td className="px-3 py-2.5"><UpsellCTA onClick={(e) => { e.stopPropagation(); onAction?.({ type: "suggest", customerName: r.name, customerUcc: r.ucc, customerPhone: r.phoneNumber }); }} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FnOUpsellTable({ pane, onSelectCustomer, onAction }: { pane: Extract<DetailPane, { kind: "fnoUpsell" }>; onSelectCustomer?: (ucc: string) => void; onAction?: (p: BOActionPayload) => void }) {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px] text-sm">
        <thead><tr className="border-b border-border bg-muted/30">
          <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Name (UCC)</th>
          <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Mobile</th>
          <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Monthly turnover</th>
          <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Contracts traded</th>
          <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Suggestions</th>
        </tr></thead>
        <tbody className="divide-y divide-border">
          {pane.rows.map((r) => (
            <tr key={r.ucc} className="hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => onSelectCustomer?.(r.ucc)}>
              <td className="px-3 py-2.5"><UpsellNameCell name={r.name} ucc={r.ucc} /></td>
              <td className="px-3 py-2.5"><UpsellMobileCell ucc={r.ucc} phoneNumber={r.phoneNumber} revealed={!!revealed[r.ucc]} onToggle={() => setRevealed(p => ({ ...p, [r.ucc]: !p[r.ucc] }))} /></td>
              <td className="px-3 py-2.5 text-xs font-semibold text-foreground whitespace-nowrap">{r.monthlyTurnover}</td>
              <td className="px-3 py-2.5 text-xs text-muted-foreground">{r.contractsTraded}</td>
              <td className="px-3 py-2.5"><UpsellCTA onClick={(e) => { e.stopPropagation(); onAction?.({ type: "suggest", customerName: r.name, customerUcc: r.ucc, customerPhone: r.phoneNumber }); }} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function IntradayUpsellTable({ pane, onSelectCustomer, onAction }: { pane: Extract<DetailPane, { kind: "intradayUpsell" }>; onSelectCustomer?: (ucc: string) => void; onAction?: (p: BOActionPayload) => void }) {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px] text-sm">
        <thead><tr className="border-b border-border bg-muted/30">
          <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Name (UCC)</th>
          <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Mobile</th>
          <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Avg daily trades</th>
          <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Monthly volume</th>
          <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Suggestions</th>
        </tr></thead>
        <tbody className="divide-y divide-border">
          {pane.rows.map((r) => (
            <tr key={r.ucc} className="hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => onSelectCustomer?.(r.ucc)}>
              <td className="px-3 py-2.5"><UpsellNameCell name={r.name} ucc={r.ucc} /></td>
              <td className="px-3 py-2.5"><UpsellMobileCell ucc={r.ucc} phoneNumber={r.phoneNumber} revealed={!!revealed[r.ucc]} onToggle={() => setRevealed(p => ({ ...p, [r.ucc]: !p[r.ucc] }))} /></td>
              <td className="px-3 py-2.5 text-xs text-muted-foreground">{r.avgDailyTrades} trades</td>
              <td className="px-3 py-2.5 text-xs font-semibold text-foreground whitespace-nowrap">{r.monthlyVolume}</td>
              <td className="px-3 py-2.5"><UpsellCTA onClick={(e) => { e.stopPropagation(); onAction?.({ type: "suggest", customerName: r.name, customerUcc: r.ucc, customerPhone: r.phoneNumber }); }} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function IpoUpsellTable({ pane, onSelectCustomer, onAction }: { pane: Extract<DetailPane, { kind: "ipoUpsell" }>; onSelectCustomer?: (ucc: string) => void; onAction?: (p: BOActionPayload) => void }) {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[620px] text-sm">
        <thead><tr className="border-b border-border bg-muted/30">
          <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Name (UCC)</th>
          <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Mobile</th>
          <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Last IPO applied</th>
          <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Application amount</th>
          <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Suggestions</th>
        </tr></thead>
        <tbody className="divide-y divide-border">
          {pane.rows.map((r) => (
            <tr key={r.ucc} className="hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => onSelectCustomer?.(r.ucc)}>
              <td className="px-3 py-2.5"><UpsellNameCell name={r.name} ucc={r.ucc} /></td>
              <td className="px-3 py-2.5"><UpsellMobileCell ucc={r.ucc} phoneNumber={r.phoneNumber} revealed={!!revealed[r.ucc]} onToggle={() => setRevealed(p => ({ ...p, [r.ucc]: !p[r.ucc] }))} /></td>
              <td className="px-3 py-2.5 text-xs text-muted-foreground">{r.lastIpoApplied}</td>
              <td className="px-3 py-2.5 text-xs font-semibold text-foreground whitespace-nowrap">{r.applicationAmount}</td>
              <td className="px-3 py-2.5"><UpsellCTA onClick={(e) => { e.stopPropagation(); onAction?.({ type: "suggest", customerName: r.name, customerUcc: r.ucc, customerPhone: r.phoneNumber }); }} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MfUpsellTable({ pane, onSelectCustomer, onAction }: { pane: Extract<DetailPane, { kind: "mfUpsell" }>; onSelectCustomer?: (ucc: string) => void; onAction?: (p: BOActionPayload) => void }) {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px] text-sm">
        <thead><tr className="border-b border-border bg-muted/30">
          <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Name (UCC)</th>
          <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Mobile</th>
          <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Monthly SIP</th>
          <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Total investment</th>
          <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Suggestions</th>
        </tr></thead>
        <tbody className="divide-y divide-border">
          {pane.rows.map((r) => (
            <tr key={r.ucc} className="hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => onSelectCustomer?.(r.ucc)}>
              <td className="px-3 py-2.5"><UpsellNameCell name={r.name} ucc={r.ucc} /></td>
              <td className="px-3 py-2.5"><UpsellMobileCell ucc={r.ucc} phoneNumber={r.phoneNumber} revealed={!!revealed[r.ucc]} onToggle={() => setRevealed(p => ({ ...p, [r.ucc]: !p[r.ucc] }))} /></td>
              <td className="px-3 py-2.5 text-xs font-semibold text-foreground whitespace-nowrap">{r.monthlySip}</td>
              <td className="px-3 py-2.5 text-xs font-semibold text-foreground whitespace-nowrap">{r.totalInvestment}</td>
              <td className="px-3 py-2.5"><UpsellCTA onClick={(e) => { e.stopPropagation(); onAction?.({ type: "suggest", customerName: r.name, customerUcc: r.ucc, customerPhone: r.phoneNumber }); }} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MtfUpsellTable({ pane, onSelectCustomer, onAction }: { pane: Extract<DetailPane, { kind: "mtfUpsell" }>; onSelectCustomer?: (ucc: string) => void; onAction?: (p: BOActionPayload) => void }) {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[580px] text-sm">
        <thead><tr className="border-b border-border bg-muted/30">
          <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Name (UCC)</th>
          <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Mobile</th>
          <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">MTF utilized</th>
          <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Credit limit</th>
          <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Suggestions</th>
        </tr></thead>
        <tbody className="divide-y divide-border">
          {pane.rows.map((r) => (
            <tr key={r.ucc} className="hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => onSelectCustomer?.(r.ucc)}>
              <td className="px-3 py-2.5"><UpsellNameCell name={r.name} ucc={r.ucc} /></td>
              <td className="px-3 py-2.5"><UpsellMobileCell ucc={r.ucc} phoneNumber={r.phoneNumber} revealed={!!revealed[r.ucc]} onToggle={() => setRevealed(p => ({ ...p, [r.ucc]: !p[r.ucc] }))} /></td>
              <td className="px-3 py-2.5 text-xs font-semibold text-foreground whitespace-nowrap">{r.mtfUtilized}</td>
              <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">{r.creditLimit}</td>
              <td className="px-3 py-2.5"><UpsellCTA onClick={(e) => { e.stopPropagation(); onAction?.({ type: "suggest", customerName: r.name, customerUcc: r.ucc, customerPhone: r.phoneNumber }); }} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SimpleTable({ pane }: { pane: Extract<DetailPane, { kind: "simple" }> }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[340px] text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Name</th>
            <th className="px-3 py-2 text-right text-xs font-semibold text-muted-foreground">{pane.metricHeader}</th>
            <th className="px-3 py-2 text-right text-xs font-semibold text-muted-foreground w-[80px]">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {pane.rows.map((r) => (
            <tr key={r.name} className="hover:bg-muted/20 transition-colors">
              <td className="px-3 py-2.5 font-medium text-foreground">{r.name}</td>
              <td className="px-3 py-2.5 text-right text-muted-foreground">{r.metric}</td>
              <td className="px-3 py-2.5">
                <div className="flex items-center justify-end gap-1">
                  <button className="rounded-md p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors" title="Call">
                    <Phone size={13} />
                  </button>
                  <button className="rounded-md p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors" title="WhatsApp">
                    <MessageCircle size={13} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DetailPanel({ pillId, onSelectCustomer, onAction }: { pillId: PillId; onSelectCustomer?: (ucc: string) => void; onAction?: (p: BOActionPayload) => void }) {
  const pane = DETAIL_MAP[pillId];
  const pill = SECTIONS.flatMap((s) => s.pills).find((p) => p.id === pillId);
  return (
    <div className="mt-4 rounded-md border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/20 px-3 py-2">
        <div className="font-semibold text-sm text-foreground">
          {pane.title}
          <span className="ml-2 text-xs font-medium text-muted-foreground">
            {pill?.count} clients
          </span>
        </div>
        <button className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline shrink-0">
          View all <ChevronRight size={13} />
        </button>
      </div>

      {/* Insight nudge */}
      <div className="flex items-start gap-2 border-b border-primary/10 bg-primary/[0.04] px-3 py-2.5">
        <Lightbulb size={13} className="text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-foreground/70 leading-relaxed">{pane.insight}</p>
      </div>

      {pane.kind === "leads"             && <LeadsTable             pane={pane} />}
      {pane.kind === "readyToTrade"      && <ReadyToTradeTable      pane={pane} onSelectCustomer={onSelectCustomer} onAction={onAction} />}
      {pane.kind === "recentlyActivated" && <RecentlyActivatedTable pane={pane} onSelectCustomer={onSelectCustomer} onAction={onAction} />}
      {pane.kind === "likelyToLapse"     && <LikelyToLapseTable     pane={pane} onSelectCustomer={onSelectCustomer} onAction={onAction} />}
      {pane.kind === "highFnO"           && <HighFnOTable           pane={pane} onSelectCustomer={onSelectCustomer} onAction={onAction} />}
      {pane.kind === "topFive"           && <TopFiveTable           pane={pane} onSelectCustomer={onSelectCustomer} onAction={onAction} />}
      {pane.kind === "equityUpsell"      && <EquityUpsellTable      pane={pane} onSelectCustomer={onSelectCustomer} onAction={onAction} />}
      {pane.kind === "fnoUpsell"         && <FnOUpsellTable         pane={pane} onSelectCustomer={onSelectCustomer} onAction={onAction} />}
      {pane.kind === "intradayUpsell"    && <IntradayUpsellTable    pane={pane} onSelectCustomer={onSelectCustomer} onAction={onAction} />}
      {pane.kind === "ipoUpsell"         && <IpoUpsellTable         pane={pane} onSelectCustomer={onSelectCustomer} onAction={onAction} />}
      {pane.kind === "mfUpsell"          && <MfUpsellTable          pane={pane} onSelectCustomer={onSelectCustomer} onAction={onAction} />}
      {pane.kind === "mtfUpsell"         && <MtfUpsellTable         pane={pane} onSelectCustomer={onSelectCustomer} onAction={onAction} />}
      {pane.kind === "simple"            && <SimpleTable            pane={pane} />}
    </div>
  );
}

// ─── Section block (pills + inline table) ────────────────────────────────────

function SectionBlock({ section, defaultPill, onSelectCustomer, onAction }: { section: Section; defaultPill: PillId; onSelectCustomer?: (ucc: string) => void; onAction?: (p: BOActionPayload) => void }) {
  const [activePillId, setActivePillId] = useState<PillId>(defaultPill);

  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-foreground/60 border-l-2 border-primary/40 pl-2">
        {section.title}
      </p>
      <div className="flex flex-wrap gap-2">
        {section.pills.map((pill) => {
          const isActive = pill.id === activePillId;
          return (
            <button
              key={pill.id}
              type="button"
              onClick={() => setActivePillId(pill.id)}
              className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:bg-muted"
              }`}
            >
              {pill.label}
              <span className={`inline-flex items-center justify-center rounded px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                isActive ? "bg-white/25 text-white" : "bg-primary/10 text-primary"
              }`}>
                {pill.count}
              </span>
            </button>
          );
        })}
      </div>
      <DetailPanel pillId={activePillId} onSelectCustomer={onSelectCustomer} onAction={onAction} />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function BusinessOpportunitiesCard({ onSelectCustomer }: { onSelectCustomer?: (ucc: string) => void } = {}) {
  const [activeModal, setActiveModal] = useState<BOActionPayload | null>(null);

  return (
    <section className="min-w-0 overflow-hidden">
      <div className="px-3 sm:px-5 py-4 sm:py-5">
        <h2 className="flex items-center gap-2 border-l-[3px] border-primary pl-3 text-lg font-semibold text-foreground tracking-tight">
          <Layers size={18} className="text-primary shrink-0" />
          Business Opportunities
        </h2>
        <div className="mt-4 space-y-6">
          <SectionBlock section={SECTIONS[0]} defaultPill="leads"         onSelectCustomer={onSelectCustomer} onAction={setActiveModal} />
          <SectionBlock section={SECTIONS[1]} defaultPill="likelyToLapse" onSelectCustomer={onSelectCustomer} onAction={setActiveModal} />
          <SectionBlock section={SECTIONS[2]} defaultPill="equity"        onSelectCustomer={onSelectCustomer} onAction={setActiveModal} />
        </div>
      </div>

      {activeModal && (
        <BOActionModal
          {...activeModal}
          onClose={() => setActiveModal(null)}
        />
      )}
    </section>
  );
}
