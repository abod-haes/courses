import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { BookOpenCheck, PlayCircle } from "lucide-react";
import { ApiError } from "@/shared/api/client";
import { websiteSessionCookieName } from "@/shared/api/website-session";
import { Reveal } from "@/shared/components/animation/reveal.component";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { resolveLocale } from "@/shared/lib/helpers/locale.helper";
import { localeCookieName } from "@/shared/lib/preferences";
import type { Locale } from "@/shared/lib/types";
import { getLearningCourse } from "@/features/learning/learning.api";

export const dynamic = "force-dynamic";

type PageProps = Readonly<{ params: Promise<{ courseId: string }> }>;

async function currentLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return resolveLocale(cookieStore.get(localeCookieName)?.value);
}

async function requireToken(returnTo: string): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get(websiteSessionCookieName)?.value;
  if (!token) redirect(`/login?redirectTo=${encodeURIComponent(returnTo)}`);
  return token;
}

function handleError(error: unknown, returnTo: string): never {
  if (error instanceof ApiError && error.status === 401) redirect(`/login?redirectTo=${encodeURIComponent(returnTo)}&sessionExpired=1`);
  if (error instanceof ApiError && (error.status === 403 || error.status === 404)) notFound();
  throw error;
}

export default async function Page({ params }: PageProps) {
  const { courseId } = await params;
  const locale = await currentLocale();
  const returnTo = `/learn/courses/${courseId}`;
  const token = await requireToken(returnTo);
  const isArabic = locale === "ar";
  const course = await getLearningCourse(courseId, locale, token).catch((error) => handleError(error, returnTo));
  const lessonsCount = course.sections.reduce((sum, section) => sum + section.lessons.length, 0);

  return (
    <main className="min-h-full bg-section-bg">
      <section className="border-b border-border/60 bg-section-bg">
        <div className="mx-auto grid max-w-7xl gap-7 px-4 pb-8 pt-7 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-8 lg:pb-10 lg:pt-10">
          <Reveal preset="fadeUp" className="min-w-0">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-primary">{isArabic ? "منطقة التعلم" : "Learning area"}</p>
            <h1 className="mt-3 text-[2rem] font-black leading-tight tracking-[-0.04em] text-foreground sm:text-[2.7rem]">{course.title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/66 sm:text-base">{course.description || course.shortDescription || (isArabic ? "اختر جلسة من المنهج للبدء بالمشاهدة." : "Choose a lesson from the course outline to start watching.")}</p>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-bold text-foreground/58">
              <span className="rounded-full bg-primary/8 px-3 py-1 text-primary">{lessonsCount} {isArabic ? "جلسة" : "lessons"}</span>
              <span className="rounded-full bg-surface px-3 py-1 shadow-[0_6px_18px_rgba(15,23,42,0.04)]">{course.sections.length} {isArabic ? "أقسام" : "sections"}</span>
            </div>
          </Reveal>

          <Reveal preset="fadeLeft">
            <Card className="overflow-hidden rounded-[18px] bg-surface shadow-[0_14px_40px_rgba(17,24,39,0.08)]">
              <div className="relative h-48 bg-primary/8">
                {course.thumbnail ? <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${course.thumbnail})` }} /> : null}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/12 to-transparent" />
                <span className="absolute bottom-4 start-4 inline-flex items-center gap-2 rounded-full bg-white/94 px-3 py-1 text-xs font-black text-primary shadow-[0_10px_24px_rgba(15,23,42,0.14)]"><BookOpenCheck className="h-4 w-4" aria-hidden="true" />{isArabic ? "كورس مشتَرى" : "Purchased course"}</span>
              </div>
              <div className="p-5">
                <p className="text-sm leading-6 text-foreground/62">{isArabic ? "هذا المحتوى متاح فقط لأنك اشتريت الكورس." : "This content is available because you purchased the course."}</p>
                {course.firstLesson ? <Button href={course.firstLesson.href} className="mt-4 w-full rounded-full"><PlayCircle className="h-4 w-4" aria-hidden="true" />{isArabic ? "ابدأ أول جلسة" : "Start first lesson"}</Button> : <Button disabled className="mt-4 w-full rounded-full">{isArabic ? "لا توجد جلسات منشورة حالياً" : "No published lessons yet"}</Button>}
              </div>
            </Card>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <Reveal preset="fadeUp" className="mb-5">
          <h2 className="text-xl font-black text-foreground">{isArabic ? "جلسات الكورس" : "Course sessions"}</h2>
          <p className="mt-1 text-sm text-foreground/58">{isArabic ? "افتح أي جلسة منشورة داخل الكورس." : "Open any published lesson in this course."}</p>
        </Reveal>
        <div className="grid gap-4">
          {course.sections.map((section) => (
            <Reveal key={section.id} preset="fadeUp">
              <Card className="rounded-[16px] bg-surface p-5 shadow-[0_10px_28px_rgba(15,23,42,0.045)]">
                <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                  <div><h3 className="text-lg font-black text-foreground">{section.title}</h3>{section.description ? <p className="mt-1 text-sm text-foreground/58">{section.description}</p> : null}</div>
                  <span className="w-fit rounded-full bg-primary/8 px-3 py-1 text-xs font-black text-primary">{section.lessons.length} {isArabic ? "جلسة" : "lessons"}</span>
                </div>
                <div className="grid gap-2">
                  {section.lessons.map((lesson, index) => (
                    <Button key={lesson.id} href={lesson.href} variant="secondary" className="justify-between rounded-[12px] px-4 py-3 text-start">
                      <span className="flex min-w-0 items-center gap-3"><span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/8 text-xs font-black text-primary">{index + 1}</span><span className="min-w-0"><span className="block truncate font-black text-foreground">{lesson.title}</span>{lesson.summary ? <span className="mt-0.5 block truncate text-xs font-medium text-foreground/55">{lesson.summary}</span> : null}</span></span>
                      <PlayCircle className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    </Button>
                  ))}
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
        {course.sections.length === 0 ? <Card className="rounded-[16px] bg-surface p-8 text-center"><p className="text-sm text-foreground/62">{isArabic ? "لا توجد جلسات منشورة لهذا الكورس حالياً." : "There are no published lessons for this course yet."}</p><Button href="/library" variant="secondary" className="mt-4 rounded-full">{isArabic ? "العودة إلى مكتبتي" : "Back to my library"}</Button></Card> : null}
      </section>
    </main>
  );
}
