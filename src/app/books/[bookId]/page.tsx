import { BookDetailPage, generateBookDetailMetadata } from "@/features/books/book-detail-page.component";

type PageProps = Readonly<{
  params: Promise<{ bookId: string }>;
}>;

export async function generateMetadata(props: PageProps) {
  const { bookId } = await props.params;
  return generateBookDetailMetadata(bookId);
}

export default async function BookRoutePage(props: PageProps) {
  const { bookId } = await props.params;
  return <BookDetailPage bookId={bookId} />;
}
