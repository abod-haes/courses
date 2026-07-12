import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BookOpen, FileText, GraduationCap, PlayCircle, ShieldCheck } from "lucide-react";
import { getLibraryFromApi } from "@/features/checkout/checkout.api";
import { getCheckoutCopy } from "@/features/checkout/checkout.data";
import { generateLibraryMetadata } from "@/features/checkout/checkout-pages.component";
import type { CheckoutCopy, CheckoutItemView } from "@/features/checkout/checkout.types";
import { ApiError } from "@/shared/api/client";
import { websiteSessionCookieName } from "@/shared/api/website-session";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Reveal } from "@/shared/components/animation/reveal.component";
import { localeCookieName } from "@/shared/lib/preferences";
import { resolveLocale } from "@/shared/lib/helpers/locale.helper";
import type { Locale } from "@/shared/lib/types";

export const generateMetadata = generateLibraryMetadata;

type LibraryTab = "courses" | "books";

type LibraryPageProps = Readonly<{
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}>;

function getSearchParamValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function resolveLibraryTab(value: string | undefined): LibraryTab {
  return value === "books" ? "books" : "courses";
}

function getLocaleFromCookies(cookieLocale: string | null | undefined): Locale {
  return resolveLocale(cookieLocale);
}

async function getCurrentLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return getLocaleFromCookies(cookieStore.get(localeCookieName)?.value);
}

async function requireSessionToken(returnTo: string): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get(websiteSessionCookieName)?.value;

  if (!token) {
    redirect(`/login?redirectTo=${encodeURIComponent(returnTo)}`);
  }

  return token;
}

function handleProtectedApiError(error: unknown, returnTo: string): never {
  if (error instanceof ApiError && error.status === 401) {
    redirect(`/login?redirectTo=${encodeURIComponent(returnTo)}&sessionExpired=1`);
  }

  throw error;
}

export default async function Page({ searchParams }: LibraryPageProps) {
  const locale = await getCurrentLocale();
  const copy = getCheckoutCopy(locale);
  const params = searchParams ? await searchParams : {};
  const activeTab = resolveLibraryTab(getSearchParamValue(params.tab));
  const returnTo = `/library${activeTab === "books" ? "?tab=books" : ""}`;
  const token = await requireSessionToken(returnTo);
  const library = await getLibraryFromApi(locale, copy, token).catch((error) => handleProtectedApiError(error, returnTo));
  const activeItems = activeTab === "courses" ? library.courses : library.books;

  return (
    <div className="min-h-full bg-section-bg">
      <section className="border-b border-border/60 bg-section-bg">
        <div className="mx-auto max-w-7xl px-4 pb-7 pt-7 sm:px-6 lg:px-8 lg:pb-9 lg:pt-9">
          <Reveal preset="fadeUp" className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-primary">{copy.library.eyebrow}</p>
              <h1 className="mt-3 text-4xl font-black text-foreground sm:text-5xl">{copy.library.title}</h1>
              <p className="mt-3 max-w-2xl text-sm text-foreground/68 sm:text-base">{copy.library.subtitle}</p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-surface p-1 shadow-[0_8px_22px_rgba(15,23,42,0.04)]">
              <LibraryTabLink href="/library?tab=courses" isActive={activeTab === "courses"} icon="course" label={copy.library.coursesTab} count={library.courses.length} />
              <LibraryTabLink href="/library?tab=books" isActive={activeTab === "books"} icon="book" label={copy.library.booksTab} count={library.books.length} />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <Reveal preset="fadeUp" className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-black text-foreground">{activeTab === "courses" ? copy.library.coursesTab : copy.library.booksTab}</h2>
            <p className="mt-1 text-sm text-foreground/58">
              {activeItems.length > 0 ? `${activeItems.length} ${activeTab === "courses" ? copy.labels.course : copy.labels.book}` : copy.library.emptyDescription}
            </p>
          </div>
          <Button href={activeTab === "courses" ? "/courses" : "/books"} variant="secondary" className="w-fit rounded-full">
            {activeTab === "courses" ? copy.library.browseCourses : copy.library.browseBooks}
          </Button>
        </Reveal>

        {activeItems.length > 0 ? (
          <div className="grid gap-4">
            {activeItems.map((item) => (
              <LibraryResourceCard key={`${item.type}-${item.id}`} item={item} copy={copy} actionLabel={item.type === "course" ? copy.library.continueLearning : copy.library.accessBook} />
            ))}
          </div>
        ) : (
          <LibraryEmptyState copy={copy} href={activeTab === "courses" ? "/courses" : "/books"} label={activeTab === "courses" ? copy.library.browseCourses : copy.library.browseBooks} />
        )}
      </section>
    </div>
  );
}

