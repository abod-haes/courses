import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AlertTriangle, ArrowRight, CheckCircle2, CreditCard, FileText, LibraryBig, LockKeyhole, PackageCheck, ReceiptText, ShieldCheck } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Reveal } from "@/shared/components/animation/reveal.component";
import { StaggerList } from "@/shared/components/animation/stagger-list.component";
import { resolveLocale } from "@/shared/lib/helpers/locale.helper";
import { localeCookieName } from "@/shared/lib/preferences";
import type { Locale } from "@/shared/lib/types";
import { CheckoutItemRow } from "./components/checkout-item-row.component";
import { getCheckoutCopy, getCheckoutSelection, getCheckoutTotal, getMockOrder, getMockOrders } from "./checkout.data";
import type { CheckoutCopy, CheckoutItemType, CheckoutItemView, OrderView } from "./checkout.types";

function getLocaleFromCookies(cookieLocale: string | null | undefined): Locale {
  return resolveLocale(cookieLocale);
}

async function getCurrentLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return getLocaleFromCookies(cookieStore.get(localeCookieName)?.value);
}

function buildPageMetadata(title: string, description: string, canonical: string): Metadata {
  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export async function generateCheckoutMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  const copy = getCheckoutCopy(locale);
  return buildPageMetadata(copy.meta.checkoutTitle, copy.meta.checkoutDescription, "/checkout");
}

export async function generateCheckoutSuccessMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  const copy = getCheckoutCopy(locale);
  return buildPageMetadata(copy.meta.successTitle, copy.meta.successDescription, "/checkout/success");
}

export async function generateCheckoutCancelMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  const copy = getCheckoutCopy(locale);
  return buildPageMetadata(copy.meta.cancelTitle, copy.meta.cancelDescription, "/checkout/cancel");
}

export async function generateOrdersMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  const copy = getCheckoutCopy(locale);
  return buildPageMetadata(copy.meta.ordersTitle, copy.meta.ordersDescription, "/orders");
}

export async function generateLibraryMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  const copy = getCheckoutCopy(locale);
  return buildPageMetadata(copy.meta.libraryTitle, copy.meta.libraryDescription, "/library");
}

type CheckoutPageProps = Readonly<{
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}>;

function getSearchParamValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export async function CheckoutPage({ searchParams }: CheckoutPageProps = {}) {
  const locale = await getCurrentLocale();
  const copy = getCheckoutCopy(locale);
  const params = searchParams ? await searchParams : {};
  const itemType = getSearchParamValue(params.itemType);
  const itemId = getSearchParamValue(params.itemId);
  const isEmpty = getSearchParamValue(params.empty) === "1";
  const items = getCheckoutSelection(locale, itemType as CheckoutItemType | undefined, itemId, isEmpty);

  return <CheckoutReviewScreen copy={copy} items={items} />;
}

