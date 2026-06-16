import { cleanJsonLd, type JsonLdData } from "@/shared/lib/seo";

type JsonLdProps = Readonly<{
  data: JsonLdData | readonly JsonLdData[];
}>;

export function JsonLd({ data }: JsonLdProps) {
  const payload = JSON.stringify(cleanJsonLd(data as JsonLdData)).replace(/</g, "\\u003c");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: payload }} />;
}
