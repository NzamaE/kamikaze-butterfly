import * as React from "react";
import { cn } from "../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'tonal';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-on-primary hover:bg-primary/90',
      secondary: 'bg-secondary text-on-secondary hover:bg-secondary/90',
      outline: 'border border-outline bg-transparent hover:bg-surface-container-low text-on-surface',
      ghost: 'bg-transparent hover:bg-surface-container-low text-on-surface',
      tonal: 'bg-primary-container text-on-primary-container hover:bg-primary-container/80',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-lg',
      md: 'px-6 py-3 text-base rounded-xl font-medium tracking-wide',
      lg: 'px-8 py-4 text-lg rounded-2xl font-semibold tracking-wider',
      icon: 'p-2 rounded-full',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
