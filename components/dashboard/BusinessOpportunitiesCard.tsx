"use client";

import { useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  ChevronRight,
  Crown,
  Layers,
  MessageCircle,
  Phone,
  TrendingDown,
  UserCheck,
  UserMinus,
  UserPlus,
} from "lucide-react";

type MainTab = "atRiskClients" | "activation" | "crossSell";
type ActivationTableFilter = "onboarded" | "activated" | "notActivated" | "leads";
type AtRiskFilter = "likelyToLapse" | "highFnOLosses" | "topFive";
type CrossSellFilter = "equityPotential" | "mtf" | "fno" | "ipo" | "intraday" | "mf";

const MAIN_TABS: Array<{ id: MainTab; label: string }> = [
  { id: "activation", label: "Onboarding & Activation" },
  { id: "atRiskClients", label: "At Risk" },
  { id: "crossSell", label: "Cross-Sell" },
];

type ClientRow = { name: string; metric: string };
type OpportunityCardData = {
  title: string;
  totalClients: number;
  metricHeader: string;
  clients: ClientRow[];
};
type TabContent = { cards: OpportunityCardData[] };
type ActivationClientRow = { name: string; onboardedOn: string };
type ActivationDetailedRow = {
  name: string;
  onboardedOn: string;
  activationStatus: string;
  productsActiveIn: string;
};
type ActivationLeadsRow = {
  clientUcc: string;
  dateCreated: string;
  lastUpdated: string;
  name: string;
  status: string;
  currentStep: string;
};
type CrossSellCard = {
  id: CrossSellFilter;
  title: string;
  totalClients: number;
  metricHeader: string;
  clients: ClientRow[];
};

const TAB_CONTENT: Record<"atRiskClients" | "crossSell", TabContent> = {
  atRiskClients: {
    cards: [
      {
        title: "Likely to lapse",
        totalClients: 25,
        metricHeader: "Last Traded Date",
        clients: [
          { name: "Samadhan Bhaskar Rakibe (SHJV1174)", metric: "26 Feb 2026" },
          { name: "Mira Trymbak Pawar (M61747471)", metric: "24 Feb 2026" },
          { name: "Bhushan Subhash Shinde (B564881)", metric: "23 Feb 2026" },
          { name: "Yashodeep Yashwant Kulkarni (AAA6180438)", metric: "21 Feb 2026" },
          { name: "Ajit Jaychand Dagade (SHJV1187)", metric: "20 Feb 2026" },
        ],
      },
      {
        title: "High F&O Losses",
        totalClients: 5,
        metricHeader: "Net Loss",
        clients: [
          { name: "Prasad Bhosale (PDBS8182)", metric: "₹1,42,000" },
          { name: "Nitin Gavhane (NTGV2197)", metric: "₹1,11,300" },
          { name: "Akash More (AKMR7165)", metric: "₹94,600" },
          { name: "Sagar Kulkarni (SGKL6291)", metric: "₹88,200" },
          { name: "Rohan Patil (RHPT5408)", metric: "₹73,900" },
        ],
      },
      {
        title: "Top 5% Clients",
        totalClients: 4,
        metricHeader: "Prev Month Revenue",
        clients: [
          { name: "Vivek Rane (VVRA3108)", metric: "₹58,000" },
          { name: "Aniket Shinde (ANKS1472)", metric: "₹49,700" },
          { name: "Priya Chavan (PRCV9324)", metric: "₹44,300" },
          { name: "Kiran Jagtap (KRJT5506)", metric: "₹38,900" },
          { name: "Deepali Mane (DPMN7112)", metric: "₹34,100" },
        ],
      },
    ],
  },
  crossSell: {
    cards: [
      {
        title: "MF Upsell Candidates",
        totalClients: 14,
        metricHeader: "Upsell Value",
        clients: [
          { name: "Rahul Suryawanshi (RSWY8821)", metric: "₹31,200" },
          { name: "Shruti Naik (SNIK2043)", metric: "₹28,900" },
          { name: "Manish Korde (MKRD1297)", metric: "₹24,600" },
          { name: "Tejas Patil (TPAT4471)", metric: "₹22,400" },
          { name: "Aarti Kamble (AKMB3905)", metric: "₹21,100" },
        ],
      },
      {
        title: "Insurance Prospects",
        totalClients: 8,
        metricHeader: "Annual Premium",
        clients: [
          { name: "Omkar Nimbalkar (OMNB3321)", metric: "₹42,000" },
          { name: "Rutuja Jadhav (RTJD5503)", metric: "₹36,500" },
          { name: "Neha More (NHMR7409)", metric: "₹31,800" },
          { name: "Vikram Chavan (VKCV1985)", metric: "₹29,200" },
          { name: "Dhanashree Kale (DNKL7771)", metric: "₹24,900" },
        ],
      },
      {
        title: "F&O Add-on Prospects",
        totalClients: 5,
        metricHeader: "Avg Volume",
        clients: [
          { name: "Ganesh Kadam (GNKD4528)", metric: "1.8x" },
          { name: "Yogesh Pawar (YGPW6731)", metric: "1.6x" },
          { name: "Sujata Koli (SJKL2087)", metric: "1.4x" },
          { name: "Ninad Salvi (NDSL1128)", metric: "1.3x" },
          { name: "Mrunal Jagtap (MRJT6650)", metric: "1.2x" },
        ],
      },
    ],
  },
};

