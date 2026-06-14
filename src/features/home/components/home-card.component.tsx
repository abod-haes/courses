/* eslint-disable @next/next/no-img-element */
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import type { HomeCatalogItem, HomeMessages, HomeSectionKey } from "../home.types";

type HomeCardProps = Readonly<{
  item: HomeCatalogItem;
  section: HomeSectionKey;
  copy: HomeMessages;
}>;

const sectionAccents: Record<HomeSectionKey, string> = {
  courses: "from-primary/8 via-transparent to-transparent",
  books: "from-primary/6 via-transparent to-transparent",
  articles: "from-slate-900/6 via-transparent to-transparent",
};

export function HomeCard({ item, section, copy }: HomeCardProps) {
  const actionLabel =
    section === "articles" ? copy.actions.readArticle : section === "books" ? copy.actions.viewDetails : copy.actions.startCourse;

  return (
    <Card className="group flex h-full flex-col overflow-hidden">
      <div className="p-4 pb-0">
        <div className="relative overflow-hidden rounded-[12px] border border-border/60 bg-surface-soft">
          <div className={`absolute inset-0 bg-gradient-to-br ${sectionAccents[section]}`} />
          <img
            alt={item.alt}
            src={item.image}
            className="relative h-[180px] w-full object-cover transition duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none sm:h-[200px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/24 via-transparent to-transparent" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/55 to-transparent" />

        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-4 sm:px-6 sm:pb-6 justify-between">
        <div className="min-w-0">
          <h3 className="text-[1.02rem] font-semibold leading-7 tracking-tight text-foreground sm:text-[1.05rem]">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-foreground/70">{item.description ?? item.author}</p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-[8px] border border-border/60 bg-surface-soft px-3 py-1 text-[11px] font-medium text-foreground/68">
            {item.author}
          </span>
          {item.modules > 0 ? (
            <span className="inline-flex items-center rounded-[8px] border border-primary/10 bg-primary/5 px-3 py-1 text-[11px] font-semibold text-primary">
              {item.modules} {copy.cards.modulesLabel}
            </span>
          ) : null}
        </div>

        <div className="mt-5">
          <Button href={item.href} variant="primary" size="sm" className="w-full">
            {actionLabel}
          </Button>
        </div>
      </div>
    </Card>
  );
}
