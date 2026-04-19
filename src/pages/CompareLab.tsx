import React, { useState } from 'react';
import { Workshop } from '@/types';
import { REFERENCE_WORKSHOP } from '@/constants';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ArrowLeftRight, AlertTriangle, CheckCircle2, MinusCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
    Radar, 
    RadarChart, 
    PolarGrid, 
    PolarAngleAxis, 
    PolarRadiusAxis, 
    ResponsiveContainer,
    Legend
} from 'recharts';

interface CompareLabProps {
  workshops: Workshop[];
}

export default function CompareLab({ workshops }: CompareLabProps) {
  const [candidateId, setCandidateId] = useState<string | null>(workshops[1]?.id || null);
  
  const reference = REFERENCE_WORKSHOP;
  const candidate = workshops.find(w => w.id === candidateId) || null;

  const getComparisonData = () => {
    if (!candidate) return [];
    
    return [
      { subject: 'Outcome', A: reference.maturityScores.categoryScores.outcome.score, B: candidate.maturityScores.categoryScores.outcome?.score || 0 },
      { subject: 'Audience', A: reference.maturityScores.categoryScores.audience.score, B: candidate.maturityScores.categoryScores.audience?.score || 0 },
      { subject: 'Scope', A: reference.maturityScores.categoryScores.scope.score, B: candidate.maturityScores.categoryScores.scope?.score || 0 },
      { subject: 'Methods', A: reference.maturityScores.categoryScores.methods.score, B: candidate.maturityScores.categoryScores.methods?.score || 0 },
      { subject: 'Portfolio', A: reference.maturityScores.categoryScores.portfolio.score, B: candidate.maturityScores.categoryScores.portfolio?.score || 0 },
      { subject: 'Sales', A: reference.maturityScores.categoryScores.sales.score, B: candidate.maturityScores.categoryScores.sales?.score || 0 },
    ];
  };

  const chartData = getComparisonData();

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background text-foreground">
      {/* Header */}
      <header className="p-12 border-b-2 border-border space-y-8 bg-card">
        <div className="flex items-center justify-between">
            <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-[0.8]">Compare<br />Lab</h1>
            <Badge variant="outline" className="border-2 border-accent text-accent bg-accent/5 rounded-none font-black uppercase tracking-widest px-4 py-2 italic transition-all animate-pulse">FIDELITY_LENS_v1.0</Badge>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex-1 flex items-center gap-3 px-6 py-4 bg-foreground text-background rounded-none border-2 border-foreground shadow-[6px_6px_0px_0px_rgba(255,68,0,1)]">
                <span className="text-[10px] font-black uppercase tracking-widest italic opacity-50">GOLD_BASE:</span>
                <span className="text-sm font-black italic uppercase tracking-tighter">{reference.name}</span>
            </div>
            <ArrowLeftRight className="h-6 w-6 text-foreground font-black" />
            <div className="flex-1">
                <Select value={candidateId || ''} onValueChange={setCandidateId}>
                    <SelectTrigger className="bg-card border-2 border-foreground rounded-none shadow-none h-14 font-black uppercase tracking-widest text-xs px-6">
                        <SelectValue placeholder="SELECT_CANDIDATE..." />
                    </SelectTrigger>
                    <SelectContent>
                        {workshops.filter(w => w.id !== reference.id).map(w => (
                            <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row divide-x-2 divide-border">
        
        {/* Comparison Visuals */}
        <ScrollArea className="flex-1 bg-background">
            <div className="p-12 space-y-16">
                <section className="space-y-8">
                    <h2 className="text-xs font-black uppercase tracking-widest text-foreground/40 flex items-center gap-3 italic">
                        <ArrowLeftRight className="h-5 w-5 text-accent" /> Maturity_Drift_Analysis
                    </h2>
                    <div className="h-[450px] w-full bg-card rounded-none p-12 border-2 border-foreground relative shadow-[10px_10px_0px_0px_rgba(10,10,10,0.05)]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                <PolarGrid stroke="var(--foreground)" strokeOpacity={0.15} />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--foreground)', fontSize: 10, fontWeight: 900 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar 
                                    name="Gold Standard" 
                                    dataKey="A" 
                                    stroke="var(--foreground)" 
                                    fill="var(--foreground)" 
                                    fillOpacity={0.05} 
                                    strokeWidth={3}
                                />
                                <Radar 
                                    name="Current Draft" 
                                    dataKey="B" 
                                    stroke="var(--accent)" 
                                    fill="var(--accent)" 
                                    fillOpacity={0.2} 
                                    strokeWidth={3}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                <section className="space-y-6">
                   <h2 className="text-sm font-bold uppercase tracking-widest text-[#141414]/40">Structural Diff</h2>
                   <div className="space-y-4">
                      <DiffItem label="Day-3 Outcome" refVal={reference.day3Outcome.capabilities.length} candVal={candidate?.day3Outcome.capabilities.length} />
                      <DiffItem label="Out-of-Scope Flags" refVal={reference.scope.outOfScope.length} candVal={candidate?.scope.outOfScope.length} />
                      <DiffItem label="Signature Methods" refVal={reference.methods.signatureMethods.length} candVal={candidate?.methods.signatureMethods.length} />
                   </div>
                </section>
            </div>
        </ScrollArea>

        {/* Comparison Details Side Panel */}
        <aside className="w-[450px] bg-[#FDFCFB]">
            <ScrollArea className="h-full">
                <div className="p-8 space-y-10">
                    <header className="space-y-2">
                        <h2 className="text-xl font-bold">Fidelity Diagnosis</h2>
                        <p className="text-sm text-[#141414]/50">Deviation analysis against the Monday-Ready reference rules.</p>
                    </header>

                    {candidate ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                             <Card className="border-[#141414]/10 bg-white">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-sm">Family Drift Index</CardTitle>
                                        <Badge variant="secondary" className="font-mono text-[10px]">{Math.abs(reference.maturityScores.familyFitScore - candidate.maturityScores.familyFitScore)} pts</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col gap-1">
                                        <div className="h-2 w-full bg-[#141414]/5 rounded-full overflow-hidden">
                                            <div 
                                                className={cn(
                                                    "h-full rounded-full transition-all",
                                                    candidate.maturityScores.familyFitScore > 80 ? "bg-green-500" : "bg-yellow-500"
                                                )}
                                                style={{ width: `${candidate.maturityScores.familyFitScore}%` }} 
                                            />
                                        </div>
                                        <span className="text-[10px] text-[#141414]/40 text-right font-bold tracking-widest">FAMILY FIT</span>
                                    </div>
                                </CardContent>
                             </Card>

                             <section className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-[#141414]/40">Key Deviations</h3>
                                <div className="space-y-3">
                                    {candidate.maturityScores.redFlags.map((flag, i) => (
                                        <div key={i} className="flex gap-3 p-4 rounded-xl bg-red-50 border border-red-100 italic text-xs text-red-800">
                                            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                                            <span>{flag}</span>
                                        </div>
                                    ))}
                                    {candidate.maturityScores.familyFitScore > 90 && (
                                         <div className="flex gap-3 p-4 rounded-xl bg-green-50 border border-green-100 text-xs text-green-800">
                                            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                                            <span>Format follows core family logic. High reuse potential for shared assets.</span>
                                         </div>
                                    )}
                                </div>
                             </section>

                             <section className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-[#141414]/40">Strategy Notes</h3>
                                <div className="p-4 rounded-xl border border-[#141414]/10 bg-white space-y-4">
                                    <div className="flex gap-2">
                                        <Info className="h-4 w-4 text-[#141414]/30 shrink-0" />
                                        <p className="text-[11px] leading-relaxed">
                                            The candidate format drifts towards <strong>technical training</strong>. 
                                            Consider sharpening the <strong>Day-3 Outcome</strong> by removing educational fluff and moving 
                                            it to a separate, later module.
                                        </p>
                                    </div>
                                    <div className="h-[1px] bg-[#141414]/5 w-full" />
                                    <p className="text-[11px] font-bold text-[#141414]/50">
                                        Strategic Deviation: {candidate.id === 'scrum-kickoff-draft' ? 'High' : 'Normal'}
                                    </p>
                                </div>
                             </section>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-30 px-10">
                            <MinusCircle className="h-10 w-10 text-[#141414]" />
                            <p className="text-xs font-bold uppercase tracking-widest">Select a candidate for comparison</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </aside>
      </div>
    </div>
  );
}

function DiffItem({ label, refVal, candVal }: { label: string, refVal: number, candVal?: number }) {
    const diff = candVal !== undefined ? candVal - refVal : 0;
    
    return (
        <div className="flex items-center justify-between p-4 bg-white border border-[#141414]/5 rounded-xl shadow-sm">
            <span className="text-sm font-bold">{label}</span>
            <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase font-bold text-[#141414]/30">Reference</span>
                    <span className="text-xs font-mono font-bold">{refVal}</span>
                </div>
                <div className="w-px h-6 bg-[#141414]/5" />
                <div className="flex flex-col items-end min-w-[60px]">
                    <span className="text-[10px] uppercase font-bold text-[#141414]/30">Candidate</span>
                    <span className={cn(
                        "text-xs font-mono font-bold",
                        diff > 0 ? "text-green-600" : diff < 0 ? "text-red-500" : "text-[#141414]"
                    )}>
                        {candVal ?? '-'} {diff !== 0 && `(${diff > 0 ? '+' : ''}${diff})`}
                    </span>
                </div>
            </div>
        </div>
    );
}
