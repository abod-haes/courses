import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/hero.jpg",
        destination: "/images/hero-blue.png",
        permanent: true,
      },
      {
        source: "/about",
        destination: "/about-us",
        permanent: false,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
