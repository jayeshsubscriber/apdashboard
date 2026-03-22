"use client";

import { useMemo, useState } from "react";
import {
  Search,
  X,
  MessageCircle,
  Pencil,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { customerRows, type CustomerRow } from "@/components/customers/data";

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
    description: "All 1,870 registered clients",
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

type ShareModalTab = "segments" | "customers";

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
    return base.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.ucc.toLowerCase().includes(q),
    );
  }, [tab, filteredBySegment, search]);

  function personaliseMessage(customerName: string) {
    const firstName = customerName.split(" ")[0];
    if (editableMessage.startsWith("Hi ")) return editableMessage;
    return editableMessage.replace(/^(📊|📈)/, `Hi ${firstName},\n\n$1`);
  }

  function whatsAppUrl(phone: string, customerName: string) {
    return `https://wa.me/${phone}?text=${encodeURIComponent(personaliseMessage(customerName))}`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col rounded-xl border border-border bg-card shadow-2xl">
        <div className="flex shrink-0 items-start justify-between border-b border-border p-5">
          <div>
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          >
            <X size={16} />
          </button>
        </div>

        <div className="shrink-0 border-b border-border">
          <button
            type="button"
            onClick={() => setPreviewExpanded(!previewExpanded)}
            className="flex w-full items-center justify-between px-4 py-2.5 hover:bg-muted/30"
          >
            <div className="flex items-center gap-2">
              <MessageCircle size={14} className="text-[#25D366]" />
              <span className="text-xs font-semibold text-foreground">
                Message Preview
              </span>
            </div>
            <div className="flex items-center gap-2">
              {!previewExpanded && (
                <span className="text-[10px] text-muted-foreground">
                  Click to expand
                </span>
              )}
              {previewExpanded ? (
                <ChevronUp size={14} className="text-muted-foreground" />
              ) : (
                <ChevronDown size={14} className="text-muted-foreground" />
              )}
            </div>
          </button>
          {previewExpanded && (
            <div className="px-4 pb-3">
              <div className="relative overflow-hidden rounded-lg border border-border bg-[#F8F9FA]">
                <div className="p-3">
                  {isEditing ? (
                    <textarea
                      value={editableMessage}
                      onChange={(e) => setEditableMessage(e.target.value)}
                      className="min-h-[120px] w-full resize-y rounded-md border border-border bg-white p-2.5 font-mono text-xs leading-relaxed text-[#262626] outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                      autoFocus
                    />
                  ) : (
                    <div className="whitespace-pre-wrap rounded-lg border border-[#E8E8E8] bg-white p-2.5 text-xs leading-relaxed text-[#262626] shadow-sm">
                      {editableMessage}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between border-t border-border bg-[#F0F0F0] px-3 py-2">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setEditableMessage(message);
                          setIsEditing(false);
                        }}
                        className="text-[11px] text-muted-foreground hover:text-foreground"
                      >
                        Reset to default
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1 text-[11px] font-medium text-primary-foreground hover:bg-primary/90"
                      >
                        Done
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-[10px] text-muted-foreground">
                        This message will be sent via WhatsApp
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/5 px-2.5 py-1 text-[11px] font-medium text-primary hover:bg-primary/10"
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

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {tab === "segments" && (
            <div className="shrink-0 border-b border-border p-3">
              <div className="flex flex-wrap gap-2">
                {BUSINESS_SEGMENTS.map((seg) => (
                  <button
                    key={seg.id}
                    type="button"
                    onClick={() => setActiveSegment(seg.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      activeSegment === seg.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
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

          <div className="shrink-0 border-b border-border px-3 py-2">
            <div className="flex h-8 items-center gap-2 rounded-md border border-border bg-muted/30 px-2.5">
              <Search size={13} className="shrink-0 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or UCC…"
                className="flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
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

          <div className="flex-1 overflow-y-auto">
            {displayedCustomers.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No customers found.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {displayedCustomers.map((customer) => {
                  const phone = CUSTOMER_PHONES[customer.ucc] ?? "919999999999";
                  const waUrl = whatsAppUrl(phone, customer.name);
                  return (
                    <div
                      key={customer.ucc}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-xs font-semibold text-primary">
                        {customer.name
                          .split(" ")
                          .slice(0, 2)
                          .map((p) => p[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-foreground">
                          {customer.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {customer.ucc}
                        </div>
                      </div>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        title={`Send to ${customer.name} on WhatsApp`}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#25D366]/30 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20"
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

        <div className="flex shrink-0 items-center justify-between border-t border-border bg-muted/20 px-5 py-3">
          <span className="text-xs text-muted-foreground">
            {displayedCustomers.length} customer
            {displayedCustomers.length !== 1 ? "s" : ""} shown
          </span>
          <button
            type="button"
            onClick={onClose}
            className="h-8 rounded-md border border-border px-3 text-xs font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
