"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { ApiError } from "@/shared/api/client";
import { websiteSessionCookieName, websiteSessionKey } from "@/shared/api/website-session";
import { createCheckoutSession } from "../checkout.api";
import type { CheckoutItemView } from "../checkout.types";

type CheckoutSubmitButtonProps = Readonly<{
  items: CheckoutItemView[];
  label: string;
  loginRequiredLabel: string;
}>;

function hasSessionCookie(): boolean {
  return document.cookie.split(";").some((cookie) => cookie.trim().startsWith(`${websiteSessionCookieName}=`));
}

function hasWebsiteSession(): boolean {
  return Boolean(window.localStorage.getItem(websiteSessionKey) || hasSessionCookie());
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function firstValidationMessage(details: unknown): string | null {
  if (!isRecord(details)) return null;
  const errors = isRecord(details.errors) ? details.errors : null;
  const itemErrors = errors?.items;

  if (Array.isArray(itemErrors)) {
    const message = itemErrors.find((item): item is string => typeof item === "string" && item.trim().length > 0);
    if (message) return message;
  }

  return typeof details.message === "string" && details.message.trim() ? details.message : null;
}

function translateCheckoutValidation(message: string, isArabic: boolean): string {
  if (!isArabic) return message;

  const normalized = message.toLowerCase();

  if (normalized.includes("currency") && normalized.includes("not supported")) {
    return "عملة العنصر لا تطابق عملة الدفع المعتمدة. يجب أن تكون أسعار الكورسات والكتب بعملة USD.";
  }

  if (normalized.includes("selected book") && normalized.includes("not available")) {
    return "الكتاب المحدد لم يعد متاحًا للشراء.";
  }

  if (normalized.includes("selected course") && normalized.includes("not available")) {
    return "الكورس المحدد لم يعد متاحًا للشراء.";
  }

  if (normalized.includes("already own") && normalized.includes("book")) {
    return "هذا الكتاب موجود بالفعل في مكتبتك.";
  }

  if (normalized.includes("already own") && normalized.includes("course")) {
    return "هذا الكورس موجود بالفعل في مكتبتك.";
  }

  return "تعذر إنشاء عملية الدفع. تحقق من بيانات العنصر وحاول مرة أخرى.";
}

function checkoutErrorMessage(error: unknown): string {
  const isArabic = document.documentElement.lang === "ar" || document.documentElement.dir === "rtl";

  if (error instanceof ApiError && error.status === 422) {
    const validationMessage = firstValidationMessage(error.details);
    if (validationMessage) return translateCheckoutValidation(validationMessage, isArabic);
    return isArabic ? "تعذر إنشاء عملية الدفع. تأكد من أن العناصر ما زالت متاحة." : "Could not create checkout. Please make sure the selected items are still available.";
  }

  if (error instanceof ApiError && error.status === 401) {
    return isArabic ? "انتهت الجلسة. سجّل الدخول من جديد للمتابعة." : "Your session expired. Please log in again to continue.";
  }

  return isArabic ? "حدث خطأ أثناء بدء الدفع. حاول مرة أخرى." : "Something went wrong while starting checkout. Please try again.";
}

export function CheckoutSubmitButton({ items, label, loginRequiredLabel }: CheckoutSubmitButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    const currentPath = `${window.location.pathname}${window.location.search}`;

    if (!hasWebsiteSession()) {
      router.push(`/login?redirectTo=${encodeURIComponent(currentPath)}`);
      return;
    }

    setIsPending(true);
    setError(null);

    try {
      const checkoutUrl = await createCheckoutSession(items);
      window.location.assign(checkoutUrl);
    } catch (checkoutError) {
      setError(checkoutErrorMessage(checkoutError) || loginRequiredLabel);
      setIsPending(false);
    }
  }

  return (
    <div className="mt-5">
      <Button type="button" disabled={isPending || items.length === 0} onClick={handleCheckout} className="w-full rounded-[9px]">
        <LockKeyhole className="h-4 w-4" aria-hidden="true" />
        {isPending ? "..." : label}
      </Button>
      {error ? <p className="mt-2 rounded-[10px] border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-center text-xs font-semibold text-amber-700 dark:text-amber-300">{error}</p> : null}
    </div>
  );
}
