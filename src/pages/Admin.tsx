import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Settings, Shield, Wrench, Database, Key, Globe, Zap, Scale } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Admin() {
  return (
    <div className="flex-1 overflow-y-auto bg-[#FDFCFB] p-12">
      <div className="max-w-4xl mx-auto space-y-12 pb-20">
        <header className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">System Admin</h1>
            <p className="text-[#141414]/50">Manage global produkt logic, scoring weights and AI prompt boundaries.</p>
        </header>

        <section className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#141414]/30 flex items-center gap-2">
                <Shield className="h-4 w-4" /> Family Governance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AdminCard 
                    title="Maturity Weights" 
                    description="Adjust how much each category influences the overall score."
                    icon={Scale}
                />
                <AdminCard 
                    title="Audit Rules" 
                    description="Manage automated red-flag triggers for family fit."
                    icon={Wrench}
                />
            </div>
        </section>

        <section className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#141414]/30 flex items-center gap-2">
                <Database className="h-4 w-4" /> Global Logic Settings
            </h3>
            <Card className="border-[#141414]/10 bg-white shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <div className="divide-y divide-[#141414]/5">
                        <SettingRow 
                            label="AI Deep Analysis" 
                            description="Enable semantic drift analysis for all drafts."
                            enabled
                        />
                        <SettingRow 
                            label="Auto-Asset Generation" 
                            description="Automatically draft infosheets when maturity > 80%."
                        />
                        <SettingRow 
                            label="Strict Reference Checks" 
                            description="Prevent internal publishing if divergence is high."
                            enabled
                        />
                    </div>
                </CardContent>
            </Card>
        </section>

        <section className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#141414]/30 flex items-center gap-2">
                <Key className="h-4 w-4" /> Integrations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <IntegrationCard name="Gemini AI" status="Connected" icon={Zap} />
                <IntegrationCard name="Notion Docs" status="Pending" />
                <IntegrationCard name="CRM Sync" status="Inactive" />
            </div>
        </section>

        <section className="pt-12 border-t border-[#141414]/5">
            <p className="text-[10px] text-[#141414]/30 font-mono text-center">
                STUDIO CORE v1.0.4-STABLE / BUILD 2026-04-19
            </p>
        </section>
      </div>
    </div>
  );
}

function AdminCard({ title, description, icon: Icon }: any) {
    return (
        <Card className="border-[#141414]/10 bg-white hover:border-[#141414]/30 transition-all cursor-pointer shadow-sm">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <div className="w-10 h-10 rounded-xl bg-[#141414]/5 flex items-center justify-center">
                    {Icon && <Icon className="h-5 w-5 text-[#141414]/60" />}
                </div>
                <div className="space-y-1">
                    <CardTitle className="text-sm font-bold">{title}</CardTitle>
                    <CardDescription className="text-xs">{description}</CardDescription>
                </div>
            </CardHeader>
        </Card>
    );
}

function SettingRow({ label, description, enabled }: { label: string, description: string, enabled?: boolean }) {
    return (
        <div className="p-6 flex items-center justify-between group hover:bg-[#141414]/[0.01]">
            <div className="space-y-1">
                <Label className="text-sm font-bold">{label}</Label>
                <p className="text-xs text-[#141414]/40">{description}</p>
            </div>
            <Switch defaultChecked={enabled} />
        </div>
    );
}

function IntegrationCard({ name, status, icon: Icon }: { name: string, status: string, icon?: any }) {
    return (
        <div className="p-4 rounded-xl border border-[#141414]/10 bg-white flex flex-col gap-4">
            <div className="flex justify-between items-start">
               {Icon ? <Icon className="h-4 w-4 text-purple-500" /> : <Globe className="h-4 w-4 text-[#141414]/20" />}
               <Badge variant="outline" className={cn(
                   "text-[9px] font-bold border-none px-1.5",
                   status === 'Connected' ? "bg-green-100/50 text-green-700" : "bg-[#141414]/5 text-[#141414]/40"
               )}>{status}</Badge>
            </div>
            <span className="text-xs font-bold">{name}</span>
        </div>
    );
}
