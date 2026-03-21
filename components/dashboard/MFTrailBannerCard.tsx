"use client";

import { ArrowRight, Zap } from "lucide-react";

const CUSTOMERS_ONBOARDED = 34;

export function MFTrailBannerCard() {
  return (
    <section className="rounded-xl overflow-hidden bg-[#1e1b4b] text-white relative flex flex-col">

      {/* Amber glow top-right */}
      <div className="pointer-events-none absolute -top-8 -right-8 w-36 h-36 rounded-full bg-amber-400 opacity-15 blur-2xl" />
      {/* Purple glow bottom-left */}
      <div className="pointer-events-none absolute bottom-0 -left-6 w-28 h-28 rounded-full bg-violet-500 opacity-25 blur-2xl" />

      <div className="relative z-10 p-5 flex flex-col gap-5">

        {/* Eyebrow */}
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-amber-400/20 p-1">
            <Zap size={12} className="text-amber-400 fill-amber-400" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-amber-400">
            Passive Income Opportunity
          </span>
        </div>

        {/* Hero stat */}
        <div className="flex flex-col gap-1">
          <div className="text-[11px] font-medium text-indigo-300 uppercase tracking-widest">
            Trail earned per ₹1 Cr AUM
          </div>
          <div className="flex items-end gap-2 mt-1">
            <span className="text-[42px] font-black leading-none tracking-tight text-amber-400">
              ₹8,000
            </span>
            <span className="text-[15px] text-white/60 font-semibold mb-1.5">/ year</span>
          </div>
          <div className="text-[12px] text-indigo-300">
            Compounds as your clients&apos; AUM grows
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10" />

        {/* Message */}
        <div className="flex flex-col gap-1.5">
          <p className="text-[15px] font-bold text-white leading-snug">
            Move clients to Regular MFs.
          </p>
          <p className="text-[13px] text-indigo-200 leading-relaxed">
            Your trail commission hits every month — even when markets fall.
          </p>
        </div>

        {/* Social proof */}
        <div className="flex items-center gap-2.5 rounded-lg bg-white/8 px-3 py-2.5">
          <div className="flex -space-x-2">
            {["#7c3aed", "#9333ea", "#a855f7"].map((c, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border-2 border-[#1e1b4b] flex items-center justify-center text-[9px] font-bold text-white"
                style={{ background: c }}
              >
                {String.fromCharCode(65 + i * 3)}
              </div>
            ))}
          </div>
          <span className="text-[12px] text-indigo-200">
            <span className="text-white font-bold">{CUSTOMERS_ONBOARDED} APs</span> onboarded clients this month
          </span>
        </div>

        {/* CTA */}
        <button
          type="button"
          className="group w-full inline-flex items-center justify-between gap-2 rounded-lg bg-amber-400 text-[#1e1b4b] text-[14px] font-extrabold py-3 px-4 hover:bg-amber-300 active:scale-[0.98] transition-all"
        >
          <span>Start Building Trail Income</span>
          <div className="rounded-full bg-[#1e1b4b]/15 p-1.5 group-hover:bg-[#1e1b4b]/25 transition-colors">
            <ArrowRight size={13} />
          </div>
        </button>

        {/* Fine print */}
        <p className="text-[10px] text-indigo-400 text-center -mt-2">
          Regular MF · AMFI compliant · Upstox-powered
        </p>

      </div>
    </section>
  );
}
