"use client";

import { useEffect } from "react";
import { clearStoredCheckoutItems, readStoredCheckoutItems, writeStoredCheckoutItems } from "../checkout-storage";

const checkoutCookieSyncAttemptKey = "iass:checkout:cookie-sync-attempted";

export function CheckoutCartCookieSync({ cookieCount }: Readonly<{ cookieCount: number }>) {
  useEffect(() => {
    if (cookieCount > 0) {
      window.sessionStorage.removeItem(checkoutCookieSyncAttemptKey);
      return;
    }

    const storedItems = readStoredCheckoutItems();
    if (storedItems.length === 0) {
      window.sessionStorage.removeItem(checkoutCookieSyncAttemptKey);
      return;
    }

    if (window.sessionStorage.getItem(checkoutCookieSyncAttemptKey) === "1") return;

    window.sessionStorage.setItem(checkoutCookieSyncAttemptKey, "1");
    writeStoredCheckoutItems(storedItems);
    window.location.replace("/checkout");
  }, [cookieCount]);

  return null;
}

export function ClearCheckoutCartOnMount() {
  useEffect(() => {
    clearStoredCheckoutItems();
    window.sessionStorage.removeItem(checkoutCookieSyncAttemptKey);
  }, []);

  return null;
}
