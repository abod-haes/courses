import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

type AlertVariant = "info" | "success" | "warning" | "danger";

type AlertProps = Readonly<{
  title?: string;
  children: ReactNode;
  variant?: AlertVariant;
  className?: string;
}>;

const variants: Record<AlertVariant, string> = {
  info: "border-border/60 bg-brand-soft text-foreground",
  success: "border-primary/15 bg-primary/8 text-foreground",
  warning: "border-warning/20 bg-warning/10 text-foreground",
  danger: "border-danger/20 bg-danger/10 text-foreground",
};

export function Alert({ title, children, variant = "info", className }: AlertProps) {
  return (
    <div className={cn("rounded-[16px] border p-4", variants[variant], className)}>
      {title ? <p className="mb-1 font-semibold">{title}</p> : null}
      <div className="text-sm leading-6 text-foreground/80">{children}</div>
    </div>
  );
}
