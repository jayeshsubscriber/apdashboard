"use client";

function formatMoney2(v: number) {
  return v.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function CurrentMonthEarningCard() {
  // Dummy values until real metrics are wired.
  const accountsOpened = 128;
  const tradeActiveAccounts = 44;
  const flatIncome = 25340.5;
  const totalIncome = 27874.2;

  return (
    <section className="rounded-md border border-border bg-card overflow-hidden">
      <div className="p-4">
        <div className="flex items-start">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Current Month Earning - MTD
            </h2>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-x-6 gap-y-2">
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
            <div className="text-sm text-muted-foreground font-medium">Flat Income</div>
            <div className="mt-1 text-2xl font-semibold text-foreground leading-none">
              {formatMoney2(flatIncome)}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground font-medium">Total Income</div>
            <div className="mt-1 text-2xl font-semibold text-foreground leading-none">
              {formatMoney2(totalIncome)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

