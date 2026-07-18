"use client";

import { useState } from "react";
import {
  Database, Loader2, Plus, CheckCircle2, ArrowRight, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

/* ── Original color tokens (Burgundy Classic light theme) ── */
const C = {
  fg:       "#0f172a",
  fg60:     "rgba(15, 23, 42, 0.6)",
  fg40:     "rgba(15, 23, 42, 0.4)",
  surface:  "#ffffff",
  soft:     "#f1f5f9",
  border:   "#e2e8f0",
  border50: "rgba(226, 232, 240, 0.5)",
  brand300: "#fca5a5",
  brand500: "#e11d1d",
  brand600: "#c51010",
  brand800: "#800020",
  brand900: "#5a0015",
};

export default function SchoolOnboardingView() {
  const [step, setStep] = useState(1);
  const [schoolName, setSchoolName] = useState("");
  const [groups, setGroups] = useState<{level: string, stream: string, students: {full_name: string, index_number: string}[]}[]>([]);
  
  const [currentLevel, setCurrentLevel] = useState("P.1");
  const [currentStream, setCurrentStream] = useState("");
  const [studentInput, setStudentInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const levels = ["P.1", "P.2", "P.3", "P.4", "P.5", "P.6", "P.7"];

  const handleAddGroup = () => {
     if(!currentStream || !studentInput) return;
     const newStudents = studentInput.split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(s => {
           if(s.includes(',')) {
              const [name, idx] = s.split(',');
              return {full_name: name.trim(), index_number: idx.trim()};
           }
           return {full_name: s, index_number: ""};
        });
        
     setGroups([...groups, { level: currentLevel, stream: currentStream, students: newStudents }]);
     setCurrentStream("");
     setStudentInput("");
  };

  const removeGroup = (idx: number) => {
     setGroups(groups.filter((_, i) => i !== idx));
  };

  const submitOnboarding = async () => {
    if(!schoolName || groups.length === 0) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/v1/tenant/onboard", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          school_name: schoolName,
          groups: groups
        })
      });
      if(res.ok) {
         router.push("/dashboard");
      } else {
         alert("Failed to onboard school. Please try again.");
         setIsSubmitting(false);
      }
    } catch(e) {
      alert("Network error during onboarding.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Inline keyframes — no external dependency needed */}
      <style jsx global>{`
        @keyframes ob-fade-zoom {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes ob-slide-right {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <div
        className="flex-1 overflow-y-auto py-12 px-4 flex flex-col items-center justify-center min-h-screen"
        style={{ background: C.soft, color: C.fg }}
      >
        <div
          className="w-full max-w-4xl overflow-hidden"
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            animation: 'ob-fade-zoom 0.5s ease-out both',
          }}
        >
          <div className="flex flex-col md:flex-row">
            
            {/* ── Left sidebar stepper ── */}
            <div
              className="md:w-1/3 p-10 flex flex-col justify-between relative overflow-hidden"
              style={{ background: C.brand900, color: '#ffffff' }}
            >
              <div className="absolute inset-0 pointer-events-none"
                   style={{ background: `linear-gradient(to bottom right, rgba(197,16,16,0.2), transparent)` }} />
              <div className="absolute -bottom-24 -right-24 w-64 h-64 pointer-events-none"
                   style={{ background: 'rgba(225,29,29,0.2)', filter: 'blur(48px)' }} />
              
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-12">
                   <div className="w-10 h-10 flex items-center justify-center backdrop-blur-md"
                        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                     <Database className="w-5 h-5" style={{ color: C.brand300 }} />
                   </div>
                   <h2 className="text-xl font-bold tracking-tight" style={{ color: '#ffffff' }}>EduQuest Setup</h2>
                 </div>
                 
                 <div className="space-y-8">
                   <div className={cn("transition-all duration-300", step === 1 ? "opacity-100" : "opacity-40")}>
                     <div className="text-xs font-bold uppercase mb-1" style={{ letterSpacing: '0.15em', color: C.brand300 }}>Step 1</div>
                     <div className="text-lg font-semibold text-white">School Identity</div>
                   </div>
                   <div className={cn("transition-all duration-300", step === 2 ? "opacity-100" : "opacity-40")}>
                     <div className="text-xs font-bold uppercase mb-1" style={{ letterSpacing: '0.15em', color: C.brand300 }}>Step 2</div>
                     <div className="text-lg font-semibold text-white">Academic Roster</div>
                   </div>
                   <div className={cn("transition-all duration-300", step === 3 ? "opacity-100" : "opacity-40")}>
                     <div className="text-xs font-bold uppercase mb-1" style={{ letterSpacing: '0.15em', color: C.brand300 }}>Step 3</div>
                     <div className="text-lg font-semibold text-white">Final Review</div>
                   </div>
                 </div>
              </div>
            </div>
            
            {/* ── Right content area ── */}
            <div className="md:w-2/3 p-10 relative" style={{ background: C.surface }}>
              {step === 1 && (
                <div key="step1" style={{ animation: 'ob-slide-right 0.5s ease-out both' }}>
                   <h3 className="text-2xl font-black mb-2" style={{ color: C.fg }}>Welcome to EduQuest</h3>
                   <p className="text-sm mb-8" style={{ color: C.fg60 }}>Let&apos;s set up your institution&apos;s central intelligence hub. Enter your school name to begin.</p>
                   
                   <div className="space-y-6">
                     <div>
                       <label className="text-xs font-bold uppercase mb-3 block" style={{ letterSpacing: '0.15em', color: C.fg60 }}>Registered School Name</label>
                       <input 
                         type="text" 
                         value={schoolName}
                         onChange={(e) => setSchoolName(e.target.value)}
                         placeholder="e.g. Greenhill Academy"
                         className="w-full p-4 outline-none transition-all text-lg font-medium"
                         style={{ background: C.soft, border: `1px solid ${C.border}`, color: C.fg }}
                         onFocus={(e) => e.currentTarget.style.boxShadow = `0 0 0 2px ${C.brand500}`}
                         onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
                       />
                     </div>
                   </div>
                   
                   <div className="mt-12 flex justify-end">
                     <button 
                       onClick={() => setStep(2)} 
                       disabled={!schoolName.trim()}
                       className="px-8 py-4 text-white text-sm font-bold disabled:opacity-50 transition-all flex items-center gap-2 group cursor-pointer"
                       style={{ background: C.brand600 }}
                       onMouseOver={(e) => e.currentTarget.style.background = C.brand800}
                       onMouseOut={(e) => e.currentTarget.style.background = C.brand600}
                     >
                       Next Step <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                     </button>
                   </div>
                </div>
              )}

              {step === 2 && (
                <div key="step2" className="flex flex-col" style={{ animation: 'ob-slide-right 0.5s ease-out both' }}>
                   <h3 className="text-2xl font-black mb-2" style={{ color: C.fg }}>Academic Roster</h3>
                   <p className="text-sm mb-6" style={{ color: C.fg60 }}>Build your classes, streams, and inject the student index mapping for AI resolution.</p>
                   
                   <div className="p-5 mb-6" style={{ background: C.soft, border: `1px solid ${C.border}` }}>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                           <label className="text-xs font-bold mb-2 block" style={{ color: C.fg60 }}>Level / Class</label>
                           <select value={currentLevel} onChange={(e)=>setCurrentLevel(e.target.value)}
                             className="w-full p-3 text-sm outline-none cursor-pointer"
                             style={{ background: C.surface, border: `1px solid ${C.border}` }}
                             onFocus={(e) => e.currentTarget.style.boxShadow = `0 0 0 2px ${C.brand500}`}
                             onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}>
                             {levels.map(l => <option key={l} value={l}>{l}</option>)}
                           </select>
                        </div>
                        <div>
                           <label className="text-xs font-bold mb-2 block" style={{ color: C.fg60 }}>Stream (e.g. Blue, North)</label>
                           <input type="text" value={currentStream} onChange={(e)=>setCurrentStream(e.target.value)}
                             className="w-full p-3 text-sm outline-none"
                             style={{ background: C.surface, border: `1px solid ${C.border}` }}
                             onFocus={(e) => e.currentTarget.style.boxShadow = `0 0 0 2px ${C.brand500}`}
                             onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
                             placeholder="Stream Name"/>
                        </div>
                      </div>
                      <div>
                         <label className="text-xs font-bold mb-2 flex justify-between" style={{ color: C.fg60 }}>
                           <span>Students Bulk Import</span>
                           <span className="text-[10px] font-mono" style={{ color: C.fg40 }}>Format: Name, Index (Optional)</span>
                         </label>
                         <textarea 
                           value={studentInput}
                           onChange={(e)=>setStudentInput(e.target.value)}
                           placeholder={"John Doe, 001\nJane Smith, 002\nArthur Clark"}
                           className="w-full h-32 p-3 text-sm outline-none font-mono resize-none"
                           style={{ background: C.surface, border: `1px solid ${C.border}` }}
                           onFocus={(e) => e.currentTarget.style.boxShadow = `0 0 0 2px ${C.brand500}`}
                           onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
                         />
                      </div>
                      <button onClick={handleAddGroup} disabled={!currentStream || !studentInput}
                        className="w-full mt-4 py-3 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
                        style={{ background: C.fg, color: C.surface }}>
                         <Plus className="w-4 h-4" /> Add Academic Group
                      </button>
                   </div>

                   <div className="max-h-40 overflow-y-auto space-y-3">
                     {groups.length === 0 ? (
                       <div className="text-center text-xs py-4 font-bold uppercase"
                            style={{ letterSpacing: '0.15em', color: C.fg40, border: `1px dashed ${C.border}` }}>
                         No Groups Added
                       </div>
                     ) : groups.map((g, idx) => (
                       <div key={idx} className="p-4 flex items-center justify-between transition-all"
                            style={{ background: C.surface, border: `1px solid ${C.border}` }}
                            onMouseOver={(e) => e.currentTarget.style.borderColor = C.brand300}
                            onMouseOut={(e) => e.currentTarget.style.borderColor = C.border}>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 flex items-center justify-center font-black text-sm"
                                 style={{ background: 'rgba(225,29,29,0.1)', color: C.brand600 }}>
                              {g.level}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold" style={{ color: C.fg }}>{g.stream} Stream</h4>
                              <p className="text-xs" style={{ color: C.fg60 }}>{g.students.length} Student(s) Enrolled</p>
                            </div>
                          </div>
                          <button onClick={()=>removeGroup(idx)} className="transition-colors p-2 cursor-pointer"
                            style={{ color: 'rgba(239,68,68,0.5)' }}
                            onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                            onMouseOut={(e) => e.currentTarget.style.color = 'rgba(239,68,68,0.5)'}>
                            <X className="w-4 h-4"/>
                          </button>
                       </div>
                     ))}
                   </div>
                   
                   <div className="mt-6 flex justify-between items-center pt-4"
                        style={{ borderTop: `1px solid ${C.border}` }}>
                     <button onClick={() => setStep(1)} className="px-6 py-3 text-sm font-bold transition-colors cursor-pointer"
                       style={{ color: C.fg60 }}>Back</button>
                     <button 
                       onClick={() => setStep(3)} 
                       disabled={groups.length === 0}
                       className="px-8 py-3 text-white text-sm font-bold disabled:opacity-50 transition-all cursor-pointer"
                       style={{ background: C.brand600 }}
                       onMouseOver={(e) => e.currentTarget.style.background = C.brand800}
                       onMouseOut={(e) => e.currentTarget.style.background = C.brand600}
                     >
                       Review Settings
                     </button>
                   </div>
                </div>
              )}

              {step === 3 && (
                <div key="step3" style={{ animation: 'ob-slide-right 0.5s ease-out both' }}>
                   <div className="flex items-center justify-center mb-6">
                     <div className="w-16 h-16 flex items-center justify-center"
                          style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                       <CheckCircle2 className="w-8 h-8" />
                     </div>
                   </div>
                   <h3 className="text-2xl font-black mb-2 text-center" style={{ color: C.fg }}>Ready for Provisioning</h3>
                   <p className="text-sm mb-8 text-center max-w-sm mx-auto" style={{ color: C.fg60 }}>Please confirm the multi-tenant architecture details below before initializing the database.</p>
                   
                   <div className="p-6 mb-8" style={{ background: C.soft, border: `1px solid ${C.border}` }}>
                     <div className="flex justify-between items-center mb-4 pb-4" style={{ borderBottom: `1px solid ${C.border50}` }}>
                       <span className="text-xs font-bold uppercase" style={{ letterSpacing: '0.15em', color: C.fg60 }}>Institution</span>
                       <span className="text-sm font-black" style={{ color: C.fg }}>{schoolName}</span>
                     </div>
                     <div className="flex justify-between items-center mb-4 pb-4" style={{ borderBottom: `1px solid ${C.border50}` }}>
                       <span className="text-xs font-bold uppercase" style={{ letterSpacing: '0.15em', color: C.fg60 }}>Total Classes</span>
                       <span className="text-sm font-black" style={{ color: C.fg }}>{new Set(groups.map(g => g.level)).size} Levels</span>
                     </div>
                     <div className="flex justify-between items-center mb-4 pb-4" style={{ borderBottom: `1px solid ${C.border50}` }}>
                       <span className="text-xs font-bold uppercase" style={{ letterSpacing: '0.15em', color: C.fg60 }}>Total Streams</span>
                       <span className="text-sm font-black" style={{ color: C.fg }}>{groups.length} Streams</span>
                     </div>
                     <div className="flex justify-between items-center">
                       <span className="text-xs font-bold uppercase" style={{ letterSpacing: '0.15em', color: C.fg60 }}>Total Students</span>
                       <span className="text-sm font-black" style={{ color: C.fg }}>{groups.reduce((acc, g) => acc + g.students.length, 0)} Profiles</span>
                     </div>
                   </div>
                   
                   <div className="flex justify-between items-center">
                     <button onClick={() => setStep(2)} className="px-6 py-4 text-sm font-bold transition-colors cursor-pointer"
                       style={{ color: C.fg60 }}>Edit Details</button>
                     <button 
                       onClick={submitOnboarding}
                       disabled={isSubmitting}
                       className="px-8 py-4 text-white text-sm font-bold disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
                       style={{ background: '#059669' }}
                       onMouseOver={(e) => e.currentTarget.style.background = '#047857'}
                       onMouseOut={(e) => e.currentTarget.style.background = '#059669'}
                     >
                       {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Database className="w-5 h-5" />}
                       {isSubmitting ? "Provisioning..." : "Provision Engine Database"}
                     </button>
                   </div>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
}
