"use client";

import { useMemo, useState } from "react";
import { ChevronRight, Eye, EyeOff, UserPlus } from "lucide-react";
import { onboardingRows, onboardingSteps, type OnboardingStatus } from "../data";

const WhatsAppIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const STATUS_FILTERS: OnboardingStatus[] = ["Open", "Rejected", "Scrutiny"];
const COMPLETE_APPLICATION_URL = "https://upstox.com/customer-onboarding/verify/pan/";
const TIME_INTERVALS = [
  { id: "7d",  label: "Last 7 days",  shortLabel: "7D",  days: 7 },
  { id: "15d", label: "Last 15 days", shortLabel: "15D", days: 15 },
  { id: "30d", label: "Last 30 days", shortLabel: "30D", days: 30 },
  { id: "all", label: "All time",     shortLabel: "All", days: null },
] as const;

type TimeIntervalId = (typeof TIME_INTERVALS)[number]["id"];

function parseDdMmYyyy(value: string) {
  const [datePart] = value.split(" ");
  const [dd, mm, yyyy] = datePart.split("-").map(Number);
  return new Date(yyyy, mm - 1, dd);
}

function maskPhone(phoneNumber: string) {
  if (phoneNumber.length <= 6) return "*".repeat(phoneNumber.length);
  return `${"*".repeat(6)}${phoneNumber.slice(6)}`;
}

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const visible = local.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(local.length - 2, 3))}@${domain}`;
}

function buildWhatsAppUrl(name: string, phoneNumber: string, currentStepTitle: string) {
  const message = `Hi ${name}! 👋

Your Upstox account opening is almost complete — you're just a step away!

You're currently at the *${currentStepTitle}* step. Completing it takes less than 2 minutes.

Here's why thousands of investors choose Upstox:
✅ Zero brokerage on delivery trades
✅ Advanced charting & research tools
✅ Instant account activation
✅ Trusted by 1 Cr+ investors

Complete your application now 👉 https://upstox.com/open-account/

Need help? Reply here and I'll guide you through it!`;

  const cleanPhone = phoneNumber.replace(/\D/g, "");
  const intlPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
  return `https://wa.me/${intlPhone}?text=${encodeURIComponent(message)}`;
}

