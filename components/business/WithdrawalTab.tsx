"use client";

import { Info, Wallet } from "lucide-react";

const WITHDRAWAL_DATA = {
  availableToWithdraw: 22215.13,
  unsettledBalance: 0,
  currentMonthEarnings: 0,
  currentMonth: "Mar. 2026",
  openRequest: false,
};

function formatCurrency(v: number) {
  return "₹" + v.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const NOTES = [
  "Every month's earnings will be available to withdraw on and after the 7th of the next month.",
  "If your 'Available to Withdraw' balance shows a negative amount, you can check why the balance is negative by downloading your ledger from the 'Earnings' section.",
  "You can place only 1 request per day. However, you can modify any open requests before the end of the trading day.",
  "Your withdrawal amount must be greater than or equal to ₹100.",
  "The displayed withdrawal balance is inclusive of 2% TDS.",
];

export function WithdrawalTab() {
  const d = WITHDRAWAL_DATA;
  const totalBalance = d.availableToWithdraw + d.unsettledBalance + d.currentMonthEarnings;

  return (
    <main className="flex-1 p-4 sm:p-6">
      {/* Section heading */}
      <h2 className="flex items-center gap-2 border-l-[3px] border-primary pl-3 text-lg font-semibold text-foreground tracking-tight mb-5">
        <Wallet size={18} className="text-primary shrink-0" />
        Withdrawal
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-4xl">
        {/* Left — balance + CTA */}
        <div className="rounded-md border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/20">
            <p className="text-sm font-semibold text-foreground">Referral</p>
          </div>

          <div className="px-4 py-1 divide-y divide-border">
            {/* Available to withdraw */}
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-muted-foreground">Available to withdraw</span>
              <span className="text-sm font-semibold text-foreground">
                {formatCurrency(d.availableToWithdraw)}
              </span>
            </div>

            {/* Unsettled balance */}
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-muted-foreground">Unsettled balance</span>
              <span className="text-sm font-semibold text-foreground">
                {formatCurrency(d.unsettledBalance)}
              </span>
            </div>

            {/* Current month earnings — indented sub-item */}
            <div className="flex items-center justify-between py-3 pl-4 border-l-2 border-primary/20 ml-2">
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-muted-foreground">{d.currentMonth} earnings</span>
                <button
                  type="button"
                  title="Current month earnings are not yet available for withdrawal"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Info size={13} />
                </button>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {formatCurrency(d.currentMonthEarnings)}
              </span>
            </div>

            {/* Total balance — highlighted row */}
            <div className="flex items-center justify-between py-3 -mx-4 px-4 bg-muted/40">
              <span className="text-sm font-semibold text-foreground">Total Balance</span>
              <span className="text-sm font-semibold text-foreground">
                {formatCurrency(totalBalance)}
              </span>
            </div>
          </div>

          <div className="px-4 py-3 border-t border-border">
            {/* Open request */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Open Request</span>
              <span className="text-sm font-semibold text-foreground">
                {d.openRequest ? "Yes" : "No"}
              </span>
            </div>

            {/* CTA */}
            <button
              type="button"
              className="w-full rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all"
            >
              Request Pay-Out
            </button>
          </div>
        </div>

        {/* Right — notes */}
        <div className="rounded-md border border-border bg-card p-4">
          <p className="text-sm font-semibold text-foreground mb-3">NOTE:</p>
          <ul className="space-y-2.5">
            {NOTES.map((note, i) => (
              <li key={i} className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-muted-foreground/50 shrink-0" />
                {note}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
