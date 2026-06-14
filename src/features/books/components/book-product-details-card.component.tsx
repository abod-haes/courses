import { Card } from "@/shared/components/ui/card";
import type { BookItemView } from "../books.types";

type BookProductDetailsCardProps = Readonly<{
  title: string;
  details: BookItemView["details"]["productDetails"];
}>;

export function BookProductDetailsCard({ title, details }: BookProductDetailsCardProps) {
  return (
    <Card className="rounded-[8px] bg-surface p-5 shadow-[0_10px_28px_rgba(17,24,39,0.05)]">
      <h2 className="text-sm font-black text-foreground">{title}</h2>

      <dl className="mt-5 divide-y divide-border/70">
        {details.map((detail) => (
          <div key={detail.label} className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-4 py-3 first:pt-0 last:pb-0">
            <dt className="text-[0.72rem] font-bold text-foreground/52">{detail.label}</dt>
            <dd className="text-end text-[0.72rem] font-black text-foreground/82">{detail.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
