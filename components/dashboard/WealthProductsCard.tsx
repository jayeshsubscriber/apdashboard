"use client";

import { Share2, Landmark } from "lucide-react";
import { useState } from "react";

type IpoTab = "open" | "upcoming";

type IpoRow = {
  name: string;
  marketType: string;
  openClose: string;
  issueSize: string;
  priceRange: string;
  subscription: string;
};

const IPO_TABS: Array<{ id: IpoTab; label: string }> = [
  { id: "open", label: "Open" },
  { id: "upcoming", label: "Upcoming" },
];

const LIVE_IPOS: IpoRow[] = [
  {
    name: "Apex Green Energy Ltd",
    marketType: "SME, Software",
    openClose: "19 Mar - 21 Mar",
    issueSize: "Rs 60 Cr",
    priceRange: "Rs 139 - Rs 146",
    subscription: "1.10x",
  },
  {
    name: "Nexa Finance Services",
    marketType: "Mainboard, Finance",
    openClose: "18 Mar - 22 Mar",
    issueSize: "Rs 329 Cr",
    priceRange: "Rs 255 - Rs 268",
    subscription: "0.92x",
  },
];

const UPCOMING_IPOS: IpoRow[] = [
  {
    name: "Omni Aerospace Systems",
    marketType: "Mainboard, Engineering",
    openClose: "Expected: 28 Mar - 01 Apr",
    issueSize: "TBA",
    priceRange: "TBA",
    subscription: "---",
  },
  {
    name: "Pioneer Mobility Tech",
    marketType: "Mainboard, Auto-Tech",
    openClose: "Expected: 02 Apr - 05 Apr",
    issueSize: "TBA",
    priceRange: "TBA",
    subscription: "---",
  },
];

const UPSTOX_IPO_URL = "https://upstox.com/ipo/";

export function WealthProductsCard() {
  const [activeIpoTab, setActiveIpoTab] = useState<IpoTab>("open");
  const ipoRows = activeIpoTab === "open" ? LIVE_IPOS : UPCOMING_IPOS;

  return (
    <section className="min-w-0 overflow-hidden">
      <div className="px-3 sm:px-5 py-4 sm:py-5">
        <h2 className="flex items-center gap-2 border-l-[3px] border-primary pl-3 text-lg font-semibold text-foreground tracking-tight">
          <Landmark size={18} className="text-primary shrink-0" />
          IPO Overview
        </h2>

        <div className="mt-4 rounded-md border border-border bg-card overflow-hidden">
          <div className="border-b border-border px-3 py-2 bg-muted/20 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-x-auto">
              {IPO_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveIpoTab(tab.id)}
                  className={`h-7 rounded-full border px-3 text-xs font-medium transition-colors ${
                    activeIpoTab === tab.id
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <a
              href={UPSTOX_IPO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-7 items-center justify-center rounded-md border border-primary px-3 text-xs font-semibold text-primary hover:bg-primary/5 transition-colors"
            >
              VIEW MORE IPOs
            </a>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[780px]">
              <div className="grid grid-cols-[minmax(180px,0.9fr)_180px_145px_145px_110px_200px] border-b border-border px-3 py-2 gap-x-2">
                <div className="text-xs font-semibold text-muted-foreground">
                  Name
                </div>
                <div className="text-xs font-semibold text-muted-foreground text-right">
                  Open/Close
                </div>
                <div className="text-xs font-semibold text-muted-foreground text-right">
                  Issue Size
                </div>
                <div className="text-xs font-semibold text-muted-foreground text-right">
                  Price Range
                </div>
                <div className="text-xs font-semibold text-muted-foreground text-right">
                  Subscription
                </div>
                <div className="text-xs font-semibold text-muted-foreground text-right">
                  Actions
                </div>
              </div>

              <div className="max-h-[240px] overflow-y-auto">
                {ipoRows.map((row) => (
                  <div
                    key={row.name}
                    className="grid grid-cols-[minmax(180px,0.9fr)_180px_145px_145px_110px_200px] gap-x-2 px-3 py-2 border-b border-border last:border-b-0"
                  >
                    <div className="pr-2">
                      <div className="text-sm text-foreground truncate">
                        {row.name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {row.marketType}
                      </div>
                    </div>
                    <div className="text-sm text-foreground text-right whitespace-nowrap">
                      {row.openClose}
                    </div>
                    <div className="text-sm text-foreground text-right whitespace-nowrap">
                      {row.issueSize}
                    </div>
                    <div className="text-sm text-foreground text-right whitespace-nowrap">
                      {row.priceRange}
                    </div>
                    <div className="text-sm text-foreground text-right whitespace-nowrap">
                      {row.subscription}
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={UPSTOX_IPO_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-7 items-center justify-center rounded-md border border-primary px-2.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/5 whitespace-nowrap"
                      >
                        View Details
                      </a>
                      <button
                        type="button"
                        className="h-7 rounded-md border border-primary/30 bg-primary/10 px-2 text-xs font-medium text-primary inline-flex items-center gap-1 hover:bg-primary/15 transition-colors"
                      >
                        <Share2 size={12} />
                        Share
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
