import React from 'react';
import { 
  Home, 
  BookOpen, 
  Library, 
  Wrench, 
  ArrowLeftRight, 
  FileText, 
  Map, 
  Settings,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type PageId = 'home' | 'reference' | 'library' | 'build' | 'compare' | 'assets' | 'portfolio' | 'admin';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'reference', label: 'Reference Model', icon: BookOpen },
  { id: 'library', label: 'Workshop Library', icon: Library },
  { id: 'build', label: 'Build Studio', icon: Wrench },
  { id: 'compare', label: 'Compare Lab', icon: ArrowLeftRight },
  { id: 'assets', label: 'Asset Studio', icon: FileText },
  { id: 'portfolio', label: 'Portfolio Map', icon: Map },
  { id: 'admin', label: 'Admin / Logic', icon: Settings },
];

interface LayoutProps {
  currentPage: PageId;
  onPageChange: (page: PageId) => void;
  children: React.ReactNode;
}

export default function Layout({ currentPage, onPageChange, children }: LayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden border border-border">
        {/* Sidebar */}
        <aside 
          className={cn(
            "relative flex flex-col border-r-2 border-border bg-card transition-all duration-300 z-30",
            isSidebarCollapsed ? "w-[64px]" : "w-[240px]"
          )}
        >
          {/* Logo / Header */}
          <div className="p-6 flex items-center justify-between border-b-2 border-border h-[80px]">
            {!isSidebarCollapsed && (
              <div className="flex flex-col">
                <h1 className="text-lg font-black tracking-tighter uppercase leading-none">Studio_V1</h1>
                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">PRODUCT_ARCHITECT</span>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="ml-auto h-8 w-8 text-foreground/50 hover:text-foreground hover:bg-transparent"
            >
              {isSidebarCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-0 py-4">
            <nav className="space-y-0">
              {NAV_ITEMS.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger
                      onClick={() => onPageChange(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-6 py-4 text-xs font-black uppercase tracking-widest transition-all border-b border-border/5 text-left",
                        isActive 
                          ? "bg-background text-foreground border-r-4 border-accent" 
                          : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                      )}
                    >
                      <item.icon className={cn("shrink-0", isSidebarCollapsed ? "h-5 w-5" : "h-4 w-4", isActive && "text-accent")} />
                      {!isSidebarCollapsed && <span className={cn(isActive && "text-foreground")}>{item.label}</span>}
                    </TooltipTrigger>
                    {isSidebarCollapsed && (
                      <TooltipContent side="right">
                        {item.label}
                      </TooltipContent>
                    )}
                  </Tooltip>
                );
              })}
            </nav>
          </ScrollArea>

          {/* User / Footer */}
          <div className="p-6 border-t-2 border-border bg-background/50">
            <div className={cn(
              "flex items-center gap-3 transition-all",
              isSidebarCollapsed ? "justify-center" : "justify-start"
            )}>
              <div className="w-8 h-8 rounded-none border-2 border-border bg-accent text-accent-foreground flex items-center justify-center text-xs font-black">
                BP
              </div>
              {!isSidebarCollapsed && (
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[10px] font-black uppercase tracking-widest leading-none">Ben_P</span>
                  <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-tight mt-0.5">V1_DESIGN_LEAD</span>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-background">
          {children}
        </main>
      </div>
    </TooltipProvider>
  );
}
