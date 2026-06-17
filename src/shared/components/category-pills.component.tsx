import Link from "next/link";
import { cn } from "@/shared/lib/utils";

export type CategoryPillItem = Readonly<{
  key: string;
  label: string;
  href?: string;
}>;

type CategoryPillsProps = Readonly<{
  items: readonly CategoryPillItem[];
  activeKey?: string;
  ariaLabel?: string;
  onSelect?: (key: string) => void;
}>;

export function CategoryPills({ items, activeKey, ariaLabel, onSelect }: CategoryPillsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label={ariaLabel}>
      {items.map((item) => {
        const isActive = activeKey === item.key;
        const baseClasses =
          "rounded-full px-4 py-2 !text-sm !leading-none font-bold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";
        const activeClasses = "bg-primary text-white shadow-[0_8px_18px_rgba(29,23,213,0.16)]";
        const inactiveClasses = "border border-border bg-surface text-foreground/72 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary/5 hover:text-primary";

        if (item.href) {
          return (
            <Link key={item.key} href={item.href} className={cn(baseClasses, isActive ? activeClasses : inactiveClasses)}>
              {item.label}
            </Link>
          );
        }

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onSelect?.(item.key)}
            className={cn(baseClasses, isActive ? activeClasses : inactiveClasses)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
