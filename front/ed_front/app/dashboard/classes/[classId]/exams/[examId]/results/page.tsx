"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area, PieChart, Pie, Cell, Legend,
  LineChart, Line,
} from "recharts";
import {
  Sparkles, TrendingUp, TrendingDown, Users, Target, Award,
  AlertTriangle, BookOpen, Brain, ArrowRight, ChevronRight,
  Zap, Shield, Eye, Lightbulb, BarChart3,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   MOCK DATA — expanded student data with per-topic scores
═══════════════════════════════════════════════════════════ */
const mockStudents = [
  { id: "s1", name: "John Doe", marks: 78, grade: "B", topics: { algebra: 82, geometry: 70, statistics: 78, calculus: 80, trigonometry: 75 } },
  { id: "s2", name: "Mary K.", marks: 92, grade: "A", topics: { algebra: 95, geometry: 88, statistics: 90, calculus: 94, trigonometry: 91 } },
  { id: "s3", name: "Lucas M.", marks: 85, grade: "B", topics: { algebra: 88, geometry: 80, statistics: 85, calculus: 87, trigonometry: 82 } },
  { id: "s4", name: "Emma W.", marks: 99, grade: "A", topics: { algebra: 100, geometry: 97, statistics: 99, calculus: 100, trigonometry: 98 } },
  { id: "s5", name: "Noah L.", marks: 45, grade: "D", topics: { algebra: 50, geometry: 38, statistics: 42, calculus: 48, trigonometry: 40 } },
  { id: "s6", name: "Olivia R.", marks: 65, grade: "C", topics: { algebra: 70, geometry: 58, statistics: 62, calculus: 68, trigonometry: 60 } },
  { id: "s7", name: "Elijah J.", marks: 32, grade: "F", topics: { algebra: 35, geometry: 28, statistics: 30, calculus: 34, trigonometry: 25 } },
  { id: "s8", name: "Sophia T.", marks: 88, grade: "A", topics: { algebra: 90, geometry: 85, statistics: 88, calculus: 92, trigonometry: 86 } },
  { id: "s9", name: "James P.", marks: 71, grade: "B", topics: { algebra: 74, geometry: 65, statistics: 72, calculus: 76, trigonometry: 68 } },
  { id: "s10", name: "Ava C.", marks: 55, grade: "D", topics: { algebra: 58, geometry: 48, statistics: 52, calculus: 60, trigonometry: 50 } },
  { id: "s11", name: "Liam H.", marks: 82, grade: "B", topics: { algebra: 85, geometry: 78, statistics: 80, calculus: 84, trigonometry: 79 } },
  { id: "s12", name: "Mia D.", marks: 76, grade: "B", topics: { algebra: 80, geometry: 70, statistics: 74, calculus: 78, trigonometry: 72 } },
];

/* ═══════════════════════════════════════════════════════════
   COMPUTED ANALYTICS
═══════════════════════════════════════════════════════════ */
const allMarks = mockStudents.map(s => s.marks);
const classAverage = Math.round(allMarks.reduce((a, b) => a + b, 0) / allMarks.length);
const passRate = Math.round((allMarks.filter(m => m >= 50).length / allMarks.length) * 100);
const highestScore = Math.max(...allMarks);
const lowestScore = Math.min(...allMarks);
const topStudent = mockStudents.find(s => s.marks === highestScore)!;
const stdDev = Math.round(Math.sqrt(allMarks.reduce((sum, m) => sum + Math.pow(m - classAverage, 2), 0) / allMarks.length));

const gradeDistribution = [
  { grade: "A", count: mockStudents.filter(s => s.grade === "A").length, fill: "#10b981" },
  { grade: "B", count: mockStudents.filter(s => s.grade === "B").length, fill: "#3b82f6" },
  { grade: "C", count: mockStudents.filter(s => s.grade === "C").length, fill: "#f59e0b" },
  { grade: "D", count: mockStudents.filter(s => s.grade === "D").length, fill: "#f97316" },
  { grade: "F", count: mockStudents.filter(s => s.grade === "F").length, fill: "#ef4444" },
];

const topicNames = ["algebra", "geometry", "statistics", "calculus", "trigonometry"] as const;
const topicAverages = topicNames.map(topic => ({
  topic: topic.charAt(0).toUpperCase() + topic.slice(1),
  average: Math.round(mockStudents.reduce((sum, s) => sum + s.topics[topic], 0) / mockStudents.length),
  fullMark: 100,
}));

const topicsSorted = [...topicAverages].sort((a, b) => b.average - a.average);
const strengths = topicsSorted.slice(0, 2);
const weaknesses = topicsSorted.slice(-2).reverse();

const scoreRanges = [
  { range: "0-20", count: allMarks.filter(m => m <= 20).length },
  { range: "21-40", count: allMarks.filter(m => m > 20 && m <= 40).length },
  { range: "41-60", count: allMarks.filter(m => m > 40 && m <= 60).length },
  { range: "61-80", count: allMarks.filter(m => m > 60 && m <= 80).length },
  { range: "81-100", count: allMarks.filter(m => m > 80 && m <= 100).length },
];

const atRiskStudents = mockStudents.filter(s => s.marks < 50).sort((a, b) => a.marks - b.marks);

const performanceTrend = [
  { exam: "Quiz 1", average: 68 },
  { exam: "Quiz 2", average: 72 },
  { exam: "Mock 1", average: 65 },
  { exam: "Mid 2025", average: 70 },
  { exam: "Final 2025", average: 74 },
  { exam: "This Exam", average: classAverage },
];

/* ═══════════════════════════════════════════════════════════
   CUSTOM TOOLTIP
═══════════════════════════════════════════════════════════ */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-carbon/95 backdrop-blur-md text-white px-4 py-3 rounded-xl shadow-xl border border-white/10">
      <p className="text-[11px] text-white/50 font-medium mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-[13px] font-bold">
          {p.name}: <span style={{ color: p.color }}>{p.value}{typeof p.value === "number" ? (p.name === "count" ? " students" : "%") : ""}</span>
        </p>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   KPI STAT CARD
═══════════════════════════════════════════════════════════ */
function KPICard({ icon: Icon, label, value, subtext, trend, trendUp, accent = "primary" }: {
  icon: any; label: string; value: string; subtext: string; trend?: string; trendUp?: boolean; accent?: string;
}) {
  return (
    <div className="widget-card p-5 flex flex-col justify-between min-h-[140px] group">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
          <Icon className="w-5 h-5 text-primary-600" />
        </div>
        {trend && (
          <span className={`stat-badge ${trendUp ? "bg-success-light text-success" : "bg-danger-light text-danger"}`}>
            {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend}
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-[10px] text-mid-gray font-semibold tracking-widest uppercase">{label}</p>
        <p className="text-3xl font-bold text-carbon leading-tight mt-1">{value}</p>
        <p className="text-[11px] text-mid-gray mt-1">{subtext}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TOPIC MASTERY HEATMAP
═══════════════════════════════════════════════════════════ */
function TopicHeatmap() {
  const getColor = (score: number) => {
    if (score >= 90) return "bg-emerald-500";
    if (score >= 80) return "bg-emerald-400";
    if (score >= 70) return "bg-amber-400";
    if (score >= 60) return "bg-amber-500";
    if (score >= 50) return "bg-orange-500";
    return "bg-red-500";
  };

  const getTextColor = (score: number) => {
    if (score >= 70) return "text-white";
    return "text-white";
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[11px]">
        <thead>
          <tr>
            <th className="text-left py-2 px-2 text-mid-gray font-semibold">Student</th>
            {topicNames.map(t => (
              <th key={t} className="py-2 px-2 text-mid-gray font-semibold text-center capitalize">{t.slice(0, 4)}.</th>
            ))}
            <th className="py-2 px-2 text-mid-gray font-semibold text-center">Avg</th>
          </tr>
        </thead>
        <tbody>
          {mockStudents.slice(0, 8).map(student => (
            <tr key={student.id} className="hover:bg-primary-50/30 transition-colors">
              <td className="py-1.5 px-2 font-semibold text-carbon whitespace-nowrap">{student.name}</td>
              {topicNames.map(topic => (
                <td key={topic} className="py-1.5 px-1 text-center">
                  <span className={`inline-block w-9 h-7 rounded-md ${getColor(student.topics[topic])} ${getTextColor(student.topics[topic])} text-[10px] font-bold leading-[28px]`}>
                    {student.topics[topic]}
                  </span>
                </td>
              ))}
              <td className="py-1.5 px-2 text-center font-bold text-carbon">{student.marks}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-fog px-2">
        <span className="text-[10px] text-mid-gray font-medium">Legend:</span>
        {[
          { label: "90+", color: "bg-emerald-500" },
          { label: "80+", color: "bg-emerald-400" },
          { label: "70+", color: "bg-amber-400" },
          { label: "60+", color: "bg-amber-500" },
          { label: "<60", color: "bg-red-500" },
        ].map(l => (
          <span key={l.label} className="flex items-center gap-1">
            <span className={`w-3 h-3 rounded-sm ${l.color}`} />
            <span className="text-[10px] text-mid-gray">{l.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   AI RECOMMENDATION CARD
═══════════════════════════════════════════════════════════ */
function RecommendationItem({ icon: Icon, title, description, priority }: {
  icon: any; title: string; description: string; priority: "high" | "medium" | "low";
}) {
  const priorityStyles = {
    high: "border-l-red-500 bg-red-500/5",
    medium: "border-l-amber-500 bg-amber-500/5",
    low: "border-l-emerald-500 bg-emerald-500/5",
  };
  return (
    <div className={`border-l-4 rounded-r-xl p-4 ${priorityStyles[priority]} transition-all hover:shadow-md cursor-pointer group`}>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-white/80 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
          <Icon className="w-4.5 h-4.5 text-carbon" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-[13px] font-bold text-carbon">{title}</h4>
            <span className={`stat-badge ${
              priority === "high" ? "bg-danger-light text-danger" :
              priority === "medium" ? "bg-warning-light text-warning" :
              "bg-success-light text-success"
            }`}>
              {priority}
            </span>
          </div>
          <p className="text-[12px] text-mid-gray leading-relaxed">{description}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-steel shrink-0 mt-1 group-hover:text-carbon group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   GENERAL CLASS INSIGHTS TAB
═══════════════════════════════════════════════════════════ */
function ClassInsightsTab() {
  return (
    <div className="space-y-5 animate-fade-in">

      {/* ── ROW 1: AI Overview Banner ── */}
      <div className="widget-card-dark p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary-600/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-primary-500/10 to-transparent rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shrink-0 shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-[15px] font-bold text-white">AI Class Performance Summary</h3>
              <span className="stat-badge bg-primary-600/30 text-primary-300 border border-primary-500/30">Auto-generated</span>
            </div>
            <p className="text-[13px] text-white/70 leading-relaxed max-w-3xl">
              The class demonstrates <span className="text-white font-semibold">solid overall performance</span> with an average score of {classAverage}%.
              <span className="text-emerald-400 font-semibold"> Algebra and Calculus</span> are clear strengths across most students.
              However, <span className="text-amber-400 font-semibold">Geometry and Trigonometry</span> show consistent weaknesses,
              particularly among lower-performing students. {atRiskStudents.length} student{atRiskStudents.length !== 1 ? "s" : ""} scored below the
              passing threshold and may require targeted intervention. The class shows a positive upward trend compared to previous assessments.
            </p>
          </div>
        </div>
        <div className="relative flex items-center gap-6 mt-5 pt-4 border-t border-white/10">
          {[
            { label: "Confidence Level", value: "94%" },
            { label: "Data Points Analyzed", value: `${mockStudents.length * 5}` },
            { label: "Improvement Potential", value: "+8%" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[10px] text-white/40 font-medium uppercase tracking-wider">{item.label}</span>
              <span className="text-[13px] font-bold text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>


      {/* ── ROW 2: KPI Stat Cards ── */}
      <div className="grid grid-cols-4 gap-4">
        <KPICard
          icon={BarChart3}
          label="Class Average"
          value={`${classAverage}%`}
          subtext={`School avg: 78% · ${classAverage >= 78 ? "+" : ""}${classAverage - 78}% diff`}
          trend={`${classAverage >= 78 ? "+" : ""}${classAverage - 78}%`}
          trendUp={classAverage >= 78}
        />
        <KPICard
          icon={Target}
          label="Pass Rate"
          value={`${passRate}%`}
          subtext={`${allMarks.filter(m => m >= 50).length} of ${allMarks.length} students passed`}
          trend={passRate >= 80 ? "Good" : "Needs attention"}
          trendUp={passRate >= 80}
        />
        <KPICard
          icon={Award}
          label="Highest Score"
          value={`${highestScore}%`}
          subtext={`Achieved by ${topStudent.name}`}
          trend="Top performer"
          trendUp={true}
        />
        <KPICard
          icon={TrendingUp}
          label="Score Spread"
          value={`σ ${stdDev}`}
          subtext={`Range: ${lowestScore}% – ${highestScore}%`}
          trend={stdDev > 20 ? "High variance" : "Moderate"}
          trendUp={stdDev <= 20}
        />
      </div>


      {/* ── ROW 3: Grade Distribution + Radar Chart ── */}
      <div className="grid grid-cols-12 gap-4">

        {/* Grade Distribution */}
        <div className="col-span-5 widget-card p-5">
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="font-bold text-[15px] text-carbon">Grade Distribution</p>
              <p className="text-[11px] text-mid-gray mt-0.5">Breakdown of student grades across the exam</p>
            </div>
            <span className="stat-badge bg-primary-50 text-primary-600">{mockStudents.length} students</span>
          </div>
          <div className="h-[250px] mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDistribution} barSize={36} margin={{ top: 10, right: 10, bottom: 5, left: -15 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="grade" tick={{ fontSize: 12, fontWeight: 600, fill: "#374151" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(102, 0, 51, 0.04)" }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} name="count">
                  {gradeDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-2 pt-3 border-t border-fog">
            {gradeDistribution.map(g => (
              <div key={g.grade} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.fill }} />
                <span className="text-[11px] text-mid-gray font-medium">{g.grade}: {g.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Topic Mastery Radar */}
        <div className="col-span-4 widget-card p-5">
          <div className="mb-1">
            <p className="font-bold text-[15px] text-carbon">Topic Mastery</p>
            <p className="text-[11px] text-mid-gray mt-0.5">Average competency by subject area</p>
          </div>
          <div className="h-[270px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={topicAverages} cx="50%" cy="50%" outerRadius="72%">
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="topic" tick={{ fontSize: 11, fontWeight: 600, fill: "#374151" }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} />
                <Radar name="Class Average" dataKey="average" stroke="#660033" fill="#660033" fillOpacity={0.15} strokeWidth={2} dot={{ fill: "#660033", r: 4 }} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Trend */}
        <div className="col-span-3 widget-card p-5">
          <div className="mb-1">
            <p className="font-bold text-[15px] text-carbon">Performance Trend</p>
            <p className="text-[11px] text-mid-gray mt-0.5">Class average over assessments</p>
          </div>
          <div className="h-[270px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceTrend} margin={{ top: 10, right: 10, bottom: 5, left: -20 }}>
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#660033" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#660033" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="exam" tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" height={40} />
                <YAxis domain={[55, 85]} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone" dataKey="average" name="Average"
                  stroke="#660033" strokeWidth={2.5} fill="url(#trendGradient)"
                  dot={{ fill: "#660033", r: 4, strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 6, stroke: "#660033", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>


      {/* ── ROW 4: Strengths & Weaknesses ── */}
      <div className="grid grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="widget-card p-5 border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-bold text-[15px] text-carbon">Class Strengths</p>
              <p className="text-[11px] text-mid-gray mt-0.5">Top performing areas — above 75% average</p>
            </div>
          </div>
          <div className="space-y-4">
            {strengths.map((t, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] font-semibold text-carbon">{t.topic}</span>
                  <span className="text-[13px] font-bold text-emerald-600">{t.average}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-700"
                    style={{ width: `${t.average}%` }}
                  />
                </div>
                <p className="text-[10px] text-mid-gray">
                  {i === 0 ? "Students consistently excel in this area with strong foundational understanding." : "Good grasp of concepts with room for advanced challenges."}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Weaknesses */}
        <div className="widget-card p-5 border-l-4 border-l-amber-500">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-bold text-[15px] text-carbon">Areas for Improvement</p>
              <p className="text-[11px] text-mid-gray mt-0.5">Topics requiring additional focus and support</p>
            </div>
          </div>
          <div className="space-y-4">
            {weaknesses.map((t, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] font-semibold text-carbon">{t.topic}</span>
                  <span className="text-[13px] font-bold text-amber-600">{t.average}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-700"
                    style={{ width: `${t.average}%` }}
                  />
                </div>
                <p className="text-[10px] text-mid-gray">
                  {i === 0 ? "Spatial reasoning and geometric proofs need reinforcement across the class." : "Many students struggle with angle relationships and identities."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* ── ROW 5: Score Distribution + Topic Heatmap ── */}
      <div className="grid grid-cols-12 gap-4">
        {/* Score Distribution */}
        <div className="col-span-5 widget-card p-5">
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="font-bold text-[15px] text-carbon">Score Distribution</p>
              <p className="text-[11px] text-mid-gray mt-0.5">How student scores are spread across ranges</p>
            </div>
          </div>
          <div className="h-[220px] mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scoreRanges} margin={{ top: 10, right: 10, bottom: 5, left: -15 }}>
                <defs>
                  <linearGradient id="scoreDistGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#b33c70" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#b33c70" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone" dataKey="count" name="Students"
                  stroke="#b33c70" strokeWidth={2.5} fill="url(#scoreDistGradient)"
                  dot={{ fill: "#b33c70", r: 4, strokeWidth: 2, stroke: "#fff" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-fog">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-mid-gray font-medium">Above Avg: {allMarks.filter(m => m >= classAverage).length}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-[10px] text-mid-gray font-medium">Below Avg: {allMarks.filter(m => m < classAverage).length}</span>
            </div>
          </div>
        </div>

        {/* Topic Mastery Heatmap */}
        <div className="col-span-7 widget-card p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-bold text-[15px] text-carbon">Student × Topic Heatmap</p>
              <p className="text-[11px] text-mid-gray mt-0.5">Individual performance across exam topics</p>
            </div>
            <span className="stat-badge bg-primary-50 text-primary-600">
              <Eye className="w-3 h-3" /> Detailed View
            </span>
          </div>
          <TopicHeatmap />
        </div>
      </div>


      {/* ── ROW 6: At-Risk Students ── */}
      {atRiskStudents.length > 0 && (
        <div className="widget-card overflow-hidden border-l-4 border-l-red-500">
          <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-fog">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="font-bold text-[15px] text-carbon">At-Risk Students</p>
                <p className="text-[11px] text-mid-gray">Students scoring below the 50% passing threshold</p>
              </div>
            </div>
            <span className="stat-badge bg-danger-light text-danger">{atRiskStudents.length} student{atRiskStudents.length !== 1 ? "s" : ""}</span>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-5 py-3 text-[11px] font-semibold text-mid-gray uppercase tracking-wider">Student</TableHead>
                <TableHead className="px-5 py-3 text-[11px] font-semibold text-mid-gray uppercase tracking-wider">Score</TableHead>
                <TableHead className="px-5 py-3 text-[11px] font-semibold text-mid-gray uppercase tracking-wider">Gap to Pass</TableHead>
                <TableHead className="px-5 py-3 text-[11px] font-semibold text-mid-gray uppercase tracking-wider">Weakest Topic</TableHead>
                <TableHead className="px-5 py-3 text-[11px] font-semibold text-mid-gray uppercase tracking-wider">Strongest Topic</TableHead>
                <TableHead className="px-5 py-3 text-[11px] font-semibold text-mid-gray uppercase tracking-wider text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {atRiskStudents.map((student) => {
                const topicScores = Object.entries(student.topics) as [string, number][];
                const weakest = topicScores.reduce((a, b) => a[1] < b[1] ? a : b);
                const strongest = topicScores.reduce((a, b) => a[1] > b[1] ? a : b);
                return (
                  <TableRow key={student.id} className="hover:bg-red-50/30 transition-colors">
                    <TableCell className="px-5 py-3 font-bold text-carbon text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white text-[9px] font-bold">
                          {student.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        {student.name}
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">{student.marks}%</span>
                    </TableCell>
                    <TableCell className="px-5 py-3 text-red-600 font-bold text-sm">-{50 - student.marks}%</TableCell>
                    <TableCell className="px-5 py-3">
                      <span className="text-xs text-mid-gray capitalize">{weakest[0]} <span className="text-red-600 font-bold">({weakest[1]}%)</span></span>
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <span className="text-xs text-mid-gray capitalize">{strongest[0]} <span className="text-emerald-600 font-bold">({strongest[1]}%)</span></span>
                    </TableCell>
                    <TableCell className="px-5 py-3 text-right">
                      <Link href={`/dashboard/students/${student.id}`}>
                        <Button variant="ghost" size="sm" className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50">
                          View Profile <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}


      {/* ── ROW 7: AI Recommendations ── */}
      <div className="widget-card p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-[15px] text-carbon">AI Recommendations</p>
            <p className="text-[11px] text-mid-gray mt-0.5">Actionable insights based on class performance analysis</p>
          </div>
        </div>
        <div className="space-y-3">
          <RecommendationItem
            icon={AlertTriangle}
            title="Schedule Geometry Remedial Sessions"
            description={`Geometry is the weakest topic with a class average of ${topicAverages.find(t => t.topic === "Geometry")?.average}%. Consider organizing 2–3 targeted remedial sessions focusing on spatial reasoning, geometric proofs, and coordinate geometry.`}
            priority="high"
          />
          <RecommendationItem
            icon={BookOpen}
            title="Trigonometry Practice Materials"
            description={`Trigonometry averages ${topicAverages.find(t => t.topic === "Trigonometry")?.average}%, making it the second weakest area. Distribute additional practice worksheets covering angle relationships, identities, and real-world applications.`}
            priority="high"
          />
          <RecommendationItem
            icon={Zap}
            title="Challenge Top Performers"
            description={`${mockStudents.filter(s => s.marks >= 85).length} students scored above 85%. Consider offering advanced problem sets or enrichment activities to maintain their engagement and push toward olympiad-level challenges.`}
            priority="medium"
          />
          <RecommendationItem
            icon={Shield}
            title="Individual Support Plans"
            description={`${atRiskStudents.length} student${atRiskStudents.length !== 1 ? "s" : ""} scored below 50%. Create personalized intervention plans including one-on-one tutoring, peer mentoring, and modified assessments to bridge the gap.`}
            priority="high"
          />
          <RecommendationItem
            icon={Lightbulb}
            title="Leverage Algebra Strengths"
            description={`Algebra is the strongest topic at ${topicAverages.find(t => t.topic === "Algebra")?.average}%. Use algebraic approaches to introduce weaker topics — for example, using algebraic proofs to build geometric understanding.`}
            priority="low"
          />
        </div>
      </div>

    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   STUDENT RESULTS TAB (original table)
═══════════════════════════════════════════════════════════ */
function StudentResultsTab() {
  return (
    <div className="animate-fade-in">
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="p-4 bg-soft-white border-b border-fog flex gap-4 items-center">
          <div className="flex-1 max-w-sm">
            <Input placeholder="Search students..." />
          </div>
          <select className="h-10 rounded-md border border-fog bg-surface-card px-3 text-body-sm text-carbon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aubergine">
            <option>All Grades</option>
            <option>A (90-100)</option>
            <option>B (80-89)</option>
            <option>C (70-79)</option>
            <option>D (60-69)</option>
            <option>F (0-59)</option>
          </select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="p-6 text-sm font-semibold text-mid-gray uppercase tracking-wider">Student Name</TableHead>
              <TableHead className="p-6 text-sm font-semibold text-mid-gray uppercase tracking-wider">Marks</TableHead>
              <TableHead className="p-6 text-sm font-semibold text-mid-gray uppercase tracking-wider">Grade</TableHead>
              <TableHead className="p-6 text-sm font-semibold text-mid-gray uppercase tracking-wider text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="p-6 text-carbon font-bold">{student.name}</TableCell>
                <TableCell className="p-6 text-carbon">{student.marks}%</TableCell>
                <TableCell className="p-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    student.grade === 'A' ? 'bg-green-100 text-green-700' :
                    student.grade === 'B' ? 'bg-blue-100 text-blue-700' :
                    student.grade === 'C' ? 'bg-yellow-100 text-yellow-700' :
                    student.grade === 'D' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {student.grade}
                  </span>
                </TableCell>
                <TableCell className="p-6 text-right">
                  <Link href={`/dashboard/students/${student.id}`}>
                    <Button variant="ghost" size="sm">View Details</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
export default function ResultsPage() {
  const params = useParams();
  const classId = (params.classId as string) || "class";
  const examId = (params.examId as string) || "exam";
  const [activeTab, setActiveTab] = useState<"students" | "insights">("insights");

  const formattedClass = classId.replace("-", " ").replace(/\b[a-z]/g, l => l.toUpperCase()).replace(/(\d)([a-z])\b/gi, (_, num, letter) => num + letter.toUpperCase());
  const formattedExam = examId.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase());

  const tabs = [
    { id: "students" as const, label: "Student Results", icon: Users },
    { id: "insights" as const, label: "General Class Insights", icon: Sparkles },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumbs */}
      <div className="text-sm font-bold text-mid-gray flex gap-2 items-center flex-wrap">
        <Link href="/dashboard" className="hover:text-aubergine transition-colors">Dashboard</Link>
        <span>/</span>
        <Link href="/dashboard/classes" className="hover:text-aubergine transition-colors">Classes</Link>
        <span>/</span>
        <Link href={`/dashboard/classes/${classId}`} className="hover:text-aubergine transition-colors">{formattedClass}</Link>
        <span>/</span>
        <span className="text-carbon">Results</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-subheading mb-2">{formattedClass} - {formattedExam}</h1>
          <p className="text-charcoal text-body-sm">Detailed student results and AI-powered class analytics.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export CSV</Button>
          <Button variant="outline">Export PDF</Button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 p-1 bg-canvas rounded-2xl w-fit border border-fog/60">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-pure-white text-carbon shadow-card border border-fog/40"
                : "text-mid-gray hover:text-carbon hover:bg-white/50"
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-primary-600" : ""}`} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "students" ? <StudentResultsTab /> : <ClassInsightsTab />}
    </div>
  );
}
