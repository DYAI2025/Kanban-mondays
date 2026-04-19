import React, { useState, useEffect } from 'react';
import { 
    Info, 
    Target, 
    Users, 
    Layers, 
    Layout, 
    Calendar, 
    Zap, 
    Box, 
    Mail, 
    Cpu, 
    GitBranch, 
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Save,
    Sparkles,
    AlertTriangle,
    Flag,
    Plus,
    Bot
} from 'lucide-react';
import { Workshop, MaturityScoreCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { getCopilotFeedback, CopilotResponse, summarizeContent } from '@/services/geminiService';
import { FileSearch } from 'lucide-react';

interface BuildStudioProps {
  workshop: Workshop | null;
  onUpdate: (w: Workshop) => void;
}

const STEPS = [
  { id: 'identity', label: 'Identity', icon: Info },
  { id: 'outcome', label: 'Day-3 Outcome', icon: Target },
  { id: 'audience', label: 'Audience Fit', icon: Users },
  { id: 'scope', label: 'Scope', icon: Layers },
  { id: 'format', label: 'Format', icon: Layout },
  { id: 'agenda', label: 'Agenda', icon: Calendar },
  { id: 'methods', label: 'Methods', icon: Zap },
  { id: 'deliverables', label: 'Deliverables', icon: Box },
  { id: 'prework', label: 'Pre-Work', icon: Mail },
  { id: 'ai', label: 'AI Layer', icon: Cpu },
  { id: 'followon', label: 'Follow-On Logic', icon: GitBranch },
  { id: 'review', label: 'Review', icon: CheckCircle2 },
] as const;

type StepId = typeof STEPS[number]['id'];

export default function BuildStudio({ workshop, onUpdate }: BuildStudioProps) {
  const [currentStep, setCurrentStep] = useState<StepId>('identity');
  const [localWorkshop, setLocalWorkshop] = useState<Workshop | null>(workshop);
  const [copilotData, setCopilotData] = useState<CopilotResponse | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [docSummary, setDocSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showDocSummarizer, setShowDocSummarizer] = useState(false);
  const [docText, setDocText] = useState('');
  const [viewMode, setViewMode] = useState<'edit' | 'diagnosis' | 'reference'>('edit');

  useEffect(() => {
     setLocalWorkshop(workshop);
  }, [workshop]);

  if (!localWorkshop) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
        <PackagePlaceholder />
        <h2 className="text-xl font-bold">No Workshop Selected</h2>
        <p className="text-[#141414]/50 max-w-sm">Please select a workshop from the library or create a new one to start building in the studio.</p>
      </div>
    );
  }

  const handleFieldChange = (section: keyof Workshop, field: string, value: any) => {
    const updated = { ...localWorkshop };
    if (typeof updated[section] === 'object' && updated[section] !== null && !Array.isArray(updated[section])) {
      (updated[section] as any)[field] = value;
    } else {
      (updated[section] as any) = value;
    }
    setLocalWorkshop(updated);
  };

  const handleArrayChange = (section: keyof Workshop, field: string, value: string[]) => {
      const updated = { ...localWorkshop };
      (updated[section] as any)[field] = value;
      setLocalWorkshop(updated);
  };

  const handleSave = () => {
    onUpdate({ ...localWorkshop, lastModified: new Date().toISOString() });
  };

  const askCopilot = async () => {
    setIsAiLoading(true);
    const feedback = await getCopilotFeedback(localWorkshop, currentStep);
    setCopilotData(feedback);
    setIsAiLoading(false);
  };

  const handleSummarizeDoc = async () => {
    if (!docText.trim()) return;
    setIsSummarizing(true);
    const summary = await summarizeContent(docText, 'documentation');
    setDocSummary(summary);
    setIsSummarizing(false);
  };

  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  // Mock score colors for traffic lights in navigation
  const getStepStatus = (stepId: StepId) => {
      // In a real app, this would be computed from localWorkshop.maturityScores.categoryScores
      const score = localWorkshop.maturityScores.categoryScores[stepId as MaturityScoreCategory]?.score || 0;
      if (score >= 90) return 'text-green-500';
      if (score >= 60) return 'text-yellow-500';
      return 'text-red-500';
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      {/* Top Header: Workshop Build Board Header */}
      <header className="h-[100px] border-b-2 border-border flex items-center px-8 bg-card shrink-0">
          <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <span className="bg-foreground text-background font-mono text-[9px] font-black px-2 py-0.5 uppercase tracking-widest">Workshop Build Board</span>
                <span className="text-muted-foreground font-mono text-[9px] px-2 border-l-2 border-border uppercase tracking-widest leading-none">{localWorkshop.role}</span>
              </div>
              <h1 className="text-3xl font-black uppercase tracking-tighter truncate mt-1 italic">{localWorkshop.name}</h1>
          </div>
          
          <div className="flex items-center gap-8 ml-8 pr-4">
              <div className="flex flex-col items-center">
                  <span className="text-[9px] font-black text-muted-foreground uppercase mb-1">Overall</span>
                  <span className="text-2xl font-black italic">{localWorkshop.maturityScores.overallScore}%</span>
              </div>
              <div className="flex flex-col items-center">
                  <span className="text-[9px] font-black text-muted-foreground uppercase mb-1">Family Fit</span>
                  <span className={cn(
                      "text-2xl font-black italic",
                      localWorkshop.maturityScores.familyFitScore >= 90 ? "text-green-500" : "text-yellow-500"
                  )}>{localWorkshop.maturityScores.familyFitScore}%</span>
              </div>
              <div className="flex flex-col items-center">
                  <span className="text-[9px] font-black text-muted-foreground uppercase mb-1">Status</span>
                  <Badge className="bg-foreground text-background font-black border-none uppercase text-[10px] tracking-widest px-3 py-1 rounded-none shadow-[2px_2px_0px_0px_rgba(255,68,0,1)]">
                      {localWorkshop.status.replace('_', ' ')}
                  </Badge>
              </div>
          </div>
      </header>

      {/* Core Health Indicators Rail */}
      <div className="h-10 border-b border-border flex items-center px-8 bg-background/50 divide-x-2 divide-border">
          <HealthIndicator label="Day-3 Outcome" value="Clear" status="green" />
          <HealthIndicator label="Scope Clarity" value="Sharp" status="green" />
          <HealthIndicator label="Serializability" value="High" status="yellow" />
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Product Path Navigation */}
        <nav className="w-[200px] border-r-2 border-border bg-card flex flex-col shrink-0">
          <div className="p-4 border-b border-border/5 bg-foreground/5">
             <span className="text-[10px] font-black text-foreground/40 uppercase tracking-widest block italic">Product Path</span>
          </div>
          <ScrollArea className="flex-1">
            <div className="py-2">
              {STEPS.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-6 py-3.5 text-[10px] font-black uppercase tracking-widest transition-all text-left",
                    currentStep === step.id 
                      ? "bg-background text-foreground border-r-4 border-accent italic" 
                      : "text-muted-foreground hover:text-foreground hover:bg-background/30"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <step.icon className={cn("h-4 w-4 shrink-0", currentStep === step.id ? "text-accent" : "text-muted-foreground/30")} />
                    <span className="truncate">{step.label}</span>
                  </div>
                  <div className={cn("h-2 w-2 rounded-full", getStepStatus(step.id).replace('text-', 'bg-'))} />
                </button>
              ))}
            </div>
          </ScrollArea>
          <div className="p-6 border-t border-border">
              <Button onClick={handleSave} className="w-full h-10 bg-foreground text-background font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(255,68,0,1)] hover:translate-y-px hover:shadow-none transition-all">
                  <Save className="h-4 w-4" /> Save Board
              </Button>
          </div>
        </nav>

        {/* Middle Column: Build Canvas */}
        <main className="flex-1 overflow-y-auto bg-background/30 p-8 flex flex-col relative">
           <div className="max-w-4xl mx-auto w-full space-y-8 pb-32">
               {/* View Mode Switching */}
               <div className="flex gap-1 bg-foreground/5 p-1 w-fit rounded-none border border-foreground/10 self-center">
                    <button 
                        onClick={() => setViewMode('edit')}
                        className={cn(
                            "px-6 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all",
                            viewMode === 'edit' ? "bg-foreground text-background italic" : "text-foreground/40 hover:text-foreground"
                        )}
                    >
                        Edit / Build
                    </button>
                    <button 
                        onClick={() => setViewMode('diagnosis')}
                        className={cn(
                            "px-6 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all border-l border-foreground/10",
                            viewMode === 'diagnosis' ? "bg-accent text-white italic" : "text-foreground/40 hover:text-foreground"
                        )}
                    >
                        Diagnose
                    </button>
                    <button 
                        onClick={() => setViewMode('reference')}
                        className={cn(
                            "px-6 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all border-l border-foreground/10",
                            viewMode === 'reference' ? "bg-blue-600 text-white italic" : "text-foreground/40 hover:text-foreground"
                        )}
                    >
                        Reference Mirror
                    </button>
               </div>

               {viewMode === 'edit' ? (
                   <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {renderStepEditor(currentStep, localWorkshop, handleFieldChange, handleArrayChange)}
                   </div>
               ) : viewMode === 'diagnosis' ? (
                   <div className="animate-in fade-in zoom-in-95 duration-500 space-y-8">
                        <DiagnosisView step={currentStep} feedback={copilotData} />
                   </div>
               ) : (
                   <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <ReferenceMirrorView step={currentStep} />
                   </div>
               )}

               {/* Asset Impact Footer */}
               <div className="pt-20 border-t border-foreground/5 space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-foreground/10" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 italic">Asset Impact</span>
                        <div className="h-px flex-1 bg-foreground/10" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 border-2 border-foreground/5 bg-card/50">
                             <span className="text-[9px] font-black uppercase tracking-widest text-accent block mb-1 underline">Proposal Draft</span>
                             <p className="text-[11px] font-bold text-muted-foreground leading-tight italic">
                                 {getAssetImpact(currentStep).proposal}
                             </p>
                        </div>
                        <div className="p-4 border-2 border-foreground/5 bg-card/50">
                             <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 block mb-1 underline">One-Pager</span>
                             <p className="text-[11px] font-bold text-muted-foreground leading-tight italic">
                                 {getAssetImpact(currentStep).onepager}
                             </p>
                        </div>
                    </div>
               </div>
           </div>

           {/* Navigation Controls Overlay */}
           <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-background border-4 border-foreground p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] z-20">
                <Button 
                    variant="ghost" 
                    onClick={() => {
                        const prevIdx = Math.max(0, currentStepIndex - 1);
                        setCurrentStep(STEPS[prevIdx].id);
                        setCopilotData(null);
                    }}
                    disabled={currentStepIndex === 0}
                    className="h-10 px-6 font-black uppercase tracking-widest text-[11px] hover:bg-foreground hover:text-background rounded-none"
                >
                    <ChevronLeft className="h-4 w-4 mr-2" /> Prev chapter
                </Button>
                <div className="h-8 w-px bg-foreground/10" />
                <Button 
                    variant="ghost" 
                    onClick={() => {
                        const nextIdx = Math.min(STEPS.length - 1, currentStepIndex + 1);
                        setCurrentStep(STEPS[nextIdx].id);
                        setCopilotData(null);
                    }}
                    disabled={currentStepIndex === STEPS.length - 1}
                    className="h-10 px-6 font-black uppercase tracking-widest text-[11px] hover:bg-foreground hover:text-background rounded-none italic"
                >
                    Next chapter <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
           </div>
        </main>

        {/* Right Column: Live Diagnosis */}
        <aside className="w-[300px] border-l-2 border-border bg-card flex flex-col shrink-0">
          <div className="p-6 border-b-2 border-border bg-[#141414] text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-4">
                  <span className="font-mono text-[9px] font-black uppercase tracking-widest">Diagnosis_Engine</span>
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              </div>
              <div className="space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/50">Maturity Index</div>
                  <div className="text-4xl font-black italic tracking-tighter tabular-nums">
                    {localWorkshop.maturityScores.overallScore}%
                  </div>
              </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-6 space-y-10">
                {/* Next Best Move Block */}
                <div className="p-6 border-4 border-foreground bg-accent/5 space-y-4">
                    <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-accent" />
                        <span className="text-[11px] font-black uppercase tracking-widest italic">Next Best Move</span>
                    </div>
                    
                    <div className="space-y-5">
                       {copilotData && copilotData.recommendations.length > 0 ? (
                           <>
                               <div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-accent block mb-0.5 animate-pulse">AI Recommendation</span>
                                    <p className="text-xs font-black uppercase leading-tight italic">
                                        {copilotData.recommendations[0]}
                                    </p>
                               </div>
                               <div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-foreground/40 block mb-0.5">Architect Choice</span>
                                    <p className="text-[11px] font-bold text-muted-foreground leading-snug italic">
                                        "Diese Änderung hat aktuell die höchste Hebelwirkung auf deinen Familienfit."
                                    </p>
                               </div>
                           </>
                       ) : (
                           <>
                               <div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-foreground/40 block mb-0.5">Lücke</span>
                                    <p className="text-xs font-black uppercase leading-tight italic">
                                        {localWorkshop.maturityScores.redFlags.length > 0 
                                            ? localWorkshop.maturityScores.redFlags[0] 
                                            : "Statischer Outcome-Check"}
                                    </p>
                               </div>
                               <div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-foreground/40 block mb-0.5">Relevanz</span>
                                    <p className="text-[11px] font-bold text-muted-foreground leading-snug">
                                        {localWorkshop.maturityScores.redFlags.length > 0
                                            ? "Ohne diesen Baustein fehlt dem Workshop die notwendige Schärfe für die Day-3 Anwendbarkeit."
                                            : "Dein Workshop ist bereits auf einem guten Weg zur Operationalität."}
                                    </p>
                               </div>
                           </>
                       )}
                       <Button 
                            className="w-full h-10 bg-accent text-white font-black uppercase tracking-widest text-[10px] rounded-none hover:translate-y-px transition-all"
                            onClick={() => {
                                if (copilotData && copilotData.recommendations.length > 0) {
                                    // User reads recommendation and applies it manually in the editor
                                } else {
                                    // Simple logic to jump to a likely missing step
                                    if (localWorkshop.maturityScores.redFlags[0]?.toLowerCase().includes('scope')) setCurrentStep('scope');
                                    else if (localWorkshop.maturityScores.redFlags[0]?.toLowerCase().includes('deliverable')) setCurrentStep('deliverables');
                                    else setCurrentStep('outcome');
                                }
                            }}
                       >
                            {copilotData && copilotData.recommendations.length > 0 ? "Empfehlung prüfen" : "Lücke schließen"}
                       </Button>
                    </div>
                </div>

                {/* AI Copilot Prompt */}
                <div className="space-y-6">
                    <Button 
                        onClick={askCopilot} 
                        disabled={isAiLoading}
                        className="w-full h-14 bg-foreground text-background font-black uppercase tracking-widest border-2 border-foreground shadow-[6px_6px_0px_0px_rgba(255,68,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                    >
                        {isAiLoading ? 'Analyzing System...' : <><Sparkles className="h-4 w-4" /> Ask Architecture AI</>}
                    </Button>

                    {copilotData && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                            <div className="text-[11px] font-bold text-foreground bg-accent/5 p-6 border-l-4 border-accent italic leading-relaxed">
                                "{copilotData.critique}"
                            </div>
                        </div>
                    )}
                </div>

                {/* Comparison to Reference */}
                <div className="space-y-4 border-t-2 border-border pt-10">
                    <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black uppercase tracking-widest text-foreground italic">Referenz-Vergleich</span>
                         <span className="text-[10px] font-mono text-muted-foreground">Kanban v2.1</span>
                    </div>
                    <div className="space-y-3">
                         <ComparisonRow label="Deliverables Strength" diff={-30} />
                         <ComparisonRow label="Method Innovation" diff={12} />
                         <ComparisonRow label="Audience Precision" diff={-5} />
                    </div>
                    <Button 
                        variant="link" 
                        onClick={() => setViewMode('reference')}
                        className="text-[10px] font-black uppercase tracking-widest text-accent p-0 h-auto underline"
                    >
                        Gesamten Mirror öffnen
                    </Button>
                </div>
            </div>
          </ScrollArea>
        </aside>
      </div>
    </div>
  );
}

