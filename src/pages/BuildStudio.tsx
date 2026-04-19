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
    Flag
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

  return (
    <div className="flex-1 flex overflow-hidden bg-background">
      {/* Left Column: Navigation */}
      <nav className="w-[220px] border-r-2 border-border bg-card flex flex-col shrink-0">
        <div className="p-6 border-b-2 border-border space-y-4 bg-foreground/5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-foreground uppercase tracking-widest italic">Progress</span>
            <span className="text-xs font-mono font-black">{Math.round(progress)}%</span>
          </div>
          <div className="h-3 w-full bg-foreground/10 border border-foreground/10 overflow-hidden">
             <div className="h-full bg-accent" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <ScrollArea className="flex-1 px-0 py-6">
          <div className="space-y-0">
            {STEPS.map((step) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-6 py-4 text-[11px] font-black uppercase tracking-widest transition-all text-left border-b border-border/5",
                  currentStep === step.id 
                    ? "bg-background text-foreground border-r-4 border-accent italic" 
                    : "text-muted-foreground hover:text-foreground hover:bg-background/30"
                )}
              >
                <step.icon className={cn("h-4 w-4 shrink-0", currentStep === step.id ? "text-accent" : "text-muted-foreground")} />
                <span className="truncate">{step.label}</span>
              </button>
            ))}
          </div>
        </ScrollArea>
        <div className="p-6 border-t-2 border-border">
            <Button onClick={handleSave} className="w-full h-12 bg-foreground text-background font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(255,68,0,1)] hover:translate-y-px hover:shadow-none transition-all">
                <Save className="h-4 w-4" /> Save
            </Button>
        </div>
      </nav>

      {/* Middle Column: Editor */}
      <main className="flex-1 overflow-y-auto p-12 bg-background">
        <div className="max-w-3xl mx-auto pb-40">
            <Card className="border-4 border-border shadow-none rounded-none bg-card p-12">
                <header className="space-y-6 mb-12">
                    <span className="bg-foreground text-background font-mono text-[10px] font-black px-2 py-0.5 uppercase tracking-widest">STEP {currentStepIndex + 1}_OF_{STEPS.length}</span>
                    <h2 className="text-[60px] font-black tracking-tighter uppercase leading-[0.9] italic">
                        {STEPS.find(s => s.id === currentStep)?.label.split(' ')[0]}<br />
                        {STEPS.find(s => s.id === currentStep)?.label.split(' ').slice(1).join(' ')}
                    </h2>
                    <div className="w-20 h-2 bg-accent" />
                </header>

                <div className="space-y-12">
                    {renderStepEditor(currentStep, localWorkshop, handleFieldChange, handleArrayChange)}
                </div>

                <footer className="flex items-center justify-between pt-16 mt-16 border-t-2 border-foreground/5">
                    <Button 
                        variant="outline" 
                        onClick={() => {
                            const prevIdx = Math.max(0, currentStepIndex - 1);
                            setCurrentStep(STEPS[prevIdx].id);
                            setCopilotData(null);
                        }}
                        disabled={currentStepIndex === 0}
                        className="h-14 px-8 border-2 border-foreground font-black uppercase tracking-widest rounded-none hover:bg-accent hover:text-white hover:border-accent"
                    >
                        <ChevronLeft className="h-5 w-5" /> Back
                    </Button>
                    <Button 
                        onClick={() => {
                            const nextIdx = Math.min(STEPS.length - 1, currentStepIndex + 1);
                            setCurrentStep(STEPS[nextIdx].id);
                            setCopilotData(null);
                        }}
                        disabled={currentStepIndex === STEPS.length - 1}
                        className="h-14 px-8 bg-foreground text-background border-2 border-foreground font-black uppercase tracking-widest rounded-none hover:bg-foreground/90 transition-all"
                    >
                        Next Section <ChevronRight className="h-5 w-5" />
                    </Button>
                </footer>
            </Card>
        </div>
      </main>

      {/* Right Column: Diagnosis & Copilot */}
      <aside className="w-[300px] border-l-2 border-border bg-card flex flex-col shrink-0">
        <div className="p-6 border-b-2 border-border bg-foreground text-background">
            <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-black uppercase tracking-widest italic">Diagnosis_V1</span>
                <Sparkles className="h-4 w-4 text-accent animate-pulse" />
            </div>
            <div className="text-3xl font-black italic uppercase mt-2 tracking-tighter">
                {localWorkshop.maturityScores.overallScore}% Ready
            </div>
        </div>
        <ScrollArea className="flex-1">
            <div className="p-8 space-y-10">
                {/* Maturity Meter */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Maturity Score</label>
                    <div className="h-4 w-full bg-foreground/5 border-2 border-foreground rounded-none overflow-hidden relative">
                         <div className="h-full bg-accent transition-all duration-1000" style={{ width: `${localWorkshop.maturityScores.overallScore}%` }} />
                    </div>
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-tighter">
                        <span className="text-foreground/40">Draft</span>
                        <span className="text-accent underline">Monday-Ready</span>
                    </div>
                </div>

                <div className="space-y-6">
                    <Button 
                        onClick={askCopilot} 
                        disabled={isAiLoading}
                        className="w-full h-14 bg-foreground text-background font-black uppercase tracking-widest border-2 border-foreground shadow-[6px_6px_0px_0px_rgba(255,68,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                    >
                        {isAiLoading ? 'Analyzing...' : <><Sparkles className="h-4 w-4" /> Ask Copilot</>}
                    </Button>

                    <Button 
                        variant="outline"
                        onClick={() => setShowDocSummarizer(!showDocSummarizer)}
                        className={cn(
                            "w-full h-12 border-2 border-foreground font-black uppercase tracking-widest rounded-none transition-all",
                            showDocSummarizer ? "bg-accent text-white border-accent" : "hover:bg-foreground/5"
                        )}
                    >
                        <FileSearch className="h-4 w-4 mr-2" /> {showDocSummarizer ? 'Close Summarizer' : 'Content Summarizer'}
                    </Button>

                    {showDocSummarizer && (
                        <div className="p-6 bg-card border-4 border-foreground rounded-none space-y-6 animate-in slide-in-from-top-4 duration-500">
                             <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 italic">Source Documentation</label>
                                <Textarea 
                                    placeholder="Paste raw documentation, notes, or research here..."
                                    className="min-h-[150px] text-[11px] font-bold bg-background border-2 border-foreground/10 rounded-none focus:border-accent"
                                    value={docText}
                                    onChange={(e) => setDocText(e.target.value)}
                                />
                             </div>
                             <Button 
                                onClick={handleSummarizeDoc}
                                disabled={isSummarizing || !docText.trim()}
                                className="w-full h-10 bg-accent text-white font-black uppercase tracking-widest border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(10,10,10,0.1)] hover:shadow-none transition-all"
                             >
                                {isSummarizing ? 'Summarizing...' : 'Summarize Content'}
                             </Button>

                             {docSummary && (
                                 <div className="space-y-3 pt-4 border-t-2 border-foreground/5">
                                     <p className="text-[10px] font-black uppercase tracking-widest text-accent italic">Extracted Summary</p>
                                     <p className="text-[11px] font-bold text-foreground leading-relaxed italic bg-accent/5 p-4 border-l-4 border-accent">
                                         {docSummary}
                                     </p>
                                 </div>
                             )}
                        </div>
                    )}

                    {copilotData ? (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                            <div className="text-[11px] font-bold text-foreground bg-accent/5 p-6 border-l-4 border-accent italic leading-relaxed">
                                "{copilotData.critique}"
                            </div>
                            
                            {copilotData.flags.length > 0 && (
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground italic">Critical Lapses</p>
                                    {copilotData.flags.map((flag, i) => (
                                        <div key={i} className="p-4 bg-background border-2 border-foreground rounded-none space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-accent flex items-center gap-2">
                                                <AlertTriangle className="h-3 w-3" /> {flag.type === 'red' ? 'BLOCKER' : 'WARNING'}
                                            </p>
                                            <p className="text-[11px] font-bold text-foreground leading-tight">{flag.message}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : !isAiLoading && (
                        <div className="text-center py-10 px-6 border-2 border-dashed border-foreground/10">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 leading-relaxed italic">
                                Select step + Ask Copilot for product logic analysis.
                            </p>
                        </div>
                    )}
                </div>

                {/* Red Flags from Engine */}
                {localWorkshop.maturityScores.redFlags.length > 0 && (
                    <div className="space-y-4 pt-10 border-t-2 border-foreground/10">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-accent flex items-center gap-2 italic">
                            <Flag className="h-4 w-4" /> Hard Failures
                        </h4>
                        <div className="space-y-3">
                            {localWorkshop.maturityScores.redFlags.map((flag, i) => (
                                <div key={i} className="p-4 bg-accent/5 border-l-4 border-accent text-[11px] font-bold text-foreground leading-tight italic">
                                    {flag}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </ScrollArea>
      </aside>
    </div>
  );
}

function renderStepEditor(step: StepId, workshop: Workshop, onFieldChange: any, onArrayChange: any) {
    switch (step) {
        case 'identity':
            return (
                <div className="space-y-6">
                    <FieldGroup label="Workshop Name" description="The public-facing name of the product.">
                        <Input 
                            value={workshop.name} 
                            onChange={e => onFieldChange('name', '', e.target.value)}
                            placeholder="e.g. Kanban Kickoff"
                            className="text-lg font-bold"
                        />
                    </FieldGroup>
                    <FieldGroup label="Description" description="Detailed context about the workshop purpose and background.">
                        <Textarea 
                            value={workshop.description || ''} 
                            onChange={e => onFieldChange('description', '', e.target.value)}
                            placeholder="Provide a more detailed explanation of what this workshop is about..."
                            className="min-h-[100px]"
                        />
                    </FieldGroup>
                    <FieldGroup label="Version" description="Current iteration state.">
                        <Input 
                            value={workshop.version} 
                            onChange={e => onFieldChange('version', '', e.target.value)}
                            placeholder="0.1"
                            className="w-24 font-mono"
                        />
                    </FieldGroup>
                    <FieldGroup label="Product Summary" description="A 1-sentence promise of value.">
                        <Textarea 
                            value={workshop.summary} 
                            onChange={e => onFieldChange('summary', '', e.target.value)}
                            placeholder="e.g. Build a visual system for team flow in 2 days."
                        />
                    </FieldGroup>
                </div>
            );
        case 'outcome':
            return (
                <div className="space-y-6">
                    <Alert className="bg-blue-50 border-blue-100">
                        <Target className="h-4 w-4 text-blue-600" />
                        <AlertTitle className="text-blue-900 text-xs">A Monday-Ready Kickoff must be operational.</AlertTitle>
                        <AlertDescription className="text-blue-800/70 text-[11px]">Focus on what the team is *ready to do* on Monday morning.</AlertDescription>
                    </Alert>
                    <ArrayFieldGroup 
                        label="Day-3 Capabilities" 
                        items={workshop.day3Outcome.capabilities} 
                        onChange={val => onArrayChange('day3Outcome', 'capabilities', val)}
                        placeholder="e.g. Team can run a standup"
                    />
                    <ArrayFieldGroup 
                        label="Concrete Artifacts" 
                        items={workshop.day3Outcome.artifacts} 
                        onChange={val => onArrayChange('day3Outcome', 'artifacts', val)}
                        placeholder="e.g. Visual Board, WIP Agreements"
                    />
                    <ArrayFieldGroup 
                        label="Key Decisions" 
                        items={workshop.day3Outcome.decisions} 
                        onChange={val => onArrayChange('day3Outcome', 'decisions', val)}
                        placeholder="e.g. Meeting cadence agreed"
                    />
                </div>
            );
        case 'scope':
            return (
                <div className="space-y-6">
                    <ArrayFieldGroup 
                        label="In Scope" 
                        items={workshop.scope.inScope} 
                        onChange={val => onArrayChange('scope', 'inScope', val)}
                    />
                    <ArrayFieldGroup 
                        label="Out of Scope" 
                        items={workshop.scope.outOfScope} 
                        onChange={val => onArrayChange('scope', 'outOfScope', val)}
                        errorIfEmpty
                    />
                    <ArrayFieldGroup 
                        label="Common False Assumptions" 
                        items={workshop.scope.falseAssumptions} 
                        onChange={val => onArrayChange('scope', 'falseAssumptions', val)}
                    />
                </div>
            );
        default:
            return (
                <div className="p-12 text-center border-2 border-dashed border-[#141414]/10 rounded-2xl bg-white shadow-inner">
                    <p className="text-[#141414]/40 font-mono text-xs uppercase tracking-widest">Step Logic In Beta</p>
                    <p className="text-sm mt-2 text-[#141414]/60">Currently only 'Identity', 'Outcome' and 'Scope' are fully mapped for the MVP. Please use the structure for core documentation.</p>
                </div>
            );
    }
}

function FieldGroup({ label, description, children }: { label: string, description: string, children: React.ReactNode }) {
    return (
        <div className="space-y-3">
            <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1 italic">{label}</span>
                <span className="text-xs text-foreground/60 leading-snug">{description}</span>
            </div>
            <div className="pt-2">
                {children}
            </div>
        </div>
    );
}

function ArrayFieldGroup({ label, items, onChange, placeholder, errorIfEmpty }: { label: string, items: string[], onChange: (val: string[]) => void, placeholder?: string, errorIfEmpty?: boolean }) {
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
        <div className="space-y-4">
            <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-widest text-[#141414]/40">{label}</span>
                {errorIfEmpty && items.length === 0 && <span className="text-[10px] text-red-500 font-bold mt-1 uppercase italic">High Risk: No negative scope defined</span>}
            </div>
            <div className="space-y-2">
                {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 group">
                        <Input 
                            value={item} 
                            onChange={e => {
                                const newArr = [...items];
                                newArr[i] = e.target.value;
                                onChange(newArr);
                            }}
                            className="bg-white"
                        />
                        <Button variant="ghost" size="icon" onClick={() => removeItem(i)} className="text-red-500/40 hover:text-red-500 opacity-0 group-hover:opacity-100 h-8 w-8 transition-opacity">
                            <AlertTriangle className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                <div className="flex gap-2">
                    <Input 
                        value={newItem} 
                        onChange={e => setNewItem(e.target.value)}
                        placeholder={placeholder || `Add ${label.toLowerCase()}...`}
                        onKeyDown={e => e.key === 'Enter' && addItem()}
                        className="bg-[#141414]/[0.02]"
                    />
                    <Button variant="outline" size="icon" onClick={addItem} className="shrink-0 border-[#141414]/10 bg-white">
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

function Plus(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