const ACTIVATION_SUMMARY = {
  onboarded: 214,
  activated: 162,
  notActivated: 52,
  leads: 38,
};

const ACTIVATION_RECENT_CLIENTS: ActivationClientRow[] = [
  { name: "Sandeep Kumar (SDKR3321)", onboardedOn: "02 Mar 2026" },
  { name: "Harshali Mane (HMLK8842)", onboardedOn: "01 Mar 2026" },
  { name: "Prasad Shah (PSHA4431)", onboardedOn: "29 Feb 2026" },
  { name: "Amit Bhosale (ABHS1190)", onboardedOn: "28 Feb 2026" },
  { name: "Nikita Salunkhe (NSLK7163)", onboardedOn: "27 Feb 2026" },
];

const ACTIVATION_ONBOARDED_ROWS: ActivationDetailedRow[] = [
  {
    name: "Sandeep Kumar (SDKR3321)",
    onboardedOn: "02 Mar 2026",
    activationStatus: "Onboarded",
    productsActiveIn: "Equity, ETFs",
  },
  {
    name: "Harshali Mane (HMLK8842)",
    onboardedOn: "01 Mar 2026",
    activationStatus: "Onboarded",
    productsActiveIn: "F&O",
  },
  {
    name: "Prasad Shah (PSHA4431)",
    onboardedOn: "29 Feb 2026",
    activationStatus: "Onboarded",
    productsActiveIn: "MF",
  },
  {
    name: "Amit Bhosale (ABHS1190)",
    onboardedOn: "28 Feb 2026",
    activationStatus: "Onboarded",
    productsActiveIn: "Equity, NCD, Bonds",
  },
  {
    name: "Nikita Salunkhe (NSLK7163)",
    onboardedOn: "27 Feb 2026",
    activationStatus: "Onboarded",
    productsActiveIn: "FD",
  },
];

const ACTIVATION_ACTIVE_ROWS: ActivationDetailedRow[] = [
  {
    name: "Rahul Suryawanshi (RSWY8821)",
    onboardedOn: "24 Feb 2026",
    activationStatus: "Activated",
    productsActiveIn: "Equity, ETFs, F&O",
  },
  {
    name: "Shruti Naik (SNIK2043)",
    onboardedOn: "23 Feb 2026",
    activationStatus: "Activated",
    productsActiveIn: "Equity, MF",
  },
  {
    name: "Manish Korde (MKRD1297)",
    onboardedOn: "21 Feb 2026",
    activationStatus: "Activated",
    productsActiveIn: "Bonds, NCD",
  },
  {
    name: "Tejas Patil (TPAT4471)",
    onboardedOn: "20 Feb 2026",
    activationStatus: "Activated",
    productsActiveIn: "Equity, ETFs, MF",
  },
  {
    name: "Aarti Kamble (AKMB3905)",
    onboardedOn: "19 Feb 2026",
    activationStatus: "Activated",
    productsActiveIn: "FD, Bonds",
  },
];

