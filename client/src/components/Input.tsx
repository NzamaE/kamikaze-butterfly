import * as React from "react";
import { cn } from "../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant ml-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full bg-surface-container-low border border-transparent rounded-xl px-4 py-3 text-on-surface transition-all focus:bg-surface-container focus:border-primary/20 focus:ring-2 focus:ring-primary/5 outline-none placeholder:text-outline-variant',
            error && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/5',
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant ml-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          rows={4}
          className={cn(
            'w-full bg-surface-container-low border border-transparent rounded-xl px-4 py-3 text-on-surface transition-all focus:bg-surface-container focus:border-primary/20 focus:ring-2 focus:ring-primary/5 outline-none placeholder:text-outline-variant resize-none',
            error && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/5',
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Input, Textarea };
