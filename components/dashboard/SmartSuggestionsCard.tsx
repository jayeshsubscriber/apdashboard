"use client";

import { ArrowRight, AlertTriangle, TrendingUp, Users, Sparkles, Bell, FileText } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type SuggestionKind = "alert" | "opportunity" | "action" | "market" | "payout";

type Suggestion = {
  id: string;
  kind: SuggestionKind;
  icon: React.ElementType;
  title: string;
  message: string;
  cta: string;
  href?: string;
};

// ─── Config ───────────────────────────────────────────────────────────────────

const KIND_STYLES: Record<SuggestionKind, { bg: string; icon: string }> = {
  alert:       { bg: "bg-amber-50 border border-amber-100",   icon: "text-amber-600"  },
  opportunity: { bg: "bg-primary/5 border border-primary/10", icon: "text-primary"    },
  action:      { bg: "bg-sky-50 border border-sky-100",        icon: "text-sky-600"    },
  market:      { bg: "bg-emerald-50 border border-emerald-100",icon: "text-emerald-600"},
  payout:      { bg: "bg-violet-50 border border-violet-100",  icon: "text-violet-600" },
};

const SUGGESTIONS: Suggestion[] = [
  {
    id: "lapse",
    kind: "alert",
    icon: AlertTriangle,
    title: "5 clients at lapse risk",
    message: "Harshali Mane, Prasad Shah and 3 others haven't traded in 30+ days. A quick call now can prevent churn.",
    cta: "View at-risk clients",
  },
  {
    id: "ipo",
    kind: "market",
    icon: TrendingUp,
    title: "2 IPOs opening next week",
    message: "Apex Green Energy & Nexa Finance open on 25 Mar. Alert your clients now to ensure they don't miss the window.",
    cta: "Send IPO alert",
  },
  {
    id: "sip",
    kind: "opportunity",
    icon: Sparkles,
    title: "Boost your trail commission",
    message: "14 equity clients have no MF exposure. Converting even 5 to a ₹2,000 SIP adds ₹840/yr in trail commission.",
    cta: "See MF upsell list",
  },
  {
    id: "esign",
    kind: "action",
    icon: Users,
    title: "Lead stuck at ESign",
    message: "Harshali Mane has been on the ESign step for 3 days. Sending the link again often resolves this in minutes.",
    cta: "Follow up now",
  },
  {
    id: "payout",
    kind: "payout",
    icon: FileText,
    title: "March payout processed",
    message: "₹27,874 has been credited to your account. View the breakdown by revenue stream in your statement.",
    cta: "View statement",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function SmartSuggestionsCard() {
  return (
    <section className="rounded-md border border-border bg-card overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Bell size={14} className="text-primary" />
          <span className="text-sm font-semibold text-foreground tracking-tight">Smart Suggestions</span>
          <span className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground text-[10px] font-bold leading-none px-1.5 py-0.5">
            {SUGGESTIONS.length}
          </span>
        </div>
        <button className="text-xs text-primary font-medium hover:underline">
          View all
        </button>
      </div>

      {/* Suggestion list */}
      <ul className="divide-y divide-border">
        {SUGGESTIONS.map((s) => {
          const styles = KIND_STYLES[s.kind];
          const Icon = s.icon;
          return (
            <li key={s.id} className="flex gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">

              {/* Thumbnail */}
              <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${styles.bg}`}>
                <Icon size={15} className={styles.icon} />
              </div>

              {/* Content */}
              <div className="min-w-0 flex flex-col gap-1">
                <p className="text-xs font-semibold text-foreground leading-snug">{s.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{s.message}</p>
                <button className="mt-0.5 inline-flex w-fit items-center gap-1 text-[11px] font-semibold text-primary hover:underline">
                  {s.cta}
                  <ArrowRight size={10} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
