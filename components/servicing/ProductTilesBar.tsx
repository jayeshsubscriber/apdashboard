"use client";

export type ProductCategory =
  | "advisory" | "stocks" | "mutual-funds" | "ipos"
  | "fixed-deposits" | "bonds" | "insurance";

// ─── Upstox-style colorful product icons ──────────────────────────────────────

function IllAdvisory() {
  return (
    <svg viewBox="0 0 40 40" fill="none" width="32" height="32">
      <circle cx="20" cy="20" r="16" fill="#E0F2F1"/>
      <path d="M14 26V18l4-3 4 5 6-8" stroke="#00897B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="28" cy="12" r="2.5" fill="#00897B"/>
      <path d="M12 28h16" stroke="#00897B" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function IllStocks() {
  return (
    <svg viewBox="0 0 40 40" fill="none" width="32" height="32">
      <circle cx="20" cy="20" r="16" fill="#FFF3E0"/>
      <rect x="10" y="22" width="5" height="8" rx="1" fill="#FF9800"/>
      <rect x="17.5" y="16" width="5" height="14" rx="1" fill="#F57C00"/>
      <rect x="25" y="11" width="5" height="19" rx="1" fill="#E65100"/>
      <path d="M12 14l5-3 5 2 6-5" stroke="#E65100" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M26 8l3 0 0 3" stroke="#E65100" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IllMutualFunds() {
  return (
    <svg viewBox="0 0 40 40" fill="none" width="32" height="32">
      <circle cx="20" cy="20" r="16" fill="#F3E5F5"/>
      <path d="M20 20 L20 8 A12 12 0 0 1 28.5 28 Z" fill="#7B1FA2"/>
      <path d="M20 20 L28.5 28 A12 12 0 0 1 8.5 24 Z" fill="#AB47BC"/>
      <path d="M20 20 L8.5 24 A12 12 0 0 1 20 8 Z" fill="#CE93D8"/>
      <circle cx="20" cy="20" r="5" fill="white"/>
      <circle cx="20" cy="20" r="2" fill="#7B1FA2"/>
    </svg>
  );
}

function IllIPOs() {
  return (
    <svg viewBox="0 0 40 40" fill="none" width="32" height="32">
      <circle cx="20" cy="20" r="16" fill="#E3F2FD"/>
      <path d="M13 12h14l3 5-10 14-10-14 3-5z" fill="#42A5F5" stroke="#1E88E5" strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M13 12l7 19 7-19" stroke="#1565C0" strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M10 17h20" stroke="#1565C0" strokeWidth="1.2"/>
    </svg>
  );
}

function IllFixedDeposits() {
  return (
    <svg viewBox="0 0 40 40" fill="none" width="32" height="32">
      <circle cx="20" cy="20" r="16" fill="#FFF8E1"/>
      <rect x="10" y="12" width="20" height="16" rx="3" fill="#FFD54F" stroke="#F9A825" strokeWidth="1.4"/>
      <path d="M10 18h20" stroke="#F9A825" strokeWidth="1.4"/>
      <text x="20" y="27" textAnchor="middle" fill="#E65100" fontSize="8" fontWeight="bold">%</text>
      <circle cx="28" cy="12" r="4" fill="#F9A825"/>
      <text x="28" y="14.5" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">₹</text>
    </svg>
  );
}

function IllBonds() {
  return (
    <svg viewBox="0 0 40 40" fill="none" width="32" height="32">
      <circle cx="20" cy="20" r="16" fill="#EDE7F6"/>
      <rect x="10" y="8" width="20" height="24" rx="2" fill="white" stroke="#5E35B1" strokeWidth="1.4"/>
      <line x1="14" y1="14" x2="26" y2="14" stroke="#B39DDB" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="14" y1="18" x2="26" y2="18" stroke="#B39DDB" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="14" y1="22" x2="22" y2="22" stroke="#B39DDB" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="27" cy="27" r="5" fill="#5E35B1"/>
      <text x="27" y="29.5" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">₹</text>
    </svg>
  );
}

function IllInsurance() {
  return (
    <svg viewBox="0 0 40 40" fill="none" width="32" height="32">
      <circle cx="20" cy="20" r="16" fill="#FCE4EC"/>
      <path d="M20 6L8 12v8c0 8 5.5 13 12 15 6.5-2 12-7 12-15v-8L20 6z" fill="#F48FB1" stroke="#E91E63" strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M15 20l3 3 7-7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const ILLUSTRATIONS: Record<ProductCategory, React.FC> = {
  advisory: IllAdvisory, stocks: IllStocks, "mutual-funds": IllMutualFunds,
  ipos: IllIPOs, "fixed-deposits": IllFixedDeposits,
  bonds: IllBonds, insurance: IllInsurance,
};

export const PRODUCT_CATEGORIES: Array<{ id: ProductCategory; label: string; badge: string }> = [
  { id: "stocks",         label: "Stocks",         badge: "Earn brokerage"   },
  { id: "mutual-funds",   label: "Mutual Funds",   badge: "Trail commission" },
  { id: "advisory",       label: "Advisory",       badge: "32 active calls"  },
  { id: "ipos",           label: "IPOs",           badge: "2 live IPOs"      },
  { id: "fixed-deposits", label: "Fixed Dep.",     badge: "Upto 9.5% p.a."  },
  { id: "bonds",          label: "Bonds",          badge: "From ₹10,000"     },
  { id: "insurance",      label: "Insurance",      badge: "Coming soon"      },
];

interface ProductTilesBarProps {
  /** "servicing" = tiles scroll to sections below (no selected highlight); "dashboard" = click navigates away */
  variant?: "servicing" | "dashboard";
  /** Servicing: e.g. scroll to matching section id */
  onNavigate?: (id: ProductCategory) => void;
  /** @deprecated Prefer onNavigate */
  onSelect?: (id: ProductCategory) => void;
  /** Dashboard mode: called when any tile is clicked (navigates to Servicing) */
  onTileClick?: () => void;
}

export function ProductTilesBar({
  variant = "servicing",
  onNavigate,
  onSelect,
  onTileClick,
}: ProductTilesBarProps) {
  const isDashboard = variant === "dashboard";

  function handleTileClick(id: ProductCategory) {
    if (isDashboard) {
      onTileClick?.();
      return;
    }
    if (onNavigate) {
      onNavigate(id);
      return;
    }
    onSelect?.(id);
  }

  return (
    <div className="pt-4 pb-4 px-3 sm:px-4 bg-white">
      <div className="text-center mb-5">
        <p className="text-xl font-bold text-foreground tracking-tight">
          Grow your business.{" "}
          <span className="text-primary">Distribute &amp; earn.</span>
        </p>
        <p className="text-sm text-muted-foreground mt-0.5">Help your customers invest while you earn commissions across products</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-1.5">
        {PRODUCT_CATEGORIES.map(({ id, label, badge }) => {
          const Illustration = ILLUSTRATIONS[id];
          return (
            <button
              key={id}
              type="button"
              onClick={() => handleTileClick(id)}
              className="relative flex h-[90px] min-w-0 flex-col justify-between overflow-hidden rounded-xl border-2 border-transparent bg-gray-50 p-2 transition-all hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="w-full text-left text-sm font-bold leading-tight text-foreground sm:text-base">
                {label}
              </span>

              <div className="flex w-full items-end justify-between">
                <Illustration />
                <span className="rounded-full bg-primary/8 px-1.5 py-0.5 text-right text-[8.5px] font-semibold leading-tight text-primary">
                  {badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
