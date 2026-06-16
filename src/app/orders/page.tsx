import { OrdersPage, generateOrdersMetadata } from "@/features/checkout/checkout-pages.component";

export const generateMetadata = generateOrdersMetadata;

export default function Page() {
  return <OrdersPage />;
}
