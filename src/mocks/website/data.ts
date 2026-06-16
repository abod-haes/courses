import type { Article, Book, Category, CategoryType, Course } from "@/shared/api/types";
import type { Locale } from "@/shared/lib/types";

type Localized = Readonly<{ en: string; ar: string }>;
type CategorySeed = Readonly<{ id: number; type: CategoryType; slug: string; name: Localized; description: Localized }>;

const images = {
  course: "/images/course-1.png",
  book: "/images/book-1.png",
  article: "/images/course-1.png",
} as const;

const categorySeeds: readonly CategorySeed[] = [
  { id: 1, type: "course", slug: "facial-anatomy", name: { en: "Facial Anatomy", ar: "تشريح الوجه" }, description: { en: "Academic anatomy for aesthetic practice.", ar: "تشريح أكاديمي للممارسة التجميلية." } },
  { id: 2, type: "course", slug: "aesthetic-skills", name: { en: "Aesthetic Skills", ar: "المهارات التجميلية" }, description: { en: "Practical clinical skills and safe planning.", ar: "مهارات سريرية عملية وتخطيط آمن." } },
  { id: 3, type: "course", slug: "aesthetic-protocols", name: { en: "Aesthetic Protocols", ar: "البروتوكولات التجميلية" }, description: { en: "Structured treatment planning and documentation.", ar: "تخطيط علاجي منظم وموثق." } },
  { id: 4, type: "course", slug: "skin-assessment", name: { en: "Skin Assessment", ar: "فحص البشرة" }, description: { en: "Skin, history, and case assessment frameworks.", ar: "أطر فحص الجلد والتاريخ الطبي والحالة." } },
  { id: 5, type: "book", slug: "clinical-reference", name: { en: "Clinical Reference", ar: "مراجع سريرية" }, description: { en: "Digital references for daily clinical practice.", ar: "مراجع رقمية للممارسة السريرية اليومية." } },
  { id: 6, type: "book", slug: "training-tools", name: { en: "Training Tools", ar: "أدوات تدريبية" }, description: { en: "Structured guides and learning tools.", ar: "أدلة وأدوات تعلم منظمة." } },
  { id: 7, type: "book", slug: "safety-guides", name: { en: "Safety Guides", ar: "أدلة الأمان" }, description: { en: "Safety references for professional practice.", ar: "مراجع أمان للممارسة المهنية." } },
  { id: 8, type: "article", slug: "training-philosophy", name: { en: "Training Philosophy", ar: "فلسفة التدريب" }, description: { en: "Academic thinking behind IASS education.", ar: "الفكر الأكاديمي خلف تعليم IASS." } },
  { id: 9, type: "article", slug: "safety-and-anatomy", name: { en: "Safety and Anatomy", ar: "الأمان والتشريح" }, description: { en: "Short reads about anatomy and safe practice.", ar: "قراءات قصيرة عن التشريح والممارسة الآمنة." } },
  { id: 10, type: "article", slug: "professional-path", name: { en: "Professional Path", ar: "المسار المهني" }, description: { en: "Mindset and career development for practitioners.", ar: "العقلية والتطور المهني للممارسين." } },
];

function t(value: Localized, locale: Locale): string {
  return value[locale];
}

export function getMockCategories(locale: Locale, type?: CategoryType): Category[] {
  return categorySeeds
    .filter((category) => !type || category.type === type)
    .map((category) => ({ id: category.id, type: category.type, name: t(category.name, locale), slug: category.slug, description: t(category.description, locale), isActive: true }));
}

