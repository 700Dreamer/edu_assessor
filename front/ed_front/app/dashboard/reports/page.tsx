"use client";

import { FileText, Calendar, HardDrive } from "lucide-react";

export default function ReportsPage() {
  const reports = [
    { name: "Term 1 Summary Report", date: "Jun 28, 2026", type: "PDF", size: "2.4 MB", status: "Ready" },
    { name: "Midterm Analysis — Senior 2A", date: "Jun 15, 2026", type: "PDF", size: "1.8 MB", status: "Ready" },
    { name: "Physics Endterm — Senior 3B", date: "Jun 10, 2026", type: "PDF", size: "980 KB", status: "Ready" },
    { name: "Q2 Performance Overview", date: "Jul 1, 2026", type: "PDF", size: "3.1 MB", status: "Generating" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-carbon tracking-tight">Reports</h1>
          <p className="text-[14px] text-mid-gray mt-1">Download and generate assessment reports.</p>
        </div>
        <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white text-[13px] font-bold hover:from-primary-700 hover:to-primary-600 transition-all shadow-md hover:shadow-lg">
          Generate Report +
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Reports", value: "23", Icon: FileText },
          { label: "This Month", value: "4", Icon: Calendar },
          { label: "Storage Used", value: "48 MB", Icon: HardDrive },
        ].map((stat, i) => (
          <div key={i} className="widget-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
              <stat.Icon className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-[10px] text-mid-gray font-semibold tracking-widest uppercase">{stat.label}</p>
              <p className="text-2xl font-bold text-carbon mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Reports list */}
      <div className="widget-card overflow-hidden">
        <div className="px-5 pt-5 pb-3 border-b border-fog">
          <p className="font-bold text-[15px] text-carbon">All Reports</p>
        </div>
        <div className="divide-y divide-fog">
          {reports.map((r, i) => (
            <div key={i} className="flex items-center px-5 py-4 hover:bg-primary-50/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mr-4">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="3" y="1" width="12" height="16" rx="2" stroke="#660033" strokeWidth="1.5" />
                  <path d="M6 6h6M6 9h4M6 12h5" stroke="#660033" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-carbon">{r.name}</p>
                <p className="text-[11px] text-mid-gray">{r.date} · {r.type} · {r.size}</p>
              </div>
              <span className={`stat-badge mr-4 ${
                r.status === "Ready" ? "bg-success-light text-success" : "bg-warning-light text-warning"
              }`}>
                {r.status === "Generating" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse-soft mr-1" />
                )}
                {r.status}
              </span>
              {r.status === "Ready" && (
                <button className="px-3 py-1.5 rounded-lg border border-fog text-[12px] font-semibold text-carbon hover:border-primary-300 hover:text-primary-600 transition-colors">
                  Download
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
