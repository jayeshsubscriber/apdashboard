"use client";

import { useState, useMemo } from "react";
import { Share2, TrendingUp, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { ServicingShareModal } from "./ServicingShareModal";

// ── Types ────────────────────────────────────────────────────────────────────

interface MutualFund {
  name: string;
  amc: string;
  amcLogo: string;
  amcColor: string;
  planType: string;
  growthType: string;
  category: string;
  subcategory: string;
  tags: string[];
  aum: string;
  risk: "High" | "Moderate" | "Low";
  ter: number;
  return1Y: number;
  return3Y: number;
  trailCommission: number;
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const MUTUAL_FUNDS: MutualFund[] = [
  // Popular / Equity
  { name: "Parag Parikh Flexi Cap Fund", amc: "PPFAS", amcLogo: "PP", amcColor: "#1B4F72", planType: "Regular", growthType: "Growth", category: "Equity", subcategory: "Flexi Cap", tags: ["Popular", "Equity"], aum: "₹62,450 Cr", risk: "High", ter: 1.33, return1Y: 22.45, return3Y: 18.72, trailCommission: 0.55 },
  { name: "HDFC Mid-Cap Opportunities Fund", amc: "HDFC", amcLogo: "HD", amcColor: "#004B87", planType: "Regular", growthType: "Growth", category: "Equity", subcategory: "Mid Cap", tags: ["Popular", "Equity"], aum: "₹48,920 Cr", risk: "High", ter: 1.52, return1Y: 28.30, return3Y: 24.15, trailCommission: 0.70 },
  { name: "ICICI Pru Bluechip Fund", amc: "ICICI", amcLogo: "IC", amcColor: "#F58220", planType: "Regular", growthType: "Growth", category: "Equity", subcategory: "Large Cap", tags: ["Popular", "Equity"], aum: "₹51,340 Cr", risk: "Moderate", ter: 1.41, return1Y: 16.82, return3Y: 15.45, trailCommission: 0.50 },
  { name: "SBI Small Cap Fund", amc: "SBI", amcLogo: "SB", amcColor: "#1A5BA3", planType: "Regular", growthType: "Growth", category: "Equity", subcategory: "Small Cap", tags: ["Popular", "Equity"], aum: "₹28,760 Cr", risk: "High", ter: 1.62, return1Y: 32.15, return3Y: 27.80, trailCommission: 0.80 },
  { name: "Nippon India Large Cap Fund", amc: "Nippon", amcLogo: "NI", amcColor: "#C8102E", planType: "Regular", growthType: "Growth", category: "Equity", subcategory: "Large Cap", tags: ["Popular", "Equity"], aum: "₹25,670 Cr", risk: "Moderate", ter: 1.45, return1Y: 18.25, return3Y: 16.10, trailCommission: 0.55 },
  { name: "Motilal Oswal Midcap Fund", amc: "Motilal", amcLogo: "MO", amcColor: "#2D6A2E", planType: "Regular", growthType: "Growth", category: "Equity", subcategory: "Mid Cap", tags: ["Popular", "Equity"], aum: "₹15,890 Cr", risk: "High", ter: 1.58, return1Y: 35.40, return3Y: 26.55, trailCommission: 0.75 },
  { name: "Quant Small Cap Fund", amc: "Quant", amcLogo: "QU", amcColor: "#E65100", planType: "Regular", growthType: "Growth", category: "Equity", subcategory: "Small Cap", tags: ["Popular", "Equity"], aum: "₹22,340 Cr", risk: "High", ter: 1.78, return1Y: 38.20, return3Y: 30.45, trailCommission: 0.85 },
  // Index
  { name: "UTI Nifty 50 Index Fund", amc: "UTI", amcLogo: "UT", amcColor: "#0D47A1", planType: "Regular", growthType: "Growth", category: "Index", subcategory: "Large Cap Index", tags: ["Index"], aum: "₹18,450 Cr", risk: "Moderate", ter: 0.30, return1Y: 14.85, return3Y: 13.20, trailCommission: 0.08 },
  { name: "HDFC Index Fund - Sensex Plan", amc: "HDFC", amcLogo: "HD", amcColor: "#004B87", planType: "Regular", growthType: "Growth", category: "Index", subcategory: "Large Cap Index", tags: ["Index"], aum: "₹12,780 Cr", risk: "Moderate", ter: 0.30, return1Y: 14.50, return3Y: 13.05, trailCommission: 0.07 },
  { name: "Motilal Oswal Nifty Midcap 150 Index", amc: "Motilal", amcLogo: "MO", amcColor: "#2D6A2E", planType: "Regular", growthType: "Growth", category: "Index", subcategory: "Mid Cap Index", tags: ["Index"], aum: "₹8,920 Cr", risk: "High", ter: 0.38, return1Y: 26.40, return3Y: 22.15, trailCommission: 0.10 },
  // ELSS
  { name: "Axis Long Term Equity Fund", amc: "Axis", amcLogo: "AX", amcColor: "#6B1D5E", planType: "Regular", growthType: "Growth", category: "ELSS", subcategory: "ELSS (Tax Saver)", tags: ["ELSS", "Equity"], aum: "₹32,150 Cr", risk: "Moderate", ter: 1.48, return1Y: 19.30, return3Y: 16.80, trailCommission: 0.65 },
  { name: "Mirae Asset Tax Saver Fund", amc: "Mirae", amcLogo: "MA", amcColor: "#003366", planType: "Regular", growthType: "Growth", category: "ELSS", subcategory: "ELSS (Tax Saver)", tags: ["ELSS", "Equity"], aum: "₹21,480 Cr", risk: "High", ter: 1.52, return1Y: 24.60, return3Y: 20.35, trailCommission: 0.70 },
  { name: "Quant Tax Plan", amc: "Quant", amcLogo: "QU", amcColor: "#E65100", planType: "Regular", growthType: "Growth", category: "ELSS", subcategory: "ELSS (Tax Saver)", tags: ["ELSS", "Equity"], aum: "₹8,760 Cr", risk: "High", ter: 1.75, return1Y: 36.50, return3Y: 28.90, trailCommission: 0.80 },
  // Hybrid
  { name: "Kotak Equity Hybrid Fund", amc: "Kotak", amcLogo: "KO", amcColor: "#ED1C24", planType: "Regular", growthType: "Growth", category: "Hybrid", subcategory: "Aggressive Hybrid", tags: ["Hybrid"], aum: "₹22,180 Cr", risk: "Moderate", ter: 1.28, return1Y: 14.60, return3Y: 13.92, trailCommission: 0.60 },
  { name: "ICICI Pru Equity & Debt Fund", amc: "ICICI", amcLogo: "IC", amcColor: "#F58220", planType: "Regular", growthType: "Growth", category: "Hybrid", subcategory: "Aggressive Hybrid", tags: ["Hybrid"], aum: "₹35,240 Cr", risk: "Moderate", ter: 1.38, return1Y: 16.20, return3Y: 15.10, trailCommission: 0.55 },
  { name: "SBI Equity Hybrid Fund", amc: "SBI", amcLogo: "SB", amcColor: "#1A5BA3", planType: "Regular", growthType: "Growth", category: "Hybrid", subcategory: "Aggressive Hybrid", tags: ["Hybrid"], aum: "₹68,920 Cr", risk: "Moderate", ter: 1.35, return1Y: 15.80, return3Y: 14.50, trailCommission: 0.58 },
  { name: "HDFC Balanced Advantage Fund", amc: "HDFC", amcLogo: "HD", amcColor: "#004B87", planType: "Regular", growthType: "Growth", category: "Hybrid", subcategory: "Balanced Advantage", tags: ["Popular", "Hybrid"], aum: "₹72,350 Cr", risk: "Moderate", ter: 1.42, return1Y: 13.90, return3Y: 14.20, trailCommission: 0.55 },
  // Debt
  { name: "Axis Liquid Fund", amc: "Axis", amcLogo: "AX", amcColor: "#6B1D5E", planType: "Regular", growthType: "Growth", category: "Debt", subcategory: "Liquid", tags: ["Debt"], aum: "₹38,540 Cr", risk: "Low", ter: 0.20, return1Y: 7.12, return3Y: 6.45, trailCommission: 0.10 },
  { name: "HDFC Short Term Debt Fund", amc: "HDFC", amcLogo: "HD", amcColor: "#004B87", planType: "Regular", growthType: "Growth", category: "Debt", subcategory: "Short Duration", tags: ["Debt"], aum: "₹24,680 Cr", risk: "Low", ter: 0.58, return1Y: 7.85, return3Y: 7.10, trailCommission: 0.18 },
  { name: "ICICI Pru Corporate Bond Fund", amc: "ICICI", amcLogo: "IC", amcColor: "#F58220", planType: "Regular", growthType: "Growth", category: "Debt", subcategory: "Corporate Bond", tags: ["Debt"], aum: "₹28,120 Cr", risk: "Low", ter: 0.52, return1Y: 7.65, return3Y: 6.90, trailCommission: 0.15 },
];

const CATEGORY_TABS = ["Popular", "Index", "ELSS", "Equity", "Hybrid", "Debt"];

type SortField = "return1Y" | "return3Y" | "trailCommission" | "aum" | "ter";
type SortDir = "asc" | "desc";

// ── Helpers ──────────────────────────────────────────────────────────────────

// ── Sortable column header ───────────────────────────────────────────────────

function SortHeader({
  label,
  field,
  sortField,
  sortDir,
  onSort,
}: {
  label: string;
  field: SortField;
  sortField: SortField | null;
  sortDir: SortDir;
  onSort: (f: SortField) => void;
}) {
  const active = sortField === field;
  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      className="inline-flex items-center gap-0.5 text-[11px] font-medium text-[#777] hover:text-[#262626] transition-colors"
    >
      {label}
      {active ? (
        sortDir === "asc" ? <ArrowUp size={10} /> : <ArrowDown size={10} />
      ) : (
        <ArrowUpDown size={10} className="opacity-40" />
      )}
    </button>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export function MutualFundsSection() {
  const [activeCategory, setActiveCategory] = useState("Popular");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [shareModal, setShareModal] = useState<{ name: string; message: string } | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggleSelect(name: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  }

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  }

  const filtered = useMemo(() => {
    let list = MUTUAL_FUNDS;
    if (activeCategory !== "Popular") {
      list = list.filter((f) => f.tags.includes(activeCategory));
    } else {
      list = list.filter((f) => f.tags.includes("Popular"));
    }
    if (sortField) {
      list = [...list].sort((a, b) => {
        let aVal: number, bVal: number;
        if (sortField === "aum") {
          aVal = parseFloat(a.aum.replace(/[₹,Cr\s]/g, ""));
          bVal = parseFloat(b.aum.replace(/[₹,Cr\s]/g, ""));
        } else {
          aVal = a[sortField];
          bVal = b[sortField];
        }
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      });
    }
    return list;
  }, [activeCategory, sortField, sortDir]);

  function buildFundMessage(fund: MutualFund) {
    return `📊 *${fund.name}*\n${fund.subcategory} · ${fund.risk} Risk\n\n1Y: +${fund.return1Y}% | 3Y: +${fund.return3Y}%\nAUM: ${fund.aum}\n\n💰 Invest via Upstox:\nhttps://upstox.com/mutual-funds/`;
  }

  function buildSelectedFundsMessage() {
    const items = selected.size > 0 ? filtered.filter((f) => selected.has(f.name)) : filtered;
    const lines = items.map((f) => `• *${f.name}*\n  ${f.subcategory} | 1Y: +${f.return1Y}% | 3Y: +${f.return3Y}%`).join("\n\n");
    return `📊 Top Mutual Funds\n\n${lines}\n\n💰 Invest via Upstox:\nhttps://upstox.com/mutual-funds/`;
  }

  return (
    <>
      <div className="px-4 py-6">
        <div className="bg-white rounded-lg border border-[#F1F1F1] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 flex items-center justify-center">
                <TrendingUp size={18} className="text-primary" />
              </div>
              <span className="text-base font-semibold text-[#262626]">Mutual Funds</span>
            </div>
            <button
              type="button"
              onClick={() => setShareModal({ name: "selected", message: buildSelectedFundsMessage() })}
              className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <Share2 size={14} />
              Share{selected.size > 0 ? ` (${selected.size})` : ""}
            </button>
          </div>

          {/* Category pills */}
          <div className="px-5 pb-4 flex items-center gap-2 flex-wrap">
            {CATEGORY_TABS.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => { setActiveCategory(cat); setSelected(new Set()); }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
                  activeCategory === cat
                    ? "bg-[#FBF8FD] border-primary text-primary"
                    : "bg-white border-[#E1E1E1] text-[#262626] hover:border-[#ABABAB]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {/* Table header */}
            <div className="min-w-[900px] grid grid-cols-[2.5fr_1fr_0.9fr_0.7fr_0.6fr_0.8fr_0.8fr_28px_auto] items-center px-4 py-2.5 border-t border-b border-[#ABABAB] bg-white gap-x-2">
              <span className="text-[11px] font-medium text-[#777]">Fund Name</span>
              <span className="text-[11px] font-medium text-[#777]">Category</span>
              <span className="text-right">
                <SortHeader label="AUM" field="aum" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              </span>
              <span className="text-center text-[11px] font-medium text-[#777]">Risk</span>
              <span className="text-right">
                <SortHeader label="TER" field="ter" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              </span>
              <span className="text-right">
                <SortHeader label="1Y Return" field="return1Y" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              </span>
              <span className="text-right">
                <SortHeader label="3Y Return" field="return3Y" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              </span>
              <span />
              <span className="w-[72px]" />
            </div>

            {/* Rows */}
            <div className="min-w-[900px]">
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">No funds in this category.</div>
              ) : (
                filtered.map((fund, i) => (
                  <div
                    key={fund.name}
                    onClick={() => toggleSelect(fund.name)}
                    className={`grid grid-cols-[2.5fr_1fr_0.9fr_0.7fr_0.6fr_0.8fr_0.8fr_28px_auto] items-center px-4 py-3 gap-x-2 cursor-pointer ${
                      i < filtered.length - 1 ? "border-b border-[#F1F1F1]" : ""
                    } ${selected.has(fund.name) ? "bg-[#FBF8FD]" : "hover:bg-[#FAFAFA]"} transition-colors`}
                  >
                    {/* Fund name + AMC logo */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-[10px] font-bold text-white"
                        style={{ backgroundColor: fund.amcColor }}
                      >
                        {fund.amcLogo}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-[#262626] truncate">{fund.name}</div>
                        <div className="text-[11px] text-[#777] mt-0.5">{fund.planType} · {fund.growthType}</div>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="text-xs text-[#555]">{fund.subcategory}</div>

                    {/* AUM */}
                    <div className="text-right text-xs font-medium text-[#262626]">{fund.aum}</div>

                    {/* Risk */}
                    <div className="text-center text-xs text-[#555]">{fund.risk}</div>

                    {/* TER */}
                    <div className="text-right text-xs text-[#262626]">{fund.ter}%</div>

                    {/* 1Y Return */}
                    <div className="text-right">
                      <span className={`text-xs font-medium ${fund.return1Y >= 0 ? "text-[#008858]" : "text-[#EB5B3C]"}`}>
                        {fund.return1Y >= 0 ? "+" : ""}{fund.return1Y}%
                      </span>
                    </div>

                    {/* 3Y Return */}
                    <div className="text-right">
                      <span className={`text-xs font-medium ${fund.return3Y >= 0 ? "text-[#008858]" : "text-[#EB5B3C]"}`}>
                        {fund.return3Y >= 0 ? "+" : ""}{fund.return3Y}%
                      </span>
                    </div>

                    {/* Checkbox */}
                    <div className="flex justify-center">
                      <input
                        type="checkbox"
                        checked={selected.has(fund.name)}
                        onChange={() => toggleSelect(fund.name)}
                        className="h-3.5 w-3.5 rounded border-[#ABABAB] text-primary accent-[#542087] cursor-pointer"
                      />
                    </div>

                    {/* Share CTA */}
                    <div className="w-[72px] flex justify-end">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setShareModal({ name: fund.name, message: buildFundMessage(fund) }); }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium text-primary border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors"
                      >
                        <Share2 size={11} />
                        Share
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {shareModal && (
        <ServicingShareModal
          title={shareModal.name === "selected" ? `Share Mutual Funds${selected.size > 0 ? ` (${selected.size})` : ""}` : `Share ${shareModal.name}`}
          subtitle={`Select customers to send via WhatsApp`}
          message={shareModal.message}
          onClose={() => setShareModal(null)}
        />
      )}
    </>
  );
}
