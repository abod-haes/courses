export const checkoutCartStorageKey = "iass:checkout:cart";
export const checkoutCartCookieName = "iass_checkout_cart";

export type StoredCheckoutItem = Readonly<{
  type: "course" | "book";
  id: number;
  quantity?: number;
}>;

function validItems(value: unknown): StoredCheckoutItem[] {
  if (!Array.isArray(value)) return [];

  return value.filter((item): item is StoredCheckoutItem => {
    if (!item || typeof item !== "object") return false;
    const candidate = item as Partial<StoredCheckoutItem>;
    const id = candidate.id;

    return (candidate.type === "course" || candidate.type === "book") && typeof id === "number" && Number.isInteger(id) && id > 0;
  });
}

export function parseStoredCheckoutItems(raw: string | null | undefined): StoredCheckoutItem[] {
  if (!raw) return [];

  try {
    return validItems(JSON.parse(decodeURIComponent(raw)));
  } catch {
    try {
      return validItems(JSON.parse(raw));
    } catch {
      return [];
    }
  }
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${name}=`;
  const match = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(prefix));

  return match ? match.slice(prefix.length) : null;
}

function writeCartCookie(items: StoredCheckoutItem[]): void {
  if (typeof document === "undefined") return;
  const value = encodeURIComponent(JSON.stringify(items));
  document.cookie = `${checkoutCartCookieName}=${value}; path=/; max-age=604800; SameSite=Lax`;
}

export function readStoredCheckoutItems(): StoredCheckoutItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(checkoutCartStorageKey);
    const items = parseStoredCheckoutItems(raw);
    return items.length ? items : parseStoredCheckoutItems(readCookie(checkoutCartCookieName));
  } catch {
    return parseStoredCheckoutItems(readCookie(checkoutCartCookieName));
  }
}

export function writeStoredCheckoutItems(items: StoredCheckoutItem[]): void {
  if (typeof window === "undefined") return;

  const normalized = validItems(items);
  window.localStorage.setItem(checkoutCartStorageKey, JSON.stringify(normalized));
  writeCartCookie(normalized);
  window.dispatchEvent(new Event("iass:checkout-cart-changed"));
}

export function clearStoredCheckoutItems(): void {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(checkoutCartStorageKey);
  document.cookie = `${checkoutCartCookieName}=; path=/; max-age=0; SameSite=Lax`;
  window.dispatchEvent(new Event("iass:checkout-cart-changed"));
}
