import { forwardRef } from "react";
import { cn } from "@/shared/lib/utils";

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={cn(
          "h-12 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground outline-none transition focus:border-primary/50 focus:bg-white focus:ring-2 focus:ring-primary/20",
          className,
        )}
        {...props}
      >
        {children}
      </select>
    );
  },
);
