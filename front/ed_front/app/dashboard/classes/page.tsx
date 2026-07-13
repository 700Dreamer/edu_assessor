"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function ClassSelection() {
  const classes = [
    { id: "senior-1a", name: "Senior 1A", students: 32, subjects: 6 },
    { id: "senior-1b", name: "Senior 1B", students: 30, subjects: 6 },
    { id: "senior-2a", name: "Senior 2A", students: 28, subjects: 7 },
    { id: "senior-2b", name: "Senior 2B", students: 29, subjects: 7 },
    { id: "senior-3a", name: "Senior 3A", students: 25, subjects: 8 },
    { id: "senior-4a", name: "Senior 4A", students: 22, subjects: 8 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-subheading mb-2">Select a Class</h1>
        <p className="text-charcoal text-body-sm">Choose a class to view its subjects, exams, and detailed results.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <Link href={`/dashboard/classes/${cls.id}`} key={cls.id} className="block group">
            <Card className="h-full transition-all duration-300 group-hover:shadow-lg group-hover:border-aubergine cursor-pointer">
              <CardHeader className="pb-4">
                <Label className="mb-2">Class Section</Label>
                <CardTitle className="text-3xl text-carbon group-hover:text-aubergine transition-colors">{cls.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center border-b border-fog pb-2">
                  <span className="text-charcoal text-sm">Students Enrolled</span>
                  <span className="font-bold text-carbon">{cls.students}</span>
                </div>
                <div className="flex justify-between items-center border-b border-fog pb-2">
                  <span className="text-charcoal text-sm">Active Subjects</span>
                  <span className="font-bold text-carbon">{cls.subjects}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
