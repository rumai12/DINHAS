import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Search, Newspaper, BarChart2, FileText,
  Lightbulb, FileBarChart, Settings, LogOut, User, ChevronRight, X
} from "lucide-react";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/pencarian", label: "Pencarian Keyword", icon: Search },
  { path: "/monitoring", label: "Monitoring Berita", icon: Newspaper },
  { path: "/analisis", label: "Analisis Informasi", icon: BarChart2 },
  { path: "/perangkuman", label: "Perangkuman", icon: FileText },
  { path: "/insight", label: "Insight", icon: Lightbulb },
  { path: "/laporan", label: "Laporan", icon: FileBarChart },
  { path: "/pengaturan", label: "Pengaturan", icon: Settings },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onClose();
    navigate("/");
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-60 flex flex-col z-50 transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{ backgroundColor: "#0D1B2E" }}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#C9A53E" }}>
                <span className="text-white font-bold text-xs" style={{ fontFamily: "DM Sans, sans-serif" }}>DI</span>
              </div>
              <span className="font-bold text-white text-lg tracking-tight" style={{ fontFamily: "DM Sans, sans-serif" }}>DINHAS</span>
            </div>
            <p className="text-xs leading-tight ml-11" style={{ color: "#94A3B8" }}>
              Digital Intelligence<br />News & Analysis System
            </p>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 flex-shrink-0"
          >
            <X size={16} style={{ color: "#94A3B8" }} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3 px-2" style={{ color: "#475569", fontFamily: "JetBrains Mono, monospace" }}>
            Navigasi
          </p>
          <ul className="space-y-0.5">
            {navItems.map(({ path, label, icon: Icon }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium group relative transition-all ${
                      isActive
                        ? "text-white"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`
                  }
                  style={({ isActive }) =>
                    isActive
                      ? { backgroundColor: "rgba(201, 165, 62, 0.15)", color: "#C9A53E" }
                      : {}
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full"
                          style={{ backgroundColor: "#C9A53E" }}
                        />
                      )}
                      <Icon size={16} className="flex-shrink-0" />
                      <span>{label}</span>
                      {isActive && <ChevronRight size={12} className="ml-auto opacity-60" />}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User profile */}
        <div className="px-3 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 cursor-pointer mb-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#26456C" }}>
              <User size={14} style={{ color: "#C9A53E" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Admin DINHAS</p>
              <p className="text-xs truncate" style={{ color: "#64748B" }}>admin@dinhas.ac.id</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={16} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}
