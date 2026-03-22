"use client";

import { useState } from "react";
import { Download, FileText, Pencil } from "lucide-react";

// ─── Month selector ───────────────────────────────────────────────────────────
const MONTHS = [
  "Oct-24","Nov-24","Dec-24","Jan-25","Feb-25","Mar-25","Apr-25",
  "May-25","Jun-25","Jul-25","Aug-25","Sep-25","Oct-25","Nov-25",
  "Dec-25","Jan-26","Feb-26",
];

// ─── Mock invoice data ────────────────────────────────────────────────────────
const INVOICE_BY_MONTH: Record<string, {
  invoiceNo: string; date: string; placeOfSupply: string;
  billFrom: { name: string; address: string[]; gstin: string };
  items: { srNo: number; itemName: string; hsn: string; qty: number; value: number; gst: number }[];
  bank: { bank: string; branch: string; ifsc: string; account: string; holder: string };
}> = {
  "Oct-24": {
    invoiceNo: "SECUR/800001/675",
    date: "31/10/2024",
    placeOfSupply: "Mumbai, Maharashtra",
    billFrom: {
      name: "RAJESH SHARMA",
      address: ["NO 2 47A 2", "RAM NAGAR COLONY NEAR SANJAY PLACE", "AGRA", "AGRA", "UTTAR PRADESH"],
      gstin: "36BFSPP9481C1ZT",
    },
    items: [
      { srNo: 1, itemName: "Brokerage from Securities", hsn: "997152", qty: 1, value: 100, gst: 18 },
      { srNo: 2, itemName: "Brokerage from Securities", hsn: "997152", qty: 1, value: 100, gst: 18 },
    ],
    bank: { bank: "ABCD BANK LTD", branch: "MUMBAI MH INDIA", ifsc: "ABCD0000000", account: "12457896336", holder: "RAJESH SHARMA" },
  },
};
MONTHS.forEach((m) => { if (!INVOICE_BY_MONTH[m]) INVOICE_BY_MONTH[m] = INVOICE_BY_MONTH["Oct-24"]; });

// ─── Invoice History data ─────────────────────────────────────────────────────
const HISTORY_ROWS = [
  { id: 1, month: "Jun-24", date: "30/06/25 12:00 AM", company: "Rksv Commodities" },
  { id: 2, month: "Sep-24", date: "30/09/24 12:00 AM", company: "Upstox Securities" },
  { id: 3, month: "Jun 24", date: "5/05/24 12:00 AM",  company: "Upstox Securities" },
  { id: 4, month: "Jun 24", date: "5/05/24 12:00 AM",  company: "Rksv Commodities" },
];
const PAGE_SIZE = 10;

function toWords(n: number): string {
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine",
    "Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  if (n === 0) return "Zero";
  if (n < 20) return ones[n];
  if (n < 100) return tens[Math.floor(n/10)] + (n%10 ? " " + ones[n%10] : "");
  if (n < 1000) return ones[Math.floor(n/100)] + " Hundred" + (n%100 ? " " + toWords(n%100) : "");
  return toWords(Math.floor(n/1000)) + " Thousand" + (n%1000 ? " " + toWords(n%1000) : "");
}
function fmt(v: number) { return "₹" + v.toLocaleString("en-IN", { minimumFractionDigits: 2 }); }

