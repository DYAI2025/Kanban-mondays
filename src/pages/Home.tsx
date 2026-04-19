import React from 'react';
import { Plus, BookOpen, ArrowRight, AlertCircle, TrendingUp, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { REFERENCE_WORKSHOP, MOCK_WORKSHOPS } from '@/constants';
import { Workshop } from '@/types';
import { cn } from '@/lib/utils';

interface HomeProps {
  onNewWorkshop: (w: Workshop) => void;
  onOpenWorkshop: (id: string) => void;
}

export default function Home({ onNewWorkshop, onOpenWorkshop }: HomeProps) {
  const latestDrafts = MOCK_WORKSHOPS.filter(w => w.status === 'draft').slice(0, 3);
  
  const handleCreateNew = () => {
    const newId = `workshop-${Math.random().toString(36).substr(2, 9)}`;
    const newWorkshop: Workshop = {
      ...REFERENCE_WORKSHOP,
      id: newId,
      name: 'Untitled Workshop',
      status: 'draft',
      version: '0.1',
      role: 'Draft',
      summary: '',
      lastModified: new Date().toISOString(),
      maturityScores: {
        categoryScores: {} as any,
        overallScore: 0,
        familyFitScore: 0,
        publishingReadiness: 0,
        assetReadiness: 0,
        redFlags: ['Fresh draft - needs core logic']
      }
    };
    onNewWorkshop(newWorkshop);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background p-12">
      <div className="max-w-6xl mx-auto space-y-20">
        {/* Hero Section */}
        <section className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-[80px] font-black tracking-tighter text-foreground uppercase leading-[0.85] italic">
              Workshop<br />Product Studio
            </h1>
            <p className="text-2xl text-foreground font-bold max-w-2xl leading-tight">
              Build, benchmark and publish <span className="bg-accent text-accent-foreground px-2">Monday-Ready</span> Framework Kickoffs.
            </p>
          </div>
          <div className="flex gap-4">
            <Button onClick={handleCreateNew} size="lg" className="h-16 px-8 bg-foreground text-background hover:bg-foreground/90 rounded-none border-2 border-foreground font-black uppercase tracking-widest gap-3 shadow-[8px_8px_0px_0px_rgba(10,10,10,1)]">
              <Plus className="h-5 w-5" /> New Workshop
            </Button>
            <Button variant="outline" size="lg" className="h-16 px-8 border-2 border-foreground rounded-none font-black uppercase tracking-widest gap-3 hover:bg-foreground/5">
              <BookOpen className="h-5 w-5" /> View Reference
            </Button>
          </div>
        </section>

        {/* Quick Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Reference Workshop Card */}
          <Card className="border-2 border-foreground shadow-none rounded-none col-span-1 md:col-span-2 overflow-hidden group bg-card">
             <div className="h-4 bg-foreground" />
             <CardHeader className="p-10">
               <div className="flex justify-between items-start">
                 <span className="font-mono text-[10px] font-black uppercase bg-foreground text-background px-2 py-0.5">GOLD_STANDARD_v1.0</span>
                 <TrendingUp className="h-6 w-6 text-foreground" />
               </div>
               <CardTitle className="text-5xl mt-8 font-black uppercase tracking-tighter italic">Kanban Kickoff</CardTitle>
               <CardDescription className="text-xl font-bold text-foreground/60 mt-2">The core format for the "Monday-Ready" family.</CardDescription>
             </CardHeader>
             <CardContent className="px-10 pb-10 space-y-6">
               <div className="grid grid-cols-2 gap-6 text-sm">
                 <div className="p-6 bg-accent/10 rounded-none border-2 border-accent">
                    <span className="text-accent font-black block text-2xl">100%</span>
                    <span className="text-accent font-bold text-xs uppercase tracking-widest">Family Fit</span>
                 </div>
                 <div className="p-6 bg-foreground/5 rounded-none border-2 border-foreground/10">
                    <span className="text-foreground font-black block text-2xl">95/100</span>
                    <span className="text-foreground/50 font-bold text-xs uppercase tracking-widest">Maturity Index</span>
                 </div>
               </div>
             </CardContent>
             <CardFooter className="bg-foreground text-background p-6">
               <Button variant="link" className="text-background p-0 h-auto gap-2 font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                 Deep Dive Reference <ArrowRight className="h-4 w-4" />
               </Button>
             </CardFooter>
          </Card>

          {/* Quick Stats / Portfolio Snapshot */}
          <Card className="border-2 border-foreground bg-card shadow-none rounded-none flex flex-col">
            <CardHeader className="p-8 border-b-2 border-foreground bg-foreground/5">
              <CardTitle className="text-xl font-black uppercase tracking-widest italic">Portfolio</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-8 space-y-6">
              <StatRow label="Active Formats" value="12" icon={Package} />
              <StatRow label="Avg. Maturity" value="68%" icon={TrendingUp} />
              <StatRow label="In Review" value="3" icon={AlertCircle} />
              <div className="pt-6 border-t-2 border-foreground/5">
                <p className="text-[10px] text-foreground font-black uppercase tracking-widest mb-3 italic">Family Health Index</p>
                <div className="h-4 w-full bg-foreground/5 border border-foreground/10 rounded-none overflow-hidden">
                  <div className="h-full bg-accent w-[75%]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity / Red Flags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" /> Red Flags & Missing Patterns
            </h2>
            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-red-100 bg-red-50/50 flex gap-4">
                <div className="h-4 w-4 mt-1 rounded-full bg-red-500 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-red-900">Scrum Setup Studio: High Deviation</p>
                  <p className="text-xs text-red-800/70">Day-3 Outcome clarity is below family threshold. Format drifts towards educational.</p>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-yellow-100 bg-yellow-50/50 flex gap-4">
                <div className="h-4 w-4 mt-1 rounded-full bg-yellow-500 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-yellow-900">Design Sprint Kickoff: Missing Assets</p>
                  <p className="text-xs text-yellow-800/70">Infosheet template needs manual approval for client fit.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold">Recent Drafts</h2>
            <div className="space-y-3">
              {latestDrafts.map(workshop => (
                <div 
                  key={workshop.id}
                  onClick={() => onOpenWorkshop(workshop.id)}
                  className="p-4 rounded-xl border border-[#141414]/5 bg-white hover:border-[#141414]/20 cursor-pointer shadow-sm transition-all group"
                >
                  <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm font-bold text-[#141414] group-hover:underline">{workshop.name}</p>
                        <p className="text-xs text-[#141414]/50">Edited {new Date(workshop.lastModified).toLocaleDateString()}</p>
                    </div>
                    <Badge variant="secondary" className="bg-[#141414]/5 text-[#141414]/60">v{workshop.version}</Badge>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-[#141414]/60 text-xs">View Workshop Library</Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value, icon: Icon }: { label: string, value: string, icon: any }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-[#141414]/60">
        <Icon className="h-4 w-4" />
        <span className="text-sm">{label}</span>
      </div>
      <span className="font-bold text-sm">{value}</span>
    </div>
  );
}
