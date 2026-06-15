import { messagesByLocale } from "@/shared/lib/messages";
import type { Locale } from "@/shared/lib/types";
import type { HomeCatalog, HomeMessages } from "./home.types";

const catalogByLocale: Record<Locale, HomeCatalog> = {
  ar: {
    courses: [
      {
        category: "العلوم التجميلية",
        title: "تشريح الوجه وفحص البشرة",
        author: "د. إياس عكاري",
        modules: 12,
        description: "فهم تشريحي متعمق لفحص الجلد والبشرة والتاريخ الطبي قبل بناء أي خطة علاجية.",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
        alt: "طبيب يراجع مخططًا تشريحيًا وتعليميًا في بيئة طبية حديثة",
        href: "/courses/facial-anatomy-and-skin-assessment",
      },
      {
        category: "المهارات العملية",
        title: "تقنيات حقن البوتوكس والفيلر المتقدمة",
        author: "د. إياس عكاري",
        modules: 10,
        description: "تدريب عملي على الحقن الآمن، توزيع الوحدات، وتلافي المضاعفات وفق بروتوكولات واضحة.",
        image: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1200&q=80",
        alt: "تدريب طبي عملي داخل عيادة حديثة",
        href: "/courses/advanced-botox-and-filler-injection",
      },
      {
        category: "البروتوكولات",
        title: "البروتوكولات العلاجية في الطب التجميلي",
        author: "فريق IASS الأكاديمي",
        modules: 8,
        description: "تحويل الممارسة التجميلية إلى خطوات تشخيصية وعلاجية موثقة قابلة للتطبيق في العيادة.",
        image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1200&q=80",
        alt: "ملفات وبروتوكولات طبية مرتبة على مكتب أبيض",
        href: "/courses/aesthetic-treatment-protocols",
      },
    ],
    books: [
      {
        category: "كتاب مرجعي",
        title: "البروتوكولات العلاجية في الطب التجميلي",
        author: "د. إياس عكاري",
        modules: 0,
        description: "مرجع طبي يوثق فلسفة الجمال كعلم قائم على التشريح، الدقة، والأمان.",
        image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1200&q=80",
        alt: "كتاب طبي مفتوح على مكتب دراسي هادئ",
        href: "/books/aesthetic-treatment-protocols",
      },
      {
        category: "أداة تعليمية",
        title: "دليل مسطرة البوتوكس الهندسية",
        author: "IASS",
        modules: 0,
        description: "دليل مبسط لفهم القياس الهندسي وتوزيع الوحدات بما يناسب أبعاد كل وجه.",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
        alt: "أدوات قياس وملاحظات تعليمية فوق مكتب طبي",
        href: "/books/botox-ruler-guide",
      },
      {
        category: "الأمان الطبي",
        title: "مرجع الأمان التشريحي للحقن",
        author: "فريق IASS الأكاديمي",
        modules: 0,
        description: "مراجعة مركزة للمناطق الحساسة، خطوات الوقاية، ومبادئ التعامل مع المضاعفات.",
        image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80",
        alt: "طبيب يقرأ مرجعًا طبيًا داخل عيادة",
        href: "/books/injection-safety-reference",
      },
    ],
    articles: [
      {
        category: "فلسفة التدريب",
        title: "من إبر الترند إلى البروتوكول العلمي",
        author: "الفريق التحريري",
        modules: 0,
        description: "كيف تعيد IASS التدريب التجميلي إلى أصله كعلم تشريحي دقيق وليس ممارسة عشوائية.",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
        alt: "مقال طبي وتعليمي على شاشة رقمية",
        href: "/articles/from-trend-injections-to-clinical-protocols",
      },
      {
        category: "الأمان والتشريح",
        title: "لماذا الدقة التشريحية أساس الطب التجميلي؟",
        author: "IASS",
        modules: 0,
        description: "قراءة مركزة عن دور التشريح في منع المضاعفات وتحقيق نتائج طبيعية ومتوازنة.",
        image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=1200&q=80",
        alt: "تعليم تشريحي على جهاز لوحي داخل عيادة",
        href: "/articles/why-anatomical-precision-matters",
      },
      {
        category: "المسار المهني",
        title: "كيف تبني عقلية طبيب تجميل محترف؟",
        author: "الفريق الأكاديمي",
        modules: 0,
        description: "إطار عملي للتشخيص، الأمان، وتقديم نتائج موثقة تمنح الطبيب الثقة أمام مرضاه.",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
        alt: "طبيب يخطط لمسار تعلم مهني على حاسوب محمول",
        href: "/articles/building-a-professional-aesthetic-mindset",
      },
    ],
  },
  en: {
    courses: [
      {
        category: "Aesthetic Science",
        title: "Facial Anatomy and Skin Assessment",
        author: "Dr. Iyas Akkari",
        modules: 12,
        description: "A deep clinical framework for reading skin, facial anatomy, and patient history before treatment planning.",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
        alt: "Doctor reviewing anatomical and educational material in a modern medical setting",
        href: "/courses/facial-anatomy-and-skin-assessment",
      },
      {
        category: "Practical Skills",
        title: "Advanced Botox and Filler Injection Techniques",
        author: "Dr. Iyas Akkari",
        modules: 10,
        description: "Practical training in safe injection, unit distribution, and complication prevention through clear protocols.",
        image: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1200&q=80",
        alt: "Hands-on clinical training inside a modern clinic",
        href: "/courses/advanced-botox-and-filler-injection",
      },
      {
        category: "Protocols",
        title: "Aesthetic Treatment Protocols",
        author: "IASS Academic Team",
        modules: 8,
        description: "Turn aesthetic practice into documented diagnostic and treatment steps that can be applied in clinic.",
        image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1200&q=80",
        alt: "Clinical files and protocols organized on a white desk",
        href: "/courses/aesthetic-treatment-protocols",
      },
    ],
    books: [
      {
        category: "Reference Book",
        title: "Aesthetic Treatment Protocols",
        author: "Dr. Iyas Akkari",
        modules: 0,
        description: "A clinical reference that presents beauty as a science of anatomy, precision, and safety.",
        image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1200&q=80",
        alt: "Medical book open on a calm study desk",
        href: "/books/aesthetic-treatment-protocols",
      },
      {
        category: "Training Tool",
        title: "The Engineering Botox Ruler Guide",
        author: "IASS",
        modules: 0,
        description: "A focused guide to geometric measurement and unit distribution based on individual facial dimensions.",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
        alt: "Measurement tools and educational notes on a clinical desk",
        href: "/books/botox-ruler-guide",
      },
      {
        category: "Medical Safety",
        title: "Injection Anatomy Safety Reference",
        author: "IASS Academic Team",
        modules: 0,
        description: "A concise review of high-risk zones, prevention steps, and core principles for managing complications.",
        image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80",
        alt: "Doctor reading a medical reference inside a clinic",
        href: "/books/injection-safety-reference",
      },
    ],
    articles: [
      {
        category: "Training Philosophy",
        title: "From Trend Injections to Scientific Protocols",
        author: "Editorial Team",
        modules: 0,
        description: "How IASS brings aesthetic training back to its foundation as a precise anatomical science.",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
        alt: "Medical and educational article on a digital screen",
        href: "/articles/from-trend-injections-to-clinical-protocols",
      },
      {
        category: "Safety and Anatomy",
        title: "Why Anatomical Precision Matters in Aesthetic Medicine",
        author: "IASS",
        modules: 0,
        description: "A focused read on how anatomy prevents complications and supports natural balanced outcomes.",
        image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=1200&q=80",
        alt: "Anatomy learning on a tablet inside a clinic",
        href: "/articles/why-anatomical-precision-matters",
      },
      {
        category: "Professional Path",
        title: "Building the Mindset of a Professional Aesthetic Doctor",
        author: "Academic Team",
        modules: 0,
        description: "A practical framework for diagnosis, safety, and documented results that build clinical confidence.",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
        alt: "Doctor planning a professional learning path on a laptop",
        href: "/articles/building-a-professional-aesthetic-mindset",
      },
    ],
  },
};

