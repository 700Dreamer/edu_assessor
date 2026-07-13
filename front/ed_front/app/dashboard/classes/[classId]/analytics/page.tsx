"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function ClassAnalytics() {
  const params = useParams();
  const classId = (params.classId as string) || "class";
  const formattedClass = classId.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-sm font-bold text-mid-gray flex gap-2 items-center flex-wrap">
        <Link href="/dashboard" className="hover:text-aubergine transition-colors">Dashboard</Link>
        <span>/</span>
        <Link href="/dashboard/classes" className="hover:text-aubergine transition-colors">Classes</Link>
        <span>/</span>
        <Link href={`/dashboard/classes/${classId}`} className="hover:text-aubergine transition-colors">{formattedClass}</Link>
        <span>/</span>
        <span className="text-carbon">Analytics</span>
      </div>

      <div>
        <h1 className="text-subheading mb-2">{formattedClass} Analytics</h1>
        <p className="text-charcoal text-body-sm">Deep insights into class performance, trends, and weak points.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Class Average</CardDescription>
            <CardTitle className="text-aubergine text-4xl">82.1%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-caption text-charcoal">+1.5% vs School Avg</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pass Rate</CardDescription>
            <CardTitle className="text-aubergine text-4xl">92.0%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-caption text-charcoal">24/26 Passed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div>
          <Label className="mb-6 block">Grade Distribution</Label>
          <Card className="h-full">
            <CardContent className="p-8 pt-8 flex items-end h-[320px] gap-4">
              {[
                { label: "A", val: 35, h: "70%" },
                { label: "B", val: 40, h: "80%" },
                { label: "C", val: 15, h: "30%" },
                { label: "D", val: 5, h: "10%" },
                { label: "F", val: 5, h: "10%" }
              ].map((grade) => (
                <div key={grade.label} className="flex flex-col items-center flex-1 h-full justify-end group">
                  <span className="text-caption text-charcoal mb-2 opacity-0 group-hover:opacity-100 transition-opacity font-bold">{grade.val}%</span>
                  <div 
                    className="w-full bg-aubergine rounded-t-sm transition-all duration-500 group-hover:bg-vivid-violet"
                    style={{ height: grade.h }}
                  />
                  <span className="text-sm font-bold text-carbon mt-4">{grade.label}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <Label className="mb-6 block">Weakest Subjects & Topics</Label>
          <Card className="border-l-4 border-l-vivid-violet h-full">
            <CardContent className="p-8 pt-8 space-y-6">
              {[
                { topic: "Integration by Parts", subject: "Mathematics", score: "45%" },
                { topic: "Chemical Bonding", subject: "Science", score: "52%" },
              ].map((w, i) => (
                <div key={i} className="flex justify-between items-center border-b border-fog pb-4 last:border-0 last:pb-0">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-charcoal mb-1 block">{w.subject}</span>
                    <p className="font-bold text-carbon text-lg">{w.topic}</p>
                  </div>
                  <span className="text-xl font-bold text-red-500">{w.score} avg</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