function HealthIndicator({ label, value, status }: { label: string, value: string, status: 'green' | 'yellow' | 'red' }) {
    const statusColor = status === 'green' ? 'bg-green-500' : status === 'yellow' ? 'bg-yellow-500' : 'bg-red-500';
    return (
        <div className="flex items-center gap-3 px-6 h-full border-r border-border first:pl-0">
            <div className={cn("h-2 w-2 rounded-full", statusColor)} />
            <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground leading-none">{label}</span>
                <span className="text-[11px] font-black uppercase tracking-tighter leading-none mt-1">{value}</span>
            </div>
        </div>
    );
}

function ComparisonRow({ label, diff }: { label: string, diff: number }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-foreground/60">{label}</span>
            <span className={cn(
                "font-mono text-[10px] font-black",
                diff > 0 ? "text-green-500" : diff < 0 ? "text-red-500" : "text-muted-foreground"
            )}>
                {diff > 0 ? `+${diff}` : diff}%
            </span>
        </div>
    );
}

function DiagnosisView({ step, feedback }: { step: StepId, feedback: CopilotResponse | null }) {
    return (
        <div className="space-y-8">
            <Card className="rounded-none border-4 border-foreground bg-accent/5 p-8">
                <h3 className="text-xl font-black uppercase tracking-tighter italic mb-4">Kapitel-Diagnose: {step}</h3>
                <p className="text-sm font-bold text-foreground/60 max-w-2xl leading-relaxed">
                    Das System analysiert die Produktlogik basierend auf dem Monday-Ready Framework. Die größte Stärke liegt aktuell in der Identität, während die Deliverables noch Schärfe benötigen.
                </p>
            </Card>
            
            <div className="grid grid-cols-2 gap-6">
                <div className="p-6 border-2 border-foreground bg-card">
                    <span className="text-[10px] font-black uppercase tracking-widest text-accent mb-2 block italic underline">Impact-Fokus</span>
                    <p className="text-xs font-bold leading-relaxed">Die aktuelle Beschreibung fokussiert sich stark auf Wissensvermittlung. Das Framework Kickoff benötigt jedoch einen Fokus auf Operationale Fähigkeit.</p>
                </div>
                <div className="p-6 border-2 border-foreground bg-card">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 block italic underline">Optimierung</span>
                    <p className="text-xs font-bold leading-relaxed">Reduziere die Anzahl der Methoden im Hauptteil und stärke die Signature Method für mehr Wiedererkennungswert.</p>
                </div>
            </div>
        </div>
    );
}

