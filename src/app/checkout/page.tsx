import { cookies as requestCookies } from "next/headers";
import { CheckoutPage, generateCheckoutMetadata } from "@/features/checkout/checkout-pages.component";

type PageProps = Readonly<{
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}>;

export const generateMetadata = generateCheckoutMetadata;

type CartItem = { type?: unknown; id?: unknown };

function readFirstItem(value: string | undefined): Record<string, string> {
  if (!value) return {};

  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as unknown;
    const item = Array.isArray(parsed) ? (parsed[0] as CartItem | undefined) : undefined;
    const type = item?.type === "course" || item?.type === "book" ? item.type : undefined;
    const id = typeof item?.id === "number" || typeof item?.id === "string" ? String(item.id) : undefined;
    return type && id ? { itemType: type, itemId: id } : {};
  } catch {
    return {};
  }
}

export default async function Page(props: PageProps) {
  const params = props.searchParams ? await props.searchParams : {};

  if (params.itemType && params.itemId) {
    return <CheckoutPage searchParams={Promise.resolve(params)} />;
  }

  const store = await requestCookies();
  const savedItem = readFirstItem(store.get("iass_checkout_cart")?.value);

  return <CheckoutPage searchParams={Promise.resolve({ ...params, ...savedItem })} />;
}
