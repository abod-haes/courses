import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "IASS",
    short_name: "IASS",
    description: "Digital courses, books, and articles platform.",
    start_url: "/",
    display: "standalone",
    background_color: "#f9f9ff",
    theme_color: "#004ac6",
    icons: [{ src: "/images/logo-blue.png", sizes: "512x512", type: "image/png" }],
  };
}
