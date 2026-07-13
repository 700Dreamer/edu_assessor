"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Ruler, Microscope, BookOpen, Flame, Download } from "lucide-react";

/* ═══════════════════════════════════════════════════════
   SVG Donut Chart — pure SVG, no library
═══════════════════════════════════════════════════════ */
function DonutChart({
  segments,
  size = 160,
  strokeWidth = 28,
  centerLabel,
  centerValue,
}: {
  segments: { value: number; color: string; label: string }[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  let accumulated = 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {segments.map((seg, i) => {
          const pct = seg.value / total;
          const dashLength = circumference * pct;
          const dashOffset = circumference * (1 - accumulated / total) + circumference * 0.25;
          accumulated += seg.value;
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              className="transition-all duration-700"
              style={{ transformOrigin: "center" }}
            />
          );
        })}
      </svg>
      {(centerLabel || centerValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {centerValue && (
            <span className="text-2xl font-bold text-carbon">{centerValue}</span>
          )}
          {centerLabel && (
            <span className="text-[11px] text-mid-gray font-medium">{centerLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Attendance Grid — visual heatmap
═══════════════════════════════════════════════════════ */
function AttendanceGrid() {
  const rows = 4;
  const cols = 7;
  const intensities = [
    [4, 3, 4, 4, 3, 4, 2], [3, 4, 2, 4, 4, 3, 4], [4, 4, 3, 3, 4, 4, 3], [2, 3, 4, 4, 3, 4, 4],
  ];
  const shades: Record<number, string> = {
    1: "bg-primary-100",
    2: "bg-primary-200",
    3: "bg-primary-300",
    4: "bg-primary-500",
  };

  return (
    <div className="grid gap-[5px]" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {intensities.flat().map((intensity, i) => (
        <div key={i} className={`attendance-cell ${shades[intensity]}`} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Horizontal Bar Row
═══════════════════════════════════════════════════════ */
function HorizontalBar({
  label, value, color = "bg-primary-500", maxWidth = 100,
}: {
  label: string; value: number; color?: string; maxWidth?: number;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-[13px] font-medium text-carbon">{label}</span>
        <span className="text-[13px] font-bold text-carbon">{value}%</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${(value / maxWidth) * 100}%` }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Mini Sparkline
═══════════════════════════════════════════════════════ */
function Sparkline({
  data, color = "#b33c70", w = 80, h = 36,
}: {
  data: number[]; color?: string; w?: number; h?: number;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pad = 2;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * (w - pad * 2) + pad;
      const y = h - pad - ((v - min) / range) * (h - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   Ring Progress (small circular gauge)
═══════════════════════════════════════════════════════ */
function RingProgress({
  value, size = 56, stroke = 6, color = "#660033",
}: {
  value: number; size?: number; stroke?: number; color?: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
          strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" className="transition-all duration-700"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-carbon">
        {value}%
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Mini Bar Chart
═══════════════════════════════════════════════════════ */
function MiniBarChart({ bars = 7 }: { bars?: number }) {
  const heights = [38, 55, 32, 70, 85, 58, 75, 92];
  return (
    <div className="flex items-end gap-[4px] h-12">
      {Array.from({ length: bars }, (_, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm bg-gradient-to-t from-primary-600 to-primary-400"
          style={{
            height: `${heights[i % heights.length]}%`,
            opacity: i === bars - 1 ? 1 : 0.45 + (i / bars) * 0.5,
          }}
        />
      ))}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════ */
export default function DashboardLanding() {
  const now = new Date();
  const dayNum = now.getDate();
  const dayName = now.toLocaleDateString("en-US", { weekday: "long" });
  const monthName = now.toLocaleDateString("en-US", { month: "short" });

  const perfData = [72, 68, 75, 71, 78, 80, 77, 83, 78, 81];

  const recentExams = [
    { class: "Senior 2A", exam: "Midterm Math 2026", status: "COMPLETED", id: "math-midterm", date: "Jun 28" },
    { class: "Senior 3B", exam: "Endterm Physics 2026", status: "COMPLETED", id: "physics-endterm", date: "Jun 25" },
    { class: "Senior 1A", exam: "History Quiz 2", status: "PROCESSING", id: "history-q2", date: "Jul 2" },
    { class: "Senior 4A", exam: "Biology Mock 1", status: "COMPLETED", id: "bio-mock", date: "Jul 1" },
  ];

  return (
    <div className="space-y-5">

      {/* ══════════════════════════════════════════════════
         GREETING BANNER
      ══════════════════════════════════════════════════ */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Date pill */}
          <div className="flex items-center gap-3 bg-pure-white border border-fog rounded-2xl px-4 py-3 shadow-card">
            <span className="text-3xl font-bold text-carbon leading-none">{dayNum}</span>
            <div className="border-l border-fog pl-3">
              <p className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">Today</p>
              <p className="text-[13px] font-semibold text-carbon leading-tight">{dayName}, {monthName}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white text-[13px] font-bold hover:from-primary-700 hover:to-primary-600 transition-all shadow-md hover:shadow-lg">
            New Entry +
          </button>
          <button className="px-5 py-2.5 rounded-xl bg-carbon text-white text-[13px] font-bold hover:bg-charcoal transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download Report
          </button>
        </div>

        {/* Greeting */}
        <div className="text-right">
          <h1 className="text-[26px] font-bold text-carbon leading-tight tracking-tight">
            Good Morning, <span className="text-gradient-vivid">Springfield</span>
          </h1>
          <p className="text-[13px] text-mid-gray mt-0.5">
            You have <span className="font-semibold text-primary-600">4 pending reviews</span> today.
          </p>
        </div>
      </div>


      {/* ══════════════════════════════════════════════════
         ROW 1 — STAT WIDGETS (4 columns)
      ══════════════════════════════════════════════════ */}
      <div className="grid grid-cols-12 gap-4">

        {/* ─── Card 1: Next Assessment (Dark) ─── */}
        <div className="col-span-3 widget-card-dark p-5 text-white flex flex-col justify-between min-h-[200px]">
          <div>
            <span className="stat-badge bg-primary-600/20 text-primary-300 border border-primary-500/30">
              ASSESSMENTS
            </span>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="1" width="12" height="14" rx="2" stroke="white" strokeWidth="1.5" />
                  <path d="M5 5h6M5 8h4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] text-white/50">Next Assessment</p>
                <p className="text-lg font-bold">Jul 15, 2026</p>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-[11px] text-white/50 mb-2">
              <span>Progress</span>
              <span>75% Complete</span>
            </div>
            <div className="w-full h-[6px] bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600 w-[75%] transition-all duration-700" />
            </div>
            <div className="flex items-center gap-2 mt-4">
              <button className="flex-1 px-3 py-2 bg-white text-carbon text-[12px] font-bold rounded-lg hover:bg-gray-100 transition-colors text-center">
                Run Assessment
              </button>
              <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="3" cy="7" r="1" fill="white" />
                  <circle cx="7" cy="7" r="1" fill="white" />
                  <circle cx="11" cy="7" r="1" fill="white" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ─── Card 2: Headcount + Location (2x2 grid inside) ─── */}
        <div className="col-span-3 grid grid-rows-2 gap-3">
          {/* Headcount */}
          <div className="widget-card p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-mid-gray font-semibold tracking-widest uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
                Students
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-carbon">248</span>
                <span className="stat-badge bg-success-light text-success">+12%</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <div className="flex -space-x-1.5">
                  {["#660033", "#b33c70", "#eed0db", "#fbf2f5"].map((c, i) => (
                    <div key={i} className="w-5 h-5 rounded-full border-2 border-white" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <span className="text-[11px] text-mid-gray">+245</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-3">
            <div className="widget-card-accent p-3 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-extrabold text-primary-600">HQ</span>
              <p className="text-[11px] font-semibold text-primary-700 mt-0.5">Springfield</p>
              <div className="flex items-center gap-1 mt-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                <span className="text-[10px] font-semibold text-success">Open</span>
              </div>
            </div>
            <div className="widget-card p-3 flex flex-col items-center justify-center text-center">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mb-1">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1C4.24 1 2 3.24 2 6c0 3.5 5 7 5 7s5-3.5 5-7c0-2.76-2.24-5-5-5z" stroke="#660033" strokeWidth="1.5" fill="none" />
                  <circle cx="7" cy="6" r="1.5" fill="#660033" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-carbon">8</span>
              <span className="text-[10px] text-mid-gray font-medium">On Leave</span>
            </div>
          </div>
        </div>

        {/* ─── Card 3: Hiring + Q4 Performance ─── */}
        <div className="col-span-3 grid grid-rows-2 gap-3">
          {/* Hiring */}
          <div className="widget-card p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[10px] text-mid-gray font-semibold tracking-widest uppercase">EXAMS</p>
                <span className="stat-badge bg-success-light text-success">Active</span>
              </div>
              <div className="flex items-baseline gap-3 mt-2">
                <span className="text-3xl font-bold text-carbon">14</span>
                <span className="text-[11px] text-mid-gray">Open Exams</span>
              </div>
            </div>
            <button className="w-8 h-8 rounded-lg bg-canvas flex items-center justify-center hover:bg-fog transition-colors">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 12L12 2M12 2H5M12 2v7" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Q4 Performance */}
          <div className="grid grid-cols-2 gap-3">
            <div className="widget-card p-3 flex flex-col items-center justify-center">
              <RingProgress value={82} />
              <span className="text-[10px] text-mid-gray font-medium mt-1">Acceptance</span>
            </div>
            <div className="widget-card p-3 flex flex-col items-center justify-center">
              <RingProgress value={78} color="#10b981" />
              <span className="text-[10px] text-mid-gray font-medium mt-1">Q2 Performance</span>
            </div>
          </div>
        </div>

        {/* ─── Card 4: Attendance Grid ─── */}
        <div className="col-span-3 widget-card p-5">
          <div className="flex items-start justify-between mb-3">
            <p className="text-[10px] text-mid-gray font-semibold tracking-widest uppercase">
              ATTENDANCE
            </p>
            <span className="stat-badge bg-success-light text-success">+2.4%</span>
          </div>
          <p className="text-4xl font-bold text-carbon leading-none">98.2%</p>
          <div className="mt-4">
            <AttendanceGrid />
          </div>
          <p className="text-[11px] text-mid-gray mt-3 font-medium flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" /> Excellent streak this week.
          </p>
        </div>
      </div>


      {/* ══════════════════════════════════════════════════
         ROW 2 — CHARTS & TABLES (3 columns)
      ══════════════════════════════════════════════════ */}
      <div className="grid grid-cols-12 gap-4">

        {/* ─── Subject Split (Donut) ─── */}
        <div className="col-span-4 widget-card p-5">
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="font-bold text-[15px] text-carbon">Subject Split</p>
              <p className="text-[11px] text-mid-gray mt-0.5">Distribution by department</p>
            </div>
            <button className="text-mid-gray hover:text-carbon p-1 transition-colors">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="3" cy="7" r="1" fill="currentColor" /><circle cx="7" cy="7" r="1" fill="currentColor" /><circle cx="11" cy="7" r="1" fill="currentColor" />
              </svg>
            </button>
          </div>

          <div className="flex items-center justify-center py-4">
            <DonutChart
              segments={[
                { value: 33, color: "#660033", label: "Math" },
                { value: 30, color: "#b33c70", label: "Science" },
                { value: 15, color: "#eed0db", label: "Humanities" },
                { value: 10, color: "#fbf2f5", label: "Languages" },
              ]}
              centerValue="111"
              centerLabel="Students"
              size={150}
              strokeWidth={24}
            />
          </div>

          {/* Legend */}
          <div className="space-y-2 mt-2">
            {[
              { label: "Math", pct: "45%", color: "bg-primary-600" },
              { label: "Science", pct: "30%", color: "bg-primary-400" },
              { label: "Humanities", pct: "15%", color: "bg-primary-300" },
              { label: "Languages", pct: "10%", color: "bg-primary-200" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <span className="text-[12px] font-medium text-carbon">{item.label}</span>
                </div>
                <span className="text-[12px] font-bold text-carbon">{item.pct}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Pipeline Activity (Exam Reviews) ─── */}
        <div className="col-span-5 widget-card p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-bold text-[15px] text-carbon">Exam Activity</p>
              <p className="text-[11px] text-mid-gray mt-0.5">Manage recent assessments</p>
            </div>
            <div className="flex items-center gap-1.5 bg-canvas rounded-lg p-0.5">
              <button className="px-3 py-1 text-[11px] font-semibold bg-pure-white rounded-md shadow-sm text-carbon">Board</button>
              <button className="px-3 py-1 text-[11px] font-semibold text-mid-gray hover:text-carbon transition-colors rounded-md">List</button>
            </div>
          </div>

          {/* Filter row */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg border border-fog bg-canvas text-[12px] text-mid-gray">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.2" /><path d="M8 8l2.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
              Filter by exam
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] font-medium text-mid-gray">
                <span className="w-2 h-2 rounded-full bg-warning" />Grading
              </span>
              <span className="flex items-center gap-1 text-[11px] font-medium text-mid-gray">
                <span className="w-2 h-2 rounded-full bg-primary-500" />Complete
              </span>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-end gap-6 mb-4">
            <div>
              <p className="text-3xl font-bold text-carbon">18d</p>
              <p className="text-[11px] text-mid-gray">Avg review time</p>
            </div>
            <span className="stat-badge bg-danger-light text-danger mb-1">-2 days</span>
          </div>

          {/* Exam list */}
          <div className="space-y-2.5 mb-4">
            {[
              { Icon: Ruler, name: "Midterm Math", sub: "Senior 2A · Written", dot: "bg-primary-500" },
              { Icon: Microscope, name: "Physics Lab", sub: "Senior 3B · Practical", dot: "bg-warning" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-canvas transition-colors cursor-pointer">
                <div className="w-12.4 h-12.4 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                  <item.Icon className="w-12.3 h-12.3 text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-carbon">{item.name}</p>
                  <p className="text-[11px] text-mid-gray">{item.sub}</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${item.dot}`} />
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-steel"><path d="M4.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
            ))}
          </div>

          {/* CTA card */}
          <div className="widget-card-dark p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="1" width="12" height="14" rx="2" stroke="white" strokeWidth="1.5" />
                  <path d="M5 5h6M5 8h4M5 11h3" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <p className="text-[13px] font-bold text-white">Review Papers</p>
                <p className="text-[11px] text-white/50">4 exams waiting for review.</p>
              </div>
            </div>
            <Link href="/dashboard/classes">
              <button className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-[12px] font-bold rounded-lg hover:from-primary-700 hover:to-primary-600 transition-all">
                Start Review
              </button>
            </Link>
          </div>
        </div>

        {/* ─── Performance Energy ─── */}
        <div className="col-span-3 widget-card p-5">
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="font-bold text-[15px] text-carbon">Student Energy</p>
              <p className="text-[11px] text-mid-gray mt-0.5">Weekly performance analysis</p>
            </div>
            <button className="text-mid-gray hover:text-carbon p-1 transition-colors">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="3" cy="7" r="1" fill="currentColor" /><circle cx="7" cy="7" r="1" fill="currentColor" /><circle cx="11" cy="7" r="1" fill="currentColor" />
              </svg>
            </button>
          </div>

          <div className="space-y-5 mt-5">
            {/* Energetic */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[13px] font-semibold text-carbon">High Performers</span>
                <span className="text-[15px] font-bold text-carbon">62%</span>
              </div>
              <div className="flex gap-[3px]">
                {Array.from({ length: 20 }, (_, i) => (
                  <div
                    key={i}
                    className={`h-6 flex-1 rounded-[2px] ${i < 12 ? "bg-primary-500" : "bg-primary-100"}`}
                  />
                ))}
              </div>
            </div>

            {/* Balanced */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[13px] font-semibold text-carbon">Balanced</span>
                <span className="text-[15px] font-bold text-carbon">33%</span>
              </div>
              <div className="flex gap-[3px]">
                {Array.from({ length: 20 }, (_, i) => (
                  <div
                    key={i}
                    className={`h-6 flex-1 rounded-[2px] ${i < 7 ? "bg-primary-400" : "bg-primary-100"}`}
                  />
                ))}
              </div>
            </div>

            {/* Muted */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[13px] font-semibold text-carbon">Needs Support</span>
                <span className="text-[15px] font-bold text-carbon">12%</span>
              </div>
              <div className="flex gap-[3px]">
                {Array.from({ length: 20 }, (_, i) => (
                  <div
                    key={i}
                    className={`h-6 flex-1 rounded-[2px] ${i < 2 ? "bg-primary-300" : "bg-primary-100"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* ══════════════════════════════════════════════════
         ROW 3 — RECENT EXAMS TABLE + CLASS BREAKDOWN
      ══════════════════════════════════════════════════ */}
      <div className="grid grid-cols-12 gap-4">

        {/* ─── Recent Exams Table ─── */}
        <div className="col-span-8 widget-card overflow-hidden">
          <div className="px-5 pt-5 pb-3 flex justify-between items-center border-b border-fog">
            <div>
              <p className="text-[10px] text-mid-gray font-semibold tracking-widest uppercase">Recent</p>
              <p className="font-bold text-carbon text-[15px]">Uploads &amp; Results</p>
            </div>
            <Link href="/dashboard/classes" className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors">
              View all →
            </Link>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-5 py-3 text-[11px]">Class</TableHead>
                <TableHead className="px-5 py-3 text-[11px]">Exam</TableHead>
                <TableHead className="px-5 py-3 text-[11px]">Date</TableHead>
                <TableHead className="px-5 py-3 text-[11px]">Status</TableHead>
                <TableHead className="px-5 py-3 text-[11px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentExams.map((job, idx) => (
                <TableRow key={idx} className="hover:bg-primary-50/50 transition-colors">
                  <TableCell className="px-5 py-3 font-bold text-carbon text-sm">{job.class}</TableCell>
                  <TableCell className="px-5 py-3 text-charcoal text-sm">{job.exam}</TableCell>
                  <TableCell className="px-5 py-3 text-mid-gray text-xs font-medium">{job.date}</TableCell>
                  <TableCell className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${job.status === "COMPLETED"
                      ? "bg-success-light text-success"
                      : "bg-warning-light text-warning"
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${job.status === "COMPLETED" ? "bg-success" : "bg-warning animate-pulse-soft"
                        }`} />
                      {job.status}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-3">
                    {job.status === "COMPLETED" ? (
                      <Link href={`/dashboard/classes/senior-2a/exams/${job.id}/results`}>
                        <Button variant="outline" size="sm" className="text-xs h-7 rounded-lg border-fog hover:border-primary-300 hover:text-primary-600 transition-colors">
                          View Results
                        </Button>
                      </Link>
                    ) : (
                      <span className="text-xs text-mid-gray italic">Pending…</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* ─── Class Performance Breakdown ─── */}
        <div className="col-span-4 widget-card-dark p-5 text-white flex flex-col">
          <div className="flex justify-between items-start mb-5">
            <div>
              <p className="text-[10px] text-white/40 font-semibold tracking-widest uppercase">Performance</p>
              <p className="font-bold text-[15px]">Class Breakdown</p>
            </div>
            <Link href="/dashboard/classes" className="text-[10px] text-white/40 hover:text-white transition-colors font-semibold uppercase tracking-wider">
              All →
            </Link>
          </div>

          <div className="space-y-4 flex-1">
            {[
              { name: "Senior 4A", avg: 91, students: 22 },
              { name: "Senior 2A", avg: 82, students: 28 },
              { name: "Senior 1A", avg: 74, students: 32 },
              { name: "Senior 3B", avg: 68, students: 29 },
            ].map((cls, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-semibold">{cls.name}</span>
                  <span className="text-xs text-white/50">{cls.avg}%</span>
                </div>
                <div className="w-full h-[5px] bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-700"
                    style={{ width: `${cls.avg}%` }}
                  />
                </div>
                <p className="text-[10px] text-white/30 mt-1">{cls.students} students</p>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-white/40">School avg</p>
              <p className="text-2xl font-bold">78.8%</p>
            </div>
            <Link href="/dashboard/classes">
              <button className="text-[12px] font-bold text-carbon bg-white hover:bg-gray-100 rounded-xl px-4 py-2 transition-colors">
                All Classes →
              </button>
            </Link>
          </div>
        </div>
      </div>


      {/* ══════════════════════════════════════════════════
         ROW 4 — SUBJECT CARDS
      ══════════════════════════════════════════════════ */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Mathematics", cls: "Senior 4A", avg: 91, exams: 4, students: 22, Icon: Ruler },
          { label: "Sciences", cls: "Senior 2A", avg: 82, exams: 5, students: 28, Icon: Microscope },
          { label: "Humanities", cls: "Senior 3B", avg: 68, exams: 3, students: 29, Icon: BookOpen },
        ].map((card, i) => (
          <div key={i} className="widget-card p-5 group cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                <card.Icon className="w-5 h-5 text-primary-600 animate-pulse-soft" />
              </div>
              <div>
                <p className="text-[10px] text-mid-gray font-semibold tracking-widest uppercase">{card.label}</p>
                <p className="font-bold text-[15px] text-carbon">{card.cls}</p>
              </div>
            </div>

            <MiniBarChart />

            <div className="flex justify-between items-end mt-4 pt-3 border-t border-fog">
              <div>
                <p className="text-[10px] text-mid-gray">Class avg</p>
                <p className="text-3xl font-bold text-carbon leading-tight">{card.avg}%</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-[10px] text-mid-gray">{card.exams} exams · {card.students} students</span>
                <Link href="/dashboard/classes">
                  <button className="text-[11px] text-primary-600 hover:text-primary-700 font-semibold transition-colors">
                    View Details →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
