import { CheckoutPage, generateCheckoutMetadata } from "@/features/checkout/checkout-pages.component";

type PageProps = Readonly<{
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}>;

export const generateMetadata = generateCheckoutMetadata;

export default function Page(props: PageProps) {
  return <CheckoutPage searchParams={props.searchParams} />;
}
