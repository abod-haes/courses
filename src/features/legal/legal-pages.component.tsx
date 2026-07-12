import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Mail, ShieldCheck, FileText, LifeBuoy } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { SiteContainer } from "@/shared/components/layout/site-container";
import { Reveal } from "@/shared/components/animation/reveal.component";
import { resolveLocale } from "@/shared/lib/helpers/locale.helper";
import { localeCookieName } from "@/shared/lib/preferences";
import type { Locale } from "@/shared/lib/types";

export type LegalPageKey = "privacy" | "support" | "terms";

type LegalSection = Readonly<{
  title: string;
  body: string;
}>;

type LegalPageCopy = Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  updated: string;
  icon: "privacy" | "support" | "terms";
  sections: LegalSection[];
  ctaTitle: string;
  ctaDescription: string;
  ctaLabel: string;
  ctaHref: string;
}>;

const legalCopy: Record<Locale, Record<LegalPageKey, LegalPageCopy>> = {
  en: {
    privacy: {
      eyebrow: "Privacy Policy",
      title: "How IASS protects your information",
      description: "This page explains what information we collect, why we use it, and how we protect your account, purchases, and learning activity.",
      updated: "Last updated: July 2026",
      icon: "privacy",
      sections: [
        {
          title: "Information we collect",
          body: "We collect the account details needed to operate the platform, such as your name, email address, login status, orders, purchased courses, purchased books, and basic learning access records.",
        },
        {
          title: "Payments and checkout",
          body: "Payments are handled through Stripe. IASS does not store full card numbers or sensitive card details. We keep order and payment status records so your purchased resources can be unlocked after checkout.",
        },
        {
          title: "Media, files, and access links",
          body: "Purchased book access may use protected links or temporary signed URLs. These links are used only to let eligible students access their purchased digital resources.",
        },
        {
          title: "Cookies and preferences",
          body: "We use cookies and local storage for essential preferences such as language, theme, and website session state. These help the website remember your choices and keep protected pages available after login.",
        },
        {
          title: "Security and retention",
          body: "We use reasonable technical safeguards to protect platform data. Account, order, and access records are retained as needed for platform operation, legal compliance, support, and purchase history.",
        },
      ],
      ctaTitle: "Need help with privacy?",
      ctaDescription: "Contact support if you have a question about your account, purchases, or access records.",
      ctaLabel: "Contact support",
      ctaHref: "/support",
    },
    support: {
      eyebrow: "Support Center",
      title: "We are here to help with your learning access",
      description: "Use this page when you need help with login, payment, courses, books, downloads, or account access.",
      updated: "Support guidance for IASS students",
      icon: "support",
      sections: [
        {
          title: "Payment or checkout issues",
          body: "If checkout fails, confirm that you are logged in, the item is still available, and your payment method is accepted by Stripe. If payment was completed but access did not appear, keep your order number ready for support.",
        },
        {
          title: "Purchased courses",
          body: "Purchased courses appear in your library after payment confirmation. If a course does not appear, refresh your session, sign in again, and check your order history.",
        },
        {
          title: "Purchased books and downloads",
          body: "Purchased books are available from your library. If a download does not start, try again from the same account used for purchase and avoid sharing protected download links.",
        },
        {
          title: "Account access",
          body: "If you cannot sign in, verify your email and password. For continued login issues, request support and include the email used on the platform.",
        },
        {
          title: "What to include in a support request",
          body: "Include your account email, order number if available, the course or book title, screenshots of the issue, and the device/browser you are using.",
        },
      ],
      ctaTitle: "Send a support request",
      ctaDescription: "Tell us what happened and include enough details so we can trace the issue quickly.",
      ctaLabel: "Email support",
      ctaHref: "mailto:support@iass.academy",
    },
    terms: {
      eyebrow: "Terms and Conditions",
      title: "Rules for using IASS courses, books, and services",
      description: "These terms explain the expected use of the platform, digital resources, purchases, and protected learning content.",
      updated: "Last updated: July 2026",
      icon: "terms",
      sections: [
        {
          title: "Educational purpose",
          body: "IASS provides educational content for professional learning. The platform content does not replace local licensing requirements, clinical judgment, or direct supervision where required.",
        },
        {
          title: "Account responsibility",
          body: "You are responsible for keeping your account credentials secure. Do not share your account, protected links, purchased book files, or course access with other people.",
        },
        {
          title: "Digital purchases",
          body: "Courses and books become available after successful payment confirmation. Access is tied to the purchasing account and may be restricted if misuse, fraud, or unauthorized sharing is detected.",
        },
        {
          title: "Content ownership",
          body: "Course videos, book files, articles, visuals, and platform materials remain the property of IASS or their respective rights holders. Copying, redistributing, reselling, or publicly sharing content is not allowed without written permission.",
        },
        {
          title: "Availability and updates",
          body: "We may update content, improve platform features, correct errors, or temporarily limit access for maintenance. We work to keep purchased learning resources accessible and reliable.",
        },
      ],
      ctaTitle: "Questions about these terms?",
      ctaDescription: "Contact support before purchasing or using content if anything is unclear.",
      ctaLabel: "Contact support",
      ctaHref: "/support",
    },
  },
  ar: {
    privacy: {
      eyebrow: "سياسة الخصوصية",
      title: "كيف تحمي IASS معلوماتك",
      description: "توضح هذه الصفحة ما هي البيانات التي نجمعها، ولماذا نستخدمها، وكيف نحمي حسابك ومشترياتك ونشاطك التعليمي.",
      updated: "آخر تحديث: تموز 2026",
      icon: "privacy",
      sections: [
        {
          title: "المعلومات التي نجمعها",
          body: "نجمع بيانات الحساب اللازمة لتشغيل المنصة، مثل الاسم، البريد الإلكتروني، حالة تسجيل الدخول، الطلبات، الكورسات المشتراة، الكتب المشتراة، وسجلات الوصول الأساسية.",
        },
        {
          title: "الدفع والطلبات",
          body: "تتم معالجة الدفع عبر Stripe. لا تقوم IASS بتخزين أرقام البطاقات الكاملة أو بيانات البطاقة الحساسة. نحتفظ بسجلات الطلب وحالة الدفع حتى يتم فتح المصادر المشتراة بعد إتمام الدفع.",
        },
        {
          title: "الملفات وروابط الوصول",
          body: "قد تستخدم الكتب المشتراة روابط محمية أو روابط مؤقتة موقعة. تُستخدم هذه الروابط فقط لمنح الطلاب المؤهلين وصولًا إلى مصادرهم الرقمية المشتراة.",
        },
        {
          title: "الكوكيز والتفضيلات",
          body: "نستخدم الكوكيز والتخزين المحلي لحفظ التفضيلات الأساسية مثل اللغة، المظهر، وحالة جلسة الموقع، حتى تعمل الصفحات المحمية بشكل صحيح بعد تسجيل الدخول.",
        },
        {
          title: "الأمان والاحتفاظ بالبيانات",
          body: "نستخدم إجراءات تقنية معقولة لحماية بيانات المنصة. يتم الاحتفاظ بسجلات الحساب والطلبات والوصول حسب الحاجة لتشغيل المنصة، الامتثال، الدعم، وسجل المشتريات.",
        },
      ],
      ctaTitle: "تحتاج مساعدة بخصوص الخصوصية؟",
      ctaDescription: "تواصل مع الدعم إذا كان لديك سؤال حول حسابك أو مشترياتك أو سجلات الوصول الخاصة بك.",
      ctaLabel: "تواصل مع الدعم",
      ctaHref: "/support",
    },
    support: {
      eyebrow: "مركز الدعم",
      title: "نحن هنا لمساعدتك في الوصول إلى محتواك التعليمي",
      description: "استخدم هذه الصفحة عند الحاجة للمساعدة في تسجيل الدخول، الدفع، الكورسات، الكتب، التحميل، أو الوصول إلى الحساب.",
      updated: "إرشادات دعم لطلاب IASS",
      icon: "support",
      sections: [
        {
          title: "مشاكل الدفع أو إتمام الطلب",
          body: "إذا فشل الدفع، تأكد من تسجيل الدخول، وأن العنصر ما زال متاحًا، وأن وسيلة الدفع مقبولة لدى Stripe. إذا تم الدفع ولم يظهر الوصول، احتفظ برقم الطلب عند التواصل مع الدعم.",
        },
        {
          title: "الكورسات المشتراة",
          body: "تظهر الكورسات المشتراة داخل مكتبتك بعد تأكيد الدفع. إذا لم يظهر الكورس، حدّث الجلسة، وسجل الدخول مرة أخرى، وافحص سجل الطلبات.",
        },
        {
          title: "الكتب المشتراة والتحميل",
          body: "تتوفر الكتب المشتراة من داخل مكتبتك. إذا لم يبدأ التحميل، جرّب مرة أخرى من نفس الحساب المستخدم في الشراء وتجنب مشاركة روابط التحميل المحمية.",
        },
        {
          title: "الوصول إلى الحساب",
          body: "إذا لم تتمكن من تسجيل الدخول، تحقق من البريد الإلكتروني وكلمة المرور. عند استمرار المشكلة، أرسل طلب دعم مع البريد المستخدم في المنصة.",
        },
        {
          title: "ماذا ترفق في طلب الدعم؟",
          body: "أرفق بريد الحساب، رقم الطلب إن وجد، اسم الكورس أو الكتاب، صورًا توضح المشكلة، ونوع الجهاز أو المتصفح المستخدم.",
        },
      ],
      ctaTitle: "أرسل طلب دعم",
      ctaDescription: "اشرح ما حدث وأرفق التفاصيل اللازمة حتى نستطيع تتبع المشكلة بسرعة.",
      ctaLabel: "راسل الدعم",
      ctaHref: "mailto:support@iass.academy",
    },
    terms: {
      eyebrow: "الشروط والأحكام",
      title: "قواعد استخدام كورسات وكتب وخدمات IASS",
      description: "توضح هذه الشروط طريقة استخدام المنصة، المصادر الرقمية، المشتريات، والمحتوى التعليمي المحمي.",
      updated: "آخر تحديث: تموز 2026",
      icon: "terms",
      sections: [
        {
          title: "الغرض التعليمي",
          body: "توفر IASS محتوى تعليميًا للتطوير المهني. لا يغني محتوى المنصة عن متطلبات الترخيص المحلية، الحكم السريري، أو الإشراف المباشر عندما يكون مطلوبًا.",
        },
        {
          title: "مسؤولية الحساب",
          body: "أنت مسؤول عن الحفاظ على بيانات حسابك. لا تشارك حسابك، الروابط المحمية، ملفات الكتب المشتراة، أو وصول الكورسات مع أي شخص آخر.",
        },
        {
          title: "المشتريات الرقمية",
          body: "تتوفر الكورسات والكتب بعد تأكيد الدفع بنجاح. يرتبط الوصول بالحساب الذي أتم الشراء وقد يتم تقييده عند وجود إساءة استخدام أو مشاركة غير مصرح بها.",
        },
        {
          title: "ملكية المحتوى",
          body: "تبقى فيديوهات الكورسات، ملفات الكتب، المقالات، الصور، ومواد المنصة ملكًا لـ IASS أو لأصحاب الحقوق. لا يسمح بالنسخ أو إعادة التوزيع أو البيع أو المشاركة العامة دون إذن مكتوب.",
        },
        {
          title: "التوفر والتحديثات",
          body: "قد نقوم بتحديث المحتوى، تحسين ميزات المنصة، تصحيح الأخطاء، أو تقييد الوصول مؤقتًا لأعمال الصيانة. نعمل على إبقاء المصادر المشتراة متاحة وموثوقة.",
        },
      ],
      ctaTitle: "لديك سؤال حول هذه الشروط؟",
      ctaDescription: "تواصل مع الدعم قبل الشراء أو استخدام المحتوى إذا كان هناك أي بند غير واضح.",
      ctaLabel: "تواصل مع الدعم",
      ctaHref: "/support",
    },
  },
};

