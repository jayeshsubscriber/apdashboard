"use client";

import { useMemo, useRef, useState, type MouseEvent } from "react";
import {
  Sparkles,
  HelpCircle,
  ChevronRight,
  Share2,
  Info,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { ServicingShareModal } from "./ServicingShareModal";

// ── Types & mock data ───────────────────────────────────────────────────────

type AdvCategory = "fno" | "mtf" | "intraday" | "equity" | "commodity";

interface AdvisoryPick {
  id: string;
  category: AdvCategory;
  /** Advisory direction for display only (not a trade button). */
  side: "buy" | "sell";
  createdOn: string;
  source: string;
  symbol: string;
  expiry: string;
  ltp: number;
  chg: number;
  chgPct: number;
  sl: number;
  entry: number;
  target: number;
  potentialLeftPct: number;
}

const ADVISORY_PICKS: AdvisoryPick[] = [
  { id: "a1", category: "fno", side: "buy", createdOn: "24 Oct, 11:22 PM", source: "Upstox Research", symbol: "INDHOTEL 720 CE", expiry: "28 Oct 25", ltp: 1913.78, chg: 30.5, chgPct: 12.5, sl: 1345.87, entry: 1456.98, target: 2467.12, potentialLeftPct: 17.75 },
  { id: "a2", category: "fno", side: "buy", createdOn: "23 Oct, 9:10 PM", source: "Upstox Research", symbol: "RELIANCE 2900 PE", expiry: "31 Oct 25", ltp: 42.15, chg: 3.2, chgPct: 8.2, sl: 28.4, entry: 32.1, target: 58.0, potentialLeftPct: 12.4 },
  { id: "a3", category: "fno", side: "sell", createdOn: "22 Oct, 4:05 PM", source: "Upstox Research", symbol: "NIFTY 25800 CE", expiry: "30 Oct 25", ltp: 118.5, chg: -6.2, chgPct: -4.97, sl: 142.0, entry: 135.0, target: 95.0, potentialLeftPct: 9.8 },
  { id: "b1", category: "mtf", side: "buy", createdOn: "24 Oct, 10:00 AM", source: "Upstox Research", symbol: "HDFCBANK", expiry: "Swing", ltp: 1824.35, chg: 22.1, chgPct: 1.23, sl: 1750.0, entry: 1788.0, target: 1920.0, potentialLeftPct: 5.25 },
  { id: "c1", category: "intraday", side: "buy", createdOn: "24 Oct, 9:18 AM", source: "Upstox Research", symbol: "TATASTEEL", expiry: "Intraday", ltp: 168.42, chg: 2.88, chgPct: 1.74, sl: 163.2, entry: 165.5, target: 172.8, potentialLeftPct: 2.6 },
  { id: "c2", category: "intraday", side: "buy", createdOn: "24 Oct, 9:22 AM", source: "Upstox Research", symbol: "ICICIBANK", expiry: "Intraday", ltp: 1328.6, chg: 14.2, chgPct: 1.08, sl: 1305.0, entry: 1312.0, target: 1355.0, potentialLeftPct: 1.98 },
  { id: "c3", category: "intraday", side: "sell", createdOn: "24 Oct, 9:30 AM", source: "Upstox Research", symbol: "INFY", expiry: "Intraday", ltp: 1910.0, chg: -8.5, chgPct: -0.44, sl: 1935.0, entry: 1925.0, target: 1885.0, potentialLeftPct: 1.3 },
  { id: "d1", category: "equity", side: "buy", createdOn: "23 Oct, 3:40 PM", source: "Upstox Research", symbol: "LT", expiry: "Positional", ltp: 3842.0, chg: 56.0, chgPct: 1.48, sl: 3680.0, entry: 3725.0, target: 4020.0, potentialLeftPct: 4.6 },
  { id: "d2", category: "equity", side: "buy", createdOn: "22 Oct, 2:15 PM", source: "Upstox Research", symbol: "ASIANPAINT", expiry: "Positional", ltp: 2848.5, chg: 32.5, chgPct: 1.15, sl: 2760.0, entry: 2795.0, target: 2950.0, potentialLeftPct: 3.55 },
  { id: "d3", category: "equity", side: "buy", createdOn: "21 Oct, 11:50 AM", source: "Upstox Research", symbol: "SUNPHARMA", expiry: "Positional", ltp: 1762.2, chg: 18.7, chgPct: 1.07, sl: 1710.0, entry: 1735.0, target: 1820.0, potentialLeftPct: 3.28 },
  { id: "e1", category: "commodity", side: "buy", createdOn: "24 Oct, 8:45 AM", source: "Upstox Research", symbol: "GOLDM 05DEC", expiry: "05 Dec 25", ltp: 72450, chg: 420, chgPct: 0.58, sl: 71200, entry: 71800, target: 74200, potentialLeftPct: 2.4 },
  { id: "e2", category: "commodity", side: "sell", createdOn: "23 Oct, 6:20 PM", source: "Upstox Research", symbol: "SILVERM 30NOV", expiry: "30 Nov 25", ltp: 91820, chg: -310, chgPct: -0.34, sl: 93500, entry: 92800, target: 89500, potentialLeftPct: 2.1 },
  { id: "e3", category: "commodity", side: "buy", createdOn: "22 Oct, 5:00 PM", source: "Upstox Research", symbol: "CRUDEOIL 19NOV", expiry: "19 Nov 25", ltp: 5826, chg: 42, chgPct: 0.73, sl: 5680, entry: 5750, target: 5980, potentialLeftPct: 2.65 },
];

/** Upstox TradingView web terminal — appropriate follow-up from shared advisory context. */
const UPSTOX_ADVISORY_DEEPLINK = "https://tv.upstox.com/trading-terminal/";

const FILTER_CHIPS: { id: AdvCategory; label: string }[] = [
  { id: "fno", label: "F&O" },
  { id: "mtf", label: "MTF" },
  { id: "intraday", label: "Intraday" },
  { id: "equity", label: "Equity" },
  { id: "commodity", label: "Commodity" },
];

function countInCategory(cat: AdvCategory) {
  return ADVISORY_PICKS.filter((p) => p.category === cat).length;
}

function fmtNum(n: number) {
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function buildCardMessage(p: AdvisoryPick) {
  const dir = p.side === "buy" ? "Buy" : "Sell";
  return `📈 *SEBI-registered advisory* (${dir})\n\n*${p.symbol}*\nExpiry: ${p.expiry}\nLTP: ${fmtNum(p.ltp)}\n\nSL ${fmtNum(p.sl)} · Entry ${fmtNum(p.entry)} · Target ${fmtNum(p.target)}\n~${p.potentialLeftPct}% potential left\n\nOpen charts & trade on Upstox:\n${UPSTOX_ADVISORY_DEEPLINK}`;
}

function buildSectionMessage(picks: AdvisoryPick[]) {
  const lines = picks.map(
    (p) =>
      `• *${p.symbol}* (${p.expiry}) — ${p.side === "buy" ? "Buy" : "Sell"}\n  LTP ${fmtNum(p.ltp)} · SL/Entry/Tgt ${fmtNum(p.sl)}/${fmtNum(p.entry)}/${fmtNum(p.target)}`,
  );
  return `📈 *Advisory picks (${picks.length})*\n\n${lines.join("\n\n")}\n\nOpen charts & trade on Upstox:\n${UPSTOX_ADVISORY_DEEPLINK}`;
}

// ── Card ────────────────────────────────────────────────────────────────────

function AdvisoryCard({
  pick,
  checked,
  onToggle,
  onShare,
}: {
  pick: AdvisoryPick;
  checked: boolean;
  onToggle: () => void;
  onShare: (e: MouseEvent) => void;
}) {
  const up = pick.chg >= 0;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      className={`relative flex w-[min(100%,298px)] shrink-0 cursor-pointer flex-col gap-3 rounded-xl border p-3 transition-colors ${
        checked ? "border-primary/50 bg-primary/5" : "border-border bg-card hover:bg-muted/20"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <input
          type="checkbox"
          checked={checked}
          onClick={(e) => e.stopPropagation()}
          onChange={onToggle}
          className="h-3.5 w-3.5 rounded border-border text-primary accent-primary"
          aria-label={`Select ${pick.symbol}`}
        />
        <button
          type="button"
          onClick={onShare}
          className="inline-flex shrink-0 items-center gap-1 rounded-md border border-primary/30 bg-primary/5 px-2 py-1 text-[11px] font-medium text-primary hover:bg-primary/10"
        >
          <Share2 className="h-3 w-3" />
          Share
        </button>
      </div>

      <div className="flex items-center justify-between gap-2 text-[10px] text-muted-foreground">
        <span>Created on: {pick.createdOn}</span>
        <span className="inline-flex items-center gap-0.5 shrink-0">
          {pick.source}
          <Info className="h-3 w-3 opacity-70" aria-hidden />
        </span>
      </div>

      <div className="h-px bg-border" />

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">{pick.symbol}</p>
          <p className="text-[10px] text-muted-foreground">{pick.expiry}</p>
        </div>
        <div className="text-right shrink-0">
          <p className={`text-xs font-medium tabular-nums ${up ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
            {fmtNum(pick.ltp)}
          </p>
          <p className={`text-[10px] tabular-nums ${up ? "text-emerald-600/90 dark:text-emerald-400/90" : "text-red-600/90"}`}>
            {up ? "+" : ""}
            {fmtNum(pick.chg)} ({up ? "+" : ""}
            {pick.chgPct.toFixed(2)}%)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { k: "Stop-loss", v: fmtNum(pick.sl) },
          { k: "Entry", v: fmtNum(pick.entry) },
          { k: "Target", v: fmtNum(pick.target) },
        ].map(({ k, v }) => (
          <div key={k} className="min-w-0">
            <p className="text-[10px] text-muted-foreground">{k}</p>
            <p className="text-xs font-medium tabular-nums text-foreground truncate">{v}</p>
          </div>
        ))}
      </div>

      <div className="h-px bg-border" />

      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5 rounded-md bg-gradient-to-r from-emerald-500/15 to-transparent px-2 py-1.5 dark:from-emerald-500/20">
          <TrendingUp className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div className="min-w-0">
            <p className="text-sm font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">{pick.potentialLeftPct.toFixed(2)}%</p>
            <p className="text-[10px] text-muted-foreground leading-none">Potential left</p>
          </div>
        </div>
        <span
          className={`shrink-0 text-right text-xs font-semibold tabular-nums ${
            pick.side === "buy"
              ? "text-emerald-700 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {pick.side === "buy" ? "Buy" : "Sell"}
        </span>
      </div>
    </div>
  );
}

// ── Section ─────────────────────────────────────────────────────────────────

export function AdvisorySection() {
  const [active, setActive] = useState<AdvCategory>("fno");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [shareModal, setShareModal] = useState<{ title: string; message: string } | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => ADVISORY_PICKS.filter((p) => p.category === active),
    [active],
  );

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function openSectionShare() {
    const picks =
      selected.size > 0 ? filtered.filter((p) => selected.has(p.id)) : filtered;
    setShareModal({
      title:
        selected.size > 0
          ? `Share advisory (${selected.size})`
          : `Share advisory — ${FILTER_CHIPS.find((c) => c.id === active)?.label ?? ""}`,
      message: buildSectionMessage(picks),
    });
  }

  return (
    <>
      <div className="px-4 py-6">
        <div className="relative isolate w-full overflow-hidden rounded-lg border border-border bg-card">
          <div
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
            aria-hidden
          >
            <div className="absolute -top-24 left-1/2 h-56 w-[140%] -translate-x-1/2 rounded-full bg-primary/20 blur-[60px]" />
            <div className="absolute -bottom-16 -right-12 h-48 w-48 rounded-full bg-cyan-500/20 blur-[70px] dark:bg-cyan-400/15" />
            <div className="absolute top-1/3 -left-16 h-44 w-44 rounded-full bg-primary/15 blur-[56px]" />
          </div>

          <div className="relative z-[1] flex flex-col">
            <div className="flex flex-col gap-4 px-5 pt-5 pb-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0 space-y-2">
                <div className="inline-flex rounded bg-gradient-to-r from-sky-100/90 to-transparent px-1.5 py-0.5 dark:from-sky-950/60">
                  <span className="text-[10px] font-semibold text-sky-900 dark:text-sky-200">
                    10k+ orders today
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  <Sparkles className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <span className="text-base font-bold text-foreground">Advisory</span>
                  <span className="text-xs text-muted-foreground">by SEBI experts</span>
                  <button
                    type="button"
                    className="rounded p-0.5 text-muted-foreground hover:text-foreground"
                    aria-label="About advisory"
                  >
                    <HelpCircle className="h-4 w-4" />
                  </button>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden />
                </div>
              </div>
              <button
                type="button"
                onClick={openSectionShare}
                className="inline-flex shrink-0 items-center gap-1.5 self-start text-xs font-medium text-primary hover:text-primary/80 sm:self-auto"
              >
                <Share2 className="h-3.5 w-3.5" />
                Share
                {selected.size > 0 ? ` (${selected.size})` : ""}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 px-5 pb-4">
              {FILTER_CHIPS.map(({ id, label }) => {
                const n = countInCategory(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setActive(id);
                      setSelected(new Set());
                    }}
                    className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      active === id
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border bg-card text-foreground hover:border-primary/35"
                    }`}
                  >
                    {label} ({n})
                  </button>
                );
              })}
            </div>

            <div className="relative px-5 pb-5">
              <div
                ref={scrollerRef}
                className="flex gap-3 overflow-x-auto pb-1 scroll-smooth"
              >
                {filtered.map((pick) => (
                  <AdvisoryCard
                    key={pick.id}
                    pick={pick}
                    checked={selected.has(pick.id)}
                    onToggle={() => toggle(pick.id)}
                    onShare={(e) => {
                      e.stopPropagation();
                      setShareModal({ title: pick.symbol, message: buildCardMessage(pick) });
                    }}
                  />
                ))}
              </div>
              <button
                type="button"
                className="absolute right-3 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md border border-primary/20 bg-card/95 text-foreground shadow-md backdrop-blur-sm md:flex"
                aria-label="Scroll advisory cards right"
                onClick={() =>
                  scrollerRef.current?.scrollBy({ left: 300, behavior: "smooth" })
                }
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {shareModal && (
        <ServicingShareModal
          title={shareModal.title}
          subtitle="Select customers to send via WhatsApp"
          message={shareModal.message}
          onClose={() => setShareModal(null)}
        />
      )}
    </>
  );
}