const ACTIVATION_LEADS_ROWS: ActivationLeadsRow[] = [
  {
    clientUcc: "SDKR3321",
    dateCreated: "03 Mar 2026",
    lastUpdated: "05 Mar 2026",
    name: "Sandeep Kumar",
    status: "In Progress",
    currentStep: "PAN & DOB",
  },
  {
    clientUcc: "HMLK8842",
    dateCreated: "02 Mar 2026",
    lastUpdated: "04 Mar 2026",
    name: "Harshali Mane",
    status: "Pending",
    currentStep: "ESign",
  },
  {
    clientUcc: "PSHA4431",
    dateCreated: "01 Mar 2026",
    lastUpdated: "03 Mar 2026",
    name: "Prasad Shah",
    status: "In Progress",
    currentStep: "Bank Verification",
  },
  {
    clientUcc: "ABHS1190",
    dateCreated: "28 Feb 2026",
    lastUpdated: "02 Mar 2026",
    name: "Amit Bhosale",
    status: "Pending",
    currentStep: "IPV",
  },
  {
    clientUcc: "NSLK7163",
    dateCreated: "27 Feb 2026",
    lastUpdated: "01 Mar 2026",
    name: "Nikita Salunkhe",
    status: "In Progress",
    currentStep: "ESign",
  },
];

const CROSS_SELL_CARDS: CrossSellCard[] = [
  {
    id: "equityPotential",
    title: "Equity potential clients",
    totalClients: 96,
    metricHeader: "Interest Score",
    clients: [
      { name: "Samadhan Bhaskar Rakibe (SHJV1174)", metric: "86" },
      { name: "Mira Trymbak Pawar (M61747471)", metric: "79" },
      { name: "Yashodeep Kulkarni (AAA6180438)", metric: "72" },
      { name: "Prasad Bhosale (PDBS8182)", metric: "69" },
      { name: "Nikhil Patankar (SHJV2023)", metric: "66" },
    ],
  },
  {
    id: "mtf",
    title: "MTF clients",
    totalClients: 14,
    metricHeader: "Upsell Value",
    clients: [
      { name: "Rahul Suryawanshi (RSWY8821)", metric: "₹31,200" },
      { name: "Shruti Naik (SNIK2043)", metric: "₹28,900" },
      { name: "Manish Korde (MKRD1297)", metric: "₹24,600" },
      { name: "Tejas Patil (TPAT4471)", metric: "₹22,400" },
      { name: "Aarti Kamble (AKMB3905)", metric: "₹21,100" },
    ],
  },
  {
    id: "fno",
    title: "FNO clients",
    totalClients: 16,
    metricHeader: "Avg Volume",
    clients: [
      { name: "Ganesh Kadam (GNKD4528)", metric: "1.8x" },
      { name: "Yogesh Pawar (YGPW6731)", metric: "1.6x" },
      { name: "Sujata Koli (SJKL2087)", metric: "1.4x" },
      { name: "Ninad Salvi (NDSL1128)", metric: "1.3x" },
      { name: "Mrunal Jagtap (MRJT6650)", metric: "1.2x" },
    ],
  },
  {
    id: "ipo",
    title: "IPO clients",
    totalClients: 2,
    metricHeader: "Last IPO Click",
    clients: [
      { name: "Vivek Rane (VVRA3108)", metric: "2 days ago" },
      { name: "Aniket Shinde (ANKS1472)", metric: "5 days ago" },
      { name: "Priya Chavan (PRCV9324)", metric: "6 days ago" },
      { name: "Kiran Jagtap (KRJT5506)", metric: "8 days ago" },
      { name: "Deepali Mane (DPMN7112)", metric: "9 days ago" },
    ],
  },
  {
    id: "intraday",
    title: "Intraday clients",
    totalClients: 96,
    metricHeader: "Sessions (30D)",
    clients: [
      { name: "Priya Chavan (PRCV9324)", metric: "24" },
      { name: "Kiran Jagtap (KRJT5506)", metric: "21" },
      { name: "Deepali Mane (DPMN7112)", metric: "18" },
      { name: "Samadhan Bhaskar Rakibe (SHJV1174)", metric: "16" },
      { name: "Mira Trymbak Pawar (M61747471)", metric: "15" },
    ],
  },
  {
    id: "mf",
    title: "MF clients",
    totalClients: 381,
    metricHeader: "MF Balance",
    clients: [
      { name: "Prasad Bhosale (PDBS8182)", metric: "Rs 12.5L" },
      { name: "Mira Trymbak Pawar (M61747471)", metric: "Rs 9.8L" },
      { name: "Rahul Singh (SHJV1187)", metric: "Rs 7.2L" },
      { name: "Yashodeep Kulkarni (AAA6180438)", metric: "Rs 6.4L" },
      { name: "Neha Kulkarni (AADK110932)", metric: "Rs 5.9L" },
    ],
  },
];

