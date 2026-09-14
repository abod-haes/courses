import type { Metadata } from "next";
import { createPrivatePageMetadata } from "@/shared/lib/seo";

export const metadata: Metadata = createPrivatePageMetadata("Password Recovery | IASS");

export default function ForgetPasswordLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
