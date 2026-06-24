"use client";

import { useState } from "react";
import { Loader2, LockKeyhole } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { createCheckout } from "../api/website";
import type { CheckoutItemView } from "../checkout.types";

type CheckoutActionButtonProps = Readonly<{
  items: CheckoutItemView[];
  label: string;
}>;

export function CheckoutActionButton({ items, label }: CheckoutActionButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createCheckout(items.map((item) => ({ type: item.type, id: Number(item.id) })));
      window.location.assign(result.checkoutUrl);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Unable to start checkout.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-5">
      <Button type="button" onClick={handleClick} disabled={isSubmitting || items.length === 0} className="w-full rounded-[9px]">
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <LockKeyhole className="h-4 w-4" aria-hidden="true" />}
        {label}
      </Button>
      {error ? <p className="mt-2 text-xs font-semibold text-danger">{error}</p> : null}
    </div>
  );
}
