"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function AnalyticsPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-subheading mb-2">Analytics</h1>
        <p className="text-charcoal text-body-sm">Deep dive into AI assessment performance.</p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Score Distribution</CardTitle>
          <CardDescription>Overall performance across all partner schools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[300px] bg-purple-haze rounded-lg mt-4 flex items-end p-4 gap-4">
             {/* Mock Bar Chart using Slack brand colors */}
             {[30, 50, 80, 100, 60, 40, 20].map((h, i) => (
               <div 
                 key={i} 
                 className="flex-1 bg-aubergine rounded-t-sm opacity-90 transition-all hover:opacity-100 hover:bg-vivid-violet"
                 style={{ height: `${h}%` }}
               />
             ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Label className="mb-2">Performance</Label>
            <CardTitle className="text-xl">Top Performing Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {["Grade 10 Math (92%)", "Grade 12 Physics (89%)", "Grade 9 History (85%)"].map((c, i) => (
                 <li key={i} className="pb-4 border-b border-fog last:border-0 last:pb-0 text-carbon font-medium">
                   {c}
                 </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <Label className="mb-2">Insights</Label>
            <CardTitle className="text-xl">Common Weaknesses</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {["Algebraic Fractions", "Newton's Second Law", "Essay Structure"].map((w, i) => (
                 <li key={i} className="pb-4 border-b border-fog last:border-0 last:pb-0 text-carbon font-medium">
                   {w}
                 </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
