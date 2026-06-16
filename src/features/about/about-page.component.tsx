"use client";

import Image from "next/image";
import { Award, BookOpen, ClipboardCheck, GraduationCap, HeartPulse, Microscope, Ruler, Sparkles, Stethoscope } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import type { Locale } from "@/shared/lib/types";

type IconKey = "science" | "skills" | "protocol" | "book" | "ruler";

type CardItem = Readonly<{
  title: string;
  description: string;
  icon: IconKey;
}>;

type TextBlock = Readonly<{
  title: string;
  body: string;
}>;

type AboutContent = Readonly<{
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  imageAlt: string;
  stats: ReadonlyArray<Readonly<{ value: string; label: string }>>;
  founder: Readonly<{ label: string; title: string; paragraphs: string[] }>;
  academy: Readonly<{ label: string; title: string; paragraphs: string[] }>;
  pillarsTitle: string;
  pillarsSubtitle: string;
  pillars: CardItem[];
  innovationsTitle: string;
  innovations: CardItem[];
  whyTitle: string;
  why: TextBlock[];
  closingTitle: string;
  closingBody: string;
}>;

const contentByLocale: Record<Locale, AboutContent> = {
  ar: {
    eyebrow: "عن IASS",
    title: "الأكاديمية الدولية لعلوم ومهارات التجميل",
    subtitle: "منصة تعليمية رقمية تعيد صياغة التدريب على الطب التجميلي عبر العلم التشريحي، البروتوكولات الدقيقة، والمهارات العملية الآمنة تحت إشراف الدكتور إياس عكاري.",
    primaryCta: "تصفح الدورات",
    secondaryCta: "استكشف الكتب",
    imageAlt: "الدكتور إياس عكاري مؤسس أكاديمية IASS",
    stats: [
      { value: "IASS", label: "أكاديمية علم ومهارة" },
      { value: "3", label: "محاور تدريبية" },
      { value: "100%", label: "تركيز على الأمان" },
    ],
    founder: {
      label: "الدكتور إياس عكاري",
      title: "مرجع أكاديمي ومطور بروتوكولات في الطب التجميلي",
      paragraphs: [
        "في قطاع سريع التطور مثل الطب التجميلي، لا تقاس كفاءة الطبيب بعدد سنوات ممارسته فحسب، بل بقدرته على صياغة المعايير العلمية وتدريب الآخرين عليها. من هنا يبرز اسم الدكتور إياس عكاري كمرجع أكاديمي ومحرك لنقل المعرفة وتطوير كفاءة الأطباء والمختصين.",
        "الدكتور إياس ليس مجرد طبيب يمارس مهنته داخل عيادته Guarantee Clinic، بل قامة علمية اختارت أن تخرج بالطب التجميلي من إطار الممارسات التجارية العشوائية ليعود إلى أصله كعلم وفن تشريحي رفيع يخضع لأعلى معايير الدقة والأمان.",
        "بصفته مدربًا معتمدًا دوليًا في الطب التجميلي، أصبحت ساحات تدريبه وجهة للأطباء والممارسين الراغبين في فهم التشريح الدقيق للوجه وإتقان تقنيات الحقن الآمن.",
      ],
    },
    academy: {
      label: "رؤية الأكاديمية",
      title: "عهد جديد في التدريب على الطب التجميلي الاحترافي",
      paragraphs: [
        "ولدت الأكاديمية الدولية لعلوم ومهارات التجميل IASS لتكون منصة تعليمية رقمية رائدة تهدف إلى إعادة صياغة معايير التدريب الطبي للمختصين ونقل الخبرات الأكاديمية مباشرة إلى الأطباء في كل مكان.",
        "رؤية الأكاديمية تقوم على تحويل التعليم التجميلي من مجرد تلقين لإجراءات عابرة إلى علم راسخ يعتمد على المهارة الفائقة، الدقة التشريحية، والأمان الطبي المطلق.",
      ],
    },
    pillarsTitle: "ماذا تقدم IASS للمجتمع الطبي؟",
    pillarsSubtitle: "تم تصميم المنصة لتغطية الفجوة بين الدراسة النظرية والممارسة الميدانية الحقيقية داخل العيادات.",
    pillars: [
      { title: "العلوم التجميلية", description: "فهم تشريحي متعمق لفحص الجلد والبشرة والتاريخ الطبي لكل حالة قبل بناء التشخيص والخطة العلاجية.", icon: "science" },
      { title: "المهارات العملية", description: "تدريب على تقنيات الحقن والتعامل الآمن مع الإجراءات مع نقل أسرار تلافي الأخطاء والمضاعفات.", icon: "skills" },
      { title: "البروتوكولات العلاجية", description: "خطوات علاجية موثقة تساعد الطبيب على تحويل الممارسة إلى نظام واضح وقابل للتكرار بثقة.", icon: "protocol" },
    ],
    innovationsTitle: "ابتكارات ومؤلفات صاغت معايير المهنة",
    innovations: [
      { title: "مسطرة البوتوكس الهندسية", description: "أداة قياسية تساعد على ضبط وتوزيع الوحدات بدقة تناسب أبعاد كل وجه وتدعم نتائج طبيعية ومتوازنة.", icon: "ruler" },
      { title: "كتاب البروتوكولات العلاجية", description: "مؤلف طبي مرجعي يوثق فلسفة أن الجمال علم يدرس وله قواعد صارمة لا تخضع للعشوائية.", icon: "book" },
    ],
    whyTitle: "لماذا تتعلم من الدكتور إياس عكاري؟",
    why: [
      { title: "التحليل والتشخيص الأكاديمي", body: "دراسة نوعية الجلد، البشرة، والتاريخ الطبي لكل حالة كمسار منفرد لا كقالب جاهز." },
      { title: "الأمان الطبي المطلق", body: "تعلّم أسرار تجنب الأخطاء والمضاعفات من مدرب ينقل خبرته العملية للأطباء." },
      { title: "نتائج مضمونة وموثقة", body: "تحويل الممارسة الطبية إلى خطوات مدروسة تمنح الطبيب الثقة أمام مرضاه." },
    ],
    closingTitle: "بوابتكم نحو التميز المهني العالمي",
    closingBody: "من خلال هذه المنصة، يضع الدكتور إياس عكاري خلاصة خبرته الأكاديمية والعملية بين يدي جيل الأطباء الجديد؛ لتكون IASS بيئة تعلم متكاملة تبني عقلية طبيب تجميل محترف يمتلك الثقة والمعرفة الهندسية التي تميزه في سوق العمل.",
  },
  en: {
    eyebrow: "About IASS",
    title: "International Academy of Aesthetic Science and Skills",
    subtitle: "A digital academy reshaping aesthetic medicine training through anatomical science, precise protocols, and safe practical skills under the guidance of Dr. Iyas Akkari.",
    primaryCta: "Browse courses",
    secondaryCta: "Explore books",
    imageAlt: "Dr. Iyas Akkari, founder of IASS Academy",
    stats: [
      { value: "IASS", label: "Science and skills academy" },
      { value: "3", label: "Training pillars" },
      { value: "100%", label: "Safety focused" },
    ],
    founder: {
      label: "Dr. Iyas Akkari",
      title: "An academic reference and protocol developer in aesthetic medicine",
      paragraphs: [
        "In a fast-moving field like aesthetic medicine, a doctor's value is measured not only by years of practice, but by the ability to set scientific standards and train others to apply them. Dr. Iyas Akkari stands out as an academic reference and a driver of professional knowledge transfer.",
        "Dr. Iyas is not only a physician practicing inside Guarantee Clinic; he is a scientific leader working to move aesthetic medicine away from random commercial practice and back to its foundation as a precise anatomical science and art.",
        "As an internationally certified trainer in aesthetic medicine, his training programs attract doctors and practitioners who want to master facial anatomy and safe injection techniques.",
      ],
    },
    academy: {
      label: "Academy vision",
      title: "A new era in professional aesthetic medicine training",
      paragraphs: [
        "The International Academy of Aesthetic Science and Skills was created as a leading digital learning platform that redefines medical training standards and transfers academic expertise directly to doctors everywhere.",
        "The academy's philosophy is to shift aesthetic education from trend-based technique memorization to a real science built on exceptional skill, anatomical precision, and uncompromising medical safety.",
      ],
    },
    pillarsTitle: "What IASS offers the medical community",
    pillarsSubtitle: "The platform bridges the gap between theory and real clinical practice inside the clinic.",
    pillars: [
      { title: "Aesthetic science", description: "Deep anatomical understanding for skin, facial structure, and patient history before diagnosis and treatment planning.", icon: "science" },
      { title: "Practical skills", description: "Training in precise injection techniques and safe procedures, with a focus on preventing errors and complications.", icon: "skills" },
      { title: "Treatment protocols", description: "Documented steps that turn clinical practice into a clear, repeatable system doctors can apply with confidence.", icon: "protocol" },
    ],
    innovationsTitle: "Innovations and publications that shaped standards",
    innovations: [
      { title: "The engineering Botox ruler", description: "A measurement tool that helps control unit distribution according to each face's dimensions for natural balanced results.", icon: "ruler" },
      { title: "Aesthetic Treatment Protocols book", description: "A medical reference documenting the philosophy that beauty is a science with clear rules, not random practice.", icon: "book" },
    ],
    whyTitle: "Why learn from Dr. Iyas Akkari?",
    why: [
      { title: "Academic analysis and diagnosis", body: "Study skin type, facial structure, and medical history as an individual case, not a generic template." },
      { title: "Absolute medical safety", body: "Learn how to avoid mistakes and complications from a trainer who teaches doctors practical safety standards." },
      { title: "Reliable documented outcomes", body: "Turn clinical work into structured steps that give doctors confidence in front of their patients." },
    ],
    closingTitle: "Your gateway to global professional excellence",
    closingBody: "Through IASS, Dr. Iyas Akkari places his academic and practical expertise in the hands of the next generation of doctors, building a complete learning environment for professional aesthetic practice.",
  },
};

