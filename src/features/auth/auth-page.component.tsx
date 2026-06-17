import type { Metadata } from "next";
import { cookies } from "next/headers";
import { SiteContainer } from "@/shared/components/layout/site-container";
import { localeCookieName } from "@/shared/lib/preferences";
import { resolveLocale } from "@/shared/lib/helpers/locale.helper";
import type { Locale } from "@/shared/lib/types";
import { authCopyByLocale, getAuthModeCopy } from "./auth.data";
import type { AuthMode } from "./auth.types";
import { AuthFormCard } from "./components/auth-form-card.component";

type AuthPageProps = Readonly<{
  mode: AuthMode;
}>;

function getLocaleFromCookies(cookieLocale: string | null | undefined): Locale {
  return resolveLocale(cookieLocale);
}

async function getAuthLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return getLocaleFromCookies(cookieStore.get(localeCookieName)?.value);
}

export async function generateAuthMetadata(mode: AuthMode): Promise<Metadata> {
  const locale = await getAuthLocale();
  const copy = getAuthModeCopy(locale, mode);

  return {
    title: {
      absolute: copy.meta.title,
    },
    description: copy.meta.description,
    alternates: {
      canonical: mode === "forgot-password" ? "/forgot-password" : `/${mode}`,
    },
    openGraph: {
      title: copy.meta.title,
      description: copy.meta.description,
      type: "website",
      url: mode === "forgot-password" ? "/forgot-password" : `/${mode}`,
    },
  };
}

export async function AuthPage({ mode }: AuthPageProps) {
  const locale = await getAuthLocale();
  const authCopy = authCopyByLocale[locale];
  const modeCopy = authCopy.modes[mode];

  return (
    <main className="relative overflow-hidden bg-[linear-gradient(135deg,rgba(248,250,255,0.99),rgba(242,246,255,0.92))] dark:bg-section-bg">
      <div className="pointer-events-none absolute -left-24 top-8 h-56 w-56 rounded-full bg-primary/7 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-4 h-60 w-60 rounded-full bg-primary/6 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/45 blur-3xl" />

      <SiteContainer
        as="section"
        className="relative flex min-h-[calc(100dvh-4.25rem)] max-w-[980px] items-center justify-center py-4 sm:py-5 lg:py-6"
      >
        <AuthFormCard mode={mode} copy={modeCopy} />
      </SiteContainer>
    </main>
  );
}
