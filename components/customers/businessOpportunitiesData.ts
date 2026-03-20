export type BusinessSectionId = "activation" | "atRisk" | "crossSell";

export type BusinessCategoryId =
  | "onboardedNotActivated"
  | "neverTraded"
  | "likelyToLapse"
  | "highFnOLosses"
  | "topFive"
  | "equityPotential"
  | "mtf"
  | "fno"
  | "ipo"
  | "intraday"
  | "mf";

export type BusinessColumnKey =
  | "ucc"
  | "clientName"
  | "accountCreationDate"
  | "status"
  | "kycCompletedOn"
  | "daysSinceOnboarding"
  | "lastTradeDate"
  | "daysInactive"
  | "netLoss30d"
  | "lossStreakDays"
  | "prevMonthRevenue"
  | "aum"
  | "interestScore"
  | "equityExposureGap"
  | "upsellValue"
  | "marginUtilization"
  | "avgVolume"
  | "derivativeReadinessScore"
  | "lastIpoClick"
  | "ipoInterestCount"
  | "sessions30d"
  | "avgHoldingTime"
  | "mfBalance"
  | "sipTopupPotential"
  | "suggestedAction";

export type BusinessColumn = {
  key: BusinessColumnKey;
  label: string;
  align?: "left" | "right";
};

export type BusinessRow = {
  id: string;
  ucc: string;
  clientName: string;
  accountCreationDate?: string;
  status?: string;
  kycCompletedOn?: string;
  daysSinceOnboarding?: string;
  lastTradeDate?: string;
  daysInactive?: string;
  netLoss30d?: string;
  lossStreakDays?: string;
  prevMonthRevenue?: string;
  aum?: string;
  interestScore?: string;
  equityExposureGap?: string;
  upsellValue?: string;
  marginUtilization?: string;
  avgVolume?: string;
  derivativeReadinessScore?: string;
  lastIpoClick?: string;
  ipoInterestCount?: string;
  sessions30d?: string;
  avgHoldingTime?: string;
  mfBalance?: string;
  sipTopupPotential?: string;
  suggestedAction: string;
};

export type BusinessCategory = {
  id: BusinessCategoryId;
  section: BusinessSectionId;
  title: string;
  subtitle: string;
  totalClients: number;
  columns: BusinessColumn[];
  rows: BusinessRow[];
};

export const BUSINESS_SECTIONS: Array<{ id: BusinessSectionId; label: string; subtitle: string }> = [
  { id: "activation", label: "Activation", subtitle: "Onboarded but not activated + never traded" },
  { id: "atRisk", label: "At Risk Clients", subtitle: "Likely to lapse, high losses, top performers" },
  { id: "crossSell", label: "Cross-sell and up-sell", subtitle: "Equity, MTF, F&O, IPO, intraday, MF" },
];

