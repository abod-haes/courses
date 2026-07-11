import { cookies as requestCookies } from "next/headers";
import { CheckoutPage, generateCheckoutMetadata } from "@/features/checkout/checkout-pages.component";
import { CheckoutCartCookieSync } from "@/features/checkout/components/checkout-cart-sync.component";
import { checkoutCartCookieName, parseStoredCheckoutItems } from "@/features/checkout/checkout-storage";

export const generateMetadata = generateCheckoutMetadata;

type PageProps = Readonly<{
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}>;

function encodeCartItems(value: ReturnType<typeof parseStoredCheckoutItems>): string | undefined {
  if (!value.length) return undefined;
  return encodeURIComponent(JSON.stringify(value));
}

export default async function Page(props: PageProps) {
  const params = props.searchParams ? await props.searchParams : {};
  const store = await requestCookies();
  const savedItems = parseStoredCheckoutItems(store.get(checkoutCartCookieName)?.value);
  const hasDirectItem = Boolean(params.itemType && params.itemId);
  const cartItems = hasDirectItem ? undefined : encodeCartItems(savedItems);
  const nextParams = cartItems ? { ...params, cartItems } : params;

  return (
    <>
      <CheckoutCartCookieSync cookieCount={savedItems.length} />
      <CheckoutPage searchParams={Promise.resolve(nextParams)} />
    </>
  );
}