function category(locale: Locale, slug: string, type: CategoryType) {
  const item = getMockCategories(locale, type).find((current) => current.slug === slug);
  if (!item) throw new Error(`Missing mock category ${slug}`);
  return { id: item.id, name: item.name, slug: item.slug, type: item.type };
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const courseTitles: readonly Localized[] = [
  { en: "Facial Anatomy and Skin Assessment", ar: "تشريح الوجه وفحص البشرة" },
  { en: "Advanced Aesthetic Skills", ar: "المهارات التجميلية المتقدمة" },
  { en: "Safety and Case Management", ar: "الأمان وإدارة الحالة" },
  { en: "Aesthetic Consultation Masterclass", ar: "ماستر كلاس الاستشارة التجميلية" },
  { en: "Clinical Skin Analysis", ar: "تحليل البشرة السريري" },
  { en: "Natural Results Treatment Planning", ar: "تخطيط علاجي لنتائج طبيعية" },
  { en: "Facial Balance and Proportion", ar: "توازن الوجه والنسب" },
  { en: "Clinic Documentation Workflow", ar: "سير عمل التوثيق السريري" },
];

const bookTitles: readonly Localized[] = [
  { en: "Therapeutic Protocols in Aesthetic Medicine", ar: "البروتوكولات العلاجية في الطب التجميلي" },
  { en: "Aesthetic Measurement Guide", ar: "دليل القياس التجميلي" },
  { en: "Facial Anatomy Safety Reference", ar: "مرجع الأمان التشريحي للوجه" },
  { en: "Clinical Skin Assessment Manual", ar: "دليل فحص البشرة السريري" },
  { en: "Case Management Handbook", ar: "كتيب إدارة الحالات" },
  { en: "Aesthetic Consultation Workbook", ar: "دفتر عمل الاستشارة التجميلية" },
];

const articleTitles: readonly Localized[] = [
  { en: "From Trends to Scientific Protocols", ar: "من الترند إلى البروتوكول العلمي" },
  { en: "Why Anatomical Precision Matters", ar: "لماذا الدقة التشريحية مهمة؟" },
  { en: "Building a Professional Aesthetic Mindset", ar: "بناء عقلية تجميلية محترفة" },
  { en: "How to Read the Face Before Treatment", ar: "كيف تقرأ الوجه قبل العلاج" },
  { en: "Common Planning Mistakes", ar: "أخطاء التخطيط الشائعة" },
  { en: "Clinical Documentation for Aesthetic Results", ar: "التوثيق السريري للنتائج التجميلية" },
];

const courseCategories = ["facial-anatomy", "aesthetic-skills", "aesthetic-protocols", "skin-assessment"] as const;
const bookCategories = ["clinical-reference", "training-tools", "safety-guides"] as const;
const articleCategories = ["training-philosophy", "safety-and-anatomy", "professional-path"] as const;

export function getMockCourses(locale: Locale): Course[] {
  return Array.from({ length: 24 }, (_, index) => {
    const title = courseTitles[index % courseTitles.length];
    const titleText = t(title, locale);
    const minutes = 35 + (index % 4) * 8;

    return {
      id: index + 1,
      title: titleText,
      slug: `${slugify(title.en)}-${index + 1}`,
      shortDescription: locale === "ar" ? `مسار تدريبي منظم في ${titleText} يركز على التشريح، الأمان، والبروتوكولات العملية.` : `A structured training path in ${titleText} focused on anatomy, safety, and practical protocols.`,
      description: locale === "ar" ? "صمم هذا الكورس لمساعدة الأطباء والممارسين على تحويل المعرفة التجميلية إلى خطوات سريرية دقيقة قابلة للتطبيق داخل العيادة." : "This course helps doctors and practitioners turn aesthetic knowledge into precise clinical steps that can be applied inside the clinic.",
      price: 120 + (index % 6) * 35,
      currency: "USD",
      category: category(locale, courseCategories[index % courseCategories.length], "course"),
      thumbnail: { id: 1000 + index, url: images.course, alt: titleText },
      status: "published",
      publishedAt: new Date(Date.UTC(2026, 0, 20 + index)).toISOString(),
      sections: [
        { id: 2000 + index, title: locale === "ar" ? "الأساس العلمي" : "Scientific Foundations", description: locale === "ar" ? "المفاهيم الأساسية قبل التطبيق العملي." : "Core concepts before hands-on application.", sortOrder: 1, lessons: [
          { id: 3000 + index * 2, title: locale === "ar" ? "قراءة الحالة" : "Case Reading", slug: `case-reading-${index + 1}`, summary: locale === "ar" ? "تحليل الحالة قبل اختيار الخطة." : "Analyze the case before choosing the plan.", durationMinutes: minutes, sortOrder: 1, status: "published" },
          { id: 3001 + index * 2, title: locale === "ar" ? "خطوات البروتوكول" : "Protocol Steps", slug: `protocol-steps-${index + 1}`, summary: locale === "ar" ? "تحويل القرار إلى خطوات واضحة." : "Turn decisions into clear steps.", durationMinutes: minutes + 12, sortOrder: 2, status: "published" },
        ] },
      ],
    };
  });
}

export function getMockBooks(locale: Locale): Book[] {
  return Array.from({ length: 24 }, (_, index) => {
    const title = bookTitles[index % bookTitles.length];
    const titleText = t(title, locale);

    return {
      id: index + 1,
      title: titleText,
      slug: `${slugify(title.en)}-${index + 1}`,
      shortDescription: locale === "ar" ? `مرجع رقمي عملي حول ${titleText} مع تنظيم واضح يناسب المراجعة والعمل السريري.` : `A practical digital reference about ${titleText} with a clear structure for review and clinical work.`,
      description: locale === "ar" ? "يتضمن هذا المرجع فصولا منظمة ونقاط أمان وأطر قرار تساعد الطبيب على مراجعة المعلومات بسرعة وثقة." : "This reference includes structured chapters, safety points, and decision frameworks for fast confident review.",
      price: 45 + (index % 5) * 18,
      currency: "USD",
      category: category(locale, bookCategories[index % bookCategories.length], "book"),
      cover: { id: 4000 + index, url: images.book, alt: titleText },
      hasProtectedFile: true,
      status: "published",
      publishedAt: new Date(Date.UTC(2026, 1, 10 + index)).toISOString(),
      isbn: `978-1-4028-${String(9400 + index).padStart(4, "0")}-${index % 10}`,
    };
  });
}

export function getMockArticles(locale: Locale): Article[] {
  return Array.from({ length: 30 }, (_, index) => {
    const title = articleTitles[index % articleTitles.length];
    const titleText = t(title, locale);

    return {
      id: index + 1,
      title: titleText,
      slug: `${slugify(title.en)}-${index + 1}`,
      excerpt: locale === "ar" ? `قراءة مركزة حول ${titleText} تساعدك على ربط المعرفة الأكاديمية بالممارسة الآمنة.` : `A focused read about ${titleText} that connects academic knowledge with safe practice.`,
      body: locale === "ar" ? "تبدأ الممارسة المهنية من التشخيص الهادئ وفهم التشريح وتوثيق القرار السريري. لذلك تقدم IASS محتوى قصيرا لكنه مبني على منطق أكاديمي واضح.\n\nكل مقال يربط فكرة واحدة بتطبيق عملي داخل العيادة، مع التركيز على الأمان والدقة والنتائج الطبيعية." : "Professional practice starts with calm diagnosis, anatomical understanding, and documented clinical decisions. IASS articles are short but built on clear academic logic.\n\nEach article connects one idea with practical clinic application, focusing on safety, precision, and natural results.",
      category: category(locale, articleCategories[index % articleCategories.length], "article"),
      image: { id: 5000 + index, url: images.article, alt: titleText },
      status: "published",
      publishedAt: new Date(Date.UTC(2026, 2, 1 + index)).toISOString(),
      author: locale === "ar" ? "فريق IASS الأكاديمي" : "IASS Academic Team",
    };
  });
}
