import React from 'react';
import { cn } from '@/lib/utils';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn('min-h-20 w-full border border-input bg-background px-3 py-2 text-sm outline-none', className)}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';
