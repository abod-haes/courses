import { CheckCircle2, Clock3, FileText, MonitorPlay, Smartphone } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import type { CourseDetailCopy, CourseItemView } from "../courses.types";

type CoursePurchasePanelProps = Readonly<{
  course: CourseItemView;
  copy: CourseDetailCopy;
}>;

export function CoursePurchasePanel({ course, copy }: CoursePurchasePanelProps) {
  const fallbackIncludes = [
    `${course.hours} hours of on-demand video`,
    `${course.lessons} comprehensive articles`,
    "10 interactive clinical cases",
    "Full lifetime access",
    "Access on mobile and TV",
  ];
  const includes = course.includes.length > 0 ? course.includes : fallbackIncludes;
  const icons = [MonitorPlay, FileText, CheckCircle2, Clock3, Smartphone];

  return (
    <Card className="rounded-[12px] bg-surface p-5 shadow-[0_10px_30px_rgba(17,24,39,0.08)]">
      <div className="text-center">
        <p className="text-[0.72rem] font-semibold text-foreground/50">{copy.purchaseLabel}</p>
        <p className="mt-1 text-[1.9rem] font-black tracking-[-0.04em] text-foreground">{course.price}</p>
      </div>

      <div className="mt-5 border-t border-border/70 pt-5">
        <button type="button" className="inline-flex w-full items-center justify-center rounded-[7px] bg-primary px-4 py-3 text-xs font-bold text-white transition hover:bg-primary-strong">
          {copy.addToCart}
        </button>
        <p className="mt-4 text-center text-[0.74rem] leading-5 text-foreground/55">{copy.unlockNote}</p>
      </div>

      <div className="mt-5 border-t border-border/70 pt-5">
        <h3 className="text-[0.8rem] font-black text-foreground">{copy.includesTitle}</h3>
        <ul className="mt-3 space-y-2.5">
          {includes.map((item, index) => {
            const Icon = icons[index] ?? CheckCircle2;

            return (
              <li key={item} className="flex items-start gap-2 text-[0.78rem] leading-5 text-foreground/66">
                <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                <span>{item}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
}
