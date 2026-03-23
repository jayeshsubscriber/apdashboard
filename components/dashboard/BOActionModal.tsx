"use client";

import { useEffect, useMemo, useState } from "react";
import { X, MessageCircle, RotateCcw, Calendar, Send } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type BOActionType = "suggest" | "reengage" | "schedule" | "checkin";

export interface BOActionPayload {
  type: BOActionType;
  customerName: string;
  customerUcc: string;
  customerPhone: string;
}

// ─── Products ─────────────────────────────────────────────────────────────────

const PRODUCTS = [
  { id: "stocks",   label: "Trending Stocks",  emoji: "📈" },
  { id: "options",  label: "Trending Options", emoji: "📊" },
  { id: "advisory", label: "Advisory",         emoji: "🎯" },
  { id: "ipo",      label: "IPOs",             emoji: "💎" },
  { id: "mf",       label: "Mutual Funds",     emoji: "💰" },
];

// ─── Message templates ────────────────────────────────────────────────────────

const SUGGEST: Record<string, (n: string) => string> = {
  stocks: (n) =>
`📈 *Stock Opportunity Alert!*

Hi ${n}! A great momentum play right now — check out *Reliance Industries (RELIANCE)*.

LTP: ₹2,945 | +1.45% today | Volume: 18.2L

💡 This could be a great fit for your portfolio based on current trends.

🔗 Trade on Upstox: https://upstox.com/trade/

Happy to discuss — just reply here!`,

  options: (n) =>
`📊 *Options Trade Alert!*

Hi ${n}! Here's a potential strategy for this week:

*NIFTY 22500 CE (Weekly)* — currently at ₹185
📈 Bullish bias based on global cues & support levels

⚠️ Options involve risk — suitable for experienced traders.

🔗 Trade on Upstox: https://upstox.com/trade/

Want to discuss the setup in detail?`,

  advisory: (n) =>
`🎯 *Exclusive Advisory Pick!*

Hi ${n}! Our research team has a fresh *Buy* call on *HDFC Bank* — 12-month target ₹1,950.

📌 CMP: ₹1,690 | Potential upside: ~15%
📊 Strong Q3 earnings + favourable RBI rate outlook

🔗 Full report: https://upstox.com/advisory/

Want me to walk you through the thesis?`,

  ipo: (n) =>
`💎 *IPO Alert — Don't Miss Out!*

Hi ${n}! There are 2 live IPOs open right now:

1. *Apex Green Energy* — GMP: ₹42 | Closes: 25 Mar
2. *Nexa Finance* — GMP: ₹28 | Closes: 27 Mar

📅 Apply before the window closes!

🔗 Apply on Upstox: https://upstox.com/ipo/

Let me know if you need help applying!`,

  mf: (n) =>
`💰 *SIP Suggestion for You!*

Hi ${n}! I'm recommending a SIP in *Mirae Asset Emerging Bluechip Fund* — one of the top-rated diversified equity funds.

📊 3Y returns: 18.4% p.a.
💳 Start with just ₹500/month

🔗 Invest now: https://upstox.com/mutual-funds/

A small step today builds big wealth tomorrow!`,
};

const REENGAGE: Record<string, (n: string) => string> = {
  stocks: (n) =>
`Hey ${n}! 👋 It's been a while — hope you're doing well!

The markets have been active lately and I spotted an opportunity that suits your profile:

📈 *Bharti Airtel* is breaking out with strong momentum.
LTP: ₹1,720 | +2.1% | Strong buy signals

Even a small position could kick-start your trading journey again!

🔗 Trade on Upstox: https://upstox.com/trade/

Reply here if you'd like to know more 🙂`,

  options: (n) =>
`Hey ${n}! 👋 Markets are buzzing — don't miss out!

Here's a quick options idea for this week:

📊 *BANKNIFTY 45000 CE* — great momentum setup
LTP: ₹240 | +12% today

⚠️ Options involve risk — for experienced traders.

🔗 Trade on Upstox: https://upstox.com/trade/`,

  advisory: (n) =>
`Hey ${n}! 👋 Our research desk just released a fresh call!

🎯 *Buy: Infosys (INFY)* | Target: ₹1,820 | Stop: ₹1,510
📊 Strong earnings growth + global deal wins

This could be a great re-entry opportunity for you.

🔗 Full advisory: https://upstox.com/advisory/`,

  ipo: (n) =>
`Hey ${n}! 👋 An exciting IPO opportunity just opened!

💎 *Apex Green Energy IPO*
Price band: ₹188–₹198 | Closes: 25 Mar
GMP: ₹42 (strong grey market interest!)

📅 Apply before it closes!

🔗 Apply on Upstox: https://upstox.com/ipo/`,

  mf: (n) =>
`Hey ${n}! 👋 A gentle nudge — your money could be working harder!

💰 Even a *₹1,000/month SIP* could grow to ₹2.3L in 10 years at 15% p.a.

📊 Top pick: *Axis Bluechip Fund*
3Y returns: 16.2% p.a. | Consistent performer

🔗 Start your SIP: https://upstox.com/mutual-funds/`,
};

