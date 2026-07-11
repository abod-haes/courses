"use client";

import { useEffect, useState } from "react";
import { Activity, BookOpen, GraduationCap, Stethoscope } from "lucide-react";
import { usePreferences } from "@/components/preferences-provider";
import { LoadingMotionStyles } from "./loading-motion-styles.component";

const englishMessages = [
  "Preparing your medical learning experience...",
  "Loading trusted courses and books...",
  "Organizing your study resources...",
  "Building your learning path...",
  "Almost ready...",
] as const;

const arabicMessages = [
  "جاري تجهيز تجربة التعلم الطبية...",
  "جاري تحميل الكورسات والكتب...",
  "جاري تنظيم مواردك التعليمية...",
  "جاري بناء مسار التعلم...",
  "اقتربنا من الانتهاء...",
] as const;

type MedicalPageLoaderProps = Readonly<{
  messages?: readonly string[];
  label?: string;
}>;

const floatingItems = [
  { icon: BookOpen, className: "left-[14%] top-[20%] delay-0" },
  { icon: Stethoscope, className: "right-[15%] top-[24%] delay-300" },
  { icon: GraduationCap, className: "bottom-[23%] left-[18%] delay-700" },
  { icon: Activity, className: "bottom-[19%] right-[17%] delay-1000" },
] as const;

export function MedicalPageLoader({ messages, label = "IASS" }: MedicalPageLoaderProps) {
  const { locale } = usePreferences();
  const fallbackMessages = locale === "ar" ? arabicMessages : englishMessages;
  const displayMessages = messages ?? fallbackMessages;
  const [messageIndex, setMessageIndex] = useState(0);
  const safeMessageIndex = displayMessages.length > 0 ? messageIndex % displayMessages.length : 0;
  const currentMessage = displayMessages[safeMessageIndex] ?? "";

  useEffect(() => {
    if (displayMessages.length <= 1) return;

    const interval = window.setInterval(() => {
      setMessageIndex((currentIndex) => (currentIndex + 1) % displayMessages.length);
    }, 1600);

    return () => window.clearInterval(interval);
  }, [displayMessages.length]);

  return (
    <section
      className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden bg-section-bg px-4 py-16 text-center"
      role="status"
      aria-live="polite"
      aria-label={currentMessage}
    >
      <LoadingMotionStyles />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-medical-blob absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="animate-medical-blob-reverse absolute -right-24 top-28 h-80 w-80 rounded-full bg-success/10 blur-3xl" />
        <div className="animate-medical-blob absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-medical-blue blur-3xl" />
      </div>

      {floatingItems.map(({ icon: Icon, className }, index) => (
        <div
          key={index}
          className={`animate-medical-float pointer-events-none absolute hidden rounded-3xl border border-border/70 bg-surface/85 p-3 text-primary shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur md:block ${className}`}
        >
          <Icon aria-hidden className="h-6 w-6" />
        </div>
      ))}

      <div className="animate-loader-enter relative z-10 w-full max-w-xl rounded-[2rem] border border-border/70 bg-surface/90 px-6 py-9 shadow-[0_24px_90px_rgba(15,23,42,0.10)] backdrop-blur sm:px-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-[0_16px_40px_rgba(29,23,213,0.26)]">
          <Activity aria-hidden className="h-8 w-8 animate-loader-heartbeat" />
        </div>

        <div className="mt-5 space-y-2">
          <p className="text-label-caps uppercase tracking-[0.28em] text-primary">{locale === "ar" ? "جاري التحميل" : "Clinical Loading"}</p>
          <h1 className=" text-3xl font-bold tracking-[-0.03em] text-on-surface sm:text-4xl">{label}</h1>
        </div>

        <div className="mx-auto mt-7 w-full max-w-sm overflow-hidden rounded-full bg-primary-soft p-2">
          <svg viewBox="0 0 360 72" className="h-12 w-full text-primary" role="img" aria-label={locale === "ar" ? "خط تقدم متحرك" : "Animated ECG progress line"}>
            <path className="medical-ecg-path" d="M0 36 H72 L86 36 L96 18 L112 58 L126 36 H174 L188 36 L198 24 L214 48 L228 36 H360" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
            <path d="M0 36 H72 L86 36 L96 18 L112 58 L126 36 H174 L188 36 L198 24 L214 48 L228 36 H360" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.14" strokeWidth="5" />
          </svg>
        </div>

        <p key={safeMessageIndex} className="animate-loader-message mt-6 min-h-6 text-body-reading font-medium text-on-surface">
          {currentMessage}
        </p>

        <div className="mt-5 flex items-center justify-center gap-2" aria-hidden="true">
          <span className="animate-loader-dot h-2.5 w-2.5 rounded-full bg-primary" />
          <span className="animate-loader-dot h-2.5 w-2.5 rounded-full bg-primary [animation-delay:180ms]" />
          <span className="animate-loader-dot h-2.5 w-2.5 rounded-full bg-primary [animation-delay:360ms]" />
        </div>
      </div>
    </section>
  );
}
