"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function SchoolsPage() {
  const [schools] = useState([
    { id: 1, name: "Lincoln High", students: 1250, exams: 45 },
    { id: 2, name: "Springfield Academy", students: 840, exams: 32 },
    { id: 3, name: "Oakridge Institute", students: 2100, exams: 112 },
  ]);

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-subheading mb-2">Schools</h1>
          <p className="text-charcoal text-body-sm">Manage registered schools and view their metrics.</p>
        </div>
        <Button>Add School</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {schools.map(school => (
          <Card key={school.id}>
            <CardHeader className="pb-4">
              <Label className="mb-2">Partner School</Label>
              <CardTitle className="text-2xl">{school.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center border-b border-fog pb-2">
                <span className="text-charcoal text-sm">Students</span>
                <span className="font-bold text-carbon">{school.students}</span>
              </div>
              <div className="flex justify-between items-center border-b border-fog pb-2">
                <span className="text-charcoal text-sm">Exams Processed</span>
                <span className="font-bold text-carbon">{school.exams}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Analytics
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
