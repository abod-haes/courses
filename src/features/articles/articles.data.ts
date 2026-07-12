import { messagesByLocale } from "@/shared/lib/messages";
import type { HomeCatalogItem, HomeMessages } from "@/features/home/home.types";
import type { Locale } from "@/shared/lib/types";
import type { ArticleDetail, ArticlePageCopy, ArticleSummary, ArticleSort } from "./articles.types";

const publishedDates: Record<string, string> = {
  "how-to-build-a-sustainable-beauty-study-routine": "2026-02-12T09:00:00.000Z",
  "turning-client-needs-into-a-clear-service-plan": "2026-02-05T09:00:00.000Z",
  "choosing-the-right-digital-resource-for-revision": "2026-01-28T09:00:00.000Z",
};

const articleBodies: Record<Locale, Record<string, readonly string[]>> = {
  en: {
    "how-to-build-a-sustainable-beauty-study-routine": [
      "A sustainable study routine is built by protecting attention, choosing one clear goal, and repeating small learning actions until they become easy to keep.",
      "Start each week by selecting one practical topic, one reading resource, and one short review checkpoint. This keeps your course, book, and article reading connected instead of scattered.",
      "Use focused blocks of 25 to 40 minutes. Read one concept, write a short explanation in your own words, then connect it to a real professional situation.",
      "End the week with a calm review. Mark what felt clear, what still needs revision, and what resource should be opened next.",
    ],
    "turning-client-needs-into-a-clear-service-plan": [
      "A clear service plan begins with listening. Before choosing products or steps, collect the client goal, current concerns, previous experience, and any limits.",
      "Turn the conversation into a short structure: problem, priority, action, and follow-up. This format helps you explain recommendations with confidence.",
      "Avoid overloading the plan. A professional plan should feel safe, realistic, and understandable.",
      "After the session, record the main observations and the agreed next step. Consistent notes make future appointments more accurate.",
    ],
    "choosing-the-right-digital-resource-for-revision": [
      "Different learning goals need different resources. A course is best for structure, a digital book is best for deeper reference, and an article is best for a quick focused idea.",
      "Before opening a resource, name your study goal. Are you trying to understand a new topic, revise a known topic, or prepare for practical work?",
      "Combine resources in layers. Start with an article, continue with a course lesson, then use a book chapter for detailed review.",
      "The right resource is the one that answers your current question clearly. Choose less content, use it better, and return when your next learning question appears.",
    ],
  },
  ar: {
    "how-to-build-a-sustainable-beauty-study-routine": [
      "الروتين الدراسي المستدام يُبنى بحماية التركيز، واختيار هدف واضح، وتكرار خطوات تعلم صغيرة يمكن الالتزام بها بسهولة.",
      "ابدئي كل أسبوع بتحديد موضوع عملي واحد، ومصدر قراءة واحد، ونقطة مراجعة قصيرة حتى تبقى الدراسة مترابطة.",
      "استخدمي فترات تركيز من 25 إلى 40 دقيقة، واقرئي فكرة واحدة، ثم اكتبي شرحًا مختصرًا بكلماتك.",
      "اختتمي الأسبوع بمراجعة هادئة لما أصبح واضحًا وما يحتاج إلى تكرار وما المصدر التالي.",
    ],
    "turning-client-needs-into-a-clear-service-plan": [
      "تبدأ خطة الخدمة الواضحة بالاستماع وجمع هدف العميل والمخاوف الحالية والتجارب السابقة وأي حدود مهمة.",
      "حوّلي الحوار إلى بنية قصيرة: المشكلة، الأولوية، الإجراء، والمتابعة. هذا يساعدك على شرح التوصيات بثقة.",
      "تجنبي تحميل الخطة بتفاصيل كثيرة. الخطة المهنية يجب أن تكون آمنة وواقعية ومفهومة.",
      "بعد الجلسة، سجلي الملاحظات الأساسية والخطوة التالية المتفق عليها لتصبح المواعيد القادمة أدق.",
    ],
    "choosing-the-right-digital-resource-for-revision": [
      "كل هدف تعلم يحتاج إلى مصدر مناسب. الدورة أفضل للترتيب، والكتاب الرقمي للمراجعة العميقة، والمقال للتذكير السريع.",
      "قبل فتح أي مصدر، حددي هدف الدراسة: فهم موضوع جديد، مراجعة موضوع معروف، أو الاستعداد للتطبيق العملي.",
      "ادمجي المصادر على طبقات: مقال قصير، ثم درس من دورة، ثم فصل من كتاب للمراجعة التفصيلية.",
      "المصدر المناسب هو الذي يجيب عن سؤالك الحالي بوضوح. اختاري محتوى أقل واستخدميه بشكل أفضل.",
    ],
  },
};