function CheckoutReviewScreen({ copy, items }: Readonly<{ copy: CheckoutCopy; items: CheckoutItemView[] }>) {
  const total = getCheckoutTotal(items);

  return (
    <div className="min-h-full bg-section-bg">
      <section className="border-b border-border/60 bg-section-bg">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-7 sm:px-6 lg:px-8 lg:pb-10 lg:pt-9">
          <Reveal preset="fadeUp" className="max-w-3xl">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-primary">{copy.checkout.eyebrow}</p>
            <h1 className="mt-3 text-[2rem] font-black leading-tight tracking-[-0.04em] text-foreground sm:text-[2.6rem]">
              {copy.checkout.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground/68 sm:text-[0.95rem]">{copy.checkout.subtitle}</p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-7 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_23rem] lg:px-8 lg:py-10">
        {items.length > 0 ? (
          <div className="min-w-0">
            <Reveal preset="fadeUp" className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-black tracking-[-0.03em] text-foreground">{copy.checkout.reviewTitle}</h2>
                <p className="mt-1 text-sm leading-6 text-foreground/60">{copy.checkout.reviewDescription}</p>
              </div>
              <span className="inline-flex w-fit items-center rounded-full bg-primary/8 px-3 py-1 text-xs font-bold text-primary">
                {items.length} {copy.checkout.itemCountLabel}
              </span>
            </Reveal>

            <StaggerList className="grid gap-4">
              {items.map((item) => (
                <CheckoutItemRow key={`${item.type}-${item.id}`} item={item} copy={copy} />
              ))}
            </StaggerList>
          </div>
        ) : (
          <CheckoutEmptyState copy={copy} />
        )}

        <OrderSummaryCard copy={copy} total={total} hasItems={items.length > 0} />
      </section>
    </div>
  );
}

function CheckoutEmptyState({ copy }: Readonly<{ copy: CheckoutCopy }>) {
  return (
    <Reveal preset="scaleIn">
      <Card className="rounded-[16px] bg-surface p-8 text-center shadow-[0_12px_34px_rgba(17,24,39,0.06)]">
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/8 text-primary">
          <ReceiptText className="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-xl font-black tracking-[-0.03em] text-foreground">{copy.checkout.emptyTitle}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-foreground/62">{copy.checkout.emptyDescription}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button href="/courses" className="rounded-full">{copy.checkout.browseCourses}</Button>
          <Button href="/books" variant="secondary" className="rounded-full">{copy.checkout.browseBooks}</Button>
        </div>
      </Card>
    </Reveal>
  );
}

function OrderSummaryCard({ copy, total, hasItems }: Readonly<{ copy: CheckoutCopy; total: string; hasItems: boolean }>) {
  return (
    <Reveal preset="fadeLeft" className="lg:sticky lg:top-24 lg:self-start">
      <Card className="overflow-hidden rounded-[16px] bg-surface shadow-[0_14px_38px_rgba(17,24,39,0.08)]">
        <div className="border-b border-border/70 bg-primary/5 p-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] bg-surface text-primary shadow-[0_8px_20px_rgba(29,23,213,0.08)]">
              <CreditCard className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-base font-black text-foreground">{copy.checkout.totalTitle}</h2>
              <p className="text-xs leading-5 text-foreground/58">{copy.checkout.securePayment}</p>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4 text-foreground/62">
              <span>{copy.checkout.subtotal}</span>
              <span className="font-bold text-foreground">{total}</span>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-border/70 pt-4 text-base font-black text-foreground">
              <span>{copy.checkout.total}</span>
              <span>{total}</span>
            </div>
          </div>

          {hasItems ? (
            <Button href="/checkout/success" className="mt-5 w-full rounded-[9px]">
              <LockKeyhole className="h-4 w-4" aria-hidden="true" />
              {copy.checkout.continueToPayment}
            </Button>
          ) : (
            <Button disabled className="mt-5 w-full rounded-[9px]">
              <LockKeyhole className="h-4 w-4" aria-hidden="true" />
              {copy.checkout.continueToPayment}
            </Button>
          )}
          <Button href="/courses" variant="ghost" className="mt-2 w-full rounded-[9px]">
            {copy.checkout.continueBrowsing}
          </Button>
        </div>
      </Card>
    </Reveal>
  );
}

export async function CheckoutSuccessPage() {
  const locale = await getCurrentLocale();
  const copy = getCheckoutCopy(locale);
  const order = getMockOrder(locale);
  return <CheckoutResultScreen copy={copy} order={order} variant="success" />;
}

export async function CheckoutCancelPage() {
  const locale = await getCurrentLocale();
  const copy = getCheckoutCopy(locale);
  const order = getMockOrder(locale);
  return <CheckoutResultScreen copy={copy} order={order} variant="cancel" />;
}

function CheckoutResultScreen({
  copy,
  order,
  variant,
}: Readonly<{ copy: CheckoutCopy; order: OrderView; variant: "success" | "cancel" }>) {
  const isSuccess = variant === "success";
  const Icon = isSuccess ? CheckCircle2 : AlertTriangle;

  return (
    <div className="min-h-full bg-section-bg px-4 py-10 sm:px-6 lg:px-8">
      <Reveal preset="scaleIn" className="mx-auto max-w-3xl">
        <Card className="overflow-hidden rounded-[22px] bg-surface text-center shadow-[0_18px_48px_rgba(17,24,39,0.09)]">
          <div className="relative px-6 pb-8 pt-10 sm:px-10">
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-primary/10 to-transparent" />
            <span className={isSuccess ? "relative mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-600" : "relative mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/12 text-amber-600"}>
              <Icon className="h-8 w-8" aria-hidden="true" />
            </span>
            <p className="mt-5 text-[0.68rem] font-black uppercase tracking-[0.16em] text-primary">
              {isSuccess ? copy.result.successEyebrow : copy.result.cancelEyebrow}
            </p>
            <h1 className="mt-2 text-[2rem] font-black leading-tight tracking-[-0.04em] text-foreground sm:text-[2.45rem]">
              {isSuccess ? copy.result.successTitle : copy.result.cancelTitle}
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-foreground/64">
              {isSuccess ? copy.result.successDescription : copy.result.cancelDescription}
            </p>

            <div className="mx-auto mt-6 max-w-md rounded-[12px] border border-border/70 bg-section-bg p-4 text-start">
              <div className="flex items-center justify-between gap-4 text-xs font-bold text-foreground/58">
                <span>{copy.result.orderNumber}</span>
                <span>{order.orderNumber}</span>
              </div>
              <h2 className="mt-4 text-sm font-black text-foreground">{copy.result.purchasedItems}</h2>
              <div className="mt-3 space-y-3">
                {order.items.map((item) => (
                  <CheckoutItemRow key={`${item.type}-${item.id}`} item={item} copy={copy} compact />
                ))}
              </div>
            </div>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {isSuccess ? (
                <>
                  <Button href="/library" className="rounded-full">
                    <LibraryBig className="h-4 w-4" aria-hidden="true" />
                    {copy.result.goToLibrary}
                  </Button>
                  <Button href="/courses" variant="secondary" className="rounded-full">
                    {copy.result.browseMore}
                  </Button>
                </>
              ) : (
                <>
                  <Button href="/checkout" className="rounded-full">{copy.result.retryCheckout}</Button>
                  <Button href="/courses" variant="secondary" className="rounded-full">{copy.result.backToCatalog}</Button>
                </>
              )}
            </div>
          </div>
        </Card>
      </Reveal>
    </div>
  );
}

export async function OrdersPage() {
  const locale = await getCurrentLocale();
  const copy = getCheckoutCopy(locale);
  const orders = getMockOrders(locale);

  return (
    <div className="min-h-full bg-section-bg">
      <section className="border-b border-border/60 bg-section-bg">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-7 sm:px-6 lg:px-8 lg:pb-10 lg:pt-9">
          <Reveal preset="fadeUp" className="max-w-3xl">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-primary">{copy.orders.eyebrow}</p>
            <h1 className="mt-3 text-[2rem] font-black leading-tight tracking-[-0.04em] text-foreground sm:text-[2.6rem]">
              {copy.orders.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground/68 sm:text-[0.95rem]">{copy.orders.subtitle}</p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {orders.length > 0 ? (
          <div className="grid gap-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} copy={copy} />
            ))}
          </div>
        ) : (
          <CheckoutEmptyState copy={copy} />
        )}
      </section>
    </div>
  );
}

