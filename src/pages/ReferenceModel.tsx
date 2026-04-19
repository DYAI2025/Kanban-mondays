import React from 'react';
import { REFERENCE_WORKSHOP } from '@/constants';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, Target, Users, Layers, Zap, Box, ExternalLink, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';

function ReferenceLink({ title, desc, url }: { title: string, desc: string, url: string }) {
    return (
        <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center justify-between p-6 bg-white border-2 border-foreground hover:bg-accent/5 transition-all group rounded-none"
        >
            <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-accent italic">Resource</span>
                <h4 className="text-sm font-black uppercase tracking-tight">{title}</h4>
                <p className="text-[11px] font-bold text-muted-foreground leading-tight italic">{desc}</p>
            </div>
            <ExternalLink className="h-5 w-5 text-foreground/20 group-hover:text-foreground transition-colors" />
        </a>
    );
}

export default function ReferenceModel() {
  const w = REFERENCE_WORKSHOP;
  
  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background text-foreground">
      {/* Header */}
      <header className="p-12 border-b-2 border-border space-y-4 bg-card">
        <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-accent text-accent-foreground rounded-none border-2 border-foreground flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]">
                <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="pt-2">
                <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-[0.8]">{w.name}</h1>
                <p className="text-foreground/50 font-black uppercase tracking-[0.2em] text-[10px] mt-2 italic">Product_Standards_v{w.version}</p>
            </div>
            <Badge className="bg-foreground text-background border-none ml-auto rounded-none font-black px-4 py-2 uppercase tracking-widest text-xs h-auto">CORE_BASELINE</Badge>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex">
        <ScrollArea className="flex-1">
          <div className="p-8 space-y-12 max-w-5xl mx-auto">
            
            {/* Summary Panel */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 border-[#141414]/10 shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle className="text-lg">Product Identity</CardTitle>
                        <CardDescription>{w.summary}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                               <p className="text-[10px] font-bold text-[#141414]/30 uppercase tracking-widest">Family Fit</p>
                               <p className="text-sm font-bold text-green-600">100% (Baseline)</p>
                           </div>
                           <div className="space-y-1">
                               <p className="text-[10px] font-bold text-[#141414]/30 uppercase tracking-widest">Maturity Score</p>
                               <p className="text-sm font-bold">{w.maturityScores.overallScore}/100</p>
                           </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="space-y-4">
                    <div className="p-4 rounded-xl border border-[#141414]/10 bg-white">
                        <p className="text-[10px] font-bold text-[#141414]/30 uppercase tracking-widest mb-2">Portfolio Role</p>
                        <p className="text-sm font-semibold">{w.role}</p>
                    </div>
                    <div className="p-4 rounded-xl border border-[#141414]/10 bg-white">
                        <p className="text-[10px] font-bold text-[#141414]/30 uppercase tracking-widest mb-2">Duration</p>
                        <p className="text-sm font-semibold">{w.format.durationOnsite} (Onsite)</p>
                        <p className="text-sm font-semibold">{w.format.durationRemote} (Remote)</p>
                    </div>
                </div>
            </section>

            <Tabs defaultValue="outcomes" className="w-full">
                <TabsList className="bg-foreground/5 p-0 h-auto flex-wrap justify-start gap-0 border-2 border-foreground rounded-none">
                    <TabsTrigger value="outcomes" className="data-[state=active]:bg-foreground data-[state=active]:text-background rounded-none border-r-2 border-foreground gap-2 py-4 px-8 font-black uppercase tracking-widest text-[11px] italic">
                        <Target className="h-4 w-4" /> Day-3 Outcome
                    </TabsTrigger>
                    <TabsTrigger value="audience" className="data-[state=active]:bg-foreground data-[state=active]:text-background rounded-none border-r-2 border-foreground gap-2 py-4 px-8 font-black uppercase tracking-widest text-[11px] italic">
                        <Users className="h-4 w-4" /> Audience Fit
                    </TabsTrigger>
                    <TabsTrigger value="methods" className="data-[state=active]:bg-foreground data-[state=active]:text-background rounded-none border-r-2 border-foreground gap-2 py-4 px-8 font-black uppercase tracking-widest text-[11px] italic">
                        <Zap className="h-4 w-4" /> Signature Methods
                    </TabsTrigger>
                    <TabsTrigger value="deliverables" className="data-[state=active]:bg-foreground data-[state=active]:text-background rounded-none border-r-2 border-foreground gap-2 py-4 px-8 font-black uppercase tracking-widest text-[11px] italic">
                        <Box className="h-4 w-4" /> Deliverables
                    </TabsTrigger>
                    <TabsTrigger value="deepdive" className="data-[state=active]:bg-foreground data-[state=active]:text-background rounded-none gap-2 py-4 px-8 font-black uppercase tracking-widest text-[11px] italic">
                        <Link2 className="h-4 w-4" /> Deep Dive References
                    </TabsTrigger>
                </TabsList>

                <div className="mt-12 bg-card rounded-none border-4 border-foreground p-12 shadow-none min-h-[400px]">
                    <TabsContent value="outcomes" className="m-0 space-y-12 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <h3 className="text-xs font-black uppercase tracking-widest text-foreground/40 flex items-center gap-3 italic">
                                    <CheckCircle2 className="h-4 w-4 text-accent" /> Capabilities (What they can DO)
                                </h3>
                                <ul className="space-y-4">
                                    {w.day3Outcome.capabilities.map((c, i) => (
                                        <li key={i} className="flex gap-4 text-sm font-bold text-foreground p-6 bg-background border-2 border-foreground/5 rounded-none shadow-[4px_4px_0px_0px_rgba(20,20,20,0.05)]">
                                            <span className="text-accent">→</span> {c}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="space-y-6">
                                <h3 className="text-xs font-black uppercase tracking-widest text-foreground/40 flex items-center gap-3 italic">
                                    <Box className="h-4 w-4 text-accent" /> Artifacts (What they HAVE)
                                </h3>
                                <ul className="space-y-4">
                                    {w.day3Outcome.artifacts.map((c, i) => (
                                        <li key={i} className="flex gap-4 text-sm font-bold text-foreground p-6 bg-background border-2 border-foreground/5 rounded-none shadow-[4px_4px_0px_0px_rgba(20,20,20,0.05)]">
                                            <span className="text-accent">→</span> {c}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="audience" className="m-0 space-y-12 animate-in fade-in duration-300">
                         <div className="space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-[#141414]/40">Primary Audience Fit</h3>
                            <div className="flex gap-2 flex-wrap">
                                {w.audienceFit.primary.map((a, i) => <Badge key={i} variant="outline" className="border-[#141414]/20 bg-white px-3 py-1 text-sm">{a}</Badge>)}
                            </div>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="p-6 bg-green-50/50 rounded-2xl border border-green-100">
                                <h3 className="text-sm font-bold text-green-800 uppercase tracking-widest mb-4">IN SCOPE</h3>
                                <ul className="space-y-2">
                                    {w.scope.inScope.map((s, i) => <li key={i} className="text-sm text-green-700 font-medium flex gap-2"><span>+</span> {s}</li>)}
                                </ul>
                             </div>
                             <div className="p-6 bg-red-50/50 rounded-2xl border border-red-100">
                                <h3 className="text-sm font-bold text-red-800 uppercase tracking-widest mb-4">OUT OF SCOPE</h3>
                                <ul className="space-y-2">
                                    {w.scope.outOfScope.map((s, i) => <li key={i} className="text-sm text-red-700 font-medium flex gap-2"><span>-</span> {s}</li>)}
                                </ul>
                             </div>
                         </div>
                    </TabsContent>

                    <TabsContent value="methods" className="m-0 space-y-8 animate-in fade-in duration-300">
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-[#141414]/40">Signature Methods (The DNA)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {w.methods.signatureMethods.map((m, i) => (
                                    <div key={i} className="p-6 bg-[#141414] text-white rounded-2xl flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">0{i+1}</div>
                                        <span className="font-bold">{m}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-6 border border-[#141414]/10 rounded-2xl bg-[#141414]/[0.02]">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-[#141414]/40 mb-2">Experiential Anchor</h3>
                            <p className="text-lg font-bold">"{w.methods.experientialAnchor}"</p>
                        </div>
                    </TabsContent>

                    <TabsContent value="deliverables" className="m-0 animate-in fade-in duration-300">
                         <div className="space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-[#141414]/40">Post-Workshop Assets</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {w.deliverables.teamArtifacts.map((d, i) => (
                                    <Card key={i} className="border-[#141414]/10 bg-[#FDFCFB]">
                                        <CardHeader className="py-4">
                                            <CardTitle className="text-base flex items-center gap-2 underline decoration-[#141414]/20">
                                                <Box className="h-4 w-4" /> {d}
                                            </CardTitle>
                                        </CardHeader>
                                    </Card>
                                ))}
                            </div>
                         </div>
                    </TabsContent>

                    <TabsContent value="deepdive" className="m-0 animate-in fade-in duration-300">
                         <div className="space-y-12">
                            <div className="p-8 border-4 border-foreground bg-accent/5">
                                <h3 className="text-xl font-black uppercase tracking-tighter italic mb-2">Master Framework References</h3>
                                <p className="text-sm font-bold text-foreground/60 leading-relaxed italic">
                                    Tiefe Einblicke in die Architektur hinter dem "Monday-Ready" Framework. Diese Ressourcen bilden das theoretische und praktische Fundament unserer Produkt-Benchmarks.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ReferenceLink 
                                    title="CompassFrameworks Master Docs" 
                                    desc="Die zentrale Dokumentation für Workshop-Architekten." 
                                    url="https://compassframeworks.de" 
                                />
                                <ReferenceLink 
                                    title="Kanban University (STATIK)" 
                                    desc="Der Systems Thinking Approach in der Referenzversion." 
                                    url="https://kanban.university" 
                                />
                                <ReferenceLink 
                                    title="Agile Alliance: Flow Foundations" 
                                    desc="Grundlagen der Flow-Theorie für Produkt-Teams." 
                                    url="https://www.agilealliance.org" 
                                />
                                <ReferenceLink 
                                    title="Product Patterns v2.4" 
                                    desc="Interne Library für wiederkehrende Workshop-Bausteine." 
                                    url="#" 
                                />
                            </div>
                         </div>
                    </TabsContent>
                </div>
            </Tabs>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
