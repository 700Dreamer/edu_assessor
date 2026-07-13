"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function SubjectExamSelection() {
  const params = useParams();
  const classId = params.classId as string;

  // Format ID "senior-2a" -> "Senior 2A"
  const formattedClass = classId ? classId.replace("-", " ").replace(/\b[a-z]/g, l => l.toUpperCase()).replace(/(\d)([a-z])\b/gi, (_, num, letter) => num + letter.toUpperCase()) : "Class";

  const subjects = [
    { name: "Mathematics", exams: [{ id: "midterm-2026", name: "Midterm Exam 2026" }, { id: "endterm-2026", name: "Endterm 2026" }] },
    { name: "English", exams: [{ id: "midterm-2026", name: "Midterm Exam 2026" }] },
    { name: "Physics", exams: [{ id: "midterm-2026", name: "Midterm Exam 2026" }, { id: "mock-1", name: "Mock 1" }] },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Simple Breadcrumb mock */}
      <div className="text-sm font-bold text-mid-gray flex gap-2 items-center">
        <Link href="/dashboard" className="hover:text-aubergine transition-colors">Dashboard</Link>
        <span>/</span>
        <Link href="/dashboard/classes" className="hover:text-aubergine transition-colors">Classes</Link>
        <span>/</span>
        <span className="text-carbon">{formattedClass}</span>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-subheading mb-2">{formattedClass} - Subjects</h1>
          <p className="text-charcoal text-body-sm">Select a subject and exam to view student results.</p>
        </div>
        <Link href={`/dashboard/classes/${classId}/analytics`}>
          <button className="text-aubergine font-bold hover:underline text-sm flex items-center gap-2">
            View Class Analytics →
          </button>
        </Link>
      </div>

      <div className="space-y-8">
        {subjects.map((sub, idx) => (
          <div key={idx} className="space-y-4">
            <Label className="text-lg">{sub.name}</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sub.exams.map(exam => (
                <Link key={exam.id} href={`/dashboard/classes/${classId}/exams/${exam.id}/results`} className="block group">
                  <Card className="transition-all duration-300 group-hover:shadow-lg group-hover:border-aubergine cursor-pointer">
                    <CardHeader className="py-4">
                      <CardDescription>Exam Set</CardDescription>
                      <CardTitle className="text-xl text-carbon group-hover:text-aubergine transition-colors">{exam.name}</CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
