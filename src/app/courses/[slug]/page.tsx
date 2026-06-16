import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ArrowLeft, Award, CheckCircle2, Clock3, FileText } from "lucide-react";
import { JsonLd } from "@/shared/components/seo/json-ld";
import { getCourseDetailCopy } from "@/features/courses/courses.data";
import { getCourseBySlug } from "@/features/courses/api/courses.api";
import { CoursePurchasePanel } from "@/features/courses/components/course-purchase-panel.component";
import { resolveLocale } from "@/shared/lib/helpers/locale.helper";
import { localeCookieName } from "@/shared/lib/preferences";
import { breadcrumbJsonLd, courseJsonLd, createSeoMetadata } from "@/shared/lib/seo";
import type { CourseItemView } from "@/features/courses/courses.types";
import type { Locale } from "@/shared/lib/types";

type PageProps = Readonly<{
  params: Promise<{ slug: string }>;
}>;

type CourseCurriculumItem = CourseItemView["curriculum"][number];

const fallbackCurriculumByLocale: Readonly<Record<Locale, ReadonlyArray<CourseCurriculumItem>>> = {
  en: [
    { title: "Module 1: Foundations and Orientation", description: "Overview of core concepts and learning expectations.", duration: "18:00" },
    { title: "Module 2: Guided Case Analysis", description: "Build a step-by-step way to analyze cases and key findings.", duration: "38:20", locked: true },
    { title: "Module 3: Applied Review", description: "Practice structured reasoning through realistic learning scenarios.", duration: "49:00", locked: true },
  ],
  ar: [
    { title: "الوحدة 1: الأساسيات والتوجيه", description: "نظرة عامة على المفاهيم الأساسية وتوقعات مسار التعلم.", duration: "18:00" },
    { title: "الوحدة 2: تحليل الحالات بإشراف", description: "بناء طريقة خطوة بخطوة لتحليل الحالات والنتائج الأساسية.", duration: "38:20", locked: true },
    { title: "الوحدة 3: مراجعة تطبيقية", description: "تدريب على التفكير المنظم من خلال سيناريوهات تعليمية واقعية.", duration: "49:00", locked: true },
  ],
};

async function getCurrentLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return resolveLocale(cookieStore.get(localeCookieName)?.value);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const [{ slug }, locale] = await Promise.all([params, getCurrentLocale()]);
  const course = await getCourseBySlug(slug, locale);

  if (!course) {
    return createSeoMetadata({
      title: locale === "ar" ? "الكورس غير موجود | IASS" : "Course not found | IASS",
      description: locale === "ar" ? "الكورس المطلوب غير متاح حاليًا." : "The requested course is not available right now.",
      path: "/courses",
      locale,
      noIndex: true,
    });
  }

  return createSeoMetadata({
    title: `${course.title} | IASS Courses`,
    description: course.longDescription || course.description,
    path: course.href,
    locale,
    image: course.image,
    imageAlt: course.imageAlt,
    keywords: [course.title, course.category, course.instructor],
  });
}

export default async function Page(props: PageProps) {
  const { slug } = await props.params;
  const locale = await getCurrentLocale();
  const course = await getCourseBySlug(slug, locale);
  const copy = getCourseDetailCopy(locale);

  if (!course) {
    notFound();
  }

  const modules: ReadonlyArray<CourseCurriculumItem> = course.curriculum.length > 0 ? course.curriculum : fallbackCurriculumByLocale[locale];
  const hoursLabel = locale === "ar" ? "ساعة" : "Hours";

  return (
    <>
      <JsonLd
        data={[
          courseJsonLd(
            {
              title: course.title,
              description: course.longDescription || course.description,
              image: course.image,
              href: course.href,
              category: course.category,
            },
            locale,
          ),
          breadcrumbJsonLd([
            { name: locale === "ar" ? "الرئيسية" : "Home", path: "/" },
            { name: locale === "ar" ? "الكورسات" : "Courses", path: "/courses" },
            { name: course.title, path: course.href },
          ]),
        ]}
      />
      <div className="min-h-full bg-section-bg">
        <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-8">
          <Link href="/courses" className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-strong">
            <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
            {copy.backLabel}
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
            <div>
              <div className="relative h-[23rem] overflow-hidden rounded-[10px] bg-surface-soft shadow-[0_12px_34px_rgba(17,24,39,0.08)]">
                <Image src={course.image} alt={course.imageAlt} fill priority sizes="(max-width: 1024px) 100vw, 760px" className="object-cover" />
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3 text-[0.72rem] font-bold text-foreground/55">
                <span className="uppercase tracking-[0.12em] text-primary">{course.category}</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                  {course.hours} {hoursLabel}
                </span>
                {course.isCmeEligible ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5" aria-hidden="true" />
                    {copy.cmeEligible}
                  </span>
                ) : null}
              </div>

              <h1 className="mt-4 max-w-4xl text-[2rem] font-black leading-tight tracking-[-0.04em] text-foreground sm:text-[2.45rem]">
                {course.title}
              </h1>
              <p className="mt-3 text-[1.05rem] font-black text-primary">{course.price}</p>
              <p className="mt-6 max-w-3xl text-sm leading-7 text-foreground/68">{course.longDescription}</p>

              <div className="mt-10 overflow-hidden rounded-[12px] border border-border/70 bg-surface shadow-[0_8px_24px_rgba(17,24,39,0.05)]">
                <div className="flex items-center justify-between gap-4 border-b border-border/70 bg-primary/5 px-5 py-4">
                  <h2 className="text-base font-black text-foreground">{copy.curriculumTitle}</h2>
                  <p className="text-xs font-semibold text-foreground/52">
                    {course.modules} {copy.modulesLabel} • {course.lessons} {copy.lessonsLabel}
                  </p>
                </div>

                <div className="divide-y divide-border/60">
                  {modules.map((module, index) => {
                    const Icon = module.locked ? FileText : CheckCircle2;

                    return (
                      <div key={`${module.title}-${index}`} className="flex items-start gap-4 px-5 py-4">
                        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/8 text-primary">
                          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-black text-foreground">{module.title}</h3>
                          <p className="mt-1 text-xs leading-5 text-foreground/58">{module.description}</p>
                        </div>
                        <span className="text-xs font-semibold text-foreground/45">{module.duration}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <CoursePurchasePanel course={course} copy={copy} />
          </div>
        </section>
      </div>
    </>
  );
}
