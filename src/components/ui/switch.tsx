import React from 'react';
import { cn } from '@/lib/utils';

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export function Switch({ className, checked, onCheckedChange, ...props }: SwitchProps) {
  return (
    <input
      type="checkbox"
      className={cn('h-4 w-4 accent-accent', className)}
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      {...props}
    />
  );
}
