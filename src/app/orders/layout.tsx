import type { Metadata } from "next";
import { createPrivatePageMetadata } from "@/shared/lib/seo";

export const metadata: Metadata = createPrivatePageMetadata("Order History | IASS");

export default function OrdersLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
