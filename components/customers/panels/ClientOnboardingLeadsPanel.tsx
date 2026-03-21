"use client";

import { useMemo, useState } from "react";
import { ChevronRight, Eye, EyeOff, UserPlus } from "lucide-react";
import { onboardingRows, onboardingSteps, type OnboardingStatus } from "../data";

const STATUS_FILTERS: OnboardingStatus[] = ["Open", "Rejected", "Scrutiny"];
const COMPLETE_APPLICATION_URL = "https://upstox.com/customer-onboarding/verify/pan/";
const TIME_INTERVALS = [
  { id: "7d", label: "Last 7 days", days: 7 },
  { id: "15d", label: "Last 15 days", days: 15 },
  { id: "30d", label: "Last 30 days", days: 30 },
  { id: "all", label: "All time", days: null },
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

export function ClientOnboardingLeadsPanel() {
  const [activeStatus, setActiveStatus] = useState<OnboardingStatus>("Open");
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [timeInterval, setTimeInterval] = useState<TimeIntervalId>("30d");
  const [revealedPhones, setRevealedPhones] = useState<Record<string, boolean>>({});

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

  const showRejectedColumns = activeStatus === "Rejected";

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
            <select
              value={timeInterval}
              onChange={(e) => setTimeInterval(e.target.value as TimeIntervalId)}
              className="h-8 rounded-md border border-border bg-background px-2.5 text-xs font-medium text-foreground outline-none ring-offset-background transition-colors focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Filter onboarding leads by time interval"
            >
              {TIME_INTERVALS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {/* ── Mobile card view (< md) ─────────────────────────────── */}
          <div className="md:hidden divide-y divide-border">
            {timeFilteredRows.map((r) => (
              <div key={r.id} className="px-3 py-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-foreground">{r.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{r.email}</div>
                  </div>
                  <span className="shrink-0 inline-flex rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    {r.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{revealedPhones[r.id] ? r.phoneNumber : maskPhone(r.phoneNumber)}</span>
                  <button
                    type="button"
                    onClick={() => togglePhoneVisibility(r.id)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label={revealedPhones[r.id] ? "Hide phone number" : "Show phone number"}
                  >
                    {revealedPhones[r.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  {r.selectedSegments.map((segment) => (
                    <span
                      key={`${r.id}-${segment}`}
                      className="inline-flex rounded-sm border border-border bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-foreground"
                    >
                      {segment}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs text-muted-foreground">
                    {showRejectedColumns
                      ? r.rejectedReason ?? "-"
                      : `Step ${r.currentStep}: ${onboardingSteps.find((s) => s.id === r.currentStep)?.title ?? "N/A"}`}
                  </div>
                  {showRejectedColumns || r.status === "Scrutiny" ? (
                    <button type="button" className="shrink-0 text-xs font-semibold text-primary hover:underline">
                      View
                    </button>
                  ) : (
                    <a
                      href={COMPLETE_APPLICATION_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      View <ChevronRight size={12} />
                    </a>
                  )}
                </div>
                <div className="text-[10px] text-muted-foreground">{r.dateCreated}</div>
              </div>
            ))}
            {timeFilteredRows.length === 0 && (
              <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                No users found for selected step and status.
              </div>
            )}
          </div>

          {/* ── Desktop table (md+) ─────────────────────────────────── */}
          <div className="hidden md:block max-w-full overflow-x-auto">
            <div
              className={`grid border-b border-border bg-muted/20 px-3 py-2 text-xs font-semibold text-muted-foreground ${
                showRejectedColumns
                  ? "grid-cols-[140px_140px_180px_220px_150px_220px_110px_170px_150px]"
                  : "grid-cols-[140px_140px_180px_220px_150px_220px_110px_140px_170px_150px]"
              }`}
            >
              <div>Date created</div>
              <div>Last updated</div>
              <div>Name</div>
              <div>Email</div>
              <div>Phone number</div>
              <div>Selected Segments</div>
              <div>Status</div>
              {showRejectedColumns ? <div>Rejected Reason</div> : <div>Current Step</div>}
              <div className="text-right">Action</div>
            </div>
            {timeFilteredRows.map((r) => (
              <div
                key={r.id}
                className={`grid border-b border-border px-3 py-2 text-sm last:border-b-0 ${
                  showRejectedColumns
                    ? "grid-cols-[140px_140px_180px_220px_150px_220px_110px_170px_150px]"
                    : "grid-cols-[140px_140px_180px_220px_150px_220px_110px_140px_170px_150px]"
                }`}
              >
                <div>{r.dateCreated}</div>
                <div>{r.lastUpdated}</div>
                <div className="truncate">{r.name}</div>
                <div className="truncate text-muted-foreground">{r.email}</div>
                <div className="flex items-center gap-2">
                  <span>{revealedPhones[r.id] ? r.phoneNumber : maskPhone(r.phoneNumber)}</span>
                  <button
                    type="button"
                    onClick={() => togglePhoneVisibility(r.id)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label={revealedPhones[r.id] ? "Hide phone number" : "Show phone number"}
                  >
                    {revealedPhones[r.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  {r.selectedSegments.map((segment) => (
                    <span
                      key={`${r.id}-${segment}`}
                      className="inline-flex rounded-sm border border-border bg-muted px-1.5 py-0.5 text-xs font-semibold text-foreground"
                    >
                      {segment}
                    </span>
                  ))}
                </div>
                <div>{r.status}</div>
                {showRejectedColumns ? (
                  <div className="truncate text-muted-foreground">{r.rejectedReason ?? "-"}</div>
                ) : (
                  <div className="truncate text-muted-foreground">
                    {r.currentStep}. {onboardingSteps.find((step) => step.id === r.currentStep)?.title ?? "N/A"}
                  </div>
                )}
                {showRejectedColumns || r.status === "Scrutiny" ? (
                  <button type="button" className="text-right text-xs font-semibold text-primary hover:underline">
                    View application
                  </button>
                ) : (
                  <a
                    href={COMPLETE_APPLICATION_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-right text-xs font-semibold text-primary hover:underline"
                  >
                    View Application
                  </a>
                )}
              </div>
            ))}
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
