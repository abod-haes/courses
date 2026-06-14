import { StaggerList } from "@/shared/components/animation/stagger-list.component";

type HomeTrustStripProps = Readonly<{
  items: string[];
}>;

export function HomeTrustStrip({ items }: HomeTrustStripProps) {
  return (
    <StaggerList className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item}
          className="rounded-[14px] border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground/75 shadow-sm backdrop-blur"
        >
          {item}
        </div>
      ))}
    </StaggerList>
  );
}
