"use client";

import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { websiteSessionCookieName, websiteSessionKey } from "@/shared/api/website-session";
import { readStoredCheckoutItems, writeStoredCheckoutItems } from "../checkout-storage";
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

function hasSessionCookie(): boolean {
  return document.cookie.split(";").some((cookie) => cookie.trim().startsWith(`${websiteSessionCookieName}=`));
}

function hasWebsiteSession(): boolean {
  return Boolean(window.localStorage.getItem(websiteSessionKey) || hasSessionCookie());
}

export function ProtectedCheckoutButton({ itemType, itemId, children, className }: ProtectedCheckoutButtonProps) {
  const router = useRouter();

  function handleClick() {
    const nextPath = checkoutPath(itemType, itemId);

    if (!hasWebsiteSession()) {
      router.push(`/login?redirectTo=${encodeURIComponent(nextPath)}`);
      return;
    }

    const numericId = Number(itemId);
    const currentItems = readStoredCheckoutItems();
    const exists = currentItems.some((item) => item.type === itemType && item.id === numericId);

    writeStoredCheckoutItems(exists ? currentItems : [...currentItems, { type: itemType, id: numericId, quantity: 1 }]);
    router.push(nextPath);
  }

  return (
    <Button type="button" onClick={handleClick} className={className}>
      <ShoppingCart className="h-4 w-4" aria-hidden="true" />
      {children}
    </Button>
  );
}