export function ClientOnboardingLeadsPanel() {
  const [activeStatus, setActiveStatus] = useState<OnboardingStatus>("Open");
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [timeInterval, setTimeInterval] = useState<TimeIntervalId>("30d");
  const [revealedPhones, setRevealedPhones] = useState<Record<string, boolean>>({});
  const [revealedEmails, setRevealedEmails] = useState<Record<string, boolean>>({});

  const statusFilteredRows = useMemo(
    () => onboardingRows.filter((row) => row.status === activeStatus),
    [activeStatus]
  );

  const stepFilteredRows = useMemo(() => {
    if (activeStep === null) return statusFilteredRows;
    return statusFilteredRows.filter((row) => row.currentStep === activeStep);
  }, [activeStep, statusFilteredRows]);

  const timeFilteredRows = useMemo(() => {
    const selectedInterval = TIME_INTERVALS.find((option) => option.id === timeInterval);
    if (!selectedInterval || selectedInterval.days === null || stepFilteredRows.length === 0) {
      return stepFilteredRows;
    }

    const latestLeadDate = stepFilteredRows.reduce((latest, row) => {
      const rowDate = parseDdMmYyyy(row.dateCreated);
      return rowDate > latest ? rowDate : latest;
    }, parseDdMmYyyy(stepFilteredRows[0].dateCreated));

    const threshold = new Date(latestLeadDate);
    threshold.setDate(threshold.getDate() - selectedInterval.days);

    return stepFilteredRows.filter((row) => parseDdMmYyyy(row.dateCreated) >= threshold);
  }, [stepFilteredRows, timeInterval]);

  const stepCounts = useMemo(() => {
    const counts = new Map<number, number>();
    onboardingSteps.forEach((step) => counts.set(step.id, 0));
    statusFilteredRows.forEach((row) => {
      counts.set(row.currentStep, (counts.get(row.currentStep) ?? 0) + 1);
    });
    return counts;
  }, [statusFilteredRows]);

  const handleStepClick = (stepId: number) => {
    setActiveStep((prev) => (prev === stepId ? null : stepId));
  };

  const togglePhoneVisibility = (rowId: string) => {
    setRevealedPhones((prev) => ({ ...prev, [rowId]: !prev[rowId] }));
  };

  const toggleEmailVisibility = (rowId: string) => {
    setRevealedEmails((prev) => ({ ...prev, [rowId]: !prev[rowId] }));
  };

  return (
    <section className="px-3 py-3">
      <div className="px-0 py-0">
        <h3 className="flex items-center gap-2 border-l-[3px] border-primary pl-3 text-lg font-semibold tracking-tight text-foreground">
          <UserPlus size={18} className="text-primary shrink-0" />
          Client Onboarding Leads
        </h3>
        <div className="mt-1 text-xs text-muted-foreground">The report contains lead data for 30 days and refreshes every 15 minutes.</div>
      </div>
      {/* Mobile: horizontal scrollable step pills (hidden on xl+) */}
      <div className="mt-3 xl:hidden overflow-x-auto pb-1">
        <div className="flex gap-2 min-w-max">
          <button
            type="button"
            onClick={() => setActiveStep(null)}
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-medium transition-colors shrink-0 ${
              activeStep === null
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            All Steps
          </button>
          {onboardingSteps.map((step) => {
            const isSelected = activeStep === step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => handleStepClick(step.id)}
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-medium transition-colors shrink-0 ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span className="whitespace-nowrap">{step.id}. {step.title}</span>
                <span className="inline-flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                  {stepCounts.get(step.id) ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="hidden xl:block rounded-md border border-border bg-card overflow-hidden">
          <div className="p-3 border-b border-border bg-muted/20">
            <div className="text-xs font-semibold text-muted-foreground">Steps</div>
          </div>
          <div className="p-3 space-y-2">
            {onboardingSteps.map((step) => {
              const isSelected = activeStep === step.id;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => handleStepClick(step.id)}
                  className={`w-full text-left rounded-md px-3 py-2 transition-colors ${
                    isSelected
                      ? "bg-primary/10"
                      : "bg-background hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-[13px] font-medium text-foreground">
                      {step.id}. {step.title}
                    </div>
                    <div
                      className={`flex flex-shrink-0 items-center gap-2 text-[12px] font-semibold ${
                        isSelected ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      <span>{stepCounts.get(step.id) ?? 0} users</span>
                      <ChevronRight size={16} className={isSelected ? "text-primary" : "text-muted-foreground"} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="min-w-0 rounded-md border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-2.5 py-2">
            <div className="flex flex-wrap items-center gap-2">
              {STATUS_FILTERS.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setActiveStatus(status)}
                  className={`h-7 rounded-full border px-3 text-xs font-semibold transition-colors ${
                    activeStatus === status
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {TIME_INTERVALS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTimeInterval(opt.id)}
                  className={`h-7 rounded-full border px-2.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
                    timeInterval === opt.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {opt.shortLabel}
                </button>
              ))}
            </div>
          </div>
          {/* ── Mobile card view (< md) ─────────────────────────────── */}
          <div className="md:hidden divide-y divide-border">
            {timeFilteredRows.map((r) => {
              const stepTitle = onboardingSteps.find((s) => s.id === r.currentStep)?.title ?? "N/A";
              const waUrl = buildWhatsAppUrl(r.name, r.phoneNumber, stepTitle);
              return (
                <div key={r.id} className="px-3 py-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-semibold text-sm text-foreground">{r.name}</div>
                    <div className="text-[10px] text-muted-foreground shrink-0">{r.dateCreated}</div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono">{revealedEmails[r.id] ? r.email : maskEmail(r.email)}</span>
                    <button
                      type="button"
                      onClick={() => toggleEmailVisibility(r.id)}
                      className="text-muted-foreground hover:text-foreground"
                      aria-label={revealedEmails[r.id] ? "Hide email" : "Show email"}
                    >
                      {revealedEmails[r.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono">{revealedPhones[r.id] ? r.phoneNumber : maskPhone(r.phoneNumber)}</span>
                    <button
                      type="button"
                      onClick={() => togglePhoneVisibility(r.id)}
                      className="text-muted-foreground hover:text-foreground"
                      aria-label={revealedPhones[r.id] ? "Hide mobile" : "Show mobile"}
                    >
                      {revealedPhones[r.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Step {r.currentStep}: {stepTitle}
                  </div>
                  <div className="flex items-center gap-3 pt-0.5">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-7 h-7 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
                      aria-label="Send WhatsApp nudge"
                    >
                      <WhatsAppIcon size={15} />
                    </a>
                    <a
                      href={COMPLETE_APPLICATION_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      View Application <ChevronRight size={12} />
                    </a>
                  </div>
                </div>
              );
            })}
            {timeFilteredRows.length === 0 && (
              <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                No users found for selected step and status.
              </div>
            )}
          </div>

          {/* ── Desktop table (md+) ─────────────────────────────────── */}
          <div className="hidden md:block max-w-full overflow-x-auto">
            <div className="grid border-b border-border bg-muted/20 px-3 py-2 text-xs font-semibold text-muted-foreground grid-cols-[140px_140px_160px_220px_160px_160px_1fr]">
              <div>Date created</div>
              <div>Last updated</div>
              <div>Name</div>
              <div>Email</div>
              <div>Mobile</div>
              <div>Current step</div>
              <div>Suggestions</div>
            </div>
            {timeFilteredRows.map((r) => {
              const stepTitle = onboardingSteps.find((s) => s.id === r.currentStep)?.title ?? "N/A";
              const waUrl = buildWhatsAppUrl(r.name, r.phoneNumber, stepTitle);
              return (
                <div
                  key={r.id}
                  className="grid border-b border-border px-3 py-2.5 text-sm last:border-b-0 items-center grid-cols-[140px_140px_160px_220px_160px_160px_1fr]"
                >
                  <div className="text-xs text-muted-foreground">{r.dateCreated}</div>
                  <div className="text-xs text-muted-foreground">{r.lastUpdated}</div>
                  <div className="truncate font-medium">{r.name}</div>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="truncate text-xs text-muted-foreground font-mono">
                      {revealedEmails[r.id] ? r.email : maskEmail(r.email)}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleEmailVisibility(r.id)}
                      className="shrink-0 text-muted-foreground hover:text-foreground"
                      aria-label={revealedEmails[r.id] ? "Hide email" : "Show email"}
                    >
                      {revealedEmails[r.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono text-muted-foreground">
                      {revealedPhones[r.id] ? r.phoneNumber : maskPhone(r.phoneNumber)}
                    </span>
                    <button
                      type="button"
                      onClick={() => togglePhoneVisibility(r.id)}
                      className="shrink-0 text-muted-foreground hover:text-foreground"
                      aria-label={revealedPhones[r.id] ? "Hide mobile" : "Show mobile"}
                    >
                      {revealedPhones[r.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {r.currentStep}. {stepTitle}
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-7 h-7 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
                      aria-label="Send WhatsApp nudge"
                      title="Send WhatsApp message"
                    >
                      <WhatsAppIcon size={15} />
                    </a>
                    <a
                      href={COMPLETE_APPLICATION_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline whitespace-nowrap"
                    >
                      View Application <ChevronRight size={12} />
                    </a>
                  </div>
                </div>
              );
            })}
            {timeFilteredRows.length === 0 && (
              <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                No users found for selected step and status.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
