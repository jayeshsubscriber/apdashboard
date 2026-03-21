import type { ActivityItem } from "../customer-detail-data";

type Props = { activities: ActivityItem[] };

const DOT_COLOR: Record<ActivityItem["type"], string> = {
  trade: "bg-primary",
  sip: "bg-emerald-500",
  deposit: "bg-blue-500",
  withdrawal: "bg-rose-500",
  dividend: "bg-amber-500",
};

export function ActivityTimeline({ activities }: Props) {
  return (
    <section className="rounded-md border border-border bg-card p-4">
      <h3 className="text-sm font-semibold tracking-tight text-foreground">
        Recent Activity
      </h3>
      <div className="mt-3 space-y-0">
        {activities.map((a, i) => (
          <div
            key={`${a.date}-${i}`}
            className="relative flex gap-3 pb-4 last:pb-0"
          >
            {/* Timeline line */}
            {i < activities.length - 1 && (
              <div className="absolute left-[5px] top-3 h-full w-px bg-border" />
            )}
            {/* Dot */}
            <div
              className={`relative mt-1 h-[11px] w-[11px] shrink-0 rounded-full ${DOT_COLOR[a.type]}`}
            />
            <div className="min-w-0">
              <div className="text-[11px] text-muted-foreground">{a.date}</div>
              <div className="text-[13px] text-foreground leading-snug">
                {a.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
