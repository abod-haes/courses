import { Reveal } from "@/shared/components/animation/reveal.component";
import type { BooksPageCopy } from "../books.types";

type BooksHeroProps = Readonly<{
  copy: BooksPageCopy;
}>;

export function BooksHero({ copy }: BooksHeroProps) {
  return (
    <Reveal preset="fadeUp" className="max-w-2xl">
      <h1 className=" text-[2rem] font-black leading-tight tracking-[-0.04em] text-foreground sm:text-[2.5rem]">
        {copy.title}
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-foreground/68 sm:text-[0.95rem]">
        {copy.subtitle}
      </p>
    </Reveal>
  );
}
