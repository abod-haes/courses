"use client";

import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { websiteSessionKey } from "@/shared/api/website-session";
import { writeStoredCheckoutItems } from "../checkout-storage";
import type { CheckoutItemType } from "../checkout.types";

type ProtectedCheckoutButtonProps = Readonly<{
  itemType: CheckoutItemType;
  itemId: string | number;
  children: React.ReactNode;
  className?: string;
}>;

function checkoutPath(itemType: CheckoutItemType, itemId: string | number): string {
  return `/checkout?itemType=${encodeURIComponent(itemType)}&itemId=${encodeURIComponent(String(itemId))}`;
}

export function ProtectedCheckoutButton({ itemType, itemId, children, className }: ProtectedCheckoutButtonProps) {
  const router = useRouter();

  function handleClick() {
    const nextPath = checkoutPath(itemType, itemId);
    const hasSession = window.localStorage.getItem(websiteSessionKey);

    if (!hasSession) {
      router.push(`/login?redirectTo=${encodeURIComponent(nextPath)}`);
      return;
    }

    writeStoredCheckoutItems([{ type: itemType, id: Number(itemId), quantity: 1 }]);
    router.push(nextPath);
  }

  return (
    <Button type="button" onClick={handleClick} className={className}>
      <ShoppingCart className="h-4 w-4" aria-hidden="true" />
      {children}
    </Button>
  );
}
