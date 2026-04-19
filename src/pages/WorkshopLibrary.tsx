import React, { useState } from 'react';
import { Search, Filter, LayoutGrid, List, MoreVertical, ExternalLink, FileSearch, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Workshop } from '@/types';
import { cn } from '@/lib/utils';
import { REFERENCE_WORKSHOP } from '@/constants';
import { summarizeContent } from '@/services/geminiService';

interface WorkshopLibraryProps {
  workshops: Workshop[];
  onOpenWorkshop: (id: string) => void;
}

export default function WorkshopLibrary({ workshops, onOpenWorkshop }: WorkshopLibraryProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [summarizingId, setSummarizingId] = useState<string | null>(null);
  const [summaries, setSummaries] = useState<Record<string, string>>({});

  const handleSummarize = async (e: React.MouseEvent, workshop: Workshop) => {
    e.stopPropagation();
    if (summaries[workshop.id]) {
      // Toggle off if already showing? Or just leave it.
      return;
    }
    
    setSummarizingId(workshop.id);
    const content = `Name: ${workshop.name}\nSummary: ${workshop.summary}\nRole: ${workshop.role}\nStatus: ${workshop.status}\nOutcome: ${JSON.stringify(workshop.day3Outcome)}`;
    const result = await summarizeContent(content, 'workshop');
    setSummaries(prev => ({ ...prev, [workshop.id]: result }));
    setSummarizingId(null);
  };

  const filteredWorkshops = workshops.filter(w => 
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background">
      {/* Header */}
      <header className="p-12 border-b-2 border-border space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-6xl font-black tracking-tighter uppercase italic">Workshop<br />Library</h1>
            <p className="text-xl text-foreground/50 font-bold italic">Browse and manage framework formats.</p>
          </div>
          <div className="flex items-center gap-0 border-2 border-foreground bg-card overflow-hidden">
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setViewMode('grid')}
                className={cn("h-12 px-6 rounded-none font-black uppercase tracking-widest transition-all", viewMode === 'grid' ? "bg-foreground text-background" : "hover:bg-foreground/5")}
            >
              <LayoutGrid className="h-4 w-4 mr-2" /> Grid
            </Button>
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setViewMode('list')}
                className={cn("h-12 px-6 rounded-none font-black uppercase tracking-widest transition-all", viewMode === 'list' ? "bg-foreground text-background" : "hover:bg-foreground/5")}
            >
              <List className="h-4 w-4 mr-2" /> List
            </Button>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40" />
            <Input 
              placeholder="Search by name, summary or role..." 
              className="pl-12 h-14 border-2 border-foreground bg-card rounded-none font-bold placeholder:text-foreground/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-14 px-8 border-2 border-foreground rounded-none font-black uppercase tracking-widest gap-2 bg-card hover:bg-foreground/5">
            <Filter className="h-4 w-4 text-accent" /> Filters
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkshops.map(workshop => (
              <WorkshopCard 
                key={workshop.id} 
                workshop={workshop} 
                onClick={() => onOpenWorkshop(workshop.id)}
                isSummarizing={summarizingId === workshop.id}
                summary={summaries[workshop.id]}
                onSummarize={(e) => handleSummarize(e, workshop)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#141414]/10 overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-[#141414]/5 border-b border-[#141414]/10 uppercase text-[10px] font-bold tracking-widest text-[#141414]/40">
                <tr>
                  <th className="px-6 py-4">Workshop Name</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Maturity</th>
                  <th className="px-6 py-4">Family Fit</th>
                  <th className="px-6 py-4">Last Modified</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141414]/5">
                {filteredWorkshops.map(workshop => (
                   <tr key={workshop.id} className="hover:bg-[#141414]/[0.02] cursor-pointer group" onClick={() => onOpenWorkshop(workshop.id)}>
                     <td className="px-6 py-4">
                       <div className="flex flex-col">
                         <span className="font-bold text-[#141414]">{workshop.name}</span>
                         <span className="text-xs text-[#141414]/50 truncate max-w-[200px]">{workshop.summary}</span>
                       </div>
                     </td>
                     <td className="px-6 py-4">
                       <StatusBadge status={workshop.status} />
                     </td>
                     <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                         <div className="h-1.5 w-12 bg-[#141414]/5 rounded-full overflow-hidden">
                           <div className="h-full bg-[#141414]/80 rounded-full" style={{ width: `${workshop.maturityScores.overallScore}%` }} />
                         </div>
                         <span className="text-xs font-mono">{workshop.maturityScores.overallScore}</span>
                       </div>
                     </td>
                     <td className="px-6 py-4">
                       <span className={cn(
                         "text-xs font-bold",
                         workshop.maturityScores.familyFitScore >= 90 ? "text-green-600" : "text-yellow-600"
                        )}>{workshop.maturityScores.familyFitScore}%</span>
                     </td>
                     <td className="px-6 py-4 text-[#141414]/50 font-mono text-xs">
                       {new Date(workshop.lastModified).toLocaleDateString()}
                     </td>
                     <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <Button 
                               variant="outline" 
                               size="sm" 
                               onClick={(e) => handleSummarize(e, workshop)}
                               disabled={summarizingId === workshop.id}
                               className={cn(
                                   "h-8 px-3 rounded-none font-black text-[10px] uppercase tracking-widest border-2 border-foreground transition-all",
                                   summaries[workshop.id] ? "bg-accent/10 border-accent text-accent" : "hover:bg-foreground hover:text-background"
                               )}
                           >
                               {summarizingId === workshop.id ? '...' : summaries[workshop.id] ? 'Summary Ready' : 'Quick Summary'}
                           </Button>
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-[#141414]/30 group-hover:text-[#141414]">
                             <MoreVertical className="h-4 w-4" />
                           </Button>
                       </div>
                     </td>
                   </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function WorkshopCard({ 
    workshop, 
    onClick, 
    isSummarizing, 
    summary, 
    onSummarize 
}: { 
    workshop: Workshop, 
    onClick: () => void,
    isSummarizing?: boolean,
    summary?: string,
    onSummarize?: (e: React.MouseEvent) => void
}) {
  const isReference = workshop.id === REFERENCE_WORKSHOP.id;
  
  return (
    <Card 
      className={cn(
        "border-2 border-card-foreground bg-card hover:border-accent cursor-pointer transition-all shadow-none rounded-none flex flex-col overflow-hidden relative group",
        isReference && "border-4"
      )}
      onClick={onClick}
    >
      {isReference ? (
        <div className="absolute top-0 right-0 z-10">
          <Badge className="bg-accent text-accent-foreground text-[10px] font-black tracking-widest uppercase rounded-none px-2 py-1">REFERENCE</Badge>
        </div>
      ) : (
          <div className="absolute top-0 right-0 z-10">
            <span className="bg-foreground text-background text-[10px] font-black px-2 py-1 uppercase tracking-tighter">v{workshop.version}</span>
          </div>
      )}
      <CardHeader className="p-8 space-y-4 border-b-2 border-foreground/5 bg-background/50">
        <div className="flex justify-between items-start">
            <StatusBadge status={workshop.status} />
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={onSummarize}
                disabled={isSummarizing}
                className={cn(
                    "h-6 px-2 rounded-none font-black text-[9px] uppercase tracking-widest border border-foreground/10 hover:bg-accent hover:text-white hover:border-accent",
                    summary ? "hidden" : "block"
                )}
            >
                {isSummarizing ? '...' : 'Quick Summary'}
            </Button>
        </div>
        <CardTitle className="text-3xl font-black uppercase tracking-tighter italic group-hover:text-accent transition-colors">{workshop.name}</CardTitle>
        <CardDescription className="line-clamp-2 text-sm font-bold text-foreground/50 h-10 leading-snug italic">{workshop.summary || 'No description provided.'}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-8 space-y-6">
        {summary ? (
            <div className="p-4 bg-accent/5 border-l-4 border-accent space-y-2 animate-in slide-in-from-top-2 duration-500">
                <p className="text-[9px] font-black uppercase tracking-widest text-accent flex items-center gap-2 italic">
                    <Sparkles className="h-3 w-3" /> AI_Summary
                </p>
                <p className="text-[11px] font-bold text-foreground leading-tight italic line-clamp-4">
                    {summary}
                </p>
            </div>
        ) : (
            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-foreground uppercase tracking-widest">Maturity Score</span>
                        <span className="text-sm font-mono font-black">{workshop.maturityScores.overallScore}%</span>
                    </div>
                    <div className="h-3 w-full bg-foreground/5 border-2 border-foreground/5 overflow-hidden">
                        <div 
                            className="h-full bg-accent transition-all duration-500" 
                            style={{ width: `${workshop.maturityScores.overallScore}%` }} 
                        />
                    </div>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline" className="border-2 border-foreground rounded-none text-[10px] font-black uppercase tracking-widest text-foreground bg-background px-2 py-1">
                        {workshop.role}
                    </Badge>
                    <Badge variant="outline" className={cn(
                        "border-none rounded-none text-[10px] font-black uppercase tracking-widest px-2 py-1",
                        workshop.maturityScores.familyFitScore >= 90 ? "bg-accent/10 text-accent" : "bg-foreground/5 text-foreground/40"
                    )}>
                    {workshop.maturityScores.familyFitScore}% Fit
                    </Badge>
                </div>
            </div>
        )}
      </CardContent>
      <CardFooter className="p-0 border-t-2 border-foreground/5 group-hover:bg-foreground group-hover:text-background transition-all">
        <Button variant="ghost" className="w-full h-14 rounded-none text-xs font-black uppercase tracking-widest gap-2 bg-transparent hover:bg-transparent">
          Launch in Studio_V1 <ExternalLink className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function StatusBadge({ status }: { status: Workshop['status'] }) {
  const labels = {
    draft: 'Draft',
    internal_review: 'Review',
    internal_approved: 'Approved',
    sales_ready: 'Sales Ready',
    published: 'Published'
  };
  
  const colors = {
    draft: 'bg-zinc-100 text-zinc-600',
    internal_review: 'bg-blue-100/50 text-blue-700 font-bold',
    internal_approved: 'bg-emerald-100/50 text-emerald-700 font-bold',
    sales_ready: 'bg-[#141414] text-white',
    published: 'bg-green-100/50 text-green-700 font-bold'
  };

  return (
    <Badge className={cn("text-[8px] h-4 rounded-full border-none px-1.5 uppercase font-black tracking-widest", colors[status])}>
      {labels[status]}
    </Badge>
  );
}
