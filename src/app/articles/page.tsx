import { ArticlesPage, generateArticlesMetadata } from "@/features/articles/articles-page.component";

export const generateMetadata = generateArticlesMetadata;

export default function Page({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  return <ArticlesPage searchParams={searchParams} />;
}
