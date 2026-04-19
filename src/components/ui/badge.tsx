import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | string;
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variantClass = variant === 'outline'
    ? 'border'
    : variant === 'secondary'
      ? 'bg-secondary text-secondary-foreground'
      : 'bg-primary text-primary-foreground';

  return <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold', variantClass, className)} {...props} />;
}