// ─── Securities invoice view ──────────────────────────────────────────────────
function SecuritiesView() {
  const [selectedMonth, setSelectedMonth] = useState("Feb-26");
  const inv = INVOICE_BY_MONTH[selectedMonth];

  const totalValue = inv.items.reduce((s, i) => s + i.value, 0);
  const totalGst   = inv.items.reduce((s, i) => s + i.gst,   0);
  const totalAmt   = totalValue + totalGst;

  const BILL_TO = {
    name: "UPSTOX SECURITIES PVT. LTD.",
    address: ["30TH FLOOR, SUNSHINE TOWER,", "SENAPATI BAPAT MARG, DADAR (W)", "MUMBAI", "MUMBAI", "MAHARASHTRA-400013"],
    gstin: "27AAGCE3230K1ZP",
  };

  return (
    <div>
      {/* Month selector — horizontally scrollable */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-none -mx-1 px-1">
        {MONTHS.map((m) => (
          <button
            key={m}
            onClick={() => setSelectedMonth(m)}
            className={`shrink-0 px-3 h-8 rounded-full text-xs font-medium border transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
              selectedMonth === m
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Invoice */}
      <div className="max-w-3xl mx-auto">
        <p className="text-center text-sm font-bold text-foreground uppercase tracking-wider mb-3">
          Tax Invoice
        </p>

        {/* Bill From / Bill To — always 2-column */}
        <div className="border border-border rounded-sm mb-4 text-xs overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-2 divide-x divide-border border-b border-border bg-muted/10">
            <div className="px-3 py-2 font-semibold text-foreground">Bill From:</div>
            <div className="px-3 py-2 font-semibold text-foreground text-right">Bill To:</div>
          </div>
          {/* Name row */}
          <div className="grid grid-cols-2 divide-x divide-border border-b border-border">
            <div className="px-3 py-2 font-semibold text-foreground">{inv.billFrom.name}</div>
            <div className="px-3 py-2 font-semibold text-foreground text-right">{BILL_TO.name}</div>
          </div>
          {/* Address rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-2 divide-x divide-border border-b border-border last:border-b-0">
              <div className="px-3 py-1.5 text-muted-foreground">{inv.billFrom.address[i] ?? ""}</div>
              <div className="px-3 py-1.5 text-muted-foreground text-right">{BILL_TO.address[i] ?? ""}</div>
            </div>
          ))}
          {/* GSTIN row */}
          <div className="grid grid-cols-2 divide-x divide-border border-t border-border">
            <div className="px-3 py-2 text-muted-foreground">{inv.billFrom.gstin}</div>
            <div className="px-3 py-2 text-muted-foreground text-right">{BILL_TO.gstin}</div>
          </div>
        </div>

        {/* Invoice meta */}
        <div className="space-y-1 mb-4 text-xs sm:text-sm">
          <p>
            <span className="font-semibold text-foreground">Invoice No:</span>{" "}
            <span className="text-muted-foreground">{inv.invoiceNo}</span>
            <button className="ml-1.5 text-primary hover:text-primary/80" title="Edit">
              <Pencil size={11} />
            </button>
          </p>
          <p><span className="font-semibold text-foreground">Date of Invoice:</span>{" "}<span className="text-muted-foreground">{inv.date}</span></p>
          <p><span className="font-semibold text-foreground">Place of Supply:</span>{" "}<span className="text-muted-foreground">{inv.placeOfSupply}</span></p>
        </div>

        {/* Items table — scrollable on mobile */}
        <div className="overflow-x-auto mb-4 border border-border rounded-sm">
          <table className="w-full text-xs sm:text-sm" style={{ minWidth: 480 }}>
            <thead className="bg-muted/30">
              <tr className="divide-x divide-border border-b border-border">
                {["Sr No.","Item Name","HSN/SAC","Qty","Value","GST","Amount"].map((h) => (
                  <th key={h} className="px-2 sm:px-3 py-2 text-center font-semibold text-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inv.items.map((item) => (
                <tr key={item.srNo} className="divide-x divide-border border-b border-border">
                  <td className="px-2 sm:px-3 py-2 text-center text-muted-foreground">{item.srNo}</td>
                  <td className="px-2 sm:px-3 py-2 text-muted-foreground">{item.itemName}</td>
                  <td className="px-2 sm:px-3 py-2 text-center text-muted-foreground">{item.hsn}</td>
                  <td className="px-2 sm:px-3 py-2 text-center text-muted-foreground">{item.qty}</td>
                  <td className="px-2 sm:px-3 py-2 text-right text-muted-foreground">{fmt(item.value)}</td>
                  <td className="px-2 sm:px-3 py-2 text-right text-muted-foreground">{fmt(item.gst)}</td>
                  <td className="px-2 sm:px-3 py-2 text-right text-muted-foreground">{fmt(item.value + item.gst)}</td>
                </tr>
              ))}
              <tr className="divide-x divide-border bg-muted/20">
                <td className="px-2 sm:px-3 py-2" />
                <td className="px-2 sm:px-3 py-2 text-center font-semibold text-foreground">Total</td>
                <td className="px-2 sm:px-3 py-2" /><td className="px-2 sm:px-3 py-2" />
                <td className="px-2 sm:px-3 py-2 text-right font-semibold text-foreground">{fmt(totalValue)}</td>
                <td className="px-2 sm:px-3 py-2 text-right font-semibold text-foreground">{fmt(totalGst)}</td>
                <td className="px-2 sm:px-3 py-2 text-right font-semibold text-foreground">{fmt(totalAmt)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Amount in words */}
        <p className="text-xs sm:text-sm mb-4">
          <span className="font-semibold text-foreground">Invoice Amount in Words:</span>{" "}
          <span className="text-muted-foreground">{toWords(totalAmt)} Rupee Only</span>
        </p>

        {/* Tax breakdown — scrollable on mobile */}
        <div className="overflow-x-auto mb-4 border border-border rounded-sm">
          <table className="w-full text-xs sm:text-sm" style={{ minWidth: 320 }}>
            <thead className="bg-muted/30">
              <tr className="divide-x divide-border border-b border-border">
                {["Tax Type","Taxable Amount","Rate of Tax","Tax Amount"].map((h) => (
                  <th key={h} className="px-2 sm:px-3 py-2 text-center font-semibold text-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { type: "CGST", amt: totalValue, rate: "9%", tax: totalGst / 2 },
                { type: "SGST", amt: totalValue, rate: "9%", tax: totalGst / 2 },
              ].map((row) => (
                <tr key={row.type} className="divide-x divide-border border-b border-border last:border-b-0">
                  <td className="px-2 sm:px-3 py-2 text-center text-muted-foreground">{row.type}</td>
                  <td className="px-2 sm:px-3 py-2 text-center text-muted-foreground">{fmt(row.amt)}</td>
                  <td className="px-2 sm:px-3 py-2 text-center text-muted-foreground">{row.rate}</td>
                  <td className="px-2 sm:px-3 py-2 text-center text-muted-foreground">{fmt(row.tax)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bank + Signatory — always 2-column */}
        <div className="border border-border rounded-sm mb-4 text-xs overflow-hidden">
          {[
            `Bank Details: ${inv.bank.bank}`,
            `Branch Name: ${inv.bank.branch}`,
            `IFSC Code: ${inv.bank.ifsc}`,
            `Account Number: ${inv.bank.account}`,
            `Account Holders Name: ${inv.bank.holder}`,
          ].map((row, i) => (
            <div key={i} className="grid grid-cols-2 divide-x divide-border border-b border-border last:border-b-0">
              <div className="px-3 py-2 text-muted-foreground">{row}</div>
              <div className="px-3 py-2 text-right text-muted-foreground">
                {i === 0 && <span className="font-semibold text-foreground">For {inv.billFrom.name}</span>}
                {i === 2 && (
                  <div className="mt-1 h-12 flex justify-end items-center">
                    <div className="h-9 w-20 rounded border border-border bg-muted/20 flex items-center justify-center text-xs font-bold text-primary/60 italic">
                      Signature
                    </div>
                  </div>
                )}
                {i === 4 && <span className="text-xs text-muted-foreground">Authorized Signatory</span>}
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mb-5">
          <span className="font-semibold">Note :</span> This is a computer generated Invoice
        </p>

        {/* Actions — stacked on mobile */}
        <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3">
          <button type="button" className="w-full sm:w-auto h-9 px-5 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
            Submit
          </button>
          <button type="button" className="w-full sm:w-auto h-9 px-5 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
            <Download size={14} />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Invoice History view ─────────────────────────────────────────────────────
function InvoiceHistoryView() {
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(HISTORY_ROWS.length / PAGE_SIZE);
  const rows = HISTORY_ROWS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE + 1;
  const end   = Math.min(page * PAGE_SIZE, HISTORY_ROWS.length);

  return (
    <div>
      {/* Table — scrollable on mobile */}
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full text-xs sm:text-sm" style={{ minWidth: 400 }}>
          <thead className="bg-muted/20 border-b border-border">
            <tr>
              {["Month of Invoice","Date of Invoice","Company Name","Action"].map((h) => (
                <th key={h} className={`px-3 sm:px-4 py-3 font-semibold text-foreground whitespace-nowrap ${h === "Action" ? "text-right" : "text-left"}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-muted/10 transition-colors">
                <td className="px-3 sm:px-4 py-3 text-muted-foreground">{row.month}</td>
                <td className="px-3 sm:px-4 py-3 text-muted-foreground">{row.date}</td>
                <td className="px-3 sm:px-4 py-3 text-muted-foreground">{row.company}</td>
                <td className="px-3 sm:px-4 py-3 text-right">
                  <button type="button" title="Download"
                    className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-border hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-colors">
                    <Download size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm text-muted-foreground">
        <span>
          Showing <strong className="text-foreground">{start} to {end}</strong> of{" "}
          <strong className="text-foreground">{HISTORY_ROWS.length}</strong> entries
        </span>
        <div className="flex items-center gap-1">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
            className="h-8 w-8 rounded-md border border-border flex items-center justify-center text-foreground disabled:opacity-40 hover:bg-muted/30 transition-colors">‹</button>
          <button onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page >= pageCount}
            className="h-8 w-8 rounded-md border border-border flex items-center justify-center text-foreground disabled:opacity-40 hover:bg-muted/30 transition-colors">›</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
type SubTab = "Securities" | "Invoice History";

export function GSTInvoicesTab() {
  const [subTab, setSubTab] = useState<SubTab>("Securities");

  return (
    <main className="flex-1 p-4 sm:p-6">
      <h2 className="flex items-center gap-2 border-l-[3px] border-primary pl-3 text-lg font-semibold text-foreground tracking-tight mb-5">
        <FileText size={18} className="text-primary shrink-0" />
        GST Invoice
      </h2>

      <div className="flex gap-6 border-b border-border mb-6">
        {(["Securities", "Invoice History"] as SubTab[]).map((tab) => (
          <button key={tab} onClick={() => setSubTab(tab)}
            className={`pb-2 text-sm font-medium border-b-2 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
              subTab === tab ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-foreground"
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {subTab === "Securities"      && <SecuritiesView />}
      {subTab === "Invoice History" && <InvoiceHistoryView />}
    </main>
  );
}
