import { customerRows } from "./data";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CustomerSegment = "EQ" | "FO" | "Commodities" | "MF" | "Currency";

export type CustomerProfile = {
  ucc: string;
  name: string;
  pan: string;
  email: string;
  phone: string;
  dob: string;
  segments: CustomerSegment[];
  accountOpenedDate: string;
  lastTradedDate: string;
};

export type FinancialOverview = {
  equityAum: number;
  mfAum: number;
  totalAum: number;
  availableToTrade: number;
  netLedgerBalance: number;
  brokerageMtd: number;
};

export type EquityHolding = {
  stockName: string;
  qty: number;
  avgPrice: number;
  currentPrice: number;
  invested: number;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
};

export type MutualFundHolding = {
  fundName: string;
  folio: string;
  units: number;
  nav: number;
  invested: number;
  currentValue: number;
  returns: number;
  returnsPercent: number;
};

export type TradeRecord = {
  date: string;
  instrument: string;
  segment: "EQ" | "FO" | "Commodities" | "Currency";
  side: "Buy" | "Sell";
  qty: number;
  price: number;
  value: number;
};

export type ActivityItem = {
  date: string;
  description: string;
  type: "trade" | "sip" | "deposit" | "withdrawal" | "dividend";
};

export type PnlSummary = {
  realizedPnl: number;
  unrealizedPnl: number;
  totalPnl: number;
};

export type AumBreakdown = {
  equity: number;
  mf: number;
  cash: number;
};

export type CustomerDetail = {
  profile: CustomerProfile;
  financial: FinancialOverview;
  equityHoldings: EquityHolding[];
  mfHoldings: MutualFundHolding[];
  recentTrades: TradeRecord[];
  activities: ActivityItem[];
  pnlSummary: PnlSummary;
  aumBreakdown: AumBreakdown;
};

// ---------------------------------------------------------------------------
// Masking Utilities
// ---------------------------------------------------------------------------

export function maskPan(pan: string): string {
  if (pan.length < 5) return "***";
  return pan.slice(0, 4) + "*".repeat(pan.length - 5) + pan.slice(-1);
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  return local.slice(0, 3) + "***@" + domain;
}

export function maskPhone(phone: string): string {
  if (phone.length <= 6) return "*".repeat(phone.length);
  return "*".repeat(6) + phone.slice(6);
}

export function maskDob(dob: string): string {
  const parts = dob.split(" ");
  if (parts.length < 3) return "** *** ****";
  return `** ${parts[1]} ****`;
}

// ---------------------------------------------------------------------------
// Currency formatter
// ---------------------------------------------------------------------------

export function formatINR(n: number): string {
  const abs = Math.abs(n);
  const formatted = abs.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });
  return n < 0 ? `-Rs ${formatted}` : `Rs ${formatted}`;
}

// ---------------------------------------------------------------------------
// Helpers for generating mock data
// ---------------------------------------------------------------------------

