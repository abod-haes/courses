import { CheckoutSuccessPage, generateCheckoutSuccessMetadata } from "@/features/checkout/checkout-pages.component";

export const generateMetadata = generateCheckoutSuccessMetadata;

export default function Page() {
  return <CheckoutSuccessPage />;
}
