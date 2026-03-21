"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";

type AdvisoryTab = "fo" | "mtf" | "intraday" | "stocks";
type IpoTab = "open" | "upcoming";
type MfTab = "topRated" | "equity" | "debt" | "index";

type AdvisoryCall = {
  symbol: string;
  createdAt: string;
  source: string;
  stopLoss: string;
  entry: string;
  target: string;
  potentialLeft: string;
  currentPrice: string;
  currentChange: string;
  changePositive: boolean;
  recommendation: "Buy" | "Sell";
};

type IpoRow = {
  name: string;
  marketType: string;
  openClose: string;
  issueSize: string;
  priceRange: string;
  subscription: string;
};

type MfRow = {
  name: string;
  amc: string;
  category: string;
  return1Y: string;
  return3Y: string;
  expenseRatio: string;
  aum: string;
  risk: "Low" | "Moderate" | "High";
  minSip: string;
};

const ADVISORY_TABS: Array<{ id: AdvisoryTab; label: string }> = [
  { id: "fo", label: "F&O (10)" },
  { id: "mtf", label: "MTF (0)" },
  { id: "intraday", label: "Intraday (0)" },
  { id: "stocks", label: "Stocks (32)" },
];

const IPO_TABS: Array<{ id: IpoTab; label: string }> = [
  { id: "open", label: "Open" },
  { id: "upcoming", label: "Upcoming" },
];

const MF_TABS: Array<{ id: MfTab; label: string }> = [
  { id: "topRated", label: "Top Rated" },
  { id: "equity", label: "Equity" },
  { id: "debt", label: "Debt" },
  { id: "index", label: "Index" },
];

const ADVISORY_BY_TAB: Record<AdvisoryTab, AdvisoryCall[]> = {
  fo: [
    {
      symbol: "PGEL 520 CE",
      createdAt: "18 Mar",
      source: "AlphaMarket",
      stopLoss: "23.00",
      entry: "31.00",
      target: "60.00",
      potentialLeft: "123.00%",
      currentPrice: "26.90",
      currentChange: "+6.60 (26.29%)",
      changePositive: true,
      recommendation: "Buy",
    },
    {
      symbol: "NIFTY 22500 PE",
      createdAt: "18 Mar",
      source: "AlgoBazaar",
      stopLoss: "110.00",
      entry: "160.00",
      target: "280.00",
      potentialLeft: "87.50%",
      currentPrice: "142.50",
      currentChange: "-33.0 (17.45%)",
      changePositive: true,
      recommendation: "Sell",
    },
    {
      symbol: "BANKNIFTY 48000 CE",
      createdAt: "18 Mar",
      source: "TradeAlpha",
      stopLoss: "70.00",
      entry: "95.00",
      target: "180.00",
      potentialLeft: "104.55%",
      currentPrice: "88.00",
      currentChange: "-4.20 (-4.55%)",
      changePositive: false,
      recommendation: "Sell",
    },
    {
      symbol: "INFY 1700 CE",
      createdAt: "18 Mar",
      source: "AlgoBazaar",
      stopLoss: "25.00",
      entry: "38.00",
      target: "75.00",
      potentialLeft: "97.37%",
      currentPrice: "32.40",
      currentChange: "-2.10 (6.93%)",
      changePositive: true,
      recommendation: "Buy",
    },
  ],
  mtf: [],
  intraday: [],
  stocks: [
    {
      symbol: "TCS",
      createdAt: "17 Mar",
      source: "AlphaMarket",
      stopLoss: "3720",
      entry: "3810",
      target: "4050",
      potentialLeft: "6.29%",
      currentPrice: "3862",
      currentChange: "+34 (0.89%)",
      changePositive: true,
      recommendation: "Buy",
    },
  ],
};

const LIVE_IPOS: IpoRow[] = [
  {
    name: "Apex Green Energy Ltd",
    marketType: "SME, Software",
    openClose: "19 Mar - 21 Mar",
    issueSize: "Rs 60 Cr",
    priceRange: "Rs 139 - Rs 146",
    subscription: "1.10x",
  },
  {
    name: "Nexa Finance Services",
    marketType: "Mainboard, Finance",
    openClose: "18 Mar - 22 Mar",
    issueSize: "Rs 329 Cr",
    priceRange: "Rs 255 - Rs 268",
    subscription: "0.92x",
  },
];

