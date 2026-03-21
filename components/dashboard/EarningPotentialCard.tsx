"use client";

import { Copy, ArrowRight, MessageCircle } from "lucide-react";
import { useState } from "react";

const REFERRAL_LINK = "https://upstox.onelink.me/Wjgr/ab3fbskj";
const WHATSAPP_MESSAGE = encodeURIComponent(
  `Open your free Upstox demat account and start investing today! Use my referral link: ${REFERRAL_LINK}`
);
const WHATSAPP_URL = `https://wa.me/?text=${WHATSAPP_MESSAGE}`;

export function EarningPotentialCard() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(REFERRAL_LINK);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="min-w-0 overflow-hidden">
      <div className="px-3 sm:px-5 pt-4 pb-1">
        <h2 className="flex items-center gap-2 border-l-[3px] border-primary pl-3 text-lg font-semibold text-foreground tracking-tight">
          Grow Your Income
        </h2>
        <p className="mt-0.5 pl-3 text-sm text-muted-foreground">
          Three ways to grow your income as a sub-broker
        </p>
      </div>

      <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Card 1 — Account Opening Referral */}
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5 flex flex-col gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
              Account Opening
            </div>
            <h3 className="text-base font-semibold text-foreground">
              Referral reward
            </h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-foreground">₹250</span>
              <span className="text-sm text-muted-foreground">/ customer</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Earn a flat reward for every new account opened via your referral link.
            </p>
          </div>

          <div className="mt-auto flex flex-col gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground mb-1.5">
                Your referral link
              </p>
              <div className="flex items-center gap-2 rounded-lg border-2 border-primary/20 bg-primary/5 px-3 py-2.5">
                <span className="flex-1 truncate text-sm text-foreground font-medium">
                  {REFERRAL_LINK}
                </span>
                <button
                  onClick={handleCopy}
                  className="shrink-0 text-primary hover:text-primary/80 transition-colors"
                  aria-label="Copy referral link"
                >
                  {copied ? (
                    <span className="text-xs font-semibold text-emerald-600">Copied!</span>
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>
            </div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-4 py-2.5 transition-colors"
            >
              <MessageCircle size={14} /> Refer Customers
            </a>
          </div>
        </div>

        {/* Card 2 — Brokerage Sharing */}
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5 flex flex-col gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
              Brokerage
            </div>
            <h3 className="text-base font-semibold text-foreground">
              Revenue share
            </h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-foreground">60%</span>
              <span className="text-sm text-muted-foreground">of brokerage</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Level 1 sharing — earn 60% of every rupee your clients generate in brokerage.
            </p>
          </div>

          <div className="mt-auto">
            <button className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-4 py-2.5 transition-colors">
              Explore Opportunities <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Card 3 — Mutual Funds */}
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5 flex flex-col gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
              Mutual Funds
            </div>
            <h3 className="text-base font-semibold text-foreground">
              Revenue share
            </h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-foreground">80%</span>
              <span className="text-sm text-muted-foreground">of trail commission</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Recurring passive income that compounds as your clients&apos; AUM grows.
            </p>
          </div>

          <div className="mt-auto">
            <div className="mb-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-primary/5 border border-primary/10 px-3 py-2.5">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Equity Funds</p>
                <p className="mt-0.5 text-sm font-bold text-primary">Upto 0.8%</p>
                <p className="text-[10px] text-muted-foreground">of AUM / yr</p>
              </div>
              <div className="rounded-lg bg-primary/5 border border-primary/10 px-3 py-2.5">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Debt Funds</p>
                <p className="mt-0.5 text-sm font-bold text-primary">Upto 0.4%</p>
                <p className="text-[10px] text-muted-foreground">of AUM / yr</p>
              </div>
            </div>
            <button className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-4 py-2.5 transition-colors">
              Explore MF Products <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