function scheduleMsg(n: string) {
  return `Hi ${n}! 👋

I'd love to connect and share some exciting investment opportunities matched to your profile.

Would you be free for a quick *15-minute call* this week?

📅 Book a convenient slot here:
https://calendly.com/upstox-advisor/15min

Looking forward to speaking with you!`;
}

function checkinMsg(n: string) {
  return `Hi ${n}! 👋

Just checking in on your investments — I have some portfolio insights and fresh opportunities I'd love to walk you through.

📅 Let's schedule a quick call:
https://calendly.com/upstox-advisor/15min

Talk soon! 🙂`;
}

function buildMessage(type: BOActionType, product: string, name: string): string {
  if (type === "suggest") return (SUGGEST[product] ?? SUGGEST.stocks)(name);
  if (type === "reengage") return (REENGAGE[product] ?? REENGAGE.stocks)(name);
  if (type === "schedule") return scheduleMsg(name);
  return checkinMsg(name);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MODAL_TITLES: Record<BOActionType, string> = {
  suggest:  "Suggest Products",
  reengage: "Re-engage Client",
  schedule: "Schedule a Call",
  checkin:  "Schedule Check-in",
};

function waUrl(phone: string, message: string) {
  const clean = phone.replace(/\D/g, "");
  const intl = clean.startsWith("91") ? clean : `91${clean}`;
  return `https://wa.me/${intl}?text=${encodeURIComponent(message)}`;
}

// ─── Main modal ───────────────────────────────────────────────────────────────

export function BOActionModal({
  type,
  customerName,
  customerUcc,
  customerPhone,
  onClose,
}: BOActionPayload & { onClose: () => void }) {
  const [product, setProduct] = useState(PRODUCTS[0].id);
  const baseMessage = useMemo(
    () => buildMessage(type, product, customerName),
    [type, product, customerName]
  );
  const [editable, setEditable] = useState(baseMessage);

  // Sync message when product changes
  useEffect(() => {
    setEditable(buildMessage(type, product, customerName));
  }, [type, product, customerName]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const title = MODAL_TITLES[type];
  const isSchedule = type === "schedule" || type === "checkin";
  const hasProducts = type === "suggest" || type === "reengage";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="flex flex-col w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
        style={{ maxHeight: "90vh" }}>

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Sending to <span className="font-medium text-foreground">{customerName}</span>
              <span className="ml-1 font-mono text-[10px]">({customerUcc})</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>

        {/* Product selector */}
        {hasProducts && (
          <div className="shrink-0 px-5 pt-4 pb-3 border-b border-border">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Select product
            </p>
            <div className="flex flex-wrap gap-1.5">
              {PRODUCTS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setProduct(p.id)}
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all ${
                    product === p.id
                      ? "border-primary bg-primary text-white"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  <span>{p.emoji}</span> {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message area */}
        <div className="flex flex-col px-5 py-4 gap-3 overflow-y-auto">
          <div className="flex items-center gap-2 shrink-0">
            <div className={`flex h-7 w-7 items-center justify-center rounded-full ${isSchedule ? "bg-blue-50" : "bg-[#25D366]/10"}`}>
              {isSchedule
                ? <Calendar size={14} className="text-blue-500" />
                : <MessageCircle size={14} className="text-[#25D366]" />}
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">WhatsApp Message</p>
              <p className="text-[10px] text-muted-foreground">Edit directly — sent as-is to the customer</p>
            </div>
          </div>

          <div className="rounded-xl bg-[#ECF8F1] border border-[#25D366]/20 p-3">
            <textarea
              value={editable}
              onChange={(e) => setEditable(e.target.value)}
              className="w-full resize-none bg-transparent text-[12.5px] leading-relaxed text-[#1a1a1a] outline-none font-[inherit] min-h-[260px]"
              spellCheck={false}
            />
          </div>

          <div className="flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={() => setEditable(baseMessage)}
              disabled={editable === baseMessage}
              className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <RotateCcw size={11} /> Reset to default
            </button>
            <span className="text-[10px] text-muted-foreground">{editable.length} chars</span>
          </div>
        </div>

        {/* Send button */}
        <div className="shrink-0 px-5 py-4 border-t border-border bg-muted/10">
          <a
            href={waUrl(customerPhone, editable)}
            target="_blank"
            rel="noreferrer"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1ebe5d] active:bg-[#17a550] transition-colors shadow-sm"
          >
            <MessageCircle size={16} />
            Send via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
