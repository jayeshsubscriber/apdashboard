"use client";

import { Share2, X, Search, MessageCircle, ChevronRight, Landmark } from "lucide-react";
import { useState, useMemo } from "react";
import { customerRows, type CustomerRow } from "../customers/data";

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
    {
      symbol: "RELIANCE 2900 CE",
      createdAt: "17 Mar",
      source: "AlphaMarket",
      stopLoss: "45.00",
      entry: "62.00",
      target: "120.00",
      potentialLeft: "93.55%",
      currentPrice: "58.40",
      currentChange: "+3.40 (6.18%)",
      changePositive: true,
      recommendation: "Buy",
    },
    {
      symbol: "HDFCBANK 1750 PE",
      createdAt: "17 Mar",
      source: "TradeAlpha",
      stopLoss: "28.00",
      entry: "40.00",
      target: "85.00",
      potentialLeft: "112.50%",
      currentPrice: "37.20",
      currentChange: "-1.80 (-4.62%)",
      changePositive: false,
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
const UPSTOX_TRADE_URL = "https://upstox.com/trade/";

// Mock phone numbers for customers (91 + 10 digits)
const CUSTOMER_PHONES: Record<string, string> = {
  SHJV1174: "919876543210",
  M61747471: "919876543211",
  AAA6180438: "919876543212",
  PDBS8182: "919876543213",
  SHJV1721: "919876543214",
  SHJV1313: "919876543215",
  SHJV2008: "919876543216",
  SHJV2009: "919876543217",
  SHJV2010: "919876543218",
  SHJV2011: "919876543219",
  SHJV2012: "919876543220",
  SHJV2013: "919876543221",
  SHJV2014: "919876543222",
  SHJV2015: "919876543223",
};

const BUSINESS_SEGMENTS = [
  {
    id: "all",
    label: "All Clients",
    description: "All 1,870 registered clients",
    filter: (_c: CustomerRow) => true,
  },
  {
    id: "top5",
    label: "Top 5% Clients",
    description: "High-value clients by AUM & revenue",
    filter: (c: CustomerRow) => c.suggestedActions.includes("Top 5% client"),
  },
  {
    id: "lapse",
    label: "Likely to Lapse",
    description: "Clients showing disengagement signals",
    filter: (c: CustomerRow) => c.suggestedActions.includes("Likely to lapse"),
  },
  {
    id: "fo_loss",
    label: "High F&O Losses",
    description: "Clients with significant F&O drawdown",
    filter: (c: CustomerRow) =>
      c.suggestedActions.includes("High F&O Losses"),
  },
];

function buildWhatsAppMessage(name: string, calls: AdvisoryCall[]): string {
  const callLines = calls
    .map(
      (c) =>
        `*Scrip: ${c.symbol}*\nRecommendation: ${c.recommendation}\nEntry Price: ₹${c.entry}\nTarget Price: ₹${c.target}\nStop Loss: ₹${c.stopLoss}\nPotential Left: ${c.potentialLeft}`
    )
    .join("\n\n");

  return `Hi ${name},\n\nThese are the opportunities you should consider 📈\n\n${callLines}\n\n🔗 View & Trade on Upstox:\n${UPSTOX_TRADE_URL}`;
}

function whatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function riskPillClass(risk: MfRow["risk"]) {
  if (risk === "Low") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (risk === "Moderate")
    return "bg-amber-50 text-amber-700 border-amber-200";
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

// ── Share Modal ───────────────────────────────────────────────────────────────

type ShareModalTab = "segments" | "customers";

function ShareModal({
  calls,
  onClose,
}: {
  calls: AdvisoryCall[];
  onClose: () => void;
}) {
  const [tab, setTab] = useState<ShareModalTab>("segments");
  const [activeSegment, setActiveSegment] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filteredBySegment = useMemo(() => {
    const seg = BUSINESS_SEGMENTS.find((s) => s.id === activeSegment);
    return seg ? customerRows.filter(seg.filter) : customerRows;
  }, [activeSegment]);

  const displayedCustomers = useMemo(() => {
    const base = tab === "segments" ? filteredBySegment : customerRows;
    if (!search.trim()) return base;
    const q = search.toLowerCase();
    return base.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.ucc.toLowerCase().includes(q)
    );
  }, [tab, filteredBySegment, search]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-xl border border-border bg-card shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-border shrink-0">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Share Advisory
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {calls.length === 1
                ? `Sharing: ${calls[0].symbol}`
                : `Sharing ${calls.length} calls`}{" "}
              · Select customers to send via WhatsApp
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex shrink-0 border-b border-border">
          <button
            type="button"
            onClick={() => setTab("segments")}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
              tab === "segments"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Business Opportunities
          </button>
          <button
            type="button"
            onClick={() => setTab("customers")}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
              tab === "customers"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All Customers
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col min-h-0 flex-1 overflow-hidden">
          {/* Segment pills (only on segments tab) */}
          {tab === "segments" && (
            <div className="shrink-0 p-3 border-b border-border">
              <div className="flex flex-wrap gap-2">
                {BUSINESS_SEGMENTS.map((seg) => (
                  <button
                    key={seg.id}
                    type="button"
                    onClick={() => setActiveSegment(seg.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      activeSegment === seg.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                    }`}
                  >
                    {seg.label}
                    <span
                      className={`rounded-full px-1.5 py-px text-[10px] ${
                        activeSegment === seg.id
                          ? "bg-white/20 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {customerRows.filter(seg.filter).length}
                    </span>
                  </button>
                ))}
              </div>
              {activeSegment !== "all" && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {
                    BUSINESS_SEGMENTS.find((s) => s.id === activeSegment)
                      ?.description
                  }
                </p>
              )}
            </div>
          )}

          {/* Search */}
          <div className="shrink-0 px-3 py-2 border-b border-border">
            <div className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-2.5 h-8">
              <Search size={13} className="text-muted-foreground shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or UCC…"
                className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground text-foreground"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Customer list */}
          <div className="flex-1 overflow-y-auto">
            {displayedCustomers.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No customers found.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {displayedCustomers.map((customer) => {
                  const phone = CUSTOMER_PHONES[customer.ucc] ?? "919999999999";
                  const msg = buildWhatsAppMessage(
                    customer.name.split(" ")[0],
                    calls
                  );
                  const waUrl = whatsAppUrl(phone, msg);
                  return (
                    <div
                      key={customer.ucc}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors"
                    >
                      {/* Avatar */}
                      <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                        {customer.name
                          .split(" ")
                          .slice(0, 2)
                          .map((p) => p[0])
                          .join("")
                          .toUpperCase()}
                      </div>

                      {/* Name + UCC */}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">
                          {customer.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {customer.ucc}
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="hidden sm:flex items-center gap-1 shrink-0">
                        {customer.suggestedActions
                          .slice(0, 1)
                          .map((action) => (
                            <span
                              key={action}
                              className={`rounded-full px-2 py-0.5 text-[10px] font-medium border ${
                                action === "Top 5% client"
                                  ? "bg-violet-50 text-violet-700 border-violet-200"
                                  : action === "Likely to lapse"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-rose-50 text-rose-700 border-rose-200"
                              }`}
                            >
                              {action}
                            </span>
                          ))}
                      </div>

                      {/* WhatsApp button */}
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        title={`Send to ${customer.name} on WhatsApp`}
                        className="shrink-0 h-8 w-8 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
                      >
                        <MessageCircle size={15} />
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-border px-5 py-3 flex items-center justify-between bg-muted/20">
          <span className="text-xs text-muted-foreground">
            {displayedCustomers.length} customer
            {displayedCustomers.length !== 1 ? "s" : ""} shown
          </span>
          <button
            type="button"
            onClick={onClose}
            className="h-8 rounded-md border border-border px-3 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Advisory Card ─────────────────────────────────────────────────────────────

function AdvisoryCard({
  call,
  selected,
  onToggle,
  onShareSingle,
}: {
  call: AdvisoryCall;
  selected: boolean;
  onToggle: () => void;
  onShareSingle: () => void;
}) {
  const isPositive = call.changePositive;
  const isBuy = call.recommendation === "Buy";

  return (
    <article
      onClick={onToggle}
      className={`relative rounded-xl border bg-card flex flex-col min-w-[252px] max-w-[252px] snap-start transition-all cursor-pointer select-none ${
        selected
          ? "border-primary ring-1 ring-primary/30 bg-primary/[0.02]"
          : "border-border hover:border-primary/40"
      }`}
    >
      {/* Top bar: source + date */}
      <div className="flex items-center justify-between px-3 pt-3 gap-2">
        <div className="flex items-center gap-1.5">
          {/* Checkbox */}
          <button
            type="button"
            onClick={onToggle}
            className={`h-4 w-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
              selected
                ? "bg-primary border-primary"
                : "border-border hover:border-primary/50"
            }`}
          >
            {selected && (
              <svg
                width="10"
                height="8"
                viewBox="0 0 10 8"
                fill="none"
                className="text-white"
              >
                <path
                  d="M1 4L3.5 6.5L9 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {call.source}
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
          {call.createdAt}
        </span>
      </div>

      {/* Symbol + recommendation */}
      <div className="px-3 pt-2 pb-1 flex items-start justify-between gap-2">
        <div className="text-[15px] font-bold text-foreground leading-tight">
          {call.symbol}
        </div>
        <span
          className={`shrink-0 rounded px-2 py-0.5 text-xs font-bold text-white ${
            isBuy ? "bg-emerald-600" : "bg-rose-600"
          }`}
        >
          {call.recommendation}
        </span>
      </div>

      {/* Price */}
      <div className="px-3 pb-3 border-b border-border/60">
        <div className="text-[15px] font-semibold text-foreground">
          ₹{call.currentPrice}
        </div>
        <div
          className={`text-xs font-medium ${
            isPositive ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {call.currentChange}
        </div>
      </div>

      {/* Data row */}
      <div className="grid grid-cols-3 px-3 py-2.5 gap-1 border-b border-border/60">
        <div>
          <div className="text-[10px] text-muted-foreground">Stop-loss</div>
          <div className="text-xs font-semibold text-foreground mt-0.5">
            {call.stopLoss}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground">Entry</div>
          <div className="text-xs font-semibold text-foreground mt-0.5">
            {call.entry}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground">Target</div>
          <div className="text-xs font-semibold text-foreground mt-0.5">
            {call.target}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-3 py-2.5 gap-2">
        <div>
          <span className="text-sm font-bold text-emerald-700">
            {call.potentialLeft}
          </span>
          <span className="ml-1 text-[10px] text-muted-foreground">
            potential left
          </span>
        </div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onShareSingle(); }}
          className="h-7 rounded-md border border-primary/30 bg-primary/10 px-2 text-xs font-medium text-primary inline-flex items-center gap-1 hover:bg-primary/20 transition-colors"
        >
          <Share2 size={12} />
          Share
        </button>
      </div>
    </article>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function WealthProductsCard() {
  const [activeAdvisoryTab, setActiveAdvisoryTab] = useState<AdvisoryTab>("fo");
  const [activeIpoTab, setActiveIpoTab] = useState<IpoTab>("open");
  const [activeMfTab, setActiveMfTab] = useState<MfTab>("topRated");
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [shareModalCalls, setShareModalCalls] = useState<AdvisoryCall[] | null>(
    null
  );

  const advisoryRows = ADVISORY_BY_TAB[activeAdvisoryTab];
  const ipoRows = activeIpoTab === "open" ? LIVE_IPOS : UPCOMING_IPOS;
  const mfRows = MUTUAL_FUNDS[activeMfTab];

  function callKey(call: AdvisoryCall) {
    return `${call.symbol}::${call.source}`;
  }

  function toggleCall(call: AdvisoryCall) {
    const key = callKey(call);
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  function selectAll() {
    setSelectedKeys(new Set(advisoryRows.map(callKey)));
  }

  function clearAll() {
    setSelectedKeys(new Set());
  }

  const selectedCalls = advisoryRows.filter((c) =>
    selectedKeys.has(callKey(c))
  );

  return (
    <section className="min-w-0 overflow-hidden">
      <div className="px-3 sm:px-5 py-4 sm:py-5">
        <h2 className="flex items-center gap-2 border-l-[3px] border-primary pl-3 text-lg font-semibold text-foreground tracking-tight">
          <Landmark size={18} className="text-primary shrink-0" />
          Wealth Products
        </h2>
        <div className="mt-4 space-y-6">
          {/* ── Advisory ── */}
          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="text-[18px] font-semibold text-foreground tracking-tight">
                Advisory
              </div>
              {/* Bulk share button */}
              {selectedCalls.length > 0 ? (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setShareModalCalls(selectedCalls)}
                    className="h-7 rounded-md bg-primary px-3 text-xs font-semibold text-white inline-flex items-center gap-1.5 hover:bg-primary/90 transition-colors"
                  >
                    <Share2 size={12} />
                    Share {selectedCalls.length} selected
                  </button>
                </div>
              ) : advisoryRows.length > 0 ? (
                <button
                  type="button"
                  onClick={selectAll}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors shrink-0"
                >
                  Select all
                </button>
              ) : null}
            </div>

            {/* Tab pills */}
            <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1">
              {ADVISORY_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveAdvisoryTab(tab.id);
                    setSelectedKeys(new Set());
                  }}
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

            {/* Cards — horizontal scroll */}
            {advisoryRows.length === 0 ? (
              <div className="rounded-md border border-dashed border-border p-6 text-sm text-muted-foreground">
                No advisory calls available in this category.
              </div>
            ) : (
              <div className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory -mx-1 px-1">
                {advisoryRows.map((call) => (
                  <AdvisoryCard
                    key={callKey(call)}
                    call={call}
                    selected={selectedKeys.has(callKey(call))}
                    onToggle={() => toggleCall(call)}
                    onShareSingle={() => setShareModalCalls([call])}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── IPO Overview ── */}
          <div>
            <div className="mb-3 text-[18px] font-semibold text-foreground tracking-tight">
              IPO Overview
            </div>
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
                    <div className="text-xs font-semibold text-muted-foreground">
                      Name
                    </div>
                    <div className="text-xs font-semibold text-muted-foreground text-right">
                      Open/Close
                    </div>
                    <div className="text-xs font-semibold text-muted-foreground text-right">
                      Issue Size
                    </div>
                    <div className="text-xs font-semibold text-muted-foreground text-right">
                      Price Range
                    </div>
                    <div className="text-xs font-semibold text-muted-foreground text-right">
                      Subscription
                    </div>
                    <div className="text-xs font-semibold text-muted-foreground text-right">
                      Actions
                    </div>
                  </div>

                  <div className="max-h-[240px] overflow-y-auto">
                    {ipoRows.map((row) => (
                      <div
                        key={row.name}
                        className="grid grid-cols-[minmax(180px,0.9fr)_180px_145px_145px_110px_200px] gap-x-2 px-3 py-2 border-b border-border last:border-b-0"
                      >
                        <div className="pr-2">
                          <div className="text-sm text-foreground truncate">
                            {row.name}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {row.marketType}
                          </div>
                        </div>
                        <div className="text-sm text-foreground text-right whitespace-nowrap">
                          {row.openClose}
                        </div>
                        <div className="text-sm text-foreground text-right whitespace-nowrap">
                          {row.issueSize}
                        </div>
                        <div className="text-sm text-foreground text-right whitespace-nowrap">
                          {row.priceRange}
                        </div>
                        <div className="text-sm text-foreground text-right whitespace-nowrap">
                          {row.subscription}
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={UPSTOX_IPO_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-7 items-center justify-center rounded-md border border-primary px-2.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/5 whitespace-nowrap"
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

          {/* ── Mutual Funds ── */}
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
                          <div className="text-sm text-foreground truncate">
                            {row.name}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {row.amc} • {row.category}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          1Y Return
                        </div>
                        <div className="text-sm text-foreground">
                          {row.return1Y}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          3Y CAGR
                        </div>
                        <div className="text-sm text-foreground">
                          {row.return3Y}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          TER
                        </div>
                        <div className="text-sm text-foreground">
                          {row.expenseRatio}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          Risk
                        </div>
                        <span
                          className={`inline-flex h-6 items-center rounded-full border px-2 text-xs ${riskPillClass(
                            row.risk
                          )}`}
                        >
                          {row.risk}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          AUM
                        </div>
                        <div className="text-sm text-foreground">
                          {row.aum}
                        </div>
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
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {shareModalCalls && (
        <ShareModal
          calls={shareModalCalls}
          onClose={() => setShareModalCalls(null)}
        />
      )}
    </section>
  );
}