export function BusinessOpportunitiesCard() {
  const [activeNavTab, setActiveNavTab] = useState<MainTab>("activation");
  const [atRiskFilter, setAtRiskFilter] = useState<AtRiskFilter>("likelyToLapse");
  const [activationTableFilter, setActivationTableFilter] =
    useState<ActivationTableFilter>("leads");
  const [crossSellFilter, setCrossSellFilter] = useState<CrossSellFilter>("equityPotential");

  const atRiskCardMap: Record<AtRiskFilter, OpportunityCardData> = {
    likelyToLapse: TAB_CONTENT.atRiskClients.cards[0],
    highFnOLosses: TAB_CONTENT.atRiskClients.cards[1],
    topFive: TAB_CONTENT.atRiskClients.cards[2],
  };
  const activeCrossSellCard = CROSS_SELL_CARDS.find((card) => card.id === crossSellFilter) ?? CROSS_SELL_CARDS[0];

  return (
    <section className="min-w-0 overflow-hidden min-h-[420px]">
      <div className="px-3 sm:px-5 py-4 sm:py-5">
        <h2 className="flex items-center gap-2 border-l-[3px] border-primary pl-3 text-lg font-semibold text-foreground tracking-tight">
          <Layers size={18} className="text-primary shrink-0" />
          Business Opportunities
        </h2>

        <div className="mt-3">
          <div>
            <div className="flex items-center gap-4 border-b border-border overflow-x-auto">
              {MAIN_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveNavTab(tab.id)}
                  className={`pb-2 text-[15px] font-medium transition-colors border-b-2 outline-none whitespace-nowrap shrink-0 ${
                    activeNavTab === tab.id
                      ? "text-primary border-primary"
                      : "text-muted-foreground border-transparent hover:text-foreground"
                  } focus-visible:ring-1 focus-visible:ring-primary rounded-none`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4">
          {activeNavTab === "atRiskClients" && (
            <div>
            <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4">
                <div className="rounded-md border border-border bg-card overflow-hidden">
                  <div className="px-3 py-2 border-b border-border bg-muted/20">
                    <div className="text-base font-semibold text-foreground">
                      At Risk Client Summary
                    </div>
                  </div>

                  <div className="p-3 space-y-2 max-h-[180px] overflow-y-auto md:max-h-none">
                    <button
                      type="button"
                      onClick={() => setAtRiskFilter("likelyToLapse")}
                      className={`w-full text-left rounded-md px-3 py-2 transition-colors ${
                        atRiskFilter === "likelyToLapse"
                          ? "bg-primary/5"
                          : "bg-background hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <AlertTriangle size={16} className={atRiskFilter === "likelyToLapse" ? "text-primary" : "text-muted-foreground"} />
                          <div className="truncate text-[13px] font-medium text-foreground">Likely to lapse</div>
                        </div>
                        <div className={`flex flex-shrink-0 items-center gap-2 text-[12px] font-semibold ${atRiskFilter === "likelyToLapse" ? "text-primary" : "text-muted-foreground"}`}>
                          <span>{atRiskCardMap.likelyToLapse.totalClients} users</span>
                          <ChevronRight size={16} className={atRiskFilter === "likelyToLapse" ? "text-primary" : "text-muted-foreground"} />
                        </div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAtRiskFilter("highFnOLosses")}
                      className={`w-full text-left rounded-md px-3 py-2 transition-colors ${
                        atRiskFilter === "highFnOLosses"
                          ? "bg-primary/5"
                          : "bg-background hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <TrendingDown size={16} className={atRiskFilter === "highFnOLosses" ? "text-primary" : "text-muted-foreground"} />
                          <div className="truncate text-[13px] font-medium text-foreground">High F&O Losses</div>
                        </div>
                        <div className={`flex flex-shrink-0 items-center gap-2 text-[12px] font-semibold ${atRiskFilter === "highFnOLosses" ? "text-primary" : "text-muted-foreground"}`}>
                          <span>{atRiskCardMap.highFnOLosses.totalClients} users</span>
                          <ChevronRight size={16} className={atRiskFilter === "highFnOLosses" ? "text-primary" : "text-muted-foreground"} />
                        </div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAtRiskFilter("topFive")}
                      className={`w-full text-left rounded-md px-3 py-2 transition-colors ${
                        atRiskFilter === "topFive"
                          ? "bg-primary/5"
                          : "bg-background hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <Crown size={16} className={atRiskFilter === "topFive" ? "text-primary" : "text-muted-foreground"} />
                          <div className="truncate text-[13px] font-medium text-foreground">Top 5% Clients</div>
                        </div>
                        <div className={`flex flex-shrink-0 items-center gap-2 text-[12px] font-semibold ${atRiskFilter === "topFive" ? "text-primary" : "text-muted-foreground"}`}>
                          <span>{atRiskCardMap.topFive.totalClients} users</span>
                          <ChevronRight size={16} className={atRiskFilter === "topFive" ? "text-primary" : "text-muted-foreground"} />
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="rounded-md border border-border bg-card overflow-hidden overflow-x-auto">
                  <div className="min-w-[320px]">
                  <div className="px-3 py-2 border-b border-border bg-muted/20">
                    <div className="text-base font-semibold text-foreground">
                      {atRiskCardMap[atRiskFilter].title}
                    </div>
                  </div>

                  <div className="grid grid-cols-[1fr_160px_110px] border-b border-border px-3 py-2">
                    <div className="text-xs font-semibold text-muted-foreground">
                      Top 5 Clients
                    </div>
                    <div className="text-xs font-semibold text-muted-foreground text-right">
                      {atRiskCardMap[atRiskFilter].metricHeader}
                    </div>
                    <div className="text-xs font-semibold text-muted-foreground text-right">
                      Action
                    </div>
                  </div>

                  <div className="max-h-[220px] overflow-auto">
                    {atRiskCardMap[atRiskFilter].clients.map((client) => (
                      <div
                        key={client.name}
                        className="grid grid-cols-[1fr_160px_110px] px-3 py-2 border-b border-border last:border-b-0"
                      >
                        <div className="text-[13px] text-foreground truncate pr-2">
                          {client.name}
                        </div>
                        <div className="text-[13px] text-foreground text-right">
                          {client.metric}
                        </div>
                        <div className="flex items-center justify-end gap-2 text-primary">
                          <button
                            type="button"
                            aria-label={`WhatsApp ${client.name}`}
                            title="WhatsApp"
                            className="h-7 w-7 inline-flex items-center justify-center rounded-md border border-border hover:bg-primary/5 transition-colors"
                          >
                            <MessageCircle size={15} />
                          </button>
                          <button
                            type="button"
                            aria-label={`Call ${client.name}`}
                            title="Call"
                            className="h-7 w-7 inline-flex items-center justify-center rounded-md border border-border hover:bg-primary/5 transition-colors"
                          >
                            <Phone size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="px-3 py-2 border-t border-border flex justify-end">
                    <button
                      type="button"
                      className="h-8 rounded-md border border-primary px-3 text-xs font-semibold text-primary hover:bg-primary/5 transition-colors"
                    >
                      VIEW ALL
                    </button>
                  </div>
                  </div>
                </div>
            </div>
            </div>
          )}

          {activeNavTab === "activation" && (
            <div>
            <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4">
                <div className="rounded-md border border-border bg-card overflow-hidden">
                  <div className="px-3 py-2 border-b border-border bg-muted/20">
                    <div className="text-base font-semibold text-foreground">
                      Activation Summary
                    </div>
                  </div>

                  <div className="p-3 space-y-2 max-h-[180px] overflow-y-auto md:max-h-none">
                    <button
                      type="button"
                      onClick={() => setActivationTableFilter("leads")}
                      className={`w-full text-left rounded-md px-3 py-2 transition-colors ${
                        activationTableFilter === "leads"
                          ? "bg-primary/5"
                          : "bg-background hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <Layers size={16} className={activationTableFilter === "leads" ? "text-primary" : "text-muted-foreground"} />
                          <div className="truncate text-[13px] font-medium text-foreground">Leads</div>
                        </div>
                        <div className={`flex flex-shrink-0 items-center gap-2 text-[12px] font-semibold ${activationTableFilter === "leads" ? "text-primary" : "text-muted-foreground"}`}>
                          <span>{ACTIVATION_SUMMARY.leads} users</span>
                          <ChevronRight size={16} className={activationTableFilter === "leads" ? "text-primary" : "text-muted-foreground"} />
                        </div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivationTableFilter("onboarded")}
                      className={`w-full text-left rounded-md px-3 py-2 transition-colors ${
                        activationTableFilter === "onboarded"
                          ? "bg-primary/5"
                          : "bg-background hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <UserPlus size={16} className={activationTableFilter === "onboarded" ? "text-primary" : "text-muted-foreground"} />
                          <div className="truncate text-[13px] font-medium text-foreground">Clients Onboarded</div>
                        </div>
                        <div className={`flex flex-shrink-0 items-center gap-2 text-[12px] font-semibold ${activationTableFilter === "onboarded" ? "text-primary" : "text-muted-foreground"}`}>
                          <span>{ACTIVATION_SUMMARY.onboarded} users</span>
                          <ChevronRight size={16} className={activationTableFilter === "onboarded" ? "text-primary" : "text-muted-foreground"} />
                        </div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivationTableFilter("activated")}
                      className={`w-full text-left rounded-md px-3 py-2 transition-colors ${
                        activationTableFilter === "activated"
                          ? "bg-primary/5"
                          : "bg-background hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <UserCheck size={16} className={activationTableFilter === "activated" ? "text-primary" : "text-muted-foreground"} />
                          <div className="truncate text-[13px] font-medium text-foreground">Clients Activated</div>
                        </div>
                        <div className={`flex flex-shrink-0 items-center gap-2 text-[12px] font-semibold ${activationTableFilter === "activated" ? "text-primary" : "text-muted-foreground"}`}>
                          <span>{ACTIVATION_SUMMARY.activated} users</span>
                          <ChevronRight size={16} className={activationTableFilter === "activated" ? "text-primary" : "text-muted-foreground"} />
                        </div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivationTableFilter("notActivated")}
                      className={`w-full text-left rounded-md px-3 py-2 transition-colors ${
                        activationTableFilter === "notActivated"
                          ? "bg-primary/5"
                          : "bg-background hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <UserMinus size={16} className={activationTableFilter === "notActivated" ? "text-primary" : "text-muted-foreground"} />
                          <div className="truncate text-[13px] font-medium text-foreground">Not Activated</div>
                        </div>
                        <div className={`flex flex-shrink-0 items-center gap-2 text-[12px] font-semibold ${activationTableFilter === "notActivated" ? "text-primary" : "text-muted-foreground"}`}>
                          <span>{ACTIVATION_SUMMARY.notActivated} users</span>
                          <ChevronRight size={16} className={activationTableFilter === "notActivated" ? "text-primary" : "text-muted-foreground"} />
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="rounded-md border border-border bg-card overflow-hidden overflow-x-auto">
                  <div className="min-w-[380px]">
                  <div className="px-3 py-2 border-b border-border bg-muted/20">
                    <div className="text-base font-semibold text-foreground">
                      {activationTableFilter === "onboarded"
                        ? "Recently Onboarded"
                        : activationTableFilter === "activated"
                        ? "Recent Activations"
                        : activationTableFilter === "leads"
                        ? "Leads"
                        : "Recently Onboarded"}
                    </div>
                  </div>

                  {activationTableFilter === "notActivated" ? (
                    <>
                      <div className="grid grid-cols-[1fr_140px_110px] border-b border-border px-3 py-2">
                        <div className="text-xs font-semibold text-muted-foreground">Client</div>
                        <div className="text-xs font-semibold text-muted-foreground text-right">
                          Onboarded On
                        </div>
                        <div className="text-xs font-semibold text-muted-foreground text-right">
                          Suggested Action
                        </div>
                      </div>

                      <div className="max-h-[220px] overflow-auto">
                        {ACTIVATION_RECENT_CLIENTS.map((client) => (
                          <div
                            key={client.name}
                            className="grid grid-cols-[1fr_140px_110px] px-3 py-2 border-b border-border last:border-b-0"
                          >
                            <div className="text-[13px] text-foreground truncate pr-2">
                              {client.name}
                            </div>
                            <div className="text-[13px] text-foreground text-right">
                              {client.onboardedOn}
                            </div>
                            <div className="flex items-center justify-end gap-2 text-primary">
                              <button
                                type="button"
                                aria-label={`WhatsApp ${client.name}`}
                                title="WhatsApp"
                                className="h-7 w-7 inline-flex items-center justify-center rounded-md border border-border hover:bg-primary/5 transition-colors"
                              >
                                <MessageCircle size={15} />
                              </button>
                              <button
                                type="button"
                                aria-label={`Call ${client.name}`}
                                title="Call"
                                className="h-7 w-7 inline-flex items-center justify-center rounded-md border border-border hover:bg-primary/5 transition-colors"
                              >
                                <Phone size={15} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : activationTableFilter === "leads" ? (
                    <>
                      <div className="grid grid-cols-[150px_130px_130px_1fr_120px_150px] border-b border-border px-3 py-2">
                        <div className="text-xs font-semibold text-muted-foreground">
                          Client (UCC)
                        </div>
                        <div className="text-xs font-semibold text-muted-foreground text-right">
                          Date Created
                        </div>
                        <div className="text-xs font-semibold text-muted-foreground text-right">
                          Last Updated
                        </div>
                        <div className="text-xs font-semibold text-muted-foreground text-right">
                          Name
                        </div>
                        <div className="text-xs font-semibold text-muted-foreground text-right">
                          Status
                        </div>
                        <div className="text-xs font-semibold text-muted-foreground text-right">
                          Current Step
                        </div>
                      </div>

                      <div className="max-h-[220px] overflow-auto">
                        {ACTIVATION_LEADS_ROWS.map((lead) => (
                          <div
                            key={lead.clientUcc}
                            className="grid grid-cols-[150px_130px_130px_1fr_120px_150px] px-3 py-2 border-b border-border last:border-b-0"
                          >
                            <div className="text-[13px] text-foreground truncate pr-2">
                              {lead.clientUcc}
                            </div>
                            <div className="text-[13px] text-foreground text-right">
                              {lead.dateCreated}
                            </div>
                            <div className="text-[13px] text-foreground text-right">
                              {lead.lastUpdated}
                            </div>
                            <div className="text-[13px] text-foreground text-right truncate">
                              {lead.name}
                            </div>
                            <div className="text-[13px] text-foreground text-right">
                              {lead.status}
                            </div>
                            <div className="text-[13px] text-foreground text-right truncate">
                              {lead.currentStep}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-[1fr_130px_130px_180px] border-b border-border px-3 py-2">
                        <div className="text-xs font-semibold text-muted-foreground">
                          Client Name (UCC)
                        </div>
                        <div className="text-xs font-semibold text-muted-foreground text-right">
                          Onboarded Date
                        </div>
                        <div className="text-xs font-semibold text-muted-foreground text-right">
                          Activation Status
                        </div>
                        <div className="text-xs font-semibold text-muted-foreground text-right">
                          Products Active In
                        </div>
                      </div>

                      <div className="max-h-[220px] overflow-auto">
                        {(activationTableFilter === "onboarded"
                          ? ACTIVATION_ONBOARDED_ROWS
                          : ACTIVATION_ACTIVE_ROWS
                        ).map((client) => (
                          <div
                            key={client.name}
                            className="grid grid-cols-[1fr_130px_130px_180px] px-3 py-2 border-b border-border last:border-b-0"
                          >
                            <div className="text-[13px] text-foreground truncate pr-2">
                              {client.name}
                            </div>
                            <div className="text-[13px] text-foreground text-right">
                              {client.onboardedOn}
                            </div>
                            <div className="text-[13px] text-foreground text-right">
                              {client.activationStatus}
                            </div>
                            <div className="text-[13px] text-foreground text-right truncate">
                              {client.productsActiveIn}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  <div className="px-3 py-2 border-t border-border flex justify-end">
                    <button
                      type="button"
                      className="h-8 rounded-md border border-primary px-3 text-xs font-semibold text-primary hover:bg-primary/5 transition-colors"
                    >
                      VIEW ALL
                    </button>
                  </div>
                  </div>
                </div>
            </div>
            </div>
          )}

          {activeNavTab === "crossSell" && (
            <div>
            <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4">
                <div className="rounded-md border border-border bg-card overflow-hidden">
                  <div className="px-3 py-2 border-b border-border bg-muted/20">
                    <div className="text-base font-semibold text-foreground">
                      Cross Sell Summary
                    </div>
                  </div>

                  <div className="p-3 space-y-2 max-h-[180px] overflow-y-auto md:max-h-none">
                    {CROSS_SELL_CARDS.map((card) => {
                      const isActive = crossSellFilter === card.id;
                      const Icon =
                        card.id === "equityPotential"
                          ? BarChart3
                          : card.id === "mtf"
                            ? Layers
                            : card.id === "fno"
                              ? TrendingDown
                              : card.id === "ipo"
                                ? Crown
                                : card.id === "intraday"
                                  ? BarChart3
                                  : Layers;
                      return (
                        <button
                          key={card.id}
                          type="button"
                          onClick={() => setCrossSellFilter(card.id)}
                          className={`w-full text-left rounded-md px-3 py-2 transition-colors ${
                            isActive ? "bg-primary/5" : "bg-background hover:bg-muted/30"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex min-w-0 items-center gap-2">
                              <Icon size={16} className={isActive ? "text-primary" : "text-muted-foreground"} />
                              <div className="truncate text-[13px] font-medium text-foreground">{card.title}</div>
                            </div>
                            <div className={`flex flex-shrink-0 items-center gap-2 text-[12px] font-semibold ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                              <span>{card.totalClients} users</span>
                              <ChevronRight size={16} className={isActive ? "text-primary" : "text-muted-foreground"} />
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-md border border-border bg-card overflow-hidden overflow-x-auto">
                  <div className="min-w-[320px]">
                  <div className="px-3 py-2 border-b border-border bg-muted/20">
                    <div className="text-base font-semibold text-foreground">
                      {activeCrossSellCard.title}
                    </div>
                  </div>
                  <div className="grid grid-cols-[1fr_160px_110px] border-b border-border px-3 py-2">
                    <div className="text-xs font-semibold text-muted-foreground">
                      Client Name (UCC)
                    </div>
                    <div className="text-xs font-semibold text-muted-foreground text-right">
                      {activeCrossSellCard.metricHeader}
                    </div>
                    <div className="text-xs font-semibold text-muted-foreground text-right">
                      Action
                    </div>
                  </div>

                  <div className="max-h-[220px] overflow-auto">
                    {activeCrossSellCard.clients.map((row) => (
                      <div
                        key={row.name}
                        className="grid grid-cols-[1fr_160px_110px] px-3 py-2 border-b border-border last:border-b-0"
                      >
                        <div className="text-[13px] text-foreground truncate pr-2">
                          {row.name}
                        </div>
                        <div className="text-[13px] text-foreground text-right truncate">
                          {row.metric}
                        </div>
                        <div className="flex items-center justify-end gap-2 text-primary">
                          <button
                            type="button"
                            aria-label={`WhatsApp ${row.name}`}
                            title="WhatsApp"
                            className="h-7 w-7 inline-flex items-center justify-center rounded-md border border-border hover:bg-primary/5 transition-colors"
                          >
                            <MessageCircle size={15} />
                          </button>
                          <button
                            type="button"
                            aria-label={`Call ${row.name}`}
                            title="Call"
                            className="h-7 w-7 inline-flex items-center justify-center rounded-md border border-border hover:bg-primary/5 transition-colors"
                          >
                            <Phone size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="px-3 py-2 border-t border-border flex justify-end">
                    <button
                      type="button"
                      className="h-8 rounded-md border border-primary px-3 text-xs font-semibold text-primary hover:bg-primary/5 transition-colors"
                    >
                      VIEW ALL
                    </button>
                  </div>
                  </div>
                </div>
            </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

