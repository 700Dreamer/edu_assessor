"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from "recharts";
import {
  ArrowLeft, Award, Target, TrendingUp, TrendingDown,
  Sparkles, Brain, BookOpen, AlertTriangle, CheckCircle2,
  FileText, ZoomIn, ZoomOut, ChevronLeft, ChevronRight,
  Download, Maximize2, Eye, Lightbulb, Shield, Zap,
  ClipboardCheck, BarChart3, PenTool, MessageSquare,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   MOCK DATA — This student's exam result
   In production, fetched via API using studentId + examId
═══════════════════════════════════════════════════════════ */
const studentDataMap: Record<string, {
  name: string; class: string; examName: string; examSubject: string;
  score: number; grade: string; totalMarks: number; classAvg: number; classRank: number; totalStudents: number;
  timeTaken: string; dateSubmitted: string;
  pdfUrl: string;
  sections: { name: string; scored: number; total: number; percentage: number }[];
  questionBreakdown: { q: string; topic: string; scored: number; total: number; feedback: string; status: "correct" | "partial" | "incorrect" }[];
  aiAnalysis: {
    overallRemark: string;
    strengths: { area: string; detail: string; score: number }[];
    weaknesses: { area: string; detail: string; score: number }[];
    recommendations: { title: string; detail: string; priority: "high" | "medium" | "low" }[];
    conceptMastery: { concept: string; mastery: number }[];
    writingMetrics: { metric: string; score: number; maxScore: number }[];
  };
}> = {
  s1: {
    name: "John Doe", class: "Senior 1A", examName: "Midterm 2026", examSubject: "Mathematics",
    score: 78, grade: "B", totalMarks: 100, classAvg: 73, classRank: 5, totalStudents: 12,
    timeTaken: "1h 42m", dateSubmitted: "Jul 05, 2026", pdfUrl: "/sample-exam.pdf",
    sections: [
      { name: "Section A — Multiple Choice", scored: 18, total: 20, percentage: 90 },
      { name: "Section B — Short Answer", scored: 32, total: 40, percentage: 80 },
      { name: "Section C — Problem Solving", scored: 28, total: 40, percentage: 70 },
    ],
    questionBreakdown: [
      { q: "Q1", topic: "Algebra", scored: 5, total: 5, feedback: "Correct approach and solution.", status: "correct" },
      { q: "Q2", topic: "Algebra", scored: 4, total: 5, feedback: "Minor arithmetic error in final step.", status: "partial" },
      { q: "Q3", topic: "Geometry", scored: 3, total: 5, feedback: "Correct formula but missed angle conversion.", status: "partial" },
      { q: "Q4", topic: "Geometry", scored: 2, total: 5, feedback: "Incomplete proof — missing two key steps.", status: "partial" },
      { q: "Q5", topic: "Statistics", scored: 5, total: 5, feedback: "Excellent interpretation of data.", status: "correct" },
      { q: "Q6", topic: "Statistics", scored: 4, total: 5, feedback: "Correct approach, rounding error in conclusion.", status: "partial" },
      { q: "Q7", topic: "Calculus", scored: 5, total: 5, feedback: "Perfect differentiation and integration.", status: "correct" },
      { q: "Q8", topic: "Calculus", scored: 3, total: 5, feedback: "Missed the chain rule in part (b).", status: "partial" },
      { q: "Q9", topic: "Trigonometry", scored: 4, total: 5, feedback: "Correct identities used throughout.", status: "partial" },
      { q: "Q10", topic: "Trigonometry", scored: 0, total: 5, feedback: "Question not attempted.", status: "incorrect" },
    ],
    aiAnalysis: {
      overallRemark: "John demonstrates solid mathematical ability with strong algebraic and statistical reasoning. His performance in Sections A and B is commendable. However, there is a notable drop in Section C (Problem Solving), particularly in geometry proofs and trigonometric applications. The unattempted Q10 suggests possible time management issues or lack of confidence in trigonometric identities.",
      strengths: [
        { area: "Algebraic Reasoning", detail: "Consistently correct in algebraic manipulation and equation solving. Shows structured thinking.", score: 90 },
        { area: "Data Interpretation", detail: "Strong statistical literacy — correctly interprets charts, means, and deviations.", score: 88 },
        { area: "Calculus Fundamentals", detail: "Good grasp of differentiation. Integration technique is methodical.", score: 80 },
      ],
      weaknesses: [
        { area: "Geometric Proofs", detail: "Struggles with multi-step proofs. Tends to skip intermediate reasoning steps.", score: 50 },
        { area: "Trigonometric Applications", detail: "Weak on identity transformations. Left Q10 unanswered entirely.", score: 40 },
        { area: "Time Management", detail: "Unattempted question suggests pacing issues in extended problem sections.", score: 55 },
      ],
      recommendations: [
        { title: "Focused Trigonometry Practice", detail: "Assign daily 15-minute drills on identity proofs and angle transformations. Start with basic identities before advancing to compound angles.", priority: "high" },
        { title: "Geometry Proof Workshop", detail: "Practice structured proof writing with step-by-step reasoning chains. Use visual aids and geometric construction exercises.", priority: "high" },
        { title: "Timed Practice Tests", detail: "Simulate exam conditions with strict time limits. Focus on Section C pacing — allocate 15 mins per question.", priority: "medium" },
        { title: "Build on Algebra Strength", detail: "Use algebraic approaches to introduce trigonometric concepts. This bridges from a strong area to a weak one.", priority: "low" },
      ],
      conceptMastery: [
        { concept: "Algebra", mastery: 90 },
        { concept: "Geometry", mastery: 50 },
        { concept: "Statistics", mastery: 88 },
        { concept: "Calculus", mastery: 80 },
        { concept: "Trigonometry", mastery: 40 },
      ],
      writingMetrics: [
        { metric: "Clarity of Working", score: 8, maxScore: 10 },
        { metric: "Logical Progression", score: 7, maxScore: 10 },
        { metric: "Notation & Formatting", score: 9, maxScore: 10 },
        { metric: "Completeness", score: 6, maxScore: 10 },
        { metric: "Error Checking", score: 5, maxScore: 10 },
      ],
    },
  },
};

// Fallback generator for unknown student IDs
function getStudentData(id: string) {
  if (studentDataMap[id]) return studentDataMap[id];
  // Generate plausible mock for any student ID
  const names: Record<string, string> = {
    s2: "Mary K.", s3: "Lucas M.", s4: "Emma W.", s5: "Noah L.",
    s6: "Olivia R.", s7: "Elijah J.", s8: "Sophia T.", s9: "James P.",
    s10: "Ava C.", s11: "Liam H.", s12: "Mia D.",
  };
  const scores: Record<string, number> = {
    s2: 92, s3: 85, s4: 99, s5: 45, s6: 65, s7: 32, s8: 88, s9: 71, s10: 55, s11: 82, s12: 76,
  };
  const grades: Record<string, string> = {
    s2: "A", s3: "B", s4: "A", s5: "D", s6: "C", s7: "F", s8: "A", s9: "B", s10: "D", s11: "B", s12: "B",
  };
  const score = scores[id] || 65;
  const grade = grades[id] || "C";
  const name = names[id] || `Student ${id}`;
  const isLow = score < 50;

  return {
    name, class: "Senior 1A", examName: "Midterm 2026", examSubject: "Mathematics",
    score, grade, totalMarks: 100, classAvg: 73, classRank: isLow ? 11 : 6, totalStudents: 12,
    timeTaken: isLow ? "1h 05m" : "1h 38m", dateSubmitted: "Jul 05, 2026", pdfUrl: "/sample-exam.pdf",
    sections: [
      { name: "Section A — Multiple Choice", scored: Math.round(score * 0.22), total: 20, percentage: Math.round(score * 1.1) },
      { name: "Section B — Short Answer", scored: Math.round(score * 0.38), total: 40, percentage: Math.round(score * 0.95) },
      { name: "Section C — Problem Solving", scored: Math.round(score * 0.4) - (isLow ? 10 : 0), total: 40, percentage: Math.round(score * (isLow ? 0.55 : 0.85)) },
    ],
    questionBreakdown: [
      { q: "Q1", topic: "Algebra", scored: Math.min(5, Math.round(score * 0.055)), total: 5, feedback: score >= 70 ? "Correct approach." : "Significant errors in simplification.", status: (score >= 70 ? "correct" : "partial") as any },
      { q: "Q2", topic: "Algebra", scored: Math.min(5, Math.round(score * 0.05)), total: 5, feedback: score >= 60 ? "Minor error in final step." : "Incorrect method applied.", status: (score >= 60 ? "partial" : "incorrect") as any },
      { q: "Q3", topic: "Geometry", scored: Math.min(5, Math.round(score * 0.04)), total: 5, feedback: isLow ? "No working shown." : "Partially correct.", status: (isLow ? "incorrect" : "partial") as any },
      { q: "Q4", topic: "Geometry", scored: Math.min(5, Math.round(score * 0.035)), total: 5, feedback: isLow ? "Unable to identify the correct theorem." : "Good attempt, missing one step.", status: (isLow ? "incorrect" : "partial") as any },
      { q: "Q5", topic: "Statistics", scored: Math.min(5, Math.round(score * 0.05)), total: 5, feedback: score >= 70 ? "Excellent data interpretation." : "Misread the chart values.", status: (score >= 70 ? "correct" : "partial") as any },
      { q: "Q6", topic: "Statistics", scored: Math.min(5, Math.round(score * 0.045)), total: 5, feedback: "Rounding error in conclusion.", status: "partial" as any },
      { q: "Q7", topic: "Calculus", scored: Math.min(5, Math.round(score * 0.05)), total: 5, feedback: score >= 80 ? "Perfect solution." : "Missed the constant of integration.", status: (score >= 80 ? "correct" : "partial") as any },
      { q: "Q8", topic: "Calculus", scored: Math.min(5, Math.round(score * 0.035)), total: 5, feedback: "Chain rule not applied correctly.", status: "partial" as any },
      { q: "Q9", topic: "Trigonometry", scored: Math.min(5, Math.round(score * 0.03)), total: 5, feedback: isLow ? "Attempted but incorrect approach." : "Correct identities used.", status: (isLow ? "incorrect" : "partial") as any },
      { q: "Q10", topic: "Trigonometry", scored: isLow ? 0 : Math.min(5, Math.round(score * 0.02)), total: 5, feedback: isLow ? "Not attempted." : "Partial solution.", status: (isLow ? "incorrect" : "partial") as any },
    ],
    aiAnalysis: {
      overallRemark: isLow
        ? `${name} is significantly struggling across most topics. The score of ${score}% is well below the class average of 73%. Geometry and Trigonometry are critically weak areas. Section C was largely incomplete, suggesting either lack of understanding or severe time constraints. Immediate intervention is required with structured support across all topics.`
        : `${name} shows ${score >= 85 ? "excellent" : "competent"} mathematical ability with an overall score of ${score}%. ${score >= 85 ? "Performance is consistently above class average across most topics." : "There are some areas that could benefit from additional practice, particularly in geometric reasoning."} The exam was completed within a reasonable timeframe.`,
      strengths: isLow
        ? [
            { area: "Basic Arithmetic", detail: "Can perform simple calculations when provided with clear steps.", score: 55 },
            { area: "Effort & Attendance", detail: "Consistent attendance and willingness to attempt questions.", score: 60 },
          ]
        : [
            { area: "Algebraic Reasoning", detail: "Strong symbolic manipulation and equation solving skills.", score: Math.min(100, score + 10) },
            { area: "Statistical Analysis", detail: "Good data interpretation and chart reading ability.", score: Math.min(100, score + 5) },
            { area: "Calculus Fundamentals", detail: "Solid understanding of derivatives and basic integrals.", score: Math.min(100, score) },
          ],
      weaknesses: isLow
        ? [
            { area: "Geometric Reasoning", detail: "Unable to apply theorems or construct proofs. Needs foundational reteaching.", score: 25 },
            { area: "Trigonometry", detail: "No grasp of identities or angle relationships. Did not attempt related questions.", score: 15 },
            { area: "Problem Solving", detail: "Cannot break down multi-step problems. Section C largely incomplete.", score: 30 },
            { area: "Time Management", detail: "Spent too long on early questions, leaving Section C mostly empty.", score: 35 },
          ]
        : [
            { area: "Geometric Proofs", detail: "Tends to skip intermediate reasoning steps in proofs.", score: Math.max(30, score - 25) },
            { area: "Trigonometric Identities", detail: "Weak on complex identity transformations.", score: Math.max(25, score - 35) },
          ],
      recommendations: isLow
        ? [
            { title: "Urgent Foundational Support", detail: "Enroll in after-school remedial math program focusing on basic algebra and arithmetic fluency.", priority: "high" as const },
            { title: "One-on-One Tutoring", detail: "Schedule 3x weekly tutoring sessions with focus on geometry fundamentals and visual learning aids.", priority: "high" as const },
            { title: "Simplified Practice Sets", detail: "Provide scaffolded worksheets that break complex problems into smaller, manageable steps.", priority: "medium" as const },
            { title: "Confidence Building", detail: "Start with problems at current ability level and gradually increase difficulty. Celebrate small wins.", priority: "medium" as const },
          ]
        : [
            { title: "Geometry Practice", detail: "Focus on proof-writing exercises and geometric construction to build spatial reasoning.", priority: "high" as const },
            { title: "Trigonometry Drills", detail: "Daily 15-minute identity practice sessions starting from basic to compound angles.", priority: score < 75 ? "high" as const : "medium" as const },
            { title: "Timed Practice", detail: "Simulate exam conditions to improve pacing and time allocation in Section C.", priority: "medium" as const },
          ],
      conceptMastery: [
        { concept: "Algebra", mastery: isLow ? 40 : Math.min(100, score + 10) },
        { concept: "Geometry", mastery: isLow ? 20 : Math.max(40, score - 20) },
        { concept: "Statistics", mastery: isLow ? 35 : Math.min(95, score + 5) },
        { concept: "Calculus", mastery: isLow ? 30 : Math.min(90, score) },
        { concept: "Trigonometry", mastery: isLow ? 10 : Math.max(30, score - 30) },
      ],
      writingMetrics: [
        { metric: "Clarity of Working", score: isLow ? 3 : 8, maxScore: 10 },
        { metric: "Logical Progression", score: isLow ? 2 : 7, maxScore: 10 },
        { metric: "Notation & Formatting", score: isLow ? 4 : 9, maxScore: 10 },
        { metric: "Completeness", score: isLow ? 2 : 6, maxScore: 10 },
        { metric: "Error Checking", score: isLow ? 1 : 5, maxScore: 10 },
      ],
    },
  };
}

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
          {p.name}: <span style={{ color: p.color || "#fff" }}>{p.value}%</span>
        </p>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   RING PROGRESS (circular gauge)
═══════════════════════════════════════════════════════════ */
function RingProgress({ value, size = 72, stroke = 7, color = "#660033", label }: {
  value: number; size?: number; stroke?: number; color?: string; label?: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div className="relative flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
            strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round" className="transition-all duration-700"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[14px] font-bold text-carbon">
          {value}%
        </span>
      </div>
      {label && <span className="text-[10px] text-mid-gray font-medium mt-1.5">{label}</span>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PDF PREVIEW COMPONENT
═══════════════════════════════════════════════════════════ */
function PaperPreview({ pdfUrl, studentName }: { pdfUrl: string; studentName: string }) {
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3; // Mock

  return (
    <div className="widget-card overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 bg-soft-white border-b border-fog">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
            <FileText className="w-4.5 h-4.5 text-primary-600" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-carbon">Exam Paper — {studentName}</p>
            <p className="text-[10px] text-mid-gray">Original submitted answer sheet (PDF)</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-canvas rounded-lg p-1 border border-fog/60">
            <button
              onClick={() => setZoom(z => Math.max(50, z - 25))}
              className="p-1.5 rounded-md hover:bg-pure-white transition-colors text-mid-gray hover:text-carbon"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-bold text-carbon min-w-[40px] text-center">{zoom}%</span>
            <button
              onClick={() => setZoom(z => Math.min(200, z + 25))}
              className="p-1.5 rounded-md hover:bg-pure-white transition-colors text-mid-gray hover:text-carbon"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
          {/* Page nav */}
          <div className="flex items-center gap-1 bg-canvas rounded-lg p-1 border border-fog/60">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-1.5 rounded-md hover:bg-pure-white transition-colors text-mid-gray hover:text-carbon"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-bold text-carbon min-w-[50px] text-center">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-md hover:bg-pure-white transition-colors text-mid-gray hover:text-carbon"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <button className="p-2 rounded-lg hover:bg-canvas transition-colors text-mid-gray hover:text-carbon" title="Fullscreen">
            <Maximize2 className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-canvas transition-colors text-mid-gray hover:text-carbon" title="Download">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PDF Viewer Area */}
      <div className="bg-[#525659] p-6 flex items-center justify-center min-h-[600px] overflow-auto">
        <div
          className="bg-white shadow-2xl rounded-sm transition-transform duration-300"
          style={{
            width: `${(595 * zoom) / 100}px`,
            minHeight: `${(842 * zoom) / 100}px`,
            transform: `scale(1)`,
          }}
        >
          {/* Simulated exam paper content */}
          <div className="p-8" style={{ fontSize: `${(14 * zoom) / 100}px` }}>
            {/* Header */}
            <div className="text-center border-b-2 border-carbon pb-4 mb-6">
              <p className="text-[0.7em] text-mid-gray uppercase tracking-widest font-semibold">Springfield Academy</p>
              <h2 className="text-[1.4em] font-bold text-carbon mt-1">Mathematics — Midterm Examination 2026</h2>
              <div className="flex justify-between mt-3 text-[0.75em] text-charcoal">
                <span>Class: Senior 1A</span>
                <span>Time: 2 Hours</span>
                <span>Total Marks: 100</span>
              </div>
              <div className="flex justify-between mt-1 text-[0.75em] text-charcoal">
                <span>Student: <strong>{studentName}</strong></span>
                <span>Date: July 5, 2026</span>
              </div>
            </div>

            {/* Section A */}
            <div className="mb-6">
              <h3 className="text-[1em] font-bold text-carbon mb-3 bg-soft-white px-3 py-1.5 rounded">
                Section A — Multiple Choice (20 marks)
              </h3>
              <div className="space-y-4 pl-2 text-[0.85em] text-charcoal">
                <div>
                  <p className="font-semibold">1. Simplify: 3(2x + 4) − 2(x − 1)</p>
                  <div className="ml-4 mt-1.5 p-2 bg-emerald-50/60 border-l-3 border-emerald-500 rounded-r">
                    <p className="text-carbon">= 6x + 12 − 2x + 2 = <strong>4x + 14</strong> ✓</p>
                  </div>
                  <p className="text-[0.8em] text-emerald-600 font-semibold ml-4 mt-1">5/5 marks — Correct</p>
                </div>
                <div>
                  <p className="font-semibold">2. Solve for x: 2x² − 8 = 0</p>
                  <div className="ml-4 mt-1.5 p-2 bg-amber-50/60 border-l-3 border-amber-500 rounded-r">
                    <p className="text-carbon">2x² = 8 → x² = 4 → x = <strong>2</strong></p>
                    <p className="text-[0.8em] text-amber-600 italic mt-1">Missing x = −2 as second solution</p>
                  </div>
                  <p className="text-[0.8em] text-amber-600 font-semibold ml-4 mt-1">4/5 marks — Partial</p>
                </div>
              </div>
            </div>

            {/* Section B */}
            <div className="mb-6">
              <h3 className="text-[1em] font-bold text-carbon mb-3 bg-soft-white px-3 py-1.5 rounded">
                Section B — Short Answer (40 marks)
              </h3>
              <div className="space-y-4 pl-2 text-[0.85em] text-charcoal">
                <div>
                  <p className="font-semibold">5. Calculate the mean, median, and standard deviation of: 12, 15, 18, 22, 25, 30</p>
                  <div className="ml-4 mt-1.5 p-2 bg-emerald-50/60 border-l-3 border-emerald-500 rounded-r">
                    <p className="text-carbon">Mean = (12+15+18+22+25+30)/6 = 122/6 = <strong>20.33</strong></p>
                    <p className="text-carbon mt-1">Median = (18+22)/2 = <strong>20</strong></p>
                    <p className="text-carbon mt-1">σ = √[Σ(xi−x̄)²/n] = <strong>5.96</strong> ✓</p>
                  </div>
                  <p className="text-[0.8em] text-emerald-600 font-semibold ml-4 mt-1">5/5 marks — Correct</p>
                </div>
              </div>
            </div>

            {currentPage >= 2 && (
              <div className="text-center text-mid-gray text-[0.9em] py-8">
                <p className="italic">— Page {currentPage} content continues —</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   RECOMMENDATION ITEM
═══════════════════════════════════════════════════════════ */
function RecommendationItem({ icon: Icon, title, detail, priority }: {
  icon: any; title: string; detail: string; priority: "high" | "medium" | "low";
}) {
  const styles = {
    high: "border-l-red-500 bg-red-500/5",
    medium: "border-l-amber-500 bg-amber-500/5",
    low: "border-l-emerald-500 bg-emerald-500/5",
  };
  const badgeStyles = {
    high: "bg-danger-light text-danger",
    medium: "bg-warning-light text-warning",
    low: "bg-success-light text-success",
  };
  return (
    <div className={`border-l-4 rounded-r-xl p-4 ${styles[priority]} transition-all hover:shadow-md cursor-pointer group`}>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-white/80 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
          <Icon className="w-4.5 h-4.5 text-carbon" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-[13px] font-bold text-carbon">{title}</h4>
            <span className={`stat-badge ${badgeStyles[priority]}`}>{priority}</span>
          </div>
          <p className="text-[12px] text-mid-gray leading-relaxed">{detail}</p>
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
export default function StudentDetail() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.studentId as string;
  const [activeTab, setActiveTab] = useState<"grading" | "paper" | "insights">("grading");

  const student = getStudentData(studentId);

  const gradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "bg-emerald-100 text-emerald-700 border-emerald-300";
      case "B": return "bg-blue-100 text-blue-700 border-blue-300";
      case "C": return "bg-amber-100 text-amber-700 border-amber-300";
      case "D": return "bg-orange-100 text-orange-700 border-orange-300";
      default: return "bg-red-100 text-red-700 border-red-300";
    }
  };

  const tabs = [
    { id: "grading" as const, label: "Grading", icon: ClipboardCheck },
    { id: "paper" as const, label: "Paper Preview", icon: FileText },
    { id: "insights" as const, label: "AI Insights", icon: Sparkles },
  ];

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Breadcrumbs */}
      <div className="text-sm font-bold text-mid-gray flex gap-2 items-center flex-wrap">
        <Link href="/dashboard" className="hover:text-aubergine transition-colors">Dashboard</Link>
        <span>/</span>
        <Link href="/dashboard/classes" className="hover:text-aubergine transition-colors">Classes</Link>
        <span>/</span>
        <Link href="/dashboard/classes/senior-1a" className="hover:text-aubergine transition-colors">{student.class}</Link>
        <span>/</span>
        <Link href="/dashboard/classes/senior-1a/exams/midterm-2026/results" className="hover:text-aubergine transition-colors">Results</Link>
        <span>/</span>
        <span className="text-carbon">{student.name}</span>
      </div>

      {/* Header Card */}
      <div className="widget-card p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          {/* Student Info */}
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold border-2 ${gradeColor(student.grade)}`}>
              {student.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <h1 className="text-[24px] font-bold text-carbon leading-tight">{student.name}</h1>
              <p className="text-[13px] text-mid-gray mt-0.5">
                {student.class} • {student.examSubject} — {student.examName}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="stat-badge bg-primary-50 text-primary-600">Rank #{student.classRank} of {student.totalStudents}</span>
                <span className="stat-badge bg-canvas text-mid-gray">Submitted {student.dateSubmitted}</span>
                <span className="stat-badge bg-canvas text-mid-gray">Time: {student.timeTaken}</span>
              </div>
            </div>
          </div>

          {/* Score Summary */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-[10px] text-mid-gray font-semibold tracking-widest uppercase">Score</p>
              <p className="text-4xl font-bold text-carbon leading-tight mt-1">{student.score}<span className="text-lg text-mid-gray">/{student.totalMarks}</span></p>
            </div>
            <div className="h-14 w-px bg-fog" />
            <div className="text-center">
              <p className="text-[10px] text-mid-gray font-semibold tracking-widest uppercase">Grade</p>
              <span className={`inline-block mt-1 text-3xl font-bold px-4 py-1 rounded-xl border ${gradeColor(student.grade)}`}>
                {student.grade}
              </span>
            </div>
            <div className="h-14 w-px bg-fog" />
            <div className="text-center">
              <p className="text-[10px] text-mid-gray font-semibold tracking-widest uppercase">vs Class Avg</p>
              <div className="flex items-center gap-1 mt-2">
                {student.score >= student.classAvg
                  ? <TrendingUp className="w-5 h-5 text-emerald-600" />
                  : <TrendingDown className="w-5 h-5 text-red-600" />
                }
                <span className={`text-2xl font-bold ${student.score >= student.classAvg ? "text-emerald-600" : "text-red-600"}`}>
                  {student.score >= student.classAvg ? "+" : ""}{student.score - student.classAvg}%
                </span>
              </div>
            </div>
          </div>
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

      {/* ══════════════════════════════════════════════════
         TAB: GRADING
      ══════════════════════════════════════════════════ */}
      {activeTab === "grading" && (
        <div className="space-y-5 animate-fade-in">

          {/* Section Scores */}
          <div className="grid grid-cols-3 gap-4">
            {student.sections.map((section, i) => (
              <div key={i} className="widget-card p-5">
                <p className="text-[10px] text-mid-gray font-semibold tracking-widest uppercase mb-3">{section.name}</p>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-3xl font-bold text-carbon">{section.scored}</span>
                    <span className="text-lg text-mid-gray">/{section.total}</span>
                  </div>
                  <RingProgress
                    value={section.percentage}
                    size={56}
                    stroke={6}
                    color={section.percentage >= 80 ? "#10b981" : section.percentage >= 60 ? "#f59e0b" : "#ef4444"}
                  />
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-3">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      section.percentage >= 80 ? "bg-gradient-to-r from-emerald-400 to-emerald-600" :
                      section.percentage >= 60 ? "bg-gradient-to-r from-amber-400 to-amber-600" :
                      "bg-gradient-to-r from-red-400 to-red-600"
                    }`}
                    style={{ width: `${section.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Question-by-Question Breakdown */}
          <div className="widget-card overflow-hidden">
            <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-fog">
              <div>
                <p className="font-bold text-[15px] text-carbon">Question-by-Question Breakdown</p>
                <p className="text-[11px] text-mid-gray mt-0.5">Detailed marks and AI feedback for each question</p>
              </div>
              <div className="flex items-center gap-3">
                {[
                  { label: "Correct", color: "bg-emerald-500", count: student.questionBreakdown.filter(q => q.status === "correct").length },
                  { label: "Partial", color: "bg-amber-500", count: student.questionBreakdown.filter(q => q.status === "partial").length },
                  { label: "Incorrect", color: "bg-red-500", count: student.questionBreakdown.filter(q => q.status === "incorrect").length },
                ].map(s => (
                  <span key={s.label} className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                    <span className="text-[11px] text-mid-gray font-medium">{s.label}: {s.count}</span>
                  </span>
                ))}
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-5 py-3 text-[11px] font-semibold text-mid-gray uppercase tracking-wider w-16">Q#</TableHead>
                  <TableHead className="px-5 py-3 text-[11px] font-semibold text-mid-gray uppercase tracking-wider">Topic</TableHead>
                  <TableHead className="px-5 py-3 text-[11px] font-semibold text-mid-gray uppercase tracking-wider w-24">Score</TableHead>
                  <TableHead className="px-5 py-3 text-[11px] font-semibold text-mid-gray uppercase tracking-wider w-24">Status</TableHead>
                  <TableHead className="px-5 py-3 text-[11px] font-semibold text-mid-gray uppercase tracking-wider">AI Feedback</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {student.questionBreakdown.map((q, i) => (
                  <TableRow key={i} className="hover:bg-primary-50/30 transition-colors">
                    <TableCell className="px-5 py-3 font-bold text-carbon text-sm">{q.q}</TableCell>
                    <TableCell className="px-5 py-3">
                      <span className="text-[12px] font-medium text-carbon bg-canvas px-2.5 py-1 rounded-lg">{q.topic}</span>
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <span className="text-sm font-bold text-carbon">{q.scored}<span className="text-mid-gray font-normal">/{q.total}</span></span>
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        q.status === "correct" ? "bg-emerald-100 text-emerald-700" :
                        q.status === "partial" ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {q.status === "correct" ? <CheckCircle2 className="w-3 h-3" /> :
                         q.status === "partial" ? <AlertTriangle className="w-3 h-3" /> :
                         <AlertTriangle className="w-3 h-3" />}
                        {q.status.charAt(0).toUpperCase() + q.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-3 text-[12px] text-charcoal max-w-sm">{q.feedback}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Writing Metrics */}
          <div className="widget-card p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                <PenTool className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="font-bold text-[15px] text-carbon">Answer Quality Metrics</p>
                <p className="text-[11px] text-mid-gray mt-0.5">AI assessment of how the student presents their work</p>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-4">
              {student.aiAnalysis.writingMetrics.map((m, i) => (
                <div key={i} className="text-center">
                  <RingProgress
                    value={Math.round((m.score / m.maxScore) * 100)}
                    size={64}
                    stroke={6}
                    color={m.score / m.maxScore >= 0.7 ? "#10b981" : m.score / m.maxScore >= 0.5 ? "#f59e0b" : "#ef4444"}
                  />
                  <p className="text-[11px] font-semibold text-carbon mt-2">{m.metric}</p>
                  <p className="text-[10px] text-mid-gray">{m.score}/{m.maxScore}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* ══════════════════════════════════════════════════
         TAB: PAPER PREVIEW
      ══════════════════════════════════════════════════ */}
      {activeTab === "paper" && (
        <div className="animate-fade-in">
          <PaperPreview pdfUrl={student.pdfUrl} studentName={student.name} />
        </div>
      )}


      {/* ══════════════════════════════════════════════════
         TAB: AI INSIGHTS
      ══════════════════════════════════════════════════ */}
      {activeTab === "insights" && (
        <div className="space-y-5 animate-fade-in">

          {/* AI Overview */}
          <div className="widget-card-dark p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary-600/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-primary-500/10 to-transparent rounded-full translate-y-1/2 -translate-x-1/4" />
            <div className="relative flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shrink-0 shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-[15px] font-bold text-white">AI Performance Analysis — {student.examSubject} {student.examName}</h3>
                  <span className="stat-badge bg-primary-600/30 text-primary-300 border border-primary-500/30">
                    <Sparkles className="w-3 h-3" /> AI Generated
                  </span>
                </div>
                <p className="text-[13px] text-white/70 leading-relaxed max-w-3xl">
                  {student.aiAnalysis.overallRemark}
                </p>
              </div>
            </div>
          </div>


          {/* Concept Mastery Radar + Score Comparison */}
          <div className="grid grid-cols-12 gap-4">
            {/* Radar */}
            <div className="col-span-5 widget-card p-5">
              <div className="mb-1">
                <p className="font-bold text-[15px] text-carbon">Topic Mastery Profile</p>
                <p className="text-[11px] text-mid-gray mt-0.5">Competency across exam topics — this exam only</p>
              </div>
              <div className="h-[280px] mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={student.aiAnalysis.conceptMastery.map(c => ({ ...c, fullMark: 100 }))} cx="50%" cy="50%" outerRadius="72%">
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="concept" tick={{ fontSize: 11, fontWeight: 600, fill: "#374151" }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} />
                    <Radar name="Mastery" dataKey="mastery" stroke="#660033" fill="#660033" fillOpacity={0.15} strokeWidth={2} dot={{ fill: "#660033", r: 4 }} />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Topic Bar Chart: Student vs Class Avg */}
            <div className="col-span-7 widget-card p-5">
              <div className="mb-1">
                <p className="font-bold text-[15px] text-carbon">Student vs Class Average by Topic</p>
                <p className="text-[11px] text-mid-gray mt-0.5">How {student.name} compares to the class in each topic</p>
              </div>
              <div className="h-[280px] mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={student.aiAnalysis.conceptMastery.map(c => ({
                      topic: c.concept,
                      student: c.mastery,
                      classAvg: Math.round(c.mastery * 0.85 + 10), // Simulated class avg
                    }))}
                    barGap={4}
                    margin={{ top: 10, right: 10, bottom: 5, left: -15 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="topic" tick={{ fontSize: 11, fontWeight: 600, fill: "#374151" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="student" name={student.name} fill="#660033" radius={[6, 6, 0, 0]} barSize={28} />
                    <Bar dataKey="classAvg" name="Class Average" fill="#e5e7eb" radius={[6, 6, 0, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-4 mt-2 pt-3 border-t border-fog">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-primary-700" />
                  <span className="text-[11px] text-mid-gray font-medium">{student.name}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-fog" />
                  <span className="text-[11px] text-mid-gray font-medium">Class Average</span>
                </span>
              </div>
            </div>
          </div>


          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="widget-card p-5 border-l-4 border-l-emerald-500">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-bold text-[15px] text-carbon">Strengths</p>
                  <p className="text-[11px] text-mid-gray mt-0.5">Areas where {student.name} excels in this exam</p>
                </div>
              </div>
              <div className="space-y-4">
                {student.aiAnalysis.strengths.map((s, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[13px] font-semibold text-carbon">{s.area}</span>
                      <span className="text-[13px] font-bold text-emerald-600">{s.score}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-700"
                        style={{ width: `${s.score}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-mid-gray">{s.detail}</p>
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
                  <p className="text-[11px] text-mid-gray mt-0.5">Topics requiring additional attention</p>
                </div>
              </div>
              <div className="space-y-4">
                {student.aiAnalysis.weaknesses.map((w, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[13px] font-semibold text-carbon">{w.area}</span>
                      <span className="text-[13px] font-bold text-amber-600">{w.score}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-700"
                        style={{ width: `${w.score}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-mid-gray">{w.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>


          {/* AI Recommendations */}
          <div className="widget-card p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-[15px] text-carbon">AI Recommendations for {student.name}</p>
                <p className="text-[11px] text-mid-gray mt-0.5">Personalized action items based on this exam&apos;s performance</p>
              </div>
            </div>
            <div className="space-y-3">
              {student.aiAnalysis.recommendations.map((rec, i) => (
                <RecommendationItem
                  key={i}
                  icon={i === 0 ? BookOpen : i === 1 ? Shield : i === 2 ? Zap : Lightbulb}
                  title={rec.title}
                  detail={rec.detail}
                  priority={rec.priority}
                />
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