export function getHomeMessages(locale: Locale): HomeMessages {
  const base = messagesByLocale[locale].Home as HomeMessages;

  if (locale === "ar") {
    return {
      ...base,
      meta: {
        title: "IASS - الأكاديمية الدولية لعلوم ومهارات التجميل",
        description: "منصة تعليمية رقمية رائدة للتدريب الاحترافي في الطب التجميلي تحت إشراف الدكتور إياس عكاري.",
        ogTitle: "IASS - تدريب احترافي في الطب التجميلي",
        ogDescription: "تعلم التشريح، الأمان الطبي، وتقنيات الحقن المتقدمة عبر كورسات وكتب ومقالات أكاديمية موثوقة.",
      },
      navigation: {
        ...base.navigation,
        home: "الرئيسية",
        specialties: "من نحن",
      },
      hero: {
        badge: "الأكاديمية الدولية لعلوم ومهارات التجميل",
        title: "تدريب طبي تجميلي مبني على العلم والدقة والأمان",
        subtitle:
          "اكتشف دورات وكتبًا ومقالات أكاديمية تنقل خبرة الدكتور إياس عكاري في التشريح، البروتوكولات العلاجية، وتقنيات الحقن الآمن إلى الأطباء والممارسين.",
      },
      founder: {
        label: "المؤسس والمدرب الدولي",
        title: "الدكتور إياس عكاري",
        subtitle: "مرجع أكاديمي ومطور بروتوكولات في الطب التجميلي الحديث.",
        name: "الدكتور إياس عكاري",
        description:
          "الدكتور إياس عكاري طبيب ومدرب معتمد دوليًا في الطب التجميلي ومؤسس Guarantee Clinic. صاغ معايير تعليمية وعلاجية دقيقة، وابتكر مسطرة البوتوكس الهندسية، وألّف كتاب البروتوكولات العلاجية في الطب التجميلي لتدريب الأطباء على ممارسة آمنة وموثقة.",
        ctaLabel: "تعرف على الأكاديمية",
        imageAlt: "الدكتور إياس عكاري، مؤسس IASS والمدرب الدولي في الطب التجميلي",
      },
      aboutUs: {
        label: "عن الأكاديمية",
        title: "IASS تعيد التدريب التجميلي إلى أصله العلمي",
        subtitle:
          "الأكاديمية الدولية لعلوم ومهارات التجميل ليست مجرد منصة لمشاهدة الفيديوهات؛ بل بيئة تعليمية لبناء عقلية طبيب تجميل محترف يمتلك الفهم التشريحي، المهارة العملية، والثقة في تقديم نتائج آمنة وموثقة.",
        primaryCtaLabel: "اقرأ المزيد",
        secondaryCtaLabel: "ابدأ التعلم",
        imageSrc: "/images/hero.jpg",
        imageAlt: "الدكتور إياس عكاري في صورة رسمية للأكاديمية",
        highlights: [
          {
            label: "علوم تجميلية راسخة",
            description: "تشريح الوجه، فحص البشرة، وتحليل كل حالة قبل اختيار التقنية المناسبة.",
          },
          {
            label: "مهارات عملية آمنة",
            description: "تقنيات حقن متقدمة تركّز على الدقة، توزيع الوحدات، وتلافي المضاعفات.",
          },
          {
            label: "بروتوكولات موثقة",
            description: "خطوات علاجية مدروسة تساعد الطبيب على تقديم نتائج مضمونة وواضحة.",
          },
        ],
      },
      visual: {
        eyebrow: "تعلم طبي منظم",
        title: "محتوى موثوق للأطباء والممارسين",
        description: "كورسات، كتب، ومقالات تربط النظرية بالممارسة داخل العيادة.",
        resources: {
          courses: "كورسات متقدمة",
          books: "كتب وبروتوكولات",
          articles: "مقالات أكاديمية",
        },
      },
      sections: {
        courses: {
          title: "كورسات الطب التجميلي",
          description: "مسارات تدريبية في التشريح، فحص البشرة، والبوتوكس والفيلر المتقدم.",
          emptyState: "لا توجد دورات متاحة حاليًا.",
        },
        books: {
          title: "كتب وبروتوكولات علاجية",
          description: "مراجع رقمية تساعدك على تحويل الممارسة إلى خطوات علمية موثقة.",
          emptyState: "لا توجد كتب متاحة حاليًا.",
        },
        articles: {
          title: "مقالات أكاديمية ومهنية",
          description: "قراءات مركزة حول الأمان الطبي، التشريح، وبناء عقلية طبيب تجميل محترف.",
          emptyState: "لا توجد مقالات متاحة حاليًا.",
        },
      },
      stats: {
        label: "أثر IASS",
        title: "منصة مصممة لرفع كفاءة الممارسة التجميلية",
        subtitle: "نقل خبرات أكاديمية وعملية للأطباء والممارسين من خلال محتوى واضح، آمن، وقابل للتطبيق.",
        items: [
          {
            value: "15+",
            label: "سنوات خبرة",
            description: "خبرة سريرية وتعليمية في التدريب على الطب التجميلي.",
            icon: "award",
          },
          {
            value: "3",
            label: "محاور تعلم",
            description: "علوم تجميلية، مهارات عملية، وبروتوكولات علاجية.",
            icon: "book",
          },
          {
            value: "100%",
            label: "تركيز على الأمان",
            description: "كل مسار تعليمي مبني حول الدقة وتقليل المضاعفات.",
            icon: "star",
          },
          {
            value: "IASS",
            label: "بيئة تعليمية متكاملة",
            description: "كورسات وكتب ومقالات لخدمة المسار المهني للطبيب.",
            icon: "users",
          },
        ],
      },
      trustStrip: ["تشريح دقيق", "حقن آمن", "بروتوكولات موثقة", "تعلم مهني"],
      footer: {
        ...base.footer,
        description: "IASS منصة تعليمية رقمية للتدريب الاحترافي في الطب التجميلي تحت إشراف الدكتور إياس عكاري.",
        links: {
          ...base.footer.links,
          about: "عن IASS",
          faculty: "الدكتور إياس عكاري",
        },
      },
      catalog: catalogByLocale.ar,
    };
  }

  return {
    ...base,
    meta: {
      title: "IASS - International Academy of Aesthetic Science and Skills",
      description: "A digital academy for professional aesthetic medicine training under the guidance of Dr. Iyas Akkari.",
      ogTitle: "IASS - Professional Aesthetic Medicine Training",
      ogDescription: "Learn anatomy, medical safety, and advanced injection skills through trusted courses, books, and articles.",
    },
    navigation: {
      ...base.navigation,
      home: "Home",
      specialties: "About Us",
    },
    hero: {
      badge: "International Academy of Aesthetic Science and Skills",
      title: "Aesthetic medicine training built on science, precision, and safety",
      subtitle:
        "Explore academic courses, books, and articles that bring Dr. Iyas Akkari's expertise in anatomy, treatment protocols, and safe injection practice to doctors and practitioners.",
    },
    founder: {
      label: "Founder and International Trainer",
      title: "Dr. Iyas Akkari",
      subtitle: "An academic reference and protocol developer in modern aesthetic medicine.",
      name: "Dr. Iyas Akkari",
      description:
        "Dr. Iyas Akkari is an internationally certified trainer in aesthetic medicine and founder of Guarantee Clinic. He developed precise educational and treatment standards, created the engineering Botox ruler, and authored Aesthetic Treatment Protocols to train doctors in safe, documented practice.",
      ctaLabel: "Learn about the academy",
      imageAlt: "Dr. Iyas Akkari, IASS founder and international aesthetic medicine trainer",
    },
    aboutUs: {
      label: "About the academy",
      title: "IASS brings aesthetic training back to its scientific foundation",
      subtitle:
        "The International Academy of Aesthetic Science and Skills is not just a video platform; it is a learning environment for building the mindset of a professional aesthetic doctor with anatomical clarity, practical skill, and confidence in safe documented results.",
      primaryCtaLabel: "Read more",
      secondaryCtaLabel: "Start learning",
      imageSrc: "/images/hero.jpg",
      imageAlt: "Dr. Iyas Akkari in an official academy portrait",
      highlights: [
        {
          label: "Aesthetic science",
          description: "Facial anatomy, skin assessment, and clinical analysis before choosing a technique.",
        },
        {
          label: "Safe practical skills",
          description: "Advanced injection techniques focused on precision, unit distribution, and complication prevention.",
        },
        {
          label: "Documented protocols",
          description: "Structured treatment steps that help doctors provide clear and reliable outcomes.",
        },
      ],
    },
    visual: {
      eyebrow: "Structured medical learning",
      title: "Trusted content for doctors and practitioners",
      description: "Courses, books, and articles that connect academic understanding with clinical practice.",
      resources: {
        courses: "Advanced courses",
        books: "Books and protocols",
        articles: "Academic articles",
      },
    },
    sections: {
      courses: {
        title: "Aesthetic Medicine Courses",
        description: "Training paths in anatomy, skin assessment, Botox, fillers, and advanced injection safety.",
        emptyState: "No courses are available yet.",
      },
      books: {
        title: "Books and Treatment Protocols",
        description: "Digital references that turn clinical practice into clear, scientific, documented steps.",
        emptyState: "No books are available yet.",
      },
      articles: {
        title: "Academic and Professional Articles",
        description: "Focused readings on medical safety, anatomy, and the mindset of a professional aesthetic doctor.",
        emptyState: "No articles are available yet.",
      },
    },
    stats: {
      label: "IASS impact",
      title: "Designed to improve aesthetic practice quality",
      subtitle: "Academic and practical expertise for doctors and practitioners through clear, safe, applicable content.",
      items: [
        {
          value: "15+",
          label: "Years of expertise",
          description: "Clinical and educational experience in aesthetic medicine training.",
          icon: "award",
        },
        {
          value: "3",
          label: "Learning pillars",
          description: "Aesthetic science, practical skills, and treatment protocols.",
          icon: "book",
        },
        {
          value: "100%",
          label: "Safety focused",
          description: "Every learning path is built around precision and complication prevention.",
          icon: "star",
        },
        {
          value: "IASS",
          label: "Integrated academy",
          description: "Courses, books, and articles for the doctor's professional path.",
          icon: "users",
        },
      ],
    },
    trustStrip: ["Precise anatomy", "Safe injection", "Documented protocols", "Professional learning"],
    footer: {
      ...base.footer,
      description: "IASS is a digital academy for professional aesthetic medicine training under the guidance of Dr. Iyas Akkari.",
      links: {
        ...base.footer.links,
        about: "About IASS",
        faculty: "Dr. Iyas Akkari",
      },
    },
    catalog: catalogByLocale.en,
  };
}