const UPCOMING_IPOS: IpoRow[] = [
  {
    name: "Omni Aerospace Systems",
    marketType: "Mainboard, Engineering",
    openClose: "Expected: 28 Mar - 01 Apr",
    issueSize: "TBA",
    priceRange: "TBA",
    subscription: "---",
  },
  {
    name: "Pioneer Mobility Tech",
    marketType: "Mainboard, Auto-Tech",
    openClose: "Expected: 02 Apr - 05 Apr",
    issueSize: "TBA",
    priceRange: "TBA",
    subscription: "---",
  },
];

const MUTUAL_FUNDS: Record<MfTab, MfRow[]> = {
  topRated: [
    {
      name: "Axis Growth Opportunities Fund",
      amc: "Axis AMC",
      category: "Flexi Cap",
      return1Y: "22.1%",
      return3Y: "18.4%",
      expenseRatio: "0.73%",
      aum: "Rs 15,320 Cr",
      risk: "Moderate",
      minSip: "Rs 500",
    },
    {
      name: "ICICI Prudential Bluechip Fund",
      amc: "ICICI Prudential AMC",
      category: "Large Cap",
      return1Y: "18.7%",
      return3Y: "16.2%",
      expenseRatio: "0.58%",
      aum: "Rs 61,480 Cr",
      risk: "Moderate",
      minSip: "Rs 100",
    },
  ],
  equity: [
    {
      name: "Mirae Asset Emerging Bluechip",
      amc: "Mirae Asset AMC",
      category: "Large & Mid Cap",
      return1Y: "24.6%",
      return3Y: "17.9%",
      expenseRatio: "0.69%",
      aum: "Rs 36,905 Cr",
      risk: "High",
      minSip: "Rs 500",
    },
    {
      name: "SBI Contra Fund",
      amc: "SBI Mutual Fund",
      category: "Contra",
      return1Y: "26.8%",
      return3Y: "19.1%",
      expenseRatio: "0.84%",
      aum: "Rs 41,260 Cr",
      risk: "High",
      minSip: "Rs 500",
    },
  ],
  debt: [
    {
      name: "HDFC Corporate Bond Fund",
      amc: "HDFC AMC",
      category: "Corporate Bond",
      return1Y: "8.5%",
      return3Y: "7.2%",
      expenseRatio: "0.38%",
      aum: "Rs 30,740 Cr",
      risk: "Low",
      minSip: "Rs 100",
    },
    {
      name: "Kotak Dynamic Bond Fund",
      amc: "Kotak AMC",
      category: "Dynamic Bond",
      return1Y: "9.2%",
      return3Y: "7.8%",
      expenseRatio: "0.42%",
      aum: "Rs 4,980 Cr",
      risk: "Moderate",
      minSip: "Rs 100",
    },
  ],
  index: [
    {
      name: "UTI Nifty 50 Index Fund",
      amc: "UTI AMC",
      category: "Index Fund",
      return1Y: "17.3%",
      return3Y: "15.1%",
      expenseRatio: "0.21%",
      aum: "Rs 17,640 Cr",
      risk: "Moderate",
      minSip: "Rs 500",
    },
    {
      name: "HDFC Sensex Index Fund",
      amc: "HDFC AMC",
      category: "Index Fund",
      return1Y: "16.9%",
      return3Y: "14.8%",
      expenseRatio: "0.19%",
      aum: "Rs 6,520 Cr",
      risk: "Moderate",
      minSip: "Rs 100",
    },
  ],
};

const UPSTOX_IPO_URL = "https://upstox.com/ipo/";

function riskPillClass(risk: MfRow["risk"]) {
  if (risk === "Low") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (risk === "Moderate") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-rose-50 text-rose-700 border-rose-200";
}

function fundLogoInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function amcLogoDomain(amc: string) {
  const normalized = amc.toLowerCase();
  if (normalized.includes("axis")) return "axismf.com";
  if (normalized.includes("icici")) return "icicipruamc.com";
  if (normalized.includes("sbi")) return "sbimf.com";
  if (normalized.includes("hdfc")) return "hdfcfund.com";
  if (normalized.includes("kotak")) return "kotakmf.com";
  if (normalized.includes("uti")) return "utimf.com";
  if (normalized.includes("mirae")) return "miraeassetmf.co.in";
  return "upstox.com";
}

