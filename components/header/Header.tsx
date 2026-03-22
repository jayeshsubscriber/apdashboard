"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  X,
  LayoutGrid,
  Users,
  HandCoins,
  UserPlus,
  BriefcaseBusiness,
} from "lucide-react";
import { UpstoxLogo } from "./UpstoxLogo";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const NAV_TABS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "servicing", label: "Grow" },
  { id: "customers", label: "Customers" },
  { id: "leads", label: "Lead" },
  { id: "business", label: "My Business" },
] as const;

type TabId = (typeof NAV_TABS)[number]["id"];

const MOBILE_TAB_COPY: Record<TabId, string> = {
  dashboard: "Dashboard",
  servicing: "Grow",
  customers: "Customers",
  leads: "Lead",
  business: "Business",
};

function MobileTabIcon({ tabId, isActive }: { tabId: TabId; isActive: boolean }) {
  const className = isActive ? "text-white" : "text-white/75";
  const props = { size: 18, className };
  if (tabId === "dashboard") return <LayoutGrid {...props} />;
  if (tabId === "customers") return <Users {...props} />;
  if (tabId === "servicing") return <HandCoins {...props} />;
  if (tabId === "leads") return <UserPlus {...props} />;
  return <BriefcaseBusiness {...props} />;
}

const DUMMY_LEADS = [
  { id: "l1", label: "Aarti Mehta — onboarding lead" },
  { id: "l2", label: "Vikram Sinha — KYC pending" },
];

const DUMMY_CUSTOMERS = [
  { id: "c1", label: "UCC 100234 — Rajesh Kumar" },
  { id: "c2", label: "UCC 100891 — Priya Nair" },
];