const icons = {
  privacy: ShieldCheck,
  support: LifeBuoy,
  terms: FileText,
};

async function currentLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return resolveLocale(cookieStore.get(localeCookieName)?.value);
}

export async function generateLegalMetadata(page: LegalPageKey): Promise<Metadata> {
  const locale = await currentLocale();
  const copy = legalCopy[locale][page];

  return {
    title: { absolute: `${copy.title} | IASS` },
    description: copy.description,
    alternates: { canonical: `/${page}` },
    openGraph: {
      title: copy.title,
      description: copy.description,
      type: "website",
      url: `/${page}`,
    },
    twitter: {
      card: "summary",
      title: copy.title,
      description: copy.description,
    },
  };
}

export async function LegalPage({ page }: Readonly<{ page: LegalPageKey }>) {
  const locale = await currentLocale();
  const copy = legalCopy[locale][page];
  const Icon = icons[copy.icon];

  return (
    <div className="min-h-full bg-section-bg">
      <section className="border-b border-border/60 bg-[radial-gradient(circle_at_top,rgba(29,23,213,0.1),transparent_34%),linear-gradient(180deg,var(--color-section-bg),var(--color-background))]">
        <SiteContainer className="py-10 sm:py-12 lg:py-14">
          <Reveal preset="fadeUp" className="mx-auto max-w-3xl text-center">
            <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/15 bg-primary/8 text-primary shadow-[0_12px_30px_rgba(29,23,213,0.08)]">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <p className="mt-5 text-[0.72rem] font-black uppercase tracking-[0.16em] text-primary">{copy.eyebrow}</p>
            <h1 className="mt-3 text-3xl font-black tracking-[-0.035em] text-foreground sm:text-4xl lg:text-5xl">{copy.title}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-foreground/68 sm:text-base sm:leading-8">{copy.description}</p>
            <p className="mt-4 text-xs font-bold text-foreground/45">{copy.updated}</p>
          </Reveal>
        </SiteContainer>
      </section>

      <SiteContainer as="section" className="py-9 sm:py-11 lg:py-14">
        <div className="mx-auto grid max-w-4xl gap-4">
          {copy.sections.map((section, index) => (
            <Reveal key={section.title} preset="fadeUp" delay={index * 0.04}>
              <article className="rounded-[20px] border border-border/70 bg-surface p-5 shadow-[0_10px_30px_rgba(15,23,42,0.045)] sm:p-6">
                <h2 className="text-lg font-black text-foreground sm:text-xl">{section.title}</h2>
                <p className="mt-3 text-sm leading-7 text-foreground/66 sm:text-[0.95rem] sm:leading-8">{section.body}</p>
              </article>
            </Reveal>
          ))}

          <Reveal preset="scaleIn" className="mt-4 rounded-[22px] border border-primary/15 bg-primary/7 p-6 text-center shadow-[0_14px_34px_rgba(29,23,213,0.08)] sm:p-8">
            <span className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white">
              <Mail className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-xl font-black text-foreground">{copy.ctaTitle}</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-foreground/64">{copy.ctaDescription}</p>
            <Button href={copy.ctaHref} className="mt-5 rounded-full">
              {copy.ctaLabel}
            </Button>
          </Reveal>
        </div>
      </SiteContainer>
    </div>
  );
}
