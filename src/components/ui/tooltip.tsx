import React from 'react';

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function Tooltip({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function TooltipTrigger({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props}>{children}</button>;
}

export function TooltipContent({ children }: { children: React.ReactNode; side?: 'left' | 'right' | 'top' | 'bottom' }) {
  return <span className="sr-only">{children}</span>;
}
