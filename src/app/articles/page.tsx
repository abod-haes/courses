import { ArticlesPage, generateArticlesMetadata } from "@/features/articles/articles-page.component";

export const generateMetadata = generateArticlesMetadata;

export default function Page() {
  return <ArticlesPage />;
}
