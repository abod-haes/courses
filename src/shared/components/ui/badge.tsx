import { cn } from "@/shared/lib/utils";

type BadgeVariant = "brand" | "success" | "warning" | "danger" | "neutral";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variants: Record<BadgeVariant, string> = {
  brand: "bg-brand-soft text-primary dark:text-brand",
  success: "bg-primary/8 text-primary dark:bg-primary/16 dark:text-primary-strong",
  warning: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  danger: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  neutral: "bg-surface-soft text-foreground/75 dark:bg-surface-soft dark:text-foreground/80",
};

export function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[10px] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
