import type { Locale } from "@/shared/lib/types";
import type { CourseCatalogItem, CourseDetailCopy, CourseItemView, CoursesPageCopy } from "./courses.types";

export const courseImagePath = "/images/course-1.png";

const coursesPageCopyByLocale: Readonly<Record<Locale, CoursesPageCopy>> = {
  en: {
    meta: {
      title: "Medical Courses - IASS",
      description: "Explore evidence-based medical courses with clean course cards and focused clinical learning paths.",
      ogTitle: "IASS Medical Courses",
      ogDescription: "Browse clinical courses, curriculum details, and medical learning programs from IASS.",
    },
    title: "Explore Medical Courses",
    subtitle:
      "Advance your clinical expertise with evidence-based curriculum designed by leading specialists. From core rotations to advanced fellowship topics.",
    searchPlaceholder: "Search by topic, specialty, or instructor...",
    filters: {
      all: "All",
    },
    labels: {
      viewDetails: "View Details",
      loadMore: "Load More Courses",
      noResultsTitle: "No courses found",
      noResultsDescription: "Try another search term or select a different category.",
    },
  },
  ar: {
    meta: {
      title: "الكورسات الطبية - IASS",
      description: "استكشف كورسات طبية مبنية على منهج واضح وبطاقات مرتبة وتجربة تعليم سريري مركزة.",
      ogTitle: "الكورسات الطبية من IASS",
      ogDescription: "تصفح الكورسات الطبية، تفاصيل المنهج، ومسارات التعلم السريري من IASS.",
    },
    title: "استكشف الكورسات الطبية",
    subtitle:
      "طوّر خبرتك السريرية من خلال مناهج مبنية على الأدلة ومصممة من مختصين، من الأساسيات حتى المواضيع المتقدمة.",
    searchPlaceholder: "ابحث حسب الموضوع أو الاختصاص أو المدرّس...",
    filters: {
      all: "الكل",
    },
    labels: {
      viewDetails: "عرض التفاصيل",
      loadMore: "عرض المزيد من الكورسات",
      noResultsTitle: "لا توجد كورسات مطابقة",
      noResultsDescription: "جرّب كلمة بحث أخرى أو اختر تصنيفًا مختلفًا.",
    },
  },
};

const courseDetailCopyByLocale: Readonly<Record<Locale, CourseDetailCopy>> = {
  en: {
    backLabel: "Back to Courses",
    purchaseLabel: "One-time purchase",
    addToCart: "Add to Cart",
    unlockNote: "Full course content is unlocked immediately after purchase.",
    includesTitle: "Course Includes:",
    curriculumTitle: "Course Curriculum",
    modulesLabel: "Modules",
    lessonsLabel: "Lessons",
    cmeEligible: "CME Eligible",
    noCourseTitle: "Course not found",
  },
  ar: {
    backLabel: "العودة إلى الكورسات",
    purchaseLabel: "شراء لمرة واحدة",
    addToCart: "أضف إلى السلة",
    unlockNote: "يتم فتح محتوى الكورس بالكامل مباشرة بعد الشراء.",
    includesTitle: "يتضمن الكورس:",
    curriculumTitle: "منهج الكورس",
    modulesLabel: "وحدات",
    lessonsLabel: "دروس",
    cmeEligible: "معتمد CME",
    noCourseTitle: "الكورس غير موجود",
  },
};

