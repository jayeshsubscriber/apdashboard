"use client";

import { useState } from "react";
import { Eye, EyeOff, Calendar, Clock } from "lucide-react";
import type { CustomerProfile } from "../customer-detail-data";
import { maskPan, maskEmail, maskPhone, maskDob } from "../customer-detail-data";

type Props = { profile: CustomerProfile };

type FieldKey = "pan" | "email" | "phone" | "dob";

const FIELD_CONFIG: { key: FieldKey; label: string; mask: (v: string) => string }[] = [
  { key: "pan", label: "PAN", mask: maskPan },
  { key: "email", label: "Email", mask: maskEmail },
  { key: "phone", label: "Phone", mask: maskPhone },
  { key: "dob", label: "Date of Birth", mask: maskDob },
];

export function ClientProfileCard({ profile }: Props) {
  const [revealed, setRevealed] = useState<Record<FieldKey, boolean>>({
    pan: false,
    email: false,
    phone: false,
    dob: false,
  });

  const toggle = (key: FieldKey) =>
    setRevealed((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <section className="rounded-md border border-border bg-card p-4">
      <h3 className="text-lg font-semibold tracking-tight text-foreground">
        Client Profile
      </h3>

      <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3">
        {/* Name — always visible */}
        <div>
          <div className="text-xs font-medium text-muted-foreground">Name</div>
          <div className="mt-0.5 text-sm font-semibold text-foreground">
            {profile.name}
          </div>
        </div>

        {/* Masked PII fields */}
        {FIELD_CONFIG.map(({ key, label, mask }) => (
          <div key={key}>
            <div className="text-xs font-medium text-muted-foreground">
              {label}
            </div>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="text-sm font-semibold text-foreground font-mono">
                {revealed[key] ? profile[key] : mask(profile[key])}
              </span>
              <button
                type="button"
                onClick={() => toggle(key)}
                className="inline-flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-foreground"
                aria-label={revealed[key] ? `Hide ${label}` : `Show ${label}`}
              >
                {revealed[key] ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>
        ))}

        {/* Segments */}
        <div className="col-span-2">
          <div className="text-xs font-medium text-muted-foreground">
            Segments Activated
          </div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {profile.segments.map((seg) => (
              <span
                key={seg}
                className="inline-flex rounded-sm border border-border bg-primary/5 px-2 py-0.5 text-[11px] font-semibold text-primary"
              >
                {seg}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="mt-3 flex items-center gap-6 border-t border-border pt-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar size={13} />
          <span>
            Opened:{" "}
            <span className="font-semibold text-foreground">
              {profile.accountOpenedDate}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock size={13} />
          <span>
            Last Traded:{" "}
            <span className="font-semibold text-foreground">
              {profile.lastTradedDate}
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
