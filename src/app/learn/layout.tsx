import type { Metadata } from "next";
import { createPrivatePageMetadata } from "@/shared/lib/seo";

export const metadata: Metadata = createPrivatePageMetadata("Learning Area | IASS");

export default function LearnLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
