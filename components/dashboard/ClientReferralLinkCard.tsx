"use client";

import { Copy, ChevronRight } from "lucide-react";
import { useState } from "react";

export function ClientReferralLinkCard() {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://upstox.onelink.me/Wjgr/ab3fbskj";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="rounded-md border border-border bg-card p-4">
      <div className="text-[14px] text-muted-foreground font-medium">
        Client Referral Link - App
      </div>

      <div className="mt-3 flex flex-col gap-3">
        <div className="w-full min-w-0 rounded-[10px] border border-primary bg-background px-3 py-3 flex items-start justify-between gap-3">
          <div className="text-[16px] leading-6 text-foreground break-all min-w-0">{referralLink}</div>
          <button
            type="button"
            aria-label="Copy referral link"
            onClick={handleCopy}
            className="mt-0.5 shrink-0 text-primary hover:opacity-80 transition-opacity"
          >
            <Copy size={20} />
          </button>
        </div>

        <button
          type="button"
          className="self-end inline-flex items-center gap-1 text-primary font-semibold text-[16px] tracking-wide whitespace-nowrap"
        >
          <span className="leading-none">VIEW MORE</span>
          <ChevronRight size={18} />
        </button>
      </div>

      {copied && <div className="mt-2 text-xs text-emerald-600">Link copied</div>}
    </section>
  );
}