export const BUSINESS_CATEGORIES: BusinessCategory[] = [
  {
    id: "onboardedNotActivated",
    section: "activation",
    title: "Onboarded & not activated",
    subtitle: "Needs activation push",
    totalClients: 52,
    columns: [
      { key: "ucc", label: "UCC" },
      { key: "clientName", label: "Client Name" },
      { key: "accountCreationDate", label: "Account Creation Date", align: "right" },
      { key: "status", label: "Status", align: "right" },
      { key: "suggestedAction", label: "Suggested Action", align: "right" },
    ],
    rows: [
      { id: "SDKR3321", ucc: "SDKR3321", clientName: "Sandeep Kumar", accountCreationDate: "02 Mar 2026", status: "Not Activated", suggestedAction: "Send Welcome Email" },
      { id: "HMLK8842", ucc: "HMLK8842", clientName: "Harshali Mane", accountCreationDate: "01 Mar 2026", status: "Not Activated", suggestedAction: "Send Welcome Email" },
      { id: "PSHA4431", ucc: "PSHA4431", clientName: "Prasad Shah", accountCreationDate: "29 Feb 2026", status: "Activated", suggestedAction: "Send Welcome Email" },
      { id: "ABHS1190", ucc: "ABHS1190", clientName: "Amit Bhosale", accountCreationDate: "28 Feb 2026", status: "Not Activated", suggestedAction: "Send Welcome Email" },
    ],
  },
  {
    id: "neverTraded",
    section: "activation",
    title: "Never traded",
    subtitle: "KYC done but no trade yet",
    totalClients: 602,
    columns: [
      { key: "ucc", label: "UCC" },
      { key: "clientName", label: "Client Name" },
      { key: "kycCompletedOn", label: "KYC Completed On", align: "right" },
      { key: "daysSinceOnboarding", label: "Days Since Onboarding", align: "right" },
      { key: "suggestedAction", label: "Suggested Action", align: "right" },
    ],
    rows: [
      { id: "AAA6180438", ucc: "AAA6180438", clientName: "Yashodeep Kulkarni", kycCompletedOn: "19 Feb 2026", daysSinceOnboarding: "20", suggestedAction: "Share First Trade Guide" },
      { id: "PDBS8182", ucc: "PDBS8182", clientName: "Prasad Bhosale", kycCompletedOn: "16 Feb 2026", daysSinceOnboarding: "23", suggestedAction: "Share First Trade Guide" },
      { id: "M61747471", ucc: "M61747471", clientName: "Mira Trymbak Pawar", kycCompletedOn: "15 Feb 2026", daysSinceOnboarding: "24", suggestedAction: "Share First Trade Guide" },
      { id: "SHJV1174", ucc: "SHJV1174", clientName: "Samadhan Bhaskar Rakibe", kycCompletedOn: "12 Feb 2026", daysSinceOnboarding: "27", suggestedAction: "Share First Trade Guide" },
    ],
  },
  {
    id: "likelyToLapse",
    section: "atRisk",
    title: "Likely to lapse",
    subtitle: "Risk of trading drop",
    totalClients: 25,
    columns: [
      { key: "ucc", label: "UCC" },
      { key: "clientName", label: "Client Name" },
      { key: "lastTradeDate", label: "Last Trade Date", align: "right" },
      { key: "daysInactive", label: "Days Inactive", align: "right" },
      { key: "suggestedAction", label: "Suggested Action", align: "right" },
    ],
    rows: [
      { id: "SHJV1174", ucc: "SHJV1174", clientName: "Samadhan Bhaskar Rakibe", lastTradeDate: "26 Feb 2026", daysInactive: "23", suggestedAction: "Nudge to Re-engage" },
      { id: "M61747471", ucc: "M61747471", clientName: "Mira Trymbak Pawar", lastTradeDate: "24 Feb 2026", daysInactive: "25", suggestedAction: "Nudge to Re-engage" },
      { id: "B564881", ucc: "B564881", clientName: "Bhushan Subhash Shinde", lastTradeDate: "23 Feb 2026", daysInactive: "26", suggestedAction: "Nudge to Re-engage" },
    ],
  },
  {
    id: "highFnOLosses",
    section: "atRisk",
    title: "High F&O Losses",
    subtitle: "Elevated loss signals",
    totalClients: 5,
    columns: [
      { key: "ucc", label: "UCC" },
      { key: "clientName", label: "Client Name" },
      { key: "netLoss30d", label: "Net Loss (30D)", align: "right" },
      { key: "lossStreakDays", label: "Loss Streak (Days)", align: "right" },
      { key: "suggestedAction", label: "Suggested Action", align: "right" },
    ],
    rows: [
      { id: "PDBS8182", ucc: "PDBS8182", clientName: "Prasad Bhosale", netLoss30d: "Rs 1,42,000", lossStreakDays: "7", suggestedAction: "Offer Risk Review Call" },
      { id: "NTGV2197", ucc: "NTGV2197", clientName: "Nitin Gavhane", netLoss30d: "Rs 1,11,300", lossStreakDays: "6", suggestedAction: "Offer Risk Review Call" },
      { id: "AKMR7165", ucc: "AKMR7165", clientName: "Akash More", netLoss30d: "Rs 94,600", lossStreakDays: "5", suggestedAction: "Offer Risk Review Call" },
    ],
  },
  {
    id: "topFive",
    section: "atRisk",
    title: "Top 5% clients",
    subtitle: "Strong revenue performers",
    totalClients: 4,
    columns: [
      { key: "ucc", label: "UCC" },
      { key: "clientName", label: "Client Name" },
      { key: "prevMonthRevenue", label: "Revenue (Prev Month)", align: "right" },
      { key: "aum", label: "AUM / Portfolio Value", align: "right" },
      { key: "suggestedAction", label: "Suggested Action", align: "right" },
    ],
    rows: [
      { id: "VVRA3108", ucc: "VVRA3108", clientName: "Vivek Rane", prevMonthRevenue: "Rs 58,000", aum: "Rs 31.5L", suggestedAction: "Schedule Priority RM Call" },
      { id: "ANKS1472", ucc: "ANKS1472", clientName: "Aniket Shinde", prevMonthRevenue: "Rs 49,700", aum: "Rs 27.2L", suggestedAction: "Schedule Priority RM Call" },
      { id: "PRCV9324", ucc: "PRCV9324", clientName: "Priya Chavan", prevMonthRevenue: "Rs 44,300", aum: "Rs 24.8L", suggestedAction: "Schedule Priority RM Call" },
    ],
  },
  {
    id: "equityPotential",
    section: "crossSell",
    title: "Equity potential clients",
    subtitle: "High intent in equity",
    totalClients: 96,
    columns: [
      { key: "ucc", label: "UCC" },
      { key: "clientName", label: "Client Name" },
      { key: "interestScore", label: "Interest Score", align: "right" },
      { key: "equityExposureGap", label: "Equity Exposure Gap", align: "right" },
      { key: "suggestedAction", label: "Suggested Action", align: "right" },
    ],
    rows: [
      { id: "SHJV1174", ucc: "SHJV1174", clientName: "Samadhan Bhaskar Rakibe", interestScore: "86", equityExposureGap: "12%", suggestedAction: "Pitch Equity Basket" },
      { id: "M61747471", ucc: "M61747471", clientName: "Mira Trymbak Pawar", interestScore: "79", equityExposureGap: "9%", suggestedAction: "Pitch Equity Basket" },
      { id: "AAA6180438", ucc: "AAA6180438", clientName: "Yashodeep Kulkarni", interestScore: "72", equityExposureGap: "7%", suggestedAction: "Pitch Equity Basket" },
    ],
  },
  {
    id: "mtf",
    section: "crossSell",
    title: "MTF clients",
    subtitle: "Margin funding opportunities",
    totalClients: 14,
    columns: [
      { key: "ucc", label: "UCC" },
      { key: "clientName", label: "Client Name" },
      { key: "upsellValue", label: "Upsell Value", align: "right" },
      { key: "marginUtilization", label: "Margin Utilization %", align: "right" },
      { key: "suggestedAction", label: "Suggested Action", align: "right" },
    ],
    rows: [
      { id: "RSWY8821", ucc: "RSWY8821", clientName: "Rahul Suryawanshi", upsellValue: "Rs 31,200", marginUtilization: "68%", suggestedAction: "Explain MTF Offer" },
      { id: "SNIK2043", ucc: "SNIK2043", clientName: "Shruti Naik", upsellValue: "Rs 28,900", marginUtilization: "63%", suggestedAction: "Explain MTF Offer" },
      { id: "MKRD1297", ucc: "MKRD1297", clientName: "Manish Korde", upsellValue: "Rs 24,600", marginUtilization: "58%", suggestedAction: "Explain MTF Offer" },
    ],
  },
  {
    id: "fno",
    section: "crossSell",
    title: "FNO clients",
    subtitle: "Derivatives opportunity",
    totalClients: 16,
    columns: [
      { key: "ucc", label: "UCC" },
      { key: "clientName", label: "Client Name" },
      { key: "avgVolume", label: "Avg Volume", align: "right" },
      { key: "derivativeReadinessScore", label: "Derivative Readiness Score", align: "right" },
      { key: "suggestedAction", label: "Suggested Action", align: "right" },
    ],
    rows: [
      { id: "GNKD4528", ucc: "GNKD4528", clientName: "Ganesh Kadam", avgVolume: "1.8x", derivativeReadinessScore: "89", suggestedAction: "Pitch F&O Activation" },
      { id: "YGPW6731", ucc: "YGPW6731", clientName: "Yogesh Pawar", avgVolume: "1.6x", derivativeReadinessScore: "82", suggestedAction: "Pitch F&O Activation" },
      { id: "SJKL2087", ucc: "SJKL2087", clientName: "Sujata Koli", avgVolume: "1.4x", derivativeReadinessScore: "78", suggestedAction: "Pitch F&O Activation" },
    ],
  },
  {
    id: "ipo",
    section: "crossSell",
    title: "IPO clients",
    subtitle: "IPO readiness",
    totalClients: 2,
    columns: [
      { key: "ucc", label: "UCC" },
      { key: "clientName", label: "Client Name" },
      { key: "lastIpoClick", label: "Last IPO Click", align: "right" },
      { key: "ipoInterestCount", label: "Recent IPO Interest Count", align: "right" },
      { key: "suggestedAction", label: "Suggested Action", align: "right" },
    ],
    rows: [
      { id: "VVRA3108", ucc: "VVRA3108", clientName: "Vivek Rane", lastIpoClick: "2 days ago", ipoInterestCount: "4", suggestedAction: "Send IPO Alert" },
      { id: "ANKS1472", ucc: "ANKS1472", clientName: "Aniket Shinde", lastIpoClick: "5 days ago", ipoInterestCount: "3", suggestedAction: "Send IPO Alert" },
      { id: "PRCV9324", ucc: "PRCV9324", clientName: "Priya Chavan", lastIpoClick: "6 days ago", ipoInterestCount: "3", suggestedAction: "Send IPO Alert" },
    ],
  },
  {
    id: "intraday",
    section: "crossSell",
    title: "Intraday clients",
    subtitle: "Active trading frequency",
    totalClients: 96,
    columns: [
      { key: "ucc", label: "UCC" },
      { key: "clientName", label: "Client Name" },
      { key: "sessions30d", label: "Sessions (30D)", align: "right" },
      { key: "avgHoldingTime", label: "Avg Holding Time", align: "right" },
      { key: "suggestedAction", label: "Suggested Action", align: "right" },
    ],
    rows: [
      { id: "PRCV9324", ucc: "PRCV9324", clientName: "Priya Chavan", sessions30d: "24", avgHoldingTime: "32 min", suggestedAction: "Offer Intraday Toolkit" },
      { id: "KRJT5506", ucc: "KRJT5506", clientName: "Kiran Jagtap", sessions30d: "21", avgHoldingTime: "29 min", suggestedAction: "Offer Intraday Toolkit" },
      { id: "DPMN7112", ucc: "DPMN7112", clientName: "Deepali Mane", sessions30d: "18", avgHoldingTime: "25 min", suggestedAction: "Offer Intraday Toolkit" },
    ],
  },
  {
    id: "mf",
    section: "crossSell",
    title: "MF clients",
    subtitle: "MF-first opportunities",
    totalClients: 381,
    columns: [
      { key: "ucc", label: "UCC" },
      { key: "clientName", label: "Client Name" },
      { key: "mfBalance", label: "MF Balance", align: "right" },
      { key: "sipTopupPotential", label: "SIP Gap / Top-up Potential", align: "right" },
      { key: "suggestedAction", label: "Suggested Action", align: "right" },
    ],
    rows: [
      { id: "PDBS8182", ucc: "PDBS8182", clientName: "Prasad Bhosale", mfBalance: "Rs 12.5L", sipTopupPotential: "Rs 5,000", suggestedAction: "Recommend SIP Top-up" },
      { id: "M61747471", ucc: "M61747471", clientName: "Mira Trymbak Pawar", mfBalance: "Rs 9.8L", sipTopupPotential: "Rs 3,000", suggestedAction: "Recommend SIP Top-up" },
      { id: "SHJV1187", ucc: "SHJV1187", clientName: "Rahul Singh", mfBalance: "Rs 7.2L", sipTopupPotential: "Rs 2,500", suggestedAction: "Recommend SIP Top-up" },
    ],
  },
];
