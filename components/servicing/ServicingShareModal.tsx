"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X, MessageCircle, ArrowLeft, RotateCcw, ChevronRight } from "lucide-react";
import { customerRows, type CustomerRow } from "@/components/customers/data";

/* ─── Data ──────────────────────────────────────────────────────────────── */

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
};

const BUSINESS_SEGMENTS = [
  {
    id: "all",
    label: "All Clients",
    description: "All registered clients",
    filter: () => true,
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
    filter: (c: CustomerRow) => c.suggestedActions.includes("High F&O Losses"),
  },
];

type MobileStep = "message" | "customers";

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#542087]/10 text-[11px] font-semibold text-[#542087] border border-[#542087]/15">
      {initials}
    </div>
  );
}

function SegmentBadge({ label }: { label: string }) {
  const colors: Record<string, string> = {
    "Top 5% client": "bg-[#542087]/8 text-[#542087] border-[#542087]/20",
    "Likely to lapse": "bg-amber-50 text-amber-700 border-amber-200",
    "High F&O Losses": "bg-red-50 text-red-600 border-red-200",
  };
  const cls = colors[label] ?? "bg-muted text-muted-foreground border-border";
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${cls}`}>
      {label}
    </span>
  );
}

/* ─── Message Panel ───────────────────────────────────────────────────────── */

function MessagePanel({
  message,
  editableMessage,
  onChange,
  onReset,
}: {
  message: string;
  editableMessage: string;
  onChange: (v: string) => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* WhatsApp header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#25D366]/10">
          <MessageCircle size={14} className="text-[#25D366]" />
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground">WhatsApp Message</p>
          <p className="text-[10px] text-muted-foreground">Edit directly — sent as-is to each customer</p>
        </div>
      </div>

      {/* Editable message area */}
      <div className="flex-1 flex flex-col px-5 py-4 gap-3 overflow-hidden">
        {/* Chat bubble background */}
        <div className="flex-1 rounded-xl bg-[#ECF8F1] border border-[#25D366]/20 p-3 flex flex-col gap-2 overflow-hidden">
          <textarea
            value={editableMessage}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 w-full resize-none bg-transparent text-[12.5px] leading-relaxed text-[#1a1a1a] outline-none font-[inherit] placeholder:text-[#25D366]/50 min-h-0"
            spellCheck={false}
          />
        </div>

        {/* Actions row */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onReset}
            disabled={editableMessage === message}
            className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <RotateCcw size={11} />
            Reset to default
          </button>
          <span className="text-[10px] text-muted-foreground">
            {editableMessage.length} chars
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Customers Panel ─────────────────────────────────────────────────────── */

function CustomersPanel({
  editableMessage,
}: {
  editableMessage: string;
  message: string;
}) {
  const [activeSegment, setActiveSegment] = useState("all");
  const [search, setSearch] = useState("");

  const filteredBySegment = useMemo(() => {
    const seg = BUSINESS_SEGMENTS.find((s) => s.id === activeSegment);
    return seg ? customerRows.filter(seg.filter) : customerRows;
  }, [activeSegment]);

  const displayedCustomers = useMemo(() => {
    if (!search.trim()) return filteredBySegment;
    const q = search.toLowerCase();
    return filteredBySegment.filter(
      (c) => c.name.toLowerCase().includes(q) || c.ucc.toLowerCase().includes(q)
    );
  }, [filteredBySegment, search]);

  function personaliseMessage(customerName: string) {
    const firstName = customerName.split(" ")[0];
    if (editableMessage.startsWith("Hi ")) return editableMessage;
    return editableMessage.replace(/^(📊|📈|🔥)/, `Hi ${firstName},\n\n$1`);
  }

  function whatsAppUrl(phone: string, customerName: string) {
    return `https://wa.me/${phone}?text=${encodeURIComponent(personaliseMessage(customerName))}`;
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Segment pills */}
      <div className="shrink-0 border-b border-border px-4 py-3">
        <div className="flex flex-wrap gap-1.5">
          {BUSINESS_SEGMENTS.map((seg) => {
            const count = customerRows.filter(seg.filter).length;
            const isActive = activeSegment === seg.id;
            return (
              <button
                key={seg.id}
                type="button"
                onClick={() => setActiveSegment(seg.id)}
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all ${
                  isActive
                    ? "border-[#542087] bg-[#542087] text-white"
                    : "border-border text-muted-foreground hover:border-[#542087]/40 hover:text-foreground"
                }`}
              >
                {seg.label}
                <span
                  className={`rounded-full px-1.5 py-px text-[10px] ${
                    isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        {activeSegment !== "all" && (
          <p className="mt-2 text-[11px] text-muted-foreground">
            {BUSINESS_SEGMENTS.find((s) => s.id === activeSegment)?.description}
          </p>
        )}
      </div>

      {/* Search */}
      <div className="shrink-0 border-b border-border px-4 py-2.5">
        <div className="flex h-8 items-center gap-2 rounded-lg border border-border bg-muted/30 px-3">
          <Search size={13} className="shrink-0 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or UCC…"
            className="flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
              <X size={11} />
            </button>
          )}
        </div>
      </div>

      {/* Customer list */}
      <div className="flex-1 overflow-y-auto divide-y divide-border/60">
        {displayedCustomers.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">No customers found.</div>
        ) : (
          displayedCustomers.map((customer) => {
            const phone = CUSTOMER_PHONES[customer.ucc] ?? "919999999999";
            const waUrl = whatsAppUrl(phone, customer.name);
            const badge = customer.suggestedActions.find((a) =>
              ["Top 5% client", "Likely to lapse", "High F&O Losses"].includes(a)
            );
            return (
              <div key={customer.ucc} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors">
                <Avatar name={customer.name} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="truncate text-[13px] font-medium text-foreground">{customer.name}</span>
                    {badge && <SegmentBadge label={badge} />}
                  </div>
                  <div className="text-[11px] text-muted-foreground">{customer.ucc}</div>
                </div>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  title={`Send to ${customer.name} via WhatsApp`}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#25D366]/30 bg-[#25D366]/8 text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
                >
                  <MessageCircle size={15} />
                </a>
              </div>
            );
          })
        )}
      </div>

      {/* Footer count */}
      <div className="shrink-0 border-t border-border bg-muted/20 px-4 py-2.5">
        <span className="text-[11px] text-muted-foreground">
          {displayedCustomers.length} customer{displayedCustomers.length !== 1 ? "s" : ""} shown
        </span>
      </div>
    </div>
  );
}