function parseRs(s: string): number {
  return Number(s.replace(/Rs\s?/, "").replace(/,/g, "")) || 0;
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const STOCKS = [
  { name: "Reliance Industries", base: 2480 },
  { name: "TCS", base: 3920 },
  { name: "HDFC Bank", base: 1690 },
  { name: "Infosys", base: 1580 },
  { name: "ITC", base: 468 },
  { name: "SBI", base: 820 },
  { name: "Bharti Airtel", base: 1720 },
  { name: "L&T", base: 3400 },
  { name: "Bajaj Finance", base: 7400 },
  { name: "HUL", base: 2380 },
];

const FUNDS = [
  { name: "Axis Growth Opportunities Fund", folio: "AX" },
  { name: "ICICI Prudential Bluechip Fund", folio: "IC" },
  { name: "Mirae Asset Emerging Bluechip Fund", folio: "MA" },
  { name: "SBI Equity Hybrid Fund", folio: "SB" },
  { name: "HDFC Flexi Cap Fund", folio: "HD" },
  { name: "Kotak Small Cap Fund", folio: "KO" },
];

const SEGMENTS: CustomerSegment[][] = [
  ["EQ", "FO", "MF"],
  ["EQ", "FO", "Commodities", "MF"],
  ["EQ", "MF"],
  ["EQ", "FO", "Currency", "MF"],
  ["EQ", "FO"],
];

const INSTRUMENTS = [
  "RELIANCE", "TCS", "INFY", "HDFCBANK", "ICICIBANK",
  "NIFTY 18500 CE", "NIFTY 18400 PE", "BANKNIFTY 43200 CE",
  "SBIN", "BHARTIARTL", "ITC",
];

function generateDetail(ucc: string, name: string, equityAumStr: string, mfAumStr: string, lastTraded: string, brokerageStr: string): CustomerDetail {
  const rand = seededRandom(ucc.split("").reduce((a, c) => a + c.charCodeAt(0), 0));

  const equityAum = parseRs(equityAumStr);
  const mfAum = parseRs(mfAumStr);
  const brokerage = parseRs(brokerageStr);

  // Profile
  const firstNameLower = name.split(" ")[0].toLowerCase();
  const profile: CustomerProfile = {
    ucc,
    name,
    pan: `${name.slice(0, 3).toUpperCase()}P${String(Math.floor(rand() * 9000 + 1000))}${String.fromCharCode(65 + Math.floor(rand() * 26))}`,
    email: `${firstNameLower}.${name.split(" ").slice(-1)[0].toLowerCase().slice(0, 4)}@gmail.com`,
    phone: `9${String(Math.floor(rand() * 900000000 + 100000000))}`,
    dob: `${String(Math.floor(rand() * 28 + 1)).padStart(2, "0")} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][Math.floor(rand() * 12)]} ${Math.floor(rand() * 20 + 1975)}`,
    segments: SEGMENTS[Math.floor(rand() * SEGMENTS.length)],
    accountOpenedDate: `${String(Math.floor(rand() * 28 + 1)).padStart(2, "0")} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"][Math.floor(rand() * 8)]} ${Math.floor(rand() * 4 + 2020)}`,
    lastTradedDate: lastTraded,
  };

  // Financial
  const cash = Math.floor(rand() * 200000 + 20000);
  const totalAum = equityAum + mfAum + cash;
  const financial: FinancialOverview = {
    equityAum,
    mfAum,
    totalAum,
    availableToTrade: cash,
    netLedgerBalance: Math.floor(rand() * 100000 - 20000),
    brokerageMtd: brokerage,
  };

  // Equity Holdings
  const numStocks = Math.floor(rand() * 4 + 4); // 4-7
  const equityHoldings: EquityHolding[] = [];
  const usedStocks = new Set<number>();
  for (let i = 0; i < numStocks; i++) {
    let idx: number;
    do { idx = Math.floor(rand() * STOCKS.length); } while (usedStocks.has(idx));
    usedStocks.add(idx);
    const stock = STOCKS[idx];
    const qty = Math.floor(rand() * 200 + 5);
    const avgPrice = Math.floor(stock.base * (0.85 + rand() * 0.3));
    const currentPrice = Math.floor(stock.base * (0.9 + rand() * 0.25));
    const invested = qty * avgPrice;
    const currentValue = qty * currentPrice;
    equityHoldings.push({
      stockName: stock.name,
      qty,
      avgPrice,
      currentPrice,
      invested,
      currentValue,
      pnl: currentValue - invested,
      pnlPercent: Number((((currentValue - invested) / invested) * 100).toFixed(2)),
    });
  }

  // MF Holdings
  const numFunds = Math.floor(rand() * 3 + 3); // 3-5
  const mfHoldings: MutualFundHolding[] = [];
  const usedFunds = new Set<number>();
  for (let i = 0; i < numFunds; i++) {
    let idx: number;
    do { idx = Math.floor(rand() * FUNDS.length); } while (usedFunds.has(idx));
    usedFunds.add(idx);
    const fund = FUNDS[idx];
    const units = Number((rand() * 800 + 50).toFixed(3));
    const nav = Number((rand() * 150 + 20).toFixed(2));
    const invested = Math.floor(rand() * 200000 + 20000);
    const currentValue = Math.floor(units * nav);
    mfHoldings.push({
      fundName: fund.name,
      folio: `${fund.folio}${Math.floor(rand() * 90000 + 10000)}`,
      units,
      nav,
      invested,
      currentValue,
      returns: currentValue - invested,
      returnsPercent: Number((((currentValue - invested) / invested) * 100).toFixed(2)),
    });
  }

  // Recent Trades
  const recentTrades: TradeRecord[] = [];
  for (let i = 0; i < 8; i++) {
    const dayOffset = Math.floor(rand() * 14);
    const d = new Date(2026, 2, 19 - dayOffset);
    const day = String(d.getDate()).padStart(2, "0");
    const mon = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getMonth()];
    const instrument = INSTRUMENTS[Math.floor(rand() * INSTRUMENTS.length)];
    const isFO = instrument.includes(" ");
    const segment: TradeRecord["segment"] = isFO ? "FO" : "EQ";
    const side: "Buy" | "Sell" = rand() > 0.5 ? "Buy" : "Sell";
    const qty = isFO ? Math.floor(rand() * 10 + 1) * 50 : Math.floor(rand() * 200 + 5);
    const price = isFO ? Number((rand() * 300 + 10).toFixed(2)) : Math.floor(rand() * 3000 + 200);
    recentTrades.push({
      date: `${day} ${mon} 2026`,
      instrument,
      segment,
      side,
      qty,
      price,
      value: Math.floor(qty * price),
    });
  }

  // P&L Summary
  const realizedPnl = Math.floor(rand() * 300000 - 80000);
  const unrealizedPnl = equityHoldings.reduce((s, h) => s + h.pnl, 0);
  const pnlSummary: PnlSummary = {
    realizedPnl,
    unrealizedPnl,
    totalPnl: realizedPnl + unrealizedPnl,
  };

  // AUM Breakdown
  const aumBreakdown: AumBreakdown = {
    equity: equityAum,
    mf: mfAum,
    cash,
  };

  // Activities
  const actTypes: ActivityItem["type"][] = ["trade", "sip", "deposit", "withdrawal", "dividend"];
  const actDescs: Record<string, string[]> = {
    trade: ["Bought 50 shares of Reliance", "Sold 100 shares of TCS", "Bought NIFTY 18500 CE"],
    sip: ["SIP executed - Axis Growth Fund Rs 5,000", "SIP executed - ICICI Bluechip Rs 10,000"],
    deposit: ["Funds deposited Rs 50,000", "Funds deposited Rs 1,00,000"],
    withdrawal: ["Funds withdrawn Rs 25,000", "Funds withdrawn Rs 15,000"],
    dividend: ["Dividend received from ITC Rs 1,200", "Dividend received from HDFC Bank Rs 850"],
  };
  const activities: ActivityItem[] = [];
  for (let i = 0; i < 5; i++) {
    const dayOff = i * 2 + Math.floor(rand() * 3);
    const d = new Date(2026, 2, 19 - dayOff);
    const day = String(d.getDate()).padStart(2, "0");
    const mon = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getMonth()];
    const type = actTypes[Math.floor(rand() * actTypes.length)];
    const descs = actDescs[type];
    activities.push({
      date: `${day} ${mon} 2026`,
      description: descs[Math.floor(rand() * descs.length)],
      type,
    });
  }

  return {
    profile,
    financial,
    equityHoldings,
    mfHoldings,
    recentTrades,
    activities,
    pnlSummary,
    aumBreakdown,
  };
}

// ---------------------------------------------------------------------------
// Build lookup map from existing customerRows
// ---------------------------------------------------------------------------

const detailMap = new Map<string, CustomerDetail>();

for (const row of customerRows) {
  detailMap.set(
    row.ucc,
    generateDetail(row.ucc, row.name, row.equityAum, row.mfAum, row.lastTradedDate, row.brokerageGeneratedLast30Days),
  );
}

export function getCustomerDetail(ucc: string): CustomerDetail | null {
  return detailMap.get(ucc) ?? null;
}
