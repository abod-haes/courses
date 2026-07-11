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

const checkoutPath = "/checkout";

function hasSessionCookie(): boolean {
  return document.cookie.split(";").some((cookie) => cookie.trim().startsWith(`${websiteSessionCookieName}=`));
}

function hasWebsiteSession(): boolean {
  return Boolean(window.localStorage.getItem(websiteSessionKey) || hasSessionCookie());
}

export function ProtectedCheckoutButton({ itemType, itemId, children, className }: ProtectedCheckoutButtonProps) {
  const router = useRouter();

  function handleClick() {
    const numericId = Number(itemId);

    if (!Number.isInteger(numericId) || numericId < 1) {
      return;
    }

    const currentItems = readStoredCheckoutItems();
    const exists = currentItems.some((item) => item.type === itemType && item.id === numericId);
    writeStoredCheckoutItems(exists ? currentItems : [...currentItems, { type: itemType, id: numericId, quantity: 1 }]);

    if (!hasWebsiteSession()) {
      router.push(`/login?redirectTo=${encodeURIComponent(checkoutPath)}`);
      return;
    }

    router.push(checkoutPath);
  }

  return (
    <Button type="button" onClick={handleClick} className={className}>
      <ShoppingCart className="h-4 w-4" aria-hidden="true" />
      {children}
    </Button>
  );
}
