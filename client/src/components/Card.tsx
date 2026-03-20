import * as React from "react";
import { cn } from "../lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'surface' | 'tonal' | 'elevated';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'surface', ...props }, ref) => {
    const variants = {
      surface: 'bg-surface-container-low',
      tonal: 'bg-surface-container-high',
      elevated: 'bg-surface shadow-md',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-3xl p-6 transition-all duration-300',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

const GlassPanel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'glass-panel rounded-3xl p-6 border border-white/20',
          className
        )}
        {...props}
      />
    );
  }
);
GlassPanel.displayName = "GlassPanel";

export { Card, GlassPanel };
