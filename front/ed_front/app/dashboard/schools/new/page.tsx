"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Plus, Trash, School as SchoolIcon } from "lucide-react";

type LevelData = {
  level: string;
  streams: string[];
};

const LEVELS = ["S.1", "S.2", "S.3", "S.4", "S.5", "S.6"];

export default function NewSchoolPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [levels, setLevels] = useState<LevelData[]>(
    LEVELS.map((level) => ({ level, streams: [] }))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddStream = (levelIndex: number) => {
    const newLevels = [...levels];
    newLevels[levelIndex].streams.push("");
    setLevels(newLevels);
  };

  const handleRemoveStream = (levelIndex: number, streamIndex: number) => {
    const newLevels = [...levels];
    newLevels[levelIndex].streams.splice(streamIndex, 1);
    setLevels(newLevels);
  };

  const handleStreamChange = (levelIndex: number, streamIndex: number, value: string) => {
    const newLevels = [...levels];
    newLevels[levelIndex].streams[streamIndex] = value;
    setLevels(newLevels);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Filter out empty streams
    const cleanedLevels = levels.map((l) => ({
      level: l.level,
      streams: l.streams.filter((s) => s.trim() !== ""),
    }));

    try {
      // In a real app, grab the token from context/cookies
      // Currently hardcoding the admin token retrieval from the test script logic for demo purposes
      let token = localStorage.getItem("access_token");
      
      // Auto login as admin for testing purposes if no token
      if (!token) {
        const loginResp = await fetch("http://localhost:8000/api/v1/auth/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: "username=admin@eduquest.com&password=password123",
        });
        if (loginResp.ok) {
          const data = await loginResp.json();
          token = data.access_token;
          localStorage.setItem("access_token", token!);
        }
      }

      const response = await fetch("http://localhost:8000/api/v1/schools/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ name, levels: cleanedLevels }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Failed to register school");
      }

      alert("School registered successfully!");
      // router.push("/dashboard/schools");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 max-w-3xl">
      <Card className="shadow-lg border-primary/20">
        <CardHeader className="space-y-1 bg-primary/5 pb-8 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <SchoolIcon className="w-6 h-6" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">Register New School</CardTitle>
          </div>
          <CardDescription className="text-base pt-2">
            Add a new school to the system and configure its class streams (S.1 to S.6).
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-lg font-semibold">School Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="e.g., Makerere College School" 
                required 
                className="text-lg py-6"
              />
            </div>

            <div className="space-y-6">
              <div className="pb-2 border-b">
                <h3 className="text-xl font-semibold tracking-tight">Class Configuration</h3>
                <p className="text-sm text-muted-foreground">Add custom streams (like 'Leopard' or 'North') for each class level.</p>
              </div>

              {levels.map((levelData, levelIndex) => (
                <div key={levelData.level} className="p-5 border rounded-lg bg-card shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-primary">{levelData.level}</h4>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleAddStream(levelIndex)}
                      className="h-8 gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Stream
                    </Button>
                  </div>
                  
                  {levelData.streams.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic bg-muted/50 p-3 rounded-md text-center border border-dashed">
                      No custom streams. A single generic {levelData.level} class will be created.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {levelData.streams.map((stream, streamIndex) => (
                        <div key={streamIndex} className="flex items-center gap-2">
                          <Input
                            placeholder="Stream Name (e.g. Leopard)"
                            value={stream}
                            onChange={(e) => handleStreamChange(levelIndex, streamIndex, e.target.value)}
                            required
                            className="bg-background"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="shrink-0 h-10 w-10"
                            onClick={() => handleRemoveStream(levelIndex, streamIndex)}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {error && (
              <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-md font-medium">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full py-6 text-lg" disabled={loading}>
              {loading ? "Registering..." : "Complete Registration"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
