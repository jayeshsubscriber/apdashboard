"use client";

import { useState } from "react";
import { MessageCircle, Phone } from "lucide-react";

type MainTab = "atRiskClients" | "activation" | "crossSell";
type ActivationTableFilter = "onboarded" | "activated" | "notActivated" | "leads";
type ActivationRangeId = "last7" | "last30" | "last90";
type AtRiskFilter = "mayStopTrading" | "highFnOLosses" | "topFivePercent";
type CrossSellFilter = "fo" | "mfUpsell";

const MAIN_TABS: Array<{ id: MainTab; label: string }> = [
  { id: "atRiskClients", label: "At Risk Clients" },
  { id: "activation", label: "Onboarding and Activation" },
  { id: "crossSell", label: "Cross Sell" },
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
type CrossSellFoRow = {
  name: string;
  productsActiveIn: string;
  segmentStatus: "Segment Active" | "Segment Not Activated";
};
type CrossSellMfRow = {
  name: string;
  productsActiveIn: string;
};

const TAB_CONTENT: Record<"atRiskClients" | "crossSell", TabContent> = {
  atRiskClients: {
    cards: [
      {
        title: "May Stop Trading",
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

const CROSS_SELL_SUMMARY = {
  fo: 16,
  mfUpsell: 14,
};

const CROSS_SELL_FO_ROWS: CrossSellFoRow[] = [
  {
    name: "Rahul Suryawanshi (RSWY8821)",
    productsActiveIn: "Equity, ETFs",
    segmentStatus: "Segment Not Activated",
  },
  {
    name: "Shruti Naik (SNIK2043)",
    productsActiveIn: "Equity, MF",
    segmentStatus: "Segment Active",
  },
  {
    name: "Manish Korde (MKRD1297)",
    productsActiveIn: "Bonds, NCD",
    segmentStatus: "Segment Not Activated",
  },
  {
    name: "Tejas Patil (TPAT4471)",
    productsActiveIn: "Equity, ETFs, MF",
    segmentStatus: "Segment Active",
  },
  {
    name: "Aarti Kamble (AKMB3905)",
    productsActiveIn: "FD, Bonds",
    segmentStatus: "Segment Not Activated",
  },
];

const CROSS_SELL_MF_ROWS: CrossSellMfRow[] = [
  { name: "Omkar Nimbalkar (OMNB3321)", productsActiveIn: "Equity, ETFs" },
  { name: "Rutuja Jadhav (RTJD5503)", productsActiveIn: "Equity, F&O" },
  { name: "Neha More (NHMR7409)", productsActiveIn: "Equity" },
  { name: "Vikram Chavan (VKCV1985)", productsActiveIn: "Equity, Bonds" },
  { name: "Dhanashree Kale (DNKL7771)", productsActiveIn: "Equity, ETFs, FD" },
];

export function BusinessOpportunitiesCard() {
  const [activeNavTab, setActiveNavTab] = useState<MainTab>("atRiskClients");
  const [atRiskFilter, setAtRiskFilter] = useState<AtRiskFilter>("mayStopTrading");
  const [activationTableFilter, setActivationTableFilter] =
    useState<ActivationTableFilter>("leads");
  const [activationRangeId, setActivationRangeId] =
    useState<ActivationRangeId>("last30");
  const [crossSellFilter, setCrossSellFilter] = useState<CrossSellFilter>("fo");

  const atRiskCardMap: Record<AtRiskFilter, OpportunityCardData> = {
    mayStopTrading: TAB_CONTENT.atRiskClients.cards[0],
    highFnOLosses: TAB_CONTENT.atRiskClients.cards[1],
    topFivePercent: TAB_CONTENT.atRiskClients.cards[2],
  };

  return (
    <section className="rounded-md border border-border bg-card overflow-hidden min-h-[420px]">
      <div className="p-5">
        <h2 className="text-lg font-semibold text-foreground tracking-tight">
          Business Opportunities
        </h2>

        <div className="mt-3 grid grid-cols-12 gap-4">
          <div className="col-span-7">
            <div className="flex items-center gap-6 border-b border-border">
              {MAIN_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveNavTab(tab.id)}
                  className={`pb-2 text-[15px] font-medium transition-colors border-b-2 outline-none ${
                    activeNavTab === tab.id
                      ? "text-primary border-primary"
                      : "text-muted-foreground border-transparent hover:text-foreground"
                  } focus-visible:ring-1 focus-visible:ring-primary rounded-sm`}
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
            <div className="mb-3 text-[18px] font-semibold text-foreground tracking-tight">
              At Risk Clients
            </div>
            <div className="overflow-x-auto pb-1">
              <div className="flex min-w-max gap-4">
                <div className="w-[320px] rounded-md border border-border bg-card overflow-hidden">
                  <div className="px-3 py-2 border-b border-border bg-muted/20">
                    <div className="text-base font-semibold text-foreground">
                      At Risk Client Summary
                    </div>
                  </div>

                  <div className="p-3 space-y-2">
                    <button
                      type="button"
                      onClick={() => setAtRiskFilter("mayStopTrading")}
                      className={`w-full text-left rounded-md border px-3 py-2 transition-colors ${
                        atRiskFilter === "mayStopTrading"
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                    >
                      <div className="text-xs text-muted-foreground">May Stop Trading</div>
                      <div className="text-3xl font-semibold text-foreground leading-none mt-1">
                        {atRiskCardMap.mayStopTrading.totalClients}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAtRiskFilter("highFnOLosses")}
                      className={`w-full text-left rounded-md border px-3 py-2 transition-colors ${
                        atRiskFilter === "highFnOLosses"
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                    >
                      <div className="text-xs text-muted-foreground">High F&O Losses</div>
                      <div className="text-3xl font-semibold text-foreground leading-none mt-1">
                        {atRiskCardMap.highFnOLosses.totalClients}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAtRiskFilter("topFivePercent")}
                      className={`w-full text-left rounded-md border px-3 py-2 transition-colors ${
                        atRiskFilter === "topFivePercent"
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                    >
                      <div className="text-xs text-muted-foreground">Top 5% Clients</div>
                      <div className="text-3xl font-semibold text-foreground leading-none mt-1">
                        {atRiskCardMap.topFivePercent.totalClients}
                      </div>
                    </button>
                  </div>
                </div>

                <div className="w-[900px] rounded-md border border-border bg-card overflow-hidden">
                  <div className="px-3 py-2 border-b border-border bg-muted/20">
                    <div className="text-base font-semibold text-foreground">
                      {atRiskCardMap[atRiskFilter].title}
                    </div>
                  </div>

                  <div className="grid grid-cols-[1fr_180px_130px] border-b border-border px-3 py-2">
                    <div className="text-xs font-semibold text-muted-foreground">
                      Top 5 Clients
                    </div>
                    <div className="text-xs font-semibold text-muted-foreground text-right">
                      {atRiskCardMap[atRiskFilter].metricHeader}
                    </div>
                    <div className="text-xs font-semibold text-muted-foreground text-right">
                      Suggested Action
                    </div>
                  </div>

                  <div className="max-h-[220px] overflow-auto">
                    {atRiskCardMap[atRiskFilter].clients.map((client) => (
                      <div
                        key={client.name}
                        className="grid grid-cols-[1fr_180px_130px] px-3 py-2 border-b border-border last:border-b-0"
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
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="text-[18px] font-semibold text-foreground tracking-tight">
                Onboarding and Activation
              </div>
              <select
                aria-label="Activation time interval"
                value={activationRangeId}
                onChange={(e) => setActivationRangeId(e.target.value as ActivationRangeId)}
                className="h-8 rounded-md border border-border bg-card px-3 text-xs text-muted-foreground outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                <option value="last7">Last 7 Days</option>
                <option value="last30">Last 30 Days</option>
                <option value="last90">Last 90 Days</option>
              </select>
            </div>
            <div className="overflow-x-auto pb-1">
              <div className="flex min-w-max gap-4">
                <div className="w-[320px] rounded-md border border-border bg-card overflow-hidden">
                  <div className="px-3 py-2 border-b border-border bg-muted/20">
                    <div className="text-base font-semibold text-foreground">
                      Activation Summary
                    </div>
                  </div>

                  <div className="p-3 space-y-2">
                    <button
                      type="button"
                      onClick={() => setActivationTableFilter("leads")}
                      className={`w-full text-left rounded-md border px-3 py-2 transition-colors ${
                        activationTableFilter === "leads"
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                    >
                      <div className="text-xs text-muted-foreground">Leads</div>
                      <div className="text-3xl font-semibold text-foreground leading-none mt-1">
                        {ACTIVATION_SUMMARY.leads}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivationTableFilter("onboarded")}
                      className={`w-full text-left rounded-md border px-3 py-2 transition-colors ${
                        activationTableFilter === "onboarded"
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                    >
                      <div className="text-xs text-muted-foreground">Clients Onboarded</div>
                      <div className="text-3xl font-semibold text-foreground leading-none mt-1">
                        {ACTIVATION_SUMMARY.onboarded}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivationTableFilter("activated")}
                      className={`w-full text-left rounded-md border px-3 py-2 transition-colors ${
                        activationTableFilter === "activated"
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                    >
                      <div className="text-xs text-muted-foreground">Clients Activated</div>
                      <div className="text-3xl font-semibold text-foreground leading-none mt-1">
                        {ACTIVATION_SUMMARY.activated}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivationTableFilter("notActivated")}
                      className={`w-full text-left rounded-md border px-3 py-2 transition-colors ${
                        activationTableFilter === "notActivated"
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                    >
                      <div className="text-xs text-muted-foreground">Not Activated</div>
                      <div className="text-3xl font-semibold text-primary leading-none mt-1">
                        {ACTIVATION_SUMMARY.notActivated}
                      </div>
                    </button>
                  </div>
                </div>

                <div className="w-[900px] rounded-md border border-border bg-card overflow-hidden">
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
                      <div className="grid grid-cols-[1fr_140px_150px] border-b border-border px-3 py-2">
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
                            className="grid grid-cols-[1fr_140px_150px] px-3 py-2 border-b border-border last:border-b-0"
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
            <div className="mb-3 text-[18px] font-semibold text-foreground tracking-tight">
              Cross Sell
            </div>
            <div className="overflow-x-auto pb-1">
              <div className="flex min-w-max gap-4">
                <div className="w-[320px] rounded-md border border-border bg-card overflow-hidden">
                  <div className="px-3 py-2 border-b border-border bg-muted/20">
                    <div className="text-base font-semibold text-foreground">
                      Cross Sell Summary
                    </div>
                  </div>

                  <div className="p-3 space-y-2">
                    <button
                      type="button"
                      onClick={() => setCrossSellFilter("fo")}
                      className={`w-full text-left rounded-md border px-3 py-2 transition-colors ${
                        crossSellFilter === "fo"
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                    >
                      <div className="text-xs text-muted-foreground">F&O</div>
                      <div className="text-3xl font-semibold text-foreground leading-none mt-1">
                        {CROSS_SELL_SUMMARY.fo}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCrossSellFilter("mfUpsell")}
                      className={`w-full text-left rounded-md border px-3 py-2 transition-colors ${
                        crossSellFilter === "mfUpsell"
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                    >
                      <div className="text-xs text-muted-foreground">MF Upsell</div>
                      <div className="text-3xl font-semibold text-foreground leading-none mt-1">
                        {CROSS_SELL_SUMMARY.mfUpsell}
                      </div>
                    </button>
                  </div>
                </div>

                <div className="w-[900px] rounded-md border border-border bg-card overflow-hidden">
                  <div className="px-3 py-2 border-b border-border bg-muted/20">
                    <div className="text-base font-semibold text-foreground">
                      {crossSellFilter === "fo" ? "F&O Opportunities" : "MF Upsell Opportunities"}
                    </div>
                  </div>

                  {crossSellFilter === "fo" ? (
                    <>
                      <div className="grid grid-cols-[1fr_170px_170px_130px] border-b border-border px-3 py-2">
                        <div className="text-xs font-semibold text-muted-foreground">
                          Client Name (UCC)
                        </div>
                        <div className="text-xs font-semibold text-muted-foreground text-right">
                          Products Active In
                        </div>
                        <div className="text-xs font-semibold text-muted-foreground text-right">
                          F&O Segment
                        </div>
                        <div className="text-xs font-semibold text-muted-foreground text-right">
                          Suggested Action
                        </div>
                      </div>

                      <div className="max-h-[220px] overflow-auto">
                        {CROSS_SELL_FO_ROWS.map((row) => (
                          <div
                            key={row.name}
                            className="grid grid-cols-[1fr_170px_170px_130px] px-3 py-2 border-b border-border last:border-b-0"
                          >
                            <div className="text-[13px] text-foreground truncate pr-2">
                              {row.name}
                            </div>
                            <div className="text-[13px] text-foreground text-right truncate">
                              {row.productsActiveIn}
                            </div>
                            <div className="text-[13px] text-foreground text-right">
                              {row.segmentStatus}
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
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-[1fr_220px_130px] border-b border-border px-3 py-2">
                        <div className="text-xs font-semibold text-muted-foreground">
                          Client Name (UCC)
                        </div>
                        <div className="text-xs font-semibold text-muted-foreground text-right">
                          Products Active In
                        </div>
                        <div className="text-xs font-semibold text-muted-foreground text-right">
                          Suggested Action
                        </div>
                      </div>

                      <div className="max-h-[220px] overflow-auto">
                        {CROSS_SELL_MF_ROWS.map((row) => (
                          <div
                            key={row.name}
                            className="grid grid-cols-[1fr_220px_130px] px-3 py-2 border-b border-border last:border-b-0"
                          >
                            <div className="text-[13px] text-foreground truncate pr-2">
                              {row.name}
                            </div>
                            <div className="text-[13px] text-foreground text-right truncate">
                              {row.productsActiveIn}
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
        </div>
      </div>
    </section>
  );
}

