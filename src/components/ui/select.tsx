import React from 'react';

interface SelectContextType {
  value: string;
  setValue: (value: string) => void;
}

const SelectContext = React.createContext<SelectContextType | null>(null);

export function Select({ value, onValueChange, children }: { value?: string; onValueChange?: (value: string) => void; children: React.ReactNode }) {
  const [internalValue, setInternalValue] = React.useState(value || '');
  const current = value ?? internalValue;
  const setValue = (next: string) => {
    if (onValueChange) onValueChange(next);
    setInternalValue(next);
  };
  return <SelectContext.Provider value={{ value: current, setValue }}>{children}</SelectContext.Provider>;
}

export function SelectTrigger({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={className}>{children}</div>;
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const ctx = React.useContext(SelectContext);
  return <span>{ctx?.value || placeholder || ''}</span>;
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = React.useContext(SelectContext);
  if (!ctx) return null;
  return <button className="block w-full text-left" onClick={() => ctx.setValue(value)}>{children}</button>;
}