export const coursesCatalog: readonly CourseCatalogItem[] = [
  {
    id: "advanced-clinical-neuroanatomy",
    title: {
      en: "Advanced Clinical Neuroanatomy",
      ar: "التشريح العصبي السريري المتقدم",
    },
    instructor: {
      en: "Dr. Sarah Jenkins",
      ar: "د. سارة جينكنز",
    },
    categoryKey: "neurology",
    category: {
      en: "Neurology",
      ar: "الأعصاب",
    },
    description: {
      en: "A structured approach to the central nervous system with direct clinical applications.",
      ar: "منهج منظم لفهم الجهاز العصبي المركزي وربطه بالتطبيقات السريرية المباشرة.",
    },
    longDescription: {
      en: "This comprehensive course provides an in-depth exploration of the human central nervous system, designed specifically for medical students and practicing clinicians. We bridge the gap between complex anatomical structures and their direct clinical applications.",
      ar: "يوفر هذا الكورس شرحًا معمقًا للجهاز العصبي المركزي، ومصممًا لطلاب الطب والأطباء الممارسين، مع ربط واضح بين البنى التشريحية المعقدة وتطبيقاتها السريرية.",
    },
    price: "$249.00",
    image: courseImagePath,
    imageAlt: {
      en: "Brain model inside a clinical simulation room",
      ar: "نموذج دماغ داخل غرفة محاكاة سريرية",
    },
    hours: "12",
    lessons: 24,
    modules: 5,
    isCmeEligible: true,
    includes: [
      {
        en: "12 hours of on-demand video",
        ar: "12 ساعة من الفيديو عند الطلب",
      },
      {
        en: "24 comprehensive articles",
        ar: "24 مقالًا تعليميًا شاملًا",
      },
      {
        en: "10 interactive clinical cases",
        ar: "10 حالات سريرية تفاعلية",
      },
      {
        en: "Full lifetime access",
        ar: "وصول دائم للمحتوى",
      },
      {
        en: "Access on mobile and TV",
        ar: "إمكانية الوصول من الهاتف والتلفاز",
      },
    ],
    curriculum: [
      {
        title: {
          en: "Module 1: Introduction to the Nervous System",
          ar: "الوحدة 1: مقدمة في الجهاز العصبي",
        },
        description: {
          en: "Overview of central and peripheral nervous system organization.",
          ar: "نظرة عامة على تنظيم الجهاز العصبي المركزي والمحيطي.",
        },
        duration: "15:30",
      },
      {
        title: {
          en: "Module 2: The Cerebral Cortex",
          ar: "الوحدة 2: القشرة الدماغية",
        },
        description: {
          en: "Detailed functional mapping of cortical lobes and areas.",
          ar: "رسم وظيفي تفصيلي للفصوص والمناطق القشرية.",
        },
        duration: "42:15",
        locked: true,
      },
      {
        title: {
          en: "Module 3: Brainstem and Cranial Nerves",
          ar: "الوحدة 3: جذع الدماغ والأعصاب القحفية",
        },
        description: {
          en: "Ascending and descending tracts, cranial nerve nuclei.",
          ar: "السبل الصاعدة والنازلة ونوى الأعصاب القحفية.",
        },
        duration: "55:00",
        locked: true,
      },
    ],
    href: "/courses/advanced-clinical-neuroanatomy",
  },
  {
    id: "advanced-hemodynamics",
    title: {
      en: "Advanced Hemodynamics",
      ar: "ديناميكا الدم المتقدمة",
    },
    instructor: {
      en: "Dr. Sarah Jenkins",
      ar: "د. سارة جينكنز",
    },
    categoryKey: "cardiology",
    category: {
      en: "Cardiology",
      ar: "القلبية",
    },
    description: {
      en: "Master the interpretation of cardiac output, pressure-volume loops, and vascular resistance.",
      ar: "أتقن تفسير النتاج القلبي وحلقات الضغط والحجم والمقاومة الوعائية.",
    },
    longDescription: {
      en: "A practical course for interpreting advanced hemodynamic patterns and connecting measurements with clinical decision-making.",
      ar: "كورس عملي لتفسير أنماط ديناميكا الدم المتقدمة وربط القياسات بالقرار السريري.",
    },
    price: "$199",
    image: courseImagePath,
    imageAlt: {
      en: "Medical monitor showing cardiac traces",
      ar: "شاشة طبية تعرض مخططات قلبية",
    },
    hours: "8",
    lessons: 18,
    modules: 4,
    isCmeEligible: true,
    includes: [],
    curriculum: [],
    href: "/courses/advanced-hemodynamics",
  },
  {
    id: "neuro-radiology-essentials",
    title: {
      en: "Neuro-Radiology Essentials",
      ar: "أساسيات الأشعة العصبية",
    },
    instructor: {
      en: "Dr. Michael Chen",
      ar: "د. مايكل تشين",
    },
    categoryKey: "neurology",
    category: {
      en: "Neurology",
      ar: "الأعصاب",
    },
    description: {
      en: "Systematic approach to CT and MRI interpretation of the central nervous system.",
      ar: "منهجية منظمة لتفسير صور CT وMRI للجهاز العصبي المركزي.",
    },
    longDescription: {
      en: "Learn a structured reading pattern for neuro-imaging, from scan quality to lesion localization and reporting.",
      ar: "تعلّم نمط قراءة منظم للصور العصبية، من جودة الصورة إلى تحديد الآفة وكتابة التقرير.",
    },
    price: "$149",
    image: courseImagePath,
    imageAlt: {
      en: "Brain scan and neurological visual",
      ar: "صورة دماغية ومرئيات عصبية",
    },
    hours: "10",
    lessons: 20,
    modules: 5,
    isCmeEligible: true,
    includes: [],
    curriculum: [],
    href: "/courses/neuro-radiology-essentials",
  },
  {
    id: "clinical-antibiotics",
    title: {
      en: "Clinical Antibiotics",
      ar: "المضادات الحيوية السريرية",
    },
    instructor: {
      en: "Dr. Elena Rodriguez",
      ar: "د. إيلينا رودريغيز",
    },
    categoryKey: "pharmacology",
    category: {
      en: "Pharmacology",
      ar: "الأدوية",
    },
    description: {
      en: "A practical guide to antimicrobial stewardship and mechanism-based prescribing.",
      ar: "دليل عملي لاستخدام المضادات الحيوية بشكل مسؤول ومبني على آلية العمل.",
    },
    longDescription: {
      en: "Build a practical framework for choosing antibiotics safely across common inpatient and outpatient scenarios.",
      ar: "ابنِ إطارًا عمليًا لاختيار المضادات الحيوية بأمان في الحالات الشائعة داخل وخارج المشفى.",
    },
    price: "$89",
    image: courseImagePath,
    imageAlt: {
      en: "Laboratory test tubes with blue liquid",
      ar: "أنابيب مخبرية تحتوي سوائل زرقاء",
    },
    hours: "6",
    lessons: 14,
    modules: 3,
    isCmeEligible: false,
    includes: [],
    curriculum: [],
    href: "/courses/clinical-antibiotics",
  },
  {
    id: "laparoscopic-foundations",
    title: {
      en: "Laparoscopic Foundations",
      ar: "أساسيات الجراحة التنظيرية",
    },
    instructor: {
      en: "Dr. James Wilson",
      ar: "د. جيمس ويلسون",
    },
    categoryKey: "surgery",
    category: {
      en: "Surgery",
      ar: "الجراحة",
    },
    description: {
      en: "Comprehensive training for minimally invasive surgery techniques and operating room workflow.",
      ar: "تدريب شامل على تقنيات الجراحة قليلة التداخل وسير العمل داخل غرفة العمليات.",
    },
    longDescription: {
      en: "Understand laparoscopic setup, instrument handling, safety principles, and core operative thinking.",
      ar: "افهم تجهيزات التنظير، التعامل مع الأدوات، مبادئ الأمان، والتفكير الجراحي الأساسي.",
    },
    price: "$299",
    image: courseImagePath,
    imageAlt: {
      en: "Modern surgical operating room",
      ar: "غرفة عمليات جراحية حديثة",
    },
    hours: "14",
    lessons: 28,
    modules: 6,
    isCmeEligible: true,
    includes: [],
    curriculum: [],
    href: "/courses/laparoscopic-foundations",
  },
  {
    id: "pediatric-critical-care",
    title: {
      en: "Pediatric Critical Care",
      ar: "العناية الحرجة للأطفال",
    },
    instructor: {
      en: "Dr. Sophia Lee",
      ar: "د. صوفيا لي",
    },
    categoryKey: "pediatrics",
    category: {
      en: "Pediatrics",
      ar: "الأطفال",
    },
    description: {
      en: "High-yield protocols for managing acute illness in neonatal and pediatric patients.",
      ar: "بروتوكولات عالية الأهمية للتعامل مع الحالات الحادة لدى حديثي الولادة والأطفال.",
    },
    longDescription: {
      en: "A concise clinical pathway for pediatric emergencies, monitoring, stabilization, and escalation decisions.",
      ar: "مسار سريري مختصر لطوارئ الأطفال والمراقبة والتثبيت وقرارات التصعيد.",
    },
    price: "$179",
    image: courseImagePath,
    imageAlt: {
      en: "Pediatric medical training setup",
      ar: "إعداد تدريبي طبي للأطفال",
    },
    hours: "9",
    lessons: 16,
    modules: 4,
    isCmeEligible: true,
    includes: [],
    curriculum: [],
    href: "/courses/pediatric-critical-care",
  },
  {
    id: "emergency-ecg-analysis",
    title: {
      en: "Emergency ECG Analysis",
      ar: "تحليل تخطيط القلب الإسعافي",
    },
    instructor: {
      en: "Dr. Robert Vance",
      ar: "د. روبرت فانس",
    },
    categoryKey: "emergency",
    category: {
      en: "Emergency",
      ar: "الإسعاف",
    },
    description: {
      en: "Rapid identification of arrhythmias, ischemic changes, and mimics in the emergency setting.",
      ar: "تمييز سريع لاضطرابات النظم والتغيرات الإقفارية والحالات المشابهة في الإسعاف.",
    },
    longDescription: {
      en: "Train your eye to identify dangerous ECG patterns quickly and communicate findings clearly.",
      ar: "درّب عينك على تمييز أنماط تخطيط القلب الخطرة بسرعة وشرح النتائج بوضوح.",
    },
    price: "$120",
    image: courseImagePath,
    imageAlt: {
      en: "ECG monitor in emergency care",
      ar: "مراقبة تخطيط القلب في الإسعاف",
    },
    hours: "7",
    lessons: 15,
    modules: 4,
    isCmeEligible: false,
    includes: [],
    curriculum: [],
    href: "/courses/emergency-ecg-analysis",
  },
  {
    id: "renal-physiology-mastery",
    title: {
      en: "Renal Physiology Mastery",
      ar: "إتقان فيزيولوجيا الكلية",
    },
    instructor: {
      en: "Dr. Alice Thorne",
      ar: "د. أليس ثورن",
    },
    categoryKey: "nephrology",
    category: {
      en: "Nephrology",
      ar: "الكلى",
    },
    description: {
      en: "Deep dive into glomerular filtration, electrolyte balance, and acid-base regulation.",
      ar: "شرح معمق للترشيح الكبيبي وتوازن الشوارد وتنظيم الحمض والقاعدة.",
    },
    longDescription: {
      en: "Turn renal physiology from memorization into a clear system for clinical reasoning.",
      ar: "حوّل فيزيولوجيا الكلية من حفظ إلى نظام واضح للتفكير السريري.",
    },
    price: "$215",
    image: courseImagePath,
    imageAlt: {
      en: "Medical ultrasound and renal image",
      ar: "صورة إيكو طبية للكلية",
    },
    hours: "11",
    lessons: 22,
    modules: 5,
    isCmeEligible: true,
    includes: [],
    curriculum: [],
    href: "/courses/renal-physiology-mastery",
  },
  {
    id: "genomic-medicine",
    title: {
      en: "Genomic Medicine",
      ar: "الطب الجيني",
    },
    instructor: {
      en: "Dr. Kevin Zhang",
      ar: "د. كيفن زانغ",
    },
    categoryKey: "genetics",
    category: {
      en: "Genetics",
      ar: "الوراثة",
    },
    description: {
      en: "Integrating genetic testing and personalized medicine into primary clinical care.",
      ar: "دمج الفحوص الجينية والطب الشخصي ضمن الرعاية السريرية الأساسية.",
    },
    longDescription: {
      en: "Understand how genomic data changes screening, diagnosis, counseling, and treatment planning.",
      ar: "افهم كيف تغيّر البيانات الجينية الفحص والتشخيص والاستشارة وخطط العلاج.",
    },
    price: "$240",
    image: courseImagePath,
    imageAlt: {
      en: "DNA strand in a medical environment",
      ar: "سلسلة DNA في بيئة طبية",
    },
    hours: "12",
    lessons: 21,
    modules: 5,
    isCmeEligible: true,
    includes: [],
    curriculum: [],
    href: "/courses/genomic-medicine",
  },
];

export function getCoursesPageCopy(locale: Locale): CoursesPageCopy {
  return coursesPageCopyByLocale[locale];
}

export function getCourseDetailCopy(locale: Locale): CourseDetailCopy {
  return courseDetailCopyByLocale[locale];
}

export function getCourses(locale: Locale): CourseItemView[] {
  return coursesCatalog.map((course) => ({
    id: course.id,
    title: course.title[locale],
    instructor: course.instructor[locale],
    categoryKey: course.categoryKey,
    category: course.category[locale],
    description: course.description[locale],
    longDescription: course.longDescription[locale],
    price: course.price,
    image: course.image,
    imageAlt: course.imageAlt[locale],
    hours: course.hours,
    lessons: course.lessons,
    modules: course.modules,
    isCmeEligible: course.isCmeEligible,
    includes: course.includes.map((item) => item[locale]),
    curriculum: course.curriculum.map((module) => ({
      title: module.title[locale],
      description: module.description[locale],
      duration: module.duration,
      locked: module.locked,
    })),
    href: course.href,
  }));
}

export function getCourseById(locale: Locale, courseId: string): CourseItemView | undefined {
  return getCourses(locale).find((course) => course.id === courseId);
}
