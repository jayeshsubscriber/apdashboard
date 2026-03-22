"use client";

import { useState } from "react";
import { FileText } from "lucide-react";

// ─── Date range presets ────────────────────────────────────────────────────
const DATE_PRESETS = [
  { key: "today",      label: "Today" },
  { key: "yesterday",  label: "Yesterday" },
  { key: "this_week",  label: "This Week" },
  { key: "last_week",  label: "Last Week" },
  { key: "this_month", label: "This Month" },
  { key: "last_month", label: "Last Month" },
  { key: "custom",     label: "Custom" },
] as const;
type DatePresetKey = (typeof DATE_PRESETS)[number]["key"];

// ─── Mock data (empty to match competitor state) ───────────────────────────
type StatementRow = {
  id: number;
  date: string;
  yourNotes: string;
  adminNotes: string;
  paymentMode: string;
  status: "Paid" | "Pending" | "Failed";
  amount: number;
  statusUpdated: string;
};

const STATEMENT_ROWS: StatementRow[] = [];

function formatCurrency(v: number) {
  return "₹" + v.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function StatusBadge({ status }: { status: StatementRow["status"] }) {
  const styles = {
    Paid: "bg-green-50 text-green-700 border-green-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Failed: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${styles[status]}`}>
      {status}
    </span>
  );
}

export function StatementTab() {
  const [selectedPreset, setSelectedPreset] = useState<DatePresetKey>("last_month");

  const totalWithdrawal = STATEMENT_ROWS
    .filter((r) => r.status === "Paid")
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <main className="flex-1 p-4 sm:p-6">
      {/* Section heading */}
      <h2 className="flex items-center gap-2 border-l-[3px] border-primary pl-3 text-lg font-semibold text-foreground tracking-tight mb-5">
        <FileText size={18} className="text-primary shrink-0" />
        Statement
      </h2>

      <div className="max-w-5xl">
        {/* Summary bar — amount left, pills right */}
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <p className="text-sm font-semibold text-foreground">
            Withdrawal amount{" "}
            <span className="text-base font-bold">{formatCurrency(totalWithdrawal)}</span>
          </p>

          {/* Period pills — same style as Revenue Summary */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {DATE_PRESETS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedPreset(key)}
                className={`shrink-0 h-7 rounded-full px-3 text-xs font-medium border transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
                  selectedPreset === key
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border border-border bg-card overflow-x-auto">
          <table className="w-full text-sm" style={{ minWidth: 640 }}>
            <thead>
              <tr className="border-b border-border bg-muted/20">
                {["Date", "Your notes", "Admin notes", "Payment Mode", "Status", "Amount (₹)", "Status updated"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STATEMENT_ROWS.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    No data for selected filter
                  </td>
                </tr>
              ) : (
                STATEMENT_ROWS.map((row) => (
                  <tr key={row.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{row.date}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{row.yourNotes || "—"}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{row.adminNotes || "—"}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{row.paymentMode}</td>
                    <td className="px-4 py-3"><StatusBadge status={row.status} /></td>
                    <td className="px-4 py-3 text-sm font-medium text-foreground text-right whitespace-nowrap">{formatCurrency(row.amount)}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{row.statusUpdated}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
