"use client";

import { useState, useMemo } from "react";
import { Flame, Share2, TrendingUp, ChevronDown, ChevronUp, Search, X, MessageCircle, Pencil } from "lucide-react";
import { customerRows, type CustomerRow } from "@/components/customers/data";

// ── Mock Data ────────────────────────────────────────────────────────────────

interface TrendingStock {
  symbol: string;
  exchange: string;
  tag?: string;
  ltp: number;
  change: number;
  changePct: number;
  volume: string;
}

interface TrendingOption {
  symbol: string;
  exchange: string;
  tag?: string;
  ltp: number;
  change: number;
  changePct: number;
  oi: number;
  oiChangePct: number;
}

const TRENDING_STOCKS: Record<string, TrendingStock[]> = {
  "Most Traded": [
    { symbol: "RELIANCE", exchange: "NSE", ltp: 2945.30, change: 42.15, changePct: 1.45, volume: "18.2L" },
    { symbol: "TCS", exchange: "NSE", ltp: 3812.50, change: -28.60, changePct: -0.74, volume: "8.7L" },
    { symbol: "HDFCBANK", exchange: "NSE", ltp: 1685.20, change: 22.40, changePct: 1.35, volume: "15.4L" },
    { symbol: "INFY", exchange: "NSE", ltp: 1542.80, change: 15.30, changePct: 1.00, volume: "12.1L" },
  ],
  "In News": [
    { symbol: "ADANIENT", exchange: "NSE", tag: "News", ltp: 2380.70, change: 85.20, changePct: 3.71, volume: "22.5L" },
    { symbol: "TATAMOTORS", exchange: "NSE", tag: "News", ltp: 725.40, change: -18.30, changePct: -2.46, volume: "28.9L" },
    { symbol: "ZOMATO", exchange: "NSE", tag: "News", ltp: 215.60, change: 8.90, changePct: 4.31, volume: "45.2L" },
    { symbol: "PAYTM", exchange: "NSE", tag: "News", ltp: 842.10, change: 32.50, changePct: 4.01, volume: "19.8L" },
  ],
  "Intraday": [
    { symbol: "SBIN", exchange: "NSE", ltp: 812.50, change: 18.70, changePct: 2.35, volume: "32.1L" },
    { symbol: "ICICIBANK", exchange: "NSE", ltp: 1125.40, change: -8.20, changePct: -0.72, volume: "14.5L" },
    { symbol: "BAJFINANCE", exchange: "NSE", ltp: 7245.80, change: 125.30, changePct: 1.76, volume: "5.2L" },
    { symbol: "MARUTI", exchange: "NSE", ltp: 12450.60, change: -210.40, changePct: -1.66, volume: "2.1L" },
  ],
  "Volume Shockers": [
    { symbol: "YESBANK", exchange: "NSE", tag: "Vol ↑", ltp: 24.80, change: 3.60, changePct: 16.98, volume: "85.4L" },
    { symbol: "IRFC", exchange: "NSE", tag: "Vol ↑", ltp: 142.30, change: 12.40, changePct: 9.55, volume: "62.7L" },
    { symbol: "SUZLON", exchange: "NSE", tag: "Vol ↑", ltp: 48.90, change: 5.70, changePct: 13.19, volume: "71.2L" },
    { symbol: "IDEA", exchange: "NSE", tag: "Vol ↑", ltp: 14.25, change: 1.85, changePct: 14.92, volume: "92.1L" },
  ],
};

