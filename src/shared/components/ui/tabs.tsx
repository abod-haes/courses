"use client";

import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

type TabItem = Readonly<{
  value: string;
  label: string;
  content: ReactNode;
}>;

type TabsProps = Readonly<{
  items: TabItem[];
  value: string;
  onValueChange: (value: string) => void;
}>;

export function Tabs({ items, value, onValueChange }: TabsProps) {
  const active = items.find((item) => item.value === value) ?? items[0];

  return (
    <div className="space-y-4">
      <div role="tablist" aria-label="Tabs" className="flex flex-wrap gap-2 rounded-[14px] bg-surface-soft p-1">
        {items.map((item) => {
          const selected = item.value === active?.value;

          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onValueChange(item.value)}
              className={cn(
                "rounded-[10px] px-4 py-2 text-sm font-medium transition",
                selected ? "bg-surface text-foreground shadow-sm" : "text-foreground/70 hover:bg-brand-soft hover:text-primary",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div role="tabpanel">{active?.content}</div>
    </div>
  );
}
