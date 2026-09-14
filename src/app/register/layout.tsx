import type { Metadata } from "next";
import { createPrivatePageMetadata } from "@/shared/lib/seo";

export const metadata: Metadata = createPrivatePageMetadata("Create Account | IASS");

export default function RegisterLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