const copyByLocale: Record<Locale, ArticlePageCopy> = {
  en: {
    locale: "en",
    brand: "IASS",
    meta: {
      listTitle: "Articles and Insights | IASS",
      listDescription: "Read focused beauty, skills, and professional learning articles from IASS.",
      detailsTitleSuffix: "Articles and Insights",
    },
    hero: {
      eyebrow: "Articles and Insights",
      title: "Focused reading for confident practice",
      description: "Short academic articles designed to help learners connect beauty theory, professional thinking, and practical revision.",
    },
    filters: {
      searchLabel: "Search articles",
      searchPlaceholder: "Search by article title or topic...",
      categoryLabel: "Category",
      allCategories: "All categories",
      sortLabel: "Sort",
      newest: "Newest first",
      title: "Title A-Z",
      apply: "Apply filters",
      reset: "Reset",
    },
    cards: { readArticle: "Read Article", published: "Published" },
    empty: { title: "No articles found", description: "Try a different search term or reset the filters to explore all available articles." },
    details: {
      backToArticles: "Back to Articles",
      writtenBy: "Written by",
      browseCourses: "Browse Courses",
      browseBooks: "Explore Books",
      continueLearningTitle: "Continue learning with IASS",
      continueLearningDescription: "Pair short articles with structured courses and digital books to build stronger understanding over time.",
    },
  },
  ar: {
    locale: "ar",
    brand: "IASS",
    meta: {
      listTitle: "المقالات والرؤى | IASS",
      listDescription: "اقرأ مقالات مركزة في الجمال والمهارات والتعلم المهني من IASS.",
      detailsTitleSuffix: "المقالات والرؤى",
    },
    hero: {
      eyebrow: "مقالات ورؤى",
      title: "قراءة مركزة لممارسة أكثر ثقة",
      description: "مقالات أكاديمية قصيرة تساعد المتعلمين على ربط نظرية الجمال بالتفكير المهني والمراجعة العملية.",
    },
    filters: {
      searchLabel: "البحث في المقالات",
      searchPlaceholder: "ابحثي باسم المقال أو الموضوع...",
      categoryLabel: "التصنيف",
      allCategories: "كل التصنيفات",
      sortLabel: "الترتيب",
      newest: "الأحدث أولًا",
      title: "العنوان أبجديًا",
      apply: "تطبيق الفلاتر",
      reset: "إعادة ضبط",
    },
    cards: { readArticle: "قراءة المقال", published: "نُشر في" },
    empty: { title: "لا توجد مقالات مطابقة", description: "جرّبي كلمة بحث مختلفة أو أعيدي ضبط الفلاتر لاستعراض كل المقالات المتاحة." },
    details: {
      backToArticles: "العودة إلى المقالات",
      writtenBy: "بواسطة",
      browseCourses: "تصفح الدورات",
      browseBooks: "استكشاف الكتب",
      continueLearningTitle: "واصلي التعلم مع IASS",
      continueLearningDescription: "اجمعي بين المقالات القصيرة والدورات المنظمة والكتب الرقمية لبناء فهم أقوى مع الوقت.",
    },
  },
};

function getSlug(item: HomeCatalogItem): string {
  return item.href.split("/").filter(Boolean).at(-1) ?? item.title.toLowerCase().replaceAll(" ", "-");
}

function categoryKey(value: string): string {
  return value.toLowerCase().trim().replace(/\s+/g, "-");
}

function getHomeMessages(locale: Locale): HomeMessages {
  return messagesByLocale[locale].Home as HomeMessages;
}

function toArticleSummary(item: HomeCatalogItem, index: number): ArticleSummary {
  const slug = getSlug(item);
  return {
    id: index + 1,
    slug,
    title: item.title,
    excerpt: item.description ?? item.author,
    category: item.category,
    categoryKey: categoryKey(item.category),
    author: item.author,
    image: item.image,
    alt: item.alt,
    href: `/articles/${slug}`,
    publishedAt: publishedDates[slug] ?? new Date().toISOString(),
  };
}

export function getArticlePageCopy(locale: Locale): ArticlePageCopy {
  return copyByLocale[locale];
}

export function getArticles(locale: Locale): ArticleSummary[] {
  return getHomeMessages(locale).catalog.articles.map(toArticleSummary);
}

export function getArticleBySlug(locale: Locale, slug: string): ArticleDetail | null {
  const article = getArticles(locale).find((item) => item.slug === slug);
  return article ? { ...article, body: articleBodies[locale][slug] ?? [] } : null;
}

export function getArticleCategories(locale: Locale): string[] {
  return Array.from(new Set(getArticles(locale).map((article) => article.category)));
}

export function filterArticles(
  articles: readonly ArticleSummary[],
  options: Readonly<{ search?: string; category?: string; sort?: ArticleSort }>,
): ArticleSummary[] {
  const normalizedSearch = options.search?.trim().toLowerCase();
  const category = options.category?.trim();

  return [...articles]
    .filter((article) => {
      const matchesSearch = normalizedSearch
        ? `${article.title} ${article.excerpt} ${article.category}`.toLowerCase().includes(normalizedSearch)
        : true;
      const matchesCategory = category ? article.category === category || article.categoryKey === category : true;
      return matchesSearch && matchesCategory;
    })
    .sort((first, second) => {
      if (options.sort === "title") {
        return first.title.localeCompare(second.title);
      }
      return new Date(second.publishedAt).getTime() - new Date(first.publishedAt).getTime();
    });
}