const TRENDING_OPTIONS: Record<string, TrendingOption[]> = {
  Call: [
    { symbol: "NIFTY 25000CE", exchange: "NFO", tag: "ATM", ltp: 53.90, change: 30.50, changePct: 12.50, oi: 53.51, oiChangePct: 354.19 },
    { symbol: "NIFTY 24900CE", exchange: "NFO", tag: "ITM", ltp: 128.40, change: 42.20, changePct: 8.30, oi: 42.18, oiChangePct: 128.50 },
    { symbol: "NIFTY 25100CE", exchange: "NFO", ltp: 22.30, change: 15.80, changePct: 18.40, oi: 68.92, oiChangePct: 215.30 },
    { symbol: "NIFTY 25200CE", exchange: "NFO", ltp: 8.50, change: 5.20, changePct: 24.10, oi: 35.47, oiChangePct: 180.20 },
  ],
  Put: [
    { symbol: "NIFTY 25000PE", exchange: "NFO", tag: "ATM", ltp: 62.10, change: -22.40, changePct: -26.52, oi: 48.73, oiChangePct: 225.40 },
    { symbol: "NIFTY 24900PE", exchange: "NFO", ltp: 35.80, change: -18.60, changePct: -34.19, oi: 55.12, oiChangePct: 310.80 },
    { symbol: "NIFTY 24800PE", exchange: "NFO", tag: "OTM", ltp: 15.20, change: -8.90, changePct: -36.93, oi: 72.45, oiChangePct: 185.60 },
    { symbol: "NIFTY 25100PE", exchange: "NFO", ltp: 102.50, change: -35.70, changePct: -25.83, oi: 28.96, oiChangePct: 142.30 },
  ],
};

// ── Share Modal (reusable) ───────────────────────────────────────────────────

const CUSTOMER_PHONES: Record<string, string> = {
  SHJV1174: "919876543210", M61747471: "919876543211", AAA6180438: "919876543212",
  PDBS8182: "919876543213", SHJV1721: "919876543214", SHJV1313: "919876543215",
  SHJV2008: "919876543216", SHJV2009: "919876543217", SHJV2010: "919876543218",
  SHJV2011: "919876543219", SHJV2012: "919876543220", SHJV2013: "919876543221",
};

const BUSINESS_SEGMENTS = [
  { id: "all", label: "All Clients", description: "All 1,870 registered clients", filter: (_c: CustomerRow) => true },
  { id: "top5", label: "Top 5% Clients", description: "High-value clients by AUM & revenue", filter: (c: CustomerRow) => c.suggestedActions.includes("Top 5% client") },
  { id: "lapse", label: "Likely to Lapse", description: "Clients showing disengagement signals", filter: (c: CustomerRow) => c.suggestedActions.includes("Likely to lapse") },
  { id: "fo_loss", label: "High F&O Losses", description: "Clients with significant F&O drawdown", filter: (c: CustomerRow) => c.suggestedActions.includes("High F&O Losses") },
];

type ShareModalTab = "segments" | "customers";

