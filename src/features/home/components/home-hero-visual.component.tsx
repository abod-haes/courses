/* eslint-disable @next/next/no-img-element */
import { useLocale } from "next-intl";

export function HomeHeroVisual() {
  const locale = useLocale();
  const isArabic = locale === "ar";

  return (
    <div className="motion-safe:animate-[soft-scale_600ms_ease-out_both]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(29,23,213,0.12),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(29,23,213,0.05),transparent_34%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(139,136,255,0.16),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(139,136,255,0.08),transparent_36%)]" />

        <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] border border-border/60 bg-surface-soft dark:border-white/10 dark:bg-slate-900">
          <img
            alt={isArabic ? "أطباء يحللون بيانات طبية" : "Medical professionals analyzing data"}
            className="absolute inset-0 h-full w-full object-cover opacity-95 dark:opacity-85"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLTwJn4aKK7om-xLrz5oHU1etm2aYmUVN4FATefb9KpuFO0kmIcaTs7yP-qPudbK4u45qNoIPvP9ZlwBlGYK_BAeA7nEyP8iKYfr08U_qZHSo8okduMTfwtBBk9RIIU1_BZg9jx1q3Tbvqr2dbe35MQSPBnuwR6XOgq08aRUeL9WQtLXDE92HP0JC9y3ByKbo6SmLVbQnqvvzINBg14lrUa4bQ5W8Hg9v7eSH9ukBF_pTPYGz0Lw_S1O-cxjsC0ZDXwo52Gq5uVIY"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 via-slate-950/5 to-transparent dark:from-slate-950/55 dark:via-slate-950/20" />
        </div>
      </div>
    </div>
  );
}
