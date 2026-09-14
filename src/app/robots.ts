import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "@/shared/lib/seo";

const privateRoutes = [
  "/api/",
  "/checkout",
  "/payment/",
  "/library",
  "/orders",
  "/learn/",
  "/login",
  "/register",
  "/forgot-password",
  "/forget-password",
  "/reset-password",
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [...privateRoutes],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteConfig.url,
  };
}
