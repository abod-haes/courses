import { BookDownloadRedirect } from "@/features/checkout/components/book-download-redirect.component";

type PageProps = Readonly<{
  params: Promise<{ bookId: string }>;
}>;

export default async function Page({ params }: PageProps) {
  const { bookId } = await params;

  return <BookDownloadRedirect bookId={bookId} />;
}