const iconByKey = {
  science: Microscope,
  skills: Stethoscope,
  protocol: ClipboardCheck,
  book: BookOpen,
  ruler: Ruler,
} as const;

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
};

type AboutPageProps = Readonly<{ locale: Locale }>;

type AnimatedSectionProps = Readonly<{
  children: React.ReactNode;
  className?: string;
  id?: string;
}>;

function AnimatedSection({ children, className = "", id }: AnimatedSectionProps) {
  const shouldReduceMotion = Boolean(useReducedMotion());

  return (
    <motion.section
      id={id}
      className={className}
      variants={containerVariants}
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.22 }}
    >
      {children}
    </motion.section>
  );
}

function IconCard({ item }: Readonly<{ item: CardItem }>) {
  const Icon = iconByKey[item.icon];

  return (
    <motion.article variants={itemVariants} className="group relative overflow-hidden rounded-[1.55rem] border border-border/70 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.055)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(29,23,213,0.10)] dark:border-white/10 dark:bg-white/6 dark:shadow-none">
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/8 blur-3xl transition duration-500 group-hover:scale-125 dark:bg-primary/18" />
      <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-primary/18">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="relative mt-5 text-lg font-extrabold tracking-tight text-slate-950 dark:text-white">{item.title}</h3>
      <p className="relative mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.description}</p>
    </motion.article>
  );
}

