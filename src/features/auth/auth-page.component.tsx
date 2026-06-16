import type { Metadata } from "next";
import { cookies } from "next/headers";
import { SiteContainer } from "@/shared/components/layout/site-container";
import { localeCookieName } from "@/shared/lib/preferences";
import { resolveLocale } from "@/shared/lib/helpers/locale.helper";
import type { Locale } from "@/shared/lib/types";
import { authCopyByLocale, getAuthModeCopy } from "./auth.data";
import type { AuthMode } from "./auth.types";
import { AuthFormCard } from "./components/auth-form-card.component";
import { AuthVisual } from "./components/auth-visual.component";

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
    <main className="relative min-h-full overflow-hidden bg-[linear-gradient(135deg,rgba(248,250,255,0.98),rgba(239,246,255,0.82))] dark:bg-section-bg">
      <div className="pointer-events-none absolute -left-20 top-6 h-64 w-64 rounded-full bg-primary/8 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />

      <SiteContainer
        as="section"
        className="relative grid min-h-[calc(100dvh-4.25rem)] max-w-[1060px] items-center gap-5 py-5 sm:py-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(22rem,0.72fr)] xl:gap-6 xl:py-7"
      >
        <AuthVisual copy={authCopy.visual} />
        <AuthFormCard mode={mode} copy={modeCopy} />
      </SiteContainer>
    </main>
  );
}
