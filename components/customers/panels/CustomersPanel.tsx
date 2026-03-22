"use client";

import {
  AlertTriangle,
  Ban,
  ChevronRight,
  TrendingUp,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import { customerInsights, customerRows } from "../data";
import { useMemo, useState } from "react";

type Props = { onSelectCustomer: (ucc: string) => void };
type CustomerInsightId = (typeof customerInsights)[number]["id"];

export function CustomersPanel({ onSelectCustomer }: Props) {
  const pageSize = 20;
  const [page, setPage] = useState(1);
  const [activeInsightId, setActiveInsightId] = useState<CustomerInsightId>(
    customerInsights[0]?.id ?? "totalClients"
  );

  const filteredCustomers = useMemo(() => {
    const bucketFromUcc = (ucc: string) => {
      const digits = ucc.replace(/\D/g, "");
      return Number(digits.slice(-2) || "0") % 100;
    };

    switch (activeInsightId) {
      case "active":
        return customerRows.filter((row) => bucketFromUcc(row.ucc) < 75);
      case "inactive":
        return customerRows.filter((row) => bucketFromUcc(row.ucc) >= 75);
      case "traded":
        return customerRows.filter((row) => bucketFromUcc(row.ucc) < 68);
      case "neverTraded":
        return customerRows.filter((row) => {
          const b = bucketFromUcc(row.ucc);
          return b >= 68 && b < 83;
        });
      case "nearChurn":
        return customerRows.filter(
          (row) =>
            row.suggestedActions.includes("Likely to lapse") || bucketFromUcc(row.ucc) >= 90
        );
      case "totalClients":
      default:
        return customerRows;
    }
  }, [activeInsightId]);

  const pageCount = useMemo(() => {
    return Math.max(1, Math.ceil(filteredCustomers.length / pageSize));
  }, [filteredCustomers]);

  const visibleCustomers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredCustomers.slice(start, start + pageSize);
  }, [filteredCustomers, page]);

  const canPaginate = filteredCustomers.length > pageSize;

  return (
    <section className="p-3">
      <div className="flex items-start justify-between gap-3">
        <h3 className="flex items-center gap-2 border-l-[3px] border-primary pl-3 text-lg font-semibold text-foreground tracking-tight">
          <Users size={18} className="text-primary shrink-0" />
          Customers
        </h3>
      </div>

      {/* Mobile-only: pills row */}
      <div className="lg:hidden mt-3 flex gap-2 overflow-x-auto pb-4">
        {customerInsights.map((insight) => {
          const isActive = activeInsightId === insight.id;
          return (
            <button
              key={insight.id}
              type="button"
              onClick={() => { setActiveInsightId(insight.id); setPage(1); }}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:bg-muted"
              }`}
            >
              {insight.label}
              <span className={`inline-flex items-center justify-center rounded px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                isActive ? "bg-white/25 text-white" : "bg-primary/10 text-primary"
              }`}>
                {insight.value}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[280px_minmax(0,1fr)] items-start">
        <aside className="hidden lg:block sticky top-[56px] self-start rounded-md border border-border bg-card">
          <div className="p-3 border-b border-border bg-muted/20">
            <div className="text-xs font-semibold text-muted-foreground">Overview</div>
          </div>
          <div className="p-3 space-y-2">
            {customerInsights.map((insight) => (
              <button
                key={insight.id}
                type="button"
                onClick={() => {
                  setActiveInsightId(insight.id);
                  setPage(1);
                }}
                className={`w-full text-left rounded-md px-3 py-2 transition-colors ${
                  activeInsightId === insight.id
                    ? "bg-primary/5"
                    : "bg-background hover:bg-muted/30"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    {insight.id === "totalClients" && (
                      <Users size={16} className={activeInsightId === insight.id ? "text-primary" : "text-muted-foreground"} aria-hidden />
                    )}
                    {insight.id === "active" && (
                      <UserCheck size={16} className={activeInsightId === insight.id ? "text-primary" : "text-muted-foreground"} aria-hidden />
                    )}
                    {insight.id === "inactive" && (
                      <UserX size={16} className={activeInsightId === insight.id ? "text-primary" : "text-muted-foreground"} aria-hidden />
                    )}
                    {insight.id === "traded" && (
                      <TrendingUp size={16} className={activeInsightId === insight.id ? "text-primary" : "text-muted-foreground"} aria-hidden />
                    )}
                    {insight.id === "neverTraded" && (
                      <Ban size={16} className={activeInsightId === insight.id ? "text-primary" : "text-muted-foreground"} aria-hidden />
                    )}
                    {insight.id === "nearChurn" && (
                      <AlertTriangle
                        size={16}
                        className={activeInsightId === insight.id ? "text-primary" : "text-muted-foreground"}
                        aria-hidden
                      />
                    )}
                    <div className="truncate text-[13px] font-medium text-foreground">
                      {insight.label}
                    </div>
                  </div>
                  <div className={`flex flex-shrink-0 items-center gap-2 text-[12px] font-semibold ${
                    activeInsightId === insight.id ? "text-primary" : "text-muted-foreground"
                  }`}>
                            <span>{insight.value} users</span>
                    <ChevronRight size={16} className={activeInsightId === insight.id ? "text-primary" : "text-muted-foreground"} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <div className="min-w-0">
          <div className="overflow-x-auto rounded-md border border-border">
            <div className="min-w-[1410px]">
            <div className="grid grid-cols-[140px_160px_150px_120px_170px_190px_220px_260px] border-b border-border bg-muted/20 px-3 py-2 text-xs font-semibold text-muted-foreground">
              <div className="sticky left-0 bg-slate-50 z-10">UCC</div>
              <div>Client Name</div>
              <div>Equity AUM</div>
              <div>MF AUM</div>
              <div>Last Traded Date</div>
              <div>
                Brokerage generated
                <br />
                (Last 30 days)
              </div>
              <div>
                Total Revenue generated
                <br />
                (Last 30 days)
              </div>
              <div>Suggested actions</div>
            </div>
            {visibleCustomers.map((r) => (
              <div
                key={r.ucc}
                role="button"
                tabIndex={0}
                onClick={() => onSelectCustomer(r.ucc)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelectCustomer(r.ucc)}
                className="group grid grid-cols-[140px_160px_150px_120px_170px_190px_220px_260px] items-start border-b border-border px-3 py-2 text-[13px] last:border-b-0 cursor-pointer hover:bg-primary/5 transition-colors"
              >
                <div className="sticky left-0 bg-white z-10 truncate transition-colors group-hover:bg-primary/5">{r.ucc}</div>
                <div className="truncate">{r.name}</div>
                <div className="text-muted-foreground">{r.equityAum}</div>
                <div className="text-muted-foreground">{r.mfAum}</div>
                <div>{r.lastTradedDate}</div>
                <div className="text-muted-foreground">{r.brokerageGeneratedLast30Days}</div>
                <div className="text-muted-foreground">{r.totalRevenueGeneratedLast30Days}</div>
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  {r.suggestedActions.map((action) => (
                    <span
                      key={`${r.ucc}-${action}`}
                      className="inline-flex rounded-sm border border-border bg-muted/20 px-2 py-0.5 text-[11px] font-semibold text-foreground"
                    >
                      {action}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            </div>
          </div>
          {canPaginate && (
            <div className="flex items-center justify-end gap-3 px-1 pt-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="h-10 rounded-md border border-border bg-background px-3 text-sm font-semibold text-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                Prev
              </button>
              <div className="text-xs text-muted-foreground">
                Page {page} of {pageCount}
              </div>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                disabled={page >= pageCount}
                className="h-10 rounded-md border border-border bg-background px-3 text-sm font-semibold text-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
