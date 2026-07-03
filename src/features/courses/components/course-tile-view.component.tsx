import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ChevronRight, PlayCircle } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import type { CourseItemView } from "../courses.types";

type CourseTileViewProps = Readonly<{
  course: CourseItemView;
  viewDetailsLabel: string;
  isPurchased?: boolean;
  purchasedLabel?: string;
  continueLabel?: string;
}>;

export function CourseTileView({ course, viewDetailsLabel, isPurchased = false, purchasedLabel = "Purchased", continueLabel = "Continue" }: CourseTileViewProps) {
  const actionHref = isPurchased ? `/learn/courses/${course.id}` : course.href;
  const actionLabel = isPurchased ? continueLabel : viewDetailsLabel;

  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-[10px] bg-surface shadow-[0_7px_20px_rgba(17,24,39,0.05)] hover:-translate-y-1 hover:border-primary/15 hover:shadow-[0_18px_40px_rgba(29,23,213,0.10)]">
      <div className="relative h-[10.7rem] overflow-hidden bg-surface-soft">
        <Image
          src={course.image}
          alt={course.imageAlt}
          fill
          sizes="(max-width: 640px) 92vw, (max-width: 1280px) 42vw, 300px"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/86 px-2.5 py-1 text-[0.62rem] font-black text-primary shadow-[0_6px_14px_rgba(17,24,39,0.10)] backdrop-blur rtl:left-auto rtl:right-3">
          {course.category}
        </span>
        {isPurchased ? (
          <span className="absolute bottom-3 start-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-2.5 py-1 text-[0.62rem] font-black text-white shadow-[0_8px_18px_rgba(16,185,129,0.28)]">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            {purchasedLabel}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-4">
        <div className="min-w-0 flex-1">
          <h2 className="line-clamp-1 text-[0.95rem] font-black leading-5 tracking-[-0.01em] text-foreground">
            {course.title}
          </h2>
          <p className="mt-1 text-[0.72rem] font-medium text-foreground/58">{course.instructor}</p>
          <p className="mt-3 line-clamp-2 text-[0.78rem] leading-5 text-foreground/68">{course.description}</p>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="text-[1rem] font-black text-primary">{isPurchased ? purchasedLabel : course.price}</p>
          <Link href={actionHref} className={`inline-flex items-center gap-1.5 rounded-[7px] px-4 py-2 text-[0.72rem] font-bold transition duration-200 ${isPurchased ? "bg-primary text-white hover:bg-primary-strong" : "bg-primary/6 text-primary hover:bg-primary hover:text-white"}`}>
            {isPurchased ? <PlayCircle className="h-3.5 w-3.5" aria-hidden="true" /> : null}
            {actionLabel}
            {!isPurchased ? <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" /> : null}
          </Link>
        </div>
      </div>
    </Card>
  );
}