function LibraryTabLink({ href, isActive, icon, label, count }: Readonly<{ href: string; isActive: boolean; icon: "course" | "book"; label: string; count: number }>) {
  const Icon = icon === "course" ? GraduationCap : BookOpen;

  return (
    <Button href={href} variant={isActive ? "primary" : "ghost"} className={isActive ? "rounded-full px-4 py-2 text-xs shadow-[0_8px_18px_rgba(0,74,198,0.14)]" : "rounded-full px-4 py-2 text-xs text-foreground/64 hover:bg-primary/7 hover:text-primary"}>
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span>{label}</span>
      <span className={isActive ? "rounded-full bg-white/18 px-2 py-0.5 text-[0.68rem]" : "rounded-full bg-primary/8 px-2 py-0.5 text-[0.68rem] text-primary"}>{count}</span>
    </Button>
  );
}

function LibraryResourceCard({ item, copy, actionLabel }: Readonly<{ item: CheckoutItemView; copy: CheckoutCopy; actionLabel: string }>) {
  const isCourse = item.type === "course";
  const Icon = isCourse ? PlayCircle : FileText;
  const actionHref = isCourse ? `/learn/courses/${item.id}` : `/library/books/${item.id}/download`;

  return (
    <Reveal preset="fadeUp">
      <Card className="group overflow-hidden rounded-[18px] border border-border/70 bg-surface shadow-[0_10px_28px_rgba(15,23,42,0.045)] transition duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_16px_38px_rgba(15,23,42,0.075)]">
        <div className="flex min-w-0 flex-col lg:flex-row">
          <div className="relative h-52 w-full shrink-0 overflow-hidden bg-primary/6 sm:h-60 lg:h-auto lg:w-72 xl:w-80">
            <Image
              src={item.image}
              alt={item.imageAlt}
              fill
              sizes="(max-width: 1023px) 100vw, 320px"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-transparent" />
            <span className="absolute bottom-3 start-3 inline-flex items-center gap-1.5 rounded-full bg-white/92 px-3 py-1 text-[0.7rem] font-black text-primary shadow-[0_8px_18px_rgba(15,23,42,0.12)]">
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {item.typeLabel}
            </span>
          </div>

          <div className="min-w-0 flex-1 p-5 md:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="max-w-full truncate rounded-full bg-primary/7 px-3 py-1 text-[0.68rem] font-black text-primary">{item.category}</span>
              <span className="rounded-full bg-section-bg px-3 py-1 text-[0.68rem] font-bold text-foreground/58">{item.accessLabel}</span>
            </div>
            <h3 className="mt-3 line-clamp-2 text-lg font-black text-foreground sm:text-xl">{item.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-foreground/62">{item.description}</p>
          </div>

          <div className="flex w-full shrink-0 flex-col justify-between gap-4 border-t border-border/70 bg-section-bg/70 p-5 lg:w-56 lg:border-s lg:border-t-0 xl:w-60">
            <div>
              <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-foreground/42">{isCourse ? copy.labels.lifetimeAccess : copy.labels.digitalAccess}</p>
              <p dir="ltr" className="mt-2 text-start text-xl font-black text-foreground">{item.price}</p>
            </div>
            <Button href={actionHref} className="w-full rounded-full">{actionLabel}</Button>
          </div>
        </div>
      </Card>
    </Reveal>
  );
}

function LibraryEmptyState({ copy, href, label }: Readonly<{ copy: CheckoutCopy; href: string; label: string }>) {
  return (
    <Reveal preset="scaleIn">
      <div className="rounded-[18px] border border-dashed border-border bg-surface/70 p-8 text-center shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/8 text-primary">
          <ShieldCheck className="h-7 w-7" aria-hidden="true" />
        </span>
        <h3 className="mt-4 text-lg font-black text-foreground">{copy.library.emptyTitle}</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-foreground/60">{copy.library.emptyDescription}</p>
        <Button href={href} className="mt-5 rounded-full">{label}</Button>
      </div>
    </Reveal>
  );
}
