import type { Metadata } from "next";
import { createPrivatePageMetadata } from "@/shared/lib/seo";

export const metadata: Metadata = createPrivatePageMetadata("Payment Status | IASS");

export default function PaymentLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