export function AboutPage({ locale }: AboutPageProps) {
  const content = contentByLocale[locale];
  const shouldReduceMotion = Boolean(useReducedMotion());

  return (
    <div className="overflow-hidden bg-section-bg">
      <section className="relative overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-[-8rem] top-12 h-72 w-72 rounded-full bg-primary/10 blur-3xl motion-safe:animate-[clinical-drift_9s_ease-in-out_infinite] dark:bg-primary/16" />
          <div className="absolute bottom-0 right-[-10rem] h-80 w-80 rounded-full bg-teal-300/20 blur-3xl motion-safe:animate-[clinical-drift_10s_ease-in-out_infinite_reverse] dark:bg-teal-400/10" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.72fr)] lg:gap-14">
          <motion.div variants={containerVariants} initial={shouldReduceMotion ? false : "hidden"} animate={shouldReduceMotion ? undefined : "visible"}>
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/74 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-primary shadow-[0_12px_28px_rgba(15,23,42,0.05)] backdrop-blur-xl dark:border-white/10 dark:bg-white/8">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {content.eyebrow}
            </motion.div>
            <motion.h1 variants={itemVariants} className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-tight text-slate-950 dark:text-white sm:text-3xl lg:text-[3.5rem] lg:leading-[1.06]">
              {content.title}
            </motion.h1>
            <motion.p variants={itemVariants} className="mt-6 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg sm:leading-9">
              {content.subtitle}
            </motion.p>
            <motion.div variants={itemVariants} className="mt-8 flex flex-wrap gap-3">
              <Button href="/courses" className="rounded-2xl px-6 shadow-[0_16px_34px_rgba(29,23,213,0.18)] hover:-translate-y-0.5">
                {content.primaryCta}
              </Button>
              <Button href="/books" variant="secondary" className="rounded-2xl px-6 hover:-translate-y-0.5">
                {content.secondaryCta}
              </Button>
            </motion.div>
            <motion.div variants={itemVariants} className="mt-9 grid max-w-3xl gap-3 sm:grid-cols-3">
              {content.stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/70 bg-white/72 p-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)] backdrop-blur-xl dark:border-white/10 dark:bg-white/6">
                  <p className="text-2xl font-black text-primary">{stat.value}</p>
                  <p className="mt-1 text-xs font-bold text-slate-600 dark:text-slate-300">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div className="relative mx-auto w-full max-w-md lg:max-w-none" initial={shouldReduceMotion ? false : { opacity: 0, x: locale === "ar" ? -24 : 24, scale: 0.98 }} animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1], delay: 0.16 }}>
            <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/44 p-2 shadow-[0_24px_70px_rgba(15,23,42,0.14)] backdrop-blur-xl dark:border-white/10 dark:bg-white/6">
              <div className="relative aspect-[0.86] overflow-hidden rounded-[1.55rem] bg-transparent">
                <Image src="/images/hero.jpg" alt={content.imageAlt} fill priority sizes="(max-width: 1024px) 88vw, 34vw" className="object-contain object-bottom drop-shadow-[0_22px_32px_rgba(15,23,42,0.20)]" />
              </div>
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/70 bg-white/92 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.14)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/82">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-primary/18">
                    <HeartPulse className="h-5 w-5 motion-safe:animate-[clinical-float_4s_ease-in-out_infinite]" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-black text-slate-950 dark:text-white">{content.founder.label}</p>
                    <p className="mt-0.5 text-xs font-semibold text-slate-500 dark:text-slate-300">IASS · Aesthetic Science</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <AnimatedSection id="academy" className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <motion.div variants={itemVariants} className="rounded-[1.7rem] border border-border/70 bg-white p-6 shadow-[0_16px_42px_rgba(15,23,42,0.055)] dark:border-white/10 dark:bg-white/6 dark:shadow-none sm:p-8">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-primary">{content.academy.label}</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">{content.academy.title}</h2>
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-5 text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg sm:leading-9">
            {content.academy.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </motion.div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="founder" className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-border/70 bg-white p-6 shadow-[0_18px_52px_rgba(15,23,42,0.065)] dark:border-white/10 dark:bg-white/6 dark:shadow-none sm:p-8 lg:p-10">
          <motion.div variants={itemVariants} className="max-w-4xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-primary">{content.founder.label}</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">{content.founder.title}</h2>
          </motion.div>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {content.founder.paragraphs.map((paragraph) => (
              <motion.p key={paragraph} variants={itemVariants} className="rounded-3xl border border-border/60 bg-section-bg p-5 text-sm leading-7 text-slate-600 dark:border-white/10 dark:bg-white/6 dark:text-slate-300 sm:text-base sm:leading-8">
                {paragraph}
              </motion.p>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <motion.div variants={itemVariants} className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-primary/18"><GraduationCap className="h-6 w-6" aria-hidden="true" /></div>
            <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">{content.pillarsTitle}</h2>
            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">{content.pillarsSubtitle}</p>
          </motion.div>
          <div className="mt-9 grid gap-4 md:grid-cols-3">{content.pillars.map((item) => <IconCard key={item.title} item={item} />)}</div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <motion.h2 variants={itemVariants} className="text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">{content.innovationsTitle}</motion.h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">{content.innovations.map((item) => <IconCard key={item.title} item={item} />)}</div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-primary p-6 text-white shadow-[0_24px_70px_rgba(29,23,213,0.22)] sm:p-8 lg:p-10">
          <motion.h2 variants={itemVariants} className="text-3xl font-black tracking-tight sm:text-4xl">{content.whyTitle}</motion.h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {content.why.map((item, index) => (
              <motion.div key={item.title} variants={itemVariants} className="rounded-3xl border border-white/16 bg-white/10 p-5 backdrop-blur-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/16 text-white"><span className="text-sm font-black">{index + 1}</span></div>
                <h3 className="mt-5 text-lg font-black">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/78">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <section className="px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-primary/18"><Award className="h-7 w-7" aria-hidden="true" /></div>
          <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">{content.closingTitle}</h2>
          <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg sm:leading-9">{content.closingBody}</p>
          <div className="mt-8 flex justify-center gap-3">
            <Button href="/courses" className="rounded-2xl px-6">{content.primaryCta}</Button>
            <Button href="/articles" variant="secondary" className="rounded-2xl px-6">{locale === "ar" ? "اقرأ المقالات" : "Read articles"}</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
