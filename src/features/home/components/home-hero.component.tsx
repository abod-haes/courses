/* eslint-disable @next/next/no-img-element */
import { BookOpen, Shield, Sparkles } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Reveal } from "@/shared/components/animation/reveal.component";
import type { HomeMessages } from "../home.types";
import { HomeHeroVisual } from "./home-hero-visual.component";

type HomeHeroProps = Readonly<{
  copy: HomeMessages;
}>;

export function HomeHero({ copy }: HomeHeroProps) {
  return (
    <section className="relative overflow-hidden bg-section-bg py-10 dark:bg-[#07111f] lg:py-14">
      <div className="pointer-events-none absolute inset-0">
        <img
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-[0.16] mix-blend-multiply dark:opacity-[0.08] dark:mix-blend-normal"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOiocdoc9hqyEo9Sw8iIvDYmOVuQRcnvqe2eFkBEohZqAxId4Y0UdGtDEmiX5WagyVgYyrO-zA5sddVlof2LlVX-HB_rDvNH3J7vZvIbwl3L2uUyxbzv9NLfhDLBHnYzoMQHe265Xv7H_oAPVsf62L7D0A4oss2x08Aqvu6eR1qK5tiHjPtivjqWSlFbkLATvg21qwH39TiBuF0mknu2Y3PrOp0lsk0LWvdRKw9Cvwg2-dTJBUmjERReqHAQ5oQ4y_2b0OWf1ShIU"
        />
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary-soft/70 blur-3xl dark:bg-primary-soft/26" />
        <div className="absolute left-0 top-24 h-64 w-64 rounded-full bg-white blur-3xl dark:bg-primary/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(29,23,213,0.12),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(148,163,184,0.05),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(29,23,213,0.2),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.04),transparent_30%)]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="space-y-5">
          <Reveal className="inline-flex items-center rounded-[10px] border border-border/60 bg-surface px-3 py-2 text-xs font-medium text-primary ">
            <Shield className="mr-1.5 h-4 w-4" aria-hidden="true" />
            {copy.hero.badge}
          </Reveal>

          <Reveal preset="fadeUp">
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem] lg:leading-[1.05]">{copy.hero.title}</h1>
          </Reveal>

          <Reveal preset="fadeUp">
            <p className="max-w-lg text-base leading-7 text-foreground/70 sm:text-lg">{copy.hero.subtitle}</p>
          </Reveal>

          <Reveal preset="fadeUp">
            <div className="flex flex-wrap gap-4 pt-2">
              <Button href="#courses" variant="primary">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                {copy.actions.browseCourses}
              </Button>
              <Button href="#books" variant="secondary">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                {copy.actions.exploreBooks}
              </Button>
            </div>
          </Reveal>


        </div>

        <Reveal preset="softScale">
          <HomeHeroVisual />
        </Reveal>
      </div>
    </section>
  );
}
