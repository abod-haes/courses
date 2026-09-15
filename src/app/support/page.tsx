import type { Metadata } from "next";
import { LegalPage, generateLegalMetadata } from "@/features/legal/legal-pages.component";

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await generateLegalMetadata("support");
  const image = "/images/hero-blue.png";

  return {
    ...metadata,
    openGraph: { ...metadata.openGraph, images: [{ url: image, alt: "IASS" }] },
    twitter: { ...metadata.twitter, images: [image] },
  };
}

export default function Page() {
  return <LegalPage page="support" />;
}
