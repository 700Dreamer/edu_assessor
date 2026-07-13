"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BarChart3,
  FileText,
  Search,
  Bell,
  Plus,
  LogOut,
  Upload,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  if (!mounted) return null;

  const menuItems = [
    { name: "Overview", path: "/dashboard", icon: LayoutDashboard },
    { name: "Classes", path: "/dashboard/classes", icon: GraduationCap },
    { name: "Students", path: "/dashboard/students", icon: Users },
    { name: "Analytics", path: "/dashboard/analytics", icon: BarChart3 },
    { name: "Reports", path: "/dashboard/reports", icon: FileText },
  ];

  const actionItems = [
    { name: "New Entry", icon: Plus, action: () => { } },
    { name: "Upload Exam", icon: Upload, action: () => { } },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-canvas text-[#3d0157] font-salesforce-sans">

      {/* ═══════════════════════════════════════════════
         SIDEBAR
      ═══════════════════════════════════════════════ */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col bg-[#eac8fe]/50 text-[#611f69] transition-all duration-300 ${collapsed ? "w-[72px]" : "w-[250px]"
          }`}
      >
        {/* ── Logo ── */}
        <div className={`flex items-center h-16 px-5 shrink-0 ${collapsed ? "justify-center" : "justify-between"}`}>
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L10.5 6L16 6.5L12 10.5L13 16L8 13L3 16L4 10.5L0 6.5L5.5 6L8 1Z" fill="white" />
              </svg>
            </div>
            {!collapsed && (
              <span className="font-salesforce-avant-garde text-[17px] font-bold tracking-tight text-[#481a54]">
                EduQuest
              </span>
            )}
          </Link>
          {!collapsed && (
            <button className="p-1 rounded-md hover:bg-[#481a54]/10 transition-colors text-[#481a54]/55 hover:text-[#481a54]">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* ── Search ── */}
        <div className="px-3 mb-2">
          <button
            className={`flex items-center gap-2.5 w-full rounded-lg border border-[#481a54]/20 bg-[#481a54]/5 hover:bg-[#481a54]/10 transition-colors text-[#481a54]/60 ${collapsed ? "px-0 py-2 justify-center" : "px-3 py-2"
              }`}
          >
            <Search className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="text-[13px]">Search</span>}
            {!collapsed && (
              <div className="ml-auto flex items-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#481a54]/30">
                  <rect x="1" y="4" width="14" height="8" rx="2" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M5 7h2v2H5z" fill="currentColor" />
                  <path d="M9 7h2v2H9z" fill="currentColor" />
                </svg>
              </div>
            )}
          </button>
        </div>

        {/* ── Menu Section ── */}
        <div className="px-3 mt-3">
          {!collapsed && (
            <p className="text-[10px] font-semibold text-[#481a54]/50 tracking-[0.15em] uppercase px-3 mb-2">
              Menu
            </p>
          )}
          <nav className="space-y-0.5">
            {menuItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`relative flex items-center gap-3 rounded-lg transition-all duration-200 group ${collapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2.5"
                    } ${active
                      ? "bg-[#481a54]/10 text-[#481a54]"
                      : "text-[#481a54]/65 hover:text-[#481a54] hover:bg-[#481a54]/5"
                    }`}
                >
                  {/* Active indicator bar */}
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#481a54] rounded-r-full" />
                  )}
                  <item.icon className={`w-[18px] h-[18px] shrink-0 ${active ? "text-[#481a54]" : ""}`} />
                  {!collapsed && (
                    <span className={`text-[13px] ${active ? "font-semibold" : "font-medium"}`}>
                      {item.name}
                    </span>
                  )}
                  {/* Notification dot for Analytics */}
                  {item.name === "Analytics" && (
                    <span className={`w-[6px] h-[6px] rounded-full bg-[#481a54] ${collapsed ? "absolute top-2 right-3" : "ml-auto"}`} />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ── Actions Section ── */}
        <div className="px-3 mt-6">
          {!collapsed && (
            <div className="flex items-center justify-between px-3 mb-2">
              <p className="text-[10px] font-semibold text-[#481a54]/50 tracking-[0.15em] uppercase">
                Actions
              </p>
              <button className="text-[#481a54]/50 hover:text-[#481a54]/80 transition-colors">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <div className="space-y-0.5">
            {actionItems.map((item, i) => (
              <button
                key={i}
                onClick={item.action}
                className={`flex items-center gap-3 w-full rounded-lg transition-all duration-200 text-[#481a54]/65 hover:text-[#481a54] hover:bg-[#481a54]/5 ${collapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2.5"
                  }`}
              >
                <item.icon className="w-[18px] h-[18px] shrink-0" />
                {!collapsed && (
                  <span className="text-[13px] font-medium">{item.name}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Spacer ── */}
        <div className="flex-1" />

        {/* ── Bottom Section ── */}
        <div className="px-3 mb-2 space-y-0.5">
          <button
            className={`flex items-center gap-3 w-full rounded-lg transition-all duration-200 text-[#481a54]/65 hover:text-[#481a54] hover:bg-[#481a54]/5 ${collapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2.5"
              }`}
          >
            <Settings className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && <span className="text-[13px] font-medium">Settings</span>}
          </button>
          <button
            className={`flex items-center gap-3 w-full rounded-lg transition-all duration-200 text-[#481a54]/65 hover:text-[#481a54] hover:bg-[#481a54]/5 ${collapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2.5"
              }`}
          >
            <HelpCircle className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && <span className="text-[13px] font-medium">Help</span>}
          </button>
        </div>

        {/* ── User Profile ── */}
        <div className={`border-t border-[#481a54]/15 px-3 py-3 ${collapsed ? "flex justify-center" : ""}`}>
          <button
            className={`flex items-center gap-2.5 w-full rounded-lg hover:bg-[#481a54]/5 transition-colors ${collapsed ? "justify-center p-2" : "px-3 py-2"
              }`}
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
              SA
            </div>
            {!collapsed && (
              <>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-[#481a54] leading-tight truncate">Admin</p>
                  <p className="text-[10px] text-[#481a54]/65 leading-tight truncate">Springfield Academy</p>
                </div>
                <LogOut className="w-3.5 h-3.5 text-[#481a54]/40 shrink-0" />
              </>
            )}
          </button>
        </div>

        {/* ── Collapse Toggle ── */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-[#481a54]/15 flex items-center justify-center text-[#481a54]/60 hover:text-[#481a54] hover:border-[#481a54]/30 transition-all shadow-lg"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* ═══════════════════════════════════════════════
         MAIN CONTENT
      ═══════════════════════════════════════════════ */}
      <div className={`flex-1 transition-all duration-300 ${collapsed ? "ml-[72px]" : "ml-[250px]"}`}>
        {/* Top bar — thin utility strip */}
        <header className="sticky top-0 z-40 h-14 bg-pure-white/80 backdrop-blur-md border-b border-fog/60 flex items-center justify-between px-6 lg:px-8">
          <div />
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-canvas transition-colors text-mid-gray hover:text-carbon">
              <Bell className="w-[17px] h-[17px]" />
              <span className="absolute top-1.5 right-1.5 w-[6px] h-[6px] bg-primary-500 rounded-full" />
            </button>
            <button className="p-2 rounded-lg hover:bg-primary-50 transition-colors text-mid-gray hover:text-primary-600">
              <Plus className="w-[17px] h-[17px]" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="w-full max-w-[1400px] mx-auto px-6 lg:px-8 pt-6 pb-16 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
