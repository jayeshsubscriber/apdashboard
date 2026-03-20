"use client";

import { Share2 } from "lucide-react";
import { referralPlans } from "../data";

export function ReferralsFromCustomersPanel() {
  return (
    <section className="p-3">
      <h3 className="text-base font-semibold tracking-tight text-foreground">Referrals from customers</h3>
      <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-3">
        {referralPlans.map((p) => (
          <article key={p.id} className="rounded-md border border-border bg-card p-3">
            <div className="text-[11px] text-muted-foreground">{p.subtitle}</div>
            <div className="mt-0.5 text-sm font-semibold text-foreground">{p.title}</div>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              {p.points.map((pt) => <li key={pt}>{pt}</li>)}
            </ul>
            <button type="button" className="mt-3 inline-flex h-7 items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2 text-[11px] font-semibold text-primary">
              <Share2 size={12} /> Share
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
