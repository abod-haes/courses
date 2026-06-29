import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ArrowLeft, Award, Clock3, ListVideo } from "lucide-react";
import { JsonLd } from "@/shared/components/seo/json-ld";
import { getCourseDetailCopy } from "@/features/courses/courses.data";
import { getCourseBySlug } from "@/features/courses/api/courses.api";
import { CoursePurchasePanel } from "@/features/courses/components/course-purchase-panel.component";
import { resolveLocale } from "@/shared/lib/helpers/locale.helper";
import { localeCookieName } from "@/shared/lib/preferences";
import { breadcrumbJsonLd, courseJsonLd, createSeoMetadata } from "@/shared/lib/seo";
import type { Locale } from "@/shared/lib/types";

type PageProps = Readonly<{ params: Promise<{ slug: string }> }>;

async function getCurrentLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return resolveLocale(cookieStore.get(localeCookieName)?.value);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const [{ slug }, locale] = await Promise.all([params, getCurrentLocale()]);
  const course = await getCourseBySlug(slug, locale);

  if (!course) {
    return createSeoMetadata({ title: "Course not found | IASS", description: "The requested course is not available right now.", path: "/courses", locale, noIndex: true });
  }

  return createSeoMetadata({ title: `${course.title} | IASS Courses`, description: course.longDescription || course.description, path: course.href, locale, image: course.image, imageAlt: course.imageAlt, keywords: [course.title, course.category, course.instructor] });
}

export default async function Page(props: PageProps) {
  const { slug } = await props.params;
  const locale = await getCurrentLocale();
  const course = await getCourseBySlug(slug, locale);
  const copy = getCourseDetailCopy(locale);

  if (!course) notFound();

  const hoursLabel = locale === "ar" ? "ساعة" : "Hours";
  const sessionsLabel = locale === "ar" ? "جلسة" : "Sessions";

  return (
    <>
      <JsonLd data={[courseJsonLd({ title: course.title, description: course.longDescription || course.description, image: course.image, href: course.href, category: course.category }, locale), breadcrumbJsonLd([{ name: locale === "ar" ? "الرئيسية" : "Home", path: "/" }, { name: locale === "ar" ? "الكورسات" : "Courses", path: "/courses" }, { name: course.title, path: course.href }])]} />
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
                {Number(course.hours) > 0 ? <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" />{course.hours} {hoursLabel}</span> : null}
                {course.isCmeEligible ? <span className="inline-flex items-center gap-1.5"><Award className="h-3.5 w-3.5" aria-hidden="true" />{copy.cmeEligible}</span> : null}
              </div>
              <h1 className="mt-4 max-w-4xl text-[1.65rem] font-black leading-tight tracking-[-0.035em] text-foreground sm:text-[2.05rem] lg:text-[2.2rem]">{course.title}</h1>
              <p className="mt-3 text-[1rem] font-black text-primary">{course.price}</p>
              <p className="mt-6 max-w-3xl text-sm leading-7 text-foreground/68">{course.longDescription}</p>
              <div className="mt-10 rounded-[12px] border border-border/70 bg-surface p-5 shadow-[0_8px_24px_rgba(17,24,39,0.05)]">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/8 text-primary"><ListVideo className="h-5 w-5" aria-hidden="true" /></span>
                  <div>
                    <h2 className="text-sm font-black text-foreground sm:text-base">{copy.curriculumTitle}</h2>
                    <p className="mt-1 text-xs leading-5 text-foreground/58">{course.lessons} {sessionsLabel}</p>
                  </div>
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
