import { Reveal } from "@/shared/components/animation/reveal.component";
import type { CoursesPageCopy } from "../courses.types";

type CoursesHeroProps = Readonly<{
  copy: CoursesPageCopy;
}>;

export function CoursesHero({ copy }: CoursesHeroProps) {
  return (
    <Reveal preset="fadeUp" className="max-w-2xl">
      <h1 className="text-[1.65rem] font-black leading-tight tracking-[-0.035em] text-foreground sm:text-[2.1rem] lg:text-[2.25rem]">
        {copy.title}
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-foreground/68 sm:text-[0.95rem]">
        {copy.subtitle}
      </p>
    </Reveal>
  );
}