function ReferenceMirrorView({ step }: { step: StepId }) {
    return (
        <Card className="rounded-none border-4 border-blue-600 bg-blue-50/50 p-8 space-y-8">
            <div className="flex items-center justify-between border-b-2 border-blue-600 pb-4">
               <div>
                    <span className="bg-blue-600 text-white font-mono text-[10px] font-black px-2 py-0.5 uppercase tracking-widest">Reference Mirror</span>
                    <h3 className="text-2xl font-black uppercase tracking-tighter italic mt-1">Wie löst die Referenz "{step}"?</h3>
               </div>
               <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 italic block leading-none">Benchmark</span>
                    <span className="text-xl font-black italic text-blue-600 leading-none">Kanban Kickoff</span>
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-12">
                <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 italic underline">Der Referenz-Weg</p>
                    <div className="p-6 border-2 border-blue-600/20 bg-white/50 space-y-4">
                         <p className="text-xs font-bold leading-relaxed italic">
                             "Im Kanban Kickoff wird {step} durch ein striktes Modell gelöst, das keine Interpretationsspielräume lässt. Jede Entscheidung zahlt auf die Day-3 Operationalität ein."
                         </p>
                         <ul className="text-[11px] font-bold space-y-2 text-blue-600">
                             <li>• Radikale Entschlackung</li>
                             <li>• Fokus auf Board-Design</li>
                             <li>• Klare Prozessvereinbarungen</li>
                         </ul>
                    </div>
                </div>
                <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground italic underline">Dein Workshop</p>
                    <div className="p-6 border-2 border-foreground/10 bg-card/50 space-y-4">
                         <p className="text-xs font-bold leading-relaxed italic">
                             Du bist hier aktuell sehr detailliert, weichst aber von der Kernlogik des Frameworks ab, indem du zu viele theoretische Blöcke einbaust.
                         </p>
                         <div className="flex gap-2">
                             <Badge variant="outline" className="rounded-none border-blue-600 text-blue-600 font-black text-[9px] uppercase tracking-widest">Abweichung</Badge>
                             <Badge variant="outline" className="rounded-none border-green-600 text-green-600 font-black text-[9px] uppercase tracking-widest">Struktur Ok</Badge>
                         </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

function getAssetImpact(step: StepId) {
    const impacts: Record<string, { proposal: string, onepager: string }> = {
        identity: {
            proposal: "Daraus entsteht die Überschrift und der Context-Block des Proposals.",
            onepager: "Daraus wird die Headline und Subtitle im Shop-Display."
        },
        outcome: {
            proposal: "Daraus wird das 'Value Statement' und die Day-3 Readiness Liste.",
            onepager: "Daraus wird die 'What you get' Sektion im Flyer."
        },
        scope: {
            proposal: "Daraus entsteht der Sales-Scope-Block und die Commercial Boundary.",
            onepager: "Daraus wird die 'Nicht enthalten' Sektion im Dokument."
        },
        deliverables: {
            proposal: "Daraus entsteht die Handover-Liste für das Team.",
            onepager: "Daraus wird die Ergebnisbeschreibung für Stakeholder."
        }
    };
    return impacts[step] || { proposal: "Daraus wird ein Kernbaustein der Proposal-Logik.", onepager: "Dieser Inhalt fließt direkt in die Client-Assets ein." };
}

function renderStepEditor(step: StepId, workshop: Workshop, onFieldChange: any, onArrayChange: any) {
    switch (step) {
        case 'identity':
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2">
                        <FieldGroup label="Workshop Name" description="The public-facing name of the product.">
                            <Input 
                                value={workshop.name} 
                                onChange={e => onFieldChange('name', '', e.target.value)}
                                placeholder="e.g. Kanban Kickoff"
                                className="text-2xl font-black rounded-none border-2 border-foreground h-16"
                            />
                        </FieldGroup>
                    </div>
                    <FieldGroup label="Description" description="Detailed context about the workshop purpose and background.">
                        <Textarea 
                            value={workshop.description || ''} 
                            onChange={e => onFieldChange('description', '', e.target.value)}
                            placeholder="Provide a more detailed explanation..."
                            className="min-h-[140px] rounded-none border-2 border-foreground"
                        />
                    </FieldGroup>
                    <div className="space-y-8">
                        <FieldGroup label="Version" description="Current iteration state.">
                            <Input 
                                value={workshop.version} 
                                onChange={e => onFieldChange('version', '', e.target.value)}
                                placeholder="0.1"
                                className="w-full font-mono rounded-none border-2 border-foreground"
                            />
                        </FieldGroup>
                        <FieldGroup label="Product Summary" description="A 1-sentence promise of value.">
                            <Textarea 
                                value={workshop.summary} 
                                onChange={e => onFieldChange('summary', '', e.target.value)}
                                placeholder="e.g. Build a visual system for team flow in 2 days."
                                className="min-h-[80px] rounded-none border-2 border-foreground"
                            />
                        </FieldGroup>
                    </div>
                </div>
            );
        case 'outcome':
            return (
                <div className="space-y-8">
                    <Alert className="bg-accent/5 border-2 border-accent rounded-none">
                        <Target className="h-4 w-4 text-accent" />
                        <AlertTitle className="text-accent text-[10px] font-black uppercase tracking-widest">Monday-Ready Guard</AlertTitle>
                        <AlertDescription className="text-foreground/70 text-[11px] font-bold italic">
                            Fokussiere dich darauf, was das Team am Montagmorgen *direkt tun* kann, nicht was sie gelernt haben.
                        </AlertDescription>
                    </Alert>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <ArrayFieldGroup 
                            label="Das Team kann danach ..." 
                            items={workshop.day3Outcome.capabilities} 
                            onChange={val => onArrayChange('day3Outcome', 'capabilities', val)}
                            placeholder="e.g. Standup moderieren"
                            variant="card"
                        />
                        <ArrayFieldGroup 
                            label="Sichtbar vorhanden ist dann ..." 
                            items={workshop.day3Outcome.artifacts} 
                            onChange={val => onArrayChange('day3Outcome', 'artifacts', val)}
                            placeholder="e.g. Kanban Board (physisch/digital)"
                            variant="card"
                        />
                        <ArrayFieldGroup 
                            label="Explizit nicht enthalten ist ..." 
                            items={workshop.day3Outcome.notIncluded} 
                            onChange={val => onArrayChange('day3Outcome', 'notIncluded', val)}
                            placeholder="e.g. Technisches Tooling-Setup"
                            variant="card"
                        />
                        <ArrayFieldGroup 
                            label="Gelungen ist der Workshop, wenn ..." 
                            items={workshop.day3Outcome.successCriteria} 
                            onChange={val => onArrayChange('day3Outcome', 'successCriteria', val)}
                            placeholder="e.g. Board ist mit echten Inhalten befüllt"
                            variant="card"
                        />
                    </div>
                </div>
            );
        case 'scope':
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ArrayFieldGroup 
                        label="In Scope" 
                        items={workshop.scope.inScope} 
                        onChange={val => onArrayChange('scope', 'inScope', val)}
                        variant="card"
                    />
                    <ArrayFieldGroup 
                        label="Out of Scope" 
                        items={workshop.scope.outOfScope} 
                        onChange={val => onArrayChange('scope', 'outOfScope', val)}
                        errorIfEmpty
                        variant="card"
                    />
                    <div className="md:col-span-2">
                        <p className="text-[11px] font-bold text-muted-foreground italic mb-6 px-4 py-3 bg-foreground/5 border-l-4 border-foreground/10">
                            Clear scope boundaries prevent scope creep and ensure focus on the core Day-3 outcome.
                        </p>
                        <ArrayFieldGroup 
                            label="Common False Assumptions" 
                            items={workshop.scope.falseAssumptions} 
                            onChange={val => onArrayChange('scope', 'falseAssumptions', val)}
                            variant="card"
                        />
                    </div>
                </div>
            );
        case 'audience':
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FieldGroup label="Zielgruppe" description="Für wen ist dieses Format primär gebaut?">
                        <Input 
                            value={workshop.audienceFit.primary.join(', ')} 
                            onChange={e => onArrayChange('audienceFit', 'primary', e.target.value.split(',').map(s => s.trim()))}
                            placeholder="e.g. Product Owners, Agile Teams"
                            className="rounded-none border-2 border-foreground font-black uppercase text-xs"
                        />
                    </FieldGroup>
                    <FieldGroup label="Non-Fit" description="Für wen ist dieses Format explizit NICHT geeignet?">
                        <Textarea 
                            value={workshop.audienceFit.nonFit.join('\n')} 
                            onChange={e => onArrayChange('audienceFit', 'nonFit', e.target.value.split('\n'))}
                            placeholder="e.g. Teams ohne Backlog&#10;Management-only Runden"
                            className="min-h-[100px] rounded-none border-2 border-foreground"
                        />
                    </FieldGroup>
                </div>
            );
        case 'deliverables':
            return (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-4 p-8 border-4 border-foreground bg-card mb-4">
                        <h3 className="text-xl font-black uppercase tracking-tighter italic mb-2">Deliverable Composer</h3>
                        <p className="text-sm font-bold text-foreground/60 italic">
                            Das Framework Kickoff braucht 5 starke Deliverables, um den Referenzwert zu erreichen.
                        </p>
                    </div>
                    <ArrayFieldGroup 
                        label="Team-Artefakte" 
                        items={workshop.deliverables.teamArtifacts} 
                        onChange={val => onArrayChange('deliverables', 'teamArtifacts', val)}
                        variant="card"
                    />
                    <ArrayFieldGroup 
                        label="Handover" 
                        items={workshop.deliverables.handoverDocs} 
                        onChange={val => onArrayChange('deliverables', 'handoverDocs', val)}
                        variant="card"
                    />
                    <ArrayFieldGroup 
                        label="Interne Materialien" 
                        items={workshop.deliverables.internalAssets} 
                        onChange={val => onArrayChange('deliverables', 'internalAssets', val)}
                        variant="card"
                    />
                    <ArrayFieldGroup 
                        label="Folgeprodukt-Übergang" 
                        items={workshop.deliverables.followOnTransitions} 
                        onChange={val => onArrayChange('deliverables', 'followOnTransitions', val)}
                        variant="card"
                    />
                </div>
            );
        case 'prework':
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FieldGroup label="Discovery Process" description="How do you learn about the team before the session?">
                        <Textarea 
                            value={workshop.preWork.discovery} 
                            onChange={e => onFieldChange('preWork', 'discovery', e.target.value)}
                            placeholder="e.g. Individual surveys and 1:1 stakeholder interviews."
                            className="min-h-[140px] rounded-none border-2 border-foreground"
                        />
                    </FieldGroup>
                    <div className="space-y-8">
                        <div className="flex items-center space-x-2 p-6 border-2 border-foreground bg-card">
                            <Switch 
                                id="no-homework"
                                checked={workshop.preWork.noHomeworkPolicy}
                                onCheckedChange={val => onFieldChange('preWork', 'noHomeworkPolicy', val)}
                            />
                            <Label htmlFor="no-homework" className="text-xs font-black uppercase tracking-widest text-foreground flex flex-col">
                                No Homework Policy
                                <span className="text-[9px] font-bold text-muted-foreground lowercase normal-case tracking-normal">Participants have 0 preparation tasks.</span>
                            </Label>
                        </div>
                        <ArrayFieldGroup 
                            label="Stakeholder Interviews" 
                            items={workshop.preWork.interviews} 
                            onChange={val => onArrayChange('preWork', 'interviews', val)}
                            placeholder="e.g. Product Owner"
                            variant="card"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <FieldGroup label="Required Inputs" description="What must the client provide? (Parsed as individual points)">
                            <Textarea 
                                value={workshop.preWork.inputs.join('\n')} 
                                onChange={e => onArrayChange('preWork', 'inputs', e.target.value.split('\n'))}
                                placeholder="e.g. Sample backlog items&#10;Current team cadence"
                                className="min-h-[100px] rounded-none border-2 border-foreground font-mono text-xs"
                            />
                        </FieldGroup>
                    </div>
                </div>
            );
        case 'ai':
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2">
                        <Alert className="bg-foreground text-background border-none rounded-none shadow-[4px_4px_0px_0px_rgba(255,68,0,1)]">
                            <Bot className="h-4 w-4" />
                            <AlertTitle className="text-[10px] font-black uppercase tracking-widest">AI Intelligence Layer</AlertTitle>
                            <AlertDescription className="text-[11px] font-bold italic opacity-80">
                                Wie nutzt dieses Format KI, um Ergebnisse zu beschleunigen oder Qualität zu sichern?
                            </AlertDescription>
                        </Alert>
                    </div>
                    <ArrayFieldGroup 
                        label="Backstage AI" 
                        items={workshop.aiLayer.backstageAi} 
                        onChange={val => onArrayChange('aiLayer', 'backstageAi', val)}
                        placeholder="e.g. Scoping Assistant"
                        variant="card"
                    />
                    <ArrayFieldGroup 
                        label="Client-Visible AI" 
                        items={workshop.aiLayer.clientVisibleAi} 
                        onChange={val => onArrayChange('aiLayer', 'clientVisibleAi', val)}
                        placeholder="e.g. Summary Bot"
                        variant="card"
                    />
                </div>
            );
        case 'followon':
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2 p-8 border-4 border-foreground bg-accent/5">
                        <h3 className="text-xl font-black uppercase tracking-tighter italic mb-2">Folgeprodukte & Monetarisierung</h3>
                        <p className="text-sm font-bold text-foreground/60 leading-relaxed italic">
                            Das Framework Kickoff ist kein isoliertes Event. Was ist der nächste logische Kauf des Kunden?
                        </p>
                    </div>
                    <ArrayFieldGroup 
                        label="Follow-On Products" 
                        items={workshop.followOnLogic.followOnProducts} 
                        onChange={val => onArrayChange('followOnLogic', 'followOnProducts', val)}
                        placeholder="e.g. Retainer Support"
                        variant="card"
                    />
                    <ArrayFieldGroup 
                        label="Upgrade Paths" 
                        items={workshop.followOnLogic.upgradePaths} 
                        onChange={val => onArrayChange('followOnLogic', 'upgradePaths', val)}
                        placeholder="e.g. Advanced Mastery"
                        variant="card"
                    />
                </div>
            );
        default:
            return (
                <div className="p-20 text-center border-4 border-dashed border-foreground/10 bg-card/20">
                    <p className="text-foreground/40 font-mono text-[10px] uppercase tracking-widest">Modulbauweise im Review</p>
                    <p className="text-sm mt-4 font-bold text-foreground/60">Aktuell sind 'Identity', 'Outcome', 'Scope' und 'Pre-Work' vollständig als Build-Module gemappt.</p>
                </div>
            );
    }
}

