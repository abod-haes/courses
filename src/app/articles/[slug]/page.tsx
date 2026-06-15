import { ArticleDetailsPage, generateArticleDetailsMetadata } from "@/features/articles/articles-page.component";

export const generateMetadata = generateArticleDetailsMetadata;

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <ArticleDetailsPage params={params} />;
}
