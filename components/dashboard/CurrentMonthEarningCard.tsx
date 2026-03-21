"use client";

import { IndianRupee } from "lucide-react";

function formatMoney(v: number) {
  return v.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });
}

export function CurrentMonthEarningCard() {
  // Dummy values until real metrics are wired.
  const accountsOpened = 128;
  const tradeActiveAccounts = 44;
  const referralIncome = 25340.5;
  const totalIncome = 27874.2;

  return (
    <section className="min-w-0 overflow-hidden">
      <div className="px-3 sm:px-5 py-4 sm:py-5">
        <div className="flex items-start">
          <div>
            <h2 className="flex items-center gap-2 border-l-[3px] border-primary pl-3 text-lg font-semibold text-foreground tracking-tight">
              <IndianRupee size={16} className="text-primary shrink-0" />
              MTD Summary
            </h2>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4">
          <div>
            <div className="text-sm text-muted-foreground font-medium">
              Number of Accounts Opened
            </div>
            <div className="mt-1 text-2xl font-semibold text-foreground leading-none">
              {accountsOpened}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground font-medium">
              Number of Trade Active Accounts
            </div>
            <div className="mt-1 text-2xl font-semibold text-foreground leading-none">
              {tradeActiveAccounts}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground font-medium">Referral Income</div>
            <div className="mt-1 text-2xl font-semibold text-foreground leading-none">
              ₹{formatMoney(referralIncome)}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground font-medium">Total Income</div>
            <div className="mt-1 text-2xl font-semibold text-foreground leading-none">
              ₹{formatMoney(totalIncome)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

