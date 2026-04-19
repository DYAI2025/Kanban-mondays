import React from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'default' | 'outline' | 'ghost' | 'link' | 'secondary';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

const variantStyles: Record<ButtonVariant, string> = {
  default: 'bg-primary text-primary-foreground',
  outline: 'border border-input bg-background',
  ghost: 'bg-transparent',
  link: 'bg-transparent underline-offset-4 hover:underline',
  secondary: 'bg-secondary text-secondary-foreground'
};

const sizeStyles: Record<ButtonSize, string> = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 px-3',
  lg: 'h-11 px-8',
  icon: 'h-10 w-10'
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn('inline-flex items-center justify-center gap-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50', variantStyles[variant], sizeStyles[size], className)}
      {...props}
    />
  )
);
Button.displayName = 'Button';
