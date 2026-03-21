"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Clock,
  Crown,
  ChevronRight,
  Eye,
  Landmark,
  PieChart,
  TrendingDown,
  UserCheck,
} from "lucide-react";
import {
  BUSINESS_CATEGORIES,
  BusinessCategoryId,
  BusinessColumn,
  BusinessRow,
} from "../businessOpportunitiesData";

function leftIconForCard(cardId: string) {
  if (cardId === "likelyToLapse") return AlertTriangle;
  if (cardId === "highFnOLosses") return TrendingDown;
  if (cardId === "topFive") return Crown;
  if (cardId === "onboardedNotActivated") return UserCheck;
  if (cardId === "neverTraded") return Clock;
  if (cardId === "equityPotential") return BarChart3;
  if (cardId === "mtf") return PieChart;
  if (cardId === "fno") return TrendingDown;
  if (cardId === "ipo") return Landmark;
  if (cardId === "intraday") return Clock;
  return PieChart; // mf
}

const CATEGORY_GROUPS: Array<{
  title: string;
  cardIds: BusinessCategoryId[];
  suggestions?: string[];
}> = [
  {
    title: "Activation",
    cardIds: ["onboardedNotActivated", "neverTraded"],
  },
  {
    title: "At Risk",
    cardIds: ["likelyToLapse", "highFnOLosses", "topFive"],
  },
  {
    title: "Upsell",
    cardIds: ["equityPotential", "mtf", "fno", "intraday", "mf"],
  },
  {
    title: "Cross-sell",
    cardIds: ["ipo"],
    suggestions: [
      "Debt MF / Liquid Fund Prospects",
      "Insurance and Protection Prospects",
      "NPS Prospects",
      "Loan Against Securities Prospects",
    ],
  },
];

export function BusinessOpportunitiesPanel() {
  const allCards = useMemo(() => BUSINESS_CATEGORIES, []);

  const [activeCardId, setActiveCardId] = useState<BusinessCategoryId>(
    CATEGORY_GROUPS[0].cardIds[0]
  );

  const activeCard = useMemo(
    () => allCards.find((c) => c.id === activeCardId) ?? allCards[0],
    [allCards, activeCardId]
  );

  const gridTemplateColumns = useMemo(() => {
    if (!activeCard) return "130px minmax(180px, 1fr) 140px 130px 220px";
    return activeCard.columns
      .map((column, index) => {
        if (index === 0) return "130px";
        if (index === 1) return "minmax(180px, 1fr)";
        if (column.key === "suggestedAction") return "220px";
        return "130px";
      })
      .join(" ");
  }, [activeCard]);

  const cellTextClass = (column: BusinessColumn) =>
    column.align === "right" ? "text-right" : "text-left";

  const renderCell = (row: BusinessRow, column: BusinessColumn) => {
    if (column.key === "suggestedAction") {
      return (
        <div className="flex items-center justify-end gap-2 text-primary">
          <button
            type="button"
            aria-label={`View ${row.clientName}`}
            title="View"
            className="h-7 w-7 inline-flex items-center justify-center rounded-md border border-border hover:bg-primary/5 transition-colors"
          >
            <Eye size={15} />
          </button>
          <button
            type="button"
            className="text-xs font-semibold text-primary hover:underline"
          >
            {row.suggestedAction}
          </button>
        </div>
      );
    }

    const value = row[column.key] ?? "-";
    if (column.key === "status") {
      const isActive = value === "Activated";
      return (
        <div className={`flex ${cellTextClass(column)} justify-end`}>
          <span
            className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${
              isActive
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border bg-muted/30 text-muted-foreground"
            }`}
          >
            {value}
          </span>
        </div>
      );
    }

    return <div className={`text-[13px] text-foreground truncate ${cellTextClass(column)}`}>{value}</div>;
  };

  const groupedCards = useMemo(
    () =>
      CATEGORY_GROUPS.map((group) => ({
        ...group,
        cards: group.cardIds
          .map((id) => allCards.find((card) => card.id === id))
          .filter((card): card is (typeof allCards)[number] => Boolean(card)),
      })),
    [allCards]
  );

  return (
    <section className="p-3">
      <h3 className="text-base font-semibold tracking-tight text-foreground">Business Opportunities</h3>

      <div className="mt-3">
        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[300px_minmax(0,1fr)] items-stretch">
          <aside className="rounded-md border border-border bg-card overflow-hidden min-w-0">
            <div className="p-3 border-b border-border bg-muted/20">
              <div className="text-xs font-semibold text-muted-foreground">Categories</div>
            </div>
            <div className="p-3 space-y-2 max-h-[240px] overflow-y-auto xl:max-h-none">
              {groupedCards.map((group) => (
                <div key={group.title} className="space-y-2">
                  <div className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {group.title}
                  </div>

                  {group.cards.map((c) => {
                    const isActive = c.id === activeCard?.id;
                    const Icon = leftIconForCard(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setActiveCardId(c.id)}
                        className={`w-full text-left rounded-md px-3 py-2 transition-colors ${
                          isActive ? "bg-primary/5" : "bg-background hover:bg-muted/30"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex min-w-0 items-center gap-2">
                            <Icon size={16} className={isActive ? "text-primary" : "text-muted-foreground"} />
                            <div className="truncate text-[13px] font-medium text-foreground">{c.title}</div>
                          </div>
                          <div
                            className={`flex flex-shrink-0 items-center gap-2 text-[12px] font-semibold ${
                              isActive ? "text-primary" : "text-muted-foreground"
                            }`}
                          >
                            <span>{c.totalClients} users</span>
                            <ChevronRight
                              size={16}
                              className={isActive ? "text-primary" : "text-muted-foreground"}
                            />
                          </div>
                        </div>
                      </button>
                    );
                  })}

                  {group.suggestions?.map((suggestion) => (
                    <div
                      key={suggestion}
                      className="rounded-md border border-dashed border-border px-3 py-2 text-[12px] text-muted-foreground"
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </aside>

          <div className="min-w-0 flex h-full flex-col rounded-md border border-border bg-card overflow-hidden">
            <div className="px-3 py-2 border-b border-border bg-muted/20">
              <div className="text-base font-semibold text-foreground">{activeCard.title}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{activeCard.subtitle}</div>
            </div>

            <div
              className="grid border-b border-border px-3 py-2 gap-2"
              style={{ gridTemplateColumns }}
            >
              {activeCard.columns.map((column) => (
                <div
                  key={column.key}
                  className={`text-xs font-semibold text-muted-foreground ${cellTextClass(column)}`}
                >
                  {column.label}
                </div>
              ))}
            </div>

            <div className="min-h-0 flex-1 overflow-auto">
              {activeCard.rows.map((row) => (
                <div
                  key={row.id}
                  className="grid px-3 py-2 border-b border-border last:border-b-0 gap-2"
                  style={{ gridTemplateColumns }}
                >
                  {activeCard.columns.map((column) => (
                    <div key={column.key}>{renderCell(row, column)}</div>
                  ))}
                </div>
              ))}
            </div>

            <div className="px-3 py-2 border-t border-border flex justify-end">
              <button
                type="button"
                className="h-8 rounded-md border border-primary px-3 text-xs font-semibold text-primary hover:bg-primary/5 transition-colors"
              >
                VIEW ALL
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

