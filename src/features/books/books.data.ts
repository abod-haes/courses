import type { Locale } from "@/shared/lib/types";
import type { BookCatalogItem, BookItemView, BooksPageCopy } from "./books.types";

const booksPageCopyByLocale: Readonly<Record<Locale, BooksPageCopy>> = {
  en: {
    meta: {
      title: "Medical Library - IASS",
      description: "Access a clean searchable library of medical textbooks, reference books, and clinical guides.",
      ogTitle: "IASS Medical Library",
      ogDescription: "Browse medical books and clinical guides in a simple, focused library experience.",
    },
    title: "Medical Library",
    subtitle:
      "Access our comprehensive collection of medical texts, reference books, and clinical guides. Essential reading for students and professionals.",
    searchPlaceholder: "Search by title, author, or ISBN...",
    filters: {
      all: "All Books",
    },
    labels: {
      viewDetails: "View Details",
      noResultsTitle: "No books found",
      noResultsDescription: "Try another search term or select a different category.",
    },
  },
  ar: {
    meta: {
      title: "المكتبة الطبية - IASS",
      description: "تصفح مكتبة واضحة وقابلة للبحث تضم كتبًا طبية ومراجع سريرية وأدلة دراسية.",
      ogTitle: "المكتبة الطبية من IASS",
      ogDescription: "استعرض الكتب الطبية والمراجع السريرية ضمن تجربة مكتبة بسيطة ومنظمة.",
    },
    title: "المكتبة الطبية",
    subtitle:
      "تصفح مجموعة شاملة من الكتب الطبية والمراجع السريرية وأدلة الدراسة، مناسبة للطلاب والمهنيين بطريقة واضحة ومنظمة.",
    searchPlaceholder: "ابحث بالعنوان أو المؤلف أو رقم ISBN...",
    filters: {
      all: "كل الكتب",
    },
    labels: {
      viewDetails: "عرض التفاصيل",
      noResultsTitle: "لا توجد كتب مطابقة",
      noResultsDescription: "جرّب كلمة بحث أخرى أو اختر تصنيفًا مختلفًا.",
    },
  },
};

export const booksCatalog: readonly BookCatalogItem[] = [
  {
    id: "essential-clinical-anatomy",
    title: {
      en: "Essential Clinical Anatomy",
      ar: "أساسيات التشريح السريري",
    },
    author: {
      en: "Dr. Sarah Jenkins",
      ar: "د. سارة جينكنز",
    },
    categoryKey: "anatomy",
    category: {
      en: "Anatomy",
      ar: "التشريح",
    },
    description: {
      en: "A comprehensive guide to clinical anatomy, bridging the gap between basic anatomical concepts and clinical practice.",
      ar: "دليل شامل في التشريح السريري يربط بين المفاهيم التشريحية الأساسية والتطبيق العملي.",
    },
    price: "$89.99",
    isbn: "978-1-4028-9462-6",
    href: "/books/essential-clinical-anatomy",
    image: "/images/book-1.png",
    imageAlt: {
      en: "Essential Clinical Anatomy book cover",
      ar: "غلاف كتاب أساسيات التشريح السريري",
    },
  },
  {
    id: "principles-of-cardiology",
    title: {
      en: "Principles of Cardiology",
      ar: "مبادئ طب القلب",
    },
    author: {
      en: "Michael Chen, MD",
      ar: "د. مايكل تشين",
    },
    categoryKey: "cardiology",
    category: {
      en: "Cardiology",
      ar: "القلبية",
    },
    description: {
      en: "An in-depth exploration of cardiovascular physiology, pathology, and modern diagnostic approaches.",
      ar: "شرح معمّق لفيزيولوجيا القلب والأوعية، الأمراض القلبية، وطرق التشخيص الحديثة.",
    },
    price: "$112.50",
    isbn: "978-0-3217-3561-1",
    href: "/books/principles-of-cardiology",
    image: "/images/book-2.png",
    imageAlt: {
      en: "Principles of Cardiology book cover",
      ar: "غلاف كتاب مبادئ طب القلب",
    },
  },
  {
    id: "operative-surgical-techniques",
    title: {
      en: "Operative Surgical Techniques",
      ar: "تقنيات الجراحة العملية",
    },
    author: {
      en: "Elena Rodriguez, FACS",
      ar: "إيلينا رودريغيز، FACS",
    },
    categoryKey: "surgery",
    category: {
      en: "Surgery",
      ar: "الجراحة",
    },
    description: {
      en: "Step-by-step visual guides to common surgical procedures, featuring high-resolution illustrations.",
      ar: "أدلة مرئية خطوة بخطوة للإجراءات الجراحية الشائعة مع رسومات توضيحية دقيقة.",
    },
    price: "$145.00",
    isbn: "978-1-5661-9289-4",
    href: "/books/operative-surgical-techniques",
    image: "/images/book-1.png",
    imageAlt: {
      en: "Operative Surgical Techniques book cover",
      ar: "غلاف كتاب تقنيات الجراحة العملية",
    },
  },
  {
    id: "fundamentals-of-pediatrics",
    title: {
      en: "Fundamentals of Pediatrics",
      ar: "أساسيات طب الأطفال",
    },
    author: {
      en: "David Thompson, MD",
      ar: "د. ديفيد طومسون",
    },
    categoryKey: "pediatrics",
    category: {
      en: "Pediatrics",
      ar: "الأطفال",
    },
    description: {
      en: "Core concepts in pediatric medicine, covering growth, development, and common childhood illnesses.",
      ar: "مفاهيم أساسية في طب الأطفال تشمل النمو والتطور والأمراض الشائعة في الطفولة.",
    },
    price: "$95.00",
    isbn: "978-0-5965-2000-3",
    href: "/books/fundamentals-of-pediatrics",
    image: "/images/book-2.png",
    imageAlt: {
      en: "Fundamentals of Pediatrics book cover",
      ar: "غلاف كتاب أساسيات طب الأطفال",
    },
  },
];

export function getBooksPageCopy(locale: Locale): BooksPageCopy {
  return booksPageCopyByLocale[locale];
}

export function getBooks(locale: Locale): BookItemView[] {
  return booksCatalog.map((book) => ({
    id: book.id,
    title: book.title[locale],
    author: book.author[locale],
    categoryKey: book.categoryKey,
    category: book.category[locale],
    description: book.description[locale],
    price: book.price,
    isbn: book.isbn,
    href: book.href,
    image: book.image,
    imageAlt: book.imageAlt[locale],
  }));
}
