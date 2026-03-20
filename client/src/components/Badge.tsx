import * as React from "react";
import { cn } from "../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'tonal' | 'outline';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'tonal', ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-on-primary',
      secondary: 'bg-secondary text-on-secondary',
      tonal: 'bg-surface-container-high text-on-surface-variant',
      outline: 'border border-outline-variant text-on-surface-variant',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge };
