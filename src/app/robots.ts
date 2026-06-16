import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/shared/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/checkout", "/payment/", "/library", "/orders"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
