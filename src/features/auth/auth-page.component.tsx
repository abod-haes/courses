import type { Metadata } from "next";
import { cookies } from "next/headers";
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
    <div className="relative min-h-full overflow-hidden bg-section-bg">
      <div className="pointer-events-none absolute left-0 top-0 h-72 w-72 rounded-full bg-primary/8 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-300/10 blur-3xl" />

      <section className="relative mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl items-center gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,0.94fr)_minmax(24rem,0.76fr)] lg:px-8 lg:py-10">
        <AuthVisual copy={authCopy.visual} />
        <AuthFormCard mode={mode} copy={modeCopy} />
      </section>
    </div>
  );
}
