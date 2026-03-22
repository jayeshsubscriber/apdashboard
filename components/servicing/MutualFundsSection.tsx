"use client";

import { useState, useMemo } from "react";
import { Share2, TrendingUp, Search, X, MessageCircle, Pencil, ChevronDown, ChevronUp, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { customerRows, type CustomerRow } from "@/components/customers/data";

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

// ── Share Modal (reused from TrendingSection pattern) ────────────────────────

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
    if (editableMessage.startsWith("Hi ")) return editableMessage;
    return editableMessage.replace(/^(📊)/, `Hi ${firstName},\n\n$1`);
  }

  function whatsAppUrl(phone: string, customerName: string) {
    return `https://wa.me/${phone}?text=${encodeURIComponent(personaliseMessage(customerName))}`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-xl border border-border bg-card shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-start justify-between p-5 border-b border-border shrink-0">
          <div>
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="shrink-0 border-b border-border">
          <button type="button" onClick={() => setPreviewExpanded(!previewExpanded)} className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-2">
              <MessageCircle size={14} className="text-[#25D366]" />
              <span className="text-xs font-semibold text-foreground">Message Preview</span>
            </div>
            <div className="flex items-center gap-2">
              {!previewExpanded && <span className="text-[10px] text-muted-foreground">Click to expand</span>}
              {previewExpanded ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
            </div>
          </button>
          {previewExpanded && (
            <div className="px-4 pb-3">
              <div className="relative rounded-lg border border-border bg-[#F8F9FA] overflow-hidden">
                <div className="p-3">
                  {isEditing ? (
                    <textarea value={editableMessage} onChange={(e) => setEditableMessage(e.target.value)} className="w-full min-h-[120px] text-xs leading-relaxed text-[#262626] bg-white border border-border rounded-md p-2.5 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 resize-y font-mono" autoFocus />
                  ) : (
                    <div className="text-xs leading-relaxed text-[#262626] whitespace-pre-wrap bg-white rounded-lg p-2.5 shadow-sm border border-[#E8E8E8]">{editableMessage}</div>
                  )}
                </div>
                <div className="flex items-center justify-between px-3 py-2 bg-[#F0F0F0] border-t border-border">
                  {isEditing ? (
                    <>
                      <button type="button" onClick={() => { setEditableMessage(message); setIsEditing(false); }} className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">Reset to default</button>
                      <button type="button" onClick={() => setIsEditing(false)} className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-medium text-white bg-primary hover:bg-primary/90 transition-colors">Done</button>
                    </>
                  ) : (
                    <>
                      <span className="text-[10px] text-muted-foreground">This message will be sent via WhatsApp</span>
                      <button type="button" onClick={() => setIsEditing(true)} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium text-primary border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors">
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

        <div className="flex shrink-0 border-b border-border">
          <button type="button" onClick={() => setTab("segments")} className={`flex-1 py-2.5 text-xs font-medium transition-colors ${tab === "segments" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}>Business Opportunities</button>
          <button type="button" onClick={() => setTab("customers")} className={`flex-1 py-2.5 text-xs font-medium transition-colors ${tab === "customers" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}>All Customers</button>
        </div>

        <div className="flex flex-col min-h-0 flex-1 overflow-hidden">
          {tab === "segments" && (
            <div className="shrink-0 p-3 border-b border-border">
              <div className="flex flex-wrap gap-2">
                {BUSINESS_SEGMENTS.map((seg) => (
                  <button key={seg.id} type="button" onClick={() => setActiveSegment(seg.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${activeSegment === seg.id ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"}`}>
                    {seg.label}
                    <span className={`rounded-full px-1.5 py-px text-[10px] ${activeSegment === seg.id ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}>{customerRows.filter(seg.filter).length}</span>
                  </button>
                ))}
              </div>
              {activeSegment !== "all" && <p className="mt-2 text-xs text-muted-foreground">{BUSINESS_SEGMENTS.find((s) => s.id === activeSegment)?.description}</p>}
            </div>
          )}

          <div className="shrink-0 px-3 py-2 border-b border-border">
            <div className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-2.5 h-8">
              <Search size={13} className="text-muted-foreground shrink-0" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or UCC…" className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground text-foreground" />
              {search && <button type="button" onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground"><X size={12} /></button>}
            </div>
          </div>

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

        <div className="shrink-0 border-t border-border px-5 py-3 flex items-center justify-between bg-muted/20">
          <span className="text-xs text-muted-foreground">{displayedCustomers.length} customer{displayedCustomers.length !== 1 ? "s" : ""} shown</span>
          <button type="button" onClick={onClose} className="h-8 rounded-md border border-border px-3 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
}

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
        <ShareModal
          title={shareModal.name === "selected" ? `Share Mutual Funds${selected.size > 0 ? ` (${selected.size})` : ""}` : `Share ${shareModal.name}`}
          subtitle={`Select customers to send via WhatsApp`}
          message={shareModal.message}
          onClose={() => setShareModal(null)}
        />
      )}
    </>
  );
}
