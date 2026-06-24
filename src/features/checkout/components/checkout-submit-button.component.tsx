"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { websiteSessionKey } from "@/shared/api/website-session";
import { createCheckoutSession } from "../checkout.api";
import type { CheckoutItemView } from "../checkout.types";

type CheckoutSubmitButtonProps = Readonly<{
  items: CheckoutItemView[];
  label: string;
  loginRequiredLabel: string;
}>;

export function CheckoutSubmitButton({ items, label, loginRequiredLabel }: CheckoutSubmitButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    const hasSession = window.localStorage.getItem(websiteSessionKey);
    const currentPath = `${window.location.pathname}${window.location.search}`;

    if (!hasSession) {
      router.push(`/login?redirectTo=${encodeURIComponent(currentPath)}`);
      return;
    }

    setIsPending(true);
    setError(null);

    try {
      const checkoutUrl = await createCheckoutSession(items);
      window.location.assign(checkoutUrl);
    } catch {
      setError(loginRequiredLabel);
      setIsPending(false);
    }
  }

  return (
    <div className="mt-5">
      <Button type="button" disabled={isPending || items.length === 0} onClick={handleCheckout} className="w-full rounded-[9px]">
        <LockKeyhole className="h-4 w-4" aria-hidden="true" />
        {isPending ? "..." : label}
      </Button>
      {error ? <p className="mt-2 text-center text-xs font-semibold text-danger">{error}</p> : null}
    </div>
  );
}
