import Link from "next/link";
import { cn } from "@/shared/lib/utils";

type PaginationLink = Readonly<{
  label: string;
  href: string;
  isActive?: boolean;
  isDisabled?: boolean;
}>;

type PaginationProps = Readonly<{
  items: PaginationLink[];
  className?: string;
}>;

export function Pagination({ items, className }: PaginationProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Pagination" className={cn("flex flex-wrap items-center gap-2", className)}>
      {items.map((item) =>
        item.isDisabled ? (
          <span
            key={`${item.label}-${item.href}`}
            aria-disabled="true"
            className={cn(
              "rounded-[10px] border px-4 py-2 text-sm opacity-40",
              item.isActive ? "border-primary bg-primary text-white" : "border-border bg-surface text-foreground/70",
            )}
          >
            {item.label}
          </span>
        ) : (
          <Link
            key={`${item.label}-${item.href}`}
            href={item.href}
            aria-current={item.isActive ? "page" : undefined}
              className={cn(
                "rounded-[10px] border px-4 py-2 text-sm transition",
                item.isActive
                  ? "border-primary bg-primary text-white"
                  : "border-border/60 bg-surface text-foreground/70 hover:border-primary/15 hover:bg-brand-soft hover:text-primary",
              )}
          >
            {item.label}
          </Link>
        ),
      )}
    </nav>
  );
}
