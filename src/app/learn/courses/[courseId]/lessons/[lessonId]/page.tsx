import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, BookOpenCheck, PlayCircle } from "lucide-react";
import { ApiError } from "@/shared/api/client";
import { websiteSessionCookieName } from "@/shared/api/website-session";
import { Reveal } from "@/shared/components/animation/reveal.component";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { resolveLocale } from "@/shared/lib/helpers/locale.helper";
import { localeCookieName } from "@/shared/lib/preferences";
import type { Locale } from "@/shared/lib/types";
import { getLearningCourse, getProtectedLesson } from "@/features/learning/learning.api";

export const dynamic = "force-dynamic";

type PageProps = Readonly<{ params: Promise<{ courseId: string; lessonId: string }> }>;

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

function isDirectVideo(url: string): boolean {
  return /\.(mp4|webm|ogg)(\?|#|$)/i.test(url);
}

function embedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (parsed.hostname.includes("youtu.be")) return `https://www.youtube.com/embed/${parsed.pathname.replace(/^\//, "")}`;
    if (parsed.hostname.includes("vimeo.com")) return `https://player.vimeo.com/video/${parsed.pathname.replace(/^\//, "")}`;
  } catch {
    return null;
  }

  return null;
}

function VideoBlock({ url, title, fallback }: Readonly<{ url: string | null; title: string; fallback: string }>) {
  if (!url) {
    return (
      <div className="flex min-h-[18rem] items-center justify-center rounded-[18px] border border-dashed border-border bg-surface p-8 text-center text-sm text-foreground/58">
        {fallback}
      </div>
    );
  }

  const embedded = embedUrl(url);

  if (embedded) {
    return <iframe title={title} src={embedded} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="aspect-video w-full rounded-[18px] border border-border bg-black shadow-[0_18px_48px_rgba(17,24,39,0.12)]" />;
  }

  if (isDirectVideo(url)) {
    return <video controls preload="metadata" src={url} className="aspect-video w-full rounded-[18px] bg-black shadow-[0_18px_48px_rgba(17,24,39,0.12)]" />;
  }

  return (
    <Card className="rounded-[18px] bg-surface p-6 text-center shadow-[0_12px_34px_rgba(17,24,39,0.06)]">
      <PlayCircle className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
      <p className="mt-3 text-sm text-foreground/62">{fallback}</p>
      <Button href={url} target="_blank" rel="noreferrer" className="mt-4 rounded-full">Open video</Button>
    </Card>
  );
}

export default async function Page({ params }: PageProps) {
  const { courseId, lessonId } = await params;
  const locale = await currentLocale();
  const returnTo = `/learn/courses/${courseId}/lessons/${lessonId}`;
  const token = await requireToken(returnTo);
  const isArabic = locale === "ar";
  const [course, lesson] = await Promise.all([
    getLearningCourse(courseId, locale, token),
    getProtectedLesson(courseId, lessonId, locale, token),
  ]).catch((error) => handleError(error, returnTo));
  const videoSource = lesson.videoMediaUrl || lesson.videoUrl;

  return (
    <main className="min-h-full bg-section-bg">
      <section className="border-b border-border/60 bg-section-bg">
        <div className="mx-auto max-w-7xl px-4 pb-7 pt-7 sm:px-6 lg:px-8 lg:pb-9 lg:pt-9">
          <Reveal preset="fadeUp" className="max-w-4xl">
            <Button href={`/learn/courses/${course.id}`} variant="ghost" className="mb-4 rounded-full px-0 text-primary">
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              {isArabic ? "العودة لجلسات الكورس" : "Back to course sessions"}
            </Button>
            <p className="inline-flex items-center gap-2 rounded-full bg-primary/8 px-3 py-1 text-xs font-black text-primary">
              <BookOpenCheck className="h-4 w-4" aria-hidden="true" />
              {course.title}
            </p>
            <h1 className="mt-4 text-[2rem] font-black leading-tight tracking-[-0.04em] text-foreground sm:text-[2.6rem]">{lesson.title}</h1>
            {lesson.summary ? <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/66 sm:text-base">{lesson.summary}</p> : null}
          </Reveal>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-7 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_21rem] lg:px-8 lg:py-10">
        <div className="min-w-0">
          <Reveal preset="fadeUp">
            <VideoBlock url={videoSource} title={lesson.title} fallback={isArabic ? "لا يوجد فيديو مرفوع لهذه الجلسة حالياً." : "No video is attached to this lesson yet."} />
          </Reveal>

          {lesson.content ? (
            <Reveal preset="fadeUp" className="mt-6">
              <Card className="rounded-[18px] bg-surface p-5 shadow-[0_10px_28px_rgba(15,23,42,0.045)] sm:p-6">
                <h2 className="mb-4 text-xl font-black text-foreground">{isArabic ? "محتوى الجلسة" : "Lesson content"}</h2>
                <div className="prose prose-slate max-w-none text-foreground prose-p:leading-8 prose-a:text-primary" dangerouslySetInnerHTML={{ __html: lesson.content }} />
              </Card>
            </Reveal>
          ) : null}
        </div>

        <Reveal preset="fadeLeft" className="lg:sticky lg:top-24 lg:self-start">
          <Card className="rounded-[18px] bg-surface p-4 shadow-[0_14px_38px_rgba(17,24,39,0.08)]">
            <h2 className="px-2 text-base font-black text-foreground">{isArabic ? "جلسات الكورس" : "Course sessions"}</h2>
            <div className="mt-4 grid max-h-[32rem] gap-2 overflow-y-auto pe-1">
              {course.sections.flatMap((section) => section.lessons).map((item, index) => (
                <Button key={item.id} href={item.href} variant={String(item.id) === lessonId ? "primary" : "secondary"} className="justify-start rounded-[12px] px-3 py-3 text-start">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/18 text-xs font-black">{index + 1}</span>
                  <span className="min-w-0 truncate">{item.title}</span>
                </Button>
              ))}
            </div>
          </Card>
        </Reveal>
      </section>
    </main>
  );
}