function SearchResultsDropdown({ className }: { className?: string }) {
  return (
    <div
      role="listbox"
      aria-label="Search results"
      className={`absolute left-0 top-full z-50 mt-1 max-h-[min(60vh,320px)] w-full min-w-[17rem] overflow-auto rounded-lg border border-border bg-card py-2 text-card-foreground shadow-lg ${className ?? ""}`}
    >
      <div className="px-3 pb-1 pt-0.5">
        <p className="text-xs font-semibold text-muted-foreground">Lead -&gt;</p>
        <ul className="mt-1 space-y-0.5">
          {DUMMY_LEADS.map((row) => (
            <li key={row.id}>
              <button
                type="button"
                className="w-full rounded-md px-2 py-1.5 text-left text-sm text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                {row.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="my-2 border-t border-border" />
      <div className="px-3 pb-1">
        <p className="text-xs font-semibold text-muted-foreground">Customer -&gt;</p>
        <ul className="mt-1 space-y-0.5">
          {DUMMY_CUSTOMERS.map((row) => (
            <li key={row.id}>
              <button
                type="button"
                className="w-full rounded-md px-2 py-1.5 text-left text-sm text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                {row.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

interface HeaderProps {
  activeTab?: TabId;
  onTabChange?: (tab: TabId) => void;
  partnerName?: string;
}

export function Header({
  activeTab = "dashboard",
  onTabChange,
  partnerName = "Rajesh Sharma",
}: HeaderProps) {
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  const showSearchResults = search.trim().length > 0;

  const closeSearchOnOutside = useCallback((event: MouseEvent) => {
    const t = event.target as Node;
    if (desktopSearchRef.current?.contains(t)) return;
    if (mobileSearchRef.current?.contains(t)) return;
    setSearch("");
  }, []);

  useEffect(() => {
    if (!showSearchResults) return;
    document.addEventListener("mousedown", closeSearchOnOutside);
    return () => document.removeEventListener("mousedown", closeSearchOnOutside);
  }, [showSearchResults, closeSearchOnOutside]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !search.trim()) return;
      setSearch("");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [search]);

  return (
    <header className="w-full" style={{ backgroundColor: "var(--color-brand)" }}>
      {/* Main header row */}
      <div className="flex items-center px-4 md:px-6 h-14 gap-3 md:gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <UpstoxLogo />
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center h-full gap-3">
          {NAV_TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className="relative h-full px-4 text-sm font-medium whitespace-nowrap"
                style={{
                  color: isActive ? "white" : "rgba(255,255,255,0.6)",
                }}
              >
                {tab.label}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full"
                    style={{ backgroundColor: "var(--color-brand-light)" }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Desktop search */}
        <div ref={desktopSearchRef} className="hidden md:block w-56 shrink-0 ml-auto">
          <div className="relative w-full">
            <Search
              size={14}
              className="absolute left-3 top-1/2 z-[1] -translate-y-1/2 text-white/40 pointer-events-none"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers, products…"
              className="pl-8 pr-3 h-8 text-sm rounded-full border-0 text-white placeholder:text-white/35 focus-visible:ring-1 focus-visible:ring-primary w-full"
              style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
              aria-expanded={showSearchResults}
              aria-controls="header-search-results-desktop"
              autoComplete="off"
            />
            {showSearchResults && (
              <div id="header-search-results-desktop">
                <SearchResultsDropdown />
              </div>
            )}
          </div>
        </div>

        {/* Right side: bell + avatar + mobile menu toggle */}
        <div className="flex items-center gap-3 md:gap-4 shrink-0 ml-auto md:ml-0">
          <button className="relative text-white/80 hover:text-white transition-colors shrink-0">
            <Bell size={19} />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-orange-400 text-[9px] font-bold text-white flex items-center justify-center">
              3
            </span>
          </button>

          <button className="flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0">
            <Avatar className="h-8 w-8 border-2 border-white/30">
              <AvatarFallback
                className="text-xs font-semibold text-white"
                style={{ backgroundColor: "var(--color-brand-light)" }}
              >
                {partnerName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col items-start leading-tight">
              <span className="text-white text-sm font-semibold">
                {partnerName}
              </span>
            </div>
            <ChevronDown size={14} className="hidden md:block text-white/60" />
          </button>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden text-white/80 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label="Toggle search"
          >
            {mobileMenuOpen ? <X size={20} /> : <Search size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile search bar (collapsible) */}
      {mobileMenuOpen && (
        <div
          className="md:hidden px-4 pb-3"
          style={{ backgroundColor: "var(--color-brand)" }}
        >
          <div ref={mobileSearchRef} className="relative w-full">
            <Search
              size={14}
              className="absolute left-3 top-1/2 z-[1] -translate-y-1/2 text-white/40 pointer-events-none"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers, products…"
              className="pl-8 pr-3 h-9 text-sm rounded-full border-0 text-white placeholder:text-white/35 w-full focus-visible:ring-1 focus-visible:ring-primary"
              style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
              autoFocus
              aria-expanded={showSearchResults}
              aria-controls="header-search-results-mobile"
              autoComplete="off"
            />
            {showSearchResults && (
              <div id="header-search-results-mobile">
                <SearchResultsDropdown className="min-w-0 w-full" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile bottom nav tab strip */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 flex md:hidden border-t border-white/20 shadow-[0_-8px_24px_rgba(0,0,0,0.22)] pb-[calc(env(safe-area-inset-bottom)+0.35rem)] pt-1 px-1"
        style={{ backgroundColor: "var(--color-brand)" }}
      >
        {NAV_TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={`relative flex flex-1 min-w-0 flex-col items-center justify-center gap-1 rounded-lg py-2 text-[11px] font-medium leading-none transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
                isActive ? "bg-white/12 text-white" : "text-white/70"
              }`}
            >
              <MobileTabIcon tabId={tab.id} isActive={isActive} />
              <span className="truncate max-w-full px-1">{MOBILE_TAB_COPY[tab.id]}</span>
              {isActive && (
                <span
                  className="absolute bottom-0 left-2 right-2 h-[2px] rounded-t-full"
                  style={{ backgroundColor: "var(--color-brand-light)" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
}
