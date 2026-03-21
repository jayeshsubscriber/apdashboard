"use client";

import { useState } from "react";
import { Search, Bell, ChevronDown, Menu, X } from "lucide-react";
import { UpstoxLogo } from "./UpstoxLogo";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const NAV_TABS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "customers", label: "Customers" },
  { id: "business", label: "Business" },
] as const;

type TabId = (typeof NAV_TABS)[number]["id"];

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

  return (
    <header className="w-full" style={{ backgroundColor: "var(--color-brand)" }}>
      {/* Main header row */}
      <div className="flex items-center px-4 md:px-6 h-14 gap-3 md:gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <UpstoxLogo />
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full border border-white/30 text-white/80"
            style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
          >
            AP Partner
          </span>
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
        <div className="hidden md:relative md:flex items-center w-56 shrink-0 ml-auto">
          <Search
            size={14}
            className="absolute left-3 text-white/40 pointer-events-none"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers, products…"
            className="pl-8 pr-3 h-8 text-sm rounded-full border-0 text-white placeholder:text-white/35 focus-visible:ring-1 focus-visible:ring-primary"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          />
        </div>

        {/* Right side: bell + avatar + mobile menu toggle */}
        <div className="flex items-center gap-3 md:gap-4 shrink-0 ml-auto md:ml-0">
          <button className="relative text-white/80 hover:text-white transition-colors shrink-0">
            <Bell size={19} />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-orange-400 text-[10px] font-bold text-white flex items-center justify-center">
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
              <span className="text-white/60 text-[11px]">AP Partner</span>
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
          <div className="relative flex items-center">
            <Search
              size={14}
              className="absolute left-3 text-white/40 pointer-events-none"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers, products…"
              className="pl-8 pr-3 h-9 text-sm rounded-full border-0 text-white placeholder:text-white/35 w-full focus-visible:ring-1 focus-visible:ring-primary"
              style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Mobile nav tab strip */}
      <div
        className="flex md:hidden border-t border-white/20 overflow-x-auto"
        style={{ backgroundColor: "var(--color-brand)" }}
      >
        {NAV_TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className="relative flex-1 min-w-[80px] py-3 text-[13px] font-medium whitespace-nowrap text-center"
              style={{
                color: isActive ? "white" : "rgba(255,255,255,0.6)",
              }}
            >
              {tab.label}
              {isActive && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full"
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
