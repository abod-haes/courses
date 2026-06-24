"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { websiteSessionKey } from "@/shared/api/website-session";
import type { CheckoutItemView } from "../checkout.types";

type CheckoutSubmitButtonProps = Readonly<{
  items: CheckoutItemView[];
  label: string;
  loginRequiredLabel: string;
}>;

function paymentUnavailableMessage(): string {
  const isArabic = document.documentElement.lang === "ar" || document.documentElement.dir === "rtl";
  return isArabic ? "لم يتم بناء ميزة الدفع بعد. سنربط Stripe عندما يجهز الباك." : "Payment has not been built yet. Stripe will be connected when the backend is ready.";
}

export function CheckoutSubmitButton({ items, label, loginRequiredLabel }: CheckoutSubmitButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleCheckout() {
    const hasSession = window.localStorage.getItem(websiteSessionKey);
    const currentPath = `${window.location.pathname}${window.location.search}`;

    if (!hasSession) {
      router.push(`/login?redirectTo=${encodeURIComponent(currentPath)}`);
      return;
    }

    setIsPending(true);
    setError(null);

    window.setTimeout(() => {
      setError(paymentUnavailableMessage() || loginRequiredLabel);
      setIsPending(false);
    }, 180);
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
