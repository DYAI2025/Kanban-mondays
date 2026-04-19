import React from 'react';
import { cn } from '@/lib/utils';

export function Progress({ value = 0, className }: { value?: number; className?: string }) {
  return (
    <div className={cn('h-2 w-full bg-muted overflow-hidden', className)}>
      <div className="h-full bg-accent transition-all" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
