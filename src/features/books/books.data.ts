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
    detail: {
      backToBooks: "Back to Books",
      addToCart: "Add to Cart",
      saveForLater: "Save for Later",
      secureAccessTitle: "Secure Digital Access",
      productDetailsTitle: "Product Details",
      tabs: {
        description: "Description",
        tableOfContents: "Table of Contents",
        authorBio: "Author Bios",
      },
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
    detail: {
      backToBooks: "العودة إلى الكتب",
      addToCart: "إضافة إلى السلة",
      saveForLater: "حفظ لاحقًا",
      secureAccessTitle: "وصول رقمي آمن",
      productDetailsTitle: "تفاصيل المنتج",
      tabs: {
        description: "الوصف",
        tableOfContents: "جدول المحتويات",
        authorBio: "نبذة عن المؤلف",
      },
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
    details: {
      availability: {
        en: "In Stock · Digital Access Included",
        ar: "متوفر · الوصول الرقمي مشمول",
      },
      accessNote: {
        en: "Includes 12-month access to the interactive e-book platform, featuring labeled anatomy diagrams, review questions, and case-based learning assets.",
        ar: "يتضمن وصولًا لمدة 12 شهرًا إلى منصة الكتاب التفاعلية مع مخططات تشريحية معنونة وأسئلة مراجعة وحالات تعليمية.",
      },
      description: {
        en: [
          "Essential Clinical Anatomy gives students a clear, structured path from basic anatomical regions to practical clinical reasoning. Each chapter connects body systems with examination points, diagnostic language, and common clinical scenarios.",
          "The text is written for medical, nursing, and allied-health learners who need concise explanations supported by visual orientation, clinical pearls, and step-by-step study organization.",
        ],
        ar: [
          "يقدم كتاب أساسيات التشريح السريري مسارًا واضحًا ومنظمًا يربط بين مناطق الجسم الأساسية والتفكير السريري العملي، مع أمثلة تساعد الطالب على فهم العلاقة بين البنية والوظيفة.",
          "صُمم الكتاب لطلاب الطب والتمريض والاختصاصات الصحية، ويجمع بين الشرح المختصر، الملاحظات السريرية، والتنظيم البصري السهل للمراجعة.",
        ],
      },
      highlights: {
        en: [
          "More than 300 labeled anatomical illustrations.",
          "End-of-chapter clinical correlations with guided rationales.",
          "Dedicated sections for nerves, vessels, muscles, and surface anatomy.",
          "Clear concise formatting to support exam revision and clinical preparation.",
        ],
        ar: [
          "أكثر من 300 رسم تشريحي معنونة بوضوح.",
          "ربط سريري في نهاية كل فصل مع تبرير مبسط للإجابات.",
          "أقسام مخصصة للأعصاب والأوعية والعضلات والتشريح السطحي.",
          "تنسيق واضح ومختصر يساعد على المراجعة قبل الامتحان والتطبيق السريري.",
        ],
      },
      tableOfContents: {
        en: [
          "Introduction to Anatomical Language",
          "Back, Spine, and Spinal Cord",
          "Thorax and Cardiopulmonary Landmarks",
          "Abdomen, Pelvis, and Perineum",
          "Upper Limb Anatomy",
          "Lower Limb Anatomy",
          "Head, Neck, and Cranial Nerves",
          "Clinical Imaging and Surface Anatomy Review",
        ],
        ar: [
          "مدخل إلى لغة التشريح",
          "الظهر والعمود الفقري والنخاع الشوكي",
          "الصدر والعلامات القلبية الرئوية",
          "البطن والحوض والعجان",
          "تشريح الطرف العلوي",
          "تشريح الطرف السفلي",
          "الرأس والعنق والأعصاب القحفية",
          "مراجعة التصوير السريري والتشريح السطحي",
        ],
      },
      authorBio: {
        en: [
          "Dr. Sarah Jenkins is a clinical anatomy lecturer with extensive experience teaching foundational anatomy to medical and allied-health students.",
          "Her teaching approach focuses on visual memory, clinical context, and practical examination readiness.",
        ],
        ar: [
          "د. سارة جينكنز محاضرة في التشريح السريري ولديها خبرة واسعة في تعليم التشريح الأساسي لطلاب الطب والاختصاصات الصحية.",
          "تركز طريقتها التعليمية على الذاكرة البصرية، السياق السريري، والتحضير العملي للامتحانات.",
        ],
      },
      productDetails: [
        { label: { en: "ISBN-13", ar: "ISBN-13" }, value: { en: "978-1-4028-9462-6", ar: "978-1-4028-9462-6" } },
        { label: { en: "Format", ar: "الصيغة" }, value: { en: "Hardcover + Digital", ar: "غلاف صلب + رقمي" } },
        { label: { en: "Pages", ar: "عدد الصفحات" }, value: { en: "612", ar: "612" } },
        { label: { en: "Publisher", ar: "الناشر" }, value: { en: "IASS Medical Press", ar: "IASS Medical Press" } },
        { label: { en: "Publication Date", ar: "تاريخ النشر" }, value: { en: "August 2024", ar: "آب 2024" } },
      ],
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
    details: {
      availability: {
        en: "In Stock · Digital Access Included",
        ar: "متوفر · الوصول الرقمي مشمول",
      },
      accessNote: {
        en: "Includes ECG practice files, interactive rhythm strips, and downloadable diagnostic checklists for focused revision.",
        ar: "يتضمن ملفات تدريب على تخطيط القلب وشرائط نظم تفاعلية وقوائم تشخيص قابلة للتحميل للمراجعة المركزة.",
      },
      description: {
        en: [
          "Principles of Cardiology explains cardiovascular structure, physiology, pathology, and diagnostics through a practical clinical lens.",
          "The book moves from heart sounds and ECG interpretation to imaging, emergency presentations, and chronic disease management.",
        ],
        ar: [
          "يشرح كتاب مبادئ طب القلب بنية القلب والفيزيولوجيا والأمراض وطرق التشخيص بمنظور سريري عملي.",
          "ينتقل الكتاب من أصوات القلب وقراءة تخطيط القلب إلى التصوير، الحالات الإسعافية، وتدبير الأمراض المزمنة.",
        ],
      },
      highlights: {
        en: [
          "Structured ECG interpretation workflow.",
          "Clinical cases for common cardiac presentations.",
          "Modern imaging and lab marker summaries.",
          "High-yield revision tables for exams.",
        ],
        ar: [
          "منهجية منظمة لقراءة تخطيط القلب.",
          "حالات سريرية لأشيع التظاهرات القلبية.",
          "ملخصات للتصوير الحديث والواسمات المخبرية.",
          "جداول مراجعة عالية الفائدة للامتحانات.",
        ],
      },
      tableOfContents: {
        en: [
          "Cardiac Anatomy and Circulation",
          "Electrophysiology and ECG Basics",
          "Heart Failure and Cardiomyopathies",
          "Ischemic Heart Disease",
          "Valvular Disease",
          "Arrhythmias and Conduction Disorders",
          "Cardiac Imaging",
          "Emergency Cardiology Review",
        ],
        ar: [
          "تشريح القلب والدوران",
          "الفيزيولوجيا الكهربائية وأساسيات ECG",
          "فشل القلب واعتلالات العضلة القلبية",
          "مرض القلب الإقفاري",
          "أمراض الصمامات",
          "اضطرابات النظم والتوصيل",
          "تصوير القلب",
          "مراجعة الإسعافات القلبية",
        ],
      },
      authorBio: {
        en: [
          "Michael Chen, MD is a cardiology educator focused on simplifying complex diagnostic pathways for medical learners.",
          "He has developed case-based teaching materials used in clinical skills courses and board review programs.",
        ],
        ar: [
          "د. مايكل تشين مدرس في طب القلب يركز على تبسيط المسارات التشخيصية المعقدة للطلاب.",
          "طوّر مواد تعليمية قائمة على الحالات تُستخدم في مقررات المهارات السريرية وبرامج المراجعة.",
        ],
      },
      productDetails: [
        { label: { en: "ISBN-13", ar: "ISBN-13" }, value: { en: "978-0-3217-3561-1", ar: "978-0-3217-3561-1" } },
        { label: { en: "Format", ar: "الصيغة" }, value: { en: "Hardcover + Digital", ar: "غلاف صلب + رقمي" } },
        { label: { en: "Pages", ar: "عدد الصفحات" }, value: { en: "842", ar: "842" } },
        { label: { en: "Publisher", ar: "الناشر" }, value: { en: "IASS Medical Press", ar: "IASS Medical Press" } },
        { label: { en: "Publication Date", ar: "تاريخ النشر" }, value: { en: "August 2024", ar: "آب 2024" } },
      ],
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
    details: {
      availability: {
        en: "In Stock · Digital Access Included",
        ar: "متوفر · الوصول الرقمي مشمول",
      },
      accessNote: {
        en: "Includes procedural videos, instrument review cards, and safety checklists for pre-operative preparation.",
        ar: "يتضمن فيديوهات إجرائية وبطاقات مراجعة للأدوات وقوائم سلامة للتحضير قبل الجراحة.",
      },
      description: {
        en: [
          "Operative Surgical Techniques presents essential procedures using structured steps, visual cues, and safety-first explanations.",
          "The guide is designed to help students understand operative flow, identify instruments, and connect anatomy with surgical decisions.",
        ],
        ar: [
          "يعرض كتاب تقنيات الجراحة العملية الإجراءات الأساسية بخطوات منظمة وإشارات بصرية وشروحات تركز على السلامة أولًا.",
          "يساعد الدليل الطلاب على فهم تسلسل العمل الجراحي، تمييز الأدوات، وربط التشريح بالقرار الجراحي.",
        ],
      },
      highlights: {
        en: [
          "Step-by-step procedural breakdowns.",
          "Instrument identification notes.",
          "Sterility and safety checklists.",
          "Common mistakes and prevention tips.",
        ],
        ar: [
          "تفصيل الإجراءات خطوة بخطوة.",
          "ملاحظات لتمييز الأدوات الجراحية.",
          "قوائم تعقيم وسلامة.",
          "أخطاء شائعة ونصائح لتجنبها.",
        ],
      },
      tableOfContents: {
        en: [
          "Operating Room Principles",
          "Surgical Instruments and Sutures",
          "Aseptic Technique",
          "Wound Closure Methods",
          "Abdominal Procedures",
          "Vascular Access",
          "Emergency Surgical Skills",
          "Post-operative Care Basics",
        ],
        ar: [
          "مبادئ غرفة العمليات",
          "الأدوات الجراحية والخيوط",
          "تقنية التعقيم",
          "طرق إغلاق الجروح",
          "إجراءات البطن",
          "الوصول الوعائي",
          "مهارات الجراحة الإسعافية",
          "أساسيات العناية بعد العمل الجراحي",
        ],
      },
      authorBio: {
        en: [
          "Elena Rodriguez, FACS is a surgical educator known for translating operating-room skills into clear visual learning frameworks.",
          "Her work emphasizes safe preparation, anatomy-based decision making, and practical procedural confidence.",
        ],
        ar: [
          "إيلينا رودريغيز، FACS، مدرّسة جراحة معروفة بتحويل مهارات غرفة العمليات إلى أطر تعليمية بصرية واضحة.",
          "تركز أعمالها على التحضير الآمن، اتخاذ القرار المبني على التشريح، وبناء الثقة العملية في الإجراءات.",
        ],
      },
      productDetails: [
        { label: { en: "ISBN-13", ar: "ISBN-13" }, value: { en: "978-1-5661-9289-4", ar: "978-1-5661-9289-4" } },
        { label: { en: "Format", ar: "الصيغة" }, value: { en: "Hardcover + Digital", ar: "غلاف صلب + رقمي" } },
        { label: { en: "Pages", ar: "عدد الصفحات" }, value: { en: "724", ar: "724" } },
        { label: { en: "Publisher", ar: "الناشر" }, value: { en: "IASS Medical Press", ar: "IASS Medical Press" } },
        { label: { en: "Publication Date", ar: "تاريخ النشر" }, value: { en: "July 2024", ar: "تموز 2024" } },
      ],
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
    details: {
      availability: {
        en: "In Stock · Digital Access Included",
        ar: "متوفر · الوصول الرقمي مشمول",
      },
      accessNote: {
        en: "Includes growth-chart tools, immunization review sheets, and pediatric case simulations for applied learning.",
        ar: "يتضمن أدوات مخططات النمو وملخصات اللقاحات ومحاكاة حالات أطفال للتعلم التطبيقي.",
      },
      description: {
        en: [
          "Fundamentals of Pediatrics introduces child health through growth, development, prevention, diagnosis, and family-centered care.",
          "The content is organized for fast review while still explaining the reasoning behind common pediatric decisions.",
        ],
        ar: [
          "يعرض كتاب أساسيات طب الأطفال صحة الطفل من خلال النمو والتطور والوقاية والتشخيص والرعاية المتمحورة حول العائلة.",
          "نُظم المحتوى للمراجعة السريعة مع توضيح التفكير خلف القرارات الشائعة في طب الأطفال.",
        ],
      },
      highlights: {
        en: [
          "Growth and development milestones.",
          "Common pediatric conditions and red flags.",
          "Immunization and prevention summaries.",
          "Family communication and safety notes.",
        ],
        ar: [
          "مراحل النمو والتطور الأساسية.",
          "الحالات الشائعة عند الأطفال وعلامات الخطورة.",
          "ملخصات اللقاحات والوقاية.",
          "ملاحظات التواصل مع العائلة والسلامة.",
        ],
      },
      tableOfContents: {
        en: [
          "Pediatric History and Examination",
          "Growth and Development",
          "Nutrition and Preventive Care",
          "Respiratory Conditions",
          "Gastrointestinal Disorders",
          "Infectious Disease Basics",
          "Pediatric Emergencies",
          "Adolescent Health",
        ],
        ar: [
          "القصة والفحص عند الأطفال",
          "النمو والتطور",
          "التغذية والرعاية الوقائية",
          "الأمراض التنفسية",
          "اضطرابات الجهاز الهضمي",
          "أساسيات الأمراض الإنتانية",
          "إسعافات الأطفال",
          "صحة المراهقين",
        ],
      },
      authorBio: {
        en: [
          "David Thompson, MD is a pediatric clinician and teacher with a focus on practical primary-care pediatrics.",
          "He writes learning materials that help students connect age, development, symptoms, and safe next steps.",
        ],
        ar: [
          "د. ديفيد طومسون طبيب أطفال ومدرس يركز على طب الأطفال العملي في الرعاية الأولية.",
          "يكتب مواد تعليمية تساعد الطلاب على ربط العمر والتطور والأعراض والخطوات الآمنة التالية.",
        ],
      },
      productDetails: [
        { label: { en: "ISBN-13", ar: "ISBN-13" }, value: { en: "978-0-5965-2000-3", ar: "978-0-5965-2000-3" } },
        { label: { en: "Format", ar: "الصيغة" }, value: { en: "Paperback + Digital", ar: "غلاف ورقي + رقمي" } },
        { label: { en: "Pages", ar: "عدد الصفحات" }, value: { en: "538", ar: "538" } },
        { label: { en: "Publisher", ar: "الناشر" }, value: { en: "IASS Medical Press", ar: "IASS Medical Press" } },
        { label: { en: "Publication Date", ar: "تاريخ النشر" }, value: { en: "June 2024", ar: "حزيران 2024" } },
      ],
    },
  },
];

function localizeBook(book: BookCatalogItem, locale: Locale): BookItemView {
  return {
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
    details: {
      availability: book.details.availability[locale],
      accessNote: book.details.accessNote[locale],
      description: book.details.description[locale],
      highlights: book.details.highlights[locale],
      tableOfContents: book.details.tableOfContents[locale],
      authorBio: book.details.authorBio[locale],
      productDetails: book.details.productDetails.map((item) => ({
        label: item.label[locale],
        value: item.value[locale],
      })),
    },
  };
}

export function getBooksPageCopy(locale: Locale): BooksPageCopy {
  return booksPageCopyByLocale[locale];
}

export function getBooks(locale: Locale): BookItemView[] {
  return booksCatalog.map((book) => localizeBook(book, locale));
}

export function getBookById(locale: Locale, bookId: string): BookItemView | undefined {
  const book = booksCatalog.find((item) => item.id === bookId);
  return book ? localizeBook(book, locale) : undefined;
}

export function getBookIds(): string[] {
  return booksCatalog.map((book) => book.id);
}