function OrderCard({ order, copy }: Readonly<{ order: OrderView; copy: CheckoutCopy }>) {
  const statusClass =
    order.status === "paid"
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
      : order.status === "pending"
        ? "bg-amber-500/12 text-amber-700 dark:text-amber-300"
        : "bg-danger/10 text-danger";

  return (
    <Reveal preset="fadeUp">
      <Card className="overflow-hidden rounded-[16px] bg-surface shadow-[0_10px_30px_rgba(17,24,39,0.05)]">
        <div className="grid gap-4 p-5 md:grid-cols-[1.1fr_0.8fr_0.6fr_0.55fr_auto] md:items-center">
          <div>
            <p className="text-xs font-bold text-foreground/50">{order.orderNumber}</p>
            <p className="mt-1 text-sm font-black text-foreground">{order.itemCount} {copy.orders.items}</p>
          </div>
          <div className="text-sm">
            <p className="text-xs font-bold text-foreground/45">{copy.orders.date}</p>
            <p className="mt-1 font-semibold text-foreground/72">{order.date}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-foreground/45">{copy.orders.status}</p>
            <span className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-black ${statusClass}`}>{order.statusLabel}</span>
          </div>
          <div>
            <p className="text-xs font-bold text-foreground/45">{copy.orders.total}</p>
            <p className="mt-1 text-sm font-black text-foreground">{order.total}</p>
          </div>
          <details className="group md:text-end">
            <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-full bg-primary/8 px-4 py-2 text-xs font-black text-primary transition hover:bg-primary/12">
              {copy.orders.details}
              <ArrowRight className="h-3.5 w-3.5 transition group-open:rotate-90 rtl:rotate-180 rtl:group-open:rotate-90" aria-hidden="true" />
            </summary>
          </details>
        </div>
        <details className="group border-t border-border/60 px-5 pb-5 md:hidden">
          <summary className="sr-only">{copy.orders.details}</summary>
        </details>
        <div className="mx-5 mb-5 rounded-[12px] border border-border/70 bg-section-bg p-4 text-start">
          <p className="text-sm font-black text-foreground">{copy.orders.paymentSummary}</p>
          <p className="mt-1 text-xs leading-5 text-foreground/58">{order.paymentSummary}</p>
          <div className="mt-4 grid gap-3">
            {order.items.map((item) => (
              <CheckoutItemRow key={`${order.id}-${item.type}-${item.id}`} item={item} copy={copy} compact />
            ))}
          </div>
        </div>
      </Card>
    </Reveal>
  );
}

export async function LibraryPage() {
  const locale = await getCurrentLocale();
  const copy = getCheckoutCopy(locale);
  const order = getMockOrder(locale);
  const courses = order.items.filter((item) => item.type === "course");
  const books = order.items.filter((item) => item.type === "book");

  return (
    <div className="min-h-full bg-section-bg">
      <section className="border-b border-border/60 bg-section-bg">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-7 sm:px-6 lg:px-8 lg:pb-10 lg:pt-9">
          <Reveal preset="fadeUp" className="max-w-3xl">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-primary">{copy.library.eyebrow}</p>
            <h1 className="mt-3 text-[2rem] font-black leading-tight tracking-[-0.04em] text-foreground sm:text-[2.6rem]">
              {copy.library.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground/68 sm:text-[0.95rem]">{copy.library.subtitle}</p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-7 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-10">
        <LibraryPanel title={copy.library.coursesTab} items={courses} copy={copy} actionLabel={copy.library.continueLearning} emptyHref="/courses" emptyLabel={copy.library.browseCourses} />
        <LibraryPanel title={copy.library.booksTab} items={books} copy={copy} actionLabel={copy.library.accessBook} emptyHref="/books" emptyLabel={copy.library.browseBooks} />
      </section>
    </div>
  );
}

function LibraryPanel({
  title,
  items,
  copy,
  actionLabel,
  emptyHref,
  emptyLabel,
}: Readonly<{
  title: string;
  items: CheckoutItemView[];
  copy: CheckoutCopy;
  actionLabel: string;
  emptyHref: string;
  emptyLabel: string;
}>) {
  return (
    <Reveal preset="fadeUp">
      <Card className="rounded-[16px] bg-surface p-5 shadow-[0_10px_30px_rgba(17,24,39,0.05)]">
        <div className="mb-4 flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] bg-primary/8 text-primary">
            <PackageCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 className="text-lg font-black tracking-[-0.03em] text-foreground">{title}</h2>
        </div>

        {items.length > 0 ? (
          <div className="grid gap-3">
            {items.map((item) => (
              <div key={`${item.type}-${item.id}`}>
                <CheckoutItemRow item={item} copy={copy} compact />
                <Button href={item.href} variant="secondary" size="sm" className="mt-2 w-full rounded-full">
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  {actionLabel}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[12px] border border-dashed border-border bg-section-bg p-5 text-center">
            <ShieldCheck className="mx-auto h-8 w-8 text-primary" aria-hidden="true" />
            <h3 className="mt-3 text-sm font-black text-foreground">{copy.library.emptyTitle}</h3>
            <p className="mt-1 text-xs leading-5 text-foreground/58">{copy.library.emptyDescription}</p>
            <Button href={emptyHref} size="sm" className="mt-4 rounded-full">{emptyLabel}</Button>
          </div>
        )}
      </Card>
    </Reveal>
  );
}
