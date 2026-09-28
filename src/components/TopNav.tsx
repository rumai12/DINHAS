import { Bell, Search, ChevronDown, Menu } from "lucide-react";
import { useState } from "react";

interface TopNavProps {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
}

export default function TopNav({ title, subtitle, onMenuClick }: TopNavProps) {
  const [hasNotif] = useState(3);

  return (
    <header
      className="sticky top-0 h-14 md:h-16 flex items-center px-4 md:px-6 gap-3 z-20 border-b"
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: "#E2E8F0",
      }}
    >
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
      >
        <Menu size={20} style={{ color: "#475569" }} />
      </button>

      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1
          className="font-semibold text-sm md:text-base truncate"
          style={{ color: "#0D1B2E", fontFamily: "DM Sans, sans-serif" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs truncate hidden sm:block" style={{ color: "#64748B" }}>{subtitle}</p>
        )}
      </div>

      {/* Global search — hidden on small screens */}
      <div className="relative hidden md:flex items-center">
        <Search size={14} className="absolute left-3 pointer-events-none" style={{ color: "#94A3B8" }} />
        <input
          type="text"
          placeholder="Cari berita, topik, laporan…"
          className="pl-9 pr-4 py-2 text-sm rounded-lg border outline-none w-52 lg:w-64"
          style={{
            borderColor: "#E2E8F0",
            backgroundColor: "#F8FAFC",
            color: "#1A2340",
          }}
        />
      </div>

      {/* Notifications */}
      <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0">
        <Bell size={18} style={{ color: "#475569" }} />
        {hasNotif > 0 && (
          <span
            className="absolute top-1 right-1 w-4 h-4 rounded-full text-white flex items-center justify-center font-bold"
            style={{ backgroundColor: "#C9A53E", fontSize: "9px" }}
          >
            {hasNotif}
          </span>
        )}
      </button>

      {/* User menu */}
      <button className="flex items-center gap-2 pl-2 pr-2 md:pr-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{ backgroundColor: "#0D1B2E" }}
        >
          A
        </div>
        <span className="text-sm font-medium hidden md:block" style={{ color: "#1A2340" }}>Admin</span>
        <ChevronDown size={12} style={{ color: "#94A3B8" }} className="hidden md:block" />
      </button>
    </header>
  );
}
