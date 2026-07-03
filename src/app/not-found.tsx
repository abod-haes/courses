import { cookies } from "next/headers";
import { AlertCircle, Home, LibraryBig } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { resolveLocale } from "@/shared/lib/helpers/locale.helper";
import { localeCookieName } from "@/shared/lib/preferences";

export default async function NotFound() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(localeCookieName)?.value);
  const isArabic = locale === "ar";

  return (
    <section className="flex min-h-[62vh] items-center justify-center bg-section-bg px-4 py-12 text-center">
      <Card className="mx-auto max-w-xl rounded-[22px] bg-surface p-8 shadow-[0_18px_55px_rgba(17,24,39,0.08)]">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/8 text-primary">
          <AlertCircle className="h-7 w-7" aria-hidden="true" />
        </span>
        <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-primary">404</p>
        <h1 className="mt-2 text-2xl font-black text-foreground sm:text-3xl">
          {isArabic ? "الصفحة غير متاحة" : "Page not available"}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-foreground/62">
          {isArabic
            ? "الرابط غير موجود أو لا تملك صلاحية الوصول لهذا المحتوى بعد. إذا اشتريت الكورس للتو، تأكد أن الدفع أصبح مدفوعاً ثم جرّب من مكتبتي."
            : "This page does not exist, or you do not have access to this content yet. If you just purchased it, make sure the payment is marked as paid, then try from My Library."}
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/library" className="rounded-full">
            <LibraryBig className="h-4 w-4" aria-hidden="true" />
            {isArabic ? "الذهاب إلى مكتبتي" : "Go to My Library"}
          </Button>
          <Button href="/" variant="secondary" className="rounded-full">
            <Home className="h-4 w-4" aria-hidden="true" />
            {isArabic ? "الرئيسية" : "Home"}
          </Button>
        </div>
      </Card>
    </section>
  );
}
