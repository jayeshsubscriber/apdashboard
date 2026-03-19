"use client";

import { useState } from "react";
import { Search, Bell, ChevronDown } from "lucide-react";
import { UpstoxLogo } from "./UpstoxLogo";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const NAV_TABS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "customers", label: "Customers" },
  { id: "earnings", label: "Earnings" },
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

  return (
    <header
      className="w-full flex flex-col"
      style={{ backgroundColor: "var(--color-brand)" }}
    >
      <div className="flex items-center px-6 h-14 gap-6">
        <div className="flex items-center gap-2 shrink-0">
          <UpstoxLogo />
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full border border-white/30 text-white/80"
            style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
          >
            AP Partner
          </span>
        </div>

        <nav className="flex items-center h-full gap-3">
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

        <div className="relative flex items-center w-56 shrink-0 ml-auto">
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

        <div className="flex items-center gap-4 shrink-0">
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
            <div className="flex flex-col items-start leading-tight">
              <span className="text-white text-sm font-semibold">
                {partnerName}
              </span>
              <span className="text-white/60 text-[11px]">AP Partner</span>
            </div>
            <ChevronDown size={14} className="text-white/60" />
          </button>
        </div>
      </div>
    </header>
  );
}
