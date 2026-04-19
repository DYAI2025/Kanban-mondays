import React, { useState } from 'react';
import { 
    FileText, 
    Download, 
    Copy, 
    Eye, 
    Sparkles, 
    Send, 
    CheckCircle,
    Layout,
    FileSearch
} from 'lucide-react';
import { Workshop } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import { summarizeContent } from '@/services/geminiService';

interface AssetStudioProps {
  workshop: Workshop | null;
}

const ASSET_TYPES = [
    { id: 'infosheet', label: 'Infosheet', icon: FileText, description: 'Client-facing 1-pager' },
    { id: 'proposal', label: 'Proposal Text', icon: Layout, description: 'Sales block for CRM' },
    { id: 'brief', label: 'Delivery Brief', icon: Send, description: 'Coach instructions' },
] as const;

export default function AssetStudio({ workshop }: AssetStudioProps) {
  const [selectedType, setSelectedType] = useState<typeof ASSET_TYPES[number]['id']>('infosheet');
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<string>('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  if (!workshop) return <NoWorkshopSelected />;

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const model = "gemini-3-flash-preview";

  const generateAsset = async () => {
    setIsGenerating(true);
    setSummary('');
    setShowSummary(false);
    const prompt = `You are a high-end product copywriter. Generate a ${selectedType} for the following workshop.
    
    Workshop Data: ${JSON.stringify(workshop)}
    
    Style: Professional, sharp, Monday-Ready. No fluff. Focus on ROI and immediate application.
    Format the response in clean Markdown.
    
    Requirements for ${selectedType}:
    - Infosheet: Catchy header, Problem, Day-3 Outcome, Who it is for, High-level Agenda.
    - Proposal: Persuasive text for a client proposal including investment value.
    - Delivery Brief: Internal document explaining the signature methods and experiential anchor to a facilitator.`;

    try {
        const result = await ai.models.generateContent({
            model,
            contents: prompt
        });
        setGeneratedContent(result.text || '');
    } catch (error) {
        setGeneratedContent("Error generating asset. Please check your connectivity.");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleSummarize = async () => {
    if (!generatedContent) return;
    setIsSummarizing(true);
    const result = await summarizeContent(generatedContent, 'asset');
    setSummary(result);
    setShowSummary(true);
    setIsSummarizing(false);
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-background">
        {/* Left: Selectors */}
        <aside className="w-80 border-r-2 border-border bg-card flex flex-col shrink-0">
            <header className="p-8 border-b-2 border-border space-y-2 bg-foreground/5">
                <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-none">Asset<br />Studio</h2>
                <p className="text-[10px] text-foreground font-black uppercase tracking-widest italic mt-2">STRUCTURE &rarr; ASSET</p>
            </header>
            <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                    <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest italic">Asset Configuration</p>
                    <div className="grid gap-3">
                        {ASSET_TYPES.map(type => (
                            <button
                                key={type.id}
                                onClick={() => setSelectedType(type.id)}
                                className={cn(
                                    "p-6 rounded-none text-left transition-all border-2",
                                    selectedType === type.id 
                                        ? "bg-foreground text-background border-foreground shadow-[4px_4px_0px_0px_rgba(255,68,0,1)]" 
                                        : "bg-card border-foreground/10 hover:border-foreground/30 text-foreground/60"
                                )}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <type.icon className={cn("h-5 w-5", selectedType === type.id ? "text-accent" : "text-foreground/30")} />
                                    {selectedType === type.id && <CheckCircle className="h-4 w-4" />}
                                </div>
                                <p className="text-sm font-black uppercase tracking-tighter italic leading-none">{type.label}</p>
                                <p className={cn("text-[10px] font-bold leading-tight mt-2 italic", selectedType === type.id ? "text-background/60" : "text-foreground/40")}>
                                    {type.description}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            </ScrollArea>
            <div className="p-8 border-t-2 border-border">
                <Button 
                    onClick={generateAsset} 
                    disabled={isGenerating}
                    className="w-full h-14 bg-foreground text-background font-black uppercase tracking-widest border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(255,68,0,1)] hover:shadow-none hover:translate-y-px transition-all"
                >
                    <Sparkles className="h-4 w-4" /> {isGenerating ? 'Generating...' : 'Build Asset'}
                </Button>
            </div>
        </aside>

        {/* Right: Preview */}
        <main className="flex-1 flex flex-col min-w-0 bg-background">
             <header className="h-16 flex items-center justify-between px-10 border-b-2 border-border bg-card">
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-foreground uppercase tracking-widest italic">{selectedType}_v1.0</span>
                    <Badge variant="outline" className="font-mono text-[10px] font-black uppercase border-2 border-foreground rounded-none bg-background">{workshop.name}</Badge>
                </div>
                <div className="flex gap-2">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleSummarize}
                        disabled={!generatedContent || isSummarizing}
                        className="h-10 px-4 rounded-none font-black uppercase tracking-widest text-[10px] hover:bg-foreground hover:text-background transition-all"
                    >
                        {isSummarizing ? '...' : <><FileSearch className="h-4 w-4 mr-2" /> Summary</>}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-10 px-4 rounded-none font-black uppercase tracking-widest text-[10px] hover:bg-foreground hover:text-background transition-all"><Copy className="h-4 w-4 mr-2" /> Copy</Button>
                    <Button variant="ghost" size="sm" className="h-10 px-4 rounded-none font-black uppercase tracking-widest text-[10px] hover:bg-foreground hover:text-background transition-all"><Download className="h-4 w-4 mr-2" /> PDF</Button>
                </div>
             </header>

             <ScrollArea className="flex-1 p-12 lg:p-20">
                 <div className="max-w-4xl mx-auto space-y-12">
                    {showSummary && summary && (
                        <Card className="border-4 border-accent bg-accent/5 p-8 rounded-none animate-in slide-in-from-top-4 duration-500 relative">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setShowSummary(false)}
                                className="absolute top-2 right-2 text-accent h-6 w-6 p-0 hover:bg-accent hover:text-white rounded-none"
                            >
                                &times;
                            </Button>
                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-accent flex items-center gap-2 italic">
                                    <Sparkles className="h-4 w-4" /> AI_Executive_Summary
                                </h3>
                                <p className="text-sm font-bold text-foreground leading-relaxed italic">
                                    {summary}
                                </p>
                            </div>
                        </Card>
                    )}

                    {generatedContent ? (
                        <Card className="shadow-none border-4 border-foreground p-16 animate-in slide-in-from-bottom-8 duration-700 min-h-[1000px] bg-card rounded-none">
                             <div className="max-w-none prose prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-p:font-bold prose-p:text-foreground/80 text-foreground">
                                <ReactMarkdown>{generatedContent}</ReactMarkdown>
                             </div>
                        </Card>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-20 text-center space-y-8 border-4 border-dashed border-foreground/10 h-[600px] italic">
                             <div className="w-20 h-20 rounded-none bg-foreground/5 border-2 border-foreground/5 flex items-center justify-center">
                                <Eye className="h-10 w-10 text-foreground/20" />
                             </div>
                             <div className="space-y-2">
                                <h3 className="text-2xl font-black uppercase tracking-tighter italic">Preview_Empty</h3>
                                <p className="text-sm font-bold text-foreground/40 max-w-xs mx-auto leading-relaxed">Click 'Build Asset' to generate the {selectedType} using the studio logic.</p>
                             </div>
                        </div>
                    )}
                 </div>
             </ScrollArea>
        </main>
    </div>
  );
}

function NoWorkshopSelected() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-20 bg-[#FDFCFB] text-center space-y-4">
            <div className="w-20 h-20 bg-[#141414]/5 rounded-3xl flex items-center justify-center mb-4">
                <FileText className="h-10 w-10 text-[#141414]/20" />
            </div>
            <h2 className="text-2xl font-bold">No Active Workshop</h2>
            <p className="text-[#141414]/50 max-w-sm">
                Assets are generated from structured studio data. Open a workshop from the library first.
            </p>
        </div>
    );
}
