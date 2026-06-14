import { forwardRef } from "react";
import { cn } from "@/shared/lib/utils";

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-28 w-full rounded-[10px] border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-foreground/40 focus:border-primary/50 focus:bg-white focus:ring-2 focus:ring-primary/20",
          className,
        )}
        {...props}
      />
    );
  },
);
