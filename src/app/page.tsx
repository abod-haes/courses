import type { Metadata } from "next";
import { generateHomeMetadata, HomePage } from "@/features/home/home-page.component";

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await generateHomeMetadata();
  const socialImage = {
    url: "/images/hero-blue.png",
    width: 1200,
    height: 630,
    alt: "IASS aesthetic medicine academy",
  };

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      images: [socialImage],
    },
    twitter: {
      ...metadata.twitter,
      images: [socialImage.url],
    },
  };
}

export default function Page() {
  return <HomePage />;
}
