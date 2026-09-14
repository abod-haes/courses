import type { Metadata } from "next";
import { createPrivatePageMetadata } from "@/shared/lib/seo";

export const metadata: Metadata = createPrivatePageMetadata("My Library | IASS");

export default function LibraryLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
