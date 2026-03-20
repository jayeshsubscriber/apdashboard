"use client";

import {
  AlertTriangle,
  Ban,
  Eye,
  TrendingUp,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import { customerInsights, customerRows } from "../data";
import { useMemo, useState } from "react";

export function CustomersPanel() {
  const pageSize = 20;
  const [page, setPage] = useState(1);
  const [viewAll, setViewAll] = useState(false);

  const pageCount = useMemo(() => {
    return Math.max(1, Math.ceil(customerRows.length / pageSize));
  }, []);

  const visibleCustomers = useMemo(() => {
    if (viewAll) return customerRows;
    const start = (page - 1) * pageSize;
    return customerRows.slice(start, start + pageSize);
  }, [page, viewAll]);

  const canPaginate = customerRows.length > pageSize && !viewAll;

  return (
    <section className="p-3">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold tracking-tight text-foreground">Customers</h3>
        {customerRows.length > pageSize && !viewAll && (
          <button
            type="button"
            onClick={() => {
              setViewAll(true);
              setPage(1);
            }}
            className="h-8 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            View all
          </button>
        )}
        {customerRows.length > pageSize && viewAll && (
          <button
            type="button"
            onClick={() => {
              setViewAll(false);
              setPage(1);
            }}
            className="h-8 rounded-md border border-border bg-background px-3 text-sm font-semibold text-foreground hover:bg-muted"
          >
            Show 20
          </button>
        )}
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-[300px_minmax(0,1fr)] items-start">
        <aside className="sticky top-24 self-start rounded-md border border-border bg-card">
          <div className="grid grid-cols-2 divide-x divide-y border-b border-border h-fit">
            {customerInsights.map((insight) => (
              <article
                key={insight.id}
                className="flex flex-col items-start gap-1.5 p-2.5 min-h-[74px]"
              >
                <div className="flex items-center gap-2">
                  {insight.id === "totalClients" && (
                    <Users size={18} className="text-primary" aria-hidden />
                  )}
                  {insight.id === "active" && (
                    <UserCheck size={18} className="text-primary" aria-hidden />
                  )}
                  {insight.id === "inactive" && (
                    <UserX size={18} className="text-primary" aria-hidden />
                  )}
                  {insight.id === "traded" && (
                    <TrendingUp size={18} className="text-primary" aria-hidden />
                  )}
                  {insight.id === "neverTraded" && (
                    <Ban size={18} className="text-primary" aria-hidden />
                  )}
                  {insight.id === "nearChurn" && (
                    <AlertTriangle
                      size={18}
                      className="text-primary"
                      aria-hidden
                    />
                  )}
                  <div className="text-xs font-medium leading-none text-muted-foreground">
                    {insight.label}
                  </div>
                </div>
                <div className="text-xl font-semibold leading-none text-foreground">
                  {insight.value}
                </div>
              </article>
            ))}
          </div>
        </aside>

        <div className="min-w-0">
          <div className="overflow-x-auto rounded-md border border-border">
            <div className="grid grid-cols-[140px_1fr_150px_120px_170px_190px_220px_260px] border-b border-border bg-muted/20 px-3 py-2 text-xs font-semibold text-muted-foreground">
              <div>UCC</div>
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
                className="grid grid-cols-[140px_1fr_150px_120px_170px_190px_220px_260px] items-start border-b border-border px-3 py-2 text-[13px] last:border-b-0"
              >
                <div className="truncate">{r.ucc}</div>
                <div className="truncate">{r.name}</div>
                <div className="text-muted-foreground">{r.equityAum}</div>
                <div className="text-muted-foreground">{r.mfAum}</div>
                <div>{r.lastTradedDate}</div>
                <div className="text-muted-foreground">{r.brokerageGeneratedLast30Days}</div>
                <div className="text-muted-foreground">{r.totalRevenueGeneratedLast30Days}</div>
                <div className="flex items-start gap-2">
                  <button
                    type="button"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border hover:bg-primary/5"
                    aria-label="View customer"
                  >
                    <Eye size={16} className="text-primary" />
                  </button>
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
              </div>
            ))}
          </div>
          {canPaginate && (
            <div className="flex items-center justify-end gap-3 px-1 pt-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="h-8 rounded-md border border-border bg-background px-3 text-sm font-semibold text-foreground disabled:cursor-not-allowed disabled:opacity-50"
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
                className="h-8 rounded-md border border-border bg-background px-3 text-sm font-semibold text-foreground disabled:cursor-not-allowed disabled:opacity-50"
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
