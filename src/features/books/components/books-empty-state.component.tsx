import { Reveal } from "@/shared/components/animation/reveal.component";

type BooksEmptyStateProps = Readonly<{
  title: string;
  description: string;
}>;

export function BooksEmptyState({ title, description }: BooksEmptyStateProps) {
  return (
    <Reveal
      preset="softScale"
      className="mt-7 rounded-[12px] border border-dashed border-border bg-surface p-10 text-center shadow-[0_8px_24px_rgba(17,24,39,0.04)]"
    >
      <h2 className="text-lg font-black text-foreground">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-foreground/60">
        {description}
      </p>
    </Reveal>
  );
}