/* ─── Main Modal ─────────────────────────────────────────────────────────── */

export function ServicingShareModal({
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
  const [editableMessage, setEditableMessage] = useState(message);
  const [mobileStep, setMobileStep] = useState<MobileStep>("message");
  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3 md:p-6"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* ── Desktop: two-column landscape ─────────────────────────────── */}
      <div
        className="hidden md:flex flex-col w-full max-w-4xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
        style={{ height: "min(82vh, 640px)" }}
      >
        {/* Single full-width header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-3.5 bg-card">
          <div>
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>

        {/* Two-column body */}
        <div className="flex flex-1 min-h-0">
          {/* Left: message panel */}
          <div className="w-[42%] border-r border-border flex flex-col bg-white min-h-0">
            <div className="flex-1 min-h-0 overflow-hidden">
              <MessagePanel
                message={message}
                editableMessage={editableMessage}
                onChange={setEditableMessage}
                onReset={() => setEditableMessage(message)}
              />
            </div>
          </div>

          {/* Right: customers panel */}
          <div className="flex-1 flex flex-col min-h-0 bg-card">
            <div className="px-5 py-3.5 border-b border-border shrink-0">
              <p className="text-sm font-semibold text-foreground">Select Customers</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Choose who receives this on WhatsApp</p>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              <CustomersPanel editableMessage={editableMessage} message={message} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile: two-step flow ──────────────────────────────────────── */}
      <div className="flex md:hidden flex-col w-full rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
        style={{ height: "88vh" }}>
        {/* Step 1: Review message */}
        {mobileStep === "message" && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-border shrink-0">
              <div>
                <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">Step 1 of 2 · Review your message</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              >
                <X size={15} />
              </button>
            </div>

            {/* Editable message */}
            <div className="flex-1 flex flex-col px-4 py-4 gap-3 overflow-hidden min-h-0">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#25D366]/10">
                  <MessageCircle size={13} className="text-[#25D366]" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-foreground">WhatsApp Message</p>
                  <p className="text-[10px] text-muted-foreground">Tap to edit directly</p>
                </div>
              </div>
              <div className="flex-1 rounded-xl bg-[#ECF8F1] border border-[#25D366]/20 p-3 overflow-hidden flex flex-col min-h-0">
                <textarea
                  value={editableMessage}
                  onChange={(e) => setEditableMessage(e.target.value)}
                  className="flex-1 w-full resize-none bg-transparent text-[12.5px] leading-relaxed text-[#1a1a1a] outline-none font-[inherit] min-h-0"
                  spellCheck={false}
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setEditableMessage(message)}
                  disabled={editableMessage === message}
                  className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <RotateCcw size={10} />
                  Reset
                </button>
                <span className="text-[10px] text-muted-foreground">{editableMessage.length} chars</span>
              </div>
            </div>

            {/* CTA */}
            <div className="shrink-0 px-4 py-4 border-t border-border bg-muted/10">
              <button
                type="button"
                onClick={() => setMobileStep("customers")}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#542087] px-4 py-3 text-sm font-semibold text-white hover:bg-[#6b2ba8] active:bg-[#3d1866] transition-colors shadow-sm"
              >
                Select Customers
                <ChevronRight size={16} />
              </button>
            </div>
          </>
        )}

        {/* Step 2: Select customers */}
        {mobileStep === "customers" && (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border shrink-0">
              <button
                type="button"
                onClick={() => setMobileStep("message")}
                className="rounded-lg p-1.5 -ml-1 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              >
                <ArrowLeft size={16} />
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">Select Customers</p>
                <p className="text-[11px] text-muted-foreground">Step 2 of 2 · Send via WhatsApp</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              >
                <X size={15} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden min-h-0 flex flex-col">
              <CustomersPanel editableMessage={editableMessage} message={message} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
