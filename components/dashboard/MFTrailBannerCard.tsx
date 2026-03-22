"use client";

import { ArrowRight, Zap } from "lucide-react";

const CUSTOMERS_ONBOARDED = 34;

export function MFTrailBannerCard() {
  return (
    <section className="rounded-md border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card overflow-hidden">
      <div className="p-4 sm:p-5 flex flex-col gap-4">

        {/* Eyebrow */}
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-primary/10 p-1">
            <Zap size={12} className="text-primary fill-primary/30" />
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-primary">
            MF Distribution · Upstox
          </span>
        </div>

        {/* Headline — the ask, upfront */}
        <div className="flex flex-col gap-1">
          <p className="text-base font-bold text-foreground leading-snug">
            Distribute Regular Mutual Funds via Upstox
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Earn monthly trail commission on every rupee your clients invest — even when markets fall.
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Trail commission messaging */}
        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground leading-snug">
            Earn trail commission of up to
          </p>
          <p className="text-base font-semibold leading-snug tracking-tight text-primary">
            1% of AUM/ year
          </p>
        </div>

        {/* Social proof */}
        <div className="flex items-center gap-2.5 rounded-md bg-muted/50 border border-border px-3 py-2">
          <div className="flex -space-x-2">
            {["#7c3aed", "#9333ea", "#a855f7"].map((c, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border-2 border-card flex items-center justify-center text-[9px] font-bold text-white"
                style={{ background: c }}
              >
                {String.fromCharCode(65 + i * 3)}
              </div>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            <span className="text-foreground font-semibold">{CUSTOMERS_ONBOARDED} APs</span> already distributing this month
          </span>
        </div>

        {/* CTA */}
        <button
          type="button"
          className="group w-full inline-flex items-center justify-between gap-2 rounded-md bg-primary text-primary-foreground text-sm font-semibold py-2.5 px-4 hover:bg-primary/90 active:scale-[0.98] transition-all"
        >
          <span>Start Distributing Regular MFs</span>
          <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Fine print */}
        <p className="text-[10px] text-muted-foreground text-center -mt-1">
          AMFI registered · Upstox-powered · Zero setup cost
        </p>

      </div>
    </section>
  );
}
