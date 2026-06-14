import type { Locale } from "@/shared/lib/types";
import type { BookCatalogItem, BookItemView, BooksPageCopy } from "./books.types";

const booksPageCopyByLocale: Readonly<Record<Locale, BooksPageCopy>> = {
  en: {
    meta: {
      title: "Books Library - IASS",
      description: "Browse IASS digital books, clinical references, and focused study guides in a clean searchable library.",
      ogTitle: "IASS Books Library",
      ogDescription: "Search and explore curated medical, beauty, and professional learning books from IASS.",
    },
    eyebrow: "IASS digital library",
    title: "Medical Library",
    subtitle:
      "Access our comprehensive collection of medical texts, reference books, and clinical guides. Essential reading for students and professionals.",
    searchPlaceholder: "Search by title, author, or ISBN...",
    filters: {
      all: "All Books",
    },
    stats: {
      books: "Curated books",
      categories: "Focused categories",
      access: "Digital access",
    },
    labels: {
      isbn: "ISBN",
      viewDetails: "View Details",
      results: "books found",
      noResultsTitle: "No books found",
      noResultsDescription: "Try another search term or select a different category.",
    },
  },
  ar: {
    meta: {
      title: "مكتبة الكتب - IASS",
      description: "تصفح كتب IASS الرقمية والمراجع السريرية وأدلة الدراسة ضمن مكتبة واضحة وقابلة للبحث.",
      ogTitle: "مكتبة كتب IASS",
      ogDescription: "ابحث واستكشف كتبًا مختارة في الطب والجمال والتعلم المهني من IASS.",
    },
    eyebrow: "مكتبة IASS الرقمية",
    title: "مكتبة الكتب الطبية",
    subtitle:
      "تصفح مجموعة شاملة من الكتب الطبية والمراجع السريرية وأدلة الدراسة، مصممة للطلاب والمهنيين بطريقة واضحة ومنظمة.",
    searchPlaceholder: "ابحث بالعنوان أو المؤلف أو رقم ISBN...",
    filters: {
      all: "كل الكتب",
    },
    stats: {
      books: "كتب مختارة",
      categories: "تصنيفات مركزة",
      access: "وصول رقمي",
    },
    labels: {
      isbn: "ISBN",
      viewDetails: "عرض التفاصيل",
      results: "كتاب متاح",
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
    coverTone: "slate",
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
    coverTone: "blue",
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
    coverTone: "teal",
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
    coverTone: "cyan",
  },
  {
    id: "clinical-dermatology-atlas",
    title: {
      en: "Clinical Dermatology Atlas",
      ar: "أطلس الأمراض الجلدية السريري",
    },
    author: {
      en: "IASS Editorial Team",
      ar: "فريق تحرير IASS",
    },
    categoryKey: "dermatology",
    category: {
      en: "Dermatology",
      ar: "الجلدية",
    },
    description: {
      en: "A practical atlas for identifying common skin conditions and connecting observations with safe next steps.",
      ar: "أطلس عملي يساعد على تمييز الحالات الجلدية الشائعة وربط الملاحظات بالخطوات الآمنة التالية.",
    },
    price: "$76.00",
    isbn: "978-1-8619-7113-1",
    href: "/books/clinical-dermatology-atlas",
    coverTone: "violet",
  },
  {
    id: "aesthetic-consultation-handbook",
    title: {
      en: "Aesthetic Consultation Handbook",
      ar: "دليل الاستشارة الجمالية",
    },
    author: {
      en: "IASS Faculty",
      ar: "هيئة تدريس IASS",
    },
    categoryKey: "aesthetics",
    category: {
      en: "Aesthetics",
      ar: "الجماليات",
    },
    description: {
      en: "A concise handbook for professional consultation, service planning, client communication, and safety basics.",
      ar: "دليل مختصر للاستشارة المهنية، تخطيط الخدمة، التواصل مع العميل، وأساسيات السلامة.",
    },
    price: "$68.50",
    isbn: "978-1-4919-1889-0",
    href: "/books/aesthetic-consultation-handbook",
    coverTone: "emerald",
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
    coverTone: book.coverTone,
  }));
}
