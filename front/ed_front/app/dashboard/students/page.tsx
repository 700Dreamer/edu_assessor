"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function StudentsPage() {
  const students = [
    { name: "Alice Kimani", class: "Senior 4A", avg: 94, trend: "+3%", status: "top" },
    { name: "Brian Ochieng", class: "Senior 2A", avg: 87, trend: "+1%", status: "top" },
    { name: "Carol Wanjiku", class: "Senior 3B", avg: 79, trend: "-2%", status: "mid" },
    { name: "David Mwangi", class: "Senior 1A", avg: 72, trend: "+5%", status: "mid" },
    { name: "Eve Akinyi", class: "Senior 4A", avg: 65, trend: "-1%", status: "low" },
    { name: "Frank Njoroge", class: "Senior 2A", avg: 58, trend: "+2%", status: "low" },
  ];

  const statusColors: Record<string, string> = {
    top: "bg-success-light text-success",
    mid: "bg-warning-light text-warning",
    low: "bg-danger-light text-danger",
  };

  const statusLabels: Record<string, string> = {
    top: "Excellent",
    mid: "Average",
    low: "Needs Support",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-[28px] font-bold text-carbon tracking-tight">Students</h1>
        <p className="text-[14px] text-mid-gray mt-1">Track individual student performance across all classes.</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: "248", badge: "+12%", color: "bg-success-light text-success" },
          { label: "Avg Score", value: "78.4%", badge: "+3.2%", color: "bg-success-light text-success" },
          { label: "At Risk", value: "18", badge: "7%", color: "bg-danger-light text-danger" },
          { label: "Top Performers", value: "52", badge: "21%", color: "bg-primary-100 text-primary-600" },
        ].map((stat, i) => (
          <div key={i} className="widget-card p-5">
            <p className="text-[10px] text-mid-gray font-semibold tracking-widest uppercase">{stat.label}</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-carbon">{stat.value}</span>
              <span className={`stat-badge ${stat.color}`}>{stat.badge}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Student List */}
      <div className="widget-card overflow-hidden">
        <div className="px-5 pt-5 pb-3 border-b border-fog">
          <p className="font-bold text-[15px] text-carbon">All Students</p>
          <p className="text-[11px] text-mid-gray mt-0.5">Sorted by average score</p>
        </div>
        <div className="divide-y divide-fog">
          {students.map((s, i) => (
            <div key={i} className="flex items-center px-5 py-4 hover:bg-primary-50/30 transition-colors cursor-pointer">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold mr-4">
                {s.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-carbon">{s.name}</p>
                <p className="text-[11px] text-mid-gray">{s.class}</p>
              </div>
              <div className="text-right mr-6">
                <p className="text-[16px] font-bold text-carbon">{s.avg}%</p>
                <p className={`text-[11px] font-semibold ${s.trend.startsWith("+") ? "text-success" : "text-danger"}`}>
                  {s.trend.startsWith("+") ? "↑" : "↓"} {s.trend}
                </p>
              </div>
              <span className={`stat-badge ${statusColors[s.status]}`}>
                {statusLabels[s.status]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