function amcLogoUrl(amc: string) {
  const domain = amcLogoDomain(amc);
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

export function WealthProductsCard() {
  const [activeAdvisoryTab, setActiveAdvisoryTab] = useState<AdvisoryTab>("fo");
  const [activeIpoTab, setActiveIpoTab] = useState<IpoTab>("open");
  const [activeMfTab, setActiveMfTab] = useState<MfTab>("topRated");

  const advisoryRows = ADVISORY_BY_TAB[activeAdvisoryTab];
  const ipoRows = activeIpoTab === "open" ? LIVE_IPOS : UPCOMING_IPOS;
  const mfRows = MUTUAL_FUNDS[activeMfTab];

  return (
    <section className="rounded-md border border-border bg-card overflow-hidden">
      <div className="p-5">
        <h2 className="text-lg font-semibold text-foreground tracking-tight">Wealth Products</h2>
        <div className="mt-4 space-y-6">
          <div>
            <div className="mb-3 text-[18px] font-semibold text-foreground tracking-tight">Advisory</div>
              <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1">
                {ADVISORY_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveAdvisoryTab(tab.id)}
                    className={`h-7 rounded-full border px-3 text-xs font-medium transition-colors shrink-0 whitespace-nowrap ${
                      activeAdvisoryTab === tab.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {advisoryRows.length === 0 ? (
                <div className="rounded-md border border-dashed border-border p-6 text-sm text-muted-foreground">
                  No advisory calls available in this category.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                  {advisoryRows.map((call) => (
                    <article
                      key={`${call.symbol}-${call.source}`}
                      className="rounded-md border border-border bg-card p-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-[11px] text-muted-foreground">
                            Created: {call.createdAt}
                            <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[10px]">
                              {call.source}
                            </span>
                          </div>
                          <div className="mt-0.5 text-lg font-semibold text-foreground">
                            {call.symbol}
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-base font-semibold ${
                              call.changePositive ? "text-emerald-700" : "text-rose-700"
                            }`}
                          >
                            Rs {call.currentPrice}
                          </div>
                          <div className="text-[11px] text-muted-foreground">{call.currentChange}</div>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-3 gap-3">
                        <div>
                          <div className="text-[11px] text-muted-foreground">Stop-loss</div>
                          <div className="text-sm font-medium text-foreground">{call.stopLoss}</div>
                        </div>
                        <div>
                          <div className="text-[11px] text-muted-foreground">Entry price</div>
                          <div className="text-sm font-medium text-foreground">{call.entry}</div>
                        </div>
                        <div>
                          <div className="text-[11px] text-muted-foreground">Target</div>
                          <div className="text-sm font-medium text-foreground">{call.target}</div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-sm font-semibold text-emerald-700">
                          {call.potentialLeft}
                          <span className="ml-1 text-xs font-normal text-muted-foreground">
                            Potential left
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/20 px-2 py-1">
                            <span className="text-[11px] font-medium text-muted-foreground">
                              Recommendation
                            </span>
                            <span
                              className={`rounded-sm px-2 py-0.5 text-[11px] font-semibold ${
                                call.recommendation === "Buy"
                                  ? "bg-emerald-700 text-white"
                                  : "bg-rose-700 text-white"
                              }`}
                            >
                              {call.recommendation}
                            </span>
                          </div>
                          <button
                            type="button"
                            className="h-7 rounded-md border border-primary/30 bg-primary/10 px-2 text-xs font-medium text-primary inline-flex items-center gap-1 hover:bg-primary/15 transition-colors"
                          >
                            <Share2 size={12} />
                            Share
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
          </div>

          <div>
            <div className="mb-3 text-[18px] font-semibold text-foreground tracking-tight">IPO Overview</div>
            <div className="rounded-md border border-border bg-card overflow-hidden">
              <div className="border-b border-border px-3 py-2 bg-muted/20 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 overflow-x-auto">
                  {IPO_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveIpoTab(tab.id)}
                      className={`h-7 rounded-full border px-3 text-xs font-medium transition-colors ${
                        activeIpoTab === tab.id
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="h-7 rounded-md border border-primary px-3 text-xs font-semibold text-primary hover:bg-primary/5 transition-colors"
                >
                  VIEW MORE IPOs
                </button>
              </div>

              <div className="overflow-x-auto">
                <div className="min-w-[780px]">
                  <div className="grid grid-cols-[minmax(180px,0.9fr)_180px_145px_145px_110px_200px] border-b border-border px-3 py-2 gap-x-2">
                    <div className="text-xs font-semibold text-muted-foreground">Name</div>
                    <div className="text-xs font-semibold text-muted-foreground text-right">Open/Close</div>
                    <div className="text-xs font-semibold text-muted-foreground text-right">Issue Size</div>
                    <div className="text-xs font-semibold text-muted-foreground text-right">Price Range</div>
                    <div className="text-xs font-semibold text-muted-foreground text-right">Subscription</div>
                    <div className="text-xs font-semibold text-muted-foreground text-right">Actions</div>
                  </div>

                  <div className="max-h-[240px] overflow-y-auto">
                    {ipoRows.map((row) => (
                      <div
                        key={row.name}
                        className="grid grid-cols-[minmax(180px,0.9fr)_180px_145px_145px_110px_200px] gap-x-2 px-3 py-2 border-b border-border last:border-b-0"
                      >
                        <div className="pr-2">
                          <div className="text-[13px] text-foreground truncate">{row.name}</div>
                          <div className="text-[11px] text-muted-foreground truncate">{row.marketType}</div>
                        </div>
                        <div className="text-[13px] text-foreground text-right whitespace-nowrap">{row.openClose}</div>
                        <div className="text-[13px] text-foreground text-right whitespace-nowrap">{row.issueSize}</div>
                        <div className="text-[13px] text-foreground text-right whitespace-nowrap">{row.priceRange}</div>
                        <div className="text-[13px] text-foreground text-right whitespace-nowrap">{row.subscription}</div>
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={UPSTOX_IPO_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-7 items-center justify-center rounded-md border border-primary px-2.5 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/5 whitespace-nowrap"
                          >
                            View Details
                          </a>
                          <button
                            type="button"
                            className="h-7 rounded-md border border-primary/30 bg-primary/10 px-2 text-xs font-medium text-primary inline-flex items-center gap-1 hover:bg-primary/15 transition-colors"
                          >
                            <Share2 size={12} />
                            Share
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-3 text-[18px] font-semibold text-foreground tracking-tight">
              Mutual Funds
            </div>
            <div className="rounded-md border border-border bg-card overflow-hidden">
              <div className="border-b border-border px-3 py-2 bg-muted/20 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {MF_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveMfTab(tab.id)}
                      className={`h-7 rounded-full border px-3 text-xs font-medium transition-colors ${
                        activeMfTab === tab.id
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="h-7 rounded-md border border-primary px-3 text-xs font-semibold text-primary hover:bg-primary/5 transition-colors"
                >
                  VIEW ALL FUNDS
                </button>
              </div>

              <div className="overflow-x-auto">
              <div className="max-h-[300px] overflow-y-auto p-3 space-y-2 min-w-[780px]">
                {mfRows.map((row) => (
                  <div
                    key={row.name}
                    className="rounded-md border border-border bg-card px-3 py-2 grid grid-cols-[1.5fr_90px_90px_90px_130px_130px_110px] items-center gap-3"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-primary/20 bg-primary/10 text-[10px] font-semibold text-primary inline-flex items-center justify-center">
                        {fundLogoInitials(row.name)}
                        <img
                          src={amcLogoUrl(row.amc)}
                          alt={`${row.amc} logo`}
                          className="absolute inset-0 h-full w-full rounded-full bg-white object-contain p-0.5"
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[13px] text-foreground truncate">{row.name}</div>
                        <div className="text-[11px] text-muted-foreground truncate">
                          {row.amc} • {row.category}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-muted-foreground">1Y Return</div>
                      <div className="text-[13px] text-foreground">{row.return1Y}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-muted-foreground">3Y CAGR</div>
                      <div className="text-[13px] text-foreground">{row.return3Y}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-muted-foreground">TER</div>
                      <div className="text-[13px] text-foreground">{row.expenseRatio}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-muted-foreground">Risk</div>
                      <span
                        className={`inline-flex h-6 items-center rounded-full border px-2 text-[11px] ${riskPillClass(
                          row.risk
                        )}`}
                      >
                        {row.risk}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-muted-foreground">AUM</div>
                      <div className="text-[13px] text-foreground">{row.aum}</div>
                    </div>
                    <div className="text-right inline-flex items-center justify-end">
                      <button
                        type="button"
                        className="h-7 rounded-md border border-primary/30 bg-primary/10 px-2 text-xs font-medium text-primary inline-flex items-center gap-1 hover:bg-primary/15 transition-colors"
                      >
                        <Share2 size={12} />
                        Share
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Suggested structure: category tabs + metric-rich cards + quick actions is the fastest
              way for sub-brokers to compare and pitch funds.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
