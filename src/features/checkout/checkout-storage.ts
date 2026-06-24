export const checkoutCartStorageKey = "iass:checkout:cart";

export type StoredCheckoutItem = Readonly<{
  type: "course" | "book";
  id: number;
  quantity?: number;
}>;

export function readStoredCheckoutItems(): StoredCheckoutItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(checkoutCartStorageKey);
    const parsed = raw ? JSON.parse(raw) : [];

    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is StoredCheckoutItem => {
      if (!item || typeof item !== "object") return false;
      const value = item as Partial<StoredCheckoutItem>;
      return (value.type === "course" || value.type === "book") && typeof value.id === "number";
    });
  } catch {
    return [];
  }
}

export function writeStoredCheckoutItems(items: StoredCheckoutItem[]): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(checkoutCartStorageKey, JSON.stringify(items));
  window.dispatchEvent(new Event("iass:checkout-cart-changed"));
}

export function clearStoredCheckoutItems(): void {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(checkoutCartStorageKey);
  window.dispatchEvent(new Event("iass:checkout-cart-changed"));
}
