import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "IASS - International Academy of Aesthetic Science and Skills",
    short_name: "IASS",
    description: "Medical courses, digital books, and educational articles for aesthetic medicine professionals and students.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f9f9ff",
    theme_color: "#004ac6",
    categories: ["education", "medical"],
    icons: [
      {
        src: "/images/logo-blue.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