function FieldGroup({ label, description, children }: { label: string, description: string, children: React.ReactNode }) {
    return (
        <div className="space-y-4">
            <div className="flex flex-col pl-1 border-l-4 border-foreground">
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground leading-none">{label}</span>
                <span className="text-[10px] text-muted-foreground font-bold leading-tight mt-1">{description}</span>
            </div>
            <div>
                {children}
            </div>
        </div>
    );
}

function ArrayFieldGroup({ 
    label, 
    items, 
    onChange, 
    placeholder, 
    errorIfEmpty,
    variant = 'default' 
}: { 
    label: string, 
    items: string[], 
    onChange: (val: string[]) => void, 
    placeholder?: string, 
    errorIfEmpty?: boolean,
    variant?: 'default' | 'card'
}) {
    const [newItem, setNewItem] = useState('');

    const addItem = () => {
        if (!newItem.trim()) return;
        onChange([...items, newItem.trim()]);
        setNewItem('');
    };

    const removeItem = (index: number) => {
        onChange(items.filter((_, i) => i !== index));
    };

    return (
        <div className={cn(
            "space-y-4",
            variant === 'card' && "p-6 border-2 border-foreground bg-card"
        )}>
            <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground italic">{label}</span>
                {errorIfEmpty && items.length === 0 && <span className="text-[9px] text-accent font-black mt-1 uppercase underline animate-pulse">Critical: No Boundaries Defined</span>}
            </div>
            <div className="space-y-2">
                {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 group">
                        <div className="h-6 w-1 bg-foreground/20 shrink-0" />
                        <Input 
                            value={item} 
                            onChange={e => {
                                const newArr = [...items];
                                newArr[i] = e.target.value;
                                onChange(newArr);
                            }}
                            className="h-9 rounded-none border-x-0 border-t-0 border-b border-foreground/10 focus:border-b-2 focus:border-foreground bg-transparent font-bold text-xs"
                        />
                        <Button variant="ghost" size="icon" onClick={() => removeItem(i)} className="text-accent/40 hover:text-accent opacity-0 group-hover:opacity-100 h-8 w-8 transition-opacity">
                            <AlertTriangle className="h-3 w-3" />
                        </Button>
                    </div>
                ))}
                <div className="flex gap-2 pt-2">
                    <Input 
                        value={newItem} 
                        onChange={e => setNewItem(e.target.value)}
                        placeholder={placeholder || `Add to ${label.toLowerCase()}...`}
                        onKeyDown={e => e.key === 'Enter' && addItem()}
                        className="h-10 rounded-none border-2 border-foreground/10 bg-foreground/[0.02] text-xs font-bold"
                    />
                    <Button variant="outline" size="icon" onClick={addItem} className="h-10 w-10 shrink-0 border-2 border-foreground rounded-none bg-foreground text-background hover:bg-foreground/90">
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

function PackagePlaceholder() {
  return (
    <div className="w-16 h-16 bg-[#141414]/5 rounded-2xl flex items-center justify-center">
      <Box className="h-8 w-8 text-[#141414]/20" />
    </div>
  );
}
