import { BooksPage, generateBooksMetadata } from "@/features/books/books-page.component";

export const generateMetadata = generateBooksMetadata;

export default function Page() {
  return <BooksPage />;
}
