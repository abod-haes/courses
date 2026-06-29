import { CheckCircle2 } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { ProtectedCheckoutButton } from "@/features/checkout/components/protected-checkout-button.component";
import type { CourseDetailCopy, CourseItemView } from "../courses.types";

type CoursePurchasePanelProps = Readonly<{
  course: CourseItemView;
  copy: CourseDetailCopy;
}>;

export function CoursePurchasePanel({ course, copy }: CoursePurchasePanelProps) {
  return (
    <Card className="rounded-[12px] bg-surface p-5 shadow-[0_10px_30px_rgba(17,24,39,0.08)]">
      <div className="text-center">
        <p className="text-[0.72rem] font-semibold text-foreground/50">{copy.purchaseLabel}</p>
        <p className="mt-1 text-[1.9rem] font-black tracking-[-0.04em] text-foreground">{course.price}</p>
      </div>

      <div className="mt-5 border-t border-border/70 pt-5">
        <ProtectedCheckoutButton itemType="course" itemId={course.id} className="w-full rounded-[7px] py-3 text-xs font-bold">
          {copy.addToCart}
        </ProtectedCheckoutButton>
        <p className="mt-4 text-center text-[0.74rem] leading-5 text-foreground/55">{copy.unlockNote}</p>
      </div>

      {course.includes.length > 0 ? (
        <div className="mt-5 border-t border-border/70 pt-5">
          <h3 className="text-[0.8rem] font-black text-foreground">{copy.includesTitle}</h3>
          <ul className="mt-3 space-y-2.5">
            {course.includes.map((item) => (
              <li key={item} className="flex items-start gap-2 text-[0.78rem] leading-5 text-foreground/66">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Card>
  );
}
