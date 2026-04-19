import React from 'react';
import { Workshop } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Box, Target, Zap, TrendingUp, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PortfolioMapProps {
  workshops: Workshop[];
}

export default function PortfolioMap({ workshops }: PortfolioMapProps) {
  // Categorize workshops by stage
  const intro = workshops.filter(w => w.role.toLowerCase().includes('entry') || w.role.toLowerCase().includes('sister'));
  const kickoffs = workshops.filter(w => w.role.toLowerCase().includes('gold') || w.name.toLowerCase().includes('kickoff'));
  const expansion = workshops.filter(w => w.role.toLowerCase().includes('follow-on') || w.role.toLowerCase().includes('deep-dive'));

  return (
    <div className="flex-1 overflow-auto bg-background p-12 lg:p-20">
      <div className="max-w-6xl mx-auto space-y-20">
        <header className="space-y-4">
            <h1 className="text-7xl font-black tracking-tighter uppercase italic leading-[0.8]">Portfolio<br />Map</h1>
            <p className="text-xl text-foreground font-bold italic leading-tight max-w-2xl">Mapping the <span className="underline decoration-accent decoration-4 underline-offset-8 font-black italic uppercase italic">Monday-Ready</span> family journey.</p>
        </header>

        <div className="relative">
            {/* Visual connector lines (simplified) */}
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-foreground/10 -translate-y-1/2 z-0 hidden md:block" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
                {/* Stage 1: Discovery / Entry */}
                <PortfolioColumn 
                    title="Phase_01:_Entry" 
                    description="Awareness & Readiness"
                    workshops={intro}
                    accent="bg-accent"
                />

                {/* Stage 2: Core Kickoffs */}
                <PortfolioColumn 
                    title="Phase_02:_Core" 
                    description="System Design & Action"
                    workshops={kickoffs}
                    accent="bg-foreground"
                    isCore
                />

                {/* Stage 3: Expansion */}
                <PortfolioColumn 
                    title="Phase_03:_Scale" 
                    description="Deep-Dives & Retainers"
                    workshops={expansion}
                    accent="bg-accent"
                />
            </div>
        </div>

        {/* Legend / Overlay */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-12 border-t border-[#141414]/5">
            <LegendCard label="Signature Method" icon={Zap} />
            <LegendCard label="Day-3 Ready" icon={CheckCircleSolid} />
            <LegendCard label="Core Asset" icon={Box} />
            <LegendCard label="AI Enabled" icon={Cpu} />
        </div>
      </div>
    </div>
  );
}

function PortfolioColumn({ title, description, workshops, accent, isCore }: any) {
    return (
        <div className="space-y-10 flex flex-col">
            <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest italic flex items-center gap-3">
                    <span className={cn("inline-block w-3 h-3 border-2 border-foreground", accent)} />
                    {title}
                </h3>
                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest italic">{description}</p>
            </div>

            <div className={cn(
                "space-y-4 flex-1 p-8 rounded-none border-4 transition-all bg-card min-h-[400px]",
                isCore ? "border-foreground shadow-[12px_12px_0px_0px_rgba(255,68,0,0.1)]" : "border-foreground/10"
            )}>
                {workshops.length > 0 ? workshops.map((w: Workshop) => (
                    <Card key={w.id} className="group border-2 border-foreground rounded-none shadow-none cursor-pointer overflow-hidden transition-all bg-background hover:bg-foreground hover:text-background active:translate-x-1 active:translate-y-1">
                        <div className={cn("h-2", accent)} />
                        <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between items-start gap-4">
                                <span className="text-xl font-black uppercase tracking-tighter italic leading-none">{w.name}</span>
                                <span className="font-mono text-[9px] font-black uppercase tracking-tighter opacity-50">v{w.version}</span>
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-foreground/5 border border-foreground/10 rounded-none overflow-hidden relative">
                                     <div className="h-full bg-accent transition-all duration-500" style={{ width: `${w.maturityScores.overallScore}%` }} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Maturity_Index</span>
                                    <span className="text-[10px] font-mono font-black">{w.maturityScores.overallScore}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )) : (
                    <div className="flex flex-col items-center justify-center h-full py-20 text-center border-4 border-dashed border-foreground/10 opacity-30 italic">
                         <p className="text-[10px] font-black uppercase tracking-widest">Growth_Gap</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function LegendCard({ label, icon: Icon }: any) {
    return (
        <div className="flex items-center gap-4 p-6 bg-card border-2 border-foreground rounded-none shadow-none hover:bg-foreground hover:text-background transition-all group">
            <div className="w-12 h-12 rounded-none bg-foreground/5 flex items-center justify-center border-2 border-foreground/5 group-hover:border-background/20 group-hover:bg-background/10">
                <Icon className="h-6 w-6 text-foreground/60 group-hover:text-background" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest italic">{label}</span>
        </div>
    );
}

function CheckCircleSolid(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
        >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z" />
        </svg>
    )
}
