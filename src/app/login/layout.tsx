import type { Metadata } from "next";
import { createPrivatePageMetadata } from "@/shared/lib/seo";

export const metadata: Metadata = createPrivatePageMetadata("Login | IASS");

export default function LoginLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
