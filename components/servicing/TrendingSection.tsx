"use client";

import { useState } from "react";
import { Flame, Share2, TrendingUp, ChevronDown } from "lucide-react";
import { ServicingShareModal } from "./ServicingShareModal";

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
        <ServicingShareModal
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
        <ServicingShareModal
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