function ShareModal({
  title,
  subtitle,
  message,
  onClose,
}: {
  title: string;
  subtitle: string;
  message: string;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<ShareModalTab>("segments");
  const [activeSegment, setActiveSegment] = useState("all");
  const [search, setSearch] = useState("");
  const [editableMessage, setEditableMessage] = useState(message);
  const [isEditing, setIsEditing] = useState(false);
  const [previewExpanded, setPreviewExpanded] = useState(true);

  const filteredBySegment = useMemo(() => {
    const seg = BUSINESS_SEGMENTS.find((s) => s.id === activeSegment);
    return seg ? customerRows.filter(seg.filter) : customerRows;
  }, [activeSegment]);

  const displayedCustomers = useMemo(() => {
    const base = tab === "segments" ? filteredBySegment : customerRows;
    if (!search.trim()) return base;
    const q = search.toLowerCase();
    return base.filter((c) => c.name.toLowerCase().includes(q) || c.ucc.toLowerCase().includes(q));
  }, [tab, filteredBySegment, search]);

  function personaliseMessage(customerName: string) {
    const firstName = customerName.split(" ")[0];
    // Replace the generic "Hi" greeting or prepend the name
    if (editableMessage.startsWith("Hi ")) {
      return editableMessage;
    }
    return editableMessage.replace(/^(🔥)/, `Hi ${firstName},\n\n$1`);
  }

  function whatsAppUrl(phone: string, customerName: string) {
    return `https://wa.me/${phone}?text=${encodeURIComponent(personaliseMessage(customerName))}`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-xl border border-border bg-card shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-border shrink-0">
          <div>
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Message Preview */}
        <div className="shrink-0 border-b border-border">
          <button
            type="button"
            onClick={() => setPreviewExpanded(!previewExpanded)}
            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <MessageCircle size={14} className="text-[#25D366]" />
              <span className="text-xs font-semibold text-foreground">Message Preview</span>
            </div>
            <div className="flex items-center gap-2">
              {!previewExpanded && (
                <span className="text-[10px] text-muted-foreground">Click to expand</span>
              )}
              {previewExpanded ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
            </div>
          </button>

          {previewExpanded && (
            <div className="px-4 pb-3">
              <div className="relative rounded-lg border border-border bg-[#F8F9FA] overflow-hidden">
                {/* WhatsApp-style chat bubble */}
                <div className="p-3">
                  {isEditing ? (
                    <textarea
                      value={editableMessage}
                      onChange={(e) => setEditableMessage(e.target.value)}
                      className="w-full min-h-[120px] text-xs leading-relaxed text-[#262626] bg-white border border-border rounded-md p-2.5 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 resize-y font-mono"
                      autoFocus
                    />
                  ) : (
                    <div className="text-xs leading-relaxed text-[#262626] whitespace-pre-wrap bg-white rounded-lg p-2.5 shadow-sm border border-[#E8E8E8]">
                      {editableMessage}
                    </div>
                  )}
                </div>

                {/* Edit / Done bar */}
                <div className="flex items-center justify-between px-3 py-2 bg-[#F0F0F0] border-t border-border">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={() => { setEditableMessage(message); setIsEditing(false); }}
                        className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Reset to default
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
                      >
                        Done
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-[10px] text-muted-foreground">This message will be sent via WhatsApp</span>
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium text-primary border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors"
                      >
                        <Pencil size={10} />
                        Edit message
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex shrink-0 border-b border-border">
          <button type="button" onClick={() => setTab("segments")} className={`flex-1 py-2.5 text-xs font-medium transition-colors ${tab === "segments" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}>
            Business Opportunities
          </button>
          <button type="button" onClick={() => setTab("customers")} className={`flex-1 py-2.5 text-xs font-medium transition-colors ${tab === "customers" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}>
            All Customers
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col min-h-0 flex-1 overflow-hidden">
          {tab === "segments" && (
            <div className="shrink-0 p-3 border-b border-border">
              <div className="flex flex-wrap gap-2">
                {BUSINESS_SEGMENTS.map((seg) => (
                  <button key={seg.id} type="button" onClick={() => setActiveSegment(seg.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${activeSegment === seg.id ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"}`}>
                    {seg.label}
                    <span className={`rounded-full px-1.5 py-px text-[10px] ${activeSegment === seg.id ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}>
                      {customerRows.filter(seg.filter).length}
                    </span>
                  </button>
                ))}
              </div>
              {activeSegment !== "all" && (
                <p className="mt-2 text-xs text-muted-foreground">{BUSINESS_SEGMENTS.find((s) => s.id === activeSegment)?.description}</p>
              )}
            </div>
          )}

          {/* Search */}
          <div className="shrink-0 px-3 py-2 border-b border-border">
            <div className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-2.5 h-8">
              <Search size={13} className="text-muted-foreground shrink-0" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or UCC…" className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground text-foreground" />
              {search && <button type="button" onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground"><X size={12} /></button>}
            </div>
          </div>

          {/* Customer list */}
          <div className="flex-1 overflow-y-auto">
            {displayedCustomers.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">No customers found.</div>
            ) : (
              <div className="divide-y divide-border">
                {displayedCustomers.map((customer) => {
                  const phone = CUSTOMER_PHONES[customer.ucc] ?? "919999999999";
                  const waUrl = whatsAppUrl(phone, customer.name);
                  return (
                    <div key={customer.ucc} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                      <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                        {customer.name.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">{customer.name}</div>
                        <div className="text-xs text-muted-foreground">{customer.ucc}</div>
                      </div>
                      <div className="hidden sm:flex items-center gap-1 shrink-0">
                        {customer.suggestedActions.slice(0, 1).map((action) => (
                          <span key={action} className={`rounded-full px-2 py-0.5 text-[10px] font-medium border ${action === "Top 5% client" ? "bg-violet-50 text-violet-700 border-violet-200" : action === "Likely to lapse" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-rose-50 text-rose-700 border-rose-200"}`}>
                            {action}
                          </span>
                        ))}
                      </div>
                      <a href={waUrl} target="_blank" rel="noreferrer" title={`Send to ${customer.name} on WhatsApp`}
                        className="shrink-0 h-8 w-8 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center text-[#25D366] hover:bg-[#25D366]/20 transition-colors">
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
          <span className="text-xs text-muted-foreground">{displayedCustomers.length} customer{displayedCustomers.length !== 1 ? "s" : ""} shown</span>
          <button type="button" onClick={onClose} className="h-8 rounded-md border border-border px-3 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
}

// ── Price formatter ──────────────────────────────────────────────────────────

function formatPrice(n: number) {
  return `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function changeColor(val: number) {
  return val >= 0 ? "text-[#008858]" : "text-[#EB5B3C]";
}

// ── Trending Stocks Widget ───────────────────────────────────────────────────

function TrendingStocksWidget() {
  const tabs = Object.keys(TRENDING_STOCKS);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [shareModal, setShareModal] = useState<{ symbol: string; message: string } | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const stocks = TRENDING_STOCKS[activeTab] ?? [];

  function toggleSelect(symbol: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(symbol)) next.delete(symbol); else next.add(symbol);
      return next;
    });
  }

  function buildStockMessage(stock: TrendingStock) {
    return `🔥 Trending Stock Alert!\n\n*${stock.symbol}* (${stock.exchange})\nLTP: ${formatPrice(stock.ltp)}\nChange: ${stock.change >= 0 ? "+" : ""}${stock.change.toFixed(2)} (${stock.changePct >= 0 ? "+" : ""}${stock.changePct.toFixed(2)}%)\nVolume: ${stock.volume}\n\n📈 Trade on Upstox:\nhttps://upstox.com/trade/`;
  }

  function buildSelectedStocksMessage() {
    const items = selected.size > 0 ? stocks.filter((s) => selected.has(s.symbol)) : stocks;
    const lines = items.map((s) => `• *${s.symbol}*: ${formatPrice(s.ltp)} (${s.changePct >= 0 ? "+" : ""}${s.changePct.toFixed(2)}%)`).join("\n");
    return `🔥 Trending ${activeTab} Stocks\n\n${lines}\n\n📈 Trade on Upstox:\nhttps://upstox.com/trade/`;
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-[#F1F1F1] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <TrendingUp size={18} className="text-primary" />
            </div>
            <span className="text-base font-semibold text-[#262626]">Trending stocks</span>
          </div>
          <button
            type="button"
            onClick={() => setShareModal({ symbol: "selected", message: buildSelectedStocksMessage() })}
            className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <Share2 size={14} />
            Share{selected.size > 0 ? ` (${selected.size})` : ""}
          </button>
        </div>

        {/* Pills */}
        <div className="px-4 pb-3 flex items-center gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => { setActiveTab(tab); setSelected(new Set()); }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
                activeTab === tab
                  ? "bg-[#FBF8FD] border-primary text-primary"
                  : "bg-white border-[#E1E1E1] text-[#262626] hover:border-[#ABABAB]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[1.2fr_1.5fr_1fr_28px_auto] items-center px-3 py-2.5 border-t border-b border-[#ABABAB] bg-white">
          <span className="text-xs font-medium text-[#777]">Stock</span>
          <span className="text-right text-xs font-medium text-[#777]">LTP</span>
          <span className="text-right text-xs font-medium text-[#777]">Volume</span>
          <span />
          <span className="w-[72px]" />
        </div>

        {/* Rows */}
        <div className="flex flex-col max-h-[240px] overflow-y-auto">
          {stocks.map((stock, i) => (
            <div key={stock.symbol} onClick={() => toggleSelect(stock.symbol)} className={`grid grid-cols-[1.2fr_1.5fr_1fr_28px_auto] items-center px-3 py-3 cursor-pointer ${i < stocks.length - 1 ? "border-b border-[#F1F1F1]" : ""} ${selected.has(stock.symbol) ? "bg-[#FBF8FD]" : "hover:bg-[#FAFAFA]"} transition-colors`}>
              {/* Stock info */}
              <div className="min-w-0">
                <div className="text-xs font-medium text-[#262626]">{stock.symbol}</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[11px] text-[#777]">{stock.exchange}</span>
                  {stock.tag && (
                    <span className="px-1 py-px text-[11px] font-medium text-[#777] bg-[#F1F1F1] rounded">{stock.tag}</span>
                  )}
                </div>
              </div>

              {/* LTP + change */}
              <div className="text-right">
                <div className={`text-xs font-medium ${changeColor(stock.change)}`}>{formatPrice(stock.ltp)}</div>
                <div className={`text-[11px] ${changeColor(stock.change)}`}>
                  {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)} ({stock.changePct >= 0 ? "+" : ""}{stock.changePct.toFixed(2)}%)
                </div>
              </div>

              {/* Volume */}
              <div className="text-right">
                <div className="text-xs font-medium text-[#262626]">{stock.volume}</div>
              </div>

              {/* Checkbox */}
              <div className="flex justify-center">
                <input
                  type="checkbox"
                  checked={selected.has(stock.symbol)}
                  onChange={() => toggleSelect(stock.symbol)}
                  className="h-3.5 w-3.5 rounded border-[#ABABAB] text-primary accent-[#542087] cursor-pointer"
                />
              </div>

              {/* Share CTA */}
              <div className="w-[72px] flex justify-end">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setShareModal({ symbol: stock.symbol, message: buildStockMessage(stock) }); }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium text-primary border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors"
                >
                  <Share2 size={11} />
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {shareModal && (
        <ShareModal
          title={shareModal.symbol === "selected" ? `Share Trending Stocks${selected.size > 0 ? ` (${selected.size})` : ""}` : `Share ${shareModal.symbol}`}
          subtitle={shareModal.symbol === "selected" ? `Sharing ${selected.size > 0 ? selected.size : stocks.length} trending stocks · Select customers to send via WhatsApp` : `Sharing ${shareModal.symbol} · Select customers to send via WhatsApp`}
          message={shareModal.message}
          onClose={() => setShareModal(null)}
        />
      )}
    </>
  );
}

// ── Trending Options Widget ──────────────────────────────────────────────────

function TrendingOptionsWidget() {
  const [index, setIndex] = useState("NIFTY50");
  const [expiry, setExpiry] = useState("Exp. today");
  const [optionType, setOptionType] = useState<"Call" | "Put">("Call");
  const [shareModal, setShareModal] = useState<{ symbol: string; message: string } | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const options = TRENDING_OPTIONS[optionType] ?? [];

  function toggleSelect(symbol: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(symbol)) next.delete(symbol); else next.add(symbol);
      return next;
    });
  }

  function buildOptionMessage(opt: TrendingOption) {
    return `🔥 Trending Option Alert!\n\n*${opt.symbol}* (${opt.exchange})\nLTP: ${formatPrice(opt.ltp)}\nChange: ${opt.change >= 0 ? "+" : ""}${opt.change.toFixed(2)} (${opt.changePct >= 0 ? "+" : ""}${opt.changePct.toFixed(2)}%)\nOI: ${opt.oi.toFixed(2)} Lakhs (${opt.oiChangePct >= 0 ? "+" : ""}${opt.oiChangePct.toFixed(2)}%)\n\n📈 Trade on Upstox:\nhttps://upstox.com/trade/`;
  }

  function buildSelectedOptionsMessage() {
    const items = selected.size > 0 ? options.filter((o) => selected.has(o.symbol)) : options;
    const lines = items.map((o) => `• *${o.symbol}*: ${formatPrice(o.ltp)} | OI: ${o.oi.toFixed(2)}L`).join("\n");
    return `🔥 Trending ${optionType} Options (${index})\n\n${lines}\n\n📈 Trade on Upstox:\nhttps://upstox.com/trade/`;
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-[#F1F1F1] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <Flame size={18} className="text-primary" />
            </div>
            <span className="text-base font-semibold text-[#262626]">Trending options</span>
          </div>
          <button
            type="button"
            onClick={() => setShareModal({ symbol: "selected", message: buildSelectedOptionsMessage() })}
            className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <Share2 size={14} />
            Share{selected.size > 0 ? ` (${selected.size})` : ""}
          </button>
        </div>

        {/* Filters: dropdowns + Call/Put pills */}
        <div className="px-4 pb-3 flex items-center gap-2 flex-wrap">
          {/* Index dropdown */}
          <div className="relative">
            <button type="button" className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-[#E1E1E1] bg-white text-xs font-semibold text-[#262626] hover:border-[#ABABAB] transition-colors">
              {index}
              <ChevronDown size={14} className="text-[#262626]" />
            </button>
          </div>

          {/* Expiry dropdown */}
          <div className="relative">
            <button type="button" className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-[#E1E1E1] bg-white text-xs font-semibold text-[#262626] hover:border-[#ABABAB] transition-colors">
              {expiry}
              <ChevronDown size={14} className="text-[#262626]" />
            </button>
          </div>

          {/* Separator */}
          <div className="w-px h-5 bg-[#F1F1F1]" />

          {/* Call / Put pills */}
          {(["Call", "Put"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => { setOptionType(type); setSelected(new Set()); }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
                optionType === type
                  ? "bg-[#FBF8FD] border-primary text-primary"
                  : "bg-white border-[#E1E1E1] text-[#262626] hover:border-[#ABABAB]"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[1.2fr_1.5fr_1fr_28px_auto] items-center px-3 py-2.5 border-t border-b border-[#ABABAB] bg-white">
          <span className="text-xs font-medium text-[#777]">Option</span>
          <span className="text-right text-xs font-medium text-[#777]">LTP</span>
          <span className="text-right text-xs font-medium text-[#777]">OI (Lakhs)</span>
          <span />
          <span className="w-[72px]" />
        </div>

        {/* Rows */}
        <div className="flex flex-col max-h-[240px] overflow-y-auto">
          {options.map((opt, i) => (
            <div key={opt.symbol} onClick={() => toggleSelect(opt.symbol)} className={`grid grid-cols-[1.2fr_1.5fr_1fr_28px_auto] items-center px-3 py-3 cursor-pointer ${i < options.length - 1 ? "border-b border-[#F1F1F1]" : ""} ${selected.has(opt.symbol) ? "bg-[#FBF8FD]" : "hover:bg-[#FAFAFA]"} transition-colors`}>
              {/* Option info */}
              <div className="min-w-0">
                <div className="text-xs font-medium text-[#262626]">{opt.symbol}</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[11px] text-[#777]">{opt.exchange}</span>
                  {opt.tag && (
                    <span className="px-1 py-px text-[11px] font-medium text-[#777] bg-[#F1F1F1] rounded">{opt.tag}</span>
                  )}
                </div>
              </div>

              {/* LTP + change */}
              <div className="text-right">
                <div className={`text-xs font-medium ${changeColor(opt.change)}`}>{formatPrice(opt.ltp)}</div>
                <div className={`text-[11px] ${changeColor(opt.change)}`}>
                  {opt.change >= 0 ? "+" : ""}{opt.change.toFixed(2)} ({opt.changePct >= 0 ? "+" : ""}{opt.changePct.toFixed(2)}%)
                </div>
              </div>

              {/* OI */}
              <div className="text-right">
                <div className="text-xs font-medium text-[#262626]">{opt.oi.toFixed(2)}</div>
                <div className={`text-[11px] ${changeColor(opt.oiChangePct)}`}>
                  +{opt.oiChangePct.toFixed(2)}%
                </div>
              </div>

              {/* Checkbox */}
              <div className="flex justify-center">
                <input
                  type="checkbox"
                  checked={selected.has(opt.symbol)}
                  onChange={() => toggleSelect(opt.symbol)}
                  className="h-3.5 w-3.5 rounded border-[#ABABAB] text-primary accent-[#542087] cursor-pointer"
                />
              </div>

              {/* Share CTA */}
              <div className="w-[72px] flex justify-end">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setShareModal({ symbol: opt.symbol, message: buildOptionMessage(opt) }); }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium text-primary border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors"
                >
                  <Share2 size={11} />
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {shareModal && (
        <ShareModal
          title={shareModal.symbol === "selected" ? `Share Trending Options${selected.size > 0 ? ` (${selected.size})` : ""}` : `Share ${shareModal.symbol}`}
          subtitle={shareModal.symbol === "selected" ? `Sharing ${selected.size > 0 ? selected.size : options.length} trending options · Select customers to send via WhatsApp` : `Sharing ${shareModal.symbol} · Select customers to send via WhatsApp`}
          message={shareModal.message}
          onClose={() => setShareModal(null)}
        />
      )}
    </>
  );
}

// ── Exported Section ─────────────────────────────────────────────────────────

export function TrendingSection() {
  return (
    <div className="px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TrendingStocksWidget />
        <TrendingOptionsWidget />
      </div>
    </div>
  );
}
